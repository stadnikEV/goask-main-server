const Speaker = require('../../models/speaker');
const HttpError = require('../../error');

module.exports = (req, res, next) => {
  Speaker.findOne({ speakerId: req.session.speakerId })
    .then((speaker) => {
      if (!speaker) {
        return Promise.reject(new HttpError({
          status: 403,
          message: 'speaker is not authorized',
        }));
      }
      res.locals.speaker = speaker;
      next();
    })
    .catch((e) => {
      next(e);
    });
};
