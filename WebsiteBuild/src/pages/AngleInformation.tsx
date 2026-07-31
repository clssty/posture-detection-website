import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import cranioImg from "../assets/C/Craniovertebral_Angle.jpeg";
import kyphosisImg from "../assets/C/Kyphosis_Angle.jpeg";
import shoulderImg from "../assets/C/Shoulder_Angle.png";

// ──────────────────────────────────────────────
//  TYPES
// ──────────────────────────────────────────────
interface AngleSectionData {
  number: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  whatMeasured: string;
  whyMatters: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
  accentColor: string;
  badgeColor: string;
  cardColor1: string;
  cardColor2: string;
  textColor1: string;
  textColor2: string;
  pictureSource?: string;
}

// ──────────────────────────────────────────────
//  DATA
// ──────────────────────────────────────────────
const angleSections: AngleSectionData[] = [
  {
    number: "01",
    badge: "CA",
    title: "Craniovertebral Angle (CA)",
    subtitle: "Neck & Head Alignment",
    description:
      "CA is computed from the Left Ear and Left Shoulder landmarks detected by MediaPipe. It measures the inclination of the head relative to the shoulder using the angle between the Shoulder→Ear line and the horizontal axis.",
    whatMeasured:
      "The angle between the Shoulder→Ear direction vector and the horizontal axis, with the Left Shoulder as the reference point.",
    whyMatters:
      "CA is a widely used indicator of Forward Head Posture (FHP) - a condition commonly caused by prolonged smartphone and computer use. As the head shifts forward, strain on the cervical spine increases significantly.",
    image: cranioImg,
    imageAlt: "Craniovertebral Angle diagram",
    reverse: false,
    accentColor: "#2563eb",
    badgeColor: "#dbeafe",
    cardColor1: "#eff6ff",
    cardColor2: "#fef3c7",
    textColor1: "#1e40af",
    textColor2: "#92400e",
    pictureSource: "https://www.researchgate.net/publication/284018894_Evaluation_of_forward_head_posture_in_sitting_and_standing_positions",
  },
  {
    number: "02",
    badge: "SA",
    title: "Shoulder Angle (SA)",
    subtitle: "Trunk & Torso Inclination",
    description:
      "SA is computed from the Left Hip and Left Shoulder landmarks detected by MediaPipe. It measures how upright or forward-leaning the torso is by calculating the angle between the Hip→Shoulder line and the horizontal axis.",
    whatMeasured:
      "The angle between the Hip→Shoulder direction vector and the horizontal axis, measured at the Left Shoulder as the vertex reference.",
    whyMatters:
      "SA captures torso inclination during sitting. A forward-leaning torso increases compressive load on the lumbar spine and activates compensatory muscle tension in the shoulders and upper back.",
    image: shoulderImg,
    imageAlt: "Shoulder Angle (SA) diagram",
    reverse: true,
    accentColor: "#0891b2",
    badgeColor: "#cffafe",
    cardColor1: "#ecfeff",
    cardColor2: "#fef3c7",
    textColor1: "#155e75",
    textColor2: "#92400e",
  },
  {
    number: "03",
    badge: "KA",
    title: "Keystone Angle (KA)",
    subtitle: "Overall Postural Alignment",
    description:
      "KA is computed using all three key MediaPipe landmarks: Left Ear, Left Shoulder, and Left Hip. It measures the angle at the Shoulder vertex between the two direction vectors - toward the Ear and toward the Hip.",
    whatMeasured:
      "The vertex angle at the Left Shoulder between the Shoulder→Ear and Shoulder→Hip direction vectors, representing the overall body alignment at the shoulder joint.",
    whyMatters:
      "KA provides a holistic view of postural alignment. When the ear, shoulder, and hip are well-aligned, the spine sustains less compensatory muscular load. Significant deviation from a straight line indicates postural imbalance across the entire upper body.",
    image: kyphosisImg,
    imageAlt: "Keystone Angle diagram",
    reverse: false,
    accentColor: "#7c3aed",
    badgeColor: "#ede9fe",
    cardColor1: "#f5f3ff",
    cardColor2: "#fef3c7",
    textColor1: "#4c1d95",
    textColor2: "#92400e",
    pictureSource: "https://www.performancehealth.com/articles/how-to-treat-your-kyphosis-exercises-and-supports?srsltid=AfmBOorTrhaMvA9jT_DPWZf5vwsGEqRjBlZ2fy70x6Om3B7EEndfRh7A",
  },
];

// ──────────────────────────────────────────────
//  SUB-COMPONENTS
// ──────────────────────────────────────────────

function AngleSection({
  data,
  setSelectedImage,
}: {
  data: AngleSectionData;
  setSelectedImage: React.Dispatch<
    React.SetStateAction<{ src: string; alt: string } | null>
  >;
}) {
  const [imgHovered, setImgHovered] = useState(false);

  const textBlock = (
    <div style={{ flex: 1, minWidth: "320px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span
          style={{
            background: data.badgeColor,
            color: data.accentColor,
            fontWeight: "800",
            fontSize: "0.8rem",
            padding: "4px 14px",
            borderRadius: "40px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {data.badge}
        </span>
        <span
          style={{
            color: "#94a3b8",
            fontSize: "0.9rem",
            fontWeight: "600",
          }}
        >
          {data.subtitle}
        </span>
      </div>

      {/* Title */}
      <h2
        style={{
          margin: 0,
          fontSize: "2.5rem",
          fontWeight: "800",
          color: "#0f172a",
          lineHeight: 1.2,
        }}
      >
        {data.title}
      </h2>

      {/* Description */}
      <p
        style={{
          margin: 0,
          color: "#475569",
          lineHeight: 1.75,
          fontSize: "1.5rem",
        }}
      >
        {data.description}
      </p>

      {/* Divider */}
      <div
        style={{
          width: "48px",
          height: "3px",
          background: data.accentColor,
          borderRadius: "4px",
        }}
      />

      {/* Info Cards — 2 cards only: What is Measured + Why It Matters */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* Card 1: What is Measured */}
        <div
          style={{
            background: data.cardColor1,
            borderRadius: "14px",
            padding: "18px 22px",
            borderLeft: `4px solid ${data.accentColor}`,
          }}
        >
          <div
            style={{
              fontWeight: "700",
              fontSize: "0.8rem",
              color: data.textColor1,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: "8px",
            }}
          >
            What is Measured
          </div>
          <div style={{ color: "#1e293b", fontSize: "1.25rem", lineHeight: 1.65 }}>
            {data.whatMeasured}
          </div>
        </div>

        {/* Card 2: Why It Matters */}
        <div
          style={{
            background: data.cardColor2,
            borderRadius: "14px",
            padding: "18px 22px",
            borderLeft: "4px solid #d97706",
          }}
        >
          <div
            style={{
              fontWeight: "700",
              fontSize: "0.8rem",
              color: data.textColor2,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: "8px",
            }}
          >
            Why It Matters
          </div>
          <div style={{ color: "#1e293b", fontSize: "1.05rem", lineHeight: 1.65 }}>
            {data.whyMatters}
          </div>
        </div>
      </div>

      {/* Picture source link */}
      {data.pictureSource && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ width: "48px", height: "3px", background: data.accentColor, borderRadius: "4px" }} />
          <a
            href={data.pictureSource}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "1.1rem",
              color: data.accentColor,
              textDecoration: "none",
              fontWeight: "500",
              display: "inline-block",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "none"; }}
          >
            Picture source
          </a>
        </div>
      )}
    </div>
  );

  const imgBlock = (
    <div
      style={{ flex: 1, minWidth: "300px" }}
      onMouseEnter={() => setImgHovered(true)}
      onMouseLeave={() => setImgHovered(false)}
    >
      <img
        src={data.image}
        alt={data.imageAlt}
        onClick={() => setSelectedImage({ src: data.image, alt: data.imageAlt })}
        style={{
          width: "100%",
          borderRadius: "20px",
          cursor: "pointer",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          transform: imgHovered ? "translateY(-6px)" : "translateY(0)",
          boxShadow: imgHovered
            ? `0 20px 48px ${data.accentColor}30`
            : "0 8px 24px rgba(0,0,0,0.09)",
          display: "block",
        }}
      />
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: data.reverse ? "row-reverse" : "row",
        gap: "52px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {textBlock}
      {imgBlock}
    </div>
  );
}

function btnStyle(bg: string, color: string): React.CSSProperties {
  return {
    padding: "12px 28px",
    background: bg,
    color: color,
    border: "2px solid #111827",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "0.95rem",
    transition: "0.2s ease",
  };
}

// ──────────────────────────────────────────────
//  MAIN PAGE
// ──────────────────────────────────────────────
export default function AngleInformation() {
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  return (
    <div style={{ fontFamily: "sans-serif", background: "#ffffff", minHeight: "100vh" }}>

      {/* ── HERO BANNER ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #2563eb 0%, #dbeafe 70%, #ffffff 100%)",
          padding: "56px 64px 48px 64px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h1
            style={{
              margin: "0 auto 24px auto",
              fontSize: "4rem",
              fontWeight: "900",
              color: "#0f172a",
              lineHeight: 1.1,
            }}
          >
            Angle Information
          </h1>
          <p
            style={{
              margin: "0 auto",
              fontSize: "1.4rem",
              color: "#475569",
              lineHeight: 1.85,
              maxWidth: "900px",
            }}
          >
            This system uses three key angles - CA, SA, and KA - derived from
            body landmark positions detected by MediaPipe, to analyze sitting
            posture in real time.
          </p>
        </div>
      </div>

      {/* ── FLOATING SUMMARY CARDS ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          flexWrap: "wrap",
          marginTop: "80px",
          marginBottom: "20px",
          padding: "0 40px",
        }}
      >
        {[
          {
            abbr: "CA",
            name: "Craniovertebral Angle",
            bodyPart: "Neck & Head",
            method: "Shoulder → Ear vs. Horizontal",
            color: "#2563eb",
            bg: "#eff6ff",
          },
          {
            abbr: "SA",
            name: "Shoulder Angle",
            bodyPart: "Trunk & Torso",
            method: "Hip → Shoulder vs. Horizontal",
            color: "#0891b2",
            bg: "#ecfeff",
          },
          {
            abbr: "KA",
            name: "Keystone Angle",
            bodyPart: "Full Body Alignment",
            method: "Ear – Shoulder – Hip vertex",
            color: "#7c3aed",
            bg: "#f5f3ff",
          },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "28px 36px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.09)",
              borderTop: `4px solid ${card.color}`,
              minWidth: "300px",
              flex: "1 1 280px",
              maxWidth: "380px",
            }}
          >
            {/* Abbreviation */}
            <div
              style={{
                fontSize: "3.5rem",
                fontWeight: "900",
                color: card.color,
                lineHeight: 1,
                marginBottom: "8px",
              }}
            >
              {card.abbr}
            </div>

            {/* Full name */}
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: "700",
                color: "#0f172a",
                marginBottom: "14px",
              }}
            >
              {card.name}
            </div>

            {/* Divider */}
            <div
              style={{
                borderTop: "1.5px solid #e2e8f0",
                marginBottom: "12px",
              }}
            />

            {/* Body part tag */}
            <div style={{ marginBottom: "6px" }}>
              <span
                style={{
                  background: card.bg,
                  color: card.color,
                  fontWeight: "700",
                  fontSize: "0.75rem",
                  padding: "3px 12px",
                  borderRadius: "40px",
                  letterSpacing: "0.05em",
                }}
              >
                {card.bodyPart}
              </span>
            </div>

            {/* Method */}
            <div
              style={{
                fontSize: "0.9rem",
                color: "#64748b",
                marginTop: "8px",
                fontStyle: "italic",
              }}
            >
              {card.method}
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div
        style={{
          padding: "70px",
          display: "flex",
          flexDirection: "column",
          gap: "72px",
        }}
      >
        {/* Section label */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              background: "#dbeafe",
              color: "#2563eb",
              fontWeight: "700",
              fontSize: "0.85rem",
              padding: "6px 18px",
              borderRadius: "40px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "14px",
            }}
          >
            3 Angles Used in This System
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: "2.5rem",
              fontWeight: "800",
              color: "#0f172a",
            }}
          >
            Understanding what each angle measures
          </h2>
        </div>

        {/* Angle sections */}
        {angleSections.map((section, i) => (
          <React.Fragment key={i}>
            <AngleSection data={section} setSelectedImage={setSelectedImage} />
            {i < angleSections.length - 1 && (
              <div style={{ height: "1px", background: "#e2e8f0" }} />
            )}
          </React.Fragment>
        ))}

        {/* ── WHY THESE 3 ANGLES ── */}
        <div
          style={{
            background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
            borderRadius: "24px",
            padding: "48px 52px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#0891b2",
              color: "white",
              fontWeight: "700",
              fontSize: "1.5rem",
              padding: "5px 18px",
              borderRadius: "40px",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Why These 3 Angles?
          </div>

          <h2
            style={{
              margin: "0 0 28px 0",
              fontSize: "2rem",
              fontWeight: "800",
              color: "#0f172a",
            }}
          >
            A complementary set of posture measurements
          </h2>

          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {[
              {
                text: "CA focuses on the head and neck - the most common area affected by forward posture from device use.",
                hover: "#dbeafe",
              },
              {
                text: "SA focuses on the torso - capturing whether the body is upright or leaning, which directly impacts lumbar health.",
                hover: "#cffafe",
              },
              {
                text: "KA captures the overall body alignment across all three landmark points, providing a holistic posture picture.",
                hover: "#ede9fe",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  flex: "1 1 240px",
                  background: "white",
                  borderRadius: "16px",
                  padding: "32px 26px",
                  cursor: "default",
                  transition: "all 0.25s ease",
                  minHeight: "160px",
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = item.hover;
                  e.currentTarget.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: "700",
                    color: "#1e293b",
                    fontSize: "1.5rem",
                    lineHeight: 1.7,
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── NAVIGATION ── */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <button
            onClick={() => navigate("/impact-of-bad-posture")}
            style={btnStyle("white", "#111827")}
          >
            ← Back
          </button>

          <button
            onClick={() => navigate("/")}
            style={btnStyle("white", "#111827")}
          >
            Home
          </button>

          <button
            onClick={() => navigate("/guide-for-posture-check")}
            style={btnStyle("#111827", "white")}
          >
            Next →
          </button>
        </div>
      </div>

      {/* ── IMAGE MODAL ── */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.82)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "30px",
          }}
        >
          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "92%",
              maxHeight: "92%",
              borderRadius: "20px",
              objectFit: "contain",
              boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
            }}
          />
          <button
            onClick={() => setSelectedImage(null)}
            style={{
              position: "absolute",
              top: "20px",
              right: "30px",
              border: "none",
              background: "transparent",
              color: "white",
              fontSize: "2.5rem",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}