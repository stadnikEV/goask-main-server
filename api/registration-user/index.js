const HttpError = require('../../error');
const getPublicPaths = require('../../libs/get-public-paths');
const mongoose = require('../../libs/mongoose');
const User = require('../../models/user');
const Speaker = require('../../models/speaker');
const crypto = require('crypto');
const sendMail = require('../../libs/google/gmail-api/send-email');
const logger = require('../../libs/log');

const environment = process.env.NODE_ENV;


module.exports = (oauthGoogle, req, res, next) => {
  const email = req.body.email;
  const userName = req.body.userName;
  const password = req.body.password;

  let userDB = null;

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
        return Promise.all([
          User.remove({ _id: user._id }),
          Speaker.remove({ _id: user.speakerId }),
        ]);
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

      userDB = user;
      console.log(userDB);
      if (environment === 'dev') {
        user.active = true;
      }

      return user.save();
    })
    .then((user) => {
      if (environment === 'dev') {
        return;
      }

      const { publicPathBackEnd } = getPublicPaths();
      return sendMail({
        oauthGoogle,
        to: user.email,
        theme: 'Регистрация Goask.club',
        body: `Для подтверждения регистрации на Goask.club, перйдите по ссылке: ${publicPathBackEnd}/confirm-user-email/${user.emailConfirm}`,
      });
    })
    .then(() => {
      res.status(200);
      res.json({});
    })
    .catch((e) => {
      if (e.code === 400 && e.config.url === 'https://www.googleapis.com/gmail/v1/users/me/messages/send') {
        Promise.all([
          User.remove({ _id: userDB._id }),
          Speaker.remove({ _id: userDB.speakerId }),
        ])
          .catch((err) => {
            logger.error(err.stack);
          })

        next(new HttpError({
          status: 400,
          message: 'not correct email',
        }));

        return;
      }
      next(e);
    });
}
