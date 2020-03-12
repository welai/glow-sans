/** @typedef {{ width: number, weight: number, contrast: number, 
 * xtracking: number, ytracking: number, counter: number, gravity: number,
 * softness:number, dotsoftness: number, 
 * feetremoval: boolean, endsremoval: boolean, flattenends: number, 
 * hooktension: number, baseline: number, latinscale: number, 
 * shs: number, fira?: number, raleway?: number, hstroke: number, 
 * vstroke: number }} Parameter */
const fs = require('fs');
const { expandPath, readJSON } = require('./read-res');

/** Get parameters with given name
 * @param { string } name 
 * @returns { Parameter } */
function getParam(name) {
  const fullPath = expandPath(`parameters/${name}.json`);
  if (!fs.existsSync(fullPath))
    throw Error(`Cannot find parameter file ${fullPath}.`);
  return readJSON(`parameters/${name}.json`);
}

module.exports = { getParam };