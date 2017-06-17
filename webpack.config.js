var path = require('path');

module.exports = {
	entry: './js/scripts/script.js',
	output: {
		path: path.join(__dirname, './js/output'),
		filename: 'script.js'
	}
}