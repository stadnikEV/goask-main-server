const readFile = require('../../read-file');
const config = require('../../../config');

module.exports = () => {
  const promise = new Promise((resolve) => {
    readFile({ path: `${config.get('youtubeCredentialsPath')}/token.json` })
      .then((data) => {
        const token = JSON.parse(data);
        resolve(token);
      })
      .catch(() => {
        resolve(null);
      })
  });

  return promise;
};
