const HttpError = require('../../error');

module.exports = (uploadVideo, req, res, next) => {
  const questionId = req.params.id;

  if (uploadVideo[questionId]) {
    next(new HttpError({
      status: 403,
      message: 'The video is uploading now',
    }));

    return;
  }

  next();
};
