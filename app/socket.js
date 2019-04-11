const io = require('socket.io');

module.exports = class Socket {
    constructor(http) {
        this.io = io(http);
        this.setupConnection();
    }

    setupConnection() {
        this.io.on('connection', function (socket) {
            console.log('an user connected');
            socket.on('New Game', function (gameName, ack) {
                console.log('gameName: ', gameName);
                ack('Game Creation Stub for ' + gameName);
            });
            socket.on('disconnect', function () {
                console.log('user disconnected');
            });
        });
    }
};
