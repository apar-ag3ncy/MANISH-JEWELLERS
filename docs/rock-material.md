# Anthracite finishing reference

The client supplied a screenshot of dark, broad fractured rocks with satin grey highlights, deep black undersides and sparse bronze veins. The stone material is a visual recreation of that finish. The reference's gold bars, text and background are not incorporated into the website.

The built-in image generation tool generated the surface. The final project assets are:

| Asset in `public/house/stone/` | Resolution | Use |
| --- | --- | --- |
| `anthracite-color.webp` | 1024 × 1024 | Desktop sRGB base color |
| `anthracite-surface.webp` | 1024 × 1024 | Desktop linear height / roughness / crevice data |
| `anthracite-color-mobile.webp` | 768 × 768 | Mobile base color |
| `anthracite-surface-mobile.webp` | 768 × 768 | Mobile surface data |
| `anthracite-preview.webp` | 256 × 256 | Lightweight SVG preview and fallback |

`scripts/build-rock-maps.mjs` prepares these assets from the generated source. The surface maps approximate relief and roughness from local luminance and grain; they are not a measured geological scan. Their alpha stays opaque to preserve packed channel data through browser decoding. The shader identifies bronze mineral seams from the color channels and gives them slightly more reflectivity. Textures remain fixed to the moving geometry through triplanar projection. Normals, lighting and shadows change with the 3D view. Two analytic studio reflections give the broader platelets a restrained satin sheen, while the broken sides stay darker and rougher.

## Final generation prompt

```text
Use case: photorealistic-natural. Asset type: a square 2048 x 2048 seamless PBR base-color texture to be mapped onto real-time 3D rock meshes. Input image 1 is a material/style reference ONLY: reproduce the dark fractured stone finish on the rocks, not the scene, gold bars, typography or background. Primary request: an edge-to-edge flat orthographic macro photograph of a continuous BLACK ANTHRACITE / DARK SLATE rock surface, like the heavy black broken rocks in the reference. Fine branching hairline fissures, irregular flaky fracture platelets, sparse subtle muted bronze / ochre mineral veins caught in some fissures and edges; mostly black, deep charcoal with tiny smoky grey shifts. Broad uneven natural mineral platelets and smoother satin patches interrupted by chipped rough fracture ridges. Organic geological detail at several scales, crisp tactile and convincing, not plastic. The bronze veins occupy less than 3 percent of the image, muted brown gold and thin rather than shiny gold foil. Lighting: perfectly uniform diffuse neutral illumination, no directional light or highlights, no shadows, no vignette, suitable as unlit albedo; roughness and highlights will be supplied by the 3D renderer. Composition: square, continuous repeating surface, seamless tileable all four edges, filled entirely with the stone texture; no individual isolated stones or perspective, no 3D scene. Avoid: round pebble pattern, polygon mosaic cells, regular checker pattern, concrete, granite speckles, white veins, silver metal, large bright grey patches, dust, fire, text, logo, border.
```

The tool returned a 1254 × 1254 source. The project uses the optimized resolutions listed above rather than upscaling it.
