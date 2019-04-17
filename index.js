const { getCasesFromLocalCache, downloadCaseData } = require('./dataset');
const { writeDataToFile } = require('./fileStream');
const { slice } = require('./utils');
const { addEvents } = require('./eventStore');

async function processPlanningData() {
  // if (process.env.DOWNLOAD !== undefined) await downloadCaseData().catch(console.error);

  await getCasesFromLocalCache()
    .then(slice(2))
    .then(writeDataToFile('events.json', { pretty: true }))
    .then(addEvents)
    .catch(console.error);
}

processPlanningData().catch(console.error);
