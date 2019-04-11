const port = process.env.PORT || 3000;
const express = require('express');
const app = express();

app.use(express.static('public'));
app.use('/socket.js', express.static('node_modules/socket.io-client/dist/socket.io.js'));
app.listen(port);
