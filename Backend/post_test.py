import cv2
import mediapipe as mp

print(mp)

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

# Drawing utility
mp_draw = mp.solutions.drawing_utils

# =========================
# OPEN EXTERNAL WEBCAM
# =========================
cap = cv2.VideoCapture(0)

print("isOpned: ", cap.isOpened())

# Optional: set resolution
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

while True:
    success, frame = cap.read()

    if not success:
        print("Failed to read webcam")
        break

    # Flip camera horizontally (optional)
    frame = cv2.flip(frame, 1)

    # Convert BGR to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Process pose detection
    results = pose.process(rgb_frame)

    # Draw skeleton landmarks
    if results.pose_landmarks:
        mp_draw.draw_landmarks(
            frame,
            results.pose_landmarks,
            mp_pose.POSE_CONNECTIONS
        )

    # Show webcam window
    cv2.imshow("MediaPipe Pose Detection", frame)

    # Press Q to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()