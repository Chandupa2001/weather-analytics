import { useAuth0 } from "@auth0/auth0-react";

export default function Unauthorized() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="max-w-3xl mx-auto text-center px-6 py-28">
      <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4">
        Know where the weather actually feels good.
      </h1>
      <p className="text-slate-600 dark:text-slate-300 mb-8">
        Log in to see live conditions across a dozen cities, ranked by a custom Comfort Index
        that weighs temperature, humidity, wind and cloud cover. Access is limited to
        whitelisted accounts.
      </p>
      <button
        onClick={() => loginWithRedirect()}
        className="rounded-full bg-dusk text-white px-6 py-3 text-sm font-semibold hover:bg-dusk/90 transition-colors"
      >
        Log in
      </button>
    </div>
  );
}
