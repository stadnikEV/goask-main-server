const HttpError = require('../../error');

module.exports = (downloadVideo, req, res, next) => {
  const questionId = req.params.id;

  if (downloadVideo[questionId]) {
    next(new HttpError({
      status: 403,
      message: 'The video is downloading now',
    }));

    return;
  }

  next();
};
