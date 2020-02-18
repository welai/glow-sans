// Handle glyph data resources
const GlyphModel = require('../src/glyph-manipulate/GlyphModel');

/** Available SHSans weights */
const shsWeights = [ 'ExtraLight', 'Light', 'Normal', 'Regular', 
  'Medium', 'Bold', 'Heavy' ];
Object.freeze(shsWeights);

/** Paths of the glyph models */
const modelFilenames = shsWeights.map(
  w => `samples/SourceHanSansSC-${w}.model.json`);
Object.freeze(modelFilenames);

/** Available Fira weights */
const firaWeights = [ 'Two', 'Four', 'Eight', 'Hair', 'Thin', 'UltraLight',
'ExtraLight', 'Light', 'Book', 'Regular', 'Medium', 'SemiBold', 'Bold',
'ExtraBold', 'Heavy' ];
Object.freeze(firaWeights);

/** Available Fira widths */
const firaWidths = [ 'Normal', 'Condensed', 'Compressed' ];
Object.freeze(firaWidths);

/** Paths of the Fira samples */
const firaFilenames = [];
firaWeights.forEach(w => firaFilenames.push(
  `samples/FiraSans-${w}.json`,
  `samples/FiraSansCondensed-${w}.json`,
  `samples/FiraSansCompressed-${w}.json`
));
Object.freeze(firaFilenames);

/** Available Raleway widths */
const ralewayWeights = [ 'Thin', 'ExtraLight', 'Light', 'Regular', 'Medium',
'SemiBold', 'Bold', 'ExtraBold', 'Black' ];
Object.freeze(ralewayWeights);

/** Paths of the Raleway samples */
const ralewayFilenames = ralewayWeights.map(w => 
  `samples/Raleway-v4020-${w}.json`);
Object.freeze(ralewayFilenames);

/** SHSans glyph models. 
 * @type { { [key: string]: GlyphModel }[] } */
var glyphModels;
/** A list of SHSans model promises. */
const modelPromiseList = modelFilenames.map(path => $.get(path));
/** Promise that all SHSans models are downloaded. */
const modelPromise = $.when(...modelPromiseList).then((...resArr) => {
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
/** A list of Fira promises. */
const firaPromiseList = firaFilenames.map(path => $.get(path));
/** Promise that all Fira fonts are downloaded. */
const firaPromise = $.when(...firaPromiseList).then((...resArr) => {
  firaSamples = resArr.map(res => res[0]);
});

/** Raleway font samples 
 * @typedef { { x: number, y: number, on: boolean }[][] } GlyphData
 * @type { {[key: string]: { advanceWidth: number, contours: GlyphData }}[] } */
var ralewaySamples;
/** A list of Raleway promises. */
const ralewayPromiseList = ralewayFilenames.map(path => $.get(path));
/** Promise that all Raleway fonts are downloaded. */
const ralewayPromise = $.when(...ralewayPromiseList).then((...resArr) => {
  ralewaySamples = resArr.map(res => res[0]);
});

module.exports = {
  /** Available SHSans weights. */      shsWeights,
  /** Available Fira weights. */        firaWeights,
  /** Available Fira widths. */         firaWidths,
  /** Available Raleway weights. */     ralewayWeights,
  /** Paths of the glyph models. */     modelFilenames,
  /** Paths of the Fira samples. */     firaFilenames,
  /** Paths of the Raleway samples. */  ralewayFilenames,
  /** Resources */  res: {
    /** SHSans glyph models. */   get glyphModels() { return glyphModels; },
    /** Fira font samples. */     get firaSamples() { return firaSamples; },
    /** Raleway font samples. */  get ralewaySamples() { return ralewaySamples;}
  },
  /** A list of SHSans model promises. */               modelPromiseList,
  /** Promise that all SHSans models are downloaded. */ modelPromise,
  /** A list of Fira promises. */                       firaPromiseList,
  /** Promise that all Fira fonts are downloaded. */    firaPromise,
  /** A list of Raleway promises. */                    ralewayPromiseList,
  /** Promise that all Raleway fonts are downloaded. */ ralewayPromise
};
