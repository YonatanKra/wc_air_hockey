import {SocketConnection} from "./multiPlayer/socket.connection.js";

const socketConnection = new SocketConnection();
const promises = [socketConnection.createAGame('test'),
    socketConnection.createAGame('test2')];
Promise.all(promises).then(res => {
    socketConnection.getGames().then(console.log);
});