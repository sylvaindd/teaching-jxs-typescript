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

    onArrowkeyPressed(movement: Movement): void{
        movement.key;
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

    for(let player of this.players.players){
         console.log("update"+player.nick);
        let i:number =0;
        let nbCaseToDelete:number =5
        switch (player.getSnake().lastKey) {
            case Key.Up:
                player.getCoords().unshift(new SnakePart(player.getCoords()[0].x,player.getCoords()[0].y-nbCaseToDelete));
                break;
            case Key.Down:
                player.getCoords().unshift(new SnakePart(player.getCoords()[0].x,player.getCoords()[0].y+nbCaseToDelete));
                break;
            case Key.Right:
                player.getCoords().unshift(new SnakePart(player.getCoords()[0].x+nbCaseToDelete,player.getCoords()[0].y));
                break;
            case Key.Left:
                 player.getCoords().unshift(new SnakePart(player.getCoords()[0].x-nbCaseToDelete,player.getCoords()[0].y));
                break;
            }
        }
        this.players.draw(this.canvasContext);
    }

}
