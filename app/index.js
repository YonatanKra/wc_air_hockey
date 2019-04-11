const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
const Socket = require('./socket');

const http = require('http').Server(app);
const socket = new Socket(http);

app.use(express.static('public'));
app.use('/socket.js', express.static('node_modules/socket.io-client/dist/socket.io.js'));
http.listen(port, function () {
    console.log('listening on *:3000');
});


