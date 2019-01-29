const HttpError = require('../../error');
const Speaker = require('../../models/speaker');
const mongoose = require('../../libs/mongoose');
const sendMail = require('../../libs/google/gmail-api/send-email');
const config = require('../../config');
const getPublicPaths = require('../../libs/get-public-paths');


module.exports = (oauthGoogle, req, res, next) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const about = req.body.about;
  const categoryName = req.body.category;
  const createSpeaker = () => {

  if (res.locals.user.speakerId) {
    return Promise.reject(new HttpError({
      status: 403,
      message: 'speaker is already exists',
    }));
  }

  Speaker.count()
    .then((count) => {


      const speaker = new Speaker({
        _id: new mongoose.Types.ObjectId(),
        speakerId: count + 1,
        user: res.locals.user._id,
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
      req.session.speakerId = speaker.speakerId;
      res.locals.user.speakerId = speaker.speakerId;
      const { publicPathBackEnd } = getPublicPaths();
      sendMail({
        oauthGoogle,
        to: config.get('adminEmail'),
        theme: 'Запрос регистрации спикера',
        body: `Спикер ${firstname} ${lastname} подал запрос на регистрацию: ${publicPathBackEnd}/admin#speakers-confirm`,
      })
      return res.locals.user.save();
    })
    .then(() => {
      res.status(200);
      res.json({});
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
