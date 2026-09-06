import { loadCities } from "../utils/cityLoader.js";
import { getWeatherForCities } from "../services/weatherService.js";
import { rankCities } from "../services/rankingService.js";

// GET /api/weather - every city, comfort-scored and ranked
export async function getAllWeather(req, res, next) {
  try {
    const cities = loadCities();
    const pairs = await getWeatherForCities(cities);
    const { source, results } = await rankCities(pairs);
    res.json({ source, count: results.length, results });
  } catch (err) {
    next(err);
  }
}

// GET /api/weather/cities - the raw configured city list
export function getCities(req, res) {
  res.json(loadCities());
}
