import { Button } from '@/components/ui/button.tsx';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import useSound from 'use-sound';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [playOn] = useSound('/sounds/switch-on.mp3');
  const [playOff] = useSound('/sounds/switch-off.mp3');

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setTheme(isDarkMode ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    const isDarkMode = theme === 'dark';
    document.documentElement.classList[isDarkMode ? 'add' : 'remove']('dark');
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);

    if (nextTheme === 'light') {
      playOn();
    } else {
      playOff();
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title="Toggle theme"
    >
      <SunIcon className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <MoonIcon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export { ThemeToggle };
