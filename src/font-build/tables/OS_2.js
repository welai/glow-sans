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
      // "Number_Forms": true,
      "Enclosed_Alphanumerics": true, // done
      // "Box_Drawing": true,
      // "Block_Elements": true,
      "Geometric_Shapes": true, // done
      "CJK_Symbols_And_Punctuation": true, // done
      "Hiragana": true, // done
      "Katakana": true, // done
      "Bopomofo": true, // done
      // "Hangul_Compatibility_Jamo": true,
      // "Enclosed_CJK_Letters_And_Months": true,
      "CJK_Compatibility": true,
      // "Hangul_Syllables": true,
      "Non_Plane_0": true, // done
      "CJK_Unified_Ideographs": true, // done
      "CJK_Strokes": true // done
    },
    "ulUnicodeRange3": {
      "Vertical_Forms_and_CJK_Compatibility_Forms": true, // done
      // "Small_Form_Variants": true,
      "Halfwidth_And_Fullwidth_Forms": true // done
    },
    "ulUnicodeRange4": {},
    "fsSelection": { "bold": weightClass === 700 },
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