const HttpError = require('../../error');
const Speaker = require('../../models/speaker');

module.exports = (req, res, next) => {
  console.log(req.params.id);
  Speaker.findOne({ speakerId: req.params.id })
    .populate('sessions')
    .then((speaker) => {
      if (!speaker) {
        return Promise.reject(new HttpError({
          status: 403,
          message: 'speaker was not found',
        }));
      }
      const sessions = speaker.sessions;
      res.json(sessions);
    })
    .catch((e) => {
      next(e);
    });
}
