const debug = require('debug')('leedsPlanning/cache/geometry/geojson');

function fixRing(ring) {
  const newRing = removeDuplicates(ring);
  return newRing;
}

function removeDuplicates(ring) {
  const coordHash = (c) => c.toString();

  function filterDuplicates(coord, index, orig) {
    if (index === 0 || index === orig.length-1 ) return true;
    return !orig.slice(0, index-1).map(coordHash).includes(coordHash(coord));;
  }
  const filteredRing = ring.filter(filterDuplicates);
  if ( ring.length !== filteredRing.length) debug(`Reduced ring from ${ring.length} to ${filteredRing.length}`);
  return filteredRing;
}

function makeFeature(data) {
  if (data === undefined) return {};
  return {
    type: 'Feature',
    properties: getAttributes(data),
    geometry: makeGeometry(data),
  };
}

function makeGeometry(data) {
  const rings = data.geometry.rings.map(fixRing);
  if (data === undefined) return {};
  return rings.length >= 2 ? convertRingsToMultiPolygon(rings) : convertRingsToPolygon(rings);
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