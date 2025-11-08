// auth-server/server.js
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// NEW: for static serving
import path from "path";
import { fileURLToPath } from "url";

// NEW: mount Trips API & DB connector from root db/
import tripsRouter from "../routes/trips.js";
import { connect } from "../db/index.js";

const {
  AUTH_PORT = process.env.PORT || 4000, // Render sets PORT; fallback to 4000 locally
  MONGO_URI = "mongodb://127.0.0.1:27017",
  MONGO_DB = "traveltracker_p3",
  AUTH_SECRET = "change-me-to-a-long-random-string",
  NODE_ENV = "development",
} = process.env;

const app = express();
app.use(express.json());
app.use(cookieParser());

// ---------- DB connection shared with Trips router ----------
const { db } = connect();
app.use((req, _res, next) => {
  req.db = db; // make Mongo db handle available to routers
  next();
});

// ---------- Cookie options (single-origin; no CORS needed) ----------
const isProd = NODE_ENV === "production";
const cookieOpts = {
  httpOnly: true,
  secure: isProd,        // true on Render (HTTPS)
  sameSite: "lax",       // same-origin navigation works
  path: "/",
};

// ---------- Health ----------
app.get("/health", (_req, res) => res.json({ ok: true }));

// ---------- AUTH endpoints (unchanged aside from cookie opts) ----------
app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password || password.length < 6) {
    return res.status(400).json({ message: "Invalid input" });
  }
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const users = client.db(MONGO_DB).collection("users");

  const exists = await users.findOne({ email });
  if (exists) {
    await client.close();
    return res.status(409).json({ message: "Email already registered" });
  }

  const hash = await bcrypt.hash(password, 10);
  const doc = { name, email, pass: hash, createdAt: new Date(), updatedAt: new Date() };
  const { insertedId } = await users.insertOne(doc);

  const token = jwt.sign({ _id: insertedId, email }, AUTH_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, { ...cookieOpts, maxAge: 7 * 24 * 3600 * 1000 });
  await client.close();
  res.status(201).json({ ok: true });
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const users = client.db(MONGO_DB).collection("users");

  const user = await users.findOne({ email });
  if (!user) {
    await client.close();
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.pass);
  if (!match) {
    await client.close();
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ _id: user._id, email: user.email }, AUTH_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, { ...cookieOpts, maxAge: 7 * 24 * 3600 * 1000 });
  await client.close();
  res.json({ ok: true });
});

function requireAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    req.auth = jwt.verify(token, AUTH_SECRET);
    return next();
  } catch {
    res.clearCookie("token", { ...cookieOpts, maxAge: 0 });
    return res.status(401).json({ message: "Session expired. Please sign in again." });
  }
}

// example protected route
app.get("/users/me", requireAuth, async (req, res) => {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const users = client.db(MONGO_DB).collection("users");
  const me = await users.findOne({ _id: new ObjectId(req.auth._id) }, { projection: { pass: 0 } });
  await client.close();
  res.json(me);
});

// ---------- MOUNT Trips API under /api ----------
app.use("/api", tripsRouter); // routes/trips.js defines /trips/... paths

// ---------- Serve React build from the SAME server ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../client/dist");

app.use(express.static(distPath));
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ---------- Start ----------
app.listen(AUTH_PORT, () => {
  console.log(`Server running on http://localhost:${AUTH_PORT}`);
});
