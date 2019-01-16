const HttpError = require('../../error');
const getPublicPaths = require('../../libs/get-public-paths');
const User = require('../../models/user');


module.exports = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;


  User.findOne({ email })
  .then((user) => {
    if (!user) {
      return Promise.reject(new HttpError({
        status: 403,
        message: 'not valid email or password',
      }));
    }
    if (!user.checkPassword(password) || !user.active) {
      return Promise.reject(new HttpError({
        status: 403,
        message: 'not valid email or password',
      }));
    }

    req.session.userId = user._id;

    if (user.speakerId) {
      req.session.speakerId = user.speakerId;
    }

    return user.save();
  })
  .then(() => {
    let { publicPathBackEnd } = getPublicPaths();
    res.json({ link: `${publicPathBackEnd}` });
  })
  .catch((err) => {
    next(err);
  });
}
