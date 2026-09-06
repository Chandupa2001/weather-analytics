import ComfortScore from "./ComfortScore";

export default function WeatherCard({ city, onSelect, selected }) {
  return (
    <button
      onClick={() => onSelect?.(city)}
      className={`text-left rounded-2xl border p-4 flex flex-col gap-3 transition-colors
                  border-slate-200 dark:border-slate-700/60 bg-white/60 dark:bg-white/[0.03]
                  hover:bg-white/80 dark:hover:bg-white/[0.06]
                  ${selected ? "ring-2 ring-dawn" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold truncate">{city.cityName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">
            {city.weather.description}, {city.country}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-medium px-2 py-1">
          #{city.rank}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <span className="font-display text-2xl font-semibold tabular-nums">
          {Math.round(city.weather.tempC)}&deg;C
        </span>
        <ComfortScore score={city.comfortIndex} size="sm" />
      </div>
    </button>
  );
}
