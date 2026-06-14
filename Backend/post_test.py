import cv2
import mediapipe as mp
import numpy as np

print(mp)

# =========================
# Initialize MediaPipe Pose
# =========================
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

# Drawing utility
mp_draw = mp.solutions.drawing_utils

# =========================
# Calculate angle inisialisation
# =========================

def calculate_angle(a, b, c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)

    ba = a - b
    bc = c - b

    cosine_angle = np.dot(ba, bc) / (
        np.linalg.norm(ba) * np.linalg.norm(bc)
    )

    angle = np.arccos(cosine_angle)

    return np.degrees(angle)

# =========================
# OPEN WEBCAM
# =========================
cap = cv2.VideoCapture(0)

print("isOpened:", cap.isOpened())

# Optional: set webcam resolution
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

# =========================
# CREATE RESIZABLE WINDOW
# =========================
window_name = "MediaPipe Pose Detection"

cv2.namedWindow(
    window_name,
    cv2.WINDOW_NORMAL
)

# Optional: start with larger window
cv2.resizeWindow(
    window_name,
    1280,
    720
)

# =========================
# MAIN LOOP
# =========================
while True:
    success, frame = cap.read()

    if not success:
        print("Failed to read webcam")
        break

    # Flip horizontally
    frame = cv2.flip(frame, 1)

    # Convert BGR -> RGB
    rgb_frame = cv2.cvtColor(
        frame,
        cv2.COLOR_BGR2RGB
    )

    # Pose Detection
    results = pose.process(rgb_frame)

    # =========================
    # LANDMARKS
    # =========================
    
    if results.pose_landmarks:

        landmarks = results.pose_landmarks.landmark

        h, w, _ = frame.shape

        nose = landmarks[ #change HEADC -> CVA
            mp_pose.PoseLandmark.NOSE.value
        ]

        shoulder = landmarks[ #SHOULDER -> SA
            mp_pose.PoseLandmark.LEFT_SHOULDER.value
        ]

        hip = landmarks[ #change TORSO -> Torso Angle
            mp_pose.PoseLandmark.LEFT_HIP.value
        ]

        nose_point = (
            int(nose.x * w),
            int(nose.y * h)
        )

        shoulder_point = (
            int(shoulder.x * w),
            int(shoulder.y * h)
        )

        hip_point = (
            int(hip.x * w),
            int(hip.y * h)
        )

        angle = calculate_angle(
            nose_point,
            shoulder_point,
            hip_point
        )

        if angle < 150:
            status = "Bad Posture"
            color = (0, 0, 255)
        else:
            status = "Good Posture"
            color = (0, 255, 0)

        # Draw pose skeleton
        mp_draw.draw_landmarks(
            frame,
            results.pose_landmarks,
            mp_pose.POSE_CONNECTIONS
        )

        # Draw posture lines
        cv2.line(
            frame,
            nose_point,
            shoulder_point,
            (255,255,255),
            2
        )

        cv2.line(
            frame,
            shoulder_point,
            hip_point,
            (255,255,255),
            2
        )

        # Draw posture points
        cv2.circle(
            frame,
            nose_point,
            6,
            (255,255,255),
            -1
        )

        cv2.circle(
            frame,
            shoulder_point,
            6,
            (255,255,255),
            -1
        )

        cv2.circle(
            frame,
            hip_point,
            6,
            (255,255,255),
            -1
        )

        # Angle text
        cv2.putText(
            frame,
            f"Angle: {int(angle)} deg",
            (50, 50),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            color,
            2
        )

        # Status text
        cv2.putText(
            frame,
            status,
            (50, 100),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            color,
            2
        )

    # =========================
    # GET CURRENT WINDOW SIZE
    # =========================
    try:
        _, _, win_width, win_height = cv2.getWindowImageRect(
            window_name
        )

        if win_width > 0 and win_height > 0:
            display_frame = cv2.resize(
                frame,
                (win_width, win_height)
            )
        else:
            display_frame = frame

    except:
        display_frame = frame

    # Show frame
    cv2.imshow(
        window_name,
        display_frame
    )

    # ESC to quit
    if cv2.waitKey(1) & 0xFF == 27:
        break

# =========================
# CLEANUP
# =========================
cap.release()
cv2.destroyAllWindows()