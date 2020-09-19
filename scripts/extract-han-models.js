const fs = require('fs');
const util = require('util');
const path = require('path');
const process = require('process');
const exec = util.promisify(require('child_process').exec);

let nProcesses = 4;
const argv1 = parseInt(process.argv[1]);
if (!isNaN(argv1)) nProcesses = argv1;

const weights = [ 'ExtraLight', 'Light', 'Normal', 
  'Regular', 'Medium', 'Bold', 'Heavy' ];

function toChunks(array, chunkSize) {
  return array.reduce((resultArr, item, index) => {
    const chunckI = Math.floor(index/chunkSize);
    if (!resultArr[chunckI]) resultArr[chunckI] = [];
    resultArr[chunckI].push(item);
    return resultArr;
  }, []);
}

(async () => {
  for (const weight of weights) {
    async function extract(extractDir, modelDir, encodingDir, fontName) {
      fs.mkdirSync(extractDir, { recursive: true });
      fs.mkdirSync(modelDir, { recursive: true });
    
      const encodingFiles = fs.readdirSync(encodingDir)
        .filter(str => /^gid-[0-9]*.tsv$/.test(str));
    
      for (const chunk of toChunks(encodingFiles, nProcesses)) {
        const promises = chunk.map(async filename => {
          const target = filename.replace('.tsv', '.json');
          
          await exec(`node \
            scripts/extract-han-gid.js \
            ${fontName(weight)} \
            ${path.join(encodingDir, filename)} ${path.join(extractDir, target)}`);
          console.log(`${path.join(extractDir, target)} extracted.`)
          
          await exec(`npm run convert-model\
            ${path.join(extractDir, target)} ${path.join(modelDir, target)}`)
            .then(() => fs.unlinkSync(path.join(extractDir, target)))
          console.log(`${path.join(modelDir, target)} converted.`);
        });
        await Promise.all(promises);
      }
    }
  
    // Extract SC
    await extract(
      `build-files/extracted/shs-sc/${weight}`,
      `build-files/models/shs-sc/${weight}`,
      `encoding/gid/shs-sc-han/`,
      w => `fonts/SourceHanSansSC/SourceHanSansSC-${w}.json`
    );
    
    // Extract TC/K
    await extract(
      `build-files/extracted/shs-tc/${weight}`,
      `build-files/models/shs-tc/${weight}`,
      `encoding/gid/shs-tc-han/`,
      w => `fonts/Genne/GenneGothic-${w}.json`
    );
    
    // Extract J
    await extract(
      `build-files/extracted/shs-j/${weight}`,
      `build-files/models/shs-j/${weight}`,
      `encoding/gid/shs-j-han/`,
      w => `fonts/SourceHanSansJ/SourceHanSans-${w}.json`
    );
  }
})();