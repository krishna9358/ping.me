import { Router } from "express";
import { AuthInput } from "./types";
import prismaClient from "store/client";
import jwt from "jsonwebtoken";

const userRouter = Router();

async function hashPassword(password: string): Promise<string> {
  return Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10,
  });
}

async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return Bun.password.verify(password, passwordHash);
}

// =========== SIGNIN ROUTE =============
userRouter.post("/signin", async (req, res) => {
  const data = AuthInput.safeParse(req.body);
  if (!data.success) {
    res
      .status(400)
      .json({ error: "Invalid Inputs", details: data.error.flatten() });
    return;
  }
  try {
    const user = await prismaClient.user.findFirst({
      where: {
        username: data.data.username,
      },
    });

    if (!user) {
      res.status(403).json({ error: "User not found" });
      return;
    }

    const valid = await verifyPassword(data.data.password, user.password);
    if (!valid) {
      res.status(403).json({ error: "User password is incorrect" });
      return;
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    res
      .status(200)
      .json({ message: "User Signed in", id: user.id, jwt: token });
  } catch (e) {
    res.status(403).json({ error: "User not found" });
  }
});

// =========== SIGNUP ROUTE =============
userRouter.post("/signup", async (req, res) => {
  const data = AuthInput.safeParse(req.body);
  if (!data.success) {
    res
      .status(400)
      .json({ error: "Invalid Inputs", details: data.error.flatten() });
    return;
  }
  try {
    const existingUser = await prismaClient.user.findFirst({
      where: {
        username: data.data.username,
      },
    });

    if (existingUser) {
      res.status(403).json({ error: "User already exists" });
      return;
    }

    const hashed = await hashPassword(data.data.password);
    const user = await prismaClient.user.create({
      data: {
        username: data.data.username,
        password: hashed,
      },
    });

    res.status(200).json({ message: "User Created Successfully", id: user.id });
  } catch (e) {
    res.status(403).json({ error: "User already exists" });
  }
});

export default userRouter;
