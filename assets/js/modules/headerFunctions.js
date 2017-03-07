import '../libs/materialize/global';
import '../libs/materialize/velocity';
import '../libs/materialize/jquery.easing.1.3';
import '../libs/materialize/scrollspy';
import '../libs/materialize/tabs';

export default {

    init(){
        this.headerFunctions();
    },

    headerFunctions () {
        $('.scrollspy').scrollSpy({
            scrollOffset: 0
        });
    }
};