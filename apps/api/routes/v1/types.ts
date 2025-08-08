import {z} from "zod";


export const AuthInput = z.object({
    username: z.string().min(3).max(31),
    password: z.string().min(8).max(31)
})


