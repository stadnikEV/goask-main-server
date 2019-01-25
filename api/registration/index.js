const HttpError = require('../../error');
const getPublicPaths = require('../../libs/get-public-paths');
const mongoose = require('../../libs/mongoose');
const User = require('../../models/user');
const crypto = require('crypto');
const sendMail = require('../../libs/google/gmail-api/send-email');


module.exports = (oauthGoogle, req, res, next) => {
  const email = req.body.email;
  const userName = req.body.userName;
  const password = req.body.password;

  User.findOne({ email })
    .then((user) => {
      if (user && user.active) {
      return Promise.reject(new HttpError({
          status: 403,
          message: 'user with that email address already exists',
        }));
      }
      return user;
    })
    .then((user) => {
      if (user) {
        return User.remove({ _id: user._id });
      }
      return user;
    })
    .then(() => {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email,
        userName,
        password,
        emailConfirm: crypto.createHmac('sha1', 'goask').update(email).digest('hex'),
        active: false,
      });

      return user.save();
    })
    .then((user) => {
      const { publicPathBackEnd } = getPublicPaths();
      sendMail({
        oauthGoogle,
        to: user.email,
        theme: 'Регистрация Goask.club',
        body: `Для подтверждения регистрации на Goask.club, перйдите по ссылке: ${publicPathBackEnd}/confirm-email/${user.emailConfirm}`,
      })
        .then(() => {
          res.status(200);
          res.json({});
        })
        .catch((e) => {
          console.log(e);
        });
    })
    .catch((err) => {
      next(err);
    });
}
