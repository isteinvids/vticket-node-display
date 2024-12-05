require('dotenv').config();

const imps = require('../dist/socketio');

const express = require('express')

const app = express();
const io = imps.default;
const server = app.listen(3000);

// start a static server that hosts the files in public/ and also the io server

app.use(express.static('public'));
io.listen(server);

console.log(`Listening on port 3000`);
