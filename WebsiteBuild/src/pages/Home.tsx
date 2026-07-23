import { useNavigate } from "react-router-dom";
import { useState } from "react";
/*import React from "react";*/

export default function Home() {
  const navigate = useNavigate();

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <div style={{ fontFamily: "sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* ===== NAVBAR ===== */}
      <header style={{ background: "#f4f4f4", padding: "16px 40px" }}>
        <span style={{ color: "black", fontWeight: "bold", fontSize: "1rem" }}>Logo</span>
      </header>

      {/* ===== HERO SECTION ===== */}
      <main style={{ flex: 1, padding: "60px 60px 40px 60px", background: "#ffffff" }}>

        {/* Hero atas */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "60px" }}>

          {/* Judul Besar */}
          <h1 style={{ fontSize: "5.5rem", fontWeight: "900", lineHeight: 1.05, margin: 0, maxWidth: "52%" }}>
            Sitting Posture Analysis for Better Well-Being
          </h1>

          {/* Deskripsi + Tombol */}
          <div style={{ maxWidth: "40%", display: "flex", flexDirection: "column", gap: "50px" }}>
            <p style={{ fontWeight: "700", fontSize: "1.3rem", margin: 0, lineHeight: 1.5 }}>
              Analyze your body posture in real-time and discover how small adjustments can improve comfort, confidence, and long-term health.
            </p>
            <button
              onClick={() => navigate("/posture-check")}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              style={{
                padding: "18px 36px",

                background: isButtonHovered ? "black" : "#36a7cf",

                color: "white",
                border: "none",
                borderRadius: "40px",

                fontWeight: "bold",
                fontSize: "1.1rem",

                cursor: "pointer",
                width: "fit-content",

                transition: "0.25s ease",

                transform:
                  isButtonHovered
                    ? "scale(1.08)"
                    : "scale(1)",
              }}
            >
              Analyze My Posture
            </button>
          </div>
        </div>

        {/* Card Section WRAPPER */}
        <div
          style={{
            background: "#d1ebf4",
            padding: "40px 50px",
            borderRadius: "0px",
            marginTop: "40px",
          }}
        >
          {/* ===== CARDS SECTION ===== */}
          <div style={{ display: "flex", gap: "24px", alignItems: "stretch" }}>

            {/* CARD A - CORRECT BODY POSTURE */}
            <div
              onClick={() => navigate("/correct-body-posture")}
              onMouseEnter={() => setHoveredCard("A")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: hoveredCard === "A" ? "#36a7cf" : "white",
                color: hoveredCard === "A" ? "white" : "black",

                padding: "24px",
                borderRadius: "20px",

                width: "370px",
                minHeight: "180px",

                transition: "0.3s ease",
                cursor: "pointer",

                transform:
                  hoveredCard === "A"
                    ? "translateY(-5px)"
                    : "translateY(0)",

                boxShadow:
                  hoveredCard === "A"
                    ? "0 10px 25px rgba(0,0,0,0.15)"
                    : "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              {/* Icon + Title Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "18px",
                }}
              >
                {/* Circle Icon */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#6dbd4a",
                    color: "white",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    fontWeight: "bold",
                    flexShrink: 0,
                  }}
                >
                  A
                </div>

                {/* Title */}
                <h3
                  style={{
                    color: hoveredCard === "A" ? "white" : "black",
                    margin: 0,
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    lineHeight: "1.3",
                  }}
                >
                  Correct body posture
                </h3>
              </div>

              {/* Description */}
              <p
                style={{
                  color: hoveredCard === "A" ? "white" : "#444",
                  fontSize: "1rem",
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                Understand the fundamentals of healthy sitting posture,
                proper spinal alignment, and ergonomic positioning while seated.
              </p>
            </div>

            {/* CARD  B - IMPACT OF BAD POSTURE */}
            <div
              onClick={() => navigate("/impact-of-bad-posture")}
              onMouseEnter={() => setHoveredCard("B")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: hoveredCard === "B" ? "#36a7cf" : "white",
                color: hoveredCard === "B" ? "white" : "black",

                padding: "24px",
                borderRadius: "20px",

                width: "370px",
                minHeight: "180px",

                transition: "0.3s ease",
                cursor: "pointer",

                transform:
                  hoveredCard === "B"
                    ? "translateY(-5px)"
                    : "translateY(0)",

                boxShadow:
                  hoveredCard === "B"
                    ? "0 10px 25px rgba(0,0,0,0.15)"
                    : "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              {/* Icon + Title Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "18px",
                }}
              >
                {/* Circle Icon */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#ef4444",
                    color: "white",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    fontWeight: "bold",
                    flexShrink: 0,
                  }}
                >
                  B
                </div>

                {/* Title */}
                <h3
                  style={{
                    color: hoveredCard === "B" ? "white" : "black",
                    margin: 0,
                    fontSize: "1.4rem",
                    fontWeight: "bold",
                    lineHeight: "1.3",
                  }}
                >
                  Impact of Bad Posture
                </h3>
              </div>

              {/* Description */}
              <p
                style={{
                  color: hoveredCard === "B" ? "white" : "#444",
                  fontSize: "1rem",
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                Discover how unhealthy posture habits affect physical
                health, daily performance, and long-term well-being.
              </p>
            </div>

            {/* CARD C - IDEAL POSTURE ANGLE */}
            <div
              onClick={() => navigate("/ideal-posture-angel")}
              onMouseEnter={() => setHoveredCard("C")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: hoveredCard === "C" ? "#36a7cf" : "white",
                color: hoveredCard === "C" ? "white" : "black",

                padding: "24px",
                borderRadius: "20px",

                width: "370px",
                minHeight: "180px",

                transition: "0.3s ease",
                cursor: "pointer",

                transform:
                  hoveredCard === "C"
                    ? "translateY(-5px)"
                    : "translateY(0)",

                boxShadow:
                  hoveredCard === "C"
                    ? "0 10px 25px rgba(0,0,0,0.15)"
                    : "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              {/* Icon + Title Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "18px",
                }}
              >
                {/* Circle Icon */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#3b82f6",
                    color: "white",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    fontWeight: "bold",
                    flexShrink: 0,
                  }}
                >
                  C
                </div>

                {/* Title */}
                <h3
                  style={{
                    color: hoveredCard === "C" ? "white" : "black",
                    margin: 0,
                    fontSize: "1.4rem",
                    fontWeight: "bold",
                    lineHeight: "1.3",
                  }}
                >
                  Ideal Posture Angle
                </h3>
              </div>

              {/* Description */}
              <p
                style={{
                  color: hoveredCard === "C" ? "white" : "#444",
                  fontSize: "1rem",
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                Learn how posture angles such as head, shoulder,
                and spinal alignment are used to evaluate healthy
                body posture.
              </p>
            </div>


            {/* Card D - Guide for Posture Check */}
            <div
              onClick={() => navigate("/guide-for-posture-check")}
              onMouseEnter={() => setHoveredCard("D")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: "#fff200",
                color: "black",

                padding: "24px",
                borderRadius: "20px",

                width: "260px",
                minHeight: "180px",

                transition: "0.3s ease",
                cursor: "pointer",

                transform:
                  hoveredCard === "D"
                    ? "translateY(-10px)"
                    : "translateY(0)",

                boxShadow:
                  hoveredCard === "D"
                    ? "0 10px 25px rgba(0,0,0,0.15)"
                    : "0 4px 10px rgba(0,0,0,0.05)",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  lineHeight: "1.3",
                }}
              >
                Guide for Posture Check
              </h3>
            </div>
          </div>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer style={{ background: "#36a7cf", color: "white", padding: "20px 60px", fontSize: "0.95rem" }}>
        2026
      </footer>
    </div>
  );
}
