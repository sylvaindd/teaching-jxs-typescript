/// <reference path="../../declarations/jquery.d.ts" />

class Game extends Interactor {
    players: Array<Player>;
    
    constructor(canvas) {
        super(canvas);
        this.players = new Array();
    }
    
    
    onArrowkeyPressed(movement: Movement): void{
        movement.key
	}
}