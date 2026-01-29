import { useEffect, useMemo, useRef, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/firebase";
import { useTheme } from "../context/ThemeContext";

/**
 * Leaderboard (draggable)
 * - compact: smaller card style
 * - draggable: enable click-and-drag repositioning (default true when compact)
 * - position: initial anchor when no saved position exists
 * - currentUserId: highlight current user's row
 * - onClose: callback to close the leaderboard
 */
export default function Leaderboard({
  gameCode,
  compact = false,
  draggable = true,
  position = "bottom-right",
  currentUserId = null,
  onClose = null,
}) {
  const [players, setPlayers] = useState({});
  const { currentTheme } = useTheme();

  // --- drag state
  const [coords, setCoords] = useState(null); // { left, top }
  const cardRef = useRef(null);
  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    originLeft: 0,
    originTop: 0,
  });

  // Load saved coords (per game)
  useEffect(() => {
    if (!draggable) return;
    const key = getStorageKey(gameCode);
    const saved = key && localStorage.getItem(key);
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        if (Number.isFinite(obj.left) && Number.isFinite(obj.top)) {
          setCoords(obj);
        }
      } catch {}
    } else {
      // If no saved position, convert named position to initial coords after first paint
      requestAnimationFrame(() => {
        if (!cardRef.current) return;
        const { left, top } = initialCoordsFromNamedPosition(position, cardRef.current);
        setCoords({ left, top });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameCode, draggable]);

  // Save coords
  useEffect(() => {
    if (!draggable || !coords) return;
    const key = getStorageKey(gameCode);
    if (key) localStorage.setItem(key, JSON.stringify(coords));
  }, [coords, draggable, gameCode]);

  // Keep card inside viewport on resize/rotate
  useEffect(() => {
    const handler = () => {
      if (!cardRef.current || !coords) return;
      const rect = cardRef.current.getBoundingClientRect();
      const clamped = clampToViewport(coords.left, coords.top, rect.width, rect.height);
      if (clamped.left !== coords.left || clamped.top !== coords.top) {
        setCoords(clamped);
      }
    };
    window.addEventListener("resize", handler);
    window.addEventListener("orientationchange", handler);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("orientationchange", handler);
    };
  }, [coords]);

  // Pointer handlers (mouse + touch)
  const onPointerDown = (e) => {
    if (!draggable) return;
    // Ignore right-click
    if (e.button && e.button !== 0) return;

    const target = cardRef.current;
    if (!target) return;

    // Start drag
    dragRef.current.dragging = true;
    dragRef.current.startX = e.clientX ?? (e.touches?.[0]?.clientX || 0);
    dragRef.current.startY = e.clientY ?? (e.touches?.[0]?.clientY || 0);

    const rect = target.getBoundingClientRect();
    // Ensure we have coords; if not, set from current rect
    if (!coords) {
      setCoords({ left: rect.left, top: rect.top });
      dragRef.current.originLeft = rect.left;
      dragRef.current.originTop = rect.top;
    } else {
      dragRef.current.originLeft = coords.left;
      dragRef.current.originTop = coords.top;
    }

    // Capture pointer to the element
    target.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.dragging) return;

    const clientX = e.clientX ?? (e.touches?.[0]?.clientX || 0);
    const clientY = e.clientY ?? (e.touches?.[0]?.clientY || 0);
    const dx = clientX - dragRef.current.startX;
    const dy = clientY - dragRef.current.startY;

    let left = dragRef.current.originLeft + dx;
    let top = dragRef.current.originTop + dy;

    // Clamp to viewport using current size
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const clamped = clampToViewport(left, top, rect.width, rect.height);
      left = clamped.left;
      top = clamped.top;
    }

    setCoords({ left, top });
  };

  const endDrag = (e) => {
    if (!dragRef.current.dragging) return;
    dragRef.current.dragging = false;
    // Release capture
    cardRef.current?.releasePointerCapture?.(e.pointerId);
  };

  // --- Firebase players
  useEffect(() => {
    if (!gameCode) return;
    const playersRef = ref(db, `games/${gameCode}/players`);
    const unsub = onValue(playersRef, (snapshot) => setPlayers(snapshot.val() || {}));
    return () => unsub();
  }, [gameCode]);

  const sortedPlayers = useMemo(() => {
    const arr = Object.values(players || {});
    return arr
      .map((p, i) => ({ ...p, _idx: i }))
      .sort(
        (a, b) =>
          (b.score || 0) - (a.score || 0) ||
          (a.name || "").localeCompare(b.name || "")
      );
  }, [players]);

  // Style helpers
  const styles = {
    container: {
      position: "fixed",
      zIndex: 1000,
      left: (coords?.left ?? -9999) + "px", // offscreen until set
      top: (coords?.top ?? -9999) + "px",
      background: currentTheme.cardBg,
      borderRadius: compact ? "12px" : "16px",
      padding: compact ? "12px" : "20px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
      backdropFilter: "blur(10px)",
      minWidth: compact ? "220px" : "320px",
      maxWidth: compact ? "280px" : "420px",
      maxHeight: "50vh",
      overflowY: "auto",
      border: `1px solid ${currentTheme.accentColor}40`,
      touchAction: "none", // important for touch dragging
      cursor: draggable ? "grab" : "default",
      userSelect: "none",
    },
    title: {
      fontSize: compact ? "13px" : "20px",
      fontWeight: 800,
      color: currentTheme.textColor,
      textTransform: "uppercase",
      letterSpacing: "1px",
      marginBottom: compact ? "8px" : "12px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      justifyContent: "space-between",
    },
    dragHint: {
      fontSize: "11px",
      opacity: 0.7,
      color: currentTheme.lightText,
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
          ? "linear-gradient(135deg, #ffd700, #ffb300)"
          : index === 1
          ? "linear-gradient(135deg, #c0c0c0, #a8a8a8)"
          : index === 2
          ? "linear-gradient(135deg, #cd7f32, #b96b28)"
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
    closeButton: {
      background: `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`,
      color: "white",
      border: "none",
      borderRadius: "8px",
      width: compact ? "24px" : "28px",
      height: compact ? "24px" : "28px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: compact ? "14px" : "16px",
      fontWeight: "bold",
      boxShadow: `0 2px 8px ${currentTheme.primaryColor}40`,
      transition: "transform 0.2s ease",
    },
  };

  return (
    <div
      ref={cardRef}
      style={styles.container}
      role="region"
      aria-label="Leaderboard"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div style={styles.title}>
        <span>Leaderboard</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {draggable && <span style={styles.dragHint}>Drag to move</span>}
          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              style={styles.closeButton}
              aria-label="Close leaderboard"
              title="Close leaderboard"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {sortedPlayers.length === 0 ? (
        <div style={styles.empty}>Waiting for players…</div>
      ) : (
        <ul style={styles.list}>
          {sortedPlayers.map((p, index) => {
            const key = p.id || p.uid || p.name || index;
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

/* ---------- helpers ---------- */

function getStorageKey(gameCode) {
  if (!gameCode) return null;
  return `leaderboard_coords_${gameCode}`;
}

function clampToViewport(left, top, width, height, margin = 8) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const minLeft = margin;
  const minTop = margin;
  const maxLeft = Math.max(minLeft, vw - width - margin);
  const maxTop = Math.max(minTop, vh - height - margin);
  return {
    left: Math.min(maxLeft, Math.max(minLeft, left)),
    top: Math.min(maxTop, Math.max(minTop, top)),
  };
}

function initialCoordsFromNamedPosition(position, el) {
  const rect = el.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const margin = 20;

  const map = {
    "bottom-right": { left: vw - rect.width - margin, top: vh - rect.height - margin },
    "bottom-center": { left: (vw - rect.width) / 2, top: vh - rect.height - margin },
    "bottom-left": { left: margin, top: vh - rect.height - margin },
    "top-right": { left: vw - rect.width - margin, top: margin },
    "top-center": { left: (vw - rect.width) / 2, top: margin },
    "top-left": { left: margin, top: margin },
  };

  const chosen = map[position] || map["bottom-right"];
  return clampToViewport(chosen.left, chosen.top, rect.width, rect.height, margin);
}
