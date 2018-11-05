const User = require('../../models/user');
const HttpError = require('../../error');

module.exports = (req, res, next) => {
  User.findById(req.session.userId)
    .then((user) => {
      if (!user) {
        return Promise.reject(new HttpError({
          status: 403,
          message: 'user is not authorized',
        }));
      }
      res.locals.user = user;
      next();
    })
    .catch((e) => {
      next(e);
    });
};
