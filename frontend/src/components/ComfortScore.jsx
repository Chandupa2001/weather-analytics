function toneFor(score) {
  if (score >= 70) return { label: "Comfortable", color: "bg-comfort-high", text: "text-comfort-high" };
  if (score >= 45) return { label: "Moderate", color: "bg-comfort-mid", text: "text-comfort-mid" };
  return { label: "Uncomfortable", color: "bg-comfort-low", text: "text-comfort-low" };
}

export default function ComfortScore({ score, size = "md", showLabel = true }) {
  const tone = toneFor(score);
  const numberSize = size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl";

  return (
    <div className="flex items-center gap-2">
      <span className={`font-display font-semibold tabular-nums ${numberSize}`}>{score}</span>
      {showLabel && (
        <span className={`flex items-center gap-1.5 text-xs font-medium ${tone.text}`}>
          <span className={`h-2 w-2 rounded-full ${tone.color}`} />
          {tone.label}
        </span>
      )}
    </div>
  );
}
