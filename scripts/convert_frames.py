"""
Bugatti Bolide Frame Converter
Converts frame_001.jpg → frame_276.jpg (275 frames, 2560×1440 JPEG)
to frame_0001.webp → frame_0276.webp at Quality 86 WebP (Lanczos).

Missing frame_273 is handled by duplicating frame_272.

Usage:
    python scripts/convert_frames.py
"""

import os
import sys
import shutil
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow not found. Installing...")
    os.system(f"{sys.executable} -m pip install Pillow")
    from PIL import Image

SRC_DIR  = Path("D:/3d-Website/public")
DST_DIR  = Path("D:/3d-Website/bolide-hypercar/public/frames")
QUALITY  = 86
WORKERS  = 16
TOTAL    = 276  # 001 → 276

DST_DIR.mkdir(parents=True, exist_ok=True)


def src_path(n: int) -> Path:
    return SRC_DIR / f"frame_{n:03d}.jpg"


def dst_path(n: int) -> Path:
    return DST_DIR / f"frame_{n:04d}.webp"


def convert_one(n: int) -> tuple[int, str]:
    dst = dst_path(n)
    if dst.exists():
        return n, "skip"

    # Handle missing frame_273 by duplicating frame_272
    src = src_path(n)
    if not src.exists():
        fallback = src_path(n - 1)
        if fallback.exists():
            src = fallback
            print(f"  [WARN] frame_{n:03d}.jpg missing — using frame_{n-1:03d}.jpg as fallback")
        else:
            return n, f"MISSING (no fallback)"

    try:
        with Image.open(src) as img:
            img = img.convert("RGB")
            img.save(dst, format="WEBP", quality=QUALITY, method=6)
        return n, "ok"
    except Exception as e:
        return n, f"ERROR: {e}"


def main():
    print(f"Source : {SRC_DIR}")
    print(f"Dest   : {DST_DIR}")
    print(f"Frames : {TOTAL}  |  Quality: {QUALITY} WebP  |  Workers: {WORKERS}")
    print("-" * 60)

    t0 = time.time()
    results = {"ok": 0, "skip": 0, "warn": 0, "error": 0}

    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        futures = {ex.submit(convert_one, n): n for n in range(1, TOTAL + 1)}
        done = 0
        for fut in as_completed(futures):
            n, status = fut.result()
            done += 1
            if status == "ok":
                results["ok"] += 1
            elif status == "skip":
                results["skip"] += 1
            elif status.startswith("WARN") or "fallback" in status.lower():
                results["warn"] += 1
                results["ok"] += 1
            else:
                results["error"] += 1
                print(f"  [ERROR] frame {n:04d}: {status}")
            if done % 50 == 0 or done == TOTAL:
                pct = done / TOTAL * 100
                print(f"  {done}/{TOTAL} ({pct:.0f}%) — converted: {results['ok']}  skip: {results['skip']}  err: {results['error']}")

    elapsed = time.time() - t0
    total_bytes = sum(f.stat().st_size for f in DST_DIR.glob("*.webp"))
    total_mb = total_bytes / 1024 / 1024
    print("-" * 60)
    print(f"Done in {elapsed:.1f}s")
    print(f"Converted: {results['ok']}  Skipped: {results['skip']}  Errors: {results['error']}")
    print(f"Output size: {total_mb:.1f} MB  ({total_bytes:,} bytes)")

    # Verify count
    actual = len(list(DST_DIR.glob("*.webp")))
    print(f"Files in dest: {actual}")
    if actual >= TOTAL:
        print("[OK] All frames present")
    else:
        print(f"[WARN] Expected {TOTAL}, found {actual}")


if __name__ == "__main__":
    main()
