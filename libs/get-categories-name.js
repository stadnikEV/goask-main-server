const categoriesNameConfig = require('./categories-name-config');

module.exports = ({ categories }) => {
  let result = [];

  categories.forEach((item) => {
    result.push({
      value: item.categoryName,
      content: categoriesNameConfig[item.categoryName],
    });
  });

  return result;
}
