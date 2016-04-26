/// <reference path="../../declarations/jquery.d.ts" />
/// <reference path="../../declarations/jquery.ui.d.ts" />
/// <reference path="../../declarations/io.d.ts" />

import {Game} from "./controller"
import {Player} from "./models"

const canvas = <HTMLCanvasElement> document.getElementById("canvas");
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

    socket = io.connect('http://localhost:8080');
    game.socket = socket;

    if(socket != null)
        $( "#dialogInit" ).dialog("open");


    socket.on('newPlayer', function(data) {
        data = JSON.parse(data.players);
        refreshListPlayers(data.players);
    });

    socket.on('MyPlayer', function(data) {
        console.log(data);

        $.each(game.players.players, function(k, v){
            if(v.ID == data.ID)
                playerMoi = v;
        });
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
    console.log(players);
    $('#listPlayers').html("");
    game.players.players = new Array<Player>();
    $.each(players, function(k, v){
        v = v.player;
        game.players.players.push(new Player(v.nick, v.color, v.ID));
        $('#listPlayers').append('<li style="color:'+v.color+'" data-id="'+v.ID+'">'+v.nick+'</li>');
    });
}

var init = function(){
    nick = $("#nick").val();
    color = $("#color").val();

    socket.emit('newPlayer', {nick : nick, color : color});
    document.title = nick + ' - ' + document.title;
}
