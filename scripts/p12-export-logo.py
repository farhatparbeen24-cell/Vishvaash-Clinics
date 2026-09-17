#!/usr/bin/env python3
"""Task 12 — measure glyph metrics of the approved logo asset and export a
trimmed, web-optimized PNG for the site (visible design unchanged).

- Trims ONLY fully-transparent margins (bbox of alpha > 8, +2px safety pad).
- Downscales to 1260px width (>= 4.5x the largest display size ~276px,
  sharp at 3x DPR). No colour, geometry or design changes.
"""
from PIL import Image
import numpy as np
import os

SRC = "/home/z/my-project/upload/file_00000000e66c82118efbabadcd9cdb38.png"
OUT_DIR = "/home/z/my-project/public/images/brand"
OUT = os.path.join(OUT_DIR, "vishvaas-clinic-logo.png")

img = Image.open(SRC).convert("RGBA")
a = np.array(img)
alpha = a[:, :, 3]
ys, xs = np.where(alpha > 8)
x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
pad = 2
crop_box = (max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad + 1), min(img.height, y1 + pad + 1))
trimmed = img.crop(crop_box)
tw, th = trimmed.size
print(f"content bbox: ({x0},{y0})-({x1},{y1})  crop: {tw}x{th}  aspect: {tw/th:.3f}")

# --- glyph metrics (for display sizing decisions) -------------------------
r, g, b, al = (a[:, :, i].astype(int) for i in range(4))
ta = Image.open(SRC).convert("RGBA")
t = np.array(ta)
tr, tg, tb, tal = (t[:, :, i].astype(int) for i in range(4))
orange = (tr > 200) & (tg > 110) & (tg < 200) & (tb < 120) & (tal > 128)
# tagline band lives in right 60%, below y=440
tag_band = orange[440:, int(tw * 0.0):]
# restrict to tagline x-range 919..1843 (measured earlier)
tag_band = orange[440:, 919:1844]
rows = np.where(tag_band.any(axis=1))[0] + 440
print(f"tagline glyph band: y {rows.min()}–{rows.max()} = {rows.max()-rows.min()+1}px "
      f"({(rows.max()-rows.min()+1)/th*100:.1f}% of content height)")
# wordmark: white glyphs right of the monogram (x >= 560)
white = (tr > 230) & (tg > 230) & (tb > 230) & (tal > 128)
wm = white[:, 560:]
wrows = np.where(wm.any(axis=1))[0]
print(f"wordmark glyph band: y {wrows.min()}–{wrows.max()} = {wrows.max()-wrows.min()+1}px "
      f"({(wrows.max()-wrows.min()+1)/th*100:.1f}% of content height)")
# tagline cap-height: vertical run through the 'T' stem (first letter)
col_x = 919 + 6
col = orange[:, col_x]
runs = np.where(col)[0]
if len(runs):
    print(f"T-stem vertical run at x={col_x}: {runs.min()}–{runs.max()} = {runs.max()-runs.min()+1}px")

# --- export ---------------------------------------------------------------
TARGET_W = 1260
out_h = round(th * TARGET_W / tw)
final = trimmed.resize((TARGET_W, out_h), Image.LANCZOS)
os.makedirs(OUT_DIR, exist_ok=True)
final.save(OUT, "PNG", optimize=True)
print(f"exported: {OUT}  {TARGET_W}x{out_h}  {os.path.getsize(OUT)//1024} KB")

# downscale-sharpness sanity: also verify LANCZOS kept tagline band
fa = np.array(final)
fo = (fa[:, :, 0].astype(int) > 200) & (fa[:, :, 1].astype(int) > 110) & \
     (fa[:, :, 1].astype(int) < 200) & (fa[:, :, 2].astype(int) < 120) & (fa[:, :, 3] > 128)
frows = np.where(fo.any(axis=1))[0]
print(f"export tagline band: {frows.max()-frows.min()+1}px at {TARGET_W}px wide "
      f"(= {(frows.max()-frows.min()+1)/out_h*100:.1f}% of height)")
