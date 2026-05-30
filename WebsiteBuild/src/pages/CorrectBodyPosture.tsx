import { useNavigate } from "react-router-dom";
import { useState } from "react";
import React from "react";

// ──────────────────────────────────────────────
//  IMAGE IMPORTS
// ──────────────────────────────────────────────
import standingImg from "../assets/A/Standing_Posture_Good.jpeg";
import sittingImg from "../assets/A/Sitting_Posture_Good.jpg";
import spineImg from "../assets/A/Spine_Alignment.png";

// ──────────────────────────────────────────────
//  TYPES
// ──────────────────────────────────────────────
interface CheckItem {
  text: string;
}

// ──────────────────────────────────────────────
//  DATA
// ──────────────────────────────────────────────
const standingChecks: CheckItem[] = [
  { text: "Head aligned (not pushed forward)" },
  { text: "Shoulders relaxed (not rounded)" },
  { text: "Spine upright with natural curves" },
  { text: "Hips aligned" },
  { text: "Knees slightly relaxed (not locked)" },
  { text: "Weight evenly distributed" },
];

const sittingChecks: CheckItem[] = [
  { text: "Back straight and supported" },
  { text: "Shoulders relaxed" },
  { text: "Elbows around 90°" },
  { text: "Hips & knees around 90°" },
  { text: "Feet flat on the floor" },
  { text: "Screen at eye level" },
];

const spineChecks: CheckItem[] = [
  { text: "Spine forms a natural S-shape" },
  { text: "Not overly curved or rigidly straight" },
  { text: "Head, shoulders, and hips aligned" },
];

const funFacts = [
  {
    text: "The human head weighs about 4–5 kg",
    hoverColor: "#ffd6ec",
    shadowColor: "rgba(255,105,180,0.18)",
  },
  {
    text: "Slouching can increase spinal pressure up to 2× more",
    hoverColor: "#fff4bf",
    shadowColor: "rgba(255,215,0,0.18)",
  },
  {
    text: "Good posture can improve focus and confidence",
    hoverColor: "#ffe2b8",
    shadowColor: "rgba(255,140,0,0.18)",
  },
];

// ──────────────────────────────────────────────
//  SUB-COMPONENTS
// ──────────────────────────────────────────────

/** Green checkmark bullet list */
function CheckList({ items }: { items: CheckItem[] }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.97rem", lineHeight: 1.5, color: "#2d3748" }}>
          <span style={{
            width: "22px", height: "22px", borderRadius: "50%",
            background: "#36a7cf", color: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, fontSize: "0.75rem", fontWeight: "bold", marginTop: "1px",
          }}>✓</span>
          {item.text}
        </li>
      ))}
    </ul>
  );
}

/** Section card — image left or right, checklist on the other side */
function PostureSection({
  number,
  title,
  description,
  items,
  imgSrc,
  imgAlt,
  imgRight = false,
  accent = "#36a7cf",
  onImageClick,
}: {
  number: string;
  title: string;
  description?: string;
  items: CheckItem[];
  imgSrc: string;
  imgAlt: string;
  imgRight?: boolean;
  accent?: string;
  onImageClick?: (img: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const textBlock = (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "20px" }}>
      {/* Number badge + title */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "50%",
          background: accent, color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: "900", fontSize: "1.1rem", flexShrink: 0,
        }}>{number}</div>
        <h2 style={{ margin: 0, fontSize: "1.55rem", fontWeight: "800", color: "#1a202c" }}>{title}</h2>
      </div>

      {description && (
        <p style={{ margin: 0, fontSize: "0.97rem", color: "#4a5568", lineHeight: 1.7 }}>{description}</p>
      )}

      {/* Divider */}
      <div style={{ width: "48px", height: "3px", background: accent, borderRadius: "4px" }} />

      <CheckList items={items} />
    </div>
  );

  const imgBlock = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: hovered
          ? "0 20px 50px rgba(54,167,207,0.25)"
          : "0 8px 24px rgba(0,0,0,0.10)",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        maxWidth: "480px",
      }}
    >
      <img
        src={imgSrc}
        alt={imgAlt}
        onClick={() => onImageClick?.(imgSrc)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          cursor: "pointer",
        }}
      />
    </div>
  );

  return (
    <div style={{
      display: "flex",
      gap: "48px",
      alignItems: "center",
      flexDirection: imgRight ? "row" : "row-reverse",
      flexWrap: "wrap",
    }}>
      {imgRight ? <>{textBlock}{imgBlock}</> : <>{textBlock}{imgBlock}</>}
    </div>
  );
}

// ──────────────────────────────────────────────
//  MAIN PAGE
// ──────────────────────────────────────────────
export default function CorrectBodyPosture() {
  const navigate = useNavigate();
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  // Image full
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div style={{ fontFamily: "sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", background: "#ffffff" }}>

      {/* ── NAVBAR (same as Home) ── */}
      <header style={{ background: "#f4f4f4", padding: "16px 40px" }}>
        <span
          onClick={() => navigate("/")}
          style={{ color: "black", fontWeight: "bold", fontSize: "1rem", cursor: "pointer" }}
        >
          Logo
        </span>
      </header>

      {/* ── HERO BANNER ── */}
      <div style={{
        background: "linear-gradient(135deg, #d1ebf4 0%, #eaf6fb 60%, #ffffff 100%)",
        padding: "56px 64px 48px 64px",
      }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            marginBottom: "20px",
          }}
        >
          {/* Circle A */}
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: "#6dbd4a",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "900",
              fontSize: "1.3rem",
              flexShrink: 0,
            }}
          >
            A
          </div>

          {/* Main Title */}
          <h1
            style={{
              margin: 0,
              fontSize: "3.2rem",
              fontWeight: "900",
              color: "#1a202c",
              lineHeight: 1.1,
            }}
          >
            Correct Body Posture
          </h1>
        </div>        
        <p style={{ 
          margin: 0, 
          marginLeft: "70px",
          fontSize: "1.1rem", 
          color: "#4a5568", 
          lineHeight: 1.9, 
          maxWidth: "660px" 
          }}>
          Correct posture is the position of the body when standing, sitting, or moving while <strong>maintaining the natural curve of the spine</strong>, so the body does not experience excessive strain.
        </p>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, padding: "64px 64px 80px 64px", display: "flex", flexDirection: "column", gap: "80px" }}>

        {/* Section intro label */}
        <div>
          <div style={{
            display: "inline-block",
            background: "#d1ebf4",
            color: "#1a6f93",
            fontWeight: "700",
            fontSize: "0.85rem",
            padding: "6px 18px",
            borderRadius: "40px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}>
            Characteristics of Good Posture
          </div>
          <h2 style={{ margin: 0, fontSize: "2rem", fontWeight: "800", color: "#1a202c" }}>
            Three pillars to know
          </h2>
        </div>

        {/* ── 1. STANDING ── */}
        <PostureSection
          number="1"
          title="When Standing"
          description="Proper standing alignment keeps your joints stacked, muscles balanced, and energy at its peak throughout the day."
          items={standingChecks}
          imgSrc={standingImg}
          imgAlt="Standing posture comparison — good vs poor"
          imgRight={false}
          accent="#36a7cf"
          onImageClick={setSelectedImage}
        />

        {/* Thin divider */}
        <div style={{ height: "1px", background: "#e2e8f0" }} />

        {/* ── 2. SITTING ── */}
        <PostureSection
          number="2"
          title="When Sitting"
          description="With most of us spending hours at a desk, sitting posture directly affects your spine, circulation, and focus."
          items={sittingChecks}
          imgSrc={sittingImg}
          imgAlt="Correct sitting posture at a desk"
          imgRight={true}
          accent="#36a7cf"
          onImageClick={setSelectedImage}
        />

        <div style={{ height: "1px", background: "#e2e8f0" }} />

        {/* ── 3. SPINE ALIGNMENT ── */}
        <PostureSection
          number="3"
          title="Spine Alignment (Key Element)"
          description="The spine's natural S-curve is the foundation of every good posture. Protect it and your whole body benefits."
          items={spineChecks}
          imgSrc={spineImg}
          imgAlt="Spine alignment — cervical, thoracic and lumbar curves"
          imgRight={false}
          accent="#36a7cf"
          onImageClick={setSelectedImage}
        />

        {/* ── FUN FACTS ── */}
        <div style={{
          background: "linear-gradient(135deg, #d1ebf4 0%, #eaf6fb 100%)",
          borderRadius: "24px",
          padding: "48px 52px",
        }}>
          <div style={{
            display: "inline-block",
            background: "#36a7cf",
            color: "white",
            fontWeight: "700",
            fontSize: "0.8rem",
            padding: "5px 16px",
            borderRadius: "40px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}>
            Fun Facts
          </div>
          <h2 style={{ margin: "0 0 32px 0", fontSize: "1.6rem", fontWeight: "800", color: "#1a202c" }}>
            Did you know?
          </h2>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {funFacts.map((fact, i) => (
              <div
                key={i}
                style={{
                  flex: "1 1 220px",
                  background: "white",
                  borderRadius: "16px",
                  padding: "32px 28px",
                  boxShadow: "0 4px 16px rgba(54,167,207,0.12)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  minHeight: "120px",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.background = fact.hoverColor;
                  e.currentTarget.style.boxShadow = `0 12px 28px ${fact.shadowColor}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(54,167,207,0.12)";
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: "700",
                    color: "#2d3748",
                    fontSize: "1rem",
                    lineHeight: 1.7,
                  }}
                >
                  {fact.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONCLUSION ── */}
        <div style={{
          background: "#1a202c",
          borderRadius: "24px",
          padding: "44px 52px",
          display: "flex",
          alignItems: "flex-start",
          gap: "28px",
        }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "50%",
            background: "#36a7cf",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, fontSize: "1.4rem",
          }}>🎯</div>
          <div>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "1.2rem", fontWeight: "800", color: "white" }}>Conclusion</h3>
            <p style={{ margin: 0, color: "#cbd5e0", fontSize: "1rem", lineHeight: 1.75 }}>
              Good posture does not mean being stiff, but keeping the body{" "}
              <strong style={{ color: "#36a7cf" }}>natural, balanced, and comfortable</strong>.
              Small habits today can have a big impact in the future.
            </p>
          </div>
        </div>

      </main>

      {/* ── NAVIGATION BUTTONS ── */}
      <div style={{
        background: "#f4f4f4",
        padding: "24px 64px",
        display: "flex",
        gap: "14px",
        alignItems: "center",
        borderTop: "1px solid #e2e8f0",
      }}>
        <button
          onClick={() => navigate("/")}
          onMouseEnter={() => setHoveredBtn("back")}
          onMouseLeave={() => setHoveredBtn(null)}
          style={navBtn(hoveredBtn === "back", false)}
        >
          ← Back
        </button>
        <button
          onClick={() => navigate("/")}
          onMouseEnter={() => setHoveredBtn("home")}
          onMouseLeave={() => setHoveredBtn(null)}
          style={navBtn(hoveredBtn === "home", false)}
        >
         Home
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => navigate("/impact-of-bad-posture")}
          onMouseEnter={() => setHoveredBtn("next")}
          onMouseLeave={() => setHoveredBtn(null)}
          style={navBtn(hoveredBtn === "next", true)}
        >
          Next: Impact of Bad Posture →
        </button>
      </div>

      {/* ── FOOTER ── */}
<footer style={{ background: "#36a7cf", color: "white", padding: "20px 60px", fontSize: "0.95rem" }}>
  2026
</footer>

{/* ===== IMAGE MODAL ===== */}
{selectedImage && (
  <div
    onClick={() => setSelectedImage(null)}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.85)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      padding: "20px",
      cursor: "pointer",
    }}
  >
    <img
      src={selectedImage}
      alt="Preview"
      onClick={(e) => e.stopPropagation()}
      style={{
        maxWidth: "90%",
        maxHeight: "90%",
        borderRadius: "18px",
        boxShadow: "0 0 30px rgba(0,0,0,0.4)",
      }}
    />
  </div>
)}

</div>
);
}

// ──────────────────────────────────────────────
//  HELPERS
// ──────────────────────────────────────────────
function navBtn(hovered: boolean, isPrimary: boolean): React.CSSProperties {
  if (isPrimary) {
    return {
      padding: "12px 28px",
      background: hovered ? "black" : "#36a7cf",
      color: "white",
      border: "none",
      borderRadius: "40px",
      fontWeight: "bold",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "0.25s ease",
      transform: hovered ? "scale(1.04)" : "scale(1)",
    };
  }
  return {
    padding: "12px 24px",
    background: hovered ? "#e2e8f0" : "white",
    color: "black",
    border: "2px solid #cbd5e0",
    borderRadius: "40px",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "0.25s ease",
  };
}