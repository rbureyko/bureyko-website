// Makes a 1200x630 cover image for each blog post into src/assets/blog/<slug>.png
// (used on the blog cards, at the top of each post, and as the link-sharing image).
//   node covers.mjs            only makes covers that don't exist yet
//   node covers.mjs --all      remakes every cover
// Needs a Chromium/Chrome browser; set CHROME=/path/to/chrome if it isn't found automatically.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import os from "node:os";
import { loadPosts, hubLabel } from "./src/blog.mjs";
import { ICON, ART_GUIDE, ART_CAL, ART_HOUSE } from "./src/content.mjs";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, "src/assets/blog");
const ALL = process.argv.includes("--all");
const CHROME =
  process.env.CHROME ||
  ["/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell", "/usr/bin/chromium", "/usr/bin/google-chrome",
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find((p) => fs.existsSync(p));
if (!CHROME) throw new Error("No Chrome/Chromium found. Set CHROME=/path/to/chrome.");

const big = (k) =>
  `<svg viewBox="0 0 40 40" fill="none" stroke="#306AB4" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${ICON[k].replace(/stroke="#F38F26"/g, 'stroke="#F38F26" stroke-width="1.8"')}</svg>`;
// One drawing per topic, so posts in the same topic look like a set
const ART = {
  "first-time-buyers": ART_HOUSE,
  renewal: ART_CAL,
  "refinance-equity": big("refi"),
  "self-employed": big("self"),
  "mortgage-basics": ART_GUIDE,
  investors: big("rental"),
  "life-changes": big("divorce"),
};
const font = (w) => `url(${path.join(ROOT, "src/assets/fonts", `fira-sans-latin-${w}-normal.woff2`)})`;

fs.mkdirSync(OUT, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "covers-"));
let made = 0;
for (const p of loadPosts({ includeDrafts: true })) {
  const file = path.join(OUT, p.slug + ".png");
  if (!ALL && fs.existsSync(file)) continue;
  const art = ART[p.hub] || ART_GUIDE;
  const len = p.title.length;
  const size = len > 70 ? 50 : len > 52 ? 56 : 64;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:F;font-weight:400;src:${font(400)}}@font-face{font-family:F;font-weight:600;src:${font(600)}}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#F0F6FD;font-family:F,Arial,sans-serif;color:#193C66;overflow:hidden;position:relative}
.wrap{position:absolute;inset:0;display:grid;grid-template-columns:1fr 380px;gap:56px;align-items:center;padding:64px 72px}
.eyebrow{display:flex;align-items:center;gap:14px;font-size:22px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#306AB4;margin-bottom:26px}
.eyebrow:before{content:"";width:40px;height:5px;border-radius:3px;background:#F38F26}
h1{font-size:${size}px;line-height:1.1;letter-spacing:-.02em;font-weight:600;color:#306AB4}
.brand{position:absolute;left:72px;bottom:48px;display:flex;align-items:center;gap:14px;font-size:20px;font-weight:600;letter-spacing:.06em;color:#193C66}
.brand svg{width:44px}
.frame{height:470px;background:#fff;border:2px solid #D6E4F5;border-radius:190px 190px 14px 14px;display:grid;place-items:center;padding:56px}
.frame svg{width:100%;height:100%;max-height:300px}
.bar{position:absolute;left:0;right:0;bottom:0;height:10px;background:#306AB4}
.bar:after{content:"";position:absolute;left:0;bottom:0;width:260px;height:10px;background:#F38F26}
</style></head><body>
<div class="wrap"><div><div class="eyebrow">${hubLabel(p.hub)}</div><h1>${p.title}</h1></div><div class="frame">${art}</div></div>
<div class="brand"><svg viewBox="0 0 48 48" fill="none"><path d="M4 23 24 6l20 17" stroke="#306AB4" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M33 9V4h5v9" stroke="#306AB4" stroke-width="3.4"/></svg>BUREYKO MORTGAGE PARTNERS</div>
<div class="bar"></div>
</body></html>`;
  const htmlFile = path.join(tmp, p.slug + ".html");
  fs.writeFileSync(htmlFile, html);
  execFileSync(CHROME, ["--headless", "--no-sandbox", "--hide-scrollbars", "--disable-gpu", `--screenshot=${file}`, "--window-size=1200,630", "file://" + htmlFile], { stdio: "ignore" });
  made++;
}
console.log(`Made ${made} cover image(s) in src/assets/blog/.`);
