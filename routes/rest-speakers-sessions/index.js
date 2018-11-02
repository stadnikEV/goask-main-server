const HttpError = require('../../error');
const Speaker = require('../../models/speaker');

module.exports = (req, res, next) => {
  Speaker.findOne({ speakerId: req.params.id })
    .populate('sessions')
    .then((speaker) => {
      if (!speaker) {
        return Promise.reject(new HttpError({
          status: 403,
          message: 'speaker was not found',
        }));
      }
      let sessions = speaker.sessions;
      const sessionsResponse = [];

      sessions.forEach((item) => {
        sessionsResponse.push({
          sessionId: item.sessionId,
          theme: item.theme,
          describeSession: item.describeSession,
          category: item.category,
        });
      });

      res.json(sessionsResponse);
    })
    .catch((e) => {
      next(e);
    });
}
