const HttpError = require('../../error');
const getPublicPaths = require('../../libs/get-public-paths');
const mongoose = require('../../libs/mongoose');
const User = require('../../models/user');


module.exports = (req, res, next) => {
  const email = req.body.email;
  const userName = req.body.userName;
  const password = req.body.password;

  User.findOne({ email })
    .then((user) => {
      if (user) {
      return Promise.reject(new HttpError({
          status: 403,
          message: 'user with that email address already exists',
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
      });

      return user.save();
    })
    .then((user) => {
      res.status(201);
      let { publicPathBackEnd } = getPublicPaths();
      req.session.userId = user._id;
      res.json({ link: `${publicPathBackEnd}` });
    })
    .catch((err) => {
      next(err);
    });
}
