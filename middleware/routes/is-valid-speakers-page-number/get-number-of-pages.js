const config = require('../../../config');

module.exports = ({ numberOfDocs }) => {
  if (numberOfDocs === 0) {
    numberOfDocs = 1;
  }
  const numberPagesInSpeaker = parseInt(config.get('numberPagesInSpeaker'));
  return Math.ceil(numberOfDocs / numberPagesInSpeaker);
};
