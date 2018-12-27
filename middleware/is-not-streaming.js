const HttpError = require('../error');

module.exports = (statusVideo, req, res, next) => {
  const id = req.params.id;

  if (statusVideo[id]) {
    if (statusVideo[id] === 'streaming') {
      next(new HttpError({
        status: 403,
        message: 'The video is streaming now',
      }));

      return;
    }
  }

  next();
};
