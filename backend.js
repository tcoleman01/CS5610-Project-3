import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connect } from "./db/index.js";
import tripsRouter from "./routes/trips.js";

dotenv.config();

const app = express();
app.use(express.json());

// DB
const { db } = await connect();
app.use((req, _res, next) => {
  req.db = db;
  next();
});

// ---- API ROUTES (keep these BEFORE the static fallback) ----
app.use("/api/trips", tripsRouter);

// Optional: simple health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// ---- Serve React build (client/dist) ----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_DIST = path.join(__dirname, "client", "dist");

// Serve static files
app.use(express.static(CLIENT_DIST));

// SPA fallback: send index.html for all non-API routes
app.get("*", (req, res) => {
  // avoid swallowing API paths
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "Not found" });
  }
  res.sendFile(path.join(CLIENT_DIST, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
