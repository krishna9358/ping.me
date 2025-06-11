import { Router } from "express";
import websitesRouter from "./website";

const router = Router();

// router.use("/users", usersRouter);
router.use("/websites", websitesRouter);

export default router;