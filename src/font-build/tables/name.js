const zh_CN = 0x0804, zh_HK = 0x0C04, zh_MO = 0x1404,
  zh_SG = 0x1004, zh_TW = 0x0404, jp = 0x0411;

const copyrightNotice   = 0,  familyName        = 1,
      subfamilyName     = 2,  identifier        = 3,
      fullName          = 4,  versionStr        = 5,
      psName            = 6,  trademark         = 7,
      manufacturer      = 8,  designer          = 9,
      description       = 10, urlVendor         = 11,
      urlDesigner       = 12, licenseDesc       = 13,
      urlLicense        = 14, 
      typoFamilyName    = 16, typoSubfamilyName = 17,
                              sampleText        = 19;

function record(nameID, nameString, languageID) { return ({
  "platformID": 3,
  "encodingID": 1,
  "languageID": languageID || 0x0409,
  "nameID": nameID,
  "nameString": nameString
}); }

/** Get the `name` table
 * @param { 'SC'|'TC'|'J' } langStr Language string
 * @param { string } weightStr      Font weight string
 * @param { string } widthStr       Font width string
 * @param { string } verStr         Font version string */
function getTable (langStr, weightStr, widthStr, verStr) {
  const name = [
    record(copyrightNotice,   'Glow Sans © 2020 Project Welai'),
    record(familyName,        `Glow Sans ${langStr} ${widthStr}`),
    record(subfamilyName,     weightStr),
    record(identifier,        `${verStr};WELA;GlowSans$${langStr}-${widthStr}-${weightStr}`),
    record(fullName,          `Glow Sans ${langStr} ${widthStr} ${weightStr}`),
    record(versionStr,        `Version ${verStr}`),
    record(psName,            `GlowSans${langStr}-${widthStr}-${weightStr}`),
    record(designer,          'Ryoko NISHIZUKA 西塚涼子 (kana, bopomofo & ideographs); Paul D. Hunt (Latin, Greek & Cyrillic); Sandoll Communications 산돌커뮤니케이션, Soo-young JANG 장수영 & Joo-yeon KANG 강주연 (hangul elements, letters & syllables); Glow Sans is built by Celestial Phineas.'),
    record(description,       'Source Han Sans is built by Dr. Ken Lunde (project architect, glyph set definition & overall production); Masataka HATTORI 服部正貴 (production & ideograph elements)'),
    record(urlVendor,         'https://github.com/welai'),
    record(urlDesigner,       'https://github.com/celestialphineas'),
    record(licenseDesc,       'This Font Software is licensed under the SIL Open Font License, Version 1.1. This Font Software is distributed on an \"AS IS\" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the SIL Open Font License for the specific language, permissions and limitations governing your use of this Font Software.'),
    record(urlLicense,        'http://scripts.sil.org/OFL'),
    record(typoFamilyName,    `Glow Sans ${langStr}`),
    record(typoSubfamilyName, `${widthStr} ${weightStr}`),
    record(sampleText,        '青青子衿，悠悠我心。縱我不往，子寧不嗣音？')
  ];
  switch (langStr) {
    case 'SC': [ zh_CN ].forEach((lang) => name.push(
      record(familyName,        `未来荧黑 ${widthStr}`, lang),
      record(subfamilyName,     `${weightStr}`, lang),
      record(fullName,          `未来荧黑 ${widthStr} ${weightStr}`, lang),
      record(typoFamilyName,    `未来荧黑`, lang),
      record(typoSubfamilyName, `${widthStr} ${weightStr}`, lang)
    )); break;
    case 'TC': [ zh_TW ].forEach((lang) => name.push(
      record(familyName,        `未来熒黑${widthStr}`, lang),
      record(subfamilyName,     `${weightStr}`, lang),
      record(fullName,          `未来熒黑 ${widthStr} ${weightStr}`, lang),
      record(typoFamilyName,    `未来熒黑`, lang),
      record(typoSubfamilyName, `${widthStr} ${weightStr}`, lang)
    )); break;
    case 'J': [ jp ].forEach((lang) => name.push(
      record(familyName,        `ヒカリ角ゴ ${widthStr}`, lang),
      record(subfamilyName,     `${weightStr}`, lang),
      record(fullName,          `ヒカリ角ゴ ${widthStr} ${weightStr}`, lang),
      record(typoFamilyName,    `ヒカリ角ゴ`, lang),
      record(typoSubfamilyName, `${widthStr} ${weightStr}`, lang)
    )); break;
    default: throw Error(`Unimplemented language for ${langStr}`);
  }
  return name;
}

module.exports = getTable;