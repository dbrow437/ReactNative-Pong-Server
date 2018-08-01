'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();


app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) {

    app.io = require('socket.io')(app.start());
    var games = app.models.Game;

    app.io.on('connection', (socket) => {
      console.log('a user connected');

      socket.on('pinged', (fn) => {
        console.log('pong');
        fn('pong');
      });

      socket.on('start-game', (fn) => {
        startGame(fn)
      });

      function startGame(fn) {
        games.findOne({
          where: {
            population: 1
          },

        }, function(err, success) {
          if (err) {
            console.log(err);
          }
          //found a game, join it
          else if (success) {
            joinGame(success.id, fn);
          }
          //didn't find a game, create one
          else {
            newGame(fn);
          }
        });
      }

      function newGame(fn) {
        games.create({
          population: 1,
          status: "open"
        }, function(err, success) {
          if (err) {
            console.log(err);
          }
          else {
            console.log(success)
            socket.join(success.id)
            fn("waiting+for+game")
          }
        })
      }

      function joinGame(id, fn) {
        socket.join(id);
        games.patchOrCreate({
          population: 2,
          status: "ready",
          id: id
        }, function(err, success) {
          if (err) {
            console.log(err);
          }
          else {
            console.log(success)
            socket.join(success.id)
            fn("game+on")
          }
        });
      }
    });
  }
});
