"""Contact sheet of all fetched brand logos for visual verification."""
from PIL import Image, ImageDraw, ImageFont
import os, glob

D = "/home/z/my-project/assets-brands"
files = sorted(f for f in glob.glob(os.path.join(D, "*"))
               if f.endswith((".svg", ".png", ".webp", ".jpg"))
               and not os.path.basename(f).startswith("_"))
# rasterize SVGs via cairosvg if available, else skip with note
rasters = []
for f in files:
    b = os.path.basename(f)
    if f.endswith(".svg"):
        out = os.path.join(D, f"_r_{b}.png")
        try:
            import cairosvg
            cairosvg.svg2png(url=f, write_to=out, output_width=280, background_color="white")
            rasters.append((b, Image.open(out).convert("RGB")))
        except Exception as e:
            rasters.append((b + " (SVG not rendered)", None))
    else:
        try:
            im = Image.open(f).convert("RGB")
            rasters.append((b, im))
        except Exception:
            rasters.append((b + " (unreadable)", None))

CELL_W, CELL_H, PAD, LABEL = 300, 130, 10, 24
COLS = 4
rows = (len(rasters) + COLS - 1) // COLS
sheet = Image.new("RGB", (COLS * (CELL_W + PAD) + PAD, rows * (CELL_H + LABEL + PAD) + PAD), "#eeeeee")
draw = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 14)
except Exception:
    font = ImageFont.load_default()

for i, (name, im) in enumerate(rasters):
    x = PAD + (i % COLS) * (CELL_W + PAD)
    y = PAD + (i // COLS) * (CELL_H + LABEL + PAD)
    draw.rectangle([x, y, x + CELL_W, y + CELL_H], fill="white", outline="#bbb")
    if im is not None:
        im.thumbnail((CELL_W - 16, CELL_H - 16))
        sheet.paste(im, (x + (CELL_W - im.width) // 2, y + (CELL_H - im.height) // 2))
    draw.text((x + 4, y + CELL_H + 3), name[:38], fill="black", font=font)

out = "/home/z/my-project/download/qa/p2-brands-verify-sheet.jpg"
sheet.save(out, quality=85)
print("saved", out)
for name, im in rasters:
    print(" -", name, im.size if im else "")
