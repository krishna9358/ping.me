import { Router } from "express";
import websitesRouter from "./website";
import userRouter from "./user";
import regionRouter from "./region";
import express from "express";

const router = Router();

router.use(express.json());

router.use("/websites", websitesRouter);
router.use("/user", userRouter);
router.use("/regions", regionRouter);

export default router;