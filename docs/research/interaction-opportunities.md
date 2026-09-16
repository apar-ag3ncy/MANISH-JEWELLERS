# What to build next: interaction research for the Manish Jewellers site

**Date:** 2026-09-16 · **Method:** 112-agent fan-out over primary sources, each claim
adversarially verified 3-vote; only claims that survived are recorded here.

## Verified findings

1. **Try-on is merchandised as a browse surface, not a button.** Cartier runs a try-on hub
   plus category try-on pages inside the browse taxonomy, with the full faceted-listing
   apparatus, and frames it in its own words as "model, size, material… compare".
   *(high — cartier.com /virtual-try-on.html, /jewelry/bracelets/bracelets-virtual-try-on/)*
2. **Booking and a named human are terminal CTAs, and booking is table stakes.** Cartier's
   personalization page ends in "Make an appointment" and "Contact an ambassador"; Candere
   ships a name/email/phone + date + half-hour-slot modal with a booked state; BlueStone adds
   a video call and try-at-home. *(high)*
3. **Ring-size finders are physical calibration widgets, not AR.** Tanishq draws a ring
   outline over a slider you drag to match a ring you own, bounces desktop users to mobile by
   QR, publicly discloses a 1–2 mm undersize error, and links a printable PDF. *(high)*
4. **Where AR try-on ships in India it is a vendor SDK wrapped in merchandising** — open
   camera, try, download and share, Buy Now, plus in-session cross-sell. *(medium — mirrAR via Candere)*
5. **Product pages resolve to four layout systems**: horizontal tabs, sticky table of
   contents, collapsed sections, one long page. Baymard argues against horizontal tabs and
   recommends sticky ToC on desktop, collapsed sections on mobile. *(high — baymard.com/research/product-page)*
6. **"Image-led" is a content-type requirement, not a volume one.** Baymard identifies seven
   distinct product image types users need, including at least one in-scale image and
   on-model images for accessories — not simply more hero photography. *(high)*
7. **360-spin and product video are supplements users mostly ignore.** Baymard benchmarks
   both but its own testing found the large majority never touch 360 and most skip video;
   neither replaces a high number of diverse static images. *(medium)*
8. **Scroll-jacking is a measured risk with conditional rules, not a ban.** NN/g found the
   majority of participants at least mildly disoriented, and prescribes: below the fold only,
   never change scroll direction, minimal text inside, avoid on mobile, interleave
   non-jacked sections. *(high — nngroup.com/articles/scrolljacking-101/)*

## Refuted — do not repeat these

Verification killed a set of plausible claims: that Tiffany's Ring Studio ships no
configurator, that Cartier's engraving has no preview, that CaratLane collapses everything
into a PIN-code primitive and ships no AR, that Candere's try-on is footer-only and
neck-worn only, Baymard's widely quoted 67–90% vs 17–33% product-list abandonment figures
and the "4-fold leads" line, and NN/g's category/listing merge guidance. None of these are
safe to cite.

## Not researched

Questions 4 and 5 of the brief returned **zero surviving claims**: Core Web Vitals and INP
budgets, WCAG 2.2 motion and carousel requirements, prefers-reduced-motion practice, and the
implementation routes and costs for GSAP / three.js / model-viewer / AR vendors. Treat
anything said about those as unverified until a second pass runs.

## Recommendations for this site, in order

| # | Move | Why | Effort |
|---|---|---|---|
| 1 | Make "Book a viewing" real — date, half-hour slots, name/phone/email, booked state, WhatsApp fallback | Finding 2: terminal CTA at the top, table stakes at the bottom. Ours currently jumps to an anchor | Small–medium |
| 2 | Ring-size finder as a calibration widget, mobile-first with QR handoff, honest error line, printable guide | Finding 3: this is the market's actual pattern, and it suits the Cut Studio's family | Medium |
| 3 | Plan the seven image types before shooting more | Finding 6: in-scale and on-model shots are missing; more hero photography is not the gap | Planning |
| 4 | When product pages arrive: sticky ToC on desktop, collapsed sections on mobile, never tabs | Finding 5 | Medium |
| 5 | Hold at three pinned sequences; keep text inside them short; keep the brochure on native scroll | Finding 8, conditions already met | Done — maintain |
| 6 | Skip 360-spin | Finding 7: mostly ignored, and the Cut Studio already answers "show me the stone" | — |
| 7 | Defer AR try-on until there is a real catalogue; copy Cartier's framing, not the tech | Findings 1 and 4 | Large |
