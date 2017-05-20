/* https://github.com/Shin-JaeHeon/Chat */
const port = 80;
const OriginURL = "chat.com";
let WebSocketServer = require('websocket').server;
let cserver = require('http').createServer();
cserver.listen(port, () => {
	console.log("Chat Server Start!");
});
let chat_server = new WebSocketServer({
	httpServer: cserver,
	autoAcceptConnections: false
});
ufw allo
function originIsAllowed(origin) {
	if (origin.indexOf(OriginURL) > -1)
		return true;
	return false;
}
let clients = [];
let idlist = [];
var id = 0;
var nick_list=[];
chat_server.on('request', request => {
	if (!originIsAllowed(request.origin)) {
		request.reject();
		return;
	}
	let connection = request.accept(null, request.origin);
	clients.push(connection);
	idlist[request.key] = id++;
	connection.on('message', message => {
		let data = JSON.parse(message.utf8Data);
		switch (data.type) {
			case 'join':
				sendMsg({
					'type': 'join',
					'msg': data.msg
				});
				break;
			case 'msg':
				sendMsg({
					'nick': data.nick,
					'msg': data.msg,
					'time': data.time,
					'type': 'text'
				});
				break;
			case 'reply':
				sendMsg({
					'nick': data.nick,
					'msg': data.msg,
					'time': data.time,
					'reply':data.reply,
					'type': 'reply-text',
					'reply-nick':data['reply-nick']
				});
				break;
		}
	});
});

function sendMsg(smsg) {
	clients.forEach((cli) => {
		cli.sendUTF(JSON.stringify(smsg));
	});
}
