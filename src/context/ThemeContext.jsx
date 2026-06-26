import { createContext, useContext, useState } from "react";

// 1. Create the context
const ThemeContext = createContext();

// 2. Create the provider — wraps the whole app
export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Custom hook — easy way to use the context anywhere
export function useTheme() {
  return useContext(ThemeContext);
}