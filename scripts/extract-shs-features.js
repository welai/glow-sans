// Extract glyphs in various categories
const fs = require('fs');

[ 'J', 'K', 'SC', 'TC' ].forEach(lang => {
  const fontName = `SourceHanSans${lang === 'J' ? '' : lang}`;
  [ 'ExtraLight', 'Light', 'Normal', 'Regular', 'Medium', 'Bold', 'Heavy' ]
  .forEach(weight => {
    const font =
      JSON.parse(fs.readFileSync(
        `fonts/SourceHanSans${lang}/${fontName}-${weight}.json`).toString());
      [ 'GSUB', 'GPOS' ].forEach(tableName => {
        const extractDir =
          `build-files/features/${tableName.toLowerCase()}-${lang.toLowerCase()}`;
        if (!fs.existsSync(extractDir)) fs.mkdirSync(extractDir);
        fs.writeFileSync(`${extractDir}/${weight}.json`, 
          JSON.stringify(font[tableName]));
      });
  });
});