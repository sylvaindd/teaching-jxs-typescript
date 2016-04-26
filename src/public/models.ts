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

    getHead(): SnakePart{
        return this.coords[0];
    }

    arrayPos(): Array<string>{
        var arrayPos = new Array<string>();
        $.each(this.coords, function(k, v){
            arrayPos.push(v.pos());
        });
        return arrayPos;
    }
}

export class Players {
    players: Array<Player>;
    
    constructor() {
        this.players = new Array<Player>();
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
    
    getByID(ID: number){
        $.each(this.players, function(k, v){
            if(v.ID == ID)
                return v;
        });
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
        this.snake = new Snake(3, new SnakePart(20,5));
    }

    getCoords(): Array<SnakePart>{
        return this.snake.coords;
    }
    getSnake() : Snake{
        return this.snake;
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
