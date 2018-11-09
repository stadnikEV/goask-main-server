const SessionApp = require('../../../models/sessionApp');
const getPageNumber = require('./get-page-number');
const getNumberOfPages = require('./get-number-of-pages');
const HttpError = require('../../../error');

module.exports = (req, res, next) => {
  const pageNumber = getPageNumber({ req });

  res.locals.searchRequest = {};

  if (req.params.category) {
    res.locals.searchRequest.category = req.params.category;
  }

  SessionApp.find(res.locals.searchRequest)
    .count()
    .then((numberOfDocs) => {
      if (numberOfDocs === 0) {
        numberOfDocs = 1;
      }
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
