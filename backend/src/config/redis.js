import { createClient } from "redis";
import { env } from "./env.js";

let client = null;
let connectionAttempted = false;

export async function getRedisClient() {
  if (connectionAttempted) return client;
  connectionAttempted = true;

  try {
    client = createClient({ url: env.cache.redisUrl });
    client.on("error", (err) => {
      console.error("[redis] connection error:", err.message);
    });
    await client.connect();
    console.log(`[redis] connected to ${env.cache.redisUrl}`);
    return client;
  } catch (err) {
    console.warn(`[redis] unavailable (${err.message}) - falling back to in-memory cache.`);
    client = null;
    return null;
  }
}

export function isRedisConnected() {
  return Boolean(client?.isOpen);
}
