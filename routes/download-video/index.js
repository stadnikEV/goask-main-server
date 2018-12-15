const config = require('../../config');
const createReadStream = require('../../libs/create-read-stream');
const isDirectoryExist = require('../../libs/is-directory-exist');
const responseStreamPipe = require('../../libs/response-stream-pipe');
const HttpError = require('../../error');

module.exports = (downloadVideo, req, res, next) => {
  const fileName = res.locals.fileName;
  const streamId = req.params.id;
  const pathVideo = config.get('downloadVideoPath');
  let fileSize = null;
  const path = `${pathVideo}/${streamId}/${fileName}`;

  downloadVideo[streamId] = true;

  isDirectoryExist({ path })
    .then((stats) => {
      if (!stats) {
        return Promise.reject(new HttpError({
          status: 404,
          message: 'File not exists',
        }));
      }
      fileSize = stats.size;
      return createReadStream({ path });
    })
    .then((rstream) => {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      });

      return responseStreamPipe({ rstream, res });
    })
    .then(() => {
      delete downloadVideo[streamId];
    })
    .catch((e) => {
      delete downloadVideo[streamId];
      next(e);
    });
}
