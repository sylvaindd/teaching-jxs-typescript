import {Movement} from "./interaction";

export class SnakePart{
    x: number;
    y: number;
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }
}

export class Snake {
<<<<<<< HEAD
    coords: Array<SnakePart>;
=======
    coords: Array<number | number>;
    lastKey: number;
>>>>>>> 98c299a4cf1ffc661c830fc318687b7e4b3c4a36

constructor(lenght:number) {
        this.coords = new Array();
    init(lenght);
    }

    init(lenght:number, startPoint: SnakePart)
    {
        this.push()
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
    
    removePlayer(player: Player): void{
        var index: number = this.players.indexOf(player);
        if (index > -1) {
            this.players.splice(index, 1);
        }
    }
    
}

export class Player {
    nick: string;
    color: number;
    snake: Snake;
    
    constructor(nick: string, color: number) {
        this.nick = nick;
        this.color = color;
        this.snake = new Snake();
    }

    getCoords(): Array<number | number>{
        return this.snake.coords;
    }
}

export abstract class Interactor {
    
    constructor(public canvas) {
    }
    
    abstract onArrowkeyPressed(movement: Movement): void;
}

export enum Key {
    Left, 
    Up, 
    Right, 
    Down
}
