module.exports = ({ contentType }) => {
  const allowedContentTypes = ['video/mpeg', 'video/mp4', 'video/webm'];

  const isExistId = (item) => {
    return item === contentType;
  }

  if (!allowedContentTypes.some(isExistId)) {
    return false;
  }

  return true;
};
