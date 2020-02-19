/** @typedef { { x: number, y: number, on: boolean } } ControlPoint */
/** @typedef { ControlPoint[] } Contour */
/** @typedef { Contour[] } GlyphData */
/** @typedef { (glyph: GlyphData) => GlyphData } PostFilter */
const detectFeet = require('./detect-feet');
const detectEnds = require('./detect-ends');
const { add, angle, dist, mod, mul, projection, rad2deg, tuple } 
  = require('../utils/point-math');

/** Remove feet filter
 * @param { { maxStroke: number?, longestFoot: number?, 
 * angleTol: number? }) } config
 * @returns { PostFilter } */
function removeFeet({ maxStroke = 10, longestFoot = 100, angleTol = 2 } = {}) {
  return glyph =>  glyph.map(contour => {
    const [ leftFeet, rightFeet ] = detectFeet(contour, 
      { maxStroke, longestFoot, angleTol });
    return contour.map((pt, i) => {
      if (leftFeet.indexOf(i) >= 0) {
        const pt3 = contour[mod(i+2, contour.length)];
        return { x: pt.x, y: pt3.y, on: pt.on };
      } else if (rightFeet.indexOf(i) >= 0) {
        const pt3 = contour[mod(i-2, contour.length)];
        return { x: pt.x, y: pt3.y, on: pt.on };
      }
      return pt;
    }).filter((pt, i) => {
      if (leftFeet.indexOf(mod(i-1, contour.length)) >= 0) return false;
      if (leftFeet.indexOf(mod(i-2, contour.length)) >= 0) return false;
      if (rightFeet.indexOf(mod(i+1, contour.length)) >= 0) return false;
      if (rightFeet.indexOf(mod(i+2, contour.length)) >= 0) return false;
      return true;
    });
  });
}

/** Target points of the stroke end
 * @param { Contour } contour 
 * @param { number } endIndex 
 * @returns { [ [number, number], [number, number], [number, number], 
 * [number, number] ] } new pt2, pt3, pt4 & pt5 */
function targetPoints(contour, endIndex) {
  const pt1 = tuple(contour[mod(endIndex-1, contour.length)]),
        pt2 = tuple(contour[endIndex]),
        pt5 = tuple(contour[mod(endIndex+3, contour.length)]),
        pt6 = tuple(contour[mod(endIndex+4, contour.length)]);
  const pt2Proj = projection(pt2, pt5, pt6),
        pt5Proj = projection(pt5, pt2, pt1);
  const tp20 = add(mul(0.5, pt5Proj), mul(0.5, pt2)),
        tp50 = add(mul(0.5, pt2Proj), mul(0.5, pt5));
  const r = 0;
  /** Target positions of pt2 and pt5 */
  const tp2 = add(mul(1-r, tp20), mul(r, tp50)),
        tp5 = add(mul(1-r, tp50), mul(r, tp20));
  /** Target positions of pt3 and pt4 */
  const tp3 = add(mul(0.3, tp2), mul(0.7, tp5)),
        tp4 = add(mul(0.7, tp2), mul(0.3, tp5));
  return [ tp2, tp3, tp4, tp5 ];
}

/** Flatten the stroke ends of the hooks and side-falling strokes
 * @param { number } ratio 
 * @param { removeOffPts } boolean
 * @param { { maxStroke: number, angleTol: number } } config
 * @returns { PostFilter } */
function strokeEndsFlatten(ratio, removeOffPts = false, { maxStroke = 10, angleTol = 20 } = {}) {
  return glyph => glyph.map(contour => {
    /** @type { number[] } */
    const ends = detectEnds(contour, { maxStroke, angleTol });
    const endTargets = ends.map(end => targetPoints(contour, end));
    const targets = [];
    ends.forEach((end, i) => {
      const [ tp2, tp3, tp4, tp5 ] = endTargets[i];
      targets[end] = tp2; 
      targets[mod(end+1, contour.length)] = tp3;
      targets[mod(end+2, contour.length)] = tp4;
      targets[mod(end+3, contour.length)] = tp5;
    });
    const result = []
    contour.forEach((pt, i) => {
      if (targets[i] === undefined) { result.push(pt); return; }
      const p = tuple(pt);
      const pr = add(mul(1-ratio, p), mul(ratio, targets[i]));
      if (removeOffPts && !pt.on) return;
      result.push({ x: pr[0], y: pr[1], on: pt.on });
    });
    return result;
  });
}

/** Check if the contour is a dot
 * @param { Contour } contour 
 * @returns { boolean } */
function isDot(contour, maxStroke) {
  if (contour.length !== 8) return false;
  let nearestOn;
  if (contour[1].on) {
    const onOffTest = !contour[2].on && !contour[3].on && contour[4].on
      && contour[5].on && !contour[6].on && !contour[7].on;
    if (!onOffTest) return false;
    nearestOn = contour[1];
  } else if (contour[7].on) {
    const onOffTest = !contour[1].on && !contour[2].on && contour[3].on
      && contour[4].on && !contour[5].on && !contour[6].on;
    if (!onOffTest) return false;
    nearestOn = contour[7];
  } else return false;
  return dist(tuple(contour[0]), tuple(nearestOn)) < maxStroke &&
  rad2deg(angle(tuple(contour[2]), tuple(contour[1]), tuple(contour[0]))) < 180;
}

/** Get the target point of a dot's off-point
 * @param { Contour } contour 
 * @param { number } offIndex 
 * @returns { [ number, number ] } */
function dotOffPointTarget(contour, offIndex) {
  let prevOn, nextOn;
  if (contour[mod(offIndex-1, contour.length)].on) 
    prevOn = tuple(contour[mod(offIndex-1, contour.length)]);
  else prevOn = tuple(contour[mod(offIndex-2, contour.length)]);
  if (contour[mod(offIndex+1, contour.length)].on) 
    nextOn = tuple(contour[mod(offIndex+1, contour.length)]);
  else nextOn = tuple(contour[mod(offIndex+2, contour.length)]);
  return projection(tuple(contour[offIndex]), prevOn, nextOn);
}

/** Soften the dot strokes
 * @param { number } value
 * @param { { maxStroke: number } } config
 * @returns { PostFilter } */
function softenDots(value, { maxStroke = 10 }) {
  return glyph => glyph.map(contour => {
    if (!isDot(contour, maxStroke)) return contour;
    return contour.map((pt, i) => {
      if (pt.on) return pt;
      const target = dotOffPointTarget(contour, i);
      const p = tuple(pt);
      const result = add(mul(value, p), mul(1-value, target));
      return { x: result[0], y: result[1], on: false };
    });
  });
}

/** Translation
 * @param { number } xOffset 
 * @param { number } yOffset 
 * @returns { PostFilter } */
function translation(xOffset, yOffset) {
  return glyph => glyph.map(contour => contour.map(
    pt => ({ x: pt.x + xOffset, y: pt.y + yOffset, on: pt.on })));
}

/** Scaling
 * @param { number } xRatio 
 * @param { number } yRatio 
 * @returns { PostFilter } */
function scaling(xRatio, yRatio = xRatio) {
  return glyph => glyph.map(contour => contour.map(
    pt => ({ x: pt.x * xRatio, y: pt.y * yRatio, on: pt.on })));
}

/** Round
 * @returns { PostFilter } */
function round() {
  return glyph => glyph.map(contour => contour.map(
    pt => ({ x: Math.round(pt.x), y: Math.round(pt.y), on: pt.on })));
}

/** Merge filters
 * @param  {...PostFilter} filters
 * @returns { PostFilter } */
function merge(...filters) {
  if (filters.length === 0) return x => x;
  return filters.reduce((a, b) => (x => b(a(x))));
}

module.exports = {
  removeFeet,
  translation,
  strokeEndsFlatten,
  scaling,
  softenDots,
  round,
  merge,
}
