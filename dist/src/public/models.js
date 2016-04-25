var Snake = (function () {
    function Snake(nick, color) {
        this.player = new Player(nick, color);
        this.coords = new Array();
    }
    return Snake;
}());
var Players = (function () {
    function Players() {
        this.players = new Array();
    }
    Players.prototype.addPlayer = function (player) {
        this.players.push(player);
    };
    Players.prototype.toJson = function () {
        return JSON.stringify(this.players);
    };
    Players.prototype.array = function () {
        return this.players.slice();
    };
    Players.prototype.removePlayer = function (player) {
        var index = this.players.indexOf(player);
        if (index > -1) {
            this.players.splice(index, 1);
        }
    };
    return Players;
}());
var Player = (function () {
    function Player(nick, color) {
        this.nick = nick;
        this.color = color;
    }
    return Player;
}());
var Interactor = (function () {
    function Interactor(canvas) {
        this.canvas = canvas;
    }
    return Interactor;
}());
var Key;
(function (Key) {
    Key[Key["Left"] = 0] = "Left";
    Key[Key["Up"] = 1] = "Up";
    Key[Key["Right"] = 2] = "Right";
    Key[Key["Down"] = 3] = "Down";
})(Key || (Key = {}));
//# sourceMappingURL=models.js.map