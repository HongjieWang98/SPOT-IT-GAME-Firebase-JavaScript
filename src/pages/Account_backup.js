// This is the page that users will land on when they are trying to create an "account" 
// (aka add their name to the game)

import React, { useState } from "react";
import { ref, set, get, update } from "firebase/database";
import { db } from "../firebase/firebase";
import { v4 as uuidv4 } from "uuid";

// export default function Account({ onJoin }) {
//   const [name, setName] = useState("");

//   const handleJoin = async () => {
//     const gameStartedSnap = await get(ref(db, "gameState/started"));
//     if (gameStartedSnap.val() === true) {
//       alert("Game already started. You cannot join now.");
//       return;
//     }

//     const playerId = uuidv4();
//     await set(ref(db, `players/${playerId}`), { name, score: 0, Card: [] });

//     // Check or assign host
//     const hostSnap = await get(ref(db, "gameState/hostId"));
//     let isHost = false;
//     if (!hostSnap.exists()) {
//       await set(ref(db, "gameState/hostId"), playerId);
//       isHost = true;
//     } else {
//       isHost = hostSnap.val() === playerId;
//     }

//     onJoin({ playerId, name, score: 0, Card: [] }, isHost);
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: 50 }}>
//       <h2>Enter your name to join:</h2>
//       <input value={name} onChange={(e) => setName(e.target.value)} />
//       <button onClick={handleJoin} disabled={!name}>Join Game</button>
//     </div>
//   );
// }


// export default function Account({ onJoin }) {
//   const [name, setName] = useState("");

//   const handleJoin = async () => {
//     const gameStartedSnap = await get(ref(db, "gameState/started"));
//     if (gameStartedSnap.val() === true) {
//       alert("Game already started. You cannot join now.");
//       return;
//     }

//     const playerId = uuidv4();
//     const hostSnap = await get(ref(db, "gameState/hostId"));
//     let isHost = false;

//     // ✅ If there's no host, this player becomes the host
//     if (!hostSnap.exists()) {
//       isHost = true;
//       await set(ref(db, "gameState/hostId"), playerId);
//     }

//     // ✅ Create the player record with correct host flag
//     await set(ref(db, `players/${playerId}`), {
//       name,
//       score: 0,
//       card: [],
//       isHost
//     });

//     onJoin({ playerId, name, score: 0, card: [] }, isHost);
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: 50 }}>
//       <h2>Enter your name to join:</h2>
//       <input value={name} onChange={(e) => setName(e.target.value)} />
//       <button onClick={handleJoin} disabled={!name}>Join Game</button>
//     </div>
//   );
// }


// try 3

// export default function Account({ onJoin }) {
//   const [name, setName] = useState("");

//   const handleJoin = async () => {
//     const gameStartedSnap = await get(ref(db, "gameState/started"));
//     if (gameStartedSnap.val() === true) {
//       alert("Game already started. You cannot join now.");
//       return;
//     }

//     const playerId = uuidv4();
//     const hostSnap = await get(ref(db, "gameState/hostId"));
//     let isHost = false;

//     // ✅ First player becomes host
//     if (!hostSnap.exists() || !hostSnap.val()) {
//       isHost = true;
//       await set(ref(db, "gameState/hostId"), playerId);
//     }

//     // ✅ Create player with host flag
//     await set(ref(db, `players/${playerId}`), {
//       name,
//       score: 0,
//       card: [],
//       isHost,
//     });

//     // ✅ Save locally so App can recheck on reload
//     localStorage.setItem("playerId", playerId);

//     onJoin({ playerId, name, score: 0, card: [] }, isHost);
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: 50 }}>
//       <h2>Welcome to Digital Spot It!</h2>
//       <h2>Enter your name to join:</h2>
//       <input value={name} onChange={(e) => setName(e.target.value)} />
//       <button onClick={handleJoin} disabled={!name}>
//         Join Game
//       </button>
//     </div>
//   );
// }

export default function Account({ onJoin }) {
  const [mode, setMode] = useState(null); // "create" or "join"
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [gameCode, setGameCode] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [started, setStarted] = useState(false);
  const [theme, setTheme] = useState('default'); // 'default', 'halloween', 'christmas'

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
      alert("Game has already started. You can’t join now.");
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

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>Welcome to Digital Spot It!</h2>

      {/* Choose mode */}
      {!mode && (
        <>
          <button onClick={() => setMode("create")} style={{ margin: 10 }}>
            Create Game
          </button>
          <button onClick={() => setMode("join")} style={{ margin: 10 }}>
            Join Game
          </button>
        </>
      )}

      <h3>hi this is the explantion of the game rule
        <br/>
        Spot it! is a speed and observation game for the whole family. The aim of the game?  <br/>
        There is always one, and only one, matching symbol between any two cards. Be the first to find and name it to win the card. 
      </h3>

      {/* CREATE FLOW */}
      {mode === "create" && !gameCode && (
        <div style={{ marginTop: 20 }}>
          <h3>Create Game (You’ll be the Host)</h3>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
          <br />
          <button onClick={handleCreateGame} style={{ marginTop: 10 }}>
            Create
          </button>
        </div>
      )}

      {/* Show code once created */}
      {gameCode && isHost && (
        <div style={{ marginTop: 20 }}>
          <h3>Game Created!</h3>
          <p>Share this code with players:</p>
          <h2>{gameCode}</h2>
          {!started && (
            <button
              onClick={handleStartGame}
              style={{
                marginTop: 20,
                padding: "8px 16px",
                background: "green",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Start Game
            </button>
          )}
          {started && <p style={{ color: "green" }}>Game has started!</p>}
        </div>
      )}

      {/* JOIN FLOW */}
      {mode === "join" && (
        <div style={{ marginTop: 20 }}>
          <h3>Join Existing Game</h3>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter game code"
          />
          <br />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            style={{ marginTop: 5 }}
          />
          <br />
          <button onClick={handleJoinGame} style={{ marginTop: 10 }}>
            Join
          </button>
        </div>
      )}
    </div>
  );
}
