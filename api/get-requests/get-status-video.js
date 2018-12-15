const httpRequest = require('request-promise-native');

module.exports = ({ requests }) => {
  const promise = new Promise((resolve, reject) => {
    const streamId = {
      id: [],
    };

    requests.forEach((item) => {
      streamId.id.push(item._id);
    });

    httpRequest.get({
      url: `http://localhost:5000/status-video`,
      body: JSON.stringify(streamId),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((status) => {
        resolve(JSON.parse(status));
      })
      .catch((e) => {
        reject(e);
      });
  });

  return promise;
};
