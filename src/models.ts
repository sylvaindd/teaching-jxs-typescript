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

    constructor(nick: string, color: number) {
        this.nick = nick;
        this.color = color;
    }
}
