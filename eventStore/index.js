const debug = require('debug')('planningPerms/eventStore');
const axios = require('axios');

const eventEndpoint = 'http://localhost:8000/events';
const { sleep } = require('../utils');

async function createEvent(eventData) {
  const result = await axios({
    method: 'post',
    url: eventEndpoint,
    data: eventData,
  });
  return result.data;
}

async function addEvents(data) {
  const output = [];
  const errors = [];

  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    try {
      const record = await createEvent(element);
      process.stdout.write('.');
      output.push(record);
    } catch(error) {
      debug(`Error creating event ${element}`);
      console.error(error.message);
      errors.push(element);
    }
  }

  process.stdout.write('\n\nFinished adding events\n')
  debug(errors);
  return output;
}

module.exports = { addEvents };
