function makeFeature(data) {
  if (data === undefined) return {};
  return {
    type: 'Feature',
    properties: getAttributes(data),
    geometry: makeGeometry(data),
  };
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

function makeGeometry(data) {
  if (data === undefined) return {};
  return {
    type: 'MultiPolygon',
    coordinates: data.geometry.rings.map(x => [x]),
  };
}

module.exports = {
  makeFeature,
  makeGeometry,
}