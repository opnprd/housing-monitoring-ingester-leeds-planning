const { getDataset } = require('./cache/dataset');

const { teeDataToFile } = require('./utils/file');
const { slice } = require('./utils');
const { addEvents } = require('./eventStore');

async function processPlanningData() {
  // if (process.env.DOWNLOAD !== undefined) await downloadCaseData().catch(console.error);

  await getDataset()
    .then(teeDataToFile('events.json', (_) => JSON.stringify(_, null, 2)))
    .then(slice(1))
    .then(addEvents)
    .catch(console.error);
}

processPlanningData().catch(console.error);
