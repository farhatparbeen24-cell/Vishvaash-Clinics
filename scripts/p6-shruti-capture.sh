#!/usr/bin/env bash
# P6 (Shruti credentials correction) — capture per-doctor card baselines.
# Usage: p6-shruti-capture.sh before|after
# For each of the 4 doctor cards (#doctor section, DOM order Himanshu,
# Shruti, Shalabh, Akshay): records bounding rect + ctaTop + innerText at
# screenshot time, plus a viewport screenshot (card top anchored at y=80).
set -euo pipefail

SUFFIX="${1:?usage: p6-shruti-capture.sh before|after}"
QA=/home/z/my-project/download/qa
RECTS="/tmp/p6-rects-${SUFFIX}.jsonl"
: > "$RECTS"

agent-browser set viewport 1280 1600
agent-browser open http://localhost:3000
agent-browser wait --load networkidle
# Warm pass: scroll through the doctors section so lazy portraits + reveals settle.
agent-browser eval "document.querySelector('#doctor').scrollIntoView({block:'start'})"
agent-browser wait 1200
agent-browser eval "window.scrollBy(0, 900)"
agent-browser wait 800
agent-browser eval "window.scrollBy(0, 900)"
agent-browser wait 800
agent-browser eval "window.scrollBy(0, 900)"
agent-browser wait 800

# Full doctors section at 1280 (viewport shot at section top).
agent-browser eval "document.querySelector('#doctor').scrollIntoView({block:'start'})"
agent-browser wait 1100
agent-browser screenshot "${QA}/p6-${SUFFIX}-doctors-1280.png"

# Per-card: scroll (card top at viewport y=80), record rect+ctaTop+text, screenshot.
for i in 0 1 2 3; do
  agent-browser eval "(() => {
    const a = document.querySelectorAll('#doctor ul li article')[${i}];
    const top = a.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top - 80);
    return top;
  })()" > /dev/null
  agent-browser wait 1100
  agent-browser eval "(() => {
    const a = document.querySelectorAll('#doctor ul li article')[${i}];
    const r = a.getBoundingClientRect();
    const btn = a.querySelector('button');
    const br = btn ? btn.getBoundingClientRect() : null;
    return JSON.stringify({
      i: ${i},
      name: a.querySelector('h4')?.textContent,
      rect: { x: r.x, y: r.y, w: r.width, h: r.height },
      ctaTop: br ? br.y : null,
      text: a.innerText
    });
  })()" >> "$RECTS"
  echo "" >> "$RECTS"
  agent-browser screenshot "${QA}/p6-${SUFFIX}-card${i}-1280.png"
done

python3 - "$SUFFIX" "$RECTS" <<'PYEOF'
import json, sys
suffix, rects_path = sys.argv[1], sys.argv[2]
cards = []
for line in open(rects_path):
    line = line.strip()
    if not line:
        continue
    inner = json.loads(line)          # eval returns a JSON string
    if isinstance(inner, str):
        inner = json.loads(inner)
    cards.append(inner)
out = f"/tmp/p6-cards-{suffix}.json"
json.dump(cards, open(out, "w"), indent=1, ensure_ascii=False)
print(f"saved {len(cards)} cards -> {out}")
for c in cards:
    print(f"  [{c['i']}] {c['name']} rect_y={c['rect']['y']:.0f} h={c['rect']['h']:.0f} ctaTop={c['ctaTop']:.0f}")
PYEOF
echo "capture ${SUFFIX} done"
