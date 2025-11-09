// backend.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { connect } from "./db/index.js";
import tripsRouter from "./routes/trips.js";

dotenv.config();

const app = express();
app.use(express.json());

// --- DB (connect once) ---
const { db } = await connect();
app.use((req, _res, next) => {
  req.db = db;
  next();
});

// --- API routes under /api ---
app.use("/api/trips", tripsRouter);

// --- STATIC FRONTEND (serve client/dist) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "client", "dist");
app.use(express.static(distDir));

// SPA fallback: any GET not starting with /api returns index.html
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
