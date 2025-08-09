import axios from "axios"
import { BACKEND_URL } from "./config"

export async function createUser(): Promise<{
    id: string,
    jwt: string
}> {
    const USER_NAME = Math.random().toString();
    const res = await axios.post(`${BACKEND_URL}/user/signup`, {
        username: USER_NAME,
        password: "123123123"
    })

    const signinRes = await axios.post(`${BACKEND_URL}/user/signin`, {
        username: USER_NAME,
        password: "123123123"
    })

    return {
        id: res.data.id,
        jwt: signinRes.data.jwt
    }
}