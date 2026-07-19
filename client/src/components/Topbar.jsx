import { useState } from "react";
import { FiMenu, FiMoon, FiSun, FiLogOut, FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import useTheme from "../hooks/useTheme.js";

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center justify-between px-4 sm:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <button className="lg:hidden text-slate-600 dark:text-slate-300" onClick={onMenuClick} aria-label="Open menu">
        <FiMenu size={22} />
      </button>

      <h1 className="hidden lg:block font-display font-semibold text-slate-800 dark:text-slate-100">
        Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
      </h1>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark / light mode"
          className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:border-primary-500 transition-colors"
        >
          {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-slate-200 dark:border-slate-700"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <span className="w-8 h-8 rounded-full bg-primary-500 text-white text-xs font-semibold flex items-center justify-center">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            )}
            <FiChevronDown size={14} className="text-slate-500" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-44 card p-1.5 text-sm"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-expense hover:bg-expense/10"
              >
                <FiLogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
