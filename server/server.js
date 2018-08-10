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
        startGame(fn);
      });

      socket.on('move-paddle', (data, fn) => {
        console.log(data);
        let tempGame = { id: data.gameRoom };

        if (data.player === 1) {
          tempGame.playerOnePosition = data.y;
        }
        else if (data.player === 2) {
          tempGame.playerTwoPosition = data.y;
        };

        games.patchOrCreate(tempGame, function(err, success) {
          if (err) {
            console.log(err);
          }
          else {
            console.log(success);
            // fn(success)
          }
        });
      });

      function game(id) {
        let interval = setInterval(() => {
          games.findOne({
            where: {
              id: id
            },
          }, function(err, success) {
            if (err) {
              console.log(err);
            }
            else {
              socket.emit('update', success);
            }
          });
        }, 50);
      }

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
            success.player = 1;
            console.log(success);
            socket.join(success.id);
            fn(success);
          }
        });
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
            success.player = 2;
            game(id);
            console.log(success);
            fn(success);
          }
        });
      }
    });
  }
});
