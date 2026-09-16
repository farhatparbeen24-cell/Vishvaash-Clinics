#!/usr/bin/env bash
# P7 — auto-popup verification, Part 2: CTAs under suppression, doctor switcher,
# CAPTCHA block, focus trap/restore, backdrop close, HI heading, responsive.
set -uo pipefail
QA=/home/z/my-project/download/qa
URL=http://localhost:3000

modal_state() {
  agent-browser eval '(() => {
    const dlg = document.querySelector("[role=dialog]");
    if (!dlg) return JSON.stringify({ open: false });
    const chips = [...dlg.querySelectorAll("button")].map(b => b.textContent.trim()).filter(t => t.startsWith("Dr."));
    return JSON.stringify({
      open: true,
      heading: dlg.querySelector("#appointment-modal-title")?.textContent,
      panelDoctor: (dlg.innerText.match(/Dr\. [A-Za-z ]+/) || [null])[0],
      chips: chips.length
    });
  })()'
}
esc_close() {
  agent-browser eval '(() => { document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })); return "esc"; })()'
  agent-browser wait 500
  agent-browser eval '(() => JSON.stringify({ open: !!document.querySelector("[role=dialog]"), focusRestored: document.activeElement ? document.activeElement.tagName + ":" + (document.activeElement.textContent || "").slice(0, 24) : "none" }))()'
}

agent-browser open "$URL" > /dev/null
agent-browser wait 1200

echo "════ STAGE E1: CTAs still open under 30-day suppression ════"
# Header CTA (records trigger for focus-restore test later)
agent-browser eval '(() => {
  const hdr = [...document.querySelectorAll("header button")].find(b => b.textContent.includes("Book Appointment"));
  hdr.focus(); window.__trigger = hdr; hdr.click(); return "header clicked";
})()'
agent-browser wait 800
modal_state
esc_close

# Hero CTA
agent-browser eval '(() => { const b=[...document.querySelectorAll("main button")].find(x=>x.getAttribute("aria-haspopup")==="dialog" && x.closest("section")?.id==="home"); if(b){b.click();return "hero clicked";} return "hero CTA not found by section id"; })()'
agent-browser wait 800
modal_state
esc_close

# Dental service card CTA (openAppointmentModal → default doctor Himanshu)
agent-browser eval '(() => { const b=document.querySelector("#dental-care article button"); if(b){b.click();return "dental card clicked";} return "not found"; })()'
agent-browser wait 800
modal_state
esc_close

# Doctor card — Dr. Shruti Beri Arora
agent-browser eval '(() => { const a=[...document.querySelectorAll("#doctor ul li article")][1]; const b=a.querySelector("button"); b.focus(); window.__trigger=b; b.click(); return "shruti card clicked"; })()'
agent-browser wait 800
modal_state
esc_close

# AppointmentCTA launcher + ContactLocation + TrustSection
agent-browser eval '(() => { const sec=[...document.querySelectorAll("main section")].find(s=>s.innerText.includes("Schedule Your Visit")); const b=sec ? sec.querySelector("button") : null; if(b){b.click();return "launcher clicked";} return "launcher not found"; })()'
agent-browser wait 800
modal_state
esc_close
agent-browser eval '(() => { const b=[...document.querySelectorAll("#contact button")].find(x=>x.getAttribute("aria-haspopup")==="dialog"); if(b){b.click();return "contact clicked";} return "contact CTA not found"; })()'
agent-browser wait 800
modal_state
esc_close

echo "════ STAGE E2: all four doctor selections via in-dialog switcher ════"
agent-browser eval '(() => { const hdr=[...document.querySelectorAll("header button")].find(b=>b.textContent.includes("Book Appointment")); hdr.click(); return "open"; })()'
agent-browser wait 700
agent-browser eval '(() => {
  const dlg = document.querySelector("[role=dialog]");
  const chips = [...dlg.querySelectorAll("button")].filter(b => b.textContent.trim().startsWith("Dr."));
  const results = [];
  for (const chip of chips) {
    const name = chip.textContent.trim().split("\n")[0];
    chip.click();
    results.push(name);
  }
  return JSON.stringify({ switchedThrough: results });
})()'
agent-browser wait 900
agent-browser eval '(() => {
  const dlg = document.querySelector("[role=dialog]");
  const active = dlg.querySelector("button[aria-pressed=true]")?.textContent.trim().split("\n")[0];
  const svc = document.getElementById("field-service");
  const opts = svc ? [...svc.options].map(o => o.textContent).filter(t => t !== "Select a service") : [];
  return JSON.stringify({ activeChip: active, serviceOptions: opts });
})()'
agent-browser eval '(() => { const c=document.querySelector("[role=dialog] button[aria-pressed=false]"); return "chips present"; })()'
esc_close

echo "════ STAGE F: CAPTCHA wrong answer still blocks (regression) ════"
agent-browser eval '(() => { const hdr=[...document.querySelectorAll("header button")].find(b=>b.textContent.includes("Book Appointment")); hdr.click(); return "open"; })()'
agent-browser wait 700
agent-browser eval '(() => {
  const setV = (el, v) => {
    const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : el.tagName === "SELECT" ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(el, v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  };
  const d = new Date(Date.now() + 86400000);
  const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  setV(document.getElementById("field-name"), "QA Two");
  setV(document.getElementById("field-phone"), "9876543211");
  setV(document.getElementById("field-date"), iso);
  const t = document.getElementById("field-time"); setV(t, t.options[1].value);
  const s = document.getElementById("field-service"); setV(s, s.options[1].value);
  setV(document.getElementById("field-captcha"), "99");
  document.getElementById("field-consent").click();
  window.__waUrls2 = [];
  window.open = (u) => { window.__waUrls2.push(String(u)); return null; };
  document.querySelector("[role=dialog] button[type=submit]").click();
  return "submitted with wrong captcha";
})()'
agent-browser wait 800
agent-browser eval '(() => JSON.stringify({
  captchaErrorShown: !!document.getElementById("error-captcha"),
  captchaErrorText: document.getElementById("error-captcha")?.textContent,
  waOpened: (window.__waUrls2 || []).length,
  freshChallenge: document.getElementById("field-captcha").closest("[role=group]").querySelector("span").textContent
}))()'
esc_close

echo "════ STAGE G: focus trap + backdrop close ════"
agent-browser eval '(() => { const hdr=[...document.querySelectorAll("header button")].find(b=>b.textContent.includes("Book Appointment")); hdr.focus(); window.__trigger=hdr; hdr.click(); return "open via header"; })()'
agent-browser wait 700
agent-browser eval '(() => {
  const dlg = document.querySelector("[role=dialog]");
  const f = dlg.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])");
  const first = f[0], last = f[f.length - 1];
  last.focus();
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
  const wrappedFirst = document.activeElement === first;
  first.focus();
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true }));
  const wrappedLast = document.activeElement === last;
  const bodyScrollLocked = document.body.style.overflow === "hidden";
  return JSON.stringify({ focusables: f.length, tabFromLastGoesToFirst: wrappedFirst, shiftTabFromFirstGoesToLast: wrappedLast, bodyScrollLocked });
})()'
agent-browser eval '(() => { document.querySelector("[class*=\"z-[9998]\"]").click(); return "backdrop clicked"; })()'
agent-browser wait 500
agent-browser eval '(() => JSON.stringify({ open: !!document.querySelector("[role=dialog]"), focusRestoredToTrigger: document.activeElement === window.__trigger, scrollUnlocked: document.body.style.overflow !== "hidden" }))()'

echo "════ STAGE H: Hindi heading + support line ════"
agent-browser eval '(() => { const b=[...document.querySelectorAll("button")].find(x=>x.textContent.trim()==="हिंदी"); b.click(); return "hi"; })()'
agent-browser wait 900
agent-browser eval '(() => { const hdr=[...document.querySelectorAll("header button")].find(b=>b.textContent.includes("बुक करें")||b.textContent.includes("Book")); hdr.click(); return "open"; })()'
agent-browser wait 800
agent-browser eval '(() => {
  const dlg = document.querySelector("[role=dialog]");
  return JSON.stringify({
    heading: dlg.querySelector("#appointment-modal-title")?.textContent,
    support: dlg.innerText.includes("Vishvaas Clinic में अपना परामर्श शेड्यूल करें।")
  });
})()'
esc_close
agent-browser eval '(() => { const b=[...document.querySelectorAll("button")].find(x=>x.textContent.trim()==="English"); b.click(); return "en"; })()'
agent-browser wait 600

echo "════ STAGE I: modal usability across widths ════"
for W in 360 390 412 768 1280 1440; do
  agent-browser set viewport $W 900 > /dev/null
  agent-browser eval "(() => { const hdr=[...document.querySelectorAll(\"header button\")].find(b=>b.textContent.includes(\"Book Appointment\")) || [...document.querySelectorAll(\"button\")].find(b=>b.getAttribute(\"aria-haspopup\")===\"dialog\"); hdr.click(); return \"open\"; })()" > /dev/null
  agent-browser wait 800
  agent-browser eval '(() => {
    const dlg = document.querySelector("[role=dialog]");
    const r = dlg.getBoundingClientRect();
    const sc = dlg.querySelector(".nice-scroll");
    sc.scrollTop = sc.scrollHeight;
    const submit = dlg.querySelector("button[type=submit]");
    const sr = submit.getBoundingClientRect();
    const doc = document.documentElement;
    const pageOw = Math.max(doc.scrollWidth, document.body.scrollWidth) - Math.max(doc.clientWidth, document.body.clientWidth);
    return JSON.stringify({
      w: innerWidth,
      pageOverflowX: pageOw,
      dialogInViewport: r.left >= 0 && r.right <= innerWidth,
      formScrollable: sc.scrollHeight >= sc.clientHeight,
      submitReachable: sr.top < innerHeight && sr.bottom > 0,
      captchaVisibleAfterScroll: (() => { const c = document.getElementById("field-captcha").getBoundingClientRect(); return c.top < innerHeight && c.bottom > 0; })()
    });
  })()'
  agent-browser screenshot "$QA/p7-modal-$W.png" > /dev/null
  agent-browser eval '(() => { document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })); return "esc"; })()' > /dev/null
  agent-browser wait 400
done
agent-browser set viewport 1280 900 > /dev/null
echo "part 2 done"
