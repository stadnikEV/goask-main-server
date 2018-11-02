const SessionApp = require('../models/sessionApp');

module.exports = (() => {
  const promise = new Promise((resolve, reject) => {
    SessionApp.findOne()
      .sort({ field: 'asc', _id: -1 })
      .then((session) => {
        if (!session) {
          resolve(1);
          return;
        }
        resolve(session.sessionId);
      })
      .catch((e) => {
        reject(e);
      });
  });
  return promise;
});
