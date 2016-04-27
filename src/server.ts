/// <reference path="../declarations/ws.d.ts" />
/// <reference path="../declarations/node.d.ts" />
/// <reference path="../declarations/jquery.d.ts" />

import {Players, Player, Snake, SnakePart} from "./public/models";

var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs');

require('./routes')(app);

let players: Players = new Players();
let IDs: number = 0;
let isGameRuning: boolean = false;

io.sockets.on('connection', function(socket) {

    socket.on('newPlayer', function(data) {
        socket.player = new Player(data.nick, data.color, IDs++);
        socket.player.socket = socket;

        players.addPlayer(socket.player);

        io.sockets.emit('newPlayer', { players: players.serialize() });
        socket.emit('MyPlayer', { nick: socket.player.nick, color: socket.player.color, ID: socket.player.ID });
    });

    socket.on('refresh', function(data) {
        data = JSON.parse(data);
        if (players.players.length > 0) {
            var coords = data.player.snake.coords;
            coords = coords.replace(/'/g, '"');
            coords = JSON.parse(coords);
            if (players.getByID(data.player.ID) != null) {
                players.getByID(data.player.ID).deserializeCoords(coords);
                checkDetection();
            }
        }
    });

    socket.on('start', function() {
        isGameRuning = true;
        io.sockets.emit('start');
        let refreshLoop = setInterval(function() {
            io.sockets.emit('refresh', { players: players.serialize() });
            if (!isGameRuning || players.players.length == 0) {
                clearInterval(refreshLoop);
            }
        }, 50);
    });

    socket.on('disconnect', function() {
        var index = players.removePlayer(socket.player);
        socket.broadcast.emit('newPlayer', { players: players.array() });
    });
});


var checkDetection = function() {
    for (let v of players.players) {
      if(v.snake.arrayPosNoHead().indexOf(v.snake.getHeadPos()) > -1)
          gameOver(v);
        for (let v2 of players.players) {
            if (v.ID != v2.ID && (v2.snake.arrayPos().indexOf(v.snake.getHeadPos()) >  -1 )) {
                gameOver(v);
            }
        }
    }
}

var gameOver = function(player: Player) {
    io.sockets.emit('gameOver', { player: { ID: player.ID } });
    players.removePlayerByID(player.ID);
    if (players.players.length == 1) {
        io.sockets.emit('gameWin', { player: { ID: players.players[0].ID } });
    }
    // player.socket.destroy();//TODO
}


server.listen(8080);
