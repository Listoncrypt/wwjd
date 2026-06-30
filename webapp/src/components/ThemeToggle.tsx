import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) {
        return stored === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Initialize on mount
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
    } else if (stored === "light") {
      document.documentElement.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsDark(!isDark)}
      className="rounded-full w-10 h-10 bg-card/50 hover:bg-card border border-border/50 transition-all duration-300 hover:scale-105"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-amber-300" />
    </Button>
  );
};
