// Sample a few glyphs from the font, and translate each glyph to center it in 
// the em box.

const fs = require('fs');
const process = require('process')

const font = JSON.parse(fs.readFileSync(process.argv[2]).toString());
const sampleText = '一三五水永过東南明湖区匪国國酬爱愛袋鸢鳶鬱靈鷹曌龘';
const sampleEntries = sampleText.split('')
  .map(char => {
    const uni = 'U+' + char.charCodeAt(0).toString(16).toUpperCase();
    const gid = font.cmap[uni];
    const glyphData = font.glyf[gid];
    const verticalOrigin = glyphData.verticalOrigin;
    const contours = glyphData.contours.map(contour =>
      contour.map(pt => 
        ({ x: pt.x, y: pt.y + 1000 - verticalOrigin, on: pt.on })
      )
    );
    return { [gid]: contours };
  });

const sample = Object.assign({}, ...sampleEntries);

// fs.writeFileSync(process.argv[3], JSON.stringify(sample));