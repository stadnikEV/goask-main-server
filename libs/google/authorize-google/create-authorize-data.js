const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const readFile = require('../../read-file');
const config = require('../../../config');

module.exports = () => {
  const promise = new Promise((resolve, reject) => {
    readFile({ path: `${config.get('googleCredentialsPath')}/client_secret.json` })
      .then((data) => {
        const credentials = JSON.parse(data);
        const clientSecret = credentials.web.client_secret;
        const clientId = credentials.web.client_id;
        const redirectUrl = credentials.web.redirect_uris[0];

        const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

        resolve(oauth2Client);
      })
      .catch((e) => {
        reject(e);
      })
  });

  return promise;
};
