import { Link } from "react-router-dom";
import { FiMoon, FiSun } from "react-icons/fi";
import useTheme from "../hooks/useTheme.js";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display font-bold text-lg">
          <span className="text-primary-500">Expense</span>Tracker
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark / light mode"
            className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:border-primary-500 transition-colors"
          >
            {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
          </button>
          <Link to="/login" className="btn-outline">
            Log In
          </Link>
          <Link to="/register" className="btn-primary">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
