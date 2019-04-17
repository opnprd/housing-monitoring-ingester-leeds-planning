const debug = require('debug')('leedsPlanning/eventStore');

const { createEvent, addEventGeometry } = require('../services/eventStore');
const { Feature } = require('../cache/geometry');

async function addEvents(data) {
  const output = [];
  const errors = [];

  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    const { ref } = element;
    debug(`Processing plan ${ref}`);
    let record;
    try {
      record = await createEvent(element);
      output.push(record);
    } catch (error) {
      debug(`Problem creating event for ${ref}`)
      console.error(error.message);
      continue;
    }
    try {
      const { eventId } = record;
      const feature = new Feature(ref);
      const geojson = await feature.asGeometry();
      await addEventGeometry(eventId, geojson);
    } catch(error) {
      debug(`Can't add geometry to event with ID ${record.eventId}`);
      console.error(error.message);
      errors.push(element);
      break; // Break on error - alternative is continue...
    }
  }

  return output;
}

module.exports = { addEvents };
