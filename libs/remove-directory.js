const rimraf = require('rimraf');
const isDirectoryExist = require('./is-directory-exist');

module.exports = ({ path }) => {
  const promise = new Promise((resolve, reject) => {
    if (!path) {
      resolve(null);
      return;
    }
    
    isDirectoryExist({ path })
      .then((isExist) => {
        if (!isExist) {
          resolve();
          return;
        }

        rimraf(path, (err) => {
          if (err === null) {
            resolve();
            return;
          }

          reject(err);
        });
      })

  });

  return promise;
};
