Snake.prototype.draw = function(ctx){
    for (point of this.coords)
    {
        point.draw(ctx);
    }
}

SnakePart.prototype.draw = function(ctx){
    ctx.lineWidth = 5;
    ctx.fillRect(this.x,this.y,5,5);
    ctx.stroke();
}

Player.prototype.draw = function(ctx){
    ctx.beginPath();
	ctx.strokeStyle = this.color;
    this.snake.draw(ctx);
}
