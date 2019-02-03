const SessionApp = require('../../models/sessionApp');
const HttpError = require('../../error');

module.exports = (req, res, next) => {
  const sessionId = parseInt(req.params.id, 10);

  if (Number.isNaN(sessionId)) {
    next(new HttpError({
      status: 404,
      message: 'Page not found',
    }));
    return;
  }

  SessionApp.findOne({ sessionId, status: 'active', active: true })
  .populate('speaker')
  .then((session) => {
      if (!session) {
        next(new HttpError({
          status: 404,
          message: 'Page not found',
        }));
        return;
      }

      res.locals.session = session;

      next();
    })
    .catch((e) => {
      next(e);
    });
}
