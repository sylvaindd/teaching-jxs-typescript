/// <reference path="../../declarations/jquery.d.ts" />

import {Key, Interactor, SnakePart, Player, Players} from "./models";
import {Movement} from "./interaction";

export class Game extends Interactor{
    players: Players;
    playerMoi : Player;
    canvasContext : CanvasRenderingContext2D;
    gridWidth : number;
    gridHeight : number;
    movement : Movement;
    isGameOver: boolean;
    pointMeal: SnakePart
    socket;

    constructor(public canvas : HTMLCanvasElement, public speed : number, public gridSize : number = 5) {
        super(canvas);
        this.gridWidth = canvas.width / gridSize;
        this.gridHeight = canvas.height / gridSize;
        this.canvasContext = canvas.getContext("2d");
        this.isGameOver = false;

        this.players = new Players();
        // TODO : listen to user interaction
        this.movement = new Movement(canvas, this);

    }

    addSocket(socket): void{
      this.socket = socket;
      this.socket.on('refresh', function(data){
        data = JSON.parse(data.players);
        for(let v of data.players){
          v = v.player;
           if(this.playerMoi.ID != v.ID){
              var coords = v.snake.coords;
              coords = coords.replace(/'/g, '"');
              coords = JSON.parse(coords);
              this.players.getByID(v.ID).deserializeCoords(coords);
            }
          }
      }.bind(this));
      this.socket.on('gameOver', function(data){
        if(data.player.ID == this.playerMoi.ID){
          this.gameOver();
        }else{
          this.players.removePlayerByID(data.player.ID);
        }
      }.bind(this));
      this.socket.on('gameWin', function(data){
        if(data.player.ID == this.playerMoi.ID){
          this.gameWin();
        }
      }.bind(this));
    }

    onArrowkeyPressed(movement: Movement): void{
      if(this.playerMoi.getSnake().lastKey == Key.Up && movement.key == Key.Down || this.playerMoi.getSnake().lastKey == Key.Down && movement.key == Key.Up || this.playerMoi.getSnake().lastKey == Key.Right && movement.key == Key.Left || this.playerMoi.getSnake().lastKey == Key.Left && movement.key == Key.Right){return;}
      this.playerMoi.snake.lastKey = movement.key;
    }

    setPlayerMoi(pl: Player): void{
        this.playerMoi = pl;
    }

    /**
         * Start game
         */
    start() {
      this.isGameOver = false;
      $('div#gameOver').hide('fast', function() {
        $( this ).animate({down:250}, 'slow');
      });
      $('div#gameWin').hide('fast', function() {
        $( this ).animate({down:250}, 'slow');
      });
      this.players.init();
    // TODO : initialize game
        this.generatePointMeal();
        this.animate(); // Start animation
    }

    generatePointMeal(){
        let x:number = Math.floor(Math.random() * 400);
        let y:number = Math.floor(Math.random() * 400);
        this.pointMeal = new SnakePart(x,y);
        this.pointMeal.drawMeal(this.canvasContext);
    }

    animate() {
        let fps = this.speed;
        let now;
        let then = Date.now();
        let interval = 1000/fps;
        let delta;

        let animationLoop = (function () {
            if (!this.isGameOver) {
                requestAnimationFrame(animationLoop);
            }
            now = Date.now();
            delta = now - then;

            if (delta > interval) {
                then = now - (delta % interval);
                this.update();
            }
        }).bind(this);

        animationLoop();
    }

        /**
         * Update status of game and view
         */
    update() {
        let nbCaseToDelete:number =5
        let player = this.players.getByID(this.playerMoi.ID);
        switch (this.playerMoi.getSnake().lastKey) {
            case Key.Up:
                player.getCoords().unshift(new SnakePart(player.getCoords()[0].x, player.getCoords()[0].y-nbCaseToDelete));
                break;
            case Key.Down:
                player.getCoords().unshift(new SnakePart(player.getCoords()[0].x, player.getCoords()[0].y+nbCaseToDelete));
                break;
            case Key.Right:
                player.getCoords().unshift(new SnakePart(player.getCoords()[0].x+nbCaseToDelete, player.getCoords()[0].y));
                break;
            case Key.Left:
                player.getCoords().unshift(new SnakePart(player.getCoords()[0].x-nbCaseToDelete, player.getCoords()[0].y));
                break;
        }
        if(player.getCoords()[0].x == this.pointMeal.x && player.getCoords()[0].y == this.pointMeal.y)
        {
            for(let i:number = 0 ; i < 3 ; i++)
            {
                player.getCoords().push(new SnakePart(player.getCoords()[player.getCoords().length-1].x, player.getCoords()[player.getCoords().length-1].y));
            }
            this.pointMeal.clear(this.canvasContext);
            this.generatePointMeal();
        }
        //console.log(this.playerMoi.snake.coords);
        this.players.draw(this.canvasContext);
        this.socket.emit('refresh', player.serialize());
    }

    gameOver(){
      this.isGameOver = true;
      $('div#gameOver').show('fast', function() {
        $( this ).animate({top:250}, 'slow');
      });
    }

    gameWin(){
      this.isGameOver = true;
      $('div#gameWin').show('fast', function() {
        $( this ).animate({top:250}, 'slow');
      });
    }

}
