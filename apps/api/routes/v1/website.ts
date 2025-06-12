import { Router } from "express";
import prismaClient from "store/client";
import express from "express";
const websitesRouter = Router();

websitesRouter.use(express.json());

websitesRouter.get("/status/:websiteId", async (req, res) => {
  await prismaClient.website.create({
    data: {
      url: req.body.url,
      timeAdded: new Date(),
      region: req.body.region,
    },
  });
});

websitesRouter.post("/website", (req, res) => {
  res.send("Hello World");
});

export default websitesRouter;
