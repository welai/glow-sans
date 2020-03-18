/** Full name of the language
 * @param { string } langStr 
 * @returns { string } */

/** Get the `CFF` table
 * @param { 'J'|'K'|'SC'|'TC' } langStr Language string
 * @param { string } widthStr       Font width string
 * @param { string } weightStr      Font weight string
 * @param { string } verStr         Version string 
 * @param { number } widthFactor    Width factor */
function getTable(langStr, widthStr, weightStr, verStr, widthFactor) {
  // const fullLangStr = languageFullName(langStr);
  const fd = `GlowSans${langStr}${weightStr}`;
  const cff_ = {
    isCID: true,
    version: verStr,
    copyright: 'Glow Sans (c) 2020 Project Welai. Source Han Sans (c) 2014-2019 Adobe (http://www.adobe.com/). Fira Sans (c) 2012-2018 Mozilla & bBox Type. Raleway (c) 2012 The Raleway Authors.',
    fontName: `GlowSans${langStr}${widthStr}-${weightStr}`,
    fullName: `Glow Sans ${langStr} ${widthStr} ${weightStr}`,
    familyName: `GlowSans${langStr}`,
    weight: `${weightStr}`,
    cidRegistry: 'Adobe',
    cidOrdering: 'Identity',
    cidSupplement: 'Identity',
    fdArray: {
      [fd]: { privates: {
        defaultWidthX: Math.round(1000 * widthFactor),
        nominalWidthX: Math.round(853 * widthFactor)
      }}
    }
  };
  return cff_;
}

module.exports = getTable;