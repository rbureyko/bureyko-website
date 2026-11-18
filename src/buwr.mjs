// Break Up With Renting: the free 12-month first-time buyer program.
// Public page, thank-you page, and the password-protected members area (hub + Session 1 tools).
// Dates, links, videos and downloads come from src/buwr/content.json.
import fs from "node:fs";
import path from "node:path";
import { SITE } from "./content.mjs";

const DIR = path.join(path.dirname(new URL(import.meta.url).pathname), "buwr");
export const BUWR = JSON.parse(fs.readFileSync(path.join(DIR, "content.json"), "utf8"));
const BASE = "/break-up-with-renting";
const MEMBERS = BASE + "/members";
const ext = `target="_blank" rel="noopener"`;
const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>`;
const lock = `<svg class="lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;

const SESSIONS = [
  { n: 1, months: "Jan – Mar", worry: "Can I even qualify?", covers: ["Credit and debt triage", "How credit scores work", "Your first real budget", "Qualifying basics, in plain language (GDS and TDS)"] },
  { n: 2, months: "Apr – Jun", worry: "How will I ever save a down payment?", covers: ["A savings plan that fits your life", "The FHSA and the RRSP Home Buyers' Plan", "Gifted down payments", "Minimum down payment rules"] },
  { n: 3, months: "Jul – Sep", worry: "What if I lose a bidding war or overpay?", covers: ["Needs vs wants", "How a purchase actually works", "What a realtor does for you, with a guest Calgary realtor"] },
  { n: 4, months: "Oct – Dec", worry: "What about hidden costs at closing?", covers: ["Alberta closing costs", "The true monthly cost of owning", "Getting pre-approved", "Graduation"] },
];

const TOOLS = [
  { slug: "scorecard", file: "scorecard.html", title: "Mortgage-Ready Scorecard", blurb: "Eight quick questions. Do it in week 1 and again in week 12 to see how far you've come." },
  { slug: "credit-decoder", file: "credit-decoder.html", title: "Credit Report Decoder", blurb: "Read your Equifax and TransUnion reports the way a lender does." },
  { slug: "budget", file: "budget.html", title: "Monthly Budget Tracker", blurb: "Planned vs actual, with student lines and a money-left-over check." },
  { slug: "debt-payoff", file: "debt-payoff.html", title: "Debt Payoff Planner", blurb: "Your debt-free date and the order to pay things off." },
];

// ---------- helpers ----------
const ytId = (url) => {
  if (!url) return null;
  const m = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
};
const video = (url, title) => {
  const id = ytId(url);
  if (!id) return `<div class="video-slot"><span>Video coming soon</span></div>`;
  return `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0" title="${title}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
};
const people = (a) => `<div class="buwr-people">
  <figure><div class="portrait"><img src="${a("photos/robin.jpg")}" alt="Robin Bureyko" width="260" height="300"></div><figcaption><strong>Robin Bureyko</strong><span>Mortgage Professional</span></figcaption></figure>
  <figure><div class="portrait"><img src="${a("photos/sherri.jpg")}" alt="Sherri Bureyko" width="260" height="300"></div><figcaption><strong>Sherri Bureyko</strong><span>Mortgage Professional</span></figcaption></figure>
</div>`;
const backLink = (u) => `<a class="back-link" href="${u(MEMBERS + "/")}">← Back to members hub</a>`;

// The next live Q&A: the first one whose week hasn't ended yet (checked when the site is built)
const nextQA = () => {
  const today = new Date().toISOString().slice(0, 10);
  return BUWR.liveQA.find((q) => q.endsOn >= today) || BUWR.liveQA[BUWR.liveQA.length - 1];
};
const icsLink = (q) => {
  if (!q.date || !q.time || !BUWR.zoomUrl) return "";
  const [h, m] = q.time.split(":").map(Number);
  const pad = (n) => String(n).padStart(2, "0");
  const start = `${q.date.replace(/-/g, "")}T${pad(h)}${pad(m)}00`;
  const end = `${q.date.replace(/-/g, "")}T${pad(h + 1)}${pad(m)}00`;
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Bureyko Mortgage Partners//Break Up With Renting//EN", "BEGIN:VEVENT",
    `UID:buwr-qa-${q.session}-${q.date}@bureykomortgages.ca`, `DTSTART;TZID=America/Edmonton:${start}`, `DTEND;TZID=America/Edmonton:${end}`,
    `SUMMARY:Break Up With Renting: ${q.label}`, `DESCRIPTION:Join on Zoom: ${BUWR.zoomUrl}`, `URL:${BUWR.zoomUrl}`, "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  return `<a class="btn btn-line btn-sm" download="break-up-with-renting-qa.ics" href="data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}">Add to calendar</a>`;
};
const fmtDay = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
const fmtTime = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "a.m." : "p.m."}`;
};

// Each tool keeps its own styles, scoped so they only apply inside the tool and can't clash with the site.
function scopeCss(css) {
  css = css.replace(/:root\[data-theme="dark"\]\s*\{[^}]*\}/g, ""); // the claude.ai theme toggle doesn't exist here
  const scopeRules = (block) =>
    block.replace(/([^{}]+)\{([^{}]*)\}/g, (all, sel, body) => {
      const s = sel.split(",").map((x) => {
        x = x.trim();
        if (!x) return x;
        if (x === ":root" || x === "body" || x.startsWith(":root:not")) return ".tool";
        if (x === "*") return ".tool *";
        return ".tool " + x;
      });
      return s.join(", ") + " {" + body + "}";
    });
  let out = "";
  let i = 0;
  while (i < css.length) {
    const at = css.indexOf("@media", i);
    const end = at === -1 ? css.length : at;
    out += scopeRules(css.slice(i, end));
    if (at === -1) break;
    const open = css.indexOf("{", at);
    let depth = 1, j = open + 1;
    while (depth && j < css.length) { if (css[j] === "{") depth++; else if (css[j] === "}") depth--; j++; }
    out += css.slice(at, open) + "{" + scopeRules(css.slice(open + 1, j - 1)) + "}";
    i = j;
  }
  // Undo site styles that would otherwise leak into the tools' own classes, and use the site font
  return out + `
.tool { font-family: "Fira Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; border-radius: 14px; }
.tool .btn { white-space: normal; min-height: 0; transform: none; text-decoration: none; }
.tool .card { display: block; }
.tool .eyebrow::before { content: none; }
.tool .lead { font-size: inherit; max-width: 65ch; }
.tool p { margin: 0 0 10px; }`;
}
function loadTool(file) {
  let html = fs.readFileSync(path.join(DIR, "tools", file), "utf8").replace(/__SCORECARD_FORM_ID__/g, BUWR.scorecardFormId);
  const m = html.match(/<style>([\s\S]*?)<\/style>/);
  const css = scopeCss(m[1]);
  html = html.replace(m[0], "");
  return `<style>${css}</style>\n<div class="tool">${html}</div>`;
}

const download = (d) =>
  d.url
    ? `<li><a href="${d.url}" ${ext}>${d.title} ↗</a></li>`
    : `<li><span>${d.title}</span><span class="soon">Coming soon</span></li>`;

// ---------- pages ----------
export function buwrPages() {
  const list = [];
  const S = BUWR;

  // Public page
  list.push({
    route: BASE + "/",
    title: "Break Up With Renting",
    exactTitle: "Break Up With Renting | Free First-Time Buyer Program in Calgary",
    description: "A free 12-month program for Calgarians in their 20s who want to buy their first home. Tips every two weeks, live Q&As, no homework.",
    body: ({ u, a }) => `
<section class="buwr-hero">
  <div class="wrap">
    <div class="stack">
      <span class="eyebrow">Free 12-month program · Starts January 2027</span>
      <h1>Break Up<br><em>With Renting.</em></h1>
      <p class="lead">A free 12-month program for Calgarians in their 20s who want to own a home in the next few years. Real tips, no homework.</p>
      <div class="actions"><a class="btn btn-orange" href="#join">Join free ${arrow}</a></div>
      <p class="hero-note">Free. Always. No credit check to join.</p>
    </div>
    <div class="stack">
      ${people(a)}
      ${ytId(S.videos.welcome) ? video(S.videos.welcome, "Why we started Break Up With Renting") : ""}
    </div>
  </div>
</section>

<section class="band band-mist">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">Is this you?</span><h2>Built for where you are right now.</h2><p>You don't need a down payment or a plan yet. That's what the year is for.</p></div>
    <div class="cards">
      <div class="card"><h3>Renting</h3><p>You're paying someone else's mortgage every month, and you'd rather be paying your own.</p></div>
      <div class="card"><h3>Living with your parents</h3><p>You've got a chance to save, and you want a real plan for getting out on your own.</p></div>
      <div class="card"><h3>Still in school</h3><p>Buying is a few years away, and you want to start smart with your credit and money.</p></div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap approach">
    <div class="stack">
      <span class="eyebrow">How it works</span>
      <h2>Light effort. Real progress.</h2>
      <p>Tips, tricks and plain-language information. Not homework. A few minutes every two weeks.</p>
    </div>
    <ol class="steps">
      <li class="step"><div><h3>Sign up free.</h3><p>Join any time. Each session leads into the next.</p></div></li>
      <li class="step"><div><h3>Get a short tip from Robin every two weeks.</h3><p>By email and text, straight to your phone.</p></div></li>
      <li class="step"><div><h3>Join a live Q&amp;A each quarter.</h3><p>On Zoom, or in person at Office Hours with Robin.</p></div></li>
      <li class="step"><div><h3>Graduate with a pre-approval.</h3><p>See exactly where you stand.</p></div></li>
    </ol>
  </div>
</section>

<section class="band band-mist">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">The year at a glance</span><h2>Four sessions. Four big worries, sorted.</h2><p>Each session runs 12 weeks, one calendar quarter, starting January 2027.</p></div>
    <ol class="buwr-sessions">
      ${SESSIONS.map((s) => `<li><span class="when">Session ${s.n} · ${s.months}</span><h3>“${s.worry}”</h3><ul>${s.covers.map((c) => `<li>${c}</li>`).join("")}</ul></li>`).join("")}
    </ol>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">What members get</span><h2>Tools that make it simple.</h2><p>Members only. You'll get the link and password in Robin's welcome message.</p></div>
    <div class="buwr-locked">
      ${TOOLS.map((t) => `<div class="card">${lock}<h3>${t.title}</h3><p>${t.blurb}</p><span class="members-only">Members only</span></div>`).join("")}
      <div class="card">${lock}<h3>More every session</h3><p>New tools each quarter, plus "Questions to ask" scripts for lenders, realtors, inspectors, condos and lawyers.</p><span class="members-only">Members only</span></div>
      <div class="card">${lock}<h3>Live Q&amp;As and recordings</h3><p>Ask anything once a quarter, and catch the recording if you miss it.</p><span class="members-only">Members only</span></div>
    </div>
  </div>
</section>

<section class="band band-mist">
  <div class="wrap split">
    <div class="stack">
      <span class="eyebrow">Meet Robin and Sherri</span>
      <h2>We don't just understand mortgages. We understand credit.</h2>
      <p class="lead">We're Robin and Sherri Bureyko, a small, family-run team in Calgary. Robin spent 20+ years in credit adjudication and risk. Sherri spent 5 years in high-volume mortgage underwriting.</p>
    </div>
    ${people(a)}
  </div>
</section>

<section class="band">
  <div class="wrap narrow">
    <h2 style="margin-bottom:24px">Questions you might have</h2>
    <div class="faq">
      <details><summary>Is it really free?</summary><p>Yes. Free, always. There's no credit check to join.</p></details>
      <details><summary>How much time does it take?</summary><p>A few minutes every two weeks. It's tips and information, not homework.</p></details>
      <details><summary>Can I join partway through the year?</summary><p>Yes. Join any time. Each session leads into the next, so you can pick up wherever we are.</p></details>
      <details><summary>I'm not planning to buy for years. Is this for me?</summary><p>That's exactly who it's for. The earlier you start on credit and savings, the easier buying gets.</p></details>
      <details><summary>Do I have to come in person?</summary><p>No. Everything works from your phone. Live Q&amp;As are on Zoom, with an in-person option if you'd like to meet.</p></details>
    </div>
  </div>
</section>

<section class="band band-mist" id="join">
  <div class="wrap narrow">
    <div class="stack" style="margin-bottom:24px">
      <span class="eyebrow">Join free</span>
      <h2>Ready to break up with renting?</h2>
      <p class="lead">Sign up below. Robin's welcome message, with your members link and password, arrives by email and text.</p>
    </div>
    <div class="form-frame"><iframe src="${S.signupFormUrl}" title="Break Up With Renting sign-up form" loading="lazy" style="min-height:1250px"></iframe></div>
    <p class="fine" style="margin-top:12px">Form not showing? <a class="text-link" href="${S.signupFormUrl}" ${ext}>Open it in a new tab ↗</a></p>
  </div>
</section>`,
  });

  // Thank-you page
  list.push({
    route: BASE + "/welcome",
    title: "You're In: Break Up With Renting",
    description: "Welcome to Break Up With Renting.",
    noindex: true,
    body: ({ u, a }) => `
<section class="band">
  <div class="wrap narrow buwr-welcome">
    <span class="eyebrow">Break Up With Renting</span>
    <h1>You're in!</h1>
    <p class="lead">Robin's welcome message is on its way by email and text. It has your link and password to the members area.</p>
    <p>Don't see it in a few minutes? Check your junk folder, or text Robin at <a class="text-link" href="sms:${SITE.robin.tel}">${SITE.robin.phone}</a>.</p>
    <div class="actions"><a class="btn btn-orange" href="${S.instagramUrl}" ${ext}>Follow ${S.instagramHandle} ↗</a><a class="btn btn-line" href="${u(BASE + "/")}">Back to the program</a></div>
  </div>
</section>`,
  });

  // Members hub
  list.push({
    route: MEMBERS + "/",
    title: "Members Hub: Break Up With Renting",
    description: "Break Up With Renting members area.",
    noindex: true,
    protect: true,
    body: ({ u, a }) => {
      const q = nextQA();
      const when = q.date && q.time ? `${fmtDay(q.date)} at ${fmtTime(q.time)} (Calgary time)` : `Week of ${q.week}. Exact day and time coming soon.`;
      return `
<section class="band-tight buwr-members-top">
  <div class="wrap">
    <div class="welcome-bar">
      <div class="portrait small"><img src="${a("photos/robin.jpg")}" alt="Robin Bureyko" width="96" height="110"></div>
      <div><span class="eyebrow">Members hub</span><h1>Welcome to the crew.</h1><p>Glad you're here. Start with the Mortgage-Ready Scorecard, then pick one tool a week. Questions any time: text me at ${SITE.robin.phone}. <em>Robin</em></p></div>
    </div>
  </div>
</section>

<section class="band-tight">
  <div class="wrap">
    <div class="qa-card">
      <span class="eyebrow">Next live Q&amp;A</span>
      <h2>${q.label}</h2>
      <p class="when">${when}</p>
      <div class="actions">
        ${S.zoomUrl ? `<a class="btn btn-orange" href="${S.zoomUrl}" ${ext}>Join on Zoom ↗</a>` : `<span class="btn btn-line is-disabled" aria-disabled="true">Zoom link coming soon</span>`}
        ${icsLink(q)}
      </div>
      <p class="fine">Prefer in person? Office Hours with Robin: ${S.officeHoursVenue ? S.officeHoursVenue : "venue coming soon"}.</p>
    </div>
  </div>
</section>

<section class="band-tight">
  <div class="wrap">
    <h2 class="hub-title">Session 1 tools: “Can I even qualify?”</h2>
    <div class="tool-grid">
      ${TOOLS.map((t) => `<a class="card tool-card" href="${u(MEMBERS + "/" + t.slug)}"><h3>${t.title}</h3><p>${t.blurb}</p><span class="more">Open ${arrow}</span></a>`).join("")}
    </div>
  </div>
</section>

<section class="band-tight">
  <div class="wrap">
    <h2 class="hub-title">Coming up</h2>
    <div class="cards">
      <div class="card"><h3>Session 2 · Apr – Jun</h3><ul class="downloads">${S.downloads.session2.map(download).join("")}</ul></div>
      <div class="card"><h3>Session 3 · Jul – Sep</h3><ul class="downloads">${S.downloads.session3.map(download).join("")}</ul></div>
      <div class="card"><h3>Session 4 · Oct – Dec</h3><ul class="downloads">${S.downloads.session4.map(download).join("")}</ul></div>
      <div class="card"><h3>“Questions to ask” scripts</h3><ul class="downloads">${S.downloads.scripts.map(download).join("")}</ul></div>
    </div>
  </div>
</section>

<section class="band-tight">
  <div class="wrap">
    <h2 class="hub-title">Videos</h2>
    <div class="video-grid">
      <div><h3>Session 1 intro</h3>${video(S.videos.session1Intro, "Session 1 intro")}</div>
      ${[2, 3, 4].filter((n) => S.videos["session" + n + "Intro"]).map((n) => `<div><h3>Session ${n} intro</h3>${video(S.videos["session" + n + "Intro"], "Session " + n + " intro")}</div>`).join("")}
      ${[1, 2, 3, 4].filter((n) => S.videos["qa" + n + "Recording"]).map((n) => `<div><h3>Q${n} live Q&amp;A recording</h3>${video(S.videos["qa" + n + "Recording"], "Q" + n + " live Q&A recording")}</div>`).join("")}
    </div>
    <p class="fine">Live Q&amp;A recordings appear here after each session's Q&amp;A.</p>
  </div>
</section>

<section class="band-tight">
  <div class="wrap">
    <h2 class="hub-title">More tools</h2>
    <div class="cards">
      <a class="card" href="${SITE.appUrl}" ${ext}><h3>Current rates and calculators ↗</h3><p>Robin's mortgage app. Download it and create an account.</p></a>
      <a class="card" href="${u("/first-time-home-buyer-guide")}"><h3>First-Time Homebuyer Guide</h3><p>Our free guide, a good companion to the whole year.</p></a>
    </div>
  </div>
</section>

<section class="contact">
  <div class="wrap">
    <span class="eyebrow">Ready to see where you stand?</span>
    <div class="contact-head"><h2>Get pre-approved when you're ready.</h2><p>It's the best way to see exactly where you stand.</p></div>
    <div class="actions"><a class="btn btn-orange" href="${SITE.applyUrl}" ${ext}>Start my pre-approval ↗</a><a class="btn btn-line" href="sms:${SITE.robin.tel}">Text Robin · ${SITE.robin.phone}</a></div>
    <p class="contact-more"><span>Email <a href="mailto:${SITE.robin.email}">${SITE.robin.email}</a></span></p>
  </div>
</section>`;
    },
  });

  // Session 1 tool pages
  for (const t of TOOLS) {
    list.push({
      route: MEMBERS + "/" + t.slug,
      title: t.title + ": Break Up With Renting",
      description: t.blurb,
      noindex: true,
      protect: true,
      body: ({ u }) => `
<section class="band-tight buwr-tool">
  <div class="wrap">
    ${backLink(u)}
    ${loadTool(t.file)}
    ${backLink(u)}
  </div>
</section>`,
    });
  }
  return list;
}
