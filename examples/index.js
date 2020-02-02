const GlyphModel = require('../src/glyph-manipulate/GlyphModel');
const GlyphPreviewPanel = require('../src/utils/GlyphPreviewPanel');

// The parameters manipulatable by the UI elements
const globalParams = window.globalParams = {

};

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

const shsWeights = [ 'ExtraLight', 'Light', 'Normal', 'Regular', 
  'Medium', 'Bold', 'Heavy' ];
const modelFilenames = shsWeights.map(
  w => `samples/SourceHanSansSC-${w}.model.json`);

/** SHSans glyph models. 
 * @type { { [key: string]: GlyphModel }[] } */
var glyphModels;
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

// Initialization
window.addEventListener('load', () => {
  const glyphPreviewPanel = new GlyphPreviewPanel('preview');
  window.globalParams.bindUI();
});
