// src/hooks/useTheme.js
import { useState } from 'react';



const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleTheme = () => setIsDarkMode(prev => !prev);
  return { isDarkMode, toggleTheme };
};

export default useTheme; // Exportação padrão