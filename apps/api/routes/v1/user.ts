import { Router } from "express";
import { AuthInput } from "./types";
import prismaClient from "store/client";
import jwt from "jsonwebtoken";

const userRouter = Router();

// =========== SIGNIN ROUTE =============
userRouter.get("/signin", async (req, res) => {
    // Zod Validation
  const data = AuthInput.safeParse(req.body);
  if (!data.success) {
    res.send("Invalid Inputs");
    return;
  }
//   Database Query : Get the user
  try {
    const user = await prismaClient.user.findFirst({
      where: {
        username: data.data.username,
      },
    });
   
    // check if user exist
    if (!user)  {
      res.status(403).send("User not found");
      return;
    }

     // checking the plain password user entered with database password by unhashing it.
     if (user?.password !== data.data.password) {
        res.status(403).send("User password is incorrect");
        return;
      }

      const token = jwt.sign({id : user.id}, process.env.JWT_SECRET!, { expiresIn: "1h" });
    // Send response
    res.json({ message: "User Signed in", id: user.id, jwt:token });
  } catch (e) {
    // Send error response
    res.status(403).send("User not found");
  }
});

// =========== SIGNUP ROUTE =============
userRouter.post("/signup", async (req, res) => {
    // Zod Validation
  const data = AuthInput.safeParse(req.body);
  if (!data.success) {
    res.send("Invalid Inputs");
    return;
  }
  // Database Query : Create the user
  try {
    const user = await prismaClient.user.create({
      data: {
        username: data.data.username,
        password: data.data.password,
      },
    });

    // Send response
    res.json({ message: "User Created Successfully", id: user.id });
  } catch (e) {
    // Send error response
    res.status(403).send("User already exists");
  }
});

export default userRouter;
