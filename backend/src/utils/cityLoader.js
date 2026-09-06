import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CITIES_PATH = path.join(__dirname, "..", "..", "data", "cities.json");

let cachedCities = null;

export function loadCities() {
  if (cachedCities) return cachedCities;

  const raw = readFileSync(CITIES_PATH, "utf-8");
  const cities = JSON.parse(raw);

  if (!Array.isArray(cities) || cities.length < 10) {
    console.warn(`[cityLoader] Expected at least 10 cities, found ${cities?.length ?? 0}.`);
  }

  cachedCities = cities;
  return cachedCities;
}
