const fs = require('fs');
const cmaps = require('./res/cmaps');
const gids = require('./res/gids');
const { getParam } = require('./res/params');
const { getGSUB, getGPOS, reduceGSUB } = require('./res/features');
const { firaFont, ralewayFont, index2FiraName, index2RalewayName,
  listHanModelPaths, readModels, 
  extractedGlyphs, kanaLikeModels } = require('./res/glyph-data');
  const { hanModelFilter, hanPostFilter, kanaModelFilter, 
    model2Glyph, baseScaleGlyph, centerScaleGlyph, 
    lengthenGlyph, puncLikeGlyph, latinGlyph } = require('./glyph-filters');

// Parameters
const param = getParam('compressed-test');//('regular-test');
// Font configuration
const lang = 'SC';
const buildWeight = 'Regular';
const isBold = buildWeight === 'Bold';
const buildWidth = 'Compressed';//'Normal';
const buildVersion = '0.6';
const weightClass = 400;
const widthClass = 2;//5;

// Get Latin font resource
const latinFont = param.fira !== undefined ?
    firaFont(...index2FiraName(param.fira))
  : ralewayFont(index2RalewayName(param.raleway));

// BASE table
const BASE = require('./tables/BASE')(
  param.baseline, 908 * param.width, 908, param.width * 1000);
// GDEF table
const GDEF = require('./tables/GDEF')();
// head table
const head = require('./tables/head')(buildVersion, isBold);
// hhea table
const hhea = require('./tables/hhea')();
// name table
const name = require('./tables/name')(
  lang, buildWeight, buildWidth, buildVersion);
// CFF_ table
const CFF_ = require('./tables/CFF_')(lang, buildWeight, buildWidth);
// OS_2 table
const xHeight = Math.round(latinFont.OS_2.sxHeight * param.latinscale);
const capHeight = Math.round(latinFont.OS_2.sCapHeight * param.latinscale);
const OS_2 = require('./tables/OS_2')(
  weightClass, widthClass, xHeight, capHeight);
// post table
const post = require('./tables/post')();
// vhea table
const vhea = require('./tables/vhea')(param.width);

// Source language
const hanLang = lang === 'TC'? 'K' : lang;
// Source weight
const sourceWeight = [ 'ExtraLight', 'Light', 'Normal', 'Regular', 'Medium',
  'Bold', 'Heavy' ][param.shs];

//#region cmap & glyf tables
// cmap table
let cmap = {};
// glyf table
const glyf = {};
/** @type { Set<string> } */ 
let shsSet;
switch (lang) {
  case 'SC': cmap = cmaps.shsSC; shsSet = gids.setSC; break;
  case 'TC': case 'K': cmap = cmaps.shsK; shsSet = gids.setK; break;
  case 'J': cmap = cmaps.shsJ; shsSet = gids.setJ; break;
  default: throw Error(`Unknown lang tag ${lang} specified`);
}

// Not def
glyf['.notdef'] = latinFont.glyf['.notdef'];

// Add Latin
for (let cid in cmap) {
  const ralewayNumbers = {
    zero: "glyph726", one: "glyph727", two: "glyph728", three: "glyph729",
    four: "glyph730", five: "glyph731", six: "glyph732", seven: "glyph733",
    eight: "glyph734", nine: "glyph735"
  };
  let gid = latinFont.cmap[cid];
  if (shsSet.has(cmap[cid])) continue;
  if (param.raleway && gid in ralewayNumbers) gid = ralewayNumbers[gid];
  if (gid !== undefined) {
    glyf[cmap[cid]] = latinGlyph(
      latinFont.glyf[gid], param.baseline, param.latinscale);
  }
}

// Add CJK glyphs to the glyf table
(function addKanaLikes() {
  var sourceKana = kanaLikeModels(sourceWeight);
  const kanaFilter = kanaModelFilter(param);
  for (let key in sourceKana)
    glyf[key] = model2Glyph(
      sourceKana[key], param.baseline, param.width, kanaFilter);
})();

(function addCJKSymbols() {
  var sourceGlyphs = {
    baseScale: extractedGlyphs('base-scale', lang, sourceWeight),
    centerScale: extractedGlyphs('center-scale', lang, sourceWeight),
    lengthen: extractedGlyphs('lengthen', lang, sourceWeight),
    puncLike: extractedGlyphs('punc-like', lang, sourceWeight)
  }
  for (let key in sourceGlyphs.baseScale) 
    glyf[key] = baseScaleGlyph(
      sourceGlyphs.baseScale[key], param.baseline, param.width);
  for (let key in sourceGlyphs.centerScale)
    glyf[key] = centerScaleGlyph(
      sourceGlyphs.centerScale[key], param.baseline, param.width);
  for (let key in sourceGlyphs.lengthen)
    glyf[key] = lengthenGlyph(
      sourceGlyphs.lengthen[key], param.baseline, param.width);
  for (let key in sourceGlyphs.puncLike)
    glyf[key] = puncLikeGlyph(
      sourceGlyphs.puncLike[key], param.baseline, param.width);
})();

(function addHan() {
  const hanModelFiles = listHanModelPaths(hanLang, sourceWeight);
  const modelFilter = hanModelFilter(param);
  const postFilter = hanPostFilter(param);
  function addModels(modelpath) {
    const models = readModels(modelpath);
    for (let key in models)
      glyf[key] = model2Glyph(
        models[key], param.baseline, param.width, modelFilter, postFilter);
  }
  hanModelFiles.forEach(addModels);
})();

// Clean up cmap
for (const cid in cmap) {
  const gid = cmap[cid];
  if (glyf[gid] === undefined) delete cmap[cid];
}
//#endregion

//#region GSUB & GPOS tables
const GSUB = reduceGSUB(getGSUB(lang, sourceWeight));
const GPOS = getGPOS(lang, sourceWeight);
//#endregion

var fontObject = { head, OS_2, name, CFF_, hhea, vhea, post, BASE, 
  cmap, glyf, GDEF, GPOS, GSUB };

fs.writeFileSync('working/hello.json', JSON.stringify(fontObject));
