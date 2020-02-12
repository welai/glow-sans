const GlyphModel = require('../src/glyph-manipulate/GlyphModel');
const GlyphPreviewPanel = require('../src/utils/GlyphPreviewPanel');
const ModelFilters = require('../src/glyph-manipulate/ModelFilters');
const PostFilters = require('../src/glyph-manipulate/PostFilters');
const detectFeet = require('../src/glyph-manipulate/detect-feet');

// The parameters manipulatable by the UI elements
const globalParams = window.globalParams = {
  width: 1.0,
  weight: 1.0,
  contrast: 1.0,
  tracking: 1.0,
  counter: 1.0,
  gravity: 1.0,
  softness: 1.0,
  feetremoval: false
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

/** SHSans glyph models. 
 * @type { { [key: string]: GlyphModel }[] } */
var glyphModels;
/** Promise for all model download */
const modelPromise = $.when(...modelFilenames.map(path => $.get(path)))
  .then((...resArr) => {
    glyphModels = resArr.map((res) => {
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

/** Sample text */
const sampelText = '⼀三五⽔永过東南明湖区匪国國酬爱愛袋鸢鳶鬱靈鷹曌龘';
/** Get glyph models by the selected heights
 * @returns { GlyphModel[] } */
function getCurrentModels() {
  const selector = $('#weight-select');
  const keys = sampelText.split('').map(
    char => 'uni' + char.charCodeAt(0).toString(16).toUpperCase());
  const modelDict = glyphModels[selector.val()];
  return keys.map(key => modelDict[key]);
}
/** Get the glyphs with filters
 * @returns { { x: number, y: number, on: boolean }[][] } */
function getGlyphs() {
  const strokeWidth = vStrokeWidth();
  const removeFeetFilter = PostFilters.removeFeet(
    { maxStroke: strokeWidth * 1.5, longestFoot: 110 });
  return getCurrentModels().map(model => model.restore(ModelFilters.merge(
    ModelFilters.horizontalScale(globalParams.width),
    ModelFilters.radialScale(globalParams.tracking),
    ModelFilters.counterScale(globalParams.counter),
    ModelFilters.gravityAdjustment(globalParams.gravity),
    ModelFilters.weightAdjustment(globalParams.weight),
    ModelFilters.contrastAdjustment(globalParams.contrast),
    ModelFilters.soften(globalParams.softness)
  ))).map(glyph => {
    const postFilters = [];
    if (globalParams.feetremoval) postFilters.push(removeFeetFilter);
    return PostFilters.merge(...postFilters)(glyph);
  });
}
function getAdvanceWidths() {
  return 1000 * globalParams.width;
}
function updatePreview() {
  const glyphs = getGlyphs();
  glyphPreviewPanel.glyphs = glyphs;
  glyphPreviewPanel.advanceWidths = getAdvanceWidths();
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
  modelPromise.then(updatePreview);
  window.addEventListener('param-change', updatePreview);
  $('#weight-select').on('change', updatePreview);
});
