/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef1ff",
          100: "#e0e4ff",
          400: "#7c8bff",
          500: "#5b6ef5",
          600: "#4a58d6",
          700: "#3c47ac",
        },
        accent: {
          400: "#2dd4bf",
          500: "#17b3a3",
        },
        income: "#17b3a3",
        expense: "#e0616b",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 12px 30px -14px rgba(26, 31, 46, 0.18)",
      },
      borderRadius: {
        xl2: "1.1rem",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
