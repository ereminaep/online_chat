import { reloadDataBase } from './helpers';
import { loadDataBase } from './helpers';

window.onload = function() {

    let autorizeForm = document.querySelector('.authorize__form');

    let name = 'noname';
    let nik = 'noname';
    let date = new Date();
    let id = date.getTime();
    let url = 'ws://localhost:8077';
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
        this.message.value = '';
    };

    // прослушка входящих сообщений
    socket.onmessage = function(event) {

        let incomingMessage = event.data;
        let nnn = JSON.parse(incomingMessage);
        if (nnn.type == 'user') {
            let messgeElem = document.querySelector('.chat__list');
            messgeElem.innerHTML = '';
            for (let i = 0; i < nnn.items.length; i++) {
                let chatItem = require('../templates/chatLeftItem.hbs');
                let item1 = chatItem({ fio: nnn.items[i].name, nik: nnn.items[i].nik });
                messgeElem.innerHTML = messgeElem.innerHTML + item1;
            }
        } else if (nnn.type == 'messages') {
            let window = document.querySelector('.chat__window');
            window.innerHTML = '';
            for (let i = 0; i < nnn.items.length; i++) {
                let messageElem = document.createElement('div');
                messageElem.textContent = nnn.items[i].message;
                let messageTemplate = require('../templates/message.hbs');
                let messageItem = messageTemplate({ text: nnn.items[i].message, time: '17.55' });
                window.innerHTML = window.innerHTML + messageItem;
                let left = document.querySelector('.chat__item[data-nik="' + nnn.items[i].nik + '"]');
                left.querySelector('.chat__text').textContent = nnn.items[i].message;
            }

        } else {
            showMessage(incomingMessage);
        }
    };

    socket.onclose = event => console.log(`Closed ${event.code}`);

    function showMessage(message) {

        let text = JSON.parse(message);

        let messageElem = document.createElement('div');
        messageElem.textContent = message;
        let window = document.querySelector('.chat__window');
        let messageTemplate = require('../templates/message.hbs');
        let messageItem = messageTemplate({ text: text.message, time: '17.55', nik: text.nik });
        window.innerHTML = window.innerHTML + messageItem;
        let left = document.querySelector('.chat__item[data-nik="' + text.nik + '"]');
        left.querySelector('.chat__text').textContent = text.message;
    }

    autorizeForm.onsubmit = function(e) {

        e.preventDefault();
        name = document.querySelector('.authorize__input[name="name"]').value;
        nik = document.querySelector('.authorize__input[name="nik"]').value;
        let autorize = document.querySelector('.authorize');
        let chat = document.querySelector('.chat');
        chat.style.display = 'block';
        autorize.style.display = 'none';

        let number = document.querySelector('.chat__number');
        number.textContent = Number(number.textContent) + 1;

        socket.send(JSON.stringify({
            'type': 'new',
            'name': name,
            'nik': nik
        }));

    };
}