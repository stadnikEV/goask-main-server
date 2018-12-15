module.exports = ({ extension }) => {
  const allowedExtensions = ['mp4', 'mpeg', 'webm'];

  const isExistId = (item) => {
    return item === extension;
  }

  if (!allowedExtensions.some(isExistId)) {
    return false;
  }

  return true;
};
