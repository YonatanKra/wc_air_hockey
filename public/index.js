import {SocketConnection} from "./multiPlayer/socket.connection.js";
import {AirHockey} from './game/air-hockey.js';
import {HotSeatAirHockey} from "./multiPlayer/hot-seat.js";

const socketConnection = new SocketConnection();
const promises = [socketConnection.createAGame('test'),
                    socketConnection.createAGame('test2')];
Promise.all(promises).then(res => {
   socketConnection.getGames().then(console.log);
});

const airHockey = document.createElement('air-hockey');

airHockey.setOpponentHandler(new HotSeatAirHockey(airHockey.ball, airHockey.players.left, airHockey._canvas));

document.querySelector("#game").appendChild(airHockey);
