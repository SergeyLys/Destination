import GLOBAL from "./modules/global";
import HOME from "./modules/HOME";
import ABOUT from "./modules/ABOUT";
/**
 * Создаем функцию init, которая
 * будет вызываться в любом случае
 */
let init = null;
/**
 * Перебираем window.vars.page,
 * чтобы выяснить, какая у нас страница
 */
switch (global.vars.page) {
    case 'home_page':
        init = HOME.init.bind(HOME);
        break;
    case 'about_page':
    case 'contact_page':
        init = ABOUT.init.bind(ABOUT);
        break;
    default:
        init = () => {
            console.log('default init');
        };
}
/**
 * Вешаем на document.onready нашу инициализацию страницы
 */
$(document).ready(GLOBAL.init(), init());