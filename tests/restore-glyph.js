// Glyph restoration test case
const fs = require('fs');
const GlyphModel = require('../src/glyph-manipulate/GlyphModel');

const glyphData = JSON.parse(fs.readFileSync('samples/SourceHanSansSC-Regular.json').toString());
const glyphModelData = JSON.parse(fs.readFileSync('samples/SourceHanSansSC-Regular.model.json').toString());

for (const char in glyphData) {
  const glyphModel = new GlyphModel(glyphModelData[char]);
  console.log(JSON.stringify(glyphModel.restore()) === JSON.stringify(glyphData[char]));
}
