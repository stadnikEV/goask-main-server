const {google} = require('googleapis');
const removeEmptyParameters = require('../remove-empty-parameters');

module.exports = ({ oauthGoogle, id }) => {
  const promise = new Promise((resolve, reject) => {
    const requestData = {
      'params': {
        'id': id,
        'onBehalfOfContentOwner': ''
      }
    };

    const service = google.youtube('v3');
    const parameters = removeEmptyParameters(requestData['params']);
    parameters['auth'] = oauthGoogle;
    service.videos.delete(parameters, (err, response) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(response);
    });
  });

  return promise;
}
