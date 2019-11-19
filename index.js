var app = require('express')();
const bodyParser = require('body-parser');
const axios = require('axios');

const appConf = require("./config/production.conf");
const MongoClient = require('mongodb').MongoClient


var port = process.env.PORT || 80;

app.use(
	bodyParser.urlencoded({extended: true}
	)
);

app.use(bodyParser.json());


app.get('/', (req, res) => {
	res.send('Wellcome to emobot!!!');
});

function keepHistory( context ){
	MongoClient.connect(appConf.MONGODB_connect, { useNewUrlParser: true })
	.then( conn => {
		console.log("successfully connected MongoDB");
		var data = {
			userId: context.events[0].source.userId,
			timestamp: context.events[0].timestamp,
			data: context.events
		}
		conn.db(appConf.db).collection("history").insertOne(data, (err, res) => {
			console.log("insert data to mongodb completely");
		})
	})
	.catch( err => {
		console.log(err);
	})
}

function replyMessage(headers, data){
	const lineURL = "https://api.line.me/v2/bot/message/reply";
	console.log( 'header: ' + JSON.stringify(headers));
	console.log( 'body: ' + JSON.stringify(data));
	return axios({
		method: 'post',
		url: lineURL,
		data: data,
		headers: headers
	});
}

/**
 * Example connext
 * 
 * {
    "events": [
        {
            "type": "message",
            "replyToken": "18ebb89776474fdd97ebff7253a9b1d6",
            "source": {
                "userId": "U4ac2199d0b10026a8f53df6e60f2092c",
                "type": "user"
            },
            "timestamp": 1574156431096,
            "message": {
                "type": "text",
                "id": "10943754364100",
                "text": "Hi"
            }
        }
    ],
    "destination": "Uca75abc1b4764b7cf272c1613221de03"
}
 * 
 */

function processContext( context ){
	keepHistory( context );

	if( context.events ){
		const replyToken = context.events[0].replyToken;
		var text = "";
		switch( context.events[0].message.type ){
			case "text":
				text = "คุณถามว่า " + context.events[0].message.text;
				break;
			default: 
				text = "ฉันไม่เข้าใจสิ่งที่คุณส่งมา";
				break;
		}

		var replyMsg = {
			replyToken: replyToken,
			messages:[{
				type: "text",
				text: text
			}]
		}

		return replyMsg;
	}

	return undefined;
}

app.post('/webhook', (req, res) => {
	var accessToken = 'Ne2CxLOruuQwUY7ToOUrcPJrIxWikm4u55tu0sZq/uRv3SGxkqhuQisX6nmVUq6KO+BH+i6uggv0lOUCS3cEWLFhE3JDXvxyB9ckcE7HJC5bo1dwYQb3qs9mzs/PrPvTRSjrpcqdI0YOwOhPSbocpAdB04t89/1O/w1cDnyilFU=';
	var content = req.body;
	
	console.log("content: " + JSON.stringify(content));

	var headers = {
		'Content-Type': 'application/json',
		'Authorization': 'Bearer ' + accessToken
	}

	var replyMsg = processContext( content );

	if( replyMsg ) {
		console.log("emobot answer: " + JSON.stringify(replyMsg) );
		replyMessage(headers, replyMsg).then( response => {
			res.send("ok");
			console.log("success");
		})
		.catch( err => {
			res.send(err);
			console.log('err: ' + err);
		})
	}else{
		console.error("Cannot process the context");
	}
	
});

app.listen( port, () => {
	console.log('Starting node.js on port ' + port);
});
