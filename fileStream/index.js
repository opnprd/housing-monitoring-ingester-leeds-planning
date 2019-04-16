const fs = require('fs');

function writeDataToFile(file, options={ pretty: false }) {
  const stream = fs.createWriteStream(file);

  return (data) => {
    const watcher = new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(data));
      stream.on('error', (error) => reject(error));
    });
    const contents = options.pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    stream.write(contents);
    stream.end();
    return watcher;
  }
}

module.exports = {
  writeDataToFile
}