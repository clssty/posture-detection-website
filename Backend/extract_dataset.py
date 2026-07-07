"""
extract_dataset.py

Posture Detection System

Extract Craniovertebral Angle (CA),
Shoulder Angle (SA),
Kyphosis Angle (KA)
from posture videos into CSV dataset.

"""

import os
import cv2
import mediapipe as mp
import numpy as np
import pandas as pd
from tqdm import tqdm

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

# =========================
# MediaPipe Initialization
# =========================

mp_pose = mp.solutions.pose

pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=2,
    smooth_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

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
    labels = ["ERGONOMIC", "SLIGHTLY", "SLOUCHED"]

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

        for filename in os.listdir(folder_path):

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

def process_video(video_info):

    video_path = video_info["video_path"]

    video_name = video_info["video_name"]

    label = video_info["label"]

    print(f"\nProcessing : {video_name}")

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():

        print(f"[ERROR] Cannot open {video_name}")

        return

    fps = cap.get(cv2.CAP_PROP_FPS)

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    duration = total_frames / fps if fps > 0 else 0

    print(f"FPS          : {fps:.2f}")

    print(f"Total Frames : {total_frames}")

    print(f"Duration     : {duration:.2f} sec")

    cap.release()

# ======-----------------------------------------------------
# Main / temporary testing - can change depends on the needs
# ======-----------------------------------------------------

if __name__ == "__main__":

    videos = get_video_list()

    print("=" * 50)
    print(f"Total Videos : {len(videos)}")

    for video in videos:

        process_video(video)
