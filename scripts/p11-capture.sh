#!/usr/bin/env bash
# Task 11 — capture appointment-modal screenshots (before|after) at mobile
# widths via the AUTO-OPEN flow, plus desktop/tablet reference shots.
# Usage: bash scripts/p11-capture.sh before|after
set -uo pipefail
PHASE="${1:?usage: p11-capture.sh before|after}"
URL=http://localhost:3000
DIR=/home/z/my-project/qa
mkdir -p "$DIR"

shot() { agent-browser screenshot "$DIR/p11-${PHASE}-$1.png" >/dev/null 2>&1; echo "  saved p11-${PHASE}-$1.png"; }

load_modal() { # $1 = width, $2 = height — fresh load, auto-popup opens itself
  agent-browser set viewport "$1" "$2" >/dev/null 2>&1
  agent-browser open "$URL" >/dev/null 2>&1
  agent-browser eval "(() => { try { localStorage.clear(); sessionStorage.clear(); } catch(e){} return 'ok'; })()" >/dev/null 2>&1
  agent-browser open "$URL" >/dev/null 2>&1
  agent-browser wait 6800 >/dev/null 2>&1
}

echo "=== p11 capture: $PHASE ==="
for W in 360 390 412 480; do
  load_modal "$W" 780
  shot "mob${W}"
done

# Desktop / tablet reference (modal opened via header CTA, storage irrelevant)
agent-browser set viewport 1280 900 >/dev/null 2>&1
agent-browser open "$URL" >/dev/null 2>&1
agent-browser eval "(() => { try { localStorage.setItem('vishvaas:auto-appointment:shown-at', String(Date.now())); } catch(e){} return 'ok'; })()" >/dev/null 2>&1
agent-browser reload >/dev/null 2>&1; sleep 2.5
agent-browser eval '(() => { const b=[...document.querySelectorAll("button,a")].find(x=>/book appointment/i.test(x.textContent||"") && x.offsetParent!==null); b?.click(); return "opened"; })()' >/dev/null 2>&1
sleep 1.2; shot "desktop1280"

agent-browser set viewport 768 1024 >/dev/null 2>&1; sleep 1; shot "tablet768"
agent-browser set viewport 1280 900 >/dev/null 2>&1
echo "=== done ==="
