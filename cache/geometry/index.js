const path = require('path');
const fs = require('fs');
const debug = require('debug')('leedsPlanning/cache/geometry');

const { getPlanPolygon } = require('../../services/leedsArcGIS');
const { makeFeature, makeGeometry } = require('./geojson');

/**
 * Create filepath for reference
 * @param {string} ref Reference name for feature
 */
function featureFilePath(ref) {
  return path.resolve(`${__dirname}/data/${ref.replace(/\//g, '_')}.json`);
}

class Feature {
  constructor(ref) {
    this.ref = ref;
    this.filename = featureFilePath(ref);
  }

  async downloadToCache() {
    if (this.cached) return;
    debug(`Downloading feature ${this.ref}`);
    try {
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
