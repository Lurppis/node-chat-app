const moment = require('moment');

var createdAt = 1234;

var date = moment(createdAt);

console.log(date.format('MMMM Do YYYY, h:mm:ss a'));