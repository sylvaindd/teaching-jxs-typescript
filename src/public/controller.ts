/// <reference path="../../declarations/jquery.d.ts" />

import {Key, Interactor, SnakePart, Player} from "./models";
import {Movement} from "./interaction";

export class Game extends Interactor{
    players: Array<Player>;
    playerMoi : Player;
    canvasContext : CanvasRenderingContext2D;
    gridWidth : number;
    gridHeight : number;
    movement : Movement;

    constructor(public canvas : HTMLCanvasElement, public speed : number, public gridSize : number = 5) {
        super(canvas);
        this.gridWidth = canvas.width / gridSize;
        this.gridHeight = canvas.height / gridSize;
        this.canvasContext = canvas.getContext("2d");

        this.players = new Array();
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
let i:number =0;
        switch (this.playerMoi.getSnake().lastKey) {
                case Key.Up:
                    i=0;
                        for (let val of this.playerMoi.getCoords()){
                    //déplacer chaque snake part de son suivant

                        if(i==0){
                            val.x = val.x;
                            val.y = val.y-1;
                        }else{
                            val.x = this.playerMoi.getCoords()[i-1].x;
                            val.y = this.playerMoi.getCoords()[i-1].y;
                        }
                            i++;

                    };


                    break;
                case Key.Down:
                    i=0;
                     for (let val of this.playerMoi.getCoords()){
                    //déplacer chaque snake part de son suivant

                        if(i==0){
                            val.x = val.x;
                            val.y = val.y+1;
                        }else{
                            val.x = this.playerMoi.getCoords()[i-1].x;
                            val.y = this.playerMoi.getCoords()[i-1].y;
                        }

                    };
                    break;
                case Key.Right:
                    i=0;
                     for (let val of this.playerMoi.getCoords()){
                    //déplacer chaque snake part de son suivant

                        if(i==0){
                            val.x = val.x+1;
                            val.y = val.y;
                        }else{
                            val.x = this.playerMoi.getCoords()[i-1].x;
                            val.y = this.playerMoi.getCoords()[i-1].y;
                        }

                    };
                    break;
                case Key.Left:
                    i=0;
                     for (let val of this.playerMoi.getCoords()){
                    //déplacer chaque snake part de son suivant

                        if(i==0){
                            val.x = val.x-1;
                            val.y = val.y;
                        }else{
                            val.x = this.playerMoi.getCoords()[i-1].x;
                            val.y = this.playerMoi.getCoords()[i-1].y;
                        }

                    };
                    break;

        }
        console.log("update");
    this.playerMoi.draw(this.canvasContext);
    }

}
