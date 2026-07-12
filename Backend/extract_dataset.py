"""
extract_dataset.py

Posture Detection System

Extract Craniovertebral Angle (CA),
Shoulder Angle (SA),
Kyphosis Angle (KA)
from posture videos into CSV dataset.

Uses the SAME MediaPipe + angle logic as post_test.py
via shared utilities in utils/.
"""

import os
import cv2
import pandas as pd
from tqdm import tqdm

from utils.angle_calculator import compute_ca, compute_sa, compute_ka
from utils.mediapipe_utils import create_pose, extract_key_landmarks

# ==================
# Dataset Directory
# ==================

DATASET_DIR = "dataset"

OUTPUT_DIR = "output"

OUTPUT_FILE = os.path.join(
    OUTPUT_DIR,
    "posture_dataset.csv"
)

os.makedirs(OUTPUT_DIR, exist_ok=True)

# ==================
# Dataset Container
# ==================

dataset = []

# ================---------------------------------
# Get All Videos : to labeling, vid name, vid path
# ================---------------------------------

def get_video_list():

    video_list = []

    # Nama folder = label
    labels = ["ERGONOMIC", "SLIGHTLY", "SLOUNCHED"]

    # Format video yang didukung
    supported_extensions = (
        ".mp4",
        ".avi",
        ".mov",
        ".mkv"
    )

    for label in labels:

        folder_path = os.path.join(DATASET_DIR, label)

        # Lewati jika folder tidak ada
        if not os.path.exists(folder_path):
            print(f"[WARNING] Folder not found : {folder_path}")
            continue

        for filename in sorted(os.listdir(folder_path)):

            if filename.lower().endswith(supported_extensions):

                video_path = os.path.join(folder_path, filename)

                video_list.append({

                    "label": label,

                    "video_name": filename,

                    "video_path": video_path

                })

    return video_list

# ==================
# Process One Video
# ==================

def process_video(video_info, pose):
    """Process a single video: extract CA, SA, KA per frame.

    Args:
        video_info: Dict with 'label', 'video_name', 'video_path'.
        pose: MediaPipe Pose instance.

    Returns:
        List of dicts, each containing one frame's data.
    """

    video_path = video_info["video_path"]
    video_name = video_info["video_name"]
    label      = video_info["label"]

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        print(f"  [ERROR] Cannot open {video_name}")
        return []

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    duration = total_frames / fps if fps > 0 else 0

    print(f"\n  Processing : {video_name}")
    print(f"  FPS        : {fps:.2f}")
    print(f"  Frames     : {total_frames}")
    print(f"  Duration   : {duration:.2f} sec")

    video_data = []
    detected = 0
    skipped  = 0

    for frame_idx in tqdm(range(total_frames), desc=f"  {video_name}", leave=False):

        success, frame = cap.read()
        if not success:
            break

        h, w, _ = frame.shape

        # Convert BGR → RGB for MediaPipe
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb_frame)

        # Extract landmarks
        landmarks = extract_key_landmarks(results, w, h)

        if landmarks is None:
            skipped += 1
            continue

        ear_px, shoulder_px, hip_px = landmarks

        # Compute angles — SAME formulas as post_test.py
        ca_angle = compute_ca(ear_px, shoulder_px)
        sa_angle = compute_sa(shoulder_px, hip_px)
        ka_angle = compute_ka(ear_px, shoulder_px, hip_px)

        video_data.append({
            "label":      label,
            "video_name": video_name,
            "frame":      frame_idx,
            "CA":         round(ca_angle, 2),
            "SA":         round(sa_angle, 2),
            "KA":         round(ka_angle, 2),
        })

        detected += 1

    cap.release()

    print(f"  Detected   : {detected} frames")
    print(f"  Skipped    : {skipped} frames (no landmark)")

    return video_data

# ======-----------------------------------------------------
# Main
# ======-----------------------------------------------------

if __name__ == "__main__":

    print("=" * 60)
    print("  POSTURE DATASET EXTRACTION")
    print("  Using MediaPipe Pose + EAR-SHOULDER-HIP angle logic")
    print("=" * 60)

    videos = get_video_list()

    print(f"\nTotal Videos : {len(videos)}")

    if len(videos) == 0:
        print("[ERROR] No videos found in dataset/ folder.")
        exit(1)

    # Create ONE MediaPipe Pose instance for all videos
    pose = create_pose(static_image_mode=False, model_complexity=2)

    # Process all videos
    for video in videos:
        video_data = process_video(video, pose)
        dataset.extend(video_data)

    # Close MediaPipe
    pose.close()

    # Save to CSV
    if len(dataset) == 0:
        print("\n[ERROR] No data extracted. Check your videos.")
        exit(1)

    df = pd.DataFrame(dataset)
    df.to_csv(OUTPUT_FILE, index=False)

    print("\n" + "=" * 60)
    print(f"  DATASET SAVED : {OUTPUT_FILE}")
    print(f"  Total Rows    : {len(df)}")
    print("=" * 60)

    # Print summary per label
    print("\n  Summary per Label:")
    print("-" * 60)

    for label in df["label"].unique():
        sub = df[df["label"] == label]
        print(f"\n  [{label}] — {len(sub)} frames from "
              f"{sub['video_name'].nunique()} videos")
        print(f"    CA : mean={sub['CA'].mean():.1f}°  "
              f"std={sub['CA'].std():.1f}°  "
              f"range=[{sub['CA'].min():.1f}°, {sub['CA'].max():.1f}°]")
        print(f"    SA : mean={sub['SA'].mean():.1f}°  "
              f"std={sub['SA'].std():.1f}°  "
              f"range=[{sub['SA'].min():.1f}°, {sub['SA'].max():.1f}°]")
        print(f"    KA : mean={sub['KA'].mean():.1f}°  "
              f"std={sub['KA'].std():.1f}°  "
              f"range=[{sub['KA'].min():.1f}°, {sub['KA'].max():.1f}°]")

    print("\n" + "=" * 60)
    print("  Done! Run analyze_threshold.py next for threshold analysis.")
    print("=" * 60)
