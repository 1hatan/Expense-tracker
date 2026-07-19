import { createContext, useEffect, useState, useCallback } from "react";
import api from "../api/axios.js";

export const AuthContext = createContext(null);

function readStoredAuth() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const rawUser = localStorage.getItem("user") || sessionStorage.getItem("user");
  return { token, user: rawUser ? JSON.parse(rawUser) : null };
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredAuth().user);
  const [token, setToken] = useState(() => readStoredAuth().token);
  const [loading, setLoading] = useState(true);

  // Verify the stored token is still valid on first load
  useEffect(() => {
    async function verify() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch {
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = (newToken, newUser, rememberMe) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("token", newToken);
    storage.setItem("user", JSON.stringify(newUser));
  };

  const login = useCallback(async (email, password, rememberMe = false) => {
    const { data } = await api.post("/auth/login", { email, password, rememberMe });
    persist(data.token, data.user, rememberMe);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    persist(data.token, data.user, true);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
      storage.setItem("user", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAuthenticated: Boolean(token), login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
