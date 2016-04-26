/// <reference path="../declarations/ws.d.ts" />
/// <reference path="../declarations/node.d.ts" />
/// <reference path="../../declarations/jquery.d.ts"

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
        $.each(v.coords, function(k2, v2){
            $.each(players, function(k3, v3){
                if(v3.arrayPos().indexOf(v2.pos()) > -1){

                }
            });
        });
    });
}


server.listen(8080);
