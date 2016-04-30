/// <reference path="../declarations/ws.d.ts" />
/// <reference path="../declarations/node.d.ts" />
/// <reference path="../declarations/jquery.d.ts" />

import {Players, Player, Snake, SnakePart, Key, StartSnakePart} from "./public/models";

var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs');

require('./routes')(app);

let players: Players = new Players();
let IDs: Array<boolean> = new Array<boolean>(8);
let isGameRuning: boolean = false;
let canvas = {width : 500, height: 500};
let keys = [
    [Key.Right, Key.Right, Key.Down],
    [Key.Up, Key.None, Key.Down],
    [Key.Up, Key.Left, Key.Left]
];
let startPoints: Array<StartSnakePart>;
let remainingPlayers: number;
let pointMeal: SnakePart;
let refreshLoop;

generateStartPoints();
        
io.sockets.on('connection', function(socket) {

    socket.on('newPlayer', function(data) {
        let ID: number = getID();
        socket.player = new Player(data.nick, data.color, ID, startPoints[ID]);
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
        remainingPlayers = players.players.length;
        generatePointMeal();
        io.sockets.emit('start');
        refreshLoop = setInterval(refresh, 10);
    });

    socket.on('disconnect', function() {
        var index = players.removePlayer(socket.player);
        if(!socket.player.lose)
            remainingPlayers--;
        socket.broadcast.emit('newPlayer', { players: players.array() });
    });
});

function refresh(){
    io.sockets.emit('refresh', { players: players.serialize(), pointMeal : {x : pointMeal.x, y : pointMeal.y}});
    if (!isGameRuning || remainingPlayers == 0) {
        clearInterval(refreshLoop);
    }
}

function generatePointMeal(){
    let x:number = Math.floor(Math.random() * canvas.width/5);
    let y:number = Math.floor(Math.random() * canvas.height/5);
    pointMeal = new SnakePart(x*5, y*5);
}

    
function generateStartPoints(): void
{
    startPoints = new Array<StartSnakePart>();
    let key:number = Key.Right;
    for(let x:number = 1 ; x <= 3 ; x++)
    {
        for(let y:number = 1 ; y <= 3 ; y++)
        {
            if(y != 2 || x != 2)
            {
                startPoints.push(new StartSnakePart(canvas.width/4*x, canvas.height/4*y,keys[x-1][y-1]));
            }
        }
    }
}

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

// if(player.getCoords()[0].x == this.pointMeal.x && player.getCoords()[0].y == this.pointMeal.y)
        // {
        //     for(let i:number = 0 ; i < 5 ; i++)
        //     {
        //         player.getCoords().push(new SnakePart(player.getCoords()[player.getCoords().length-1].x, player.getCoords()[player.getCoords().length-1].y));
        //     }
        //     this.speed+=5;
        //     this.pointMeal.clear(this.canvasContext);
        //     this.generatePointMeal();
        // }

function checkDetection() {
    for (let v of players.players) {
        if(!v.lose){
            if(v.snake.arrayPosNoHead().indexOf(v.snake.getHeadPos()) > -1)
                gameOver(v);
            if(v.snake.getHeadPos() == pointMeal.posString()){
                for(let i:number = 0 ; i < 5 ; i++)
                    v.getCoords().push(new SnakePart(v.getCoords()[v.getCoords().length-1].x, v.getCoords()[v.getCoords().length-1].y));
                generatePointMeal();
                refresh();
            }
            for (let v2 of players.players) {
                if(!v2.lose){
                    if (v.ID != v2.ID && (v2.snake.arrayPos().indexOf(v.snake.getHeadPos()) >  -1 )) {
                        gameOver(v);
                    }
                }
            }
        }
    }
}

var gameOver = function(player: Player) {
    io.sockets.emit('gameOver', { player: { ID: player.ID } });
    players.getByID(player.ID).lose = true;
    remainingPlayers = getRemainingPlayers();
    if (remainingPlayers <= 1) {
        remainingPlayers--;
        isGameRuning = false;
        io.sockets.emit('gameWin', { player: { ID: getWinner().ID } });
    }
    // player.socket.destroy();//TODO
}

function getRemainingPlayers(): number{
    let i: number = 0;
    for (let v of players.players) {
        if(!v.lose)
            i++;
    }
    return i;    
}

function getWinner(): Player{
    for (let v of players.players) {
        if(!v.lose)
            return v;
    }
    return null;    
}

server.listen(8080);
