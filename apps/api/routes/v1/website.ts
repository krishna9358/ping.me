import { Router } from "express";

const websitesRouter = Router();


websitesRouter.get("/status/:websiteId", (req, res) => {
    res.send("Hello World");
  });
  
  websitesRouter.post("/website", (req, res) => {
    res.send("Hello World");
  });

  export default websitesRouter;