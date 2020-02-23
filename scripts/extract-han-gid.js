// Extract glyphs in a dumped font by given gids 
// Usage example:
//  node  scripts/extract-han-gid.js\
//        fonts/SourceHanSansSC/SourceHanSansSC-Regular.json\
//        encoding/gid/shs-sc/gid-1.tsv\
//        build-files/extracted/gid-1.json
const fs = require('fs');

const fontFilename = process.argv[2];
if (!fontFilename) throw Error(`The 2nd argument is required.`);
const charsetFilename = process.argv[3];
if (!charsetFilename) throw Error(`The 3rd argument is required.`);
const outputFilename = process.argv[4];
if (!outputFilename) throw Error(`The 4th argument is required.`);

const font = JSON.parse(fs.readFileSync(fontFilename).toString());
const gids = fs.readFileSync(charsetFilename).toString()
  .split('\n').map(line => line.split('\t')[0]);

const result = {};

gids.forEach(gid => {
  const glyphData = font.glyf[gid];
  if (glyphData === undefined) return;
  const verticalOrigin = glyphData.verticalOrigin;
  const contours = glyphData.contours.map(contour =>
    contour.map(pt => 
      ({ x: pt.x, y: pt.y + 1000 - verticalOrigin, on: pt.on })
    ));
  result[gid] = contours;
});

fs.writeFileSync(outputFilename, JSON.stringify(result));