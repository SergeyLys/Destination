import '../libs/materialize/global';
import '../libs/materialize/velocity';
import '../libs/materialize/jquery.easing.1.3';
import '../libs/materialize/scrollspy';
import '../libs/materialize/tabs';
// import '../libs/materialize/waves';

export default {

    init(){
        this.headerFunctions();
    },

    headerFunctions () {
        $('.scrollspy').scrollSpy({
            scrollOffset: 0
        });

        $('.menu-button').on('click', function () {
            $(this).find('.sandwich').toggleClass('active');
            $('.site-nav').toggleClass('active');
        });

        $('.site-nav').on('click', function () {
            $('.sandwich').removeClass('active');
            $(this).removeClass('active');
        });
    }
};