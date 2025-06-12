import { Router } from "express";
import prismaClient from "store/client";
import express from "express";
const websitesRouter = Router();

websitesRouter.use(express.json());

websitesRouter.get("/status/:websiteId", async (req, res) => {

});

websitesRouter.post("/website", async (req, res) => {
  if(!req.body.url){
    res.status(411).json({});
  }
  const website = await prismaClient.website.create({
    data: {
      url: req.body.url,
      timeAdded: new Date(),
      region: req.body.region,
    },

  });

  res.json({id: website.id})
});

export default websitesRouter;
