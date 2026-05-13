import { useNavigate } from "react-router-dom";
import React from "react";

export default function CorrectBodyPosture() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "48px", fontFamily: "sans-serif" }}>
      <h1>A. Correct Body Posture</h1>
      <p style={{ color: "#888", marginTop: "16px" }}>
        (Konten akan ditambahkan nanti)
      </p>

      <div style={{ display: "flex", gap: "12px", marginTop: "48px" }}>
        <button onClick={() => navigate("/")} style={btnStyle("white", "black")}>
          ← Back
        </button>
        <button onClick={() => navigate("/")} style={btnStyle("white", "black")}>
          Home
        </button>
        <button onClick={() => navigate("/impact-of-bad-posture")} style={btnStyle("black", "white")}>
          Next →
        </button>
      </div>
    </div>
  );
}

function btnStyle(bg: string, color: string): React.CSSProperties {
  return {
    padding: "10px 24px",
    background: bg,
    color: color,
    border: "2px solid black",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  };
}