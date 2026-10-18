// Blog posts: reads src/posts/*.md, fills in {{TOKENS}} from links.json, and turns Markdown into HTML.
// Post wording is final (supplied by Sherri). Nothing here changes the text; it only handles links and layout.
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

const DIR = path.join(path.dirname(new URL(import.meta.url).pathname), "posts");
const LINKS = JSON.parse(fs.readFileSync(path.join(DIR, "links.json"), "utf8"));
const HUBS = JSON.parse(fs.readFileSync(path.join(DIR, "hubs.json"), "utf8")).hubs;

const fillTokens = (text, file) =>
  text.replace(/\{\{([A-Z_]+)\}\}/g, (m, key) => {
    const v = LINKS[key];
    if (v == null || v === "") throw new Error(`No value for ${m} (used in ${file}). Add it to src/posts/links.json.`);
    return v;
  });

// Front matter values are JSON-style: "strings", numbers, true/false, ["lists"]
function parseFrontMatter(block, file) {
  const data = {};
  for (const line of block.split("\n")) {
    const i = line.indexOf(":");
    if (i <= 0) continue;
    const key = line.slice(0, i).trim();
    const raw = line.slice(i + 1).trim();
    try { data[key] = JSON.parse(raw); } catch { data[key] = raw.replace(/^["']|["']$/g, ""); }
  }
  if (!data.title || !data.slug) throw new Error("Post is missing a title or slug: " + file);
  return data;
}

export const hubLabel = (slug) =>
  (HUBS.find((h) => h.slug === slug) || {}).label ||
  String(slug || "Articles").replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
export const hubOrder = (slug) => {
  const i = HUBS.findIndex((h) => h.slug === slug);
  return i === -1 ? 999 : i;
};

export function loadPosts({ includeDrafts = false } = {}) {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      // Remove internal notes (e.g. <!-- SERVICE-LINK ... -->) before anything else, so they never reach a page.
      const raw = fs.readFileSync(path.join(DIR, f), "utf8").replace(/<!--[\s\S]*?-->\n?/g, "");
      const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!m) throw new Error("Missing front matter in " + f);
      const d = parseFrontMatter(fillTokens(m[1], f), f);
      return {
        file: f,
        slug: d.slug,
        route: "/blog/" + d.slug,
        title: d.title,
        seoTitle: d.seoTitle || d.title,
        description: d.description || "",
        date: d.date,
        order: Number(d.order) || 999,
        hub: d.hub || "",
        hubMain: d.hubMain === true,
        author: d.author || "Sherri Bureyko",
        authorTitle: d.authorTitle || "",
        company: d.company || "Bureyko Mortgage Partners",
        lastReviewed: d.lastReviewed || "",
        keywords: Array.isArray(d.keywords) ? d.keywords : [],
        related: Array.isArray(d.related) ? d.related : [],
        draft: d.draft === true,
        md: fillTokens(m[2], f),
      };
    })
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => a.order - b.order);
}

// Markdown -> HTML, with the site's link rules:
//   other websites open in a new tab; pages on this site open in the same tab (and get the right address via u()).
export function renderPost(md, u) {
  let html = marked.parse(md);
  html = html.replace(/<a href="([^"]+)"/g, (m, href) =>
    /^https?:/.test(href) ? `<a href="${href}" target="_blank" rel="noopener"` : `<a href="${u(href)}"`
  );
  html = html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, "</table></div>");
  // The closing italic line is the legal disclaimer
  html = html.replace(/<p><em>([^]*?)<\/em><\/p>\s*$/, '<p class="post-disclaimer"><em>$1</em></p>\n');
  return html;
}
