#!/usr/bin/env bash
# Find official domains for remaining brands via z-ai web_search, then try to
# fetch a logo asset from each domain.
set -u
OUT=/home/z/my-project/assets-brands
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36"

search() { # search <query>
  z-ai function -n web_search -a "{\"query\": \"$1\", \"num\": 6}" 2>/dev/null \
   | sed -n '/^\[/,/^\]/p' \
   | python3 -c "import json,sys
try:
  d=json.load(sys.stdin)
  seen=[]
  for r in d:
    h=r.get('host_name','')
    if h and h not in seen and 'indiamart' not in h and 'linkedin' not in h and 'facebook' not in h and 'wikipedia' not in h and 'justdial' not in h:
      seen.append(h)
  print(' '.join(seen[:4]))
except Exception: pass"
}

fetchlogo() { # fetchlogo <slug> <homepage>
  local slug="$1" page="$2"
  local html="$OUT/_$slug.html"
  curl -sL --max-time 20 -A "$UA" -o "$html" "$page" 2>/dev/null
  [ -s "$html" ] || { echo "FETCHFAIL $slug $page"; return; }
  # logo candidates: img src/data-src/srcset + og:image + favicon high-res
  grep -oiE '(src|data-src)="[^"]+"' "$html" | sed 's/^[a-z-]*="//;s/"$//' \
    | grep -iE 'logo|brand' | grep -viE 'sprite|data:|footer-logo' | head -3 > "$OUT/_$slug.cands"
  grep -oiE 'property="og:image" content="[^"]+"' "$html" | sed 's/.*content="//;s/"$//' | head -1 >> "$OUT/_$slug.cands"
  echo "CANDS $slug $page:"; sed 's/^/   /' "$OUT/_$slug.cands"
}

echo "=== searches ==="
for pair in \
  "appasamy|Appasamy Associates appasamy.com ophthalmic" \
  "biotech|Biotech Vision Care Ahmedabad IOL official website" \
  "oertli|Oertli surgical instruments Switzerland oertli.com" \
  "axialis|Axialis ophthalmic equipment official" \
  "headway|Headway eye drops pharmaceutical India official" \
  "vibgyor|Vibgyor pharmaceutical ophthalmic India official" \
  "neomedix|Neomedix pharmaceutical official" \
  "raymed|Raymed pharmaceutical ophthalmic India official" \
  "care|Care ophthalmic pharmaceutical India brand official" \
; do
  slug="${pair%%|*}"; q="${pair#*|}"
  echo "--- $slug: $q"
  search "$q"
done
