"use strict";
var models_1 = require("./models");
var app = require('express')(), server = require('http').createServer(app), io = require('socket.io').listen(server), ent = require('ent'), fs = require('fs');
require('./routes')(app);
var players = new models_1.Players();
io.sockets.on('connection', function (socket, player) {
    socket.on('newPlayer', function (data) {
        socket.player = new models_1.Player(data.nick, data.color);
        players.addPlayer(socket.player);
        io.sockets.emit('newPlayer', { players: players.array() });
    });
    socket.on('refresh', function (coords) {
        coords = ent.encode(coords);
        socket.broadcast.emit('refresh', { nick: socket.player.nick, coords: coords });
        checkDetection();
    });
    socket.on('disconnect', function () {
        var index = players.removePlayer(socket.player);
        socket.broadcast.emit('newPlayer', { players: players.array() });
    });
});
var checkDetection = function () {
};
server.listen(8080);
//# sourceMappingURL=server.js.map