module.exports = ({ contentType }) => {
  if (!contentType) {
    return false;
  }
  const match = contentType.match( /multipart\/form-data/i );

  if (match[0]) {
    return true;
  }

  return false;
};
