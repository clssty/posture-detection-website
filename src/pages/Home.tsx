import { useNavigate } from "react-router-dom";
import React from "react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* ===== NAVBAR ===== */}
      <header style={{ background: "#3d3d3d", padding: "16px 40px" }}>
        <span style={{ color: "white", fontWeight: "bold", fontSize: "1rem" }}>Logo</span>
      </header>

      {/* ===== HERO SECTION ===== */}
      <main style={{ flex: 1, padding: "60px 60px 40px 60px", background: "#fff" }}>
        
        {/* Hero atas */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "60px" }}>
          
          {/* Judul Besar */}
          <h1 style={{ fontSize: "5.5rem", fontWeight: "900", lineHeight: 1.05, margin: 0, maxWidth: "52%" }}>
            Smart Posture Analysis for Better Well-Being
          </h1>

          {/* Deskripsi + Tombol */}
          <div style={{ maxWidth: "40%", display: "flex", flexDirection: "column", gap: "24px" }}>
            <p style={{ fontWeight: "700", fontSize: "1.3rem", margin: 0, lineHeight: 1.5 }}>
              Analyze your body posture in real-time and discover how small adjustments can improve comfort, confidence, and long-term health.
            </p>
            <button
              onClick={() => navigate("/posture-check")}
              style={{
                padding: "18px 36px",
                background: "black",
                color: "white",
                border: "none",
                borderRadius: "40px",
                fontWeight: "bold",
                fontSize: "1.1rem",
                cursor: "pointer",
                width: "fit-content",
              }}
            >
              Analyze My Posture
            </button>
          </div>
        </div>

        {/* ===== CARDS SECTION ===== */}
        <div style={{ display: "flex", gap: "24px", alignItems: "stretch" }}>

          {/* Card A - Correct Body Posture */}
          <div onClick={() => navigate("/correct-body-posture")} style={cardStyle("#e8f5e9")}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <span style={badgeStyle("#4caf50")}>A</span>
              <strong style={{ fontSize: "1.1rem", lineHeight: 1.3 }}>Correct Body Posture</strong>
            </div>
            <p style={{ fontSize: "1rem", color: "#555", margin: 0, lineHeight: 1.6 }}>
              Understand the fundamentals of healthy posture through proper sitting, standing, and spine alignment.
            </p>
          </div>

          {/* Card B - Impact of Bad Posture */}
          <div onClick={() => navigate("/impact-of-bad-posture")} style={cardStyle("#fce4ec")}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <span style={badgeStyle("#e53935")}>B</span>
              <strong style={{ fontSize: "1.1rem", lineHeight: 1.3 }}>Impact of Bad Posture</strong>
            </div>
            <p style={{ fontSize: "1rem", color: "#555", margin: 0, lineHeight: 1.6 }}>
              Discover how unhealthy posture habits affect physical health, daily performance, and long-term well-being.
            </p>
          </div>

          {/* Card C - Ideal Posture Angel */}
          <div onClick={() => navigate("/ideal-posture-angel")} style={cardStyle("#e3eaf5")}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <span style={badgeStyle("#3b6cbf")}>A</span>
              <strong style={{ fontSize: "1.1rem", lineHeight: 1.3 }}>Ideal Posture Angel</strong>
            </div>
            <p style={{ fontSize: "1rem", color: "#555", margin: 0, lineHeight: 1.6 }}>
              Learn how posture angles such as head, shoulder, and spinal alignment are used to evaluate healthy body posture.
            </p>
          </div>

          {/* Guide for Posture Check */}
          <div
            onClick={() => navigate("/guide-for-posture-check")}
            style={{
              flex: 1,
              height: "200px",
              background: "#faeb00",
              borderRadius: "20px",
              padding: "24px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 0.2s",
            }}
          >
            <strong style={{ fontSize: "1.3rem", textAlign: "center", lineHeight: 1.4 }}>
              Guide for Posture Check
            </strong>
          </div>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer style={{ background: "black", color: "white", padding: "20px 60px", fontSize: "0.95rem" }}>
        2026
      </footer>
    </div>
  );
}

// ===== HELPER FUNCTIONS =====
function cardStyle(bg: string): React.CSSProperties {
  return {
    flex: 1,
    background: bg,
    borderRadius: "20px",
    padding: "28px",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    boxSizing: "border-box",
  };
}

function badgeStyle(color: string): React.CSSProperties {
  return {
    background: color,
    color: "white",
    borderRadius: "50%",
    width: "44px",
    height: "44px",
    minWidth: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    flexShrink: 0,
    fontSize: "1rem",
  };
}