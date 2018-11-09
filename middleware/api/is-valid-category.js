const categoriesNameconfig  = require('../../libs/categories-name-config.js');

const HttpError = require('../../error');

module.exports = (req, res, next) => {
  const category = (req.params.category)
    ? req.params.category
    : req.body.category;

  if (!categoriesNameconfig[category]) {
    const httpError = new HttpError({
      status: 403,
      message: 'Category is not valid',
    });
    next(httpError);
  }

  next();
};
