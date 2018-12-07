const HttpError = require('../error');

const getData = ({ req, res, timeout }) => {
  const promise = new Promise((resolve, reject) => {
    let timer = null;
    let timeIsOut = false;
    const data = [];


    const reqEnd = () => {
      if (timeout) {
        clearTimeout(timer);
      }
      resolve(data);
    };

    const reqError = (err) => {
      reject(err);
    };

    const addChunk = (chunk) => {
      data.push(chunk);

      if (!timeIsOut) {
        return;
      }
      req.removeListener('data', addChunk);
      req.removeListener('end', reqEnd);
      req.removeListener('end', reqError);
      res.header('Connection', 'close');

      reject(new HttpError({
        status: 403,
        message: 'reques data timeout',
      }));
    };

    req.on('data', addChunk)
    req.on('end', reqEnd);
    req.on('error', reqError);

    if (!timeout) {
      return;
    }

    timer = setTimeout(() => {
      timeIsOut = true;
    }, timeout);

  });

  return promise;
};




module.exports = getData;
