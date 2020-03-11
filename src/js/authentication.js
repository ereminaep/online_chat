import { reloadDataBase } from './helpers';
import { loadDataBase } from './helpers';

let users = [];
let messages = [];

window.onload = function() {

    let autorizeForm = document.querySelector('.authorize__form');

    autorizeForm.onsubmit = function(e) {

        e.preventDefault();
        let name = 'noname';
        let nik = 'noname';
        let date = new Date();
        let id = date.getTime();

        let url = 'ws://localhost:8098';

        let socket = new WebSocket(url);

        // отправка сообщения из формы
        let form = document.querySelector('.message');

        form.onsubmit = function(e) {
            let onemessage = {
                'name': name,
                'nik': nik,
                'message': this.message.value,
            }
            e.preventDefault();
            let outgoingMessage = JSON.stringify(onemessage);

            socket.send(outgoingMessage);

            return false;
        };

        socket.onopen = function(event) {
            socket.send(JSON.stringify({
                'type': 'new',
                'name': name,
                'nik': nik
            }));
        }

        // прослушка входящих сообщений
        socket.onmessage = function(event) {

            let incomingMessage = event.data;
            console.log(incomingMessage);
            let nnn = JSON.parse(incomingMessage);
            if (nnn.type == 'user') {
                let messgeElem = document.querySelector('.chat__list');
                messgeElem.innerHTML = '';
                for (let i = 0; i < nnn.items.length; i++) {
                    let chatItem = require('../templates/chatLeftItem.hbs');
                    let item1 = chatItem({ fio: nnn.items[i].name, nik: nnn.items[i].nik });
                    messgeElem.innerHTML = messgeElem.innerHTML + item1;
                }
            } else if (nnn.type == 'new') {
                if (nnn.nik != nik) {
                    let chatItem = require('../templates/chatLeftItem.hbs');
                    let item1 = chatItem({ fio: nnn.name, nik: nnn.nik });
                    let messgeElem = document.querySelector('.chat__list');
                    messgeElem.innerHTML = messgeElem.innerHTML + item1;
                }
            } else if (nnn.type == 'messages') {
                for (let i = 0; i < nnn.items.length; i++) {
                    let messageElem = document.createElement('div');
                    messageElem.textContent = nnn.items[i].message;
                    let window = document.querySelector('.chat__window');
                    let messageTemplate = require('../templates/message.hbs');
                    let messageItem = messageTemplate({ text: nnn.items[i].message, time: '17.55' });
                    window.innerHTML = window.innerHTML + messageItem;
                }

            } else {
                showMessage(incomingMessage);
            }
        };

        socket.onclose = event => console.log(`Closed ${event.code}`);

        // отображение информации в div#messages
        function showMessage(message) {
            let text = JSON.parse(message);

            if ((text.type == 'new') && (text.nik != nik)) {

                users = loadDataBase(users, 'users');

                console.log('Появился новый чел');
                let chatItem = require('../templates/chatLeftItem.hbs');
                let item1 = chatItem({ fio: text.name, nik: text.nik });
                let messgeElem = document.querySelector('.chat__list');
                messgeElem.innerHTML = messgeElem.innerHTML + item1;

            } else {
                let messageElem = document.createElement('div');
                messageElem.textContent = message;
                let window = document.querySelector('.chat__window');
                let messageTemplate = require('../templates/message.hbs');
                let messageItem = messageTemplate({ text: text.message, time: '17.55' });
                window.innerHTML = window.innerHTML + messageItem;
            }
        }

        users = loadDataBase(users, 'users');
        name = document.querySelector('.authorize__input[name="name"]').value;
        nik = document.querySelector('.authorize__input[name="nik"]').value;
        let autorize = document.querySelector('.authorize');
        let chat = document.querySelector('.chat');
        chat.style.display = 'block';
        autorize.style.display = 'none';

        let number = document.querySelector('.chat__number');
        number.textContent = Number(number.textContent) + 1;

    };
}