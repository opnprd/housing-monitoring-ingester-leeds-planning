const axios = require('axios');

// https://publicaccess.leeds.gov.uk/arcgis/rest/services/IDOXPA1/MapServer/9/query?
// f=json&
// where=REFVAL='14/04270/OT'&
// returnGeometry=true&outFields=*&outSR=4326

async function queryPlanningGIS(planningRef) {
  const searchUrl = new URL('/arcgis/rest/services/IDOXPA1/MapServer/9/query', 'https://publicaccess.leeds.gov.uk');

  searchUrl.searchParams.append('f', 'json');
  searchUrl.searchParams.append('outFields', 'REFVAL,KEYVAL,DATEMODIFIED,ADDRESS,DESCRIPTION');
  searchUrl.searchParams.append('where', `(REFVAL='${planningRef}')`);
  searchUrl.searchParams.append('outSR', '4326'); // Output in WGS 84 http://spatialreference.org/ref/epsg/4326/

  const res = await axios(searchUrl.toString());
  
  return res;
}

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
    type: 'Polygon',
    coordinates: data.geometry.rings,
  };
}

module.exports = async (planRef) => {
  let arcGisData;
  try {
    arcGisData = await queryPlanningGIS(planRef).then((res) => res.data.features[0]);
  } catch(error) {
    console.error(error);
    return {}
  }

  return makeFeature(arcGisData);
}

  // getGeometry(ref) => 
  // .then((res) => res.data.features[0])  // Get only the first feature
  // .then(makeFeature)                    // Turn that into a GeoJSON feature
  // .then(JSON.stringify)                 // ...and render it as a string
  // .then(console.log)                    // ...before printing to the console
  // .catch(console.error);                // Handle any errors that occur
