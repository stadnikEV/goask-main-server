const getCategory = require('./get-category.js');
const categoriesNameconfig  = require('../../../libs/categories-name-config.js');

const HttpError = require('../../../error');

module.exports = (req, res, next) => {
  let category = getCategory({ req });
  res.locals.category = category;

  if (!category) {
    next();
    return;
  }

  if (!categoriesNameconfig[category]) {
    const httpError = new HttpError({
      status: 404,
      message: 'Page not found',
    });
    next(httpError);
  }

  next();
};
