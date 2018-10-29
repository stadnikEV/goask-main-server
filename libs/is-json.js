const HttpError = require('../error');

module.exports = (req) => {
  let httpError = null;
  if (req.headers['content-type'] !== 'application/json') {
    httpError = new HttpError({
      status: 400,
      message: 'The data is not JSON',
    });
    return { httpError };
  }
  return { status: true };
}
