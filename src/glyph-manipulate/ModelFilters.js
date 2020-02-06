/** @typedef { (onRefs: [number, number][],
 * onOffsets: [number, number][], offOffsets: [number, number][]) => 
 * [ [number, number][], [number, number][], [number, number][] ] } Filter */

/** Morphological scaling 
 * @param { number } factor Scale factor
 * @returns { Filter } */
function horizontalScale(factor) {
  return (onRefs, onOffsets, offOffsets) => {
    const scaledOnRefs = onRefs.map(pt => [ pt[0] * factor, pt[1] ]);
    const scaledOffOffsets = offOffsets.map(pt => [ pt[0] * factor, pt[1] ]);
    return [ scaledOnRefs, onOffsets, scaledOffOffsets ];
  }
}

/** Weight adjustment
 * @param  { number } factor Weight adjustment factor
 * @returns { Filter } */
function weightAdjustment(factor) {
  return (onRefs, onOffsets, offOffsets) => {
    const adjustedOnOffsets = onOffsets.map(pt => [ pt[0] * factor, pt[1] * factor ]);
    return [ onRefs, adjustedOnOffsets, offOffsets ];
  }
}

/** Contrast adjustment
 * @param { number } factor Contrast adjustment factor
 * @returns { Filter } */
function contrastAdjustment(factor) {
  return (onRefs, onOffsets, offOffsets) => {
    const adjustedOnOffsets = onOffsets.map(pt => [ pt[0] * factor, pt[1] * (2-factor) ]);
    return [ onRefs, adjustedOnOffsets, offOffsets ];
  }
}

/** Radial scaling for tracking adjustment
 * @param { number } factor Radial scaling factor 
 * @returns { Filter } */
function radialScale(factor) {
  return (onRefs, onOffsets, offOffsets) => {
    const scaledOnRefs = onRefs.map(pt => 
      [ (pt[0] - 500) * factor + 500, (pt[1] - 500) * factor + 500 ]);
    return [ scaledOnRefs, onOffsets, offOffsets ];
  }
}

/** Scale the counter
 * @param { number } factor Counter scaling factor
 * @returns { Filter } */
function counterScale(factor) {
  const a = Math.abs(factor);
  return (onRefs, onOffsets, offOffsets) => {
    const f = (x) => 
      Math.abs(x) < 0.25 ? x : Math.sign(x) * (Math.abs(x) ** (2-factor));
    const scaledOnRefs = onRefs.map(pt => 
      [ (f(pt[0]/500-1)+1)*500, pt[1] ]);
    return [ scaledOnRefs, onOffsets, offOffsets ];
  }
}

/** Gravity control
 * @param { number } factor Gravity control factor
 * @returns { Filter } */
function gravityAdjustment(factor) {
  return (onRefs, onOffsets, offOffsets) => {
    const f = (x) => (1-(1-x)**factor)**(1/factor);
    const scaledOnRefs = onRefs.map(pt => 
      [ pt[0], f(pt[1]/1000)*1000 ]);
    return [ scaledOnRefs, onOffsets, offOffsets ];
  }
}

/** Softness control
 * @param { number } factor Softness control factor
 * @returns { Filter } */
function soften(factor) {
  return (onRefs, onOffsets, offOffsets) => {
    const scaledOffOffsets = offOffsets.map(pt => 
      [ pt[0] * factor, pt[1] * factor ]);
    return [ onRefs, onOffsets, scaledOffOffsets ];
  }
}

/** Merge the application of the filters
 * @param  {...Filter} filters 
 * @returns { Filter } */
function merge(...filters) {
  return (onRefs, onOffsets, offOffsets) => {
    for (const filter of filters)
      [ onRefs, onOffsets, offOffsets ] = filter(onRefs, onOffsets, offOffsets);
    return [ onRefs, onOffsets, offOffsets ];
  }
}


module.exports = {
  horizontalScale,
  weightAdjustment,
  contrastAdjustment,
  radialScale,
  counterScale,
  gravityAdjustment,
  soften,
  merge
};