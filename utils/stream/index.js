const fs = require('fs');

async function pipeStreamToFile(stream, filename) {
  const fileStream = fs.createWriteStream(filename);
  const watcher = new Promise((resolve, reject) => {
    fileStream.on('finish', resolve);
    stream.on('error', reject);
    stream.pipe(fileStream);
  });
  return watcher;
}

module.exports = {
  pipeStreamToFile,
}
