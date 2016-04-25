"use strict";
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
exports.Players = Players;
var Player = (function () {
    function Player(nick, color) {
        this.nick = nick;
        this.color = color;
    }
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=models.js.map