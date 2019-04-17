const path = require('path');
const fs = require('fs');
const debug = require('debug')('leedsPlanning/cache/geometry');

const { getPlanPolygon } = require('../../services/leedsArcGIS');
const { makeFeature, makeGeometry } = require('./geojson');
const { sleep } = require('../../utils');

/**
 * Create filepath for reference
 * @param {string} ref Reference name for feature
 */
function featureFilePath(ref) {
  return path.resolve(`${__dirname}/data/${ref.replace(/\//g, '_')}.json`);
}

const rateTimeout = 2000;
let rateLimit = Promise.resolve();

function setRateLimit() {
  rateLimit = sleep(rateTimeout);
}

class Feature {
  constructor(ref) {
    this.ref = ref;
    this.filename = featureFilePath(ref);
  }

  async downloadToCache() {
    if (this.cached) return;
    try {
      await rateLimit;
      debug(`Downloading feature ${this.ref}`);
      const arcGisData = await getPlanPolygon(this.ref).then((res) => res.data.features[0]);
      await new Promise((resolve, reject) => {
        fs.writeFile(this.filename, JSON.stringify(arcGisData, null, 2), {}, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      setRateLimit();
    } catch(error) {
      console.error(error);
    }
  }

  get cached() {
    return fs.existsSync(this.filename);
  }

  async readFromCache() {
    if (!this.cached) await this.downloadToCache();
    return new Promise((resolve, reject) => {
      fs.readFile(this.filename,
        (err, data) => {
          if (err) {
            console.error()
            reject(err);
          } else {
            resolve(JSON.parse(data.toString('utf8')));
          }
        }
      )    
    });
  }

  async asFeature() {
    const data = await this.readFromCache();
    return makeFeature(data);
  }

  async asGeometry() {
    const data = await this.readFromCache();
    return makeGeometry(data);
  }
}

module.exports = {
  Feature,
}
