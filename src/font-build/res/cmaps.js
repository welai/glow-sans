// Handling cmap resources
const { readJSON } = require('./read-res');

/** @typedef {{ [cid:string]: string }} Cmap */
/** @type {{ fira?: Cmap. raleway?: Cmap, 
 * shsJ?: Cmap, shsK?: Cmap, shsSC?: Cmap }} */
let cmaps = {};

/** @param { 'fira' | 'raleway' | 'shsJ' | 'shsTC' | 'shsSC' } key 
 * @param { string } path @returns { Cmap }  */
function getCmap(key, path) {
  if (cmaps[key] === undefined)
    cmaps[key] = readJSON(path)
  return cmaps[key];
}

module.exports = {
  get fira() { return getCmap('fira', 'encoding/cmaps/fira.json'); },
  get raleway() { return getCmap('raleway', 'encoding/cmaps/raleway.json'); },
  get shsJ() { return getCmap('shsJ', 'encoding/cmaps/shs-j.json'); },
  get shsTC() { return getCmap('shsTC', 'encoding/cmaps/shs-tc.json'); },
  get shsSC() { return getCmap('shsSC', 'encoding/cmaps/shs-sc.json'); }
}