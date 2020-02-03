const GlyphModel = require('../src/glyph-manipulate/GlyphModel');
const GlyphPreviewPanel = require('../src/utils/GlyphPreviewPanel');
const ModelFilters = require('../src/glyph-manipulate/ModelFilters');

// The parameters manipulatable by the UI elements
const globalParams = window.globalParams = {
  width: 1.0,
  weight: 1.0,
  contrast: 1.0,
  tracking: 1.0,
  counter: 1.0,
  gravity: 1.0,
  softness: 1.0
};
/** Bind the UI to globalParams */
globalParams.bindUI = function () {
  $('.binded').each((index, elem) => {
    const param = elem.getAttribute('data-bind');
    $(elem).on('input', () => {
      this[param] = Number.parseFloat(elem.value);
      const event = new CustomEvent('param-change', { detail: param });
      window.dispatchEvent(event);
    });
    $(elem).val(this[param]);
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
 * @returns { [[{ x: number, y: number, on: boolean }]] } */
function getGlyphs() {
  return getCurrentModels().map(model => model.restore(ModelFilters.merge(
    ModelFilters.horizontalScale(globalParams.width),
    ModelFilters.radialScale(globalParams.tracking),
    ModelFilters.counterScale(globalParams.counter),
    ModelFilters.gravityAdjustment(globalParams.gravity),
    ModelFilters.weightAdjustment(globalParams.weight),
    ModelFilters.contrastAdjustment(globalParams.contrast),
    ModelFilters.soften(globalParams.softness)
  )));
}
function getAdvanceWidths() {
  return 1000 * globalParams.width;
}
function updatePreview() {
  glyphPreviewPanel.glyphs = getGlyphs();
  glyphPreviewPanel.advanceWidths = getAdvanceWidths();
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
