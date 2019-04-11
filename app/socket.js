const io = require('socket.io');

module.exports = class Socket {

    constructor(http) {
        this.io = io(http);
        this.setupConnection();
        this.games = {};
    }

    setupConnection() {
        this.io.on('connection',  (socket) => {
            console.log('an user connected');
            socket.on('New Game',  (gameName, ack) => {
                console.log('Creating Game: ', gameName);

                const roomId = gameName + '_' + new Date().getTime();
                socket.join(roomId);
                this.games[roomId] = {
                    name: gameName,
                    admin: socket.id,
                    players: []
                };

                ack('Game Created: ' + gameName);
            });

            socket.on('Get Games', (ack) => {
                ack(this.games);
            });


            socket.on('disconnect', function () {
                // remove from game room
                console.log('user disconnected');
            });
        });
    }
};
