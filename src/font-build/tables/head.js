/** Get the `head` table
 * @param { string } verStr Font version string */
function getTable(verStr, width, weight) { 
  return {
    "version": 1.0,
    "fontRevision": parseFloat(verStr),
    "flags": {
        "baselineAtY_0": true,
        "lsbAtX_0": true
    },
    "unitsPerEm": 1000,
    "created": 3604521600,
    "macStyle": { 
        bold: weight === 'Bold',
        condensed: width === 'Condensed',
        extended: width === 'Extended'
    },
    "lowestRecPPEM": 3,
    // "fontDirectoryHint": 2,
    "indexToLocFormat": 0,
    "glyphDataFormat": 0
  };
}

module.exports = getTable;