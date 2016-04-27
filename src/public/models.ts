import {Movement} from "./interaction";

export class SnakePart{
    x: number;
    y: number;

    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    posString(): string{
        return this.x + "-" + this.y;
    }

    draw (ctx, color: number)
    {
        ctx.beginPath();
        ctx.fillStyle = color;
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

    init(lenght:number, startPoint: SnakePart): void
    {
        this.lastKey = Key.Right;
        this.coords.push(startPoint);
        for(let i:number = 1 ; i < lenght ; i++)
        {
            let point:SnakePart = new SnakePart(startPoint.x-5*i,startPoint.y);
            this.coords.push(point);
        }
    }

    draw (ctx, color: number)
    {
        let lastPoint:SnakePart = this.coords.pop();
        ctx.clearRect(lastPoint.x, lastPoint.y, 5, 5);
        ctx.fillStyle = "#fff";
	    ctx.fillRect(lastPoint.x, lastPoint.y, 5, 5);
        for (let point of this.coords)
        {
            point.draw(ctx, color);
        }
    }

    deserializeCoords(coords: Array<String>): void{
      this.coords = new Array<SnakePart>();
      for(let v of coords){
        let c = v.split("-");
        this.coords.push(new SnakePart(c[0], c[1]));
      }
    }

    getHead(): SnakePart{
        return this.coords[0];
    }

    getHeadPos(): string{
        return this.coords[0].posString();
    }

    arrayPos(): Array<string>{
        var arrayPos = new Array<string>();

        for(let v of this.coords){
            arrayPos.push(v.posString());
        }
        return arrayPos;
    }

    jsonPos(): string{
        var json: string = "[";
        for(let v of this.coords){
           json += "'"+v.posString()+"',";
        }
        json = json.substring(0, json.length - 1) + "]";
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

    init(): void{
      for(let v of this.players){
        v.init();
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
        let json: string = "{\"players\":[";
        for(let v of this.players){
            json += v.serialize() + ",";
        }
        json = json.substring(0, json.length - 1) + "]}";
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
      for(let i = 0; i < this.players.length; i++){
        let v = this.players[i];
        if(v.ID == ID){
            this.players.splice(i, 1);
            return;
        }
      }
    }
}

export class Player {
    nick: string;
    color: number;
    snake: Snake;
    socket;
    ID: number;
    startPoints: Array<SnakePart>;

    constructor(nick: string, color: number, ID: number) {
        this.nick = nick;
        this.color = color;
        this.ID = ID;
        this.generateStartPoints();
        this.snake = new Snake(5, this.startPoints[this.ID]);
    }

    generateStartPoints()
    {
        this.startPoints = new Array<SnakePart>();
        let point1: SnakePart = new SnakePart(100,100);
        this.startPoints.push(point1);
        let point2: SnakePart = new SnakePart(100,300);
        this.startPoints.push(point2);
        let point3: SnakePart = new SnakePart(300,100);
        this.startPoints.push(point3);
        let point4: SnakePart = new SnakePart(300,300);
        this.startPoints.push(point4);
    }

    init(): void{
      this.snake = new Snake(5, this.startPoints[this.ID]);
    }

    getCoords(): Array<SnakePart>{
        return this.snake.coords;
    }

    deserializeCoords(coords: Array<String>): void{
      this.snake.deserializeCoords(coords);
    }

    getSnake(): Snake{
        return this.snake;
    }

    draw (ctx)
    {
        this.snake.draw(ctx, this.color);
    }

    serialize(): string{
        return '{"player" : {"nick" : "' + this.nick + '" , "color" : "' + this.color + '", "ID" : "' + this.ID + '", "snake" : {"coords" : "' + this.snake.jsonPos() + '"}}}';
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
