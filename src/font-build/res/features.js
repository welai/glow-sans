const fs = require('fs');
const { readJSON, expandPath } = require('./read-res');

/** Get specified GSUB table
 * @param { 'J' | 'K' | 'SC' | 'TC' } lang 
 * @param { 'ExtraLight' | 'Light' | 'Normal' | 'Regular' | 'Medium' | 'Bold' 
 * | 'Heavy' } weight */
function getGSUB(lang, weight) {
  const pathInProject = `build-files/features/gsub-${lang.toLowerCase()}/${weight}.json`;
  if (!fs.existsSync(expandPath(pathInProject)))
    throw Error(`GSUB table ${pathInProject} is not found.`);
  return readJSON(pathInProject);
}

/** Get specified GPOS table
 * @param { 'J' | 'K' | 'SC' | 'TC' } lang 
 * @param { 'ExtraLight' | 'Light' | 'Normal' | 'Regular' | 'Medium' | 'Bold' 
 * | 'Heavy' } weight */
function getGPOS(lang, weight) {
  const pathInProject = `build-files/features/gsub-${lang.toLowerCase()}/${weight}.json`;
  if (!fs.existsSync(expandPath(pathInProject)))
    throw Error(`GSUB table ${pathInProject} is not found.`);
  return readJSON(pathInProject);
}

/** Reduce the GSUB table functions */
function reduceGSUB(gsub) {
  const allowedFeatures = new Set([
    'aalt', 'ccmp', 'dlig', 'fwid', 'hist', 'hwid', 'jp78', 'jp83', 'jp90', 
    'liga', 'nlck', 'pwid', 'ruby', 'vert', 'vrt2'
  ]);
  const result = {
    languages: { DFLT_DFLT: { 
      features: gsub.languages.DFLT_DFLT.features.filter(
        x => allowedFeatures.has(x.slice(0, 4)))
    }},
    features: {},
    lookups: {},
    lookupOrder: []
  };

  for (let feature in gsub.features) {
    if (result.languages.DFLT_DFLT.features.includes(feature)) {
      const lookups = gsub.features[feature];
      result.features[feature] = lookups;
      lookups.forEach(lookup => {
        result.lookups[lookup] = gsub.lookups[lookup];
        result.lookupOrder.push(lookup);
      });
    }
  }
  return result;
}

module.exports = { getGSUB, getGPOS, reduceGSUB };