import { MongoClient } from "mongodb";

export const DB_NAME =
  process.env.MONGO_DB || process.env.DB_NAME || "traveltracker_p3";
export const URI =
  process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

let client;
let db;

export async function connect() {
  if (db) return { client, db };
  client = new MongoClient(URI);
  await client.connect();            // <-- REQUIRED on Render/Atlas
  db = client.db(DB_NAME);
  return { client, db };
}
