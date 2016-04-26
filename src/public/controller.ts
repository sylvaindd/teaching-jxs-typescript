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
    movement.key;
    playerMoi.snake.lastKey = movement.key;
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
    switch (playerMoi.snake.lastKey) {
            case Key.up:


$.each(playerMoi.snake.coords,function(key,val){
//déplacer chaque snake part de son suivant

if(key==0){
    val.x = val.x;
    val.y = val.y-1;
}else{
    val.x = playerMoi.snake.coords[key-1];
    val.y = playerMoi.snake.coords[key-1];
}

                });


                break;
            case Key.down:
$.each(playerMoi.snake.coords,function(key,val){
//déplacer chaque snake part de son suivant

if(key==0){
    val.x = val.x;
    val.y = val.y+1;
}else{
    val.x = playerMoi.snake.coords[key-1];
    val.y = playerMoi.snake.coords[key-1];
}

                });
                break;
            case Key.right:
$.each(playerMoi.snake.coords,function(key,val){
//déplacer chaque snake part de son suivant

if(key==0){
    val.x = val.x+1;
    val.y = val.y;
}else{
    val.x = playerMoi.snake.coords[key-1];
    val.y = playerMoi.snake.coords[key-1];
}

                });
                break;
            case Key.left:
$.each(playerMoi.snake.coords,function(key,val){
//déplacer chaque snake part de son suivant

if(key==0){
    val.x = val.x-1;
    val.y = val.y;
}else{
    val.x = playerMoi.snake.coords[key-1];
    val.y = playerMoi.snake.coords[key-1];
}

                });
                break;
    }


    console.log("update")
}

}
