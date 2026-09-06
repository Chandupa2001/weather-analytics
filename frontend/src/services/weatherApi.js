import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

/** GET /api/weather - all cities, comfort-scored and ranked. */
export async function fetchWeather(token) {
  const { data } = await axios.get(`${API_BASE_URL}/weather`, { headers: authHeaders(token) });
  return data; // { source, count, results }
}

/** GET /api/cache - cache backend, keys, and recent HIT/MISS log. */
export async function fetchCacheStatus(token) {
  const { data } = await axios.get(`${API_BASE_URL}/cache`, { headers: authHeaders(token) });
  return data;
}
