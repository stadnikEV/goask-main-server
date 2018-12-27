
module.exports = ({ requestsDB, statusVideo }) => {
  requestsDB.forEach((item) => {
    if (item.status === 'ready') {
      return;
    }

    if (statusVideo[item._id]) {
      const status = statusVideo[item._id];
      if (status === 'streaming') {
        item.status = status;
        return;
      }
      if (status === 'uploadDisk') {
        item.status = 'upload';
        return;
      }
      if (status === 'deleteYoutubeVideo' || status === 'uploadYoutube' || status === 'decodeYoutube') {
        item.status = 'decode';
        return;
      }
    }

    if (item.statusVideo) {
      const status = item.statusVideo.status;
      if (status === 'processed') {
        item.status = 'processed';
        return;
      }
      if (status === 'error upload disk') {
        item.status = 'uploadError';
        return;
      }
      if (status === 'error delete youtube' || status === 'error upload youtube' || status === 'error decode youtube') {
        item.status = 'decodeError';
        return;
      }
    }
  });

  return requestsDB;
};
