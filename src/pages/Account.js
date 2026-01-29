// Modern, playful Account page with theme switching
import React, { useState } from "react";
import { ref, set, get, update } from "firebase/database";
import { db } from "../firebase/firebase";
import { v4 as uuidv4 } from "uuid";
import { useTheme } from '../context/ThemeContext';

export default function Account({ onJoin }) {
  const [mode, setMode] = useState(null); // "create" or "join"
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [gameCode, setGameCode] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [started, setStarted] = useState(false);
  
  const { theme, setTheme, currentTheme, themes } = useTheme();

  const generateCode = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  // ✅ Create Game (Host)
  const handleCreateGame = async () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    const newGameCode = generateCode();
    const playerId = uuidv4();

    await set(ref(db, `games/${newGameCode}`), {
      started: false,
      hostId: playerId,
      players: {
        [playerId]: {
          name,
          score: 0,
          card: [],
          isHost: true,
        },
      },
    });

    localStorage.setItem("playerId", playerId);
    localStorage.setItem("gameCode", newGameCode);

    setGameCode(newGameCode);
    setIsHost(true);
    onJoin({ playerId, name, score: 0, card: [], isHost: true, gameCode: newGameCode }, true);
  };

  // ✅ Join Existing Game
  const handleJoinGame = async () => {
    if (!name.trim() || !code.trim()) {
      alert("Please enter your name and game code.");
      return;
    }

    const gameRef = ref(db, `games/${code.toUpperCase()}`);
    const gameSnap = await get(gameRef);

    if (!gameSnap.exists()) {
      alert("Game not found. Check the code and try again.");
      return;
    }

    const gameData = gameSnap.val();
    if (gameData.started) {
      alert("Game has already started. You can't join now.");
      return;
    }

    const playerId = uuidv4();

    await set(ref(db, `games/${code.toUpperCase()}/players/${playerId}`), {
      name,
      score: 0,
      card: [],
      isHost: false,
    });

    localStorage.setItem("playerId", playerId);
    localStorage.setItem("gameCode", code.toUpperCase());

    setGameCode(code.toUpperCase());
    setIsHost(false);
    onJoin({ playerId, name, score: 0, card: [], isHost: false, gameCode: code.toUpperCase() }, false);
  };

  // ✅ Host starts the game
  const handleStartGame = async () => {
    if (!gameCode) return;
    await update(ref(db, `games/${gameCode}`), { started: true });
    setStarted(true);
    alert("Game started! New players can no longer join.");
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: currentTheme.background,
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    floatingShapes: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
    },
    card: {
      background: currentTheme.cardBg,
      borderRadius: '24px',
      padding: '40px',
      width: '100%',
      maxWidth: '520px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      zIndex: 1,
      backdropFilter: 'blur(10px)',
    },
    themeSelector: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      marginBottom: '28px',
      flexWrap: 'wrap',
    },
    themeButton: {
      padding: '12px 20px',
      borderRadius: '50px',
      border: theme === 'halloween' ? '2px solid rgba(255, 255, 255, 0.2)' : '2px solid rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      fontSize: '18px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: '600',
      color: currentTheme.textColor,
    },
    themeButtonActive: {
      background: currentTheme.primaryColor,
      color: 'white',
      transform: 'scale(1.05)',
      boxShadow: `0 6px 20px ${currentTheme.primaryColor}60`,
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px',
    },
    logo: {
      fontSize: '72px',
      marginBottom: '16px',
      display: 'inline-block',
      animation: 'bounce 2s infinite',
    },
    spotItBadge: {
      display: 'inline-block',
      background: `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`,
      color: 'white',
      padding: '8px 24px',
      borderRadius: '50px',
      fontSize: '16px',
      fontWeight: '800',
      letterSpacing: '3px',
      marginBottom: '16px',
      boxShadow: `0 4px 15px ${currentTheme.primaryColor}50`,
    },
    title: {
      margin: '0',
      fontSize: '38px',
      fontWeight: '800',
      background: `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      letterSpacing: '-0.5px',
    },
    subtitle: {
      margin: '12px 0 0',
      color: currentTheme.lightText,
      fontSize: '17px',
      fontWeight: '500',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    rules: {
      background: theme === 'halloween' ? 'rgba(255, 107, 53, 0.15)' : 
                  theme === 'christmas' ? 'rgba(22, 91, 51, 0.15)' : 
                  'rgba(102, 126, 234, 0.15)',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '8px',
      border: `2px solid ${currentTheme.accentColor}40`,
    },
    rulesTitle: {
      margin: '0 0 12px',
      fontSize: '19px',
      fontWeight: '700',
      color: currentTheme.textColor,
    },
    rulesText: {
      margin: '0',
      color: currentTheme.lightText,
      lineHeight: '1.7',
      fontSize: '15px',
    },
    sectionTitle: {
      margin: '0 0 12px',
      fontSize: '24px',
      fontWeight: '700',
      color: currentTheme.textColor,
    },
    description: {
      margin: '0 0 16px',
      color: currentTheme.lightText,
      fontSize: '15px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    input: {
      padding: '16px 20px',
      borderRadius: '12px',
      border: `2px solid ${currentTheme.primaryColor}30`,
      fontSize: '16px',
      width: '100%',
      boxSizing: 'border-box',
      background: theme === 'halloween' ? 'rgba(255, 255, 255, 0.05)' : 'white',
      color: currentTheme.textColor,
      transition: 'all 0.3s ease',
      outline: 'none',
      fontWeight: '500',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '8px',
    },
    button: {
      padding: '16px 28px',
      borderRadius: '12px',
      border: 'none',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    },
    primaryButton: {
      background: `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`,
      color: 'white',
      flex: 1,
      boxShadow: `0 6px 20px ${currentTheme.primaryColor}40`,
      transform: 'translateY(0)',
    },
    secondaryButton: {
      background: theme === 'halloween' ? 'rgba(255, 255, 255, 0.1)' : 
                  'rgba(0, 0, 0, 0.05)',
      color: currentTheme.textColor,
      flex: 1,
      border: `2px solid ${currentTheme.primaryColor}30`,
    },
    successButton: {
      background: `linear-gradient(135deg, ${currentTheme.accentColor}, ${currentTheme.primaryColor})`,
      color: 'white',
      width: '100%',
      boxShadow: `0 6px 20px ${currentTheme.accentColor}40`,
    },
    linkButton: {
      background: 'transparent',
      color: currentTheme.lightText,
      border: 'none',
      textDecoration: 'underline',
    },
    gameCode: {
      background: `linear-gradient(135deg, ${currentTheme.primaryColor}20, ${currentTheme.secondaryColor}20)`,
      padding: '28px',
      borderRadius: '16px',
      fontSize: '36px',
      fontFamily: 'monospace',
      textAlign: 'center',
      letterSpacing: '6px',
      color: currentTheme.primaryColor,
      marginBottom: '12px',
      border: `3px dashed ${currentTheme.primaryColor}`,
      fontWeight: '800',
    },
    success: {
      color: currentTheme.accentColor,
      textAlign: 'center',
      fontWeight: '600',
      fontSize: '16px',
    },
  };

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        input:focus {
          border-color: ${currentTheme.primaryColor} !important;
          box-shadow: 0 0 0 3px ${currentTheme.primaryColor}20;
        }
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px ${currentTheme.primaryColor}50 !important;
        }
        button:active:not(:disabled) {
          transform: translateY(0);
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
      
      <div style={styles.container}>
        {/* Floating decorative shapes */}
        <div style={styles.floatingShapes}>
          <div style={{...styles.shape, width: '200px', height: '200px', background: currentTheme.accentColor, top: '10%', left: '5%'}}></div>
          <div style={{...styles.shape, width: '150px', height: '150px', background: currentTheme.primaryColor, top: '60%', right: '10%'}}></div>
          <div style={{...styles.shape, width: '100px', height: '100px', background: currentTheme.secondaryColor, bottom: '15%', left: '15%'}}></div>
        </div>

        <div style={styles.card}>
          {/* Theme Selector */}
          <div style={styles.themeSelector}>
            {Object.entries(themes).map(([key, themeData]) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                style={{
                  ...styles.themeButton,
                  ...(theme === key ? styles.themeButtonActive : {}),
                }}
              >
                <span>{themeData.emoji}</span>
                <span style={{fontSize: '14px'}}>{themeData.name}</span>
              </button>
            ))}
          </div>

          <div style={styles.header}>
            <div style={styles.logo}>{currentTheme.emoji}</div> <br></br>
            <div style={styles.spotItBadge}>SPOT IT! </div>
          </div>

          <div style={styles.content}>
            {/* Game Rules */}
            <div style={styles.rules}>
              <h3 style={styles.rulesTitle}>🎮 How to Play</h3>
              <p style={styles.rulesText}>
                Find the one matching symbol between any two cards - there's always exactly one match! Be the first to spot and click it to win the card. ⚡️
              </p>
            </div>

            {/* Choose mode */}
            {!mode && (
              <div style={styles.buttonGroup}>
                <button onClick={() => setMode("create")} style={{...styles.button, ...styles.primaryButton}}>
                  ✨ Create Game
                </button>
                <button onClick={() => setMode("join")} style={{...styles.button, ...styles.secondaryButton}}>
                  🚀 Join Game
                </button>
              </div>
            )}

            {/* CREATE FLOW */}
            {mode === "create" && !gameCode && (
              <div style={styles.form}>
                <h3 style={styles.sectionTitle}>Create New Game</h3>
                <p style={styles.description}>You'll be the host of this game session</p>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  style={styles.input}
                />
                <div style={styles.buttonGroup}>
                  <button onClick={handleCreateGame} style={{...styles.button, ...styles.primaryButton}} disabled={!name.trim()}>
                    Create Game
                  </button>
                  <button onClick={() => setMode(null)} style={{...styles.button, ...styles.linkButton}}>
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {/* Show code once created */}
            {gameCode && isHost && (
              <div style={styles.form}>
                <h3 style={styles.sectionTitle}>🎉 Game Created!</h3>
                <p style={styles.description}>Share this code with other players:</p>
                <div style={styles.gameCode}>{gameCode}</div>
                {!started ? (
                  <button
                    onClick={handleStartGame}
                    style={{...styles.button, ...styles.successButton}}
                  >
                    🎯 Start Game
                  </button>
                ) : (
                  <p style={styles.success}>✅ Game has started! Waiting for players...</p>
                )}
              </div>
            )}

            {/* JOIN FLOW */}
            {mode === "join" && (
              <div style={styles.form}>
                <h3 style={styles.sectionTitle}>Join Existing Game</h3>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter game code"
                  style={styles.input}
                />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  style={styles.input}
                />
                <div style={styles.buttonGroup}>
                  <button 
                    onClick={handleJoinGame} 
                    style={{...styles.button, ...styles.primaryButton}}
                    disabled={!name.trim() || !code.trim()}
                  >
                    Join Game
                  </button>
                  <button onClick={() => setMode(null)} style={{...styles.button, ...styles.linkButton}}>
                    ← Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
