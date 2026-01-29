// import React, { useEffect, useState } from "react";
// import { db } from "../firebase/firebase";
// import { ref, onValue, update, set, get } from "firebase/database";

// export default function Player({ player, centerCard, setCenterCard, remainingDeck, setRemainingDeck }) {
//   const [playerState, setPlayerState] = useState(player);

//   useEffect(() => {
//     const playerRef = ref(db, `players/${player.playerId          </div>
        ))}
      </div>
      <RemainingCount remainingDeck={remainingDeck} />
      <h2>{playerState.name}'s Card</h2>//     // come back to this and understand what it is doing
//     onValue(playerRef, (snapshot) => setPlayerState(snapshot.val() || {}));
//   }, [player.playerId]);

//     const handleClick = async (icon) => {
//         const playerCard = playerState.card;

//         // ✅ Check game is still ongoing
//         const gameSnap = await get(ref(db, "gameState"));
//         const gameStateVal = gameSnap.val() || {};
//         if (gameStateVal.winner) return alert("Game is over!");

//         // ✅ Validation
//         const match = centerCard.includes(icon) && playerCard.includes(icon);
//         console.log({playerCard, centerCard, match})

//         if (!match) return alert("No match! Try again.");

//         const playerRef = ref(db, `players/${player.playerId}`);
//         update(playerRef, { score: (playerState.score || 0) + 1 });
    
//         // check that the remaining deck is not empty
//         if (remainingDeck.length === 0) {
//             // Player cleared their deck → they win
//             alert(`${playerState.name} has cleared all their cards! You win!`);
//             update(playerRef, { card: null });

//             // End the game
//             set(ref(db, "gameState"), { ...gameStateVal, started: false, winner: playerState.name });
//         } else {
//             update(playerRef, { card: centerCard });
//             const newCenterCard = remainingDeck.pop();
//             setRemainingDeck(remainingDeck);
//             setCenterCard(newCenterCard);
//             set(ref(db, "centerCard"), newCenterCard);
//             set(ref(db, "remainingDeck"), remainingDeck);
//             console.log('after player matches', {newCenterCard, remainingDeck})
//             // set the new center card to be the next one in the remaining deck
//         }
//     };



// //   if (!playerState.card) return <h2>You've finished your deck!</h2>;

//   return (
//     <div style={{ textAlign: "center", marginTop: 40 }}>
//       <h2>Your Card</h2>
//       <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
//         {playerState.card.map((icon) => (
//           <button key={icon} onClick={() => handleClick(icon)}>{icon}</button>
//         ))}
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { db } from "../firebase/firebase";
// import { ref, onValue, update, set, get } from "firebase/database";
// import Icon from "../components/Icon";
// import iconMap from "../iconMap";
// export default function Player({ player, centerCard, setCenterCard, remainingDeck, setRemainingDeck }) {
//   const [playerState, setPlayerState] = useState(player);

//   // ✅ Keep player state synced with Firebase
//   useEffect(() => {
//     const playerRef = ref(db, `players/${player.playerId}`);
//     return onValue(playerRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) setPlayerState(data);
//     });
//   }, [player.playerId]);

//   // ✅ Listen for updates to center card (in case the host or another player changes it)
//   useEffect(() => {
//     const centerRef = ref(db, "centerCard");
//     return onValue(centerRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) setCenterCard(data);
//     });
//   }, [setCenterCard]);

//   // ✅ Listen for updates to remaining deck
//   useEffect(() => {
//     const deckRef = ref(db, "remainingDeck");
//     return onValue(deckRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) setRemainingDeck(data);
//     });
//   }, [setRemainingDeck]);

//   const handleClick = async (icon) => {
//     const playerCard = playerState.card;
//     if (!playerCard || !centerCard) return;

//     // ✅ Check game is ongoing
//     const gameSnap = await get(ref(db, "gameState"));
//     const gameStateVal = gameSnap.val() || {};
//     if (gameStateVal.winner) return alert("Game is over!");

//     // ✅ Validate match
//     const match = playerCard.includes(icon) && centerCard.includes(icon);
//     if (!match) return alert("No match! Try again.");

//     const playerRef = ref(db, `players/${player.playerId}`);

//     // ✅ Increase score
//     await update(playerRef, { score: (playerState.score || 0) + 1 });

//     // ✅ If no cards left in the deck → game over
//     if (!remainingDeck || remainingDeck.length === 0) {
//       await update(playerRef, { card: null });
//       await set(ref(db, "gameState"), {
//         ...gameStateVal,
//         winner: playerState.name,
//       });
//       return;
//     }

//     // ✅ Player’s card becomes the old center card
//     const newPlayerCard = centerCard;

//     // ✅ The center card becomes the next card from the deck
//     const newRemainingDeck = [...remainingDeck];
//     const newCenterCard = newRemainingDeck.pop();

//     // ✅ Update Firebase (authoritative)
//     await update(playerRef, { card: newPlayerCard });
//     await set(ref(db, "centerCard"), newCenterCard);
//     await set(ref(db, "remainingDeck"), newRemainingDeck);

//     // ✅ Update local state for smooth UI
//     setCenterCard(newCenterCard);
//     setRemainingDeck(newRemainingDeck);

//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: 40 }}>
//         <h2>Center Card</h2>
//       {/* <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
//         {centerCard.map((icon) => {
//             const src = iconMap[icon]; // get the image path from your map
//             return (
//             <div key={icon} style={{ border: "1px solid black", padding: 10 }}>
//                 <img src={icon} alt={icon} style={{ width: 50, height: 50 }} />
//             </div>
//             );
//         })}
//       </div> */}
//       <div
//   style={{
//     display: "grid",
//     gridTemplateColumns: "repeat(4, 1fr)", // 4 columns
//     gap: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     maxWidth: 240, // optional: to center grid nicely
//     margin: "0 auto",
//   }}
// >
//   {centerCard.map((icon) => {
//     const src = iconMap[icon]; // get image path
//     return (
//       <div
//         key={icon}
//         style={{
//           border: "1px solid black",
//           borderRadius: 8,
//           padding: 10,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           backgroundColor: "white", // so icons don't blend with background
//         }}
//       >
//         <img src={icon} alt={icon} style={{ width: 50, height: 50, objectFit: "contain" }} />
//       </div>
//     );
//   })}
// </div>
//       <h2>{playerState.name}’s Card</h2>
//       {/* <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
//         {playerState.card.map((icon) => (
//             <button key={icon} onClick={() => handleClick(icon)} style={{
//                 backgroundColor: "transparent", // remove default grey
//                 border: "1px solid black",                 // remove border
//                 padding: 0,                     // remove padding around button
//                 display: "flex",                // flex container
//                 justifyContent: "center",       // center horizontally
//                 alignItems: "center",           // center vertically
//                 cursor: "pointer"               // pointer on hover
//             }} >
//             <img 
//                 src={icon} 
//                 alt={icon} 
//                 style={{ width: 50, height: 50, display: "block" }} 
//             />
//             </button>
//         ))}
//     </div> */}
//     <div
//   style={{
//     display: "grid",
//     gridTemplateColumns: "repeat(4, 1fr)", // 4 columns for 12 icons total
//     gap: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     maxWidth: 240,
//     margin: "20px auto",
//   }}
// >
//   {playerState.card.map((icon) => (
//     <button
//       key={icon}
//       onClick={() => handleClick(icon)}
//       style={{
//         backgroundColor: "transparent",
//         border: "1px solid black",
//         borderRadius: 8,
//         padding: 10,
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         cursor: "pointer",
//       }}
//     >
//       <img
//         src={icon}
//         alt={icon}
//         style={{
//           width: 50,
//           height: 50,
//           display: "block",
//           objectFit: "contain",
//         }}
//       />
//     </button>
//   ))}
// </div>

//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { ref, onValue, update, set, get } from "firebase/database";
import { useTheme } from '../context/ThemeContext';
import RemainingCount from '../components/RemainingCount';

export default function Player({
  player,
  gameCode,
  centerCard,
  setCenterCard,
  remainingDeck,
  setRemainingDeck,
  onLeave,
  showLeaderboard,
  setShowLeaderboard,
}) {
  const [playerState, setPlayerState] = useState(player);
  const { iconMap, currentTheme } = useTheme();

  // ✅ Sync player data
  useEffect(() => {
    if (!gameCode || !player.playerId) return;
    const playerRef = ref(db, `games/${gameCode}/players/${player.playerId}`);
    const unsubscribe = onValue(playerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setPlayerState(data);
    });
    return () => unsubscribe();
  }, [gameCode, player.playerId]);

  // ✅ Listen for center card
  useEffect(() => {
    if (!gameCode) return;
    const centerRef = ref(db, `games/${gameCode}/centerCard`);
    const unsubscribe = onValue(centerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setCenterCard(data);
    });
    return () => unsubscribe();
  }, [gameCode, setCenterCard]);

  // ✅ Listen for remaining deck
  useEffect(() => {
    if (!gameCode) return;
    const deckRef = ref(db, `games/${gameCode}/remainingDeck`);
    const unsubscribe = onValue(deckRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setRemainingDeck(data);
    });
    return () => unsubscribe();
  }, [gameCode, setRemainingDeck]);

  const handleClick = async (icon) => {
    const playerCard = playerState.card;
    if (!playerCard || !centerCard) return;

    const gameSnap = await get(ref(db, `games/${gameCode}/gameState`));
    const gameStateVal = gameSnap.val() || {};
    if (gameStateVal.winner) return alert("Game is over! Winner is " + gameStateVal.winner + ".\nTry again!");

    const match = playerCard.includes(icon) && centerCard.includes(icon);
    if (!match) return alert("No match! Try again.");

    const playerRef = ref(db, `games/${gameCode}/players/${player.playerId}`);

    await update(playerRef, { score: (playerState.score || 0) + 1 });

    if (!remainingDeck || remainingDeck.length === 0) {
      await update(playerRef, { card: null });
      await set(ref(db, `games/${gameCode}/gameState`), {
        ...gameStateVal,
        winner: playerState.name,
      });
      return alert("You've finished your deck! Winner is " + playerState.name + "! 🎉");
    }

    const newPlayerCard = centerCard;
    const newRemainingDeck = [...remainingDeck];
    const newCenterCard = newRemainingDeck.pop();

    await update(playerRef, { card: newPlayerCard });
    await set(ref(db, `games/${gameCode}/centerCard`), newCenterCard);
    await set(ref(db, `games/${gameCode}/remainingDeck`), newRemainingDeck);

    setCenterCard(newCenterCard);
    setRemainingDeck(newRemainingDeck);
  };

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <div style={{ 
        position: "absolute", 
        top: 20, 
        right: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        <button
          onClick={async () => {
            const confirmed = window.confirm("Leave game? You can join or create another game after leaving.");
            if (!confirmed) return;
            if (typeof onLeave === "function") {
              await onLeave();
            }
          }}
          style={{
            padding: "8px 12px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Leave Game
        </button>
        {showLeaderboard !== undefined && setShowLeaderboard && (
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            style={{
              padding: "8px 12px",
              background: showLeaderboard 
                ? "#666"
                : `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`,
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: showLeaderboard 
                ? "none"
                : `0 4px 15px ${currentTheme.primaryColor}40`,
            }}
          >
            {showLeaderboard ? "✕ Close Leaderboard" : "📊 Leaderboard"}
          </button>
        )}
      </div>
      <h2>Center Card</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          justifyContent: "center",
          alignItems: "center",
          maxWidth: 240,
          margin: "0 auto",
        }}
      >
        {centerCard.map((icon) => (
          <div
            key={icon}
            style={{
              border: "1px solid black",
              borderRadius: 8,
              padding: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
            }}
          >
            <img
              src={iconMap[icon]}
              alt={icon}
              style={{ width: 50, height: 50, objectFit: "contain" }}
            />
          </div>
        ))}
      </div>

      <h2>{playerState.name}’s Card</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          justifyContent: "center",
          alignItems: "center",
          maxWidth: 240,
          margin: "20px auto",
        }}
      >
        {playerState.card?.map((icon) => (
          <button
            key={icon}
            onClick={() => handleClick(icon)}
            style={{
              backgroundColor: "white",
              border: "1px solid black",
              borderRadius: 8,
              padding: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <img
              src={iconMap[icon]}
              alt={icon}
              style={{
                width: 50,
                height: 50,
                display: "block",
                objectFit: "contain",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
