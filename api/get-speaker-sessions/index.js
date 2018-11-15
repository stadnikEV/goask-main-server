const HttpError = require('../../error');
const Speaker = require('../../models/speaker');

module.exports = (req, res, next) => {
  Speaker.findOne({ speakerId: req.params.id })
    .populate('sessions', 'sessionId theme describeSession category -_id')
    .then((speaker) => {
      if (!speaker) {
        return Promise.reject(new HttpError({
          status: 403,
          message: 'speaker was not found',
        }));
      }

      res.json(speaker.sessions);
    })
    .catch((e) => {
      next(e);
    });
}
