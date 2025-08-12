import { useEffect, useState } from 'react';

export function ThemeSwitch({ className = '' }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
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
