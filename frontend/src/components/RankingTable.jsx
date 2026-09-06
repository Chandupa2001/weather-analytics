import ComfortScore from "./ComfortScore";

export default function RankingTable({ cities, selectedCode, onSelect }) {
  if (cities.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400 py-8 text-center">No cities to show.</p>;
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/60 dark:bg-white/[0.03] overflow-hidden">
      <div
        className="hidden sm:grid grid-cols-[3rem_1fr_8rem_10rem_6rem] gap-4 px-4 py-2 text-xs font-medium
                   uppercase tracking-wide text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700/60"
      >
        <span>Rank</span>
        <span>City</span>
        <span>Temp</span>
        <span>Condition</span>
        <span className="text-right">Score</span>
      </div>

      {cities.map((city) => (
        <button
          key={city.cityCode}
          onClick={() => onSelect?.(city)}
          className={`w-full text-left grid grid-cols-[2.5rem_1fr_auto] sm:grid-cols-[3rem_1fr_8rem_10rem_6rem]
                      items-center gap-3 sm:gap-4 px-4 py-3 border-b border-slate-200 dark:border-slate-700/60
                      last:border-b-0 hover:bg-white/70 dark:hover:bg-white/5 transition-colors
                      ${city.cityCode === selectedCode ? "bg-white dark:bg-white/10" : ""}`}
        >
          <span className="font-display text-lg text-slate-400 dark:text-slate-500">{city.rank}</span>

          <span className="min-w-0">
            <span className="block font-semibold truncate">{city.cityName}</span>
            <span className="block sm:hidden text-xs text-slate-500 dark:text-slate-400 truncate capitalize">
              {city.weather.description}
            </span>
          </span>

          <span className="hidden sm:block text-sm tabular-nums text-slate-600 dark:text-slate-300">
            {Math.round(city.weather.tempC)}&deg;C
          </span>

          <span className="hidden sm:block text-sm text-slate-600 dark:text-slate-300 capitalize truncate">
            {city.weather.description}
          </span>

          <span className="justify-self-end">
            <ComfortScore score={city.comfortIndex} size="sm" showLabel={false} />
          </span>
        </button>
      ))}
    </div>
  );
}
