import React from 'react';
import { useTheme } from '../context/ThemeContext';

// Shows a modern card count badge on the right side
export default function RemainingCount({ remainingDeck }) {
  const { currentTheme } = useTheme();
  
  // remainingDeck from Firebase can be an array or an object (keyed).
  let count = 0;
  if (!remainingDeck) count = 0;
  else if (Array.isArray(remainingDeck)) count = remainingDeck.length;
  else if (typeof remainingDeck === 'object') count = Object.keys(remainingDeck).length;

  const styles = {
    container: {
      background: currentTheme.cardBg,
      borderRadius: '8px',
      padding: '4px 8px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(10px)',
      minWidth: '140px',
      border: `2px solid ${currentTheme.primaryColor}40`,
      margin: '20px auto',
      maxWidth: '240px',
    },
    countContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      justifyContent: 'center',
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: currentTheme.lightText,
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    count: {
      fontSize: '14px',
      fontWeight: '800',
      background: `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
  };

  return (
    <div style={styles.container} aria-live="polite">
      <div style={styles.countContainer}>
        <span style={styles.label}>Remaining Cards:</span>
        <span style={styles.count}>{count}</span>
      </div>
    </div>
  );
}

