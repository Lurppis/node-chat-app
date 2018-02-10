var socket = io();
var params;

function scrollToBottom() {
	// Selectors
	var messages = jQuery('#messages');
	var newMessage = messages.children('li:last-child');
	//Heights
	var clientHight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();

	if (clientHight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		messages.scrollTop(scrollHeight);
	}
}

socket.on('connect', function () {
	params = jQuery.deparam(window.location.search);

	socket.emit('join', params, function (err) {
		if (err) {
			alert(err);
			window.location.href = '/';
		} else {
			console.log('No error');
		}
	});
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
	scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
	var template = jQuery('#location-message-templete').html();
	var formettedTime = moment(message.createdAt).format('h:mm a');
	var html = Mustache.render(template, {
		from: message.name,
		createdAt: formettedTime,
		url: message.url
	});

	jQuery('#messages').append(html);
	scrollToBottom();
});

socket.on('updateUsersList', function (users) {
	var ol = jQuery('<ol></ol>');

	users.forEach(function (user) {
		ol.append(jQuery('<li></li>').text(user));
	});

	jQuery('#users').html(ol);
});

jQuery('#message-form').on('submit', function (event) {
	event.preventDefault();

	var messageTextbox = jQuery('#message');

	socket.emit('createMessage', {
		from: params.name,
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
			from: params.name,
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function () {
		locationButton.removeAttr('disabled').text('Send location');
		alert('Unable to fetch cordinates');
	});
});