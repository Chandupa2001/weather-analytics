import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  const [dark, setDark] = useState(
    () =>
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <header className="border-b border-slate-200 dark:border-slate-700/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <span className="font-display text-lg font-semibold">
          Weather Analytics
        </span>

        <div className="flex items-center gap-3">
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setDark((d) => !d)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
          >
            {dark ? (
              <Sun size={19} strokeWidth={2} />
            ) : (
              <Moon size={19} strokeWidth={2} />
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-slate-600 dark:text-slate-300">
                {user?.email}
              </span>

              <button
                onClick={() =>
                  logout({
                    logoutParams: {
                      returnTo: window.location.origin,
                    },
                  })
                }
                className="rounded-full border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <button
              onClick={() => loginWithRedirect()}
              className="rounded-full bg-dusk text-white px-5 py-2 text-sm font-semibold hover:bg-dusk/90 transition-colors"
            >
              Log in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
