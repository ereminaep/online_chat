import { formatDate } from './helpers';
import { Chat } from './chat';

let chat = new Chat();

window.onload = function() {

    let [name, nik, date, img] = ['noname', 'noname', new Date(), 'https://today.ua/wp-content/uploads/2019/11/acfc79e81a538cfda851c7a56b622828__1920x-696x696.jpg'];

    let url = 'ws://localhost:8065';
    let socket = new WebSocket(url);

    socket.onmessage = function(event) {

        let nnn = JSON.parse(event.data);
        let window = document.querySelector('.chat__window');
        console.log(nnn);

        if (nnn.type == 'user') {
            chat.messgeElem.innerHTML = '';
            for (let i = 0; i < nnn.items.length; i++) {
                chat.addUser(nnn.items[i].nik, nnn.items[i].img, nnn.items[i].name, chat.messgeElem);
            }

            chat.reCountMessages(nnn.items.length, document.querySelector('.chat__number'));
        } else if (nnn.type == 'messages') {
            window.innerHTML = '';
            for (let i = 0; i < nnn.items.length; i++) {
                chat.addMessage(nnn.items[i].nik, nnn.items[i].date, nnn.items[i].img, nnn.items[i].message, window);
            }
        } else {
            chat.addMessage(nnn.nik, nnn.date, nnn.img, nnn.message, window);
        }
    };

    socket.onclose = event => console.log(`Closed ${event.code}`);

    //загрузка пользователя при авторизации
    chat.autorizeForm.onsubmit = function(e) {
        e.preventDefault();
        name = document.querySelector('.authorize__input[name="name"]').value;
        nik = document.querySelector('.authorize__input[name="nik"]').value;

        [chat.chatBlock.style.display, chat.imageload.style.display, chat.autorize.style.display] = ['block', 'block', 'none'];

        socket.send(JSON.stringify({
            'type': 'new',
            'name': name,
            'img': img,
            'nik': nik
        }));

    };

    // отправка сообщения из формы
    chat.form.onsubmit = function(e) {
        e.preventDefault();
        let onemessage = JSON.stringify({
            'name': name,
            'nik': nik,
            'img': img,
            'date': formatDate(date),
            'message': this.message.value,
        })

        socket.send(onemessage);
        this.message.value = '';
    };

}