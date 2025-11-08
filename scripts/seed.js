import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGO_DB || "traveltracker_p3";

const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

function rand(n){ return Math.floor(Math.random()*n); }

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const trips = db.collection("trips");

  const docs = Array.from({ length: 1000 }).map((_, i) => {
    const count = 1 + rand(5);
    const sample = Array.from({ length: count }).map(() => STATES[rand(STATES.length)]);
    return {
      userId: null, // or set to a known user _id after you create one
      tripName: `Synthetic Trip #${i+1}`,
      statesVisited: [...new Set(sample)],
      totalCost: rand(3000),
      notes: "seed",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  await trips.insertMany(docs);
  console.log("Inserted", docs.length, "trips");
  await client.close();
}

main().catch((e)=>{ console.error(e); process.exit(1); });
