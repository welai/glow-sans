// Managing glyph resources
/** @typedef { { 
  * onRefs: [number, number][], 
  * onOffsets: [number, number][], offOffsets: [number, number][], 
  * offOnIndices: number[], onContourIndices: number[], 
  * xAlign: string[][], yAlign: string[][] } } GlyphModel */
/** @typedef { { x: number, y: number, on: boolean } } ControlPoint */
/** @typedef { ControlPoint[] } Contour */
/** @typedef { Contour[] } GlyphData */
const fs = require('fs');
const path = require('path');
const { readJSON, expandPath } = require('./read-res');

/** Return a list of available Han models
 * @param { 'J' | 'K' | 'SC' } lang Language tag
 * @param { 'ExtraLight' | 'Light' | 'Normal' | 'Regular' | 'Medium' | 'Bold' 
 * | 'Heavy' } weight Model weight
 * @returns { string[] } Paths of model files relative to the project root */
function listHanModelPaths(lang, weight) {
  const pathInProject = 
    `build-files/models/shs-${lang.toLowerCase()}/${weight}`;
  const fullPath = expandPath(pathInProject);
  if (!fs.readdirSync(fullPath))
    throw Error(`Han models directory ${pathInProject} is not found.`);
  const result = fs.readdirSync(fullPath)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(pathInProject, f));
  return result;
}

/** Get the models of a given relative path
 * @param { string } path Path of the model
 * @returns { { [ gid: string ]: GlyphModel } } */
function readModels(path) {
  return readJSON(path);
}

/** Get the kana-like models of certain weight
 * @param { 'ExtraLight' | 'Light' | 'Normal' | 'Regular' | 'Medium' | 'Bold' 
 * | 'Heavy' } weight Model weight
 * @returns { { [ gid: string ]: GlyphModel } } Glyph models */
function kanaLikeModels(weight) {
  const pathInProject = `build-files/models/kana-like/${weight}.json`;
  const fullPath = expandPath(pathInProject);
  if (!fs.existsSync(fullPath)) 
    throw Error(`Kana-like models ${pathInProject} is not found.`);
  return readJSON(pathInProject);
}

/** The path to the extracted glyphs of a certain gid category and weight
 * @param { 'base-scale' | 'center-scale' | 'lengthen' | 'punc-like' } category 
 * Gid category
 * @param { 'J' | 'K' | 'SC' } lang    Language tag
 * @param { 'ExtraLight' | 'Light' | 'Normal' | 'Regular' | 'Medium' | 'Bold' 
 * | 'Heavy' } weight  Weight
 * @returns { { [key:string] { advanceWidth: number, contours: GlyphData }} } 
 * Path of the extracted glyphs */
function extractedGlyphs(category, lang, weight) {
  const pathInProject = 
    `build-files/extracted/${category}-${lang.toLowerCase()}/${weight}.json`;
  const fullPath = expandPath(pathInProject);
  if (!fs.existsSync(fullPath))
    throw Error(`Extracted glyphs ${pathInProject} are not found.`);
  return readJSON(pathInProject);
}

/** Get the Fira Sans font data
 * @param { 'Normal' | 'Compressed' | 'Condensed' } width Specified width
 * @param { 'Two' | 'Four' | 'Eight' | 'Hair' | 'Thin' | 'UltraLight' 
 * | 'ExtraLight' | 'Light' | 'Book' | 'Regular' | 'Medium' | 'SemiBold' 
 * | 'Bold' | 'ExtraBold' | 'Heavy' } weight Specified weight */
function firaFont(width, weight) {
  const pathInProject = 
  `fonts/Fira/FiraSans${width === 'Normal' ? '' : width}-${weight}.json`;
  const fullPath = expandPath(pathInProject);
  if (!fs.existsSync(fullPath))
    throw Error(`Dumped Fira ${pathInProject} is not found.`);
  return readJSON(pathInProject);
}

/** Get the Raleway font data
 * @param { 'Thin' | 'ExtraLight' | 'Light' | 'Regular' | 'Medium'
 * | 'SemiBold' | 'Bold' | 'Black' } weight Specified weight */
function ralewayFont(weight) {
  const pathInProject = `fonts/Raleway/Raleway-v4020-${weight}.json`;
  const fullPath = expandPath(pathInProject);
  if (!fs.existsSync(fullPath))
    throw Error(`Dumped Raleway ${pathInProject} is not found.`);
  return readJSON(pathInProject);
}

/** Get Source Han Sans font data
 * @param { 'K' | 'J' | 'SC' } lang 
 * @param { 'ExtraLight' | 'Light' | 'Normal' | 'Regular' | 'Medium'
 * | 'Bold' | 'Heavy' } weight Specified weight */
function shsFont(lang, weight) {
  const pathInProject = 
    `fonts/SourceHanSans${lang}/SourceHanSans${lang === 'J' ? '' : lang}-${weight}.json`;
  const fullPath = expandPath(pathInProject);
  if (!fs.existsSync(fullPath))
    throw Error(`Dumped Source Han Sans ${pathInProject} is not found.`);
  return shsFont(pathInProject);
}

/** Convert the parameter index number to Fira width and weight
 * @param { number } firaval
 * @returns { [ string, string ] } */
function index2FiraName(firaval) {
  const weightIndex = Math.floor(firaval/3);
  const widthIndex = firaval%3;
  const firaWeights = [ 'Two', 'Four', 'Eight', 'Hair', 'Thin', 'UltraLight',
  'ExtraLight', 'Light', 'Book', 'Regular', 'Medium', 'SemiBold', 'Bold',
  'ExtraBold', 'Heavy' ];
  const firaWidths = [ 'Normal', 'Condensed', 'Compressed' ];
  return [ firaWidths[widthIndex], firaWeights[weightIndex] ];
}

/** Convert the parameter index number to Raleway weight
 * @param { number } ralewayval
 * @returns { string } */
function index2RalewayName(ralewayval) {
  return [ 'Thin', 'ExtraLight', 'Light', 'Regular', 'Medium',
  'SemiBold', 'Bold', 'ExtraBold', 'Black' ][ralewayval];
}

module.exports = {
  listHanModelPaths, readModels, kanaLikeModels, extractedGlyphs,
  firaFont, ralewayFont, shsFont, index2FiraName, index2RalewayName
}