const isJson = require('../../libs/is-json');
const HttpError = require('../../error');
const getPublicPaths = require('../../libs/get-public-paths');
const User = require('../../models/user');


module.exports = (req, res, next) => {
  const dataStatus = isJson(req);

  if (!dataStatus.status) {
    next(dataStatus.httpError);
    return;
  }

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
    return user;
  })
  .then((user) => {
    if (!user.checkPassword(password)) {
      return Promise.reject(new HttpError({
        status: 403,
        message: 'not valid email or password',
      }));
    }
    return user;
  })
  .then((user) => {
    user.userStatus = 'login';
    req.session.userId = user._id;
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
