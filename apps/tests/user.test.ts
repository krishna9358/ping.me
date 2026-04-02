import axios from "axios";
import { describe, expect, it } from "bun:test";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000/api/v1";
const USER_NAME = Math.random().toString();

describe("Signup endpoints", () => {
  it("rejects signup when body has wrong fields", async () => {
    try {
      await axios.post(`${BACKEND_URL}/user/signup`, {
        email: USER_NAME,
        password: "password1",
      });
      expect(false).toBe(true);
    } catch (e: any) {
      expect(e.response.status).toBe(400);
    }
  });

  it("rejects signup when password is too short", async () => {
    try {
      await axios.post(`${BACKEND_URL}/user/signup`, {
        username: USER_NAME,
        password: "short",
      });
      expect(false).toBe(true);
    } catch (e: any) {
      expect(e.response.status).toBe(400);
    }
  });

  it("signs up successfully with valid body", async () => {
    const res = await axios.post(`${BACKEND_URL}/user/signup`, {
      username: USER_NAME,
      password: "password1",
    });
    expect(res.status).toBe(200);
    expect(res.data.id).toBeDefined();
  });

  it("rejects duplicate signup", async () => {
    try {
      await axios.post(`${BACKEND_URL}/user/signup`, {
        username: USER_NAME,
        password: "password1",
      });
      expect(false).toBe(true);
    } catch (e: any) {
      expect(e.response.status).toBe(403);
    }
  });
});

describe("Signin endpoints", () => {
  it("rejects signin when body has wrong fields", async () => {
    try {
      await axios.post(`${BACKEND_URL}/user/signin`, {
        email: USER_NAME,
        password: "password1",
      });
      expect(false).toBe(true);
    } catch (e: any) {
      expect(e.response.status).toBe(400);
    }
  });

  it("rejects signin with wrong password", async () => {
    try {
      await axios.post(`${BACKEND_URL}/user/signin`, {
        username: USER_NAME,
        password: "wrongpassword",
      });
      expect(false).toBe(true);
    } catch (e: any) {
      expect(e.response.status).toBe(403);
    }
  });

  it("signs in successfully with correct credentials", async () => {
    const res = await axios.post(`${BACKEND_URL}/user/signin`, {
      username: USER_NAME,
      password: "password1",
    });
    expect(res.status).toBe(200);
    expect(res.data.jwt).toBeDefined();
    expect(res.data.id).toBeDefined();
  });
});
