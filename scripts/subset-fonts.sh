#!/usr/bin/env bash
# Rebuild src/app/fonts/*.subset.woff2 from full Montserrat faces.
#
# The resume is a fixed document, so the faces only carry the characters listed
# in src/app/font-subset.ts (see the note there). Point SOURCE_DIR at a directory
# holding Montserrat-ExtraLight/Light/Regular in ttf, otf or woff2 — the faces
# themselves are not in the repo; they are Google Fonts Montserrat.
#
#   SOURCE_DIR=~/Downloads/Montserrat ./scripts/subset-fonts.sh
set -euo pipefail

SOURCE_DIR="${SOURCE_DIR:?set SOURCE_DIR to a directory of full Montserrat faces}"
OUT_DIR="$(dirname "$0")/../src/app/fonts"
# The one source of truth for the range is src/app/font-subset.ts.
UNICODES="$(grep -o "U+[0-9A-F-]*" "$(dirname "$0")/../src/app/font-subset.ts" | paste -sd, -)"
echo "subsetting to $UNICODES"

for weight in ExtraLight Light Regular; do
  source_file=""
  for extension in ttf otf woff2; do
    candidate="$SOURCE_DIR/Montserrat-$weight.$extension"
    [ -f "$candidate" ] && source_file="$candidate" && break
  done
  [ -n "$source_file" ] || { echo "no source face for $weight in $SOURCE_DIR" >&2; exit 1; }
  uvx --with brotli --from fonttools pyftsubset "$source_file" \
    --unicodes="$UNICODES" \
    --layout-features="kern,liga,calt" \
    --flavor=woff2 \
    --output-file="$OUT_DIR/Montserrat-$weight.subset.woff2"
  echo "$weight -> $(du -h "$OUT_DIR/Montserrat-$weight.subset.woff2" | cut -f1)"
done
