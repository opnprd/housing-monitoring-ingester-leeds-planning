const fs = require('fs');
const parse = require('csv-parse');
const debug = require('debug')('leedsPlanning/cache/dataset');

const { filterCases, simplifyData } = require('./filters');
const { getCsvDataAsStream } = require('../../services/leedsOpenData');

async function pipeStreamToFile(stream, filename) {
  const fileStream = fs.createWriteStream(filename);
  const watcher = new Promise((resolve, reject) => {
    fileStream.on('finish', resolve);
    stream.on('error', reject);
    stream.pipe(fileStream);
  });
  return watcher;
}

/**
 * Guidance availavble at
 *     https://datamillnorth.org/download/planning-applications-datamill/2b18181b-f223-4406-985f-863be2f56d55/guidance.csv
 */
class Dataset {
  constructor() {
    this.filename = `${__dirname}/data/apps.csv`
    this.url = 'http://opendata.leeds.gov.uk/downloads/planning/applications/apps.csv';
  }

  async downloadFile() {
    if (this.cached) return;
    debug(`Downloading file from ${this.url}`);
    const datasetStream = await getCsvDataAsStream(this.url);
    await pipeStreamToFile(datasetStream, this.filename);
  }

  async readFileAsStream() {
    if (!this.cached) await this.downloadFile();
    return fs.createReadStream(this.filename);
  }

  get cached() {
    return fs.existsSync(this.filename);
  }

  async readFromCache() {
    const fileStream = await this.readFileAsStream();

    const watcher = new Promise((resolve, reject) => {
      const parser = parse({
        columns: true,
      }, (err, records) => {
        if (err) {
          reject(err)
        } else {
          resolve(records);
        }
      });
      fileStream.pipe(parser);
    }).then(filterCases).then(simplifyData);

    return watcher;
  }
}

module.exports = {
  getDataset: () => {
    const dataset = new Dataset();
    return dataset.readFromCache();
  }
}