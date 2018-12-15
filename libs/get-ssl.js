const fs = require('fs');
const config = require('../config');

module.exports = () => {
  const options = {
    key: fs.readFileSync(`${config.get('sslPath')}/privkey.pem`, 'utf8'),
    cert: fs.readFileSync(`${config.get('sslPath')}/cert.pem`, 'utf8'),
  };

  return options;
};
