import cv2
# pyrefly: ignore [missing-import]
import mediapipe as mp
import numpy as np

# =============================================================================
# Referensi:
#   Vorapojpisut et al. (2025). Quantifying sitting posture: A pilot
#   feasibility study of computer vision and wearable sensors (Posture Lab)
#   using a manikin model. Wearable Technologies, 6, e27.
#   doi:10.1017/wtc.2025.10005
#
# Landmark posisi mengacu pada Figure 10 & Figure 13:
#   (1) Ear        → LEFT_EAR
#   (2) C7         → estimasi titik tengah EAR ↔ SHOULDER (MediaPipe tidak
#                    memiliki C7 eksplisit)
#   (3) Shoulder   → LEFT_SHOULDER
#   (4) T1–T2      → estimasi: shoulder + 25% jarak shoulder→hip ke bawah
#   (5) T12–L1     → estimasi: shoulder + 75% jarak shoulder→hip ke bawah
#
# Definisi sudut (Figure 13):
#   CA : sudut di C7 antara garis EAR→C7 dan garis HORIZONTAL
#   SA : sudut di SHOULDER antara garis C7→SHOULDER dan garis HORIZONTAL
#   KA : sudut di midpoint T1-T2/T12-L1 antara segmen T1T2→midspine
#        dan midspine→T12L1 (kemiringan thoracic)
# =============================================================================

# =========================
# Initialize MediaPipe Pose
# =========================
mp_pose = mp.solutions.pose
pose    = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=1,
    smooth_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5,
)
mp_draw = mp.solutions.drawing_utils

# =========================
# Index landmark wajah yang DISEMBUNYIKAN dari visualisasi
# (0=NOSE, 1-6=EYES, 7=LEFT_EAR, 8=RIGHT_EAR, 9-10=MOUTH)
# LEFT_EAR (7) TETAP DITAMPILKAN karena digunakan untuk CA.
# =========================
FACE_LANDMARKS_HIDE = {0, 1, 2, 3, 4, 5, 6, 8, 9, 10}

# Koneksi tubuh yang diizinkan (hapus koneksi yang melibatkan wajah)
BODY_CONNECTIONS = [
    (c[0], c[1]) for c in mp_pose.POSE_CONNECTIONS
    if c[0] not in FACE_LANDMARKS_HIDE and c[1] not in FACE_LANDMARKS_HIDE
]

# =========================
# Ideal Angle Thresholds
# (Sesuai materi IdealPostureAngel.tsx & paper Vorapojpisut 2025)
# =========================
# Craniovertebral Angle (CA) : Ideal >= 50°–55° | Poor < 48°
CA_IDEAL_MIN = 50
CA_POOR_MAX  = 48

# Shoulder Angle (SA)        : Ideal 50°–53°
SA_IDEAL_MIN = 50
SA_IDEAL_MAX = 53

# Kyphosis Angle (KA)        : Ideal ~20° | Poor > 40°
KA_IDEAL_TARGET = 20
KA_POOR_MIN     = 40


# =========================
# Helper: koordinat piksel
# =========================
def get_px(landmark, w, h):
    return (int(landmark.x * w), int(landmark.y * h))


# =========================
# Helper: estimasi C7
# C7 (lower neck) = titik antara EAR dan SHOULDER.
# Berdasarkan anatomi, C7 lebih dekat ke bahu (~70% dari ear ke shoulder).
# =========================
def estimate_c7(ear_px, shoulder_px, ratio=0.70):
    x = int(ear_px[0] + ratio * (shoulder_px[0] - ear_px[0]))
    y = int(ear_px[1] + ratio * (shoulder_px[1] - ear_px[1]))
    return (x, y)


# =========================
# Helper: estimasi T1-T2 dan T12-L1
# Menggunakan rasio jarak vertical shoulder→hip.
#   T1-T2  ≈ 25% dari shoulder ke hip (punggung atas)
#   T12-L1 ≈ 75% dari shoulder ke hip (punggung bawah)
# =========================
def estimate_thoracic(shoulder_px, hip_px):
    t1t2 = (
        int(shoulder_px[0] + 0.25 * (hip_px[0] - shoulder_px[0])),
        int(shoulder_px[1] + 0.25 * (hip_px[1] - shoulder_px[1])),
    )
    t12l1 = (
        int(shoulder_px[0] + 0.75 * (hip_px[0] - shoulder_px[0])),
        int(shoulder_px[1] + 0.75 * (hip_px[1] - shoulder_px[1])),
    )
    return t1t2, t12l1


# =========================
# Helper: hitung sudut antara vektor (b→a) dan (b→c) di vertex B
# =========================
def angle_at_vertex(a, b, c):
    a = np.array(a, dtype=float)
    b = np.array(b, dtype=float)
    c = np.array(c, dtype=float)
    ba = a - b
    bc = c - b
    n_ba, n_bc = np.linalg.norm(ba), np.linalg.norm(bc)
    if n_ba == 0 or n_bc == 0:
        return 0.0
    cos_val = np.clip(np.dot(ba, bc) / (n_ba * n_bc), -1.0, 1.0)
    return np.degrees(np.arccos(cos_val))


# =========================
# Helper: hitung sudut terhadap sumbu HORIZONTAL
# Menggunakan vektor dari vertex ke titik referensi,
# lalu ukur sudut dengan vektor horizontal (1, 0).
# =========================
def angle_to_horizontal(from_pt, to_pt):
    """Sudut antara vektor (from_pt → to_pt) dan sumbu horizontal."""
    vec  = np.array([to_pt[0] - from_pt[0], to_pt[1] - from_pt[1]], dtype=float)
    horiz = np.array([1.0, 0.0])
    norm_v = np.linalg.norm(vec)
    if norm_v == 0:
        return 0.0
    cos_val = np.clip(np.dot(vec, horiz) / norm_v, -1.0, 1.0)
    return np.degrees(np.arccos(cos_val))


# =========================
# Hitung CA (Craniovertebral Angle)
# Definisi paper: sudut di C7 antara garis EAR→C7 dan horizontal.
# =========================
def compute_ca(ear_px, c7_px):
    return angle_to_horizontal(c7_px, ear_px)


# =========================
# Hitung SA (Shoulder Angle)
# Definisi paper: sudut di SHOULDER antara garis C7→SHOULDER dan horizontal.
# =========================
def compute_sa(c7_px, shoulder_px):
    return angle_to_horizontal(shoulder_px, c7_px)


# =========================
# Hitung KA (Kyphosis Angle)
# Definisi paper: sudut antara segmen T1-T2→mid dan mid→T12-L1.
# mid = titik tengah T1T2 dan T12L1 (bisector).
# =========================
def compute_ka(t1t2_px, t12l1_px):
    mid = (
        (t1t2_px[0] + t12l1_px[0]) // 2,
        (t1t2_px[1] + t12l1_px[1]) // 2,
    )
    return angle_at_vertex(t1t2_px, mid, t12l1_px), mid


# =========================
# Klasifikasi tiap sudut → status + warna BGR
# =========================
def classify_ca(angle):
    if angle >= CA_IDEAL_MIN:
        return "Good", (50, 205, 50)
    elif angle < CA_POOR_MAX:
        return "Poor", (50,  80, 220)
    return "Fair", (30, 165, 245)

def classify_sa(angle):
    if SA_IDEAL_MIN <= angle <= SA_IDEAL_MAX:
        return "Good", (50, 205, 50)
    elif angle < SA_IDEAL_MIN - 5 or angle > SA_IDEAL_MAX + 10:
        return "Poor", (50,  80, 220)
    return "Fair", (30, 165, 245)

def classify_ka(angle):
    if abs(angle - KA_IDEAL_TARGET) <= 10:
        return "Good", (50, 205, 50)
    elif angle > KA_POOR_MIN:
        return "Poor", (50,  80, 220)
    return "Fair", (30, 165, 245)

def overall_status(statuses):
    if all(s == "Good" for s in statuses):
        return "Good Posture",  (50, 205, 50)
    elif any(s == "Poor" for s in statuses):
        return "Bad Posture",   (50,  80, 220)
    return "Fair Posture",  (30, 165, 245)


# =========================
# OPEN WEBCAM
# =========================
cap = cv2.VideoCapture(0)
print("isOpened:", cap.isOpened())
cap.set(cv2.CAP_PROP_FRAME_WIDTH,  1280)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

WINDOW = "Posture Lab — CA | SA | KA  [ESC to quit]"
cv2.namedWindow(WINDOW, cv2.WINDOW_NORMAL)
cv2.resizeWindow(WINDOW, 1280, 720)

# DrawingSpec untuk koneksi tubuh (tanpa wajah)
CONN_SPEC = mp_draw.DrawingSpec(color=(180, 180, 180), thickness=2, circle_radius=2)

# =========================
# MAIN LOOP
# =========================
while True:
    success, frame = cap.read()
    if not success:
        print("Failed to read webcam")
        break

    frame     = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results   = pose.process(rgb_frame)

    h, w, _ = frame.shape

    if results.pose_landmarks:
        lm = results.pose_landmarks.landmark

        # ── 1. Gambar koneksi tubuh (tanpa wajah) ────────────────────
        for conn in BODY_CONNECTIONS:
            pt_a = get_px(lm[conn[0]], w, h)
            pt_b = get_px(lm[conn[1]], w, h)
            cv2.line(frame, pt_a, pt_b, (170, 170, 170), 2)

        # Gambar landmark tubuh saja (tanpa wajah)
        for idx, landmark in enumerate(lm):
            if idx in FACE_LANDMARKS_HIDE:
                continue   # skip landmark wajah
            pt = get_px(landmark, w, h)
            cv2.circle(frame, pt, 4, (200, 200, 200), -1)

        # ── 2. Ambil landmark kunci ───────────────────────────────────
        # (1) Ear
        ear_px      = get_px(lm[mp_pose.PoseLandmark.LEFT_EAR.value],      w, h)
        # (3) Shoulder
        shoulder_px = get_px(lm[mp_pose.PoseLandmark.LEFT_SHOULDER.value], w, h)
        # (5) Hip (sebagai batas bawah torso untuk estimasi T12-L1)
        hip_px      = get_px(lm[mp_pose.PoseLandmark.LEFT_HIP.value],      w, h)

        # ── 3. Estimasi landmark yang tidak ada di MediaPipe ──────────
        # (2) C7 : lower neck
        c7_px        = estimate_c7(ear_px, shoulder_px, ratio=0.70)
        # (4) T1-T2 dan (5) T12-L1
        t1t2_px, t12l1_px = estimate_thoracic(shoulder_px, hip_px)

        # ── 4. Hitung sudut ───────────────────────────────────────────
        ca_angle            = compute_ca(ear_px, c7_px)
        sa_angle            = compute_sa(c7_px, shoulder_px)
        ka_angle, ka_mid_px = compute_ka(t1t2_px, t12l1_px)

        # ── 5. Klasifikasi ────────────────────────────────────────────
        ca_status, ca_color = classify_ca(ca_angle)
        sa_status, sa_color = classify_sa(sa_angle)
        ka_status, ka_color = classify_ka(ka_angle)
        overall, ov_color   = overall_status([ca_status, sa_status, ka_status])

        # ── 6. Visualisasi garis pengukuran ───────────────────────────

        # CA : garis EAR→C7 + garis horizontal dari C7
        h_ref_ca = (c7_px[0] + 80, c7_px[1])          # titik horizontal kanan C7
        cv2.line(frame, ear_px,    c7_px,    ca_color, 2)
        cv2.line(frame, c7_px,     h_ref_ca, ca_color, 1)

        # SA : garis C7→SHOULDER + garis horizontal dari SHOULDER
        h_ref_sa = (shoulder_px[0] + 80, shoulder_px[1])
        cv2.line(frame, c7_px,       shoulder_px, sa_color, 2)
        cv2.line(frame, shoulder_px, h_ref_sa,    sa_color, 1)

        # KA : garis T1T2→mid dan mid→T12L1
        cv2.line(frame, t1t2_px,  ka_mid_px, ka_color, 2)
        cv2.line(frame, ka_mid_px, t12l1_px, ka_color, 2)

        # ── 7. Gambar titik landmark kunci dengan warna & label ───────
        key_points = {
            "Ear":    (ear_px,      (255, 215,   0)),   # emas
            "C7":     (c7_px,       (0,   200, 200)),   # cyan
            "Shldr":  (shoulder_px, (255, 100, 100)),   # merah muda
            "T1-T2":  (t1t2_px,     (200, 100, 255)),   # ungu
            "T12-L1": (t12l1_px,    (100, 255, 180)),   # hijau mint
        }
        for label, (pt, col) in key_points.items():
            cv2.circle(frame, pt, 8, col, -1)
            cv2.circle(frame, pt, 8, (255, 255, 255), 1)   # border putih
            cv2.putText(frame, label, (pt[0] + 10, pt[1] - 6),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.48, col, 1)

        # Label sudut di dekat vertex masing-masing
        cv2.putText(frame, f"CA={int(ca_angle)}", (c7_px[0] - 60, c7_px[1] - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, ca_color, 2)
        cv2.putText(frame, f"SA={int(sa_angle)}",
                    (shoulder_px[0] - 60, shoulder_px[1] + 20),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, sa_color, 2)
        cv2.putText(frame, f"KA={int(ka_angle)}",
                    (ka_mid_px[0] + 10, ka_mid_px[1]),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, ka_color, 2)

        # ── 8. HUD Panel ─────────────────────────────────────────────
        overlay = frame.copy()
        cv2.rectangle(overlay, (8, 8), (440, 190), (15, 15, 15), -1)
        cv2.addWeighted(overlay, 0.60, frame, 0.40, 0, frame)

        font_h = cv2.FONT_HERSHEY_DUPLEX
        font_n = cv2.FONT_HERSHEY_SIMPLEX

        cv2.putText(frame, overall, (18, 46), font_h, 1.1, ov_color, 2)

        cv2.putText(frame,
            f"CA : {int(ca_angle):>3} deg  [{ca_status}]  Ideal >= 50",
            (18,  88), font_n, 0.60, ca_color, 1)
        cv2.putText(frame,
            f"SA : {int(sa_angle):>3} deg  [{sa_status}]  Ideal 50-53",
            (18, 118), font_n, 0.60, sa_color, 1)
        cv2.putText(frame,
            f"KA : {int(ka_angle):>3} deg  [{ka_status}]  Ideal ~20",
            (18, 148), font_n, 0.60, ka_color, 1)

        cv2.putText(frame, "Ref: Vorapojpisut et al. 2025 (doi:10.1017/wtc.2025.10005)",
            (18, 178), font_n, 0.38, (130, 130, 130), 1)

    # ── Resize ke window ─────────────────────────────────────────────
    try:
        _, _, win_w, win_h = cv2.getWindowImageRect(WINDOW)
        if win_w > 0 and win_h > 0:
            display_frame = cv2.resize(frame, (win_w, win_h))
        else:
            display_frame = frame
    except Exception:
        display_frame = frame

    cv2.imshow(WINDOW, display_frame)

    if cv2.waitKey(1) & 0xFF == 27:   # ESC
        break

# =========================
# CLEANUP
# =========================
cap.release()
cv2.destroyAllWindows()