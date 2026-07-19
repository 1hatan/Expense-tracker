import { NavLink } from "react-router-dom";
import { FiGrid, FiTrendingDown, FiTrendingUp, FiPieChart, FiUser, FiSettings, FiX } from "react-icons/fi";

const LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/expenses", label: "Expenses", icon: FiTrendingDown },
  { to: "/income", label: "Income", icon: FiTrendingUp },
  { to: "/reports", label: "Reports", icon: FiPieChart },
  { to: "/profile", label: "Profile", icon: FiUser },
  { to: "/settings", label: "Settings", icon: FiSettings },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 transition-transform duration-300 flex flex-col
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <span className="font-display font-bold text-lg">
            <span className="text-primary-500">Expense</span>Tracker
          </span>
          <button className="lg:hidden text-slate-500" onClick={onClose} aria-label="Close menu">
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
