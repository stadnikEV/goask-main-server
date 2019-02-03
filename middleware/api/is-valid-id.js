const HttpError = require('../../error');

module.exports = (req, res, next) => {
  const id = req.params.id;


  const match = id.match(/[a-zA-Z0-9а-яА-ЯёЁ]+/g);

  if (match.length !== 1) {
    next(new HttpError({
      status: 400,
    }));

    return;
  }

  next();
}
