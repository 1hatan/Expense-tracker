import { useState } from "react";
import toast from "react-hot-toast";
import { FiSun, FiMoon } from "react-icons/fi";
import api from "../api/axios.js";
import useAuth from "../hooks/useAuth.js";
import useTheme from "../hooks/useTheme.js";

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "JPY"];

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, updateUser } = useAuth();
  const [currency, setCurrency] = useState(user?.currency || "INR");
  const [saving, setSaving] = useState(false);

  const handleCurrencyChange = async (e) => {
    const value = e.target.value;
    setCurrency(value);
    setSaving(true);
    try {
      const { data } = await api.put("/users/profile", { currency: value });
      updateUser(data.user);
      toast.success("Currency updated");
    } catch {
      toast.error("Could not update currency");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-2xl font-display font-bold">Settings</h2>

      <div className="card p-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold mb-1">Appearance</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark mode.</p>
        </div>
        <button
          onClick={toggleTheme}
          className="w-12 h-12 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:border-primary-500"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-1">Currency</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Used to format amounts across the app.</p>
        <select className="input max-w-xs" value={currency} onChange={handleCurrencyChange} disabled={saving}>
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
