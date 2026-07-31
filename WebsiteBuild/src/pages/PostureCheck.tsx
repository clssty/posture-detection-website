import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
interface PostureData {
  detected: boolean;
  ca?: number;
  sa?: number;
  ka?: number;
  ca_status?: "Good" | "Fair" | "Poor";
  sa_status?: "Good" | "Fair" | "Poor";
  ka_status?: "Good" | "Fair" | "Poor";
  overall?: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const SERVER_URL = "http://localhost:8000";
const WS_URL = "ws://localhost:8000/ws";
const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc-FCifl37MjFnQ1o7gwgu8Z-VjQDFUU_8hNAFlA0QZsEmusA/viewform?usp=publish-editor";

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_COLOR: Record<string, string> = {
  Good: "#22c55e",
  Fair: "#f59e0b",
  Poor: "#ef4444",
};

const STATUS_BG: Record<string, string> = {
  Good: "rgba(34,197,94,0.12)",
  Fair: "rgba(245,158,11,0.12)",
  Poor: "rgba(239,68,68,0.12)",
};

function statusColor(s?: string) {
  return STATUS_COLOR[s ?? ""] ?? "#9ca3af";
}
function statusBg(s?: string) {
  return STATUS_BG[s ?? ""] ?? "rgba(156,163,175,0.12)";
}

// ── Angle badge component ─────────────────────────────────────────────────────
function AngleBadge({
  label,
  angle,
  status,
  goodMin,
  description,
}: {
  label: string;
  angle?: number;
  status?: string;
  goodMin: number;
  description: string;
}) {
  return (
    <div
      style={{
        background: statusBg(status),
        border: `1.5px solid ${statusColor(status)}`,
        borderRadius: "16px",
        padding: "18px 20px",
        transition: "all 0.3s ease",
      }}
    >
      {/* Label row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "#1e293b" }}>
          {label}
        </span>
        {status && (
          <span
            style={{
              background: statusColor(status),
              color: "#fff",
              fontSize: "0.72rem",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "99px",
              letterSpacing: "0.05em",
            }}
          >
            {status}
          </span>
        )}
      </div>

      {/* Angle value */}
      <div
        style={{
          fontSize: "2.2rem",
          fontWeight: 900,
          color: statusColor(status),
          lineHeight: 1,
          marginBottom: "8px",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {angle !== undefined ? `${Math.round(angle)}°` : "—"}
      </div>

      {/* Description */}
      <div style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.5 }}>
        {description}
      </div>

      {/* Good threshold hint */}
      <div
        style={{
          fontSize: "0.72rem",
          color: "#94a3b8",
          marginTop: "6px",
        }}
      >
        Good ≥ {goodMin}°
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function PostureCheck() {
  const navigate = useNavigate();

  const [serverOnline, setServerOnline] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [data, setData] = useState<PostureData>({ detected: false });
  const [checkingConn, setCheckingConn] = useState(true);

  // Show form modal every time the page is visited
  const [showFormModal, setShowFormModal] = useState<boolean>(true);
  const dismissModal = () => {
    setShowFormModal(false);
  };

  const wsRef = useRef<WebSocket | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // ── Check if Python server is reachable ─────────────────────────────────────
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/health`, { signal: AbortSignal.timeout(3000) });
        setServerOnline(res.ok);
      } catch {
        setServerOnline(false);
      } finally {
        setCheckingConn(false);
      }
    };
    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  // ── WebSocket data stream ────────────────────────────────────────────────────
  useEffect(() => {
    if (!analyzing) {
      wsRef.current?.close();
      wsRef.current = null;
      return;
    }

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onmessage = (e) => {
      try {
        setData(JSON.parse(e.data) as PostureData);
      } catch {/* ignore parse error */ }
    };

    ws.onerror = () => setAnalyzing(false);
    ws.onclose = () => {
      if (analyzing) setAnalyzing(false);
    };

    return () => ws.close();
  }, [analyzing]);

  // ── Controls ─────────────────────────────────────────────────────────────────
  const handleStart = () => {
    if (!serverOnline) return;
    setAnalyzing(true);
    setData({ detected: false });
  };

  const handleStop = () => {
    setAnalyzing(false);
    setData({ detected: false });
  };

  // ── Overall status display ───────────────────────────────────────────────────
  const isGoodPosture = data.overall === "Good Posture";
  const overallColor = isGoodPosture ? "#22c55e" : "#f59e0b";

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)",
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── NAVBAR ── */}
      <header
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          padding: "16px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            fontWeight: 900,
            cursor: "pointer",
            color: "#0ea5e9",
            letterSpacing: "-0.03em",
          }}
        >
          PostureLab
        </button>

        {/* Server status pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: serverOnline ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${serverOnline ? "#22c55e" : "#ef4444"}`,
            borderRadius: "99px",
            padding: "6px 14px",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: serverOnline ? "#16a34a" : "#dc2626",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: checkingConn ? "#94a3b8" : serverOnline ? "#22c55e" : "#ef4444",
              display: "inline-block",
              animation: serverOnline ? "pulse 1.5s infinite" : "none",
            }}
          />
          {checkingConn
            ? "Checking…"
            : serverOnline
              ? "Server Connected"
              : "Server Offline"}
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, padding: "40px 48px" }}>

        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: 900,
              color: "#0f172a",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Real-Time Posture Analysis
          </h1>
          <p style={{ color: "#64748b", marginTop: "8px", fontSize: "1rem" }}>
            Face your <strong>LEFT side</strong> toward the camera for accurate results.
          </p>
          <p style={{ color: "#64748b", marginTop: "6px", fontSize: "0.9rem" }}>
            Before starting, please{" "}
            <a
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#0ea5e9",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              fill in your details
            </a>
            {" "}to support the development of this system.
          </p>
        </div>

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: "28px",
            alignItems: "start",
          }}
        >
          {/* ── LEFT: Video Feed ── */}
          <div
            style={{
              background: "#0f172a",
              borderRadius: "24px",
              overflow: "hidden",
              aspectRatio: "16/9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >
            {analyzing ? (
              <img
                ref={imgRef}
                src={`${SERVER_URL}/video_feed`}
                alt="Live posture feed"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              /* Placeholder when not analyzing */
              <div style={{ textAlign: "center", color: "#475569" }}>
                <p style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>
                  {serverOnline
                    ? "Click Start to begin analysis"
                    : "Python server is not running"}
                </p>
                {!serverOnline && (
                  <p style={{ margin: "8px 0 0", fontSize: "0.82rem", color: "#64748b" }}>
                    Run: <code style={{ background: "#1e293b", padding: "2px 6px", borderRadius: "4px", color: "#94a3b8" }}>python server.py</code> in the Backend folder
                  </p>
                )}
              </div>
            )}

            {/* LIVE badge */}
            {analyzing && (
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  background: "rgba(239,68,68,0.9)",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: "99px",
                  letterSpacing: "0.1em",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#fff",
                    display: "inline-block",
                    animation: "pulse 1s infinite",
                  }}
                />
                LIVE
              </div>
            )}

            {/* No detection warning */}
            {analyzing && !data.detected && (
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(245,158,11,0.9)",
                  color: "#fff",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  padding: "8px 20px",
                  borderRadius: "99px",
                  whiteSpace: "nowrap",
                }}
              >
                ⚠ No pose detected — ensure your full side profile is visible
              </div>
            )}
          </div>

          {/* ── RIGHT: Data Panel ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Overall status */}
            <div
              style={{
                background: analyzing && data.detected
                  ? `linear-gradient(135deg, ${overallColor}18, ${overallColor}08)`
                  : "rgba(255,255,255,0.7)",
                border: `2px solid ${analyzing && data.detected ? overallColor : "#e2e8f0"}`,
                borderRadius: "20px",
                padding: "24px",
                textAlign: "center",
                transition: "all 0.4s ease",
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: analyzing && data.detected ? overallColor : "#94a3b8",
                }}
              >
                {!analyzing
                  ? "Ready to Analyze"
                  : !data.detected
                    ? "Detecting…"
                    : data.overall}
              </div>
            </div>

            {/* Angle badges */}
            <AngleBadge
              label="CA"
              angle={data.ca}
              status={data.ca_status}
              goodMin={75}
              description="Angle of Shoulder : Ear from horizontal. Large = upright head."
            />
            <AngleBadge
              label="SA"
              angle={data.sa}
              status={data.sa_status}
              goodMin={80}
              description="Angle of Hip : Shoulder from horizontal. Large = upright torso."
            />
            <AngleBadge
              label="KA"
              angle={data.ka}
              status={data.ka_status}
              goodMin={160}
              description={`Angle at Shoulder (Ear–Shoulder–Hip) ~180° = straight posture.`}
            />

            {/* Start / Stop button */}
            <button
              onClick={analyzing ? handleStop : handleStart}
              disabled={!serverOnline && !analyzing}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                border: "none",
                background: analyzing
                  ? "linear-gradient(135deg, #ef4444, #dc2626)"
                  : serverOnline
                    ? "linear-gradient(135deg, #0ea5e9, #0284c7)"
                    : "#94a3b8",
                color: "#fff",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: serverOnline || analyzing ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                boxShadow: analyzing || serverOnline
                  ? "0 4px 20px rgba(14,165,233,0.35)"
                  : "none",
                letterSpacing: "0.02em",
              }}
            >
              {analyzing ? "⏹ Stop Analysis" : "▶ Start Analysis"}
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
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(8px)",
        }}
      >
        <button onClick={() => navigate(-1)} style={navBtn()}>
          ← Back
        </button>
        <button onClick={() => navigate("/")} style={navBtn()}>
          Home
        </button>
      </div>

      {/* ── Google Form Modal ── */}
      {showFormModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "24px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "40px 36px 32px",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              animation: "modalIn 0.3s ease",
            }}
          >
            {/* Icon */}
            <div style={{ textAlign: "center", fontSize: "2.8rem", lineHeight: 1 }}></div>

            {/* Title */}
            <h2
              style={{
                margin: 0,
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "#0f172a",
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              Before performing the posture analysis,
              please enter your details to support the
              development of the system.
            </h2>

            {/* Divider */}
            <div style={{ height: "1px", background: "#e2e8f0" }} />

            {/* Google Form link */}
            <a
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                padding: "14px 24px",
                borderRadius: "12px",
                textDecoration: "none",
                transition: "opacity 0.2s ease",
                boxShadow: "0 4px 16px rgba(14,165,233,0.35)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Open Form
            </a>

            {/* Dismiss button */}
            <button
              onClick={dismissModal}
              style={{
                background: "transparent",
                border: "1.5px solid #e2e8f0",
                borderRadius: "10px",
                padding: "11px",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#64748b",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f1f5f9";
                e.currentTarget.style.color = "#0f172a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#64748b";
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ── CSS animations ── */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
      `}</style>
    </div>
  );
}

function navBtn(): React.CSSProperties {
  return {
    padding: "10px 24px",
    background: "white",
    color: "#0f172a",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem",
    transition: "all 0.2s ease",
  };
}