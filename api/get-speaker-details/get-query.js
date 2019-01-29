const getParams = require('../../libs/get-params');

module.exports = ({ req }) => {
  const params = getParams({ req });

  const speaker = params.speaker
   ? getParams({ req })
    .speaker
    .split(' ')
  : [];

  const session = params.session
   ? getParams({ req })
    .session
    .split(' ')
  : [];

  return {
    speaker,
    session,
  }
}
