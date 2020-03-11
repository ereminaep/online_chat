var WebSocketServer = new require('ws');

// подключённые клиенты
var clients = {};
let users = {
    type: 'user',
    items: [],
};

let messages = {
    type: 'messages',
    items: [],
};

// WebSocket-сервер на порту 8081
var webSocketServer = new WebSocketServer.Server({
    port: 8098
});
webSocketServer.on('connection', function(ws) {

    var id = Math.random();
    clients[id] = ws;

    console.log("новое соединение " + id);

    ws.on('message', function(message) {

        console.log('получено сообщение ' + message);

        let mes = JSON.parse(message);

        /* если приходит сообщение с пометкой new - значит у нас новое соединение, отправляем ему архив юзеров и сообщений*/

        if (mes.type == 'new') {
            users.items.push({ nik: mes.nik, name: mes.name, id: id });
            ws.send(JSON.stringify(users));
            ws.send(JSON.stringify(messages));
        } else {
            messages.items.push(mes);
            for (var key in clients) {
                clients[key].send(message);
            }
        }

    });

    ws.on('close', function() {
        console.log('соединение закрыто ' + id);
        delete clients[id];
        for (let i = 0; i < users.items.length; i++) {
            if (users.items[i]['id'] == id) {
                console.log(users.items[i]);
            }
        }
        ws.send(JSON.stringify(users));

    });

});