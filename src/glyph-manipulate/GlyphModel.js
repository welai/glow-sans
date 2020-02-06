/** Deep clone an object that is serializable.
 * @param { Object } obj The object to clone */
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/** Expand the alignment string to a object.
 * @param { string } alignStr The alignment string, usually in the format 
 * `(on|off)\d+`, where the `on/off` indicates whether it is an on-point or an 
 * off-point, and the digits are the indices of the on-points array or the off
 * points array
 * @returns { {on: boolean, index: number} } */
function expandAlign(alignStr) {
  const on = alignStr.startsWith('on');
  const index = parseInt(alignStr.substr(on? 2:3));
  return { on, index }
}

/** Average of the points to be aligned by x or y axis.
 * @param { 'x'|'y' } xOrY Average of x coordinate or y coordinate
 * @param { [number, number][] } onPts 
 * @param { [number, number][] } offPts 
 * @param { {on: boolean, index: number}[] } group Alignment information */
function setCoordAvg(xOrY, onPts, offPts, group) {
  const ptIndex = xOrY === 'x' ? 0:1;
  // Average of the coordinates to align
  const avg = group.map(expanded => {
    const index = expanded.index;
    return (expanded.on? onPts:offPts)[index][ptIndex];
  }).reduce((a, b) => a + b)/group.length;
  // Set the coordinates
  group.forEach(expanded => {
    const index = expanded.index;
    (expanded.on? onPts:offPts)[index][ptIndex] = avg;
  });
}

/** Convert the on/off points to glyph contour representation
 * @param { [number, number][] } onPts 
 * @param { [number, number][] } offPts 
 * @param { number[] } offOnIndices 
 * @param { number[] } onContourIndices */
function toGlyph(onPts, offPts, offOnIndices, onContourIndices) {
  const contours = [];

  let currentContour = [];
  let offIndex = 0;
  onPts.forEach((pt, onIndex) => {
    if (onContourIndices[onIndex] !== contours.length) {
      contours.push(currentContour);
      currentContour = [];
    }
    currentContour.push({ x: pt[0], y: pt[1], on: true });
    if (offIndex <= offPts.length - 1 && offOnIndices[offIndex] === onIndex) {
      const offPt1 = offPts[offIndex], offPt2 = offPts[offIndex+1];
      currentContour.push({ x: offPt1[0], y: offPt1[1], on: false });
      currentContour.push({ x: offPt2[0], y: offPt2[1], on: false });
      offIndex += 2;
    }
  });
  contours.push(currentContour);
  return contours;
}

/** JavaScript implementation of glyph model manipulation and restoration */
class GlyphModel {
  /** @type { [number, number][] } */ onRefs;
  /** @type { [number, number][] } */ onOffsets;
  /** @type { [number, number][] } */ offOffsets;
  /** @type { number[] } */           offOnIndices;
  /** @type { number[] } */           onContourIndices;
  /** @type { string[][] } */         xAlign;
  /** @type { string[][] } */         yAlign;
  
  /** Construct a glyph model from the parsed glyph model object
   * @param {{ 
   * onRefs: [number, number][], 
   * onOffsets: [number, number][], offOffsets: [number, number][], 
   * offOnIndices: number[], onContourIndices: number[], 
   * xAlign: string[][], yAlign: string[][] }} glyphModelObject 
   */
  constructor(glyphModelObject) {
    Object.assign(this, glyphModelObject);
  }

  /** Handle alignments of given on-points and off-points using `this.xAlign`
   * and `this.yAlign`.
   * @param { [number, number][] } onPts 
   * @param { [number, number][] } offPts */
  align(onPts, offPts) {
    const xas = this.xAlign.map(group => group.map(expandAlign));
    const yas = this.yAlign.map(group => group.map(expandAlign));
    // Aligning
    xas.forEach(group => setCoordAvg('x', onPts, offPts, group));
    yas.forEach(group => setCoordAvg('y', onPts, offPts, group));
  }

  /** Restore the glyph contours.
   * @param { (onRefs: [number, number][],
   * onOffsets: [number, number][], offOffsets: [number, number][]) => 
   * [[number, number][], [number, number][], [number, number][]] } transform
   * @returns { {x: number, y: number, on: boolean}[][] } */
  restore(transform = ((a, b, c) => [a, b, c])) {
    const [ onRefs, onOffsets, offOffsets ] =
      transform(this.onRefs, this.onOffsets, this.offOffsets);
    const onPts = onRefs.map((onRef, i) => {
      const [ x, y ] = onRef;
      const [ dx, dy ] = onOffsets[i];
      return [ x + dx, y + dy ];
    });
    const offPts = offOffsets.map((offOffset, i) => {
      const offOnIndex = this.offOnIndices[i];
      const [ x, y ] = onPts[offOnIndex];
      const [ dx, dy ] = offOffset;
      return [ x + dx, y + dy ];
    });

    this.align(onPts, offPts);
    const offOnIndices = this.offOnIndices;
    const onContourIndices = this.onContourIndices;
    
    return toGlyph(onPts, offPts, offOnIndices, onContourIndices);
  }
}

module.exports = GlyphModel;