import { useCallback, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchWeather } from "../services/weatherApi";

export function useWeather() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [cities, setCities] = useState([]);
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      const { results, source } = await fetchWeather(token);
      setCities(results);
      setSource(source);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  useEffect(() => {
    load();
  }, [load]);

  return { cities, source, loading, error, refetch: load };
}
