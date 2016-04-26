/// <reference path="../../declarations/jquery.d.ts" />

import {Interactor, Player} from "./models";
import {Movement} from "./interaction";

export class Game {
    players: Array<Player>;
    canvasContext : CanvasRenderingContext2D;
    gridWidth : number;
    gridHeight : number;

    constructor(public canvas : HTMLCanvasElement, public speed : number, public gridSize : number = 5) {
        this.gridWidth = canvas.width / gridSize;
        this.gridHeight = canvas.height / gridSize;
        this.canvasContext = canvas.getContext("2d");

        this.players = new Array();

        // TODO : listen to user interaction
    }

    onArrowkeyPressed(movement: Movement): void{
        movement.key
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
        console.log("update")
    }

}
