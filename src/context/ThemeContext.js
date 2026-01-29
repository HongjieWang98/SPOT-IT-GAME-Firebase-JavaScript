import React, { createContext, useState, useContext, useEffect } from 'react';
import { createIconMap } from '../iconMap';

const ThemeContext = createContext();

export const themes = {
    default: {
        background: 'linear-gradient(135deg, #fff6c2 0%, #ffd89b 100%)',
        cardBg: 'rgba(255, 250, 230, 0.95)',
        primaryColor: '#F7D56B',
        secondaryColor: '#F2A84D',
        accentColor: '#FFB84D',
        textColor: '#2b2b18',
        lightText: '#7a6743',
        emoji: '🥳',
        name: 'Default',
    },
    halloween: {
        background: 'linear-gradient(135deg, #ff6b35 0%, #4a1c40 100%)',
        cardBg: 'rgba(26, 26, 26, 0.95)',
        primaryColor: '#ff6b35',
        secondaryColor: '#4a1c40',
        accentColor: '#ff9d76',
        textColor: '#fff',
        lightText: '#d4d4d4',
        emoji: '🎃',
        name: 'Halloween',
    },
    christmas: {
        background: 'linear-gradient(135deg, #c94b4b 0%, #165b33 100%)',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        primaryColor: '#c94b4b',
        secondaryColor: '#165b33',
        accentColor: '#ffd700',
        textColor: '#1a202c',
        lightText: '#4a5568',
        emoji: '🎄',
        name: 'Christmas',
    },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage if available
    return localStorage.getItem('spotItTheme') || 'default';
  });

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    localStorage.setItem('spotItTheme', theme);
  }, [theme]);

  const currentTheme = themes[theme];
  const iconMap = createIconMap(theme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentTheme, themes, iconMap }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
