const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');

const app = express();
app.use(express.static(publicPath));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});