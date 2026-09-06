import { computeComfortIndex } from "./comfortIndexService.js";
import { getCache, setCache } from "./cacheService.js";
import { env } from "../config/env.js";

const NAMESPACE = "score";
const ALL_KEY = "all";

function toCityResult({ city, weather }) {
  const comfort = computeComfortIndex({
    tempC: weather.main?.temp,
    humidity: weather.main?.humidity,
    windSpeedMs: weather.wind?.speed,
    cloudPct: weather.clouds?.all,
  });

  return {
    cityCode: city.CityCode,
    cityName: weather.name || city.CityName,
    country: weather.sys?.country || city.Country,
    weather: {
      description: weather.weather?.[0]?.description ?? "unknown",
      icon: weather.weather?.[0]?.icon ?? null,
      tempC: weather.main?.temp,
      feelsLikeC: weather.main?.feels_like,
      humidity: weather.main?.humidity,
      pressure: weather.main?.pressure,
      windSpeedMs: weather.wind?.speed,
      cloudPct: weather.clouds?.all,
      visibility: weather.visibility,
    },
    comfortIndex: comfort.score,
    comfortBreakdown: comfort.breakdown,
  };
}

export async function rankCities(cityWeatherPairs) {
  const cached = await getCache(NAMESPACE, ALL_KEY);
  if (cached) return { source: "cache", results: cached };

  const results = cityWeatherPairs.map(toCityResult).sort((a, b) => b.comfortIndex - a.comfortIndex);
  results.forEach((r, i) => (r.rank = i + 1));

  await setCache(NAMESPACE, ALL_KEY, results, env.cache.scoreTtlSeconds);
  return { source: "live", results };
}
