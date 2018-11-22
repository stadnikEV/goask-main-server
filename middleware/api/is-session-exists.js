const SessionApp = require('../../models/sessionApp');
const HttpError = require('../../error');

module.exports = (req, res, next) => {
  const sessionId = req.body.sessionId;

  SessionApp.findOne({ sessionId, status: 'active' })
    .populate('speaker')
    .then((session) => {
      if (!session) {
        return Promise.reject(new HttpError({
          status: 403,
          message: 'session not found',
        }));
      }

      res.locals.session = session;
      next();
    })
    .catch((e) => {
      next(e);
    });
};
