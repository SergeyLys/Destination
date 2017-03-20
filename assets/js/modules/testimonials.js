import '../libs/foundation/foundation.core.js';

export default {
    init() {
        this.loadTestimonials();
    },

    loadTestimonials() {

        let url = $('.testimonials-wrapper').attr('data-content');

        function objToArray(data) {
            let array = $.map(data, function(value, index) {
                return [value];
            });
            return array;
        }

        function loadItems(start, stop, data) {
            for(var i = start; i < stop && i < data.length; i++) {
                var items = `<div class="testimonial-item">
                                <div class="testimonial-image"><img src="${data[i][0].image}" alt="pic"></div>
                                <div class="testimonial-content">
                                    <div class="title"><h3>${data[i][0].title}</h3><span>${data[i][0].subtitle}</span></div>
                                    <div class="description"><p>${data[i][0].text}</p></div>
                                    <a href="javascript:void(0)" data-open="testimonial-popup${i}" class="popup-video-btn popup-link"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><defs><style>.cls-1 {fill: #ef2146;fill-rule: evenodd;}</style></defs><path id="ic-play" class="cls-1" d="M668,16204a14,14,0,1,1-14,14A14.021,14.021,0,0,1,668,16204Zm0,2a12,12,0,1,1-12,12A12.018,12.018,0,0,1,668,16206Zm4.994,12.5-7.983,5.5v-11Z" transform="translate(-654 -16204)"/></svg><span>Смотреть видео отзыв</span></a>
                                </div>
                                <div id="testimonial-popup${i}" data-reveal class="reveal">
                                    <button data-close type="button" class="close-button icon-cancel"></button>
                                    <div class="reveal-wrapper">
                                        <div class="video-wrapper"><iframe data-src='${data[i][0].src}' src="" width="640" height="360" frameborder="0" allowfullscreen></iframe></div>
                                    </div>
                                </div>
                            </div>`
                var $items = $(items);
                var $grid = $('.testimonials-wrapper');
                $grid.append($items);
            }
        }

        function revealsInit() {
            $('.testimonials-wrapper').foundation();

            const reveals = $('.reveal');

            reveals
                .on('open.zf.reveal', function (e) {
                    $(this).addClass('fadeInBottom');
                    if ($(this).find('iframe').length != 0) {
                        let src = $(this).find('iframe').attr('data-src');
                        $(this).find('iframe')[0].src = src+"&autoplay=1";
                    }
                })
                .on('closed.zf.reveal', function (e) {
                    $(this).removeClass('fadeInBottom');
                    if ($(this).find('iframe').length != 0) {
                        $(this).find('iframe').attr('src', '');
                    }
                });
        }

        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            success: function(data) {
                loadItems(0, 4, objToArray(data));
            },
            error: function() {
                console.log('error');
            }
        }).done(function(data) {
            revealsInit();

            if ($('.testimonials-wrapper').find('.testimonial-item').length == objToArray(data).length){
                $('.add-more').css({'display' : 'none'});
            }
        });

        $('.add-more').on('click', function(e) {
            e.preventDefault();
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'json',
                success: function(data) {
                    let currentItemLength = $('.testimonials-wrapper').find('.testimonial-item').length;
                    objToArray(data);
                    if (currentItemLength < objToArray(data).length) {
                        loadItems(currentItemLength, currentItemLength + 4, objToArray(data));
                    }
                },
                error: function() {
                    console.log('error');
                }
            }).done(function(data) {
                revealsInit();

                if ($('.testimonials-wrapper').find('.testimonial-item').length == objToArray(data).length){
                    $('.add-more').css({'display' : 'none'});
                }
            });
        });
    }
}