/** @typedef { { x: number, y: number, on: boolean } } ControlPoint */
/** @typedef { ControlPoint[] } Contour */
/** @typedef { Contour[] } GlyphData */
/** @typedef { (GlyphData) => GlyphData } PostFilter */
/** @typedef { [number, number] PointTuple } */

/** Clone a searializable object
 * @param { T } obj @returns { T } @template T */
function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

/** @type { (number, number) => number } */
const mod = (n, m) => ((n % m) + m) % m;

/** Dot of two vectors
  * @type { (PointTuple, PointTuple) => number } */
const dot = (vec1, vec2) => {
  const [ x1, y1 ] = vec1, [ x2, y2 ] = vec2;
  return x1 * x2 + y1 * y2;
}

/** Outer product of two vectors
 * @type { (PointTuple, PointTuple) => number } */
const outer = (vec1, vec2) => {
  const [ x1, y1 ] = vec1, [ x2, y2 ] = vec2;
  return x1 * y2 - x2 * y1;
}

/** Norm of a vector
 * @type { (PointTuple) => number } */
const norm = vec => {
  const [ x, y ] = vec;
  return Math.sqrt(x*x + y*y);
}

/** Add two vectors
 * @type { (PointTuple, PointTuple) => PointTuple } */
const add = (vec1, vec2) => {
  const [ x1, y1 ] = vec1, [ x2, y2 ] = vec2;
  return [ x1 + x2, y1 + y2 ];
}


/** Subtract two vectors
 * @type { (PointTuple, PointTuple) => PointTuple } */
const sub = (vec1, vec2) => {
  const [ x1, y1 ] = vec1, [ x2, y2 ] = vec2;
  return [ x1 - x2, y1 - y2 ];
}

/** Angle specified by three points: point on edge 1, vertex, point on edge 2.
 * The angle is in rad and goes counterclock-wise.
 * @type { (PointTuple, PointTuple, PointTuple) => number } */
const angle = (pt1, pt2, pt3) => {
  const vec1 = sub(pt1, pt2), vec2 = sub(pt3, pt2);
  const convexAngle = Math.acos(dot(vec1, vec2)/(norm(vec1)*norm(vec2)));
  const outerProduct = outer(vec1, vec2);
  return outerProduct > 0 ? convexAngle : 2 * Math.PI - convexAngle;
}

/** Distance of two points
 * @type { (PointTuple, PointTuple, PointTuple) => number } */
const dist = (pt1, pt2) => norm(sub(pt1, pt2));

/** The interior angles at each contour point in degrees
 * @param { Contour } contour */
function cornerAngles(contour) {
  return contour.map((pt, i) => {
    const prev = contour[mod(i-1, contour.length)];
    const next = contour[mod(i+1, contour.length)];
    const {x: x3, y: y3} = prev, { x: x2, y: y2 } = pt, { x: x1, y: y1 } = next;
    return angle([ x1, y1 ], [ x2, y2 ], [ x3, y3 ])/Math.PI*180;
  });
}

/** Test if the four points construct a left foot
 * @param { ControlPoint } pt1 
 * @param { ControlPoint } pt2 
 * @param { ControlPoint } pt3 
 * @param { ControlPoint } pt4 
 * @param { ControlPoint } pt5
 * @param { { strokeWidth: number?, feetLength: number?, 
 * scaleTol: number?, angleTol: number? } } config */
function isLeftFoot(pt1, pt2, pt3, pt4, pt5, { 
  strokeWidth = 10, feetLength = 10, scaleTol = 0.25, angleTol = 2
} = {}) {
  const angleApprox = (a1, a2) => Math.abs(a1-a2) < angleTol;
  const distApprox = (d1, d2) => Math.abs(d1-d2) < d2 * scaleTol;
  /** @type { ControlPoint => [ number, number ] } */
  const tuple = (ctrlPt) => [ ctrlPt.x, ctrlPt.y ];

  // On-point testing
  if (!pt1.on || !pt2.on || !pt3.on || !pt4.on || !pt5.on) return false;
  // Vertical testing
  if (!(pt1.y > pt2.y)) return false;
  if (Math.abs(pt1.x - pt2.x) > 20) return false;
  // The first interior angle
  const angle1 = angle(tuple(pt3), tuple(pt2), tuple(pt1));
  if (!angleApprox(angle1, 90)) return false;
  // The second interior angle
  const angle2 = angle(tuple(pt4), tuple(pt3), tuple(pt2));
  if (!angleApprox(angle2, 90)) return false;
  // The third interior angle
  const angle3 = angle(tuple(pt5), tuple(pt4), tuple(pt3));
  if (!angleApprox(angle3, 270)) return false;
  // Foot length
  const footLen = dist(tuple(pt3), tuple(pt4));
  if (!distApprox(footLen, feetLength)) return false;
  // Stroke width
  const footWidth = dist(tuple(pt2), tuple(pt3));
  if (!distApprox(footWidth, strokeWidth)) return false;
  // Finally...
  return true;
}

/** Feet detection
 * @param { Contour } contour 
 * @param { { strokeWidth: number?, feetLength: number?, 
 * scaleTol: number?, angleTol: number? } } config */
function detectFeet(contour, { 
  strokeWidth = 10, feetLength = 10, scaleTol = 0.25, angleTol = 2
} = {}) {
  const leftFeet = [], rightFeet = [];
  contour.forEach((pt1, i) => {
    const pt2 = contour[mod(i+1, contour.length)],
          pt3 = contour[mod(i+2, contour.length)], 
          pt4 = contour[mod(i+3, contour.length)],
          pt5 = contour[mod(i+4, contour.length)];
    if (isLeftFoot(pt1, pt2, pt3, pt4, pt5, { 
    strokeWidth, feetLength, scaleTol, angleTol })) {
      leftFeet.push(i);
    }
    if (isLeftFoot(pt5, pt4, pt3, pt2, pt1, { 
    strokeWidth, feetLength, scaleTol, angleTol })) {
      rightFeet.push(mod(i+4, contour.length));
    }
  });
  // Further tests
  leftFeet = leftFeet.filter(ptIndex => {
    const pt7 = contour[mod(ptIndex+6, contour.length)];
    // The `月` case
    if (!pt7.on) return false;
    // Presume that no feet at the top
    if (contour[ptIndex].y > 500) return false;
    return true;
  });
  return [ leftFeet, rightFeet ];
}
