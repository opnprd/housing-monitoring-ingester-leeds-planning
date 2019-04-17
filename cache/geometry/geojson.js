const debug = require('debug')('leedsPlanning/cache/geometry/geojson');

function makeFeature(data) {
  if (data === undefined) return {};
  return {
    type: 'Feature',
    properties: getAttributes(data),
    geometry: makeGeometry(data),
  };
}

function makeGeometry(data) {
  const { rings } = data.geometry;
  if (data === undefined) return {};
  return rings.length === 2 ? convertRingsToMultiPolygon(rings) : convertRingsToPolygon(rings);
}

function convertRingsToPolygon(rings) {
  return {
    type: 'Polygon',
    coordinates: rings,
  }
}

function convertRingsToMultiPolygon(rings) {
  return {
    type: 'MultiPolygon',
    coordinates: rings.map(x => [x]),
  }
}


function getAttributes(data) {
  if (data === undefined) return {};
  const attributes = Object.entries(data.attributes)
    .map(([k, v]) => {
      const key = k.toLowerCase()
      let value;
      if (key === 'datemodified') {
        value = new Date(v);
      } else if ( v.replace !== undefined ) {
        value = v.replace(/\r/g, ' ').trim();
      }
      return [ key, value ]})
    .reduce((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {});
  return attributes;
}

module.exports = {
  makeFeature,
  makeGeometry,
}