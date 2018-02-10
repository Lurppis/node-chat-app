var socket = io();

socket.on('connect', function () {
	console.log('Conneted to server.');
});
socket.on('disconnect', function () {
	console.log('Disconected from server.');
});

socket.on('newMessage', function (message) {
	var template = jQuery('#message-templete').html();
	var formettedTime = moment(message.createdAt).format('h:mm a');
	var html = Mustache.render(template, {
		from: message.from,
		text: message.text,
		createdAt: formettedTime
	});

	jQuery('#messages').append(html);
});

socket.on('newLocationMessage', function (message) {
	var template = jQuery('#location-message-templete').html();
	var formettedTime = moment(message.createdAt).format('h:mm a');
	var html = Mustache.render(template, {
		from: message.from,
		createdAt: formettedTime,
		url: message.url
	});

	jQuery('#messages').append(html);
});

jQuery('#message-form').on('submit', function (event) {
	event.preventDefault();

	var messageTextbox = jQuery('#message');

	socket.emit('createMessage', {
		from: 'User',
		text: messageTextbox.val()
	}, function () {
		messageTextbox.val('');
	});
});

var locationButton = jQuery('#message-location');

locationButton.on('click', function () {
	if (!navigator.geolocation) {
		return alert('Your browser not supported geolocation');
	}

	locationButton.attr('disabled', 'disabled').text('Sending location...');

	navigator.geolocation.getCurrentPosition(function (position) {
		locationButton.removeAttr('disabled').text('Send location');
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function () {
		locationButton.removeAttr('disabled').text('Send location');
		alert('Unable to fetch cordinates');
	});
});