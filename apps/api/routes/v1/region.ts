import { Router } from "express";
import prismaClient from "store/client";

const regionRouter = Router();

regionRouter.get("/", async (_req, res) => {
  const regions = await prismaClient.region.findMany({
    orderBy: { name: "asc" },
  });
  res.json({ regions });
});

regionRouter.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({ error: "Region name is required" });
    return;
  }
  try {
    const region = await prismaClient.region.create({
      data: { name: name.trim() },
    });
    res.status(201).json({ region });
  } catch (error) {
    res.status(500).json({ error: "Failed to create region" });
  }
});

regionRouter.delete("/:regionId", async (req, res) => {
  const deleted = await prismaClient.region.deleteMany({
    where: { id: req.params.regionId },
  });
  if (deleted.count === 0) {
    res.status(404).json({ error: "Region not found" });
    return;
  }
  res.status(204).send();
});

export default regionRouter;
