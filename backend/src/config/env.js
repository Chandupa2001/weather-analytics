import "dotenv/config";

function required(name, fallback = undefined) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    console.warn(`[env] ${name} is not set. The app may not work correctly until it is.`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT || 5000),
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",

  owm: {
    apiKey: required("OWM_API_KEY"),
    baseUrl: process.env.OWM_BASE_URL || "https://api.openweathermap.org/data/2.5/weather",
  },

  cache: {
    weatherTtlSeconds: Number(process.env.WEATHER_CACHE_TTL || 300),
    scoreTtlSeconds: Number(process.env.SCORE_CACHE_TTL || 300),
    redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  },

  auth0: {
    domain: required("AUTH0_DOMAIN"),
    audience: required("AUTH0_AUDIENCE"),
  },
};

export default env;
