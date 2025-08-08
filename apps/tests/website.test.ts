import { describe, expect, it } from "bun:test";
import axios from "axios";
import { BASE_URL } from "./config";
// supertest -> express

let base_url = BASE_URL;

describe("website gets created", () => {
  it("Website not created if url is not presented ", () => {
    try {
      axios.post(`${base_url}/api/v1/websites/website`, {});
      expect(false, "website created when it shouldn't");
    } catch (e) {}
  });

  // it.todo is going to ignore this test for now
  it.todo("website is created if url is presented", async () => {
    const response = await axios.post(
      `${base_url}/api/v1/websites/website`,
      {
        url: "https://www.google.com",
        region: "us",
        user: "test",
        password: "test", 
      }
    );
    expect(response.data.id).not.toBeNull();
  });
});
