import HOME from "./pages/HOME";

let init = null;

switch (global.vars.page) {
    case 'home_page':
        init = HOME.init.bind(HOME);
        break;
    default:
        init = () => {
            console.log('default init');
        };
}

$(document).ready(init());

$(window).on('scroll', function() {
    
    if ($('.first-section').length != 0) {
        let ws = $(window).scrollTop(),
            st = $('.site-header').offset().top;

        if (ws >= st) {
            $('.site-nav').addClass('fixed');
        } else {
            $('.site-nav').removeClass('fixed');
        }
    }
});