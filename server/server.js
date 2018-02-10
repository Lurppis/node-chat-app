const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validations');
const { Users } = require('./utils/users');

const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

const app = express();

var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {

	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and room name are required');
		}

		socket.join(params.room);
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, params.room);

		io.to(params.room).emit('updateUsersList', users.getUsersList(params.room));

		socket.emit('newMessage', generateMessage('Admin', `Welcome to the chat app in room ${params.room}`));

		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `User ${params.name} joined!`));

		callback();
	});

	socket.on('createMessage', (message, callback) => {
		var user = users.getUser(socket.id);

		if (user && isRealString(message.text)) {
			io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
			callback();
		}
	});

	socket.on('createLocationMessage', (message) => {
		var user = users.getUser(socket.id);

		if (user) {
			io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, message.latitude, message.longitude));
		}
	});

	socket.on('disconnect', () => {
		var user = users.removeUser(socket.id);

		io.to(user.room).emit('updateUsersList', users.getUsersList(user.room));
		io.to(user.room).emit('newMessage', generateMessage('Admin', `User ${user.name} has left the ${user.room} room!`));
	});
});

server.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});