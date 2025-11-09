// backend.js
import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connect } from "./db/index.js";
import tripsRouter from "./routes/trips.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// connect once, stash db
const { db } = await connect();
app.use((req, _res, next) => {
  req.db = db;
  next();
});

// your APIs
app.use("/api/trips", tripsRouter);

// ---- serve the React build (single origin, no CORS needed) ----
const clientDist = path.resolve(__dirname, "client", "dist");
app.use(express.static(clientDist));

// SPA fallback: let React handle unknown routes
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Trips + Client running on http://localhost:${PORT}`);
});
