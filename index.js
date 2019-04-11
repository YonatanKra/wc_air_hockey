const DIMENSIONS = {
    height: 400,
    width: 550,
    goalWidth: 100
};

const PLAYERS_DETAILS = {
    height: 55,
    width: 10,
    rightPlayer: {
        color: '#ff0000',
    },
    leftPlayer: {
        color: '#fff000'
    }
};

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

class AirHockey extends HTMLElement {
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

        this.setGoals();

        this.ball = new AirHockeyBall();
        this.setPlayers();

        this.reset();

        this.render();
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
    }

    setPlayers() {
        function keyDownHandler(e) {
            if (e.key == 'Down' || e.key == 'ArrowDown') {
                this.players.right.directionY = 1;
            } else if (e.key == 'Up' || e.key == 'ArrowUp') {
                this.players.right.directionY = -1;
            }

            if (e.key === 's') {
                this.players.left.directionY = 1;
            } else if (e.key === 'w') {
                this.players.left.directionY = -1;
            }
        }

        function keyUpHandler(e) {
            if (e.key == 'Down' || e.key == 'ArrowDown' || e.key == 'Up' || e.key == 'ArrowUp') {
                this.players.right.directionY = 0;
            }

            if (e.key === 'w' || e.key === 's') {
                this.players.left.directionY = 0;
            }
        }

        this.players.right = new AirHockeyPlayer(PLAYERS_DETAILS.rightPlayer.color, 0, 0, 50, 10);
        this.players.left = new AirHockeyPlayer(PLAYERS_DETAILS.leftPlayer.color, 5, 0, 50, 10);

        this.resetPlayers();

        document.addEventListener('keydown', keyDownHandler.bind(this), false);
        document.addEventListener('keyup', keyUpHandler.bind(this), false);

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

    playerBallCollisionCheck(ball, player) {
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
        }   // right edge

        let distX = ball.x - testX;
        let distY = ball.y - testY;
        let distance = Math.sqrt((distX * distX) + (distY * distY));

        return distance <= ball.radius;
    }

    moveBall() {
        const ball = this.ball;
        let collide = false;

        // collision with a players
        if (this.playerBallCollisionCheck(this.ball, this.players.left) ||
            this.playerBallCollisionCheck(this.ball, this.players.right)) {
            ball.speedX *= -1;
            collide = true;
        }

        if (!collide) {
            // limits
            if (ball.x > this._canvas.width - ball.radius || ball.x < ball.radius) {
                ball.speedX *= -1;
            }

            if (ball.y > this._canvas.height - ball.radius || ball.y < ball.radius) {
                ball.speedY *= -1;
            }
        }

        this.ball.draw(this._canvas);
    }

    movePlayers() {
        this.players.left.draw(this._canvas);
        this.players.right.draw(this._canvas);
    }
}

class AirHockeyBall {

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

class AirHockeyPlayer {
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

window.customElements.define('air-hockey', AirHockey);

const airHockey = document.createElement('air-hockey');

document.querySelector("#game").appendChild(airHockey);
