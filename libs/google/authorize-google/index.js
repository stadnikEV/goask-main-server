const createAuthorizeData = require('./create-authorize-data');
const readToken = require('./read-token');
const createNewToken = require('./create-new-token');

module.exports = () => {
  const promise = new Promise((resolve, reject) => {
    let youtubeClient = null;
    const scope = [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/youtube.force-ssl',
    ];

    createAuthorizeData()
      .then((oauth2Client) => {
        youtubeClient = oauth2Client;
        return readToken();
      })
      .then((token) => {
        if (!token) {
          return createNewToken({ youtubeClient, scope });
        }
        return token;
      })
      .then((token) => {
        youtubeClient.credentials = token;
        resolve(youtubeClient);
      })
      .catch((e) => {
        reject(e);
      });
  });

  return promise;
};
