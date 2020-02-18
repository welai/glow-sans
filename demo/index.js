const GlyphPreviewPanel = require('./GlyphPreviewPanel');
const ModelFilters = require('../src/glyph-manipulate/ModelFilters');
const PostFilters = require('../src/glyph-manipulate/PostFilters');
const { detectEnds } = require('../src/glyph-manipulate/detect-ends');
const globalParams = require('./global-params');
const { res, shsWeights, firaWeights, firaWidths, ralewayWeights,
  modelPromise, firaPromise, ralewayPromise } = require('./resources');
const { encodeParams, decodeParams } = require('./url-param');

/** Sample text */
const sampelText = '⼀三五⽔永过東南明湖区匪国國酬爱愛袋鸢鳶鬱靈鷹曌龘 Height 012369';
/** Get glyph models by the selected heights
 * @returns { GlyphModel[] } */
function getCurrentModels() {
  const selector = $('#weight-select');
  const keys = sampelText.split('').map(
    char => 'uni' + char.charCodeAt(0).toString(16).toUpperCase());
  const modelDict = res.glyphModels[selector.val()];
  return keys.map(key => modelDict[key]);
}

/** @type { boolean } If using FiraSans or not */
var useFira = true;
/** Get current fira glyphs
 * @returns {{[key: string]: { advanceWidth: number, contours: GlyphData }}} */
function getCurrentLatin() {
  if (useFira) {
    const firaWeight = $('#fira-weight-select').val();
    const firaWidth = $('#fira-width-select').val();
    const index = parseInt(firaWeight) * 3 + parseInt(firaWidth);
    return res.firaSamples[index];
  } else {
    const ralewayWeight = $('#raleway-weight-select').val();
    const index = parseInt(ralewayWeight);
    return res.ralewaySamples[index];
  }
}

/** Get the glyphs with filters
 * @returns { { x: number, y: number, on: boolean }[][] } */
function getGlyphs() {
  const vStroke = vStrokeWidth();
  const hStroke = hStrokeWidth();
  const modelFilter = ModelFilters.merge(
    ModelFilters.horizontalScale(globalParams.width),
    ModelFilters.radialScale(globalParams.xtracking, globalParams.ytracking),
    ModelFilters.counterScale(globalParams.counter),
    ModelFilters.gravityAdjustment(globalParams.gravity),
    ModelFilters.weightAdjustment(globalParams.weight),
    ModelFilters.contrastAdjustment(globalParams.contrast),
    ModelFilters.soften(globalParams.softness)
  );

  const removeFeetFilter = PostFilters.removeFeet(
    { maxStroke: vStroke * 1.5, longestFoot: 110 });
  const strokeEndFilter = PostFilters.strokeEndsFlatten(
    globalParams.flattenends, globalParams.endsremoval, 
    { maxStroke: hStroke * 1.5 });
  const softenDotFilter = PostFilters.softenDots(
    globalParams.dotsoftness, { maxStroke: hStroke * 1.5 });
  const postFilterList = [];
  if (globalParams.feetremoval) postFilterList.push(removeFeetFilter);
  postFilterList.push(strokeEndFilter);
  postFilterList.push(softenDotFilter);
  const postFilter = PostFilters.merge(...postFilterList);

  const latinPostFilter = PostFilters.merge(
    PostFilters.translation(0, globalParams.baseline),
    PostFilters.scaling(globalParams.latinscale));

  const currentModels = getCurrentModels();
  const glyphs = [];

  currentModels.forEach((model, i) => {
    if (model === undefined) {
      const char = sampelText[i]
      const currentFira = getCurrentLatin();
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
  const currentModels = getCurrentModels();

  currentModels.forEach((model, i) => {
    if (model !== undefined) { 
      advanceWidths.push(1000 * globalParams.width); return;
    }
    const char = sampelText[i], currentFira = getCurrentLatin();
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
  if ($.when(modelPromise, firaPromise).state() !== 'resolved') return;
  const glyphs = getGlyphs();
  glyphPreviewPanel._glyphs = glyphs;
  glyphPreviewPanel._advanceWidths = getAdvanceWidths();
  glyphPreviewPanel.fontSize = globalParams.fontsize;
  // glyphPreviewPanel.highlights = getKeypoints(glyphs);
}

/** Estimate the horizontal stroke width @returns { number } */
function hStrokeWidth() {
  const selector = $('#weight-select');
  const yiGm = res.glyphModels[selector.val()]['uni2F00'];
  if (!yiGm) 
    throw Error('The character uni2F00 must be included in the glyph models.');
  const yiGlyph = yiGm.restore(
    ModelFilters.weightAdjustment(globalParams.weight)
  );
  const hStrokeWidth = (yiGlyph[0][0].y - yiGlyph[0][1].y)*0.8;
  return hStrokeWidth;
}

/** Estimate the vertical stroke width @returns { number } */
function vStrokeWidth() {
  const selector = $('#weight-select');
  const yiGm = res.glyphModels[selector.val()]['uni2F00'];
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
  const strokeWidth = hStrokeWidth();
  glyphs.forEach((glyph, gi) => glyph.forEach((contour, ci) => {
    const ends = detectEnds(contour, { maxStroke: strokeWidth * 1.5 });
    ends.forEach(pi => keypoints.push([gi, ci, pi]))
  }));
  return keypoints;
}

/** Load saved object
 * @param { { [key: string]: boolean|number } } savedObject */
function loadSaved(savedObject) {
  for (const param in savedObject) {
    if (param in globalParams) globalParams[param] = savedObject[param];
  }
  const shsval = savedObject.shs;
  if (shsval !== undefined && shsval in shsWeights) {
    const select = $('#weight-select');
    select.val('' + shsval);
    try { select[0].M_FormSelect._setValueToInput(); } catch (error) { }
  }
  const firaval = savedObject.fira;
  if (firaval !== undefined) {
    const firaWeight = Math.floor(firaval/3), firaWidth = firaval%3;
    if (firaWeight in firaWeights) {
      const select = $('#fira-weight-select');
      select.val('' + firaWeight);
      try { select[0].M_FormSelect._setValueToInput(); } catch (error) { }
    }
    if (firaWidth in firaWidths) {
      const select = $('#fira-width-select');
      select.val('' + firaWidth);
      try { select[0].M_FormSelect._setValueToInput(); } catch (error) { }
    }
  }
  const ralewayval = savedObject.raleway;
  if (ralewayval !== undefined) {
    if (ralewayval in ralewayWeights) {
      const select = $('#raleway-weight-select');
      select.val('' + ralewayval);
      try { select[0].M_FormSelect._setValueToInput(); } catch (error) { }
    }
    useFira = false;
    document.getElementById('raleway-radio').checked = true;
  }
  globalParams.bindUI();
  updatePreview();
}

/** Get the object to save.
 * @returns { { [key: string]: boolean|number } } */
function getSavingObject() {
  const object = JSON.parse(JSON.stringify(globalParams));
  object.shs = parseInt($('#weight-select').val());
  if (useFira) {
    object.fira = parseInt($('#fira-weight-select').val()) * 3 
      + parseInt($('#fira-width-select').val());
  } else {
    object.raleway = parseInt($('#raleway-weight-select').val());
  }
  return object;
}

/** Triggered when clicking the save buttom. */
window.saveJSON = function saveJSON() {
  var toSave = JSON.stringify(getSavingObject());
  var blob = new Blob([ toSave ], { type: 'application/json' });
  var a = document.createElement('a');
  a.download = 'saved.json';
  a.href = URL.createObjectURL(blob);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  a.remove();
}

window.copyLink = function copyLink() {
  const toSave = getSavingObject();
  const link = location.origin + location.pathname + '#' + encodeParams(toSave);
  $('#link-copying')[0].type = 'text';
  $('#link-copying').val(link);
  $('#link-copying').select();
  document.execCommand('copy');
  $('#link-copying')[0].type = 'hidden';
  M.toast({ html: '已复制链接到剪贴板。<br>Link copied to clipboard.' });
}

window.toggleLatin = function toggleLatin(current) {
  if (current === 'fira' && !useFira) {
    useFira = true;
    $('#fira-weight-div').show();
    $('#fira-width-div').show(200);
    $('#raleway-weight-div').hide();
  }
  else if (current === 'raleway' && useFira) {
    useFira = false;
    $('#fira-weight-div').hide();
    $('#fira-width-div').hide(200);
    $('#raleway-weight-div').show();
  }
  updatePreview();
}

$('#input-file').change(() => {
  const file = document.getElementById('input-file').files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const contents = e.target.result;
    try {
      const settings = JSON.parse(contents);
      loadSaved(settings);
    } catch (e) {
      M.toast({ html: '无法解析文件。<br>File import failed.' });
    }
  }
  reader.readAsText(file);
});

$(window).on('hashchange', () => {
  const decodedParams = decodeParams(location.hash);
  loadSaved(decodedParams);
  location.hash = '';
});

// Initialization
window.addEventListener('load', () => {
  const glyphPreviewPanel = window.glyphPreviewPanel =
    new GlyphPreviewPanel('preview');
  glyphPreviewPanel.lineHeight = 1.25;
  const decodedParams = decodeParams(location.hash);
  loadSaved(decodedParams);
  location.hash = '';
  // Update preview
  $.when(modelPromise, firaPromise, ralewayPromise).then(updatePreview);
  window.addEventListener('param-change', updatePreview);
  $('#weight-select').change(updatePreview);
  $('#fira-weight-select').change(updatePreview);
  $('#fira-width-select').change(updatePreview);
  $('#raleway-weight-select').change(updatePreview);
});
