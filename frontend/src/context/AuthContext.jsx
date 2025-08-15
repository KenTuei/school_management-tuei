import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [showWarning, setShowWarning] = useState(false);
  const inactivityLimit = 5 * 60 * 1000; // 5 minutes
  let warningTimeout = null;
  let logoutTimeout = null;

  const resetTimer = () => {
    setShowWarning(false);
    if (warningTimeout) clearTimeout(warningTimeout);
    if (logoutTimeout) clearTimeout(logoutTimeout);
    startTimer();
  };

  const startTimer = () => {
    warningTimeout = setTimeout(() => setShowWarning(true), inactivityLimit - 30 * 1000); // 30s before logout
    logoutTimeout = setTimeout(() => logout(), inactivityLimit);
  };

  useEffect(() => {
    if (user) {
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      startTimer();
    }
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      if (warningTimeout) clearTimeout(warningTimeout);
      if (logoutTimeout) clearTimeout(logoutTimeout);
    };
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await api.post("/api/login", { email, password });
      if (res.data && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setShowWarning(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, showWarning, resetTimer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
