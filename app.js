var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var _ = require('lodash');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var io           = socketio();
app.io           = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});






// SOCKET.IO

var connected_sockets = [];

function handleSocketDisconnect() {
  var socketId = this.id;
  connected_sockets = _.reject(connected_sockets, function(socket) { return socket.id === socketId; });
  console.log('user disconnected', socketId);
}


function handleNewConnection(socket) {
  var socketId = socket.id;

  socket.on('disconnect', handleSocketDisconnect);

  socket.on('message', function(msg) {
    console.log('received message', msg);
    // send signal to all other connected sockets
    socket.broadcast.emit('message', msg);
  });

  console.log('connection', socket.id);
  connected_sockets.push(socket)
  console.log('current connection count:', connected_sockets.length);
}


io.on('connection', handleNewConnection);


module.exports = app;
