const HttpError = require('../error');

module.exports = (req) => {
  let httpError = null;
  if (req.headers['content-type'] !== 'application/json') {
    httpError = new HttpError({
      status: 403,
      message: 'The data is not JSON',
    });
    return { httpError };
  }
  return { status: true };
}
