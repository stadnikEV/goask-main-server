const User = require('../../models/user');

module.exports = (req, res, next) => {
  const id = req.params.id;

  User.findOne({ emailConfirm: id })
    .then((user) => {
      if (!user) {
        res.redirect('/registration');
        return;
      }

      return user;
    })
    .then((user) => {
      user.emailConfirm = undefined;
      user.active = true;

      return user.save();
    })
    .then((user) => {
      req.session.userId = user._id;
      res.redirect('/');
    })
    .catch((err) => {
      next(err);
    });
}
