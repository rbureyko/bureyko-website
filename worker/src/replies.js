// Automatic replies for the website's forms (forms.js), sent through Resend.
// Wording is from "Form Reply Emails (for Resend)", November 22, 2026.

const BROKERAGE =
  "Bureyko Mortgage Partners, powered by Mortgage Architects, is a member of the publicly traded DLCG group of companies. Together, our networks originate more mortgages in Canada than any individual bank, trust company, or credit union.";
import { GUIDE_URL } from "./forms.js";
const LOGO = "https://www.bureykomortgages.ca/assets/email-logo.png";
const BLUE = "#306AB4", INK = "#193C66", ORANGE = "#F1A34B";
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const footerText = ["Robin and Sherri Bureyko", "Bureyko Mortgage Partners", "bureykomortgages.ca · 403-540-0629", "", BROKERAGE].join("\n");
const footerHtml =
  `<div style="height:3px;background:${ORANGE};line-height:3px;font-size:0;margin:22px 0 16px">&nbsp;</div>` +
  `<p style="margin:0 0 12px">Robin and Sherri Bureyko<br>Bureyko Mortgage Partners<br><a href="https://www.bureykomortgages.ca" style="color:${BLUE}">bureykomortgages.ca</a> · <a href="tel:+14035400629" style="color:${BLUE}">403-540-0629</a></p>` +
  `<p style="margin:0;font-size:12px;font-style:italic;color:${INK}">${esc(BROKERAGE)}</p>`;
const page = (inner) =>
  `<!doctype html><html><body style="margin:0;padding:0;background:#ffffff"><div style="max-width:600px;margin:0 auto;padding:20px 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:${INK};background:#ffffff">` +
  `<img src="${LOGO}" width="240" height="61" alt="Bureyko Mortgage Partners" style="display:block;border:0;width:240px;max-width:100%;height:auto">` +
  `<div style="height:3px;background:${ORANGE};line-height:3px;font-size:0;margin:18px 0">&nbsp;</div>` + inner + `</div></body></html>`;
const p = (t, extra = "") => `<p style="margin:0 0 14px${extra}">${t}</p>`;
const title = (t, sub) => `<h1 style="margin:0 0 4px;font-size:22px;color:${BLUE}">${esc(t)}</h1><p style="margin:0 0 18px;color:${INK}">${esc(sub)}</p>`;

// Robin's notification of a new form submission: every answer, plus the consent given and when
export function notifyEmail(title, rows, sent, source) {
  const all = [...rows, { label: "Sent", value: sent + " (Calgary time)" }, ...(source ? [{ label: "Source", value: source }] : [])];
  return {
    text: [title, "", ...all.map((r) => `${r.label}: ${r.value}`), "", "Reply to this email to answer them directly."].join("\n"),
    html: page(`<h1 style="margin:0 0 14px;font-size:20px;color:${BLUE}">${esc(title)}</h1>` +
      `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">${all.map((r) => `<tr><td style="padding:8px 12px 8px 0;border-bottom:1px solid #D6E4F5;font-weight:bold;vertical-align:top;width:42%">${esc(r.label)}</td><td style="padding:8px 0;border-bottom:1px solid #D6E4F5;vertical-align:top">${esc(r.value)}</td></tr>`).join("")}</table>` +
      `<p style="margin:16px 0 0;font-size:13px">Reply to this email to answer them directly.</p>`),
  };
}

export function replyEmail(formKey, firstName) {
  const hi = firstName ? `Hi ${firstName},` : "Hi,";
  const hiH = esc(hi);
  if (formKey === "crew") {
    const paras = [
      "You're officially part of the Break Up With Renting Founding Crew, one of only 50.",
      "Here's what happens next. In January we kick off with the Credit Glow-Up, the first of four sessions in our free 6-month program. Every couple of weeks you'll get one small, doable step to get mortgage-ready, and in June you graduate with a pre-approval that shows your real numbers. No homework overload, and no pressure to buy before you're ready.",
      "We're taking December off to spend time with family, but we'll check in once before then with one easy thing you can do now.",
      "Because you're a founding member, we'd love your honest feedback as we go. Tell us what works and what doesn't.",
    ];
    return {
      subject: "You're in: Break Up With Renting starts in January",
      text: [hi, "", ...paras.flatMap((x) => [x, ""]), "Talk soon,", "Robin and Sherri Bureyko", "", "---", footerText, "", "Reply STOP to opt out anytime."].join("\n"),
      html: page(p(hiH) + paras.map((x) => p(esc(x))).join("") + p("Talk soon,<br>Robin and Sherri Bureyko") + footerHtml + `<p style="margin:14px 0 0;font-size:12px;color:${INK}">Reply STOP to opt out anytime.</p>`),
    };
  }
  if (formKey === "guide") {
    const intro = `${hi.replace(/,$/, "")}, thanks for requesting our First-Time Home Buyer Guide. You can read or download it here:`;
    const after = "If any of it raises questions, just reply to this email or call or text us at 403-540-0629. We're happy to help, no pressure.";
    return {
      subject: "Your First-Time Home Buyer Guide is here",
      text: ["Your First-Time Home Buyer Guide is here", "Your guide is ready to read or download.", "", intro, "", "Read or download the guide: " + GUIDE_URL, "", after, "", "---", footerText].join("\n"),
      html: page(
        title("Your First-Time Home Buyer Guide is here", "Your guide is ready to read or download.") +
        p(esc(intro)) +
        `<p style="margin:6px 0 20px"><a href="${GUIDE_URL}" style="display:inline-block;background:${ORANGE};color:${INK};font-weight:bold;text-decoration:none;padding:14px 24px;border-radius:6px">Read or download the guide</a></p>` +
        p(esc(after)) + footerHtml
      ),
    };
  }
  if (formKey === "renewal") {
    const paras = [
      `${hi.replace(/,$/, "")}, thanks for booking a Mortgage Renewal Check-Up. We'll be in touch soon to go over your renewal and your options.`,
      "In the meantime, if you get a renewal offer from your lender, hold off on signing until we've talked.",
      "Questions? Reply to this email or call or text 403-540-0629.",
    ];
    return {
      subject: "We got your renewal check-up request",
      text: ["We got your renewal check-up request", "Your mortgage renewal options are worth reviewing before you sign.", "", ...paras.flatMap((x) => [x, ""]), "---", footerText].join("\n"),
      html: page(title("We got your renewal check-up request", "Your mortgage renewal options are worth reviewing before you sign.") + paras.map((x) => p(esc(x))).join("") + footerHtml),
    };
  }
  return null;
}
