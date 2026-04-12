import type { Website } from "../types";

export type ApiWebsite = {
  id: string;
  url: string;
  timeAdded: string;
  ticks: {
    status: "Up" | "Down" | "Unknown";
    response_time_ms: number;
    createdAt: string;
  }[];
};

function hostnameFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function mapApiWebsiteToWebsite(
  w: ApiWebsite,
  displayName?: string,
): Website {
  const ticks = w.ticks ?? [];
  const latest = ticks[0];
  const upCount = ticks.filter((t) => t.status === "Up").length;
  const uptime = ticks.length
    ? Math.round((upCount / ticks.length) * 1000) / 10
    : 100;

  let status: Website["status"] =
    ticks.length === 0 ? "pending" : "maintenance";
  if (latest?.status === "Up") status = "up";
  else if (latest?.status === "Down") status = "down";
  else if (latest?.status === "Unknown") status = "maintenance";

  return {
    id: w.id,
    name: displayName ?? hostnameFromUrl(w.url),
    url: w.url,
    status,
    lastCheck: latest ? new Date(latest.createdAt) : new Date(w.timeAdded),
    uptime,
    responseTime: latest?.response_time_ms ?? 0,
    createdAt: new Date(w.timeAdded),
  };
}
