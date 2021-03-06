const {google} = require('googleapis');
const removeEmptyParameters = require('../remove-empty-parameters');

module.exports = ({ oauthGoogle, id }) => {
  const promise = new Promise((resolve, reject) => {
    const requestData = {
      'params': {
        'id': id,
        'part': 'status'
      }
    };

    const timeInterval = 1000 * 20;

    const getStatus = () => {
      setTimeout(() => {
        const service = google.youtube('v3');
        const parameters = removeEmptyParameters(requestData['params']);
        parameters['auth'] = oauthGoogle;
        service.videos.list(parameters, function(err, response) {
          if (err) {
            reject(err);

            return;
          }

          try {
            var status = response.data.items[0].status.uploadStatus;
          } catch (e) {
            resolve('failed');

            return;
          }


          if (status === 'processed') {
            resolve('processed');

            return;
          }

          if (status === 'deleted'
          || status === 'failed'
          || status === 'rejected') {
            resolve('failed');

            return;
          }

          getStatus();
        });
      }, timeInterval);
    }

    getStatus();
  });

  return promise;
}
