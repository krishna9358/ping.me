import { API_BASE } from "./config";
import { getToken } from "./auth";
import type { ApiWebsite } from "./mapWebsite";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `${res.status} ${res.statusText}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  const raw = await res.text();
  if (!raw) {
    return undefined as T;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(`Invalid JSON response: ${raw.slice(0, 120)}`);
  }
}

export async function signIn(body: { username: string; password: string }) {
  return request<{ jwt: string; id: string; message?: string }>(
    "/user/signin",
    { method: "POST", body: JSON.stringify(body) },
  );
}

export async function signUp(body: { username: string; password: string }) {
  return request<{ id: string; message?: string }>("/user/signup", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function listWebsites() {
  return request<{ websites: ApiWebsite[] }>("/websites");
}

export async function createWebsite(url: string) {
  return request<{ id: string }>("/websites/website", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}

export async function getWebsiteWithTicks(websiteId: string) {
  return request<{ website: ApiWebsite }>(`/websites/status/${websiteId}`);
}

export async function deleteWebsite(websiteId: string) {
  await request(`/websites/website/${websiteId}`, { method: "DELETE" });
}
