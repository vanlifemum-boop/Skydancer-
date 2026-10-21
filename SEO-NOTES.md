# Skydancer SEO and AI-search readiness

Deployed target: https://vanlifemum-boop.github.io/Skydancer-/

## Maintenance

- Edit `scripts/build-site.mjs` for copy, metadata, facts, FAQs and JSON-LD. Run `node scripts/build-site.mjs` and `python3 scripts/validate-site.py` afterwards, then commit the generated files.
- `assets/site-v2.js` progressively enhances native HTML. Crawlers and visitors without JavaScript receive the same visible product content. There is no crawler-specific content, hidden keyword block or client-rendered app shell.
- The FAQ schema is generated from the same strings as the visible FAQs. Vehicle schema deliberately omits invented prices, reviews, production availability, dimensions and certified winter capability. It does not claim eligibility for Product or FAQ rich results.
- The existing supplied vehicle film remains linked. VideoObject rich-result markup is intentionally deferred until its real upload date and other required metadata are verified. Never substitute the page modification date for the video's upload date.
- Keep `UPDATED` accurate when meaningful content changes, rather than changing it automatically on each build.
- Original JPEGs and logo are retained. WebP copies are format/resolution optimizations, not changes to the vehicle. The responsive image sizes are recorded in the HTML source.
- No analytics, advertising tags, new cookies, external font requests or third-party embedded player have been added.
- No AI citation, indexing, ranking or rich-result guarantee is made. Helpful crawlable content and accurate information are the foundation; special AI files are not required.

## Remaining account/domain actions

1. Verify the URL-prefix property `https://vanlifemum-boop.github.io/Skydancer-/` in Google Search Console and Bing Webmaster Tools using the real verification token supplied by those accounts. Do not invent tokens. Submit `https://vanlifemum-boop.github.io/Skydancer-/sitemap.xml` and inspect the home URL.
2. A project's `/Skydancer-/robots.txt` is **not an effective host robots file**. Crawlers consult `https://vanlifemum-boop.github.io/robots.txt`. This repository cannot change the host root; no unrelated repository was modified. A missing host robots file normally permits crawling. The included robots file is a documented production-domain template, not a claimed live crawler policy.
3. When authorized access to the official domain is provided, deploy this version there, update `BASE`, regenerate the sitemap/metadata/schema and configure appropriate permanent redirects. Do not point canonical at an old page with different content before the migration.
4. The earlier audit observed unrelated Japanese search-result titles for the old official domain. That observation alone is not proof of an active compromise. Check Search Console's security/manual-action reports and the original hosting/CMS; the GitHub repository cannot repair an old-domain or search-index incident.

## Verification

The static validator checks one H1, crawlable text, canonical URL, Open Graph and Twitter metadata, visible/schema FAQ parity, unique IDs and local fragment targets, image dimensions and alt text, local assets, absence of garage wording, 404 noindex, and a well-formed sitemap. Run `node scripts/test-interactions.mjs` for dependency-free controller regression tests. These tests are not a substitute for browser rendering or field Core Web Vitals measurements.

Pre-deployment managed browser preview was unavailable because the preview supervisor was not running. Source validation and controller tests passed; post-deployment browser verification is recorded separately in the handoff.
