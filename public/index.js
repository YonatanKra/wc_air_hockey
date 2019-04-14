import {SocketConnection} from "./multiPlayer/socket.connection.js";
import {AirHockey} from './game/air-hockey.js';

const socketConnection = new SocketConnection();
const promises = [socketConnection.createAGame('test'),
                    socketConnection.createAGame('test2')];
Promise.all(promises).then(res => {
   socketConnection.getGames().then(console.log);
});

const airHockey = document.createElement('air-hockey');

document.querySelector("#game").appendChild(airHockey);
