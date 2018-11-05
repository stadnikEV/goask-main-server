const categoriesNameConfig = require('../../libs/categories-name-config');
const Speaker = require('../../models/speaker');

module.exports = (req, res, next) => {
  const speakerId = req.params.id;

  Speaker.findOne({ speakerId })
    .then((speaker) => {
      const categories = speaker.categories;

      let result = {
        categories: [],
      };

      categories.forEach((item) => {
        result.categories.push({
          value: item.categoryName,
          content: categoriesNameConfig[item.categoryName],
        });
      });

      res.json(result);
    })
    .catch((e) => {
      next(e)
    });
}
