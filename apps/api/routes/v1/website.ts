import { Router } from "express";
import prismaClient from "store/client";
import express from "express";
import { AuthInput } from "./types";
import { authMiddleware } from "../../middleware";
const websitesRouter = Router();

websitesRouter.use(express.json());

websitesRouter.get("/status/:websiteId",authMiddleware, async (req, res) => {

});

websitesRouter.post("/website", authMiddleware, async (req, res) => {
  if(!req.body.url){
    res.status(411).json({});
    return;
  }
  try {
    const website = await prismaClient.website.create({
    data: {
      url: req.body.url,
      timeAdded: new Date(),
      userId: req.userId!,
      regionId: "dsafnk",
    }
  });

  res.json({id: website.id})
} catch (error) {
  res.status(500).json({});
}});

export default websitesRouter;
