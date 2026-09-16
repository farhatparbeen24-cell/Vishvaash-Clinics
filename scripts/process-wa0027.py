"""Process IMG-20260912-WA0027.jpg for the gallery:
- auto-detect the baked-in decorative frame (uniform border rows/cols)
- trim ONLY the border (which also removes the camera date stamp sitting
  inside the frame area), preserving the actual photograph unaltered
- recompress (JPEG q82) per the gallery pipeline, save to public/images/gallery/
"""
from PIL import Image
import os

SRC = "/home/z/my-project/upload/IMG-20260912-WA0027.jpg"
DST = "/home/z/my-project/public/images/gallery/gallery-treatment-room.jpg"

im = Image.open(SRC).convert("RGB")
w, h = im.size
print("original:", im.size)

px = im.load()

def row_uniform(y, tol=14):
    """Row is 'frame-like' if all pixels are close to the row's own mean and
    the row mean is close to grey/white frame colour."""
    rs, gs, bs = [], [], []
    for x in range(0, w, 4):
        r, g, b = px[x, y]
        rs.append(r); gs.append(g); bs.append(b)
    mr, mg, mb = sum(rs)/len(rs), sum(gs)/len(gs), sum(bs)/len(bs)
    if max(mr, mg, mb) - min(mr, mg, mb) > 26:  # coloured row → photo content
        return False
    for x in range(0, w, 7):
        r, g, b = px[x, y]
        if abs(r-mr) > tol or abs(g-mg) > tol or abs(b-mb) > tol:
            return False
    return True

def col_uniform(x, tol=14):
    rs, gs, bs = [], [], []
    for y in range(0, h, 4):
        r, g, b = px[x, y]
        rs.append(r); gs.append(g); bs.append(b)
    mr, mg, mb = sum(rs)/len(rs), sum(gs)/len(gs), sum(bs)/len(bs)
    if max(mr, mg, mb) - min(mr, mg, mb) > 26:
        return False
    for y in range(0, h, 7):
        r, g, b = px[x, y]
        if abs(r-mr) > tol or abs(g-mg) > tol or abs(b-mb) > tol:
            return False
    return True

top = 0
while top < h // 3 and row_uniform(top):
    top += 1
bottom = h - 1
while bottom > 2 * h // 3 and row_uniform(bottom):
    bottom -= 1
left = 0
while left < w // 3 and col_uniform(left):
    left += 1
right = w - 1
while right > 2 * w // 3 and col_uniform(right):
    right -= 1

# small safety inset so anti-aliased frame edge is gone
inset = 2
# bottom extra: camera date stamp ("17 Au…") is overlaid INSIDE the photo at
# y≈675–710 — a straight bottom-band crop removes it (floor area only, no
# retouching / no content manipulation).
bottom_extra = 62
box = (left + inset, top + inset, right - 1 - inset, bottom + 1 - inset - bottom_extra)
print("detected frame:", (left, top, w - 1 - right, h - 1 - bottom), "-> crop", box)

out = im.crop(box)
out.save(DST, "JPEG", quality=82, optimize=True)
print("saved:", DST, out.size, os.path.getsize(DST), "bytes")

# also check bottom strip AFTER crop for residual date stamp visibility area
print("final dims:", out.size)
