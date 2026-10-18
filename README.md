# Bureyko Mortgage Partners website

The site for www.bureykomortgages.ca. It's a plain static site: one build script turns the files in `src/` into finished web pages, and GitHub Pages publishes them every time a change is pushed to `main`.

## Where things live

| What | File |
| --- | --- |
| Phone numbers, email, apply link, form links, photos | `src/content.mjs` (the `SITE` block at the top) |
| Wording on every page | `src/content.mjs` |
| The 8 service pages | `src/content.mjs` (the `SERVICES` list) |
| Blog articles | `src/posts/*.md`, one file per article |
| Colours, fonts, layout | `src/assets/styles.css` |
| Logos and images | `src/assets/` |

## Adding a blog article

Create a new file in `src/posts/`, named after the article's web address, for example `src/posts/how-pre-approval-works.md`:

```
---
title: How pre-approval works
description: One or two sentences shown on the blog page and in Google.
date: 2026-11-01
category: Buying a Home
draft: false
---

Write the article here. Use ## for section headings.
```

Set `draft: true` to keep an article off the live site while it's being reviewed.

## Building locally

```
npm install
npm run build     # live version, written to dist/
npm run preview   # review version with drafts, written to preview/ (open preview/index.html)
```

## Blog cover images

After adding a post, run `node covers.mjs` to make its cover image (it skips posts that already have one), then commit the new file in `src/assets/blog/`.
