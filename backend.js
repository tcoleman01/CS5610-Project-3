import express from "express";
import dotenv from "dotenv";
import { connect } from "./db/index.js";
import tripsRouter from "./routes/trips.js";

dotenv.config();

const app = express();
app.use(express.json());

// Connect to DB
const { db } = connect();

// Make the db available to routes
app.use((req, _res, next) => {
  req.db = db;
  next();
});

// (Optional) health check for smoke tests
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Mount API routes
app.use("/api/trips", tripsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Trips API running on http://localhost:${PORT}`);
});
