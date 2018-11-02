const HttpError = require('../../error');
// const isLogin = require('../../libs/is-login');
// const User = require('../../models/user');
// const Speaker = require('../../models/speaker');
const SessionApp = require('../../models/sessionApp');
// const getPublicPaths = require('../../libs/get-public-paths');
// const mongoose = require('../../libs/mongoose');

let sessionId = null;

module.exports = (req, res, next) => {
  SessionApp.findOne({ sessionId: req.params.id })
    .populate('speaker')
    .then((session) => {
      if (!session) {
        return Promise.reject(new HttpError({
          status: 403,
          message: 'session not found',
        }));
      }
      if (session.speaker.speakerId !== req.session.speakerId) {
        return Promise.reject(new HttpError({
          status: 403,
          message: 'Speaker not authorized',
        }));
      }
      sessionId = session._id;

      session.speaker.sessions.forEach((item) => {
        if (String(item) === String(session._id)) {
          session.speaker.sessions.pull({ _id: String(item) })
          return;
        }
      });
      return session.speaker.save();
    })
    .then(() => {
      return SessionApp.remove({ _id: sessionId });
    })
    .then(() => {
      res.json({});
    })
    .catch((e) => {
      next(e);
    })


    // isLogin({ req, User })
    //   .then((user) => {
    //
    //     if (user.speakerId) {
    //       return Promise.reject(new HttpError({
    //         status: 403,
    //         message: 'speaker already exists',
    //       }));
    //     }
    //     userDB = user;
    //     return Speaker.count();
    //   })
    //   .then((count) => {
    //     const firstname = req.body.firstname;
    //     const lastname = req.body.lastname;
    //     const about = req.body.about;
    //     const categoryName = req.body.category;
    //
    //     const speaker = new Speaker({
    //       _id: new mongoose.Types.ObjectId(),
    //       speakerId: count + 1,
    //       user: userDB._id,
    //       about,
    //       firstname,
    //       lastname,
    //       categories: [
    //         {
    //           categoryName,
    //         },
    //       ],
    //     });
    //     return speaker.save();
    //   })
    //   .then((speaker) => {
    //     userDB.speakerId = speaker.speakerId;
    //     return userDB.save();
    //   })
    //   .then((user) => {
    //     req.session.userId = user._id;
    //     req.session.speakerId = user.speakerId;
    //     let { publicPathBackEnd } = getPublicPaths();
    //     res.json({ link: `${publicPathBackEnd}` });
    //   })
    //   .catch((e) => {
    //     if (e.name === 'MongoError' && e.code === 11000) {
    //       createSpeaker();
    //       return;
    //     }
    //     next(e);
    //   });
}
