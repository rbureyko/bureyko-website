// The website's own forms (they replaced the embedded Jotforms in November 2026).
// One definition is used twice: the website builds the form from it, and the Worker checks each
// submission against it before emailing Robin and sending the person their reply (replies.js).
// Questions, answer choices and consent wording are copied from the Jotforms they replaced.

export const GUIDE_URL = "https://drive.google.com/file/d/1NimInWCEXu-ZANON7Jpl_9ltPjrsRLl8/view?usp=sharing";

const clientType = { id: "clientType", type: "radio", label: "Are you a current client or new to Bureyko Mortgage Partners?", required: true, options: ["Current client", "New client"] };
const heardAbout = { id: "heardAbout", type: "radio", label: "How did you hear about us?", required: true, options: ["Referral", "Online search", "Social media", "Event or seminar"], other: true };
const tipsConsent = { id: "consent", type: "consent", label: "Yes, Bureyko Mortgage Partners can send me mortgage tips and updates by email and text. I can unsubscribe anytime.", required: false };

export const SITE_FORMS = {
  guide: {
    title: "First-Time Home Buyer Guide",
    heading: "Get your free First-Time Home Buyer Guide",
    button: "Send me the guide",
    fields: [
      { id: "name", type: "name", label: "Full Name", required: true },
      { id: "email", type: "email", label: "Email Address", required: true },
      { id: "phone", type: "phone", label: "Phone Number", required: false },
      clientType, heardAbout, tipsConsent,
    ],
  },
  renewal: {
    title: "Mortgage Renewal Check-Up",
    heading: "Book your free Mortgage Renewal Check-Up",
    button: "Book my check-up",
    fields: [
      { id: "name", type: "name", label: "Full Name", required: true },
      { id: "email", type: "email", label: "Email Address", required: true },
      { id: "phone", type: "phone", label: "Phone Number", required: true },
      { id: "renewalDate", type: "date", label: "Mortgage Renewal Date", required: true },
      { id: "address", type: "address", label: "Address", required: false },
      clientType, heardAbout, tipsConsent,
    ],
  },
  crew: {
    title: "Break Up With Renting: Founding Crew",
    heading: "Break Up With Renting: Founding Crew",
    intro: "A free 6-month program to help you go from renting to owning, one small step at a time. It kicks off in January 2027 with the Credit Glow-Up, and you graduate in June with a pre-approval that shows your real numbers. Only 50 founding spots, and you're one of the first, so tell us what works and what doesn't.",
    button: "I'm in",
    fields: [
      { id: "name", type: "name", label: "Name", required: true },
      { id: "phone", type: "phone", label: "Mobile phone number", required: true },
      { id: "email", type: "email", label: "Email address", required: true },
      { id: "instagram", type: "text", label: "Instagram handle", required: false },
      { id: "buyWhen", type: "radio", label: "When do you think you might want to buy?", required: true, options: ["Within a year", "1-2 years", "3+ years", "No idea yet"] },
      { id: "credit", type: "radio", label: "How do you feel about your credit right now?", required: true, options: ["Pretty good", "Not sure", "Needs work", "I don't have much credit yet"] },
      { id: "messages", type: "radio", label: "How would you like to get your program messages?", required: true, options: ["Text", "Instagram DM", "Email"] },
      { id: "consent", type: "consent", label: "Yes, Bureyko Mortgage Partners can send me texts and emails about Break Up With Renting and related mortgage tips. I can unsubscribe anytime by replying STOP.", required: true },
    ],
  },
};

export const PROVINCES = ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"];

const clip = (s, n) => String(s == null ? "" : s).replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, n);
const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]+$/;

// Check a submission. Returns { ok, firstName, fullName, email, rows } or { ok:false, error:fieldId }.
// rows are label/value pairs for Robin's notification, in the form's order.
export function checkSubmission(formKey, input) {
  const form = SITE_FORMS[formKey];
  if (!form || !input || typeof input !== "object") return { ok: false, error: "form" };
  const rows = [];
  let firstName = "", fullName = "", email = "";
  for (const f of form.fields) {
    const v = input[f.id];
    if (f.type === "name") {
      const first = clip(v && v.first, 60), last = clip(v && v.last, 60);
      if (f.required && (!first || !last)) return { ok: false, error: f.id };
      firstName = first; fullName = [first, last].filter(Boolean).join(" ");
      rows.push({ label: f.label, value: fullName });
    } else if (f.type === "email") {
      const e = clip(v, 254);
      if (!EMAIL_RE.test(e)) return { ok: false, error: f.id };
      email = e; rows.push({ label: f.label, value: e });
    } else if (f.type === "phone") {
      const ph = clip(v, 30);
      if (ph && (ph.replace(/\D/g, "").length < 10 || /[^0-9+().\-\s]/.test(ph))) return { ok: false, error: f.id };
      if (f.required && !ph) return { ok: false, error: f.id };
      if (ph) rows.push({ label: f.label, value: ph });
    } else if (f.type === "date") {
      const d = clip(v, 10);
      if (f.required && !/^\d{4}-\d{2}-\d{2}$/.test(d)) return { ok: false, error: f.id };
      if (d) rows.push({ label: f.label, value: d });
    } else if (f.type === "address") {
      const a = v && typeof v === "object" ? v : {};
      const prov = PROVINCES.includes(a.province) ? a.province : "";
      const parts = [clip(a.street, 120), clip(a.street2, 120), clip(a.city, 60), prov, clip(a.postal, 10).toUpperCase()].filter(Boolean);
      if (parts.length > (prov ? 1 : 0)) rows.push({ label: f.label, value: parts.join(", ") });
    } else if (f.type === "text") {
      const t = clip(v, 100);
      if (f.required && !t) return { ok: false, error: f.id };
      if (t) rows.push({ label: f.label, value: t });
    } else if (f.type === "radio") {
      let val = clip(v, 100);
      if (f.other && val === "Other") {
        const o = clip(input[f.id + "Other"], 100);
        val = o ? "Other: " + o : "Other";
      } else if (!f.options.includes(val)) val = "";
      if (f.required && !val) return { ok: false, error: f.id };
      if (val) rows.push({ label: f.label, value: val });
    } else if (f.type === "consent") {
      const yes = v === true;
      if (f.required && !yes) return { ok: false, error: f.id };
      rows.push({ label: "Consent: " + f.label, value: yes ? "Yes" : "Not given" });
    }
  }
  return { ok: true, firstName, fullName, email, rows };
}
