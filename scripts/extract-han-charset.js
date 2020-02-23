// Extract glyphs in a font given by a charset file
// Usage example:
//  node  scripts/extract-han-set.js\
//        fonts/SourceHanSansSC/SourceHanSansSC-Regular.json\
//        encoding/charsets/gb-han/tongyong-1.tsv\
//        build-files/extracted/shs-sc-regular_tongyong-1.json
const fs = require('fs');

const fontFilename = process.argv[2];
if (!fontFilename) throw Error(`The 2nd argument is required.`);
const charsetFilename = process.argv[3];
if (!charsetFilename) throw Error(`The 3rd argument is required.`);
const outputFilename = process.argv[4];
if (!outputFilename) throw Error(`The 4th argument is required.`);

const font = JSON.parse(fs.readFileSync(fontFilename).toString());
const charcodes = fs.readFileSync(charsetFilename).toString()
  .split('\n').map(line => line.split('\t')[0]);

const result = {};

charcodes.forEach(uni => {
  const cmap = font.cmap;
  const gid = cmap[uni];
  if (gid === undefined) throw Error(`Incompatible cmap for characer ${uni}.`);
  const glyphData = font.glyf[gid];
  const verticalOrigin = glyphData.verticalOrigin;
  const contours = glyphData.contours.map(contour =>
    contour.map(pt => 
      ({ x: pt.x, y: pt.y + 1000 - verticalOrigin, on: pt.on })
    ));
  result[uni] = contours;
});

fs.writeFileSync(outputFilename, JSON.stringify(result));