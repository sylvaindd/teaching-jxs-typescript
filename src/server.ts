/// <reference path="../declarations/ws.d.ts" />
/// <reference path="../declarations/node.d.ts" />
/// <reference path="../declarations/jquery.d.ts" />

import {Players, Player, Snake, SnakePart, Key} from "./public/models";

var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs');

require('./routes')(app);

let players: Players = new Players();
let IDs: Array<boolean> = 0;
let isGameRuning: boolean = false;
let keys = [
    [Key.Right, Key.Right, Key.Down],
    [Key.Up, Key.None, Key.Down],
    [Key.Up, Key.Left, Key.Left]
];
        
io.sockets.on('connection', function(socket) {

    socket.on('newPlayer', function(data) {
        socket.player = new Player(data.nick, data.color, getID());
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
        }, 20);
    });

    socket.on('disconnect', function() {
        var index = players.removePlayer(socket.player);
        socket.broadcast.emit('newPlayer', { players: players.array() });
    });
});

function getID(): number{
    let ID: number;
    do{
        ID = getRandomInt(0, 7);
    }while(IDs[ID]);
    IDs[ID] = true;
    return ID;
}

function getRandomInt(min, max): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
    players.getByID(player.ID).lose = true;
    if (players.players.length == 1) {
        io.sockets.emit('gameWin', { player: { ID: players.players[0].ID } });
    }
    // player.socket.destroy();//TODO
}

server.listen(8080);
