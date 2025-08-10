import { Router } from "express";
import websitesRouter from "./website";
import userRouter from "./user";
import express from "express";

const router = Router();

router.use(express.json());

// router.use("/users", usersRouter);
router.use("/websites", websitesRouter);
router.use("/user", userRouter);

// TODO: Create a region endpoint or admin panel to create regions.

export default router;