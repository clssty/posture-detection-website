import React from "react";
import { useNavigate } from "react-router-dom";
import sittingImg from "../assets/D/Guide_for_Posture_Check.png";

export default function GuideForPostureCheck() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
      }}
    >
      {/* ── NAVBAR ── */}
      <header style={{ background: "#f4f4f4", padding: "16px 40px" }}>
        <span
          onClick={() => navigate("/")}
          style={{ color: "black", fontWeight: "bold", fontSize: "1rem", cursor: "pointer" }}
        >
          Logo
        </span>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, padding: "40px 48px" }}>

        {/* Page Title */}
        <h1
          style={{
            margin: "0 0 28px 0",
            fontSize: "1.6rem",
            fontWeight: "900",
            color: "#111827",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Guide for Posture Check
        </h1>

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            background: "#dbeafe",
            borderRadius: "20px",
            padding: "24px",
            alignItems: "stretch",
            minHeight: "480px",
          }}
        >
          {/* ── LEFT: Image Panel ── */}
          <div
            style={{
              flex: "1 1 0",
              background: "white",
              borderRadius: "16px",
              border: "1.5px solid #ffffffff",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
            }}
          >
            {/* Sitting person image */}
            <img
              src={sittingImg}
              alt="Person sitting on chair from left side view"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                padding: "16px",
              }}
            />

            {/* Cyan callout box — top-right overlay */}
            <div
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                background: "#50f9ff",
                borderRadius: "12px",
                padding: "30px 80px",
                maxWidth: "260px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.20)",
              }}
            >
              <ul
                style={{
                  margin: 0,
                  padding: "0 0 0 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <li
                  style={{
                    fontWeight: "700",
                    fontSize: "1.5rem",
                    color: "#000000ff",
                    lineHeight: 1.4,
                  }}
                >
                  Face your{" "}
                  <span style={{ textDecoration: "underline" }}>LEFT</span>{" "}
                  side toward the camera.
                </li>
                <li
                  style={{
                    fontWeight: "700",
                    fontSize: "1.5rem",
                    color: "#000000ff",
                    lineHeight: 1.4,
                  }}
                >
                  Show the shot from the head down to the waist.
                </li>
              </ul>
            </div>
          </div>

          {/* ── RIGHT: Preview Panel ── */}
          <div
            style={{
              width: "220px",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {/* Ready To Analyze */}
            <div
              style={{
                background: "white",
                borderRadius: "14px",
                padding: "16px",
                textAlign: "center",
                fontWeight: "700",
                fontSize: "1rem",
                color: "#94a3b8",
                cursor: "default",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "#fff200";
                el.style.color = "#0f172a";
                el.querySelector("span")!.textContent = "Server status";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "white";
                el.style.color = "#94a3b8";
                el.querySelector("span")!.textContent = "Ready To Analyze";
              }}
            >
              <span>Ready To Analyze</span>
            </div>

            {/* CA angle */}
            <div
              style={{
                background: "white",
                borderRadius: "14px",
                padding: "20px 16px",
                textAlign: "center",
                fontWeight: "700",
                fontSize: "1.2rem",
                color: "#94a3b8",
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "default",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "#fff200";
                el.style.color = "#0f172a";
                el.querySelector("span")!.textContent = "User's CA angle degree posture";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "white";
                el.style.color = "#94a3b8";
                el.querySelector("span")!.textContent = "CA angle";
              }}
            >
              <span>CA angle</span>
            </div>

            {/* SA angle */}
            <div
              style={{
                background: "white",
                borderRadius: "14px",
                padding: "20px 16px",
                textAlign: "center",
                fontWeight: "700",
                fontSize: "1.2rem",
                color: "#94a3b8",
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "default",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "#fff200";
                el.style.color = "#0f172a";
                el.querySelector("span")!.textContent = "User's SA angle degree posture";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "white";
                el.style.color = "#94a3b8";
                el.querySelector("span")!.textContent = "SA angle";
              }}
            >
              <span>SA angle</span>
            </div>

            {/* KA angle */}
            <div
              style={{
                background: "white",
                borderRadius: "14px",
                padding: "20px 16px",
                textAlign: "center",
                fontWeight: "700",
                fontSize: "1.2rem",
                color: "#94a3b8",
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "default",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "#fff200";
                el.style.color = "#0f172a";
                el.querySelector("span")!.textContent = "User's KA angle degree posture";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "white";
                el.style.color = "#94a3b8";
                el.querySelector("span")!.textContent = "KA angle";
              }}
            >
              <span>KA angle</span>
            </div>

            {/* Start Analyze button */}
            <button
              onClick={() => navigate("/posture-check")}
              style={{
                background: "#0ea5e9",
                color: "white",
                border: "none",
                borderRadius: "14px",
                padding: "18px 16px",
                fontSize: "1.1rem",
                fontWeight: "800",
                cursor: "pointer",
                width: "100%",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "#fff200";
                el.style.color = "#0f172a";
                el.querySelector("span")!.textContent = "Analyze your posture";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "#0ea5e9";
                el.style.color = "white";
                el.querySelector("span")!.textContent = "Start Analyze";
              }}
            >
              <span>Start Analyze</span>
            </button>
          </div>
        </div>
      </main>

      {/* ── BOTTOM NAV ── */}
      <div
        style={{
          padding: "24px 48px",
          display: "flex",
          gap: "12px",
          borderTop: "1px solid rgba(0,0,0,0.07)",
        }}
      >
        <button onClick={() => navigate(-1)} style={navBtn()}>
          ← Back
        </button>
        <button onClick={() => navigate("/")} style={navBtn()}>
          Home
        </button>
      </div>
    </div>
  );
}

function navBtn(): React.CSSProperties {
  return {
    padding: "10px 28px",
    background: "white",
    color: "#111827",
    border: "2px solid #e2e8f0",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "0.95rem",
    transition: "border-color 0.2s",
  };
}