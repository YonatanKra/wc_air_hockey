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
    }
}

window.customElements.define('air-hockey', AirHockey);

const airHockey = document.createElement('air-hockey');

document.querySelector("#game").appendChild(airHockey);
