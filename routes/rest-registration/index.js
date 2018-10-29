const isJson = require('../../libs/is-json');
const HttpError = require('../../error');
const getPublicPaths = require('../../libs/get-public-paths');
const mongoose = require('../../libs/mongoose');


module.exports = (req, res, next) => {
  const dataStatus = isJson(req);

  if (!dataStatus.status) {
    next(dataStatus.httpError);
    return;
  }

  const User = require('../../models/user');


  const email = req.body.email;
  const userName = req.body.userName;
  const password = req.body.password;

  User.findOne({ email })
    .then((user) => {
      if (user) {
      return Promise.reject(new HttpError({
          status: 403,
          message: 'The user was not created',
        }));
      }
      return user;
    })
    .then(() => {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email,
        userName,
        password,
        userStatus: 'login',
      });

      return user.save();
    })
    .then((user) => {
      let { publicPathBackEnd } = getPublicPaths();
      req.session.userId = user._id;
      res.json({ link: `${publicPathBackEnd}/sessions` });
    })
    .catch((err) => {
      next(err);
    });
}
