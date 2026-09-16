#!/usr/bin/env bash
# Fetch official brand logos: Wikimedia Commons (trusted) + official sites.
# Saves into /home/z/my-project/assets-brands/<slug>.<ext> + provenance log.
set -u
UA="VishvaasClinicWebsite/1.0 (https://www.vishvaasclinics.com; contact@vishvaasclinics.com) curl/8"
OUT=/home/z/my-project/assets-brands
LOG="$OUT/provenance.txt"
mkdir -p "$OUT"
: > "$LOG"

fetch() { # fetch <url> <outfile>
  curl -sL --max-time 25 -A "$UA" -o "$2" "$1" 2>/dev/null
}

# --- 1) Wikimedia Commons via API (resolve file title -> URL) --------------
wiki() { # wiki <slug> <File:Title> ...
  local slug="$1"; shift
  for t in "$@"; do
    local enc=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$t")
    local api="https://commons.wikimedia.org/w/api.php?action=query&titles=${enc}&prop=imageinfo&iiprop=url%7Cmime&format=json"
    local url=$(fetch "$api" /dev/stdout | python3 -c "
import json,sys
try:
  d=json.load(sys.stdin)
  for p in d['query']['pages'].values():
    ii=p.get('imageinfo')
    if ii and ii[0]['mime'] in ('image/svg+xml','image/png'):
      print(ii[0]['url']); break
except Exception: pass
")
    if [ -n "$url" ]; then
      local ext=svg; case "$url" in *.png) ext=png;; esac
      sleep 2
      fetch "$url" "$OUT/$slug.$ext"
      if head -c 300 "$OUT/$slug.$ext" | grep -qiE '<svg|<xml|\x89PNG'; then
        echo "$slug  WIKIMEDIA  $t  $url" >> "$LOG"; echo "OK  $slug (wikimedia: $t)"; return 0
      fi
      rm -f "$OUT/$slug.$ext"
    fi
    sleep 2
  done
  return 1
}

# --- 2) official site: grab first logo-ish asset from homepage HTML ---------
official() { # official <slug> <homepage> [img-substring-filter]
  local slug="$1" page="$2" filter="${3:-logo}"
  local html="$OUT/_$slug.html"
  fetch "$page" "$html"
  [ -s "$html" ] || { rm -f "$html"; echo "MISS $slug (page fetch failed: $page)"; return 1; }
  local src=$(grep -oiE '(src|data-src)="[^"]+"' "$html" | sed 's/^[a-z-]*="//;s/"$//' | grep -iE "$filter" | grep -viE 'sprite|data:' | head -4)
  for s in $src; do
    local origin=$(echo "$page" | sed -E 's#(https?://[^/]+).*#\1#')
    case "$s" in http*) u="$s";; //*) u="https:$s";; /*) u="$origin$s";; *) u="$origin/$s";; esac
    local ext="${u##*.}"; ext=$(echo "$ext" | cut -c1-4 | tr 'A-Z' 'a-z')
    case "$ext" in svg|png|webp) ;; *) continue;; esac
    fetch "$u" "$OUT/$slug.$ext"
    if [ -s "$OUT/$slug.$ext" ] && head -c 300 "$OUT/$slug.$ext" | grep -qiE '<svg|<xml|\x89PNG|RIFF'; then
      echo "$slug  OFFICIAL  $u" >> "$LOG"; echo "OK  $slug (official: $u)"; rm -f "$html"; return 0
    fi
    rm -f "$OUT/$slug.$ext"
  done
  rm -f "$html"
  echo "MISS $slug (no logo asset found at $page)"
  return 1
}

echo "--- Wikimedia batch ---"
wiki zeiss   "File:Zeiss logo.svg" "File:ZEISS.svg" "File:Zeiss Logo.svg"
wiki alcon   "File:Alcon logo.svg" "File:Alcon Laboratories logo.svg" "File:Alcon Swiss brand logo.svg"
wiki hoya    "File:Hoya Corporation logo.svg" "File:HOYA Corporation logo.svg" "File:HOYA logo.svg"
wiki jnj     "File:Johnson & Johnson logo.svg" "File:Johnson & Johnson Logo.svg" "File:Johnson & Johnson-Logo.svg"
wiki topcon  "File:Topcon logo.svg" "File:Topcon Corporation logo.svg" "File:Topcon Positioning System logo.svg"
wiki sunpharma "File:Sun Pharmaceutical Industries logo.svg" "File:Sun Pharma logo.svg" "File:Sun Pharmaceutical logo.svg"
wiki lupin   "File:Lupin logo.svg" "File:Lupin Limited logo.svg" "File:Lupin Pharmaceuticals logo.svg"
wiki zydus   "File:Zydus Lifesciences logo.svg" "File:Cadila Healthcare logo.svg" "File:Zydus Cadila logo.svg"
wiki alkem   "File:Alkem Laboratories logo.svg" "File:Alkem logo.svg"
wiki alembic "File:Alembic Limited logo.svg" "File:Alembic logo.svg" "File:Alembic Pharmaceuticals logo.svg"

echo "--- Official site batch ---"
official appasamy "https://www.appasamy.com"  "logo"
official oertli  "https://www.oertli.com"     "logo"
official keeler  "https://www.keeler.co.uk"   "logo"
official labomed "https://www.labomed.com"    "logo"
official biotech "https://www.biotechvisioncare.com" "logo"

echo "--- done; results in $LOG ---"
