#!/usr/bin/env bash
# P7 — auto-popup verification, Part 1: timing + session/30-day suppression.
set -uo pipefail
QA=/home/z/my-project/download/qa
URL=http://localhost:3000

clear_storage() {
  agent-browser eval "(() => { try { localStorage.clear(); sessionStorage.clear(); } catch(e) {} return 'cleared'; })()"
}

inject_observer() {
  agent-browser eval '(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    window.__loadAt = nav ? nav.loadEventEnd : null;
    window.__dialogAt = null;
    window.__instant = !!document.querySelector("[role=dialog]");
    window.__obs = new MutationObserver(() => {
      if (window.__dialogAt === null && document.querySelector("[role=dialog]")) {
        window.__dialogAt = performance.now();
        window.__obs.disconnect();
      }
    });
    window.__obs.observe(document.documentElement, { childList: true, subtree: true });
    return JSON.stringify({ instant: window.__instant, readyState: document.readyState, loadAt: window.__loadAt });
  })()'
}

check_state() {
  agent-browser eval '(() => {
    const dlg = document.querySelector("[role=dialog]");
    const delta = (window.__dialogAt != null && window.__loadAt) ? (window.__dialogAt - window.__loadAt) : null;
    return JSON.stringify({
      instant: window.__instant,
      dialogAppeared: window.__dialogAt != null,
      msAfterLoad: delta === null ? null : Math.round(delta),
      openNow: !!dlg,
      heading: dlg ? dlg.querySelector("#appointment-modal-title")?.textContent : null,
      supportOk: dlg ? dlg.innerText.includes("Schedule your consultation at Vishvaas Clinic.") : null,
      subOk: dlg ? dlg.innerText.includes("Fill out the appointment form") : null,
      sessionFlag: sessionStorage.getItem("vishvaas:auto-appointment:shown-at") !== null,
      submittedAt: localStorage.getItem("vishvaas:appointment:submitted-at")
    });
  })()'
}

echo "════ STAGE A: first-load timing + heading ════"
agent-browser open "$URL" > /dev/null
clear_storage
agent-browser open "$URL" > /dev/null
inject_observer
agent-browser wait 6500
check_state

# Close via the visible X button and confirm the session flag was set on auto-fire.
agent-browser eval '(() => {
  const btn = document.querySelector("[role=dialog] button[aria-label]");
  const label = btn ? btn.getAttribute("aria-label") : null;
  if (btn) btn.click();
  return JSON.stringify({ closeLabel: label });
})()'
agent-browser wait 600
agent-browser eval '(() => JSON.stringify({ openAfterClose: !!document.querySelector("[role=dialog]"), sessionFlag: sessionStorage.getItem("vishvaas:auto-appointment:shown-at") !== null }))()'

echo "════ STAGE B: session suppression after dismiss (reload) ════"
agent-browser open "$URL" > /dev/null
inject_observer
agent-browser wait 6500
check_state

echo "════ STAGE C: fresh session (sessionStorage cleared) auto-opens again ════"
agent-browser eval "(() => { sessionStorage.clear(); return 'session cleared'; })()"
agent-browser open "$URL" > /dev/null
inject_observer
agent-browser wait 6500
check_state

echo "════ STAGE D: successful submit → 30-day suppression (across sessions) ════"
agent-browser eval '(() => {
  const dlg = document.querySelector("[role=dialog]");
  if (!dlg) return "NO_DIALOG";
  const setV = (el, v) => {
    const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : el.tagName === "SELECT" ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(el, v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  };
  const d = new Date(Date.now() + 2 * 86400000);
  const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  setV(document.getElementById("field-name"), "QA Tester");
  setV(document.getElementById("field-phone"), "9876543210");
  setV(document.getElementById("field-date"), iso);
  const timeSel = document.getElementById("field-time");
  setV(timeSel, timeSel.options[1].value);
  const svcSel = document.getElementById("field-service");
  setV(svcSel, svcSel.options[1].value);
  const capGroup = document.getElementById("field-captcha").closest("[role=group]");
  const capSpan = capGroup.querySelector("span");
  const m = capSpan.textContent.match(/(\d+)\s*([+\u2212])\s*(\d+)/);
  const ans = m[2] === "+" ? (+m[1]) + (+m[3]) : (+m[1]) - (+m[3]);
  setV(document.getElementById("field-captcha"), String(ans));
  document.getElementById("field-consent").click();
  window.__waUrls = [];
  window.open = (u) => { window.__waUrls.push(String(u)); return null; };
  dlg.querySelector("button[type=submit]").click();
  return JSON.stringify({ challenge: capSpan.textContent, solved: ans });
})()'
agent-browser wait 1800
agent-browser eval '(() => {
  const u = (window.__waUrls || [])[0] || null;
  return JSON.stringify({
    openedWa: !!u,
    number_ok: u ? u.includes("wa.me/917252991991") : false,
    doctor_ok: u ? decodeURIComponent(u.split("text=")[1] || "").includes("Preferred Doctor: Dr. Himanshu Arora") : false,
    sentUi: !!document.querySelector("[role=status]"),
    submittedAt: localStorage.getItem("vishvaas:appointment:submitted-at")
  });
})()'
# New browser session afterwards → 30-day flag must still suppress.
agent-browser eval "(() => { sessionStorage.clear(); return 'new session simulated'; })()"
agent-browser open "$URL" > /dev/null
inject_observer
agent-browser wait 6500
check_state
agent-browser screenshot "$QA/p7-suppressed-after-submit.png" > /dev/null
echo "part 1 done"
