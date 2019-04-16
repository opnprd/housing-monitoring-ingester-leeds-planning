const fs = require('fs');
const axios = require('axios');
const parse = require('csv-parse');
const datasetLink = 'http://opendata.leeds.gov.uk/downloads/planning/applications/apps.csv';
const datasetGuidance = 'https://datamillnorth.org/download/planning-applications-datamill/2b18181b-f223-4406-985f-863be2f56d55/guidance.csv';

async function getCsvDataAsStream() {
  const res = await axios({
    method: 'get',
    url: datasetLink,
    responseType: 'stream',
  });
  return res.data;
}

function saveCsvData(stream) {
  stream.pipe(fs.createWriteStream('dataset.csv'));
};

function readLocalCsvFileAsStream() {
  return Promise.resolve(fs.createReadStream('dataset.csv'));
}

function parseCsvData(stream) {
  const watcher = new Promise((resolve, reject) => {
    const parser = parse({
      columns: true,
    }, (err, records) => {
      if (err) reject(err);
      resolve(records);
    });
    stream.pipe(parser);
  });

  return watcher;
}

function filterCases(data) {
  const codes = [6001, 6007].map((code) => `http://opendatacommunities.org/def/concept/planning/application/6000/${code}`);
  return data.filter((row) => (
    codes.includes(row.classificationURL) &&
    row.decision === 'Approve'
  ));
}

function simplifyData(data) {
  return data.map(row => ({
    ref: row.caseReference,
    type: 'planningPermission',
    date: new Date(row.decisionDate),
    eventData: {
      summary: row.caseText.replace(/\r/g, ' ').trim(),
      locationDescription: row.locationText.replace(/\r/g, ' ').trim(),
      decision: row.decision,
      organisation: [ row.organisationLabel, row.organisationURL ],
      caseUrl: row.caseURL,
      caseDate: new Date(row.caseDate),
      typeOfRequest: [ row.serviceTypeLabel, row.serviceTypeURL ],
      typeOfDevelopment: [ row.classificationLabel, row.classificationURL ],
    },
  }))
}

const downloadCaseData = () => getCsvDataAsStream().then(saveCsvData);

const getCasesFromLocalCache = () => {
  return readLocalCsvFileAsStream()
    .then(parseCsvData)
    .then(filterCases)
    .then(simplifyData);
}

module.exports = {
  downloadCaseData,
  getCasesFromLocalCache,
}