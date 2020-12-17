// Extract glyphs in a dumped font by given gids 
// Usage example:
//  node  scripts/extract-han-gid.js\
//        encoding/gid/shs-sc/gid-1.tsv\
//        build-files/extracted/gid-1.json\
//        fonts/SourceHanSansSC/SourceHanSansSC-Regular.json
const fs = require('fs');

const charsetFilename = process.argv[2];
if (!charsetFilename) throw Error(`The 2nd argument is required.`);
const outputFilename = process.argv[3];
if (!outputFilename) throw Error(`The 3rd argument is required.`);
const fontFilename = process.argv[4];
if (!fontFilename) throw Error(`The 4th argument is required.`);
const fallbackFontFilename = process.argv[5];

const font = JSON.parse(fs.readFileSync(fontFilename).toString());
const fallbackFont = fallbackFontFilename !== undefined ? 
  JSON.parse(fs.readFileSync(fallbackFontFilename).toString()) : undefined;
const gids = fs.readFileSync(charsetFilename).toString()
  .split('\n').map(line => line.split('\t')[0]);

const result = {};

gids.forEach(gid => {
  let glyphData = font.glyf[gid];
  if (glyphData === undefined) {
    if (fallbackFont === undefined) return;
    glyphData = fallbackFont.glyf[gid];
    if (glyphData === undefined) return;
  }
  const verticalOrigin = glyphData.verticalOrigin;
  const contours = glyphData.contours.map(contour =>
    contour.map(pt => 
      ({ x: pt.x, y: pt.y + 1000 - verticalOrigin, on: pt.on })
    ));
  result[gid] = contours;
});

fs.writeFileSync(outputFilename, JSON.stringify(result));