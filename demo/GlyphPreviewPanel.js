// Wrapped UI component for the glyph preview
const gridcanvas = require('gridcanvas');

/** @type { typeof gridcanvas.default } */
const GridCanvas = window.GridCanvas;

class GlyphPreviewPanel {
  /** @type { { x: number, y: number, on: boolean }[][][] } */
  _glyphs = [];
  /** @type { { x: number, y: number, on: boolean }[][][] } Glyphs to display */
  get glyphs() { return this._glyphs; }
  set glyphs(newVal) {
    let changeHighlights = false;
    this._glyphs = newVal; 
    this.updateLayout(); 
    this.gridCanvas.display();
  }

  /** @type { number | number[] } */
  _advanceWidths = 1000;
  /** @type { number | number[] } Advance widths of the glyphs (upm = 1000) */
  get advanceWidths() { return this._advanceWidths; }
  set advanceWidths(newVal) {
    this._advanceWidths = newVal;
    this.updateLayout();
    this.gridCanvas.display();
  }

  /** @type { [ number, number, number ][] } */
  _highlights = [];
  /** @type { [ number, number, number ][] } Indices for the highlight point, by 
   * the glyph index, the contour index and the point index. */
  get highlights() { return this._highlights; }
  set highlights(newVal) { 
    this._highlights = newVal;
    this.gridCanvas.display();
  }
 
  /** @type { Readonly<number> } Preview window available width */  width;
  /** @type { Readonly<number> } Preview window available height */ height;
  /** @type { Readonly<number> } Preview window padding */          padding;
  /** @type { Readonly<number> } Units per em */                    upm;
  
  _fontSize;
  /** @type { number }           Font size displayed */
  get fontSize() { return this._fontSize; }
  set fontSize(newVal) {
    this._fontSize = newVal;
    this.updateLayout();
    this.gridCanvas.display();
  }
  _lineHeight;
  /** @type { number }           Relative line height */
  get lineHeight() { return this._lineHeight; }
  set lineHeight(newVal) {
    this._lineHeight = newVal;
    this.updateLayout();
    this.gridCanvas.display();
  }

  /** @type { [[number, number]] } 
   * Origins, updated when the layout is updated */
  _origins = [];

  /** 
   * @param { string } elementID  Element ID of the container `<div/>`
   * @param { number } width      Preview window available width
   * @param { number } height     Preview window available height
   * @param { number } padding    Preview window padding
   * @param { number } upm        Units per em
   * @param { number } fontSize   Font size displayed
   * @param { number } lineHeight Relative line height */
  constructor(elementID, { width = 1000, height = 800,
  padding = 20, upm = 1000, fontSize = 100, lineHeight = 1.0 } = {}) {
    this.gridCanvas = new GridCanvas(elementID, 
      { bound: { minX: -padding, maxX: width + padding, 
        minY: -height - padding, maxY: padding } });
    Object.defineProperty(this, 'width', { value: width, writable: false });
    Object.defineProperty(this, 'height', { value: height, writable: false });
    Object.defineProperty(this, 'padding', { value: padding, writable: false });
    Object.defineProperty(this, 'upm', { value: upm, writable: false });
    this._fontSize = fontSize; this._lineHeight = lineHeight;
    // Drawing functions
    this.gridCanvas.redrawUpper = this.redrawUpper;
  }

  /** Total width of glyphs by the given index range.
   * @param { number } start  Index of the starting glyph
   * @param { number } end    Index of the ending glyph
   * @returns { number } Total width */
  glyphWidth(start, end) {
    if (end === undefined) end = start + 1;
    if (typeof this.advanceWidths === 'number')
      return Math.abs(start - end) * this.advanceWidths;
    return this.advanceWidths.slice(start, end).reduce((a, b) => a + b);
  }

  /** Advancing x by previous glyph advance width */
  _advance(x, w) { return x + w/this.upm*this._fontSize; }
  /** Next line */
  _nextline(y) { return y - this._fontSize*this._lineHeight; }
  /** Update the origins for layout greedily. */
  updateLayout() {
    const origins = this._origins = [];
    for (let i = 0; i < this._glyphs.length; i++) {
      if (origins.length === 0)
        origins.push([ 0, this._nextline(0) ]);
      else {
        let x = this._advance(origins[i-1][0], this.glyphWidth(i-1));
        let y = origins[i-1][1];
        if (x + this.glyphWidth(i)/this.upm*this._fontSize > this.width) { 
          x = 0; y = this._nextline(y);
        }
        origins.push([ x, y ]);
      }
    }
  }

  /** Glyph coordinates to gridCanvas project coordinates
   * @param { number } index Index of the glyph
   * @returns { [ (x: number) => number, (y: number) => number ] } 
   * x, y transformations */
  _2p(index) {
    const [ x0,  y0 ] = this._origins[index];
    const x2p = x => x0 + x/this.upm*this.fontSize;
    const y2p = y => y0 + y/this.upm*this.fontSize;
    return [ x2p, y2p ];
  }
  /** Glyph transformation to view coordinates
   * @param { number } index 
   * @returns { {({ x: number, y: number, on: boolean }) => [number, number]} }
   */
  _2v(index) {
    return (pt) => {
      const x = pt.x, y = pt.y;
      const [ x2p, y2p ] = this._2p(index);
      const p2vX = this.gridCanvas.p2vX, p2vY = this.gridCanvas.p2vY;
      return [ p2vX(x2p(x)), p2vY(y2p(y)) ];
    }
  }

  /** Draw a point with the given project coordinate
   * @param { CanvasRenderingContext2D } ctx
   * @param { number } px Project x @param { number } py Project y
   * @param { string } style */
  drawProjectPoint(ctx, px, py, style) {
    const vx = this.gridCanvas.p2vX(px), vy = this.gridCanvas.p2vY(py);
    const savedCtx = { fillStyle: ctx.fillStyle, lineWidth: ctx.lineWidth,
      strokeStyle: ctx.strokeStyle };
    // TODO: The style is to-be-implemented
    ctx.fillStyle = '#EE2222';
    ctx.beginPath();
    ctx.arc(vx, vy, this.gridCanvas.resolution * 4, 0, 2*Math.PI);
    ctx.fill()
    Object.assign(ctx, savedCtx);
  }

  /** Draw a single glyph
   * @param { CanvasRenderingContext2D } ctx 
   * @param { number } index */
  drawGlyph(ctx, index) {
    const glyph = this.glyphs[index];
    const vxy = this._2v(index);

    ctx.beginPath();
    glyph.forEach(contour => {
      ctx.moveTo(...vxy(contour[0]));
      let i = 0;
      while (i < contour.length - 1) {
        if (!contour[i].on) throw Error(`Invalid cubic curve: ${contour}`);
        if (!contour[i+1].on) {
          const end_pt = i+3 < contour.length ? contour[i+3] : contour[0];
          ctx.bezierCurveTo(...vxy(contour[i+1]), 
            ...vxy(contour[i+2]), ...vxy(end_pt));
          i+=3;
        } else {
          const end_pt = i+1 < contour.length ? contour[i+1] : contour[0];
          ctx.lineTo(...vxy(end_pt));
          i++;
        }
      }
    });
    ctx.closePath();
    ctx.fill();
  }

  /** Draw the highlighted points 
   * @param { CanvasRenderingContext2D } ctx */
  drawHighlights(ctx) {
    this._highlights.forEach(giCiPi => {
      const [ gi, ci, pi ] = giCiPi;
      if (gi in this._glyphs && ci in this._glyphs[gi] 
        && pi in this._glyphs[gi][ci]) {
          const pt = this._glyphs[gi][ci][pi];
          const [ x2p, y2p ] = this._2p(gi);
          this.drawProjectPoint(ctx, x2p(pt.x), y2p(pt.y), 'highlight');
        }
    });
  }

  /** Redraw upper layer callback
   * @param { CanvasRenderingContext2D } ctx */
  redrawUpper = (ctx) => {
    ctx.clearRect(0, 0, 
      this.gridCanvas.upperLayer.width, this.gridCanvas.upperLayer.height);
    for (let i in this._glyphs) this.drawGlyph(ctx, i);
    this.drawHighlights(ctx);
  }
}

module.exports = GlyphPreviewPanel;
