const HttpError = require('../../error');

module.exports = (req, res, next) => {
  const user = res.locals.user;
  const session = res.locals.session;

  if (user.speakerId === session.speaker.speakerId) {
    next(new HttpError({
      status: 403,
      message: 'the question is yourself',
    }));

    return;
  }

  next();
};
