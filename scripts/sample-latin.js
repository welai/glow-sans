// Sample a few latin glyphs from the font

const fs = require('fs');
const process = require('process')

const font = JSON.parse(fs.readFileSync(process.argv[2]).toString());
const sampleText = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const sampleEntries = sampleText.split('')
  .map(char => {
    const uni = 'U+' + char.charCodeAt(0).toString(16).padStart(4, '0').toUpperCase();
    const gid = font.cmap[uni];
    const glyphData = font.glyf[gid];
    return { [char]: glyphData };
  });

const sample = Object.assign({}, ...sampleEntries);

fs.writeFileSync(process.argv[3], JSON.stringify(sample));