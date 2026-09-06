export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-500 dark:text-slate-400">
      <span
        className="h-8 w-8 rounded-full border-2 border-dusk/30 border-t-dusk animate-spin"
        aria-hidden="true"
      />
      <p className="text-sm">{message}</p>
    </div>
  );
}
