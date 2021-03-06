import {AirHockeyBall} from "./air-hockey-ball.js";
import {AirHockeyPlayer} from "./air-hockey-player.js";
import {DIMENSIONS, PLAYERS_DETAILS} from "./consts.js";
import {PlayerAI} from "./player-ai.js";

const template = document.createElement('template');
const templateString = `
<style>
    canvas {
        background-color: darkslategray;
    }
</style>
<canvas height="${DIMENSIONS.height}" width="${DIMENSIONS.width}"></canvas>
`;
template.innerHTML = templateString;

export class AirHockey extends HTMLElement {
    _canvas;
    ball;
    players = {
        right: null,
        left: null
    };

    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this._canvas = this.shadowRoot.querySelector('canvas');
        this._canvas.setAttribute('tabindex', 1);

        this.setGoals();

        this.ball = new AirHockeyBall();

        this.setPlayers();

        this.reset();

        this.render();
    }

    setOpponentHandler(opponentHandler) {
        this.opponentHandler = opponentHandler ? opponentHandler : new PlayerAI(this.ball, this.players.left, this._canvas);
    }

    setGoals() {
        const midHeight = this._canvas.height / 2;
        const midGoal = DIMENSIONS.goalWidth / 2;
        const ctx = this._canvas.getContext('2d');
        ctx.beginPath();
        ctx.rect(0, midHeight - midGoal, 5, DIMENSIONS.goalWidth);
        ctx.strokeStyle = PLAYERS_DETAILS.leftPlayer.color;
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(this._canvas.width - 5, midHeight - midGoal, 5, DIMENSIONS.goalWidth);
        ctx.strokeStyle = PLAYERS_DETAILS.rightPlayer.color;
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * @description checks which side scored. 1 means a goal was scored to the right, -1 to the left and 0 no goal
     * @returns {number}
     */
    isGoal() {
        // goal checker
        const ball = this.ball;
        const width = this._canvas.width;
        const height = this._canvas.height;

        const scored = ball.x > width - ball.radius ? 1 : ball.x < ball.radius ? -1 : 0;
        if (scored &&
            (ball.y > -DIMENSIONS.goalWidth / 2 + height / 2 && ball.y < DIMENSIONS.goalWidth / 2 + height / 2)) {
            alert('GOAL!!!');
            return scored;
        }

        return 0;
    }

    reset() {
        const width = this._canvas.width;
        const height = this._canvas.height;
        this.ball.x = width / 2;
        this.ball.y = height - Math.round(Math.random() * (height / 2));

        this.resetPlayers();
    }

    resetPlayers() {
        const y = this._canvas.height / 2 - PLAYERS_DETAILS.height / 2;
        this.players.right.x = this._canvas.width - 20;
        this.players.left.x = 10;
        this.players.right.y = this.players.left.y = y;
        this.players.left.height = this.players.right.height = PLAYERS_DETAILS.height;
    }

    setPlayers() {
        function keyDownHandler(e) {
            if (e.key === 'Down' || e.key === 'ArrowDown') {
                this.players.right.directionY = 1;
            } else if (e.key === 'Up' || e.key === 'ArrowUp') {
                this.players.right.directionY = -1;
            }
        }

        function keyUpHandler(e) {
            if (e.key === 'Down' || e.key === 'ArrowDown' || e.key === 'Up' || e.key === 'ArrowUp') {
                this.players.right.directionY = 0;
            }
        }

        this.players.right = new AirHockeyPlayer(PLAYERS_DETAILS.rightPlayer.color, 0, 0, 50, 10);
        this.players.left = new AirHockeyPlayer(PLAYERS_DETAILS.leftPlayer.color, 5, 0, 50, 10);

        this.resetPlayers();

        this._canvas.addEventListener('keydown', keyDownHandler.bind(this), false);
        this._canvas.addEventListener('keyup', keyUpHandler.bind(this), false);
    }

    render() {
        const ctx = this._canvas.getContext('2d');
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this.setGoals();
        this.moveBall();
        this.movePlayers();
        if (this.isGoal()) {
            this.reset();
        }
        window.requestAnimationFrame(() => this.render());
    }

    static playerBallCollisionCheck(ball, player) {
        let testX = ball.x;
        let testY = ball.y;

        if (ball.x < player.x) {
            testX = player.x;
        } else if (ball.x > player.x + player.width) {
            testX = player.x + player.width;
        }
        if (ball.y < player.y) {
            testY = player.y;
        } else if (ball.y > player.y + player.height) {
            testY = player.y + player.height;
        }

        let distX = ball.x - testX;
        let distY = ball.y - testY;
        let distance = Math.sqrt((distX * distX) + (distY * distY));

        return distance <= ball.radius;
    }

    /**
     * @description checks if player's position is at the top or bottom.
     * @param player <AirHockeyPlayer>
     * @returns {number} - 0 no, 1 bottom, -1 top
     */
    playerWallCollisionCheck(player) {
        // limits
        if ((player.y + player.height > this._canvas.height && player.directionY >= 0) ||
            (player.directionY < 0 && player.y <= 0)) {
            player.directionY = 0;
            return player.y + player.height > this._canvas.height ? -1 : 1;
        }

        return 0;
    }

    ballWallCollisionCheck(ball) {
        // limits
        if (ball.x > this._canvas.width - ball.radius || ball.x < ball.radius) {
            ball.speedX *= -1;
        }

        if (ball.y > this._canvas.height - ball.radius || ball.y < ball.radius) {
            ball.speedY *= -1;
        }
    }

    moveBall() {
        const ball = this.ball;
        let collide = false;

        // collision with a players
        if (AirHockey.playerBallCollisionCheck(this.ball, this.players.left) ||
            AirHockey.playerBallCollisionCheck(this.ball, this.players.right)) {
            ball.speedX *= -1;
            collide = true;
        }

        if (!collide) {
            this.ballWallCollisionCheck(this.ball);
        }

        this.ball.draw(this._canvas);
    }

    movePlayers() {

        this.playerWallCollisionCheck(this.players.right);
        if (this.opponentHandler) {
            this.opponentHandler.move(this.playerWallCollisionCheck(this.players.left));
        }
        this.players.left.draw(this._canvas);
        this.players.right.draw(this._canvas);
    }
}



window.customElements.define('air-hockey', AirHockey);