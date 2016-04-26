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
    socket;

    constructor(public canvas : HTMLCanvasElement, public speed : number, public gridSize : number = 5) {
        super(canvas);
        this.gridWidth = canvas.width / gridSize;
        this.gridHeight = canvas.height / gridSize;
        this.canvasContext = canvas.getContext("2d");

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
    // TODO : initialize game
        this.animate(); // Start animation
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
        switch (player.getSnake().lastKey) {
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
        //console.log(this.playerMoi.snake.coords);
        this.players.draw(this.canvasContext);
        this.socket.emit('refresh', player.serialize());
    }

}
