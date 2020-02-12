/** @typedef { { x: number, y: number, on: boolean } } ControlPoint */
/** @typedef { ControlPoint[] } Contour */
/** @typedef { Contour[] } GlyphData */
/** @typedef { (glyph: GlyphData) => GlyphData } PostFilter */
const detectFeet = require('./detect-feet');
const { mod } = require('../utils/point-math');

/** Remove feet filter
 * @param { { maxStroke: number?, longestFoot: number?, 
 * angleTol: number? }) } config
 * @returns { PostFilter } */
function removeFeet({ maxStroke = 10, longestFoot = 100, angleTol = 2 } = {}) {
  return (glyph) =>  glyph.map(contour => {
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

/** Merge filters
 * @param  {...PostFilter} filters */
function merge(...filters) {
  if (filters.length === 0) return x => x;
  return filters.reduce((a, b) => (x => b(a(x))));
}

module.exports = {
  removeFeet,
  merge
}
