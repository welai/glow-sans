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
  const pathInProject = `build-files/features/gpos-${lang.toLowerCase()}/${weight}.json`;
  if (!fs.existsSync(expandPath(pathInProject)))
    throw Error(`GPOS table ${pathInProject} is not found.`);
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
    lookups: {}
  };

  for (let feature in gsub.features) {
    if (result.languages.DFLT_DFLT.features.includes(feature)) {
      const lookups = gsub.features[feature];
      result.features[feature] = lookups;
      lookups.forEach(lookup => result.lookups[lookup] = gsub.lookups[lookup]);
    }
  }
  return result;
}

/** Simplify the kern lookup table
 * @typedef {{ 
 * first: { [gid:string]: number },
 * second: { [gid:string]: number },
 * matrix: number[][] }} KernLookupSubtable
 * @param { KernLookupSubtable } subtable 
 * @param { Set<string> } gidset */
function simplifyKernSubtable(subtable, gidset) {
  const newFirst = {}, newSecond = {};
  // Entries of available first glyphs
  const entries1 = Object.entries(subtable.first)
    .filter(([ gid, index ]) => gidset.has(gid)).sort((a, b) => a[1] - b[1]);
  // Entries of available second glyphs
  const entries2 = Object.entries(subtable.second)
    .filter(([ gid, index ]) => gidset.has(gid)).sort((a, b) => a[1] - b[1]);
  // Modifying indices
  let i = -1, prevIndex = -1;
  for (let [ gid, index ] of entries1) {
    if (index !== prevIndex) i++;
    newFirst[gid] = i; prevIndex = index;
  }
  i = -1; prevIndex = -1;
  for (let [ gid, index ] of entries2) {
    if (index !== prevIndex) i++;
    newSecond[gid] = i; prevIndex = index;
  }
  const rowSet = new Set(Object.keys(newFirst)
    .map(gid => subtable.first[gid]));
  const columnSet = new Set(Object.keys(newSecond)
    .map(gid => subtable.second[gid]));
  const newMat = subtable.matrix.filter((row, i) => rowSet.has(i))
    .map(row => row.filter((val, j) => columnSet.has(j)));
  return {
    first: newFirst, second: newSecond, matrix: newMat
  };
}

function scaleLookup(lookup, xScale = 1, yScale = 1) {
  lookup = JSON.parse(JSON.stringify(lookup));
  switch (lookup.type) {
    case 'gpos_mark_to_base': 
      lookup.subtables.forEach(subtable => {
        for (let gid in subtable.marks) {
          if (subtable.marks[gid].x) subtable.marks[gid].x *= xScale;
          if (subtable.marks[gid].y) subtable.marks[gid].y *= yScale;
        }
        for (let gid in subtable.bases) {
          for (let anchor in subtable.bases[gid]) {
            const anchorPos = subtable.bases[gid][anchor];
            if (anchorPos.x) anchorPos.x *= xScale;
            if (anchorPos.y) anchorPos.y *= yScale;
          }
        }
      }); break;
    case 'gpos_single': 
      lookup.subtables.forEach(subtable => {
        for (let gid in subtable) {
          if (subtable[gid].dx) subtable[gid].dx *= xScale;
          if (subtable[gid].dy) subtable[gid].dy *= yScale;
          if (subtable[gid].dWidth) subtable[gid].dWidth *= xScale;
          if (subtable[gid].dHeight) subtable[gid].dHeight *= yScale;
        }
      }); break;
    case 'gpos_pair':
      lookup.subtables.forEach(subtable => {
        subtable.matrix = subtable.matrix.map(row => row.map(val => {
          if (typeof val === 'number') return val * xScale;
          if (val.first && val.first.dHeight) val.first.dHeight *= yScale;
          return val;
        }))
      }); break;
      default: break;
  }
  return lookup;
}

function scaleGPOS(gpos, xScale = 1, yScale = 1) {
  const result = {
    languages: gpos.languages,
    features: gpos.features,
    lookups: {}
  };
  for (let lookup in gpos.lookups) 
    result.lookups[lookup] = scaleLookup(gpos.lookups[lookup], xScale, yScale);
  return result;
}

/** @param {*} gpos @param { Set<string> } gidset */
function reduceGPOS(gpos, gidset) {
  const result = {
    languages: { DFLT_DFLT: { features: gpos.languages.DFLT_DFLT.features } },
    features: {},
    lookups: {}
  };
  
  for (let feature in gpos.features) {
    if (result.languages.DFLT_DFLT.features.includes(feature)) {
      const lookups = gpos.features[feature];
      result.features[feature] = lookups;
      lookups.forEach(lookup => {
        let resultLookup = result.lookups[lookup] = gpos.lookups[lookup];
        // Simplify kern subtable
        if (gidset && feature.startsWith('kern')) {
          resultLookup.subtables = resultLookup.subtables.map(
            t => simplifyKernSubtable(t, gidset));
        }
      });
    }
  }
  return result;
}


module.exports = { getGSUB, getGPOS, 
  simplifyKernSubtable, scaleLookup, reduceGSUB, reduceGPOS, scaleGPOS };