/** @typedef { { x: number, y: number, on: boolean } } ControlPoint */
/** @typedef { ControlPoint[] } Contour */
/** @typedef { Contour[] } GlyphData */
/** @typedef { [number, number] PointTuple } */
const { mod, rad2deg, angle, dist, tuple } = require('../utils/point-math');

/** Test if the points construct a left foot
 * @param { ControlPoint } pt1 
 * @param { ControlPoint } pt2 
 * @param { ControlPoint } pt3 
 * @param { ControlPoint } pt4 
 * @param { ControlPoint } pt5
 * @param { { maxStroke: number?, longestFoot: number?, 
 * angleTol: number? } } config 
 * @returns { boolean } */
function isLeftFoot(pt1, pt2, pt3, pt4, pt5, pt6, pt7, { 
  maxStroke = 10, longestFoot = 50, angleTol = 2
} = {}) {
  const angleApprox = (a1, a2) => Math.abs(a1-a2) < angleTol;

  // On-point testing
  if (!pt1.on || !pt2.on || !pt3.on || !pt4.on || !pt5.on) return false;
  // Vertical testing
  if (!(pt1.y > pt2.y)) return false;
  if (Math.abs(pt1.x - pt2.x) > 20) return false;
  // The first interior angle
  const angle1 = angle(tuple(pt3), tuple(pt2), tuple(pt1));
  if (!angleApprox(rad2deg(angle1), 90)) return false;
  // The second interior angle
  const angle2 = angle(tuple(pt4), tuple(pt3), tuple(pt2));
  if (!angleApprox(rad2deg(angle2), 90)) return false;
  // The third interior angle
  const angle3 = angle(tuple(pt5), tuple(pt4), tuple(pt3));
  if (!angleApprox(rad2deg(angle3), 270)) return false;
  // Foot length
  const footLen = dist(tuple(pt3), tuple(pt4));
  if (footLen > longestFoot) return false;
  // Stroke width
  const footWidth = dist(tuple(pt2), tuple(pt3));
  if (footWidth > maxStroke) return false;
  // Shoulder
  if (pt1.y - pt4.y < 1.5 * maxStroke) return false;
  // The `月` case
  if (pt6.on && !pt7.on && pt6.y < pt5.y && pt7.x <= pt5.x + 10) return false;
  // The `非` case
  if (pt7.y > pt4.y && pt7.y - pt4.y < maxStroke) return false;
  // Presume that no feet at the top
  if (pt4.y > 500) return false;
  // Finally...
  return true;
}

/** Feet detection
 * @param { Contour } contour 
 * @param { { maxStroke: number?, longestFoot: number?, 
 * angleTol: number? } } config 
 * @returns { [ number[], number[] ] } */
function detectFeet(contour, { 
  maxStroke = 10, longestFoot = 100, angleTol = 2
} = {}) {
  let leftFeet = [], rightFeet = [];
  contour.forEach((pt1, i) => {
    const pt2 = contour[mod(i+1, contour.length)],
          pt3 = contour[mod(i+2, contour.length)], 
          pt4 = contour[mod(i+3, contour.length)],
          pt5 = contour[mod(i+4, contour.length)],
          pt6 = contour[mod(i+5, contour.length)],
          pt7 = contour[mod(i+6, contour.length)];
    if (isLeftFoot(pt1, pt2, pt3, pt4, pt5, pt6, pt7, { 
    maxStroke, longestFoot, angleTol })) {
      leftFeet.push(mod(i+1, contour.length));
    }
    const isRight = isLeftFoot(...[ pt7, pt6, pt5, pt4, pt3, pt2, pt1 ].map(
      pt => ({ x: 1000 - pt.x, y: pt.y, on: pt.on })), 
      { maxStroke, longestFoot, angleTol });
    if (isRight) rightFeet.push(mod(i+5, contour.length));
  });
  return [ leftFeet, rightFeet ];
}

module.exports = detectFeet;
