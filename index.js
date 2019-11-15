var app = require('express')();
const bodyParser = require('body-parser');
const axios = require('axios');


var port = process.env.PORT || 80;

app.use(
	bodyParser.urlencoded({extended: true}
	)
);

app.use(bodyParser.json());


app.get('/', (req, res) => {
	res.send('<h1> Hello World </h2>');
});


function replyMessage(header, data){
	const lineURL = "https://api.line.me/v2/bot/message/reply";
	return axios({
		method: 'post',
		url: lineURL,
		data: data,
		header: header
	});
}


app.get('/webhook', (req, res) => {
	var accessToken = 'Ne2CxLOruuQwUY7ToOUrcPJrIxWikm4u55tu0sZq/uRv3SGxkqhuQisX6nmVUq6KO+BH+i6uggv0lOUCS3cEWLFhE3JDXvxyB9ckcE7HJC5bo1dwYQb3qs9mzs/PrPvTRSjrpcqdI0YOwOhPSbocpAdB04t89/1O/w1cDnyilFU=';
	var content = req.body;
	console.log("content: " + content);
	res.send("ok");
	// var header = {
	// 	'Content-Type': 'application/json',
	// 	'Authorization': 'Bearer ' + accessToken
	// }

	// var body = {
	// 	replyToken: content['events'][0]['replyToken'],
	// 	messages:[{
	// 		type: "text",
	// 		text: "สวัสดีจ้า"
	// 	}]
	// }
	// replyMessage(header, body).then( response => {
	// 	res.send("ok");
	// })
	// .catch( err => {
	// 	res.send(err);
	// })

});


app.listen( port, () => {
	console.log('Starting node.js on port ' + port);
});
