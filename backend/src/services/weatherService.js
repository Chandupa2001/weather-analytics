import axios from "axios";
import { env } from "../config/env.js";
import { getCache, setCache } from "./cacheService.js";

const NAMESPACE = "weather";


// Fetch one city's raw OpenWeatherMap payload
export async function getCityWeather(city) {
  const cacheKey = String(city.CityCode);

  const cached = await getCache(NAMESPACE, cacheKey);
  if (cached) return cached;

  const { data } = await axios.get(env.owm.baseUrl, {
    params: { id: city.CityCode, appid: env.owm.apiKey, units: "metric" },
    timeout: 8000,
  });

  await setCache(NAMESPACE, cacheKey, data, env.cache.weatherTtlSeconds);
  return data;
}

// Fetch weather for every city in the list
export async function getWeatherForCities(cities) {
  const settled = await Promise.allSettled(cities.map((city) => getCityWeather(city)));

  return settled
    .map((outcome, i) => ({ city: cities[i], outcome }))
    .filter(({ outcome }) => outcome.status === "fulfilled")
    .map(({ city, outcome }) => ({ city, weather: outcome.value }));
}
