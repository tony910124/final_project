var path = require('path');

module.exports = {
	entry: './js/input/script.js',
	output: {
		path: path.join(__dirname, './js/output'),
		filename: 'script.js'
	}
}