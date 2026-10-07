#!/usr/bin/env python3
"""Extract the 16 native jewellery photographs from the supplied house brochure.

Requires pypdf and Pillow. The source PDF is read only; no artwork is flattened
into a product image and no jewellery pixels are synthesized or upscaled.
"""

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps
from pypdf import PdfReader


# Page and image-object names are intentionally explicit: decorative masked
# images, brochure pages, craft photographs and family portraits are excluded.
PRODUCTS = [
    {
        "page": 5,
        "object": "Im44.png",
        "id": "sculpted-loop-earrings",
        "name": "Sculpted loop earrings",
        "category": "earrings",
        "alt": "A pair of elongated, intertwined loop earrings on softly folded pale fabric.",
        "detail": "Open loops and a slender silhouette, photographed as a complete pair.",
    },
    {
        "page": 5,
        "object": "Im48.png",
        "id": "blush-floral-hand-ornament",
        "name": "Blush floral hand ornament",
        "category": "ornaments",
        "alt": "A hand ornament with pink floral motifs, fine connecting chains and pale bead details on ivory fabric.",
        "detail": "A floral hand ornament with flowing chains and a soft blush palette.",
    },
    {
        "page": 6,
        "object": "Im58.png",
        "id": "peacock-kada",
        "name": "The peacock kada",
        "category": "bangles",
        "alt": "A sculptural peacock bangle with a sweeping fan motif, photographed on a pink reflective surface.",
        "detail": "A sculptural peacock motif with scrolling detail and a bold curved profile.",
    },
    {
        "page": 6,
        "object": "Im59.png",
        "id": "medallion-bangle-pair",
        "name": "Medallion bangle pair",
        "category": "bangles",
        "alt": "Two ornate gold-toned bangles with circular and oval motifs resting on concentric sand-coloured ripples.",
        "detail": "A complete bangle pair, with oval medallions and a finely patterned edge.",
        "crop": [0, 140, 852, 836],
    },
    {
        "page": 7,
        "object": "Im69.png",
        "id": "sunburst-cocktail-ring",
        "name": "Sunburst cocktail ring",
        "category": "rings",
        "alt": "A statement ring with a pink centre and radiating gold-toned spokes on softly rippled ivory fabric.",
        "detail": "A radiating sculptural ring, framed by a warm, softly textured setting.",
    },
    {
        "page": 7,
        "object": "Im70.png",
        "id": "vine-cuff",
        "name": "The vine cuff",
        "category": "bangles",
        "alt": "An open gold-toned cuff with pink floral branches rising from each end, on pale rippled fabric.",
        "detail": "An open cuff with branching floral details and an airy, asymmetric silhouette.",
    },
    {
        "page": 8,
        "object": "Im79.png",
        "id": "floral-bangle-trio",
        "name": "Floral bangle trio",
        "category": "bangles",
        "alt": "Three slender floral bangles with pink and green details arranged on a circular stone plinth.",
        "detail": "A slender bangle trio, photographed together to show its repeating floral rhythm.",
    },
    {
        "page": 8,
        "object": "Im80.png",
        "id": "long-medallion-necklace",
        "name": "Long medallion necklace",
        "category": "necklaces",
        "alt": "A long gold-toned necklace with pale bead clusters and a circular medallion pendant on ivory satin.",
        "detail": "A long necklace with a circular centrepiece and softly clustered bead details.",
    },
    {
        "page": 9,
        "object": "Im90.png",
        "id": "coin-choker",
        "name": "The coin choker",
        "category": "necklaces",
        "alt": "A gold-toned choker with a row of suspended coin motifs and pale bead accents on ivory stone and fabric.",
        "detail": "Suspended coin motifs bring movement to a closely framed choker silhouette.",
    },
    {
        "page": 9,
        "object": "Im91.png",
        "id": "rosette-cocktail-ring",
        "name": "Rosette cocktail ring",
        "category": "rings",
        "alt": "A round rosette ring with green and pink centre details and a scalloped gold-toned border on a pale oval plinth.",
        "detail": "A circular rosette ring with a scalloped outline and a colourful central pattern.",
    },
    {
        "page": 10,
        "object": "Im100.png",
        "id": "green-medallion-ensemble",
        "name": "Green medallion ensemble",
        "category": "bangles",
        "alt": "A broad bangle with green medallion details beside coordinating statement rings, on a pale stone ledge.",
        "detail": "A broad bangle and coordinating rings, kept together in the original house composition.",
        "crop": [0, 110, 983, 701],
    },
    {
        "page": 10,
        "object": "Im101.png",
        "id": "heritage-necklace-ensemble",
        "name": "Heritage necklace ensemble",
        "category": "necklaces",
        "alt": "An ornate necklace with alternating green and red oval motifs, paired with coordinating earrings and bangles on ivory satin.",
        "detail": "A coordinated necklace, earring and bangle composition with richly patterned oval motifs.",
    },
    {
        "page": 11,
        "object": "Im110.png",
        "id": "green-oval-necklace",
        "name": "Green oval necklace",
        "category": "necklaces",
        "alt": "A gold-toned necklace with repeated green oval details and a beaded lower edge, arranged on folded ivory fabric.",
        "detail": "Repeated oval details and a softly beaded edge form a richly layered necklace.",
    },
    {
        "page": 11,
        "object": "Im111.png",
        "id": "crimson-oval-ring",
        "name": "Crimson oval ring",
        "category": "rings",
        "alt": "A statement ring with a large crimson oval centre and smaller pink details, standing on pale stone beside ivory satin.",
        "detail": "A bold oval ring, framed by a patterned border and smaller blush details.",
    },
    {
        "page": 12,
        "object": "Im115.png",
        "id": "floral-cuff-duo",
        "name": "Floral cuff duo",
        "category": "bangles",
        "alt": "Two open floral cuffs with green and blue fan-shaped centres and bright silver-toned bands on ivory stone.",
        "detail": "Two floral cuffs with fan-shaped centres, photographed together in their original setting.",
    },
    {
        "page": 12,
        "object": "Im116.png",
        "id": "blush-petal-necklace-set",
        "name": "Blush petal necklace set",
        "category": "necklaces",
        "alt": "A curved gold-toned necklace and matching earrings with pink floral centres, arranged on pale marble and satin.",
        "detail": "A necklace and matching earrings connected by a softly sculpted floral motif.",
    },
]


def main():
    project = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "source", type=Path, nargs="?",
        default=project.parent / "manish-jewellers-final.pdf",
    )
    parser.add_argument(
        "--contact-sheet", type=Path,
        default=Path("/private/tmp/mj-product-extraction/products-contact-sheet.jpg"),
    )
    args = parser.parse_args()
    reader = PdfReader(args.source)
    output = project / "public" / "collection-products"
    output.mkdir(parents=True, exist_ok=True)
    manifest, thumbnails, seen = [], [], set()

    for product in PRODUCTS:
        source = next(
            img for img in reader.pages[product["page"] - 1].images
            if img.name == product["object"]
        )
        original = source.image
        if original.mode != "RGB":
            raise ValueError(f"Expected a native unmasked RGB photograph: {source.name}")
        digest = hashlib.sha256(original.tobytes()).hexdigest()
        if digest in seen:
            raise ValueError(f"Duplicate photograph: {source.name}")
        seen.add(digest)
        photo = original.crop(product["crop"]) if "crop" in product else original.copy()
        photo.save(output / f'{product["id"]}.webp', "WEBP", quality=90, method=6)
        manifest.append({
            key: value for key, value in product.items()
            if key not in {"object", "crop"}
        } | {
            "image": f'/collection-products/{product["id"]}.webp',
            "width": photo.width,
            "height": photo.height,
            "sourceObject": f"{source.indirect_reference.idnum} 0 R",
        })
        thumbnails.append((product, photo))

    manifest_path = project / "src" / "data" / "brochure-products.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")

    tile_w, tile_h, columns = 500, 470, 4
    sheet = Image.new("RGB", (tile_w * columns, tile_h * 4), "#eee4dc")
    draw = ImageDraw.Draw(sheet)
    for index, (product, photo) in enumerate(thumbnails):
        x, y = index % columns * tile_w, index // columns * tile_h
        thumb = ImageOps.contain(photo, (tile_w - 24, tile_h - 68))
        sheet.paste(thumb, (x + (tile_w - thumb.width) // 2, y + 8 + (tile_h - 68 - thumb.height) // 2))
        draw.text((x + 12, y + tile_h - 50), product["name"], fill="#25171a")
        draw.text((x + 12, y + tile_h - 30), f'Page {product["page"]} / {product["object"]} / {product["category"]}', fill="#793f48")
    args.contact_sheet.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(args.contact_sheet, quality=95)
    total_bytes = sum(path.stat().st_size for path in output.glob("*.webp"))
    print(f"Extracted {len(manifest)} unique photos ({total_bytes:,} bytes total).")
    print(f"Manifest: {manifest_path}")
    print(f"Contact sheet: {args.contact_sheet}")


if __name__ == "__main__":
    main()
