export default function ErrorState({ message, onRetry }) {
  return (
    <div className="mx-auto max-w-md text-center py-16 px-4">
      <div className="rounded-xl border border-comfort-low/40 bg-comfort-low/10 text-comfort-low px-4 py-3 text-sm mb-4">
        Couldn't load weather data{message ? `: ${message}` : "."}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-full bg-dusk text-white px-5 py-2 text-sm font-semibold hover:bg-dusk/90"
        >
          Try again
        </button>
      )}
    </div>
  );
}
