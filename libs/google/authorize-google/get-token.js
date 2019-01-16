
module.exports = ({ youtubeClient, grant }) => {
  const promise = new Promise((resolve, reject) => {
    youtubeClient.getToken(grant, function(err, token) {
      if (err) {
        reject(err);
        return;
      }
      resolve(token);
    });
  });

  return promise;
};
