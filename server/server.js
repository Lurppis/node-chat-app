const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

const app = express();

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connceted: ' + socket.client.id);
	socket.on('disconnect', () => {
		console.log(`User ${socket.client.id} disconect from server.`);
	});

	socket.on('createMessage', (message) => {
		console.log('createMessage', message);
	});

	socket.emit('newMessage', {
		from: 'Server',
		text: 'Hej',
		createdAt: 123123
	});
});

server.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});