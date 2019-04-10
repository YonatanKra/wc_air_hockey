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
}

window.customElements.define('air-hockey', AirHockey);

const airHockey = document.createElement('air-hockey');

document.querySelector("#game").appendChild(airHockey);
