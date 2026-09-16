#!/usr/bin/env bash
# Post-hydration-incident regression: footer legal dialogs, HI toggle, booking CTA.
set -uo pipefail
URL=http://localhost:3000

step() { echo "--- $1"; }

agent-browser open "$URL" >/dev/null 2>&1
agent-browser eval "(() => { try { localStorage.clear(); sessionStorage.clear(); } catch(e){} return 'ok'; })()" >/dev/null 2>&1
agent-browser open "$URL" >/dev/null 2>&1
sleep 2.5

step "privacy dialog open"
agent-browser find text "Privacy Policy" click >/dev/null 2>&1
sleep 0.8
agent-browser eval 'JSON.stringify({
  dlg: !!document.querySelector("[role=dialog]"),
  title: document.querySelector("[role=dialog] h2")?.textContent?.slice(0,60) || null,
  triggerAriaControls: document.querySelector("footer [data-slot=dialog-trigger]")?.getAttribute("aria-controls") || null,
  contentId: document.querySelector("[role=dialog]")?.id || null
})'

step "escape closes privacy"
agent-browser press Escape >/dev/null 2>&1; sleep 0.5
agent-browser eval 'JSON.stringify({ dlgGone: !document.querySelector("[role=dialog]") })'

step "terms dialog open"
agent-browser find text "Terms & Medical Disclaimer" click >/dev/null 2>&1
sleep 0.8
agent-browser eval 'JSON.stringify({ dlg: !!document.querySelector("[role=dialog]"), title: document.querySelector("[role=dialog] h2")?.textContent?.slice(0,60) || null })'
agent-browser press Escape >/dev/null 2>&1; sleep 0.4

step "HI toggle + footer labels"
agent-browser find role button "हिंदी" click >/dev/null 2>&1 || agent-browser find text "हिंदी" click >/dev/null 2>&1
sleep 1.2
agent-browser eval 'JSON.stringify({ htmlLang: document.documentElement.lang, footerButtons: [...document.querySelectorAll("footer [data-slot=dialog-trigger]")].map(b => b.textContent) })'

step "HI booking modal via header CTA"
agent-browser eval '(() => { const btns=[...document.querySelectorAll("button, a")].filter(b => /बुक|appointment/i.test(b.textContent||"") && b.offsetParent !== null); const b=btns.find(x => x.closest("header")) || btns[0]; if (b) { b.click(); return b.textContent.trim().slice(0,40); } return null; })()' >/dev/null 2>&1
sleep 1.2
agent-browser eval 'JSON.stringify({ dlg: !!document.querySelector("[role=dialog]"), heading: document.querySelector("#appointment-modal-title")?.textContent || document.querySelector("[role=dialog] h2")?.textContent || null })'
agent-browser press Escape >/dev/null 2>&1; sleep 0.5

step "back to EN"
agent-browser find role button "EN" click >/dev/null 2>&1 || agent-browser find text "English" click >/dev/null 2>&1
sleep 1
agent-browser eval 'JSON.stringify({ htmlLang: document.documentElement.lang })'

step "console / errors"
agent-browser console 2>&1 | grep -v "Download the React DevTools\|HMR connected" | head -6
agent-browser errors 2>&1 | head -4
echo "== done"
