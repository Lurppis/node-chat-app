var socket = io();

socket.on('connect', function () {
	console.log('Conneted to server.');

	socket.emit('createMessage', {
		from: 'Client',
		text: 'text'
	});
});
socket.on('disconnect', function () {
	console.log('Disconected from server.');
});

socket.on('newMessage', function (message) {
	console.log('newMessage' + JSON.stringify(message));
});