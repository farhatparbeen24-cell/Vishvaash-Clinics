"""Finalize brand logo assets: clean rejects, rename, convert, verify dims."""
from PIL import Image
import os, shutil, glob

D = "/home/z/my-project/assets-brands"
PUB = "/home/z/my-project/public/images/brands"
os.makedirs(PUB, exist_ok=True)

# junk removal
for pat in ["keeler.png", "keeler.webp", "keeler-wayback.png", "lupin.png",
            "lupin-touch.png", "lupin-favicon.png", "zydus.png", "vibgyor.png",
            "vibgyor-black.png", "vibgyor-fav.ico", "vibgyor-gfav.png",
            "appasamy-favicon.ico", "alcon-footer.svg", "biotech.svg",
            "_*.html", "_s_*.json", "*.cands", "_r_*"]:
    for f in glob.glob(os.path.join(D, pat)):
        os.remove(f)

plan = {
    "zeiss.svg": "zeiss.svg",
    "alcon.svg": "alcon.svg",
    "hoya.svg": "hoya.svg",
    "jnj.svg": "jnj.svg",
    "oertli.svg": "oertli.svg",
    "topcon.svg": "topcon.svg",
    "appasamy-gfav.png": "appasamy.png",
    "biotech.png": "biotech.png",
    "keeler-gfav.png": "keeler.png",
    "neomedixhealthcare-gfav.png": "neomedix.png",
    "lupin-menu.png": "lupin.png",
    "alembic.png": "alembic.png",
    "alkem.png": "alkem.png",
    "sunpharma.png": "sunpharma.png",
    "labomed.jpg": "labomed.webp",   # white-bg photo logo -> webp
    "zydus.jpg": "zydus.webp",       # commons jpg -> webp (downscaled)
}
for src, dst in plan.items():
    s = os.path.join(D, src)
    d = os.path.join(PUB, dst)
    if not os.path.exists(s):
        print("MISSING SRC", src); continue
    if dst.endswith(".webp"):
        im = Image.open(s).convert("RGB")
        if im.height > 240:
            im = im.resize((int(im.width * 240 / im.height), 240), Image.LANCZOS)
        im.save(d, "WEBP", quality=88)
        print(f"{src} -> {dst} {im.size}")
    else:
        shutil.copyfile(s, d)
        print(f"{src} -> {dst} (copied)")

# final size report
print("\n--- FINAL ---")
for f in sorted(os.listdir(PUB)):
    p = os.path.join(PUB, f)
    extra = ""
    if f.endswith((".png", ".webp")):
        extra = str(Image.open(p).size)
    print(f"{f:18s} {os.path.getsize(p):7d} B  {extra}")
