const fs = require('fs');
const { getParam } = require('./res/params');
const { firaFont, ralewayFont, index2FiraName, index2RalewayName,
  listHanModelPaths, readModels, 
  extractedGlyphs, kanaLikeModels } = require('./res/glyph-data');
const { hanModelFilter, hanPostFilter, kanaModelFilter, 
  model2Glyph, baseScaleGlyph, centerScaleGlyph, 
  lengthenGlyph, puncLikeGlyph, latinGlyph } = require('./glyph-filters');
const cmaps = require('./res/cmaps');
const gids = require('./res/gids');

// Parameters
const param = getParam('compressed-test');//('regular-test');
// Font configuration
const lang = 'SC';
const buildWeight = 'Regular';
const buildWidth = 'Compressed';//'Normal';
const buildVersion = '0.5';
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
const head = require('./tables/head')(buildVersion);
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
const sourceLang = lang === 'TC'? 'K' : lang;
// Source weight
const sourceWeight = [ 'ExtraLight', 'Light', 'Normal', 'Regular', 'Medium',
  'Bold', 'Heavy' ][param.shs];

// cmap table
let cmap = {};
// glyf table
const glyf = {};
/** @type { Set<string> } */ 
let shsSet;
switch (sourceLang) {
  case 'SC': cmap = cmaps.shsSC; shsSet = gids.setSC; break;
  case 'K': cmap = cmaps.shsK; shsSet = gids.setK; break;
  case 'J': cmap = cmaps.shsJ; shsSet = gids.setJ; break;
  default: throw Error(`Unknown lang tag ${lang} specified`);
}

// Add Latin
for (let cid in cmap) {
  const gid = latinFont.cmap[cid];
  if (shsSet.has(cmap[cid])) continue;
  if (gid !== undefined) {
    glyf[cmap[cid]] = latinGlyph(
      latinFont.glyf[gid], param.baseline, param.latinscale);
  }
  // TODO: Raleway numbers
  // TODO: Fix space
  // TODO: Fix center scale
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
    baseScale: extractedGlyphs('base-scale', sourceLang, sourceWeight),
    centerScale: extractedGlyphs('center-scale', sourceLang, sourceWeight),
    lengthen: extractedGlyphs('lengthen', sourceLang, sourceWeight),
    puncLike: extractedGlyphs('punc-like', sourceLang, sourceWeight)
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
  const hanModelFiles = listHanModelPaths(sourceLang, sourceWeight);
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

var fontObject = { head, OS_2, name, CFF_, hhea, vhea, post, BASE, 
  cmap, glyf, GDEF, GPOS: {}, GSUB: {} };

fs.writeFileSync('working/hello.json', JSON.stringify(fontObject));
