const fs = require('fs');

module.exports = ({ path }) => {
  const promise = new Promise((resolve, reject) => {
    const rstream = fs.createReadStream(path);

    rstream.on('open', () => {
      resolve(rstream);
    });
    rstream.on('error', (e) => {
      reject(e);
    })
  });

  return promise;
};
