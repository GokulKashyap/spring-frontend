import { createContext, useState } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const toggle = () => setDarkMode(prev => !prev);
  return (
    <ThemeContext.Provider value={{ darkMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
