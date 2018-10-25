const config = require('../config');

module.exports = () => {
  let publicPathFrontEnd = null;
  let publicPathBackEnd = null;

  if (process.env.NODE_ENV === 'dev') {
    publicPathFrontEnd = config.get('public-path-front-end');
    publicPathBackEnd = config.get('public-path-back-end');
  } else {
    publicPathFrontEnd = config.get('public-path');
    publicPathBackEnd = config.get('public-path');
  }

  return {
    publicPathFrontEnd,
    publicPathBackEnd,
  }
}
