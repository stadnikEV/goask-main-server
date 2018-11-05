const HttpError = require('../../error');
const Speaker = require('../../models/speaker');
const getPublicPaths = require('../../libs/get-public-paths');
const mongoose = require('../../libs/mongoose');


module.exports = (req, res, next) => {
  const createSpeaker = () => {
    if (res.locals.user.speakerId) {
      return Promise.reject(new HttpError({
        status: 403,
        message: 'speaker is already exists',
      }));
    }

    Speaker.count()
      .then((count) => {
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const about = req.body.about;
        const categoryName = req.body.category;

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
        res.locals.user.speakerId = speaker.speakerId;
        return res.locals.user.save();
      })
      .then((user) => {
        res.status(201);
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
