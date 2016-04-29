import {Movement} from "./interaction";
export class SnakePart{
    x: number;
    y: number;

    constructor (x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    posString(): string{
        return this.x + "-" + this.y;
    }

    draw (ctx, color: number):void
    {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.fillRect(this.x,this.y,5,5);
        ctx.stroke();
    }

    drawMeal (ctx):void
    {
        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.fillRect(this.x,this.y,5,5);
        ctx.stroke();
    }

    clear (ctx):void
    {
        ctx.clearRect(this.x, this.y, 5, 5);
        ctx.fillStyle = "#fff";
	    ctx.fillRect(this.x, this.y, 5, 5);
    }
}

export class StartSnakePart extends SnakePart{
    direction:Key;
     constructor (x:number, y:number, direction:Key) {
        super(x,y);
        this.direction = direction;
    }   
}

export class Snake {
    coords: Array<SnakePart>;
    lastKey: number;
    lastKeyValide: number;
    startPoint: SnakePart

    constructor(lenght:number, startPoint?:SnakePart) {
        this.coords = new Array<SnakePart>();
        this.lastKey = Key.Right;
        this.lastKeyValide = this.lastKey;
        if(startPoint != null)
        {
            this.init(lenght, startPoint); 
        }
    }

    init(length:number, startPoint: SnakePart): void
    {
        this.coords.push(startPoint);
        for(let i:number = 1 ; i < length ; i++)
        {
            let point:SnakePart = new SnakePart(startPoint.x-5*i,startPoint.y);
            this.coords.push(point);
        }
    }

    draw (ctx, color: number):void
    {
        this.coords.pop();
        for (let point of this.coords)
        {
            point.draw(ctx, color);
        }
    }

    deserializeCoords(coords: Array<String>): void{
      this.coords = new Array<SnakePart>();
      for(let v of coords){
        let c = v.split("-");
        this.coords.push(new SnakePart(parseInt(c[0]), parseInt(c[1])));
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

    arrayPosNoHead(): Array<string>{
        let arrayPos: Array<string> = new Array<string>();
        let i: number = 0 ;
        for(let v of this.coords){
          if(i++ > 0)
            arrayPos.push(v.posString());
        }
        return arrayPos;
    }

    jsonPos(): string{
        var json: string = "[";
        for(let v of this.coords){
           json += "'"+v.posString()+"',";
        }
        if(json.length > 1)
            json = json.substring(0, json.length - 1) + "]";
        else
        json += "]";
        return json;
    }
}

export class Players {
    players: Array<Player>;
    
    constructor() {
        this.players = new Array<Player>();
    }

    draw (ctx, canvas : HTMLCanvasElement):void
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let player of this.players)
        {
            if(!player.lose)
            {
                player.draw(ctx);    
            }
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
    lose: boolean;
    

    constructor(nick: string, color: number, ID: number, startPoint?: StartSnakePart) {
        this.nick = nick;
        this.color = color;
        this.ID = ID;
        if(startPoint != null)
        {
           this.snake = new Snake(10, startPoint); 
        }
        else{
            this.snake = new Snake(10);
        }
        
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

    draw (ctx):void
    {
        this.snake.draw(ctx, this.color);
    }

    serialize(): string{
        return '{"player" : {"nick" : "' + this.nick + '" , "color" : "' + this.color + '", "ID" : "' + this.ID + '", "lose" : "'+this.lose+'", "snake" : {"coords" : "' + this.snake.jsonPos() + '"}}}';
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
    Down,
    None
}
