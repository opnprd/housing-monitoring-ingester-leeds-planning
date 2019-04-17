const { getDataset } = require('./cache/dataset');
const { writeDataToFile } = require('./fileStream');
const { slice } = require('./utils');
const { addEvents } = require('./eventStore');

async function processPlanningData() {
  // if (process.env.DOWNLOAD !== undefined) await downloadCaseData().catch(console.error);

  await getDataset()
    .then(writeDataToFile('events.json', { pretty: true }))
    .then(slice(1))
    .then(addEvents)
    .catch(console.error);
}

processPlanningData().catch(console.error);
