const gridcanvas = require('gridcanvas');

/** @type { typeof gridcanvas.default } */
const GridCanvas = window.GridCanvas;

class GlyphPreviewPanel {
  constructor(elementID, { width = 1000, height = 800,
  margin = 20, fontSize = 100 } = {}) {
    this.gridCanvas = new GridCanvas(elementID, 
      { bound: { minX: -margin, maxX: width + margin, 
        minY: -height - margin, maxY: margin } });
  }
}

module.exports = GlyphPreviewPanel;
