import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import cranioImg from "../assets/C/Craniovertebral_Angle.jpeg";
import kyphosisImg from "../assets/C/Kyphosis_Angle.jpeg";
import riskImg from "../assets/C/Long_Term_Risk.jpeg";

export default function IdealPostureAngel() {
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        background: "#ffffff",
        minHeight: "100vh",
      }}
    >
      {/* ── HERO BANNER ── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #60a5fa 0%, #dbeafe 70%, #ffffff 100%)",
          padding: "56px 64px 48px 64px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <div style={{ maxWidth: "1100px" }}>
            <h1
              style={{
                margin: "0 auto 40px auto",
                fontSize: "4rem",
                fontWeight: "900",
                color: "#0f172a",
                lineHeight: 1.1,
              }}
            >
              Ideal Posture Angle
            </h1>

            <p
              style={{
                margin: "0 auto",
                fontSize: "1.5rem",
                color: "#475569",
                lineHeight: 1.9,
                maxWidth: "1000px",
              }}
            >
              Ideal posture angles are measurements of body alignment involving
              the head, shoulders, and spine to determine whether posture is
              healthy or indicates potential problems.
            </p>
          </div>
        </div>
      </div>

      {/* ── FLOATING STATS ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          flexWrap: "wrap",
          marginTop: "100px",
          marginBottom: "40px",
          position: "relative",
          zIndex: 5,
        }}
      >
        {[
          {
            value: "50°–55°",
            label: "Ideal Craniovertebral Angle",
            color: "#2563eb",
          },
          {
            value: "50°–53°",
            label: "Ideal Shoulder Angle",
            color: "#0ea5e9",
          },
          {
            value: "20°",
            label: "Ideal Kyphosis Angle",
            color: "#1d4ed8",
          },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "26px 36px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
              borderTop: `4px solid ${stat.color}`,
              minWidth: "360px",
            }}
          >
            <div
              style={{
                fontSize: "4rem",
                fontWeight: "900",
                color: stat.color,
              }}
            >
              {stat.value}
            </div>

            <div
              style={{
                fontSize: "1.25rem",
                color: "#64748b",
                marginTop: "4px",
                lineHeight: 1.5,
              }}
            >
              {stat.label}
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
          gap: "70px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              background: "#dbeafe",
              color: "#2563eb",
              fontWeight: "700",
              fontSize: "1rem",
              padding: "8px 18px",
              borderRadius: "40px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            3 Key Angles to Understand
          </div>

  <h2
    style={{
      margin: 0,
      fontSize: "2.5rem",
      fontWeight: "800",
      color: "#0f172a",
    }}
  >
    Understanding ideal posture measurements
  </h2>
</div>
        {/* SECTION 1 */}
        <PostureSection
          number="01"
          title="Craniovertebral Angle (CA)"
          description="Measures head position relative to the neck and upper back. A smaller angle usually indicates forward head posture."
          ideal="Ideal: ≥ 50°–55°"
          bad="Poor posture: < 48°"
          image={cranioImg}
          imageAlt="Craniovertebral Angle"
          setSelectedImage={setSelectedImage}
        />

        {/* SECTION 2 */}
        <PostureSection
          number="02"
          title="Kyphosis Angle (KA)"
          description="Measures upper back curvature. Excessive curvature may indicate kyphosis or hunchback posture."
          ideal="Ideal: around 20°"
          bad="Poor posture: > 40°"
          image={kyphosisImg}
          imageAlt="Kyphosis Angle"
          setSelectedImage={setSelectedImage}
          reverse
        />

        {/* SECTION 3 */}
        <PostureSection
          number="03"
          title="Long-Term Risk"
          description="Poor posture habits over time can lead to spinal imbalance, height loss appearance, and chronic pain."
          ideal="Maintains spinal balance"
          bad="Can cause posture deformities"
          image={riskImg}
          imageAlt="Long Term Risk"
          setSelectedImage={setSelectedImage}
        />

        {/* ── WHY IT MATTERS ── */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #fdfedb 0%, #ffffff 100%)",
            borderRadius: "24px",
            padding: "48px 52px",
          }}
        >
          {/* Label */}
          <div
            style={{
              display: "inline-block",
              background: "#eb8525",
              color: "white",
              fontWeight: "700",
              fontSize: "1.8rem",
              padding: "5px 16px",
              borderRadius: "40px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            WHY IT MATTERS
          </div>

          {/* Title */}
          <h2
            style={{
              margin: "0 0 32px 0",
              fontSize: "2.5rem",
              fontWeight: "800",
              color: "#1a202c",
              lineHeight: 1.2,
            }}
          >
            Why ideal posture matters
          </h2>

          {/* Cards */}
          <div
            style={{
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            {[
              {
                text: "Maintains musculoskeletal health",
                hover: "#dbeafe",
              },
              {
                text: "Prevents neck and back pain",
                hover: "#bfdbfe",
              },
              {
                
                text: "Helps detect spinal deformities early",
                hover: "#c7d2fe",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  flex: "1 1 240px",
                  background: "white",
                  borderRadius: "18px",
                  padding: "40px 30px",
                  border: "2px solid transparent",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  minHeight: "200px",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = item.hover;
                  e.currentTarget.style.transform =
                    "translateY(-8px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.transform =
                    "translateY(0px)";
                }}
              >

                {/* Text */}
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "1.5rem",
                    lineHeight: 1.7,
                    color: "#1e293b",
                  }}
                >                  
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* ── FUN FACTS ── */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #b7c7fc 0%, #b7c7fc 100%)",
            borderRadius: "28px",
            padding: "50px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#2563eb",
              color: "white",
              fontWeight: "700",
              fontSize: "1.8rem",
              padding: "5px 16px",
              borderRadius: "40px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Fun Facts
          </div>

          <h2
            style={{
              fontSize: "1.6rem",
              fontWeight: "900",
              color: "#0f172a",
              marginBottom: "32px",
            }}
          >
            Did you know?
          </h2>

          <div
            style={{
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            {[
              {
                text: "The human head weighs 4–5 kg",
                hover: "#dbeafe",
              },
              {
                text: "It can feel like 27 kg when bent forward",
                hover: "#ede9fe",
              },
              {
                text: "This habit is called “tech-neck”",
                hover: "#cffafe",
              },
            ].map((fact, i) => (
              <div
                key={i}
                style={{
                  flex: "1 1 240px",
                  background: "white",
                  borderRadius: "18px",
                  padding: "40px 30px",
                  border: "2px solid transparent",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  minHeight: "200px",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = fact.hover;
                  e.currentTarget.style.transform =
                    "translateY(-6px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.transform =
                    "translateY(0px)";
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
                {fact.text}
              </p>
              </div>
            ))}
          </div>
        </div>

        {/* NAVIGATION */}
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

      {/* IMAGE MODAL */}
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

function PostureSection({
  number,
  title,
  description,
  ideal,
  bad,
  image,
  imageAlt,
  reverse,
  setSelectedImage,
}: any) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: reverse ? "row-reverse" : "row",
        gap: "48px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* TEXT */}
      <div style={{ flex: 1, minWidth: "320px" }}>
        {/* Number badge + title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "#2563eb",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "900",
              fontSize: "1.1rem",
              flexShrink: 0,
            }}
          >
            {number}
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "2.5rem",
              fontWeight: "800",
              color: "#1a202c",
            }}
          >
            {title}
          </h2>
        </div>
        <p
          style={{
            color: "#475569",
            lineHeight: 1.75,
            marginBottom: "20px",
            fontSize: "1.5rem",
          }}
        >
          {description}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div
            style={{
              background: "#dcfce7",
              padding: "16px 20px",
              borderRadius: "14px",
              fontWeight: "700",
              fontSize: "1.25rem",
              color: "#166534",
            }}
          >
            ✓ {ideal}
          </div>

          <div
            style={{
              background: "#fee2e2",
              padding: "16px 20px",
              borderRadius: "14px",
              fontWeight: "700",
              fontSize: "1.25rem",
              color: "#991b1b",
            }}
          >            
            ✕ {bad}
          </div>
        </div>
      </div>

      {/* IMAGE */}
      <div style={{ flex: 1, minWidth: "320px" }}>
        <img
          src={image}
          alt={imageAlt}
          onClick={() =>
            setSelectedImage({
              src: image,
              alt: imageAlt,
            })
          }
          style={{
            width: "100%",
            borderRadius: "24px",
            cursor: "pointer",
            transition: "0.25s ease",
            boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "translateY(-6px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translateY(0px)";
          }}
        />
      </div>
    </div>
  );
}

function btnStyle(
  bg: string,
  color: string
): React.CSSProperties {
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