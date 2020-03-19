const fs = require('fs');
const path = require('path');

function absolutePath(filepath) {
  return path.join(__dirname, filepath);
}

function saveTable(filename) {
  const table = fs.readFileSync(absolutePath(filename))
    .toString().split('\n').map(line => line.split('\t'));
  const keys = table.map(line => line[0]);
  const values = table.map(line => line.slice(1).map(
    x => parseFloat(x) || (x === 'TRUE'? true: x === 'FALSE'? false:0)
  ));
  values[0].forEach((weight, col) => {
    let fontVal = weight;
    fontVal += Math.round(values[2][col] * 100 % 100);
    const params = {};
    keys.slice(2).forEach((key, row_2) => {
      const row = row_2 + 2;
      params[key] = values[row][col];
    });
    fs.writeFileSync(absolutePath(`tsv2json/${fontVal}.json`), 
      JSON.stringify(params));
  });
}

saveTable('compressed.tsv');
saveTable('condensed.tsv');
saveTable('normal.tsv');
saveTable('extended.tsv');
saveTable('wide.tsv');