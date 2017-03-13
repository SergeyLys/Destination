import '../libs/foundation/foundation.core.js';
import '../libs/foundation/foundation.reveal.js';
import '../libs/foundation/foundation.util.keyboard.js';
import '../libs/foundation/foundation.util.box.js';
import '../libs/foundation/foundation.util.triggers.js';
import '../libs/foundation/foundation.util.mediaQuery.js';

export default {
	init() {
		this.reveal();
	},

	reveal() {
		$(document).foundation();
		
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
}