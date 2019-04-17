const { Feature } = require('./cache/geometry');
const { teeDataToFile } = require('./utils/file');
const { findEvent, addEventGeometry } = require('./services/eventStore');

const errors = [
  "15/07671/FU",
  "14/03733/FU",
  "14/04302/FU",
  "14/05555/RM",
  "15/01306/RM",
  "15/01592/RM",
  "17/03816/OT",
  "15/01973/FU",
  "16/07987/OT"
];

// NB - this will not honour the rate limiter
Promise.all(errors.map(async (ref) => {
  const f = new Feature(ref);
  return f.asFeature();
}))
  .then((_) => ({ type: 'FeatureCollection', features: _ }))
  .then(teeDataToFile('./brokenFeatures.json', _ => JSON.stringify(_, null, 2)))
  .then(_ => _.features)
  .then(_ => {
    return Promise.all(_.map(async feature => {
      const event = await findEvent(feature.properties.refval).catch(console.error);
      return { eventId: event[0].eventId, geometry: feature.geometry };  
    }));
  })
  .then(_ => {
    return Promise.all(_.map(async feature => {
      const { eventId, geometry } = feature;
      try {
        addEventGeometry(eventId, geometry).catch(_ => console.error(_.message));
      } catch(error) {
        return error;
      }
    }));
  })
  .then(console.log)
  .catch(console.error);

