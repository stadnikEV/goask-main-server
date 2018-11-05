const SessionApp = require('../../models/sessionApp');
const mongoose = require('../../libs/mongoose');
const getLastSessionId = require('./get-last-session-id');


module.exports = (req, res, next) => {
  const addSession = () => {
    getLastSessionId()
      .then((lastSessionId) => {
        const theme = req.body.theme;
        const describeSession = req.body.describeSession;
        const category = req.body.category;

        const sessionApp = new SessionApp({
          _id: new mongoose.Types.ObjectId(),
          sessionId: lastSessionId + 1,
          speaker: res.locals.speaker._id,
          theme,
          describeSession,
          category,
        });

        return sessionApp.save();
      })
      .then((sessionApp) => {
        res.locals.speaker.sessions.push(sessionApp._id);
        return res.locals.speaker.save();
      })
      .then(() => {
        res.status(201);
        res.json({});
      })
      .catch((e) => {
        if (e.name === 'MongoError' && e.code === 11000) {
          addSession();
          return;
        }
        next(e);
      });
  };

  addSession();
}
