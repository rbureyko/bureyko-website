// Builds copy-and-paste Code Block files for Squarespace into squarespace/.
//   node squarespace.mjs
// Each page file holds its own styles, so every page is a single paste.
// Squarespace's own header, footer and blog are used; see squarespace/START-HERE.md.
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import { SITE, pages } from "./src/content.mjs";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, "squarespace");

// Links: Squarespace pages live at /about, /contact, ... and the blog at /blog
const u = (t) => (/^(https?:|tel:|sms:|mailto:|#)/.test(t) ? t : t === "/blog/" ? "/blog" : t);
// Photos come from the Squarespace image library; no other local assets are used in Squarespace blocks
const a = (f) => (f === "photos/sherri.jpg" ? SITE.photos.sherri : f === "photos/robin.jpg" ? SITE.photos.robin : f);

// ---------- scope the site CSS under .bmp so it can't clash with the Squarespace theme ----------
const SKIP = [/^body::before$/, /^html$/, /^\.skip/, /^\.header/, /^\.lockup/, /^\.nav/, /^\.menu/];
function scopeSelector(sel) {
  sel = sel.trim();
  if (SKIP.some((r) => r.test(sel))) return null;
  if (sel === ":root" || sel === "body") return ".bmp";
  if (sel === "*") return ".bmp *";
  if (sel.startsWith(":focus-visible")) return ".bmp " + sel;
  return ".bmp " + sel;
}
function scopeRules(css) {
  let out = "";
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const sels = m[1].split(",").map(scopeSelector).filter(Boolean);
    if (sels.length) out += sels.join(",") + "{" + m[2].trim() + "}\n";
  }
  return out;
}
function scopeCss(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/@font-face\{[^}]*\}/g, "");
  let out = "";
  // split top-level blocks, handling @media { ... } one level deep
  let i = 0;
  while (i < css.length) {
    const at = css.indexOf("@media", i);
    const chunkEnd = at === -1 ? css.length : at;
    out += scopeRules(css.slice(i, chunkEnd));
    if (at === -1) break;
    const open = css.indexOf("{", at);
    let depth = 1, j = open + 1;
    while (depth && j < css.length) { if (css[j] === "{") depth++; else if (css[j] === "}") depth--; j++; }
    const inner = scopeRules(css.slice(open + 1, j - 1));
    if (inner.trim()) out += css.slice(at, open).trim() + "{\n" + inner + "}\n";
    i = j;
  }
  return out;
}
const siteCss = scopeCss(fs.readFileSync(path.join(ROOT, "src/assets/styles.css"), "utf8"));

// Extra rules that keep Squarespace's theme styles from leaking into our blocks
const RESET = `
.bmp{font-family:"Fira Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif!important;text-align:left}
.bmp h1,.bmp h2,.bmp h3,.bmp p,.bmp li,.bmp a,.bmp span,.bmp summary{font-family:inherit;text-transform:none}
.bmp a{background-image:none}
.bmp ul,.bmp ol{margin-top:0;margin-bottom:0}
.bmp img{height:auto}
.bmp .portrait img{height:100%}
.bmp p:empty{display:none}
.sqs-block-code:has(.bmp){padding:0!important}
`;

const STYLE = `<style>
@import url("https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600;700&display=swap");
${siteCss}${RESET}</style>`;

const header = (title, route, extra = "") => `<!--
  Bureyko Mortgage Partners: ${title}
  Squarespace page address (URL slug): ${route === "/" ? "set this page as the Homepage" : route}
  Paste this whole file into ONE Code Block. Turn "Display Source" OFF. Do not edit anything below.${extra ? "\n  " + extra : ""}
-->
`;

// ---------- build ----------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "pages"), { recursive: true });
fs.mkdirSync(path.join(OUT, "blog-articles"), { recursive: true });
fs.mkdirSync(path.join(OUT, "images"), { recursive: true });
fs.copyFileSync(path.join(ROOT, "src/squarespace/START-HERE.txt"), path.join(OUT, "START-HERE.txt"));
for (const f of ["header-logo.png", "logo-with-brokerage.png", "browser-icon.png", "social-share-image.png"]) fs.copyFileSync(path.join(ROOT, "src/squarespace", f), path.join(OUT, "images", f));

const seoRows = [];
const order = [];
for (const page of pages({ posts: [] })) {
  if (page.route.startsWith("/blog")) continue; // the blog uses Squarespace's own Blog page
  const body = page.body({ u, a });
  const slug = page.route === "/" ? "home" : page.route.slice(1);
  const name = slug === "404" ? "page-not-found" : slug;
  const isForm = /checkup|guide$/.test(slug);
  const note = isForm ? "This page contains an embedded form (needs a Core, Plus or Advanced plan). On a Personal/Basic plan use the -basic-plan version instead." : "";
  fs.writeFileSync(path.join(OUT, "pages", name + ".txt"), header(page.title, page.route === "/404" ? "use as the Not Found page (Settings > Advanced > 404 page)" : page.route, note) + STYLE + `\n<div class="bmp">\n${body}\n</div>\n`);
  if (isForm) {
    const basic = body.replace(/<div class="form-frame"[\s\S]*?<\/div>/, (m) => {
      const src = m.match(/src="([^"]+)"/)[1];
      return `<div class="card" style="width:100%"><h3>Fill out the form</h3><p>The form opens in a new tab and takes a couple of minutes.</p><a class="btn btn-orange" href="${src}" target="_blank" rel="noopener">Open the form ↗</a></div>`;
    });
    fs.writeFileSync(path.join(OUT, "pages", name + "-basic-plan.txt"), header(page.title + " (Personal/Basic plan version)", page.route) + STYLE + `\n<div class="bmp">\n${basic}\n</div>\n`);
  }
  seoRows.push([page.title, page.route, name + ".txt", page.title.includes("|") ? page.title : `${page.title} | ${SITE.name}`, page.description]);
  order.push(name);
}

// Footer (goes into Squarespace's site-wide footer once)
const footer = `<footer class="footer">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <img src="${"data:image/png;base64," + fs.readFileSync(path.join(ROOT, "src/squarespace/footer-logo-small.png")).toString("base64")}" alt="${SITE.name}, powered by Mortgage Architects" width="300" height="116" loading="lazy">
        <p>${SITE.brokerageStatement}</p>
      </div>
      <div>
        <h2>Find your next step</h2>
        <div class="foot-links">
          <a href="/mortgage-services">Mortgage services</a>
          <a href="/first-time-home-buyer-guide">First-Time Homebuyer Guide</a>
          <a href="/mortgage-renewal-checkup">Mortgage Renewal Checkup</a>
          <a href="/partnerships">Realtor partnerships</a>
          <a href="/blog">Blog</a>
          <a href="${SITE.appUrl}" target="_blank" rel="noopener">Rates &amp; calculators app ↗</a>
          <a href="${SITE.reviewsUrl}" target="_blank" rel="noopener">Google reviews ↗</a>
        </div>
      </div>
      <div>
        <h2>Let's talk</h2>
        <div class="foot-links">
          <a href="tel:${SITE.sherri.tel}">Sherri · ${SITE.sherri.phone}</a>
          <a href="tel:${SITE.robin.tel}">Robin · ${SITE.robin.phone}</a>
          <a href="mailto:${SITE.email}">${SITE.email}</a>
          <a href="${SITE.applyUrl}" target="_blank" rel="noopener">Apply online ↗</a>
          <span>Calgary based. Serving Alberta.</span>
        </div>
      </div>
    </div>
    <div class="foot-fine">
      <p>${SITE.disclaimer}</p>
      <div class="row"><span>© ${new Date().getFullYear()} ${SITE.name} · Mortgage Architects</span><span><a href="/privacy">Privacy</a> · <a href="/terms">Website disclaimer</a></span></div>
    </div>
  </div>
</footer>`;
fs.writeFileSync(
  path.join(OUT, "footer.txt"),
  header("Site footer", "n/a", "Paste into a Code Block in the site FOOTER (not on a page).") +
    STYLE + `\n<div class="bmp">\n${footer}\n</div>\n`
);

// Blog intro (sits above Squarespace's blog list)
fs.writeFileSync(
  path.join(OUT, "blog-intro.txt"),
  header("Blog introduction", "/blog", "Paste into a Code Block in a section ABOVE the blog posts on your Blog page.") +
    STYLE +
    `\n<div class="bmp">
<section class="page-hero" style="border-bottom:0">
  <div class="wrap">
    <div class="stack">
      <span class="eyebrow">Mortgage insights</span>
      <h1>Clear answers to<br><em>common mortgage questions.</em></h1>
      <p class="lead">Plain-language articles on buying, renewing, refinancing, and credit in Alberta, from Sherri and Robin Bureyko.</p>
    </div>
  </div>
</section>
</div>\n`
);

// Blog articles: the live blog runs on the GitHub version of the site (see src/posts/), so none are exported here.

// SEO table
const csv = (s) => `"${String(s).replace(/"/g, '""')}"`;
fs.writeFileSync(
  path.join(OUT, "page-list-and-seo.csv"),
  ["Page,URL slug,Code file,SEO title,SEO description", ...seoRows.map((r) => r.map(csv).join(","))].join("\n") + "\n"
);
console.log(`Wrote ${order.length} page files to squarespace/pages/ plus footer and blog intro.`);
