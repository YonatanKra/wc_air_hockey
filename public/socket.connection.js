const socket = io();

class SocketConnection {
    createAGame(gameName = 'home') {
        return new Promise((resolve, reject) => {
           socket.emit('New Game', gameName, (gameDetails) => {
              console.log(gameDetails);
           });
        });
    }
}
