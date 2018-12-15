
module.exports = ({ requests, status }) => {

  requests.forEach((item) => {
    if (item.status === 'ready') {
      return;
    }
    if (status[item._id]) {
      item.status = status[item._id].status;
    }
  });

  return requests;
};
