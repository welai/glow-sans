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

module.exports = function () {
  const name = [
    record(copyrightNotice,   "© 2014-2019 Adobe (http://www.adobe.com/), with Reserved Font Name 'Source'."),
    record(familyName,        'Source Han Sans SC Normal'),
    record(subfamilyName,     'Regular'),
    record(identifier,        '2.001;ADBO;SourceHanSansSC-Normal;ADOBE'),
    record(fullName,          'Source Han Sans SC Normal'),
    record(versionStr,        'Version 2.001;hotconv 1.0.107;makeotfexe 2.5.65593'),
    record(psName,            'SourceHanSansSC-Normal'),
    record(trademark,         'Source is a trademark of Adobe in the United States and/or other countries.'),
    record(manufacturer,      'Adobe'),
    record(designer,          'Ryoko NISHIZUKA 西塚涼子 (kana, bopomofo & ideographs); Paul D. Hunt (Latin, Greek & Cyrillic); Sandoll Communications 산돌커뮤니케이션, Soo-young JANG 장수영 & Joo-yeon KANG 강주연 (hangul elements, letters & syllables)'),
    record(description,       'Dr. Ken Lunde (project architect, glyph set definition & overall production); Masataka HATTORI 服部正貴 (production & ideograph elements)'),
    record(urlVendor,         'http://www.adobe.com/type/'),
    record(urlDesigner,       'http://www.adobe.com/type/'),
    record(licenseDesc,       'This Font Software is licensed under the SIL Open Font License, Version 1.1. This Font Software is distributed on an \"AS IS\" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the SIL Open Font License for the specific language, permissions and limitations governing your use of this Font Software.'),
    record(urlLicense,        'http://scripts.sil.org/OFL'),
    record(typoFamilyName,    'Source Han Sans SC'),
    record(typoSubfamilyName, 'Normal'),
    record(sampleText,        'Sample text.')
  ];
  [ zh_CN, zh_SG ].forEach((lang) => name.push(
    record(familyName,        '思源黑体 Normal', lang),
    record(subfamilyName,     'Regular', lang),
    record(fullName,          '思源黑体 Normal', lang),
    record(typoFamilyName,    '思源黑体', lang),
    record(typoSubfamilyName, 'Normal', lang)
  ));
  // [ zh_HK, zh_MO, zh_TW ].forEach((lang) => { name.push(
  //   record(familyName,        '思源黑体 Normal', lang),
  //   record(subfamilyName,     'Regular', lang),
  //   record(fullName,          '思源黑体 Normal', lang),
  //   record(typoFamilyName,    '思源黑体', lang),
  //   record(typoSubfamilyName, 'Normal', lang)
  // ); });
  // [ jp ].forEach((lang) => { name.push(
  //   record(familyName,        '思源黑体 Normal', lang),
  //   record(subfamilyName,     'Regular', lang),
  //   record(fullName,          '思源黑体 Normal', lang),
  //   record(typoFamilyName,    '思源黑体', lang),
  //   record(typoSubfamilyName, 'Normal', lang)
  // ); });
  return name;
}