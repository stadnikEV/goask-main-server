module.exports = ({ rstream, res }) => {
  const promise = new Promise((resolve, reject) => {
    rstream.pipe(res);
    rstream.on('error', (e) => {
      reject(e);
    })
    rstream.on('close', () => {
      resolve();
    })
    res.on('close', function(){
      rstream.destroy();
    });
  });

  return promise;
};
