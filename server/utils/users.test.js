const expect = require('expect');

const { Users } = require('./users');

describe('Users', () => {
	it('Should add new user', () => {
		var users = new Users();
		var user = {id:  1234, name: 'Marcin', room: 'The best'};

		users.addUser(user.id, user.name, user.room);

		expect(users.users).toEqual([user]);
	});
});