const Speaker = require('../../models/speaker');
const User = require('../../models/user');

module.exports = (req, res, next) => {
  const speakerId = req.params.id;
  const active = req.body.active;
  let lastStatus = null;

  let userId = null;
  Speaker.findOne({ speakerId })
    .populate('user')
    .then((speaker) => {
      lastStatus = speaker.active;
      userId = speaker.user._id;
      speaker.active = active;
      return speaker.save();
    })
    .then(() => {
      return User.findById(userId);
    })
    .then((user) => {
      user.speakerActive = active;
      return user.save();
    })
    .then(() => {
      res.json({ lastStatus, status: active });
    })
    .catch((e) => {
      next(e);
    });
};
