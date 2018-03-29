var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

global.mbcli = require('./mbcli.js'); // Use one global modbusclient

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');



var app = express();

var Modbusclient = require('./mbcli.js'); // TODO export default client ...
var mock = true

if (mock === false) {
  var statusRouter = require('./routes/mock/status');
  var resetZeroRouter = require('./routes/mock/resetzero');
  var setTaraRouter = require('./routes/mock/settara');
  var readWeightRouter = require('./routes/mock/readweight');
} else {
  var statusRouter = require('./routes/status');
  var resetZeroRouter = require('./routes/resetzero');
  var setTaraRouter = require('./routes/settara');
  var readWeightRouter = require('./routes/readweight');
}

app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// mount the router on the app
app.use('/getDatsStatus', statusRouter);
app.use('/resetZeroDats', resetZeroRouter);
app.use('/setTaraDats', setTaraRouter);
app.use('/readWeightDats', readWeightRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
