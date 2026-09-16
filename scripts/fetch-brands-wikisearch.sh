#!/usr/bin/env bash
# Search-driven Commons logo fetch for remaining brands.
set -u
UA="VishvaasClinicWebsite/1.0 (https://www.vishvaasclinics.com; contact@vishvaasclinics.com) curl/8"
OUT=/home/z/my-project/assets-brands
LOG="$OUT/provenance.txt"
mkdir -p "$OUT"

search_wiki() { # search_wiki <slug> <query...>
  local slug="$1"; shift
  local q=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(' '.join(sys.argv[1:])))" "$@")
  local api="https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${q}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url%7Cmime&format=json"
  local resp="$OUT/_s_$slug.json"
  curl -sL --max-time 25 -A "$UA" -o "$resp" "$api"
  python3 - "$resp" "$slug" << 'PYEOF'
import json, sys, subprocess, os
resp, slug = sys.argv[1], sys.argv[2]
out = "/home/z/my-project/assets-brands"
log = out + "/provenance.txt"
try:
    d = json.load(open(resp))
    pages = list(d.get("query", {}).get("pages", {}).values())
except Exception:
    pages = []
bad = ("icon", "symbol_only")  # prefer wordmarks
for p in sorted(pages, key=lambda x: x.get("index", 99)):
    ii = (p.get("imageinfo") or [None])[0]
    if not ii or ii.get("mime") not in ("image/svg+xml", "image/png"):
        continue
    url = ii["url"]
    title = p.get("title", "")
    ext = "svg" if url.endswith(".svg") or "svg" in ii.get("mime", "") else "png"
    dest = f"{out}/{slug}.{ext}"
    r = subprocess.run(["curl", "-sL", "--max-time", "25", "-A",
        "VishvaasClinicWebsite/1.0 (https://www.vishvaasclinics.com; contact@vishvaasclinics.com) curl/8",
        "-o", dest, url])
    ok = False
    if os.path.exists(dest) and os.path.getsize(dest) > 400:
        head = open(dest, "rb").read(300)
        ok = b"<svg" in head or b"<?xml" in head or head.startswith(b"\x89PNG")
    if ok:
        with open(log, "a") as f:
            f.write(f"{slug}  WIKIMEDIA  {title}  {url}\n")
        print(f"OK  {slug} (wikimedia search: {title})")
        sys.exit(0)
    if os.path.exists(dest):
        os.remove(dest)
print(f"MISS {slug} (commons search)")
sys.exit(1)
PYEOF
}

search_wiki alcon     "Alcon" "logo" "eye care company"
search_wiki jnj       "Johnson" "and" "Johnson" "logo" "2023"
search_wiki topcon    "Topcon" "logo"
search_wiki sunpharma "Sun" "Pharmaceutical" "logo"
search_wiki lupin     "Lupin" "logo" "pharmaceutical"
search_wiki zydus     "Zydus" "logo"
search_wiki alkem     "Alkem" "logo"
search_wiki alembic   "Alembic" "logo" "pharmaceutical"
