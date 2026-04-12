import express from "express";
import v1Router from "./routes/v1";

const app = express();

const defaultOrigins = "http://localhost:5173,http://localhost,http://127.0.0.1";
const allowedOrigins = (process.env.FRONTEND_ORIGIN ?? defaultOrigins)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function corsAllowOrigin(req: express.Request): string | undefined {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    return origin;
  }
  return allowedOrigins[0];
}

app.use((req, res, next) => {
  const allow = corsAllowOrigin(req);
  if (allow) {
    res.setHeader("Access-Control-Allow-Origin", allow);
  }
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
