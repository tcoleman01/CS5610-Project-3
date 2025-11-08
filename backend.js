import express from "express";
import dotenv from "dotenv";
import { connect } from "./db/index.js";
import tripsRouter from "./routes/trips.js";

dotenv.config();

const app = express();
app.use(express.json());

// ===== Minimal CORS headers, no 'cors' library =====
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "https://tcoleman01.github.io/CS5610-Project-3/";
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", FRONTEND_ORIGIN);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Connect once; keep db on req
const { db } = await connect();
app.use((req, _res, next) => { req.db = db; next(); });

// health check for Render
app.get("/health", (_req, res) => res.json({ ok: true }));

// your routes
app.use("/api/trips", tripsRouter);

// IMPORTANT: Render sets PORT for you
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Trips API running on http://localhost:${PORT}`);
});
