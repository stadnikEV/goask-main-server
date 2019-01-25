const {google} = require('googleapis');
const removeEmptyParameters = require('../remove-empty-parameters');
const createResource = require('../create-resource');

module.exports = ({
  oauthGoogle,
  stream,
  categoryId,
  description,
  title,
 }) => {
  const promise = new Promise((resolve, reject) => {
    const requestData = {
      'params': {
        'part': 'snippet, status',
      },
      'properties': {
        'snippet.categoryId': categoryId,
        'snippet.defaultLanguage': '',
        'snippet.description': description,
        'snippet.tags[]': '',
        'snippet.title': title,
        'status.embeddable': '',
        'status.license': '',
        'status.privacyStatus': 'unlisted',
        'status.publicStatsViewable': '',
      },
    }


    const service = google.youtube('v3');
    const parameters = removeEmptyParameters(requestData['params']);
    parameters['auth'] = oauthGoogle;
    parameters['media'] = { body: stream };
    parameters['notifySubscribers'] = false;
    parameters['resource'] = createResource(requestData['properties']);

    service.videos.insert(parameters, function(err, data) {
      if (err) {
        reject(err);

        return;
      }

      resolve(data);
    });
  });

  return promise;
}
