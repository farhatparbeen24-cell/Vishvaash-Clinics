"""Build a labeled contact sheet of the 10 newly uploaded client photos
(2 cols x 5 rows, each cell 560px wide) plus print exact dimensions."""
from PIL import Image, ImageDraw, ImageFont
import os

FILES = [
    "IMG-20260914-WA0019.jpg", "IMG-20260914-WA0020.jpg",
    "IMG-20260914-WA0022.jpg", "IMG-20260914-WA0023.jpg",
    "IMG-20260914-WA0024.jpg", "IMG-20260914-WA0025.jpg",
    "IMG-20260912-WA0014.jpg", "IMG-20260912-WA0027.jpg",
    "IMG-20260912-WA0028.jpg", "IMG-20260912-WA0029.jpg",
]
SRC = "/home/z/my-project/upload"
CELL_W, PAD, LABEL_H = 560, 12, 34
COLS = 2

cells = []
for f in FILES:
    im = Image.open(os.path.join(SRC, f))
    print(f, im.size, im.mode)
    ratio = CELL_W / im.width
    im2 = im.convert("RGB").resize((CELL_W, max(1, int(im.height * ratio))))
    cells.append((f, im2))

rows = (len(cells) + COLS - 1) // COLS
row_heights = []
for r in range(rows):
    row = cells[r * COLS:(r + 1) * COLS]
    row_heights.append(max(c[1].height for c in row) + LABEL_H + PAD)

W = COLS * (CELL_W + PAD) + PAD
H = sum(row_heights) + PAD
sheet = Image.new("RGB", (W, H), "white")
draw = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
except Exception:
    font = ImageFont.load_default()

y = PAD
for r in range(rows):
    row = cells[r * COLS:(r + 1) * COLS]
    for c, (name, im) in enumerate(row):
        x = PAD + c * (CELL_W + PAD)
        draw.text((x, y), name, fill="black", font=font)
        sheet.paste(im, (x, y + LABEL_H))
    y += row_heights[r]

out = "/home/z/my-project/download/qa/p2-new-gallery-contact-sheet.jpg"
sheet.save(out, quality=80)
print("saved", out, sheet.size)
