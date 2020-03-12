/** @typedef {{ width: number, weight: number, contrast: number, 
 * xtracking: number, ytracking: number, counter: number, gravity: number,
 * softness:number, dotsoftness: number, 
 * feetremoval: boolean, endsremoval: boolean, flattenends: number, 
 * hooktension: number, baseline: number, latinscale: number, 
 * shs: number, fira?: number, raleway?: number, hstroke: number, 
 * vstroke: number }} Parameter */
/** @typedef { { x: number, y: number, on: boolean } } ControlPoint */
/** @typedef { ControlPoint[] } Contour */
/** @typedef { Contour[] } GlyphData */
/** @typedef {{ advanceWidth: number, advanceHeight: number, 
 * verticalOrigin: number, contours: GlyphData }} Glyph */
const ModelFilters = require('../glyph-manipulate/ModelFilters');
const PostFilters = require('../glyph-manipulate/PostFilters');
const GlyphModel = require('../glyph-manipulate/GlyphModel');
const caryllShapeOps = require('caryll-shapeops');

/** Get Han glyph model filter of given parameters
 * @param { Parameter } param */
function hanModelFilter(param) {
  return ModelFilters.merge(
    ModelFilters.horizontalScale(param.width),
    ModelFilters.radialScale(param.xtracking, param.ytracking),
    ModelFilters.counterScale(param.counter),
    ModelFilters.gravityAdjustment(param.gravity),
    ModelFilters.weightAdjustment(param.weight),
    ModelFilters.contrastAdjustment(param.contrast),
    ModelFilters.soften(param.softness)
  );
}

/** Get Kana glyph model filter of given parameters
 * @param { Parameter } param */
function kanaModelFilter(param) {
  return ModelFilters.merge(
    ModelFilters.horizontalScale(param.width),
    ModelFilters.radialScale(param.xtracking, param.ytracking),
    ModelFilters.weightAdjustment(param.weight),
    ModelFilters.contrastAdjustment(param.contrast)
  );
}

/** Get post filter of given parameters
 * @param { Parameter } param */
function hanPostFilter(param) {
  const vStroke = param.vstroke;
  const hStroke = param.hstroke;

  const removeFeetFilter = PostFilters.removeFeet(
    { maxStroke: vStroke * 1.5, longestFoot: 110 });
  const hookTensionFilter = PostFilters.hookTension(param.hooktension);
  const strokeEndFilter = PostFilters.strokeEndsFlatten(
    param.flattenends, param.endsremoval, 
    { maxStroke: hStroke * 1.5 });
  const softenDotFilter = PostFilters.softenDots(
    param.dotsoftness, { maxStroke: hStroke * 1.5 });
  const postFilterList = [];
  if (param.feetremoval) postFilterList.push(removeFeetFilter);
  postFilterList.push(hookTensionFilter);
  postFilterList.push(strokeEndFilter);
  postFilterList.push(softenDotFilter);
  return PostFilters.merge(...postFilterList);
}

/** Get post filter for base-scale glyphs
 * @param { Parameter } param */
function baseScalePostFilter(param) {
  return PostFilters.scaling(param.latinscale);
}

/** Get post filter for center-scale glyphs
 * @param { Parameter } param */
function centerScalePostFilter(param) {
  const k = param.width;
  if (k >= 1) return PostFilters.translation(0, 0);
  const scaleFilter = PostFilters.scaling(k);
  const translateFilter = PostFilters.translation(500*(1-k), 380*(1-k));
  return PostFilters.merge(scaleFilter, translateFilter);
}

/** Turn a Han glyph model data to glyph
 * @param { { 
 * onRefs: [number, number][], 
 * onOffsets: [number, number][], offOffsets: [number, number][], 
 * offOnIndices: number[], onContourIndices: number[], 
 * xAlign: string[][], yAlign: string[][] } } modelObj 
 * @param modelFilter 
 * @param postFilter 
 * @returns { Glyph } */
function hanModel2Glyph(modelObj, modelFilter, postFilter) {
  
}

module.exports = { hanModelFilter, kanaModelFilter, hanPostFilter,
  baseScalePostFilter, centerScalePostFilter }