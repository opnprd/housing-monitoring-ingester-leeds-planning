const moment = require('moment');

function filterCases(data) {
  const codes = [6001, 6007].map((code) => `http://opendatacommunities.org/def/concept/planning/application/6000/${code}`);
  return data.filter((row) => (
    codes.includes(row.classificationURL) &&
    row.decision === 'Approve'
  ));
}

function getDate(element) {
  let date = moment(element.decisionDate, 'DD/MM/YY');
  return date;
}

function simplifyData(data) {
  return data.map(row => ({
    ref: row.caseReference,
    type: 'planningPermission',
    date: getDate(row),
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

function sortByDate(data) {
  return data.sort((a, b) => a.date.diff(b.date)); 
}

module.exports = {
  filterCases,
  simplifyData,
  sortByDate,
}