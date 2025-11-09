// db/index.js
import { MongoClient } from "mongodb";

export const DB_NAME =
  process.env.MONGO_DB || process.env.DB_NAME || "traveltracker_p3";

// Prefer cloud env var on Render/Atlas
export const URI =
  process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017";

let client;
let db;

export async function connect() {
  if (db) return { client, db };
  client = new MongoClient(URI);
  await client.connect();          // <-- critical for Render
  db = client.db(DB_NAME);
  return { client, db };
}
