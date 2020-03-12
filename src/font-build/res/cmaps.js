// Handling cmap resources
const { readJSON } = require('./read-res');

module.exports = {
  fira: readJSON('encoding/cmaps/fira.json'),
  raleway: readJSON('encoding/cmaps/raleway.json'),
  shsJ: readJSON('encoding/cmaps/shs-j.json'),
  shsK: readJSON('encoding/cmaps/shs-k.json'),
  shsSC: readJSON('encoding/cmaps/shs-sc.json')
}