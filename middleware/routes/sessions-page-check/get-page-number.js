const url = require('url');

module.exports = ({ req }) => {
  const url_parts = url.parse(req.url, true);
  const query = url_parts.query;
  const pageNumber = (query.page)
    ? query.page
    : 1;

  return pageNumber;
};
