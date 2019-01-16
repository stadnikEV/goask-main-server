const HttpError = require('../../error');
const getPublicPaths = require('../../libs/get-public-paths');
const mongoose = require('../../libs/mongoose');
const User = require('../../models/user');
const { google } = require('googleapis');
const base64url = require('base64url');


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
        _emailConfirm: email,
        active: false,
      });

      return user.save();
    })
    .then((user) => {
      const gmail = google.gmail({version: 'v1', auth: oauthGoogle });
      // const theme = base64url('Тема письма', 'utf8');
      // console.log(theme);

      const buff = Buffer.from('Подтверждение регистрации на Goask.club', 'utf8');
      let base64 = buff.toString('base64');
      var email = [
    	  "MIME-Version: 1.0\n",
    		"Content-Transfer-Encoding: 7bit\n",
        'Content-Type: text/plain; charset="UTF-8"\n',
    		'to: ', 'stadnik24fps@gmail.com', '\n',
    		'from: ', 'goaskonline@gmail.com', '\n',
    		'subject: ', `=?UTF-8?B?${base64}?=`, '\n\n',
    		"message: ", "Для подтверждения регистрации на сайте Goask.club перейдите по ссылке", "\n",
    	].join('');

      const base64EncodedEmail = base64url(email, 'utf8');
      gmail.users.messages.send({
        userId: 'me',
        'resource': {
          'raw': base64EncodedEmail,
        },
      }, (err) => {
        console.log(err);
      });


      // res.status(201);
      // let { publicPathBackEnd } = getPublicPaths();
      // // req.session.userId = user._id;
      // res.json({ link: `${publicPathBackEnd}` });
    })
    .catch((err) => {
      next(err);
    });
}
