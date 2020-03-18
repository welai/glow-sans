/** Get the `post` table */
function getTable(baseline, hstroke) {
  const underlineThickness = hstroke * 0.8;
  return {
    "version": 3.0,
    "italicAngle": 0,
    "underlinePosition": -baseline-hstroke,
    "underlineThickness": hstroke,
    "isFixedPitch": false
  };
}

module.exports = getTable;