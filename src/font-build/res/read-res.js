// Read resources synchronously with the given path
const fs = require('fs');
const path = require('path');

function readTsv(fileInProject) {
  const filepath = path.join(__dirname, '../../..', fileInProject);
  const fileBuf = fs.readFileSync(filepath);
  return fileBuf.toString().split('\n').map(l => l.split('\t'));
}

function filesInDir(pathInProject) {
  return fs.readdirSync(path.join(__dirname, '../../..', pathInProject));
}

function readJSON(fileInProject) {
  const filepath = path.join(__dirname, '../../..', fileInProject);
  const fileBuf = fs.readFileSync(filepath);
  return JSON.parse(fileBuf.toString());
}

/** Expand project path to absolute path.
 * @param { string } projectPath 
 * @returns { string } */
function expandPath(projectPath) { 
  return path.join(__dirname, '../../..', projectPath); 
}

module.exports = { readTsv, filesInDir, readJSON, expandPath };