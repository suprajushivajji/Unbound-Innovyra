import mongoose from "mongoose";
import type { MongoMemoryServer } from "mongodb-memory-server";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  uri: string | null;
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
  // eslint-disable-next-line no-var
  var _mongoMemoryServer: MongoMemoryServer | undefined;
  // eslint-disable-next-line no-var
  var _usingMemoryDb: boolean | undefined;
}

const globalCache = globalThis._mongoose ?? {
  conn: null,
  promise: null,
  uri: null,
};
globalThis._mongoose = globalCache;

export function isUsingMemoryDb() {
  return globalThis._usingMemoryDb === true;
}

async function resetCache() {
  globalCache.conn = null;
  globalCache.promise = null;
  globalCache.uri = null;
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

async function getMemoryUri(): Promise<string> {
  if (!globalThis._mongoMemoryServer) {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    globalThis._mongoMemoryServer = await MongoMemoryServer.create();
    globalThis._usingMemoryDb = true;
    console.warn(
      "[mongodb] Using in-memory database. Demo login: demo@innovyra.com / demo1234"
    );
  }
  return globalThis._mongoMemoryServer.getUri();
}

async function connectToUri(uri: string, timeoutMs: number) {
  const connected =
    globalCache.conn &&
    globalCache.uri === uri &&
    mongoose.connection.readyState === 1;

  if (connected) {
    return globalCache.conn;
  }

  if (globalCache.conn && mongoose.connection.readyState !== 1) {
    await resetCache();
  }

  if (globalCache.uri && globalCache.uri !== uri) {
    await resetCache();
  }

  if (!globalCache.promise) {
    globalCache.uri = uri;
    mongoose.set("strictQuery", true);
    globalCache.promise = mongoose
      .connect(uri, {
        dbName: "innovyra",
        serverSelectionTimeoutMS: timeoutMs,
      })
      .then((conn) => {
        globalCache.conn = conn;
        return conn;
      })
      .catch(async (err) => {
        await resetCache();
        throw err;
      });
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}

async function connectWithMemoryFallback() {
  const memoryUri = await getMemoryUri();
  const conn = await connectToUri(memoryUri, 8000);
  const { seedDevUser } = await import("@/lib/seed-dev-user");
  await seedDevUser();
  return conn;
}

export async function dbConnect() {
  const atlasUri = process.env.MONGODB_URI;
  const forceMemory = process.env.USE_MEMORY_DB === "true";
  const isDev = process.env.NODE_ENV === "development";

  if (!atlasUri && !isDev) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }

  if (forceMemory || !atlasUri) {
    return connectWithMemoryFallback();
  }

  try {
    return await connectToUri(atlasUri, isDev ? 5000 : 8000);
  } catch (err) {
    if (!isDev) throw err;
    console.warn(
      "[mongodb] Remote database unavailable, using in-memory fallback.",
      err instanceof Error ? err.message : err
    );
    return connectWithMemoryFallback();
  }
}
