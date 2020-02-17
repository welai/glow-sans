/** @typedef { { x: number, y: number, on: boolean } } ControlPoint */
/** @typedef { ControlPoint[] } Contour */
/** @typedef { Contour[] } GlyphData */
/** @typedef { [number, number] PointTuple } */

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

/** Scalar multiplication
 * @type { (scalar: number, vec: PointTuple) => PointTuple } */
const mul = (scalar, vec) => [ scalar * vec[0], scalar * vec[1] ];

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

/** Project of a point on a line
 * @param { PointTuple } pt Point to project 
 * @param { PointTuple } l1 First point on the line's direction
 * @param { PointTuple } l2 Secode point on the line's direction
 * @returns { PointTuple } */
const projection = (pt, l1, l2) => {
  const p = sub(pt, l1), q = sub(l2, l1);
  if (q[0] === 0 && q[1] === 0) return [ l1[0], l1[1] ];
  const projVec = mul(dot(p, q)/dot(q, q), q);
  return add(l1, projVec);
}

/** @typedef { { x: number, y: number, on: boolean } } ControlPoint */
/** @type { (ctrlPt: ControlPoint) => [ number, number ] } */
const tuple = (ctrlPt) => [ ctrlPt.x, ctrlPt.y ];

module.exports = {
  mod, dot, outer, norm, add, sub, mul, rad2deg, angle, dist, projection, tuple
};
