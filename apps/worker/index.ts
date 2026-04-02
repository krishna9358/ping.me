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
): Promise<TickResult> {
  const startTime = Date.now();
  try {
    await axios.get(url, { timeout: 10000 });
    return {
      response_time_ms: Date.now() - startTime,
      websiteId,
      regionId: REGION_ID!,
      status: "Up",
    };
  } catch {
    return {
      response_time_ms: Date.now() - startTime,
      websiteId,
      regionId: REGION_ID!,
      status: "Down",
    };
  }
}

async function main() {
  await ensureConsumerGroup(REGION_ID!);
  console.log(`Worker ${WORKER_ID} joined group ${REGION_ID}`);

  while (true) {
    const response = await xReadGroup(REGION_ID!, WORKER_ID!);
    if (!response || response.length === 0) {
      continue;
    }

    const messages = response[0].messages;
    if (!messages || messages.length === 0) {
      continue;
    }

    // Check all websites in parallel
    const results = await Promise.all(
      messages.map(({ message }: any) => checkWebsite(message.url, message.id)),
    );

    // Bulk insert all ticks in a single DB call
    await prismaClient.websiteTick.createMany({ data: results });
    console.log(`Processed ${results.length} ticks`);

    // Acknowledge all events
    await xAckBulk(
      REGION_ID!,
      messages.map(({ id }: any) => id),
    );
  }
}

main();
