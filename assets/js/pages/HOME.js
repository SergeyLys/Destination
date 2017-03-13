import HeaderFunctions from "../modules/headerFunctions";
import Reveal from "../modules/reveal";
import Tabs from '../modules/tabSwitcher';
import Sliders from '../modules/sliders';
import Testimonials from '../modules/testimonials';

export default {
    init(){
        HeaderFunctions.init();
        Reveal.init();
        Tabs.init();
        Sliders.init();
        Testimonials.init();
    }
};