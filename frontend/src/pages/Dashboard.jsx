import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useWeather } from "../hooks/useWeather";
import WeatherGrid from "../components/WeatherGrid";
import RankingTable from "../components/RankingTable";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import ComfortScore from "../components/ComfortScore";

const SORTS = {
  comfort: (a, b) => b.comfortIndex - a.comfortIndex,
  temp: (a, b) => b.weather.tempC - a.weather.tempC,
  name: (a, b) => a.cityName.localeCompare(b.cityName),
};

const BREAKDOWN_LABELS = {
  temperature: "Temperature",
  humidity: "Humidity",
  wind: "Wind",
  cloud: "Cloud cover",
};

export default function Dashboard() {
  const { cities, loading, error, source, refetch } = useWeather();
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("comfort");
  const [view, setView] = useState("table"); // "table" | "grid"
  const [selectedCode, setSelectedCode] = useState(null);

  const visible = useMemo(() => {
    return cities
      .filter((c) =>
        c.cityName.toLowerCase().includes(query.trim().toLowerCase()),
      )
      .slice()
      .sort(SORTS[sortKey]);
  }, [cities, query, sortKey]);

  const selected =
    visible.find((c) => c.cityCode === selectedCode) || visible[0] || null;

  const chartData = selected
    ? Object.entries(selected.comfortBreakdown).map(([key, value]) => ({
        parameter: BREAKDOWN_LABELS[key] || key,
        score: value,
      }))
    : [];

  if (loading && cities.length === 0)
    return <LoadingState message="Loading weather..." />;
  if (error && cities.length === 0)
    return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold">
            Comfort Index
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Live weather, ranked by how pleasant it actually feels outside.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter cities..."
            className="rounded-full border border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-white/5
                       px-4 py-2 text-sm w-40 sm:w-56 focus:outline-none"
          />
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2 text-sm"
          >
            <option value="comfort">Sort: Comfort</option>
            <option value="temp">Sort: Temperature</option>
            <option value="name">Sort: Name</option>
          </select>
          <div className="flex rounded-full border border-slate-300 dark:border-slate-600 p-0.5 text-sm">
            {["table", "grid"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-full font-medium capitalize transition-colors
                            ${view === v ? "bg-dusk text-white" : "text-slate-600 dark:text-slate-300"}`}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            onClick={refetch}
            className="rounded-full bg-dusk text-white px-4 py-2 text-sm font-semibold hover:bg-dusk/90"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-comfort-low/40 bg-comfort-low/10 text-comfort-low px-4 py-3 text-sm">
          Couldn't refresh weather data: {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-6">
        <div>
          {view === "table" ? (
            <RankingTable
              cities={visible}
              selectedCode={selected?.cityCode}
              onSelect={(c) => setSelectedCode(c.cityCode)}
            />
          ) : (
            <WeatherGrid
              cities={visible}
              selectedCode={selected?.cityCode}
              onSelect={(c) => setSelectedCode(c.cityCode)}
            />
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/60 dark:bg-white/[0.03] p-6">
          {selected ? (
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Rank #{selected.rank}
                </p>
                <h2 className="font-display text-3xl font-semibold">
                  {selected.cityName}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 capitalize">
                  {selected.weather.description}
                </p>
              </div>

              <ComfortScore score={selected.comfortIndex} size="lg" />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <Stat
                  label="Feels like"
                  value={`${Math.round(selected.weather.feelsLikeC)}°C`}
                />
                <Stat
                  label="Humidity"
                  value={`${selected.weather.humidity}%`}
                />
                <Stat
                  label="Wind"
                  value={`${selected.weather.windSpeedMs} m/s`}
                />
                <Stat
                  label="Cloud cover"
                  value={`${selected.weather.cloudPct}%`}
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-sm text-slate-600 dark:text-slate-300">
                  What's driving the score
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ left: 10, right: 20 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        className="opacity-20"
                      />
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis
                        type="category"
                        dataKey="parameter"
                        width={90}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip formatter={(v) => `${v} / 100`} />
                      <Bar
                        dataKey="score"
                        fill="#2b3a67"
                        radius={[0, 6, 6, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-12">
              Select a city to see its full comfort breakdown.
            </p>
          )}
        </div>
      </div>

      {source && (
        <p className="mt-4 text-xs text-slate-400">
          Data source:{" "}
          {source === "cache" ? "server cache" : "live OpenWeatherMap fetch"}
        </p>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="font-display text-lg font-semibold">{value}</p>
    </div>
  );
}
