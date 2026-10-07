# Manish Jewellers

A jewellery house website built with Next.js 15, React, Tailwind CSS v4, GSAP and Lenis. Pages and new presentation components use ordinary JSX. TypeScript remains in existing typed tools, validation, shared utilities and framework-generated image/SEO handlers.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. For a production preview:

```bash
npm run build
npm run start
```

## Page structure

The welcome page is `/`, with its existing sections:

- `#collections` — jewellery photography and the house brochure
- `#campaign` — accessible bridal campaign carousel
- `#our-story` — heritage and craftsmanship
- `#brochure` — expandable, keyboard-accessible brochure reader
- `#house-edit` — the collection imagery, atelier story and gifting presentation
- `#visit` — showroom details and directions

`/home` is the house collection, with jewellery categories, the bridal campaign, house edit and heritage journey. `/about` is the family story and brochure. The diamond-cut explorer and sizing guide live on `/bespoke#cut-studio` and `/bespoke#fitting`. Each route has its own canonical URL and sitemap entry.

The internal pages are:

- `/collections` — model and jewellery introduction, all 16 brochure product photographs, category filters and the horizontally swipeable collection gallery
- `/collections/necklaces`, `/collections/rings`, `/collections/bangles`, `/collections/earrings`, `/collections/ornaments` — complete category edits with full product views
- `/bespoke` — the commission process, diamond explorer and fitting tools
- `/campaign` — the bridal editorial, using the campaign photography
- `/diamond-guide` — five interactive shapes, facet controls and an animated anatomy/light explainer
- `/visit` — the house welcome, opening hours, directions and expandable visit information

The navbar links to these pages, indicates the current section and offers a keyboard-accessible collection menu. Mobile navigation includes direct category links, a focus trap, Escape dismissal and scroll-lock cleanup.

## Folder conventions

```text
src/app/                          Route composition and metadata (page.jsx)
src/components/layout/            Shared navbar, footer and scroll infrastructure
src/components/motion/            Scoped GSAP presentation helpers (JSX)
src/components/sections/
  collections/                    Gallery and reusable collection detail layout
  bespoke/                        Bespoke experience
  campaign/                       Bridal editorial
  diamonds/                       Shape studio and scroll-driven diamond diagrams
  diamond-experience/              Shared interactive finale before the footer
  visit/                          Showroom details
  shared/                         Internal-page invitation
  about/, home/, landing/         Existing house and welcome sections
src/data/collections.js           Category copy and real asset references
src/data/internal-pages.js        Bespoke, campaign and visit copy
src/styles/internal-pages.css     Shared page rhythm and feature layouts
src/styles/navigation.css         Navbar and category menu
src/styles/glass-controls.css     Shared glass buttons and photograph controls
src/styles/heritage-story.css     Flowing heritage chapters and year navigation
src/styles/diamond-guide.css      Diamond studio and educational story
src/lib/diamond-experience/        Lazy 3D renderer, faceted geometry and burst shader
src/data/diamond-experience.js     Finale copy and the surrounding rock composition
src/styles/diamond-experience.css  Dark stage, typography, controls and static fallback
src/components/layout/HouseFinale.jsx  Shared diamond-to-footer composition
src/lib/diamond-experience/footer-handoff.js  One-wordmark scroll handoff and docking geometry
```

Keep routes small: compose a feature component rather than putting animation, data and layout in a single page file. Use `.jsx` for visual components and `.js` for untyped data. Add TypeScript when a component or service actually benefits from a typed contract.

`ScrollMotion.jsx` scopes its GSAP timelines to its own feature and reverts them on navigation or a motion-preference change. `data-scroll-fade` gives copy a reversible entrance, reading pause and exit. `data-image-swipe` uncovers photography from left to right with a restrained image drift; `="intro"` uses a timed entrance for above-the-fold imagery. The gallery keeps native touch scrolling and keyboard links, with eased GSAP arrow navigation and mouse dragging. HTML remains readable without JavaScript; reduced motion removes the fades, masks and image drift.

The heritage journey at `/about#heritage` and `/home#heritage` tells six chapters: 1916, 1932, 1952, 1988, 2025 and 2026. Each chapter occupies its own scene in normal document flow. Scoped GSAP timelines draw craft symbols, drift the photography and fade the narrative in both scroll directions. A slim sticky year navigator links to real chapter anchors; the story itself never pins or locks scrolling. Reduced motion and no JavaScript retain every chapter. Copy and photo references live in `src/data/legacy.ts`; historic dates and founding names follow the existing house brochure. Photographs illustrate the narrative and carry source captions.

The diamond guide uses SVG objects to reveal five outlines and their facets. On larger screens, a scroll-driven diagram separates the table, crown and pavilion, reassembles the stone and draws an illustrative light path. Smaller screens and reduced-motion visits receive separate readable diagrams alongside each lesson. The guide includes links to its GIA educational sources.

The shared finale at `#diamond-experience` sits immediately before the footer in `HouseFinale.jsx`. It follows the supplied Gold Bar recording's dark stage, rough surrounding stones and reversible fragment assembly, with a diamond in place of the gold bar. One original MANISH JEWELLERS SVG lives in the footer: there is no second wordmark in the diamond scene. `footer-handoff.js` measures its scene and footer positions on ScrollTrigger refresh, then applies GSAP transform setters as native scrolling carries the scene upward. The lettering holds still during the first part of that exit, settles gently down to the footer's reserved slot, then follows the footer's document position. Reverse scrolling retraces the same geometry. The progress rule fades during the exit, and the footer columns remain in native flow. Reduced motion and no JavaScript show the wordmark directly in the footer.

A GSAP scrub timeline gathers the facets, holds the complete diamond and releases them again; scrolling backwards reverses the sequence. Hover gently turns the arrangement, dragging rotates it, and arrow keys provide the same control. The chapter button row is removed. Space gathers or scatters, Home and End explore the scroll range, and R or Reset view restores the orientation. Vertical touch scrolling remains native.

Three.js loads only near the finale. The 120 fragments use a shared GPU shader and one mesh rather than a separate render loop per fragment. The assembled crystal uses an approximate brilliant volume with up to three internal light reflections, sharp studio highlights and subtle spectral dispersion. Burst fragments use a simpler refraction shader. Both avoid an offscreen transmission pass. Resolution adapts down during slow interaction, then resolves at the device's capped full resolution after 220 ms of rest. Frames are requested by GSAP, pointer input or resize; the renderer stops when hidden or outside the viewport and disposes its resources on unmount. Reduced motion removes the long scroll sequence but retains instant manual controls. An SVG version preserves the composition and controls when WebGL is unavailable, and remains visible without JavaScript.

The surrounding rocks follow the client's black anthracite finishing reference: broad broken slabs, dark undersides, satin faces and fine bronze mineral seams. `rock-geometry.js` intersects seeded planes, adds shallow continuous relief and smooths normals within each fracture face while preserving its edges. `rock-material.js` projects a generated stone photograph and packed height, roughness and crevice maps along three axes. These local WebP assets load before the 3D canvas appears; a small version also textures the SVG fallback. `rock-motion.js` grounds each stone by its lowest vertex, then applies staggered lifts and slow turns from the same reversible burst state. A shared instanced mesh adds 20 small fragments on desktop and 12 on mobile. Warm rim light and filtered shadows finish the material; the rock field remains still when interaction stops. See `docs/rock-material.md` for asset sizes, the generation prompt and preparation script.

## Content and design

Brand, catalogue and store data live in `src/data/content.ts`; current page copy is in `src/data/enhance-landing.ts`. The original logo vectors remain in `src/components/ui/brand/`. The landing sections use the existing campaign and brochure photography, wine palette and rose-gold brand treatment.

The client-confirmed primary brand color is **#793f48**, defined as `--color-brand` in `globals.css`. The wine token aliases it, including the Open Graph preview. Shared glass styles in `glass-controls.css` cover native buttons and linked controls with transparent fills, backdrop blur and subtle edges. Parth Karnavat's verified contact number, **+91 9929295123**, lives in the footer data and opens a native telephone link.

Collections includes eight optimized WebP house assets in `public/house/`. Presentation imagery complements the original brochure pieces; it does not claim product availability or prices. `CollectionEditorial.jsx`, `collection-editorial.js` and `collection-editorial.css` keep the gallery's behavior, content and style separate. The native dialog supports previous/next, arrow keys, Escape, focus return and coordinated Lenis scroll locking.

The welcome page reuses that house edit, atelier and gifting presentation in place of the old text-only bespoke section. The internal collections page retains its complete edition. Footer sizing and process links now point to the useful tools on the bespoke page.

The jewellery inventory comes directly from the 16 unique native photographs on pages 5–12 of the supplied `manish-jewellers-final.pdf`. They are extracted into `public/collection-products/` as WebP files, preserving the original photographic settings and complete coordinated groups. No brochure typography or page borders are carried into the product images. Native dimensions are retained without upscaling; two background-only trims bring the bangle compositions closer. The source objects and crop decisions are recorded in `docs/brochure-products.md`, and `scripts/extract-brochure-products.py` reproduces the extraction from a supplied PDF path.

`brochure-products.json` is the single product inventory. `product-catalog.js` supplies category names and the six-piece home selection; `collections.js` derives each category's complete set from that inventory. `ProductGallery.jsx` supplies responsive product framing, filters and a native enlarged-image dialog with arrow navigation, Escape dismissal, focus return and coordinated scroll locking. Without JavaScript the collection links open category pages and each photograph links directly to its full image. The welcome page features the selection immediately after the opening; `/home` pairs bridal campaign photography with two original product images in a full editorial spread, followed by the selection. The original landing logo, wine and photograph sequence is retained.

The opening stays within one viewport: the original logo trace and lettering animation, the wine-coloured hero, then a full-screen photograph. Once that opening settles, four actual campaign images crossfade every two seconds with restrained zoom. The hero has no visible playback buttons: swipe or left/right arrow keys browse manually, and Space pauses or resumes. Focusing the photographs pauses automatic changes. Autoplay stops outside the hero, in a hidden tab or with reduced motion. The central logo and copy fade away as the photograph appears. A screen-reader heading remains available without adding a visible overlay. Image selection and timing live in `src/data/hero-slides.js`. The collection dropdown remains keyboard accessible with a bare chevron instead of a glass capsule.

The website links to showroom directions. It does not claim to submit bookings or newsletter subscriptions. Placeholder phone/social destinations and unverified product prices are not exposed on the canonical page. Add verified contact details and a real service before introducing those actions.

## Checks

```bash
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e -- --workers=2
```

The browser suite covers the original logo opening, forward/reverse heritage scrolling, chapter navigation, mobile/short-screen layouts, motion preference changes, keyboard/menu focus, carousel controls, cross-route anchors, image loading, JavaScript-disabled access and in-page tools. Stage screenshots are saved in `docs/screenshots/`. Run against a production server for reliable results; the Playwright config starts one if port 3000 is free.
