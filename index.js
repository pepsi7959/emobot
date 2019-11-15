var app = require('express')();
var port = process.env.PORT || 80;


app.get('/', (req, res) => {
	res.send('<h1> Hello World </h2>');
});

app.listen( port, () => {
	console.log('Starting node.js on port ' + port);
});
