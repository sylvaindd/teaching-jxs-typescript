import {Movement} from "./interaction";

export class SnakePart{
    x: number;
    y: number;

    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    pos(): string{
        return this.x + "-" + this.y;
    }

    draw (ctx)
    {
        ctx.lineWidth = 5;
        ctx.fillRect(this.x,this.y,5,5);
        ctx.stroke();
    }
}

export class Snake {
    coords: Array<SnakePart>;
    lastKey: number;
    startPoint: SnakePart

    constructor(lenght:number, startPoint:SnakePart) {
        this.coords = new Array<SnakePart>();
        this.init(lenght, startPoint);
    }

    init(lenght:number, startPoint: SnakePart)
    {
        this.lastKey = Key.Right;
        this.coords.push(startPoint);
        for(let i:number = 1 ; i < lenght ; i++)
        {
            let point:SnakePart = new SnakePart(startPoint.x-5*i,startPoint.y);
            this.coords.push(point);
        }
    }

    draw (ctx)
    {
        for (let point of this.coords)
        {
            point.draw(ctx);
        }
    }

    getHead(): SnakePart{
        return this.coords[0];
    }

    arrayPos(): Array<string>{
        var arrayPos = new Array<string>();

        for(let v of this.coords){
            arrayPos.push(v.pos());
        }
        return arrayPos;
    }

    jsonPos(): string{
        var json: string = "[";
        for(let v of this.coords){
           json += "'"+v.pos()+"',";
        }
        json += "]";
        return json;
    }
}

export class Players {
    players: Array<Player>;
    
    constructor() {
        this.players = new Array<Player>();
    }

    draw (ctx)
    {
        for (let player of this.players)
        {
            player.draw(ctx);
        }
    }

    addPlayer(player: Player): void{
        this.players.push(player);
    }
    
    toJson(): string{
        return JSON.stringify(this.players);
    }
    
    array(): Array<Player>{
        return this.players.slice();
    }
    
    serialize(): string{
        let json: string = "{players:[";
        for(let v of this.players){
            json += v.serialize();
        }
        json += "]}";
        return json;
    }

    getByID(ID: number): Player{
        for(let v of this.players){
            if(v.ID == ID)
                return v;
        }
        return null;
    }

    removePlayer(player: Player): void{
        var index: number = this.players.indexOf(player);
        if (index > -1) {
            this.players.splice(index, 1);
        }
    }
    
    removePlayerByID(ID: number): void{
        $.each(this.players, function(k, v){
            if(v.ID == ID){
                this.players.splice(k, 1);
                return;
            }
        });
    }
}

export class Player {
    nick: string;
    color: number;
    snake: Snake;
    socket;
    ID: number;

    constructor(nick: string, color: number, ID: number) {
        this.nick = nick;
        this.color = color;
        this.ID = ID;
        this.snake = new Snake(3, new SnakePart(20,100));
    }

    getCoords(): Array<SnakePart>{
        return this.snake.coords;
    }
    getSnake(): Snake{
        return this.snake;
    }

    draw (ctx)
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
	    ctx.fillStyle = '#F0F0F0'; // set canvas' background color
	    ctx.fillRect(0, 0, canvas.width, canvas.height);  // now fill the canvas
        ctx.beginPath();
	    ctx.strokeStyle = this.color;
        this.snake.draw(ctx);
    }

    serialize(): string{
        return "{player : {nick : '" + this.nick + "', color : '" + this.color + "', ID : '" + this.ID + "', snake : {coords : " + this.snake.jsonPos() + "}}}";
    }
}

export abstract class Interactor {
    
    constructor(public canvas: HTMLCanvasElement) {
    }
    
    abstract onArrowkeyPressed(movement: Movement): void;
}

export enum Key {
    Left, 
    Up, 
    Right, 
    Down
}
