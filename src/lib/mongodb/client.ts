import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalForMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalForMongo._mongoClient) {
    globalForMongo._mongoClient = new MongoClient(uri);
  }

  client = globalForMongo._mongoClient;
} else {
  // In production, it's best to not use a global variable.
  client = new MongoClient(uri);
}

export async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
  return client;
}

export function getDatabase() {
  return client.db("innovyra");
}

export async function getCollection(collectionName: string) {
  return getDatabase().collection(collectionName);
}

export default client;
