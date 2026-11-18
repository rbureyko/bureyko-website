# Bureyko Mortgage Partners website: standing rules

- **Business name:** always "Bureyko Mortgage Partners".
- **Titles:** Sherri and Robin Bureyko are both **Mortgage Professionals**. Always call them that. Never call them mortgage brokers. General explanations of what "a mortgage broker" does in blog posts may stay.
- **Brand colours:** blue #306AB4, dark text #193C66, orange #F1A34B, light blue #9FC0D2, white. Dark text on orange buttons. No grey accents.
- **Blog posts** arrive from Sherri as final text. Don't rewrite them; handle layout, links (`src/posts/links.json`) and covers (`node covers.mjs`).
- Pages and wording live in `src/content.mjs`; styles in `src/assets/styles.css`. Pushing to `main` publishes the site via GitHub Pages.
- **Brokerage line:** use only this wording, exactly, everywhere (it lives in `SITE.brokerageStatement` in `src/content.mjs`): "Bureyko Mortgage Partners, powered by Mortgage Architects, is a member of the publicly traded DLCG group of companies. Together, our networks originate more mortgages in Canada than any individual bank, trust company, or credit union."
- **Compliance:** the For REALTORS® page and the realtor one-pager were cleared by Mortgage Architects compliance in October 2026.
- **Break Up With Renting** (free first-time buyer program): pages in `src/buwr.mjs`; dates, Zoom, venue, videos and downloads in `src/buwr/content.json`; Session 1 tools in `src/buwr/tools/`. The members area (`/break-up-with-renting/members/`) is encrypted at build time with the `MEMBERS_PASSWORD` GitHub Actions secret (never in code); without the secret it publishes as "opening soon". Scorecard results go to the Jotform "Break Up With Renting: Scorecard Results", which emails the member and Robin. Program pages use real photos only, no illustrations. Never invent dates, links, testimonials or video links.
