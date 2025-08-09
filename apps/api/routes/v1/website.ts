import { Router } from "express";
import prismaClient from "store/client";
import express from "express";
import { AuthInput } from "./types";
import { authMiddleware } from "../../middleware";
const websitesRouter = Router();

websitesRouter.use(express.json());

websitesRouter.get("/status/:websiteId",authMiddleware, async (req, res) =>   {
  // Finding the 1st website tick in descending order( the latest or recent one)
  const website = await prismaClient.website.findFirst({
    where:{
      userId: req.userId!,
      id: req.params.websiteId
    },
    include:{
      ticks: {
        orderBy: {
          createdAt: "desc"
        },
        take: 1
      }
    }
  })

  if(!website){
    res.status(404).send("website not found");
    return;
  }

  res.json({
    website
    
  })
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
