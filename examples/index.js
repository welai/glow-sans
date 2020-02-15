const GlyphModel = require('../src/glyph-manipulate/GlyphModel');
const GlyphPreviewPanel = require('../src/utils/GlyphPreviewPanel');
const ModelFilters = require('../src/glyph-manipulate/ModelFilters');
const PostFilters = require('../src/glyph-manipulate/PostFilters');
const detectFeet = require('../src/glyph-manipulate/detect-feet');

// The parameters manipulatable by the UI elements
const globalParams = window.globalParams = {
  fontsize: 100,
  width: 1.0,
  weight: 1.0,
  contrast: 1.0,
  tracking: 1.0,
  counter: 1.0,
  gravity: 1.0,
  softness: 1.0,
  feetremoval: false,
  baseline: 100,
  latinscale: 1.0
};
/** Bind the UI to globalParams */
globalParams.bindUI = function () {
  $('.binded').each((index, elem) => {
    const param = elem.getAttribute('data-bind');
    $(elem).on('input', () => {
      if (elem.type === 'range') this[param] = Number.parseFloat(elem.value);
      if (elem.type === 'checkbox') this[param] = elem.checked;
      const event = new CustomEvent('param-change', { detail: param });
      window.dispatchEvent(event);
    });
    if (elem.type === 'range') $(elem).val(this[param]);
    if (elem.type === 'checkbox') elem.checked = globalParams.feetremoval;
  });
}

// SHSans glyph model data
/** Available weights */
const shsWeights = [ 'ExtraLight', 'Light', 'Normal', 'Regular', 
  'Medium', 'Bold', 'Heavy' ];
/** Paths of the glyph models */
const modelFilenames = shsWeights.map(
  w => `samples/SourceHanSansSC-${w}.model.json`);
/** Available Fira weights */
const firaWeights = [ 'Two', 'Four', 'Eight', 'Hair', 'Thin', 'UltraLight',
'ExtraLight', 'Light', 'Book', 'Regular', 'Medium', 'SemiBold', 'Bold',
'ExtraBold', 'Heavy' ];
/** Available Fira widths */
const firaWidths = [ 'Normal', 'Condensed', 'Compressed' ];
/** Paths of the fira samples */
const firaFilenames = [];
firaWeights.forEach(w => firaFilenames.push(
  `samples/FiraSans-${w}.json`,
  `samples/FiraSansCondensed-${w}.json`,
  `samples/FiraSansCompressed-${w}.json`
));

/** SHSans glyph models. 
 * @type { { [key: string]: GlyphModel }[] } */
var glyphModels;
/** Promise for all model download */
const modelPromise = $.when(...modelFilenames.map(path => $.get(path)))
  .then((...resArr) => {
    glyphModels = resArr.map(res=> {
      const gmDict = res[0];
      const chars = Object.keys(gmDict);
      const models = Object.values(gmDict)
        .map(modelObj => new GlyphModel(modelObj));
      const result = {};
      for (let i in chars) result[chars[i]] = models[i];
      return result;
    });
  }).catch(reason => {
    console.error(reason);
  });

  /** Fira font samples 
 * @typedef { { x: number, y: number, on: boolean }[][] } GlyphData
 * @type { {[key: string]: { advanceWidth: number, contours: GlyphData }}[] } */
var firaSamples;
const firaPromise = $.when(...firaFilenames.map(path => $.get(path)))
  .then((...resArr) => {
    firaSamples = resArr.map(res => res[0]);
  });

/** Sample text */
const sampelText = '⼀三五⽔永过東南明湖区匪国國酬爱愛袋鸢鳶鬱靈鷹曌龘 Height 012369';
/** Get glyph models by the selected heights
 * @returns { GlyphModel[] } */
function getCurrentModels() {
  const selector = $('#weight-select');
  const keys = sampelText.split('').map(
    char => 'uni' + char.charCodeAt(0).toString(16).toUpperCase());
  const modelDict = glyphModels[selector.val()];
  return keys.map(key => modelDict[key]);
}
/** Get current fira glyphs
 * @returns {{[key: string]: { advanceWidth: number, contours: GlyphData }}} */
function getCurrentFira() {
  const firaWeight = $('#fira-weight-select').val();
  const firaWidth = $('#fira-width-select').val();
  const index = parseInt(firaWeight) * 3 + parseInt(firaWidth);
  return firaSamples[index];
}

/** Get the glyphs with filters
 * @returns { { x: number, y: number, on: boolean }[][] } */
function getGlyphs() {
  const strokeWidth = vStrokeWidth();
  const modelFilter = ModelFilters.merge(
    ModelFilters.horizontalScale(globalParams.width),
    ModelFilters.radialScale(globalParams.tracking),
    ModelFilters.counterScale(globalParams.counter),
    ModelFilters.gravityAdjustment(globalParams.gravity),
    ModelFilters.weightAdjustment(globalParams.weight),
    ModelFilters.contrastAdjustment(globalParams.contrast),
    ModelFilters.soften(globalParams.softness)
  );
  const removeFeetFilter = PostFilters.removeFeet(
    { maxStroke: strokeWidth * 1.5, longestFoot: 110 });
  const postFilterList = [];
  if (globalParams.feetremoval) postFilterList.push(removeFeetFilter);
  const postFilter = PostFilters.merge(...postFilterList);
  const latinPostFilter = PostFilters.merge(
    PostFilters.translation(0, globalParams.baseline),
    PostFilters.scaling(globalParams.latinscale));
  const glyphModels = getCurrentModels();
  const glyphs = [];

  glyphModels.forEach((model, i) => {
    if (model === undefined) {
      const char = sampelText[i]
      const currentFira = getCurrentFira();
      if (char === ' ') { glyphs.push([]); return; }
      if (!(char in currentFira)) {
        console.warn(`"${char}" is not found in glyph data.`);
        return;
      }
      const glyphsContour = currentFira[char].contours;
      glyphs.push(latinPostFilter(glyphsContour));
    } else {
      glyphs.push(postFilter(model.restore(modelFilter)));
    }
  });
  return glyphs;
}
function getAdvanceWidths() {
  const advanceWidths = [];
  const glyphModels = getCurrentModels();

  glyphModels.forEach((model, i) => {
    if (model !== undefined) { 
      advanceWidths.push(1000 * globalParams.width); return;
    }
    const char = sampelText[i], currentFira = getCurrentFira();
    if (char === ' ')
      advanceWidths.push(300);
    else if (char in currentFira) {
      const glyphWidth = currentFira[char].advanceWidth;
      advanceWidths.push(glyphWidth * globalParams.latinscale);
    }
  });
  return advanceWidths;
}
function updatePreview() {
  const glyphs = getGlyphs();
  glyphPreviewPanel.glyphs = glyphs;
  glyphPreviewPanel.advanceWidths = getAdvanceWidths();
  glyphPreviewPanel.fontSize = globalParams.fontsize;
}

/** Estimate the vertical stroke width @returns { number } */
function vStrokeWidth() {
  const selector = $('#weight-select');
  const yiGm = glyphModels[selector.val()]['uni2F00'];
  if (!yiGm) 
    throw Error('The character uni2F00 must be included in the glyph models.');
  const yiGlyph = yiGm.restore(
    ModelFilters.weightAdjustment(globalParams.weight)
  );
  const hStrokeWidth = (yiGlyph[0][0].y - yiGlyph[0][1].y)*0.8;
  const contrast = globalParams.contrast;
  return hStrokeWidth/(2-contrast)*contrast;
}

/** TODO: This is temporary
 * @param { { x: number, y: number, on: boolean }[][] } glyphs
 * @returns { [ number, number, number ][] } */
function getKeypoints(glyphs) {
  /** @type { [ number, number, number ] } */
  const keypoints = [];
  const strokeWidth = vStrokeWidth();
  glyphs.forEach((glyph, gi) => glyph.forEach((contour, ci) => {
    const [ leftFeet, rightFeet ] = detectFeet(
      contour, { maxStroke: strokeWidth * 1.5, longestFoot: 110 });
    leftFeet.forEach(pi => keypoints.push([gi, ci, pi]));
    rightFeet.forEach(pi => keypoints.push([gi, ci, pi]));
  }));
  return keypoints;
}

// Initialization
window.addEventListener('load', () => {
  const glyphPreviewPanel = window.glyphPreviewPanel =
    new GlyphPreviewPanel('preview');
  window.globalParams.bindUI();
  // Update preview
  $.when(modelPromise, firaPromise).then(updatePreview);
  window.addEventListener('param-change', updatePreview);
  $('#weight-select').on('change', updatePreview);
  $('#fira-weight-select').on('change', updatePreview);
  $('#fira-width-select').on('change', updatePreview);
});
