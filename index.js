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
