const DIMENSIONS = {
    height: 400,
    width: 550,
    goalWidth: 100
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

class AirHockey extends HTMLElement{
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

        this.render();
    }

    setGoals() {
        const midHeight = this._canvas.height / 2;
        const midGoal = DIMENSIONS.goalWidth / 2;
        const ctx = this._canvas.getContext('2d');
        ctx.beginPath();
        ctx.rect(0, midHeight - midGoal, 5, DIMENSIONS.goalWidth);
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(this._canvas.width - 5, midHeight - midGoal, 5, DIMENSIONS.goalWidth);
        ctx.strokeStyle = '#fff000';
        ctx.stroke();
        ctx.closePath();
    }
    render() {
        const ctx = this._canvas.getContext('2d');
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this.setGoals();
        this.moveBall();
        window.requestAnimationFrame(() => this.render());
    }

    moveBall() {

        this.ball.draw(this._canvas);
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
window.customElements.define('air-hockey', AirHockey);

const airHockey = document.createElement('air-hockey');

document.querySelector("#game").appendChild(airHockey);
