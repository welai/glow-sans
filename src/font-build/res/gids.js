// Handling gid resources
const path = require('path');
const { readTsv, filesInDir } = require('./read-res');

const gidFilesJ = filesInDir('encoding/gid/shs-j-han');
const gidFilesTC = filesInDir('encoding/gid/shs-tc-han');
const gidFilesSC = filesInDir('encoding/gid/shs-sc-han');

const hanJ = gidFilesJ
  .map(gidFile => readTsv(path.join('encoding/gid/shs-j-han', gidFile)))
  .flat();
const hanTC = gidFilesTC
  .map(gidFile => readTsv(path.join('encoding/gid/shs-tc-han', gidFile)))
  .flat();
const hanSC = gidFilesSC
  .map(gidFile => readTsv(path.join('encoding/gid/shs-sc-han', gidFile)))
  .flat();

const baseScale = readTsv('encoding/gid/base-scale.tsv');
const centerScale = readTsv('encoding/gid/center-scale.tsv');
const kanaLike = readTsv('encoding/gid/kana-like.tsv');
const lengthen = readTsv('encoding/gid/lengthen.tsv');
const puncLike = readTsv('encoding/gid/lengthen.tsv');

const nonHan = [...baseScale, ...centerScale, ...kanaLike, ...lengthen, 
  ...puncLike ].map(l => l[0]);
const setJ = new Set([ ...hanJ.map(l => l[0]), ...nonHan ]);
const setTC = new Set([ ...hanTC.map(l => l[0]), ...nonHan ]);
const setSC = new Set([ ...hanSC.map(l => l[0]), ...nonHan ]);

module.exports = {
  hanJ, hanTC, hanSC, baseScale, centerScale, kanaLike, lengthen, puncLike,
  setJ, setTC, setSC
}