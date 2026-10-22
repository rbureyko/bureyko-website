// Builds the Bureyko Mortgage Partners website into dist/.
//   node build.mjs            production build (clean URLs like /about, drafts hidden)
//   node build.mjs --preview  preview build (relative .html links, drafts shown)
import fs from "node:fs";
import path from "node:path";
import { SITE, SERVICES, pages } from "./src/content.mjs";
import { loadPosts } from "./src/blog.mjs";

const PREVIEW = process.argv.includes("--preview");
const OUT = PREVIEW ? "preview" : "dist";
// BASE_PATH is set while the site lives at rbureyko.github.io/bureyko-website; empty once the domain points here.
const BASE = (process.env.BASE_PATH || "").replace(/\/$/, "");
// CUSTOM_DOMAIN=1 writes the CNAME file that tells GitHub to serve www.bureykomortgages.ca.
const CUSTOM_DOMAIN = process.env.CUSTOM_DOMAIN === "1";
const ROOT = path.dirname(new URL(import.meta.url).pathname);

// ---------- helpers ----------
export const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// A page's output file, from its route: "/" -> index.html, "/about" -> about.html, "/blog/" -> blog/index.html
const fileFor = (route) =>
  route === "/" ? "index.html" : route.endsWith("/") ? route.slice(1) + "index.html" : route.slice(1) + ".html";

// Link helpers are made per page, because preview links are relative to the page's folder.
function makeHelpers(route) {
  const depth = fileFor(route).split("/").length - 1;
  const up = "../".repeat(depth);
  const u = (target) => {
    if (/^(https?:|tel:|sms:|mailto:|#)/.test(target)) return target;
    const [p, hash = ""] = target.split("#");
    const h = hash ? "#" + hash : "";
    if (!PREVIEW) return BASE + (p || "/") + h;
    return (up + fileFor(p || "/")) + h;
  };
  const a = (file) => (PREVIEW ? up : BASE + "/") + "assets/" + file;
  return { u, a };
}

// ---------- blog posts ----------
const allPosts = loadPosts({ includeDrafts: PREVIEW });

export const fmtDate = (iso) =>
  new Date(iso + "T12:00:00").toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

// ---------- layout ----------
const NAV = [
  ["Home", "/"],
  ["Our team", "/about"],
  ["Mortgage services", "/mortgage-services"],
  ["For realtors", "/partnerships"],
  ["Resources", "/resources"],
  ["Blog", "/blog/"],
];

function layout({ route, title, exactTitle, description, body, jsonld = "", noindex = false, ogType = "website", ogImage, keywords }, h) {
  const { u, a } = h;
  const fullTitle = exactTitle || (route === "/" ? title : `${title} | ${SITE.name}`);
  const image = SITE.url + "/assets/" + (ogImage || "og-image.png");
  const canonical = SITE.url + (route === "/" ? "/" : route);
  const navLinks = NAV.map(
    ([label, href]) =>
      `<a href="${u(href)}"${route === href || (href !== "/" && route.startsWith(href.replace(/\/$/, ""))) ? ' aria-current="page"' : ""}>${label}</a>`
  ).join("\n        ");
  return `<!doctype html>
<html lang="en-CA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${image}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${image}">
${keywords && keywords.length ? `<meta name="keywords" content="${esc(keywords.join(", "))}">` : ""}
<meta name="theme-color" content="#306AB4">
<link rel="icon" href="${a("bureyko-square.svg")}" type="image/svg+xml">
<link rel="preload" href="${a("fonts/fira-sans-latin-400-normal.woff2")}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${a("styles.css")}">
${jsonld}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="header">
  <div class="wrap">
    <a class="lockup" href="${u("/")}" aria-label="${esc(SITE.name)}, powered by Mortgage Architects. Home">
      <img class="logo-name" src="${a("bureyko-logo.svg")}" alt="" width="240" height="61">
      <span class="lockup-rule"></span>
      <img class="logo-ma" src="${a("logo-ma.svg")}" alt="" width="210" height="30">
    </a>
    <nav class="nav" aria-label="Main">
        ${navLinks}
        <a class="btn btn-line" href="${SITE.applyUrl}" target="_blank" rel="noopener">Apply</a>
        <a class="btn btn-orange" href="${u("/contact")}">Let's talk</a>
    </nav>
    <details class="menu">
      <summary>Menu</summary>
      <div class="menu-panel">
        ${NAV.map(([l, href]) => `<a href="${u(href)}">${l}</a>`).join("\n        ")}
        <a href="${u("/contact")}">Contact</a>
        <a class="btn btn-orange" href="${SITE.applyUrl}" target="_blank" rel="noopener">Apply online</a>
      </div>
    </details>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="footer">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <img src="${a("logo-full.svg")}" alt="${esc(SITE.name)}, powered by Mortgage Architects" width="300" height="116" loading="lazy">
        <p>${SITE.brokerageStatement}</p>
      </div>
      <div>
        <h2>Find your next step</h2>
        <div class="foot-links">
          <a href="${u("/mortgage-services")}">Mortgage services</a>
          <a href="${u("/first-time-home-buyer-guide")}">First-Time Homebuyer Guide</a>
          <a href="${u("/mortgage-renewal-checkup")}">Mortgage Renewal Checkup</a>
          <a href="${u("/partnerships")}">Realtor partnerships</a>
          <a href="${u("/blog/")}">Blog</a>
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
      <div class="row"><span>© ${new Date().getFullYear()} ${esc(SITE.name)} · Mortgage Architects</span><span><a href="${u("/privacy")}">Privacy</a> · <a href="${u("/terms")}">Website disclaimer</a></span></div>
    </div>
  </div>
</footer>
</body>
</html>
`;
}

// ---------- build ----------
fs.rmSync(path.join(ROOT, OUT), { recursive: true, force: true });
const write = (rel, content) => {
  const f = path.join(ROOT, OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
};
fs.cpSync(path.join(ROOT, "src/assets"), path.join(ROOT, OUT, "assets"), { recursive: true });
if (fs.existsSync(path.join(ROOT, "src/static"))) fs.cpSync(path.join(ROOT, "src/static"), path.join(ROOT, OUT), { recursive: true });

const ctx = { posts: allPosts, PREVIEW };
const built = [];
for (const page of pages(ctx)) {
  const h = makeHelpers(page.route);
  const body = page.body(h);
  const html = layout({ ...page, body }, h);
  if (html.includes("{{")) throw new Error(`Unfilled {{TOKEN}} on ${page.route}. Add its value to src/posts/links.json.`);
  write(fileFor(page.route), html);
  if (!page.noindex) built.push(page.route);
}

// sitemap + robots (production only matters, but harmless in preview)
const today = new Date().toISOString().slice(0, 10);
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${built
    .map((r) => `  <url><loc>${SITE.url}${r}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`
);
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITE.url}/sitemap.xml\n`);
if (!PREVIEW && CUSTOM_DOMAIN) write("CNAME", SITE.url.replace(/^https?:\/\//, "") + "\n");
console.log(`Built ${built.length} pages into ${OUT}/ (${allPosts.length} blog posts${PREVIEW ? ", drafts included" : ""}).`);
