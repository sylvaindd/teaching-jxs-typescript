var Movement = (function () {
    function Movement(canvas, interactor) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.interactor = interactor;
        $(canvas).keydown(this.arrowKeysPressed.bind(this));
    }
    Movement.prototype.arrowKeysPressed = function (e) {
        switch (e.which) {
            case 37:
                this.key = Key.Left;
                break;
            case 38:
                this.key = Key.Up;
                break;
            case 39:
                this.key = Key.Right;
                break;
            case 40:
                this.key = Key.Down;
                break;
            default: return;
        }
        e.preventDefault();
        this.interactor.onArrowkeyPressed(this);
        console.log("Key press : " + this.key);
    };
    return Movement;
}());
//# sourceMappingURL=interaction.js.map