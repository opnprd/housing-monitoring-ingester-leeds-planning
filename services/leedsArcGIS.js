const axios = require('axios');

// https://publicaccess.leeds.gov.uk/arcgis/rest/services/IDOXPA1/MapServer/9/query?
// f=json&
// where=REFVAL='14/04270/OT'&
// returnGeometry=true&outFields=*&outSR=4326

async function getPlanPolygon(planningRef) {
  const searchUrl = new URL('/arcgis/rest/services/IDOXPA1/MapServer/9/query', 'https://publicaccess.leeds.gov.uk');
  searchUrl.searchParams.append('f', 'json');
  searchUrl.searchParams.append('outFields', 'REFVAL,KEYVAL,DATEMODIFIED,ADDRESS,DESCRIPTION');
  searchUrl.searchParams.append('where', `(REFVAL='${planningRef}')`);
  searchUrl.searchParams.append('outSR', '4326'); // Output in WGS 84 http://spatialreference.org/ref/epsg/4326/
  const res = await axios(searchUrl.toString());
  return res;
}

module.exports = {
  getPlanPolygon,
};
