/// <reference path="../../declarations/jquery.d.ts" />
/// <reference path="../../declarations/jquery.ui.d.ts" />
/// <reference path="../../declarations/io.d.ts" />

import {Game} from "./controller"
import {Player} from "./models"

const canvas = <HTMLCanvasElement> document.getElementById("snakeGame");
const speed = 10;
const game = new Game(canvas, speed);
//game.start();
var playerMoi: Player;

var nick;
var color;
var socket;
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
    if(socket != null)
        $( "#dialogInit" ).dialog("open");

    socket.on('refresh', function(data) {
        //TODO : Refresh
    });

    socket.on('newPlayer', function(data) {
        console.log(data);
        $('#listPlayers').html("");
        $.each(data.players, function(k, v){
           $('#listPlayers').append('<li style="color:'+v.color+'">'+v.nick+'</li>');
        });
    });
});


var init = function(){
    nick = $("#nick").val();
    color = $("#color").val();
    playerMoi = new Player(nick, color);
    $('#listPlayers').append('<li style="color:'+color+'">'+nick+'</li>');

    socket.emit('newPlayer', {nick : nick, color : color});
    document.title = nick + ' - ' + document.title;
}
