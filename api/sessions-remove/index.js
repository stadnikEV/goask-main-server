const SessionApp = require('../../models/sessionApp');

module.exports = (req, res, next) => {
  const sessionApp = res.locals.sessionApp;
  const speaker = res.locals.speaker;

  const sessionId = sessionApp._id;

  speaker.sessions.forEach((item) => {
    if (String(item) === String(sessionId)) {
      speaker.sessions.pull({ _id: String(item) })
      return;
    }
  });

  speaker.save()
    .then(() => {
      return SessionApp.remove({ _id: sessionId });
    })
    .then(() => {
      res.json({});
    })
    .catch((e) => {
      next(e);
    })
}
