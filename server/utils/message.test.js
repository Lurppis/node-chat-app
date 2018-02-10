const expect = require('expect');

var { generateMessage, generateLocationMessage } = require('./message.js');

describe('Function generate message', () => {
	it('Should generate the correct message object', () => {
		const from = 'Adam';
		const text = 'This is me';
		var message = generateMessage(from, text);

		expect(message.createdAt).toBeA('number');
		expect(message).toInclude({from, text});
	});
});

describe('Function generate location message', () => {
	it('Should generate the correct location message object', () => {
		const from = 'Adam';
		const latitude = 15;
		const longitude = 20;
		var message = generateLocationMessage(from, latitude, longitude);

		var expectedUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

		expect(message.createdAt).toBeA('number');
		expect(message.url).toContain(expectedUrl);
	});
});