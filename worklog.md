# Worklog

---
Task ID: 1
Agent: Super Z (main agent)
Task: Migrate uploaded Vishvaas Clinic website ZIP (vishvaas-clinic-migration-clean.zip) into a clean workspace as the active project; install deps, start app, create fresh preview, verify sections. No content revisions.

Work Log:
- Inspected upload: /home/z/my-project/upload/vishvaas-clinic-migration-clean.zip (3.1 MB, 122 files) — Next.js 16 App Router + TypeScript + Tailwind 4, source-only (no node_modules/.next/.env), includes bun.lock.
- Loaded fullstack-dev skill; inspected init-fullstack.sh before running. Ran it with SKIP_DEV=true so NO template/starter site was ever downloaded-and-started; template files were then fully purged (kept only platform infra: .zscripts/, Caddyfile).
- Extracted ZIP contents into /home/z/my-project as the active project root. Provisioned .env from the ZIP's .env.example (NEXT_PUBLIC_SITE_URL left commented, as shipped).
- Byte-identity verification: all 122 ZIP files compared with cmp against project root — IDENTICAL; 0 extra source files (verified again post-install; only generated artifacts added: node_modules/, .next/, gitignored next-env.d.ts auto-created by Next.js).
- Installed dependencies: `bun install` (bun 1.3.14) against the ZIP's package.json + bun.lock — 571 packages, no errors, lockfile respected.
- Started app from project root with `bun run dev` (package.json script: `next dev -p 3000`); Next.js 16.1.3 ready in 699ms; log at /home/z/my-project/dev.log (all GET / 200, no runtime errors).
- Fresh preview verified via agent-browser at port 3000 (gateway-forwarded): title "Vishvaas Clinic | Eye & Dental Care — Sahastradhara Road, Dehradun"; zero page errors; clean console.
- Section verification (screenshots in /home/z/my-project/download/qa/): homepage hero with rotating imagery (eye exam / dental), top bar (Call Clinic / WhatsApp / Get Directions), Eye Care (4 service cards + Request Consultation), Dental Care panel, Why Choose Us, Meet the Doctors (Dr. Himanshu Arora — Eye Care, Dr. Shruti Beri Arora — Dental Care), Brands We Use (Lenses/Equipment/Pharmaceuticals incl. ZEISS, Alcon, HOYA, Topcon, Sun Pharma), Gallery (real clinic photos), Patient Stories/Testimonials, Contact cards, footer with Instagram/Facebook social links, phone +91 72529 91991, WhatsApp Us, Google Maps directions, Privacy Policy / Terms & Medical Disclaimer.
- Flow verification: Book Appointment dialog opens with doctor chooser + full form; submitting composed the WhatsApp deep link https://wa.me/917252991991?text=... with doctor, department, patient name, mobile, date/time, service (captured via window.open interception; no real message sent). 7 wa.me links + 3 Book Appointment CTAs present. EN ⇄ हिंदी switcher renders the full interface in Hindi Devanagari and back.

Stage Summary:
- Active project root: /home/z/my-project (ZIP contents are the project; template never executed).
- Start command: `bun run dev` (next dev -p 3000), running in background, PID logged via dev.log.
- Preview: gateway forwards port 3000; site verified interactive and complete.
- NO website files, content, images, logo, hero, gallery, booking flow, services or layout were modified during migration — source tree byte-identical to the uploaded backup.
- Awaiting user's next instruction before any changes.

---
Task ID: 2
Agent: Super Z (main agent)
Task: Phase 1 approved revisions — header royal blue, logo display refinement, hero slides 2/4 client photos, Dry Eye Care → Glaucoma Care card, eye-care heading sentence. No other changes.

Work Log:
- Copied client images byte-identical into public/images/hero/ (staff slide-2 PNG 1447x1087, dental-room slide-4 PNG 1448x1086). Samsung-blue-refrence.jpg kept in upload/ only — never referenced anywhere (verified via grep: no "samsung" in src/ or public/).
- Rev 1 Header: added --color-royal (#1428a0) / --color-royal-deep (#0e1c7e) tokens in globals.css; Header.tsx now bg-royal both states (scrolled adds white/15 border + shadow); nav links offwhite/90 → white on hover; Book Appointment CTA white bg + royal text (sand icon keeps orange accent); mobile toggle white/40 ghost. UtilityBar strip → bg-royal-deep, offwhite text, white separators; WhatsApp green + sand map pin unchanged. Structure/heights/functionality untouched.
- Rev 2 Logo: added variant="header" prop — monogram h-10 → h-12 sm:h-[52px], wordmark 19px → 22/24px, descriptor 10px → 11/11.5px tightened tracking, gap 2.5/3; light-tone descriptor offwhite/85. Artwork (SVG paths) unchanged; default variant byte-identical rendering for Footer etc.
- Rev 3 Hero: heroImages.ts slide eyeExam → staff PNG, alt "Vishvaas Clinic staff", objectPosition "44% 45%"; slide dentalRoom → dental-room PNG, alt "Dental treatment room at Vishvaas Clinic", objectPosition "28% 40%". Slides 1/3 untouched; carousel logic, autoplay, controls untouched; provenance rows updated truthfully (client-provided originals). Desktop verified: faces fully clear of text; VC sign + treatment area clear on slide 4.
- Rev 4 Card: clinic.ts services[1] → slug glaucoma-care / icon Stethoscope / title Glaucoma Care / exact blurb; Services.tsx iconMap Droplets→Stethoscope; translations EN items[1] exact description; HI items[1] faithful translation. Booking form options + doctor card tags intentionally untouched (protected). Card CTA opens modal with Dr. Himanshu Arora (fallback path, booking flow unchanged).
- Rev 5 Heading: EN titleA → "Empathetic and compassionate care for" (accent "every eye" + titleB unchanged); HI titleA updated equivalently. Also fixed pre-existing JSX missing space between accent span and titleB (Services.tsx) so rendered text is the EXACT required sentence.
- QA: lint clean; breakpoints 360/390/412/768/1280/1440 — zero horizontal overflow everywhere; header contrast verified rgb(20,40,160); slides verified at 360/390/768/1280/1440; mobile-menu panel unchanged; EN⇄HI verified; header CTA modal verified; dev.log all 200s, no errors. Note: on ≤412px the group-photo faces geometrically cannot sit fully above the bottom-anchored text band (no vertical crop headroom on mobile); all faces remain uncut and recognizable — documented as best-achievable within the no-structure-change constraint.
- Byte-diff vs migration ZIP: exactly 8 changed source files + 2 new hero images; zero removals; all excluded sections (footer, doctors, brands, gallery, testimonials, contact, booking flow, WhatsApp, dental, slides 1/3) byte-identical.

Stage Summary:
- All five approved revisions live on port 3000 preview; nothing else altered.
- Screenshots: /home/z/my-project/download/qa/p1-*.png

---
Task ID: 3
Agent: Super Z (main agent)
Task: Remove "Dry Eye Care" from every remaining public-facing location (booking-form service dropdowns, doctor tags, labels, filters, hidden/public content) and replace with "Glaucoma Care" only where service mapping and booking behavior remain correct. No changes to doctor names, doctor-photo layout, WhatsApp number, appointment fields or booking message structure.

Work Log:
- Full-project sweep for dry-eye variants (EN "Dry Eye Care"/"dry-eye", key "dryEye", HI "ड्राई आई") across src/ + public/: 10 occurrences in 3 lib files (clinic.ts, doctors.ts, translations.ts). public/, src/app/ (metadata/JSON-LD/sitemap) clean.
- Traced consumers: AppointmentForm.tsx (dropdown = clinic.form.serviceOptions filtered by doctor.serviceOptions via VALUE-string join; WhatsApp msg = option VALUE via translations[locale].wa.appointment), DoctorSlider.tsx (tags = doctor.serviceOptions → key lookup → serviceOptionLabels), AppointmentProvider.normalizeServiceValue (no dry-eye mapping — untouched).
- clinic.ts: form option { key:"dryEye", value:"Dry Eye Care" } → { key:"glaucoma", value:"Glaucoma Care" } (same dropdown position); type union "dryEye"→"glaucoma"; SEO meta description "dry eye care"→"glaucoma care".
- doctors.ts: Dr. Himanshu Arora serviceOptions "Dry Eye Care"→"Glaucoma Care" (drives both his popup dropdown options and his card tags). Dental doctor + all names/photos/layout untouched.
- translations.ts: ServiceOptionKey union; EN hero slide-1 copy → "...cataract care, glaucoma care and urgent eye-care needs."; EN why-us card body → "...cataract and glaucoma consultations, under one roof."; EN doctor intro → "...glaucoma care, comprehensive eye examinations..."; EN serviceOptionLabels glaucoma:"Glaucoma Care"; HI equivalents: hero copy (ग्लूकोमा देखभाल), why-us (ग्लूकोमा परामर्श), doctor intro (ग्लूकोमा देखभाल), labels glaucoma:"ग्लूकोमा देखभाल" (matches existing HI Glaucoma Care service card term).
- Booking structure preserved: same 8 options, same fields/order/labels in wa template; submitted service VALUE for the replaced option is now canonical "Glaucoma Care" (stable front-desk value per file's design note); normalizeServiceValue, prefill logic, dental options untouched.
- Verification: rg residue sweep = 0 matches (EN/HI/key form); tsc clean in src/; eslint clean; dev.log 200s.
- Browser E2E (EN): popup dropdown shows Glaucoma Care for Dr. Himanshu (5 eye options); submitted form → wa.me/917252991991 message: identical structure, "Service Required: Glaucoma Care", doctor/department/fields unchanged (window.open intercepted, no real message sent).
- Browser E2E (HI): dropdown "ग्लूकोमा देखभाल"; Hindi wa message identical structure with "आवश्यक सेवा: Glaucoma Care". ड्राई = 0 matches.
- Dr. Shruti Beri Arora dropdown unchanged (Dental Consultation / General Dental Care / Other / Not Sure).
- QA screenshots /home/z/my-project/download/qa/: p2-glaucoma-booking-modal-1280.png, p2-glaucoma-booking-modal-390.png, p2-glaucoma-doctor-tag-visible-1280.png (mobile-width doctor card tag render), p2-glaucoma-hero-slide1-1280.png. Overflow sweep 360/390/412/768/1280/1440: zero horizontal overflow. Console: no errors.
- Note: QA screenshots were taken via scripted interaction; one screenshot named *-1280 captured at 390px viewport (harmless naming artifact).

Stage Summary:
- "Dry Eye Care" fully removed from all public-facing + hidden content in EN and HI; replaced by "Glaucoma Care" everywhere the eye-care service mapping is correct (booking dropdown, doctor tags, hero copy, why-us card, doctor intro, SEO meta).
- Exactly 3 files changed: src/lib/clinic.ts, src/lib/doctors.ts, src/lib/translations.ts. Booking flow, WhatsApp number/message structure, doctor names/photos/layout, appointment fields, dental content: verified unchanged.

---
Task ID: 4
Agent: Super Z (main agent)
Task: Phase 2 — (1) Dental Care expanded to 6 service cards, (2) homepage section numbering/order 01–07 site-wide, (3) official mini-logos in Brands We Use, (4) new gallery images. Preserve all Phase 1 results exactly.

Work Log:
- DENTAL (clinic.ts + translations.ts + DentalCare.tsx): added canonical `dentalServices` (6 items, owner-supplied titles/blurbs verbatim) + dental.items EN/HI translations; DentalCare banner kept unchanged except editorial "02" index added to its eyebrow; new 6-card grid mirrors the Eye Care card style (same tile, aqua icon treatment — lucide Syringe/Anchor/Sparkles/Layers/AlignCenter/ShieldPlus, typography, Request Consultation CTA) in sm:2 / lg:3 grid. CTA uses ServiceCta with DEFAULT_DOCTOR_ID (himanshu-arora) per owner's explicit instruction ("Dr. Himanshu Arora pre-selected"); no service prefill (dental titles are not mapped options — no false claim), booking fields/WhatsApp structure untouched. Verified E2E: dental CTA → modal with Dr. Himanshu Arora panel + empty service selector.
- NUMBERING (TrustSection/BrandsWeUse/ClinicGallery/Testimonials/ContactLocation/Availability): now 01 Eye Care, 02 Dental Care, 03 Why Choose Us, 04 Brands We Use, 05 Our Gallery, 06 Testimonials, 07 Contact Us top→bottom. DoctorSlider's pre-existing "03" removed (section not part of the 7-section scheme; position/content otherwise untouched). Hidden pre-existing dynamic index "06" on Availability (via translations a.index) removed — it clashed with Testimonials' 06. Anchors unchanged (#eye-care/#dental-care/#why-us/#doctor/#brands/#gallery/#testimonials/#contact all still resolve); nav + footer use navLinks whose order already matches — no nav/footer content changes.
- BRANDS (brands.ts + BrandsWeUse.tsx + /public/images/brands/): 16 official logo files fetched and rendered beside brand names (next/image, h-4, max-w 48px, object-contain, original aspect ratio, alt=""). Provenance documented in brands.ts: Wikimedia official marks (ZEISS, Alcon 2019, HOYA, J&J, Topcon, Sun Pharma, Zydus, Alkem), official sites (Oertli, Lupin menu logo, Alembic, Alkem via commons, Biotech via biotechvisioncare→biotechhealthcare, Labomed, Vibgyor excluded), Google-favicon-served official site marks (Appasamy 16px, Keeler 100px, Neomedix 32px). 5 brands kept as neutral text wordmarks (built-in fallback) — Care, Axialis, Headway, Raymed (no verifiable official asset found) and Vibgyor (only official asset is white-on-transparent, invisible on white panels). Wrong-company fetches rejected during QA (Žydų museum for Zydus, WordPress "BRIDGE" theme logo for Vibgyor, zyduslife.com "US" badge) — never rendered. Overflow fixed iteratively (J&J script mark); zero cell overflow at all widths.
- GALLERY: reviewed all 10 uploaded files visually (contact sheet qa/p2-new-gallery-contact-sheet.jpg). 9 of 10 are NOT clinic photographs: web-design service-card screenshots (WA0019/0020/0022/0023/0024), doctor designation board design draft naming OTHER doctors incl. urologist/gastroenterologist (WA0025), cataract educational collages (WA0014, WA0028) and a Cleveland Clinic ©2023 watermarked diagram (WA0029) — adding them would violate the gallery's production rules (owner photos only; no screenshots/stock/third-party content) and publish third-party copyright + non-clinic doctor names. Added the single genuine clinic photo IMG-20260912-WA0027.jpg (treatment room): baked-in decorative frame + camera date stamp removed via straight border/bottom crops only (no retouching); entry appended (id treatment-room, 1051x658, bilingual alt, provenance note) — existing 7 entries untouched, layout/lightbox code untouched. Verified: 8 tiles, lightbox "Image 8 of 8".
- QA: tsc src clean; eslint clean; zero horizontal overflow 360/390/412/768/1280/1440; EN⇄HI verified (dental cards render in Hindi; numbering identical); Phase 1 spot-checks pass (4 eye cards incl. Glaucoma Care, 4 hero slides, royal-blue header, logo presentation). Screenshots: qa/p2-dental-6cards-1280.png, p2-dental-390.png, p2-brands-final.png, p2-brands-390.png, p2-gallery-8-1280.png, p2-brands-verify-sheet.jpg, p2-brands-final-sheet.jpg, p2-new-gallery-contact-sheet.jpg, p2-wa0027-*.jpg.

Stage Summary:
- All four Phase 2 workstreams implemented in one integrated update; Phase 1 results byte-preserved (only the files listed above touched).
- Brand logos: 16/21 live with documented provenance; 5 awaiting verifiable official files (text wordmark fallback).
- Gallery: +1 genuine owner photo; 9 non-photo uploads deliberately not published (documented above) — owner can override by naming specific files.

---
Task ID: 5
Agent: Super Z (main agent)
Task: Surgical redesign of SECTION 2 — Dental Care only: remove the dark navy banner panel, re-present the section in the exact light editorial system of Section 01 (Eye Care), keep all dental card content unchanged, and add the same front-desk guidance strip below the dental cards. No other page/section/component modified.

Work Log:
- Before-state captured (qa/p3-before-dental-1280.png: navy banner + 6 cards; p3-before-eye-1280.png for Section 1 baseline).
- Single file changed: src/components/home/DentalCare.tsx (git status confirms only file modified; translations.ts, Services.tsx, all other files untouched).
- Banner removal: deleted the rounded-[26px] bg-navy band-grid panel (Smile icon block, dark eyebrow, "Ask About Dental Care" banner button, sand corner glow). band-grid class retained in globals.css — still used by Footer/AppointmentCTA.
- Section 1 structure mirrored exactly: container mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24 (was py-4/lg:py-8); SectionHeading with index="02", eyebrow=t.dental.eyebrow, title=titleA + accent-italic(titleAccent) (same accent treatment as 01, minus the dark-theme text-aqua override), lede=t.dental.body — all existing dental copy reused verbatim, nothing rewritten.
- Cards untouched in content: same 6 dentalServices, same dentalIconMap (Syringe/Anchor/Sparkles/Layers/AlignCenter/ShieldPlus, Smile fallback), same tile markup (rounded-2xl border-line bg-white p-6, h-12 w-12 aqua icon, font-display title, ink-soft blurb), same ServiceCta → DEFAULT_DOCTOR_ID (Dr. Himanshu Arora pre-selected per standing owner instruction). Grid mt-8→mt-12 to match 01's heading→cards rhythm; kept sm:2/lg:3 (balanced 2×3 for 6 items; 4-col would orphan 2 cards).
- Front-desk strip added below cards, markup class-identical to Eye strip (mt-10 rounded-2xl border-aqua-deep/60 bg-aqua/45, WhatsApp Us bg-wa + Call Clinic white pill, PhoneCall/WhatsAppIcon treatment, sm:flex-row stacking). Wording: reuses t.services.stripQ/stripA ("Not sure which consultation you need? Describe your concern — the front desk will guide you.") — the exact requested sentence, shared keys so EN+HI wording is identical for BOTH eye-care and dental-care visitors (HI: "पता नहीं कि आपको कौन-सा परामर्श चाहिए? अपनी समस्या बताएं — फ्रंट डेस्क आपका मार्गदर्शन करेगा।"). WhatsApp link = t.wa.quick.notSure; Call = clinic.phoneHref (+91 72529 91991).
- Verified: tsc clean (src), eslint clean; Section 1 pixel-diff before/after = 0 strong-diff pixels (sub-AA noise only) + dentalTop byte-identical 1661.53125 (layout above dental unchanged); strip text exact, wa.me/917252991991 + tel: links intact; dental CTA E2E → modal opens with Dr. Himanshu Arora panel (Dr. Shruti in switcher); EN⇄HI correct (02 दंत चिकित्सा eyebrow, HI title/strip); overflow sweep 360/390/412/768/1280/1440 = zero horizontal overflow; console clean.
- Note: t.cta.askDental / t.wa.quick.dental translation keys became unreferenced by design (banner button retired in favour of the shared strip per spec); keys left in translations.ts untouched — no cleanup performed.
- Screenshots: qa/p3-before-dental-1280.png, p3-after-dental-1280.png (new heading), p3-after-dental-strip-1280.png, p3-after-dental-390.png, p3-after-dental-strip-390.png, p3-before/after-eye-1280.png (Section 1 identity proof).

Stage Summary:
- Section 2 now reads as the next section of the exact Section 01 design system: light editorial heading (02), identical card tiles, identical front-desk strip; dark panel gone; all dental content, CTAs, booking flow, WhatsApp/phone links and every other section byte-preserved.

---
Task ID: 6
Agent: Super Z (main agent)
Task: Phase 3 — rebuild "Meet the Doctors" with four approved real doctor portraits, Core/Visiting grouping, doctor-specific booking preselection, and a client-side arithmetic CAPTCHA. Preserve all Phase 1/2 work exactly.

Work Log:
- IMAGES: 4 uploaded approved portraits (upload/dr-*.jpg.png, PNG 1086x1448 x3 + 1145x1374) visually verified as real studio photographs; mapped to doctors by filename (unambiguous). Non-destructive WebP q88 transcode (scripts/p3-optimize-doctor-photos.js, sharp): 1.6-1.9MB → 72-108KB, original pixel dimensions preserved (no crop/resize/retouch/AI). Saved to public/images/doctors/dr-{himanshu-arora,shruti-beri-arora,shalabh-aggarwal,akshay-rawat}-profile.webp; old AI-looking dr-himanshu-arora.jpg + dr-shruti-beri-arora.jpg deleted (superseded); zero stale references (grep + clinic.doctor.photo legacy entry updated to new path/alt).
- doctors.ts (rewrite): DoctorId + shalabh-aggarwal/akshay-rawat; DoctorGroup "core"|"visiting"; DoctorDepartment + Urology/Gastroenterology; CORE_DOCTORS/VISITING_DOCTORS exports; approved credentials verbatim (Himanshu: role+focus+quals+credentialLine+Reg UKMC 7532; Shruti: Consultant Dental Surgeon & Periodontist + BDS MDS; Shalabh: role+quals, whatsappLabel Urology; Akshay: role+quals+Reg 4355+Gastro-Liver Clinic, whatsappLabel Gastroenterology); approved alt texts exactly as specified; doctorImageSize updated to real intrinsic sizes; doctorMonogram + SA/AR fallbacks; DoctorText reshaped to {role, focus?, credentialLine?, hours?, saturday?}.
- clinic.ts: form.serviceOptions + {urology:"Urology Consultation"} + {gastro:"Gastro Consultation"} (per-doctor dropdown filtering keeps existing doctors' dropdowns byte-identical; canonical VALUES feed "Service Required:" unchanged in structure).
- DoctorSlider.tsx (rebuild): carousel → grouped card grid. Existing main heading untouched, NO section number. Subsection A "Core Doctors" then B "Visiting Specialists" (own heading + mt-14 spacing). Uniform premium card: aspect-[4/5] portrait w/ face-safe object-[50%_20%], department/visiting pill, name, role kicker, focus line, icon credential rows (GraduationCap/Award/BadgeCheck/Building2), visiting hours block (Clock/CalendarClock, "Consulting Hours:"/"Availability:" labels per spec), full-width orange "Schedule Your Visit" CTA (same style as prior doctor-card CTA) → openAppointmentModal(doctor.id) with aria-label including doctor name. Mobile stacks cleanly.
- AppointmentModal.tsx: department pill + switcher chips label logic extended for visiting specialists (Visiting Specialist pill); panel subtitle now doctorText.role. Switcher automatically lists all 4 doctors (iterates clinicDoctors).
- AppointmentCTA.tsx: launcher chip labels extended for visiting specialists (4 chips verified).
- AppointmentForm.tsx (CAPTCHA): makeCaptcha() random 1-12 operands, +/− (subtraction non-negative); state = challenge + answer + error; fresh challenge every modal open (form remount), after every incorrect answer, and on "send another"; numeric-only input (inputMode numeric, non-digits stripped) immediately above submit; validation AFTER existing field validation, BEFORE WhatsApp URL construction — incorrect/empty answer shows "Please enter the correct security answer." (role=alert, focus moves to input, challenge regenerates) and the deep link is unreachable. No backend/third-party/external scripts.
- translations.ts: EN+HI doctors.coreLabel/visitingLabel/cardLabels/regPrefix, departments.visiting, people x4 (HI roles incl. सलाहकार दंत सर्जन एवं पीरियोडोन्टिस्ट; HI hours सोमवार–शुक्रवार…); serviceOptionLabels urology/gastro EN+HI; ServiceOptionKey union extended; form.captchaLabel/captchaPlaceholder + errors.captcha EN+HI.
- QA: tsc clean (src), eslint clean on all 7 changed files; git: exactly 7 modified files + 2 image deletions + 4 image additions. Browser E2E: section shows Core(2)+Visiting(2) in order; 4 portraits loaded with approved alts; Shalabh CTA → modal preselected Dr. Shalabh + Visiting Specialist pill + dropdown [Urology Consultation, Other / Not Sure]; WRONG captcha (99 vs 1) → error shown, wa urls opened = 0, fresh challenge (10−9 → 8+7), input cleared+focused; CORRECT answer → wa.me/917252991991 with Preferred Doctor: Dr. Shalabh Aggarwal, Department: Urology, Service Required: Urology Consultation, all patient fields intact (window.open intercepted, no real message); Akshay dropdown [Gastro Consultation, Other / Not Sure]; fresh challenge on reopen; Himanshu CTA → preselected + unchanged 5-option eye dropdown; EN⇄HI complete (मुख्य डॉक्टर/विज़िटिंग विशेषज्ञ, सुरक्षा जाँच, अपॉइंटमेंट अनुरोध भेजें); overflow sweep 360/390/412/768/1280/1440 = zero horizontal overflow, 1-col mobile / 2-col ≥768; console clean; dev.log 200s.
- Preserved (git-verified byte-untouched): header, hero, Glaucoma changes, Eye Care, Dental Care (incl. Task 5 layout), Brands, Gallery, Testimonials, contact, footer, nav, WhatsApp number/message structure, EN-HI toggle.

Stage Summary:
- Meet the Doctors: 4 real approved portraits, Core/Visiting grouping, uniform premium cards, verified credentials only.
- Booking: all 4 doctors selectable everywhere (cards, popup switcher, launcher chips), per-card preselection verified E2E, CAPTCHA blocks invalid submissions.
- Screenshots: qa/p3-doctors-1280.png, p3-doctors-cards-1280.png, p3-visiting-top.png, p3-visiting-bottom.png, p3-visiting-cards.png, p3-doctors-390.png, p3-doctors-390-card4.png.

---
Task ID: 7
Agent: Super Z (main agent)
Task: Single limited correction — update ONLY Dr. Shruti Beri Arora's credentials in "Meet the Doctors". No other doctor's content, no photos, no card design/layout/order, no booking form, CAPTCHA, WhatsApp flow, or any other section.

Work Log:
- Before-state captured: per-card innerText + viewport-anchored screenshots (scripts/p6-shruti-capture.sh → qa/p6-before-*.png).
- doctors.ts: type widened `qualifications: string | string[]` (single-string doctors render byte-identically) + new optional `exConsultant?: string[]`; Shruti's entry only → qualifications ["B.D.S. — Manipal", "M.D.S. — Government Dental College, Chennai"], exConsultant [Guru Teg Bahadur Hospital Dehradun / Apollo Speciality Hospital Trichy Tamil Nadu / Noble Medical & Dental College Nepal]. Name/role/image/alt/serviceOptions/whatsappLabel untouched; all 3 other doctors' entries byte-identical.
- DoctorSlider.tsx: qualification rows render per-line via array map (identical output for string doctors); added ex-consultant block (Building2 icon + subtle micro-caps label + hospital list) in the same credential ul; CTA/portrait/hours markup untouched.
- translations.ts: +1 key each in EN/HI cardLabels: previouslyWith "Previously associated with" / "पूर्व में संबद्ध". Nothing else.
- Verify: tsc clean in src (only pre-existing skills/ errors); eslint clean on 3 files; compare script (scripts/p6-compare.py): Himanshu/Shalabh/Akshay innerText byte-IDENTICAL + content-region pixel diff = 0 strong-diff pixels; Shruti card = old "BDS, MDS" removed, all 5 new lines + label present verbatim, role directly below name, no extra text.
- E2E: Shruti CTA → modal preselects Dr. Shruti Beri Arora (panel DENTAL CARE + her name + role), switcher shows all 4 doctors, service dropdown [Dental Consultation, General Dental Care, Other / Not Sure] unchanged, CAPTCHA input present. HI: role unchanged (सलाहकार दंत सर्जन एवं पीरियोडोन्टिस्ट), credentials are language-neutral proper nouns, label पूर्व में संबद्ध.
- Overflow: 360/390/412/768/1280/1440 EN + 360/1440 HI → zero horizontal overflow (page + card level). Console: no errors (only pre-existing dev warnings).
- Note: Core row height grew 990→1041px because equal-height cards stretch to Shruti's taller card — CTA stays bottom-anchored; Himanshu's content region pixel-identical.
- Screenshots: qa/p6-before/after-card{0-3}-1280.png, p6-after-shruti-card.png (1280 EN), p6-after-doctors-1280.png, p6-after-shruti-card-360-hi.png.

Stage Summary:
- Exactly 3 files changed: src/lib/doctors.ts, src/components/home/DoctorSlider.tsx, src/lib/translations.ts (git-verified; only Shruti-entry + shared-renderer + 2 label lines).
- All other doctors, photos, layout, booking form, CAPTCHA, WhatsApp flow, and every other section verified unchanged (text + pixel evidence).

---
Task ID: 8
Agent: Super Z (main agent)
Task: One-time automatic "Book an Appointment" popup on the homepage only — 4s delay after visible load, once per browser session, 30-day suppression after successful submission. Reuse the existing booking modal; no duplicate form; all existing CTAs unchanged.

Work Log:
- NEW src/lib/appointmentStorage.ts: sessionStorage flag (auto-popup fired this session) + localStorage timestamp (successful submission, 30-day window); all calls try/catch-guarded (private-mode safe). Manual CTAs neither read nor write these flags.
- NEW src/components/appointment/AutoAppointmentPopup.tsx (renders null): waits for window `load` (document.readyState check), then 4s timer → re-checks suppression → marks session flag → opens the EXISTING modal via openAppointmentModal() (no args = clinic default doctor, identical to header CTA path); skips opening (still consumes the session show) if the visitor already has the dialog open; trigger mounted ONLY in src/app/page.tsx so no other page can ever auto-open.
- AppointmentForm.tsx: markAppointmentSubmitted() at the exact successful-submission point (all validations + CAPTCHA passed, WhatsApp deep link being opened) — covers submissions from ANY open path (auto or manual CTA).
- AppointmentModal.tsx: dialog h2 now renders new t.popup.heading ("Book an Appointment" / HI "अपॉइंटमेंट बुक करें") + new supporting line t.popup.support ("Schedule your consultation at Vishvaas Clinic." / HI "Vishvaas Clinic में अपना परामर्श शेड्यूल करें।"); existing eyebrow + sub retained. t.popup.title/sub kept UNTOUCHED — they are still rendered by the homepage AppointmentCTA launcher card ("Schedule Your Visit"), so no other section changed.
- Pre-existing a11y confirmed (no changes needed): visible X close with aria-label, Escape close, backdrop click close, Tab focus trap, focus restore on close, body+html scroll lock with scrollbar compensation, aria-modal dialog.
- Verify (scripts/p7-verify-timing.sh + p7-verify-cta-a11y.sh, MutationObserver timing via performance timeline): auto-open 4223ms/4115ms after window load (never instant); heading+support exact; dismiss→reload = no auto-open (session flag); sessionStorage.clear() → auto-opens again; successful submit (CAPTCHA "6 − 1 = ?"→5, wa.me/917252991991, "Preferred Doctor: Dr. Himanshu Arora", window.open intercepted) → localStorage written → NEW session + reload = still suppressed (30-day).
- CTAs under active 30-day suppression all still open: header (default Himanshu), hero slide CTA ("Book Eye Consultation" → slide doctor), dental service card, Dr. Shruti doctor card (preselects Shruti), AppointmentCTA launcher, ContactLocation, TrustSection, MobileBottomNav (390px); in-dialog switcher cycles all 4 doctors with correct per-doctor service dropdowns (Akshay → Gastro Consultation/Other).
- CAPTCHA regression: wrong answer "99" → error "Please enter the correct security answer.", 0 wa URLs opened, fresh challenge; correct answer path already proven in Stage D.
- A11y E2E: Tab from last focusable wraps to first, Shift+Tab from first wraps to last (14 focusables), body scroll locked while open + unlocked after; Escape/backdrop close restores focus to the visible trigger (header CTA + doctor-card CTA verified; initial "failures" were test selectors grabbing a hidden 0×0 duplicate header button — re-verified with visible button: restoredToTrigger true).
- HI: heading "अपॉइंटमेंट बुक करें" + support line render in dialog; EN⇄HI toggle intact.
- Responsive: modal usable + form scrollable + submit/CAPTCHA reachable at 360/390/412/768/1280/1440; zero page horizontal overflow; dialog always within viewport. Console: no errors. tsc: 0 src errors (18 pre-existing skills/ only); eslint clean on all touched files.
- Files: exactly 4 modified (page.tsx, AppointmentForm.tsx, AppointmentModal.tsx, translations.ts) + 2 new (appointmentStorage.ts, AutoAppointmentPopup.tsx). No other section/content/style changed.
- Screenshots: qa/p7-auto-popup-desktop.png, p7-modal-{360,390,412,768,1280,1440}.png, p7-suppressed-after-submit.png.

Stage Summary:
- One-time auto booking popup live on the homepage: 4s after full page load, once per session, 30-day suppression after successful submission, homepage-only by construction.
- Dialog heading "Book an Appointment" + supporting line in EN/HI; every field, selector, pre-selection, CAPTCHA, WhatsApp number/message and CTA behaviour byte-preserved (E2E-verified).
