# Brochure product photography

The collection photographs are extracted directly from the native embedded RGB
image objects in `manish-jewellers-final.pdf`, supplied in the project parent
folder. All 13 brochure pages were rendered and reviewed, and every native
photograph on the eight jewellery spreads was inspected.

There are **16 unique jewellery photographs**, on PDF pages 5–12. The catalogue
uses the complete photographs, including the original satin, stone plinths and
reflective surfaces. Coordinated sets stay together; they are not cut apart into
invented individual product listings. Brochure typography, gold gradients, outer
page borders and decorative masked artwork are absent from the extracted images.

## Inventory

| PDF page | Source object | Website ID | Primary category |
| --- | --- | --- | --- |
| 5 | Im44 / 44 0 R | sculpted-loop-earrings | earrings |
| 5 | Im48 / 48 0 R | blush-floral-hand-ornament | ornaments |
| 6 | Im58 / 58 0 R | peacock-kada | bangles |
| 6 | Im59 / 59 0 R | medallion-bangle-pair | bangles |
| 7 | Im69 / 69 0 R | sunburst-cocktail-ring | rings |
| 7 | Im70 / 70 0 R | vine-cuff | bangles |
| 8 | Im79 / 79 0 R | floral-bangle-trio | bangles |
| 8 | Im80 / 80 0 R | long-medallion-necklace | necklaces |
| 9 | Im90 / 90 0 R | coin-choker | necklaces |
| 9 | Im91 / 91 0 R | rosette-cocktail-ring | rings |
| 10 | Im100 / 100 0 R | green-medallion-ensemble | bangles |
| 10 | Im101 / 101 0 R | heritage-necklace-ensemble | necklaces |
| 11 | Im110 / 110 0 R | green-oval-necklace | necklaces |
| 11 | Im111 / 111 0 R | crimson-oval-ring | rings |
| 12 | Im115 / 115 0 R | floral-cuff-duo | bangles |
| 12 | Im116 / 116 0 R | blush-petal-necklace-set | necklaces |

Primary categories contain 5 necklace photographs, 6 bangle/cuff photographs,
3 ring photographs, 1 earring photograph and 1 hand-ornament photograph. Group
photographs also show their coordinating pieces. These descriptive categories
and editorial names are not stock or availability claims.

## Cropping and image quality

Native photograph extraction is the main crop: it removes the surrounding
brochure page completely without rasterizing text over the jewellery.

Two photographs have additional background-only trims:

- `medallion-bangle-pair`: remove 140 pixels from the empty upper background;
  crop `(0, 140, 852, 836)` yields `852 × 696` pixels.
- `green-medallion-ensemble`: remove 110 pixels from the empty upper background;
  crop `(0, 110, 983, 701)` yields `983 × 591` pixels.

All remaining 14 images retain their full native bounds. Every piece visible in
the source remains visible in its output. Original framing limits are retained;
no missing chain, stone, texture or jewellery detail has been synthesized.

The outputs use WebP quality 90, method 6, with no resizing, upscaling, artificial
sharpening or recolouring. Their combined file size is approximately 2.05 MB.
The manifest records the actual output dimensions and PDF image-object number.

Names, alt text and descriptions describe visible form and colour without
claiming gold purity, gemstone species, diamond certification, prices or current
stock. The hand ornament is classified separately from necklaces, and the
peacock piece is classified as a bangle rather than inheriting the older asset
filename's ring label.

## Exclusions

- Pages 1–2: cover and blank layout artwork; no product photography.
- Page 3: decorative gold foil and brand messaging.
- Page 4: the craftsperson/bench photograph, already suitable for the atelier
  story but not an individual product image.
- Page 13: team and family photographs, suitable for heritage storytelling but
  not product listings.
- Soft masks, gradients and other decorative page assets on pages 5–12.

## Reproduction and verification

`scripts/extract-brochure-products.py` reads the original PDF and writes only
`public/collection-products/`, `src/data/brochure-products.json` and a temporary
contact sheet. It requires `pypdf` and Pillow.

```sh
python3 scripts/extract-brochure-products.py
```

The source PDF can be passed as the first argument. `--contact-sheet` changes the
temporary review-sheet destination, which defaults to
`/private/tmp/mj-product-extraction/products-contact-sheet.jpg`.

Verification checks all 16 files decode as RGB WebP, their dimensions match the
manifest, each ID is unique, and the original photograph pixel hashes contain no
duplicates. The final product contact sheet was visually reviewed to confirm
clean framing, intact subjects and no brochure text or border remnants.
