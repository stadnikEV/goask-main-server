const HttpError = require('../../error');
const base64 = require('base64-arraybuffer');
const arrayBufferToBuffer = require('../../libs/arraybuffer-to-buffer');
const removeDirectory = require('../../libs/remove-directory');
const writeFile = require('../../libs/write-file');
const getPublicPaths = require('../../libs/get-public-paths');
const mongoose = require('../../libs/mongoose');
const User = require('../../models/user');
const Speaker = require('../../models/speaker');
const crypto = require('crypto');
const sendMail = require('../../libs/google/gmail-api/send-email');
const logger = require('../../libs/log');

const environment = process.env.NODE_ENV;


module.exports = (oauthGoogle, req, res, next) => {
  const avatar = req.body.avatar;
  const avatarExtend = req.body.avatarExtend
  const email = req.body.email;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const about = req.body.about;
  const categoryName = req.body.category;
  const userName = `${firstname} ${lastname}`;
  const password = req.body.password;

  let userDB = null;
  let speakerDB = null;

  User.findOne({ email })
    .populate('speakerId')
    .then((user) => {
      if (user && user.active) {
      return Promise.reject(new HttpError({
          status: 403,
          message: 'email already exists',
        }));
      }
      return user;
    })
    .then((user) => {
      if (user) {
        let avatarPath = null;
        if (user.speakerId) {
          avatarPath = `../avatars/${user.speakerId.avatar}`;
        }
        return Promise.all([
          User.remove({ _id: user._id }),
          Speaker.remove({ _id: user.speakerId }),
          removeDirectory({ path: avatarPath }),
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

      const speaker = new Speaker({
        _id: new mongoose.Types.ObjectId(),
        user: user._id,
        about,
        firstname,
        lastname,
        categories: [categoryName],
      });

      speaker.avatar = `${speaker._id}${avatarExtend}`;
      user.speakerId = speaker._id;

      userDB = user;
      speakerDB = speaker;

      if (environment === 'dev') {
        user.active = true;
      }

      const avatarArrayBuffer = base64.decode(avatar);
      const avatarBuffer = arrayBufferToBuffer(avatarArrayBuffer);

      return Promise.all([
        user.save(),
        speaker.save(),
        writeFile({
          path: `../avatars/${speakerDB._id}${avatarExtend}`,
          data: avatarBuffer,
        }),
      ])
    })
    .then((documents) => {
      if (environment === 'dev') {
        return;
      }

      const { publicPathBackEnd } = getPublicPaths();
      return sendMail({
        oauthGoogle,
        to: documents[0].email,
        theme: 'Регистрация Goask.club',
        body: `Для подтверждения регистрации на Goask.club, перйдите по ссылке: ${publicPathBackEnd}/confirm-speaker-email/${documents[0].emailConfirm}`,
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
          Speaker.remove({ _id: speakerDB._id }),
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
