const isJson = require('../../libs/is-json');
const HttpError = require('../../error');
const isLogin = require('../../libs/is-login');
const User = require('../../models/user');
const Speaker = require('../../models/speaker');
const getPublicPaths = require('../../libs/get-public-paths');


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
        if (user.speaker.speakerId) {
          return Promise.reject(new HttpError({
            status: 403,
            message: 'speaker already exists',
          }));
        }
        userDB = user;
        return Speaker.count();
      })
      .then((count) => {
        const speaker = new Speaker({
          speakerId: count + 1,
          user: userDB._id,
        });
        return speaker.save();
      })
      .then((speaker) => {
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const about = req.body.about;
        const categoryName = req.body.category;

        userDB.speaker = {
          speakerId: speaker.speakerId,
          about,
          firstname,
          lastname,
          category: [
            {
              categoryName,
            },
          ],
        };

        return userDB.save();
      })
      .then(() => {
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
