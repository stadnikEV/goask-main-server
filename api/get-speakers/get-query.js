const getParams = require('../../libs/get-params');

module.exports = ({ req }) => {
  const params = getParams({ req });

  const fields = params.fields
   ? getParams({ req })
    .fields
    .split(' ')
  : [];

  const find = {};
  if (params.filter === 'notConfirmed') {
    find.active = undefined;
  }
  if (params.filter === 'confirmed') {
    find.active = [true, false];
  }

  return {
    fields,
    find,
  }
}
