import React from "react";
import iconMap from "../iconMap";

export default function Icon({ id, size = 80 }) {
  const src = iconMap[id];
  if (!src) return <div style={{ width: size, height: size }}>❓</div>;

  return (
    <img
      src={src}
      alt={`icon-${id}`}
      width={size}
      height={size}
      style={{ objectFit: "contain" }}
    />
  );
}
