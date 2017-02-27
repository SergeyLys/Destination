import '../libs/materialize/global';
import '../libs/materialize/velocity';
import '../libs/materialize/scrollspy';

export default {
    /**
     * метод для инициализации модального
     * окна, которое есть на нескольких страницах
     */
    init(){
        this.headerFunctions();
    },

    headerFunctions () {
        $('.scrollspy').scrollSpy();
    }
};