const fs = require('fs');

module.exports = () => {
  const options = {
    key: fs.readFileSync('./ssl/privkey.pem', 'utf8'),
    cert: fs.readFileSync('./ssl/cert.pem', 'utf8'),
  };

  return options;
};
