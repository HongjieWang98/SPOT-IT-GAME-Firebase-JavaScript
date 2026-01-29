import { useEffect, useMemo, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/firebase";
import { useTheme } from "../context/ThemeContext";

/**
 * Leaderboard
 * - compact: smaller, fixed badge style
 * - position: where to pin when compact (default: "bottom-right")
 *   one of: "bottom-right" | "bottom-center" | "bottom-left" | "top-right" | "top-left" | "top-center"
 * - currentUserId: highlight the current player's row if provided
 */
export default function Leaderboard({
  gameCode,
  compact = false,
  position = "bottom-center",
  currentUserId = null,
}) {
  const [players, setPlayers] = useState({});
  const { currentTheme } = useTheme();

  useEffect(() => {
    if (!gameCode) return;
    const playersRef = ref(db, `games/${gameCode}/players`);
    const unsub = onValue(playersRef, (snapshot) =>
      setPlayers(snapshot.val() || {})
    );
    return () => unsub();
  }, [gameCode]);

  const sortedPlayers = useMemo(() => {
    const arr = Object.values(players || {});
    // Sort by score desc, then by name asc for stability
    return arr
      .map((p, i) => ({ ...p, _idx: i }))
      .sort((a, b) => (b.score || 0) - (a.score || 0) || (a.name || "").localeCompare(b.name || ""));
  }, [players]);

  // --- Layout helpers for compact positioning
  const compactPos = (() => {
    const base = {
      position: "fixed",
      zIndex: 1000,
      // safe-area padding for notches
      paddingBottom: "env(safe-area-inset-bottom)",
      paddingTop: "env(safe-area-inset-top)",
    };
    const map = {
      "bottom-right": { bottom: "20px", right: "20px", transform: "none" },
      "bottom-center": { bottom: "20px", left: "50%", transform: "translateX(-50%)" },
      "bottom-left": { bottom: "20px", left: "20px", transform: "none" },
      "top-right": { top: "20px", right: "20px", transform: "none" },
      "top-center": { top: "20px", left: "50%", transform: "translateX(-50%)" },
      "top-left": { top: "20px", left: "20px", transform: "none" },
    };
    return { ...base, ...(map[position] || map["bottom-center"]) };
  })();

  const styles = {
    container: compact
      ? {
          ...compactPos,
          background: currentTheme.cardBg,
          borderRadius: "12px",
          padding: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          backdropFilter: "blur(10px)",
          minWidth: "220px",
          maxWidth: "280px",
          maxHeight: "40vh",
          overflowY: "auto",
          border: `1px solid ${currentTheme.accentColor}40`,
          transition: "transform 200ms ease, opacity 200ms ease",
        }
      : {
          textAlign: "center",
          background: currentTheme.cardBg,
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          maxWidth: "480px",
          margin: "20px auto",
        },
    title: {
      fontSize: compact ? "13px" : "22px",
      fontWeight: 800,
      color: currentTheme.textColor,
      textTransform: "uppercase",
      letterSpacing: "1px",
      marginBottom: compact ? "8px" : "14px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      justifyContent: compact ? "flex-start" : "center",
    },
    list: { listStyle: "none", padding: 0, margin: 0 },
    listItem: (isSelf) => ({
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      alignItems: "center",
      gap: "10px",
      padding: compact ? "8px 10px" : "10px 12px",
      marginBottom: "6px",
      background: compact
        ? `linear-gradient(135deg, ${currentTheme.primaryColor}10, ${currentTheme.secondaryColor}10)`
        : `linear-gradient(135deg, ${currentTheme.primaryColor}20, ${currentTheme.secondaryColor}20)`,
      borderRadius: "8px",
      fontSize: compact ? "13px" : "16px",
      fontWeight: 600,
      color: currentTheme.textColor,
      border: `1px solid ${currentTheme.primaryColor}20`,
      outline: isSelf ? `2px solid ${currentTheme.accentColor}60` : "none",
      transition: "background 150ms ease, outline-color 150ms ease",
    }),
    rank: (index) => ({
      background:
        index === 0
          ? "linear-gradient(135deg, #ffd700, #ffb300)" // gold
          : index === 1
          ? "linear-gradient(135deg, #c0c0c0, #a8a8a8)" // silver
          : index === 2
          ? "linear-gradient(135deg, #cd7f32, #b96b28)" // bronze
          : `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`,
      color: "white",
      borderRadius: "50%",
      width: compact ? "22px" : "28px",
      height: compact ? "22px" : "28px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: compact ? "11px" : "13px",
      fontWeight: 800,
    }),
    name: {
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    score: {
      background: `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      fontWeight: 900,
      fontSize: compact ? "16px" : "20px",
    },
    empty: {
      color: currentTheme.lightText,
      fontSize: compact ? "12px" : "14px",
      padding: compact ? "4px 0" : "8px 0",
    },
  };

  return (
    <div style={styles.container} role="region" aria-label="Leaderboard">
      <div style={styles.title}>
        <span>Leaderboard</span>
      </div>

      {sortedPlayers.length === 0 ? (
        <div style={styles.empty}>Waiting for players…</div>
      ) : (
        <ul style={styles.list}>
          {sortedPlayers.map((p, index) => {
            const key = p.id || p.uid || p.name || index; // stable-ish key
            const isSelf =
              currentUserId && (p.id === currentUserId || p.uid === currentUserId);

            return (
              <li key={key} style={styles.listItem(isSelf)}>
                <span style={styles.rank(index)} aria-label={`Rank ${index + 1}`}>
                  {index + 1}
                </span>
                <span style={styles.name} title={p.name || "Unknown"}>
                  {p.name || "Unknown"}
                </span>
                <span style={styles.score}>{p.score ?? 0}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
