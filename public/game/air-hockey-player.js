export class AirHockeyPlayer {
    constructor(color, x, y, height, width) {
        this.color = color ? color : 'red';
        this.x = x ? x : 0;
        this.y = y ? y : 0;
        this.height = Number.isFinite(height) ? height : 50;
        this.width = Number.isFinite(width) ? width : 10;
        this.directionY = 0;
        this.speedY = 2;
    }

    draw(canvas) {

        this.y += this.directionY * this.speedY;

        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}