// Break Up With Renting: the free 6-month first-time buyer program (January to June 2027).
// Public page, thank-you page, and the password-protected members area (hub + Session 1 tools).
// Dates, links, videos and downloads come from src/buwr/content.json.
import fs from "node:fs";
import path from "node:path";
import { SITE } from "./content.mjs";
import { loginForm, loginScript } from "./protect.mjs";
import { siteForm, SITE_FORM_SCRIPT } from "./siteforms.mjs";

const DIR = path.join(path.dirname(new URL(import.meta.url).pathname), "buwr");
export const BUWR = JSON.parse(fs.readFileSync(path.join(DIR, "content.json"), "utf8"));
const BASE = "/break-up-with-renting";
const MEMBERS = BASE + "/members";
const ext = `target="_blank" rel="noopener"`;
const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>`;
const lock = `<svg class="lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;


const TOOLS = [
  { slug: "scorecard", file: "scorecard.html", title: "Mortgage-Ready Scorecard", blurb: "Eight quick questions. Do it now, then again in June before graduation to see how far you've come." },
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
// "Coming Tue Jan 19" (short weekday, short month, day), from a YYYY-MM-DD date
const comingLabel = (iso) =>
  "Coming " + new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" }).replace(",", "");
// A Session 1 tip card. Everything is in the (encrypted) page; the browser decides what to show based on
// today's date in Calgary, so cards unlock on their own without a rebuild (see TIP_SCRIPT).
const tipCard = (tip, u) => `<article class="card tip-card" data-release="${tip.releaseDate}" data-video="${ytId(tip.videoUrl) || ""}" data-title="${tip.title.replace(/"/g, "&quot;")}" data-number="${tip.number}">
  <span class="tip-num">Tip ${tip.number}</span>
  <h3>${tip.title}</h3>
  <p class="tip-coming">${comingLabel(tip.releaseDate)}</p>
  <div class="tip-body" hidden>
    <div class="tip-video-slot"></div>
    <ul class="tip-bullets">${tip.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
    <a class="btn btn-orange" href="${u(tip.toolLink)}">${tip.toolLabel} ${arrow}</a>
  </div>
</article>`;
const TIP_SCRIPT = `<script>
(() => {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Edmonton", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const showAll = new URLSearchParams(location.search).get("preview") === "all";
  document.querySelectorAll(".tip-card").forEach((card) => {
    if (!showAll && today < card.dataset.release) return; // not released yet: title and "Coming" label only
    card.classList.add("is-live");
    card.querySelector(".tip-coming").hidden = true;
    card.querySelector(".tip-body").hidden = false;
    const slot = card.querySelector(".tip-video-slot");
    if (card.dataset.video) {
      slot.innerHTML = '<div class="tip-video"><iframe loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
      const f = slot.querySelector("iframe");
      f.title = "Tip " + card.dataset.number + " video: " + card.dataset.title;
      f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(card.dataset.video) + "?rel=0&playsinline=1";
    } else {
      slot.innerHTML = '<div class="tip-video-soon"><span>Video coming soon</span></div>';
    }
  });
  if (showAll) { const n = document.getElementById("tipPreviewNote"); if (n) n.hidden = false; }
})();
</script>`;

// Member login: buttons, the panel on the public page, and the shared browser script
const loginOpts = (joinHref) => ({ joinHref, phone: SITE.robin.phone, tel: SITE.robin.tel });
const memberBtn = (u) => `<a class="btn btn-line" href="${u(BASE + "/login")}" data-member-login>Member login</a>`;
const loginKit = (u) => loginScript({ check: "__BUWR_LOGIN_CHECK__", membersUrl: u(MEMBERS + "/"), publicUrl: u(BASE + "/"), phone: SITE.robin.phone });
const loginSheet = () => `<dialog class="login-sheet" id="loginSheet" aria-labelledby="loginSheetTitle">
  <div class="sheet-inner">
    <button class="sheet-close" type="button" aria-label="Close">×</button>
    <h2 id="loginSheetTitle">Welcome back</h2>
    <p>Enter the members password from Robin's welcome email.</p>
    ${loginForm("sheetLogin", loginOpts("#join"))}
  </div>
</dialog>`;

const backLink = (u) => `<a class="back-link" href="${u(MEMBERS + "/")}">← Back to members hub</a>`;

// The next live Q&A: the first one whose week hasn't ended yet (checked when the site is built)
// (null once every session Q&A is over; graduation is shown separately)
const buildDay = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Edmonton", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const nextQA = () => BUWR.liveQA.find((q) => q.endsOn >= buildDay()) || null;
// "7:00–7:45 p.m.", or "11:30 a.m.–12:15 p.m." when it crosses noon
const timeRange = (a, b) => {
  if (!b) return fmtTime(a);
  const A = fmtTime(a), B = fmtTime(b);
  return A.slice(-4) === B.slice(-4) ? A.slice(0, -5) + "–" + B : A + "–" + B;
};
const eventWhen = (q) =>
  q.date && q.time
    ? `${fmtDay(q.date)}, ${timeRange(q.time, q.endTime)} (Calgary time)`
    : `${q.week ? "Week of " + q.week + ". " : ""}Exact day and time coming soon.`;
const icsLink = (q) => {
  if (!q.date || !q.time || !BUWR.zoomUrl) return "";
  const [h, m] = q.time.split(":").map(Number);
  const pad = (n) => String(n).padStart(2, "0");
  const start = `${q.date.replace(/-/g, "")}T${pad(h)}${pad(m)}00`;
  const [eh, em] = q.endTime ? q.endTime.split(":").map(Number) : [h + 1, m];
  const end = `${q.date.replace(/-/g, "")}T${pad(eh)}${pad(em)}00`;
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Bureyko Mortgage Partners//Break Up With Renting//EN", "BEGIN:VEVENT",
    `UID:buwr-${q.session ? "qa-" + q.session : "graduation"}-${q.date}@bureykomortgages.ca`, `DTSTART;TZID=America/Edmonton:${start}`, `DTEND;TZID=America/Edmonton:${end}`,
    `SUMMARY:Break Up With Renting: ${q.label}`, `DESCRIPTION:Join on Zoom: ${BUWR.zoomUrl}`, `URL:${BUWR.zoomUrl}`, "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  return `<a class="btn btn-line btn-sm" download="break-up-with-renting-${q.session ? "qa" : "graduation"}.ics" href="data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}">Add to calendar</a>`;
};
const fmtDay = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
const fmtTime = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "a.m." : "p.m."}`;
};

// Each tool keeps its own styles, scoped so they only apply inside the tool and can't clash with the site.
function scopeCss(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, ""); // drop comments so they can't end up inside a selector
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
.tool p { margin: 0 0 10px; }
.tool .empty { border: 0; padding: 0; text-align: left; }
.tool [hidden] { display: none !important; }`;
}
function loadTool(file) {
  let html = fs.readFileSync(path.join(DIR, "tools", file), "utf8").replace(/__SEND_TO_ROBIN_URL__/g, BUWR.sendToRobinUrl);
  let css = "";
  html = html.replace(/<style>([\s\S]*?)<\/style>/g, (all, block) => { css += block + "\n"; return ""; });
  return `<style>${scopeCss(css)}</style>\n<div class="tool">${html}</div>`;
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
    exactTitle: "Break Up With Renting | Free 6-Month First-Time Buyer Program in Calgary",
    description: "A free 6-month program for Calgarians in their 20s. Learn the four things every lender looks at, join live Q&As, and graduate with your real numbers.",
    body: ({ u, a }) => `
<section class="buwr-hero">
  <div class="wrap">
    <div class="stack">
      <span class="eyebrow">Free 6-month program · ${S.programDates}</span>
      <h1>Break Up<br><em>With Renting.</em></h1>
      <p class="lead">A free 6-month program for Calgarians in their 20s who want to own a home. Learn what lenders look at, then graduate in June with your real numbers. Real tips, no homework.</p>
      <div class="actions"><a class="btn btn-orange" href="#join">Join free ${arrow}</a>${memberBtn(u)}</div>
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
    <div class="sec-head"><span class="eyebrow">Is this you?</span><h2>Built for where you are right now.</h2><p>You don't need a down payment or a plan yet. That's what the program is for.</p></div>
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
      <p>Tips, tricks and plain-language information. Not homework. A few minutes every two weeks, then weekly in May and June.</p>
    </div>
    <ol class="steps">
      <li class="step"><div><h3>Sign up free.</h3><p>Join any time. Each session leads into the next.</p></div></li>
      <li class="step"><div><h3>Get a short tip from Robin every two weeks.</h3><p>Then weekly in May and June. By email and text, straight to your phone.</p></div></li>
      <li class="step"><div><h3>Join a live Q&amp;A each session.</h3><p>On Zoom, or in person at Office Hours with Robin.</p></div></li>
      <li class="step"><div><h3>Graduate in June with a pre-approval.</h3><p>See your real numbers and exactly where you stand.</p></div></li>
    </ol>
  </div>
</section>

<section class="band band-mist">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">The 4 things every lender looks at</span><h2>${S.lenderHook.title}</h2><p>${S.lenderHook.text}</p></div>
    <div class="lender-four">
      ${S.sessions.map((s) => `<div class="card"><span class="lender-num">${s.number}</span><h3>${s.lenderLooksAt}</h3><p class="lender-q">“${s.question}”</p><p class="lender-session">Session ${s.number}: ${s.name}</p></div>`).join("")}
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">Six months at a glance</span><h2>Four sessions, ${S.programDates}.</h2><p>One session for each thing a lender looks at, ending with graduation in June.</p></div>
    <ol class="buwr-sessions">
      ${S.sessions.map((s) => `<li><span class="when">Session ${s.number} · ${s.months}</span><h3>${s.name}</h3><p class="session-q">“${s.question}”</p><ul>${s.covers.map((c) => `<li>${c}</li>`).join("")}</ul></li>`).join("")}
    </ol>
  </div>
</section>

<section class="band band-mist">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">What members get</span><h2>Tools that make it simple.</h2><p>Members only. You'll get the link and password in Robin's welcome message.</p></div>
    <div class="buwr-locked">
      ${TOOLS.map((t) => `<div class="card">${lock}<h3>${t.title}</h3><p>${t.blurb}</p><span class="members-only">Members only</span></div>`).join("")}
      <div class="card">${lock}<h3>More every session</h3><p>New tools each session, plus "Questions to ask" scripts for lenders, realtors, inspectors, condo boards and lawyers.</p><span class="members-only">Members only</span></div>
      <div class="card">${lock}<h3>Live Q&amp;As and graduation</h3><p>A live Q&amp;A every session plus a June graduation. Catch the recording if you miss one.</p><span class="members-only">Members only</span></div>
    </div>
    <div class="member-login-row"><p>Already a member?</p>${memberBtn(u)}</div>
  </div>
</section>

<section class="band">
  <div class="wrap split">
    <div class="stack">
      <span class="eyebrow">Meet Robin and Sherri</span>
      <h2>We don't just understand mortgages. We understand credit.</h2>
      <p class="lead">We're Robin and Sherri Bureyko, a small, family-run team in Calgary. Robin spent 20+ years in credit adjudication and risk. Sherri spent 5 years in high-volume mortgage underwriting.</p>
    </div>
    ${people(a)}
  </div>
</section>

<section class="band band-mist">
  <div class="wrap narrow">
    <h2 style="margin-bottom:24px">Questions you might have</h2>
    <div class="faq">
      <details><summary>Is it really free?</summary><p>Yes. Free, always. There's no credit check to join.</p></details>
      <details><summary>How long is it?</summary><p>Six months, January to June 2027.</p></details>
      <details><summary>How much time does it take?</summary><p>A few minutes every two weeks, then weekly in May and June. It's tips and information, not homework.</p></details>
      <details><summary>Can I join partway?</summary><p>Yes. You'll start with the current session, and all earlier tools stay open to you.</p></details>
      <details><summary>I'm not planning to buy for years. Is this for me?</summary><p>Perfect. You'll graduate knowing exactly where you stand, then we'll keep helping you save until you're ready.</p></details>
      <details><summary>Do I have to come in person?</summary><p>No. Everything works from your phone. Live Q&amp;As are on Zoom, with an in-person option if you'd like to meet.</p></details>
    </div>
  </div>
</section>

<section class="band" id="join">
  <div class="wrap narrow">
    <div class="stack" style="margin-bottom:24px">
      <span class="eyebrow">Join free</span>
      <h2>Ready to break up with renting?</h2>
      <p class="lead">Sign up below. You'll get a quick note from Robin now, and your members link and password in December.</p>
      <div class="member-login-row"><p>Already a member?</p>${memberBtn(u)}</div>
    </div>
    ${siteForm("crew", { source: "website_buwr", success: u(BASE + "/welcome") })}
  </div>
</section>
${loginSheet()}
${loginKit(u)}
${SITE_FORM_SCRIPT}`,
  });

  // Login page: for anyone without the panel, and where members pages send visitors who aren't logged in
  list.push({
    route: BASE + "/login",
    title: "Member Login: Break Up With Renting",
    description: "Log in to the Break Up With Renting members area.",
    noindex: true,
    body: ({ u }) => `
<section class="band">
  <div class="wrap narrow">
    <div class="card login-page">
      <span class="eyebrow">Break Up With Renting · Members</span>
      <h1>Welcome back</h1>
      <p>Enter the members password from Robin's welcome email.</p>
      ${loginForm("pageLogin", loginOpts(u(BASE + "/#join")))}
    </div>
  </div>
</section>
${loginKit(u)}`,
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
    <h1>You're in! <span aria-hidden="true">🎉</span></h1>
    <p class="lead">Check your inbox for a quick note from Robin. In December, you'll get your welcome email and text with your link and password to the members area. We kick off in January 2027.</p>
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
      const g = S.graduation;
      const s1 = S.sessions[0];
      const zoomBtn = S.zoomUrl ? `<a class="btn btn-orange" href="${S.zoomUrl}" ${ext}>Join on Zoom ↗</a>` : `<span class="btn btn-line is-disabled" aria-disabled="true">Zoom link coming soon</span>`;
      const venue = `Prefer in person? Office Hours with Robin: ${S.officeHoursVenue ? S.officeHoursVenue : "venue coming soon"}.`;
      return `
<section class="band-tight buwr-members-top">
  <div class="wrap">
    <div class="welcome-bar">
      <div class="portrait small"><img src="${a("photos/robin.jpg")}" alt="Robin Bureyko" width="96" height="110"></div>
      <div><span class="eyebrow">Members hub</span><h1>Welcome to the crew.</h1><p>Glad you're here. Start with the Mortgage-Ready Scorecard, then pick one tool a week. Questions any time: text me at ${SITE.robin.phone}. <em>Robin</em></p><button class="logout-link" type="button" data-member-logout>Log out</button></div>
    </div>
  </div>
</section>

<section class="band-tight session-block" id="session-1">
  <div class="wrap">
    <h2 class="hub-title">Session 1: ${s1.name} · ${s1.months} · “${s1.question}”</h2>
    <div class="session-intro-video">${video(S.videos.session1Intro, "Session 1 intro")}</div>

    <p class="tip-preview-note" id="tipPreviewNote" hidden>Preview mode: every tip is showing, including ones that aren't released yet.</p>
    <div class="tip-grid">${S.session1Tips.map((tip) => tipCard(tip, u)).join("")}</div>

    <div class="qa-row">
      ${q ? `<div class="qa-card">
        <span class="eyebrow">Next live Q&amp;A</span>
        <h2>${q.label}</h2>
        <p class="when">${eventWhen(q)}</p>
        <div class="actions">${zoomBtn}${icsLink(q)}</div>
        <p class="fine">${venue}</p>
      </div>` : ""}
      <div class="qa-card qa-grad">
        <span class="eyebrow">Graduation · End of June</span>
        <h2>${g.label}</h2>
        <p class="when">${eventWhen(g)}</p>
        <p>${g.text}</p>
        <div class="actions">${icsLink(g)}</div>
      </div>
    </div>

    <h3 class="session-sub">Session 1 tools</h3>
    <div class="tool-grid">
      ${TOOLS.map((t) => `<a class="card tool-card" href="${u(MEMBERS + "/" + t.slug)}"><h3>${t.title}</h3><p>${t.blurb}</p><span class="more">Open ${arrow}</span></a>`).join("")}
    </div>

    <h3 class="session-sub">Extras</h3>
    <div class="cards">
      <div class="card"><h3>Your free credit reports</h3><ul class="downloads">${S.session1Extras.creditReports.map((l) => `<li><a href="${l.url}" ${ext}>${l.label} ↗</a></li>`).join("")}</ul></div>
      <a class="card" href="${S.session1Extras.homebuyerGuide.url}" ${ext}><h3>${S.session1Extras.homebuyerGuide.label} ↗</h3><p>Our free guide, a good companion to the whole program.</p></a>
    </div>
  </div>
</section>
${TIP_SCRIPT}
${loginKit(u)}

<section class="band-tight">
  <div class="wrap">
    <h2 class="hub-title">Coming up</h2>
    <div class="cards">
      ${S.sessions.slice(1).map((s) => { const d = S.downloads["session" + s.number]; return `<div class="card"><span class="eyebrow">Session ${s.number} · ${s.months}</span><h3>${s.name}</h3><p class="session-q">“${s.question}”</p><ul class="downloads">${d.tools.map(download).join("")}</ul>${d.scripts.length ? `<h4 class="downloads-sub">“Questions to ask” scripts</h4><ul class="downloads">${d.scripts.map(download).join("")}</ul>` : ""}</div>`; }).join("")}
    </div>
  </div>
</section>

<section class="band-tight">
  <div class="wrap">
    <h2 class="hub-title">Videos</h2>
    <div class="video-grid">
      ${[2, 3, 4].filter((n) => S.videos["session" + n + "Intro"]).map((n) => `<div><h3>Session ${n} intro</h3>${video(S.videos["session" + n + "Intro"], "Session " + n + " intro")}</div>`).join("")}
      ${[1, 2, 3].filter((n) => S.videos["qa" + n + "Recording"]).map((n) => `<div><h3>Session ${n} live Q&amp;A recording</h3>${video(S.videos["qa" + n + "Recording"], "Session " + n + " live Q&A recording")}</div>`).join("")}
      ${S.videos.graduationRecording ? `<div><h3>Graduation recording</h3>${video(S.videos.graduationRecording, "Graduation recording")}</div>` : ""}
    </div>
    <p class="fine">Session intros, Q&amp;A recordings and the graduation recording appear here after each one.</p>
  </div>
</section>

<section class="band-tight">
  <div class="wrap">
    <h2 class="hub-title">More tools</h2>
    <div class="cards">
      <a class="card" href="${SITE.appUrl}" ${ext}><h3>Current rates and calculators ↗</h3><p>Robin's mortgage app. Download it and create an account.</p></a>
    </div>
  </div>
</section>

<section class="contact">
  <div class="wrap">
    <span class="eyebrow">Graduating in June? This is your next step</span>
    <div class="contact-head"><h2>Get pre-approved when you're ready.</h2><p>It's the best way to see your real numbers and exactly where you stand.</p></div>
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
