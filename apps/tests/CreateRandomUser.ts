import axios from "axios";

const BACKEND_URL =
  process.env.BACKEND_URL ?? "http://localhost:3000/api/v1";

export async function createUser(): Promise<{
    id: string;
    jwt: string;
}> {
    const username = `test_${Math.random().toString(36).slice(2)}`;
    const password = "testpass123";

    const signupRes = await axios.post(`${BACKEND_URL}/user/signup`, {
        username,
        password,
    });

    const signinRes = await axios.post(`${BACKEND_URL}/user/signin`, {
        username,
        password,
    });

    return {
        id: signupRes.data.id,
        jwt: signinRes.data.jwt,
    };
}
