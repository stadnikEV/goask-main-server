const SessionApp = require('../../models/sessionApp');
const HttpError = require('../../error');

module.exports = (req, res, next) => {
  SessionApp.findOne({ sessionId: req.params.id })
    .populate('speaker')
    .then((sessionApp) => {
      if (!sessionApp) {
        return Promise.reject(new HttpError({
          status: 403,
          message: 'session not found',
        }));
      }
      res.locals.sessionApp = sessionApp;
      next();
    })
    .catch((e) => {
      next(e);
    });
};
