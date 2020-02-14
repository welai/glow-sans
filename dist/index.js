(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _$, _$2;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var GlyphModel = require('../src/glyph-manipulate/GlyphModel');

var GlyphPreviewPanel = require('../src/utils/GlyphPreviewPanel');

var ModelFilters = require('../src/glyph-manipulate/ModelFilters');

var PostFilters = require('../src/glyph-manipulate/PostFilters');

var detectFeet = require('../src/glyph-manipulate/detect-feet'); // The parameters manipulatable by the UI elements


var globalParams = window.globalParams = {
  width: 1.0,
  weight: 1.0,
  contrast: 1.0,
  tracking: 1.0,
  counter: 1.0,
  gravity: 1.0,
  softness: 1.0,
  feetremoval: false
};
/** Bind the UI to globalParams */

globalParams.bindUI = function () {
  var _this = this;

  $('.binded').each(function (index, elem) {
    var param = elem.getAttribute('data-bind');
    $(elem).on('input', function () {
      if (elem.type === 'range') _this[param] = Number.parseFloat(elem.value);
      if (elem.type === 'checkbox') _this[param] = elem.checked;
      var event = new CustomEvent('param-change', {
        detail: param
      });
      window.dispatchEvent(event);
    });
    if (elem.type === 'range') $(elem).val(_this[param]);
    if (elem.type === 'checkbox') elem.checked = globalParams.feetremoval;
  });
}; // SHSans glyph model data

/** Available weights */


var shsWeights = ['ExtraLight', 'Light', 'Normal', 'Regular', 'Medium', 'Bold', 'Heavy'];
/** Paths of the glyph models */

var modelFilenames = shsWeights.map(function (w) {
  return "samples/SourceHanSansSC-".concat(w, ".model.json");
});
/** Available Fira weights */

var firaWeights = ['Two', 'Four', 'Eight', 'Hair', 'Thin', 'UltraLight', 'ExtraLight', 'Light', 'Regular', 'Book', 'Medium', 'SemiBold', 'Bold', 'ExtraBold', 'Heavy'];
/** Available Fira widths */

var firaWidths = ['Normal', 'Condensed', 'Compressed'];
/** Paths of the fira samples */

var firaFilenames = [];
firaWeights.forEach(function (w) {
  return firaFilenames.push("samples/FiraSans-".concat(w, ".json"), "samples/FiraSansCondensed-".concat(w, ".json"), "samples/FiraSansCompressed-".concat(w, ".json"));
});
/** SHSans glyph models. 
 * @type { { [key: string]: GlyphModel }[] } */

var glyphModels;
/** Promise for all model download */

var modelPromise = (_$ = $).when.apply(_$, _toConsumableArray(modelFilenames.map(function (path) {
  return $.get(path);
}))).then(function () {
  for (var _len = arguments.length, resArr = new Array(_len), _key = 0; _key < _len; _key++) {
    resArr[_key] = arguments[_key];
  }

  glyphModels = resArr.map(function (res) {
    var gmDict = res[0];
    var chars = Object.keys(gmDict);
    var models = Object.values(gmDict).map(function (modelObj) {
      return new GlyphModel(modelObj);
    });
    var result = {};

    for (var i in chars) {
      result[chars[i]] = models[i];
    }

    return result;
  });
})["catch"](function (reason) {
  console.error(reason);
});
/** Fira font samples 
* @typedef { { x: number, y: number, on: boolean }[][] } GlyphData
* @type { { [key: string]: { advanceWidth: number, contours: GlyphData } } } */


var firaSamples;

var firaPromise = (_$2 = $).when.apply(_$2, _toConsumableArray(firaFilenames.map(function (path) {
  return $.get(path);
}))).then(function () {
  for (var _len2 = arguments.length, resArr = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    resArr[_key2] = arguments[_key2];
  }

  firaSamples = resArr.map(function (res) {
    return res[0];
  }); // TODO: remove this line    

  window.firaSamples = firaSamples;
});
/** Sample text */


var sampelText = '⼀三五⽔永过東南明湖区匪国國酬爱愛袋鸢鳶鬱靈鷹曌龘';
/** Get glyph models by the selected heights
 * @returns { GlyphModel[] } */

function getCurrentModels() {
  var selector = $('#weight-select');
  var keys = sampelText.split('').map(function (_char) {
    return 'uni' + _char.charCodeAt(0).toString(16).toUpperCase();
  });
  var modelDict = glyphModels[selector.val()];
  return keys.map(function (key) {
    return modelDict[key];
  });
}
/** Get the glyphs with filters
 * @returns { { x: number, y: number, on: boolean }[][] } */


function getGlyphs() {
  var strokeWidth = vStrokeWidth();
  var removeFeetFilter = PostFilters.removeFeet({
    maxStroke: strokeWidth * 1.5,
    longestFoot: 110
  });
  return getCurrentModels().map(function (model) {
    return model.restore(ModelFilters.merge(ModelFilters.horizontalScale(globalParams.width), ModelFilters.radialScale(globalParams.tracking), ModelFilters.counterScale(globalParams.counter), ModelFilters.gravityAdjustment(globalParams.gravity), ModelFilters.weightAdjustment(globalParams.weight), ModelFilters.contrastAdjustment(globalParams.contrast), ModelFilters.soften(globalParams.softness)));
  }).map(function (glyph) {
    var postFilters = [];
    if (globalParams.feetremoval) postFilters.push(removeFeetFilter);
    return PostFilters.merge.apply(PostFilters, postFilters)(glyph);
  });
}

function getAdvanceWidths() {
  return 1000 * globalParams.width;
}

function updatePreview() {
  var glyphs = getGlyphs();
  glyphPreviewPanel.glyphs = glyphs;
  glyphPreviewPanel.advanceWidths = getAdvanceWidths();
}
/** Estimate the vertical stroke width @returns { number } */


function vStrokeWidth() {
  var selector = $('#weight-select');
  var yiGm = glyphModels[selector.val()]['uni2F00'];
  if (!yiGm) throw Error('The character uni2F00 must be included in the glyph models.');
  var yiGlyph = yiGm.restore(ModelFilters.weightAdjustment(globalParams.weight));
  var hStrokeWidth = (yiGlyph[0][0].y - yiGlyph[0][1].y) * 0.8;
  var contrast = globalParams.contrast;
  return hStrokeWidth / (2 - contrast) * contrast;
}
/** TODO: This is temporary
 * @param { { x: number, y: number, on: boolean }[][] } glyphs
 * @returns { [ number, number, number ][] } */


function getKeypoints(glyphs) {
  /** @type { [ number, number, number ] } */
  var keypoints = [];
  var strokeWidth = vStrokeWidth();
  glyphs.forEach(function (glyph, gi) {
    return glyph.forEach(function (contour, ci) {
      var _detectFeet = detectFeet(contour, {
        maxStroke: strokeWidth * 1.5,
        longestFoot: 110
      }),
          _detectFeet2 = _slicedToArray(_detectFeet, 2),
          leftFeet = _detectFeet2[0],
          rightFeet = _detectFeet2[1];

      leftFeet.forEach(function (pi) {
        return keypoints.push([gi, ci, pi]);
      });
      rightFeet.forEach(function (pi) {
        return keypoints.push([gi, ci, pi]);
      });
    });
  });
  return keypoints;
} // Initialization


window.addEventListener('load', function () {
  var glyphPreviewPanel = window.glyphPreviewPanel = new GlyphPreviewPanel('preview');
  window.globalParams.bindUI(); // Update preview

  $.when(modelPromise, firaPromise).then(updatePreview);
  window.addEventListener('param-change', updatePreview);
  $('#weight-select').on('change', updatePreview);
});

},{"../src/glyph-manipulate/GlyphModel":3,"../src/glyph-manipulate/ModelFilters":4,"../src/glyph-manipulate/PostFilters":5,"../src/glyph-manipulate/detect-feet":6,"../src/utils/GlyphPreviewPanel":7}],2:[function(require,module,exports){
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.gridcanvas=t():e.gridcanvas=t()}(window,function(){return function(e){var t={};function i(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,i),r.l=!0,r.exports}return i.m=e,i.c=t,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=0)}([function(e,t,i){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});var r=n(i(1));!function(){if("undefined"==typeof window)throw Error("Grid canvas only works on a browser.\nPlease check out if your configuration is correct.")}(),window.GridCanvas=r.default,t.default=r.default},function(e,t,i){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});var r=i(2),a=n(i(3)),o=n(i(10)),s=function(){function e(e,t){var i=this;this.redrawUpper=function(){},this.redrawLower=function(){},this.majorGridColor="#cccccc",this.majorGridWidth=.5,this.minorGridColor="#dddddd",this.minorGridWidth=.4,this.aspectLock=!0,this.showGridsFlag=!0,this._resolution=1,this.display=function(){i.displayRect.minX,i.displayRect.maxX,i.displayRect.minY,i.displayRect.maxY;i.redrawLower(i.lowerLayer.getContext("2d")),i.drawGridLines(),i.redrawUpper(i.upperLayer.getContext("2d"))},this.v2pX=function(e){return e/i.gridLayer.width*(i.displayRect.maxX-i.displayRect.minX)+i.displayRect.minX},this.v2pY=function(e){return i.displayRect.maxY-e/i.gridLayer.height*(i.displayRect.maxY-i.displayRect.minY)},this.v2pH=function(e){return e/i.gridLayer.height*(i.displayRect.maxY-i.displayRect.minY)},this.v2pW=function(e){return e/i.gridLayer.width*(i.displayRect.maxX-i.displayRect.minX)},this.p2vX=function(e){return(e-i.displayRect.minX)/(i.displayRect.maxX-i.displayRect.minX)*i.gridLayer.width},this.p2vY=function(e){return(i.displayRect.maxY-e)/(i.displayRect.maxY-i.displayRect.minY)*i.gridLayer.height},this.p2vH=function(e){return e/(i.displayRect.maxY-i.displayRect.minY)*i.gridLayer.height},this.p2vW=function(e){return e/(i.displayRect.maxX-i.displayRect.minX)*i.gridLayer.width};var n=(t?t.bound:void 0)||r.defaultConfig.bound;this.gridSeries=(t?t.gridSeries:void 0)||r.defaultConfig.gridSeries,this.majorGridDensity=(t?t.majorGridDensity:void 0)||r.defaultConfig.majorGridDensity,this.aspectLock=(t?t.aspeckLocked:void 0)||r.defaultConfig.aspeckLocked,this.showGridsFlag=(t?t.showGrid:void 0)||r.defaultConfig.showGrid;var s=document.getElementById(e);this.container=s,this.container.style.textAlign="left",this.container.style.position="relative",this._resolution=window.devicePixelRatio||1,this.lowerLayer=document.createElement("canvas"),this.lowerLayer.style.position="absolute",this.lowerLayer.id=(this.container.id||"preview-container")+"-lower",this.lowerLayer.style.width="100%",this.lowerLayer.style.height="100%",this.container.appendChild(this.lowerLayer),this.lowerLayer.width=this.lowerLayer.clientWidth*this.resolution,this.lowerLayer.height=this.lowerLayer.clientHeight*this.resolution,this.gridLayer=document.createElement("canvas"),this.gridLayer.style.position="absolute",this.gridLayer.id=(this.container.id||"preview-container")+"-canvas",this.gridLayer.style.width="100%",this.gridLayer.style.height="100%",this.container.appendChild(this.gridLayer),this.gridLayer.width=this.gridLayer.clientWidth*this.resolution,this.gridLayer.height=this.gridLayer.clientHeight*this.resolution,this.upperLayer=document.createElement("canvas"),this.upperLayer.style.position="absolute",this.upperLayer.id=(this.container.id||"preview-container")+"-upper",this.upperLayer.style.width="100%",this.upperLayer.style.height="100%",this.container.appendChild(this.upperLayer),this.upperLayer.width=this.upperLayer.clientWidth*this.resolution,this.upperLayer.height=this.upperLayer.clientHeight*this.resolution;new o.default(function(){var e=[i.gridLayer.width,i.gridLayer.height],t=e[0],n=e[1],r=i.upperLayer.width=i.lowerLayer.width=i.gridLayer.width=i.container.clientWidth*i.resolution,a=i.upperLayer.height=i.lowerLayer.height=i.gridLayer.height=i.container.clientHeight*i.resolution;if(r>a/n*t){var o=(i.displayRect.minY+i.displayRect.maxY)/2,s=(i.displayRect.maxX-i.displayRect.minX)/r*a;i.displayRect.minY=o-s/2,i.displayRect.maxY=o+s/2}else{var l=(i.displayRect.minX+i.displayRect.maxX)/2,u=(i.displayRect.maxY-i.displayRect.minY)/a*r;i.displayRect.minX=l-u/2,i.displayRect.maxX=l+u/2}i.uiOverlay.updateDifferences(),i.uiOverlay.syncView(),i.display()}).observe(this.gridLayer);var l=this;this.displayRect={_minx:n.minX,_maxx:n.maxX,_maxy:n.maxY,_miny:n.maxY-(n.maxX-n.minX)/this.gridLayer.width*this.gridLayer.height,get minX(){return this._minx},get maxX(){return this._maxx},get minY(){return this._miny},get maxY(){return this._maxy},set minX(e){this.setMinX(e),l.uiOverlay&&l.uiOverlay.syncView(),l.display()},set maxX(e){this.setMaxX(e),l.uiOverlay&&l.uiOverlay.syncView(),l.display()},set minY(e){this.setMinY(e),l.uiOverlay&&l.uiOverlay.syncView(),l.display()},set maxY(e){this.setMaxY(e),l.uiOverlay&&l.uiOverlay.syncView(),l.display()},setMinX:function(e){this._minx=e},setMaxX:function(e){this._maxx=e},setMinY:function(e){this._miny=e},setMaxY:function(e){this._maxy=e}},(n.maxX-n.minX)/(n.maxY-n.minY)>this.gridLayer.width/this.gridLayer.height&&(this.displayRect._maxy=n.maxY,this.displayRect._minx=n.maxX-(n.maxY-n.minY)/this.gridLayer.height*this.gridLayer.width),this.bound={_minx:n.minX,_maxx:n.maxX,_miny:n.minY,_maxy:n.maxY,get minX(){return this._minx},get maxX(){return this._maxx},get minY(){return this._miny},get maxY(){return this._maxy},set minX(e){l.uiOverlay&&l.uiOverlay.syncView(),this.setMinX(e),l.display()},set maxX(e){l.uiOverlay&&l.uiOverlay.syncView(),this.setMaxX(e),l.display()},set minY(e){l.uiOverlay&&l.uiOverlay.syncView(),this.setMinY(e),l.display()},set maxY(e){l.uiOverlay&&l.uiOverlay.syncView(),this.setMaxY(e),l.display()},setMinX:function(e){this._minx=e},setMaxX:function(e){this._maxx=e},setMinY:function(e){this._miny=e},setMaxY:function(e){this._maxy=e}},this.uiOverlay=new a.default(this),this.display()}return Object.defineProperty(e.prototype,"zoomFactor",{get:function(){return(this.displayRect.maxX-this.displayRect.minX)/(this.bound.maxX-this.bound.minX)},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"aspectLocked",{get:function(){return this.aspectLock},set:function(e){this.aspectLock=e},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"showGrids",{get:function(){return this.showGridsFlag},set:function(e){this.showGridsFlag=e,this.display()},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"resolution",{get:function(){return this._resolution},set:function(e){this._resolution=e,this.display()},enumerable:!0,configurable:!0}),e.prototype.zoomDisplay=function(){for(var e,t,i=[],n=0;n<arguments.length;n++)i[n]=arguments[n];e=i[0],t=i[1];var r=i.pop();if(1!==r&&!(r>1&&(this.displayRect.minX===this.bound.minX&&this.displayRect.maxX===this.bound.maxX||this.displayRect.minY===this.bound.minY&&this.displayRect.maxY===this.bound.maxY)||r<1&&this.uiOverlay.horizontalBar.upperRange-this.uiOverlay.horizontalBar.lowerRange<this.uiOverlay.horizontalBar.minDifference||r<1&&this.uiOverlay.verticalBar.upperRange-this.uiOverlay.verticalBar.lowerRange<this.uiOverlay.verticalBar.minDifference)){var a={minX:this.displayRect.minX-e,maxX:this.displayRect.maxX-e,minY:this.displayRect.minY-t,maxY:this.displayRect.maxY-t};a.minX*=r,a.maxX*=r,a.minY*=r,a.maxY*=r;var o={minX:a.minX+e,maxX:a.maxX+e,minY:a.minY+t,maxY:a.maxY+t};if(o.minY<this.bound.minY){var s=this.bound.minY-o.minY;if(o.minY=this.bound.minY,o.maxY+=s,o.maxY>this.bound.maxY){o.maxY=this.bound.maxX;var l=(this.bound.maxY-this.bound.minY)/this.gridLayer.height*this.gridLayer.width-(o.maxX-o.minX);o.maxX+=l/2,o.minX-=l/2}}if(o.maxY>this.bound.maxY){s=o.maxY-this.bound.maxY;if(o.maxY=this.bound.maxY,o.minY-=s,o.minY<this.bound.minY){o.minY=this.bound.minY;l=(this.bound.maxY-this.bound.minY)/this.gridLayer.height*this.gridLayer.width-(o.maxX-o.minX);o.minX+=l/2,o.minX-=l/2}}if(o.minX<this.bound.minX){s=this.bound.minX-o.minX;if(o.minX=this.bound.minX,o.maxX+=s,o.maxX>this.bound.maxX){o.maxX=this.bound.maxX;l=(this.bound.maxX-this.bound.minX)/this.gridLayer.width*this.gridLayer.height-(o.maxY-o.minY);o.maxY+=l/2,o.minY-=l/2}}if(o.maxX>this.bound.maxX){s=o.maxX-this.bound.maxX;if(o.maxX=this.bound.maxX,o.minX-=s,o.minX<this.bound.minX){o.minX=this.bound.minX;l=(this.bound.maxX-this.bound.minX)/this.gridLayer.width*this.gridLayer.height-(o.maxY-o.minY);o.maxY+=l/2,o.minY-=l/2}}this.displayRect.minX=o.minX,this.displayRect.maxX=o.maxX,this.displayRect.minY=o.minY,this.displayRect.maxY=o.maxY,this.uiOverlay.syncView(),this.display()}},e.prototype.scrollHorizontally=function(e){this.displayRect.minX+e<this.bound.minX&&(e=this.bound.minX-this.displayRect.minX),this.displayRect.maxX+e>this.bound.maxX&&(e=this.bound.maxX-this.displayRect.maxX),this.displayRect.minX+=e,this.displayRect.maxX+=e,this.uiOverlay.syncView(),this.display()},e.prototype.scrollVertically=function(e){this.displayRect.minY+e<this.bound.minY&&(e=this.bound.minY-this.displayRect.minY),this.displayRect.maxY+e>this.bound.maxY&&(e=this.bound.maxY-this.displayRect.maxY),this.displayRect.minY+=e,this.displayRect.maxY+=e,this.uiOverlay.syncView(),this.display()},e.prototype.drawGridLines=function(){var e=this,t=this.gridLayer.getContext("2d");if(t.clearRect(0,0,this.gridLayer.width,this.gridLayer.height),this.showGridsFlag){var i=Math.ceil(this.majorGridDensity*this.gridLayer.clientHeight),n=Math.ceil(this.majorGridDensity*this.gridLayer.clientWidth),r=function(t){var r=Math.max.apply(e,t);return r*i>e.displayRect.maxY-e.displayRect.minY&&r*n>e.displayRect.maxX-e.displayRect.minX},a=0,o=0,s=0,l=0,u=[0,0];for(var c in this.gridSeries){var d=Math.max.apply(this,this.gridSeries[c]),h=Math.min.apply(this,this.gridSeries[c]);if(r(this.gridSeries[c])){u=this.gridSeries[c],a=Math.ceil((this.displayRect.maxY-this.displayRect.minY)/d),o=Math.ceil((this.displayRect.maxX-this.displayRect.minX)/d),s=Math.ceil((this.displayRect.maxY-this.displayRect.minY)/h),l=Math.ceil((this.displayRect.maxX-this.displayRect.minX)/h);break}}var f=[this.gridLayer.width,this.gridLayer.height],p=f[0],v=f[1],y=Math.min.apply(this,u),m=Math.min.apply(this,u)/(this.displayRect.maxX-this.displayRect.minX)*this.gridLayer.width,g=this.p2vY(Math.ceil(this.displayRect.minY/y)*y),b=this.majorGridWidth*this.resolution,w=this.minorGridWidth*this.resolution;t.fillStyle=this.minorGridColor;for(c=0;c<s;c++)t.fillRect(0,g-c*m-w/2,p,w);var _=this.p2vX(Math.ceil(this.displayRect.minX/y)*y);for(c=0;c<l;c++)t.fillRect(_+c*m-w/2,0,w,v);var x=Math.max.apply(this,u),R=Math.max.apply(this,u)/(this.displayRect.maxX-this.displayRect.minX)*this.gridLayer.width,L=this.p2vY(Math.ceil(this.displayRect.minY/x)*x);t.fillStyle=this.majorGridColor;for(c=0;c<a;c++)t.fillRect(0,L-c*R-b/2,p,b);var C=this.p2vX(Math.ceil(this.displayRect.minX/x)*x);for(c=0;c<o;c++)t.fillRect(C+c*R-b/2,0,b,v)}},e.prototype.projectToView=function(){for(var e,t,i=[],n=0;n<arguments.length;n++)i[n]=arguments[n];if("number"==typeof i[0])e=i[0],t=i[1];else if(i[0]){var r=i[0];if(2!==r.length)throw Error("Invalid parameter "+r);e=r[0],t=r[1]}return[this.p2vX(e),this.p2vY(t)]},e.prototype.viewToProject=function(){for(var e,t,i=[],n=0;n<arguments.length;n++)i[n]=arguments[n];if("number"==typeof i[0])e=i[0],t=i[1];else if(i[0]){var r=i[0];if(2!==r.length)throw Error("Invalid parameter "+r);e=r[0],t=r[1]}return[this.v2pX(e),this.v2pY(t)]},e.prototype.destruct=function(){this.container.removeChild(this.uiOverlay.container),this.container.removeChild(this.gridLayer),this.container.removeChild(this.upperLayer),this.container.removeChild(this.lowerLayer)},e}();t.default=s},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.defaultConfig={gridSeries:[[10,2],[50,10],[100,10],[200,20]],bound:{minX:-500,maxX:1500,minY:-500,maxY:1500},majorGridDensity:.02,aspeckLocked:!0,showGrid:!0}},function(e,t,i){"use strict";var n=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)Object.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t.default=e,t};Object.defineProperty(t,"__esModule",{value:!0});var r=n(i(4));i(5);var a=function(){function e(e){var t=this;this.ctrlDownFlag=!1,this.altDownFlag=!1,this.shiftDownFlag=!1,this.mouseOver=!1,this.gridCanvas=e,this.container=document.createElement("div"),this.container.style.position="relative",this.container.style.width="100%",this.container.style.height="100%",e.container.appendChild(this.container);var i=document.createElement("div");i.className="hbar-container",i.style.height="20px",i.style.width="calc(100% - 125px)",i.style.margin="20px 40px",i.style.position="absolute",i.style.bottom="0px",i.style.zIndex="1";var n=document.createElement("div");n.id="horizontal-scrolling-bar-"+(new Date).getTime(),n.style.height="100%",n.style.width="100%",n.style.position="relative",i.appendChild(n),this.container.appendChild(i),this.horizontalBar=r.HRange.getObject(n.id),this.horizontalBar.lowerBound=0,this.horizontalBar.upperBound=1;var a=document.createElement("div");a.className="vbar-container",a.style.height="calc(100% - 120px)",a.style.width="20px",a.style.margin="40px 20px",a.style.position="absolute",a.style.right="0px",a.style.zIndex="1";var o=document.createElement("div");o.id="vertical-scrolling-bar-"+(new Date).getTime(),o.style.height="100%",o.style.width="100%",o.style.position="relative",a.appendChild(o),this.container.appendChild(a),this.verticalBar=r.VRange.getObject(o.id),this.verticalBar.lowerBound=0,this.verticalBar.upperBound=1;var s=this.buttonContainer=document.createElement("div");s.className="button-container",s.style.width="42px",s.style.height="42px",s.style.position="absolute",s.style.right="0px",s.style.bottom="0px",s.style.margin="16px",s.style.zIndex="1";var l=this.gridButton=document.createElement("button");l.className="grid-button",e.showGrids?l.classList.add("grid-on"):l.classList.add("grid-off"),l.style.width="42px",l.style.height="42px",l.innerHTML='\n  <svg version="1.1" class="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n  viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">\n    <rect x="10" y="10" width="24" height="24"/>\n    <rect x="40" y="10" width="24" height="24"/>\n    <rect x="70" y="10" width="24" height="24"/>\n    <rect x="10" y="40" width="24" height="24"/>\n    <rect x="40" y="40" width="24" height="24"/>\n    <rect x="70" y="40" width="24" height="24"/>\n    <rect x="10" y="70" width="24" height="24"/>\n    <rect x="40" y="70" width="24" height="24"/>\n    <rect x="70" y="70" width="24" height="24"/>\n  </svg>',l.style.lineHeight="120%",l.style.textAlign="center",l.addEventListener("click",function(t){e.showGrids=!e.showGrids,e.showGrids?l.classList.replace("grid-off","grid-on"):l.classList.replace("grid-on","grid-off")}),s.appendChild(l),this.container.appendChild(s),this.updateDifferences(),this.horizontalBar.addLowerRangeChangeCallback(function(e){t.syncViewByHorizontal()}),this.horizontalBar.addUpperRangeChangeCallback(function(e){t.syncViewByHorizontal()}),this.verticalBar.addLowerRangeChangeCallback(function(e){t.syncViewByVertical()}),this.verticalBar.addUpperRangeChangeCallback(function(e){t.syncViewByVertical()});var u=!1;window.navigator.userAgent.search("Mac")>0&&(u=!0),this.eventActiveArea=document.createElement("div"),this.eventActiveArea.style.position="relative",this.eventActiveArea.style.width="100%",this.eventActiveArea.style.height="100%",this.eventActiveArea.style.zIndex="0",this.container.appendChild(this.eventActiveArea),this.eventActiveArea.addEventListener("mouseover",function(e){return t.mouseOver=!0}),this.eventActiveArea.addEventListener("mouseout",function(e){return t.mouseOver=!1}),window.addEventListener("keydown",function(e){t.mouseOver?("Alt"===e.key&&(t.altDownFlag=!0),"Shift"===e.key&&(t.shiftDownFlag=!0),u?"Meta"===e.key&&(t.ctrlDownFlag=!0):"Control"===e.key&&(t.ctrlDownFlag=!0)):(t.altDownFlag=!1,t.shiftDownFlag=!1,t.ctrlDownFlag=!1)}),window.addEventListener("keyup",function(e){t.mouseOver?("Alt"===e.key&&(t.altDownFlag=!1),"Shift"===e.key&&(t.shiftDownFlag=!1),u?"Meta"===e.key&&(t.ctrlDownFlag=!1):"Control"===e.key&&(t.ctrlDownFlag=!1)):(t.altDownFlag=!1,t.shiftDownFlag=!1,t.ctrlDownFlag=!1)}),this.eventActiveArea.addEventListener("wheel",function(i){i.preventDefault();var n=e.zoomFactor;if(t.altDownFlag){var r=i.deltaY,a=[i.offsetX*t.gridCanvas.resolution,i.offsetY*t.gridCanvas.resolution],o=a[0],s=a[1];e.zoomDisplay(e.v2pX(o),e.v2pY(s),Math.exp(r/400))}else if(t.shiftDownFlag){0===(r=i.deltaY/n)&&(r=i.deltaX/n),e.scrollHorizontally(r)}else{r=-i.deltaY/n;e.scrollVertically(r)}})}return e.prototype.updateDifferences=function(){var e=this.gridCanvas,t=e.gridLayer.width/(e.bound.maxX-e.bound.minX),i=e.gridLayer.height/(e.bound.maxY-e.bound.minY);t>i?(this.horizontalBar.relativeMinDifference=.1*t/i,this.horizontalBar.relativeMaxDifference=1,this.verticalBar.relativeMinDifference=.1,this.verticalBar.relativeMaxDifference=1*i/t):(this.horizontalBar.relativeMinDifference=.1,this.horizontalBar.relativeMaxDifference=1*t/i,this.verticalBar.relativeMinDifference=.1*i/t,this.verticalBar.relativeMaxDifference=1)},e.prototype.syncView=function(){var e=this.gridCanvas,t=e.bound.maxX-e.bound.minX,i=e.bound.maxY-e.bound.minY,n=(e.displayRect.minX-e.bound.minX)/t,r=(e.displayRect.maxX-e.bound.minX)/t,a=(e.bound.maxY-e.displayRect.maxY)/i,o=(e.bound.maxY-e.displayRect.minY)/i;this.horizontalBar.setLowerRange(n),this.horizontalBar.setUpperRange(r),this.verticalBar.setLowerRange(a),this.verticalBar.setUpperRange(o)},e.prototype.syncViewByHorizontal=function(){var e=this.gridCanvas,t=this.horizontalBar.lowerRange,i=this.horizontalBar.upperRange,n=t*(e.bound.maxX-e.bound.minX)+e.bound.minX,r=i*(e.bound.maxX-e.bound.minX)+e.bound.minX;if(e.displayRect.setMinX(n),e.displayRect.setMaxX(r),e.aspectLocked){var a=(r-n)/(e.gridLayer.width/e.gridLayer.height),o=(e.displayRect.minY+e.displayRect.maxY)/2;o-a/2<e.bound.minY?(e.displayRect.setMinY(e.bound.minY),e.displayRect.setMaxY(e.bound.minY+a),e.display()):o+a/2>e.bound.maxY?(e.displayRect.setMinY(e.bound.maxY-a),e.displayRect.setMaxY(e.bound.maxY),e.display()):(e.displayRect.setMinY(o-a/2),e.displayRect.setMaxY(o+a/2),e.display())}this.verticalBar.setLowerRange((e.bound.maxY-e.displayRect.maxY)/(e.bound.maxY-e.bound.minY)),this.verticalBar.setUpperRange((e.bound.maxY-e.displayRect.minY)/(e.bound.maxY-e.bound.minY))},e.prototype.syncViewByVertical=function(){var e=this.gridCanvas,t=1-this.verticalBar.upperRange,i=1-this.verticalBar.lowerRange,n=t*(e.bound.maxY-e.bound.minY)+e.bound.minY,r=i*(e.bound.maxY-e.bound.minY)+e.bound.minY;if(e.displayRect.setMinY(n),e.displayRect.setMaxY(r),e.aspectLocked){var a=(r-n)*(e.gridLayer.width/e.gridLayer.height),o=(e.displayRect.minX+e.displayRect.maxX)/2;o-a/2<e.bound.minX?(e.displayRect.setMinX(e.bound.minX),e.displayRect.setMaxX(e.bound.minX+a),e.display()):o+a/2>e.bound.maxX?(e.displayRect.setMinX(e.bound.maxX-a),e.displayRect.setMaxX(e.bound.maxX),e.display()):(e.displayRect.setMinX(o-a/2),e.displayRect.setMaxX(o+a/2),e.display())}this.horizontalBar.setLowerRange((e.displayRect.minX-e.bound.minX)/(e.bound.maxX-e.bound.minX)),this.horizontalBar.setUpperRange((e.displayRect.maxX-e.bound.minX)/(e.bound.maxX-e.bound.minX))},e}();t.default=a},function(e,t,i){window,e.exports=function(e){var t={};function i(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,i),r.l=!0,r.exports}return i.m=e,i.c=t,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=7)}([function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var i=function(e,t){var i=e[1]||"",n=e[3];if(!n)return i;if(t&&"function"==typeof btoa){var r=function(e){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(e))))+" */"}(n),a=n.sources.map(function(e){return"/*# sourceURL="+n.sourceRoot+e+" */"});return[i].concat(a).concat([r]).join("\n")}return[i].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+i+"}":i}).join("")},t.i=function(e,i){"string"==typeof e&&(e=[[null,e,""]]);for(var n={},r=0;r<this.length;r++){var a=this[r][0];"number"==typeof a&&(n[a]=!0)}for(r=0;r<e.length;r++){var o=e[r];"number"==typeof o[0]&&n[o[0]]||(i&&!o[2]?o[2]=i:i&&(o[2]="("+o[2]+") and ("+i+")"),t.push(o))}},t}},function(e,t,i){var n={},r=function(e){var t;return function(){return void 0===t&&(t=function(){return window&&document&&document.all&&!window.atob}.apply(this,arguments)),t}}(),a=function(e){var t={};return function(e,i){if("function"==typeof e)return e();if(void 0===t[e]){var n=function(e,t){return t?t.querySelector(e):document.querySelector(e)}.call(this,e,i);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}t[e]=n}return t[e]}}(),o=null,s=0,l=[],u=i(4);function c(e,t){for(var i=0;i<e.length;i++){var r=e[i],a=n[r.id];if(a){a.refs++;for(var o=0;o<a.parts.length;o++)a.parts[o](r.parts[o]);for(;o<r.parts.length;o++)a.parts.push(y(r.parts[o],t))}else{var s=[];for(o=0;o<r.parts.length;o++)s.push(y(r.parts[o],t));n[r.id]={id:r.id,refs:1,parts:s}}}}function d(e,t){for(var i=[],n={},r=0;r<e.length;r++){var a=e[r],o=t.base?a[0]+t.base:a[0],s={css:a[1],media:a[2],sourceMap:a[3]};n[o]?n[o].parts.push(s):i.push(n[o]={id:o,parts:[s]})}return i}function h(e,t){var i=a(e.insertInto);if(!i)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var n=l[l.length-1];if("top"===e.insertAt)n?n.nextSibling?i.insertBefore(t,n.nextSibling):i.appendChild(t):i.insertBefore(t,i.firstChild),l.push(t);else if("bottom"===e.insertAt)i.appendChild(t);else{if("object"!=typeof e.insertAt||!e.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var r=a(e.insertAt.before,i);i.insertBefore(t,r)}}function f(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=l.indexOf(e);t>=0&&l.splice(t,1)}function p(e){var t=document.createElement("style");if(void 0===e.attrs.type&&(e.attrs.type="text/css"),void 0===e.attrs.nonce){var n=i.nc;n&&(e.attrs.nonce=n)}return v(t,e.attrs),h(e,t),t}function v(e,t){Object.keys(t).forEach(function(i){e.setAttribute(i,t[i])})}function y(e,t){var i,n,r,a;if(t.transform&&e.css){if(!(a=t.transform(e.css)))return function(){};e.css=a}if(t.singleton){var l=s++;i=o||(o=p(t)),n=g.bind(null,i,l,!1),r=g.bind(null,i,l,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(i=function(e){var t=document.createElement("link");return void 0===e.attrs.type&&(e.attrs.type="text/css"),e.attrs.rel="stylesheet",v(t,e.attrs),h(e,t),t}(t),n=function(e,t,i){var n=i.css,r=i.sourceMap,a=void 0===t.convertToAbsoluteUrls&&r;(t.convertToAbsoluteUrls||a)&&(n=u(n)),r&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var o=new Blob([n],{type:"text/css"}),s=e.href;e.href=URL.createObjectURL(o),s&&URL.revokeObjectURL(s)}.bind(null,i,t),r=function(){f(i),i.href&&URL.revokeObjectURL(i.href)}):(i=p(t),n=function(e,t){var i=t.css,n=t.media;if(n&&e.setAttribute("media",n),e.styleSheet)e.styleSheet.cssText=i;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(i))}}.bind(null,i),r=function(){f(i)});return n(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;n(e=t)}else r()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||"boolean"==typeof t.singleton||(t.singleton=r()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var i=d(e,t);return c(i,t),function(e){for(var r=[],a=0;a<i.length;a++){var o=i[a];(s=n[o.id]).refs--,r.push(s)}for(e&&c(d(e,t),t),a=0;a<r.length;a++){var s;if(0===(s=r[a]).refs){for(var l=0;l<s.parts.length;l++)s.parts[l]();delete n[s.id]}}}};var m=function(){var e=[];return function(t,i){return e[t]=i,e.filter(Boolean).join("\n")}}();function g(e,t,i,n){var r=i?"":n.css;if(e.styleSheet)e.styleSheet.cssText=m(t,r);else{var a=document.createTextNode(r),o=e.childNodes;o[t]&&e.removeChild(o[t]),o.length?e.insertBefore(a,o[t]):e.appendChild(a)}}},function(e,t,i){var n=i(3);"string"==typeof n&&(n=[[e.i,n,""]]),i(1)(n,{hmr:!0,transform:void 0,insertInto:void 0}),n.locals&&(e.exports=n.locals)},function(e,t,i){(e.exports=i(0)(!1)).push([e.i,".dual-background, .dual-container,\n.dual-slider {\n    -webkit-touch-callout: none;\n    -webkit-user-select: none;\n    -khtml-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n    touch-action: none;\n}\n\n.dual-background {\n    width: 100%;\n    height: 100%;\n    position: relative;\n    margin: auto;\n    z-index: 1;\n}\n.dual-horizontal.dual-background {\n    top: 50%;\n    transform: translateY(-50%);\n}\n\n.dual-range, .dual-container {\n    display: inline-block;\n    position: absolute;\n}\n.dual-range.dual-container {\n    z-index: 2;\n}\n.dual-first.dual-container,\n.dual-last.dual-container {\n    z-index: 3;\n}\n.dual-vertical.dual-container {\n    text-align: center;\n}\n\n.dual-slider {\n    top: 50%;\n    margin: auto;\n}\n.dual-horizontal.dual-first.dual-slider,\n.dual-horizontal.dual-last.dual-slider {\n    position: absolute;\n    transform: translateX(-50%) translateY(-50%);\n    cursor: ew-resize;\n}\n.dual-horizontal.dual-range.dual-slider {\n    position: absolute;\n    top: 50%;\n    transform: translateY(-50%);\n    width: 100%;\n    cursor: move;\n}\n.dual-vertical.dual-slider {\n    position: relative;\n    cursor: ns-resize;\n}\n.dual-vertical.dual-range.dual-slider {\n    position: absolute;\n    top: 0%;\n    transform: translateX(-50%);\n    height: 100%;\n    cursor: move;\n}",""])},function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var i=t.protocol+"//"+t.host,n=i+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(e,t){var r,a=t.trim().replace(/^"(.*)"$/,function(e,t){return t}).replace(/^'(.*)'$/,function(e,t){return t});return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(a)?e:(r=0===a.indexOf("//")?a:0===a.indexOf("/")?i+a:n+a.replace(/^\.\//,""),"url("+JSON.stringify(r)+")")})}},function(e,t,i){var n=i(6);"string"==typeof n&&(n=[[e.i,n,""]]),i(1)(n,{hmr:!0,transform:void 0,insertInto:void 0}),n.locals&&(e.exports=n.locals)},function(e,t,i){(e.exports=i(0)(!1)).push([e.i,".dual-slider {\n    background-color: #1E88A8;\n    outline: none;\n    border: none;\n    width: 20px;\n    height: 20px;\n    border-radius: 10px;\n}\n.dual-first.dual-slider:not(:active),\n.dual-last.dual-slider:not(:active) {\n    transition: all 250ms;\n}\n.dual-first.dual-horizontal.dual-slider:active,\n.dual-last.dual-horizontal.dual-slider:active {\n    transform: scale(1.2,1.2) translateX(-40%) translateY(-40%);\n    transition: all 100ms;\n}\n.dual-first.dual-vertical.dual-slider:active,\n.dual-last.dual-vertical.dual-slider:active {\n    transform: scale(1.2,1.2);\n    transition: all 100ms;\n}\n.dual-range.dual-slider:not(:active) {\n    background-color: #7DB9DE;\n    transition: all 1000ms;\n}\n.dual-range.dual-slider:active {\n    background-color: #27A2C5;\n    transition: all 500ms;\n}\n.dual-horizontal.dual-range.dual-slider {\n    height: 12px;\n}\n.dual-vertical.dual-range.dual-slider {\n    width: 12px;\n}\n\n.dual-background {\n    background-color: rgba(200, 200, 200, 0.7);\n    border-radius: 4px;\n}\n.dual-horizontal.dual-background {\n    height: 8px;\n}\n.dual-vertical.dual-background {\n    width: 8px;\n}\n",""])},function(e,t,i){"use strict";i.r(t),i(2),i(5);var n={hrangeClassName:"dual-hrange",vrangeClassName:"dual-vrange",backgroundClass:"dual-background",firstClass:"dual-first",rangeClass:"dual-range",lastClass:"dual-last",containerClass:"dual-container",sliderClass:"dual-slider",horizontalClass:"dual-horizontal",verticalClass:"dual-vertical",lowerBoundAtt:"lower-bound",upperBoundAtt:"upper-bound",minDiffAtt:"min-difference",maxDiffAtt:"max-difference"};function r(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var a=function(){function e(t){var i=this;if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),"string"==typeof t&&(t=document.getElementById(t)),this.htmlElement=t,e.dict||(e.dict={}),!e.dict[t.id]){e.dict[t.id]=this;var r=this.dualRangeElement=t;r.style.textAlign="left",this.backgroundDiv=document.createElement("div"),this.backgroundDiv.classList.add(n.backgroundClass),this.firstSliderContainer=document.createElement("div"),this.firstSliderContainer.classList.add(n.firstClass,n.containerClass),this.firstSlider=this.firstSliderContainer.appendChild(document.createElement("button")),this.firstSlider.classList.add(n.firstClass,n.sliderClass),this.rangeSliderContainer=document.createElement("div"),this.rangeSliderContainer.classList.add(n.rangeClass,n.containerClass),this.rangeSlider=this.rangeSliderContainer.appendChild(document.createElement("button")),this.rangeSlider.classList.add(n.rangeClass,n.sliderClass),this.lastSliderContainer=document.createElement("div"),this.lastSliderContainer.classList.add(n.lastClass,n.containerClass),this.lastSlider=this.lastSliderContainer.appendChild(document.createElement("button")),this.lastSlider.classList.add(n.lastClass,n.sliderClass),this._lowerBound=a(n.lowerBoundAtt,0),this._upperBound=a(n.upperBoundAtt,1),this._relativeLower=0,this._relativeUpper=1,this._setLowerBoundCallbacks=[],this._setUpperBoundCallbacks=[],this._setLowerRangeCallbacks=[],this._setUpperRangeCallbacks=[],this._minDifference=a(n.minDiffAtt,.1),this._maxDifference=a(n.maxDiffAtt,1),this._relativeMinDifference=Math.abs(this._minDifference/(this._upperBound-this._lowerBound)),this._relativeMaxDifference=Math.abs(this._maxDifference/(this._upperBound-this._lowerBound)),this._relativeUpper-this._relativeLower>this._relativeMaxDifference&&(this._relativeUpper=this._relativeLower+this._relativeMaxDifference),(this._relativeMinDifference<.05||this._relativeMinDifference>1)&&(console.warn("Invalid setting of ".concat(n.minDiffAtt,", restored to default 0.1")),this._relativeMinDifference=.1,this._minDifference=_relativeMinDifference*(this._upperBound-this._lowerBound)),(this._relativeMaxDifference<.05||this._relativeMaxDifference>1)&&(console.warn("Invalid setting of ".concat(n.maxDiffAtt,", restored to default 0.1")),this._relativeMaxDifference=.1,this._maxDifference=_relativeMaxDifference*(this._upperBound-this._lowerBound)),this._setMinDifferenceChangeCallbacks=[],this._setMaxDifferenceChangeCallbacks=[],this._setRelativeMinDifferenceChangeCallbacks=[],this._setRelativeMaxDifferenceChangeCallbacks=[],window.addEventListener("resize",function(){i.updatePositions.call(i)}),window.addEventListener("scroll",function(){i.updatePositions.call(i)}),document.addEventListener("touchstart",function(){i.updatePositions.call(i)}),document.addEventListener("touchmove",function(){i.updatePositions.call(i)}),document.addEventListener("touchend",function(){setTimeout(i.updatePositions.call(i),500)}),r.addEventListener("change",function(){i.updatePositions.call(i)}),this._bindMouseEvents(),this.addLowerRangeChangeCallback(function(e){i.updateFirstPosition(e),i.updateRange(e,null)}),this.addUpperRangeChangeCallback(function(e){i.updateLastPosition(e),i.updateRange(null,e)}),this.addLowerBoundChangeCallback(function(e){i.updatePositions()}),this.addUpperBoundChangeCallback(function(e){i.updatePositions()})}function a(e,t){var i=r.getAttribute(e);return i&&(i=Number.parseFloat(i),!isNaN(i))?i:t}}return function(e,t,i){t&&r(e.prototype,t),i&&r(e,i)}(e,[{key:"setLowerBound",value:function(e){this._lowerBound=e,this.updatePositions()}},{key:"setUpperBound",value:function(e){this._upperBound=e,this.updatePositions()}},{key:"setLowerRange",value:function(e){this._relativeLower=(e-this._lowerBound)/(this._upperBound-this._lowerBound),this.updatePositions()}},{key:"setUpperRange",value:function(e){this._relativeUpper=(e-this._lowerBound)/(this._upperBound-this._lowerBound),this.updatePositions()}},{key:"setMinDifference",value:function(e){this._minDifference=e,this._relativeMinDifference=Math.abs(e/(this._upperBound-this._lowerBound)),this.updatePositions()}},{key:"setMaxDifference",value:function(e){this._maxDifference=e,this._relativeMaxDifference=Math.abs(e/(this._upperBound-this._lowerBound)),this.updatePositions()}},{key:"setRelativeMaxDifference",value:function(e){this._relativeMaxDifference=e,this._maxDifference=(this._upperBound-this.lowerBound)*e,this.updatePositions()}},{key:"setRelativeMaxDifference",value:function(e){this._relativeMaxDifference=e,this._maxDifference=(this._upperBound-this.lowerBound)*e,this.updatePositions()}},{key:"setRelativeLower",value:function(e){this._relativeLower=e,this.updatePositions()}},{key:"setRelativeUpper",value:function(e){this._relativeUpper=e,this.updatePositions()}},{key:"_bindMouseEvents",value:function(){var e=this;this._latestMouseActiveValue=null,this._firstMouseDown=!1,this._rangeMouseDown=!1,this._lastMouseDown=!1,this._firstMouseOn=!1,this._rangeMouseOn=!1,this._lastMouseOn=!1,this.firstSlider.addEventListener("mouseenter",function(t){e._firstMouseOn=!0}),this.firstSlider.addEventListener("touchstart",function(t){t.preventDefault(),e._firstMouseOn=!0}),this.rangeSlider.addEventListener("mouseenter",function(t){e._rangeMouseOn=!0}),this.rangeSlider.addEventListener("touchstart",function(t){t.preventDefault(),e._rangeMouseOn=!0}),this.lastSlider.addEventListener("mouseenter",function(t){e._lastMouseOn=!0}),this.lastSlider.addEventListener("touchstart",function(t){t.preventDefault(),e._lastMouseOn=!0}),this.firstSlider.addEventListener("mouseleave",function(t){e._firstMouseOn=!1}),this.firstSlider.addEventListener("touchend",function(t){e._firstMouseOn=!1}),this.rangeSlider.addEventListener("mouseleave",function(t){e._rangeMouseOn=!1}),this.rangeSlider.addEventListener("touchend",function(t){e._rangeMouseOn=!1}),this.lastSlider.addEventListener("mouseleave",function(t){e._lastMouseOn=!1}),this.lastSlider.addEventListener("touchend",function(t){e._lastMouseOn=!1});var t=function(t){e._latestMouseActiveValue=e.getMouseValue(t);var i=[e._firstMouseOn,e._rangeMouseOn,e._lastMouseOn];e._firstMouseDown=i[0],e._rangeMouseDown=i[1],e._lastMouseDown=i[2]};window.addEventListener("mousedown",t),window.addEventListener("touchstart",t);var i=function(t){["_firstMouseDown","_rangeMouseDown","_lastMouseDown"].map(function(t){e[t]=!1})};window.addEventListener("mouseup",i),window.addEventListener("touchend",i);var n=function(t){if(e._firstMouseDown&&((i=e.getMouseValue(t))<0?e.relativeLower=0:i>e._relativeUpper-e._relativeMinDifference?i<=1-e.relativeMinDifference?(e.relativeLower=i,e.relativeUpper=i+e._relativeMinDifference):e._relativeLower=e._relativeUpper-e._relativeMinDifference:i<e._relativeUpper-e._relativeMaxDifference?(e.relativeLower=i,e.relativeUpper=i+e._relativeMaxDifference):e.relativeLower=i),e._rangeMouseDown){var i,n=(i=e.getMouseValue(t))-e._latestMouseActiveValue;e._latestMouseActiveValue=i,e._relativeLower+n<0?(e.relativeUpper=e._relativeUpper-e._relativeLower,e.relativeLower=0):e._relativeUpper+n>1?(e.relativeLower=1-(e._relativeUpper-e._relativeLower),e.relativeUpper=1):(e.relativeLower=e._relativeLower+n,e.relativeUpper=e._relativeUpper+n)}e._lastMouseDown&&((i=e.getMouseValue(t))>1?e.relativeUpper=1:i<e._relativeLower+e._relativeMinDifference?i>=e._relativeMinDifference?(e.relativeUpper=i,e.relativeLower=i-e._relativeMinDifference):e.relativeUpper=e._relativeLower+e._relativeMinDifference:i>e._relativeLower+e._relativeMaxDifference?(e.relativeUpper=i,e.relativeLower=i-e._relativeMaxDifference):e.relativeUpper=i)};window.addEventListener("mousemove",n),window.addEventListener("touchmove",n);var r=function(t){t.preventDefault();var i=e.getMouseValue(t),n=(t.wheelDelta||120*-t.detail||120*-t.deltaY)/1e3,r=e._relativeLower+(i-e._relativeLower)*n,a=e._relativeUpper-(e._relativeUpper-i)*n;r<0&&(r=0),a>1&&(a=1),a-r<e._relativeMinDifference?(r=a-e._relativeMinDifference)<0&&(r=0,a=e._relativeMinDifference):a-r>e._relativeMaxDifference&&(r=a-e._relativeMaxDifference,a>1&&(a=1,r=1-e._relativeMaxDifference)),e.relativeLower=r,e.relativeUpper=a};this.rangeSlider.addEventListener("mousewheel",r),this.rangeSlider.addEventListener("DOMMouseScroll",r);var a=function(t){t.preventDefault();var i=(-t.wheelDelta||120*t.detail||120*t.deltaY)/2500,n=e._relativeLower+i,r=e._relativeUpper+i;n<0&&(n=0,r=e._relativeUpper-e._relativeLower),r>1&&(r=1,n=1-(e._relativeUpper-e._relativeLower)),e.relativeLower=n,e.relativeUpper=r};this.backgroundDiv.addEventListener("mousewheel",a),this.backgroundDiv.addEventListener("DOMMouseScroll",a)}},{key:"addLowerRangeChangeCallback",value:function(e){this._setLowerRangeCallbacks.push(e)}},{key:"addUpperRangeChangeCallback",value:function(e){this._setUpperRangeCallbacks.push(e)}},{key:"addLowerBoundChangeCallback",value:function(e){this._setLowerBoundCallbacks.push(e)}},{key:"addUpperBoundChangeCallback",value:function(e){this._setUpperBoundCallbacks.push(e)}},{key:"addMinDifferenceChangeCallback",value:function(e){this._setMinDifferenceChangeCallbacks.push(e)}},{key:"addMaxDifferenceChangeCallback",value:function(e){this._setMaxDifferenceChangeCallbacks.push(e)}},{key:"addRelativeMinDifferenceChangeCallback",value:function(e){this._setRelativeMinDifferenceChangeCallbacks.push(e)}},{key:"addRelativeMaxDifferenceChangeCallback",value:function(e){this._setRelativeMaxDifferenceChangeCallbacks.push(e)}},{key:"removeLowerRangeChangeCallback",value:function(e){var t=this._setLowerRangeCallbacks,i=t.indexOf(e);-1!==i&&t.splice(i,1)}},{key:"removeUpperRangeChangeCallback",value:function(e){var t=this._setUpperRangeCallbacks,i=t.indexOf(e);-1!==i&&t.splice(i,1)}},{key:"removeLowerBoundChangeCallback",value:function(e){var t=this._setLowerBoundCallbacks,i=t.indexOf(e);-1!==i&&t.splice(i,1)}},{key:"removeUpperBoundChangeCallback",value:function(e){var t=this._setUpperBoundCallbacks,i=t.indexOf(e);-1!==i&&t.splice(i,1)}},{key:"removeMinDifferenceChangeCallback",value:function(e){var t=this._setMinDifferenceChangeCallbacks,i=t.indexOf(e);-1!==i&&t.splice(i,1)}},{key:"removeMaxDifferenceChangeCallback",value:function(e){var t=this._setMaxDifferenceChangeCallbacks,i=t.indexOf(e);-1!==i&&t.splice(i,1)}},{key:"removeRelativeMinDifferenceChangeCallback",value:function(e){var t=this._setRelativeMinDifferenceChangeCallbacks,i=t.indexOf(e);-1!==i&&t.splice(i,1)}},{key:"removeRelativeMaxDifferenceChangeCallback",value:function(e){var t=this._setRelativeMaxDifferenceChangeCallbacks,i=t.indexOf(e);-1!==i&&t.splice(i,1)}},{key:"createInHrangeElements",value:function(){this.dualRangeElement.appendChild(this.backgroundDiv),this.dualRangeElement.appendChild(this.firstSliderContainer),this.dualRangeElement.appendChild(this.rangeSliderContainer),this.dualRangeElement.appendChild(this.lastSliderContainer)}},{key:"updatePositions",value:function(){this.updateFirstPosition(this._relativeLower),this.updateRange(this._relativeLower,this._relativeUpper),this.updateLastPosition(this._relativeUpper)}},{key:"updateFirstPosition",value:function(e){}},{key:"updateRange",value:function(e,t){}},{key:"updateLastPosition",value:function(e){}},{key:"getMouseValue",value:function(e){return 0}},{key:"lowerBound",get:function(){return this._lowerBound},set:function(e){this._lowerBound=e,this._setLowerBoundCallbacks.forEach(function(t){t.apply(window,[e])}),this.updatePositions()}},{key:"upperBound",get:function(){return this._upperBound},set:function(e){this._upperBound=e,this._setUpperBoundCallbacks.forEach(function(t){t.apply(window,[e])}),this.updatePositions()}},{key:"lowerRange",get:function(){return this._relativeLower*(this._upperBound-this._lowerBound)+this._lowerBound},set:function(e){this._relativeLower=(e-this._lowerBound)/(this._upperBound-this._lowerBound),this._setLowerRangeCallbacks.forEach(function(t){t.apply(window,[e])}),this.updatePositions()}},{key:"upperRange",get:function(){return this._relativeUpper*(this._upperBound-this._lowerBound)+this._lowerBound},set:function(e){this._relativeUpper=(e-this._lowerBound)/(this._upperBound-this._lowerBound),this._setUpperRangeCallbacks.forEach(function(t){t.apply(window,[e])}),this.updatePositions()}},{key:"minDifference",get:function(){return this._minDifference},set:function(e){this._minDifference=e,this._relativeMinDifference=Math.abs(e/(this._upperBound-this._lowerBound)),this._setMinDifferenceChangeCallbacks.forEach(function(t){t.apply(window,[e])}),this.updatePositions()}},{key:"maxDifference",get:function(){return this._maxDifference},set:function(e){this._maxDifference=e,this._relativeMaxDifference=Math.abs(e/(this._upperBound-this._lowerBound)),this._setMaxDifferenceChangeCallbacks.forEach(function(t){t.apply(window,[e])}),this._relativeUpper-this._relativeLower>this._relativeMaxDifference&&(this.relativeUpper=this._relativeLower+this._relativeMaxDifference),this.updatePositions()}},{key:"relativeMinDifference",get:function(){return this._relativeMinDifference},set:function(e){this._relativeMinDifference=e,this._minDifference=(this._upperBound-this.lowerBound)*e,this._setRelativeMinDifferenceChangeCallbacks.forEach(function(t){t.apply(window,[e])}),this.updatePositions()}},{key:"relativeMaxDifference",get:function(){return this._relativeMaxDifference},set:function(e){this._relativeMaxDifference=e,this._maxDifference=(this._upperBound-this.lowerBound)*e,this._setRelativeMaxDifferenceChangeCallbacks.forEach(function(t){t.apply(window,[e])}),this._relativeUpper-this._relativeLower>this._relativeMaxDifference&&(this.relativeUpper=this._relativeLower+this._relativeMaxDifference),this.updatePositions()}},{key:"relativeLower",get:function(){return this._relativeLower},set:function(e){this._relativeLower=e,this._setLowerRangeCallbacks.forEach(function(t){t.apply(window,[e])}),this.updatePositions()}},{key:"relativeUpper",get:function(){return this._relativeUpper},set:function(e){this._relativeUpper=e,this._setUpperRangeCallbacks.forEach(function(t){t.apply(window,[e])}),this.updatePositions()}}],[{key:"getObject",value:function(t){if(e.dict||(e.dict={}),void 0!==e.dict[t])return e.dict[t];var i=document.getElementById(t);return i.classList.contains(dualHrangeClassName)?new DualHRange(t):i.classList.contains(dualVrangeClassName)?new DualVRange(t):null}},{key:"_getOffsetY",value:function(e){var t=e.getBoundingClientRect(),i=document.body,n=document.documentElement,r=n.clientTop||i.clientTop||0,a=window.pageYOffset||n.scrollTop||i.scrollTop;return Math.round(t.top+a-r)}},{key:"_getOffsetX",value:function(e){var t=e.getBoundingClientRect(),i=document.body,n=document.documentElement,r=n.clientLeft||i.clientLeft||0,a=window.pageXOffset||n.scrollLeft||i.scrollLeft;return Math.round(t.left+a-r)}}]),e}();function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function s(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function l(e,t){return!t||"object"!==o(t)&&"function"!=typeof t?u(e):t}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function d(e,t,i){return(d="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,i){var n=function(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=h(e)););return e}(e,t);if(n){var r=Object.getOwnPropertyDescriptor(n,t);return r.get?r.get.call(i):r.value}})(e,t,i||e)}function h(e){return(h=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var f=function(e){function t(e){var i;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),i=l(this,h(t).call(this,e)),a.dict[e.id]?l(i):([i.backgroundDiv,i.firstSliderContainer,i.firstSlider,i.rangeSliderContainer,i.rangeSlider,i.lastSliderContainer,i.lastSlider].forEach(function(e){return e.classList.add(n.horizontalClass)}),d(h(t.prototype),"createInHrangeElements",u(i)).call(u(i)),d(h(t.prototype),"updatePositions",u(i)).call(u(i)),i)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}(t,a),function(e,t,i){t&&s(e.prototype,t),i&&s(e,i)}(t,[{key:"_updateHorizontalPosition",value:function(e,t){var i=this.dualRangeElement.clientWidth,n=this.dualRangeElement.clientHeight,r=e*i-this.firstSliderContainer.clientWidth/2;t.style.top="0px",t.style.left="".concat(r,"px"),t.style.height="".concat(n,"px")}},{key:"updateFirstPosition",value:function(e){this._updateHorizontalPosition(e,this.firstSliderContainer)}},{key:"updateLastPosition",value:function(e){this._updateHorizontalPosition(e,this.lastSliderContainer)}},{key:"updateRange",value:function(e,t){if("number"==typeof e&&!isNaN(e)){var i=this.rangeSliderContainer.offsetLeft+this.rangeSliderContainer.clientWidth,n=e*this.dualRangeElement.clientWidth,r=i-n;this.rangeSliderContainer.style.left="".concat(n,"px"),this.rangeSliderContainer.style.width="".concat(r,"px")}if("number"==typeof t&&!isNaN(t)){var a=this.rangeSliderContainer.offsetLeft,o=t*this.dualRangeElement.clientWidth-a;this.rangeSliderContainer.style.width="".concat(o,"px")}this.rangeSliderContainer.style.top="0px",this.rangeSliderContainer.style.height="".concat(this.dualRangeElement.clientHeight,"px")}},{key:"getMouseValue",value:function(e){return((e.touches?e.touches.item(0).pageX:e.pageX)-a._getOffsetX(this.dualRangeElement))/this.dualRangeElement.clientWidth}}],[{key:"getObject",value:function(e){return a.dict||(a.dict={}),void 0!==a.dict[e]?a.dict[e]:new t(e)}}]),t}();function p(e){return(p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function v(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function y(e,t){return!t||"object"!==p(t)&&"function"!=typeof t?m(e):t}function m(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function g(e,t){return(g=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function b(e,t,i){return(b="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,i){var n=function(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=w(e)););return e}(e,t);if(n){var r=Object.getOwnPropertyDescriptor(n,t);return r.get?r.get.call(i):r.value}})(e,t,i||e)}function w(e){return(w=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var _=function(e){function t(e){var i;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),i=y(this,w(t).call(this,e)),a.dict[e.id]?y(i):([i.backgroundDiv,i.firstSliderContainer,i.firstSlider,i.rangeSliderContainer,i.rangeSlider,i.lastSliderContainer,i.lastSlider].forEach(function(e){return e.classList.add(n.verticalClass)}),b(w(t.prototype),"createInHrangeElements",m(i)).call(m(i)),b(w(t.prototype),"updatePositions",m(i)).call(m(i)),i)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&g(e,t)}(t,a),function(e,t,i){t&&v(e.prototype,t),i&&v(e,i)}(t,[{key:"_updateVerticalPosition",value:function(e,t){var i=this.dualRangeElement.clientWidth,n=e*this.dualRangeElement.clientHeight-this.firstSliderContainer.clientHeight/2;t.style.top="".concat(n,"px"),t.style.left="0px",t.style.width="".concat(i,"px")}},{key:"updateFirstPosition",value:function(e){this._updateVerticalPosition(e,this.firstSliderContainer)}},{key:"updateLastPosition",value:function(e){this._updateVerticalPosition(e,this.lastSliderContainer)}},{key:"updateRange",value:function(e,t){if("number"==typeof e&&!isNaN(e)){var i=this.rangeSliderContainer.offsetTop+this.rangeSliderContainer.clientHeight,n=e*this.dualRangeElement.clientHeight,r=i-n;this.rangeSliderContainer.style.top="".concat(n,"px"),this.rangeSliderContainer.style.height="".concat(r,"px")}if("number"==typeof t&&!isNaN(t)){var a=this.rangeSliderContainer.offsetTop,o=t*this.dualRangeElement.clientHeight-a;this.rangeSliderContainer.style.height="".concat(o,"px")}this.rangeSliderContainer.style.left="0px",this.rangeSliderContainer.style.width="".concat(this.dualRangeElement.clientWidth,"px")}},{key:"getMouseValue",value:function(e){return((e.touches?e.touches.item(0).pageY:e.pageY)-a._getOffsetY(this.dualRangeElement))/this.dualRangeElement.clientHeight}}],[{key:"getObject",value:function(e){return a.dict||(a.dict={}),void 0!==a.dict[e]?a.dict[e]:new t(e)}}]),t}();i.d(t,"HRange",function(){return x}),i.d(t,"VRange",function(){return R}),window.addEventListener("load",function(e){for(var t=document.getElementsByClassName(n.hrangeClassName),i=document.getElementsByClassName(n.vrangeClassName),r=0;r<t.length;r++)new f(t[r]);for(var a=0;a<i.length;a++)new _(i[a])}),window.dual={HRange:f,VRange:_};var x=f,R=_}])},function(e,t,i){var n=i(6);"string"==typeof n&&(n=[[e.i,n,""]]);var r={hmr:!0,transform:void 0,insertInto:void 0};i(8)(n,r);n.locals&&(e.exports=n.locals)},function(e,t,i){(e.exports=i(7)(!1)).push([e.i,".grid-button {\n    border-radius: 50%;\n    border-color: transparent;\n    outline: none;\n    z-index: 10;\n    transition: all 500ms;\n}\n.grid-button:hover {\n    opacity: 1;\n    box-shadow: 0px 15px 25px #00000022;\n}\n.grid-button:not(:hover) {\n    opacity: 0.7;\n    box-shadow: 0px 5px 10px #00000033;\n}\n.grid-button:active {\n    transform: scale(1.1, 1.1);\n    transition: all 600ms;\n}\n.grid-button .icon {\n    fill: white;\n}\n.grid-button.grid-on {\n    background-color: #27A2C5;   \n}\n.grid-button.grid-off {\n    background-color: #aaaaaa;\n}\n\n.hbar-container:hover {\n    opacity: 1;\n    transition: all 500ms;\n}\n.hbar-container:not(:hover) {\n    opacity: 0.5;\n    transition: all 500ms;\n}\n.vbar-container:hover {\n    opacity: 1;\n    transition: all 500ms;\n}\n.vbar-container:not(:hover) {\n    opacity: 0.5;\n    transition: all 500ms;\n}",""])},function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var i=function(e,t){var i=e[1]||"",n=e[3];if(!n)return i;if(t&&"function"==typeof btoa){var r=(o=n,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */"),a=n.sources.map(function(e){return"/*# sourceURL="+n.sourceRoot+e+" */"});return[i].concat(a).concat([r]).join("\n")}var o;return[i].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+i+"}":i}).join("")},t.i=function(e,i){"string"==typeof e&&(e=[[null,e,""]]);for(var n={},r=0;r<this.length;r++){var a=this[r][0];"number"==typeof a&&(n[a]=!0)}for(r=0;r<e.length;r++){var o=e[r];"number"==typeof o[0]&&n[o[0]]||(i&&!o[2]?o[2]=i:i&&(o[2]="("+o[2]+") and ("+i+")"),t.push(o))}},t}},function(e,t,i){var n,r,a={},o=(n=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===r&&(r=n.apply(this,arguments)),r}),s=function(e){var t={};return function(e,i){if("function"==typeof e)return e();if(void 0===t[e]){var n=function(e,t){return t?t.querySelector(e):document.querySelector(e)}.call(this,e,i);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}t[e]=n}return t[e]}}(),l=null,u=0,c=[],d=i(9);function h(e,t){for(var i=0;i<e.length;i++){var n=e[i],r=a[n.id];if(r){r.refs++;for(var o=0;o<r.parts.length;o++)r.parts[o](n.parts[o]);for(;o<n.parts.length;o++)r.parts.push(g(n.parts[o],t))}else{var s=[];for(o=0;o<n.parts.length;o++)s.push(g(n.parts[o],t));a[n.id]={id:n.id,refs:1,parts:s}}}}function f(e,t){for(var i=[],n={},r=0;r<e.length;r++){var a=e[r],o=t.base?a[0]+t.base:a[0],s={css:a[1],media:a[2],sourceMap:a[3]};n[o]?n[o].parts.push(s):i.push(n[o]={id:o,parts:[s]})}return i}function p(e,t){var i=s(e.insertInto);if(!i)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var n=c[c.length-1];if("top"===e.insertAt)n?n.nextSibling?i.insertBefore(t,n.nextSibling):i.appendChild(t):i.insertBefore(t,i.firstChild),c.push(t);else if("bottom"===e.insertAt)i.appendChild(t);else{if("object"!=typeof e.insertAt||!e.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var r=s(e.insertAt.before,i);i.insertBefore(t,r)}}function v(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=c.indexOf(e);t>=0&&c.splice(t,1)}function y(e){var t=document.createElement("style");if(void 0===e.attrs.type&&(e.attrs.type="text/css"),void 0===e.attrs.nonce){var n=function(){0;return i.nc}();n&&(e.attrs.nonce=n)}return m(t,e.attrs),p(e,t),t}function m(e,t){Object.keys(t).forEach(function(i){e.setAttribute(i,t[i])})}function g(e,t){var i,n,r,a;if(t.transform&&e.css){if(!(a="function"==typeof t.transform?t.transform(e.css):t.transform.default(e.css)))return function(){};e.css=a}if(t.singleton){var o=u++;i=l||(l=y(t)),n=_.bind(null,i,o,!1),r=_.bind(null,i,o,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(i=function(e){var t=document.createElement("link");return void 0===e.attrs.type&&(e.attrs.type="text/css"),e.attrs.rel="stylesheet",m(t,e.attrs),p(e,t),t}(t),n=function(e,t,i){var n=i.css,r=i.sourceMap,a=void 0===t.convertToAbsoluteUrls&&r;(t.convertToAbsoluteUrls||a)&&(n=d(n));r&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var o=new Blob([n],{type:"text/css"}),s=e.href;e.href=URL.createObjectURL(o),s&&URL.revokeObjectURL(s)}.bind(null,i,t),r=function(){v(i),i.href&&URL.revokeObjectURL(i.href)}):(i=y(t),n=function(e,t){var i=t.css,n=t.media;n&&e.setAttribute("media",n);if(e.styleSheet)e.styleSheet.cssText=i;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(i))}}.bind(null,i),r=function(){v(i)});return n(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;n(e=t)}else r()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||"boolean"==typeof t.singleton||(t.singleton=o()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var i=f(e,t);return h(i,t),function(e){for(var n=[],r=0;r<i.length;r++){var o=i[r];(s=a[o.id]).refs--,n.push(s)}e&&h(f(e,t),t);for(r=0;r<n.length;r++){var s;if(0===(s=n[r]).refs){for(var l=0;l<s.parts.length;l++)s.parts[l]();delete a[s.id]}}}};var b,w=(b=[],function(e,t){return b[e]=t,b.filter(Boolean).join("\n")});function _(e,t,i,n){var r=i?"":n.css;if(e.styleSheet)e.styleSheet.cssText=w(t,r);else{var a=document.createTextNode(r),o=e.childNodes;o[t]&&e.removeChild(o[t]),o.length?e.insertBefore(a,o[t]):e.appendChild(a)}}},function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var i=t.protocol+"//"+t.host,n=i+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(e,t){var r,a=t.trim().replace(/^"(.*)"$/,function(e,t){return t}).replace(/^'(.*)'$/,function(e,t){return t});return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(a)?e:(r=0===a.indexOf("//")?a:0===a.indexOf("/")?i+a:n+a.replace(/^\.\//,""),"url("+JSON.stringify(r)+")")})}},function(e,t,i){"use strict";i.r(t),function(e){var i=function(){if("undefined"!=typeof Map)return Map;function e(e,t){var i=-1;return e.some(function(e,n){return e[0]===t&&(i=n,!0)}),i}return function(){function t(){this.__entries__=[]}return Object.defineProperty(t.prototype,"size",{get:function(){return this.__entries__.length},enumerable:!0,configurable:!0}),t.prototype.get=function(t){var i=e(this.__entries__,t),n=this.__entries__[i];return n&&n[1]},t.prototype.set=function(t,i){var n=e(this.__entries__,t);~n?this.__entries__[n][1]=i:this.__entries__.push([t,i])},t.prototype.delete=function(t){var i=this.__entries__,n=e(i,t);~n&&i.splice(n,1)},t.prototype.has=function(t){return!!~e(this.__entries__,t)},t.prototype.clear=function(){this.__entries__.splice(0)},t.prototype.forEach=function(e,t){void 0===t&&(t=null);for(var i=0,n=this.__entries__;i<n.length;i++){var r=n[i];e.call(t,r[1],r[0])}},t}()}(),n="undefined"!=typeof window&&"undefined"!=typeof document&&window.document===document,r=void 0!==e&&e.Math===Math?e:"undefined"!=typeof self&&self.Math===Math?self:"undefined"!=typeof window&&window.Math===Math?window:Function("return this")(),a="function"==typeof requestAnimationFrame?requestAnimationFrame.bind(r):function(e){return setTimeout(function(){return e(Date.now())},1e3/60)},o=2;var s=20,l=["top","right","bottom","left","width","height","size","weight"],u="undefined"!=typeof MutationObserver,c=function(){function e(){this.connected_=!1,this.mutationEventsAdded_=!1,this.mutationsObserver_=null,this.observers_=[],this.onTransitionEnd_=this.onTransitionEnd_.bind(this),this.refresh=function(e,t){var i=!1,n=!1,r=0;function s(){i&&(i=!1,e()),n&&u()}function l(){a(s)}function u(){var e=Date.now();if(i){if(e-r<o)return;n=!0}else i=!0,n=!1,setTimeout(l,t);r=e}return u}(this.refresh.bind(this),s)}return e.prototype.addObserver=function(e){~this.observers_.indexOf(e)||this.observers_.push(e),this.connected_||this.connect_()},e.prototype.removeObserver=function(e){var t=this.observers_,i=t.indexOf(e);~i&&t.splice(i,1),!t.length&&this.connected_&&this.disconnect_()},e.prototype.refresh=function(){this.updateObservers_()&&this.refresh()},e.prototype.updateObservers_=function(){var e=this.observers_.filter(function(e){return e.gatherActive(),e.hasActive()});return e.forEach(function(e){return e.broadcastActive()}),e.length>0},e.prototype.connect_=function(){n&&!this.connected_&&(document.addEventListener("transitionend",this.onTransitionEnd_),window.addEventListener("resize",this.refresh),u?(this.mutationsObserver_=new MutationObserver(this.refresh),this.mutationsObserver_.observe(document,{attributes:!0,childList:!0,characterData:!0,subtree:!0})):(document.addEventListener("DOMSubtreeModified",this.refresh),this.mutationEventsAdded_=!0),this.connected_=!0)},e.prototype.disconnect_=function(){n&&this.connected_&&(document.removeEventListener("transitionend",this.onTransitionEnd_),window.removeEventListener("resize",this.refresh),this.mutationsObserver_&&this.mutationsObserver_.disconnect(),this.mutationEventsAdded_&&document.removeEventListener("DOMSubtreeModified",this.refresh),this.mutationsObserver_=null,this.mutationEventsAdded_=!1,this.connected_=!1)},e.prototype.onTransitionEnd_=function(e){var t=e.propertyName,i=void 0===t?"":t;l.some(function(e){return!!~i.indexOf(e)})&&this.refresh()},e.getInstance=function(){return this.instance_||(this.instance_=new e),this.instance_},e.instance_=null,e}(),d=function(e,t){for(var i=0,n=Object.keys(t);i<n.length;i++){var r=n[i];Object.defineProperty(e,r,{value:t[r],enumerable:!1,writable:!1,configurable:!0})}return e},h=function(e){return e&&e.ownerDocument&&e.ownerDocument.defaultView||r},f=b(0,0,0,0);function p(e){return parseFloat(e)||0}function v(e){for(var t=[],i=1;i<arguments.length;i++)t[i-1]=arguments[i];return t.reduce(function(t,i){return t+p(e["border-"+i+"-width"])},0)}function y(e){var t=e.clientWidth,i=e.clientHeight;if(!t&&!i)return f;var n=h(e).getComputedStyle(e),r=function(e){for(var t={},i=0,n=["top","right","bottom","left"];i<n.length;i++){var r=n[i],a=e["padding-"+r];t[r]=p(a)}return t}(n),a=r.left+r.right,o=r.top+r.bottom,s=p(n.width),l=p(n.height);if("border-box"===n.boxSizing&&(Math.round(s+a)!==t&&(s-=v(n,"left","right")+a),Math.round(l+o)!==i&&(l-=v(n,"top","bottom")+o)),!function(e){return e===h(e).document.documentElement}(e)){var u=Math.round(s+a)-t,c=Math.round(l+o)-i;1!==Math.abs(u)&&(s-=u),1!==Math.abs(c)&&(l-=c)}return b(r.left,r.top,s,l)}var m="undefined"!=typeof SVGGraphicsElement?function(e){return e instanceof h(e).SVGGraphicsElement}:function(e){return e instanceof h(e).SVGElement&&"function"==typeof e.getBBox};function g(e){return n?m(e)?function(e){var t=e.getBBox();return b(0,0,t.width,t.height)}(e):y(e):f}function b(e,t,i,n){return{x:e,y:t,width:i,height:n}}var w=function(){function e(e){this.broadcastWidth=0,this.broadcastHeight=0,this.contentRect_=b(0,0,0,0),this.target=e}return e.prototype.isActive=function(){var e=g(this.target);return this.contentRect_=e,e.width!==this.broadcastWidth||e.height!==this.broadcastHeight},e.prototype.broadcastRect=function(){var e=this.contentRect_;return this.broadcastWidth=e.width,this.broadcastHeight=e.height,e},e}(),_=function(){return function(e,t){var i,n,r,a,o,s,l,u=(n=(i=t).x,r=i.y,a=i.width,o=i.height,s="undefined"!=typeof DOMRectReadOnly?DOMRectReadOnly:Object,l=Object.create(s.prototype),d(l,{x:n,y:r,width:a,height:o,top:r,right:n+a,bottom:o+r,left:n}),l);d(this,{target:e,contentRect:u})}}(),x=function(){function e(e,t,n){if(this.activeObservations_=[],this.observations_=new i,"function"!=typeof e)throw new TypeError("The callback provided as parameter 1 is not a function.");this.callback_=e,this.controller_=t,this.callbackCtx_=n}return e.prototype.observe=function(e){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if("undefined"!=typeof Element&&Element instanceof Object){if(!(e instanceof h(e).Element))throw new TypeError('parameter 1 is not of type "Element".');var t=this.observations_;t.has(e)||(t.set(e,new w(e)),this.controller_.addObserver(this),this.controller_.refresh())}},e.prototype.unobserve=function(e){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if("undefined"!=typeof Element&&Element instanceof Object){if(!(e instanceof h(e).Element))throw new TypeError('parameter 1 is not of type "Element".');var t=this.observations_;t.has(e)&&(t.delete(e),t.size||this.controller_.removeObserver(this))}},e.prototype.disconnect=function(){this.clearActive(),this.observations_.clear(),this.controller_.removeObserver(this)},e.prototype.gatherActive=function(){var e=this;this.clearActive(),this.observations_.forEach(function(t){t.isActive()&&e.activeObservations_.push(t)})},e.prototype.broadcastActive=function(){if(this.hasActive()){var e=this.callbackCtx_,t=this.activeObservations_.map(function(e){return new _(e.target,e.broadcastRect())});this.callback_.call(e,t,e),this.clearActive()}},e.prototype.clearActive=function(){this.activeObservations_.splice(0)},e.prototype.hasActive=function(){return this.activeObservations_.length>0},e}(),R="undefined"!=typeof WeakMap?new WeakMap:new i,L=function(){return function e(t){if(!(this instanceof e))throw new TypeError("Cannot call a class as a function.");if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");var i=c.getInstance(),n=new x(t,i,this);R.set(this,n)}}();["observe","unobserve","disconnect"].forEach(function(e){L.prototype[e]=function(){var t;return(t=R.get(this))[e].apply(t,arguments)}});var C=void 0!==r.ResizeObserver?r.ResizeObserver:L;t.default=C}.call(this,i(11))},function(e,t){var i;i=function(){return this}();try{i=i||new Function("return this")()}catch(e){"object"==typeof window&&(i=window)}e.exports=i}])});
},{}],3:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** Deep clone an object that is serializable.
 * @param { Object } obj The object to clone */
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
/** Expand the alignment string to a object.
 * @param { string } alignStr The alignment string, usually in the format 
 * `(on|off)\d+`, where the `on/off` indicates whether it is an on-point or an 
 * off-point, and the digits are the indices of the on-points array or the off
 * points array
 * @returns { {on: boolean, index: number} } */


function expandAlign(alignStr) {
  var on = alignStr.startsWith('on');
  var index = parseInt(alignStr.substr(on ? 2 : 3));
  return {
    on: on,
    index: index
  };
}
/** Average of the points to be aligned by x or y axis.
 * @param { 'x'|'y' } xOrY Average of x coordinate or y coordinate
 * @param { [number, number][] } onPts 
 * @param { [number, number][] } offPts 
 * @param { {on: boolean, index: number}[] } group Alignment information */


function setCoordAvg(xOrY, onPts, offPts, group) {
  var ptIndex = xOrY === 'x' ? 0 : 1; // Average of the coordinates to align

  var avg = group.map(function (expanded) {
    var index = expanded.index;
    return (expanded.on ? onPts : offPts)[index][ptIndex];
  }).reduce(function (a, b) {
    return a + b;
  }) / group.length; // Set the coordinates

  group.forEach(function (expanded) {
    var index = expanded.index;
    (expanded.on ? onPts : offPts)[index][ptIndex] = avg;
  });
}
/** Convert the on/off points to glyph contour representation
 * @param { [number, number][] } onPts 
 * @param { [number, number][] } offPts 
 * @param { number[] } offOnIndices 
 * @param { number[] } onContourIndices */


function toGlyph(onPts, offPts, offOnIndices, onContourIndices) {
  var contours = [];
  var currentContour = [];
  var offIndex = 0;
  onPts.forEach(function (pt, onIndex) {
    if (onContourIndices[onIndex] !== contours.length) {
      contours.push(currentContour);
      currentContour = [];
    }

    currentContour.push({
      x: pt[0],
      y: pt[1],
      on: true
    });

    if (offIndex <= offPts.length - 1 && offOnIndices[offIndex] === onIndex) {
      var offPt1 = offPts[offIndex],
          offPt2 = offPts[offIndex + 1];
      currentContour.push({
        x: offPt1[0],
        y: offPt1[1],
        on: false
      });
      currentContour.push({
        x: offPt2[0],
        y: offPt2[1],
        on: false
      });
      offIndex += 2;
    }
  });
  contours.push(currentContour);
  return contours;
}
/** JavaScript implementation of glyph model manipulation and restoration */


var GlyphModel =
/*#__PURE__*/
function () {
  /** @type { [number, number][] } */

  /** @type { [number, number][] } */

  /** @type { [number, number][] } */

  /** @type { number[] } */

  /** @type { number[] } */

  /** @type { string[][] } */

  /** @type { string[][] } */

  /** Construct a glyph model from the parsed glyph model object
   * @param {{ 
   * onRefs: [number, number][], 
   * onOffsets: [number, number][], offOffsets: [number, number][], 
   * offOnIndices: number[], onContourIndices: number[], 
   * xAlign: string[][], yAlign: string[][] }} glyphModelObject 
   */
  function GlyphModel(glyphModelObject) {
    _classCallCheck(this, GlyphModel);

    _defineProperty(this, "onRefs", void 0);

    _defineProperty(this, "onOffsets", void 0);

    _defineProperty(this, "offOffsets", void 0);

    _defineProperty(this, "offOnIndices", void 0);

    _defineProperty(this, "onContourIndices", void 0);

    _defineProperty(this, "xAlign", void 0);

    _defineProperty(this, "yAlign", void 0);

    Object.assign(this, glyphModelObject);
  }
  /** Handle alignments of given on-points and off-points using `this.xAlign`
   * and `this.yAlign`.
   * @param { [number, number][] } onPts 
   * @param { [number, number][] } offPts */


  _createClass(GlyphModel, [{
    key: "align",
    value: function align(onPts, offPts) {
      var xas = this.xAlign.map(function (group) {
        return group.map(expandAlign);
      });
      var yas = this.yAlign.map(function (group) {
        return group.map(expandAlign);
      }); // Aligning

      xas.forEach(function (group) {
        return setCoordAvg('x', onPts, offPts, group);
      });
      yas.forEach(function (group) {
        return setCoordAvg('y', onPts, offPts, group);
      });
    }
    /** Restore the glyph contours.
     * @param { (onRefs: [number, number][],
     * onOffsets: [number, number][], offOffsets: [number, number][]) => 
     * [[number, number][], [number, number][], [number, number][]] } transform
     * @returns { {x: number, y: number, on: boolean}[][] } */

  }, {
    key: "restore",
    value: function restore() {
      var _this = this;

      var transform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (a, b, c) {
        return [a, b, c];
      };

      var _transform = transform(this.onRefs, this.onOffsets, this.offOffsets),
          _transform2 = _slicedToArray(_transform, 3),
          onRefs = _transform2[0],
          onOffsets = _transform2[1],
          offOffsets = _transform2[2];

      var onPts = onRefs.map(function (onRef, i) {
        var _onRef = _slicedToArray(onRef, 2),
            x = _onRef[0],
            y = _onRef[1];

        var _onOffsets$i = _slicedToArray(onOffsets[i], 2),
            dx = _onOffsets$i[0],
            dy = _onOffsets$i[1];

        return [x + dx, y + dy];
      });
      var offPts = offOffsets.map(function (offOffset, i) {
        var offOnIndex = _this.offOnIndices[i];

        var _onPts$offOnIndex = _slicedToArray(onPts[offOnIndex], 2),
            x = _onPts$offOnIndex[0],
            y = _onPts$offOnIndex[1];

        var _offOffset = _slicedToArray(offOffset, 2),
            dx = _offOffset[0],
            dy = _offOffset[1];

        return [x + dx, y + dy];
      });
      this.align(onPts, offPts);
      var offOnIndices = this.offOnIndices;
      var onContourIndices = this.onContourIndices;
      return toGlyph(onPts, offPts, offOnIndices, onContourIndices);
    }
  }]);

  return GlyphModel;
}();

module.exports = GlyphModel;

},{}],4:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/** @typedef { (onRefs: [number, number][],
 * onOffsets: [number, number][], offOffsets: [number, number][]) => 
 * [ [number, number][], [number, number][], [number, number][] ] } Filter */

/** Morphological scaling 
 * @param { number } factor Scale factor
 * @returns { Filter } */
function horizontalScale(factor) {
  return function (onRefs, onOffsets, offOffsets) {
    var scaledOnRefs = onRefs.map(function (pt) {
      return [pt[0] * factor, pt[1]];
    });
    var scaledOffOffsets = offOffsets.map(function (pt) {
      return [pt[0] * factor, pt[1]];
    });
    return [scaledOnRefs, onOffsets, scaledOffOffsets];
  };
}
/** Weight adjustment
 * @param  { number } factor Weight adjustment factor
 * @returns { Filter } */


function weightAdjustment(factor) {
  return function (onRefs, onOffsets, offOffsets) {
    var adjustedOnOffsets = onOffsets.map(function (pt) {
      return [pt[0] * factor, pt[1] * factor];
    });
    return [onRefs, adjustedOnOffsets, offOffsets];
  };
}
/** Contrast adjustment
 * @param { number } factor Contrast adjustment factor
 * @returns { Filter } */


function contrastAdjustment(factor) {
  return function (onRefs, onOffsets, offOffsets) {
    var adjustedOnOffsets = onOffsets.map(function (pt) {
      return [pt[0] * factor, pt[1] * (2 - factor)];
    });
    return [onRefs, adjustedOnOffsets, offOffsets];
  };
}
/** Radial scaling for tracking adjustment
 * @param { number } factor Radial scaling factor 
 * @returns { Filter } */


function radialScale(factor) {
  return function (onRefs, onOffsets, offOffsets) {
    var scaledOnRefs = onRefs.map(function (pt) {
      return [(pt[0] - 500) * factor + 500, (pt[1] - 500) * factor + 500];
    });
    return [scaledOnRefs, onOffsets, offOffsets];
  };
}
/** Scale the counter
 * @param { number } factor Counter scaling factor
 * @returns { Filter } */


function counterScale(factor) {
  var a = Math.abs(factor);
  return function (onRefs, onOffsets, offOffsets) {
    var f = function f(x) {
      return Math.abs(x) < 0.25 ? x : Math.sign(x) * Math.pow(Math.abs(x), 2 - factor);
    };

    var scaledOnRefs = onRefs.map(function (pt) {
      return [(f(pt[0] / 500 - 1) + 1) * 500, pt[1]];
    });
    return [scaledOnRefs, onOffsets, offOffsets];
  };
}
/** Gravity control
 * @param { number } factor Gravity control factor
 * @returns { Filter } */


function gravityAdjustment(factor) {
  return function (onRefs, onOffsets, offOffsets) {
    var f = function f(x) {
      return Math.pow(1 - Math.pow(1 - x, factor), 1 / factor);
    };

    var scaledOnRefs = onRefs.map(function (pt) {
      return [pt[0], f(pt[1] / 1000) * 1000];
    });
    return [scaledOnRefs, onOffsets, offOffsets];
  };
}
/** Softness control
 * @param { number } factor Softness control factor
 * @returns { Filter } */


function soften(factor) {
  return function (onRefs, onOffsets, offOffsets) {
    var scaledOffOffsets = offOffsets.map(function (pt) {
      return [pt[0] * factor, pt[1] * factor];
    });
    return [onRefs, onOffsets, scaledOffOffsets];
  };
}
/** Merge the application of the filters
 * @param  {...Filter} filters 
 * @returns { Filter } */


function merge() {
  for (var _len = arguments.length, filters = new Array(_len), _key = 0; _key < _len; _key++) {
    filters[_key] = arguments[_key];
  }

  return function (onRefs, onOffsets, offOffsets) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = filters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var filter = _step.value;

        var _filter = filter(onRefs, onOffsets, offOffsets);

        var _filter2 = _slicedToArray(_filter, 3);

        onRefs = _filter2[0];
        onOffsets = _filter2[1];
        offOffsets = _filter2[2];
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return [onRefs, onOffsets, offOffsets];
  };
}

module.exports = {
  horizontalScale: horizontalScale,
  weightAdjustment: weightAdjustment,
  contrastAdjustment: contrastAdjustment,
  radialScale: radialScale,
  counterScale: counterScale,
  gravityAdjustment: gravityAdjustment,
  soften: soften,
  merge: merge
};

},{}],5:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/** @typedef { { x: number, y: number, on: boolean } } ControlPoint */

/** @typedef { ControlPoint[] } Contour */

/** @typedef { Contour[] } GlyphData */

/** @typedef { (glyph: GlyphData) => GlyphData } PostFilter */
var detectFeet = require('./detect-feet');

var _require = require('../utils/point-math'),
    mod = _require.mod;
/** Remove feet filter
 * @param { { maxStroke: number?, longestFoot: number?, 
 * angleTol: number? }) } config
 * @returns { PostFilter } */


function removeFeet() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$maxStroke = _ref.maxStroke,
      maxStroke = _ref$maxStroke === void 0 ? 10 : _ref$maxStroke,
      _ref$longestFoot = _ref.longestFoot,
      longestFoot = _ref$longestFoot === void 0 ? 100 : _ref$longestFoot,
      _ref$angleTol = _ref.angleTol,
      angleTol = _ref$angleTol === void 0 ? 2 : _ref$angleTol;

  return function (glyph) {
    return glyph.map(function (contour) {
      var _detectFeet = detectFeet(contour, {
        maxStroke: maxStroke,
        longestFoot: longestFoot,
        angleTol: angleTol
      }),
          _detectFeet2 = _slicedToArray(_detectFeet, 2),
          leftFeet = _detectFeet2[0],
          rightFeet = _detectFeet2[1];

      return contour.map(function (pt, i) {
        if (leftFeet.indexOf(i) >= 0) {
          var pt3 = contour[mod(i + 2, contour.length)];
          return {
            x: pt.x,
            y: pt3.y,
            on: pt.on
          };
        } else if (rightFeet.indexOf(i) >= 0) {
          var _pt = contour[mod(i - 2, contour.length)];
          return {
            x: pt.x,
            y: _pt.y,
            on: pt.on
          };
        }

        return pt;
      }).filter(function (pt, i) {
        if (leftFeet.indexOf(mod(i - 1, contour.length)) >= 0) return false;
        if (leftFeet.indexOf(mod(i - 2, contour.length)) >= 0) return false;
        if (rightFeet.indexOf(mod(i + 1, contour.length)) >= 0) return false;
        if (rightFeet.indexOf(mod(i + 2, contour.length)) >= 0) return false;
        return true;
      });
    });
  };
}
/** Merge filters
 * @param  {...PostFilter} filters */


function merge() {
  for (var _len = arguments.length, filters = new Array(_len), _key = 0; _key < _len; _key++) {
    filters[_key] = arguments[_key];
  }

  if (filters.length === 0) return function (x) {
    return x;
  };
  return filters.reduce(function (a, b) {
    return function (x) {
      return b(a(x));
    };
  });
}

module.exports = {
  removeFeet: removeFeet,
  merge: merge
};

},{"../utils/point-math":8,"./detect-feet":6}],6:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/** @typedef { { x: number, y: number, on: boolean } } ControlPoint */

/** @typedef { ControlPoint[] } Contour */

/** @typedef { Contour[] } GlyphData */

/** @typedef { [number, number] PointTuple } */
var _require = require('../utils/point-math'),
    mod = _require.mod,
    rad2deg = _require.rad2deg,
    angle = _require.angle,
    dist = _require.dist;
/** Test if the four points construct a left foot
 * @param { ControlPoint } pt1 
 * @param { ControlPoint } pt2 
 * @param { ControlPoint } pt3 
 * @param { ControlPoint } pt4 
 * @param { ControlPoint } pt5
 * @param { { maxStroke: number?, longestFoot: number?, 
 * angleTol: number? } } config */


function isLeftFoot(pt1, pt2, pt3, pt4, pt5, pt6, pt7) {
  var _ref = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : {},
      _ref$maxStroke = _ref.maxStroke,
      maxStroke = _ref$maxStroke === void 0 ? 10 : _ref$maxStroke,
      _ref$longestFoot = _ref.longestFoot,
      longestFoot = _ref$longestFoot === void 0 ? 50 : _ref$longestFoot,
      _ref$angleTol = _ref.angleTol,
      angleTol = _ref$angleTol === void 0 ? 2 : _ref$angleTol;

  var angleApprox = function angleApprox(a1, a2) {
    return Math.abs(a1 - a2) < angleTol;
  };
  /** @type { ControlPoint => [ number, number ] } */


  var tuple = function tuple(ctrlPt) {
    return [ctrlPt.x, ctrlPt.y];
  }; // On-point testing


  if (!pt1.on || !pt2.on || !pt3.on || !pt4.on || !pt5.on) return false; // Vertical testing

  if (!(pt1.y > pt2.y)) return false;
  if (Math.abs(pt1.x - pt2.x) > 20) return false; // The first interior angle

  var angle1 = angle(tuple(pt3), tuple(pt2), tuple(pt1));
  if (!angleApprox(rad2deg(angle1), 90)) return false; // The second interior angle

  var angle2 = angle(tuple(pt4), tuple(pt3), tuple(pt2));
  if (!angleApprox(rad2deg(angle2), 90)) return false; // The third interior angle

  var angle3 = angle(tuple(pt5), tuple(pt4), tuple(pt3));
  if (!angleApprox(rad2deg(angle3), 270)) return false; // Foot length

  var footLen = dist(tuple(pt3), tuple(pt4));
  if (footLen > longestFoot) return false; // Stroke width

  var footWidth = dist(tuple(pt2), tuple(pt3));
  if (footWidth > maxStroke) return false; // Shoulder

  if (pt1.y - pt4.y < 1.8 * maxStroke) return false; // The `月` case

  if (pt6.on && !pt7.on) return false; // The `非` case

  if (pt7.y > pt4.y && pt7.y - pt4.y < maxStroke) return false; // Presume that no feet at the top

  if (pt4.y > 500) return false; // Finally...

  return true;
}
/** Feet detection
 * @param { Contour } contour 
 * @param { { maxStroke: number?, longestFoot: number?, 
 * angleTol: number? } } config 
 * @returns { [ number[], number[] ] } */


function detectFeet(contour) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$maxStroke = _ref2.maxStroke,
      maxStroke = _ref2$maxStroke === void 0 ? 10 : _ref2$maxStroke,
      _ref2$longestFoot = _ref2.longestFoot,
      longestFoot = _ref2$longestFoot === void 0 ? 100 : _ref2$longestFoot,
      _ref2$angleTol = _ref2.angleTol,
      angleTol = _ref2$angleTol === void 0 ? 2 : _ref2$angleTol;

  var leftFeet = [],
      rightFeet = [];
  contour.forEach(function (pt1, i) {
    var pt2 = contour[mod(i + 1, contour.length)],
        pt3 = contour[mod(i + 2, contour.length)],
        pt4 = contour[mod(i + 3, contour.length)],
        pt5 = contour[mod(i + 4, contour.length)],
        pt6 = contour[mod(i + 5, contour.length)],
        pt7 = contour[mod(i + 6, contour.length)];

    if (isLeftFoot(pt1, pt2, pt3, pt4, pt5, pt6, pt7, {
      maxStroke: maxStroke,
      longestFoot: longestFoot,
      angleTol: angleTol
    })) {
      leftFeet.push(mod(i + 1, contour.length));
    }

    var isRight = isLeftFoot.apply(void 0, _toConsumableArray([pt7, pt6, pt5, pt4, pt3, pt2, pt1].map(function (pt) {
      return {
        x: 1000 - pt.x,
        y: pt.y,
        on: pt.on
      };
    })).concat([{
      maxStroke: maxStroke,
      longestFoot: longestFoot,
      angleTol: angleTol
    }]));
    if (isRight) rightFeet.push(mod(i + 5, contour.length));
  });
  return [leftFeet, rightFeet];
}

module.exports = detectFeet;

},{"../utils/point-math":8}],7:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var gridcanvas = require('gridcanvas');
/** @type { typeof gridcanvas.default } */


var GridCanvas = window.GridCanvas;

var GlyphPreviewPanel =
/*#__PURE__*/
function () {
  _createClass(GlyphPreviewPanel, [{
    key: "glyphs",

    /** @type { { x: number, y: number, on: boolean }[][][] } */

    /** @type { { x: number, y: number, on: boolean }[][][] } Glyphs to display */
    get: function get() {
      return this._glyphs;
    },
    set: function set(newVal) {
      var changeHighlights = false;
      this._glyphs = newVal;
      this.updateLayout();
      this.gridCanvas.display();
    }
    /** @type { number | number[] } */

  }, {
    key: "advanceWidths",

    /** @type { number | number[] } Advance widths of the glyphs (upm = 1000) */
    get: function get() {
      return this._advanceWidths;
    },
    set: function set(newVal) {
      this._advanceWidths = newVal;
      this.updateLayout();
      this.gridCanvas.display();
    }
    /** @type { [ number, number, number ][] } */

  }, {
    key: "highlights",

    /** @type { [ number, number, number ][] } Indices for the highlight point, by 
     * the glyph index, the contour index and the point index. */
    get: function get() {
      return this._highlights;
    },
    set: function set(newVal) {
      this._highlights = newVal;
      this.gridCanvas.display();
    }
    /** @type { Readonly<number> } Preview window available width */

  }, {
    key: "fontSize",

    /** @type { number }           Font size displayed */
    get: function get() {
      return this._fontSize;
    },
    set: function set(newVal) {
      this._fontSize = newVal;
      this.updateLayout();
      this.gridCanvas.display();
    }
  }, {
    key: "lineHeight",

    /** @type { number }           Relative line height */
    get: function get() {
      return this._lineHeight;
    },
    set: function set(newVal) {
      this._lineHeight = newVal;
      this.updateLayout();
      this.gridCanvas.display();
    }
    /** @type { [[number, number]] } 
     * Origins, updated when the layout is updated */

  }]);

  /** 
   * @param { string } elementID  Element ID of the container `<div/>`
   * @param { number } width      Preview window available width
   * @param { number } height     Preview window available height
   * @param { number } padding    Preview window padding
   * @param { number } upm        Units per em
   * @param { number } fontSize   Font size displayed
   * @param { number } lineHeight Relative line height */
  function GlyphPreviewPanel(elementID) {
    var _this = this;

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$width = _ref.width,
        width = _ref$width === void 0 ? 1000 : _ref$width,
        _ref$height = _ref.height,
        height = _ref$height === void 0 ? 800 : _ref$height,
        _ref$padding = _ref.padding,
        padding = _ref$padding === void 0 ? 20 : _ref$padding,
        _ref$upm = _ref.upm,
        upm = _ref$upm === void 0 ? 1000 : _ref$upm,
        _ref$fontSize = _ref.fontSize,
        fontSize = _ref$fontSize === void 0 ? 100 : _ref$fontSize,
        _ref$lineHeight = _ref.lineHeight,
        lineHeight = _ref$lineHeight === void 0 ? 1.0 : _ref$lineHeight;

    _classCallCheck(this, GlyphPreviewPanel);

    _defineProperty(this, "_glyphs", []);

    _defineProperty(this, "_advanceWidths", 1000);

    _defineProperty(this, "_highlights", []);

    _defineProperty(this, "width", void 0);

    _defineProperty(this, "height", void 0);

    _defineProperty(this, "padding", void 0);

    _defineProperty(this, "upm", void 0);

    _defineProperty(this, "_fontSize", void 0);

    _defineProperty(this, "_lineHeight", void 0);

    _defineProperty(this, "_origins", []);

    _defineProperty(this, "redrawUpper", function (ctx) {
      ctx.clearRect(0, 0, _this.gridCanvas.upperLayer.width, _this.gridCanvas.upperLayer.height);

      for (var i in _this._glyphs) {
        _this.drawGlyph(ctx, i);
      }

      _this.drawHighlights(ctx);
    });

    this.gridCanvas = new GridCanvas(elementID, {
      bound: {
        minX: -padding,
        maxX: width + padding,
        minY: -height - padding,
        maxY: padding
      }
    });
    Object.defineProperty(this, 'width', {
      value: width,
      writable: false
    });
    Object.defineProperty(this, 'height', {
      value: height,
      writable: false
    });
    Object.defineProperty(this, 'padding', {
      value: padding,
      writable: false
    });
    Object.defineProperty(this, 'upm', {
      value: upm,
      writable: false
    });
    this._fontSize = fontSize;
    this._lineHeight = lineHeight; // Drawing functions

    this.gridCanvas.redrawUpper = this.redrawUpper;
  }
  /** Total width of glyphs by the given index range.
   * @param { number } start  Index of the starting glyph
   * @param { number } end    Index of the ending glyph
   * @returns { number } Total width */


  _createClass(GlyphPreviewPanel, [{
    key: "glyphWidth",
    value: function glyphWidth(start, end) {
      if (end === undefined) end = start + 1;
      if (typeof this.advanceWidths === 'number') return Math.abs(start - end) * this.advanceWidths;
      return this.advanceWidths.slice(start, end).reduce(function (a, b) {
        return a + b;
      });
    }
    /** Advancing x by previous glyph advance width */

  }, {
    key: "_advance",
    value: function _advance(x, w) {
      return x + w / this.upm * this._fontSize;
    }
    /** Next line */

  }, {
    key: "_nextline",
    value: function _nextline(y) {
      return y - this._fontSize * this._lineHeight;
    }
    /** Update the origins for layout greedily. */

  }, {
    key: "updateLayout",
    value: function updateLayout() {
      var origins = this._origins = [];

      for (var i = 0; i < this._glyphs.length; i++) {
        if (origins.length === 0) origins.push([0, this._nextline(0)]);else {
          var x = this._advance(origins[i - 1][0], this.glyphWidth(i - 1));

          var y = origins[i - 1][1];

          if (x + this.glyphWidth(i) / this.upm * this._fontSize > this.width) {
            x = 0;
            y = this._nextline(y);
          }

          origins.push([x, y]);
        }
      }
    }
    /** Glyph coordinates to gridCanvas project coordinates
     * @param { number } index Index of the glyph
     * @returns { [ (x: number) => number, (y: number) => number ] } 
     * x, y transformations */

  }, {
    key: "_2p",
    value: function _2p(index) {
      var _this2 = this;

      var _this$_origins$index = _slicedToArray(this._origins[index], 2),
          x0 = _this$_origins$index[0],
          y0 = _this$_origins$index[1];

      var x2p = function x2p(x) {
        return x0 + x / _this2.upm * _this2.fontSize;
      };

      var y2p = function y2p(y) {
        return y0 + y / _this2.upm * _this2.fontSize;
      };

      return [x2p, y2p];
    }
    /** Glyph transformation to view coordinates
     * @param { number } index 
     * @returns { {({ x: number, y: number, on: boolean }) => [number, number]} }
     */

  }, {
    key: "_2v",
    value: function _2v(index) {
      var _this3 = this;

      return function (pt) {
        var x = pt.x,
            y = pt.y;

        var _this3$_2p = _this3._2p(index),
            _this3$_2p2 = _slicedToArray(_this3$_2p, 2),
            x2p = _this3$_2p2[0],
            y2p = _this3$_2p2[1];

        var p2vX = _this3.gridCanvas.p2vX,
            p2vY = _this3.gridCanvas.p2vY;
        return [p2vX(x2p(x)), p2vY(y2p(y))];
      };
    }
    /** Draw a point with the given project coordinate
     * @param { CanvasRenderingContext2D } ctx
     * @param { number } px Project x @param { number } py Project y
     * @param { string } style */

  }, {
    key: "drawProjectPoint",
    value: function drawProjectPoint(ctx, px, py, style) {
      var vx = this.gridCanvas.p2vX(px),
          vy = this.gridCanvas.p2vY(py);
      var savedCtx = {
        fillStyle: ctx.fillStyle,
        lineWidth: ctx.lineWidth,
        strokeStyle: ctx.strokeStyle
      }; // TODO: The style is to-be-implemented

      ctx.fillStyle = '#EE2222';
      ctx.beginPath();
      ctx.arc(vx, vy, this.gridCanvas.resolution * 4, 0, 2 * Math.PI);
      ctx.fill();
      Object.assign(ctx, savedCtx);
    }
    /** Draw a single glyph
     * @param { CanvasRenderingContext2D } ctx 
     * @param { number } index */

  }, {
    key: "drawGlyph",
    value: function drawGlyph(ctx, index) {
      var glyph = this.glyphs[index];

      var vxy = this._2v(index);

      ctx.beginPath();
      glyph.forEach(function (contour) {
        ctx.moveTo.apply(ctx, _toConsumableArray(vxy(contour[0])));
        var i = 0;

        while (i < contour.length - 1) {
          if (!contour[i].on) throw Error("Invalid cubic curve: ".concat(contour));

          if (!contour[i + 1].on) {
            var end_pt = i + 3 < contour.length ? contour[i + 3] : contour[0];
            ctx.bezierCurveTo.apply(ctx, _toConsumableArray(vxy(contour[i + 1])).concat(_toConsumableArray(vxy(contour[i + 2])), _toConsumableArray(vxy(end_pt))));
            i += 3;
          } else {
            var _end_pt = i + 1 < contour.length ? contour[i + 1] : contour[0];

            ctx.lineTo.apply(ctx, _toConsumableArray(vxy(_end_pt)));
            i++;
          }
        }
      });
      ctx.closePath();
      ctx.fill();
    }
    /** Draw the highlighted points 
     * @param { CanvasRenderingContext2D } ctx */

  }, {
    key: "drawHighlights",
    value: function drawHighlights(ctx) {
      var _this4 = this;

      this._highlights.forEach(function (giCiPi) {
        var _giCiPi = _slicedToArray(giCiPi, 3),
            gi = _giCiPi[0],
            ci = _giCiPi[1],
            pi = _giCiPi[2];

        if (gi in _this4._glyphs && ci in _this4._glyphs[gi] && pi in _this4._glyphs[gi][ci]) {
          var pt = _this4._glyphs[gi][ci][pi];

          var _this4$_2p = _this4._2p(gi),
              _this4$_2p2 = _slicedToArray(_this4$_2p, 2),
              x2p = _this4$_2p2[0],
              y2p = _this4$_2p2[1];

          _this4.drawProjectPoint(ctx, x2p(pt.x), y2p(pt.y), 'highlight');
        }
      });
    }
    /** Redraw upper layer callback
     * @param { CanvasRenderingContext2D } ctx */

  }]);

  return GlyphPreviewPanel;
}();

module.exports = GlyphPreviewPanel;

},{"gridcanvas":2}],8:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/** @typedef { { x: number, y: number, on: boolean } } ControlPoint */

/** @typedef { ControlPoint[] } Contour */

/** @typedef { Contour[] } GlyphData */

/** @typedef { [number, number] PointTuple } */

/** @type { (n: number, m: number) => number } */
var mod = function mod(n, m) {
  return (n % m + m) % m;
};
/** Dot of two vectors
  * @type { (vec1: PointTuple, vec2: PointTuple) => number } */


var dot = function dot(vec1, vec2) {
  var _vec = _slicedToArray(vec1, 2),
      x1 = _vec[0],
      y1 = _vec[1],
      _vec2 = _slicedToArray(vec2, 2),
      x2 = _vec2[0],
      y2 = _vec2[1];

  return x1 * x2 + y1 * y2;
};
/** Outer product of two vectors
 * @type { (vec1: PointTuple, vec2: PointTuple) => number } */


var outer = function outer(vec1, vec2) {
  var _vec3 = _slicedToArray(vec1, 2),
      x1 = _vec3[0],
      y1 = _vec3[1],
      _vec4 = _slicedToArray(vec2, 2),
      x2 = _vec4[0],
      y2 = _vec4[1];

  return x1 * y2 - x2 * y1;
};
/** Norm of a vector
 * @type { (vec: PointTuple) => number } */


var norm = function norm(vec) {
  var _vec5 = _slicedToArray(vec, 2),
      x = _vec5[0],
      y = _vec5[1];

  return Math.sqrt(x * x + y * y);
};
/** Add two vectors
 * @type { (vec1: PointTuple, vec2: PointTuple) => PointTuple } */


var add = function add(vec1, vec2) {
  var _vec6 = _slicedToArray(vec1, 2),
      x1 = _vec6[0],
      y1 = _vec6[1],
      _vec7 = _slicedToArray(vec2, 2),
      x2 = _vec7[0],
      y2 = _vec7[1];

  return [x1 + x2, y1 + y2];
};
/** Subtract two vectors
 * @type { (vec1: PointTuple, vec2: PointTuple) => PointTuple } */


var sub = function sub(vec1, vec2) {
  var _vec8 = _slicedToArray(vec1, 2),
      x1 = _vec8[0],
      y1 = _vec8[1],
      _vec9 = _slicedToArray(vec2, 2),
      x2 = _vec9[0],
      y2 = _vec9[1];

  return [x1 - x2, y1 - y2];
};
/** Rad to degree
 * @type { (rad: number) => number } */


var rad2deg = function rad2deg(rad) {
  return rad / Math.PI * 180;
};
/** Angle specified by three points: point on edge 1, vertex, point on edge 2.
 * The angle is in rad and goes counterclock-wise.
 * @type { (pt1: PointTuple, pt2: PointTuple, pt3: PointTuple) => number } */


var angle = function angle(pt1, pt2, pt3) {
  var vec1 = sub(pt1, pt2),
      vec2 = sub(pt3, pt2);
  var convexAngle = Math.acos(dot(vec1, vec2) / (norm(vec1) * norm(vec2)));
  var outerProduct = outer(vec1, vec2);
  return outerProduct > 0 ? convexAngle : 2 * Math.PI - convexAngle;
};
/** Distance of two points
 * @type { (pt1: PointTuple, pt2: PointTuple) => number } */


var dist = function dist(pt1, pt2) {
  return norm(sub(pt1, pt2));
};

module.exports = {
  mod: mod,
  dot: dot,
  outer: outer,
  norm: norm,
  add: add,
  sub: sub,
  rad2deg: rad2deg,
  angle: angle,
  dist: dist
};

},{}]},{},[1]);
