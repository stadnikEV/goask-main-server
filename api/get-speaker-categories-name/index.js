const getCategoriesName = require('../../libs/get-categories-name');
const Speaker = require('../../models/speaker');

module.exports = (req, res, next) => {
  const speakerId = req.params.id;

  Speaker.findOne({ speakerId })
    .then((speaker) => {
      const categories = speaker.categories;

      let result = {};

      result.categories = getCategoriesName({ categories });

      res.json(result);
    })
    .catch((e) => {
      next(e)
    });
}
