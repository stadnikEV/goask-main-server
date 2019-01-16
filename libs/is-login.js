
module.exports = ({ req, User }) => {
  const promise = new Promise((resolve, reject) => {
    if (!req.session.userId) {
      resolve(false);
      return;
    }
    User.findById(req.session.userId)
      .then((user) => {
        if (user && user.active) {
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
