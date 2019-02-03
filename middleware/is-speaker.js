const Speaker = require('../models/speaker');
const HttpError = require('../error');
const isMultipartFormData = require('../libs/is-multipart-form-data');
const isAdmin = require('../libs/is-admin');

module.exports = (req, res, next) => {
  isAdmin({ req })
    .then((admin) => {
      console.log(admin);
      if (admin) {
        next();
        return 'admin';
      }

      return Speaker.findOne({ speakerId: req.session.speakerId });
    })
    .then((speaker) => {
      if (speaker === 'admin') {
        return;
      }

      if (!speaker || !speaker.active) {
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
