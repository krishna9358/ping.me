import { describe, it, expect, beforeAll } from "bun:test";
import axios from "axios";
import { createUser } from "./CreateRandomUser";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000/api/v1"
const region = "6a5fb906-6861-4b97-9ada-2e20cda3c531";
const user1 = await createUser();

describe("Website gets created", () => {
    let token: string;

    beforeAll(async () => {
        token = user1.jwt;
    })

    it("Website not created if url is not present", async () => {
        try {
            await axios.post(`${BACKEND_URL}/websites/website`, {
                
            }, {
                headers: {
                    Authorization: token
                }
            });
            expect(false, "Website created when it shouldnt");
        } catch(e) {

        }

    })

    it.todo("Website is created if url is present", async () => {

        const response = await axios.post(`${BACKEND_URL}/websites/website`, {
            
            url: "https://google.com",
            regionId: region,
            userId: user1.id
        }, {
            headers: {
                Authorization: token
            }
        })
        expect(response.data.id).not.toBeNull();
    })


    it("Website is not created if the header is not present", async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/websites/website`, {
                url: "https://google.com"
            });
            expect(false, "Website shouldnt be created if no auth header")
        } catch(e) {

        }
    })
})

describe("Can fetch website", () => {
    let token1: string, userId1: string;

    beforeAll(async () => {
        token1 = user1.jwt;
        userId1 = user1.id;
    });

    it.todo("Is able to fetch a website that the user created", async () => {
        const websiteResponse = await axios.post(`${BACKEND_URL}/websites/website`, {
            url: "https://hdjjhdhdjhdj.com/"
        }, {
            headers: {
                Authorization: token1
            }
        })

        const getWebsiteResponse = await axios.get(`${BACKEND_URL}/websites/status/${websiteResponse.data.id}`, {
            headers: {
                Authorization: token1
            }
        })

        console.log(getWebsiteResponse.data)

        expect(getWebsiteResponse.data.id).toBe(websiteResponse.data.id)
        expect(getWebsiteResponse.data.user_id).toBe(userId1)
    })

    it.todo("Cant access website created by other user", async () => {
        const websiteResponse = await axios.post(`${BACKEND_URL}/websites/website`, {
            url: "https://hdjjhdhdjhdj.com/"
        }, {
            headers: {
                Authorization: token1
            }
        })

        try {

            await axios.get(`${BACKEND_URL}/websites/status/${websiteResponse.data.id}`, {
                headers: {
                    Authorization: token1
                }
            })
            expect(false, "Should be able to access website of a diff user")
        } catch(e) {

        }
    })
})