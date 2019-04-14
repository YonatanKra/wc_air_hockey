export class HotSeatAirHockey {
    constructor(ball, player, canvas) {
        this.player = player;
        this._canvas = canvas;

        this._canvas.addEventListener('keydown', keyDownHandler.bind(this));
        this._canvas.addEventListener('keyup', keyUpHandler.bind(this));
        function keyDownHandler(e) {

            if (e.key === 's') {
                this.player.directionY = 1;
            } else if (e.key === 'w') {
                this.player.directionY = -1;
            }
        }

        function keyUpHandler(e) {
            if (e.key === 'w' || e.key === 's') {
                this.player.directionY = 0;
            }
        }
    }

    move(){}




}