const HttpError = require('../../error');
const getPublicPaths = require('../../libs/get-public-paths');
const User = require('../../models/user');


module.exports = (req, res, next) => {
  User.findById(req.session.userId)
  .then((user) => {
    if (!user) {
      return Promise.reject(new HttpError({
        status: 403,
        message: 'user is not authorized',
      }));
    }

    req.session.destroy();

    let { publicPathBackEnd } = getPublicPaths();
    res.json({ link: `${publicPathBackEnd}` });
  })
  .catch((err) => {
    next(err);
  });
}
