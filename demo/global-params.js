// The parameters manipulatable by the UI elements
const globalParams = window.globalParams = {
  fontsize: 100,
  width: 1.0,
  weight: 1.0,
  contrast: 1.0,
  xtracking: 1.0,
  ytracking: 1.0,
  counter: 1.0,
  gravity: 1.0,
  softness: 1.0,
  dotsoftness: 1.0,
  feetremoval: false,
  endsremoval: false,
  flattenends: 0.0,
  hooktension: 0.0, 
  baseline: 100,
  latinscale: 1.0
};

let binded = false;
/** Bind the UI to globalParams */
globalParams.bindUI = function () {
  $('.binded').each((index, elem) => {
    const param = elem.getAttribute('data-bind');
    if (!binded) {
      $(elem).on('input', () => {
        if (elem.type === 'range') this[param] = Number.parseFloat(elem.value);
        if (elem.type === 'checkbox') this[param] = elem.checked;
        const event = new CustomEvent('param-change', { detail: param });
        window.dispatchEvent(event);
      });
    }
    if (elem.type === 'range') $(elem).val(this[param]);
    if (elem.type === 'checkbox') elem.checked = globalParams.feetremoval;
  });
  binded = true;
}

module.exports = globalParams;