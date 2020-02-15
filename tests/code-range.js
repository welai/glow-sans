const { codeRange, codeBlockName } = require('../src/utils/code-range');

function inRange(number, range) { 
  return number >= range[0] && number <= range[1];
}

const test = (x) => inRange(x, codeRange(codeBlockName(x)))

console.log(test(0x0100));
console.log(test(0x0A88));
console.log(test(0x1801));
console.log(test(0x2BFF));
console.log(test(0x2FA1F));
console.log(codeBlockName(0x3CA1B));
console.log(codeBlockName(0xE0055));
console.log(codeBlockName(0x10FFEE));
console.log(codeBlockName(0x20FFFF));
