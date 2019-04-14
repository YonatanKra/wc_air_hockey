const socket = io();

export class SocketConnection {
    createAGame(gameName = 'home') {
        return new Promise((resolve, reject) => {
           socket.emit('New Game', gameName, (gameDetails) => {
              console.log(gameDetails);
              resolve(gameDetails);
           });
        });
    }

    getGames() {
        return new Promise((resolve, reject) => {
            socket.emit('Get Games', (games) => {
                resolve(games);
            });
        });
    }
}
