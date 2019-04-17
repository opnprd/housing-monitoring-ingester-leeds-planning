const { getDataset } = require('./cache/dataset');
const { teeDataToFile } = require('./utils/file');
const { slice } = require('./utils');
const { addEvents } = require('./process');

async function processPlanningData() {
  await getDataset()
    .then(teeDataToFile('events.json', (_) => JSON.stringify(_, null, 2)))
    .then(addEvents)
    .catch(console.error);
}

processPlanningData().catch(console.error);
