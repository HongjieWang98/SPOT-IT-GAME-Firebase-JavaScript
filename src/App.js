// import React, { useState, useEffect } from "react";
// import Account from "./pages/Account";
// import Player from "./pages/Player";
// import Host from "./pages/Host";
// // import { ref, onValue, set, get } from "firebase/database";
// // Hongjie: add remove import for cleanup from firebase
// import { ref, onValue, set, get, remove } from "firebase/database"; 
// import { db } from "./firebase/firebase";
// import { generateDeck } from "./helpers/generateDeck";
// import { shuffleDeck } from "./helpers/shuffleDeck";
// import { Leaderboard } from "./pages/Host";

// function App() {
//   const [player, setPlayer] = useState(null);
//   const [centerCard, setCenterCard] = useState([]);
//   const [remainingDeck, setRemainingDeck] = useState([]);
//   const [isHost, setIsHost] = useState(false);
//   const [gameStarted, setGameStarted] = useState(false);
//   const [winner, setWinner] = useState(null);

//   // ✅ Restore from local storage if user refreshes
//   useEffect(() => {
//     const savedPlayerId = localStorage.getItem("playerId");
//     if (!savedPlayerId) return;

//     const playerRef = ref(db, `players/${savedPlayerId}`);
//     get(playerRef).then((snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         setPlayer({ ...data, playerId: savedPlayerId });
//         setIsHost(data.isHost || false);
//       }
//     });
//   }, []);

//   // ✅ Keep host flag synced live
//   useEffect(() => {
//     if (!player) return;
//     const hostRef = ref(db, `players/${player.playerId}/isHost`);
//     return onValue(hostRef, (snap) => {
//       setIsHost(snap.val() || false);
//     });
//   }, [player]);

//   // ✅ Listen for game start
//   useEffect(() => {
//     const gameRef = ref(db, "gameState/started");
//     return onValue(gameRef, (snapshot) => {
//       setGameStarted(snapshot.val() || false);
//     });
//   }, []);

//   // ✅ Listen for center card
//   useEffect(() => {
//     const centerRef = ref(db, "centerCard");
//     return onValue(centerRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) setCenterCard(data);
//     });
//   }, []);

//   // ✅ Listen for remaining deck
//   useEffect(() => {
//     const deckRef = ref(db, "remainingDeck");
//     return onValue(deckRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) setRemainingDeck(data);
//     });
//   }, []);



//   // ✅ Listen for winner
//   useEffect(() => {
//     const winnerRef = ref(db, "gameState/winner");
//     return onValue(winnerRef, (snapshot) => {
//       setWinner(snapshot.val() || null);
//     });
//   }, []);

//   // ✅ When joining
//   const handleJoin = async (playerInfo, hostFlag) => {
//     // Double check against Firebase
//     const playerSnap = await get(ref(db, `players/${playerInfo.playerId}`));
//     const playerData = playerSnap.val() || {};
//     setPlayer({ ...playerInfo, ...playerData });
//     setIsHost(playerData.isHost || hostFlag);
//   };

//   // ✅ Only host can start game
//   const startGame = async () => {
//     if (!isHost) return;

//     const deck = generateDeck(12);
//     const shuffledDeck = shuffleDeck(deck);
//     console.log({deck, shuffledDeck})
//     const playersSnap = await get(ref(db, "players"));
//     const playersData = playersSnap.val() || {};
//     const playerIds = Object.keys(playersData);

//     // Deal cards (skip none if you want host to play too)
//     playerIds.forEach((id) => {
//       const currentCard = shuffledDeck.pop();
//       set(ref(db, `players/${id}/card`), currentCard);
//     });

//     const centerCard = shuffledDeck.pop();
//     await set(ref(db, "centerCard"), centerCard);
//     await set(ref(db, "remainingDeck"), shuffledDeck);
//     await set(ref(db, "gameState/started"), true);
//     await set(ref(db, "gameState/winner"), null);

//     setCenterCard(centerCard);
//     setRemainingDeck(shuffledDeck);
//   };

//   // Hongjie: Add restart game function
//   // ✅ Restart game - Clear Firebase and reset state
//   const restartGame = async () => {

//     if (!isHost && !winner) {
//       alert("Only the host can restart the game!");
//       return;
//     }

//     const confirmed = window.confirm(
//       "Are you sure you want to restart the game? This will clear all progress and disconnect all players."
//     );
    
//     if (!confirmed) return;

//     try {
//       // Delete all game data from Firebase
//       await remove(ref(db, "gameState"));
//       await remove(ref(db, "centerCard"));
//       await remove(ref(db, "remainingDeck"));
//       await remove(ref(db, "players"));

//       // Clear local storage
//       localStorage.removeItem("playerId");

//       // Reset all state
//       setPlayer(null);
//       setCenterCard([]);
//       setRemainingDeck([]);
//       setIsHost(false);
//       setGameStarted(false);
//       setWinner(null);

//       console.log("Game restarted successfully!");
//     } catch (error) {
//       console.error("Error restarting game:", error);
//     }
//   };

//   if (winner) {
//     return (
//       <div style={{ textAlign: "center", marginTop: 50 }}>
//         <h1>🎉 We have a winner! 🎉</h1>
//         <Leaderboard />
//         <button 
//           onClick={restartGame} 
//           style={{ 
//             marginTop: 30, 
//             padding: "15px 30px", 
//             fontSize: "18px",
//             backgroundColor: "#4CAF50",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer"
//           }}
//         >
//           Restart Game
//         </button>
//       </div>
//     );
//   }
//   return (
//     <div>
//       {!gameStarted && !player && <Account onJoin={handleJoin} />}
//       {player && !gameStarted && isHost && (
//         <div style={{ textAlign: "center", marginTop: 50 }}>
//           <h2>Welcome {player.name}! You are the host.</h2>
//           <button onClick={startGame}>Start Game</button>
//         </div>
//       )}
//       {player && !isHost && !gameStarted && (
//         <div style={{ textAlign: "center", marginTop: 50 }}>
//           <h2>Welcome {player.name}! Waiting for host to start the game...</h2>
//         </div>
//       )}
//       {gameStarted && isHost && (
//         <div>
//           <div style={{ 
//             position: "fixed", 
//             top: 20, 
//             right: 20, 
//             zIndex: 1000 
//           }}>
//             <button 
//               onClick={restartGame}
//               style={{
//                 padding: "10px 20px",
//                 fontSize: "14px",
//                 backgroundColor: "#f44336",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "5px",
//                 cursor: "pointer",
//                 fontWeight: "bold"
//               }}
//             >
//               🔄 Restart Game (Admin)
//             </button>
//           </div>
//           <Host />
//         </div>
//       )}

//       {player && gameStarted && !isHost && (
//         <Player
//           player={player}
//           centerCard={centerCard}
//           setCenterCard={setCenterCard}
//           remainingDeck={remainingDeck}
//           setRemainingDeck={setRemainingDeck}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import Account from "./pages/Account";
import Player from "./pages/Player";
import Host from "./pages/Host";
import Leaderboard from './pages/Leaderboard'
import RemainingCount from './components/RemainingCount';
import ThemeSelector from './components/ThemeSelector';
import { ref, onValue, set, get, remove } from "firebase/database";
import { db } from "./firebase/firebase";
import { generateDeck } from "./helpers/generateDeck";
import { shuffleDeck } from "./helpers/shuffleDeck";
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const { currentTheme } = useTheme();
  const [player, setPlayer] = useState(null);
  const [gameState, setGameState] = useState({});
  const [centerCard, setCenterCard] = useState([]);
  const [remainingDeck, setRemainingDeck] = useState([]);
  const [winner, setWinner] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(true);

  // ✅ Restore from localStorage if refreshed
  useEffect(() => {
    const savedPlayerId = localStorage.getItem("playerId");
    const savedGameCode = localStorage.getItem("gameCode");
    if (!savedPlayerId || !savedGameCode) return;

    const playerRef = ref(db, `games/${savedGameCode}/players/${savedPlayerId}`);
    get(playerRef).then((snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setPlayer({ ...data, playerId: savedPlayerId, gameCode: savedGameCode });
      }
    });
  }, []);

  // ✅ Subscribe to game state
  useEffect(() => {
    if (!player?.gameCode) return;
    const gameRef = ref(db, `games/${player.gameCode}`);
    const unsub = onValue(gameRef, (snap) => {
      setGameState(snap.val() || {});
    });
    return () => unsub();
  }, [player]);

 

  // ✅ Handle player join
  const handleJoin = (playerInfo) => {
    setPlayer(playerInfo);
  };

  // ✅ Handle player leaving (non-host)
  const handleLeave = async () => {
    if (!player || !player.gameCode || !player.playerId) return;
    const gamePath = `games/${player.gameCode}/players/${player.playerId}`;
    try {
      // Remove player from the game's players list
      await remove(ref(db, gamePath));

      // Clear local storage keys for this player
      localStorage.removeItem("playerId");
      localStorage.removeItem("gameCode");

      // Reset local app state to show Account screen
      setPlayer(null);
      setGameState({});
      setCenterCard([]);
      setRemainingDeck([]);
    } catch (err) {
      console.error("Error leaving game:", err);
      alert("Could not leave the game. Try again.");
    }
  };

  // ✅ Host starts the game
  const startGame = async () => {
    if (!player?.isHost) return;
    const gamePath = `games/${player.gameCode}`;
    const deck = generateDeck(8);
    const shuffledDeck = shuffleDeck(deck);

    const playersSnap = await get(ref(db, `${gamePath}/players`));
    const playersData = playersSnap.val() || {};
    const playerIds = Object.keys(playersData);

    // Deal cards
    playerIds.forEach((id) => {
      const currentCard = shuffledDeck.pop();
      set(ref(db, `${gamePath}/players/${id}/card`), currentCard);
    });

    const centerCard = shuffledDeck.pop();
    await set(ref(db, `${gamePath}/centerCard`), centerCard);
    await set(ref(db, `${gamePath}/remainingDeck`), shuffledDeck);
    await set(ref(db, `${gamePath}/started`), true);
    await set(ref(db, `${gamePath}/winner`), null);
  };

  // ✅ Restart Game (host only)
  const restartGame = async () => {
    if (!player?.isHost) {
      alert("Only host can restart the game.");
      return;
    }

    const confirmed = window.confirm("Restart game? This clears all progress.");
    if (!confirmed) return;

    const gamePath = `games/${player.gameCode}`;
    await remove(ref(db, gamePath));

    localStorage.removeItem("playerId");
    localStorage.removeItem("gameCode");

    setPlayer(null);
    setGameState({});
    setCenterCard([]);
    setRemainingDeck([]);
    setWinner(null);
  };

  // ✅ Winner screen
  if (gameState.winner) {
    return (
      <div style={{ 
        textAlign: "center", 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: currentTheme.background,
        padding: '20px'
      }}>
        <div style={{
          background: currentTheme.cardBg,
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}>
          <h1 style={{ color: currentTheme.textColor }}>🎉 We have a winner! 🎉</h1>
          <Leaderboard gameCode={player.gameCode} />
          <button
            onClick={restartGame}
            style={{
              marginTop: 30,
              padding: "15px 30px",
              fontSize: "18px",
              background: `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`,
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: `0 6px 20px ${currentTheme.primaryColor}40`,
            }}
          >
            Restart Game
          </button>
        </div>
      </div>
    );
  }

  // ✅ Lobby states
  if (!player) return <Account onJoin={handleJoin} />;

  const started = gameState.started || false;

  if (!started && player.isHost) {
    return (
      <div style={{ 
        textAlign: "center", 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: currentTheme.background,
        padding: '20px'
      }}>
        <div style={{
          background: currentTheme.cardBg,
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <h2 style={{ color: currentTheme.textColor, fontSize: '28px', marginBottom: '20px' }}>
            Welcome {player.name}! 🎮
          </h2>
          <p style={{ color: currentTheme.lightText, fontSize: '16px' }}>You are the host.</p>
          <div style={{
            background: `linear-gradient(135deg, ${currentTheme.primaryColor}20, ${currentTheme.secondaryColor}20)`,
            padding: '20px',
            borderRadius: '12px',
            margin: '20px 0',
            border: `2px dashed ${currentTheme.primaryColor}`
          }}>
            <p style={{ color: currentTheme.lightText, margin: '0 0 8px' }}>Game Code:</p>
            <strong style={{ 
              fontSize: '32px', 
              fontFamily: 'monospace',
              color: currentTheme.primaryColor,
              letterSpacing: '4px'
            }}>{player.gameCode}</strong>
          </div>
          <button 
            onClick={startGame}
            style={{
              padding: "16px 32px",
              fontSize: "18px",
              background: `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`,
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "bold",
              width: '100%',
              boxShadow: `0 6px 20px ${currentTheme.primaryColor}40`,
            }}
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (!started && !player.isHost) {
    return (
      <div style={{ 
        textAlign: "center", 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: currentTheme.background,
        padding: '20px'
      }}>
        <div style={{
          background: currentTheme.cardBg,
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <h2 style={{ color: currentTheme.textColor, fontSize: '28px', marginBottom: '20px' }}>
            Welcome {player.name}! 👋
          </h2>
          <p style={{ color: currentTheme.lightText, fontSize: '16px', marginBottom: '20px' }}>
            Waiting for host to start the game...
          </p>
          <div style={{
            background: `linear-gradient(135deg, ${currentTheme.primaryColor}20, ${currentTheme.secondaryColor}20)`,
            padding: '20px',
            borderRadius: '12px',
            border: `2px dashed ${currentTheme.primaryColor}`
          }}>
            <p style={{ color: currentTheme.lightText, margin: '0 0 8px' }}>Game Code:</p>
            <strong style={{ 
              fontSize: '32px', 
              fontFamily: 'monospace',
              color: currentTheme.primaryColor,
              letterSpacing: '4px'
            }}>{player.gameCode}</strong>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Game started
  if (started && player.isHost) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: currentTheme.background,
        position: 'relative'
      }}>
        <ThemeSelector />
        {showLeaderboard && (
          <Leaderboard 
            gameCode={player.gameCode} 
            compact={true} 
            onClose={() => setShowLeaderboard(false)}
          />
        )}
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <button
            onClick={restartGame}
            style={{
              padding: "12px 20px",
              fontSize: "14px",
              background: `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`,
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: `0 4px 15px ${currentTheme.primaryColor}40`,
            }}
          >
            🔄 Restart Game
          </button>
          {!showLeaderboard && (
            <button
              onClick={() => setShowLeaderboard(true)}
              style={{
                padding: "12px 20px",
                fontSize: "14px",
                background: `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`,
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: `0 4px 15px ${currentTheme.primaryColor}40`,
              }}
            >
              📊 Leaderboard
            </button>
          )}
        </div>
        <Host player={player} gameCode={player.gameCode} remainingDeck={remainingDeck}
        setRemainingDeck={setRemainingDeck}/>
      </div>
    );
  }

  if (started && !player.isHost) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: currentTheme.background,
        position: 'relative'
      }}>
        <ThemeSelector />
        {showLeaderboard && (
          <Leaderboard 
            gameCode={player.gameCode} 
            compact={true} 
            onClose={() => setShowLeaderboard(false)}
          />
        )}
        <Player
          player={player}
          gameCode={player.gameCode}
          centerCard={centerCard}
          setCenterCard={setCenterCard}
          remainingDeck={remainingDeck}
          setRemainingDeck={setRemainingDeck}
          onLeave={handleLeave}
          showLeaderboard={showLeaderboard}
          setShowLeaderboard={setShowLeaderboard}
        />
      </div>
    );
  }

  return <p>Loading...</p>;
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
