export default {
    init() {
        this.tabSwitcher();
    },

    tabSwitcher() {
        let activeTab = $('.tab-links a.active').attr('href');

        if ($(activeTab).length) {
            $('.tab-content').find(`${activeTab}`).addClass('active');
        }

        $('.tab-links a').on('click', function(e) {
            e.preventDefault();

            let anchor = $(this).attr('href');

            if ($(anchor).length) {
                $('.tab-content').find('.tab-item').removeClass('active');

                setTimeout(function() {
                    $(anchor).addClass('active');
                }, 300);
            }
        })
    }
}