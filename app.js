const express = require('express');
const http = require('http');
const HttpError = require('./error');
const config = require('./config');
const morgan = require('morgan');
const logger = require('./libs/log'); // логирование в консоль
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('./libs/mongoose');

const app = express();
app.set('port', config.get('port'));

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

require('./routes')({ app });
require('./api')({ app });


app.use(express.static('./public'));


/*
*   перехват ошибок
*/

app.use((err, req, res, next) => {
  let error = err;
  logger.error(error.stack);
  if (error instanceof HttpError) {
    res.status(error.status);
    res.json(error);
    return;
  }
  res.status(500);
  res.json(new HttpError({
    status: 500,
  }));
});



http.createServer(app).listen(config.get('port'), () => {
  logger.info('Express server listening on port ' + config.get('port'));
});
