import {describe, it, test, expect} from "bun:test";
import axios from "axios";
import { BACKEND_URL } from "./config";

const USERNAME = Math.random().toString();

describe("User Signup Endpoints", ()=>{
    it("Isnt able to sign up if body is incorrect", ()=>{
        try {
            axios.post(`${BACKEND_URL}/user/signup`, {
                email: "random email",
                password : "password"
            });
            expect(false, "User signed up when it shouldn't");
        } catch (error) {
            expect(true);
        }
    })

    it.todo("Is able to sign up if body is correct", async ()=>{
        try {
            const res = await axios.post(`${BACKEND_URL}/user/signup`, {
                username: USERNAME,
                password : "password"
            });
            expect(true, "User signed up when it should");
            expect(res.status).toBe(200);
            expect(res.data.id).not.toBeUndefined();
        } catch (error) {
            expect(false);
        }
    })
})



describe("User Signin Endpoints", ()=>{
    it("Isnt able to sign in if body is incorrect", ()=>{
        try {
            axios.post(`${BACKEND_URL}/user/signin`, {
                email: "random email",
                password : "password"
            });
            expect(false, "User signed in when it shouldn't");
        } catch (error) {
            expect(true);
        }
    })

    it.todo("Is able to sign in if body is correct", async ()=>{
        try {
            const res = await axios.post(`${BACKEND_URL}/user/signin`, {
                username: USERNAME,
                password : "password"
            });
            expect(true, "User signed in when it should");
            expect(res.status).toBe(200);
            expect(res.data.jwt).not.toBeUndefined();
        } catch (error) {
            expect(false);
        }
    })
})