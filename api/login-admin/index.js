const HttpError = require('../../error');
const Admin = require('../../models/admin');


module.exports = (req, res, next) => {
  const login = req.body.login;
  const password = req.body.password;


  Admin.findOne({ login })
  .then((admin) => {
    if (!admin) {
      return Promise.reject(new HttpError({
        status: 403,
        message: 'not valid email or password',
      }));
    }

    if (!admin.checkPassword(password)) {
      return Promise.reject(new HttpError({
        status: 403,
        message: 'not valid email or password',
      }));
    }

    req.session.adminId = admin._id;

    return admin.save();
  })
  .then(() => {
    res.json({});
  })
  .catch((err) => {
    next(err);
  });
}
