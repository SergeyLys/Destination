import '../libs/slick';

export default {
    init() {
        this.sliders();
    },

    sliders() {
        $('.slider').each(function() {
          if ($(this).hasClass('double-slider')) {
            $(this).slick({
              slidesToShow: 2,
              slidesToScroll: 2,
              lazyLoad: 'ondemand',
              prevArrow: $(this).parent('.slider-wrapper').find('.prev-btn'),
              nextArrow: $(this).parent('.slider-wrapper').find('.next-btn'),
              responsive: [
                {
                  breakpoint: 767,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 2
                  }
                }
              ]
            });
          } else {
            $(this).slick({
              prevArrow: $(this).parent('.slider-wrapper').find('.prev-btn'),
              nextArrow: $(this).parent('.slider-wrapper').find('.next-btn'),
              slidesToShow: 1
            });
          }
        });

        $('.top-slider').find('.slide-description').each(function() {
          let that = $(this);
          $(this).find('.show-more').on('click', function(e) {
            e.preventDefault();
            $(this).toggleClass('active');
            that.find('.hidden-description').slideToggle();
          });
        });
    }
}