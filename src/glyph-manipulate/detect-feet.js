/** @typedef { { x: number, y: number, on: boolean } } ControlPoint */
/** @typedef { ControlPoint[] } Contour */
/** @typedef { Contour[] } GlyphData */
/** @typedef { (GlyphData) => GlyphData } PostFilter */
/** @typedef { [number, number] PointTuple } */

/** Clone a searializable object
 * @param { T } obj @returns { T } @template T */
function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

/** @type { (n: number, m: number) => number } */
const mod = (n, m) => ((n % m) + m) % m;

/** Dot of two vectors
  * @type { (vec1: PointTuple, vec2: PointTuple) => number } */
const dot = (vec1, vec2) => {
  const [ x1, y1 ] = vec1, [ x2, y2 ] = vec2;
  return x1 * x2 + y1 * y2;
}

/** Outer product of two vectors
 * @type { (vec1: PointTuple, vec2: PointTuple) => number } */
const outer = (vec1, vec2) => {
  const [ x1, y1 ] = vec1, [ x2, y2 ] = vec2;
  return x1 * y2 - x2 * y1;
}

/** Norm of a vector
 * @type { (vec: PointTuple) => number } */
const norm = vec => {
  const [ x, y ] = vec;
  return Math.sqrt(x*x + y*y);
}

/** Add two vectors
 * @type { (vec1: PointTuple, vec2: PointTuple) => PointTuple } */
const add = (vec1, vec2) => {
  const [ x1, y1 ] = vec1, [ x2, y2 ] = vec2;
  return [ x1 + x2, y1 + y2 ];
}


/** Subtract two vectors
 * @type { (vec1: PointTuple, vec2: PointTuple) => PointTuple } */
const sub = (vec1, vec2) => {
  const [ x1, y1 ] = vec1, [ x2, y2 ] = vec2;
  return [ x1 - x2, y1 - y2 ];
}

/** Rad to degree
 * @type { (rad: number) => number } */
const rad2deg = rad => rad/Math.PI*180;

/** Angle specified by three points: point on edge 1, vertex, point on edge 2.
 * The angle is in rad and goes counterclock-wise.
 * @type { (pt1: PointTuple, pt2: PointTuple, pt3: PointTuple) => number } */
const angle = (pt1, pt2, pt3) => {
  const vec1 = sub(pt1, pt2), vec2 = sub(pt3, pt2);
  const convexAngle = Math.acos(dot(vec1, vec2)/(norm(vec1)*norm(vec2)));
  const outerProduct = outer(vec1, vec2);
  return outerProduct > 0 ? convexAngle : 2 * Math.PI - convexAngle;
}

/** Distance of two points
 * @type { (pt1: PointTuple, pt2: PointTuple) => number } */
const dist = (pt1, pt2) => norm(sub(pt1, pt2));

/** Test if the four points construct a left foot
 * @param { ControlPoint } pt1 
 * @param { ControlPoint } pt2 
 * @param { ControlPoint } pt3 
 * @param { ControlPoint } pt4 
 * @param { ControlPoint } pt5
 * @param { { maxStroke: number?, longestFoot: number?, 
 * angleTol: number? } } config */
function isLeftFoot(pt1, pt2, pt3, pt4, pt5, pt6, pt7, { 
  maxStroke = 10, longestFoot = 50, angleTol = 2
} = {}) {
  const angleApprox = (a1, a2) => Math.abs(a1-a2) < angleTol;
  /** @type { ControlPoint => [ number, number ] } */
  const tuple = (ctrlPt) => [ ctrlPt.x, ctrlPt.y ];

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
  if (pt1.y - pt4.y < 1.8 * maxStroke) return false;
  // The `月` case
  if (pt6.on && !pt7.on) return false;
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
 * angleTol: number? } } config */
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
