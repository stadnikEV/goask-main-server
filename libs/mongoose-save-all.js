module.exports = (documents) => {
  const promise = new Promise((resolve, reject) => {

    const saveAll = () => {
      var doc = documents.pop();

      doc.save()
        .then(() => {
          if (!documents.length) {
            resolve();
            return;
          }

          saveAll();
        })
        .catch((e) => {
          reject(e);
        });
    };

    saveAll();
  });

  return promise;
}
