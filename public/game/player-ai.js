/**
 * @name PlayerAI
 * @description expects a ball (has x, y, speedX, speedY and radius) and a player (implements y, speedY, directionY and height)
 */
export class PlayerAI {
    constructor(ball, player, canvas) {
        this.ball = ball;
        this.player = player;
    }

    move(isNearWall) {
        if (this.ball.y < this.player.y && isNearWall <= 0) {
            this.player.directionY = -1;
        } else if ((this.ball.y < this.player.y + this.player.height) && isNearWall >= 0) {
            this.player.directionY = 1;
        } else {
            this.player.directionY = 0;
        }
    }

}