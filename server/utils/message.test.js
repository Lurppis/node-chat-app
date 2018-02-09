const expect = require('expect');

var { generateMessage } = require('./message.js');

describe('Function generate message', () => {
	it('Should generate the correct message object', () => {
		const from = 'Adam';
		const text = 'This is me';
		var message = generateMessage(from, text);

		expect(message.createdAt).toBeA('number');
		expect(message).toInclude({from, text});
	});
});