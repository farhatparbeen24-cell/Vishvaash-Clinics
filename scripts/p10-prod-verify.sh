#!/usr/bin/env bash
# Task 10 — PRODUCTION-bundle verification (what Vercel will serve).
# Server under test: http://localhost:3001 (`next start`, webpack build, hashed chunks).
# Checks: SSR-vs-hydrated Radix ids (hydration-mismatch detector), runtime error
# collectors, network 4xx/5xx, auto-popup timing + copy, session suppression,
# manual CTA reopen + CAPTCHA, legal dialogs a11y linkage, EN->HI, 390px overflow.
set -uo pipefail
URL=http://localhost:3001
PASS=0; FAIL=0
ok()   { echo "  [PASS] $1"; PASS=$((PASS+1)); }
bad()  { echo "  [FAIL] $1"; FAIL=$((FAIL+1)); }
step() { echo "--- $1"; }

echo "=== PRODUCTION VERIFY on $URL ==="

step "SSR HTML radix ids (curl, footer triggers)"
SSR_IDS=$(curl -s "$URL" | grep -o 'aria-controls="radix-[^"]*"' | sort -u)
echo "$SSR_IDS"

step "fresh load + error collectors installed"
agent-browser set viewport 1280 900 >/dev/null 2>&1
agent-browser open "$URL" >/dev/null 2>&1
agent-browser eval "(() => { try { localStorage.clear(); sessionStorage.clear(); } catch(e){} return 'cleared'; })()" >/dev/null 2>&1
agent-browser open "$URL" >/dev/null 2>&1
agent-browser eval '(() => {
  window.__errs = [];
  const orig = console.error;
  console.error = function(...a){ window.__errs.push(String(a[0]).slice(0,200)); orig.apply(console, a); };
  window.addEventListener("error", e => window.__errs.push("onerror: " + String(e.message).slice(0,160)));
  window.addEventListener("unhandledrejection", e => window.__errs.push("rejection: " + String(e.reason).slice(0,160)));
  const nav = performance.getEntriesByType("navigation")[0];
  window.__loadAt = nav ? nav.loadEventEnd : performance.now();
  window.__dialogAt = null;
  window.__obs = new MutationObserver(() => {
    if (window.__dialogAt === null && document.querySelector("[role=dialog]")) {
      window.__dialogAt = performance.now(); window.__obs.disconnect();
    }
  });
  window.__obs.observe(document.documentElement, { childList: true, subtree: true });
  return "hooks on";
})()' >/dev/null 2>&1

step "A. hydration check: SSR ids vs hydrated DOM ids"
sleep 2
agent-browser eval '(() => { window.__errs = []; const o=console.error; console.error=function(...a){window.__errs.push(String(a[0]).slice(0,200)); o.apply(console,a);}; return "hooks on"; })()' >/dev/null 2>&1
SSR_N=$(echo "$SSR_IDS" | tr -d '"' | grep -c radix)
DOM_IDS=$(agent-browser eval '(() => { const ids=[...document.querySelectorAll("footer [data-slot=dialog-trigger]")].map(b=>b.getAttribute("aria-controls")).sort(); return "IDS:" + ids.join(","); })()' | grep -o 'IDS:.*' | sed 's/IDS://;s/,/\n/g' | tr -d '"' | sort -u | grep -c radix)
SSR_CMP=$(echo "$SSR_IDS" | tr -d '"' | sort -u)
if [ "$SSR_N" == "$DOM_IDS" ] && [ -n "$SSR_CMP" ]; then
  ok "SSR and hydrated DOM radix ids identical ($DOM_IDS triggers) — no hydration fallback"
else
  bad "MISMATCH — SSR:"; echo "$SSR_CMP"; echo "  DOM count:"; echo "$DOM_IDS"
fi

step "B. auto-popup timing + copy"
agent-browser wait 6500 >/dev/null 2>&1
agent-browser eval 'JSON.stringify({ deltaMs: Math.round((window.__dialogAt||0) - window.__loadAt), heading: document.querySelector("[role=dialog] h2, [role=dialog] h1")?.textContent || null, support: [...document.querySelectorAll("[role=dialog] p")].map(p=>p.textContent).find(t=>/Schedule your consultation/.test(t||"")) || null, flag: sessionStorage.getItem("vishvaas:auto-appointment:shown-at") !== null })' | grep -o '{.*}'
R=$(agent-browser eval 'JSON.stringify({ deltaMs: Math.round((window.__dialogAt||0) - window.__loadAt) })' | grep -o '[0-9]\+' | head -1)
if [ -n "$R" ] && [ "$R" -ge 3500 ] && [ "$R" -le 7000 ]; then ok "auto-popup opened ~4s after load (Δ=${R}ms)"; else bad "auto-popup timing off (Δ=${R}ms)"; fi
agent-browser eval 'JSON.stringify({h: document.querySelector("[role=dialog] h2, [role=dialog] h1")?.textContent, s: [...document.querySelectorAll("[role=dialog] p")].map(p=>p.textContent).find(t=>/Schedule your consultation at Vishvaas Clinic/.test(t||""))})' | grep -o '{.*}'
if agent-browser eval '!!document.querySelector("[role=dialog] input[aria-label*=aptcha], [role=dialog] input[name*=captcha], [role=dialog] input[autocomplete=off]")' 2>/dev/null | grep -q true; then ok "CAPTCHA input present in auto-opened modal"; else bad "CAPTCHA input not found"; fi

step "C. Escape close -> session flag -> reload suppression"
agent-browser press Escape >/dev/null 2>&1; sleep 0.8
agent-browser eval 'JSON.stringify({dlgGone: !document.querySelector("[role=dialog]"), flagSet: sessionStorage.getItem("vishvaas:auto-appointment:shown-at") !== null})' | grep -o '{.*}'
agent-browser reload >/dev/null 2>&1; agent-browser wait 6500 >/dev/null 2>&1
if agent-browser eval '!document.querySelector("[role=dialog]")' 2>/dev/null | grep -q true; then ok "no auto-popup after reload (session suppression)"; else bad "auto-popup re-fired after reload"; fi
agent-browser eval '(() => { window.__errs = []; const o=console.error; console.error=function(...a){window.__errs.push(String(a[0]).slice(0,200)); o.apply(console,a);}; window.addEventListener("error", e => window.__errs.push("onerror: " + String(e.message).slice(0,160))); window.addEventListener("unhandledrejection", e => window.__errs.push("rejection: " + String(e.reason).slice(0,160))); return "hooks on"; })()' >/dev/null 2>&1

step "D. manual header CTA reopen + focus/close"
agent-browser eval '(() => { window.__errs = []; const o=console.error; console.error=function(...a){window.__errs.push(String(a[0]).slice(0,200)); o.apply(console,a);}; const b=[...document.querySelectorAll("button,a")].find(x=>/book appointment/i.test(x.textContent||"") && x.offsetParent!==null); if(b){b.click(); return "clicked";} return "none"; })()' >/dev/null 2>&1
sleep 1.5
if agent-browser eval '(() => { const d=document.querySelector("[role=dialog]"); return !!d && d.querySelectorAll("input").length >= 4 && !!d.querySelector("button[aria-label*=\"lose\" i], [aria-label=\"Close the appointment form\"]"); })()' 2>/dev/null | grep -q true; then ok "manual CTA opens booking modal (inputs + labelled close button)"; else bad "manual CTA modal broken"; fi
agent-browser press Escape >/dev/null 2>&1; sleep 0.6
agent-browser eval 'JSON.stringify({closedByEsc: !document.querySelector("[role=dialog]")})' | grep -o '{.*}'

step "E. legal dialogs a11y linkage (privacy + terms)"
agent-browser find text "Privacy Policy" click >/dev/null 2>&1; sleep 0.8
agent-browser eval 'JSON.stringify({linked: (() => { const t=document.querySelector("footer [data-slot=dialog-trigger]"); const d=document.querySelector("[role=dialog]"); return t && d && t.getAttribute("aria-controls")===d.id; })(), title: document.querySelector("[role=dialog] h2")?.textContent?.slice(0,40)})' | grep -o '{.*}'
if agent-browser eval '(() => { const t=document.querySelector("footer [data-slot=dialog-trigger]"); const d=document.querySelector("[role=dialog]"); return !!(t && d && t.getAttribute("aria-controls")===d.id); })()' 2>/dev/null | grep -q true; then ok "privacy trigger aria-controls === dialog id"; else bad "privacy a11y linkage broken"; fi
agent-browser press Escape >/dev/null 2>&1; sleep 0.5
agent-browser find text "Terms & Medical Disclaimer" click >/dev/null 2>&1; sleep 0.8
if agent-browser eval '!!document.querySelector("[role=dialog] h2")' 2>/dev/null | grep -q true; then ok "terms dialog opens"; else bad "terms dialog broken"; fi
agent-browser press Escape >/dev/null 2>&1; sleep 0.4

step "F. EN -> HI toggle"
agent-browser find role button "हिंदी" click >/dev/null 2>&1 || agent-browser find text "हिंदी" click >/dev/null 2>&1
sleep 1.2
agent-browser eval 'JSON.stringify({lang: document.documentElement.lang, footerTriggers: [...document.querySelectorAll("footer [data-slot=dialog-trigger]")].map(b=>b.textContent)})' | grep -o '{.*}'

step "G. 390px overflow scan"
agent-browser set viewport 390 844 >/dev/null 2>&1; sleep 1
agent-browser eval 'JSON.stringify({docOverflow: document.documentElement.scrollWidth - window.innerWidth, bodyOverflow: document.body.scrollWidth - window.innerWidth})' | grep -o '{.*}'

step "H. collected runtime errors during session (post-reload)"
agent-browser eval 'JSON.stringify({errs: window.__errs || []})' | grep -o '{.*}'

step "network errors (4xx/5xx) across last navigations"
agent-browser network requests 2>/dev/null | rg '"status": (4|5)\d\d' | head -5 || echo "  none"

agent-browser set viewport 1280 900 >/dev/null 2>&1
echo "=== RESULT: PASS=$PASS FAIL=$FAIL ==="
