const config = require('../config');
const ENV = process.env.NODE_ENV;

module.exports = () => {
  if (ENV === 'prod') {
    return config.get('port-prod');
  }
  if (ENV === 'dev') {
    return config.get('port-dev');
  }
};
