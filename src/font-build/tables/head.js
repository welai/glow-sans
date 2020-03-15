/** Get the `head` table
 * @param { string } verStr Font version string */
function getTable(verStr, isBold) { 
    return {
        "version": 1.0,
        "fontRevision": parseFloat(verStr),
        "flags": {
            "baselineAtY_0": true,
            "lsbAtX_0": true
        },
        "unitsPerEm": 1000,
        "macStyle": { bold: isBold },
        "lowestRecPPEM": 3,
        // "fontDirectoryHint": 2,
        "indexToLocFormat": 0,
        "glyphDataFormat": 0
    };
}

module.exports = getTable;