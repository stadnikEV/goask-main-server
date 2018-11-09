const categoriesNameconfig  = require('../../libs/categories-name-config.js');

const HttpError = require('../../error');

module.exports = (req, res, next) => {
  const category = (req.params.category)
    ? req.params.category
    : req.body.category;

  if (!categoriesNameconfig[category]) {
    const httpError = new HttpError({
      status: 404,
      message: 'Page not found',
    });
    next(httpError);
  }

  next();
};
