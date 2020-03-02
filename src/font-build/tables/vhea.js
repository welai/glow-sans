/** Get the `vhea` table */
function getTable() { 
  return {
    "version": 1.0,
    "ascent": 500,
    "descent": -500,
    "lineGap": 0,
    "caretSlopeRise": 0,
    "caretSlopeRun": 1,
    "caretOffset": 0
  };
}

module.exports = getTable;