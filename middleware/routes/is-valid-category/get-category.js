const url = require('url');

module.exports = ({ req }) => {
  const urlParts = url.parse(req.url, true);
  const query = urlParts.query;

  return query.category;
};
