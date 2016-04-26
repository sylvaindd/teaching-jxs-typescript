/// <reference path="../../declarations/jquery.d.ts" />
/// <reference path="../../declarations/jquery.ui.d.ts" />
/// <reference path="../../declarations/io.d.ts" />

import {Game} from "./controller"
import {Player} from "./models"

const canvas = <HTMLCanvasElement> document.getElementById("canvas");
const speed = 10;
<<<<<<< HEAD
const game = new Game(canvas, speed);

=======
const game: Game = new Game(canvas, speed);
>>>>>>> origin/master

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

    socket = io.connect('http://localhost:8080');
    game.socket = socket;

    if(socket != null)
        $( "#dialogInit" ).dialog("open");


    socket.on('newPlayer', function(data) {
        console.log(data);
        refreshListPlayers(data.players);
    });

    socket.on('MyPlayer', function(data) {
        console.log(data);

        $.each(game.players, function(k, v){
            if(v.ID == data.ID)
                playerMoi = v;
        });
        game.setPlayerMoi(playerMoi);
    });

    socket.on('start', function(data) {
        game.start();
    });
});

var refreshListPlayers = function(players){
    $('#listPlayers').html("");
    game.players = new Array<Player>();
    $.each(players, function(k, v){
        game.players.push(new Player(v.nick, v.color, v.ID));
        $('#listPlayers').append('<li style="color:'+v.color+'" data-id="'+v.ID+'">'+v.nick+'</li>');
    });
}

var init = function(){
    nick = $("#nick").val();
    color = $("#color").val();
<<<<<<< HEAD
    playerMoi = new Player(nick, color,0);
    game.setPlayerMoi(playerMoi);
    game.start();
    $('#listPlayers').append('<li style="color:'+color+'">'+nick+'</li>');

=======
>>>>>>> origin/master
    socket.emit('newPlayer', {nick : nick, color : color});
    document.title = nick + ' - ' + document.title;
}
