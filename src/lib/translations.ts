/**
 * ─────────────────────────────────────────────────────────────────────────────
 * VISHVAAS CLINIC — CENTRAL LANGUAGE / CONTENT DICTIONARY
 * ─────────────────────────────────────────────────────────────────────────────
 * • English ("en") is the default locale and the source of truth for types.
 * • Hindi ("hi") is a full UI translation. Proper nouns stay Latin/unchanged:
 *   Vishvaas Clinic, Dr. Himanshu Arora, Ramrati Eye Care, Prem Nagar,
 *   WhatsApp, Sahastradhara Road, Dehradun.
 * • Original Google review quotations are NEVER translated — they render
 *   exactly as supplied by the patients (see lib/testimonials.ts).
 * • No invented facts: anything unverified stays "to be confirmed" in both
 *   languages.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { DoctorId, DoctorText } from "@/lib/doctors";

export const locales = ["en", "hi"] as const;
export type Locale = (typeof locales)[number];

export type ServiceOptionKey =
  | "general"
  | "cataract"
  | "glaucoma"
  | "exam"
  | "emergency"
  | "dentalConsult"
  | "dentalGeneral"
  | "urology"
  | "gastro"
  | "other";

export type AppointmentData = {
  doctorName: string;
  department: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  service: string;
  message?: string;
};

const en = {
  switcher: { label: "Language", en: "English", hi: "हिंदी" },
  brand: { descriptor: "Eye & Dental Care" },

  utility: {
    callClinic: "Call Clinic",
    call: "Call",
    whatsapp: "WhatsApp",
    directions: "Get Directions",
    ariaCall: "Call Vishvaas Clinic at",
    ariaWhatsApp: "WhatsApp Vishvaas Clinic front desk",
    ariaDirections: "Get directions to Vishvaas Clinic on Google Maps",
  },

  nav: {
    eyeCare: "Eye Care",
    dentalCare: "Dental Care",
    whyUs: "Why Us",
    doctor: "Our Doctors",
    testimonials: "Testimonials",
    contact: "Contact",
    ariaPrimary: "Primary",
    ariaMobile: "Mobile",
    menuOpen: "Open menu",
    menuClose: "Close menu",
  },

  cta: {
    bookAppointment: "Book Appointment",
    requestAppointment: "Request Appointment",
    requestAnAppointment: "Request an Appointment",
    requestConsultation: "Request Consultation",
    /** Primary slide/contact CTA — clinic-approved exact wording. */
    scheduleVisit: "Schedule Your Visit",
    whatsappUs: "WhatsApp Us",
    callClinic: "Call Clinic",
    getDirections: "Get Directions",
    askDental: "Ask About Dental Care",
  },

  hero: {
    ariaLabel: "Clinic introduction",
    /** Kept — shared with the mobile bottom navigation call button. */
    callChipAria: "Call the clinic at",
    prev: "Previous slide",
    next: "Next slide",
    counter: (pos: number, total: number) => `Slide ${pos} of ${total}`,
    liveRegion: (pos: number, total: number, label: string) =>
      `Slide ${pos} of ${total}: ${label}`,
    dotLabel: (label: string) => `Go to slide: ${label}`,
    /** Autoplay control — visible pause/play button (exact required labels). */
    pause: "Pause slideshow",
    play: "Play slideshow",
    /** Slide copy — clinic-supplied, verbatim (EN). */
    slides: {
      eyeIntro: {
        navLabel: "Eye Care",
        eyebrow: "VISHVAAS CLINIC",
        heading: "Clearer vision begins with thoughtful care.",
        copy:
          "Personalised support for routine eye examinations, cataract care, glaucoma care and urgent eye-care needs.",
        primary: "Book Eye Consultation",
        secondary: "Explore Eye Care",
      },
      eyeExam: {
        navLabel: "Eye Examination",
        eyebrow: "EYE CARE",
        heading: "Eye care that begins with a careful examination.",
        copy:
          "A clear, comfortable consultation process designed around your concerns and next steps.",
        primary: "Book Eye Consultation",
        secondary: "Explore Eye Care",
      },
      dentalIntro: {
        navLabel: "Dental Care",
        eyebrow: "DENTAL CARE",
        heading: "Comfortable dental care for every smile.",
        copy:
          "Request a dental consultation and our clinic team will help confirm a suitable visit time.",
        primary: "Book Dental Consultation",
        secondary: "Explore Dental Care",
      },
      dentalRoom: {
        navLabel: "Dental Environment",
        eyebrow: "VISHVAAS CLINIC",
        heading: "Care that makes every visit easier.",
        copy:
          "A patient-first approach to dental consultations, designed for clarity, comfort and confidence.",
        primary: "Book Dental Consultation",
        secondary: "Explore Dental Care",
      },
    },
  },

  services: {
    ariaLabel: "Eye care services",
    eyebrow: "Eye Care Services",
    titleA: "Empathetic and compassionate care for",
    titleAccent: "every eye",
    titleB: "that walks in.",
    lede: "Four core consultation categories, explained simply — so you know what to ask for when you contact the front desk.",
    illustrativeTag: "Illustrative image",
    items: [
      {
        title: "Cataract Care",
        blurb:
          "Consultation and guidance for cataract-related vision concerns, with clear next steps explained by the care team.",
      },
      {
        title: "Glaucoma Care",
        blurb:
          "Early detection, monitoring and medical and surgical management of glaucoma.",
      },
      {
        title: "Comprehensive Eye Examination",
        blurb:
          "A thorough check of your vision and eye health, so small concerns are noticed before they grow.",
      },
      {
        title: "Emergency Eye Care",
        blurb:
          "Urgent attention for eye injuries or sudden changes in vision. Call the clinic straight away for guidance.",
      },
    ],
    stripQ: "Not sure which consultation you need?",
    stripA: "Describe your concern — the front desk will guide you.",
  },

  dental: {
    ariaLabel: "Dental care",
    eyebrow: "Dental Care",
    titleA: "Dental services, beside the eye clinic",
    titleAccent: "you already trust.",
    body: "Vishvaas Clinic also offers dental care at the same address. Details about available dental consultations and schedules are shared personally by our front desk — message us and we will guide you.",
    items: [
      {
        title: "Root Canal Treatment",
        blurb:
          "Pain-free root canal therapy to save and restore damaged teeth.",
      },
      {
        title: "Dental Implants",
        blurb:
          "Permanent, natural-looking tooth replacement with dental implants.",
      },
      {
        title: "Teeth Whitening",
        blurb:
          "Professional teeth whitening for a brighter, more confident smile.",
      },
      {
        title: "Dental Veneers",
        blurb:
          "Custom veneers to correct chips, gaps, and discoloration.",
      },
      {
        title: "Orthodontic Treatment",
        blurb:
          "Modern braces and clear aligners to straighten teeth effectively.",
      },
      {
        title: "Periodontal Care",
        blurb:
          "Treatment and prevention of gum disease for healthy gums and teeth.",
      },
    ],
  },

  trust: {
    ariaLabel: "Why choose Vishvaas Clinic",
    eyebrow: "Why Choose Us",
    titleA: "Simple, honest care —",
    titleAccent: "close to home.",
    lede: "No tall claims. Just a neighbourhood clinic that answers promptly, explains clearly and respects your time.",
    points: [
      {
        title: "Patient-focused consultation",
        body: "Time to describe your concern in your own words, and answers you can actually understand.",
      },
      {
        title: "Convenient Dehradun location",
        body: "On Sahastradhara Road at Vikas Lok, Lane No. 2 — easy to reach, easy to spot.",
      },
      {
        title: "Clear appointment coordination",
        body: "Requests come straight to our WhatsApp front desk, and a real person confirms your slot.",
      },
      {
        title: "Support for common eye-care needs",
        body: "From routine examinations to cataract and glaucoma consultations, under one roof.",
      },
    ],
  },

  doctor: {
    ariaLabel: "About Dr. Himanshu Arora",
    eyebrow: "Meet the Doctor",
    accent: "— care, explained.",
    intro:
      "Dr. Himanshu Arora consults at Vishvaas Clinic on Sahastradhara Road, Dehradun — seeing patients for cataract care, glaucoma care, comprehensive eye examinations and urgent eye-care needs.",
    profileNote:
      "Professional profile details to be confirmed — qualifications, memberships and experience will be published here once verified with the clinic.",
    approachNote:
      "Consultation approach and background — a short note on how consultations are conducted will appear here shortly.",
    cta: "Request a Consultation",
    credentialsNote: "Credentials to be confirmed by the clinic",
    photoAlt: "Dr. Himanshu Arora, consulting doctor at Vishvaas Clinic in Dehradun",
  },

  /** "Brands We Use" — credibility section (copy supplied verbatim by the clinic). */
  brands: {
    ariaLabel: "Brands used in our clinical care",
    eyebrow: "TRUSTED CLINICAL BRANDS",
    title: "Brands We Use in Our Clinical Care",
    lede:
      "A curated selection of lens, diagnostic, equipment and pharmaceutical brands used as part of our day-to-day clinical care.",
    note: "Brand marks are displayed for identification only. Their use does not imply partnership, endorsement or affiliation.",
  },

  /**
   * "Inside Vishvaas Clinic" gallery — owner-supplied photos only.
   * Eyebrow/title/lede are clinic-supplied, verbatim (EN).
   */
  gallery: {
    ariaLabel: "Inside Vishvaas Clinic",
    eyebrow: "OUR CLINIC",
    title: "Inside Vishvaas Clinic",
    lede:
      "A glimpse of the spaces where we welcome and care for our patients.",
    openImage: "View larger image",
    lightbox: {
      ariaLabel: "Image viewer",
      close: "Close image view",
      prev: "Previous image",
      next: "Next image",
      counter: (pos: number, total: number) => `Image ${pos} of ${total}`,
    },
  },

  testimonials: {
    ariaLabel: "Patient testimonials",
    eyebrow: "Patient Stories",
    titleA: "What our patients",
    titleAccent: "say.",
    lede: "Real experiences shared by patients about their care and consultation experience.",
    readMore: "Read more reviews",
    opensNote: "Opens our Google Business Profile in a new tab.",
    pillCataract: "Cataract Surgery",
    pillDental: "Dental Care",
    sourceLabel: "Google Review",
    dateLabels: {
      "4 months ago": "4 months ago",
      "a year ago": "a year ago",
    } as Record<string, string>,
    ratedAria: "Rated 5 out of 5 stars",
  },

  appointment: {
    ariaLabel: "Request an appointment",
    eyebrow: "Appointment Request",
    titleA: "Request an appointment in",
    titleAccent: "a few simple steps.",
    sub: "Share your preferred date, time, and consultation need. Your request will open directly in WhatsApp for our front desk, who will confirm the available slot.",
    steps: [
      {
        title: "Share your need",
        body: "Tell us the patient's name, mobile number, preferred date and time, and the service required.",
      },
      {
        title: "It opens in WhatsApp",
        body: "Your request opens directly in WhatsApp for our front desk — just tap Send.",
      },
      {
        title: "We confirm your slot",
        body: "The front desk replies and confirms the available time. Requests are not automatic bookings.",
      },
    ],
    preferTitle: "Prefer to message directly?",
    preferBody:
      "Skip the form — message the front desk on WhatsApp, or call to leave your request.",
    requestOnWhatsApp: "Request Appointment on WhatsApp",
  },

  form: {
    ariaLabel: "Appointment request form",
    labels: {
      name: "Patient Name",
      phone: "Mobile Number",
      date: "Preferred Date",
      time: "Preferred Time",
      service: "Service Required",
      message: "Message / Concern",
    },
    optional: "(optional)",
    captchaLabel: "Security check",
    captchaPlaceholder: "Answer",
    placeholders: {
      name: "Full name",
      phone: "98765 43210",
      message: "Briefly describe your concern (optional)",
      time: "Select a time of day",
      service: "Select a service",
    },
    timeOptions: {
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
      any: "Any time (front desk will confirm)",
    },
    serviceOptionLabels: {
      general: "General Eye Consultation",
      cataract: "Cataract Care",
      glaucoma: "Glaucoma Care",
      exam: "Eye Examination",
      emergency: "Emergency Eye Care",
      dentalConsult: "Dental Consultation",
      dentalGeneral: "General Dental Care",
      urology: "Urology Consultation",
      gastro: "Gastro Consultation",
      other: "Other / Not Sure",
    } as Record<ServiceOptionKey, string>,
    hintDate: "Requests are subject to slot availability.",
    consent:
      "I agree to be contacted by Vishvaas Clinic regarding this appointment request.",
    privacyNote:
      "Please do not share sensitive medical reports or documents through this form. You can discuss them directly at the clinic.",
    submit: "Send Appointment Request",
    submitting: "Opening WhatsApp…",
    underButton:
      "Your appointment request will be sent to our front desk on WhatsApp. Our team will contact you to confirm the available time slot.",
    afterSubmit:
      "WhatsApp is opening with your request. Please tap Send in WhatsApp to complete it. Your appointment is confirmed only after the clinic front desk replies.",
    popupProblem: "Popup did not open?",
    popupLink: "Tap here to open WhatsApp with your request",
    sendAnother: "Send another request",
    emergencyNote:
      "For serious eye injury, sudden vision loss, or urgent medical concerns, please call the clinic or seek emergency medical care. Do not wait for a WhatsApp reply.",
    errors: {
      name: "Please enter the patient's name.",
      nameShort: "Name looks too short.",
      phone: "Please enter a mobile number.",
      phoneInvalid:
        "Please enter a valid Indian mobile number (e.g. 98765 43210).",
      date: "Please choose a preferred date.",
      datePast: "Past dates cannot be requested.",
      time: "Please choose a preferred time of day.",
      service: "Please select the service you need.",
      consent: "Please allow the clinic to contact you about this request.",
      captcha: "Please enter the correct security answer.",
    },
    srNote:
      "This form sends an appointment request to Vishvaas Clinic on WhatsApp. It is a request only; the front desk confirms the final slot.",
    dateLocale: "en-IN",
  },

  contact: {
    ariaLabel: "Contact and location",
    eyebrow: "Contact & Location",
    titleA: "Find us on",
    titleAccent: "Sahastradhara Road.",
    lede: "Look for the VC sign on the compound wall at Vikas Lok, Lane No. 2 — the clinic building is right behind it.",
    hoursLabel: "Hours:",
    seeTimings: "See full timings",
    callBtn: "Call",
    directionsBtn: "Get Directions",
    mapTitle: "Google Maps — Vishvaas Clinic, Sahastradhara Road, Dehradun",
  },

  availability: {
    ariaLabel: "Clinic availability",
    index: "06",
    eyebrow: "Availability",
    titlePrefix: "Availability –",
    regularHeading: "Regular Clinic Timings",
    days: "Monday to Saturday",
    slot1: "9:00 AM – 1:00 PM",
    slot2: "3:00 PM – 7:00 PM",
    exceptionHeading: "Visiting Glaucoma Consultation",
    exceptionWhen: "1st & 3rd Thursday of every month",
    exceptionTime: "9:00 AM – 11:00 AM",
    exceptionWhere: "Ramrati Eye Care, Prem Nagar",
    notice:
      "During these hours, Dr. Himanshu Arora is unavailable at Vishvaas Clinic.",
    helper:
      "Please contact the clinic to confirm appointment availability before visiting.",
  },

  footer: {
    tagline:
      "Eye and dental care for the Dehradun community — with unhurried consultations and clear, honest guidance at every step.",
    explore: "Explore",
    visitUs: "Visit Us",
    directionsLink: "Get Directions on Google Maps",
    socialInstagram: "Visit Vishvaas Clinic on Instagram",
    socialFacebook: "Visit Vishvaas Clinic on Facebook",
    disclaimer:
      "Information on this website is for general informational purposes and does not replace professional medical advice. For urgent medical concerns, please contact the clinic or seek appropriate emergency care.",
    rights: "All rights reserved.",
    privacyLabel: "Privacy Policy",
    termsLabel: "Terms & Medical Disclaimer",
  },

  legal: {
    privacy: {
      title: "Privacy Policy",
      description:
        "How Vishvaas Clinic handles the details you share through this website.",
      sections: [
        {
          h: "What we collect",
          p: "When you use the appointment request form on this website, we collect only the details you choose to share: your name, mobile number, preferred date and time, the service you are seeking, and any message you optionally add. This information is used for one purpose only — coordinating your appointment request with the clinic front desk over WhatsApp.",
        },
        {
          h: "No sensitive medical data, please",
          p: "Please do not send medical reports, prescriptions, test results or other sensitive health documents through the website form or WhatsApp. If such information is needed, the clinic will ask you to share it in person during your visit.",
        },
        {
          h: "How your information is handled",
          p: "Your request is delivered to the clinic's own WhatsApp front desk. It is not sold, rented or shared with any third party for marketing. This website itself does not store your form details on a server — the request is composed on your device and sent through WhatsApp.",
        },
        {
          h: "Your choices",
          p: "You may ask us to stop contacting you, or ask that details from an appointment request be disregarded, by messaging the front desk on WhatsApp or by calling the clinic. For any concerns about privacy, please speak with the clinic front desk during your visit.",
        },
        {
          h: "Website analytics & cookies",
          p: "This website does not run advertising trackers. If basic, privacy-respecting analytics are added in the future, this policy will be updated before they are switched on.",
        },
      ],
    },
    terms: {
      title: "Terms of Use & Medical Disclaimer",
      label: "Terms & Medical Disclaimer",
      description:
        "Please read these simple terms before using this website or requesting an appointment.",
      sections: [
        {
          h: "General information only",
          p: "Information on this website is for general informational purposes and does not replace professional medical advice. For urgent medical concerns, please contact the clinic or seek appropriate emergency care.",
        },
        {
          h: "Appointment requests are not confirmations",
          p: "Submitting a request through this website or on WhatsApp is a request only. Your appointment is confirmed solely when the clinic front desk replies and agrees on a time with you. Preferred dates and times you share are indicative and subject to availability.",
        },
        {
          h: "Medical disclaimer",
          p: "Content on this website — including service descriptions — is provided in good faith for general awareness about the clinic's consultation categories. It is not a diagnosis, treatment plan or guarantee of any outcome. Only a consultation at the clinic can establish what care is appropriate for you. In an emergency — for example serious eye injury or sudden vision loss — call the clinic or seek emergency medical care immediately instead of waiting for a WhatsApp reply.",
        },
        {
          h: "Website use",
          p: "The design, text and imagery of this website belong to Vishvaas Clinic or are used with permission / clearly-labelled stock licences. Please do not reproduce clinic photos or branding without permission. We may update these pages from time to time; the latest version will always be published here.",
        },
        {
          h: "Contact",
          p: "For any questions about these terms, contact the front desk or visit us at the clinic address listed on this page.",
        },
      ],
    },
  },

  /**
   * Two-doctor slider (homepage “Meet the Doctors”).
   * Doctor NAMES and photos come from lib/doctors.ts and are never
   * translated; specialty/description/CTA renderings live here.
   */
  doctors: {
    ariaLabel: "Our doctors",
    eyebrow: "Meet the Doctors",
    titleA: "The doctors at",
    titleAccent: "Vishvaas Clinic.",
    /* Phase 3 grouping — subsection headings inside Meet the Doctors. */
    coreLabel: "Core Doctors",
    visitingLabel: "Visiting Specialists",
    prev: "Previous doctor",
    next: "Next doctor",
    dotLabel: (name: string) => `Show ${name}`,
    liveRegion: (pos: number, total: number, name: string) =>
      `Slide ${pos} of ${total}: ${name}`,
    departments: {
      eye: "Eye Care",
      dental: "Dental Care",
      visiting: "Visiting Specialist",
    },
    /* Card credential-row labels (Phase 3). */
    cardLabels: {
      qualifications: "Qualifications",
      registration: "Registration",
      clinic: "Clinic",
      consultingHours: "Consulting Hours",
      availability: "Availability",
      previouslyWith: "Previously associated with",
    },
    regPrefix: "Reg. No.",
    people: {
      "himanshu-arora": {
        role: "Consultant Ophthalmologist",
        focus: "Phaco-Cataract & Glaucoma Consultant",
        credentialLine: "Long-term Anterior Segment Fellowship",
      },
      "shruti-beri-arora": {
        role: "Consultant Dental Surgeon & Periodontist",
      },
      "shalabh-aggarwal": {
        role: "Urologist & Kidney Transplant Surgeon",
        hours: "Monday–Friday: 5:30 PM–7:00 PM",
        saturday: "Saturday: By Appointment",
      },
      "akshay-rawat": {
        role: "Gastroenterologist, Hepatologist & Endoscopist",
        hours: "Monday–Friday: 5:30 PM–6:30 PM",
        saturday: "Saturday: By Appointment",
      },
    } as Record<DoctorId, DoctorText>,
  },

  /** Appointment popup (doctor-aware booking dialog). */
  popup: {
    eyebrow: "Appointment Request",
    /* Launcher-card heading (homepage AppointmentCTA section — unchanged). */
    title: "Schedule Your Visit",
    sub: "Fill out the appointment form and our team will contact you shortly.",
    /* Dialog heading + supporting line (auto-popup spec). */
    heading: "Book an Appointment",
    support: "Schedule your consultation at Vishvaas Clinic.",
    chooseDoctor: "Choose your doctor",
    close: "Close the appointment form",
  },

  wa: {
    quick: {
      general:
        "Hello Vishvaas Clinic,\n\nI would like to request an appointment. Please help me with an available time slot. Thank you.",
      dental:
        "Hello Vishvaas Clinic,\n\nI would like to ask about dental care services at the clinic. Please share the details. Thank you.",
      notSure:
        "Hello Vishvaas Clinic,\n\nI have a question about my eye care needs and I am not sure which consultation I require. Please guide me. Thank you.",
    },
    appointment(d: AppointmentData): string {
      return `Hello Vishvaas Clinic,

I would like to request an appointment.

Preferred Doctor: ${d.doctorName}
Department: ${d.department}

Patient Name: ${d.name}
Mobile Number: ${d.phone}
Preferred Date: ${d.date}
Preferred Time: ${d.time}
Service Required: ${d.service}

Message / Concern:
${d.message?.trim() || "Not provided"}

Please confirm the available appointment slot. Thank you.`;
    },
  },
};

export type Dictionary = typeof en;

const hi: Dictionary = {
  switcher: { label: "भाषा", en: "English", hi: "हिंदी" },
  brand: { descriptor: "नेत्र एवं दंत चिकित्सा" },

  utility: {
    callClinic: "क्लिनिक को कॉल करें",
    call: "कॉल",
    whatsapp: "WhatsApp",
    directions: "दिशा देखें",
    ariaCall: "Vishvaas Clinic को कॉल करें",
    ariaWhatsApp: "Vishvaas Clinic के फ्रंट डेस्क को WhatsApp करें",
    ariaDirections: "Google Maps पर Vishvaas Clinic की दिशा देखें",
  },

  nav: {
    eyeCare: "नेत्र देखभाल",
    dentalCare: "दंत चिकित्सा",
    whyUs: "हम क्यों",
    doctor: "हमारे डॉक्टर",
    testimonials: "मरीज़ों के अनुभव",
    contact: "संपर्क",
    ariaPrimary: "मुख्य नेविगेशन",
    ariaMobile: "मोबाइल मेन्यू",
    menuOpen: "मेन्यू खोलें",
    menuClose: "मेन्यू बंद करें",
  },

  cta: {
    bookAppointment: "अपॉइंटमेंट बुक करें",
    requestAppointment: "अपॉइंटमेंट अनुरोध करें",
    requestAnAppointment: "अपॉइंटमेंट का अनुरोध करें",
    requestConsultation: "परामर्श का अनुरोध करें",
    /** प्राथमिक स्लाइड/संपर्क CTA — क्लिनिक द्वारा अनुमोदित सटीक शब्दावली। */
    scheduleVisit: "अपनी विज़िट शेड्यूल करें",
    whatsappUs: "WhatsApp करें",
    callClinic: "क्लिनिक को कॉल करें",
    getDirections: "दिशा देखें",
    askDental: "दंत चिकित्सा के बारे में पूछें",
  },

  hero: {
    ariaLabel: "परिचय",
    /** रखा गया — मोबाइल बॉटम नेविगेशन कॉल बटन के साथ साझा। */
    callChipAria: "क्लिनिक को इस नंबर पर कॉल करें",
    prev: "पिछली स्लाइड",
    next: "अगली स्लाइड",
    counter: (pos: number, total: number) => `स्लाइड ${pos} / ${total}`,
    liveRegion: (pos: number, total: number, label: string) =>
      `स्लाइड ${pos} / ${total}: ${label}`,
    dotLabel: (label: string) => `स्लाइड पर जाएँ: ${label}`,
    /** ऑटोप्ले नियंत्रण — दिखने वाला पॉज़/प्ले बटन (सटीक अपेक्षित लेबल)। */
    pause: "स्लाइड शो रोकें",
    play: "स्लाइड शो चलाएँ",
    /** स्लाइड कॉपी — क्लिनिक द्वारा दी गई, शब्दशः (हिंदी)। */
    slides: {
      eyeIntro: {
        navLabel: "नेत्र देखभाल",
        eyebrow: "विश्वास क्लिनिक",
        heading: "बेहतर दृष्टि की शुरुआत सोच-समझकर की गई देखभाल से होती है।",
        copy:
          "नियमित नेत्र जांच, मोतियाबिंद देखभाल, ग्लूकोमा देखभाल और तत्काल नेत्र-देखभाल आवश्यकताओं के लिए व्यक्तिगत सहायता।",
        primary: "नेत्र परामर्श बुक करें",
        secondary: "नेत्र देखभाल देखें",
      },
      eyeExam: {
        navLabel: "नेत्र जांच",
        eyebrow: "नेत्र देखभाल",
        heading: "सावधानीपूर्वक जांच से शुरू होने वाली नेत्र देखभाल।",
        copy:
          "आपकी समस्याओं और अगले कदमों को ध्यान में रखकर बनाई गई स्पष्ट और आरामदायक परामर्श प्रक्रिया।",
        primary: "नेत्र परामर्श बुक करें",
        secondary: "नेत्र देखभाल देखें",
      },
      dentalIntro: {
        navLabel: "दंत देखभाल",
        eyebrow: "दंत देखभाल",
        heading: "हर मुस्कान के लिए आरामदायक दंत देखभाल।",
        copy:
          "दंत परामर्श का अनुरोध करें और हमारी क्लिनिक टीम उपयुक्त समय की पुष्टि करने में आपकी सहायता करेगी।",
        primary: "दंत परामर्श बुक करें",
        secondary: "दंत देखभाल देखें",
      },
      dentalRoom: {
        navLabel: "दंत उपचार कक्ष",
        eyebrow: "विश्वास क्लिनिक",
        heading: "ऐसी देखभाल जो हर विज़िट को आसान बनाए।",
        copy:
          "स्पष्टता, आराम और विश्वास के लिए तैयार दंत परामर्श का रोगी-केंद्रित दृष्टिकोण।",
        primary: "दंत परामर्श बुक करें",
        secondary: "दंत देखभाल देखें",
      },
    },
  },

  services: {
    ariaLabel: "नेत्र देखभाल सेवाएँ",
    eyebrow: "नेत्र देखभाल सेवाएँ",
    titleA: "हर उस आँख के लिए सहानुभूतिपूर्ण और करुणामय देखभाल,",
    titleAccent: "जो हमारे पास आती है।",
    titleB: "",
    lede: "चार मुख्य परामर्श श्रेणियाँ, आसान भाषा में — ताकि फ्रंट डेस्क से बात करते समय आपको पता हो कि क्या पूछना है।",
    illustrativeTag: "चित्रणात्मक चित्र",
    items: [
      {
        title: "मोतियाबिंद देखभाल",
        blurb:
          "मोतियाबिंद से जुड़ी दृष्टि समस्याओं के लिए परामर्श और मार्गदर्शन — देखभाल टीम आगे के कदम स्पष्ट रूप से समझाती है।",
      },
      {
        title: "ग्लूकोमा देखभाल",
        blurb:
          "ग्लूकोमा का शुरुआती पता लगाना, निगरानी, तथा चिकित्सकीय एवं शल्य उपचार द्वारा प्रबंधन।",
      },
      {
        title: "पूर्ण नेत्र जांच",
        blurb:
          "आपकी दृष्टि और आँखों के स्वास्थ्य की पूरी जाँच, ताकि छोटी समस्याएँ बड़ी होने से पहले पकड़ में आ जाएँ।",
      },
      {
        title: "आपातकालीन नेत्र देखभाल",
        blurb:
          "आँख की चोट या अचानक दृष्टि बिगड़ने पर तत्काल सहायता। मार्गदर्शन के लिए तुरंत क्लिनिक को कॉल करें।",
      },
    ],
    stripQ: "पता नहीं कि आपको कौन-सा परामर्श चाहिए?",
    stripA: "अपनी समस्या बताएं — फ्रंट डेस्क आपका मार्गदर्शन करेगा।",
  },

  dental: {
    ariaLabel: "दंत चिकित्सा",
    eyebrow: "दंत चिकित्सा",
    titleA: "नेत्र क्लिनिक के साथ, दंत सेवाएँ भी —",
    titleAccent: "जिस पर आपको पहले से भरोसा है।",
    body: "Vishvaas Clinic इसी पते पर दंत चिकित्सा भी उपलब्ध कराता है। उपलब्ध दंत परामर्श और समय-सारणी की जानकारी हमारा फ्रंट डेस्क व्यक्तिगत रूप से साझा करता है — संदेश भेजें, हम आपका मार्गदर्शन करेंगे।",
    items: [
      {
        title: "रूट कैनल ट्रीटमेंट",
        blurb:
          "क्षतिग्रस्त दाँतों को बचाने और पुनर्स्थापित करने के लिए दर्द-रहित रूट कैनल उपचार।",
      },
      {
        title: "डेंटल इम्प्लांट",
        blurb:
          "डेंटल इम्प्लांट के साथ स्थायी, स्वाभाविक दिखने वाले दाँतों का प्रतिस्थापन।",
      },
      {
        title: "टीथ व्हाइटनिंग",
        blurb:
          "अधिक चमकदार, आत्मविश्वास से भरी मुस्कान के लिए पेशेवर टीथ व्हाइटनिंग।",
      },
      {
        title: "डेंटल वीनियर",
        blurb:
          "दाँतों के टूटे हिस्से, गैप और रंग में आए बदलाव को ठीक करने के लिए कस्टम वीनियर।",
      },
      {
        title: "ऑर्थोडॉन्टिक उपचार",
        blurb:
          "दाँतों को प्रभावी ढंग से सीधा करने के लिए आधुनिक ब्रेसेस और क्लियर अलाइनर।",
      },
      {
        title: "पीरियोडॉन्टल देखभाल",
        blurb:
          "स्वस्थ मसूड़ों और दाँतों के लिए मसूड़ों की बीमारी का उपचार और रोकथाम।",
      },
    ],
  },

  trust: {
    ariaLabel: "Vishvaas Clinic क्यों चुनें",
    eyebrow: "हम क्यों",
    titleA: "सरल, ईमानदार देखभाल —",
    titleAccent: "आपके घर के पास।",
    lede: "कोई बड़े दावे नहीं। बस एक मोहल्ले का क्लिनिक, जो तुरंत जवाब देता है, स्पष्ट समझाता है और आपके समय का सम्मान करता है।",
    points: [
      {
        title: "मरीज़ केंद्रित परामर्श",
        body: "अपनी समस्या अपने शब्दों में बताने के लिए पूरा समय, और ऐसे उत्तर जो आप सचमुच समझ सकें।",
      },
      {
        title: "सुविधाजनक देहरादून स्थान",
        body: "सहस्त्रधारा रोड पर विकास लोक, लेन नंबर 2 — पहुँचने में आसान, पहचानने में आसान।",
      },
      {
        title: "स्पष्ट अपॉइंटमेंट समन्वय",
        body: "अनुरोध सीधे हमारे WhatsApp फ्रंट डेस्क पर आता है, और एक वास्तविक व्यक्ति आपका स्लॉट पक्का करता है।",
      },
      {
        title: "सामान्य नेत्र-देखभाल ज़रूरतों के लिए सहायता",
        body: "नियमित नेत्र जांच से लेकर मोतियाबिंद और ग्लूकोमा परामर्श तक — एक ही छत के नीचे।",
      },
    ],
  },

  doctor: {
    ariaLabel: "डॉ. हिमांशु अरोड़ा के बारे में",
    eyebrow: "हमारे डॉक्टर से मिलें",
    accent: "— देखभाल, समझाकर।",
    intro:
      "डॉ. हिमांशु अरोड़ा Vishvaas Clinic, सहस्त्रधारा रोड, देहरादून में परामर्श करते हैं — मोतियाबिंद देखभाल, ग्लूकोमा देखभाल, पूर्ण नेत्र जांच और आपातकालीन नेत्र-देखभाल के लिए।",
    profileNote:
      "प्रोफ़ाइल की पेशेवर जानकारी पुष्टि के लिए लंबित है — योग्यताएँ, मेंबरशिप और अनुभव क्लिनिक से सत्यापित होने के बाद यहाँ प्रकाशित होंगे।",
    approachNote:
      "परामर्श का तरीका और पृष्ठभूमि — परामर्श कैसे होते हैं, इस पर संक्षिप्त जानकारी शीघ्र ही यहाँ जोड़ी जाएगी।",
    cta: "परामर्श का अनुरोध करें",
    credentialsNote: "क्रेडेंशियल क्लिनिक द्वारा पुष्टि के लिए लंबित हैं",
    photoAlt: "डॉ. हिमांशु अरोड़ा, देहरादून के Vishvaas Clinic में सलाहकार डॉक्टर",
  },

  /** "Brands We Use" — कॉम्पैक्ट क्रेडिबिलिटी सेक्शन (कॉपी क्लिनिक-निर्धारित)। */
  brands: {
    ariaLabel: "हमारी क्लिनिकल देखभाल में उपयोग किए जाने वाले ब्रांड",
    eyebrow: "विश्वसनीय क्लिनिकल ब्रांड",
    title: "हमारी क्लिनिकल देखभाल में उपयोग किए जाने वाले ब्रांड",
    lede:
      "हमारी दैनिक क्लिनिकल देखभाल में उपयोग किए जाने वाले लेंस, डायग्नोस्टिक, उपकरण और फार्मास्यूटिकल ब्रांडों का चयन।",
    note: "ब्रांड चिह्न केवल पहचान के लिए प्रदर्शित किए गए हैं; इससे साझेदारी, समर्थन या संबद्धता का संकेत नहीं मिलता।",
  },

  /**
   * "Inside Vishvaas Clinic" गैलरी — केवल क्लिनिक-प्रदत्त तस्वीरें।
   * आइब्रो/शीर्षक/परिचय क्लिनिक द्वारा दिए गए, शब्दशः (हिन्दी)।
   */
  gallery: {
    ariaLabel: "विश्वास क्लिनिक की एक झलक",
    eyebrow: "हमारा क्लिनिक",
    title: "विश्वास क्लिनिक की एक झलक",
    lede:
      "उन स्थानों की एक झलक जहाँ हम अपने मरीजों का स्वागत और देखभाल करते हैं।",
    openImage: "बड़ी तस्वीर देखें",
    lightbox: {
      ariaLabel: "तस्वीर दृश्य",
      close: "तस्वीर दृश्य बंद करें",
      prev: "पिछली तस्वीर",
      next: "अगली तस्वीर",
      counter: (pos: number, total: number) => `तस्वीर ${pos} / ${total}`,
    },
  },

  testimonials: {
    ariaLabel: "मरीज़ों के अनुभव",
    eyebrow: "मरीज़ों की कहानियाँ",
    titleA: "हमारे मरीज़",
    titleAccent: "क्या कहते हैं।",
    lede: "अपनी देखभाल और परामर्श के अनुभव को लेकर मरीज़ों के असली विचार।",
    readMore: "और समीक्षाएँ पढ़ें",
    opensNote: "नए टैब में हमारी Google बिज़नेस प्रोफ़ाइल खुलेगी।",
    pillCataract: "मोतियाबिंद सर्जरी",
    pillDental: "दंत चिकित्सा",
    sourceLabel: "Google समीक्षा",
    dateLabels: {
      "4 months ago": "4 महीने पहले",
      "a year ago": "एक साल पहले",
    } as Record<string, string>,
    ratedAria: "5 में से 5 स्टार मूल्यांकित",
  },

  appointment: {
    ariaLabel: "अपॉइंटमेंट का अनुरोध करें",
    eyebrow: "अपॉइंटमेंट अनुरोध",
    titleA: "कुछ आसान चरणों में",
    titleAccent: "अपॉइंटमेंट का अनुरोध करें।",
    sub: "अपनी पसंदीदा तारीख़, समय और परामर्श की ज़रूरत बताएं। आपका अनुरोध सीधे हमारे फ्रंट डेस्क के WhatsApp पर खुलेगा, जो उपलब्ध स्लॉट की पुष्टि करेगा।",
    steps: [
      {
        title: "अपनी ज़रूरत बताएं",
        body: "मरीज़ का नाम, मोबाइल नंबर, पसंदीदा तारीख़ और समय, तथा आवश्यक सेवा बताएं।",
      },
      {
        title: "अनुरोध WhatsApp पर खुलेगा",
        body: "आपका अनुरोध सीधे फ्रंट डेस्क के WhatsApp पर खुलता है — बस Send दबाएं।",
      },
      {
        title: "हम आपका स्लॉट पक्का करेंगे",
        body: "फ्रंट डेस्क जवाब देकर उपलब्ध समय की पुष्टि करता है। अनुरोध स्वतः बुकिंग नहीं है।",
      },
    ],
    preferTitle: "सीधे संदेश भेजना चाहेंगे?",
    preferBody:
      "फॉर्म छोड़ें — WhatsApp पर फ्रंट डेस्क को संदेश भेजें, या अनुरोध दर्ज करने के लिए कॉल करें।",
    requestOnWhatsApp: "WhatsApp पर अपॉइंटमेंट का अनुरोध करें",
  },

  form: {
    ariaLabel: "अपॉइंटमेंट अनुरोध फ़ॉर्म",
    labels: {
      name: "मरीज़ का नाम",
      phone: "मोबाइल नंबर",
      date: "पसंदीदा तारीख़",
      time: "पसंदीदा समय",
      service: "आवश्यक सेवा",
      message: "संदेश / समस्या",
    },
    optional: "(वैकल्पिक)",
    captchaLabel: "सुरक्षा जाँच",
    captchaPlaceholder: "उत्तर",
    placeholders: {
      name: "पूरा नाम",
      phone: "98765 43210",
      message: "अपनी समस्या संक्षेप में बताएं (वैकल्पिक)",
      time: "दिन का समय चुनें",
      service: "सेवा चुनें",
    },
    timeOptions: {
      morning: "सुबह",
      afternoon: "दोपहर",
      evening: "शाम",
      any: "कोई भी समय (फ्रंट डेस्क पुष्टि करेगा)",
    },
    serviceOptionLabels: {
      general: "सामान्य नेत्र परामर्श",
      cataract: "मोतियाबिंद देखभाल",
      glaucoma: "ग्लूकोमा देखभाल",
      exam: "नेत्र जांच",
      emergency: "आपातकालीन नेत्र देखभाल",
      dentalConsult: "दंत परामर्श",
      dentalGeneral: "सामान्य दंत देखभाल",
      urology: "यूरोलॉजी परामर्श",
      gastro: "गैस्ट्रो परामर्श",
      other: "अन्य / पता नहीं",
    } as Record<ServiceOptionKey, string>,
    hintDate: "अनुरोध स्लॉट की उपलब्धता के अधीन हैं।",
    consent:
      "मैं इस अपॉइंटमेंट अनुरोध के संबंध में Vishvaas Clinic द्वारा संपर्क किए जाने के लिए सहमत हूँ।",
    privacyNote:
      "कृपया इस फ़ॉर्म के ज़रिए संवेदनशील चिकित्सा रिपोर्ट या दस्तावेज़ साझा न करें। इन पर आप क्लिनिक में सीधे चर्चा कर सकते हैं।",
    submit: "अपॉइंटमेंट अनुरोध भेजें",
    submitting: "WhatsApp खुल रहा है…",
    underButton:
      "आपका अपॉइंटमेंट अनुरोध हमारे फ्रंट डेस्क को WhatsApp पर भेजा जाएगा। हमारी टीम उपलब्ध समय की पुष्टि के लिए आपसे संपर्क करेगी।",
    afterSubmit:
      "आपके अनुरोध के साथ WhatsApp खुल रहा है। कृपया WhatsApp में Send दबाकर इसे पूरा करें। क्लिनिक के फ्रंट डेस्क से जवाब आने के बाद ही अपॉइंटमेंट पक्का माना जाएगा।",
    popupProblem: "पॉपअप नहीं खुला?",
    popupLink: "अपने अनुरोध के साथ WhatsApp खोलने के लिए यहाँ टैप करें",
    sendAnother: "एक और अनुरोध भेजें",
    emergencyNote:
      "गंभीर आँख की चोट, अचानक दृष्टि हानि या किसी तत्काल चिकित्सा समस्या की स्थिति में कृपया क्लिनिक को कॉल करें या आपातकालीन चिकित्सा सहायता लें। WhatsApp के जवाब का इंतज़ार न करें।",
    errors: {
      name: "कृपया मरीज़ का नाम दर्ज करें।",
      nameShort: "नाम बहुत छोटा लगता है।",
      phone: "कृपया मोबाइल नंबर दर्ज करें।",
      phoneInvalid: "कृपया मान्य भारतीय मोबाइल नंबर दर्ज करें (जैसे 98765 43210)।",
      date: "कृपया पसंदीदा तारीख़ चुनें।",
      datePast: "बीती हुई तारीख़ का अनुरोध नहीं किया जा सकता।",
      time: "कृपया दिन का पसंदीदा समय चुनें।",
      service: "कृपया आवश्यक सेवा चुनें।",
      consent: "कृपया इस अनुरोध के संबंध में संपर्क की अनुमति दें।",
      captcha: "कृपया सही सुरक्षा उत्तर दर्ज करें।",
    },
    srNote:
      "यह फ़ॉर्म Vishvaas Clinic को WhatsApp पर अपॉइंटमेंट का अनुरोध भेजता है। यह केवल अनुरोध है; अंतिम स्लॉट फ्रंट डेस्क पक्का करता है।",
    dateLocale: "hi-IN",
  },

  contact: {
    ariaLabel: "संपर्क और स्थान",
    eyebrow: "संपर्क एवं स्थान",
    titleA: "हमें खोजें",
    titleAccent: "सहस्त्रधारा रोड पर।",
    lede: "विकास लोक, लेन नंबर 2 पर चारदीवारी पर लगे VC साइन को देखें — क्लिनिक बिल्डिंग ठीक उसके पीछे है।",
    hoursLabel: "समय:",
    seeTimings: "पूरी समय-सारणी देखें",
    callBtn: "कॉल करें",
    directionsBtn: "दिशा देखें",
    mapTitle: "Google Maps — Vishvaas Clinic, सहस्त्रधारा रोड, देहरादून",
  },

  availability: {
    ariaLabel: "क्लिनिक की उपलब्धता",
    index: "06",
    eyebrow: "उपलब्धता",
    titlePrefix: "उपलब्धता –",
    regularHeading: "नियमित क्लिनिक समय",
    days: "सोमवार से शनिवार",
    slot1: "9:00 AM – 1:00 PM",
    slot2: "3:00 PM – 7:00 PM",
    exceptionHeading: "विज़िटिंग ग्लूकोमा परामर्श",
    exceptionWhen: "हर महीने की पहली और तीसरी गुरुवार",
    exceptionTime: "9:00 AM – 11:00 AM",
    exceptionWhere: "रामरती आई केयर, प्रेम नगर",
    notice:
      "इन घंटों के दौरान डॉ. हिमांशु अरोड़ा Vishvaas Clinic में उपलब्ध नहीं होंगे।",
    helper:
      "जाने से पहले कृपया क्लिनिक से अपॉइंटमेंट की उपलब्धता की पुष्टि कर लें।",
  },

  footer: {
    tagline:
      "देहरादून समुदाय के लिए नेत्र एवं दंत देखभाल — बिना जल्दबाज़ी वाले परामर्श और हर कदम पर स्पष्ट, ईमानदार मार्गदर्शन के साथ।",
    explore: "साइट देखें",
    visitUs: "हमसे मिलें",
    directionsLink: "Google Maps पर दिशा देखें",
    socialInstagram: "इंस्टाग्राम पर विश्वास क्लिनिक देखें",
    socialFacebook: "फेसबुक पर विश्वास क्लिनिक देखें",
    disclaimer:
      "इस वेबसाइट की जानकारी केवल सामान्य जानकारी के उद्देश्य से है और यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है। किसी तत्काल चिकित्सा समस्या में कृपया क्लिनिक से संपर्क करें या उचित आपातकालीन देखभाल लें।",
    rights: "सर्वाधिकार सुरक्षित।",
    privacyLabel: "गोपनीयता नीति",
    termsLabel: "शर्तें एवं चिकित्सा अस्वीकरण",
  },

  legal: {
    privacy: {
      title: "गोपनीयता नीति",
      description:
        "इस वेबसाइट के ज़रिए साझा किए गए विवरण को Vishvaas Clinic कैसे संभालता है।",
      sections: [
        {
          h: "हम क्या एकत्र करते हैं",
          p: "इस वेबसाइट के अपॉइंटमेंट अनुरोध फ़ॉर्म का उपयोग करने पर हम केवल वही विवरण एकत्र करते हैं जो आप साझा करना चुनते हैं: आपका नाम, मोबाइल नंबर, पसंदीदा तारीख़ और समय, आवश्यक सेवा, तथा वैकल्पिक संदेश। इस जानकारी का उपयोग केवल एक उद्देश्य के लिए होता है — WhatsApp के ज़रिए आपके अपॉइंटमेंट अनुरोध का क्लिनिक फ्रंट डेस्क के साथ समन्वय।",
        },
        {
          h: "संवेदनशील चिकित्सा विवरण न भेजें",
          p: "कृपया वेबसाइट फ़ॉर्म या WhatsApp के ज़रिए चिकित्सा रिपोर्ट, पर्चे, टेस्ट रिपोर्ट या अन्य संवेदनशील स्वास्थ्य दस्तावेज़ न भेजें। यदि ऐसी जानकारी आवश्यक हो, तो क्लिनिक आपसे विज़िट के दौरान व्यक्तिगत रूप से साझा करने को कहेगा।",
        },
        {
          h: "आपकी जानकारी कैसे संभाली जाती है",
          p: "आपका अनुरोध क्लिनिक के अपने WhatsApp फ्रंट डेस्क पर पहुँचता है। इसे मार्केटिंग के लिए किसी तीसरे पक्ष को बेचा, किराए पर दिया या साझा नहीं किया जाता। यह वेबसाइट स्वयं आपके फ़ॉर्म विवरण सर्वर पर संग्रहित नहीं करती — अनुरोध आपके डिवाइस पर तैयार होकर WhatsApp के ज़रिए भेजा जाता है।",
        },
        {
          h: "आपके विकल्प",
          p: "आप हमसे संपर्क रोकने का अनुरोध कर सकते हैं, या किसी अपॉइंटमेंट अनुरोध के विवरण को नज़रअंदाज़ करने को कह सकते हैं — इसके लिए WhatsApp पर फ्रंट डेस्क को संदेश भेजें या क्लिनिक को कॉल करें। गोपनीयता संबंधी किसी भी चिंता के लिए कृपया विज़िट के दौरान फ्रंट डेस्क से बात करें।",
        },
        {
          h: "वेबसाइट एनालिटिक्स एवं कुकीज़",
          p: "यह वेबसाइट विज्ञापन ट्रैकर नहीं चलाती। भविष्य में यदि गोपनीयता-सम्मानीय बुनियादी एनालिटिक्स जोड़े जाते हैं, तो उन्हें चालू करने से पहले यह नीति अपडेट की जाएगी।",
        },
      ],
    },
    terms: {
      title: "उपयोग की शर्तें एवं चिकित्सा अस्वीकरण",
      label: "शर्तें एवं चिकित्सा अस्वीकरण",
      description:
        "इस वेबसाइट का उपयोग करने या अपॉइंटमेंट का अनुरोध करने से पहले कृपया ये सरल शर्तें पढ़ें।",
      sections: [
        {
          h: "केवल सामान्य जानकारी",
          p: "इस वेबसाइट की जानकारी केवल सामान्य जानकारी के उद्देश्य से है और यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है। किसी तत्काल चिकित्सा समस्या में कृपया क्लिनिक से संपर्क करें या उचित आपातकालीन देखभाल लें।",
        },
        {
          h: "अपॉइंटमेंट अनुरोध पुष्टि नहीं है",
          p: "इस वेबसाइट या WhatsApp के ज़रिए अनुरोध भेजना केवल अनुरोध है। आपका अपॉइंटमेंट तभी पक्का माना जाएगा जब क्लिनिक फ्रंट डेस्क जवाब देकर आपके साथ समय तय करे। आपके द्वारा बताई गई पसंदीदा तारीख़ और समय सांकेतिक हैं और उपलब्धता के अधीन हैं।",
        },
        {
          h: "चिकित्सा अस्वीकरण",
          p: "इस वेबसाइट की सामग्री — सेवा विवरण सहित — क्लिनिक की परामर्श श्रेणियों के बारे में सामान्य जागरूकता के लिए सद्भावना से दी गई है। यह कोई निदान, उपचार योजना या किसी परिणाम की गारंटी नहीं है। आपके लिए कौन-सी देखभाल उचित है, यह केवल क्लिनिक में परामर्श से ही तय हो सकता है। आपात स्थिति में — जैसे गंभीर आँख की चोट या अचानक दृष्टि हानि — WhatsApp के जवाब का इंतज़ार करने के बजाय तुरंत क्लिनिक को कॉल करें या आपातकालीन चिकित्सा सहायता लें।",
        },
        {
          h: "वेबसाइट का उपयोग",
          p: "इस वेबसाइट की डिज़ाइन, सामग्री और चित्र Vishvaas Clinic की संपत्ति हैं या अनुमति / स्पष्ट रूप से लेबल किए गए लाइसेंस के साथ उपयोग किए गए हैं। कृपया क्लिनिक की तस्वीरें या ब्रांडिंग बिना अनुमति पुनः उपयोग न करें। हम समय-समय पर इन पृष्ठों को अपडेट कर सकते हैं; नवीनतम संस्करण हमेशा यहीं प्रकाशित होगा।",
        },
        {
          h: "संपर्क",
          p: "इन शर्तों के बारे में किसी भी प्रश्न के लिए फ्रंट डेस्क से संपर्क करें या इस पृष्ठ पर दिए गए क्लिनिक पते पर हमसे मिलें।",
        },
      ],
    },
  },

  /**
   * दो-डॉक्टर स्लाइडर (होमपेज “हमारे डॉक्टर”)। डॉक्टर के नाम और फ़ोटो
   * lib/doctors.ts से आते हैं और अनूदित नहीं होते।
   */
  doctors: {
    ariaLabel: "हमारे डॉक्टर",
    eyebrow: "हमारे डॉक्टरों से मिलें",
    titleA: "Vishvaas Clinic के",
    titleAccent: "डॉक्टर।",
    /* Phase 3 ग्रुपिंग — Meet the Doctors के भीतर सब-सेक्शन शीर्षक। */
    coreLabel: "मुख्य डॉक्टर",
    visitingLabel: "विज़िटिंग विशेषज्ञ",
    prev: "पिछले डॉक्टर",
    next: "अगले डॉक्टर",
    dotLabel: (name: string) => `${name} दिखाएँ`,
    liveRegion: (pos: number, total: number, name: string) =>
      `स्लाइड ${pos} / ${total}: ${name}`,
    departments: {
      eye: "नेत्र देखभाल",
      dental: "दंत चिकित्सा",
      visiting: "विज़िटिंग विशेषज्ञ",
    },
    /* कार्ड क्रेडेंशियल-पंक्ति लेबल (Phase 3)। */
    cardLabels: {
      qualifications: "योग्यताएँ",
      registration: "पंजीकरण",
      clinic: "क्लिनिक",
      consultingHours: "परामर्श समय",
      availability: "उपलब्धता",
      previouslyWith: "पूर्व में संबद्ध",
    },
    regPrefix: "पंजीकरण सं.",
    people: {
      "himanshu-arora": {
        role: "सलाहकार नेत्र रोग विशेषज्ञ",
        focus: "फैको-मोतियाबिंद एवं ग्लूकोमा सलाहकार",
        credentialLine: "दीर्घकालीन एंटीरियर सेगमेंट फेलोशिप",
      },
      "shruti-beri-arora": {
        role: "सलाहकार दंत सर्जन एवं पीरियोडोन्टिस्ट",
      },
      "shalabh-aggarwal": {
        role: "यूरोलॉजिस्ट एवं किडनी ट्रांसप्लांट सर्जन",
        hours: "सोमवार–शुक्रवार: शाम 5:30 – 7:00 बजे",
        saturday: "शनिवार: अपॉइंटमेंट पर",
      },
      "akshay-rawat": {
        role: "गैस्ट्रोएंटरोलॉजिस्ट, हेपेटोलॉजिस्ट एवं एंडोस्कोपिस्ट",
        hours: "सोमवार–शुक्रवार: शाम 5:30 – 6:30 बजे",
        saturday: "शनिवार: अपॉइंटमेंट पर",
      },
    } as Record<DoctorId, DoctorText>,
  },

  /** अपॉइंटमेंट पॉपअप (डॉक्टर-आधारित बुकिंग डायलॉग)। */
  popup: {
    eyebrow: "अपॉइंटमेंट अनुरोध",
    /* लॉन्चर-कार्ड शीर्षक (होमपेज AppointmentCTA सेक्शन — अपरिवर्तित)। */
    title: "अपनी विज़िट शेड्यूल करें",
    sub: "अपॉइंटमेंट फ़ॉर्म भरें और हमारी टीम शीघ्र ही आपसे संपर्क करेगी।",
    /* डायलॉग शीर्षक + सहायक पंक्ति (ऑटो-पॉपअप स्पेक)। */
    heading: "अपॉइंटमेंट बुक करें",
    support: "Vishvaas Clinic में अपना परामर्श शेड्यूल करें।",
    chooseDoctor: "अपना डॉक्टर चुनें",
    close: "अपॉइंटमेंट फ़ॉर्म बंद करें",
  },

  wa: {
    quick: {
      general:
        "नमस्ते Vishvaas Clinic,\n\nमैं अपॉइंटमेंट का अनुरोध करना चाहता/चाहती हूँ। कृपया उपलब्ध समय स्लॉट बताने में मदद करें। धन्यवाद।",
      dental:
        "नमस्ते Vishvaas Clinic,\n\nमैं क्लिनिक की दंत चिकित्सा सेवाओं के बारे में जानना चाहता/चाहती हूँ। कृपया विवरण साझा करें। धन्यवाद।",
      notSure:
        "नमस्ते Vishvaas Clinic,\n\nमेरी नेत्र देखभाल को लेकर एक प्रश्न है और मुझे समझ नहीं आ रहा कि मुझे कौन-सा परामर्श चाहिए। कृपया मार्गदर्शन करें। धन्यवाद।",
    },
    appointment(d: AppointmentData): string {
      return `नमस्ते Vishvaas Clinic,

मैं अपॉइंटमेंट का अनुरोध करना चाहता/चाहती हूँ।

पसंदीदा डॉक्टर: ${d.doctorName}
विभाग: ${d.department}

मरीज़ का नाम: ${d.name}
मोबाइल नंबर: ${d.phone}
पसंदीदा तारीख: ${d.date}
पसंदीदा समय: ${d.time}
आवश्यक सेवा: ${d.service}

संदेश / समस्या:
${d.message?.trim() || "उपलब्ध नहीं"}

कृपया उपलब्ध अपॉइंटमेंट समय की पुष्टि करें। धन्यवाद।`;
    },
  },
};

export const translations: Record<Locale, Dictionary> = { en, hi };
