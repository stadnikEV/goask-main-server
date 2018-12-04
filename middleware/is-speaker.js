const Speaker = require('../models/speaker');
const HttpError = require('../error');

module.exports = (req, res, next) => {
  Speaker.findOne({ speakerId: req.session.speakerId })
    .then((speaker) => {
      if (!speaker) {
        if (req.headers['content-type'] === 'application/json') {
          return Promise.reject(new HttpError({
            status: 403,
            message: 'Speaker is not authorized',
          }));
        }

        res.redirect('/registration-speaker');

        return;
      }
      res.locals.speaker = speaker;
      next();
    })
    .catch((e) => {
      next(e);
    });
};
