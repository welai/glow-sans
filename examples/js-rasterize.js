// nodemon src/utils/playground.js localhost 8080
const fs = require('fs');
const http = require('http');
const rasterize = require('../src/utils/rasterize');

const glyphData = JSON.parse(fs.readFileSync('samples/SourceHanSansSC-Regular.json').toString());
const testGlyph = Object.values(glyphData).slice(-1)[0];

const binarized = rasterize(testGlyph, { returnType: 'binary' });

http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'image/png' });
  res.end(binarized.toBuffer({ ext: '.png' }))
}).listen(8080);
