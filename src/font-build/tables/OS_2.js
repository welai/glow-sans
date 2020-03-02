/** Get the `OS/2` table
 * @param { number } weightClass  Weight class 
 * @param { number } widthClass   Width class */
function getTable(weightClass, widthClass, xHeight, capHeight) { 
  return {
    "version": 3,
    "usWeightClass": weightClass,
    "usWidthClass": widthClass,
    "fsType": {},
    "ySubscriptXSize": 650,
    "ySubscriptYSize": 600,
    "ySubscriptXOffset": 0,
    "ySubscriptYOffset": 75,
    "ySupscriptXSize": 650,
    "ySupscriptYSize": 600,
    "ySupscriptXOffset": 0,
    "ySupscriptYOffset": 350,
    "yStrikeoutSize": 50,
    "yStrikeoutPosition": 325,
    "sFamilyClass": 0,
    "panose": [ 2, 11, 4, 0, 0, 0, 0, 0, 0, 0 ],
    "ulUnicodeRange1": {
      "Basic_Latin": true,
      "Latin_1_Supplement": true,
      "Greek_and_Coptic": true,
      // "Hangul_Jamo": true,
      "Latin_Extended_Additional": true
    },
    "ulUnicodeRange2": {
      "Number_Forms": true,
      "Enclosed_Alphanumerics": true,
      "Box_Drawing": true,
      "Block_Elements": true,
      "Geometric_Shapes": true,
      "CJK_Symbols_And_Punctuation": true,
      "Hiragana": true,
      "Katakana": true,
      "Bopomofo": true,
      // "Hangul_Compatibility_Jamo": true,
      "Enclosed_CJK_Letters_And_Months": true,
      "CJK_Compatibility": true,
      // "Hangul_Syllables": true,
      "Non_Plane_0": true,
      "CJK_Unified_Ideographs": true,
      "CJK_Strokes": true
    },
    "ulUnicodeRange3": {
      "Vertical_Forms_and_CJK_Compatibility_Forms": true,
      "Small_Form_Variants": true,
      "Halfwidth_And_Fullwidth_Forms": true
    },
    "ulUnicodeRange4": {},
    "fsSelection": {},
    "sTypoAscender": 880,
    "sTypoDescender": -120,
    "sTypoLineGap": 0,
    "usWinAscent": 1160,
    "usWinDescent": 288,
    "ulCodePageRange1": {
      "latin1": true,
      "latin2": true,
      "cyrillic": true,
      "vietnamese": true,
      "jis": true,
      "gbk": true,
      // "korean": true,
      // "koreanJohab": true,
      "macRoman": true,
      "oem": true
    },
    "ulCodePageRange2": {},
    "sxHeight": xHeight, // 543,
    "sCapHeight": capHeight, // 733,
    "usDefaultChar": 0,
    "usBreakChar": 32,
    "usLowerOpticalPointSize": 0,
    "usUpperOpticalPointSize": 0
  };
}

module.exports = getTable;