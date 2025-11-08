// auth-server/server.js
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const {
  AUTH_PORT = 4000,
  MONGO_URI = "mongodb://127.0.0.1:27017",
  MONGO_DB = "traveltracker_p3",
  AUTH_SECRET = "change-me-to-a-long-random-string",
  NODE_ENV = "production",
} = process.env;

const app = express();
app.use(express.json());
app.use(cookieParser());

// Connect once and reuse
const mongo = new MongoClient(MONGO_URI);
await mongo.connect();                // <— critical for Render/Atlas
const db = mongo.db(MONGO_DB);
const users = db.collection("users");

// keep your routes, but use `users` above…

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || AUTH_PORT;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Auth server listening on ${PORT}`);
});