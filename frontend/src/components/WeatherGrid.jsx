import WeatherCard from "./WeatherCard";

export default function WeatherGrid({ cities, selectedCode, onSelect }) {
  if (cities.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400 py-8 text-center">No cities to show.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cities.map((city) => (
        <WeatherCard
          key={city.cityCode}
          city={city}
          selected={city.cityCode === selectedCode}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
