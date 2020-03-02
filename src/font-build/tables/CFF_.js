/** Full name of the language
 * @param { string } langStr 
 * @returns { string } */
function languageFullName(langStr) {
  switch (langStr) {
    case 'SC': return 'Simplified Chinese';
    case 'TC': return 'Traditional Chinese';
    case 'J': return 'Japanese';
    default: throw Error(`Unimplemented language for ${langStr}`);
  }
}

/** Get the `CFF` table
 * @param { 'SC'|'TC'|'J' } langStr Language string
 * @param { string } weightStr      Font weight string
 * @param { string } widthStr       Font width string */
function getTable(langStr, weightStr, widthStr) {
  // const fullLangStr = languageFullName(langStr);
  const cff_ = {
    "isCID": true,
    "fontName": `GlowSans${langStr}-${widthStr}${weightStr}`
  };
  return cff_;
}

module.exports = getTable;