/** Get the `vhea` table
 * @param { number } widthFactor */
function getTable(widthFactor) { 
  return {
    "version": 1.0,
    "ascent": Math.round(500 * widthFactor),
    "descent": Math.round(-500 * widthFactor),
    "lineGap": 0,
    "caretSlopeRise": 0,
    "caretSlopeRun": 1,
    "caretOffset": 0
  };
}

module.exports = getTable;