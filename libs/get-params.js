const url = require('url');

module.exports = ({ req }) => {
  const urlParts = url.parse(req.url, true);
  return urlParts.query;
};
