/** Encode an object to params
 * @param { string } object */
function encodeParams(object) {
  return JSON.stringify(object).replace(/"/g, '')
    .replace(/:/g,'=').replace(/,/g, '&').slice(1, -1);
}

/** Decode params as an object
 * TODO: String values are not yet supported.
 * @param { string } hash
 * @returns { { [key: string]: number | boolean } } */
function decodeParams(hash) {
  if (hash[0] === '#' || hash[0] === '?') hash = hash.slice(1);
  const jsonString = '{"' + hash.replace(/=/g, '":').replace(/&/g, ',"') + '}';
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return {};
  }
}

module.exports = { encodeParams, decodeParams };