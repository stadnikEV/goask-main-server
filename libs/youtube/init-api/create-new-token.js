const writeFile = require('../../write-file');
const getGrant = require('./get-grant');
const config = require('../../../config');
const getToken = require('./get-token');

module.exports = ({ youtubeClient, scope }) => {
  const promise = new Promise((resolve, reject) => {
    let newToken = null;
    getGrant({ youtubeClient, scope })
      .then((grant) => {
        return getToken({ youtubeClient, grant });
      })
      .then((token) => {
        newToken = token;
        return writeFile({
          path: `${config.get('youtubeCredentialsPath')}/token.json`,
          data: JSON.stringify(token),
        });
      })
      .then(() => {
        resolve(newToken);
      })
      .catch((e) => {
        reject(e);
      });
  });

  return promise;
};
