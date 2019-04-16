const debug = require('debug')('planningPerms/eventStore');
const axios = require('axios');

const eventEndpoint = 'http://localhost:8000/events';
const { sleep } = require('../utils');

async function createEvent(eventData) {
  await axios({
    method: 'post',
    url: eventEndpoint,
    data: eventData,
  });
}

async function addEvents(data) {
  const output = [];
  const errors = [];

  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    try {
      await createEvent(element);
      process.stdout.write('.');
    } catch(error) {
      debug(`Error creating event ${element}`);
      console.error(error.message);
      errors.push(element);
    }
  }

  debug(errors);
  return data;
}

module.exports = { addEvents };
