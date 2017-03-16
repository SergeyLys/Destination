export default {
    init() {
        this.tabSwitcher();
        this.tabsToSelect();
    },

    tabSwitcher() {
        let activeTab = $('.tab-links a.active').attr('href');

        if ($(activeTab).length) {
            $('.tab-content').find(`${activeTab}`).addClass('active');
        }

        $('.tab-links a').on('click', function(e) {
            e.preventDefault();
            let anchor = $(this).attr('href');

            $(this).parent().find('a').removeClass('active');
            $(this).addClass('active');

            if ($(anchor).length) {
                $('.tab-content').find('.tab-item').removeClass('active');
                $(anchor).addClass('active');
            }
        })
    },

    tabsToSelect() {
        function transform() {
            if ($(window).width() <= 767) {
                $('.tabs-wrapper').each(function() {
                    if ($(this).find('.tab-selector').length == 0) {
                        var that = $(this);
                        var tabsWrap = $('<div></div>').addClass('tab-selector');
                        var activeTab = $('<span></span>').addClass('active-tab');
                        $(this).find('.tab-links').wrapAll(tabsWrap);
                        $(this).find('.tab-selector').append(activeTab);
                        activeTab.html($(this).find('.tab-links > a.active').html());

                        $('.tab-selector').on('click', function(e) {
                            if ($(window).width() <= 767) {
                                e.stopPropagation();
                                that.find('.tab-links').slideToggle();
                            }
                        });

                        $('.tab-selector a').on('click', function(e) {
                            if ($(window).width() <= 767) {
                                e.stopPropagation();
                                that.find('.tab-links').slideUp(100);
                                activeTab.html($(this).html());
                            }
                        });

                        $(document).on('click', function() {
                            if ($(window).width() <= 767) {
                                that.find('.tab-links').slideUp(100);
                            }
                        });
                    }
                })
            }
        }

        transform();

        $(window).on('resize', transform);
    }
}