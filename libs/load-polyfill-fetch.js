export default () => {
  const promise = new Promise((resolve, reject) => {
    if (window.fetch) {
      resolve();
      return;
    }

    import('whatwg-fetch' /* webpackChunkName: "fetch-polyfill" */)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
  return promise;
};
