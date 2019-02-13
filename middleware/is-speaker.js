const Speaker = require('../models/speaker');
const HttpError = require('../error');
const isMultipartFormData = require('../libs/is-multipart-form-data');
const isAdmin = require('../libs/is-admin');

module.exports = (req, res, next) => {

  let speaker = null;
  Speaker.findOne({ speakerId: req.session.speakerId })
    .then((model) => {
      speaker = model;
      return isAdmin({ req })
    })
    .then((admin) => {
      if (!speaker || !speaker.active) {

        if (admin) {
          next();
          return;
        }

        const contentType = req.headers['content-type'];
        if (contentType === 'application/json'
        || isMultipartFormData({ contentType })
        || contentType === 'video/webm') {
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
