import React, { useState, useEffect } from 'react';
import "./ThemeToggle.scss";
const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme); // lưu theme
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return <button onClick={toggleTheme} id="ThemeToggle">Chuyển sang {theme === 'light' ? 'tối' : 'sáng'}</button>;
};

export default ThemeToggle;
