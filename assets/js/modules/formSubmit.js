export default {
    init() {
        this.formSubmit();
    },

    formSubmit() {

        var actions = {
            "1": 'http://shop.predestination.ru//order/confirm/fe-op-stupen-1-offline/?t=46428#form',
            "2": 'http://shop.predestination.ru/order/confirm/fe-op-stupen-1-offline_LOKOMOTIV/?t=20911#form',
            "3": 'http://shop.predestination.ru/order/confirm/fe-op-stupen-1-offline_LOKOMOTIV_21days/?t=66780#form',
            "4": 'http://shop.predestination.ru/order/confirm/fe-op-stupen-1-offline_LOKOMOTIV_21days_1year/?t=34323#form'
        };


        $('form').each(function() {
            var that = $(this);
            $(this).attr('action', actions[3]);

            $(this).find('select').on('change', function() {
                that.attr('action', actions[$(this).val()]);
            })
        });
    }
}