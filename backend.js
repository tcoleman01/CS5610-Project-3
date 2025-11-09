// backend.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connect } from "./db/index.js";
import tripsRouter from "./routes/trips.js";

dotenv.config();

const app = express();
app.use(express.json());

// connect db once
const { db } = await connect();
app.use((req, _res, next) => {
  req.db = db;
  next();
});

// ---- your API routes
app.use("/api/trips", tripsRouter);

// ---- serve React build in production (same-origin, no CORS needed)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.join(__dirname, "client", "dist");

app.use(express.static(clientDist));
// IMPORTANT: SPA fallback — must be AFTER API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
