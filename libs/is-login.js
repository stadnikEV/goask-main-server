const User = require('../models/user');

module.exports = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (!req.session.userId) {
      resolve(false);
      return;
    }
    User.findById(req.session.userId)
      .then((user) => {
        if (user.userStatus === 'login') {
          resolve(user);
          return;
        }
        resolve(false);
      })
      .catch((e) => {
        reject(e);
      });
  });
  return promise;
};
