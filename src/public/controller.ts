/// <reference path="../../declarations/jquery.d.ts" />

import {Key, Interactor, Player} from "./models";
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
        this.start();
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
    // TODO
        switch (this.playerMoi.getSnake().lastKey) {
                case Key.Up:
    $.each(this.playerMoi.getCoords(),function(key,val){
                    //déplacer chaque snake part de son suivant

                        if(key==0){
                            val.x = val.x;
                            val.y = val.y-1;
                        }else{
                            val.x = this.playerMoi.getCoords()[key-1];
                            val.y = this.playerMoi.getCoords()[key-1];
                        }

                    });


                    break;
                case Key.Down:
                    $.each(this.playerMoi.getCoords(),function(key,val){
                    //déplacer chaque snake part de son suivant

                        if(key==0){
                            val.x = val.x;
                            val.y = val.y+1;
                        }else{
                            val.x = this.playerMoi.getCoords()[key-1];
                            val.y = this.playerMoi.getCoords()[key-1];
                        }

                    });
                    break;
                case Key.Right:
                    $.each(this.playerMoi.getCoords(),function(key,val){
                    //déplacer chaque snake part de son suivant

                        if(key==0){
                            val.x = val.x+1;
                            val.y = val.y;
                        }else{
                            val.x = this.playerMoi.getCoords()[key-1];
                            val.y = this.playerMoi.getCoords()[key-1];
                        }

                    });
                    break;
                case Key.Left:
                    $.each(this.playerMoi.getCoords(),function(key,val){
                    //déplacer chaque snake part de son suivant

                        if(key==0){
                            val.x = val.x-1;
                            val.y = val.y;
                        }else{
                            val.x = this.playerMoi.getCoords()[key-1];
                            val.y = this.playerMoi.getCoords()[key-1];
                        }

                    });
                    break;

        }
        console.log("update");
    }

}
