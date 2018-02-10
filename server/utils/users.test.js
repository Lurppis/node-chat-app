const expect = require('expect');

const { Users } = require('./users');

describe('Users', () => {
	var users;
	beforeEach(() => {
		users = new Users();
		users.users = [{
			id: '1',
			name: 'Mike',
			room: 'Node'
		}, {
			id: '2',
			name: 'Jan',
			room: 'react'
		}, {
			id: '3',
			name: 'Lucifer',
			room: 'Node'
		}];
	});

	it('Should add new user', () => {
		var users = new Users();
		var user = {id:  1234, name: 'Marcin', room: 'The best'};

		users.addUser(user.id, user.name, user.room);

		expect(users.users).toEqual([user]);
	});

	it('Should remove user', () => {
		var id = '2';
		var user = users.removeUser(id);
		expect(user).toExist();
		expect(user.id).toBe('2');
		expect(user.name).toBe('Jan');

		expect(users.users.length).toBe(2);
	});

	it('Should not remove user', () => {
		var id = '123';
		var user = users.removeUser(id);
		expect(user).toNotExist();

		expect(users.users.length).toBe(3);
	});

	it('Should find user', () => {
		var id = '2';
		var user = users.getUser(id);

		expect(user.id).toBe('2');
	});

	it('Should not find user', () => {
		var id = '123';
		var user = users.getUser(id);

		expect(user).toNotExist();
	});

	it('Should return only names of node course', () => {
		var usersName = users.getUsersList('Node');
		expect(usersName).toEqual(['Mike', 'Lucifer']);
	});

	it('Should return only names of react course', () => {
		var usersName = users.getUsersList('react');
		expect(usersName).toEqual(['Jan']);
	});
});