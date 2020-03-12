const { getParam } = require('./res/params');
const { firaFont, ralewayFont, 
  index2FiraName, index2RalewayName } = require('./res/glyph-data');

// Parameters
const param = getParam('regular-test');
// Font configuration
const lang = 'SC';
const buildWeight = 'Regular';
const buildWidth = 'Normal';
const buildVersion = '0.5';
const weightClass = 400;
const widthClass = 5;

// Get Latin font resource
const latinFont = param.fira !== undefined ?
    firaFont(...index2FiraName(param.fira))
  : ralewayFont(index2RalewayName(param.raleway));

// BASE table
const BASE = require('./tables/BASE')(
  param.baseline, 908 * param.width, 908, param.width * 1000);
// GDEF table
const GDEF = require('./tables/GDEF')();
// head table
const head = require('./tables/head')(buildVersion);
// hhea table
const hhea = require('./tables/hhea')();
// name table
const name = require('./tables/name')(
  lang, buildWeight, buildWidth, buildVersion);
// OS_2 table
const xHeight = Math.round(latinFont.OS_2.sxHeight * param.latinscale);
const capHeight = Math.round(latinFont.OS_2.sCapHeight * param.latinscale);
const OS_2 = require('./tables/OS_2')(
  weightClass, widthClass, xHeight, capHeight);
// post table
const post = require('./tables/post')();
// vhea table
const vhea = require('./tables/vhea')(param.width);


