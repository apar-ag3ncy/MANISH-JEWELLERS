# Deploy checklist — Manish Jewellers site

**Date:** 2026-09-16 · **Deployer:** Apar · **Target:** first public deploy (none exists yet)
**Release:** `1c9c436` on `main`

## Where this stands

Green: production build compiles (9 routes, all static), type-check and lint clean, no raw
hex outside tokens, no horizontal overflow at 390/768/1440, reduced motion renders
everything, loader verified in the production build.

Not configured: **no hosting, no domain verified, no environment variables, no CI, no
analytics, no error monitoring.** This is a first deploy, not a redeploy, so most of the
usual "is the pipeline green" apparatus does not exist yet.

## Blockers — must be resolved before the site is public

- [ ] **Invented testimonials attributed to named people.** Three quotes with names and
      cities ("Ritika S., Jaipur", "Aditya M., Mumbai", "Hannah W., London") are fiction I
      wrote as placeholder copy. Publishing fabricated customer reviews is misleading and,
      in several markets, unlawful. Replace with real quotes and permission, or cut the
      section.
- [ ] **Invented prices and product names.** Seven pieces carry made-up names and rupee
      prices (₹72,000–₹6,80,000) shown as a catalogue. Replace with real pieces and prices,
      or remove the price line and present them as lookbook imagery.
- [ ] **Contact details are zeros.** `+91 00000 00000`, `tel:+910000000000`,
      `wa.me/910000000000`, and Instagram points at `instagram.com/`. Every one is a dead
      end for a visitor who wants to reach the shop.
- [ ] **Every booking CTA is an anchor.** "Book a viewing", "Book a private viewing",
      "Book an appointment" and "Start a bespoke enquiry" all scroll to `#visit`. The site
      asks for the booking five times and cannot take one.
- [ ] **The newsletter form fakes success.** It waits 300 ms and shows "Thank you" while
      storing nothing. Either wire it to a real list or remove it.
- [ ] **Domain not verified.** `SITE_URL`, `metadataBase`, sitemap, robots and JSON-LD all
      assert `https://manishjewellers.in`. Confirm the domain is owned and pointed before
      deploy, or change it.

## Should fix before, or immediately after, launch

- [ ] Decide on the brochure's agency credit — the cover page image carries a designer
      credit line that will be publicly visible.
- [ ] Confirm the right to publish the campaign photography and the family photographs.
- [ ] Add analytics (Vercel Analytics is one line) and an error reporter.
- [ ] 45 MB of imagery lives in the repo (`public/campaign` 32 MB, `public/brochure` 13 MB).
      Fine for Vercel, but first-request image optimisation is slow: pre-warm after deploy.
- [ ] No CI. A GitHub Action running `next build` on PRs would catch what the local build catches.
- [ ] Store hours, address and the map are placeholder-adjacent — verify against the shop.

## Deploy (Vercel, first time)

- [ ] `vercel link` against the GitHub repo; framework auto-detects Next.js 15
- [ ] Confirm build command `next build`, Node 20+, no env vars needed today
- [ ] Deploy to a preview URL first; do not attach the domain yet
- [ ] Smoke test the preview (below), then promote to production
- [ ] Attach the domain, verify HTTPS and the `www` redirect
- [ ] Submit the sitemap in Search Console

## Smoke test (both preview and production)

- [ ] `/` cold load: loader plays the lockup, then hands off to the hero
- [ ] `/home` renders all sections; brochure reader scrolls; Cut Studio and Fitting Room respond
- [ ] Mobile 390: no horizontal scroll, menu opens, nothing pinned
- [ ] Reduced motion on: everything visible, nothing pinned, no intro
- [ ] 404 page renders; nav and footer links all resolve
- [ ] Share preview (OG image) renders on WhatsApp and X
- [ ] Lighthouse on `/home`: note LCP, CLS and INP as the post-launch baseline

## Rollback

This is a static marketing site with no database and no migrations, so rollback is
instant and lossless: **Vercel → Deployments → previous deployment → Promote**. Nothing to
reverse, no data to restore.

Roll back if, after deploy:
- the build succeeded but a page renders blank or errors in the browser console
- images 404 in production (the most likely first-deploy failure, given local `/public` paths)
- LCP on `/home` is materially worse than the preview baseline
- the loader traps the page (the CSS failsafe should prevent this; verify it does)

## Post-deploy

- [ ] Walk both pages on a real phone on mobile data, not just a desktop viewport
- [ ] Pre-warm image optimisation by loading every section once
- [ ] Record the Lighthouse baseline in this file
- [ ] Tell the client what is real and what is still placeholder, in writing
