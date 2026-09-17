#!/bin/bash
# Task 12 — header/footer/doctors captures for the logo + credential change.
# Usage: p12-capture.sh <label> [width ...]
LABEL="${1:?label required}"
shift
WIDTHS=("$@")
[ ${#WIDTHS[@]} -eq 0 ] && WIDTHS=(360 1280)
AB="agent-browser"
mkdir -p qa
$AB close >/dev/null 2>&1 || true
for W in "${WIDTHS[@]}"; do
  $AB set viewport "$W" 800
  $AB open http://localhost:3000
  $AB wait --load networkidle
  $AB wait 4600              # Task 8 auto-popup fires ~4s
  $AB press Escape           # close it; session suppression then active
  $AB wait 600
  $AB screenshot "qa/p12-${LABEL}-header-${W}.png"
  # Dr. Shruti's card, centered
  $AB eval "(() => { const els=[...document.querySelectorAll('article h4')]; const el=els.find(e=>/Shruti/i.test(e.textContent)); if(el) el.scrollIntoView({block:'center'}); return !!el; })()" >/dev/null
  $AB wait 900
  $AB screenshot "qa/p12-${LABEL}-doctors-${W}.png"
  # footer
  $AB eval "window.scrollTo(0, document.body.scrollHeight)" >/dev/null
  $AB wait 900
  $AB screenshot "qa/p12-${LABEL}-footer-${W}.png"
  echo "done width $W"
done
echo "captures complete: $LABEL"
