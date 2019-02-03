const Speaker = require('../../models/speaker');
// const User = require('../../models/user');
const saveAll = require('../../libs/mongoose-save-all');

module.exports = (req, res, next) => {
  const speakerId = req.params.id;
  const active = req.body.active;
  let lastStatus = null;

  let documents = [];
  Speaker.findOne({ speakerId })
    .populate('user')
    .populate('sessions')
    .then((speaker) => {
      lastStatus = speaker.active;
      speaker.active = active;
      speaker.user.speakerActive = active;

      speaker.sessions.forEach((session) => {
        session.active = active;
        documents.push(session);
      });
      documents.push(speaker);
      documents.push(speaker.user);

      return saveAll(documents);
    })
    .then(() => {
      res.json({ lastStatus, status: active });
    })
    .catch((e) => {
      next(e);
    });
};
