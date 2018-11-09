const config = require('../../../config');

module.exports = ({ numberOfDocs = 1 }) => {
  const numberPagesInSession = parseInt(config.get('numberPagesInSession'));
  return Math.ceil(numberOfDocs / numberPagesInSession);
};
