const codeRanges = {
  "Basic Latin": [0x0000, 0x007F],
  "Latin-1 Supplement": [0x0080, 0x00FF],
  "Latin Extended-A": [0x0100, 0x017F],
  "Latin Extended-B": [0x0180, 0x024F],
  "IPA Extensions": [0x0250, 0x02AF],
  "Spacing Modifier Letters": [0x02B0, 0x02FF],
  "Combining Diacritical Marks": [0x0300, 0x036F],
  "Greek and Coptic": [0x0370, 0x03FF],
  "Cyrillic": [0x0400, 0x04FF],
  "Cyrillic Supplement": [0x0500, 0x052F],
  "Armenian": [0x0530, 0x058F],
  "Hebrew": [0x0590, 0x05FF],
  "Arabic": [0x0600, 0x06FF],
  "Syriac": [0x0700, 0x074F],
  "Arabic Supplement": [0x0750, 0x077F],
  "Thaana": [0x0780, 0x07BF],
  "NKo": [0x07C0, 0x07FF],
  "Samaritan": [0x0800, 0x083F],
  "Mandaic": [0x0840, 0x085F],
  "Arabic Extended-A": [0x08A0, 0x08FF],
  "Devanagari": [0x0900, 0x097F],
  "Bengali": [0x0980, 0x09FF],
  "Gurmukhi": [0x0A00, 0x0A7F],
  "Gujarati": [0x0A80, 0x0AFF],
  "Oriya": [0x0B00, 0x0B7F],
  "Tamil": [0x0B80, 0x0BFF],
  "Telugu": [0x0C00, 0x0C7F],
  "Kannada": [0x0C80, 0x0CFF],
  "Malayalam": [0x0D00, 0x0D7F],
  "Sinhala": [0x0D80, 0x0DFF],
  "Thai": [0x0E00, 0x0E7F],
  "Lao": [0x0E80, 0x0EFF],
  "Tibetan": [0x0F00, 0x0FFF],
  "Myanmar": [0x1000, 0x109F],
  "Georgian": [0x10A0, 0x10FF],
  "Hangul Jamo": [0x1100, 0x11FF],
  "Ethiopic": [0x1200, 0x137F],
  "Ethiopic Supplement": [0x1380, 0x139F],
  "Cherokee": [0x13A0, 0x13FF],
  "Unified Canadian Aboriginal Syllabics": [0x1400, 0x167F],
  "Ogham": [0x1680, 0x169F],
  "Runic": [0x16A0, 0x16FF],
  "Tagalog": [0x1700, 0x171F],
  "Hanunoo": [0x1720, 0x173F],
  "Buhid": [0x1740, 0x175F],
  "Tagbanwa": [0x1760, 0x177F],
  "Khmer": [0x1780, 0x17FF],
  "Mongolian": [0x1800, 0x18AF],
  "Unified Canadian Aboriginal Syllabics Extended": [0x18B0, 0x18FF],
  "Limbu": [0x1900, 0x194F],
  "Tai Le": [0x1950, 0x197F],
  "New Tai Lue": [0x1980, 0x19DF],
  "Khmer Symbols": [0x19E0, 0x19FF],
  "Buginese": [0x1A00, 0x1A1F],
  "Tai Tham": [0x1A20, 0x1AAF],
  "Combining Diacritical Marks Extended": [0x1AB0, 0x1AFF],
  "Balinese": [0x1B00, 0x1B7F],
  "Sundanese": [0x1B80, 0x1BBF],
  "Batak": [0x1BC0, 0x1BFF],
  "Lepcha": [0x1C00, 0x1C4F],
  "Ol Chiki": [0x1C50, 0x1C7F],
  "Sundanese Supplement": [0x1CC0, 0x1CCF],
  "Vedic Extensions": [0x1CD0, 0x1CFF],
  "Phonetic Extensions": [0x1D00, 0x1D7F],
  "Phonetic Extensions Supplement": [0x1D80, 0x1DBF],
  "Combining Diacritical Marks Supplement": [0x1DC0, 0x1DFF],
  "Latin Extended Additional": [0x1E00, 0x1EFF],
  "Greek Extended": [0x1F00, 0x1FFF],
  "General Punctuation": [0x2000, 0x206F],
  "Superscripts and Subscripts": [0x2070, 0x209F],
  "Currency Symbols": [0x20A0, 0x20CF],
  "Combining Diacritical Marks for Symbols": [0x20D0, 0x20FF],
  "Letterlike Symbols": [0x2100, 0x214F],
  "Number Forms": [0x2150, 0x218F],
  "Arrows": [0x2190, 0x21FF],
  "Mathematical Operators": [0x2200, 0x22FF],
  "Miscellaneous Technical": [0x2300, 0x23FF],
  "Control Pictures": [0x2400, 0x243F],
  "Optical Character Recognition": [0x2440, 0x245F],
  "Enclosed Alphanumerics": [0x2460, 0x24FF],
  "Box Drawing": [0x2500, 0x257F],
  "Block Elements": [0x2580, 0x259F],
  "Geometric Shapes": [0x25A0, 0x25FF],
  "Miscellaneous Symbols": [0x2600, 0x26FF],
  "Dingbats": [0x2700, 0x27BF],
  "Miscellaneous Mathematical Symbols-A": [0x27C0, 0x27EF],
  "Supplemental Arrows-A": [0x27F0, 0x27FF],
  "Braille Patterns": [0x2800, 0x28FF],
  "Supplemental Arrows-B": [0x2900, 0x297F],
  "Miscellaneous Mathematical Symbols-B": [0x2980, 0x29FF],
  "Supplemental Mathematical Operators": [0x2A00, 0x2AFF],
  "Miscellaneous Symbols and Arrows": [0x2B00, 0x2BFF],
  "Glagolitic": [0x2C00, 0x2C5F],
  "Latin Extended-C": [0x2C60, 0x2C7F],
  "Coptic": [0x2C80, 0x2CFF],
  "Georgian Supplement": [0x2D00, 0x2D2F],
  "Tifinagh": [0x2D30, 0x2D7F],
  "Ethiopic Extended": [0x2D80, 0x2DDF],
  "Cyrillic Extended-A": [0x2DE0, 0x2DFF],
  "Supplemental Punctuation": [0x2E00, 0x2E7F],
  "CJK Radicals Supplement": [0x2E80, 0x2EFF],
  "Kangxi Radicals": [0x2F00, 0x2FDF],
  "Ideographic Description Characters": [0x2FF0, 0x2FFF],
  "CJK Symbols and Punctuation": [0x3000, 0x303F],
  "Hiragana": [0x3040, 0x309F],
  "Katakana": [0x30A0, 0x30FF],
  "Bopomofo": [0x3100, 0x312F],
  "Hangul Compatibility Jamo": [0x3130, 0x318F],
  "Kanbun": [0x3190, 0x319F],
  "Bopomofo Extended": [0x31A0, 0x31BF],
  "CJK Strokes": [0x31C0, 0x31EF],
  "Katakana Phonetic Extensions": [0x31F0, 0x31FF],
  "Enclosed CJK Letters and Months": [0x3200, 0x32FF],
  "CJK Compatibility": [0x3300, 0x33FF],
  "CJK Unified Ideographs Extension A": [0x3400, 0x4DBF],
  "Yijing Hexagram Symbols": [0x4DC0, 0x4DFF],
  "CJK Unified Ideographs": [0x4E00, 0x9FFF],
  "Yi Syllables": [0xA000, 0xA48F],
  "Yi Radicals": [0xA490, 0xA4CF],
  "Lisu": [0xA4D0, 0xA4FF],
  "Vai": [0xA500, 0xA63F],
  "Cyrillic Extended-B": [0xA640, 0xA69F],
  "Bamum": [0xA6A0, 0xA6FF],
  "Modifier Tone Letters": [0xA700, 0xA71F],
  "Latin Extended-D": [0xA720, 0xA7FF],
  "Syloti Nagri": [0xA800, 0xA82F],
  "Common Indic Number Forms": [0xA830, 0xA83F],
  "Phags-pa": [0xA840, 0xA87F],
  "Saurashtra": [0xA880, 0xA8DF],
  "Devanagari Extended": [0xA8E0, 0xA8FF],
  "Kayah Li": [0xA900, 0xA92F],
  "Rejang": [0xA930, 0xA95F],
  "Hangul Jamo Extended-A": [0xA960, 0xA97F],
  "Javanese": [0xA980, 0xA9DF],
  "Myanmar Extended-B": [0xA9E0, 0xA9FF],
  "Cham": [0xAA00, 0xAA5F],
  "Myanmar Extended-A": [0xAA60, 0xAA7F],
  "Tai Viet": [0xAA80, 0xAADF],
  "Meetei Mayek Extensions": [0xAAE0, 0xAAFF],
  "Ethiopic Extended-A": [0xAB00, 0xAB2F],
  "Latin Extended-E": [0xAB30, 0xAB6F],
  "Cherokee Supplement": [0xAB70, 0xABBF],
  "Meetei Mayek": [0xABC0, 0xABFF],
  "Hangul Syllables": [0xAC00, 0xD7AF],
  "Hangul Jamo Extended-B": [0xD7B0, 0xD7FF],
  "High Surrogates": [0xD800, 0xDB7F],
  "High Private Use Surrogates": [0xDB80, 0xDBFF],
  "Low Surrogates": [0xDC00, 0xDFFF],
  "Private Use Area": [0xE000, 0xF8FF],
  "CJK Compatibility Ideographs": [0xF900, 0xFAFF],
  "Alphabetic Presentation Forms": [0xFB00, 0xFB4F],
  "Arabic Presentation Forms-A": [0xFB50, 0xFDFF],
  "Variation Selectors": [0xFE00, 0xFE0F],
  "Vertical Forms": [0xFE10, 0xFE1F],
  "Combining Half Marks": [0xFE20, 0xFE2F],
  "CJK Compatibility Forms": [0xFE30, 0xFE4F],
  "Small Form Variants": [0xFE50, 0xFE6F],
  "Arabic Presentation Forms-B": [0xFE70, 0xFEFF],
  "Halfwidth and Fullwidth Forms": [0xFF00, 0xFFEF],
  "Specials": [0xFFF0, 0xFFFF],
  "Linear B Syllabary": [0x10000, 0x1007F],
  "Linear B Ideograms": [0x10080, 0x100FF],
  "Aegean Numbers": [0x10100, 0x1013F],
  "Ancient Greek Numbers": [0x10140, 0x1018F],
  "Ancient Symbols": [0x10190, 0x101CF],
  "Phaistos Disc": [0x101D0, 0x101FF],
  "Lycian": [0x10280, 0x1029F],
  "Carian": [0x102A0, 0x102DF],
  "Coptic Epact Numbers": [0x102E0, 0x102FF],
  "Old Italic": [0x10300, 0x1032F],
  "Gothic": [0x10330, 0x1034F],
  "Old Permic": [0x10350, 0x1037F],
  "Ugaritic": [0x10380, 0x1039F],
  "Old Persian": [0x103A0, 0x103DF],
  "Deseret": [0x10400, 0x1044F],
  "Shavian": [0x10450, 0x1047F],
  "Osmanya": [0x10480, 0x104AF],
  "Elbasan": [0x10500, 0x1052F],
  "Caucasian Albanian": [0x10530, 0x1056F],
  "Linear A": [0x10600, 0x1077F],
  "Cypriot Syllabary": [0x10800, 0x1083F],
  "Imperial Aramaic": [0x10840, 0x1085F],
  "Palmyrene": [0x10860, 0x1087F],
  "Nabataean": [0x10880, 0x108AF],
  "Hatran": [0x108E0, 0x108FF],
  "Phoenician": [0x10900, 0x1091F],
  "Lydian": [0x10920, 0x1093F],
  "Meroitic Hieroglyphs": [0x10980, 0x1099F],
  "Meroitic Cursive": [0x109A0, 0x109FF],
  "Kharoshthi": [0x10A00, 0x10A5F],
  "Old South Arabian": [0x10A60, 0x10A7F],
  "Old North Arabian": [0x10A80, 0x10A9F],
  "Manichaean": [0x10AC0, 0x10AFF],
  "Avestan": [0x10B00, 0x10B3F],
  "Inscriptional Parthian": [0x10B40, 0x10B5F],
  "Inscriptional Pahlavi": [0x10B60, 0x10B7F],
  "Psalter Pahlavi": [0x10B80, 0x10BAF],
  "Old Turkic": [0x10C00, 0x10C4F],
  "Old Hungarian": [0x10C80, 0x10CFF],
  "Rumi Numeral Symbols": [0x10E60, 0x10E7F],
  "Brahmi": [0x11000, 0x1107F],
  "Kaithi": [0x11080, 0x110CF],
  "Sora Sompeng": [0x110D0, 0x110FF],
  "Chakma": [0x11100, 0x1114F],
  "Mahajani": [0x11150, 0x1117F],
  "Sharada": [0x11180, 0x111DF],
  "Sinhala Archaic Numbers": [0x111E0, 0x111FF],
  "Khojki": [0x11200, 0x1124F],
  "Multani": [0x11280, 0x112AF],
  "Khudawadi": [0x112B0, 0x112FF],
  "Grantha": [0x11300, 0x1137F],
  "Tirhuta": [0x11480, 0x114DF],
  "Siddham": [0x11580, 0x115FF],
  "Modi": [0x11600, 0x1165F],
  "Takri": [0x11680, 0x116CF],
  "Ahom": [0x11700, 0x1173F],
  "Warang Citi": [0x118A0, 0x118FF],
  "Pau Cin Hau": [0x11AC0, 0x11AFF],
  "Cuneiform": [0x12000, 0x123FF],
  "Cuneiform Numbers and Punctuation": [0x12400, 0x1247F],
  "Early Dynastic Cuneiform": [0x12480, 0x1254F],
  "Egyptian Hieroglyphs": [0x13000, 0x1342F],
  "Anatolian Hieroglyphs": [0x14400, 0x1467F],
  "Bamum Supplement": [0x16800, 0x16A3F],
  "Mro": [0x16A40, 0x16A6F],
  "Bassa Vah": [0x16AD0, 0x16AFF],
  "Pahawh Hmong": [0x16B00, 0x16B8F],
  "Miao": [0x16F00, 0x16F9F],
  "Kana Supplement": [0x1B000, 0x1B0FF],
  "Duployan": [0x1BC00, 0x1BC9F],
  "Shorthand Format Controls": [0x1BCA0, 0x1BCAF],
  "Byzantine Musical Symbols": [0x1D000, 0x1D0FF],
  "Musical Symbols": [0x1D100, 0x1D1FF],
  "Ancient Greek Musical Notation": [0x1D200, 0x1D24F],
  "Tai Xuan Jing Symbols": [0x1D300, 0x1D35F],
  "Counting Rod Numerals": [0x1D360, 0x1D37F],
  "Mathematical Alphanumeric Symbols": [0x1D400, 0x1D7FF],
  "Sutton SignWriting": [0x1D800, 0x1DAAF],
  "Mende Kikakui": [0x1E800, 0x1E8DF],
  "Arabic Mathematical Alphabetic Symbols": [0x1EE00, 0x1EEFF],
  "Mahjong Tiles": [0x1F000, 0x1F02F],
  "Domino Tiles": [0x1F030, 0x1F09F],
  "Playing Cards": [0x1F0A0, 0x1F0FF],
  "Enclosed Alphanumeric Supplement": [0x1F100, 0x1F1FF],
  "Enclosed Ideographic Supplement": [0x1F200, 0x1F2FF],
  "Miscellaneous Symbols and Pictographs": [0x1F300, 0x1F5FF],
  "Emoticons": [0x1F600, 0x1F64F],
  "Ornamental Dingbats": [0x1F650, 0x1F67F],
  "Transport and Map Symbols": [0x1F680, 0x1F6FF],
  "Alchemical Symbols": [0x1F700, 0x1F77F],
  "Geometric Shapes Extended": [0x1F780, 0x1F7FF],
  "Supplemental Arrows-C": [0x1F800, 0x1F8FF],
  "Supplemental Symbols and Pictographs": [0x1F900, 0x1F9FF],
  "CJK Unified Ideographs Extension B": [0x20000, 0x2A6DF],
  "CJK Unified Ideographs Extension C": [0x2A700, 0x2B73F],
  "CJK Unified Ideographs Extension D": [0x2B740, 0x2B81F],
  "CJK Unified Ideographs Extension E": [0x2B820, 0x2CEAF],
  "CJK Compatibility Ideographs Supplement": [0x2F800, 0x2FA1F],
  "Tags": [0xE0000, 0xE007F],
  "Variation Selectors Supplement": [0xE0100, 0xE01EF],
  "Supplementary Private Use Area-A": [0xF0000, 0xFFFFF],
  "Supplementary Private Use Area-B": [0x100000, 0x10FFFF]
};
Object.freeze(codeRanges);

/** Code range of a code range name
 * @param { string } name Code range name
 * @returns { [ number, number ] | undefined } */
function codeRange(name) {
  return codeRanges[name];
}

const codeRangeIndex = [];
for (const rangeName in codeRanges) {
  if ([ 'Tags', 'Variation Selectors Supplement', 
  'Supplementary Private Use Area-A', 'Supplementary Private Use Area-B' ]
  .indexOf(rangeName) >= 0) continue;
  const [lower, upper] = codeRanges[rangeName];
  const lowerIndex = Math.floor(lower/0x100);
  const upperIndex = Math.floor(upper/0x100);
  for (let i = lowerIndex; i <= upperIndex; i++) {
    if (codeRangeIndex[i] === undefined) codeRangeIndex[i] = {};
    codeRangeIndex[i][rangeName] = codeRanges[rangeName];
  }
}

/** Code range name of a unicode, return undefined if the corresponding range 
 * is undefined
 * @param { number } unicode Character code in number 
 * @returns { string | undefined } */
function codeBlockName(unicode) {
  if (unicode > 0x2FA1F) {
    if (unicode >= 0xE0000 && unicode <= 0xE007F) return 'Tags';
    if (unicode >= 0xE0100 && unicode <= 0xE01EF) return 'Variation Selectors Supplement';
    if (unicode >= 0xF0000 && unicode <= 0xFFFFF) return 'Supplementary Private Use Area-A';
    if (unicode >= 0x100000 && unicode <= 0x10FFFF) return 'Supplementary Private Use Area-B';
    return undefined;
  }
  const candidates = codeRangeIndex[Math.floor(unicode/0x100)];
  if (candidates === undefined) return undefined;
  for (const name in candidates) {
    const [ lower, upper ] = candidates[name];
    if (unicode >= lower && unicode <= upper) return name;
  }
  return undefined;
}

/** Check if the code point is in the block
 * @param { number } unicode Unicode
 * @param { ...string } blocknames Names of the code blocks
 * @returns { boolean } */
function codeInBlock(unicode, ...blocknames) {
  if (blocknames.length === 0) return false;
  const [ lower, upper ] = codeRange(blocknames[0]) || [ -1, -1 ];
  return (unicode >= lower && unicode <= upper) 
    || codeInBlock(unicode, ...blocknames.slice(1));
}

/** Check if the character code is a Han character
 * @param { number } unicode 
 * @returns { boolean } */
function isHan(unicode) {
  return  codeInBlock(unicode, 'CJK Radicals Supplement') 
      ||  codeInBlock(unicode, 'Kangxi Radicals')
      ||  codeInBlock(unicode, 'CJK Strokes')
      ||  codeInBlock(unicode, 'CJK Unified Ideographs Extension A')
      ||  codeInBlock(unicode, 'CJK Unified Ideographs')
      ||  codeInBlock(unicode, 'CJK Compatibility Ideographs')
      ||  codeInBlock(unicode, 'CJK Unified Ideographs Extension B')
      ||  codeInBlock(unicode, 'CJK Unified Ideographs Extension C')
      ||  codeInBlock(unicode, 'CJK Unified Ideographs Extension D')
      ||  codeInBlock(unicode, 'CJK Unified Ideographs Extension E');
}

/** Convert Unicode to UTF-16 encoding that JavaScript use for charcodes
 * @param { number } unicode 
 * @return { number[] } */
function toUTF16(unicode) {
  if (unicode >= 0x000000 && unicode <= 0x00ffff) return [ unicode ];
  if (unicode <= 0x10ffff) {
    const c = unicode - 0x10000;
    const high = Math.floor(c/0x400) + 0xD800;
    const low = c%0x400 + 0xDC00;
    return [ high, low ];
  }
  throw Error(`Cannot convert ${unicode} to UTF-16`);
}

/** Convert UTF16 string to Unicode
 * @param { string } str  
 * @returns { number } */
function fromUTF16String(str) {
  if (!str) return NaN;
  const high = str.charCodeAt(0);
  if (Math.floor(high/0x400) !== 0x36) return high;
  const low = str.charCodeAt(1);
  return (high - 0xD800) * 0x400 + (low - 0xDC00) + 0x10000;
}

module.exports = {
  codeBlockName,
  codeInBlock,
  codeRange,
  isHan,
  toUTF16,
  fromUTF16String
}