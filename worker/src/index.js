// Break Up With Renting: "Send to Robin".
// The scorecard, budget and debt tools post a member's results here. This sends two emails through
// Resend: one to Robin (reply goes straight to the member) and a copy to the member (reply goes to Robin).
// Nothing is stored, and the member's answers are never logged.

const TOOLS = {
  scorecard: { name: "Mortgage-Ready Scorecard", subject: "Scorecard", tip: "Retake the scorecard in June, before graduation, to see how far you've come." },
  budget: { name: "Monthly Budget Tracker", subject: "Budget Tracker", tip: "Found a spending leak? Move that amount to your home savings every payday." },
  "debt-payoff": { name: "Debt Payoff Planner", subject: "Debt Payoff Planner", tip: "Stop adding new debt while you pay these down, and keep making every minimum on time." },
};
const BROKERAGE =
  "Bureyko Mortgage Partners, powered by Mortgage Architects, is a member of the publicly traded DLCG group of companies. Together, our networks originate more mortgages in Canada than any individual bank, trust company, or credit union.";
const LOGO = "https://www.bureykomortgages.ca/assets/email-logo.png";
const BLUE = "#306AB4", INK = "#193C66", ORANGE = "#F1A34B";

const clip = (s, n) => String(s == null ? "" : s).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, n);
const oneLine = (s, n) => clip(s, n).replace(/\s+/g, " ");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]+$/;

function cors(origin, env) {
  const allowed = env.ALLOWED_ORIGINS.split(",").map((s) => s.trim());
  return allowed.includes(origin)
    ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400", Vary: "Origin" }
    : null;
}
const json = (status, body, headers = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });

// Turn the tool's answers into tidy rows, whatever was posted
function rows(list, max) {
  return (Array.isArray(list) ? list : []).slice(0, max).map((r) => ({ label: oneLine(r && r.label, 200), value: oneLine(r && r.value, 300) })).filter((r) => r.label || r.value);
}
function sections(list) {
  return (Array.isArray(list) ? list : []).slice(0, 3).map((s) => ({ section: oneLine(s && s.section, 200), rows: rows(s && s.rows, 20) }));
}

// The two approved emails (see "Send to Robin: Email Templates"), as HTML plus a plain-text version
export function buildEmails(p, env, now = new Date()) {
  const tool = TOOLS[p.tool];
  const firstName = oneLine(p.firstName, 60);
  const email = clip(p.email, 254);
  const followUp = p.followUp === true;
  const question = clip(p.question, 500);
  const summary = rows(p.summary, 15);
  // Budget: never any details. Others: only when the member chose to share them.
  const details = p.tool === "budget" ? null : p.includeDetails === true ? sections(p.details).flatMap((s) => s.rows) : "not-shared";
  let subjectTag = tool.subject;
  if (p.tool === "scorecard") {
    const row = summary.find((r) => r.label === "Which scorecard");
    const kind = row && /^(Start|Graduation)$/.test(row.value) ? row.value : "Just checking";
    subjectTag += " · " + kind;
  }
  const sent = now.toLocaleString("en-CA", { timeZone: "America/Edmonton", dateStyle: "medium", timeStyle: "short" });
  const noteForMember = followUp ? "Robin will be in touch soon." : "Want Robin's take? Just reply to this email.";

  // ---- shared pieces ----
  const textRows = (list) => list.map((r) => `${r.label}: ${r.value}`).join("\n");
  const table = (list) =>
    `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:0 0 8px">${list
      .map((r) => `<tr><td style="padding:8px 12px 8px 0;border-bottom:1px solid #D6E4F5;color:${INK};font-weight:bold;vertical-align:top;width:42%">${esc(r.label)}</td><td style="padding:8px 0;border-bottom:1px solid #D6E4F5;color:${INK};vertical-align:top">${esc(r.value)}</td></tr>`)
      .join("")}</table>`;
  const heading = (t) => `<h2 style="margin:24px 0 8px;font-size:18px;color:${BLUE}">${t}</h2>`;
  const divider = `<div style="height:3px;background:${ORANGE};line-height:3px;font-size:0;margin:18px 0">&nbsp;</div>`;
  const page = (inner) =>
    `<!doctype html><html><body style="margin:0;padding:0;background:#ffffff"><div style="max-width:600px;margin:0 auto;padding:20px 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:${INK};background:#ffffff">` +
    `<img src="${LOGO}" width="240" height="61" alt="Bureyko Mortgage Partners" style="display:block;border:0;width:240px;max-width:100%;height:auto">` +
    divider + inner + `</div></body></html>`;

  // ---- Email 1: to Robin ----
  const robinText = [
    ...(followUp ? [`${firstName} would like you to follow up.`, ""] : []),
    ...(question ? [`Their question: ${question}`, ""] : []),
    `From: ${firstName} · ${email}`,
    `Tool: ${tool.name}`,
    `Sent: ${sent} (Calgary time)`,
    "", "SUMMARY", textRows(summary),
    ...(details === null ? [] : ["", "DETAILS", details === "not-shared" ? "Details not shared" : textRows(details)]),
  ].join("\n");
  const robinHtml = page(
    (followUp ? `<p style="margin:0 0 14px;padding:12px 14px;border-left:4px solid ${ORANGE};background:#FEF6EC;color:${INK}"><strong>${esc(firstName)} would like you to follow up.</strong></p>` : "") +
    (question ? `<p style="margin:0 0 14px"><strong>Their question:</strong> ${esc(question).replace(/\n/g, "<br>")}</p>` : "") +
    `<p style="margin:0 0 4px"><strong>From:</strong> ${esc(firstName)} · <a href="mailto:${esc(email)}" style="color:${BLUE}">${esc(email)}</a></p>` +
    `<p style="margin:0 0 4px"><strong>Tool:</strong> ${esc(tool.name)}</p>` +
    `<p style="margin:0"><strong>Sent:</strong> ${esc(sent)} (Calgary time)</p>` +
    heading("Summary") + table(summary) +
    (details === null ? "" : heading("Details") + (details === "not-shared" ? `<p style="margin:0">Details not shared</p>` : table(details)))
  );

  // ---- Email 2: copy to the member ----
  const memberText = [
    `Hi ${firstName},`,
    "",
    `Here's a copy of what you sent Robin from your ${tool.name}. ${noteForMember}`,
    "", textRows(summary),
    ...(Array.isArray(details) && details.length ? ["", textRows(details)] : []),
    "", tool.tip,
    "", "Questions anytime: reply here, or call or text Robin at 403-540-0629.",
    "", "---", BROKERAGE, "General information, not financial advice.",
  ].join("\n");
  const memberHtml = page(
    `<p style="margin:0 0 12px">Hi ${esc(firstName)},</p>` +
    `<p style="margin:0 0 16px">Here's a copy of what you sent Robin from your ${esc(tool.name)}. ${esc(noteForMember)}</p>` +
    table(summary) +
    (Array.isArray(details) && details.length ? `<div style="height:12px"></div>` + table(details) : "") +
    `<p style="margin:18px 0 12px">${esc(tool.tip)}</p>` +
    `<p style="margin:0">Questions anytime: reply here, or call or text Robin at <a href="tel:+14035400629" style="color:${BLUE}">403-540-0629</a>.</p>` +
    divider +
    `<p style="margin:0 0 6px;font-size:12px;font-style:italic;color:${INK}">${esc(BROKERAGE)}</p>` +
    `<p style="margin:0;font-size:12px;font-style:italic;color:${INK}">General information, not financial advice.</p>`
  );

  return [
    { from: `Break Up With Renting <${env.ROBIN_EMAIL}>`, to: [env.ROBIN_EMAIL], reply_to: email,
      subject: `[BUWR · ${subjectTag}] ${firstName}${followUp ? " · Wants a follow-up" : ""}`, html: robinHtml, text: robinText },
    { from: `Robin Bureyko <${env.ROBIN_EMAIL}>`, to: [email], reply_to: env.ROBIN_EMAIL,
      subject: `Your ${tool.name} results`, html: memberHtml, text: memberText },
  ];
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = cors(origin, env);
    if (!headers) return json(403, { ok: false, error: "origin" });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return json(405, { ok: false }, headers);

    if (env.LIMITER) {
      const { success } = await env.LIMITER.limit({ key: request.headers.get("CF-Connecting-IP") || "unknown" });
      if (!success) return json(429, { ok: false, error: "limit" }, headers);
    }
    let p;
    try {
      const raw = await request.text();
      if (raw.length > 20000) return json(413, { ok: false }, headers);
      p = JSON.parse(raw);
    } catch (e) { return json(400, { ok: false }, headers); }
    if (!p || typeof p !== "object") return json(400, { ok: false }, headers);
    if (p.website) return json(200, { ok: true }, headers); // spam trap filled in: act as if sent, send nothing
    if (!TOOLS[p.tool] || !oneLine(p.firstName, 60) || !EMAIL_RE.test(clip(p.email, 254))) return json(400, { ok: false, error: "invalid" }, headers);

    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(buildEmails(p, env)),
    });
    if (!res.ok) {
      console.log(JSON.stringify({ tool: p.tool, at: new Date().toISOString(), sent: false, status: res.status })); // never the member's details
      return json(502, { ok: false }, headers);
    }
    console.log(JSON.stringify({ tool: p.tool, at: new Date().toISOString(), sent: true }));
    return json(200, { ok: true }, headers);
  },
};
