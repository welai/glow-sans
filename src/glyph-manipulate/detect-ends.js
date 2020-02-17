/** @typedef { { x: number, y: number, on: boolean } } ControlPoint */
/** @typedef { ControlPoint[] } Contour */
/** @typedef { Contour[] } GlyphData */
/** @typedef { [number, number] PointTuple } */
const { angle, dist, mod, rad2deg, tuple } = require('../utils/point-math');

/** Test if the points construct an end
 * @param { ControlPoint } pt1 
 * @param { ControlPoint } pt2 
 * @param { ControlPoint } pt3 
 * @param { ControlPoint } pt4 
 * @param { ControlPoint } pt5 
 * @param { ControlPoint } pt6 
 * @param { { maxStroke: number? } } config
 * @returns { boolean } */
function isEnd(pt1, pt2, pt3, pt4, pt5, pt6, { 
maxStroke = 10, angleTol = 20 } = {}) {
  const angleApprox = (a1, a2) => Math.abs(a1-a2) < angleTol;
  if (pt1.on || !pt2.on || pt3.on || pt4.on || !pt5.on || pt6.on) return false;
  if (dist(tuple(pt2), tuple(pt5)) > maxStroke * 1.4) return false;
  const angle1 = rad2deg(angle(tuple(pt5), tuple(pt2), tuple(pt1)));
  const angle2 = rad2deg(angle(tuple(pt6), tuple(pt5), tuple(pt2)));
  if (!angleApprox(angle1 + angle2, 160)) return false;
  return true;
}

/** Ends detection
 * @param { Contour } contour 
 * @param { { maxStroke: number, angleTol: number } } config
 * @returns { number[] } */
function detectEnds(contour, { maxStroke = 10, angleTol = 20 } = {}) {
  const result = [];
  contour.forEach((pt1, i) => {
    const pt2 = contour[mod(i+1, contour.length)],
          pt3 = contour[mod(i+2, contour.length)],
          pt4 = contour[mod(i+3, contour.length)],
          pt5 = contour[mod(i+4, contour.length)],
          pt6 = contour[mod(i+5, contour.length)];
    if (isEnd(pt1, pt2, pt3, pt4, pt5, pt6, { maxStroke, angleTol })) {
      result.push(mod(i+1, contour.length));
    }
  });
  return result;
}

module.exports = detectEnds;
