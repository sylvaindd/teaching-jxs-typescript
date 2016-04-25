var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Game = (function (_super) {
    __extends(Game, _super);
    function Game(canvas) {
        _super.call(this, canvas);
        this.players = new Array();
    }
    Game.prototype.onArrowkeyPressed = function (movement) {
        movement.key;
    };
    return Game;
}(Interactor));
//# sourceMappingURL=controller.js.map