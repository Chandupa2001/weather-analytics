import { getRedisClient, isRedisConnected } from "../config/redis.js";
import { env } from "../config/env.js";

// In-memory fallback store, used only if Redis can't be reached.
const memoryStore = new Map(); // key -> { value, expiresAt }

const MAX_LOG = 50;
const accessLog = [];

function recordAccess(namespace, key, hit) {
  accessLog.unshift({
    namespace,
    key: String(key),
    status: hit ? "HIT" : "MISS",
    at: new Date().toISOString(),
  });
  if (accessLog.length > MAX_LOG) accessLog.length = MAX_LOG;
}

function fullKey(namespace, key) {
  return `${namespace}:${key}`;
}

function memoryGet(fk) {
  const entry = memoryStore.get(fk);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryStore.delete(fk);
    return null;
  }
  return entry.value;
}

function memorySet(fk, value, ttlSeconds) {
  memoryStore.set(fk, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

/**
 * Get a cached value. Returns `null` on a miss.
 */
export async function getCache(namespace, key) {
  const fk = fullKey(namespace, key);
  const client = await getRedisClient();

  if (client) {
    const raw = await client.get(fk);
    const hit = raw !== null;
    recordAccess(namespace, key, hit);
    return hit ? JSON.parse(raw) : null;
  }

  const value = memoryGet(fk);
  recordAccess(namespace, key, value !== null);
  return value;
}

/**
 * Store a value with a TTL in seconds.
 */
export async function setCache(namespace, key, value, ttlSeconds) {
  const fk = fullKey(namespace, key);
  const client = await getRedisClient();

  if (client) {
    await client.setEx(fk, ttlSeconds, JSON.stringify(value));
    return;
  }
  memorySet(fk, value, ttlSeconds);
}

/**
 * Debug info for GET /api/cache - which backend is active, current keys,
 * and the last accesses (HIT/MISS) for demoing cache behaviour.
 */
export async function getCacheStatus() {
  const client = await getRedisClient();
  const backend = isRedisConnected() ? "redis" : "memory";

  let weatherKeys = [];
  let scoreKeys = [];

  if (client) {
    weatherKeys = await client.keys("weather:*");
    scoreKeys = await client.keys("score:*");
  } else {
    weatherKeys = [...memoryStore.keys()].filter((k) => k.startsWith("weather:"));
    scoreKeys = [...memoryStore.keys()].filter((k) => k.startsWith("score:"));
  }

  return {
    backend,
    ttlSeconds: {
      weather: env.cache.weatherTtlSeconds,
      score: env.cache.scoreTtlSeconds,
    },
    keys: { weather: weatherKeys, score: scoreKeys },
    recentAccess: accessLog,
  };
}
