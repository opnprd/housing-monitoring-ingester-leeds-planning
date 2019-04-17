const debug = require('debug')('leedsPlanning/eventStore');
const axios = require('axios');
const fs = require('fs');

const eventEndpoint = 'http://localhost:8000/events';
const geometryEndpoint = (id) => `http://localhost:8000/event/${id}/geometry`;

const { Feature } = require('../cache/geometry');

const { sleep } = require('../utils');

async function createEvent(eventData) {
  const result = await axios({
    method: 'post',
    url: eventEndpoint,
    data: eventData,
  });
  return result.data;
}

async function addEventGeometry(id, geometryData) {
  const result = await axios({
    method: 'put',
    url: geometryEndpoint(id),
    data: geometryData,
  });
}

async function addEvents(data) {
  const output = [];
  const errors = [];

  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    try {
      const record = await createEvent(element);
      output.push(record);
      debug(`Attempting to read geometry for ${record.ref}`);
      const feature = new Feature(record.ref);
      const geojson = await feature.asGeometry(record.ref);
      await addEventGeometry(record.eventId, geojson);
    } catch(error) {
      debug(`Error creating event ${element}`);
      process.exit();
      console.error(error.message);
      errors.push(element);
    }
  }

  return output;
}

module.exports = { addEvents };
