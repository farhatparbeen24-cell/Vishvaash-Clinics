#!/usr/bin/env bash
# Post-restart verification: clean hydration + Task 8 auto-popup behavior intact.
set -uo pipefail
URL=http://localhost:3000

agent-browser open "$URL" >/dev/null 2>&1
agent-browser eval "(() => { try { localStorage.clear(); sessionStorage.clear(); } catch(e){} return 'cleared'; })()" >/dev/null 2>&1
agent-browser open "$URL" >/dev/null 2>&1

agent-browser eval '(() => {
  const nav = performance.getEntriesByType("navigation")[0];
  window.__loadAt = nav ? nav.loadEventEnd : null;
  window.__dialogAt = null;
  window.__obs = new MutationObserver(() => {
    if (window.__dialogAt === null && document.querySelector("[role=dialog]")) {
      window.__dialogAt = performance.now();
      window.__obs.disconnect();
    }
  });
  window.__obs.observe(document.documentElement, { childList: true, subtree: true });
  return "observer on";
})()' >/dev/null 2>&1

agent-browser wait 6500 >/dev/null 2>&1
echo "-- auto-popup state:"
agent-browser eval '(() => {
  const dlg = document.querySelector("[role=dialog]");
  const delta = (window.__dialogAt != null && window.__loadAt) ? Math.round(window.__dialogAt - window.__loadAt) : null;
  return JSON.stringify({
    opened: !!dlg,
    msAfterLoad: delta,
    heading: dlg?.querySelector("#appointment-modal-title")?.textContent || null,
    supportOk: dlg ? dlg.innerText.includes("Schedule your consultation at Vishvaas Clinic.") : null,
    sessionFlag: sessionStorage.getItem("vishvaas:auto-appointment:shown-at") !== null
  });
})()'

echo "-- close, reload, expect suppressed:"
agent-browser eval '(() => { const b=document.querySelector("[role=dialog] button[aria-label]"); if(b) b.click(); return "closed"; })()' >/dev/null 2>&1
sleep 0.6
agent-browser open "$URL" >/dev/null 2>&1
agent-browser wait 6000 >/dev/null 2>&1
agent-browser eval 'JSON.stringify({ reopenedAuto: !!document.querySelector("[role=dialog]"), sessionFlagStill: sessionStorage.getItem("vishvaas:auto-appointment:shown-at") !== null })'

echo "-- manual CTA still opens while suppressed:"
agent-browser eval '(() => { const b=[...document.querySelectorAll("header button, header a")].find(x => /book/i.test(x.textContent||"")); if(b){b.click(); return b.textContent.trim().slice(0,30);} return "no-cta"; })()' >/dev/null 2>&1
sleep 1
agent-browser eval 'JSON.stringify({ manualOpen: !!document.querySelector("[role=dialog]"), captcha: !!document.querySelector("[role=dialog] input[inputmode=numeric]") })'
agent-browser press Escape >/dev/null 2>&1

echo "-- console/errors after all:"
agent-browser console 2>&1 | grep -v "Download the React DevTools\|HMR connected" | head -6
agent-browser errors 2>&1 | head -3
echo "== done"
