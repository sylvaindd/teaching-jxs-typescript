var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    fs = require('fs');

// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var players = new Array();

io.sockets.on('connection', function (socket, player) {
    
    socket.on('newPlayer', function(data) {
        socket.player = {nick : data.nick, color : data.color};
        
        players.push(socket.player);
        
         io.sockets.emit('newPlayer', {players : players});
    });

    socket.on('refresh', function (coords) {
        coords = ent.encode(coords);
        socket.broadcast.emit('refresh', {nick: socket.player.nick, coords: coords});
    }); 
    
    socket.on('disconnect', function() {
        var index = players.indexOf(socket.player);
        if (index > -1) {
            players.splice(index, 1);
        }
        socket.broadcast.emit('newPlayer', {players : players});
    });
});

server.listen(8080);