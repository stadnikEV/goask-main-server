const HttpError = require('../../error');
const config = require('../../config');

module.exports = (req, res, next) => {
  const size = req.headers['content-length'];
  const maxFileSize = parseInt(config.get('maxFilesSizeUpload'), 10);

  if (size > maxFileSize) {
    res.header('Connection', 'close');
    next(new HttpError({
      status: 403,
      message: 'Maximum file length exceeded',
    }));

    return;
  }

  next();
};
