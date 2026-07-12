"""
analyze_threshold.py

Posture Detection System

Reads posture_dataset.csv and performs statistical analysis
to determine optimal CA, SA, KA thresholds for classifying
posture as Good (ERGONOMIC), Fair (SLIGHTLY), or Poor (SLOUNCHED).

Replaces the hardcoded thresholds in post_test.py with
data-driven values.
"""

import os
import pandas as pd
import numpy as np

# ==================
# Paths
# ==================

INPUT_FILE  = os.path.join("output", "posture_dataset.csv")
OUTPUT_FILE = os.path.join("output", "threshold_analysis.txt")

# ==================
# Current hardcoded thresholds from post_test.py
# ==================

CURRENT_THRESHOLDS = {
    "CA": {"IDEAL_MIN": 75, "FAIR_MIN": 60},
    "SA": {"IDEAL_MIN": 80, "FAIR_MIN": 65},
    "KA": {"IDEAL_MIN": 160, "FAIR_MIN": 140},
}

# ==================
# Label mapping
# ==================
# ERGONOMIC  = Good posture
# SLIGHTLY   = Fair posture (slightly slouched)
# SLOUNCHED  = Poor posture (significantly slouched)


def load_dataset():
    """Load and validate the dataset CSV."""
    if not os.path.exists(INPUT_FILE):
        print(f"[ERROR] Dataset not found: {INPUT_FILE}")
        print("Run extract_dataset.py first.")
        exit(1)

    df = pd.read_csv(INPUT_FILE)
    print(f"Loaded {len(df)} rows from {INPUT_FILE}")
    return df


def descriptive_stats(df):
    """Compute descriptive statistics per label for CA, SA, KA."""
    lines = []
    lines.append("=" * 70)
    lines.append("  DESCRIPTIVE STATISTICS PER LABEL")
    lines.append("=" * 70)

    angles = ["CA", "SA", "KA"]
    labels_order = ["ERGONOMIC", "SLIGHTLY", "SLOUNCHED"]

    for label in labels_order:
        sub = df[df["label"] == label]
        n_frames = len(sub)
        n_videos = sub["video_name"].nunique()

        lines.append(f"\n  [{label}] — {n_frames} frames, {n_videos} videos")
        lines.append("-" * 70)
        lines.append(f"  {'Angle':<6} {'Mean':>8} {'Std':>8} {'Min':>8} "
                      f"{'Q1':>8} {'Median':>8} {'Q3':>8} {'Max':>8}")
        lines.append("-" * 70)

        for angle in angles:
            vals = sub[angle]
            lines.append(
                f"  {angle:<6} "
                f"{vals.mean():>8.1f} "
                f"{vals.std():>8.1f} "
                f"{vals.min():>8.1f} "
                f"{vals.quantile(0.25):>8.1f} "
                f"{vals.median():>8.1f} "
                f"{vals.quantile(0.75):>8.1f} "
                f"{vals.max():>8.1f}"
            )

    return lines


def compute_thresholds(df):
    """Compute recommended thresholds using midpoint between class means."""
    lines = []
    lines.append("\n" + "=" * 70)
    lines.append("  THRESHOLD ANALYSIS")
    lines.append("=" * 70)

    angles = ["CA", "SA", "KA"]

    # Compute means per label
    means = {}
    for label in ["ERGONOMIC", "SLIGHTLY", "SLOUNCHED"]:
        sub = df[df["label"] == label]
        means[label] = {angle: sub[angle].mean() for angle in angles}

    # Show means
    lines.append("\n  Mean values per label:")
    lines.append(f"  {'Angle':<6} {'ERGONOMIC':>12} {'SLIGHTLY':>12} {'SLOUNCHED':>12}")
    lines.append("-" * 50)
    for angle in angles:
        lines.append(
            f"  {angle:<6} "
            f"{means['ERGONOMIC'][angle]:>12.1f} "
            f"{means['SLIGHTLY'][angle]:>12.1f} "
            f"{means['SLOUNCHED'][angle]:>12.1f}"
        )

    # Compute thresholds (midpoint between class means)
    lines.append("\n  Threshold Calculation (midpoint between adjacent class means):")
    lines.append("-" * 70)

    new_thresholds = {}

    for angle in angles:
        ergo_mean   = means["ERGONOMIC"][angle]
        slight_mean = means["SLIGHTLY"][angle]
        slouch_mean = means["SLOUNCHED"][angle]

        # IDEAL_MIN: boundary between ERGONOMIC and SLIGHTLY
        ideal_min = round((ergo_mean + slight_mean) / 2, 1)

        # FAIR_MIN: boundary between SLIGHTLY and SLOUNCHED
        fair_min = round((slight_mean + slouch_mean) / 2, 1)

        new_thresholds[angle] = {
            "IDEAL_MIN": ideal_min,
            "FAIR_MIN": fair_min,
        }

        lines.append(
            f"\n  {angle}:"
            f"\n    ERGONOMIC mean = {ergo_mean:.1f}°"
            f"\n    SLIGHTLY  mean = {slight_mean:.1f}°"
            f"\n    SLOUNCHED mean = {slouch_mean:.1f}°"
            f"\n    => IDEAL_MIN (Good/Fair boundary)  = "
            f"({ergo_mean:.1f} + {slight_mean:.1f}) / 2 = {ideal_min} deg"
            f"\n    => FAIR_MIN  (Fair/Poor boundary)   = "
            f"({slight_mean:.1f} + {slouch_mean:.1f}) / 2 = {fair_min} deg"
        )

    return lines, new_thresholds


def comparison_table(new_thresholds):
    """Create comparison table: old (hardcoded) vs new (data-driven)."""
    lines = []
    lines.append("\n" + "=" * 70)
    lines.append("  COMPARISON: OLD vs NEW THRESHOLDS")
    lines.append("=" * 70)

    angles = ["CA", "SA", "KA"]

    lines.append(f"\n  {'Angle':<6} {'Threshold':<12} "
                  f"{'Old (hardcoded)':>16} {'New (data)':>16} {'Change':>10}")
    lines.append("-" * 70)

    for angle in angles:
        old_ideal = CURRENT_THRESHOLDS[angle]["IDEAL_MIN"]
        old_fair  = CURRENT_THRESHOLDS[angle]["FAIR_MIN"]
        new_ideal = new_thresholds[angle]["IDEAL_MIN"]
        new_fair  = new_thresholds[angle]["FAIR_MIN"]

        diff_ideal = new_ideal - old_ideal
        diff_fair  = new_fair  - old_fair

        lines.append(
            f"  {angle:<6} {'IDEAL_MIN':<12} "
            f"{old_ideal:>15.0f}° {new_ideal:>15.1f}° "
            f"{diff_ideal:>+9.1f}°"
        )
        lines.append(
            f"  {'':6} {'FAIR_MIN':<12} "
            f"{old_fair:>15.0f}° {new_fair:>15.1f}° "
            f"{diff_fair:>+9.1f}°"
        )
        lines.append("")

    return lines


def generate_code_snippet(new_thresholds):
    """Generate ready-to-paste Python code for post_test.py."""
    lines = []
    lines.append("\n" + "=" * 70)
    lines.append("  READY-TO-USE CODE (paste into post_test.py)")
    lines.append("=" * 70)

    ca = new_thresholds["CA"]
    sa = new_thresholds["SA"]
    ka = new_thresholds["KA"]

    lines.append(f"""
  # CA threshold (data-driven)
  CA_IDEAL_MIN = {ca['IDEAL_MIN']}
  CA_FAIR_MIN  = {ca['FAIR_MIN']}

  # SA threshold (data-driven)
  SA_IDEAL_MIN = {sa['IDEAL_MIN']}
  SA_FAIR_MIN  = {sa['FAIR_MIN']}

  # KA threshold (data-driven)
  KA_IDEAL_MIN = {ka['IDEAL_MIN']}
  KA_FAIR_MIN  = {ka['FAIR_MIN']}""")

    return lines


def validate_thresholds(df, new_thresholds):
    """Validate new thresholds by computing classification accuracy."""
    lines = []
    lines.append("\n" + "=" * 70)
    lines.append("  VALIDATION — Classification Accuracy with New Thresholds")
    lines.append("=" * 70)

    # Map labels to expected classification
    label_to_expected = {
        "ERGONOMIC":  "Good",
        "SLIGHTLY":   "Fair",
        "SLOUNCHED":  "Poor",
    }

    def classify_angle(val, ideal_min, fair_min):
        if val >= ideal_min:
            return "Good"
        elif val >= fair_min:
            return "Fair"
        return "Poor"

    def overall(ca_cls, sa_cls, ka_cls):
        statuses = [ca_cls, sa_cls, ka_cls]
        if all(s == "Good" for s in statuses):
            return "Good"
        elif any(s == "Poor" for s in statuses):
            return "Poor"
        return "Fair"

    ca_t = new_thresholds["CA"]
    sa_t = new_thresholds["SA"]
    ka_t = new_thresholds["KA"]

    for label in ["ERGONOMIC", "SLIGHTLY", "SLOUNCHED"]:
        sub = df[df["label"] == label]
        expected = label_to_expected[label]
        correct = 0

        for _, row in sub.iterrows():
            ca_cls = classify_angle(row["CA"], ca_t["IDEAL_MIN"], ca_t["FAIR_MIN"])
            sa_cls = classify_angle(row["SA"], sa_t["IDEAL_MIN"], sa_t["FAIR_MIN"])
            ka_cls = classify_angle(row["KA"], ka_t["IDEAL_MIN"], ka_t["FAIR_MIN"])
            predicted = overall(ca_cls, sa_cls, ka_cls)

            if predicted == expected:
                correct += 1

        accuracy = (correct / len(sub) * 100) if len(sub) > 0 else 0
        lines.append(f"\n  [{label}] expected={expected}")
        lines.append(f"    Correct: {correct}/{len(sub)} ({accuracy:.1f}%)")

    return lines


# ==================
# Main
# ==================

if __name__ == "__main__":

    print("=" * 70)
    print("  POSTURE THRESHOLD ANALYSIS")
    print("=" * 70)

    df = load_dataset()

    all_lines = []

    # 1. Descriptive statistics
    stats_lines = descriptive_stats(df)
    all_lines.extend(stats_lines)

    # 2. Threshold calculation
    threshold_lines, new_thresholds = compute_thresholds(df)
    all_lines.extend(threshold_lines)

    # 3. Comparison table
    comparison_lines = comparison_table(new_thresholds)
    all_lines.extend(comparison_lines)

    # 4. Code snippet
    code_lines = generate_code_snippet(new_thresholds)
    all_lines.extend(code_lines)

    # 5. Validation
    validation_lines = validate_thresholds(df, new_thresholds)
    all_lines.extend(validation_lines)

    # Print everything
    for line in all_lines:
        print(line)

    # Save to file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(all_lines))

    print(f"\n\n  Results saved to: {OUTPUT_FILE}")
    print("=" * 70)
