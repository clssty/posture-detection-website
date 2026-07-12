"""
mediapipe_utils.py

MediaPipe Pose initialization and landmark extraction utilities
for the Posture Detection System.

Provides a reusable wrapper so both post_test.py and extract_dataset.py
can share the same MediaPipe setup and landmark extraction logic.
"""

# pyrefly: ignore [missing-import]
import mediapipe as mp
from utils.angle_calculator import get_px


# =========================
# MediaPipe Pose Landmark Indices
# =========================
mp_pose = mp.solutions.pose

LEFT_EAR      = mp_pose.PoseLandmark.LEFT_EAR.value
LEFT_SHOULDER = mp_pose.PoseLandmark.LEFT_SHOULDER.value
LEFT_HIP      = mp_pose.PoseLandmark.LEFT_HIP.value


# =========================
# Create MediaPipe Pose instance
# =========================
def create_pose(static_image_mode=False, model_complexity=2):
    """Create and return a MediaPipe Pose instance.

    Args:
        static_image_mode: True for unrelated images, False for video stream.
        model_complexity: 0 (lite), 1 (full), or 2 (heavy).

    Returns:
        mp.solutions.pose.Pose instance.
    """
    return mp_pose.Pose(
        static_image_mode=static_image_mode,
        model_complexity=model_complexity,
        smooth_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    )


# =========================
# Extract 3 key landmarks (EAR, SHOULDER, HIP)
# =========================
def extract_key_landmarks(results, w, h):
    """Extract LEFT_EAR, LEFT_SHOULDER, LEFT_HIP pixel coordinates.

    Args:
        results: MediaPipe Pose process() output.
        w: Frame width in pixels.
        h: Frame height in pixels.

    Returns:
        Tuple (ear_px, shoulder_px, hip_px) if landmarks detected,
        None otherwise.
    """
    if not results.pose_landmarks:
        return None

    lm = results.pose_landmarks.landmark

    ear_px      = get_px(lm[LEFT_EAR],      w, h)
    shoulder_px = get_px(lm[LEFT_SHOULDER], w, h)
    hip_px      = get_px(lm[LEFT_HIP],      w, h)

    return ear_px, shoulder_px, hip_px
