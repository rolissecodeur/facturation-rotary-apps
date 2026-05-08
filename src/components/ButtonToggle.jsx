import React from "react";
import { useTheme } from "../contexts/useTheme";
import { SunDim, Moon } from "lucide-react";

export default function ButtonToggle() {
  const { dark, toggleDark } = useTheme();

  return (
    <button
      onClick={toggleDark}
      className="
        absolute top-3 right-4
        w-10 h-10 rounded-full 
        flex items-center justify-center 
        bg-gray-200 dark:bg-gray-100 
        text-gray-800 dark:text-green-400 
        shadow-lg hover:shadow-xl 
        transition-all duration-300
      "
      aria-label="Toggle Dark Mode"
    >
      {dark ? <SunDim size={22} /> : <Moon size={22} />}
    </button>
  );
}
