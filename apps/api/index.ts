import express from "express";
import v1Router from "./routes/v1";

const app = express();

const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", frontendOrigin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        res.sendStatus(204);
        return;
    }
    next();
});

app.use(express.json());

app.use("/api/v1", v1Router);



app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});