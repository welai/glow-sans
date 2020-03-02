
/** Get the `BASE` table
 * @param { number } latinBase Baseline height of the Latin script
 * @param { number } icfWidth Ideographic character face width in units
 * @param { number } icfHeight Ideographic character face height in units
 * @param { number } width Han glyph width in units
 * Average character face of Source Han Sans is, 908x908 */
function getTable(latinBase, icfWidth, icfHeight, width) {
  const hICFB = Math.round((1000 - icfHeight)/2 - latinBase);
  const hICFT = Math.round((1000 + icfHeight)/2 - latinBase);
  const vICFB = Math.round((width - icfWidth)/2);
  const vICFT = Math.round((width + icfWidth)/2);
  const hBase = { "icfb": hICFB, "icft": hICFT, 
    "ideo": -Math.round(latinBase), "romn": 0 };
  const vBase = { "icfb": vICFB, "icft": vICFT, 
    "ideo": 0, "romn": latinBase/1000*width };
  return {
    "horizontal": {
      "DFLT": { "defaultBaseline": "ideo", "baselines": hBase },
      "cyrl": { "defaultBaseline": "romn", "baselines": hBase },
      "grek": { "defaultBaseline": "romn", "baselines": hBase },
      "hang": { "defaultBaseline": "ideo", "baselines": hBase },
      "hani": { "defaultBaseline": "ideo", "baselines": hBase },
      "kana": { "defaultBaseline": "ideo", "baselines": hBase },
      "latn": { "defaultBaseline": "romn", "baselines": hBase }
    },
    "vertical": {
      "DFLT": { "defaultBaseline": "ideo", "baselines": vBase },
      "cyrl": { "defaultBaseline": "romn", "baselines": vBase },
      "grek": { "defaultBaseline": "romn", "baselines": vBase },
      "hang": { "defaultBaseline": "ideo", "baselines": vBase },
      "hani": { "defaultBaseline": "ideo", "baselines": vBase },
      "kana": { "defaultBaseline": "ideo", "baselines": vBase },
      "latn": { "defaultBaseline": "romn", "baselines": vBase }
    }
  };
}

module.exports = getTable;