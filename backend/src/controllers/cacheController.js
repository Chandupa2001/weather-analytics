import { getCacheStatus } from "../services/cacheService.js";

// GET /api/cache - HIT/MISS log, active backend, current cached keys
export async function getStatus(req, res, next) {
  try {
    const status = await getCacheStatus();
    res.json(status);
  } catch (err) {
    next(err);
  }
}
