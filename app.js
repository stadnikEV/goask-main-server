const ENV = process.env.NODE_ENV;
const express = require('express');
const https = require('https');
const http = require('http');
const HttpError = require('./error');
const config = require('./config');
const morgan = require('morgan');
const logger = require('./libs/log');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('./libs/mongoose');
const authorizeGoogle = require('./libs/google/authorize-google');
const getPort = require('./libs/get-port');
const initAdmin = require('./libs/init-admin');

initAdmin()
  .then(() => {
    return authorizeGoogle();
  })
  .then((oauthGoogle) => {
    let port = getPort();

    const statusVideo = {};

    const app = express();
    app.set('port', port);

    app.use(morgan('tiny'));
    app.use(bodyParser.json());

    app.set('views', path.join(__dirname, 'templates'));
    app.set('view engine', 'ejs');

    app.use(
      session({
        secret: config.get('session:secret'),
        key: config.get('session:key'),
        resave: config.get('session:resave'),
        saveUninitialized: config.get('session:saveUninitialized'),
        cookie: config.get('session:cookie'),
        store: new MongoStore({
          mongooseConnection: mongoose.connection, // MongoStore берет настройки для подключения к базе из mongoose
        }),
      })
    );

    app.use(require('./middleware/send-http-error'));

    require('./routes')({ app, statusVideo });
    require('./api')({ app, statusVideo, oauthGoogle });

    app.use(express.static('./public'));

    app.use((req, res) => {
      res.sendHttpError(new HttpError({
        status: 404,
        message: 'Page not found',
      }));
    });


    /*
    *   перехват ошибок
    */

    app.use((err, req, res, next) => {
      if (res.headersSent) {
        logger.error(err.stack);
        return;
      }
      if (err instanceof HttpError) {
        res.sendHttpError(err);
        logger.error(err.stack);
        return;
      }
      logger.error(err.stack);
      res.sendHttpError(new HttpError({
        status: 500,
        message: 'server Error',
      }));
    });

    if (ENV === 'prod') {
      const getSSL = require('./libs/get-ssl');
      const ssl = getSSL();
      https.createServer(ssl, app).listen(port, () => {
        console.log('Express server listening on port ' + port);
      });
    }
    if (ENV === 'dev') {
      http.createServer(app).listen(port, () => {
        logger.info('Express server listening on port ' + port);
      });
    }
  })
  .catch((e) => {
    console.log(e);
    logger.error(e.stack);
  });
