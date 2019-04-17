const axios = require('axios');

async function getCsvDataAsStream(url) {
  const res = await axios({
    method: 'get',
    url: url,
    responseType: 'stream',
  });
  return res.data;
}

module.exports = {
  getCsvDataAsStream,
}