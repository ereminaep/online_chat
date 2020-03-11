/* библиотека функций-хэлперов */

/* загрузить из localStorage данные с ключом item */
function loadDataBase(data, item) {

    if (localStorage.getItem(item) != null) {
        data = JSON.parse(localStorage.getItem(item));
    } else {
        data = [];
    }
    return data;
}

/* обновить либо пополнить хранилище localStorage данными item */
function reloadDataBase(item, data, key) {
    data.push(item);
    localStorage.setItem(key, JSON.stringify(data));
}

export {
    loadDataBase,
    reloadDataBase
}