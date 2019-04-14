export class AirHockeyBall {

    constructor(x, y, radius, speedX, speedY) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
        this.radius = Number.isFinite(radius) ? radius : 10;
        this.speedX = Number.isFinite(speedX) ? speedX : 2;
        this.speedY = Number.isFinite(speedY) ? speedY : -2;
    }

    draw(canvas, advance) {
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();

        if (advance !== false) {
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }
}