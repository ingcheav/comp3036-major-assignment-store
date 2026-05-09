"use client";

import { Button } from "@repo/ui/button";
import { useTheme } from "./ThemeContext";

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();                      // get the theme from context

  return (
    <Button onClick={toggleTheme} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition">                                
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </Button>                                                     // show the current theme and toggle on click 
  );
};

export default ThemeSwitch;
