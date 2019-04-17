const fs = require('fs');
const { promisify } = require('util');

const asyncWriteFile = promisify(fs.writeFile);

function teeDataToFile(filename, processor = JSON.stringify) {
  return async (data) => {
    await asyncWriteFile(filename, processor(data));
    return data;
  }
}

module.exports = {
  teeDataToFile,
};