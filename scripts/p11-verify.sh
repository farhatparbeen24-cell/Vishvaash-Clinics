#!/usr/bin/env bash
# Task 11 — mobile bottom-sheet functional verification (≤480px redesign).
# v2: un-escapes agent-browser JSON output, delta-based bg-scroll test,
#     HI toggle via mobile hamburger menu, submit diagnostics.
set -uo pipefail
URL=http://localhost:3000
PASS=0; FAIL=0
ok()   { echo "  [PASS] $1"; PASS=$((PASS+1)); }
bad()  { echo "  [FAIL] $1"; FAIL=$((FAIL+1)); }
step() { echo "--- $1"; }
ev()   { agent-browser eval "$1" | tr -d '\\'; }
evc()  { agent-browser eval "$1" | tr -d '\\' | tr -d ' \n'; }  # compact JSON for key-asserts

load_auto() { # $1,$2 = viewport — fresh load, waits for auto-popup
  agent-browser set viewport "$1" "$2" >/dev/null 2>&1
  agent-browser open "$URL" >/dev/null 2>&1
  agent-browser eval "(() => { try { localStorage.clear(); sessionStorage.clear(); } catch(e){} return 'ok'; })()" >/dev/null 2>&1
  agent-browser open "$URL" >/dev/null 2>&1
  agent-browser wait 6800 >/dev/null 2>&1
}

layout_checks() { # $1 = width label — modal must be open
  local R
  R=$(evc '(() => {
    const dlg = document.querySelector("[role=dialog]");
    if (!dlg) return {open:false};
    const d = dlg.getBoundingClientRect();
    const cs = getComputedStyle(dlg);
    const sc = dlg.querySelector(".nice-scroll");
    const scs = getComputedStyle(sc);
    const handle = dlg.querySelector("div[aria-hidden]");
    const handleVis = !!handle && handle.getBoundingClientRect().height > 0 && getComputedStyle(handle).display !== "none";
    const sticky = [...dlg.querySelectorAll("div")].find(x => getComputedStyle(x).position === "sticky");
    const st = sticky ? sticky.getBoundingClientRect() : null;
    const name = document.getElementById("field-name");
    const nr = name ? name.getBoundingClientRect() : null;
    const nameVisible = !!nr && nr.top >= d.top - 1 && (nr.bottom <= (st ? st.top : d.bottom) + 1);
    const nameInFirstView = !!nr && nr.top >= 0 && nr.bottom <= window.innerHeight;
    const grid = dlg.querySelector("[role=group] > div");
    const gs = grid ? getComputedStyle(grid) : null;
    const imgs = grid ? grid.querySelectorAll("img").length : 0;
    const pressed = grid ? [...grid.querySelectorAll("button")].filter(b => b.getAttribute("aria-pressed") === "true").length : 0;
    return {open:true, sheetH: Math.round(d.height), maxH: cs.maxHeight,
      within85: d.height <= window.innerHeight * 0.851 && d.height >= window.innerHeight * 0.79,
      handleVis, stickyPos: sticky ? getComputedStyle(sticky).position : null,
      pinnedFlush: !!st && Math.abs(st.bottom - d.bottom) < 3,
      safePb: sticky ? getComputedStyle(sticky).paddingBottom : null,
      nameVisible, nameInFirstView, nameY: nr ? Math.round(nr.top) : null,
      selectorDisplay: gs ? gs.display : null,
      selectorCols: gs ? gs.gridTemplateColumns.split(" ").length : 0,
      selectorPhotos: imgs, exactlyOnePressed: pressed === 1,
      overflowX: sc ? sc.scrollWidth - sc.clientWidth : -1,
      overscroll: scs.overscrollBehavior,
      bodyLocked: getComputedStyle(document.body).overflow === "hidden" && getComputedStyle(document.documentElement).overflow === "hidden"};
  })()')
  echo "  $R"
  echo "$R" | grep -q '"open":true' && ok "$1 modal auto-opened" || bad "$1 modal NOT open"
  echo "$R" | grep -q '"within85":true' && ok "$1 sheet height within 80–85dvh ($(echo "$R" | grep -o '"sheetH":[0-9]*' | cut -d: -f2)px of $(agent-browser eval 'window.innerHeight'))" || bad "$1 sheet height out of 80–85dvh band"
  echo "$R" | grep -q '"handleVis":true' && ok "$1 drag handle visible at sheet top" || bad "$1 drag handle missing"
  echo "$R" | grep -q '"pinnedFlush":true' && ok "$1 submit bar pinned flush to sheet bottom (safe-area pb $(echo "$R" | grep -o '"safePb":"[^"]*"' | cut -d'"' -f4))" || bad "$1 submit bar not flush"
  echo "$R" | grep -q '"nameVisible":true' && ok "$1 Patient Name fully visible above submit bar" || bad "$1 Patient Name hidden/cropped"
  echo "$R" | grep -q '"nameInFirstView":true' && ok "$1 Patient Name inside first viewport (top=$(echo "$R" | grep -o '"nameY":[0-9]*' | cut -d: -f2)px)" || bad "$1 Patient Name below the fold"
  echo "$R" | grep -q '"selectorDisplay":"grid"' && echo "$R" | grep -q '"selectorCols":2' && ok "$1 doctor selector = 2-col compact grid" || bad "$1 selector not 2-col grid"
  echo "$R" | grep -q '"selectorPhotos":4' && ok "$1 all four doctor photos present in selector" || bad "$1 selector photos != 4"
  echo "$R" | grep -q '"exactlyOnePressed":true' && ok "$1 exactly one doctor preselected" || bad "$1 preselection broken"
  echo "$R" | grep -q '"overflowX":0' && ok "$1 no horizontal overflow inside sheet" || bad "$1 sheet horizontal overflow"
  echo "$R" | grep -q '"overscroll":"contain"' && ok "$1 momentum scroll contained (page locked)" || bad "$1 overscroll not contained"
  echo "$R" | grep -q '"bodyLocked":true' && ok "$1 background scroll locked (html+body)" || bad "$1 background not locked"
}

echo "=== p11 mobile bottom-sheet verification v2 ==="

for W in 360 390 412 480; do
  step "width ${W}px — auto-open + layout"
  load_auto "$W" 780
  layout_checks "$W"
done

step "width 360px — background page really cannot scroll (real wheel input)"
Y1=$(ev 'window.scrollY' | grep -o '[0-9-]*' | head -1)
agent-browser mouse wheel 400 >/dev/null 2>&1; sleep 0.6
Y2=$(ev 'window.scrollY' | grep -o '[0-9-]*' | head -1)
[ "$Y1" == "$Y2" ] && ok "real wheel input does not move the page behind the sheet ($Y1 → $Y2)" || bad "page scrolled behind sheet ($Y1 → $Y2)"

step "width 360px — all four doctors selectable, services follow doctor"
for D in 1 2 3 4; do
  ev "(() => { const b=[...document.querySelectorAll('[role=group] > div button')][$D-1]; b.click(); return b.textContent.trim().slice(0,26); })()" >/dev/null 2>&1
  sleep 0.4
  P=$(evc '(() => { const bs=[...document.querySelectorAll("[role=group] > div button")]; return {idx: bs.findIndex(b=>b.getAttribute("aria-pressed")==="true"), svcOpts: document.querySelectorAll("#field-service option").length - 1}; })()')
  echo "$P" | grep -q "\"idx\":$((D-1))" && ok "doctor $D selectable (services: $(echo "$P" | grep -o '"svcOpts":[0-9]*' | cut -d: -f2))" || bad "doctor $D selection failed ($P)"
done
SV=$(ev 'document.getElementById("field-service").value' | tr -d '"')
[ -z "$SV" ] && ok "doctor switch cleared only the service field (Task 6 behaviour intact)" || bad "service value survived doctor switch"

step "width 360px — full form + CAPTCHA + WhatsApp submission"
agent-browser fill "#field-name" "Aarav Sharma" >/dev/null 2>&1
agent-browser fill "#field-phone" "9876543210" >/dev/null 2>&1
# Date inputs: Puppeteer fill() does not commit values on type=date — use the
# native value setter + input/change events so React onChange fires.
agent-browser eval '(() => { const el = document.getElementById("field-date"); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set; set.call(el, "2026-09-25"); el.dispatchEvent(new Event("input", {bubbles:true})); el.dispatchEvent(new Event("change", {bubbles:true})); return el.value; })()' >/dev/null 2>&1
TV=$(ev 'document.querySelector("#field-time option:nth-child(2)")?.value' | tr -d '"')
agent-browser select "#field-time" "$TV" >/dev/null 2>&1
SE=$(ev 'document.querySelector("#field-service option:nth-child(2)")?.value' | tr -d '"')
agent-browser select "#field-service" "$SE" >/dev/null 2>&1
agent-browser check "#field-consent" >/dev/null 2>&1
CA=$(evc '(() => { const t=[...document.querySelectorAll("[role=dialog] span")].map(s=>s.textContent).find(x=>/\d\s*[+−]\s*\d/.test(x||"")); const m=t.match(/(\d+)\s*([+−])\s*(\d+)/); return m ? (m[2]==="+" ? +m[1]+ +m[3] : +m[1]-+m[3]) : "?"; })()' | grep -o '[0-9]*' | head -1)
agent-browser fill "#field-captcha" "$CA" >/dev/null 2>&1
ev '(() => { window.__waUrl = null; window.open = (u) => { window.__waUrl = u; return null; }; return "stub on"; })()' >/dev/null 2>&1
agent-browser eval 'document.querySelector("[role=dialog] button[type=submit]").click()' >/dev/null 2>&1
sleep 2
WA=$(evc '({url: window.__waUrl, vals: {n: document.getElementById("field-name").value, p: document.getElementById("field-phone").value, d: document.getElementById("field-date").value, t: document.getElementById("field-time").value, s: document.getElementById("field-service").value, c: document.getElementById("field-consent").checked, cap: document.getElementById("field-captcha").value}, alerts: [...document.querySelectorAll("[role=dialog] [role=alert]")].map(e=>e.textContent), sent: !!document.querySelector("[role=dialog] [role=status]"), marked: localStorage.getItem("vishvaas:appointment:submitted-at") !== null})')
echo "  $WA"
echo "$WA" | grep -q 'wa.me/917252991991' && ok "WhatsApp deep link → clinic number 917252991991" || bad "submission failed — state: $WA"
echo "$WA" | grep -q 'Aarav' && ok "patient data carried into the message" || bad "patient name missing from link"
echo "$WA" | grep -q '"sent":true' && ok "post-submit status shown" || bad "no post-submit status"
echo "$WA" | grep -q '"marked":true' && ok "30-day suppression timestamp written" || bad "submitted-at not written"

step "width 360px — pinned bar never covers CAPTCHA at scroll end"
agent-browser eval '(() => { const sc=document.querySelector("[role=dialog] .nice-scroll"); sc.scrollTop = sc.scrollHeight; return "at end"; })()' >/dev/null 2>&1; sleep 0.4
COV=$(evc '(() => { const c=document.getElementById("field-captcha").getBoundingClientRect(); const sticky=[...document.querySelectorAll("[role=dialog] div")].find(x=>getComputedStyle(x).position==="sticky").getBoundingClientRect(); return {captchaBottom: Math.round(c.bottom), stickyTop: Math.round(sticky.top), clear: c.bottom <= sticky.top + 1}; })()')
echo "$COV" | grep -q '"clear":true' && ok "CAPTCHA fully above pinned bar at scroll end" || bad "sticky bar covers CAPTCHA ($COV)"

step "width 360px — Escape close + lock release"
agent-browser press Escape >/dev/null 2>&1; sleep 0.6
ev '!document.querySelector("[role=dialog]")' 2>/dev/null | grep -q true && ok "Escape closes sheet" || bad "Escape did not close"
ev 'getComputedStyle(document.body).overflow' | grep -q hidden && bad "scroll lock NOT released after close" || ok "scroll lock released after close"

step "width 390px — manual open via header CTA"
load_auto 390 780 >/dev/null 2>&1
agent-browser press Escape >/dev/null 2>&1; sleep 0.6
ev '(() => { const b=[...document.querySelectorAll("button,a")].find(x=>/book appointment/i.test(x.textContent||"") && x.offsetParent!==null); b?.click(); return "clicked"; })()' >/dev/null 2>&1
sleep 1.2
ev '!!document.querySelector("[role=dialog]")' 2>/dev/null | grep -q true && ok "manual CTA opens the same bottom sheet at 390px" || bad "manual open failed at 390px"
ev 'document.querySelector("[role=dialog] h2")?.textContent' | grep -q "Book an Appointment" && ok "heading intact on manual open" || bad "heading wrong"
agent-browser press Escape >/dev/null 2>&1; sleep 0.5

step "width 390px — HI toggle via mobile menu, sheet compact in Hindi"
agent-browser eval '(() => { const b=[...document.querySelectorAll("header button")].find(x=>/open menu/i.test(x.getAttribute("aria-label")||"")); b?.click(); return "menu"; })()' >/dev/null 2>&1
sleep 0.8
agent-browser eval '(() => { const b=[...document.querySelectorAll("#mobile-menu button")].find(x=>x.textContent.trim()==="हिंदी"); b?.click(); return "hi"; })()' >/dev/null 2>&1
sleep 1.2
agent-browser eval '(() => { const b=[...document.querySelectorAll("header button")].find(x=>/close menu|बंद करें/i.test(x.getAttribute("aria-label")||"")); b?.click(); return "closed"; })()' >/dev/null 2>&1
sleep 0.6
evc '(() => { const b=[...document.querySelectorAll("button,a")].find(x=>/appointment|अपॉइंटमेंट/i.test(x.textContent||"") && x.offsetParent!==null && (x.closest("header")||x.closest("#mobile-menu"))); b?.click(); return "hi-open"; })()' >/dev/null 2>&1
sleep 1.2
H=$(evc '({lang: document.documentElement.lang, heading: document.querySelector("[role=dialog] h2")?.textContent || null, sheetH: (() => { const dlg=document.querySelector("[role=dialog]"); return dlg ? Math.round(dlg.getBoundingClientRect().height) : null; })(), within85: (() => { const dlg=document.querySelector("[role=dialog]"); return dlg ? dlg.getBoundingClientRect().height <= window.innerHeight*0.851 : false; })(), grid: (() => { const g=document.querySelector("[role=dialog] [role=group] > div"); return g ? getComputedStyle(g).display : null; })()})')
echo "  $H"
echo "$H" | grep -q '"lang":"hi-IN"' && ok "HI locale active" || bad "HI not active ($H)"
echo "$H" | grep -q 'अपॉइंटमेंट' && ok "HI heading rendered ($(echo "$H" | grep -o 'heading:"[^"]*"' | cut -d'"' -f2 | head -c 40))" || bad "HI heading missing"
echo "$H" | grep -q '"within85":true' && ok "HI sheet still within 85dvh" || bad "HI sheet height broke"
echo "$H" | grep -q '"grid":"grid"' && ok "HI selector still 2-col grid" || bad "HI selector broke"

step "focus trap spot-check (360px)"
load_auto 360 780 >/dev/null 2>&1
agent-browser eval 'document.querySelector("[role=dialog] button[aria-label]").focus(); "focused"' >/dev/null 2>&1
agent-browser press Tab >/dev/null 2>&1; agent-browser press Tab >/dev/null 2>&1; agent-browser press Tab >/dev/null 2>&1
IN=$(evc '({inside: !!document.activeElement.closest("[role=dialog]"), tag: document.activeElement.tagName})')
echo "$IN" | grep -q '"inside":true' && ok "Tab stays trapped inside sheet" || bad "focus escaped sheet ($IN)"

agent-browser set viewport 1280 900 >/dev/null 2>&1
echo "=== RESULT: PASS=$PASS FAIL=$FAIL ==="
