const config = require('../../config');
const fs = require('fs');
const isAllowedContentType = require('./is-allowed-content-type');
const isAllowedExtension = require('./is-allowed-extension');
const HttpError = require('../../error');
const upload = require('../../libs/upload');
const removeDirectory = require('../../libs/remove-directory');
const createDirectory = require('../../libs/create-directory');
const insert = require('../../libs/youtube/insert');
const isEndOfProcessing = require('../../libs/youtube/is-end-of-processing');
const deleteVideo = require('../../libs/youtube/delete');



module.exports = (statusVideo, authYoutube, req, res, next) => {
  const id = req.params.id;
  const question = res.locals.question;

  let filePath = null;
  let videoID = null;
  let videoLink = null;

  statusVideo[id] = 'uploadDisk';

  removeDirectory({ path: `${config.get('downloadVideoPath')}/${id}` })
    .then(() => {
      return createDirectory({ path: `${config.get('downloadVideoPath')}/${id}` });
    })
    .then(() => {
      return upload({
        req,
        path: `${config.get('downloadVideoPath')}/${id}`,
      });
    })
    .then(({ fileName, contentType, extension }) => {
      if (!isAllowedContentType({ contentType })) {
        return Promise.reject(new HttpError({
          status: 400,
          message: `Not allowed content-type ${contentType}`,
        }));
      }
      if (!isAllowedExtension({ extension })) {
        return Promise.reject(new HttpError({
          status: 400,
          message: `Not allowed extension ${extension}`,
        }));
      }

      res.json({});

      filePath = `${config.get('downloadVideoPath')}/${id}/${fileName}`;
      
      if (!question.statusVideo || !question.statusVideo.id) {
        return;
      }

      statusVideo[id] = 'deleteYoutubeVideo';
      return deleteVideo({ authYoutube, id: question.statusVideo.id });
    })
    .then(() => {
      statusVideo[id] = 'uploadYoutube';

      return insert({
        authYoutube,
        categoryId: '22',
        description: 'Goask video',
        title: 'Test video',
        stream: fs.createReadStream(filePath),
      });
    })
    .then((data) => {
      videoID = data.data.id;
      videoLink = `https://www.youtube.com/watch?v=${videoID}`;
      statusVideo[id] === 'decodeYoutube';
      return isEndOfProcessing({ authYoutube, id: videoID });
    })
    .then((status) => {
      if (status === 'failed') {
        question.statusVideo = {
          status: 'error decode youtube',
        }
      }
      if (status === 'processed') {
        question.statusVideo = {
          status: 'processed',
          id: videoID,
          link: videoLink,
        }
      }

      return question.save();
    })
    .then(() => {
      return removeDirectory({ path: `${config.get('downloadVideoPath')}/${id}` });
    })
    .then(() => {
      delete statusVideo[id];
    })
    .catch((e) => {
      removeDirectory({ path: `${config.get('downloadVideoPath')}/${id}` })
        .then(() => {
          let status = null;

          if (statusVideo[id] === 'uploadDisk') {
            status = (question.statusVideo)
              ? question.statusVideo
              : {};
            status.status = 'error upload disk';
          }
          if (statusVideo[id] === 'deleteYoutubeVideo') {
            status = {
              status: 'error delete youtube',
            }
          }
          if (statusVideo[id] === 'uploadYoutube') {
            status = {
              status: 'error upload youtube',
            }
          }
          if (statusVideo[id] === 'decodeYoutube') {
            status = {
              status: 'error decode youtube',
            }
          }

          question.statusVideo = status;
          return question.save();
        })
        .then(() => {
          delete statusVideo[id];
          next(e);
        })
        .catch(() => {
          delete statusVideo[id];
          next(e);
        });
    });
};
