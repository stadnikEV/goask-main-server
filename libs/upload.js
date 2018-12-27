const config = require('../config');
const HttpError = require('../error');
const multiparty = require('multiparty');
const fs = require('fs');

module.exports = ({ req, path }) => {
  const promise = new Promise((resolve, reject) => {
    let fileName = null;
    let currentFileName = null;
    let contentType = null;
    let extension = null;

    const form = new multiparty.Form({
      autoFiles: true,
      maxFields: '1',
      maxFilesSize: `${config.get('maxFilesSizeUpload')}`,
      uploadDir: path,
    });


    form.on('error', (err) => {
      if (err.message === 'maxFields 1 exceeded.') {
        reject(new HttpError({
          status: 403,
          message: 'Max files 1 exceeded',
        }));

        return;
      }

      if (err.message === 'maximum file length exceeded') {
        reject(new HttpError({
          status: 403,
          message: 'Maximum file length exceeded',
        }));

        return;
      }

      reject(err);
    });


    form.on('file', (name, file) => {
      contentType = file.headers['content-type'];
      extension = file.originalFilename.match(/[^.]*$/i)[0];
      fileName = `1.${extension}`;
      currentFileName = file.path.match(/[^/]*$/i)[0];
    });


    form.on('close', () => {
      if (fileName === null) {
        reject(new HttpError({
          status: 400,
          message: 'file missing',
        }));

        return;
      }

      fs.rename(`${path}/${currentFileName}`, `${path}/${fileName}`, (err) => {
        if (err) {
          reject(err);

          return;
        }

        resolve({ fileName, contentType, extension });
      });
    });

    form.parse(req);
  });

  return promise;
};
