/// <reference path="../../declarations/jquery.d.ts" />
/// <reference path="../../declarations/jquery.ui.d.ts" />
/// <reference path="../../declarations/io.d.ts" />

import {Game} from "./controller"
import {Player} from "./models"

const canvas = <HTMLCanvasElement> document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width=250;
canvas.height=250;
ctx.fillStyle = '#fff'; // set canvas' background color
ctx.fillRect(0, 0, canvas.width, canvas.height);  // now fill the canvas
const speed = 10;
const game: Game = new Game(canvas, speed);

var nick;
var color;
var socket;
var ip;
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

    $( "#dialogInit" ).dialog("open");

    $("#nick").on('keypress', function (event) {
      if(event.which === 13){
          $("#dialogInit").dialog( "close" );
          init();
      }
   });

   $("#ip").keyup(function (e) {
       this.className = validateIpAndPort(this.value) ? "" : "invalid";
       $(".ui-dialog .ui-dialog-buttonset button").first().prop("disabled", !validateIpAndPort(this.value));
   });
});


function validateIpAndPort(input) {
    var parts = input.split(":");
    var ip = parts[0].split(".");
    var port = parts[1];
    return validateNum(port, 1, 65535) && ip.length == 4 && ip.every(function (segment) {
        return validateNum(segment, 0, 255);
    });
}

function validateNum(input, min, max) {
    var num = +input;
    return num >= min && num <= max && input === num.toString();
}

let connected: boolean = false;
var init = function(){
    nick = $("#nick").val();
    color = $("#color").val();
    // ip = $("#ip").val();
    var url = window.location.href;
    var arr = url.split("/");
    ip = arr[0] + "//" + arr[2]
    socket = io.connect(ip);

    socket.on('connect', function() {
      init2();
    });

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

    setTimeout(function(){
      if(!connected){
        alert("erreur IP");
        socket.destroy();
        return;
      }
    }, 1000);

    var init2 = function(){
      connected = true;
      game.addSocket(socket);


      $("#start").click(function(){
          socket.emit('start');
      });

      socket.emit('newPlayer', {nick : nick, color : color});
      document.title = nick + ' - ' + document.title;
    }

    var refreshListPlayers = function(players){
        $('#listPlayers').html("");
        game.players.players = new Array<Player>();
        for(let v of players){
            v = v.player;
            game.players.players.push(new Player(v.nick, v.color, v.ID));
            $('#listPlayers').append('<li style="color:'+v.color+'" data-id="'+v.ID+'">'+v.nick+'</li>');
        }
    }

}
