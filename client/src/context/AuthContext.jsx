import { createContext, useEffect, useState, useCallback } from "react";
import api from "../api/axios.js";

export const AuthContext = createContext(null);

function readStoredAuth() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const rawUser = localStorage.getItem("user") || sessionStorage.getItem("user");
  return { token, user: rawUser ? JSON.parse(rawUser) : null };
}

const DEFAULT_PUBLIC_USER = {
  name: "Expense Tracker User",
  email: "public@expensetracker.local",
  currency: "INR",
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredAuth().user || DEFAULT_PUBLIC_USER);
  const [token, setToken] = useState(() => readStoredAuth().token || "open-access-token");
  const [loading, setLoading] = useState(true);

  // Sync public user from backend
  useEffect(() => {
    async function sync() {
      try {
        const { data } = await api.get("/auth/me");
        if (data.user) {
          setUser(data.user);
        }
      } catch {
        // Fallback to default user if server offline
      } finally {
        setLoading(false);
      }
    }
    sync();
  }, []);

  const login = useCallback(async () => user, [user]);
  const register = useCallback(async () => user, [user]);
  const logout = useCallback(() => {}, []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAuthenticated: true, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
