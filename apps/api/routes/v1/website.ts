import { Router } from "express";
import prismaClient from "store/client";
import express from "express";
import { authMiddleware } from "../../middleware";
const websitesRouter = Router();

websitesRouter.use(express.json());

websitesRouter.get("/", authMiddleware, async (req, res) => {
    const websites = await prismaClient.website.findMany({
        where: { userId: req.userId! },
        include: {
            ticks: {
                orderBy: { createdAt: "desc" },
                take: 100,
            },
        },
        orderBy: { timeAdded: "desc" },
    });
    res.json({ websites });
});

websitesRouter.get("/status/:websiteId", authMiddleware, async (req, res) => {
  // Finding the 1st website tick in descending order( the latest or recent one)
  const website = await prismaClient.website.findFirst({
    where: {
      userId: req.userId!,
      id: req.params.websiteId,
    },
    include: {
      ticks: {
        orderBy: {
          createdAt: "desc",
        },
        take: 100,
      },
    },
  });

  if (!website) {
    res.status(404).send("website not found");
    return;
  }

  res.json({
    website,
  });
});

websitesRouter.post("/website", authMiddleware, async (req, res) => {
  if (!req.body.url) {
    res.status(411).json({});
    return;
  }
   // Verify user exists
   const user = await prismaClient.user.findUnique({
    where: { id: req.userId! }
  });

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  try {
    // TODO: Don't use this method to get the regions do something different. May be add region iD in req type. or something
    // First, find any region (or create one if none exists)
    let region = await prismaClient.region.findFirst();

    if (!region) {
      // Create a default region if none exists
      region = await prismaClient.region.create({
        data: {
          name: "Default Region",
        },
      });
    }

    const website = await prismaClient.website.create({
      data: {
        url: req.body.url,
        timeAdded: new Date(),
        userId: req.userId!,
        regionId: region.id,
      },
    });

    res.json({ id: website.id });
  } catch (error) {
    console.error("Error creating website:", error);
    res.status(500).json({
      error_msg: "Failed to create website",
      details: error as string,
    });
  }
});

websitesRouter.delete("/website/:websiteId", authMiddleware, async (req, res) => {
    const deleted = await prismaClient.website.deleteMany({
        where: {
            id: req.params.websiteId,
            userId: req.userId!,
        },
    });
    if (deleted.count === 0) {
        res.status(404).json({ error: "website not found" });
        return;
    }
    res.status(204).send();
});

export default websitesRouter;
