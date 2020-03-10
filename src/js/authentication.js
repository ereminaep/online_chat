window.onload = function() {
    let name = 'noname';
    let nik = 'noname';
    let date = new Date();
    let id = date.getTime();

    let url = 'ws://localhost:8089';

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

    // прослушка входящих сообщений
    socket.onmessage = function(event) {
        let incomingMessage = event.data;
        showMessage(incomingMessage);
    };

    socket.onclose = event => console.log(`Closed ${event.code}`);

    // отображение информации в div#messages
    function showMessage(message) {
        let text = JSON.parse(message);
        console.log(text);
        if ((text.type == 'new') && (text.nik != nik)) {
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

    let autorizeForm = document.querySelector('.authorize__form');
    autorizeForm.onsubmit = function(e) {
        e.preventDefault();
        name = document.querySelector('.authorize__input[name="name"]').value;
        nik = document.querySelector('.authorize__input[name="nik"]').value;
        let autorize = document.querySelector('.authorize');
        let chat = document.querySelector('.chat');
        chat.style.display = 'block';
        autorize.style.display = 'none';

        let chatItem = require('../templates/chatLeftItem.hbs');
        let item1 = chatItem({ fio: name, nik: nik });
        let messgeElem = document.querySelector('.chat__list');
        messgeElem.innerHTML = messgeElem.innerHTML + item1;

        let number = document.querySelector('.chat__number');
        number.textContent = Number(number.textContent) + 1;

        socket.send(JSON.stringify({
            'type': 'new',
            'name': name,
            'nik': nik
        }));
    };
};