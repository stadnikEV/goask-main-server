const isJson = require('../../libs/is-json');
const HttpError = require('../../error');
const isLogin = require('../../libs/is-login');
const User = require('../../models/user');
const Speaker = require('../../models/speaker');
const getPublicPaths = require('../../libs/get-public-paths');
const mongoose = require('../../libs/mongoose');


module.exports = (req, res, next) => {
  const dataStatus = isJson(req);

  if (!dataStatus.status) {
    next(dataStatus.httpError);
    return;
  }

  const createSpeaker = () => {
    let userDB = null;

    isLogin({ req, User })
      .then((user) => {
        if (!user) {
          return Promise.reject(new HttpError({
            status: 403,
            message: 'user is not authorized',
          }));
        }
        if (user.speakerId) {
          return Promise.reject(new HttpError({
            status: 403,
            message: 'speaker already exists',
          }));
        }
        userDB = user;
        return Speaker.count();
      })
      .then((count) => {
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const about = req.body.about;
        const categoryName = req.body.category;

        const speaker = new Speaker({
          _id: new mongoose.Types.ObjectId(),
          speakerId: count + 1,
          user: userDB._id,
          about,
          firstname,
          lastname,
          categories: [
            {
              categoryName,
            },
          ],
        });
        return speaker.save();
      })
      .then((speaker) => {
        userDB.speakerId = speaker.speakerId;
        return userDB.save();
      })
      .then((user) => {
        req.session.userId = user._id;
        req.session.speakerId = user.speakerId;
        let { publicPathBackEnd } = getPublicPaths();
        res.json({ link: `${publicPathBackEnd}` });
      })
      .catch((e) => {
        if (e.name === 'MongoError' && e.code === 11000) {
          createSpeaker();
          return;
        }
        next(e);
      });
  };

  createSpeaker();
}
