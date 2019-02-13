const User = require('../models/user');
const HttpError = require('../error');

module.exports = (req, res, next) => {
  User.findById(req.session.userId)
    .then((user) => {

      if (!user) {
        if (req.headers['content-type'] === 'application/json') {
          return Promise.reject(new HttpError({
            status: 403,
            message: 'User is not authorized',
          }));
        }
        res.redirect('/login');

        return;
      }

      res.locals.user = user;

      next();
    })
    .catch((e) => {
      next(e);
    });
};
