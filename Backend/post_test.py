import cv2
# pyrefly: ignore [missing-import]
import mediapipe as mp
import numpy as np

# =============================================================================
# Reference:
#   Vorapojpisut et al. (2025). Quantifying sitting posture: A pilot
#   feasibility study of computer vision and wearable sensors (Posture Lab)
#   using a manikin model. Wearable Technologies, 6, e27.
#   doi:10.1017/wtc.2025.10005
#
# CATATAN IMPLEMENTASI (tanpa physical markers):
#   The original paper uses physical ArUco markers at C7 (spinous process),
#   and accelerometers at T1–T2 and T12–L1—landmarks that do NOT exist in MediaPipe.
#   Solution: A direct Ear-Shoulder-Hip approach using 3 accurate
#   MediaPipe landmarks, with a valid angle redefinition:
#
#   CA : angle of the SHOULDER→EAR line relative to the HORIZONTAL
#        (large = upright head; small = forward head posture)
#   SA : angle of the HIP→SHOULDER line relative to the HORIZONTAL
#        (large = upright torso; small = leaning forward)
#   KA : angle at the SHOULDER between the SHOULDER→EAR and SHOULDER→HIP vectors
#        (approaching 180° = straight posture; < 160° = bend at the shoulder)
#
# CAMERA POSITION: The LEFT side of the body must face the camera.
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
# Angle Thresholds (simplified — no physical markers)
# Disesuaikan untuk pendekatan EAR-SHOULDER-HIP langsung.
# =========================
# CA : angle of SHOULDER→EAR from horizontal
#   Good : >= 75°  (kepala tegak di atas bahu)
#   Fair : 60°–74°
#   Poor : < 60°   (forward head posture signifikan)
CA_IDEAL_MIN = 75
CA_FAIR_MIN  = 60

# SA : angle of HIP→SHOULDER from horizontal
#   Good : >= 80°  (badan tegak)
#   Fair : 65°–79°
#   Poor : < 65°   (badan condong ke depan)
SA_IDEAL_MIN = 80
SA_FAIR_MIN  = 65

# KA : angle at SHOULDER between EAR and HIP vectors
#   Good : >= 160° (postur hampir lurus)
#   Fair : 140°–159°
#   Poor : < 140°  (tekukan signifikan di bahu)
KA_IDEAL_MIN = 160
KA_FAIR_MIN  = 140


# =========================
# Helper: koordinat piksel
# =========================
def get_px(landmark, w, h):
    return (int(landmark.x * w), int(landmark.y * h))


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
# Hitung CA — Neck Inclination
# Sudut garis SHOULDER→EAR terhadap horizontal.
# Besar = kepala tegak (baik). Kecil = forward head posture (buruk).
# =========================
def compute_ca(ear_px, shoulder_px):
    return angle_to_horizontal(shoulder_px, ear_px)


# =========================
# Hitung SA — Trunk Inclination
# Sudut garis HIP→SHOULDER terhadap horizontal.
# Besar = badan tegak (baik). Kecil = badan condong ke depan (buruk).
# =========================
def compute_sa(shoulder_px, hip_px):
    return angle_to_horizontal(hip_px, shoulder_px)


# =========================
# Hitung KA — Posture Alignment Angle
# Sudut di SHOULDER antara vektor SHOULDER→EAR dan SHOULDER→HIP.
# ~180° = lurus (baik). < 140° = tekukan signifikan di bahu (buruk).
# Bug lama: collinear points selalu menghasilkan 180°.
# Fix: gunakan landmark berbeda (EAR, SHOULDER, HIP) sebagai vertex.
# =========================
def compute_ka(ear_px, shoulder_px, hip_px):
    ka_label_px = (shoulder_px[0] + 10, shoulder_px[1] - 30)
    return angle_at_vertex(ear_px, shoulder_px, hip_px), ka_label_px


# =========================
# Klasifikasi tiap sudut → status + warna BGR
# =========================
def classify_ca(angle):
    """CA: Good >= 75° | Fair 60°-74° | Poor < 60°"""
    if angle >= CA_IDEAL_MIN:
        return "Good", (50, 205, 50)
    elif angle >= CA_FAIR_MIN:
        return "Fair", (30, 165, 245)
    return "Poor", (50, 80, 220)

def classify_sa(angle):
    """SA: Good >= 80° | Fair 65°-79° | Poor < 65°"""
    if angle >= SA_IDEAL_MIN:
        return "Good", (50, 205, 50)
    elif angle >= SA_FAIR_MIN:
        return "Fair", (30, 165, 245)
    return "Poor", (50, 80, 220)

def classify_ka(angle):
    """KA: Good >= 160° | Fair 140°-159° | Poor < 140°"""
    if angle >= KA_IDEAL_MIN:
        return "Good", (50, 205, 50)
    elif angle >= KA_FAIR_MIN:
        return "Fair", (30, 165, 245)
    return "Poor", (50, 80, 220)

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

# Optional: set webcam resolution
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
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

        # ── 1. Tidak ada skeleton ─────────────────────────────────────
        # Hanya 3 landmark kunci (Ear, Shoulder, Hip) yang ditampilkan.

        # ── 2. Ambil 3 landmark kunci ─────────────────────────────────
        ear_px      = get_px(lm[mp_pose.PoseLandmark.LEFT_EAR.value],      w, h)
        shoulder_px = get_px(lm[mp_pose.PoseLandmark.LEFT_SHOULDER.value], w, h)
        hip_px      = get_px(lm[mp_pose.PoseLandmark.LEFT_HIP.value],      w, h)

        # ── 3. Hitung sudut (EAR-SHOULDER-HIP approach) ───────────────
        # CA: inclination of SHOULDER→EAR from horizontal (neck tilt)
        # SA: inclination of HIP→SHOULDER from horizontal (trunk tilt)
        # KA: angle at SHOULDER vertex in EAR-SHOULDER-HIP (alignment)
        ca_angle                = compute_ca(ear_px, shoulder_px)
        sa_angle                = compute_sa(shoulder_px, hip_px)
        ka_angle, ka_label_px   = compute_ka(ear_px, shoulder_px, hip_px)

        # ── 4. Klasifikasi ────────────────────────────────────────────
        ca_status, ca_color = classify_ca(ca_angle)
        sa_status, sa_color = classify_sa(sa_angle)
        ka_status, ka_color = classify_ka(ka_angle)
        overall, ov_color   = overall_status([ca_status, sa_status, ka_status])

        # ── 5. Visualisasi garis pengukuran ───────────────────────────

        # CA: segmen EAR→SHOULDER (area leher), referensi
        # horizontal di SHOULDER
        # Warna CA menandai garis leher dari telinga ke bahu.
        h_ref_ca = (shoulder_px[0] + 70, shoulder_px[1])
        cv2.line(frame, ear_px,      shoulder_px, ca_color, 2)
        cv2.line(frame, shoulder_px, h_ref_ca,    ca_color, 1)

        # SA: segmen SHOULDER→HIP (area trunk), referensi horizontal di SHOULDER
        #     SA diukur sebagai inklinasi HIP→SHOULDER dari horizontal — vertex SHOULDER.
        h_ref_sa = (shoulder_px[0] + 70, shoulder_px[1])
        cv2.line(frame, shoulder_px, hip_px,   sa_color, 2)
        cv2.line(frame, shoulder_px, h_ref_sa, sa_color, 1)

        # ── 6. Gambar 3 titik landmark kunci ─────────────────────────
        key_points = {
            "Ear":   (ear_px,      (0,  215, 255)),   # gold (BGR)
            "Shldr": (shoulder_px, (80, 100, 255)),   # orange-red (BGR)
            "Hip":   (hip_px,      (0,  200, 100)),   # green (BGR)
        }
        for label, (pt, col) in key_points.items():
            cv2.circle(frame, pt, 8, col, -1)
            cv2.circle(frame, pt, 8, (255, 255, 255), 1)   # border putih
            cv2.putText(frame, label, (pt[0] + 10, pt[1] - 6),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.48, col, 1)

        # ── Label sudut di posisi anatomis yang benar ─────────────────
        # CA : di tengah EAR-SHOULDER → area LEHER (neck)
        ca_label_x = (ear_px[0] + shoulder_px[0]) // 2 - 80
        ca_label_y = (ear_px[1] + shoulder_px[1]) // 2
        cv2.putText(frame, f"CA={int(ca_angle)}",
                    (ca_label_x, ca_label_y),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, ca_color, 2)

        # SA : tepat di SHOULDER → area BAHU (sesuai nama "Shoulder Angle")
        cv2.putText(frame, f"SA={int(sa_angle)}",
                    (shoulder_px[0] - 80, shoulder_px[1] + 22),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, sa_color, 2)

        # KA : di tengah SHOULDER-HIP → area TRUNK / punggung
        ka_trunk_x = (shoulder_px[0] + hip_px[0]) // 2 + 12
        ka_trunk_y = (shoulder_px[1] + hip_px[1]) // 2
        cv2.putText(frame, f"KA={int(ka_angle)}",
                    (ka_trunk_x, ka_trunk_y),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, ka_color, 2)

        # ── 7. HUD Panel ─────────────────────────────────────────────
        overlay = frame.copy()
        cv2.rectangle(overlay, (8, 8), (470, 210), (15, 15, 15), -1)
        cv2.addWeighted(overlay, 0.60, frame, 0.40, 0, frame)

        font_h = cv2.FONT_HERSHEY_DUPLEX
        font_n = cv2.FONT_HERSHEY_SIMPLEX

        cv2.putText(frame, overall, (18, 46), font_h, 1.1, ov_color, 2)

        cv2.putText(frame,
            f"CA : {int(ca_angle):>3} deg  [{ca_status}]  Good >= 75",
            (18,  82), font_n, 0.58, ca_color, 1)
        cv2.putText(frame,
            f"SA : {int(sa_angle):>3} deg  [{sa_status}]  Good >= 80",
            (18, 110), font_n, 0.58, sa_color, 1)
        cv2.putText(frame,
            f"KA : {int(ka_angle):>3} deg  [{ka_status}]  Good >= 160",
            (18, 138), font_n, 0.58, ka_color, 1)

        # ── Catatan orientasi kamera ──────────────────────────────────
        cv2.putText(frame,
            "[!] Face your LEFT side toward the camera",
            (18, 168), font_n, 0.48, (0, 200, 255), 1)

        cv2.putText(frame, "Ref: Vorapojpisut et al. 2025 (doi:10.1017/wtc.2025.10005)",
            (18, 194), font_n, 0.36, (110, 110, 110), 1)

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