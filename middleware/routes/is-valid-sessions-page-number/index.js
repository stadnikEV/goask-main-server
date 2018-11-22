const SessionApp = require('../../../models/sessionApp');
const getPageNumber = require('./get-page-number');
const getNumberOfPages = require('./get-number-of-pages');
const HttpError = require('../../../error');

module.exports = (req, res, next) => {
  const pageNumber = getPageNumber({ req });

  if (Number.isNaN(pageNumber)) {
    next(new HttpError({
      status: 404,
      message: 'Page not found',
    }));
    return;
  }

  res.locals.searchRequest = {
    status: 'active',
  };

  if (res.locals.category) {
    res.locals.searchRequest.category = res.locals.category;
  }

  SessionApp.find(res.locals.searchRequest)
  .count()
  .then((numberOfDocs) => {
      const numberOfPages = getNumberOfPages({ numberOfDocs });
      if (pageNumber > numberOfPages || pageNumber < 1) {

        next(new HttpError({
          status: 404,
          message: 'Page not found',
        }));
        return;
      }

      res.locals.pageNumber = pageNumber;
      res.locals.numberOfPages = numberOfPages;

      next();
    })
    .catch((e) => {
      next(e);
    });
}
