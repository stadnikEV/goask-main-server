const isJson = require('../../libs/is-json');
const HttpError = require('../../error');
const Speaker = require('../../models/speaker');
const SessionApp = require('../../models/sessionApp');
const mongoose = require('../../libs/mongoose');


module.exports = (req, res, next) => {
  const dataStatus = isJson(req);

  if (!dataStatus.status) {
    next(dataStatus.httpError);
    return;
  }

  const addSession = () => {
    let speakerDB = null;

    Speaker.findOne({ speakerId: req.session.speakerId })
      .then((speaker) => {
        if (!speaker) {
          return Promise.reject(new HttpError({
            status: 403,
            message: 'user not speaker',
          }));
        }
        speakerDB = speaker;
        return SessionApp.count();
      })
      .then((count) => {
        const theme = req.body.theme;
        const describeSession = req.body.describeSession;
        const category = req.body.category;


        let isValidCategory = false;
        speakerDB.categories.forEach((item) => {
          if (item.categoryName === category) {
            isValidCategory = true;
          }
        });

        if (!isValidCategory) {
          return Promise.reject(new HttpError({
            status: 403,
            message: 'Category is not valid',
          }));
        }

        const sessionApp = new SessionApp({
          _id: new mongoose.Types.ObjectId(),
          sessionId: count + 1,
          speaker: speakerDB._id,
          theme,
          describeSession,
          category,
        });
        return sessionApp.save();
      })
      .then((sessionApp) => {
        speakerDB.sessions.push(sessionApp._id);
        return speakerDB.save();
      })
      .then(() => {
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
