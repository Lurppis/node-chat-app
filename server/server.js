const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validations');

const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

const app = express();

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {

	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			callback('Name and room name are required');
		}

		socket.join(params.room);

		socket.emit('newMessage', generateMessage('Admin', `Welcome to the chat app in room ${params.room}`));

		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `User ${params.name} joined!`));

		callback();
	});

	socket.on('createMessage', (message, callback) => {
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback();
	});

	socket.on('createLocationMessage', (coords) => {
		io.emit('newLocationMessage', generateLocationMessage('User', coords.latitude, coords.longitude));
	});
});

server.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});