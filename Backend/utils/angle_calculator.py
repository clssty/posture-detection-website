"""
angle_calculator.py

Shared angle calculation utilities for the Posture Detection System.

Functions extracted from post_test.py — identical math, no changes.

Reference:
  Vorapojpisut et al. (2025). Quantifying sitting posture: A pilot
  feasibility study of computer vision and wearable sensors (Posture Lab)
  using a manikin model. Wearable Technologies, 6, e27.
  doi:10.1017/wtc.2025.10005

Angle definitions (EAR-SHOULDER-HIP approach, no physical markers):
  CA : angle of SHOULDER→EAR from HORIZONTAL
       (large = upright head; small = forward head posture)
  SA : angle of HIP→SHOULDER from HORIZONTAL
       (large = upright torso; small = leaning forward)
  KA : angle at SHOULDER between SHOULDER→EAR and SHOULDER→HIP vectors
       (~180° = straight posture; < 140° = significant bend)
"""

import numpy as np


# =========================
# Helper: koordinat piksel
# =========================
def get_px(landmark, w, h):
    """Convert a MediaPipe landmark to pixel coordinates (x, y)."""
    return (int(landmark.x * w), int(landmark.y * h))


# =========================
# Helper: sudut antara vektor (b→a) dan (b→c) di vertex B
# =========================
def angle_at_vertex(a, b, c):
    """Angle at vertex B between vectors BA and BC, in degrees."""
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
# Helper: sudut terhadap sumbu HORIZONTAL
# =========================
def angle_to_horizontal(from_pt, to_pt):
    """Angle between vector (from_pt → to_pt) and horizontal axis, in degrees."""
    vec = np.array([to_pt[0] - from_pt[0], to_pt[1] - from_pt[1]], dtype=float)
    horiz = np.array([1.0, 0.0])
    norm_v = np.linalg.norm(vec)
    if norm_v == 0:
        return 0.0
    cos_val = np.clip(np.dot(vec, horiz) / norm_v, -1.0, 1.0)
    return np.degrees(np.arccos(cos_val))


# =========================
# CA — Cervical Angle (Neck Inclination)
# =========================
def compute_ca(ear_px, shoulder_px):
    """Angle of SHOULDER→EAR line relative to horizontal.
    Large = upright head (good). Small = forward head posture (poor).
    """
    return angle_to_horizontal(shoulder_px, ear_px)


# =========================
# SA — Shoulder Angle (Trunk Inclination)
# =========================
def compute_sa(shoulder_px, hip_px):
    """Angle of HIP→SHOULDER line relative to horizontal.
    Large = upright torso (good). Small = leaning forward (poor).
    """
    return angle_to_horizontal(hip_px, shoulder_px)


# =========================
# KA — Kyphosis Angle (Posture Alignment)
# =========================
def compute_ka(ear_px, shoulder_px, hip_px):
    """Angle at SHOULDER between SHOULDER→EAR and SHOULDER→HIP vectors.
    ~180° = straight (good). < 140° = significant bend (poor).
    """
    return angle_at_vertex(ear_px, shoulder_px, hip_px)
