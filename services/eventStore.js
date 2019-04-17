const axios = require('axios');
const debug = require('debug')('leedsPlanning/services/eventStore');

async function createEvent(eventData) {
  const eventEndpoint = 'http://localhost:8000/events';

  debug(`Creating event`);

  const result = await axios({
    method: 'post',
    url: eventEndpoint,
    data: eventData,
  });
  return result.data;
}

async function addEventGeometry(id, geometryData) {
  const geometryEndpoint = (id) => `http://localhost:8000/event/${id}/geometry`;

  debug(`Setting geometry for ${id}`);

  await axios({
    method: 'put',
    url: geometryEndpoint(id),
    data: geometryData,
  });
}

module.exports = {
  createEvent,
  addEventGeometry,
};
