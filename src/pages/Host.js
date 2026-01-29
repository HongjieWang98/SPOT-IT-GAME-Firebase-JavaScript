import React, { useEffect, useState } from "react";
import { ref, onValue, update, set, get } from "firebase/database";
import { db } from "../firebase/firebase";
import iconMap from "../iconMap";
import Leaderboard from "./Leaderboard";
import { useTheme } from "../context/ThemeContext";
import RemainingCount from "../components/RemainingCount";

export default function Host({ player, gameCode, remainingDeck, setRemainingDeck }) {
  const [playerState, setPlayerState] = useState(player);
  const [centerCard, setCenterCard] = useState([]);
  const { iconMap } = useTheme();

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
      <RemainingCount remainingDeck={remainingDeck} />
      <h2>{playerState.name}'s Card</h2>
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
