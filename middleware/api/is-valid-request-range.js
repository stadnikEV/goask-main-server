const getParams = require('../../libs/get-params.js');

const HttpError = require('../../error');

module.exports = (req, res, next) => {
  const params = getParams({ req });

  const from = parseInt(params.from, 10);
  const to = parseInt(params.to, 10);

  if (Number.isNaN(from)
  || Number.isNaN(to)
  || from < 1
  || from >= to) {
    const httpError = new HttpError({
      status: 400,
      message: 'Not correct request data',
    });
    next(httpError);
    return;
  }

  res.locals.params = params;

  next();
};
