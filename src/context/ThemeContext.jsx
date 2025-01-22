import React, { createContext, useState, useEffect, useContext } from "react";
import { getFromLocalStorage, saveToLocalStorage } from '../services/localStorage.js';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = getFromLocalStorage("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    saveToLocalStorage("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};