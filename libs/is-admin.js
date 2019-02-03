const Admin = require('../models/admin');

module.exports = ({ req }) => {
  const promise = new Promise((resolve, reject) => {
    if (!req.session.adminId) {
      resolve(false);
      return;
    }
    Admin.findById(req.session.adminId)
      .then((admin) => {
        if (admin) {
          resolve(true);
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
