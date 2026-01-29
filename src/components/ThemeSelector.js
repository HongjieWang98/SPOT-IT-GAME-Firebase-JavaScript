import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeSelector() {
  const { theme, setTheme, currentTheme, themes } = useTheme();

  const styles = {
    container: {
      position: 'fixed',
      top: '20px',
      left: '20px',
      zIndex: 1000,
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    button: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      fontSize: '20px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonActive: {
      transform: 'scale(1.15)',
      boxShadow: `0 6px 20px ${currentTheme.primaryColor}60`,
      background: currentTheme.primaryColor,
    },
  };

  return (
    <div style={styles.container}>
      {Object.entries(themes).map(([key, themeData]) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          style={{
            ...styles.button,
            ...(theme === key ? styles.buttonActive : {}),
          }}
          title={themeData.name}
        >
          {themeData.emoji}
        </button>
      ))}
    </div>
  );
}
