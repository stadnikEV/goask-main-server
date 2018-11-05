const HttpError = require('../../error');

module.exports = (req, res, next) => {
  const speakerId = res.locals.speaker.speakerId;
  if (speakerId !== req.session.speakerId) {
    const httpError = new HttpError({
      status: 403,
      message: 'Session can not be changed. Access is denied',
    });
    next(httpError);
    return;
  }
  next();
};
