const getCategoriesName = require('../../libs/get-categories-name');

module.exports = ({ speakers, fields }) => {
  const response = [];

  speakers.forEach((speaker) => {
    const dataSpeaker = {};
    fields.forEach((field) => {
      if (field === 'categories') {
        dataSpeaker[field] = getCategoriesName({ categories: speaker[field] });
        return;
      }
      dataSpeaker[field] = speaker[field];
    });
    response.push(dataSpeaker);
  });

  return response;
}
