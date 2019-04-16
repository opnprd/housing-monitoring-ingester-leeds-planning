const { getCasesFromLocalCache, downloadCaseData } = require('./dataset');
const { writeDataToFile } = require('./fileStream');
const { slice } = require('./utils');
const { addEvents } = require('./eventStore');

const geometry = require('./geometry');
const planRef = '14/04270/OT';

async function processPlanningData() {
  // if (process.env.DOWNLOAD !== undefined) await downloadCaseData().catch(console.error);

  await getCasesFromLocalCache()
    .then(slice(10))
    .then(writeDataToFile('events.json', { pretty: true }))
    .then(addEvents)
    .then(console.log)
    .catch(console.error);
}
// geometry(planRef).then(JSON.stringify).then(console.log);

processPlanningData().catch(console.error);
