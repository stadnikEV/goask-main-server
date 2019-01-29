const Admin = require('../models/admin');
const HttpError = require('../error');

module.exports = (req, res, next) => {
  Admin.findById(req.session.adminId)
    .then((admin) => {
      if (!admin) {
        return Promise.reject(new HttpError({
          status: 403,
          message: 'Admin is not authorized',
        }));
      }

      res.locals.admin = admin;

      next();
    })
    .catch((e) => {
      next(e);
    });
};
