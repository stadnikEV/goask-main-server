const Speaker = require('../../models/speaker');
const config = require('../../config');
const isLogin = require('../../libs/is-login');
const User = require('../../models/user');
const getPublicPaths = require('../../libs/get-public-paths');
const getPagenNavigationData = require('../../libs/get-page-navigation-data');
const categoriesNameconfig  = require('../../libs/categories-name-config.js');

module.exports = (req, res, next) => {
  const numberPagesInSpeaker = parseInt(config.get('numberPagesInSpeaker'));
  let speakersArray = null;


  const pageNumber = res.locals.pageNumber;
  const numberOfPages = res.locals.numberOfPages;

  const pageNavigatioData = (numberOfPages > 1)
    ? getPagenNavigationData({
        pageNumber,
        numberOfPages,
      })
    : false;


  Speaker.find(res.locals.searchRequest)
    .skip(numberPagesInSpeaker * (pageNumber - 1))
    .limit(numberPagesInSpeaker)
    .then((speakers) => {
      speakersArray = speakers;

      speakersArray.forEach((speaker) => {
        speaker.categoryName = categoriesNameconfig[speaker.categories];
      });

      return isLogin({ req, User });
    })
    .then((user) => {
      if (user) {
        res.render('pages/page-public-speakers', {
          userName: user.userName,
          header: {
            buttons: {
              createSpeaker: !user.speakerId,
              logout: true,
              speakersSelect: 'button-header__button_selected',
            },
          },
          userNavigation: {
            buttons: {
              requests: user.speakerActive && user.speakerId,
            }
          },
          speakers: speakersArray,
          pageNavigatioData,
          paths: getPublicPaths(),
        });

        return;
      }


      res.render('pages/page-public-speakers', {
        header: {
          buttons: {
            login: true,
            createSpeaker: true,
            speakersSelect: 'button-header__button_selected',
          },
        },
        speakers: speakersArray,
        pageNavigatioData,
        paths: getPublicPaths(),
      });
    })
    .catch((e) => {
      next(e);
    });
};
