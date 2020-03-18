const cmaps = require('./res/cmaps');
const gids = require('./res/gids');
const { getGSUB, getGPOS, 
  reduceGSUB, reduceGPOS, scaleGPOS } = require('./res/features');
const { firaFont, ralewayFont, index2FiraName, index2RalewayName,
  listHanModelPaths, readModels, 
  extractedGlyphs, kanaLikeModels } = require('./res/glyph-data');
const { hanModelFilter, hanPostFilter, kanaModelFilter, 
  model2Glyph, baseScaleGlyph, centerScaleGlyph, 
  lengthenGlyph, puncLikeGlyph, latinGlyph } = require('./glyph-filters');
const ProgressBar = require('progress');

/** Build font synchronously
 * @param {*} param 
 * @param { 'J' | 'SC' | 'TC' } lang 
 * @param { string } width 
 * @param { number } widthClass 
 * @param { string } weight 
 * @param { number } weightClass 
 * @param { string } buildVersion
 * @param { boolean } showProgress */
function buildFont(param, lang, width, widthClass, 
weight, weightClass, buildVersion, showProgress = false) {
  let bar = showProgress ? new ProgressBar(':bar :percent', 
    { total: 100, width: 40 }) : undefined;

  // Get Latin font resource
  const latinFont = param.fira !== undefined ?
      firaFont(...index2FiraName(param.fira))
    : ralewayFont(index2RalewayName(param.raleway));

  //#region metadata tables
  // BASE table
  const BASE = require('./tables/BASE')(
    param.baseline, 908 * param.width, 908, param.width * 1000);
  // GDEF table
  const GDEF = require('./tables/GDEF')();
  // head table
  const head = require('./tables/head')(buildVersion, width, weight);
  // hhea table
  const hhea = require('./tables/hhea')();
  // name table
  const name = require('./tables/name')(
    lang, weight, width, buildVersion);
  // CFF_ table
  const CFF_ = require('./tables/CFF_')(lang, width, weight, buildVersion, param.width);
  // OS_2 table
  const xHeight = Math.round(latinFont.OS_2.sxHeight * param.latinscale);
  const capHeight = Math.round(latinFont.OS_2.sCapHeight * param.latinscale);
  const OS_2 = require('./tables/OS_2')(
    weightClass, widthClass, xHeight, capHeight);
  // post table
  const post = require('./tables/post')(param.baseline, param.hstroke);
  // vhea table
  const vhea = require('./tables/vhea')(param.width);
  //#endregion

  // Source language
  const hanLang = lang === 'TC'? 'K' : lang;
  // Source weight
  const sourceWeight = [ 'ExtraLight', 'Light', 'Normal', 'Regular', 'Medium',
    'Bold', 'Heavy' ][param.shs];

  // cmap table
  let cmap = {};
  // glyf table
  const glyf = {};
  // Latin gids
  const latinGids = [];
  /** @type { Set<string> } */ 
  let shsSet;
  
  function updateProgress() {
    if (bar) {
      const nGlyphs = latinGids.length + shsSet.size;
      const progress = Object.keys(glyf).length / nGlyphs;
      if (progress < 1) bar.update(progress);
    }
  }

  //#region Handling cmap & glyf tables
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
      latinGids.push(gid);
    }
    updateProgress();
  }

  // Add CJK glyphs to the glyf table
  (function addKanaLikes() {
    var sourceKana = kanaLikeModels(sourceWeight);
    const kanaFilter = kanaModelFilter(param);
    for (let key in sourceKana) {
      glyf[key] = model2Glyph(
        sourceKana[key], param.baseline, param.width, kanaFilter);
      updateProgress();
    }
  })();

  (function addCJKSymbols() {
    var sourceGlyphs = {
      baseScale: extractedGlyphs('base-scale', lang, sourceWeight),
      centerScale: extractedGlyphs('center-scale', lang, sourceWeight),
      lengthen: extractedGlyphs('lengthen', lang, sourceWeight),
      puncLike: extractedGlyphs('punc-like', lang, sourceWeight)
    }
    for (let key in sourceGlyphs.baseScale) {
      glyf[key] = baseScaleGlyph(
        sourceGlyphs.baseScale[key], param.baseline, param.width);
      updateProgress();
    }
    for (let key in sourceGlyphs.centerScale) {
      glyf[key] = centerScaleGlyph(
        sourceGlyphs.centerScale[key], param.baseline, param.width);
      updateProgress();
    }
    for (let key in sourceGlyphs.lengthen) {
      glyf[key] = lengthenGlyph(
        sourceGlyphs.lengthen[key], param.baseline, param.width);
      updateProgress();
    }
    for (let key in sourceGlyphs.puncLike) {
      glyf[key] = puncLikeGlyph(
        sourceGlyphs.puncLike[key], param.baseline, param.width);
      updateProgress();
    }
  })();

  (function addHan() {
    const hanModelFiles = listHanModelPaths(hanLang, sourceWeight);
    const modelFilter = hanModelFilter(param);
    const postFilter = hanPostFilter(param);
    function addModels(modelpath) {
      const models = readModels(modelpath);
      for (let key in models) {
        glyf[key] = model2Glyph(
          models[key], param.baseline, param.width, modelFilter, postFilter);
        updateProgress();
      }
    }
    hanModelFiles.forEach(addModels);
  })();

  // Clean up cmap
  for (const cid in cmap) {
    const gid = cmap[cid];
    if (glyf[gid] === undefined) delete cmap[cid];
  }

  // Assign fdSelect
  const fd = Object.keys(CFF_.fdArray)[0];
  for (const gid in glyf) {
    glyf[gid].CFF_fdSelect = fd;
  }
  //#endregion

  //#region GSUB & GPOS tables
  const GSUB = reduceGSUB(getGSUB(lang, sourceWeight));
  const GPOS = scaleGPOS(reduceGPOS(
    getGPOS(lang, sourceWeight), shsSet), param.width);
  const latinGPOS = scaleGPOS(reduceGPOS(
    latinFont.GPOS, new Set(latinGids)), param.latinscale, param.latinscale);
  // Merging Latin kern feature to the font
  const latinKern = latinGPOS.features[
    latinGPOS.languages.DFLT_DFLT.features.filter(
      x => x.startsWith('kern'))];
  const kernFeatureName = Object.keys(GPOS.features).filter(
    x => x.startsWith('kern'))[0];
  latinKern.forEach(lookupName => {
    const newName = lookupName + '_latin';
    GPOS.lookups[newName] = latinGPOS.lookups[lookupName]
    GPOS.features[kernFeatureName].push(newName);
  });
  //#endregion

  var fontObject = { head, OS_2, name, CFF_, hhea, vhea, post, BASE, 
    cmap, glyf, GDEF, GPOS, GSUB };

  bar.update(1);
  return fontObject;
}

// const font = buildFont(
//   getParam('regular-test'), 'SC', 'Normal', 5, 'Regular', 400, '0.8', true);
// const font = buildFont(
//   getParam('compressed-test'), 'SC', 'Compressed', 2, 'Regular', 400, '0.8');
module.exports = buildFont;
