#!/usr/bin/env python3
"""Extract the circuit-chip icon (no wordmark/tagline glyphs) from the full
brand lockup SVG, tightly crop it, and emit blue + white icon-only variants."""
import re, math

SRC = "public/brand/smart-icon.svg"
with open(SRC) as f:
    svg = f.read()

# Grab every <path ... /> element
paths = re.findall(r'<path[^>]*?/>', svg)

def translate_y(p):
    m = re.search(r'matrix\(1,0,0,-1,([^,]+),([^)]+)\)', p)
    if not m:
        return None
    return float(m.group(1)), float(m.group(2))

# Icon paths: the circuit mark sits at translate-y between 1100 and 1560.
# Text glyphs (SMART + tagline) sit at y>=1600, and the "I"/dot bars use
# matrix(1,0,0,-1,0,3000). Keep only true icon paths.
icon_paths = []
for p in paths:
    ty = translate_y(p)
    if ty is None:
        continue
    x, y = ty
    if x == 0 and y == 3000:
        continue  # tagline dot/bar glyph
    if 1080 <= y <= 1580:
        icon_paths.append(p)

print(f"total paths: {len(paths)}, icon paths kept: {len(icon_paths)}")

def build(fill):
    body = "\n".join(re.sub(r'fill="#042ccc"', f'fill="{fill}"', p) for p in icon_paths)
    # viewBox covers the icon emblem region (measured from source geometry).
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" '
        'width="1240" height="560" viewBox="880 1030 1240 560">\n'
        f'{body}\n</svg>\n'
    )

with open("public/brand/smart-icon-only.svg", "w") as f:
    f.write(build("#042ccc"))
with open("public/brand/smart-icon-white.svg", "w") as f:
    f.write(build("#ffffff"))
print("wrote smart-icon-only.svg + smart-icon-white.svg")
