/// <reference path="../declarations/ws.d.ts" />
/// <reference path="../declarations/node.d.ts" />
/// <reference path="../declarations/jquery.d.ts" />

import {Players, Player, Snake, SnakePart} from "./public/models";

var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs');

require('./routes')(app);

var players: Players = new Players();

io.sockets.on('connection', function (socket, player) {
    
    socket.on('newPlayer', function(data) {
        socket.player = new Player(data.nick, data.color);
        
        players.addPlayer(socket.player);
        
        io.sockets.emit('newPlayer', {players : players.array()});
    });

    socket.on('refresh', function (coords) {
        socket.broadcast.emit('refresh', {nick: socket.player.nick, coords: coords});
        checkDetection();
    }); 
    
    socket.on('disconnect', function() {
        var index = players.removePlayer(socket.player);
        socket.broadcast.emit('newPlayer', {players : players.array()});
    });
});


var checkDetection = function(){
    $.each(players, function(k, v){
        $.each(players, function(k2, v2){
            if(v2.arrayPos().indexOf(v.snake.getHead()) > -1){
                gameOver(v);
            }
        });
    });
}

var gameOver = function(player: Player){
    player.socket.broadcast.emit('gameOver', {player : player.ID});
}


server.listen(8080);
