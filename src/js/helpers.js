/* библиотека функций-хэлперов */
function formatDate(time) {

    console.log(time);
    let now = [time.getHours(), time.getMinutes()];

    for (let i = 0; i < now.length; i++) {
        if (now[i] < 10) {
            now[i] = '0' + now[i];
        }
    }

    return now[0] + ':' + now[1];
}

export {
    formatDate,
}