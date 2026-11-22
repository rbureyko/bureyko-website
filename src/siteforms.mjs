// The website's own forms (First-Time Home Buyer Guide, Mortgage Renewal Check-Up, Break Up With Renting
// Founding Crew). Built from worker/src/forms.js, the same definition the Worker checks submissions
// against. Submissions post to the Worker's /form address, which emails Robin and sends the reply.
import fs from "node:fs";
import path from "node:path";
import { SITE_FORMS, PROVINCES, GUIDE_URL } from "../worker/src/forms.js";

const DIR = path.dirname(new URL(import.meta.url).pathname);
const WORKER = JSON.parse(fs.readFileSync(path.join(DIR, "buwr", "content.json"), "utf8")).sendToRobinUrl;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const star = (f) => (f.required ? ` <span class="req" aria-hidden="true">*</span>` : "");

function field(key, f) {
  const id = `${key}-${f.id}`;
  const req = f.required ? " required" : "";
  switch (f.type) {
    case "name":
      return `<fieldset class="sf-field"><legend>${esc(f.label)}${star(f)}</legend><div class="sf-two">
  <label>First name<input id="${id}-first" name="${f.id}.first" autocomplete="given-name"${req}></label>
  <label>Last name<input id="${id}-last" name="${f.id}.last" autocomplete="family-name"${req}></label></div></fieldset>`;
    case "email":
      return `<label class="sf-field"><span>${esc(f.label)}${star(f)}</span><input id="${id}" name="${f.id}" type="email" autocomplete="email"${req}></label>`;
    case "phone":
      return `<label class="sf-field"><span>${esc(f.label)}${star(f)}</span><input id="${id}" name="${f.id}" type="tel" inputmode="tel" autocomplete="tel" pattern="[0-9+().\\-\\s]{10,30}" title="A phone number with area code, e.g. 403-555-0123"${req}></label>`;
    case "date":
      return `<label class="sf-field"><span>${esc(f.label)}${star(f)}</span><input id="${id}" name="${f.id}" type="date"${req}></label>`;
    case "text":
      return `<label class="sf-field"><span>${esc(f.label)}${star(f)}</span><input id="${id}" name="${f.id}" maxlength="100"${req}></label>`;
    case "address":
      return `<fieldset class="sf-field"><legend>${esc(f.label)}${star(f)}</legend>
  <label>Street address<input name="${f.id}.street" autocomplete="address-line1" maxlength="120"></label>
  <label>Street address line 2<input name="${f.id}.street2" autocomplete="address-line2" maxlength="120"></label>
  <div class="sf-two"><label>City<input name="${f.id}.city" autocomplete="address-level2" maxlength="60"></label>
  <label>Province<select name="${f.id}.province" autocomplete="address-level1">${PROVINCES.map((p) => `<option${p === "Alberta" ? " selected" : ""}>${p}</option>`).join("")}</select></label></div>
  <label class="sf-short">Postal code<input name="${f.id}.postal" autocomplete="postal-code" maxlength="7"></label></fieldset>`;
    case "radio":
      return `<fieldset class="sf-field sf-choices"><legend>${esc(f.label)}${star(f)}</legend>
  ${f.options.map((o) => `<label class="sf-choice"><input type="radio" name="${f.id}" value="${esc(o)}"${req}><span>${esc(o)}</span></label>`).join("\n  ")}
  ${f.other ? `<label class="sf-choice"><input type="radio" name="${f.id}" value="Other"${req}><span>Other</span></label>
  <label class="sf-other" hidden>Please tell us<input name="${f.id}Other" maxlength="100"></label>` : ""}</fieldset>`;
    case "consent":
      return `<label class="sf-consent"><input type="checkbox" name="${f.id}"${req}><span>${esc(f.label)}${star(f)}</span></label>`;
  }
  return "";
}

// opts: source (for Robin's notification), success: "guide" | "renewal" | a URL to go to
export function siteForm(key, { source = "", success = "", phone = "403-540-0629", brokerage = "" } = {}) {
  const form = SITE_FORMS[key];
  return `<form class="site-form card" id="form-${key}" data-form="${key}" data-source="${esc(source)}" data-success="${esc(success)}" novalidate>
  <h3 class="sf-heading">${esc(form.heading)}</h3>
  ${form.intro ? `<p>${esc(form.intro)}</p>` : ""}
  <p class="fine"><span class="req" aria-hidden="true">*</span> Required</p>
  ${form.fields.map((f) => field(key, f)).join("\n  ")}
  <div class="sf-hp" aria-hidden="true"><label>Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label></div>
  <button class="btn btn-orange" type="submit">${esc(form.button)}</button>
  <p class="sf-status" role="status" aria-live="polite"></p>
  <p class="fine">Your information is kept private and never sold. Please share only what's asked here; sensitive mortgage documents belong in your secure application.</p>
  ${brokerage ? `<p class="fine">${esc(brokerage)}</p>` : ""}
</form>
<div class="site-form-done card" id="form-${key}-done" hidden tabindex="-1"></div>`;
}

// One script for every form on the page
export const SITE_FORM_SCRIPT = `<script>
(() => {
  const URL_ = ${JSON.stringify(WORKER + "/form")};
  const GUIDE = ${JSON.stringify(GUIDE_URL)};
  const PHONE = "403-540-0629";
  const started = Date.now();
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  document.querySelectorAll(".site-form").forEach((form) => {
    const status = form.querySelector(".sf-status"), btn = form.querySelector("button[type=submit]");
    // "Other" answers get their own box
    form.querySelectorAll(".sf-other").forEach((box) => {
      const fs = box.closest("fieldset"), input = box.querySelector("input");
      fs.addEventListener("change", () => {
        const on = fs.querySelector('input[type=radio][value="Other"]:checked');
        box.hidden = !on; input.required = !!on;
      });
    });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.className = "sf-status";
      if (!form.checkValidity()) {
        const bad = form.querySelector(":invalid");
        status.textContent = "Please fill in the highlighted question" + (bad && bad.type === "email" ? " with a valid email address." : bad && bad.type === "tel" ? " with a phone number, including the area code." : ".");
        status.className = "sf-status err";
        form.classList.add("sf-tried");
        if (bad) bad.focus();
        return;
      }
      const fields = {};
      for (const el of form.elements) {
        if (!el.name || el.name === "website") continue;
        if (el.type === "radio" && !el.checked) continue;
        const v = el.type === "checkbox" ? el.checked : el.value.trim();
        const [a, b] = el.name.split(".");
        if (b) { fields[a] = fields[a] || {}; fields[a][b] = v; } else fields[a] = v;
      }
      let source = form.dataset.source;
      try { const s = new URLSearchParams(location.search).get("source"); if (s && /^[a-z0-9_]{1,60}$/.test(s)) source = s; } catch (_) {}
      btn.disabled = true; const label = btn.textContent; btn.textContent = "Sending…";
      try {
        const r = await fetch(URL_, { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ form: form.dataset.form, fields, source, website: form.elements.website.value, t: Date.now() - started }) });
        const res = await r.json().catch(() => ({}));
        if (!r.ok || !res.ok) throw new Error("send");
        const done = document.getElementById(form.id + "-done"), first = (fields.name && fields.name.first) || "";
        const kind = form.dataset.success;
        if (kind === "guide") {
          done.innerHTML = '<h3>Your First-Time Home Buyer Guide is here</h3><p>' + (first ? "Thanks, " + esc(first) + ". " : "") + 'Your guide is ready to read or download. We\\'ve also emailed you a copy.</p><p><a class="btn btn-orange" href="' + GUIDE + '" target="_blank" rel="noopener">Read or download the guide ↗</a></p><p class="fine">No email in a few minutes? Check your junk folder, or call or text us at ' + PHONE + '.</p>';
        } else if (kind === "renewal") {
          done.innerHTML = '<h3>We got your renewal check-up request</h3><p>' + (first ? "Thanks, " + esc(first) + ". " : "Thanks. ") + "We'll be in touch soon to go over your renewal and your options. In the meantime, if you get a renewal offer from your lender, hold off on signing until we've talked.</p><p class=\\"fine\\">We've emailed you a confirmation. Questions? Call or text " + PHONE + ".</p>";
        } else if (kind) { location.href = kind; return; }
        form.hidden = true; done.hidden = false; done.focus();
      } catch (err) {
        status.textContent = "We couldn't send that right now. Please try again, or call or text Robin at " + PHONE + ".";
        status.className = "sf-status err";
        btn.disabled = false; btn.textContent = label;
      }
    });
  });
})();
</script>`;
