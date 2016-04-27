/// <reference path="../../declarations/jquery.d.ts" />
/// <reference path="../../declarations/jquery.ui.d.ts" />
/// <reference path="../../declarations/io.d.ts" />

import {Game} from "./controller"
import {Player} from "./models"

const canvas = <HTMLCanvasElement> document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width=400;
canvas.height=400;
ctx.fillStyle = '#fff'; // set canvas' background color
ctx.fillRect(0, 0, canvas.width, canvas.height);  // now fill the canvas
const speed = 10;
const game: Game = new Game(canvas, speed);

var nick;
var color;
var socket;
var playerMoi;
$(function() {
    $( "#dialogInit" ).dialog({
      resizable: false,
      modal: true,
      autoOpen: false,
      buttons: {
        "Valider": function() {
            $( this ).dialog( "close" );
            init();
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });

    $("#nick").on('keypress', function (event) {
      if(event.which === 13){
          $("#dialogInit").dialog( "close" );
          init();
      }
   });

    socket = io.connect('http://localhost:8080');
    game.addSocket(socket);

    if(socket != null)
        $( "#dialogInit" ).dialog("open");


    socket.on('newPlayer', function(data) {
      if(data.players.length > 0){
        data = JSON.parse(data.players);
        refreshListPlayers(data.players);
      }
    });

    socket.on('MyPlayer', function(data) {
        for(let v of game.players.players){
            if(v.ID == data.ID)
                playerMoi = v;
        }
        game.setPlayerMoi(playerMoi);
    });

    socket.on('start', function(data) {
        game.start();
    });
});


$("#start").click(function(){
    socket.emit('start');
});

var refreshListPlayers = function(players){
    $('#listPlayers').html("");
    game.players.players = new Array<Player>();
    for(let v of players){
        v = v.player;
        game.players.players.push(new Player(v.nick, v.color, v.ID));
        $('#listPlayers').append('<li style="color:'+v.color+'" data-id="'+v.ID+'">'+v.nick+'</li>');
    }
}

var init = function(){
    nick = $("#nick").val();
    color = $("#color").val();

    socket.emit('newPlayer', {nick : nick, color : color});
    document.title = nick + ' - ' + document.title;
}
