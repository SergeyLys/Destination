import HeaderFunctions from "../modules/headerFunctions";
import Reveal from "../modules/reveal";
import Tabs from '../modules/tabSwitcher';

export default {
    init(){
        HeaderFunctions.init();
        Reveal.init();
        Tabs.init();
    }
};
