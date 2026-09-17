#!/bin/bash
# Task 12 — programmatic verification across the six approved widths.
set -u
AB="agent-browser"
FAIL=0
say() { echo "== $*"; }
chk() { # chk <name> <ok>
  if [ "$2" = "1" ]; then say "PASS $1"; else say "FAIL $1"; FAIL=1; fi
}

$AB close >/dev/null 2>&1 || true

CRED='B.D.S. — Manipal College of Dental Sciences (MCODS), Mangalore'

for W in 360 390 412 768 1280 1440; do
  $AB set viewport "$W" 800
  $AB open http://localhost:3000
  $AB wait --load networkidle
  $AB wait 4600
  $AB press Escape
  $AB wait 500

  R="$($AB eval "JSON.stringify((() => {
    const noBias = s => s.replace(/\\s+/g,' ').trim();
    const himg = document.querySelector('header a[href=\"#top\"] img');
    const fimg = document.querySelector('footer img');
    const shruti = [...document.querySelectorAll('article')].find(a=>/Shruti/i.test(a.textContent));
    const cred = shruti ? [...shruti.querySelectorAll('li')].map(li=>noBias(li.textContent)).find(tx=>/B\\.D\\.S\\./.test(tx)) : null;
    const hr = himg.getBoundingClientRect(), fr = fimg.getBoundingClientRect();
    return {
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      hLogo: {w:+hr.width.toFixed(1), h:+hr.height.toFixed(1), aspect:+(hr.width/hr.height).toFixed(3)},
      fLogo: {w:+fr.width.toFixed(1), h:+fr.height.toFixed(1), aspect:+(fr.width/fr.height).toFixed(3)},
      alt: himg.alt,
      credExact: cred === '$CRED',
      cred: cred || null,
      burger: !!document.querySelector('header button[aria-controls=mobile-menu]'),
      cta: !!document.querySelector('header button[class*=bg-white]')
    };
  })())")"
  echo "-- width $W: $R"

  echo "$R" | rg -q '"overflowX":false' ; chk "w$W no horizontal overflow" $?
  echo "$R" | rg -q '"aspect":6\.2[0-9]'  ; chk "w$W header logo aspect intact" $?
  echo "$R" | rg -q '"credExact":true'    ; chk "w$W Shruti BDS credential exact" $?
  echo "$R" | rg -q '"alt":"Vishvaas Clinic — The Opinion We Can Trust"'; chk "w$W tagline in alt exact" $?
done

# console + network sanity on a fresh load
$AB open http://localhost:3000 >/dev/null
$AB wait --load networkidle >/dev/null
$AB wait 4600 >/dev/null
$AB press Escape >/dev/null
$AB wait 500 >/dev/null
CONS="$($AB console 2>/dev/null | rg -ci 'error|warn' || echo 0)"
NET="$($AB network requests 2>/dev/null | rg -c ' (4[0-9][0-9]|5[0-9][0-9]) ' || echo 0)"
chk "console clean (hits=$CONS)" $([ "$CONS" = "0" ] && echo 1 || echo 0)
chk "no 4xx/5xx (hits=$NET)" $([ "$NET" = "0" ] && echo 1 || echo 0)

echo "----"
[ "$FAIL" = "0" ] && echo "ALL CHECKS PASSED" || echo "SOME CHECKS FAILED"
exit $FAIL
