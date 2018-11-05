const HttpError = require('../../error');

module.exports = (req, res, next) => {
  let httpError = null;
  if (req.headers['content-type'] !== 'application/json') {
    httpError = new HttpError({
      status: 400,
      message: 'The data is not JSON',
    });
    next(httpError);
    return;
  }
  next();
}
