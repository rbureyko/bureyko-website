# Bureyko Mortgage Partners: Blog Launch Package

**For:** Claude Code, as part of the bureykomortgages.ca deployment
**From:** Sherri Bureyko (prepared with Claude, October 18, 2026)
**What this is:** 11 finished, fact-checked blog posts to publish together at launch, plus everything needed to wire them into the site.

The post text is final and has been reviewed by Sherri. **Do not rewrite, shorten, or "improve" the wording.** Your job is layout, routing, links, and SEO plumbing.

---

## 1. What's in this folder

| File | What it is |
| --- | --- |
| `posts/01-...md` to `posts/11-...md` | The 11 posts. YAML front matter + Markdown body. |
| `links.json` | Values for every `{{TOKEN}}` used in the posts. |
| `content-plan.md` | The 12-month plan: topic hubs and the 22 posts coming after launch. Use it to design the blog so it scales. |
| `editorial-notes.md` | Sources behind each post and the remaining open items. For Sherri's records; **not** for publishing. |
| `Bureyko-12-Month-Blog-Content-Plan.pdf` | The same plan as a formatted PDF, for humans. |

## 2. Routes to create

- **Blog index:** `/blog`
- **Each post:** `/blog/<slug>` using the `slug` field in front matter.

| # | Slug | Hub |
| --- | --- | --- |
| 01 | `first-time-home-buyer-calgary-guide` | First-time buyers (main post) |
| 02 | `mortgage-renewal-calgary` | Renewal (main post) |
| 03 | `credit-score-mortgage-alberta` | Mortgage basics |
| 04 | `mortgage-stress-test-explained` | First-time buyers |
| 05 | `down-payment-mortgage-insurance-calgary` | First-time buyers |
| 06 | `closing-costs-calgary-alberta` | First-time buyers |
| 07 | `fixed-vs-variable-mortgage-calgary` | Renewal |
| 08 | `self-employed-mortgage-calgary` | Self-employed (main post) |
| 09 | `refinance-home-equity-calgary` | Refinance and equity (main post) |
| 10 | `mortgage-broker-vs-bank-calgary` | Mortgage basics (main post) |
| 11 | `mortgage-rates-calgary` | Mortgage basics |

Internal post-to-post links in the bodies are already written as `/blog/<slug>`. If you use a different base path, rewrite them consistently.

Add a **Blog** link to the main navigation and footer.

## 3. Front matter fields

| Field | Use |
| --- | --- |
| `title` | The on-page H1 and the card title on `/blog`. |
| `seoTitle` | The `<title>` tag and `og:title`. |
| `description` | Meta description, `og:description`, and the card excerpt on `/blog`. |
| `slug` | URL path. |
| `order` | Display order on `/blog` (1 = first). |
| `hub`, `hubMain` | Topic grouping (see section 6). |
| `author`, `authorTitle`, `company` | Byline. Render exactly as: **By Sherri Bureyko, Mortgage Associate, Bureyko Mortgage Partners** |
| `date` | Publish date (token; set from `links.json`). |
| `lastReviewed` | Show at the bottom of each post as "Last reviewed: October 2026". |
| `keywords` | Optional `<meta name="keywords">`; not required. |
| `related` | Slugs of related posts. The bodies already include a "Keep reading" section built from these, so you don't need to render them twice. |

The body does **not** include the title or byline. Render those from front matter above the body.

## 4. Links and tokens (important)

Replace every `{{TOKEN}}` using `links.json`. **Fail the build if any `{{` remains in rendered HTML.**

| Token | Current value | Where used |
| --- | --- | --- |
| `{{CONTACT_URL}}` | `/#bmp-lp-contact` | "reach out" links in every post |
| `{{HOMEBUYER_GUIDE_URL}}` | Homebuyer Guide Jotform | Posts 01, 05, 06 |
| `{{RENEWAL_CHECKUP_URL}}` | Renewal Checkup Jotform | Post 02 (twice) |
| `{{APPLY_URL}}` | **Missing** | Post 01, Step 6 |
| `{{SERVICE_SELF_EMPLOYED_URL}}` | **No page known** | Post 08, last section |
| `{{SERVICE_REFINANCE_URL}}` | **No page known** | Post 09, last section |
| `{{LAUNCH_DATE}}` | **Set at deploy** | All front matter |

**If a value is null:**

- `APPLY_URL`: use `CONTACT_URL` for now, and tell Sherri the apply link is still needed.
- `SERVICE_SELF_EMPLOYED_URL`: if the site has a self-employed service page, link it. If not, replace the paragraph under the `SERVICE-LINK` comment in post 08 with exactly:
  > Every business is different, so the best next step is a conversation. [Reach out]({{CONTACT_URL}}) anytime. We're happy to help, no pressure.
- `SERVICE_REFINANCE_URL`: same rule for post 09. Fallback paragraph:
  > [Reach out]({{CONTACT_URL}}) and we'll walk through it with you. No pressure, just clear answers.
- Remove the `<!-- SERVICE-LINK ... -->` HTML comments from the rendered output either way.

**Link behaviour:**

- Jotform links and the RECA link (`procheck.reca.ca`) are external: open in a new tab with `rel="noopener"`.
- Internal links (`/blog/...`, contact) open in the same tab.
- Link text is descriptive already; keep it.

## 5. Page layout for each post

Top to bottom:

1. H1 (`title`)
2. Byline line (author, title, company) and publish date
3. Body (the Markdown). Body headings start at `##` (H2) under the page H1, with `###` (H3) for subsections. Keep that hierarchy.
4. "Last reviewed: October 2026"
5. A simple call-to-action box using the site's existing contact options (call/text Sherri or Robin, email). Match the homepage's contact section.

Rendering notes:

- Posts 01 and 05 include Markdown tables. Make them readable on mobile (horizontal scroll or stacked).
- The final italic line in each post is a legal disclaimer. Keep it, styled small and muted.
- Use the site's existing brand styles (dark blue #306AB4, orange #F1A34B, light blue #9FC0D2, white). No grey accents.
- No hero images are supplied. If you add images, use real photos only (no illustrations), per Sherri's brand preference.

## 6. Blog index (`/blog`)

- Intro line: "Plain-language mortgage guides for Calgary and Alberta, written by Sherri Bureyko."
- List all 11 posts as cards (title, description, date), sorted by `order`.
- Group or filter by hub, using these labels:
  - `first-time-buyers` → **Buying your first home**
  - `renewal` → **Renewing your mortgage**
  - `refinance-equity` → **Refinancing and home equity**
  - `self-employed` → **Self-employed**
  - `mortgage-basics` → **Mortgage basics**
- Build the hub system so new hubs (`investors`, `life-changes`) can be added later without code changes. See `content-plan.md`.

## 7. SEO

For each post:

- `<title>` = `seoTitle`; meta description = `description`
- Canonical URL = `https://www.bureykomortgages.ca/blog/<slug>`
- Open Graph and Twitter card tags (title, description, URL, site name "Bureyko Mortgage Partners")
- JSON-LD `BlogPosting`: `headline` (title), `description`, `datePublished` (date), `dateModified`, `author` (Person: Sherri Bureyko, jobTitle: Mortgage Associate), `publisher` (Organization: Bureyko Mortgage Partners), `mainEntityOfPage` (canonical URL)

Site-wide:

- Add all 12 URLs (`/blog` + 11 posts) to `sitemap.xml`.
- Make sure `robots.txt` doesn't block `/blog`.

## 8. Before you deploy: checklist

- [ ] `LAUNCH_DATE` is set in `links.json`
- [ ] No `{{` tokens remain in the built HTML
- [ ] Every `/blog/...` link resolves (no 404s); there are 33 internal post links
- [ ] Both Jotform links open the right form
- [ ] Contact links reach the contact section or page
- [ ] Service-page paragraphs in posts 08 and 09 handled per section 4
- [ ] Tables in posts 01 and 05 look right on a phone
- [ ] Each post's byline reads "By Sherri Bureyko, Mortgage Associate, Bureyko Mortgage Partners"
- [ ] Sitemap includes all 12 URLs
- [ ] **Report back to Sherri:** the apply link is still missing (unless she has supplied it), and which service pages exist on the site

## 9. After launch

New posts arrive twice a month (1st and 3rd Tuesday), in the same format as these files. See `content-plan.md`. When a new post is added, also add a link to it from its hub's main post's "Keep reading" section.
