import { useEffect, useState } from 'react';

export function ThemeSwitch({ className = '' }) {
  const getInitialTheme = () => {
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    } 
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'dark'; 
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme); // guardar preferencia
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button onClick={toggleTheme} className={`ThemeSwitch ${className}`}>
      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    </button>
  );
}
