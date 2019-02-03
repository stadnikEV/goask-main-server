const getCategoriesName = require('../../libs/get-categories-name');
const getNumberOfResponses = require('./get-number-of-responses');

module.exports = ({ response }) => {
  const result = {
    firstname: response.firstname,
    lastname: response.lastname,
    categories: getCategoriesName({ categories: response.categories }),
    active: response.active,
    about: response.about,
    speakerId: response.speakerId,
    // sessions: response.sessions,
    numberResponses: getNumberOfResponses({ questions: response.questions }),
  };

  return result;
}
