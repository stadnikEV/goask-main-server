const config = require('../../config');
const fs = require('fs');
const httpRequest = require('request-promise-native');
const getRequestData = require('../../libs/get-request-data');
const HttpError = require('../../error');
const Question = require('../../models/question');
const deleteVideo = require('../../libs/google/youtube-api/delete');
const insert = require('../../libs/google/youtube-api/insert');
const isEndOfProcessing = require('../../libs/google/youtube-api/is-end-of-processing');
const removeDirectory = require('../../libs/remove-directory');

module.exports = (statusVideo, oauthGoogle, req, res, next) => {
  const id = req.params.id;
  let question = null;
  const filePath = `${config.get('downloadVideoPath')}/${id}/1.webm`;
  let videoID = null;
  let videoLink = null;

  getRequestData({
    req,
    res,
    timeout: config.get('maxRequestInterval'),
  })
    .then((streamData) => {
      return httpRequest.post({
        url: `http://localhost:5000/stream/${id}/stop`,
        body: streamData,
      });
    })
    .then((response) => {
      const data = JSON.parse(response);
      res.json(data);
      return Question.findById(id);
    })
    .then((questionDB) => {
      question = questionDB;
      if (!question.statusVideo || !question.statusVideo.id) {
        return;
      }

      statusVideo[id] = 'deleteYoutubeVideo';
      return deleteVideo({ oauthGoogle, id: question.statusVideo.id });
    })
    .then(() => {
      statusVideo[id] = 'uploadYoutube';

      return insert({
        oauthGoogle,
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
      return isEndOfProcessing({ oauthGoogle, id: videoID });
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
          if (e.name === 'StatusCodeError') {
            const error = JSON.parse(e.error)
            next(new HttpError(error));

            return;
          }
          next(e);
        })
        .catch(() => {
          delete statusVideo[id];
          next(e);
        });
    });
};
