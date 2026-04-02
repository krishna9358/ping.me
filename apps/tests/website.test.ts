import { describe, it, expect, beforeAll } from "bun:test";
import axios from "axios";
import { createUser } from "./CreateRandomUser";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000/api/v1";

const user1 = await createUser();
const user2 = await createUser();

describe("Website creation", () => {
  let token: string;

  beforeAll(() => {
    token = user1.jwt;
  });

  it("rejects creation when url is missing", async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/websites/website`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      expect(false).toBe(true);
    } catch (e: any) {
      expect(e.response.status).toBe(411);
    }
  });

  it("rejects creation when auth header is missing", async () => {
    try {
      await axios.post(`${BACKEND_URL}/websites/website`, {
        url: "https://google.com",
      });
      expect(false).toBe(true);
    } catch (e: any) {
      expect(e.response.status).toBe(401);
    }
  });

  it("creates a website when url is present", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/websites/website`,
      {
        url: "https://google.com",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    expect(response.status).toBe(200);
    expect(response.data.id).toBeDefined();
  });
});

describe("Website fetching", () => {
  let token1: string;
  let token2: string;
  let websiteId: string;

  beforeAll(async () => {
    token1 = user1.jwt;
    token2 = user2.jwt;

    const res = await axios.post(
      `${BACKEND_URL}/websites/website`,
      {
        url: "https://example.com",
      },
      {
        headers: { Authorization: `Bearer ${token1}` },
      },
    );
    websiteId = res.data.id;
  });

  it("fetches a website the user owns", async () => {
    const res = await axios.get(`${BACKEND_URL}/websites/status/${websiteId}`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    expect(res.status).toBe(200);
    expect(res.data.website).toBeDefined();
    expect(res.data.website.id).toBe(websiteId);
  });

  it("returns 404 when another user tries to access the website", async () => {
    try {
      await axios.get(`${BACKEND_URL}/websites/status/${websiteId}`, {
        headers: { Authorization: `Bearer ${token2}` },
      });
      expect(false).toBe(true);
    } catch (e: any) {
      expect(e.response.status).toBe(404);
    }
  });

  it("lists only websites belonging to the authenticated user", async () => {
    const res = await axios.get(`${BACKEND_URL}/websites`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    expect(res.status).toBe(200);
    expect(res.data.websites).toBeInstanceOf(Array);
    expect(res.data.websites.length).toBeGreaterThan(0);
    for (const w of res.data.websites) {
      expect(w.userId).toBe(user1.id);
    }
  });
});

describe("Website deletion", () => {
  let token: string;
  let websiteId: string;

  beforeAll(async () => {
    token = user1.jwt;
    const res = await axios.post(
      `${BACKEND_URL}/websites/website`,
      {
        url: "https://delete-me.com",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    websiteId = res.data.id;
  });

  it("deletes a website the user owns", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/websites/website/${websiteId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    expect(res.status).toBe(204);
  });

  it("returns 404 when deleting a non-existent website", async () => {
    try {
      await axios.delete(`${BACKEND_URL}/websites/website/${websiteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(false).toBe(true);
    } catch (e: any) {
      expect(e.response.status).toBe(404);
    }
  });
});
