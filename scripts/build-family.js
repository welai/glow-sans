const fs = require('fs');
const cp = require('child_process');
const buildFont = require('../src/font-build/build-font');
const { getParam } = require('../src/font-build/res/params');

const version = '0.92';

[
  'SC', 
  'TC', 
  'J' 
].forEach(lang => {
  const outdir = `build-files/otfcc/GlowSans${lang}-v${version}`;
  if (!fs.existsSync(outdir)) fs.mkdirSync(outdir);
  const fontdir = `build-files/fonts/GlowSans${lang}-v${version}`
  if (!fs.existsSync(fontdir)) fs.mkdirSync(fontdir);

  function saveOtfcc(paramName, width, widthClass, weight, weightClass) {
    const outname = `${outdir}/GlowSans${lang}-${width}-${weight}.json`
    const fontname = `${fontdir}/GlowSans${lang}-${width}-${weight}.otf`
    const param = getParam(paramName);
    console.log(`Building "${outname}"`);
    const font = buildFont(param, lang, width, widthClass, 
      weight, weightClass, version, true);
    fs.writeFileSync(outname, JSON.stringify(font));
    console.log(`Building otf...`);
    cp.execSync(`otfccbuild -q --merge-features --merge-lookups --subroutinize ${outname} -o ${fontname}`);
  }

  saveOtfcc('glow/180', 'Compressed', 2, 'Thin', 100);
  saveOtfcc('glow/280', 'Compressed', 2, 'ExtraLight', 200);
  saveOtfcc('glow/380', 'Compressed', 2, 'Light', 300);
  saveOtfcc('glow/480', 'Compressed', 2, 'Regular', 400);
  saveOtfcc('glow/580', 'Compressed', 2, 'Book', 500);
  saveOtfcc('glow/680', 'Compressed', 2, 'Medium', 600);
  saveOtfcc('glow/780', 'Compressed', 2, 'Bold', 700);
  saveOtfcc('glow/880', 'Compressed', 2, 'ExtraBold', 800);

  saveOtfcc('glow/190', 'Condensed', 3, 'Thin', 100);
  saveOtfcc('glow/290', 'Condensed', 3, 'ExtraLight', 200);
  saveOtfcc('glow/390', 'Condensed', 3, 'Light', 300);
  saveOtfcc('glow/490', 'Condensed', 3, 'Regular', 400);
  saveOtfcc('glow/590', 'Condensed', 3, 'Book', 500);
  saveOtfcc('glow/690', 'Condensed', 3, 'Medium', 600);
  saveOtfcc('glow/790', 'Condensed', 3, 'Bold', 700);
  saveOtfcc('glow/890', 'Condensed', 3, 'ExtraBold', 800);
  saveOtfcc('glow/990', 'Condensed', 3, 'Heavy', 900);

  saveOtfcc('glow/100', 'Normal', 5, 'Thin', 100);
  saveOtfcc('glow/200', 'Normal', 5, 'ExtraLight', 200);
  saveOtfcc('glow/300', 'Normal', 5, 'Light', 300);
  saveOtfcc('glow/400', 'Normal', 5, 'Regular', 400);
  saveOtfcc('glow/500', 'Normal', 5, 'Book', 500);
  saveOtfcc('glow/600', 'Normal', 5, 'Medium', 600);
  saveOtfcc('glow/700', 'Normal', 5, 'Bold', 700);
  saveOtfcc('glow/800', 'Normal', 5, 'ExtraBold', 800);
  saveOtfcc('glow/900', 'Normal', 5, 'Heavy', 900);

  saveOtfcc('glow/110', 'Extended', 7, 'Thin', 100);
  saveOtfcc('glow/210', 'Extended', 7, 'ExtraLight', 200);
  saveOtfcc('glow/310', 'Extended', 7, 'Light', 300);
  saveOtfcc('glow/410', 'Extended', 7, 'Regular', 400);
  saveOtfcc('glow/510', 'Extended', 7, 'Book', 500);
  saveOtfcc('glow/610', 'Extended', 7, 'Medium', 600);
  saveOtfcc('glow/710', 'Extended', 7, 'Bold', 700);
  saveOtfcc('glow/810', 'Extended', 7, 'ExtraBold', 800);
  saveOtfcc('glow/910', 'Extended', 7, 'Heavy', 900);

  saveOtfcc('glow/120', 'Wide', 8, 'Thin', 100);
  saveOtfcc('glow/220', 'Wide', 8, 'ExtraLight', 200);
  saveOtfcc('glow/320', 'Wide', 8, 'Light', 300);
  saveOtfcc('glow/420', 'Wide', 8, 'Regular', 400);
  saveOtfcc('glow/520', 'Wide', 8, 'Book', 500);
  saveOtfcc('glow/620', 'Wide', 8, 'Medium', 600);
  saveOtfcc('glow/720', 'Wide', 8, 'Bold', 700);
  saveOtfcc('glow/820', 'Wide', 8, 'ExtraBold', 800);
  saveOtfcc('glow/920', 'Wide', 8, 'Heavy', 900);
});
