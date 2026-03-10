"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ dark: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDark(true);
  }, []);

  const toggle = () => {
    setDark((prev) => {
      localStorage.setItem("theme", !prev ? "dark" : "light");
      return !prev;
    });
  };

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      <div
        style={{
          background: dark ? "#0f0f13" : "#fff",
          color: dark ? "#f1f5f9" : "#111827",
          minHeight: "100vh",
          transition: "background 0.3s, color 0.3s",
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
