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
    counter: number;
    freq: number;
    
    constructor(public canvas : HTMLCanvasElement, public speed : number, public gridSize : number = 5) {
        super(canvas);
        this.gridWidth = canvas.width / gridSize;
        this.gridHeight = canvas.height / gridSize;
        this.canvasContext = canvas.getContext("2d");
        this.isGameOver = false;

        this.counter = 0;
        this.freq = 10;
        
        this.players = new Players();
        // TODO : listen to user interaction
        this.movement = new Movement(canvas, this);

    }

    addSocket(socket): void{
        this.socket = socket;
        this.socket.on('refresh', function(data){
        for(let v of JSON.parse(data.players).players){
            v = v.player;
            var coords = v.snake.coords;
            coords = coords.replace(/'/g, '"');
            coords = JSON.parse(coords);
            if(this.players.getByID(v.ID) != null)
                this.players.getByID(v.ID).deserializeCoords(coords);
        }
        this.pointMeal = new SnakePart(data.pointMeal.x, data.pointMeal.y);
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
      if(this.playerMoi.getSnake().lastKeyValide == Key.Up && movement.key == Key.Down || this.playerMoi.getSnake().lastKeyValide == Key.Down && movement.key == Key.Up || this.playerMoi.getSnake().lastKeyValide == Key.Right && movement.key == Key.Left || this.playerMoi.getSnake().lastKeyValide == Key.Left && movement.key == Key.Right){return;}
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
        // TODO : initialize game
        this.animate(); // Start animation
    }

    animate() {
        let fps = this.speed;
        let now;
        let then = Date.now();
        let interval = 1000/fps;
        let delta;
                
        let animationLoop = setInterval((function(){
            if (this.isGameOver) {
                clearInterval(animationLoop);
            }
            this.counter += this.freq;
            this.update();
        }).bind(this), this.freq);
        
        // let animationLoop = (function () {
        //     fps = this.speed;
        //     interval = 1000/fps;
        //     if (!this.isGameOver) {
        //         requestAnimationFrame(animationLoop);
        //     }
        //     now = Date.now();
        //     delta = now - then;

        //     if (delta > interval) {
        //         then = now - (delta % interval);
        //         this.update();
        //     }
        // }).bind(this);

        // animationLoop();
    }

        /**
         * Update status of game and view
         */
    update() {
        let tailleCase:number =5
        let player = this.players.getByID(this.playerMoi.ID);
        if(this.counter % (1000 / this.speed) < this.freq){
            switch (this.playerMoi.getSnake().lastKey) {
                case Key.Up:
                    if(player.getCoords()[0].y <= 0){
                        player.getCoords().unshift(new SnakePart(player.getCoords()[0].x, this.canvas.height-tailleCase));
                    }else{
                        player.getCoords().unshift(new SnakePart(player.getCoords()[0].x, player.getCoords()[0].y-tailleCase));
                    }

                    break;
                case Key.Down:
                    if(player.getCoords()[0].y >= this.canvas.height-5){
                        player.getCoords().unshift(new SnakePart(player.getCoords()[0].x, 0));
                    }else{
                        player.getCoords().unshift(new SnakePart(player.getCoords()[0].x, player.getCoords()[0].y+tailleCase));
                    }
                    break;
                case Key.Right:
                    if(player.getCoords()[0].x >= this.canvas.width-5){
                        player.getCoords().unshift(new SnakePart(0, player.getCoords()[0].y));
                    }else{
                        player.getCoords().unshift(new SnakePart(player.getCoords()[0].x+tailleCase, player.getCoords()[0].y));
                    }
                    break;
                case Key.Left:
                    if(player.getCoords()[0].x <= 0){
                        player.getCoords().unshift(new SnakePart(this.canvas.width-tailleCase, player.getCoords()[0].y));
                    }else{
                        player.getCoords().unshift(new SnakePart(player.getCoords()[0].x-tailleCase, player.getCoords()[0].y));
                    }
                    break;
            }
            player.snake.coords.pop();
            this.playerMoi.getSnake().lastKeyValide = this.playerMoi.getSnake().lastKey;
        }        
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.pointMeal.drawMeal(this.canvasContext);
        this.players.draw(this.canvasContext, this.canvas);
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
