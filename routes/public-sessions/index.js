const SessionApp = require('../../models/sessionApp');
const config = require('../../config');
const isLogin = require('../../libs/is-login');
const User = require('../../models/user');
const getPublicPaths = require('../../libs/get-public-paths');
const getPagenNavigationData = require('../../libs/get-page-navigation-data');
const categoriesNameconfig  = require('../../libs/categories-name-config.js');

module.exports = (req, res, next) => {
  const numberPagesInSession = parseInt(config.get('numberPagesInSession'));
  let sessionArray = null;

  const category = (res.locals.category)
    ? `category=${res.locals.category}&`
    : '';

  const pageNumber = parseInt(res.locals.pageNumber);
  const numberOfPages = parseInt(res.locals.numberOfPages);

  const pageNavigatioData = getPagenNavigationData({
    pageNumber,
    numberOfPages,
  });

  SessionApp.find(res.locals.searchRequest)
    .skip(numberPagesInSession * (pageNumber - 1))
    .limit(numberPagesInSession)
    .populate('speaker')
    .then((sessions) => {
      sessionArray = sessions;

      sessionArray.forEach((session) => {
        session.categoryName = categoriesNameconfig[session.category];
      });

      return isLogin({ req, User });
    })
    .then((user) => {
      if (user) {
        res.render('pages/page-public-sessions', {
          userName: user.userName,
          header: {
            buttons: {
              createSpeaker: !user.speakerId,
              logout: true,
              speakersSelect: 'button-header__link_selected',
            },
          },
          userNavigation: {
            buttons: {
              sessions: user.speakerId,
              requests: user.speakerId,
            }
          },
          sessions: sessionArray,
          pageNavigatioData,
          category,
          paths: getPublicPaths(),
        });

        return;
      }


      res.render('pages/page-public-sessions', {
        header: {
          buttons: {
            login: true,
            speakersSelect: 'button-header__link_selected',
          },
        },
        sessions: sessionArray,
        pageNavigatioData,
        category,
        paths: getPublicPaths(),
      });
    })
    .catch((e) => {
      next(e);
    });
};
