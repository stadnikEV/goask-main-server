const HttpError = require('../../error');

module.exports = (req, res, next) => {
  let isValidCategory = false;
  const category = req.body.category;

  res.locals.speaker.categories.forEach((item) => {
    if (item.categoryName === category) {
      isValidCategory = true;
    }
  });

  if (!isValidCategory) {
    const httpError = new HttpError({
      status: 403,
      message: 'Category is not valid',
    });
    next(httpError);
  }

  next();
};
