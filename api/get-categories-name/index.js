const categoriesNameConfig = require('../../libs/categories-name-config');

module.exports = (req, res) => {
  const result = {
    categories: [],
  };

  for (let key in categoriesNameConfig) {
    result.categories.push({
      value: key,
      content: categoriesNameConfig[key],
    });
  }

  res.json(result);
}
