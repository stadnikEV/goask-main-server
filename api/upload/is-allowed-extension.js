module.exports = ({ extension }) => {
  const allowedExtensions = ['mp4', 'mpeg', 'webm', 'mov'];

  const isExistId = (item) => {
    return item === extension.toLowerCase();
  }

  if (!allowedExtensions.some(isExistId)) {
    return false;
  }

  return true;
};
