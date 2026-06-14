import { useNavigate } from "react-router-dom";
import { useState } from "react";
import React from "react";

// ──────────────────────────────────────────────
//  IMAGE IMPORTS
//  Letakkan file-file ini di src/assets/
// ──────────────────────────────────────────────
import muscularImg    from "../assets/B/musculoskeletal_pain.jpeg";
import neckImg        from "../assets/B/Neck_Syndrome.png";
import eyeImg         from "../assets/B/Eye_Problems.jpeg";
import psychoImg      from "../assets/B/psycological_and_academic_effect.jpeg";
import longTermImg    from "../assets/B/Long_Term_Risk.jpeg";

// ──────────────────────────────────────────────
//  TYPES
// ──────────────────────────────────────────────
interface BulletItem { text: string }

interface SectionData {
  number: string;
  title: string;
  description: string;
  items: BulletItem[];
  imgSrc: string;
  imgAlt: string;
  imgRight: boolean;
  accent: string;
  tag: string;

  imageWidth?: string;
  imageHeight?: string;
  imageFit?: "cover" | "contain";
  imageScale?: number;
}

// ──────────────────────────────────────────────
//  DATA
// ──────────────────────────────────────────────
const sections: SectionData[] = [
  {
    number: "1",
    title: "Musculoskeletal Pain",
    description:
      "Poor posture such as slouching or bending the neck for long periods can cause pain that may persist and continue into adulthood if not treated early.",
    items: [
      { text: "Neck pain — affects ~67% of adolescents" },
      { text: "Shoulder tension and stiffness" },
      { text: "Upper & mid back aches" },
      { text: "Lower back pain — affects ~73% of adolescents" },
    ],
    imgSrc: muscularImg,
    imgAlt: "Musculoskeletal pain points on the body",
    imgRight: false,
    accent: "#ef4444",
    tag: "Physical",

    imageWidth: "650px",
    imageHeight: "650px",
  },
  {
    number: "2",
    title: "Text Neck Syndrome",
    description:
      "Using smartphones with a forward-bent neck places enormous pressure on the cervical spine — the steeper the angle, the heavier the effective load.",
    items: [
      { text: "Neck pressure up to 27 kg at 60° forward tilt" },
      { text: "Gradual changes in cervical spine structure" },
      { text: "Risk of long-term spinal degeneration" },
    ],
    imgSrc: neckImg,
    imgAlt: "Phone posture and neck pressure diagram",
    imgRight: true,
    accent: "#f97316",
    tag: "Digital Habit",

    imageWidth: "800px",
    imageHeight: "400px",

    imageFit: "contain",
    imageScale: 1,
  },
  {
    number: "3",
    title: "Eye Problems",
    description:
      "Poor posture while using screens forces eyes to work harder, leading to strain due to prolonged focus on close objects.",
    items: [
      { text: "Eye strain and fatigue" },
      { text: "Dry eyes from reduced blinking" },
      { text: "Increased risk of nearsightedness" },
    ],
    imgSrc: eyeImg,
    imgAlt: "Eye strain from screen use",
    imgRight: false,
    accent: "#8b5cf6",
    tag: "Vision",

    imageWidth: "650px",
    imageHeight: "580px",
  },
  {
    number: "4",
    title: "Psychological & Academic Effects",
    description:
      "Poor posture is often linked to excessive device use. This combination significantly impacts mental well-being and academic performance.",
    items: [
      { text: "Irritability and mood changes" },
      { text: "Increased stress and anxiety" },
      { text: "Lower academic performance" },
      { text: "Reduced social interaction" },
      { text: "Disrupted studying and concentration" },
      { text: "Increased school absenteeism" },
      { text: "Reduced physical activity" },
    ],
    imgSrc: psychoImg,
    imgAlt: "Student overwhelmed by academic stress",
    imgRight: true,
    accent: "#36a7cf",
    tag: "Mental Health",

    imageWidth: "650px",
    imageHeight: "580px",
  },
  {
    number: "5",
    title: "Long-Term Risk",
    description:
      "If not corrected early, poor posture can set off a chain of chronic conditions that significantly reduce quality of life.",
    items: [
      { text: "Chronic persistent pain" },
      { text: "Spinal disorders and deformities" },
      { text: "Reduced overall quality of life" },
    ],
    imgSrc: longTermImg,
    imgAlt: "Long-term spinal degeneration from poor posture",
    imgRight: false,
    accent: "#dc2626",
    tag: "Long-Term",

    imageWidth: "650px",
    imageHeight: "580px",
  },
];


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

// ──────────────────────────────────────────────
//  SUB-COMPONENTS
// ──────────────────────────────────────────────

/** Bullet list with coloured dot */
function BulletList({ items, accent }: { items: BulletItem[]; accent: string }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "1.25rem", lineHeight: 1.55, color: "#2d3748" }}>
          <span style={{
            width: "22px", height: "22px", borderRadius: "50%",
            background: accent, color: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, fontSize: "0.7rem", fontWeight: "bold", marginTop: "1px",
          }}>✕</span>
          {item.text}
        </li>
      ))}
    </ul>
  );
}

/** Full section: text + image alternating layout */
function ImpactSection({ 
  data,
  setSelectedImage
}: { 
  data: SectionData; 
  setSelectedImage: React.Dispatch<
    React.SetStateAction<{ 
      src: string; 
      alt: string 
    } | null>
  >;
 }) {
  const [hovered, setHovered] = useState(false);

  const textBlock = (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "20px" }}>
      {/* Tag pill */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "10px",
      }}>
        <span style={{
          background: data.accent + "18",
          color: data.accent,
          fontWeight: "700",
          fontSize: "0.75rem",
          padding: "4px 14px",
          borderRadius: "40px",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}>{data.tag}</span>
      </div>

      {/* Number badge + title */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "50%",
          background: data.accent, color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: "900", fontSize: "1.1rem", flexShrink: 0,
        }}>{data.number}</div>
        <h2 style={{ margin: 0, fontSize: "2.5rem", fontWeight: "800", color: "#1a202c" }}>{data.title}</h2>
      </div>

      <p style={{ margin: 0, fontSize: "1.5rem", color: "#4a5568", lineHeight: 1.75 }}>{data.description}</p>

      {/* Accent divider */}
      <div style={{ width: "48px", height: "3px", background: data.accent, borderRadius: "4px" }} />

      <BulletList items={data.items} accent={data.accent} />
    </div>
  );

  const imgBlock = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() =>
        setSelectedImage({
          src: data.imgSrc,
          alt: data.imgAlt,
        })
      }
      style={{
        flexShrink: 0,
        width: data.imageWidth || "650px",
        height: data.imageHeight || "520px",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: hovered
          ? `0 20px 50px ${data.accent}40`
          : "0 8px 24px rgba(0,0,0,0.10)",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        cursor: "pointer",
      }}
    >
      <img
        src={data.imgSrc}
        alt={data.imgAlt}
        style={{ 
          width: "100%",
          height: data.imageHeight || "520px",
          objectFit: data.imageFit || "cover",
          transform: `scale(${data.imageScale ||1})`,
          display: "block"
        }}
      />
    </div>
  );

  return (
    <div style={{
      display: "flex",
      gap: "48px",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
    }}>
      {data.imgRight ? <>{textBlock}{imgBlock}</> : <>{imgBlock}{textBlock}</>}
    </div>
  );
}

// ──────────────────────────────────────────────
//  MAIN PAGE
// ──────────────────────────────────────────────
export default function ImpactOfBadPosture() {
  const navigate = useNavigate();
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);


  return (
    <div style={{ fontFamily: "sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", background: "#ffffff" }}>

      {/* ── NAVBAR ── */}
      <header style={{ background: "#f4f4f4", padding: "16px 40px" }}>
        <span
          onClick={() => navigate("/")}
          style={{ color: "black", fontWeight: "bold", fontSize: "1rem", cursor: "pointer" }}
        >
          Logo
        </span>
      </header>

      {/* ── HERO BANNER ── */}
      <div
        style={{
          background:"linear-gradient(135deg, #ef4444 0%, #fef3f0 70%, #ffffff 100%)",
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

          {/* Main Text */}
          <div style={{ maxWidth: "1100px" }}>
            <h1
              style={{
                margin: "0 auto 40px auto",
                fontSize: "4rem",
                fontWeight: "900",
                color: "#1a202c",
                lineHeight: 1.1,
              }}
            >
              Impact of Bad Posture
            </h1>

            <p
              style={{
                margin: "0 auto",
                fontSize: "1.5rem",
                color: "#4a5568",
                lineHeight: 1.9,
                maxWidth: "1000px",
              }}
            >
              Poor posture isn't just uncomfortable — it triggers a cascade of physical, mental, and academic consequences that worsen over time if left unaddressed.
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
            value: "73%",
            label: "teens with low back pain",
            color: "#ef4444",
          },
          {
            value: "67%",
            label: "teens with neck pain",
            color: "#f97316",
          },
          {
            value: "80%+",
            label: "adolescents with body pain",
            color: "#dc2626",
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
                color: "#718096",
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
      <main style={{ flex: 1, padding: "64px 64px 80px 64px", display: "flex", flexDirection: "column", gap: "80px" }}>

        {/* Section label */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            display: "inline-block",
            background: "#fde8e8",
            color: "#c53030",
            fontWeight: "700",
            fontSize: "0.85rem",
            padding: "6px 18px",
            borderRadius: "40px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}>
            6 Key Impacts to Understand
          </div>
          <h2 style={{ margin: 0, fontSize: "2.5rem", fontWeight: "800", color: "#1a202c" }}>
            What bad posture does to your body & mind
          </h2>
        </div>

        {/* All sections */}
        {sections.map((section, i) => (
          <React.Fragment key={i}>
            <ImpactSection 
            data={section}
            setSelectedImage={setSelectedImage}
             />
            {i < sections.length - 1 && (
              <div style={{ height: "1px", background: "#e2e8f0" }} />
            )}
          </React.Fragment>
        ))}

        {/* ── FUN FACTS ── */}
        <div style={{
          background: "linear-gradient(135deg, #fde8e8 0%, #fef3f0 100%)",
          borderRadius: "24px",
          padding: "48px 52px",
        }}>
          <div style={{
            display: "inline-block",
            background: "#ef4444",
            color: "white",
            fontWeight: "700",
            fontSize: "1.8rem",
            padding: "5px 16px",
            borderRadius: "40px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}>
          Fun Facts
          </div>
          <h2 style={{ margin: "0 0 32px 0", fontSize: "1.6rem", fontWeight: "800", color: "#1a202c" }}>
            The numbers behind the problem
          </h2>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {[
              {
                text: "Teenagers use gadgets for 5–7 hours per day on average",
                hoverBg: "#d9f7ff",
                border: "#36c5f0",
              },
              {
                text: "The human head (4–5 kg) can feel like 27 kg when bent forward",
                hoverBg: "#fff7d6",
                border: "#f4b400",
              },
              {
                
                text: "More than 80% of adolescents experience body pain from posture",
                hoverBg: "#dbeafe",
                border: "#1d4ed8",
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
                  e.currentTarget.style.background = fact.hoverBg;
                  e.currentTarget.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.transform = "translateY(0px)";
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

        {/* ── CONCLUSION ── */}
        <div style={{
          background: "#1a202c",
          borderRadius: "24px",
          padding: "52px 52px",
          display: "flex",
          alignItems: "flex-start",
          gap: "28px",
        }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "50%",
            background: "#ef4444",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, fontSize: "1.4rem",
          }}>
          </div>
          <div>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "1.5rem", fontWeight: "800", color: "white" }}>Conclusion</h3>
            <p style={{ margin: 0, color: "#cbd5e0", fontSize: "1.25rem", lineHeight: 1.75 }}>
              Bad posture is not just a physical issue — it ripples into your mental health, academic life, and future well-being.
              The good news?{" "}
              <strong style={{ color: "#36a7cf" }}>Awareness and small corrections today can prevent serious problems tomorrow.</strong>
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
          onClick={() => navigate("/correct-body-posture")}
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
          onClick={() => navigate("/ideal-posture-angel")}
          onMouseEnter={() => setHoveredBtn("next")}
          onMouseLeave={() => setHoveredBtn(null)}
          style={navBtn(hoveredBtn === "next", true)}
        >
          Next: Ideal Posture Angle →
        </button>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#36a7cf", color: "white", padding: "20px 64px", fontSize: "0.95rem" }}>
        2026
      </footer>


      {/* ── IMAGE MODAL ── */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.82)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "30px",
            cursor: "pointer",
            animation: "fadeIn 0.25s ease",
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            style={{
              position: "absolute",
              top: "20px",
              right: "30px",
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "2.7rem",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ×
          </button>

          {/* Full Image */}
          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "92%",
              maxHeight: "90%",
              borderRadius: "22px",
              objectFit: "contain",
              boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
            }}
          />
        </div>
      )}

    </div>
  );
}