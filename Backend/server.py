"""
server.py — FastAPI Backend for Posture Detection System

Provides two endpoints consumed by the React website:
  GET  /video_feed   → MJPEG stream (live annotated webcam feed)
  WS   /ws           → WebSocket streaming JSON angle data per frame

Usage:
  cd Backend
  venv\\Scripts\\python server.py

The React frontend connects to http://localhost:8000
"""

from __future__ import annotations

import asyncio
import json
import threading
import time

import cv2  # pyrefly: ignore[missing-import]
import numpy as np  # pyrefly: ignore[missing-import]
import mediapipe as mp  # pyrefly: ignore[missing-import]
import uvicorn  # pyrefly: ignore[missing-import]

from fastapi import FastAPI, WebSocket, WebSocketDisconnect  # pyrefly: ignore[missing-import]
from fastapi.middleware.cors import CORSMiddleware  # pyrefly: ignore[missing-import]
from fastapi.responses import StreamingResponse  # pyrefly: ignore[missing-import]

# ============================================================
# FastAPI app + CORS (allow React dev server on port 5173)
# ============================================================
app = FastAPI(title="Posture Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# MediaPipe setup (reuse logic from post_test.py)
# ============================================================
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=1,
    smooth_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5,
)

# ============================================================
# Angle thresholds (same as post_test.py)
# ============================================================
CA_IDEAL_MIN = 65
CA_FAIR_MIN  = 49
SA_IDEAL_MIN = 93
SA_FAIR_MIN  = 85
KA_IDEAL_MIN = 147
KA_FAIR_MIN  = 143

# ============================================================
# Angle math helpers
# ============================================================
def get_px(landmark, w, h):
    return (int(landmark.x * w), int(landmark.y * h))

def angle_at_vertex(a, b, c):
    a, b, c = np.array(a, float), np.array(b, float), np.array(c, float)
    ba, bc = a - b, c - b
    n_ba, n_bc = np.linalg.norm(ba), np.linalg.norm(bc)
    if n_ba == 0 or n_bc == 0:
        return 0.0
    cos_val = np.clip(np.dot(ba, bc) / (n_ba * n_bc), -1.0, 1.0)
    return float(np.degrees(np.arccos(cos_val)))

def angle_to_horizontal(from_pt, to_pt):
    vec = np.array([to_pt[0] - from_pt[0], to_pt[1] - from_pt[1]], float)
    horiz = np.array([1.0, 0.0])
    norm_v = np.linalg.norm(vec)
    if norm_v == 0:
        return 0.0
    cos_val = np.clip(np.dot(vec, horiz) / norm_v, -1.0, 1.0)
    return float(np.degrees(np.arccos(cos_val)))

def compute_ca(ear_px, shoulder_px):
    return angle_to_horizontal(shoulder_px, ear_px)

def compute_sa(shoulder_px, hip_px):
    return angle_to_horizontal(hip_px, shoulder_px)

def compute_ka(ear_px, shoulder_px, hip_px):
    return angle_at_vertex(ear_px, shoulder_px, hip_px)

def classify(angle, ideal_min, fair_min):
    if angle >= ideal_min:
        return "Good"
    elif angle >= fair_min:
        return "Fair"
    return "Poor"

# ============================================================
# Global state — shared between generator and WebSocket
# ============================================================
class PostureState:
    def __init__(self):
        self.lock = threading.Lock()
        self.latest_frame: bytes | None = None   # JPEG bytes
        self.latest_data: dict = {}
        self.running = False
        self.cap: cv2.VideoCapture | None = None
        self.thread: threading.Thread | None = None

state = PostureState()

# ============================================================
# Background capture thread
# ============================================================
def capture_loop():
    state.cap = cv2.VideoCapture(0)
    state.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    state.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    while state.running:
        ok, frame = state.cap.read()
        if not ok:
            time.sleep(0.01)
            continue

        frame = cv2.flip(frame, 1)
        rgb   = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        h, w  = frame.shape[:2]
        results = pose.process(rgb)

        data: dict = {"detected": False}

        if results.pose_landmarks:
            lm = results.pose_landmarks.landmark
            ear_px      = get_px(lm[mp_pose.PoseLandmark.LEFT_EAR.value],      w, h)
            shoulder_px = get_px(lm[mp_pose.PoseLandmark.LEFT_SHOULDER.value], w, h)
            hip_px      = get_px(lm[mp_pose.PoseLandmark.LEFT_HIP.value],      w, h)

            ca = compute_ca(ear_px, shoulder_px)
            sa = compute_sa(shoulder_px, hip_px)
            ka = compute_ka(ear_px, shoulder_px, hip_px)

            ca_status = classify(ca, CA_IDEAL_MIN, CA_FAIR_MIN)
            sa_status = classify(sa, SA_IDEAL_MIN, SA_FAIR_MIN)
            ka_status = classify(ka, KA_IDEAL_MIN, KA_FAIR_MIN)

            statuses   = [ca_status, sa_status, ka_status]
            overall    = "Good Posture" if all(s == "Good" for s in statuses) else "Needs Improvement"

            data = {
                "detected": True,
                "ca": round(ca, 1),
                "sa": round(sa, 1),
                "ka": round(ka, 1),
                "ca_status": ca_status,
                "sa_status": sa_status,
                "ka_status": ka_status,
                "overall": overall,
            }

            # ── Draw landmarks & lines on frame ──────────────────────────
            ca_color = (50, 205, 50) if ca_status == "Good" else (30, 165, 245) if ca_status == "Fair" else (50, 80, 220)
            sa_color = (50, 205, 50) if sa_status == "Good" else (30, 165, 245) if sa_status == "Fair" else (50, 80, 220)
            ka_color = (50, 205, 50) if ka_status == "Good" else (30, 165, 245) if ka_status == "Fair" else (50, 80, 220)

            # Lines
            cv2.line(frame, ear_px, shoulder_px, ca_color, 2)
            cv2.line(frame, shoulder_px, hip_px, sa_color, 2)

            # Key point circles
            for pt, col, label in [
                (ear_px,      (0,  215, 255), "Ear"),
                (shoulder_px, (80, 100, 255), "Shldr"),
                (hip_px,      (0,  200, 100), "Hip"),
            ]:
                cv2.circle(frame, pt, 8, col, -1)
                cv2.circle(frame, pt, 8, (255, 255, 255), 1)
                cv2.putText(frame, label, (pt[0]+10, pt[1]-6),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.48, col, 1)

            # Angle labels
            ca_mid = ((ear_px[0]+shoulder_px[0])//2 - 80, (ear_px[1]+shoulder_px[1])//2)
            cv2.putText(frame, f"CA={int(ca)}", ca_mid, cv2.FONT_HERSHEY_SIMPLEX, 0.55, ca_color, 2)

            cv2.putText(frame, f"SA={int(sa)}", (shoulder_px[0]-80, shoulder_px[1]+22),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.55, sa_color, 2)

            ka_mid = ((shoulder_px[0]+hip_px[0])//2+12, (shoulder_px[1]+hip_px[1])//2)
            cv2.putText(frame, f"KA={int(ka)}", ka_mid, cv2.FONT_HERSHEY_SIMPLEX, 0.55, ka_color, 2)

        # Encode to JPEG
        _, jpeg = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 80])

        with state.lock:
            state.latest_frame = jpeg.tobytes()
            state.latest_data  = data

    # Cleanup
    if state.cap:
        state.cap.release()
    state.cap = None

# ============================================================
# Start / Stop helpers
# ============================================================
def start_capture():
    if state.running:
        return
    state.running = True
    state.thread  = threading.Thread(target=capture_loop, daemon=True)
    state.thread.start()

def stop_capture():
    state.running = False
    if state.thread:
        state.thread.join(timeout=3)
    state.thread       = None
    state.latest_frame = None
    state.latest_data  = {}

# Auto-start when server boots
start_capture()

# ============================================================
# Routes
# ============================================================

@app.get("/health")
def health():
    return {"status": "ok", "running": state.running}


def mjpeg_generator():
    """Yields MJPEG frames for the video_feed endpoint."""
    while True:
        with state.lock:
            frame = state.latest_frame

        if frame is None:
            time.sleep(0.03)
            continue

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + frame
            + b"\r\n"
        )
        time.sleep(0.033)   # ~30 fps cap


@app.get("/video_feed")
def video_feed():
    """MJPEG stream endpoint — embed as <img src='...'> in the browser."""
    return StreamingResponse(
        mjpeg_generator(),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint — streams JSON angle data at ~10 fps."""
    await websocket.accept()
    try:
        while True:
            with state.lock:
                data = dict(state.latest_data)

            await websocket.send_text(json.dumps(data))
            await asyncio.sleep(0.1)   # 10 fps data update
    except WebSocketDisconnect:
        pass


# ============================================================
# Entry point
# ============================================================
if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=False)
