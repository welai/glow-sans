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
/** @typedef {{ advanceWidth: number, advanceHeight?: number, 
 * verticalOrigin?: number, contours: GlyphData }} Glyph */
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

/** Get the bounding box of a glyph contour
 * @param { GlyphData } contours */
function boundingBox(contours) {
  let minX = 3000, maxX = -3000, minY = 3000, maxY = -3000;
  contours.forEach(contour => contour.forEach(pt => {
    if (pt.x < minX) minX = pt.x;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.y > maxY) maxY = pt.y;
  }));
  return { minX, maxX, minY, maxY };
}

/** Turn a Han or Kana glyph model data to a glyph
 * @param { { 
 * onRefs: [number, number][], 
 * onOffsets: [number, number][], offOffsets: [number, number][], 
 * offOnIndices: number[], onContourIndices: number[], 
 * xAlign: string[][], yAlign: string[][] } } modelObj 
 * @param modelFilter 
 * @param postFilter 
 * @param { number } baseline Latin baseline
 * @param { number } widthFactor Width ratio to 1 em
 * @returns { Glyph } */
function model2Glyph(modelObj, baseline, widthFactor, modelFilter, postFilter) {
  const model = new GlyphModel(modelObj);
  const restored = model.restore(modelFilter);
  const transformed = postFilter ? postFilter(restored) : restored;
  // Merge overlaps
  const merged = caryllShapeOps.removeOverlap(transformed, 
    fillRule = caryllShapeOps.fillRules.nonzero);
  // Data for the contours
  const contours = PostFilters.round()(
    PostFilters.translation(0, -baseline)(merged));
  return {
    advanceWidth: Math.round(widthFactor * 1000),
    advanceHeight: 1000,
    verticalOrigin: 1000 - Math.round(baseline),
    contours
  };
}

/** Base-scale glyph transforms
 * @param { Glyph } glyph 
 * @returns { Glyph } */
function baseScaleGlyph(glyph, baseline, scaleFactor) {
  return {
    advanceWidth: Math.round(glyph.advanceWidth * scaleFactor),
    advanceHeight: glyph.advanceHeight,
    verticalOrigin: glyph.verticalOrigin + 120 - Math.round(baseline),
    contours: PostFilters.round()(
      PostFilters.translation(0, 120 - baseline)(
        PostFilters.scaling(scaleFactor)(glyph.contours)))
  };
}

/** Center-scale glyph transforms
 * @param { Glyph } glyph 
 * @param { number } baseline
 * @param { number } scaleFactor
 * @returns { Glyph } */
function centerScaleGlyph(glyph, baseline, scaleFactor) {
  let filter;
  const k = scaleFactor;
  if (k >= 1) filter = PostFilters.translation(0, 0);
  else {
    const scaleFilter = PostFilters.scaling(k);
    const translateFilter = PostFilters.translation(
      500*(1-k), (500-120)*(1-k) + 120 - baseline);
    filter = PostFilters.merge(scaleFilter, translateFilter);
  }

  return {
    advanceWidth: Math.round(glyph.advanceWidth * scaleFactor),
    advanceHeight: glyph.advanceHeight,
    verticalOrigin: glyph.verticalOrigin + 120 - Math.round(baseline),
    contours: PostFilters.round()(filter(glyph.contours))
  };
}

/** Lengthen the glyph
 * @param { Glyph } glyph 
 * @param { number } baseline
 * @param { number } scaleFactor 
 * @returns { Glyph } */
function lengthenGlyph(glyph, baseline, scaleFactor) {
  return {
    advanceWidth: Math.round(glyph.advanceWidth * scaleFactor),
    advanceHeight: glyph.advanceHeight,
    verticalOrigin: glyph.verticalOrigin + 120 - Math.round(baseline),
    contours: PostFilters.round()(
      PostFilters.translation(0, 120 - baseline)(
        PostFilters.scaling(scaleFactor, 1)(glyph.contours)))
  };
}

/** Transform punctuation-like
 * @param { Glyph } glyph 
 * @param { number } scaleFactor 
 * @returns { Glyph } */
function puncLikeGlyph(glyph, baseline, scaleFactor) {
  // Not a full/half-width punctuation case
  if (glyph.advanceWidth < 1000 && glyph.advanceWidth !== 500) return {
    advanceWidth: glyph.advanceWidth,
    advanceHeight: glyph.advanceHeight,
    verticalOrigin: glyph.verticalOrigin + 120 - Math.round(baseline),
    contours: glyph.contours
  };

  // This leading is the maximum em box compression
  const leading = 250;
  const targetAdvance = Math.round(glyph.advanceWidth * scaleFactor);
  const targetVerticalOrigin = glyph.verticalOrigin+120 - Math.round(baseline);
  const translateLeft = 
    PostFilters.translation(
      targetAdvance - glyph.advanceWidth, 120 - baseline);
  const centering = 
    PostFilters.translation(
      (targetAdvance - glyph.advanceWidth)/2, 120 - baseline);
  if (glyph.contours === undefined) return {
    advanceWidth: targetAdvance,
    advanceHeight: glyph.advanceHeight,
    verticalOrigin: targetVerticalOrigin
  }

  const { minX, maxX } = boundingBox(glyph.contours);
  if (minX >= leading * 0.5 && maxX <= 1000 - leading * 0.5) return {
    advanceWidth: targetAdvance,
    advanceHeight: glyph.advanceHeight,
    verticalOrigin: targetVerticalOrigin,
    contours: PostFilters.round()(centering(glyph.contours))
  }; else if (maxX <= 1000 - leading) return {
    advanceWidth: targetAdvance,
    advanceHeight: glyph.advanceHeight,
    verticalOrigin: targetVerticalOrigin,
    contours: PostFilters.round()(
      PostFilters.translation(0, 120 - baseline)(glyph.contours))
  }; else if (minX >= leading) return {
    advanceWidth: targetAdvance,
    advanceHeight: glyph.advanceHeight,
    verticalOrigin: targetVerticalOrigin,
    contours: PostFilters.round()(translateLeft(glyph.contours))
  }; else return centerScaleGlyph(glyph, baseline, scaleFactor);
}

/** Transform punctuation-like
 * @param { Glyph } glyph 
 * @param { number } scaleFactor 
 * @returns { Glyph } */
function latinGlyph(glyph, baseline, scaleFactor) {
  const result = {
    advanceWidth: Math.round(glyph.advanceWidth * scaleFactor),
    advanceHeight: 1000,
    verticalOrigin: 1000 - Math.round(baseline),
  };
  if (glyph.contours !== undefined) result.contours = PostFilters.round()(
    PostFilters.scaling(scaleFactor)(glyph.contours));
  return result;
}

module.exports = { hanModelFilter, kanaModelFilter, hanPostFilter,
  model2Glyph, baseScaleGlyph, centerScaleGlyph, lengthenGlyph, 
  puncLikeGlyph, latinGlyph };