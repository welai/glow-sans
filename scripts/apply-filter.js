const fs = require('fs');
const ModelFilters = require('../src/glyph-manipulate/ModelFilters');
const PostFilters = require('../src/glyph-manipulate/PostFilters');
const GlyphModel = require('../src/glyph-manipulate/GlyphModel');

const modelFilename = process.argv[2];
if (!modelFilename) throw Error(`The 2nd argument is required.`);
const paramFilename = process.argv[3];
if (!paramFilename) throw Error(`The 3rd argument is required.`);
const outputFilename = process.argv[4];
if (!outputFilename) throw Error(`The 4th argument is required.`);

const models = JSON.parse(fs.readFileSync(modelFilename).toString());
const params = JSON.parse(fs.readFileSync(paramFilename).toString());

const modelFilter = ModelFilters.merge(
  ModelFilters.horizontalScale(params.width),
  ModelFilters.radialScale(params.xtracking, params.ytracking),
  ModelFilters.counterScale(params.counter),
  ModelFilters.gravityAdjustment(params.gravity),
  ModelFilters.weightAdjustment(params.weight),
  ModelFilters.contrastAdjustment(params.contrast),
  ModelFilters.soften(params.softness)
);

const postFilterList = [
  PostFilters.hookTension(params.hooktension),
  PostFilters.strokeEndsFlatten(params.flattenends, params.endsremoval, 
    { maxStroke: params.hstroke * 1.5 }),
  PostFilters.softenDots(params.dotsoftness, 
    { maxStroke: params.hstroke * 1.5 })
];
const removeFeetFilter = PostFilters.removeFeet(
  { maxStroke: params.vstroke * 1.5, longestFoot: 110 });
if (params.feetremoval) postFilterList.splice(0, 0, removeFeetFilter);
const postFilter = PostFilters.merge(...postFilterList,
  PostFilters.translation(0, -params.baseline), PostFilters.round());

function getGlyph(modelData) {
  const model = new GlyphModel(modelData);
  return postFilter(model.restore(modelFilter));
}

const result = {}

for (const id in models) {
  result[id] = getGlyph(models[id]);
}

fs.writeFileSync(process.argv[4], JSON.stringify(result));