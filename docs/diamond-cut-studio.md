# The interactive cutting table

The `/diamond-guide` opening shows five illustrative cut geometries above procedural black sand. Shape selection sends the current shards down to the sand, changes the geometry there, then gathers them into the new stone. It is an explanation of shape and light, not a literal process for cutting or joining diamonds.

## Files

- `src/components/sections/diamonds/DiamondCutStudio.jsx`: semantic controls, touch and keyboard gestures, GSAP lifecycle and state ownership.
- `src/lib/diamond-guide/cut-geometry.js`: closed faceted volumes, tetrahedral shards, deterministic resting positions, and the Emerald pavilion's elongated keel.
- `src/lib/diamond-guide/cut-material.js`: custom crystal, shard and sand GLSL; matching shadow depth deformation.
- `src/lib/diamond-guide/sand-surface.js`: shared sand height and deterministic grain placement.
- `src/lib/diamond-guide/create-black-sand.js`: displaced surface, instanced grains and resource disposal.
- `src/lib/diamond-guide/create-cut-scene.js`: Three.js renderer, camera, lighting, shadows, facet overlay, progressive light-path diagram and resource disposal.
- `src/styles/diamond-cut-studio.css`: desktop and phone composition, glass selection controls and static fallback.

## Motion and controls

A scoped `useGSAP` hook owns a `gsap.matchMedia` context. A `ScrollTrigger` tween drives a progress object using `scrub: 0.65` and `ease: "none"`. CSS sticky keeps the composition visible through its 195svh range. The first half gathers the shards, the middle reveals edges, and the last portion traces a light path. Reverse scrolling reverses the same state.

Clicking a shape takes ownership from scroll so a later scroll cannot unexpectedly replace that choice. Its interruptible timeline scatters in 0.65 seconds, changes the cut on the sand, gathers in 1.7 seconds and holds its orientation until explicitly rotated. Rapid selections kill the previous timeline and continue from the current state. Shards follow staggered arcs, and their final rotated vertices meet the shared rippled sand surface with a small contact clearance. This is deterministic choreography, not a collision solver.

Horizontal touch swipes change shapes. `touch-action: pan-y pinch-zoom` preserves vertical scrolling and pinch zoom. Holding the primary mouse button and dragging inspects the formed stone; hover and ordinary movement have no effect. Releasing or losing pointer capture stops rotation immediately. Reduced-motion mode follows the drag directly without easing. The explicit Turn control is available for keyboard and touch users. Left/right keys change shapes. Fragments / The cut / Light path controls give direct access to the three visual lessons; the facet control exposes surface edges.

## Crystal rendering

Each whole stone supplies its own outward facet planes to the shader. GLSL refracts the view ray into the stone at an illustrative diamond IOR of 2.42, intersects its planes, and allows up to three internal reflection bounces before sampling analytic studio lighting. A Fresnel blend mixes transmission and surface reflection; small separated colour samples add restrained dispersion. This is a real-time approximation, not spectral path tracing or a grading tool.

Fragment deformation runs on the GPU in one mesh draw. Matching depth deformation keeps their shadows attached to the fragments. Black sand combines a sculpted, wind-rippled height field, a dense cellular grain shader with view-space bump relief, and 18,000 irregular physical basalt grains in one instanced mesh. Low side lighting reveals the relief without washing the black surface out. Sand and shards share the same height function; each shard rests against its highest supporting corner. It needs no remote textures. The drawn light path is a simplified teaching overlay rather than a measurement of any particular diamond.

## Performance and fallback

Three.js is loaded asynchronously. The canvas renders on demand during GSAP or pointer updates, pauses offscreen or in background tabs, and limits DPR to 1.5 on phones / 1.75 on desktop. Geometries, materials, renderers, listeners and observers are disposed on navigation. GSAP cleans up its scoped context.

Reduced motion removes the long scroll journey and changes states immediately. When WebGL is unavailable or loses context, the SVG view remains usable. Without JavaScript the illustrated shape glossary and anatomy diagrams remain available; inactive interactive controls are hidden.

Verification covers all five cuts, interruption, reversible scroll, manual ownership, touch scrolling/swipes, mouse/keyboard control, narrow screens, reduced motion, WebGL fallback/recovery, and no JavaScript. Geometry checks verified closed surfaces, positive volume, shader plane limits, and consistent shard contact height for all five cuts.

The same studio is embedded as the final section of `/` and `/home`, immediately before the diamond burst. Embedded mode uses an h2/h3 heading hierarchy, links onward to the burst and to the full guide, and defers WebGL initialization until it is within 900px of the viewport. The standalone guide retains its h1 and anatomy link.
