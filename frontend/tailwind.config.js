/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sky: { 950: "#0b1220" },
        dusk: "#2b3a67",
        dawn: "#e8a33d",
        mist: "#e9eef5",
        comfort: {
          high: "#3aa17e",
          mid: "#e8a33d",
          low: "#d1495b",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
