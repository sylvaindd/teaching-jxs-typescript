/// <reference path="../declarations/ws.d.ts" />
/// <reference path="../declarations/node.d.ts" />

import {Players, Player} from "./models";

var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
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
        coords = ent.encode(coords);
        socket.broadcast.emit('refresh', {nick: socket.player.nick, coords: coords});
        checkDetection();
    }); 
    
    socket.on('disconnect', function() {
        var index = players.removePlayer(socket.player);
        socket.broadcast.emit('newPlayer', {players : players.array()});
    });
});


var checkDetection = function(){
    
}


server.listen(8080);
