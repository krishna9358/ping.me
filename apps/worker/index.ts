import axios from "axios";
import { xReadGroup, xAckBulk, ensureConsumerGroup } from "redis-custom-client/client";
import prismaClient from "store/client";

const REGION_ID = process.env.REGION_ID;
const WORKER_ID = process.env.WORKER_ID;

if (!REGION_ID || !WORKER_ID) {
  throw new Error(
    "REGION_ID and WORKER_ID must be set in environment variables",
  );
}

interface TickResult {
  response_time_ms: number;
  websiteId: string;
  regionId: string;
  status: "Up" | "Down";
}

async function checkWebsite(
  url: string,
  websiteId: string,
  regionId: string,
): Promise<TickResult> {
  const startTime = Date.now();
  try {
    await axios.get(url, { timeout: 10000 });
    return {
      response_time_ms: Date.now() - startTime,
      websiteId,
      regionId,
      status: "Up",
    };
  } catch {
    return {
      response_time_ms: Date.now() - startTime,
      websiteId,
      regionId,
      status: "Down",
    };
  }
}

type StreamRow = {
  id: string;
  message: { url: string; id: string; regionId: string };
};

async function main() {
  await ensureConsumerGroup(REGION_ID!);
  console.log(`Worker ${WORKER_ID} joined group ${REGION_ID}`);

  while (true) {
    const response = await xReadGroup(REGION_ID!, WORKER_ID!);
    const messages = response?.[0]?.messages as StreamRow[] | undefined;
    if (!messages?.length) {
      continue;
    }

    const websiteIds = [...new Set(messages.map((m) => m.message.id))];
    const existingRows = await prismaClient.website.findMany({
      where: { id: { in: websiteIds } },
      select: { id: true },
    });
    const existing = new Set(existingRows.map((w) => w.id));

    const valid = messages.filter((m) => existing.has(m.message.id));
    const staleCount = messages.length - valid.length;
    if (staleCount > 0) {
      console.warn(
        `Skipping ${staleCount} stream job(s) for deleted or unknown website id(s) (still acking)`,
      );
    }

    const tickRows =
      valid.length > 0
        ? await Promise.all(
            valid.map(({ message }) =>
              checkWebsite(message.url, message.id, message.regionId),
            ),
          )
        : [];

    if (tickRows.length > 0) {
      await prismaClient.websiteTick.createMany({ data: tickRows });
      console.log(`Processed ${tickRows.length} tick(s)`);
    }

    // Always ack every message we read so stale jobs (e.g. after website delete) do not block the pipeline.
    await xAckBulk(
      REGION_ID!,
      messages.map((m) => m.id),
    );
  }
}

main();
