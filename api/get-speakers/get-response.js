const getCategoriesName = require('../../libs/get-categories-name');
const getNumberOfResponses = require('./get-number-of-responses');

module.exports = ({ speakers, fields }) => {
  const response = [];

  speakers.forEach((speaker) => {
    const dataSpeaker = {};
    fields.forEach((field) => {
      if (field === 'categories') {
        dataSpeaker[field] = getCategoriesName({ categories: speaker[field] });
        return;
      }
      if (field === 'numberResponses') {
        dataSpeaker[field] = getNumberOfResponses({ questions: speaker.questions });
        return;
      }
      if (field === 'numberQuestions') {
        dataSpeaker[field] = speaker.questions.length;
        return;
      }
      if (field === 'speakerId') {
        dataSpeaker[field] = speaker._id;
        return;
      }
      dataSpeaker[field] = speaker[field];
    });
    response.push(dataSpeaker);
  });

  return response;
}
