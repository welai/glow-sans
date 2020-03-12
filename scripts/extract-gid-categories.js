// Extract glyphs in various categories
const fs = require('fs');
const path = require('path');

[ 'J', 'K', 'SC' ].forEach(lang => {
  const fontName = `SourceHanSans${lang === 'J' ? '' : lang}`;
  [ 'ExtraLight', 'Light', 'Normal', 'Regular', 'Medium', 'Bold', 'Heavy' ]
  .forEach(weight => {
    const font =
      JSON.parse(fs.readFileSync(
        `fonts/SourceHanSans${lang}/${fontName}-${weight}.json`).toString());
    // Gid categories
    [ 'base-scale', 'center-scale', 'lengthen', 'punc-like' ]
    .forEach(gidName => {
      const extractDir = `build-files/extracted/${gidName}-${lang.toLowerCase()}`;
      if (!fs.existsSync(extractDir)) fs.mkdirSync(extractDir);
      const gids = fs.readFileSync(`encoding/gid/${gidName}.tsv`).toString()
        .split('\n').map(l => l.split('\t')[0]);
      const result = {};
      for (const gid of gids) result[gid] = font.glyf[gid];
      fs.writeFileSync(`${extractDir}/${weight}.json`,
        JSON.stringify(result));
    });
  });
});
