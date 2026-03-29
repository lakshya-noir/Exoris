import React from "react";

export default function PlanetInfoModal({ open, onClose, planet }) {
  if (!open || !planet) return null;
  return (
    <div style={{
      position: "fixed",
      top: "20%",
      left: "50%",
      transform: "translate(-50%, 0)",
      background: "#222",
      color: "#fff",
      padding: "2rem",
      borderRadius: "1rem",
      zIndex: 1000,
      minWidth: "240px"
    }}>
      <h2>{planet.name}</h2>
      <p>{planet.description}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
