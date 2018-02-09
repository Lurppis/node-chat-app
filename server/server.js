const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');

const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

const app = express();

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

	socket.broadcast.emit('newMessage',generateMessage('Admin', 'New user joined'));

	socket.on('createMessage', (message) => {
		io.emit('newMessage', generateMessage(message.from, message.text));
	});
});

server.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});