// Rasterize a bezier representation
const { Canvas } = require('canvas');
const cv = require('opencv');

/** Draw the glyph on canvas
 * @param { CanvasRenderingContext2D } ctx 
 * @param { { x: number, y: number, on: boolean }[][] } glyph */
function drawGlyph(ctx, glyph) {
  /** @type {(pt: {x: number, y: number, on: boolean}) => [number, number]} */
  const xy = pt => [ pt.x, pt.y ];
  ctx.beginPath();
  for (const contour of glyph) {
    ctx.moveTo(contour[0].x, contour[0].y);
    let i = 0;
    while (i < contour.length - 1) {
      if (!contour[i].on) throw Error('Invalid cubic bezier.');
      if (!contour[i + 1].on) {
        const endPt = xy(i+3 < contour.length ? contour[i+3] : contour[0]);
        ctx.bezierCurveTo(...xy(contour[i+1]), ...xy(contour[i+2]), ...endPt);
        i += 3;
      } else {
        const endPt = xy(i+1 < contour.length ? contour[i+1] : contour[0]);
        ctx.lineTo(...endPt);
        i++;
      }
    }
  }
  ctx.fill();
}

/** Draw the glyph on canvas
 * @param {[[{ x: number, y: number, on: boolean }]]} glyph 
 * @param { ('png' | 'cv' | 'binary')? } returnType
 */
module.exports = function rasterize(glyph, { returnType = 'png' } = {}) {
  const canvas = new Canvas(1000, 1000, 'png');
  const ctx = canvas.getContext('2d');
  drawGlyph(ctx, glyph);
  const pngBuffer = canvas.toBuffer();
  switch (returnType) {
    case 'png': return pngBuffer;
    case 'cv':  return cv.readImageAsync(pngBuffer);
    case 'binary': default: {
      const img = cv.readImageAsync(pngBuffer);
      const alphaChannel = img.split()[3];
      return alphaChannel.threshold(128, 255)
    }
  }
}