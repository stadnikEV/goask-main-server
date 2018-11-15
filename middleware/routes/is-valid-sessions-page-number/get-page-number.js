const getParams = require('../../../libs/get-params.js');

module.exports = ({ req }) => {
  const params = getParams({ req });
  const pageNumber = (params.page)
    ? params.page
    : 1;

  return parseInt(pageNumber, 10);
};
