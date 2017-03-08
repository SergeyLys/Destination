(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var _global = require("./modules/global");

var _global2 = _interopRequireDefault(_global);

var _HOME = require("./modules/HOME");

var _HOME2 = _interopRequireDefault(_HOME);

var _ABOUT = require("./modules/ABOUT");

var _ABOUT2 = _interopRequireDefault(_ABOUT);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Создаем функцию init, которая
 * будет вызываться в любом случае
 */
var init = null;
/**
 * Перебираем window.vars.page,
 * чтобы выяснить, какая у нас страница
 */
switch (global.vars.page) {
    case 'home_page':
        init = _HOME2.default.init.bind(_HOME2.default);
        break;
    case 'about_page':
    case 'contact_page':
        init = _ABOUT2.default.init.bind(_ABOUT2.default);
        break;
    default:
        init = function init() {
            console.log('default init');
        };
}
/**
 * Вешаем на document.onready нашу инициализацию страницы
 */
$(document).ready(_global2.default.init(), init());

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./modules/ABOUT":7,"./modules/HOME":8,"./modules/global":9}],2:[function(require,module,exports){
'use strict';

// Required for Meteor package, the use of window prevents export by Meteor
(function (window) {
  if (window.Package) {
    Materialize = {};
  } else {
    window.Materialize = {};
  }
})(window);

/*
 * raf.js
 * https://github.com/ngryman/raf.js
 *
 * original requestAnimationFrame polyfill by Erik Möller
 * inspired from paul_irish gist and post
 *
 * Copyright (c) 2013 ngryman
 * Licensed under the MIT license.
 */
(function (window) {
  var lastTime = 0,
      vendors = ['webkit', 'moz'],
      requestAnimationFrame = window.requestAnimationFrame,
      cancelAnimationFrame = window.cancelAnimationFrame,
      i = vendors.length;

  // try to un-prefix existing raf
  while (--i >= 0 && !requestAnimationFrame) {
    requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
    cancelAnimationFrame = window[vendors[i] + 'CancelRequestAnimationFrame'];
  }

  // polyfill with setTimeout fallback
  // heavily inspired from @darius gist mod: https://gist.github.com/paulirish/1579671#comment-837945
  if (!requestAnimationFrame || !cancelAnimationFrame) {
    requestAnimationFrame = function requestAnimationFrame(callback) {
      var now = +Date.now(),
          nextTime = Math.max(lastTime + 16, now);
      return setTimeout(function () {
        callback(lastTime = nextTime);
      }, nextTime - now);
    };

    cancelAnimationFrame = clearTimeout;
  }

  // export to window
  window.requestAnimationFrame = requestAnimationFrame;
  window.cancelAnimationFrame = cancelAnimationFrame;
})(window);

// Unique ID
Materialize.guid = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return function () {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };
}();

/**
 * Escapes hash from special characters
 * @param {string} hash  String returned from this.hash
 * @returns {string}
 */
Materialize.escapeHash = function (hash) {
  return hash.replace(/(:|\.|\[|\]|,|=)/g, "\\$1");
};

Materialize.elementOrParentIsFixed = function (element) {
  var $element = $(element);
  var $checkElements = $element.add($element.parents());
  var isFixed = false;
  $checkElements.each(function () {
    if ($(this).css("position") === "fixed") {
      isFixed = true;
      return false;
    }
  });
  return isFixed;
};

/**
 * Get time in ms
 * @license https://raw.github.com/jashkenas/underscore/master/LICENSE
 * @type {function}
 * @return {number}
 */
var getTime = Date.now || function () {
  return new Date().getTime();
};

/**
 * Returns a function, that, when invoked, will only be triggered at most once
 * during a given window of time. Normally, the throttled function will run
 * as much as it can, without ever going more than once per `wait` duration;
 * but if you'd like to disable the execution on the leading edge, pass
 * `{leading: false}`. To disable execution on the trailing edge, ditto.
 * @license https://raw.github.com/jashkenas/underscore/master/LICENSE
 * @param {function} func
 * @param {number} wait
 * @param {Object=} options
 * @returns {Function}
 */
Materialize.throttle = function (func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  options || (options = {});
  var later = function later() {
    previous = options.leading === false ? 0 : getTime();
    timeout = null;
    result = func.apply(context, args);
    context = args = null;
  };
  return function () {
    var now = getTime();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
      context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

// Velocity has conflicts when loaded with jQuery, this will check for it
// First, check if in noConflict mode
var Vel;
if (jQuery) {
  Vel = jQuery.Velocity;
} else if ($) {
  Vel = $.Velocity;
} else {
  Vel = Velocity;
}

},{}],3:[function(require,module,exports){
'use strict';

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend(jQuery.easing, {
	def: 'easeOutQuad',
	swing: function swing(x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function easeInQuad(x, t, b, c, d) {
		return c * (t /= d) * t + b;
	},
	easeOutQuad: function easeOutQuad(x, t, b, c, d) {
		return -c * (t /= d) * (t - 2) + b;
	},
	easeInOutQuad: function easeInOutQuad(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t + b;
		return -c / 2 * (--t * (t - 2) - 1) + b;
	},
	easeInCubic: function easeInCubic(x, t, b, c, d) {
		return c * (t /= d) * t * t + b;
	},
	easeOutCubic: function easeOutCubic(x, t, b, c, d) {
		return c * ((t = t / d - 1) * t * t + 1) + b;
	},
	easeInOutCubic: function easeInOutCubic(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t + 2) + b;
	},
	easeInQuart: function easeInQuart(x, t, b, c, d) {
		return c * (t /= d) * t * t * t + b;
	},
	easeOutQuart: function easeOutQuart(x, t, b, c, d) {
		return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	},
	easeInOutQuart: function easeInOutQuart(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
		return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
	},
	easeInQuint: function easeInQuint(x, t, b, c, d) {
		return c * (t /= d) * t * t * t * t + b;
	},
	easeOutQuint: function easeOutQuint(x, t, b, c, d) {
		return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
	},
	easeInOutQuint: function easeInOutQuint(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
	},
	easeInSine: function easeInSine(x, t, b, c, d) {
		return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
	},
	easeOutSine: function easeOutSine(x, t, b, c, d) {
		return c * Math.sin(t / d * (Math.PI / 2)) + b;
	},
	easeInOutSine: function easeInOutSine(x, t, b, c, d) {
		return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
	},
	easeInExpo: function easeInExpo(x, t, b, c, d) {
		return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
	},
	easeOutExpo: function easeOutExpo(x, t, b, c, d) {
		return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
	},
	easeInOutExpo: function easeInOutExpo(x, t, b, c, d) {
		if (t == 0) return b;
		if (t == d) return b + c;
		if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
		return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function easeInCirc(x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
	},
	easeOutCirc: function easeOutCirc(x, t, b, c, d) {
		return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
	},
	easeInOutCirc: function easeInOutCirc(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
		return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
	},
	easeInElastic: function easeInElastic(x, t, b, c, d) {
		var s = 1.70158;var p = 0;var a = c;
		if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	},
	easeOutElastic: function easeOutElastic(x, t, b, c, d) {
		var s = 1.70158;var p = 0;var a = c;
		if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	},
	easeInOutElastic: function easeInOutElastic(x, t, b, c, d) {
		var s = 1.70158;var p = 0;var a = c;
		if (t == 0) return b;if ((t /= d / 2) == 2) return b + c;if (!p) p = d * (.3 * 1.5);
		if (a < Math.abs(c)) {
			a = c;var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
	},
	easeInBack: function easeInBack(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * (t /= d) * t * ((s + 1) * t - s) + b;
	},
	easeOutBack: function easeOutBack(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	},
	easeInOutBack: function easeInOutBack(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
		return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
	},
	easeInBounce: function easeInBounce(x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
	},
	easeOutBounce: function easeOutBounce(x, t, b, c, d) {
		if ((t /= d) < 1 / 2.75) {
			return c * (7.5625 * t * t) + b;
		} else if (t < 2 / 2.75) {
			return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
		} else if (t < 2.5 / 2.75) {
			return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
		} else {
			return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
		}
	},
	easeInOutBounce: function easeInOutBounce(x, t, b, c, d) {
		if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

},{}],4:[function(require,module,exports){
'use strict';

/**
 * Extend jquery with a scrollspy plugin.
 * This watches the window scroll and fires events when elements are scrolled into viewport.
 *
 * throttle() and getTime() taken from Underscore.js
 * https://github.com/jashkenas/underscore
 *
 * @author Copyright 2013 John Smart
 * @license https://raw.github.com/thesmart/jquery-scrollspy/master/LICENSE
 * @see https://github.com/thesmart
 * @version 0.1.2
 */
(function ($) {

	var jWindow = $(window);
	var elements = [];
	var elementsInView = [];
	var isSpying = false;
	var ticks = 0;
	var unique_id = 1;
	var offset = {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	};

	/**
  * Find elements that are within the boundary
  * @param {number} top
  * @param {number} right
  * @param {number} bottom
  * @param {number} left
  * @return {jQuery}		A collection of elements
  */
	function findElements(top, right, bottom, left) {
		var hits = $();
		$.each(elements, function (i, element) {
			if (element.height() > 0) {
				var elTop = element.offset().top,
				    elLeft = element.offset().left,
				    elRight = elLeft + element.width(),
				    elBottom = elTop + element.height();

				var isIntersect = !(elLeft > right || elRight < left || elTop > bottom || elBottom < top);

				if (isIntersect) {
					hits.push(element);
				}
			}
		});

		return hits;
	}

	/**
  * Called when the user scrolls the window
  */
	function onScroll(scrollOffset) {
		// unique tick id
		++ticks;

		// viewport rectangle
		var top = jWindow.scrollTop(),
		    left = jWindow.scrollLeft(),
		    right = left + jWindow.width(),
		    bottom = top + jWindow.height();

		// determine which elements are in view
		var intersections = findElements(top + offset.top + scrollOffset || 200, right + offset.right, bottom + offset.bottom, left + offset.left);
		$.each(intersections, function (i, element) {

			var lastTick = element.data('scrollSpy:ticks');
			if (typeof lastTick != 'number') {
				// entered into view
				element.triggerHandler('scrollSpy:enter');
			}

			// update tick id
			element.data('scrollSpy:ticks', ticks);
		});

		// determine which elements are no longer in view
		$.each(elementsInView, function (i, element) {
			var lastTick = element.data('scrollSpy:ticks');
			if (typeof lastTick == 'number' && lastTick !== ticks) {
				// exited from view
				element.triggerHandler('scrollSpy:exit');
				element.data('scrollSpy:ticks', null);
			}
		});

		// remember elements in view for next tick
		elementsInView = intersections;
	}

	/**
  * Called when window is resized
 */
	function onWinSize() {
		jWindow.trigger('scrollSpy:winSize');
	}

	/**
  * Enables ScrollSpy using a selector
  * @param {jQuery|string} selector  The elements collection, or a selector
  * @param {Object=} options	Optional.
        throttle : number -> scrollspy throttling. Default: 100 ms
        offsetTop : number -> offset from top. Default: 0
        offsetRight : number -> offset from right. Default: 0
        offsetBottom : number -> offset from bottom. Default: 0
        offsetLeft : number -> offset from left. Default: 0
  * @returns {jQuery}
  */
	$.scrollSpy = function (selector, options) {
		var defaults = {
			throttle: 100,
			scrollOffset: 200 // offset - 200 allows elements near bottom of page to scroll
		};
		options = $.extend(defaults, options);

		var visible = [];
		selector = $(selector);
		selector.each(function (i, element) {
			elements.push($(element));
			$(element).data("scrollSpy:id", i);
			// Smooth scroll to section
			$('a[href="#' + $(element).attr('id') + '"]').click(function (e) {
				e.preventDefault();
				var offset = $(Materialize.escapeHash(this.hash)).offset().top + 1;
				$('html, body').animate({ scrollTop: offset - options.scrollOffset }, { duration: 400, queue: false, easing: 'easeOutCubic' });
			});
		});

		offset.top = options.offsetTop || 0;
		offset.right = options.offsetRight || 0;
		offset.bottom = options.offsetBottom || 0;
		offset.left = options.offsetLeft || 0;

		var throttledScroll = Materialize.throttle(function () {
			onScroll(options.scrollOffset);
		}, options.throttle || 100);
		var readyScroll = function readyScroll() {
			$(document).ready(throttledScroll);
		};

		if (!isSpying) {
			jWindow.on('scroll', readyScroll);
			jWindow.on('resize', readyScroll);
			isSpying = true;
		}

		// perform a scan once, after current execution context, and after dom is ready
		setTimeout(readyScroll, 0);

		selector.on('scrollSpy:enter', function () {
			visible = $.grep(visible, function (value) {
				return value.height() != 0;
			});

			var $this = $(this);

			if (visible[0]) {
				$('a[href="#' + visible[0].attr('id') + '"]').removeClass('active');
				if ($this.data('scrollSpy:id') < visible[0].data('scrollSpy:id')) {
					visible.unshift($(this));
				} else {
					visible.push($(this));
				}
			} else {
				visible.push($(this));
			}

			$('a[href="#' + visible[0].attr('id') + '"]').addClass('active');
		});
		selector.on('scrollSpy:exit', function () {
			visible = $.grep(visible, function (value) {
				return value.height() != 0;
			});

			if (visible[0]) {
				$('a[href="#' + visible[0].attr('id') + '"]').removeClass('active');
				var $this = $(this);
				visible = $.grep(visible, function (value) {
					return value.attr('id') != $this.attr('id');
				});
				if (visible[0]) {
					// Check if empty
					$('a[href="#' + visible[0].attr('id') + '"]').addClass('active');
				}
			}
		});

		return selector;
	};

	/**
  * Listen for window resize events
  * @param {Object=} options						Optional. Set { throttle: number } to change throttling. Default: 100 ms
  * @returns {jQuery}		$(window)
  */
	$.winSizeSpy = function (options) {
		$.winSizeSpy = function () {
			return jWindow;
		}; // lock from multiple calls
		options = options || {
			throttle: 100
		};
		return jWindow.on('resize', Materialize.throttle(onWinSize, options.throttle || 100));
	};

	/**
  * Enables ScrollSpy on a collection of elements
  * e.g. $('.scrollSpy').scrollSpy()
  * @param {Object=} options	Optional.
 										throttle : number -> scrollspy throttling. Default: 100 ms
 										offsetTop : number -> offset from top. Default: 0
 										offsetRight : number -> offset from right. Default: 0
 										offsetBottom : number -> offset from bottom. Default: 0
 										offsetLeft : number -> offset from left. Default: 0
  * @returns {jQuery}
  */
	$.fn.scrollSpy = function (options) {
		return $.scrollSpy($(this), options);
	};
})(jQuery);

},{}],5:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function ($) {

  var methods = {
    init: function init(options) {
      var defaults = {
        onShow: null
      };
      options = $.extend(defaults, options);

      return this.each(function () {

        // For each set of tabs, we want to keep track of
        // which tab is active and its associated content
        var $this = $(this),
            window_width = $(window).width();

        var $active,
            $content,
            $links = $this.find('li a'),
            $tabs_width = $this.width(),
            $tab_width = Math.max($tabs_width, $this[0].scrollWidth) / $links.length,
            $index = 0;

        // Finds right attribute for indicator based on active tab.
        // el: jQuery Object
        var calcRightPos = function calcRightPos(el) {
          return $tabs_width - el.position().left - el.outerWidth() - $this.scrollLeft();
        };

        // Finds left attribute for indicator based on active tab.
        // el: jQuery Object
        var calcLeftPos = function calcLeftPos(el) {
          return el.position().left + $this.scrollLeft();
        };

        // If the location.hash matches one of the links, use that as the active tab.

        $active = $($links.filter('[href="' + location.hash + '"]'));

        // If no match is found, use the first link or any with class 'active' as the initial active tab.
        if ($active.length === 0) {
          $active = $(this).find('li a.active').first();
        }
        if ($active.length === 0) {
          $active = $(this).find('li a').first();
        }

        // $active.addClass('active');
        $index = $links.index($active);
        if ($index < 0) {
          $index = 0;
        }

        if ($active[0] !== undefined) {
          $content = $($active[0].hash);
        }

        // append indicator then set indicator width to tab width
        $this.append('<div class="indicator"></div>');
        var $indicator = $this.find('.indicator');
        if ($this.is(":visible")) {
          // $indicator.css({"right": $tabs_width - (($index + 1) * $tab_width)});
          // $indicator.css({"left": $index * $tab_width});

          setTimeout(function () {
            $indicator.css({ "right": calcRightPos($active) });
            $indicator.css({ "left": calcLeftPos($active) });
          }, 0);
        }
        $(window).resize(function () {
          $tabs_width = $this.width();
          $tab_width = Math.max($tabs_width, $this[0].scrollWidth) / $links.length;
          if ($index < 0) {
            $index = 0;
          }
          if ($tab_width !== 0 && $tabs_width !== 0) {
            $indicator.css({ "right": calcRightPos($active) });
            $indicator.css({ "left": calcLeftPos($active) });
          }
        });

        // Hide the remaining content
        $links.not($active).each(function () {
          $(Materialize.escapeHash(this.hash)).removeClass('active');
        });

        $(window).on('scroll', function () {
          $active = $this.find('li a.active');
          $indicator.velocity({ "left": calcLeftPos($active) }, { duration: 400, queue: false, easing: 'easeOutQuad' });
          $indicator.velocity({ "right": calcRightPos($active) }, { duration: 400, queue: false, easing: 'easeOutQuad', delay: 90 });
        });
      });
    }
  };

  $.fn.tabs = function (methodOrOptions) {
    if (methods[methodOrOptions]) {
      return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if ((typeof methodOrOptions === 'undefined' ? 'undefined' : _typeof(methodOrOptions)) === 'object' || !methodOrOptions) {
      // Default to "init"
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + methodOrOptions + ' does not exist on jQuery.tabs');
    }
  };

  $(window).ready(function () {
    setTimeout(function () {
      $('.site-nav ul').tabs();
    }, 200);
  });
})(jQuery);

},{}],6:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! VelocityJS.org (1.4.2). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */

/*************************
 Velocity jQuery Shim
 *************************/

/*! VelocityJS.org jQuery Shim (1.0.1). (C) 2014 The jQuery Foundation. MIT @license: en.wikipedia.org/wiki/MIT_License. */

/* This file contains the jQuery functions that Velocity relies on, thereby removing Velocity's dependency on a full copy of jQuery, and allowing it to work in any environment. */
/* These shimmed functions are only used if jQuery isn't present. If both this shim and jQuery are loaded, Velocity defaults to jQuery proper. */
/* Browser support: Using this shim instead of jQuery proper removes support for IE8. */

(function (window) {
    "use strict";
    /***************
     Setup
     ***************/

    /* If jQuery is already loaded, there's no point in loading this shim. */

    if (window.jQuery) {
        return;
    }

    /* jQuery base. */
    var $ = function $(selector, context) {
        return new $.fn.init(selector, context);
    };

    /********************
     Private Methods
     ********************/

    /* jQuery */
    $.isWindow = function (obj) {
        /* jshint eqeqeq: false */
        return obj && obj === obj.window;
    };

    /* jQuery */
    $.type = function (obj) {
        if (!obj) {
            return obj + "";
        }

        return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
    };

    /* jQuery */
    $.isArray = Array.isArray || function (obj) {
        return $.type(obj) === "array";
    };

    /* jQuery */
    function isArraylike(obj) {
        var length = obj.length,
            type = $.type(obj);

        if (type === "function" || $.isWindow(obj)) {
            return false;
        }

        if (obj.nodeType === 1 && length) {
            return true;
        }

        return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
    }

    /***************
     $ Methods
     ***************/

    /* jQuery: Support removed for IE<9. */
    $.isPlainObject = function (obj) {
        var key;

        if (!obj || $.type(obj) !== "object" || obj.nodeType || $.isWindow(obj)) {
            return false;
        }

        try {
            if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            return false;
        }

        for (key in obj) {}

        return key === undefined || hasOwn.call(obj, key);
    };

    /* jQuery */
    $.each = function (obj, callback, args) {
        var value,
            i = 0,
            length = obj.length,
            isArray = isArraylike(obj);

        if (args) {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    if (!obj.hasOwnProperty(i)) {
                        continue;
                    }
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            }
        } else {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    if (!obj.hasOwnProperty(i)) {
                        continue;
                    }
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            }
        }

        return obj;
    };

    /* Custom */
    $.data = function (node, key, value) {
        /* $.getData() */
        if (value === undefined) {
            var getId = node[$.expando],
                store = getId && cache[getId];

            if (key === undefined) {
                return store;
            } else if (store) {
                if (key in store) {
                    return store[key];
                }
            }
            /* $.setData() */
        } else if (key !== undefined) {
            var setId = node[$.expando] || (node[$.expando] = ++$.uuid);

            cache[setId] = cache[setId] || {};
            cache[setId][key] = value;

            return value;
        }
    };

    /* Custom */
    $.removeData = function (node, keys) {
        var id = node[$.expando],
            store = id && cache[id];

        if (store) {
            // Cleanup the entire store if no keys are provided.
            if (!keys) {
                delete cache[id];
            } else {
                $.each(keys, function (_, key) {
                    delete store[key];
                });
            }
        }
    };

    /* jQuery */
    $.extend = function () {
        var src,
            copyIsArray,
            copy,
            name,
            options,
            clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if (typeof target === "boolean") {
            deep = target;

            target = arguments[i] || {};
            i++;
        }

        if ((typeof target === "undefined" ? "undefined" : _typeof(target)) !== "object" && $.type(target) !== "function") {
            target = {};
        }

        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            if (options = arguments[i]) {
                for (name in options) {
                    if (!options.hasOwnProperty(name)) {
                        continue;
                    }
                    src = target[name];
                    copy = options[name];

                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && $.isArray(src) ? src : [];
                        } else {
                            clone = src && $.isPlainObject(src) ? src : {};
                        }

                        target[name] = $.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    };

    /* jQuery 1.4.3 */
    $.queue = function (elem, type, data) {
        function $makeArray(arr, results) {
            var ret = results || [];

            if (arr) {
                if (isArraylike(Object(arr))) {
                    /* $.merge */
                    (function (first, second) {
                        var len = +second.length,
                            j = 0,
                            i = first.length;

                        while (j < len) {
                            first[i++] = second[j++];
                        }

                        if (len !== len) {
                            while (second[j] !== undefined) {
                                first[i++] = second[j++];
                            }
                        }

                        first.length = i;

                        return first;
                    })(ret, typeof arr === "string" ? [arr] : arr);
                } else {
                    [].push.call(ret, arr);
                }
            }

            return ret;
        }

        if (!elem) {
            return;
        }

        type = (type || "fx") + "queue";

        var q = $.data(elem, type);

        if (!data) {
            return q || [];
        }

        if (!q || $.isArray(data)) {
            q = $.data(elem, type, $makeArray(data));
        } else {
            q.push(data);
        }

        return q;
    };

    /* jQuery 1.4.3 */
    $.dequeue = function (elems, type) {
        /* Custom: Embed element iteration. */
        $.each(elems.nodeType ? [elems] : elems, function (i, elem) {
            type = type || "fx";

            var queue = $.queue(elem, type),
                fn = queue.shift();

            if (fn === "inprogress") {
                fn = queue.shift();
            }

            if (fn) {
                if (type === "fx") {
                    queue.unshift("inprogress");
                }

                fn.call(elem, function () {
                    $.dequeue(elem, type);
                });
            }
        });
    };

    /******************
     $.fn Methods
     ******************/

    /* jQuery */
    $.fn = $.prototype = {
        init: function init(selector) {
            /* Just return the element wrapped inside an array; don't proceed with the actual jQuery node wrapping process. */
            if (selector.nodeType) {
                this[0] = selector;

                return this;
            } else {
                throw new Error("Not a DOM node.");
            }
        },
        offset: function offset() {
            /* jQuery altered code: Dropped disconnected DOM node checking. */
            var box = this[0].getBoundingClientRect ? this[0].getBoundingClientRect() : { top: 0, left: 0 };

            return {
                top: box.top + (window.pageYOffset || document.scrollTop || 0) - (document.clientTop || 0),
                left: box.left + (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
            };
        },
        position: function position() {
            /* jQuery */
            function offsetParentFn(elem) {
                var offsetParent = elem.offsetParent;

                while (offsetParent && offsetParent.nodeName.toLowerCase() !== "html" && offsetParent.style && offsetParent.style.position === "static") {
                    offsetParent = offsetParent.offsetParent;
                }

                return offsetParent || document;
            }

            /* Zepto */
            var elem = this[0],
                offsetParent = offsetParentFn(elem),
                offset = this.offset(),
                parentOffset = /^(?:body|html)$/i.test(offsetParent.nodeName) ? { top: 0, left: 0 } : $(offsetParent).offset();

            offset.top -= parseFloat(elem.style.marginTop) || 0;
            offset.left -= parseFloat(elem.style.marginLeft) || 0;

            if (offsetParent.style) {
                parentOffset.top += parseFloat(offsetParent.style.borderTopWidth) || 0;
                parentOffset.left += parseFloat(offsetParent.style.borderLeftWidth) || 0;
            }

            return {
                top: offset.top - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        }
    };

    /**********************
     Private Variables
     **********************/

    /* For $.data() */
    var cache = {};
    $.expando = "velocity" + new Date().getTime();
    $.uuid = 0;

    /* For $.queue() */
    var class2type = {},
        hasOwn = class2type.hasOwnProperty,
        toString = class2type.toString;

    var types = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
    for (var i = 0; i < types.length; i++) {
        class2type["[object " + types[i] + "]"] = types[i].toLowerCase();
    }

    /* Makes $(node) possible, without having to call init. */
    $.fn.init.prototype = $.fn;

    /* Globalize Velocity onto the window, and assign its Utilities property. */
    window.Velocity = { Utilities: $ };
})(window);

/******************
 Velocity.js
 ******************/

(function (factory) {
    "use strict";
    /* CommonJS module. */

    if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
        module.exports = factory();
        /* AMD module. */
    } else if (typeof define === "function" && define.amd) {
        define(factory);
        /* Browser globals. */
    } else {
        factory();
    }
})(function () {
    "use strict";

    return function (global, window, document, undefined) {

        /***************
         Summary
         ***************/

        /*
         - CSS: CSS stack that works independently from the rest of Velocity.
         - animate(): Core animation method that iterates over the targeted elements and queues the incoming call onto each element individually.
         - Pre-Queueing: Prepare the element for animation by instantiating its data cache and processing the call's options.
         - Queueing: The logic that runs once the call has reached its point of execution in the element's $.queue() stack.
         Most logic is placed here to avoid risking it becoming stale (if the element's properties have changed).
         - Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
         - tick(): The single requestAnimationFrame loop responsible for tweening all in-progress calls.
         - completeCall(): Handles the cleanup process for each Velocity call.
         */

        /*********************
         Helper Functions
         *********************/

        /* IE detection. Gist: https://gist.github.com/julianshapiro/9098609 */
        var IE = function () {
            if (document.documentMode) {
                return document.documentMode;
            } else {
                for (var i = 7; i > 4; i--) {
                    var div = document.createElement("div");

                    div.innerHTML = "<!--[if IE " + i + "]><span></span><![endif]-->";

                    if (div.getElementsByTagName("span").length) {
                        div = null;

                        return i;
                    }
                }
            }

            return undefined;
        }();

        /* rAF shim. Gist: https://gist.github.com/julianshapiro/9497513 */
        var rAFShim = function () {
            var timeLast = 0;

            return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
                var timeCurrent = new Date().getTime(),
                    timeDelta;

                /* Dynamically set delay on a per-tick basis to match 60fps. */
                /* Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671 */
                timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
                timeLast = timeCurrent + timeDelta;

                return setTimeout(function () {
                    callback(timeCurrent + timeDelta);
                }, timeDelta);
            };
        }();

        var performance = function () {
            var perf = window.performance || {};

            if (!Object.prototype.hasOwnProperty.call(perf, "now")) {
                var nowOffset = perf.timing && perf.timing.domComplete ? perf.timing.domComplete : new Date().getTime();

                perf.now = function () {
                    return new Date().getTime() - nowOffset;
                };
            }
            return perf;
        }();

        /* Array compacting. Copyright Lo-Dash. MIT License: https://github.com/lodash/lodash/blob/master/LICENSE.txt */
        function compactSparseArray(array) {
            var index = -1,
                length = array ? array.length : 0,
                result = [];

            while (++index < length) {
                var value = array[index];

                if (value) {
                    result.push(value);
                }
            }

            return result;
        }

        var _slice = function () {
            var slice = Array.prototype.slice;

            try {
                // Can't be used with DOM elements in IE < 9
                slice.call(document.documentElement);
            } catch (e) {
                // Fails in IE < 9
                // This will work for genuine arrays, array-like objects,
                // NamedNodeMap (attributes, entities, notations),
                // NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
                // and will not fail on other DOM objects (as do DOM elements in IE < 9)
                slice = function slice() {
                    var i = this.length,
                        clone = [];

                    while (--i > 0) {
                        clone[i] = this[i];
                    }
                    return cloned;
                };
            }
            return slice;
        }(); // TODO: IE8, Cache of Array.prototype.slice that works on IE8

        function sanitizeElements(elements) {
            /* Unwrap jQuery/Zepto objects. */
            if (Type.isWrapped(elements)) {
                elements = _slice.call(elements);
                /* Wrap a single element in an array so that $.each() can iterate with the element instead of its node's children. */
            } else if (Type.isNode(elements)) {
                elements = [elements];
            }

            return elements;
        }

        var Type = {
            isNumber: function isNumber(variable) {
                return typeof variable === "number";
            },
            isString: function isString(variable) {
                return typeof variable === "string";
            },
            isArray: Array.isArray || function (variable) {
                return Object.prototype.toString.call(variable) === "[object Array]";
            },
            isFunction: function isFunction(variable) {
                return Object.prototype.toString.call(variable) === "[object Function]";
            },
            isNode: function isNode(variable) {
                return variable && variable.nodeType;
            },
            /* Determine if variable is an array-like wrapped jQuery, Zepto or similar element, or even a NodeList etc. */
            /* NOTE: HTMLFormElements also have a length. */
            isWrapped: function isWrapped(variable) {
                return variable && Type.isNumber(variable.length) && !Type.isString(variable) && !Type.isFunction(variable) && !Type.isNode(variable) && (variable.length === 0 || Type.isNode(variable[0]));
            },
            isSVG: function isSVG(variable) {
                return window.SVGElement && variable instanceof window.SVGElement;
            },
            isEmptyObject: function isEmptyObject(variable) {
                for (var name in variable) {
                    if (variable.hasOwnProperty(name)) {
                        return false;
                    }
                }

                return true;
            }
        };

        /*****************
         Dependencies
         *****************/

        var $,
            isJQuery = false;

        if (global.fn && global.fn.jquery) {
            $ = global;
            isJQuery = true;
        } else {
            $ = window.Velocity.Utilities;
        }

        if (IE <= 8 && !isJQuery) {
            throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");
        } else if (IE <= 7) {
            /* Revert to jQuery's $.animate(), and lose Velocity's extra features. */
            jQuery.fn.velocity = jQuery.fn.animate;

            /* Now that $.fn.velocity is aliased, abort this Velocity declaration. */
            return;
        }

        /*****************
         Constants
         *****************/

        var DURATION_DEFAULT = 400,
            EASING_DEFAULT = "swing";

        /*************
         State
         *************/

        var Velocity = {
            /* Container for page-wide Velocity state data. */
            State: {
                /* Detect mobile devices to determine if mobileHA should be turned on. */
                isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
                /* The mobileHA option's behavior changes on older Android devices (Gingerbread, versions 2.3.3-2.3.7). */
                isAndroid: /Android/i.test(navigator.userAgent),
                isGingerbread: /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
                isChrome: window.chrome,
                isFirefox: /Firefox/i.test(navigator.userAgent),
                /* Create a cached element for re-use when checking for CSS property prefixes. */
                prefixElement: document.createElement("div"),
                /* Cache every prefix match to avoid repeating lookups. */
                prefixMatches: {},
                /* Cache the anchor used for animating window scrolling. */
                scrollAnchor: null,
                /* Cache the browser-specific property names associated with the scroll anchor. */
                scrollPropertyLeft: null,
                scrollPropertyTop: null,
                /* Keep track of whether our RAF tick is running. */
                isTicking: false,
                /* Container for every in-progress call to Velocity. */
                calls: [],
                delayedElements: {
                    count: 0
                }
            },
            /* Velocity's custom CSS stack. Made global for unit testing. */
            CSS: {/* Defined below. */},
            /* A shim of the jQuery utility functions used by Velocity -- provided by Velocity's optional jQuery shim. */
            Utilities: $,
            /* Container for the user's custom animation redirects that are referenced by name in place of the properties map argument. */
            Redirects: {/* Manually registered by the user. */},
            Easings: {/* Defined below. */},
            /* Attempt to use ES6 Promises by default. Users can override this with a third-party promises library. */
            Promise: window.Promise,
            /* Velocity option defaults, which can be overriden by the user. */
            defaults: {
                queue: "",
                duration: DURATION_DEFAULT,
                easing: EASING_DEFAULT,
                begin: undefined,
                complete: undefined,
                progress: undefined,
                display: undefined,
                visibility: undefined,
                loop: false,
                delay: false,
                mobileHA: true,
                /* Advanced: Set to false to prevent property values from being cached between consecutive Velocity-initiated chain calls. */
                _cacheValues: true,
                /* Advanced: Set to false if the promise should always resolve on empty element lists. */
                promiseRejectEmpty: true
            },
            /* A design goal of Velocity is to cache data wherever possible in order to avoid DOM requerying. Accordingly, each element has a data cache. */
            init: function init(element) {
                $.data(element, "velocity", {
                    /* Store whether this is an SVG element, since its properties are retrieved and updated differently than standard HTML elements. */
                    isSVG: Type.isSVG(element),
                    /* Keep track of whether the element is currently being animated by Velocity.
                     This is used to ensure that property values are not transferred between non-consecutive (stale) calls. */
                    isAnimating: false,
                    /* A reference to the element's live computedStyle object. Learn more here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
                    computedStyle: null,
                    /* Tween data is cached for each animation on the element so that data can be passed across calls --
                     in particular, end values are used as subsequent start values in consecutive Velocity calls. */
                    tweensContainer: null,
                    /* The full root property values of each CSS hook being animated on this element are cached so that:
                     1) Concurrently-animating hooks sharing the same root can have their root values' merged into one while tweening.
                     2) Post-hook-injection root values can be transferred over to consecutively chained Velocity calls as starting root values. */
                    rootPropertyValueCache: {},
                    /* A cache for transform updates, which must be manually flushed via CSS.flushTransformCache(). */
                    transformCache: {}
                });
            },
            /* A parallel to jQuery's $.css(), used for getting/setting Velocity's hooked CSS properties. */
            hook: null, /* Defined below. */
            /* Velocity-wide animation time remapping for testing purposes. */
            mock: false,
            version: { major: 1, minor: 4, patch: 2 },
            /* Set to 1 or 2 (most verbose) to output debug info to console. */
            debug: false,
            /* Use rAF high resolution timestamp when available */
            timestamp: true,
            /* Pause all animations */
            pauseAll: function pauseAll(queueName) {
                var currentTime = new Date().getTime();

                $.each(Velocity.State.calls, function (i, activeCall) {

                    if (activeCall) {

                        /* If we have a queueName and this call is not on that queue, skip */
                        if (queueName !== undefined && (activeCall[2].queue !== queueName || activeCall[2].queue === false)) {
                            return true;
                        }

                        /* Set call to paused */
                        activeCall[5] = {
                            resume: false
                        };
                    }
                });

                /* Pause timers on any currently delayed calls */
                $.each(Velocity.State.delayedElements, function (k, element) {
                    if (!element) {
                        return;
                    }
                    pauseDelayOnElement(element, currentTime);
                });
            },
            /* Resume all animations */
            resumeAll: function resumeAll(queueName) {
                var currentTime = new Date().getTime();

                $.each(Velocity.State.calls, function (i, activeCall) {

                    if (activeCall) {

                        /* If we have a queueName and this call is not on that queue, skip */
                        if (queueName !== undefined && (activeCall[2].queue !== queueName || activeCall[2].queue === false)) {
                            return true;
                        }

                        /* Set call to resumed if it was paused */
                        if (activeCall[5]) {
                            activeCall[5].resume = true;
                        }
                    }
                });
                /* Resume timers on any currently delayed calls */
                $.each(Velocity.State.delayedElements, function (k, element) {
                    if (!element) {
                        return;
                    }
                    resumeDelayOnElement(element, currentTime);
                });
            }
        };

        /* Retrieve the appropriate scroll anchor and property name for the browser: https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY */
        if (window.pageYOffset !== undefined) {
            Velocity.State.scrollAnchor = window;
            Velocity.State.scrollPropertyLeft = "pageXOffset";
            Velocity.State.scrollPropertyTop = "pageYOffset";
        } else {
            Velocity.State.scrollAnchor = document.documentElement || document.body.parentNode || document.body;
            Velocity.State.scrollPropertyLeft = "scrollLeft";
            Velocity.State.scrollPropertyTop = "scrollTop";
        }

        /* Shorthand alias for jQuery's $.data() utility. */
        function Data(element) {
            /* Hardcode a reference to the plugin name. */
            var response = $.data(element, "velocity");

            /* jQuery <=1.4.2 returns null instead of undefined when no match is found. We normalize this behavior. */
            return response === null ? undefined : response;
        }

        /**************
         Delay Timer
         **************/

        function pauseDelayOnElement(element, currentTime) {
            /* Check for any delay timers, and pause the set timeouts (while preserving time data)
             to be resumed when the "resume" command is issued */
            var data = Data(element);
            if (data && data.delayTimer && !data.delayPaused) {
                data.delayRemaining = data.delay - currentTime + data.delayBegin;
                data.delayPaused = true;
                clearTimeout(data.delayTimer.setTimeout);
            }
        }

        function resumeDelayOnElement(element, currentTime) {
            /* Check for any paused timers and resume */
            var data = Data(element);
            if (data && data.delayTimer && data.delayPaused) {
                /* If the element was mid-delay, re initiate the timeout with the remaining delay */
                data.delayPaused = false;
                data.delayTimer.setTimeout = setTimeout(data.delayTimer.next, data.delayRemaining);
            }
        }

        /**************
         Easing
         **************/

        /* Step easing generator. */
        function generateStep(steps) {
            return function (p) {
                return Math.round(p * steps) * (1 / steps);
            };
        }

        /* Bezier curve function generator. Copyright Gaetan Renaudeau. MIT License: http://en.wikipedia.org/wiki/MIT_License */
        function generateBezier(mX1, mY1, mX2, mY2) {
            var NEWTON_ITERATIONS = 4,
                NEWTON_MIN_SLOPE = 0.001,
                SUBDIVISION_PRECISION = 0.0000001,
                SUBDIVISION_MAX_ITERATIONS = 10,
                kSplineTableSize = 11,
                kSampleStepSize = 1.0 / (kSplineTableSize - 1.0),
                float32ArraySupported = "Float32Array" in window;

            /* Must contain four arguments. */
            if (arguments.length !== 4) {
                return false;
            }

            /* Arguments must be numbers. */
            for (var i = 0; i < 4; ++i) {
                if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i])) {
                    return false;
                }
            }

            /* X values must be in the [0, 1] range. */
            mX1 = Math.min(mX1, 1);
            mX2 = Math.min(mX2, 1);
            mX1 = Math.max(mX1, 0);
            mX2 = Math.max(mX2, 0);

            var mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

            function A(aA1, aA2) {
                return 1.0 - 3.0 * aA2 + 3.0 * aA1;
            }
            function B(aA1, aA2) {
                return 3.0 * aA2 - 6.0 * aA1;
            }
            function C(aA1) {
                return 3.0 * aA1;
            }

            function calcBezier(aT, aA1, aA2) {
                return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
            }

            function getSlope(aT, aA1, aA2) {
                return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
            }

            function newtonRaphsonIterate(aX, aGuessT) {
                for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
                    var currentSlope = getSlope(aGuessT, mX1, mX2);

                    if (currentSlope === 0.0) {
                        return aGuessT;
                    }

                    var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
                    aGuessT -= currentX / currentSlope;
                }

                return aGuessT;
            }

            function calcSampleValues() {
                for (var i = 0; i < kSplineTableSize; ++i) {
                    mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
                }
            }

            function binarySubdivide(aX, aA, aB) {
                var currentX,
                    currentT,
                    i = 0;

                do {
                    currentT = aA + (aB - aA) / 2.0;
                    currentX = calcBezier(currentT, mX1, mX2) - aX;
                    if (currentX > 0.0) {
                        aB = currentT;
                    } else {
                        aA = currentT;
                    }
                } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

                return currentT;
            }

            function getTForX(aX) {
                var intervalStart = 0.0,
                    currentSample = 1,
                    lastSample = kSplineTableSize - 1;

                for (; currentSample !== lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
                    intervalStart += kSampleStepSize;
                }

                --currentSample;

                var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample + 1] - mSampleValues[currentSample]),
                    guessForT = intervalStart + dist * kSampleStepSize,
                    initialSlope = getSlope(guessForT, mX1, mX2);

                if (initialSlope >= NEWTON_MIN_SLOPE) {
                    return newtonRaphsonIterate(aX, guessForT);
                } else if (initialSlope === 0.0) {
                    return guessForT;
                } else {
                    return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize);
                }
            }

            var _precomputed = false;

            function precompute() {
                _precomputed = true;
                if (mX1 !== mY1 || mX2 !== mY2) {
                    calcSampleValues();
                }
            }

            var f = function f(aX) {
                if (!_precomputed) {
                    precompute();
                }
                if (mX1 === mY1 && mX2 === mY2) {
                    return aX;
                }
                if (aX === 0) {
                    return 0;
                }
                if (aX === 1) {
                    return 1;
                }

                return calcBezier(getTForX(aX), mY1, mY2);
            };

            f.getControlPoints = function () {
                return [{ x: mX1, y: mY1 }, { x: mX2, y: mY2 }];
            };

            var str = "generateBezier(" + [mX1, mY1, mX2, mY2] + ")";
            f.toString = function () {
                return str;
            };

            return f;
        }

        /* Runge-Kutta spring physics function generator. Adapted from Framer.js, copyright Koen Bok. MIT License: http://en.wikipedia.org/wiki/MIT_License */
        /* Given a tension, friction, and duration, a simulation at 60FPS will first run without a defined duration in order to calculate the full path. A second pass
         then adjusts the time delta -- using the relation between actual time and duration -- to calculate the path for the duration-constrained animation. */
        var generateSpringRK4 = function () {
            function springAccelerationForState(state) {
                return -state.tension * state.x - state.friction * state.v;
            }

            function springEvaluateStateWithDerivative(initialState, dt, derivative) {
                var state = {
                    x: initialState.x + derivative.dx * dt,
                    v: initialState.v + derivative.dv * dt,
                    tension: initialState.tension,
                    friction: initialState.friction
                };

                return { dx: state.v, dv: springAccelerationForState(state) };
            }

            function springIntegrateState(state, dt) {
                var a = {
                    dx: state.v,
                    dv: springAccelerationForState(state)
                },
                    b = springEvaluateStateWithDerivative(state, dt * 0.5, a),
                    c = springEvaluateStateWithDerivative(state, dt * 0.5, b),
                    d = springEvaluateStateWithDerivative(state, dt, c),
                    dxdt = 1.0 / 6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx),
                    dvdt = 1.0 / 6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv);

                state.x = state.x + dxdt * dt;
                state.v = state.v + dvdt * dt;

                return state;
            }

            return function springRK4Factory(tension, friction, duration) {

                var initState = {
                    x: -1,
                    v: 0,
                    tension: null,
                    friction: null
                },
                    path = [0],
                    time_lapsed = 0,
                    tolerance = 1 / 10000,
                    DT = 16 / 1000,
                    have_duration,
                    dt,
                    last_state;

                tension = parseFloat(tension) || 500;
                friction = parseFloat(friction) || 20;
                duration = duration || null;

                initState.tension = tension;
                initState.friction = friction;

                have_duration = duration !== null;

                /* Calculate the actual time it takes for this animation to complete with the provided conditions. */
                if (have_duration) {
                    /* Run the simulation without a duration. */
                    time_lapsed = springRK4Factory(tension, friction);
                    /* Compute the adjusted time delta. */
                    dt = time_lapsed / duration * DT;
                } else {
                    dt = DT;
                }

                while (true) {
                    /* Next/step function .*/
                    last_state = springIntegrateState(last_state || initState, dt);
                    /* Store the position. */
                    path.push(1 + last_state.x);
                    time_lapsed += 16;
                    /* If the change threshold is reached, break. */
                    if (!(Math.abs(last_state.x) > tolerance && Math.abs(last_state.v) > tolerance)) {
                        break;
                    }
                }

                /* If duration is not defined, return the actual time required for completing this animation. Otherwise, return a closure that holds the
                 computed path and returns a snapshot of the position according to a given percentComplete. */
                return !have_duration ? time_lapsed : function (percentComplete) {
                    return path[percentComplete * (path.length - 1) | 0];
                };
            };
        }();

        /* jQuery easings. */
        Velocity.Easings = {
            linear: function linear(p) {
                return p;
            },
            swing: function swing(p) {
                return 0.5 - Math.cos(p * Math.PI) / 2;
            },
            /* Bonus "spring" easing, which is a less exaggerated version of easeInOutElastic. */
            spring: function spring(p) {
                return 1 - Math.cos(p * 4.5 * Math.PI) * Math.exp(-p * 6);
            }
        };

        /* CSS3 and Robert Penner easings. */
        $.each([["ease", [0.25, 0.1, 0.25, 1.0]], ["ease-in", [0.42, 0.0, 1.00, 1.0]], ["ease-out", [0.00, 0.0, 0.58, 1.0]], ["ease-in-out", [0.42, 0.0, 0.58, 1.0]], ["easeInSine", [0.47, 0, 0.745, 0.715]], ["easeOutSine", [0.39, 0.575, 0.565, 1]], ["easeInOutSine", [0.445, 0.05, 0.55, 0.95]], ["easeInQuad", [0.55, 0.085, 0.68, 0.53]], ["easeOutQuad", [0.25, 0.46, 0.45, 0.94]], ["easeInOutQuad", [0.455, 0.03, 0.515, 0.955]], ["easeInCubic", [0.55, 0.055, 0.675, 0.19]], ["easeOutCubic", [0.215, 0.61, 0.355, 1]], ["easeInOutCubic", [0.645, 0.045, 0.355, 1]], ["easeInQuart", [0.895, 0.03, 0.685, 0.22]], ["easeOutQuart", [0.165, 0.84, 0.44, 1]], ["easeInOutQuart", [0.77, 0, 0.175, 1]], ["easeInQuint", [0.755, 0.05, 0.855, 0.06]], ["easeOutQuint", [0.23, 1, 0.32, 1]], ["easeInOutQuint", [0.86, 0, 0.07, 1]], ["easeInExpo", [0.95, 0.05, 0.795, 0.035]], ["easeOutExpo", [0.19, 1, 0.22, 1]], ["easeInOutExpo", [1, 0, 0, 1]], ["easeInCirc", [0.6, 0.04, 0.98, 0.335]], ["easeOutCirc", [0.075, 0.82, 0.165, 1]], ["easeInOutCirc", [0.785, 0.135, 0.15, 0.86]]], function (i, easingArray) {
            Velocity.Easings[easingArray[0]] = generateBezier.apply(null, easingArray[1]);
        });

        /* Determine the appropriate easing type given an easing input. */
        function getEasing(value, duration) {
            var easing = value;

            /* The easing option can either be a string that references a pre-registered easing,
             or it can be a two-/four-item array of integers to be converted into a bezier/spring function. */
            if (Type.isString(value)) {
                /* Ensure that the easing has been assigned to jQuery's Velocity.Easings object. */
                if (!Velocity.Easings[value]) {
                    easing = false;
                }
            } else if (Type.isArray(value) && value.length === 1) {
                easing = generateStep.apply(null, value);
            } else if (Type.isArray(value) && value.length === 2) {
                /* springRK4 must be passed the animation's duration. */
                /* Note: If the springRK4 array contains non-numbers, generateSpringRK4() returns an easing
                 function generated with default tension and friction values. */
                easing = generateSpringRK4.apply(null, value.concat([duration]));
            } else if (Type.isArray(value) && value.length === 4) {
                /* Note: If the bezier array contains non-numbers, generateBezier() returns false. */
                easing = generateBezier.apply(null, value);
            } else {
                easing = false;
            }

            /* Revert to the Velocity-wide default easing type, or fall back to "swing" (which is also jQuery's default)
             if the Velocity-wide default has been incorrectly modified. */
            if (easing === false) {
                if (Velocity.Easings[Velocity.defaults.easing]) {
                    easing = Velocity.defaults.easing;
                } else {
                    easing = EASING_DEFAULT;
                }
            }

            return easing;
        }

        /*****************
         CSS Stack
         *****************/

        /* The CSS object is a highly condensed and performant CSS stack that fully replaces jQuery's.
         It handles the validation, getting, and setting of both standard CSS properties and CSS property hooks. */
        /* Note: A "CSS" shorthand is aliased so that our code is easier to read. */
        var CSS = Velocity.CSS = {
            /*************
             RegEx
             *************/

            RegEx: {
                isHex: /^#([A-f\d]{3}){1,2}$/i,
                /* Unwrap a property value's surrounding text, e.g. "rgba(4, 3, 2, 1)" ==> "4, 3, 2, 1" and "rect(4px 3px 2px 1px)" ==> "4px 3px 2px 1px". */
                valueUnwrap: /^[A-z]+\((.*)\)$/i,
                wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
                /* Split a multi-value property into an array of subvalues, e.g. "rgba(4, 3, 2, 1) 4px 3px 2px 1px" ==> [ "rgba(4, 3, 2, 1)", "4px", "3px", "2px", "1px" ]. */
                valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/ig
            },
            /************
             Lists
             ************/

            Lists: {
                colors: ["fill", "stroke", "stopColor", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor"],
                transformsBase: ["translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ"],
                transforms3D: ["transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY"],
                units: ["%", // relative
                "em", "ex", "ch", "rem", // font relative
                "vw", "vh", "vmin", "vmax", // viewport relative
                "cm", "mm", "Q", "in", "pc", "pt", "px", // absolute lengths
                "deg", "grad", "rad", "turn", // angles
                "s", "ms" // time
                ],
                colorNames: {
                    "aliceblue": "240,248,255",
                    "antiquewhite": "250,235,215",
                    "aquamarine": "127,255,212",
                    "aqua": "0,255,255",
                    "azure": "240,255,255",
                    "beige": "245,245,220",
                    "bisque": "255,228,196",
                    "black": "0,0,0",
                    "blanchedalmond": "255,235,205",
                    "blueviolet": "138,43,226",
                    "blue": "0,0,255",
                    "brown": "165,42,42",
                    "burlywood": "222,184,135",
                    "cadetblue": "95,158,160",
                    "chartreuse": "127,255,0",
                    "chocolate": "210,105,30",
                    "coral": "255,127,80",
                    "cornflowerblue": "100,149,237",
                    "cornsilk": "255,248,220",
                    "crimson": "220,20,60",
                    "cyan": "0,255,255",
                    "darkblue": "0,0,139",
                    "darkcyan": "0,139,139",
                    "darkgoldenrod": "184,134,11",
                    "darkgray": "169,169,169",
                    "darkgrey": "169,169,169",
                    "darkgreen": "0,100,0",
                    "darkkhaki": "189,183,107",
                    "darkmagenta": "139,0,139",
                    "darkolivegreen": "85,107,47",
                    "darkorange": "255,140,0",
                    "darkorchid": "153,50,204",
                    "darkred": "139,0,0",
                    "darksalmon": "233,150,122",
                    "darkseagreen": "143,188,143",
                    "darkslateblue": "72,61,139",
                    "darkslategray": "47,79,79",
                    "darkturquoise": "0,206,209",
                    "darkviolet": "148,0,211",
                    "deeppink": "255,20,147",
                    "deepskyblue": "0,191,255",
                    "dimgray": "105,105,105",
                    "dimgrey": "105,105,105",
                    "dodgerblue": "30,144,255",
                    "firebrick": "178,34,34",
                    "floralwhite": "255,250,240",
                    "forestgreen": "34,139,34",
                    "fuchsia": "255,0,255",
                    "gainsboro": "220,220,220",
                    "ghostwhite": "248,248,255",
                    "gold": "255,215,0",
                    "goldenrod": "218,165,32",
                    "gray": "128,128,128",
                    "grey": "128,128,128",
                    "greenyellow": "173,255,47",
                    "green": "0,128,0",
                    "honeydew": "240,255,240",
                    "hotpink": "255,105,180",
                    "indianred": "205,92,92",
                    "indigo": "75,0,130",
                    "ivory": "255,255,240",
                    "khaki": "240,230,140",
                    "lavenderblush": "255,240,245",
                    "lavender": "230,230,250",
                    "lawngreen": "124,252,0",
                    "lemonchiffon": "255,250,205",
                    "lightblue": "173,216,230",
                    "lightcoral": "240,128,128",
                    "lightcyan": "224,255,255",
                    "lightgoldenrodyellow": "250,250,210",
                    "lightgray": "211,211,211",
                    "lightgrey": "211,211,211",
                    "lightgreen": "144,238,144",
                    "lightpink": "255,182,193",
                    "lightsalmon": "255,160,122",
                    "lightseagreen": "32,178,170",
                    "lightskyblue": "135,206,250",
                    "lightslategray": "119,136,153",
                    "lightsteelblue": "176,196,222",
                    "lightyellow": "255,255,224",
                    "limegreen": "50,205,50",
                    "lime": "0,255,0",
                    "linen": "250,240,230",
                    "magenta": "255,0,255",
                    "maroon": "128,0,0",
                    "mediumaquamarine": "102,205,170",
                    "mediumblue": "0,0,205",
                    "mediumorchid": "186,85,211",
                    "mediumpurple": "147,112,219",
                    "mediumseagreen": "60,179,113",
                    "mediumslateblue": "123,104,238",
                    "mediumspringgreen": "0,250,154",
                    "mediumturquoise": "72,209,204",
                    "mediumvioletred": "199,21,133",
                    "midnightblue": "25,25,112",
                    "mintcream": "245,255,250",
                    "mistyrose": "255,228,225",
                    "moccasin": "255,228,181",
                    "navajowhite": "255,222,173",
                    "navy": "0,0,128",
                    "oldlace": "253,245,230",
                    "olivedrab": "107,142,35",
                    "olive": "128,128,0",
                    "orangered": "255,69,0",
                    "orange": "255,165,0",
                    "orchid": "218,112,214",
                    "palegoldenrod": "238,232,170",
                    "palegreen": "152,251,152",
                    "paleturquoise": "175,238,238",
                    "palevioletred": "219,112,147",
                    "papayawhip": "255,239,213",
                    "peachpuff": "255,218,185",
                    "peru": "205,133,63",
                    "pink": "255,192,203",
                    "plum": "221,160,221",
                    "powderblue": "176,224,230",
                    "purple": "128,0,128",
                    "red": "255,0,0",
                    "rosybrown": "188,143,143",
                    "royalblue": "65,105,225",
                    "saddlebrown": "139,69,19",
                    "salmon": "250,128,114",
                    "sandybrown": "244,164,96",
                    "seagreen": "46,139,87",
                    "seashell": "255,245,238",
                    "sienna": "160,82,45",
                    "silver": "192,192,192",
                    "skyblue": "135,206,235",
                    "slateblue": "106,90,205",
                    "slategray": "112,128,144",
                    "snow": "255,250,250",
                    "springgreen": "0,255,127",
                    "steelblue": "70,130,180",
                    "tan": "210,180,140",
                    "teal": "0,128,128",
                    "thistle": "216,191,216",
                    "tomato": "255,99,71",
                    "turquoise": "64,224,208",
                    "violet": "238,130,238",
                    "wheat": "245,222,179",
                    "whitesmoke": "245,245,245",
                    "white": "255,255,255",
                    "yellowgreen": "154,205,50",
                    "yellow": "255,255,0"
                }
            },
            /************
             Hooks
             ************/

            /* Hooks allow a subproperty (e.g. "boxShadowBlur") of a compound-value CSS property
             (e.g. "boxShadow: X Y Blur Spread Color") to be animated as if it were a discrete property. */
            /* Note: Beyond enabling fine-grained property animation, hooking is necessary since Velocity only
             tweens properties with single numeric values; unlike CSS transitions, Velocity does not interpolate compound-values. */
            Hooks: {
                /********************
                 Registration
                 ********************/

                /* Templates are a concise way of indicating which subproperties must be individually registered for each compound-value CSS property. */
                /* Each template consists of the compound-value's base name, its constituent subproperty names, and those subproperties' default values. */
                templates: {
                    "textShadow": ["Color X Y Blur", "black 0px 0px 0px"],
                    "boxShadow": ["Color X Y Blur Spread", "black 0px 0px 0px 0px"],
                    "clip": ["Top Right Bottom Left", "0px 0px 0px 0px"],
                    "backgroundPosition": ["X Y", "0% 0%"],
                    "transformOrigin": ["X Y Z", "50% 50% 0px"],
                    "perspectiveOrigin": ["X Y", "50% 50%"]
                },
                /* A "registered" hook is one that has been converted from its template form into a live,
                 tweenable property. It contains data to associate it with its root property. */
                registered: {
                    /* Note: A registered hook looks like this ==> textShadowBlur: [ "textShadow", 3 ],
                     which consists of the subproperty's name, the associated root property's name,
                     and the subproperty's position in the root's value. */
                },
                /* Convert the templates into individual hooks then append them to the registered object above. */
                register: function register() {
                    /* Color hooks registration: Colors are defaulted to white -- as opposed to black -- since colors that are
                     currently set to "transparent" default to their respective template below when color-animated,
                     and white is typically a closer match to transparent than black is. An exception is made for text ("color"),
                     which is almost always set closer to black than white. */
                    for (var i = 0; i < CSS.Lists.colors.length; i++) {
                        var rgbComponents = CSS.Lists.colors[i] === "color" ? "0 0 0 1" : "255 255 255 1";
                        CSS.Hooks.templates[CSS.Lists.colors[i]] = ["Red Green Blue Alpha", rgbComponents];
                    }

                    var rootProperty, hookTemplate, hookNames;

                    /* In IE, color values inside compound-value properties are positioned at the end the value instead of at the beginning.
                     Thus, we re-arrange the templates accordingly. */
                    if (IE) {
                        for (rootProperty in CSS.Hooks.templates) {
                            if (!CSS.Hooks.templates.hasOwnProperty(rootProperty)) {
                                continue;
                            }
                            hookTemplate = CSS.Hooks.templates[rootProperty];
                            hookNames = hookTemplate[0].split(" ");

                            var defaultValues = hookTemplate[1].match(CSS.RegEx.valueSplit);

                            if (hookNames[0] === "Color") {
                                /* Reposition both the hook's name and its default value to the end of their respective strings. */
                                hookNames.push(hookNames.shift());
                                defaultValues.push(defaultValues.shift());

                                /* Replace the existing template for the hook's root property. */
                                CSS.Hooks.templates[rootProperty] = [hookNames.join(" "), defaultValues.join(" ")];
                            }
                        }
                    }

                    /* Hook registration. */
                    for (rootProperty in CSS.Hooks.templates) {
                        if (!CSS.Hooks.templates.hasOwnProperty(rootProperty)) {
                            continue;
                        }
                        hookTemplate = CSS.Hooks.templates[rootProperty];
                        hookNames = hookTemplate[0].split(" ");

                        for (var j in hookNames) {
                            if (!hookNames.hasOwnProperty(j)) {
                                continue;
                            }
                            var fullHookName = rootProperty + hookNames[j],
                                hookPosition = j;

                            /* For each hook, register its full name (e.g. textShadowBlur) with its root property (e.g. textShadow)
                             and the hook's position in its template's default value string. */
                            CSS.Hooks.registered[fullHookName] = [rootProperty, hookPosition];
                        }
                    }
                },
                /*****************************
                 Injection and Extraction
                 *****************************/

                /* Look up the root property associated with the hook (e.g. return "textShadow" for "textShadowBlur"). */
                /* Since a hook cannot be set directly (the browser won't recognize it), style updating for hooks is routed through the hook's root property. */
                getRoot: function getRoot(property) {
                    var hookData = CSS.Hooks.registered[property];

                    if (hookData) {
                        return hookData[0];
                    } else {
                        /* If there was no hook match, return the property name untouched. */
                        return property;
                    }
                },
                getUnit: function getUnit(str, start) {
                    var unit = (str.substr(start || 0, 5).match(/^[a-z%]+/) || [])[0] || "";

                    if (unit && CSS.Lists.units.indexOf(unit) >= 0) {
                        return unit;
                    }
                    return "";
                },
                fixColors: function fixColors(str) {
                    return str.replace(/(rgba?\(\s*)?(\b[a-z]+\b)/g, function ($0, $1, $2) {
                        if (CSS.Lists.colorNames.hasOwnProperty($2)) {
                            return ($1 ? $1 : "rgba(") + CSS.Lists.colorNames[$2] + ($1 ? "" : ",1)");
                        }
                        return $1 + $2;
                    });
                },
                /* Convert any rootPropertyValue, null or otherwise, into a space-delimited list of hook values so that
                 the targeted hook can be injected or extracted at its standard position. */
                cleanRootPropertyValue: function cleanRootPropertyValue(rootProperty, rootPropertyValue) {
                    /* If the rootPropertyValue is wrapped with "rgb()", "clip()", etc., remove the wrapping to normalize the value before manipulation. */
                    if (CSS.RegEx.valueUnwrap.test(rootPropertyValue)) {
                        rootPropertyValue = rootPropertyValue.match(CSS.RegEx.valueUnwrap)[1];
                    }

                    /* If rootPropertyValue is a CSS null-value (from which there's inherently no hook value to extract),
                     default to the root's default value as defined in CSS.Hooks.templates. */
                    /* Note: CSS null-values include "none", "auto", and "transparent". They must be converted into their
                     zero-values (e.g. textShadow: "none" ==> textShadow: "0px 0px 0px black") for hook manipulation to proceed. */
                    if (CSS.Values.isCSSNullValue(rootPropertyValue)) {
                        rootPropertyValue = CSS.Hooks.templates[rootProperty][1];
                    }

                    return rootPropertyValue;
                },
                /* Extracted the hook's value from its root property's value. This is used to get the starting value of an animating hook. */
                extractValue: function extractValue(fullHookName, rootPropertyValue) {
                    var hookData = CSS.Hooks.registered[fullHookName];

                    if (hookData) {
                        var hookRoot = hookData[0],
                            hookPosition = hookData[1];

                        rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

                        /* Split rootPropertyValue into its constituent hook values then grab the desired hook at its standard position. */
                        return rootPropertyValue.toString().match(CSS.RegEx.valueSplit)[hookPosition];
                    } else {
                        /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
                        return rootPropertyValue;
                    }
                },
                /* Inject the hook's value into its root property's value. This is used to piece back together the root property
                 once Velocity has updated one of its individually hooked values through tweening. */
                injectValue: function injectValue(fullHookName, hookValue, rootPropertyValue) {
                    var hookData = CSS.Hooks.registered[fullHookName];

                    if (hookData) {
                        var hookRoot = hookData[0],
                            hookPosition = hookData[1],
                            rootPropertyValueParts,
                            rootPropertyValueUpdated;

                        rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

                        /* Split rootPropertyValue into its individual hook values, replace the targeted value with hookValue,
                         then reconstruct the rootPropertyValue string. */
                        rootPropertyValueParts = rootPropertyValue.toString().match(CSS.RegEx.valueSplit);
                        rootPropertyValueParts[hookPosition] = hookValue;
                        rootPropertyValueUpdated = rootPropertyValueParts.join(" ");

                        return rootPropertyValueUpdated;
                    } else {
                        /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
                        return rootPropertyValue;
                    }
                }
            },
            /*******************
             Normalizations
             *******************/

            /* Normalizations standardize CSS property manipulation by pollyfilling browser-specific implementations (e.g. opacity)
             and reformatting special properties (e.g. clip, rgba) to look like standard ones. */
            Normalizations: {
                /* Normalizations are passed a normalization target (either the property's name, its extracted value, or its injected value),
                 the targeted element (which may need to be queried), and the targeted property value. */
                registered: {
                    clip: function clip(type, element, propertyValue) {
                        switch (type) {
                            case "name":
                                return "clip";
                            /* Clip needs to be unwrapped and stripped of its commas during extraction. */
                            case "extract":
                                var extracted;

                                /* If Velocity also extracted this value, skip extraction. */
                                if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                                    extracted = propertyValue;
                                } else {
                                    /* Remove the "rect()" wrapper. */
                                    extracted = propertyValue.toString().match(CSS.RegEx.valueUnwrap);

                                    /* Strip off commas. */
                                    extracted = extracted ? extracted[1].replace(/,(\s+)?/g, " ") : propertyValue;
                                }

                                return extracted;
                            /* Clip needs to be re-wrapped during injection. */
                            case "inject":
                                return "rect(" + propertyValue + ")";
                        }
                    },
                    blur: function blur(type, element, propertyValue) {
                        switch (type) {
                            case "name":
                                return Velocity.State.isFirefox ? "filter" : "-webkit-filter";
                            case "extract":
                                var extracted = parseFloat(propertyValue);

                                /* If extracted is NaN, meaning the value isn't already extracted. */
                                if (!(extracted || extracted === 0)) {
                                    var blurComponent = propertyValue.toString().match(/blur\(([0-9]+[A-z]+)\)/i);

                                    /* If the filter string had a blur component, return just the blur value and unit type. */
                                    if (blurComponent) {
                                        extracted = blurComponent[1];
                                        /* If the component doesn't exist, default blur to 0. */
                                    } else {
                                        extracted = 0;
                                    }
                                }

                                return extracted;
                            /* Blur needs to be re-wrapped during injection. */
                            case "inject":
                                /* For the blur effect to be fully de-applied, it needs to be set to "none" instead of 0. */
                                if (!parseFloat(propertyValue)) {
                                    return "none";
                                } else {
                                    return "blur(" + propertyValue + ")";
                                }
                        }
                    },
                    /* <=IE8 do not support the standard opacity property. They use filter:alpha(opacity=INT) instead. */
                    opacity: function opacity(type, element, propertyValue) {
                        if (IE <= 8) {
                            switch (type) {
                                case "name":
                                    return "filter";
                                case "extract":
                                    /* <=IE8 return a "filter" value of "alpha(opacity=\d{1,3})".
                                     Extract the value and convert it to a decimal value to match the standard CSS opacity property's formatting. */
                                    var extracted = propertyValue.toString().match(/alpha\(opacity=(.*)\)/i);

                                    if (extracted) {
                                        /* Convert to decimal value. */
                                        propertyValue = extracted[1] / 100;
                                    } else {
                                        /* When extracting opacity, default to 1 since a null value means opacity hasn't been set. */
                                        propertyValue = 1;
                                    }

                                    return propertyValue;
                                case "inject":
                                    /* Opacified elements are required to have their zoom property set to a non-zero value. */
                                    element.style.zoom = 1;

                                    /* Setting the filter property on elements with certain font property combinations can result in a
                                     highly unappealing ultra-bolding effect. There's no way to remedy this throughout a tween, but dropping the
                                     value altogether (when opacity hits 1) at leasts ensures that the glitch is gone post-tweening. */
                                    if (parseFloat(propertyValue) >= 1) {
                                        return "";
                                    } else {
                                        /* As per the filter property's spec, convert the decimal value to a whole number and wrap the value. */
                                        return "alpha(opacity=" + parseInt(parseFloat(propertyValue) * 100, 10) + ")";
                                    }
                            }
                            /* With all other browsers, normalization is not required; return the same values that were passed in. */
                        } else {
                            switch (type) {
                                case "name":
                                    return "opacity";
                                case "extract":
                                    return propertyValue;
                                case "inject":
                                    return propertyValue;
                            }
                        }
                    }
                },
                /*****************************
                 Batched Registrations
                 *****************************/

                /* Note: Batched normalizations extend the CSS.Normalizations.registered object. */
                register: function register() {

                    /*****************
                     Transforms
                     *****************/

                    /* Transforms are the subproperties contained by the CSS "transform" property. Transforms must undergo normalization
                     so that they can be referenced in a properties map by their individual names. */
                    /* Note: When transforms are "set", they are actually assigned to a per-element transformCache. When all transform
                     setting is complete complete, CSS.flushTransformCache() must be manually called to flush the values to the DOM.
                     Transform setting is batched in this way to improve performance: the transform style only needs to be updated
                     once when multiple transform subproperties are being animated simultaneously. */
                    /* Note: IE9 and Android Gingerbread have support for 2D -- but not 3D -- transforms. Since animating unsupported
                     transform properties results in the browser ignoring the *entire* transform string, we prevent these 3D values
                     from being normalized for these browsers so that tweening skips these properties altogether
                     (since it will ignore them as being unsupported by the browser.) */
                    if ((!IE || IE > 9) && !Velocity.State.isGingerbread) {
                        /* Note: Since the standalone CSS "perspective" property and the CSS transform "perspective" subproperty
                         share the same name, the latter is given a unique token within Velocity: "transformPerspective". */
                        CSS.Lists.transformsBase = CSS.Lists.transformsBase.concat(CSS.Lists.transforms3D);
                    }

                    for (var i = 0; i < CSS.Lists.transformsBase.length; i++) {
                        /* Wrap the dynamically generated normalization function in a new scope so that transformName's value is
                         paired with its respective function. (Otherwise, all functions would take the final for loop's transformName.) */
                        (function () {
                            var transformName = CSS.Lists.transformsBase[i];

                            CSS.Normalizations.registered[transformName] = function (type, element, propertyValue) {
                                switch (type) {
                                    /* The normalized property name is the parent "transform" property -- the property that is actually set in CSS. */
                                    case "name":
                                        return "transform";
                                    /* Transform values are cached onto a per-element transformCache object. */
                                    case "extract":
                                        /* If this transform has yet to be assigned a value, return its null value. */
                                        if (Data(element) === undefined || Data(element).transformCache[transformName] === undefined) {
                                            /* Scale CSS.Lists.transformsBase default to 1 whereas all other transform properties default to 0. */
                                            return (/^scale/i.test(transformName) ? 1 : 0
                                            );
                                            /* When transform values are set, they are wrapped in parentheses as per the CSS spec.
                                             Thus, when extracting their values (for tween calculations), we strip off the parentheses. */
                                        }
                                        return Data(element).transformCache[transformName].replace(/[()]/g, "");
                                    case "inject":
                                        var invalid = false;

                                        /* If an individual transform property contains an unsupported unit type, the browser ignores the *entire* transform property.
                                         Thus, protect users from themselves by skipping setting for transform values supplied with invalid unit types. */
                                        /* Switch on the base transform type; ignore the axis by removing the last letter from the transform's name. */
                                        switch (transformName.substr(0, transformName.length - 1)) {
                                            /* Whitelist unit types for each transform. */
                                            case "translate":
                                                invalid = !/(%|px|em|rem|vw|vh|\d)$/i.test(propertyValue);
                                                break;
                                            /* Since an axis-free "scale" property is supported as well, a little hack is used here to detect it by chopping off its last letter. */
                                            case "scal":
                                            case "scale":
                                                /* Chrome on Android has a bug in which scaled elements blur if their initial scale
                                                 value is below 1 (which can happen with forcefeeding). Thus, we detect a yet-unset scale property
                                                 and ensure that its first value is always 1. More info: http://stackoverflow.com/questions/10417890/css3-animations-with-transform-causes-blurred-elements-on-webkit/10417962#10417962 */
                                                if (Velocity.State.isAndroid && Data(element).transformCache[transformName] === undefined && propertyValue < 1) {
                                                    propertyValue = 1;
                                                }

                                                invalid = !/(\d)$/i.test(propertyValue);
                                                break;
                                            case "skew":
                                                invalid = !/(deg|\d)$/i.test(propertyValue);
                                                break;
                                            case "rotate":
                                                invalid = !/(deg|\d)$/i.test(propertyValue);
                                                break;
                                        }

                                        if (!invalid) {
                                            /* As per the CSS spec, wrap the value in parentheses. */
                                            Data(element).transformCache[transformName] = "(" + propertyValue + ")";
                                        }

                                        /* Although the value is set on the transformCache object, return the newly-updated value for the calling code to process as normal. */
                                        return Data(element).transformCache[transformName];
                                }
                            };
                        })();
                    }

                    /*************
                     Colors
                     *************/

                    /* Since Velocity only animates a single numeric value per property, color animation is achieved by hooking the individual RGBA components of CSS color properties.
                     Accordingly, color values must be normalized (e.g. "#ff0000", "red", and "rgb(255, 0, 0)" ==> "255 0 0 1") so that their components can be injected/extracted by CSS.Hooks logic. */
                    for (var j = 0; j < CSS.Lists.colors.length; j++) {
                        /* Wrap the dynamically generated normalization function in a new scope so that colorName's value is paired with its respective function.
                         (Otherwise, all functions would take the final for loop's colorName.) */
                        (function () {
                            var colorName = CSS.Lists.colors[j];

                            /* Note: In IE<=8, which support rgb but not rgba, color properties are reverted to rgb by stripping off the alpha component. */
                            CSS.Normalizations.registered[colorName] = function (type, element, propertyValue) {
                                switch (type) {
                                    case "name":
                                        return colorName;
                                    /* Convert all color values into the rgb format. (Old IE can return hex values and color names instead of rgb/rgba.) */
                                    case "extract":
                                        var extracted;

                                        /* If the color is already in its hookable form (e.g. "255 255 255 1") due to having been previously extracted, skip extraction. */
                                        if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                                            extracted = propertyValue;
                                        } else {
                                            var converted,
                                                colorNames = {
                                                black: "rgb(0, 0, 0)",
                                                blue: "rgb(0, 0, 255)",
                                                gray: "rgb(128, 128, 128)",
                                                green: "rgb(0, 128, 0)",
                                                red: "rgb(255, 0, 0)",
                                                white: "rgb(255, 255, 255)"
                                            };

                                            /* Convert color names to rgb. */
                                            if (/^[A-z]+$/i.test(propertyValue)) {
                                                if (colorNames[propertyValue] !== undefined) {
                                                    converted = colorNames[propertyValue];
                                                } else {
                                                    /* If an unmatched color name is provided, default to black. */
                                                    converted = colorNames.black;
                                                }
                                                /* Convert hex values to rgb. */
                                            } else if (CSS.RegEx.isHex.test(propertyValue)) {
                                                converted = "rgb(" + CSS.Values.hexToRgb(propertyValue).join(" ") + ")";
                                                /* If the provided color doesn't match any of the accepted color formats, default to black. */
                                            } else if (!/^rgba?\(/i.test(propertyValue)) {
                                                converted = colorNames.black;
                                            }

                                            /* Remove the surrounding "rgb/rgba()" string then replace commas with spaces and strip
                                             repeated spaces (in case the value included spaces to begin with). */
                                            extracted = (converted || propertyValue).toString().match(CSS.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, " ");
                                        }

                                        /* So long as this isn't <=IE8, add a fourth (alpha) component if it's missing and default it to 1 (visible). */
                                        if ((!IE || IE > 8) && extracted.split(" ").length === 3) {
                                            extracted += " 1";
                                        }

                                        return extracted;
                                    case "inject":
                                        /* If we have a pattern then it might already have the right values */
                                        if (/^rgb/.test(propertyValue)) {
                                            return propertyValue;
                                        }

                                        /* If this is IE<=8 and an alpha component exists, strip it off. */
                                        if (IE <= 8) {
                                            if (propertyValue.split(" ").length === 4) {
                                                propertyValue = propertyValue.split(/\s+/).slice(0, 3).join(" ");
                                            }
                                            /* Otherwise, add a fourth (alpha) component if it's missing and default it to 1 (visible). */
                                        } else if (propertyValue.split(" ").length === 3) {
                                            propertyValue += " 1";
                                        }

                                        /* Re-insert the browser-appropriate wrapper("rgb/rgba()"), insert commas, and strip off decimal units
                                         on all values but the fourth (R, G, and B only accept whole numbers). */
                                        return (IE <= 8 ? "rgb" : "rgba") + "(" + propertyValue.replace(/\s+/g, ",").replace(/\.(\d)+(?=,)/g, "") + ")";
                                }
                            };
                        })();
                    }

                    /**************
                     Dimensions
                     **************/
                    function augmentDimension(name, element, wantInner) {
                        var isBorderBox = CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() === "border-box";

                        if (isBorderBox === (wantInner || false)) {
                            /* in box-sizing mode, the CSS width / height accessors already give the outerWidth / outerHeight. */
                            var i,
                                value,
                                augment = 0,
                                sides = name === "width" ? ["Left", "Right"] : ["Top", "Bottom"],
                                fields = ["padding" + sides[0], "padding" + sides[1], "border" + sides[0] + "Width", "border" + sides[1] + "Width"];

                            for (i = 0; i < fields.length; i++) {
                                value = parseFloat(CSS.getPropertyValue(element, fields[i]));
                                if (!isNaN(value)) {
                                    augment += value;
                                }
                            }
                            return wantInner ? -augment : augment;
                        }
                        return 0;
                    }
                    function getDimension(name, wantInner) {
                        return function (type, element, propertyValue) {
                            switch (type) {
                                case "name":
                                    return name;
                                case "extract":
                                    return parseFloat(propertyValue) + augmentDimension(name, element, wantInner);
                                case "inject":
                                    return parseFloat(propertyValue) - augmentDimension(name, element, wantInner) + "px";
                            }
                        };
                    }
                    CSS.Normalizations.registered.innerWidth = getDimension("width", true);
                    CSS.Normalizations.registered.innerHeight = getDimension("height", true);
                    CSS.Normalizations.registered.outerWidth = getDimension("width");
                    CSS.Normalizations.registered.outerHeight = getDimension("height");
                }
            },
            /************************
             CSS Property Names
             ************************/

            Names: {
                /* Camelcase a property name into its JavaScript notation (e.g. "background-color" ==> "backgroundColor").
                 Camelcasing is used to normalize property names between and across calls. */
                camelCase: function camelCase(property) {
                    return property.replace(/-(\w)/g, function (match, subMatch) {
                        return subMatch.toUpperCase();
                    });
                },
                /* For SVG elements, some properties (namely, dimensional ones) are GET/SET via the element's HTML attributes (instead of via CSS styles). */
                SVGAttribute: function SVGAttribute(property) {
                    var SVGAttributes = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";

                    /* Certain browsers require an SVG transform to be applied as an attribute. (Otherwise, application via CSS is preferable due to 3D support.) */
                    if (IE || Velocity.State.isAndroid && !Velocity.State.isChrome) {
                        SVGAttributes += "|transform";
                    }

                    return new RegExp("^(" + SVGAttributes + ")$", "i").test(property);
                },
                /* Determine whether a property should be set with a vendor prefix. */
                /* If a prefixed version of the property exists, return it. Otherwise, return the original property name.
                 If the property is not at all supported by the browser, return a false flag. */
                prefixCheck: function prefixCheck(property) {
                    /* If this property has already been checked, return the cached value. */
                    if (Velocity.State.prefixMatches[property]) {
                        return [Velocity.State.prefixMatches[property], true];
                    } else {
                        var vendors = ["", "Webkit", "Moz", "ms", "O"];

                        for (var i = 0, vendorsLength = vendors.length; i < vendorsLength; i++) {
                            var propertyPrefixed;

                            if (i === 0) {
                                propertyPrefixed = property;
                            } else {
                                /* Capitalize the first letter of the property to conform to JavaScript vendor prefix notation (e.g. webkitFilter). */
                                propertyPrefixed = vendors[i] + property.replace(/^\w/, function (match) {
                                    return match.toUpperCase();
                                });
                            }

                            /* Check if the browser supports this property as prefixed. */
                            if (Type.isString(Velocity.State.prefixElement.style[propertyPrefixed])) {
                                /* Cache the match. */
                                Velocity.State.prefixMatches[property] = propertyPrefixed;

                                return [propertyPrefixed, true];
                            }
                        }

                        /* If the browser doesn't support this property in any form, include a false flag so that the caller can decide how to proceed. */
                        return [property, false];
                    }
                }
            },
            /************************
             CSS Property Values
             ************************/

            Values: {
                /* Hex to RGB conversion. Copyright Tim Down: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb */
                hexToRgb: function hexToRgb(hex) {
                    var shortformRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
                        longformRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
                        rgbParts;

                    hex = hex.replace(shortformRegex, function (m, r, g, b) {
                        return r + r + g + g + b + b;
                    });

                    rgbParts = longformRegex.exec(hex);

                    return rgbParts ? [parseInt(rgbParts[1], 16), parseInt(rgbParts[2], 16), parseInt(rgbParts[3], 16)] : [0, 0, 0];
                },
                isCSSNullValue: function isCSSNullValue(value) {
                    /* The browser defaults CSS values that have not been set to either 0 or one of several possible null-value strings.
                     Thus, we check for both falsiness and these special strings. */
                    /* Null-value checking is performed to default the special strings to 0 (for the sake of tweening) or their hook
                     templates as defined as CSS.Hooks (for the sake of hook injection/extraction). */
                    /* Note: Chrome returns "rgba(0, 0, 0, 0)" for an undefined color whereas IE returns "transparent". */
                    return !value || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(value);
                },
                /* Retrieve a property's default unit type. Used for assigning a unit type when one is not supplied by the user. */
                getUnitType: function getUnitType(property) {
                    if (/^(rotate|skew)/i.test(property)) {
                        return "deg";
                    } else if (/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(property)) {
                        /* The above properties are unitless. */
                        return "";
                    } else {
                        /* Default to px for all other properties. */
                        return "px";
                    }
                },
                /* HTML elements default to an associated display type when they're not set to display:none. */
                /* Note: This function is used for correctly setting the non-"none" display value in certain Velocity redirects, such as fadeIn/Out. */
                getDisplayType: function getDisplayType(element) {
                    var tagName = element && element.tagName.toString().toLowerCase();

                    if (/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(tagName)) {
                        return "inline";
                    } else if (/^(li)$/i.test(tagName)) {
                        return "list-item";
                    } else if (/^(tr)$/i.test(tagName)) {
                        return "table-row";
                    } else if (/^(table)$/i.test(tagName)) {
                        return "table";
                    } else if (/^(tbody)$/i.test(tagName)) {
                        return "table-row-group";
                        /* Default to "block" when no match is found. */
                    } else {
                        return "block";
                    }
                },
                /* The class add/remove functions are used to temporarily apply a "velocity-animating" class to elements while they're animating. */
                addClass: function addClass(element, className) {
                    if (element) {
                        if (element.classList) {
                            element.classList.add(className);
                        } else if (Type.isString(element.className)) {
                            // Element.className is around 15% faster then set/getAttribute
                            element.className += (element.className.length ? " " : "") + className;
                        } else {
                            // Work around for IE strict mode animating SVG - and anything else that doesn't behave correctly - the same way jQuery does it
                            var currentClass = element.getAttribute(IE <= 7 ? "className" : "class") || "";

                            element.setAttribute("class", currentClass + (currentClass ? " " : "") + className);
                        }
                    }
                },
                removeClass: function removeClass(element, className) {
                    if (element) {
                        if (element.classList) {
                            element.classList.remove(className);
                        } else if (Type.isString(element.className)) {
                            // Element.className is around 15% faster then set/getAttribute
                            // TODO: Need some jsperf tests on performance - can we get rid of the regex and maybe use split / array manipulation?
                            element.className = element.className.toString().replace(new RegExp("(^|\\s)" + className.split(" ").join("|") + "(\\s|$)", "gi"), " ");
                        } else {
                            // Work around for IE strict mode animating SVG - and anything else that doesn't behave correctly - the same way jQuery does it
                            var currentClass = element.getAttribute(IE <= 7 ? "className" : "class") || "";

                            element.setAttribute("class", currentClass.replace(new RegExp("(^|\s)" + className.split(" ").join("|") + "(\s|$)", "gi"), " "));
                        }
                    }
                }
            },
            /****************************
             Style Getting & Setting
             ****************************/

            /* The singular getPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
            getPropertyValue: function getPropertyValue(element, property, rootPropertyValue, forceStyleLookup) {
                /* Get an element's computed property value. */
                /* Note: Retrieving the value of a CSS property cannot simply be performed by checking an element's
                 style attribute (which only reflects user-defined values). Instead, the browser must be queried for a property's
                 *computed* value. You can read more about getComputedStyle here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
                function computePropertyValue(element, property) {
                    /* When box-sizing isn't set to border-box, height and width style values are incorrectly computed when an
                     element's scrollbars are visible (which expands the element's dimensions). Thus, we defer to the more accurate
                     offsetHeight/Width property, which includes the total dimensions for interior, border, padding, and scrollbar.
                     We subtract border and padding to get the sum of interior + scrollbar. */
                    var computedValue = 0;

                    /* IE<=8 doesn't support window.getComputedStyle, thus we defer to jQuery, which has an extensive array
                     of hacks to accurately retrieve IE8 property values. Re-implementing that logic here is not worth bloating the
                     codebase for a dying browser. The performance repercussions of using jQuery here are minimal since
                     Velocity is optimized to rarely (and sometimes never) query the DOM. Further, the $.css() codepath isn't that slow. */
                    if (IE <= 8) {
                        computedValue = $.css(element, property); /* GET */
                        /* All other browsers support getComputedStyle. The returned live object reference is cached onto its
                         associated element so that it does not need to be refetched upon every GET. */
                    } else {
                        /* Browsers do not return height and width values for elements that are set to display:"none". Thus, we temporarily
                         toggle display to the element type's default value. */
                        var toggleDisplay = false;

                        if (/^(width|height)$/.test(property) && CSS.getPropertyValue(element, "display") === 0) {
                            toggleDisplay = true;
                            CSS.setPropertyValue(element, "display", CSS.Values.getDisplayType(element));
                        }

                        var revertDisplay = function revertDisplay() {
                            if (toggleDisplay) {
                                CSS.setPropertyValue(element, "display", "none");
                            }
                        };

                        if (!forceStyleLookup) {
                            if (property === "height" && CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
                                var contentBoxHeight = element.offsetHeight - (parseFloat(CSS.getPropertyValue(element, "borderTopWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "borderBottomWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingTop")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingBottom")) || 0);
                                revertDisplay();

                                return contentBoxHeight;
                            } else if (property === "width" && CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
                                var contentBoxWidth = element.offsetWidth - (parseFloat(CSS.getPropertyValue(element, "borderLeftWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "borderRightWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingLeft")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingRight")) || 0);
                                revertDisplay();

                                return contentBoxWidth;
                            }
                        }

                        var computedStyle;

                        /* For elements that Velocity hasn't been called on directly (e.g. when Velocity queries the DOM on behalf
                         of a parent of an element its animating), perform a direct getComputedStyle lookup since the object isn't cached. */
                        if (Data(element) === undefined) {
                            computedStyle = window.getComputedStyle(element, null); /* GET */
                            /* If the computedStyle object has yet to be cached, do so now. */
                        } else if (!Data(element).computedStyle) {
                            computedStyle = Data(element).computedStyle = window.getComputedStyle(element, null); /* GET */
                            /* If computedStyle is cached, use it. */
                        } else {
                            computedStyle = Data(element).computedStyle;
                        }

                        /* IE and Firefox do not return a value for the generic borderColor -- they only return individual values for each border side's color.
                         Also, in all browsers, when border colors aren't all the same, a compound value is returned that Velocity isn't setup to parse.
                         So, as a polyfill for querying individual border side colors, we just return the top border's color and animate all borders from that value. */
                        if (property === "borderColor") {
                            property = "borderTopColor";
                        }

                        /* IE9 has a bug in which the "filter" property must be accessed from computedStyle using the getPropertyValue method
                         instead of a direct property lookup. The getPropertyValue method is slower than a direct lookup, which is why we avoid it by default. */
                        if (IE === 9 && property === "filter") {
                            computedValue = computedStyle.getPropertyValue(property); /* GET */
                        } else {
                            computedValue = computedStyle[property];
                        }

                        /* Fall back to the property's style value (if defined) when computedValue returns nothing,
                         which can happen when the element hasn't been painted. */
                        if (computedValue === "" || computedValue === null) {
                            computedValue = element.style[property];
                        }

                        revertDisplay();
                    }

                    /* For top, right, bottom, and left (TRBL) values that are set to "auto" on elements of "fixed" or "absolute" position,
                     defer to jQuery for converting "auto" to a numeric value. (For elements with a "static" or "relative" position, "auto" has the same
                     effect as being set to 0, so no conversion is necessary.) */
                    /* An example of why numeric conversion is necessary: When an element with "position:absolute" has an untouched "left"
                     property, which reverts to "auto", left's value is 0 relative to its parent element, but is often non-zero relative
                     to its *containing* (not parent) element, which is the nearest "position:relative" ancestor or the viewport (and always the viewport in the case of "position:fixed"). */
                    if (computedValue === "auto" && /^(top|right|bottom|left)$/i.test(property)) {
                        var position = computePropertyValue(element, "position"); /* GET */

                        /* For absolute positioning, jQuery's $.position() only returns values for top and left;
                         right and bottom will have their "auto" value reverted to 0. */
                        /* Note: A jQuery object must be created here since jQuery doesn't have a low-level alias for $.position().
                         Not a big deal since we're currently in a GET batch anyway. */
                        if (position === "fixed" || position === "absolute" && /top|left/i.test(property)) {
                            /* Note: jQuery strips the pixel unit from its returned values; we re-add it here to conform with computePropertyValue's behavior. */
                            computedValue = $(element).position()[property] + "px"; /* GET */
                        }
                    }

                    return computedValue;
                }

                var propertyValue;

                /* If this is a hooked property (e.g. "clipLeft" instead of the root property of "clip"),
                 extract the hook's value from a normalized rootPropertyValue using CSS.Hooks.extractValue(). */
                if (CSS.Hooks.registered[property]) {
                    var hook = property,
                        hookRoot = CSS.Hooks.getRoot(hook);

                    /* If a cached rootPropertyValue wasn't passed in (which Velocity always attempts to do in order to avoid requerying the DOM),
                     query the DOM for the root property's value. */
                    if (rootPropertyValue === undefined) {
                        /* Since the browser is now being directly queried, use the official post-prefixing property name for this lookup. */
                        rootPropertyValue = CSS.getPropertyValue(element, CSS.Names.prefixCheck(hookRoot)[0]); /* GET */
                    }

                    /* If this root has a normalization registered, peform the associated normalization extraction. */
                    if (CSS.Normalizations.registered[hookRoot]) {
                        rootPropertyValue = CSS.Normalizations.registered[hookRoot]("extract", element, rootPropertyValue);
                    }

                    /* Extract the hook's value. */
                    propertyValue = CSS.Hooks.extractValue(hook, rootPropertyValue);

                    /* If this is a normalized property (e.g. "opacity" becomes "filter" in <=IE8) or "translateX" becomes "transform"),
                     normalize the property's name and value, and handle the special case of transforms. */
                    /* Note: Normalizing a property is mutually exclusive from hooking a property since hook-extracted values are strictly
                     numerical and therefore do not require normalization extraction. */
                } else if (CSS.Normalizations.registered[property]) {
                    var normalizedPropertyName, normalizedPropertyValue;

                    normalizedPropertyName = CSS.Normalizations.registered[property]("name", element);

                    /* Transform values are calculated via normalization extraction (see below), which checks against the element's transformCache.
                     At no point do transform GETs ever actually query the DOM; initial stylesheet values are never processed.
                     This is because parsing 3D transform matrices is not always accurate and would bloat our codebase;
                     thus, normalization extraction defaults initial transform values to their zero-values (e.g. 1 for scaleX and 0 for translateX). */
                    if (normalizedPropertyName !== "transform") {
                        normalizedPropertyValue = computePropertyValue(element, CSS.Names.prefixCheck(normalizedPropertyName)[0]); /* GET */

                        /* If the value is a CSS null-value and this property has a hook template, use that zero-value template so that hooks can be extracted from it. */
                        if (CSS.Values.isCSSNullValue(normalizedPropertyValue) && CSS.Hooks.templates[property]) {
                            normalizedPropertyValue = CSS.Hooks.templates[property][1];
                        }
                    }

                    propertyValue = CSS.Normalizations.registered[property]("extract", element, normalizedPropertyValue);
                }

                /* If a (numeric) value wasn't produced via hook extraction or normalization, query the DOM. */
                if (!/^[\d-]/.test(propertyValue)) {
                    /* For SVG elements, dimensional properties (which SVGAttribute() detects) are tweened via
                     their HTML attribute values instead of their CSS style values. */
                    var data = Data(element);

                    if (data && data.isSVG && CSS.Names.SVGAttribute(property)) {
                        /* Since the height/width attribute values must be set manually, they don't reflect computed values.
                         Thus, we use use getBBox() to ensure we always get values for elements with undefined height/width attributes. */
                        if (/^(height|width)$/i.test(property)) {
                            /* Firefox throws an error if .getBBox() is called on an SVG that isn't attached to the DOM. */
                            try {
                                propertyValue = element.getBBox()[property];
                            } catch (error) {
                                propertyValue = 0;
                            }
                            /* Otherwise, access the attribute value directly. */
                        } else {
                            propertyValue = element.getAttribute(property);
                        }
                    } else {
                        propertyValue = computePropertyValue(element, CSS.Names.prefixCheck(property)[0]); /* GET */
                    }
                }

                /* Since property lookups are for animation purposes (which entails computing the numeric delta between start and end values),
                 convert CSS null-values to an integer of value 0. */
                if (CSS.Values.isCSSNullValue(propertyValue)) {
                    propertyValue = 0;
                }

                if (Velocity.debug >= 2) {
                    console.log("Get " + property + ": " + propertyValue);
                }

                return propertyValue;
            },
            /* The singular setPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
            setPropertyValue: function setPropertyValue(element, property, propertyValue, rootPropertyValue, scrollData) {
                var propertyName = property;

                /* In order to be subjected to call options and element queueing, scroll animation is routed through Velocity as if it were a standard CSS property. */
                if (property === "scroll") {
                    /* If a container option is present, scroll the container instead of the browser window. */
                    if (scrollData.container) {
                        scrollData.container["scroll" + scrollData.direction] = propertyValue;
                        /* Otherwise, Velocity defaults to scrolling the browser window. */
                    } else {
                        if (scrollData.direction === "Left") {
                            window.scrollTo(propertyValue, scrollData.alternateValue);
                        } else {
                            window.scrollTo(scrollData.alternateValue, propertyValue);
                        }
                    }
                } else {
                    /* Transforms (translateX, rotateZ, etc.) are applied to a per-element transformCache object, which is manually flushed via flushTransformCache().
                     Thus, for now, we merely cache transforms being SET. */
                    if (CSS.Normalizations.registered[property] && CSS.Normalizations.registered[property]("name", element) === "transform") {
                        /* Perform a normalization injection. */
                        /* Note: The normalization logic handles the transformCache updating. */
                        CSS.Normalizations.registered[property]("inject", element, propertyValue);

                        propertyName = "transform";
                        propertyValue = Data(element).transformCache[property];
                    } else {
                        /* Inject hooks. */
                        if (CSS.Hooks.registered[property]) {
                            var hookName = property,
                                hookRoot = CSS.Hooks.getRoot(property);

                            /* If a cached rootPropertyValue was not provided, query the DOM for the hookRoot's current value. */
                            rootPropertyValue = rootPropertyValue || CSS.getPropertyValue(element, hookRoot); /* GET */

                            propertyValue = CSS.Hooks.injectValue(hookName, propertyValue, rootPropertyValue);
                            property = hookRoot;
                        }

                        /* Normalize names and values. */
                        if (CSS.Normalizations.registered[property]) {
                            propertyValue = CSS.Normalizations.registered[property]("inject", element, propertyValue);
                            property = CSS.Normalizations.registered[property]("name", element);
                        }

                        /* Assign the appropriate vendor prefix before performing an official style update. */
                        propertyName = CSS.Names.prefixCheck(property)[0];

                        /* A try/catch is used for IE<=8, which throws an error when "invalid" CSS values are set, e.g. a negative width.
                         Try/catch is avoided for other browsers since it incurs a performance overhead. */
                        if (IE <= 8) {
                            try {
                                element.style[propertyName] = propertyValue;
                            } catch (error) {
                                if (Velocity.debug) {
                                    console.log("Browser does not support [" + propertyValue + "] for [" + propertyName + "]");
                                }
                            }
                            /* SVG elements have their dimensional properties (width, height, x, y, cx, etc.) applied directly as attributes instead of as styles. */
                            /* Note: IE8 does not support SVG elements, so it's okay that we skip it for SVG animation. */
                        } else {
                            var data = Data(element);

                            if (data && data.isSVG && CSS.Names.SVGAttribute(property)) {
                                /* Note: For SVG attributes, vendor-prefixed property names are never used. */
                                /* Note: Not all CSS properties can be animated via attributes, but the browser won't throw an error for unsupported properties. */
                                element.setAttribute(property, propertyValue);
                            } else {
                                element.style[propertyName] = propertyValue;
                            }
                        }

                        if (Velocity.debug >= 2) {
                            console.log("Set " + property + " (" + propertyName + "): " + propertyValue);
                        }
                    }
                }

                /* Return the normalized property name and value in case the caller wants to know how these values were modified before being applied to the DOM. */
                return [propertyName, propertyValue];
            },
            /* To increase performance by batching transform updates into a single SET, transforms are not directly applied to an element until flushTransformCache() is called. */
            /* Note: Velocity applies transform properties in the same order that they are chronogically introduced to the element's CSS styles. */
            flushTransformCache: function flushTransformCache(element) {
                var transformString = "",
                    data = Data(element);

                /* Certain browsers require that SVG transforms be applied as an attribute. However, the SVG transform attribute takes a modified version of CSS's transform string
                 (units are dropped and, except for skewX/Y, subproperties are merged into their master property -- e.g. scaleX and scaleY are merged into scale(X Y). */
                if ((IE || Velocity.State.isAndroid && !Velocity.State.isChrome) && data && data.isSVG) {
                    /* Since transform values are stored in their parentheses-wrapped form, we use a helper function to strip out their numeric values.
                     Further, SVG transform properties only take unitless (representing pixels) values, so it's okay that parseFloat() strips the unit suffixed to the float value. */
                    var getTransformFloat = function getTransformFloat(transformProperty) {
                        return parseFloat(CSS.getPropertyValue(element, transformProperty));
                    };

                    /* Create an object to organize all the transforms that we'll apply to the SVG element. To keep the logic simple,
                     we process *all* transform properties -- even those that may not be explicitly applied (since they default to their zero-values anyway). */
                    var SVGTransforms = {
                        translate: [getTransformFloat("translateX"), getTransformFloat("translateY")],
                        skewX: [getTransformFloat("skewX")], skewY: [getTransformFloat("skewY")],
                        /* If the scale property is set (non-1), use that value for the scaleX and scaleY values
                         (this behavior mimics the result of animating all these properties at once on HTML elements). */
                        scale: getTransformFloat("scale") !== 1 ? [getTransformFloat("scale"), getTransformFloat("scale")] : [getTransformFloat("scaleX"), getTransformFloat("scaleY")],
                        /* Note: SVG's rotate transform takes three values: rotation degrees followed by the X and Y values
                         defining the rotation's origin point. We ignore the origin values (default them to 0). */
                        rotate: [getTransformFloat("rotateZ"), 0, 0]
                    };

                    /* Iterate through the transform properties in the user-defined property map order.
                     (This mimics the behavior of non-SVG transform animation.) */
                    $.each(Data(element).transformCache, function (transformName) {
                        /* Except for with skewX/Y, revert the axis-specific transform subproperties to their axis-free master
                         properties so that they match up with SVG's accepted transform properties. */
                        if (/^translate/i.test(transformName)) {
                            transformName = "translate";
                        } else if (/^scale/i.test(transformName)) {
                            transformName = "scale";
                        } else if (/^rotate/i.test(transformName)) {
                            transformName = "rotate";
                        }

                        /* Check that we haven't yet deleted the property from the SVGTransforms container. */
                        if (SVGTransforms[transformName]) {
                            /* Append the transform property in the SVG-supported transform format. As per the spec, surround the space-delimited values in parentheses. */
                            transformString += transformName + "(" + SVGTransforms[transformName].join(" ") + ")" + " ";

                            /* After processing an SVG transform property, delete it from the SVGTransforms container so we don't
                             re-insert the same master property if we encounter another one of its axis-specific properties. */
                            delete SVGTransforms[transformName];
                        }
                    });
                } else {
                    var transformValue, perspective;

                    /* Transform properties are stored as members of the transformCache object. Concatenate all the members into a string. */
                    $.each(Data(element).transformCache, function (transformName) {
                        transformValue = Data(element).transformCache[transformName];

                        /* Transform's perspective subproperty must be set first in order to take effect. Store it temporarily. */
                        if (transformName === "transformPerspective") {
                            perspective = transformValue;
                            return true;
                        }

                        /* IE9 only supports one rotation type, rotateZ, which it refers to as "rotate". */
                        if (IE === 9 && transformName === "rotateZ") {
                            transformName = "rotate";
                        }

                        transformString += transformName + transformValue + " ";
                    });

                    /* If present, set the perspective subproperty first. */
                    if (perspective) {
                        transformString = "perspective" + perspective + " " + transformString;
                    }
                }

                CSS.setPropertyValue(element, "transform", transformString);
            }
        };

        /* Register hooks and normalizations. */
        CSS.Hooks.register();
        CSS.Normalizations.register();

        /* Allow hook setting in the same fashion as jQuery's $.css(). */
        Velocity.hook = function (elements, arg2, arg3) {
            var value;

            elements = sanitizeElements(elements);

            $.each(elements, function (i, element) {
                /* Initialize Velocity's per-element data cache if this element hasn't previously been animated. */
                if (Data(element) === undefined) {
                    Velocity.init(element);
                }

                /* Get property value. If an element set was passed in, only return the value for the first element. */
                if (arg3 === undefined) {
                    if (value === undefined) {
                        value = CSS.getPropertyValue(element, arg2);
                    }
                    /* Set property value. */
                } else {
                    /* sPV returns an array of the normalized propertyName/propertyValue pair used to update the DOM. */
                    var adjustedSet = CSS.setPropertyValue(element, arg2, arg3);

                    /* Transform properties don't automatically set. They have to be flushed to the DOM. */
                    if (adjustedSet[0] === "transform") {
                        Velocity.CSS.flushTransformCache(element);
                    }

                    value = adjustedSet;
                }
            });

            return value;
        };

        /*****************
         Animation
         *****************/

        var animate = function animate() {
            var opts;

            /******************
             Call Chain
             ******************/

            /* Logic for determining what to return to the call stack when exiting out of Velocity. */
            function getChain() {
                /* If we are using the utility function, attempt to return this call's promise. If no promise library was detected,
                 default to null instead of returning the targeted elements so that utility function's return value is standardized. */
                if (isUtility) {
                    return promiseData.promise || null;
                    /* Otherwise, if we're using $.fn, return the jQuery-/Zepto-wrapped element set. */
                } else {
                    return elementsWrapped;
                }
            }

            /*************************
             Arguments Assignment
             *************************/

            /* To allow for expressive CoffeeScript code, Velocity supports an alternative syntax in which "elements" (or "e"), "properties" (or "p"), and "options" (or "o")
             objects are defined on a container object that's passed in as Velocity's sole argument. */
            /* Note: Some browsers automatically populate arguments with a "properties" object. We detect it by checking for its default "names" property. */
            var syntacticSugar = arguments[0] && (arguments[0].p || $.isPlainObject(arguments[0].properties) && !arguments[0].properties.names || Type.isString(arguments[0].properties)),

            /* Whether Velocity was called via the utility function (as opposed to on a jQuery/Zepto object). */
            isUtility,

            /* When Velocity is called via the utility function ($.Velocity()/Velocity()), elements are explicitly
             passed in as the first parameter. Thus, argument positioning varies. We normalize them here. */
            elementsWrapped,
                argumentIndex;

            var elements, propertiesMap, options;

            /* Detect jQuery/Zepto elements being animated via the $.fn method. */
            if (Type.isWrapped(this)) {
                isUtility = false;

                argumentIndex = 0;
                elements = this;
                elementsWrapped = this;
                /* Otherwise, raw elements are being animated via the utility function. */
            } else {
                isUtility = true;

                argumentIndex = 1;
                elements = syntacticSugar ? arguments[0].elements || arguments[0].e : arguments[0];
            }

            /***************
             Promises
             ***************/

            var promiseData = {
                promise: null,
                resolver: null,
                rejecter: null
            };

            /* If this call was made via the utility function (which is the default method of invocation when jQuery/Zepto are not being used), and if
             promise support was detected, create a promise object for this call and store references to its resolver and rejecter methods. The resolve
             method is used when a call completes naturally or is prematurely stopped by the user. In both cases, completeCall() handles the associated
             call cleanup and promise resolving logic. The reject method is used when an invalid set of arguments is passed into a Velocity call. */
            /* Note: Velocity employs a call-based queueing architecture, which means that stopping an animating element actually stops the full call that
             triggered it -- not that one element exclusively. Similarly, there is one promise per call, and all elements targeted by a Velocity call are
             grouped together for the purposes of resolving and rejecting a promise. */
            if (isUtility && Velocity.Promise) {
                promiseData.promise = new Velocity.Promise(function (resolve, reject) {
                    promiseData.resolver = resolve;
                    promiseData.rejecter = reject;
                });
            }

            if (syntacticSugar) {
                propertiesMap = arguments[0].properties || arguments[0].p;
                options = arguments[0].options || arguments[0].o;
            } else {
                propertiesMap = arguments[argumentIndex];
                options = arguments[argumentIndex + 1];
            }

            elements = sanitizeElements(elements);

            if (!elements) {
                if (promiseData.promise) {
                    if (!propertiesMap || !options || options.promiseRejectEmpty !== false) {
                        promiseData.rejecter();
                    } else {
                        promiseData.resolver();
                    }
                }
                return;
            }

            /* The length of the element set (in the form of a nodeList or an array of elements) is defaulted to 1 in case a
             single raw DOM element is passed in (which doesn't contain a length property). */
            var elementsLength = elements.length,
                elementsIndex = 0;

            /***************************
             Argument Overloading
             ***************************/

            /* Support is included for jQuery's argument overloading: $.animate(propertyMap [, duration] [, easing] [, complete]).
             Overloading is detected by checking for the absence of an object being passed into options. */
            /* Note: The stop/finish/pause/resume actions do not accept animation options, and are therefore excluded from this check. */
            if (!/^(stop|finish|finishAll|pause|resume)$/i.test(propertiesMap) && !$.isPlainObject(options)) {
                /* The utility function shifts all arguments one position to the right, so we adjust for that offset. */
                var startingArgumentPosition = argumentIndex + 1;

                options = {};

                /* Iterate through all options arguments */
                for (var i = startingArgumentPosition; i < arguments.length; i++) {
                    /* Treat a number as a duration. Parse it out. */
                    /* Note: The following RegEx will return true if passed an array with a number as its first item.
                     Thus, arrays are skipped from this check. */
                    if (!Type.isArray(arguments[i]) && (/^(fast|normal|slow)$/i.test(arguments[i]) || /^\d/.test(arguments[i]))) {
                        options.duration = arguments[i];
                        /* Treat strings and arrays as easings. */
                    } else if (Type.isString(arguments[i]) || Type.isArray(arguments[i])) {
                        options.easing = arguments[i];
                        /* Treat a function as a complete callback. */
                    } else if (Type.isFunction(arguments[i])) {
                        options.complete = arguments[i];
                    }
                }
            }

            /*********************
             Action Detection
             *********************/

            /* Velocity's behavior is categorized into "actions": Elements can either be specially scrolled into view,
             or they can be started, stopped, paused, resumed, or reversed . If a literal or referenced properties map is passed in as Velocity's
             first argument, the associated action is "start". Alternatively, "scroll", "reverse", "pause", "resume" or "stop" can be passed in
             instead of a properties map. */
            var action;

            switch (propertiesMap) {
                case "scroll":
                    action = "scroll";
                    break;

                case "reverse":
                    action = "reverse";
                    break;

                case "pause":

                    /*******************
                     Action: Pause
                     *******************/

                    var currentTime = new Date().getTime();

                    /* Handle delay timers */
                    $.each(elements, function (i, element) {
                        pauseDelayOnElement(element, currentTime);
                    });

                    /* Pause and Resume are call-wide (not on a per element basis). Thus, calling pause or resume on a
                     single element will cause any calls that containt tweens for that element to be paused/resumed
                     as well. */

                    /* Iterate through all calls and pause any that contain any of our elements */
                    $.each(Velocity.State.calls, function (i, activeCall) {

                        var found = false;
                        /* Inactive calls are set to false by the logic inside completeCall(). Skip them. */
                        if (activeCall) {
                            /* Iterate through the active call's targeted elements. */
                            $.each(activeCall[1], function (k, activeElement) {
                                var queueName = options === undefined ? "" : options;

                                if (queueName !== true && activeCall[2].queue !== queueName && !(options === undefined && activeCall[2].queue === false)) {
                                    return true;
                                }

                                /* Iterate through the calls targeted by the stop command. */
                                $.each(elements, function (l, element) {
                                    /* Check that this call was applied to the target element. */
                                    if (element === activeElement) {

                                        /* Set call to paused */
                                        activeCall[5] = {
                                            resume: false
                                        };

                                        /* Once we match an element, we can bounce out to the next call entirely */
                                        found = true;
                                        return false;
                                    }
                                });

                                /* Proceed to check next call if we have already matched */
                                if (found) {
                                    return false;
                                }
                            });
                        }
                    });

                    /* Since pause creates no new tweens, exit out of Velocity. */
                    return getChain();

                case "resume":

                    /*******************
                     Action: Resume
                     *******************/

                    /* Handle delay timers */
                    $.each(elements, function (i, element) {
                        resumeDelayOnElement(element, currentTime);
                    });

                    /* Pause and Resume are call-wide (not on a per elemnt basis). Thus, calling pause or resume on a
                     single element will cause any calls that containt tweens for that element to be paused/resumed
                     as well. */

                    /* Iterate through all calls and pause any that contain any of our elements */
                    $.each(Velocity.State.calls, function (i, activeCall) {
                        var found = false;
                        /* Inactive calls are set to false by the logic inside completeCall(). Skip them. */
                        if (activeCall) {
                            /* Iterate through the active call's targeted elements. */
                            $.each(activeCall[1], function (k, activeElement) {
                                var queueName = options === undefined ? "" : options;

                                if (queueName !== true && activeCall[2].queue !== queueName && !(options === undefined && activeCall[2].queue === false)) {
                                    return true;
                                }

                                /* Skip any calls that have never been paused */
                                if (!activeCall[5]) {
                                    return true;
                                }

                                /* Iterate through the calls targeted by the stop command. */
                                $.each(elements, function (l, element) {
                                    /* Check that this call was applied to the target element. */
                                    if (element === activeElement) {

                                        /* Flag a pause object to be resumed, which will occur during the next tick. In
                                         addition, the pause object will at that time be deleted */
                                        activeCall[5].resume = true;

                                        /* Once we match an element, we can bounce out to the next call entirely */
                                        found = true;
                                        return false;
                                    }
                                });

                                /* Proceed to check next call if we have already matched */
                                if (found) {
                                    return false;
                                }
                            });
                        }
                    });

                    /* Since resume creates no new tweens, exit out of Velocity. */
                    return getChain();

                case "finish":
                case "finishAll":
                case "stop":
                    /*******************
                     Action: Stop
                     *******************/

                    /* Clear the currently-active delay on each targeted element. */
                    $.each(elements, function (i, element) {
                        if (Data(element) && Data(element).delayTimer) {
                            /* Stop the timer from triggering its cached next() function. */
                            clearTimeout(Data(element).delayTimer.setTimeout);

                            /* Manually call the next() function so that the subsequent queue items can progress. */
                            if (Data(element).delayTimer.next) {
                                Data(element).delayTimer.next();
                            }

                            delete Data(element).delayTimer;
                        }

                        /* If we want to finish everything in the queue, we have to iterate through it
                         and call each function. This will make them active calls below, which will
                         cause them to be applied via the duration setting. */
                        if (propertiesMap === "finishAll" && (options === true || Type.isString(options))) {
                            /* Iterate through the items in the element's queue. */
                            $.each($.queue(element, Type.isString(options) ? options : ""), function (_, item) {
                                /* The queue array can contain an "inprogress" string, which we skip. */
                                if (Type.isFunction(item)) {
                                    item();
                                }
                            });

                            /* Clearing the $.queue() array is achieved by resetting it to []. */
                            $.queue(element, Type.isString(options) ? options : "", []);
                        }
                    });

                    var callsToStop = [];

                    /* When the stop action is triggered, the elements' currently active call is immediately stopped. The active call might have
                     been applied to multiple elements, in which case all of the call's elements will be stopped. When an element
                     is stopped, the next item in its animation queue is immediately triggered. */
                    /* An additional argument may be passed in to clear an element's remaining queued calls. Either true (which defaults to the "fx" queue)
                     or a custom queue string can be passed in. */
                    /* Note: The stop command runs prior to Velocity's Queueing phase since its behavior is intended to take effect *immediately*,
                     regardless of the element's current queue state. */

                    /* Iterate through every active call. */
                    $.each(Velocity.State.calls, function (i, activeCall) {
                        /* Inactive calls are set to false by the logic inside completeCall(). Skip them. */
                        if (activeCall) {
                            /* Iterate through the active call's targeted elements. */
                            $.each(activeCall[1], function (k, activeElement) {
                                /* If true was passed in as a secondary argument, clear absolutely all calls on this element. Otherwise, only
                                 clear calls associated with the relevant queue. */
                                /* Call stopping logic works as follows:
                                 - options === true --> stop current default queue calls (and queue:false calls), including remaining queued ones.
                                 - options === undefined --> stop current queue:"" call and all queue:false calls.
                                 - options === false --> stop only queue:false calls.
                                 - options === "custom" --> stop current queue:"custom" call, including remaining queued ones (there is no functionality to only clear the currently-running queue:"custom" call). */
                                var queueName = options === undefined ? "" : options;

                                if (queueName !== true && activeCall[2].queue !== queueName && !(options === undefined && activeCall[2].queue === false)) {
                                    return true;
                                }

                                /* Iterate through the calls targeted by the stop command. */
                                $.each(elements, function (l, element) {
                                    /* Check that this call was applied to the target element. */
                                    if (element === activeElement) {
                                        /* Optionally clear the remaining queued calls. If we're doing "finishAll" this won't find anything,
                                         due to the queue-clearing above. */
                                        if (options === true || Type.isString(options)) {
                                            /* Iterate through the items in the element's queue. */
                                            $.each($.queue(element, Type.isString(options) ? options : ""), function (_, item) {
                                                /* The queue array can contain an "inprogress" string, which we skip. */
                                                if (Type.isFunction(item)) {
                                                    /* Pass the item's callback a flag indicating that we want to abort from the queue call.
                                                     (Specifically, the queue will resolve the call's associated promise then abort.)  */
                                                    item(null, true);
                                                }
                                            });

                                            /* Clearing the $.queue() array is achieved by resetting it to []. */
                                            $.queue(element, Type.isString(options) ? options : "", []);
                                        }

                                        if (propertiesMap === "stop") {
                                            /* Since "reverse" uses cached start values (the previous call's endValues), these values must be
                                             changed to reflect the final value that the elements were actually tweened to. */
                                            /* Note: If only queue:false animations are currently running on an element, it won't have a tweensContainer
                                             object. Also, queue:false animations can't be reversed. */
                                            var data = Data(element);
                                            if (data && data.tweensContainer && queueName !== false) {
                                                $.each(data.tweensContainer, function (m, activeTween) {
                                                    activeTween.endValue = activeTween.currentValue;
                                                });
                                            }

                                            callsToStop.push(i);
                                        } else if (propertiesMap === "finish" || propertiesMap === "finishAll") {
                                            /* To get active tweens to finish immediately, we forcefully shorten their durations to 1ms so that
                                             they finish upon the next rAf tick then proceed with normal call completion logic. */
                                            activeCall[2].duration = 1;
                                        }
                                    }
                                });
                            });
                        }
                    });

                    /* Prematurely call completeCall() on each matched active call. Pass an additional flag for "stop" to indicate
                     that the complete callback and display:none setting should be skipped since we're completing prematurely. */
                    if (propertiesMap === "stop") {
                        $.each(callsToStop, function (i, j) {
                            completeCall(j, true);
                        });

                        if (promiseData.promise) {
                            /* Immediately resolve the promise associated with this stop call since stop runs synchronously. */
                            promiseData.resolver(elements);
                        }
                    }

                    /* Since we're stopping, and not proceeding with queueing, exit out of Velocity. */
                    return getChain();

                default:
                    /* Treat a non-empty plain object as a literal properties map. */
                    if ($.isPlainObject(propertiesMap) && !Type.isEmptyObject(propertiesMap)) {
                        action = "start";

                        /****************
                         Redirects
                         ****************/

                        /* Check if a string matches a registered redirect (see Redirects above). */
                    } else if (Type.isString(propertiesMap) && Velocity.Redirects[propertiesMap]) {
                        opts = $.extend({}, options);

                        var durationOriginal = opts.duration,
                            delayOriginal = opts.delay || 0;

                        /* If the backwards option was passed in, reverse the element set so that elements animate from the last to the first. */
                        if (opts.backwards === true) {
                            elements = $.extend(true, [], elements).reverse();
                        }

                        /* Individually trigger the redirect for each element in the set to prevent users from having to handle iteration logic in their redirect. */
                        $.each(elements, function (elementIndex, element) {
                            /* If the stagger option was passed in, successively delay each element by the stagger value (in ms). Retain the original delay value. */
                            if (parseFloat(opts.stagger)) {
                                opts.delay = delayOriginal + parseFloat(opts.stagger) * elementIndex;
                            } else if (Type.isFunction(opts.stagger)) {
                                opts.delay = delayOriginal + opts.stagger.call(element, elementIndex, elementsLength);
                            }

                            /* If the drag option was passed in, successively increase/decrease (depending on the presense of opts.backwards)
                             the duration of each element's animation, using floors to prevent producing very short durations. */
                            if (opts.drag) {
                                /* Default the duration of UI pack effects (callouts and transitions) to 1000ms instead of the usual default duration of 400ms. */
                                opts.duration = parseFloat(durationOriginal) || (/^(callout|transition)/.test(propertiesMap) ? 1000 : DURATION_DEFAULT);

                                /* For each element, take the greater duration of: A) animation completion percentage relative to the original duration,
                                 B) 75% of the original duration, or C) a 200ms fallback (in case duration is already set to a low value).
                                 The end result is a baseline of 75% of the redirect's duration that increases/decreases as the end of the element set is approached. */
                                opts.duration = Math.max(opts.duration * (opts.backwards ? 1 - elementIndex / elementsLength : (elementIndex + 1) / elementsLength), opts.duration * 0.75, 200);
                            }

                            /* Pass in the call's opts object so that the redirect can optionally extend it. It defaults to an empty object instead of null to
                             reduce the opts checking logic required inside the redirect. */
                            Velocity.Redirects[propertiesMap].call(element, element, opts || {}, elementIndex, elementsLength, elements, promiseData.promise ? promiseData : undefined);
                        });

                        /* Since the animation logic resides within the redirect's own code, abort the remainder of this call.
                         (The performance overhead up to this point is virtually non-existant.) */
                        /* Note: The jQuery call chain is kept intact by returning the complete element set. */
                        return getChain();
                    } else {
                        var abortError = "Velocity: First argument (" + propertiesMap + ") was not a property map, a known action, or a registered redirect. Aborting.";

                        if (promiseData.promise) {
                            promiseData.rejecter(new Error(abortError));
                        } else {
                            console.log(abortError);
                        }

                        return getChain();
                    }
            }

            /**************************
             Call-Wide Variables
             **************************/

            /* A container for CSS unit conversion ratios (e.g. %, rem, and em ==> px) that is used to cache ratios across all elements
             being animated in a single Velocity call. Calculating unit ratios necessitates DOM querying and updating, and is therefore
             avoided (via caching) wherever possible. This container is call-wide instead of page-wide to avoid the risk of using stale
             conversion metrics across Velocity animations that are not immediately consecutively chained. */
            var callUnitConversionData = {
                lastParent: null,
                lastPosition: null,
                lastFontSize: null,
                lastPercentToPxWidth: null,
                lastPercentToPxHeight: null,
                lastEmToPx: null,
                remToPx: null,
                vwToPx: null,
                vhToPx: null
            };

            /* A container for all the ensuing tween data and metadata associated with this call. This container gets pushed to the page-wide
             Velocity.State.calls array that is processed during animation ticking. */
            var call = [];

            /************************
             Element Processing
             ************************/

            /* Element processing consists of three parts -- data processing that cannot go stale and data processing that *can* go stale (i.e. third-party style modifications):
             1) Pre-Queueing: Element-wide variables, including the element's data storage, are instantiated. Call options are prepared. If triggered, the Stop action is executed.
             2) Queueing: The logic that runs once this call has reached its point of execution in the element's $.queue() stack. Most logic is placed here to avoid risking it becoming stale.
             3) Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
             `elementArrayIndex` allows passing index of the element in the original array to value functions.
             If `elementsIndex` were used instead the index would be determined by the elements' per-element queue.
             */
            function processElement(element, elementArrayIndex) {

                /*************************
                 Part I: Pre-Queueing
                 *************************/

                /***************************
                 Element-Wide Variables
                 ***************************/

                var /* The runtime opts object is the extension of the current call's options and Velocity's page-wide option defaults. */
                opts = $.extend({}, Velocity.defaults, options),

                /* A container for the processed data associated with each property in the propertyMap.
                 (Each property in the map produces its own "tween".) */
                tweensContainer = {},
                    elementUnitConversionData;

                /******************
                 Element Init
                 ******************/

                if (Data(element) === undefined) {
                    Velocity.init(element);
                }

                /******************
                 Option: Delay
                 ******************/

                /* Since queue:false doesn't respect the item's existing queue, we avoid injecting its delay here (it's set later on). */
                /* Note: Velocity rolls its own delay function since jQuery doesn't have a utility alias for $.fn.delay()
                 (and thus requires jQuery element creation, which we avoid since its overhead includes DOM querying). */
                if (parseFloat(opts.delay) && opts.queue !== false) {
                    $.queue(element, opts.queue, function (next) {
                        /* This is a flag used to indicate to the upcoming completeCall() function that this queue entry was initiated by Velocity. See completeCall() for further details. */
                        Velocity.velocityQueueEntryFlag = true;

                        /* The ensuing queue item (which is assigned to the "next" argument that $.queue() automatically passes in) will be triggered after a setTimeout delay.
                         The setTimeout is stored so that it can be subjected to clearTimeout() if this animation is prematurely stopped via Velocity's "stop" command, and
                         delayBegin/delayTime is used to ensure we can "pause" and "resume" a tween that is still mid-delay. */

                        /* Temporarily store delayed elements to facilite access for global pause/resume */
                        var callIndex = Velocity.State.delayedElements.count++;
                        Velocity.State.delayedElements[callIndex] = element;

                        var delayComplete = function (index) {
                            return function () {
                                /* Clear the temporary element */
                                Velocity.State.delayedElements[index] = false;

                                /* Finally, issue the call */
                                next();
                            };
                        }(callIndex);

                        Data(element).delayBegin = new Date().getTime();
                        Data(element).delay = parseFloat(opts.delay);
                        Data(element).delayTimer = {
                            setTimeout: setTimeout(next, parseFloat(opts.delay)),
                            next: delayComplete
                        };
                    });
                }

                /*********************
                 Option: Duration
                 *********************/

                /* Support for jQuery's named durations. */
                switch (opts.duration.toString().toLowerCase()) {
                    case "fast":
                        opts.duration = 200;
                        break;

                    case "normal":
                        opts.duration = DURATION_DEFAULT;
                        break;

                    case "slow":
                        opts.duration = 600;
                        break;

                    default:
                        /* Remove the potential "ms" suffix and default to 1 if the user is attempting to set a duration of 0 (in order to produce an immediate style change). */
                        opts.duration = parseFloat(opts.duration) || 1;
                }

                /************************
                 Global Option: Mock
                 ************************/

                if (Velocity.mock !== false) {
                    /* In mock mode, all animations are forced to 1ms so that they occur immediately upon the next rAF tick.
                     Alternatively, a multiplier can be passed in to time remap all delays and durations. */
                    if (Velocity.mock === true) {
                        opts.duration = opts.delay = 1;
                    } else {
                        opts.duration *= parseFloat(Velocity.mock) || 1;
                        opts.delay *= parseFloat(Velocity.mock) || 1;
                    }
                }

                /*******************
                 Option: Easing
                 *******************/

                opts.easing = getEasing(opts.easing, opts.duration);

                /**********************
                 Option: Callbacks
                 **********************/

                /* Callbacks must functions. Otherwise, default to null. */
                if (opts.begin && !Type.isFunction(opts.begin)) {
                    opts.begin = null;
                }

                if (opts.progress && !Type.isFunction(opts.progress)) {
                    opts.progress = null;
                }

                if (opts.complete && !Type.isFunction(opts.complete)) {
                    opts.complete = null;
                }

                /*********************************
                 Option: Display & Visibility
                 *********************************/

                /* Refer to Velocity's documentation (VelocityJS.org/#displayAndVisibility) for a description of the display and visibility options' behavior. */
                /* Note: We strictly check for undefined instead of falsiness because display accepts an empty string value. */
                if (opts.display !== undefined && opts.display !== null) {
                    opts.display = opts.display.toString().toLowerCase();

                    /* Users can pass in a special "auto" value to instruct Velocity to set the element to its default display value. */
                    if (opts.display === "auto") {
                        opts.display = Velocity.CSS.Values.getDisplayType(element);
                    }
                }

                if (opts.visibility !== undefined && opts.visibility !== null) {
                    opts.visibility = opts.visibility.toString().toLowerCase();
                }

                /**********************
                 Option: mobileHA
                 **********************/

                /* When set to true, and if this is a mobile device, mobileHA automatically enables hardware acceleration (via a null transform hack)
                 on animating elements. HA is removed from the element at the completion of its animation. */
                /* Note: Android Gingerbread doesn't support HA. If a null transform hack (mobileHA) is in fact set, it will prevent other tranform subproperties from taking effect. */
                /* Note: You can read more about the use of mobileHA in Velocity's documentation: VelocityJS.org/#mobileHA. */
                opts.mobileHA = opts.mobileHA && Velocity.State.isMobile && !Velocity.State.isGingerbread;

                /***********************
                 Part II: Queueing
                 ***********************/

                /* When a set of elements is targeted by a Velocity call, the set is broken up and each element has the current Velocity call individually queued onto it.
                 In this way, each element's existing queue is respected; some elements may already be animating and accordingly should not have this current Velocity call triggered immediately. */
                /* In each queue, tween data is processed for each animating property then pushed onto the call-wide calls array. When the last element in the set has had its tweens processed,
                 the call array is pushed to Velocity.State.calls for live processing by the requestAnimationFrame tick. */
                function buildQueue(next) {
                    var data, lastTweensContainer;

                    /*******************
                     Option: Begin
                     *******************/

                    /* The begin callback is fired once per call -- not once per elemenet -- and is passed the full raw DOM element set as both its context and its first argument. */
                    if (opts.begin && elementsIndex === 0) {
                        /* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
                        try {
                            opts.begin.call(elements, elements);
                        } catch (error) {
                            setTimeout(function () {
                                throw error;
                            }, 1);
                        }
                    }

                    /*****************************************
                     Tween Data Construction (for Scroll)
                     *****************************************/

                    /* Note: In order to be subjected to chaining and animation options, scroll's tweening is routed through Velocity as if it were a standard CSS property animation. */
                    if (action === "scroll") {
                        /* The scroll action uniquely takes an optional "offset" option -- specified in pixels -- that offsets the targeted scroll position. */
                        var scrollDirection = /^x$/i.test(opts.axis) ? "Left" : "Top",
                            scrollOffset = parseFloat(opts.offset) || 0,
                            scrollPositionCurrent,
                            scrollPositionCurrentAlternate,
                            scrollPositionEnd;

                        /* Scroll also uniquely takes an optional "container" option, which indicates the parent element that should be scrolled --
                         as opposed to the browser window itself. This is useful for scrolling toward an element that's inside an overflowing parent element. */
                        if (opts.container) {
                            /* Ensure that either a jQuery object or a raw DOM element was passed in. */
                            if (Type.isWrapped(opts.container) || Type.isNode(opts.container)) {
                                /* Extract the raw DOM element from the jQuery wrapper. */
                                opts.container = opts.container[0] || opts.container;
                                /* Note: Unlike other properties in Velocity, the browser's scroll position is never cached since it so frequently changes
                                 (due to the user's natural interaction with the page). */
                                scrollPositionCurrent = opts.container["scroll" + scrollDirection]; /* GET */

                                /* $.position() values are relative to the container's currently viewable area (without taking into account the container's true dimensions
                                 -- say, for example, if the container was not overflowing). Thus, the scroll end value is the sum of the child element's position *and*
                                 the scroll container's current scroll position. */
                                scrollPositionEnd = scrollPositionCurrent + $(element).position()[scrollDirection.toLowerCase()] + scrollOffset; /* GET */
                                /* If a value other than a jQuery object or a raw DOM element was passed in, default to null so that this option is ignored. */
                            } else {
                                opts.container = null;
                            }
                        } else {
                            /* If the window itself is being scrolled -- not a containing element -- perform a live scroll position lookup using
                             the appropriate cached property names (which differ based on browser type). */
                            scrollPositionCurrent = Velocity.State.scrollAnchor[Velocity.State["scrollProperty" + scrollDirection]]; /* GET */
                            /* When scrolling the browser window, cache the alternate axis's current value since window.scrollTo() doesn't let us change only one value at a time. */
                            scrollPositionCurrentAlternate = Velocity.State.scrollAnchor[Velocity.State["scrollProperty" + (scrollDirection === "Left" ? "Top" : "Left")]]; /* GET */

                            /* Unlike $.position(), $.offset() values are relative to the browser window's true dimensions -- not merely its currently viewable area --
                             and therefore end values do not need to be compounded onto current values. */
                            scrollPositionEnd = $(element).offset()[scrollDirection.toLowerCase()] + scrollOffset; /* GET */
                        }

                        /* Since there's only one format that scroll's associated tweensContainer can take, we create it manually. */
                        tweensContainer = {
                            scroll: {
                                rootPropertyValue: false,
                                startValue: scrollPositionCurrent,
                                currentValue: scrollPositionCurrent,
                                endValue: scrollPositionEnd,
                                unitType: "",
                                easing: opts.easing,
                                scrollData: {
                                    container: opts.container,
                                    direction: scrollDirection,
                                    alternateValue: scrollPositionCurrentAlternate
                                }
                            },
                            element: element
                        };

                        if (Velocity.debug) {
                            console.log("tweensContainer (scroll): ", tweensContainer.scroll, element);
                        }

                        /******************************************
                         Tween Data Construction (for Reverse)
                         ******************************************/

                        /* Reverse acts like a "start" action in that a property map is animated toward. The only difference is
                         that the property map used for reverse is the inverse of the map used in the previous call. Thus, we manipulate
                         the previous call to construct our new map: use the previous map's end values as our new map's start values. Copy over all other data. */
                        /* Note: Reverse can be directly called via the "reverse" parameter, or it can be indirectly triggered via the loop option. (Loops are composed of multiple reverses.) */
                        /* Note: Reverse calls do not need to be consecutively chained onto a currently-animating element in order to operate on cached values;
                         there is no harm to reverse being called on a potentially stale data cache since reverse's behavior is simply defined
                         as reverting to the element's values as they were prior to the previous *Velocity* call. */
                    } else if (action === "reverse") {
                        data = Data(element);

                        /* Abort if there is no prior animation data to reverse to. */
                        if (!data) {
                            return;
                        }

                        if (!data.tweensContainer) {
                            /* Dequeue the element so that this queue entry releases itself immediately, allowing subsequent queue entries to run. */
                            $.dequeue(element, opts.queue);

                            return;
                        } else {
                            /*********************
                             Options Parsing
                             *********************/

                            /* If the element was hidden via the display option in the previous call,
                             revert display to "auto" prior to reversal so that the element is visible again. */
                            if (data.opts.display === "none") {
                                data.opts.display = "auto";
                            }

                            if (data.opts.visibility === "hidden") {
                                data.opts.visibility = "visible";
                            }

                            /* If the loop option was set in the previous call, disable it so that "reverse" calls aren't recursively generated.
                             Further, remove the previous call's callback options; typically, users do not want these to be refired. */
                            data.opts.loop = false;
                            data.opts.begin = null;
                            data.opts.complete = null;

                            /* Since we're extending an opts object that has already been extended with the defaults options object,
                             we remove non-explicitly-defined properties that are auto-assigned values. */
                            if (!options.easing) {
                                delete opts.easing;
                            }

                            if (!options.duration) {
                                delete opts.duration;
                            }

                            /* The opts object used for reversal is an extension of the options object optionally passed into this
                             reverse call plus the options used in the previous Velocity call. */
                            opts = $.extend({}, data.opts, opts);

                            /*************************************
                             Tweens Container Reconstruction
                             *************************************/

                            /* Create a deepy copy (indicated via the true flag) of the previous call's tweensContainer. */
                            lastTweensContainer = $.extend(true, {}, data ? data.tweensContainer : null);

                            /* Manipulate the previous tweensContainer by replacing its end values and currentValues with its start values. */
                            for (var lastTween in lastTweensContainer) {
                                /* In addition to tween data, tweensContainers contain an element property that we ignore here. */
                                if (lastTweensContainer.hasOwnProperty(lastTween) && lastTween !== "element") {
                                    var lastStartValue = lastTweensContainer[lastTween].startValue;

                                    lastTweensContainer[lastTween].startValue = lastTweensContainer[lastTween].currentValue = lastTweensContainer[lastTween].endValue;
                                    lastTweensContainer[lastTween].endValue = lastStartValue;

                                    /* Easing is the only option that embeds into the individual tween data (since it can be defined on a per-property basis).
                                     Accordingly, every property's easing value must be updated when an options object is passed in with a reverse call.
                                     The side effect of this extensibility is that all per-property easing values are forcefully reset to the new value. */
                                    if (!Type.isEmptyObject(options)) {
                                        lastTweensContainer[lastTween].easing = opts.easing;
                                    }

                                    if (Velocity.debug) {
                                        console.log("reverse tweensContainer (" + lastTween + "): " + JSON.stringify(lastTweensContainer[lastTween]), element);
                                    }
                                }
                            }

                            tweensContainer = lastTweensContainer;
                        }

                        /*****************************************
                         Tween Data Construction (for Start)
                         *****************************************/
                    } else if (action === "start") {

                        /*************************
                         Value Transferring
                         *************************/

                        /* If this queue entry follows a previous Velocity-initiated queue entry *and* if this entry was created
                         while the element was in the process of being animated by Velocity, then this current call is safe to use
                         the end values from the prior call as its start values. Velocity attempts to perform this value transfer
                         process whenever possible in order to avoid requerying the DOM. */
                        /* If values aren't transferred from a prior call and start values were not forcefed by the user (more on this below),
                         then the DOM is queried for the element's current values as a last resort. */
                        /* Note: Conversely, animation reversal (and looping) *always* perform inter-call value transfers; they never requery the DOM. */

                        data = Data(element);

                        /* The per-element isAnimating flag is used to indicate whether it's safe (i.e. the data isn't stale)
                         to transfer over end values to use as start values. If it's set to true and there is a previous
                         Velocity call to pull values from, do so. */
                        if (data && data.tweensContainer && data.isAnimating === true) {
                            lastTweensContainer = data.tweensContainer;
                        }

                        /***************************
                         Tween Data Calculation
                         ***************************/

                        /* This function parses property data and defaults endValue, easing, and startValue as appropriate. */
                        /* Property map values can either take the form of 1) a single value representing the end value,
                         or 2) an array in the form of [ endValue, [, easing] [, startValue] ].
                         The optional third parameter is a forcefed startValue to be used instead of querying the DOM for
                         the element's current value. Read Velocity's docmentation to learn more about forcefeeding: VelocityJS.org/#forcefeeding */
                        var parsePropertyValue = function parsePropertyValue(valueData, skipResolvingEasing) {
                            var endValue, easing, startValue;

                            /* If we have a function as the main argument then resolve it first, in case it returns an array that needs to be split */
                            if (Type.isFunction(valueData)) {
                                valueData = valueData.call(element, elementArrayIndex, elementsLength);
                            }

                            /* Handle the array format, which can be structured as one of three potential overloads:
                             A) [ endValue, easing, startValue ], B) [ endValue, easing ], or C) [ endValue, startValue ] */
                            if (Type.isArray(valueData)) {
                                /* endValue is always the first item in the array. Don't bother validating endValue's value now
                                 since the ensuing property cycling logic does that. */
                                endValue = valueData[0];

                                /* Two-item array format: If the second item is a number, function, or hex string, treat it as a
                                 start value since easings can only be non-hex strings or arrays. */
                                if (!Type.isArray(valueData[1]) && /^[\d-]/.test(valueData[1]) || Type.isFunction(valueData[1]) || CSS.RegEx.isHex.test(valueData[1])) {
                                    startValue = valueData[1];
                                    /* Two or three-item array: If the second item is a non-hex string easing name or an array, treat it as an easing. */
                                } else if (Type.isString(valueData[1]) && !CSS.RegEx.isHex.test(valueData[1]) && Velocity.Easings[valueData[1]] || Type.isArray(valueData[1])) {
                                    easing = skipResolvingEasing ? valueData[1] : getEasing(valueData[1], opts.duration);

                                    /* Don't bother validating startValue's value now since the ensuing property cycling logic inherently does that. */
                                    startValue = valueData[2];
                                } else {
                                    startValue = valueData[1] || valueData[2];
                                }
                                /* Handle the single-value format. */
                            } else {
                                endValue = valueData;
                            }

                            /* Default to the call's easing if a per-property easing type was not defined. */
                            if (!skipResolvingEasing) {
                                easing = easing || opts.easing;
                            }

                            /* If functions were passed in as values, pass the function the current element as its context,
                             plus the element's index and the element set's size as arguments. Then, assign the returned value. */
                            if (Type.isFunction(endValue)) {
                                endValue = endValue.call(element, elementArrayIndex, elementsLength);
                            }

                            if (Type.isFunction(startValue)) {
                                startValue = startValue.call(element, elementArrayIndex, elementsLength);
                            }

                            /* Allow startValue to be left as undefined to indicate to the ensuing code that its value was not forcefed. */
                            return [endValue || 0, easing, startValue];
                        };

                        var fixPropertyValue = function fixPropertyValue(property, valueData) {
                            /* In case this property is a hook, there are circumstances where we will intend to work on the hook's root property and not the hooked subproperty. */
                            var rootProperty = CSS.Hooks.getRoot(property),
                                rootPropertyValue = false,

                            /* Parse out endValue, easing, and startValue from the property's data. */
                            endValue = valueData[0],
                                easing = valueData[1],
                                startValue = valueData[2],
                                pattern;

                            /**************************
                             Start Value Sourcing
                             **************************/

                            /* Other than for the dummy tween property, properties that are not supported by the browser (and do not have an associated normalization) will
                             inherently produce no style changes when set, so they are skipped in order to decrease animation tick overhead.
                             Property support is determined via prefixCheck(), which returns a false flag when no supported is detected. */
                            /* Note: Since SVG elements have some of their properties directly applied as HTML attributes,
                             there is no way to check for their explicit browser support, and so we skip skip this check for them. */
                            if ((!data || !data.isSVG) && rootProperty !== "tween" && CSS.Names.prefixCheck(rootProperty)[1] === false && CSS.Normalizations.registered[rootProperty] === undefined) {
                                if (Velocity.debug) {
                                    console.log("Skipping [" + rootProperty + "] due to a lack of browser support.");
                                }
                                return;
                            }

                            /* If the display option is being set to a non-"none" (e.g. "block") and opacity (filter on IE<=8) is being
                             animated to an endValue of non-zero, the user's intention is to fade in from invisible, thus we forcefeed opacity
                             a startValue of 0 if its startValue hasn't already been sourced by value transferring or prior forcefeeding. */
                            if ((opts.display !== undefined && opts.display !== null && opts.display !== "none" || opts.visibility !== undefined && opts.visibility !== "hidden") && /opacity|filter/.test(property) && !startValue && endValue !== 0) {
                                startValue = 0;
                            }

                            /* If values have been transferred from the previous Velocity call, extract the endValue and rootPropertyValue
                             for all of the current call's properties that were *also* animated in the previous call. */
                            /* Note: Value transferring can optionally be disabled by the user via the _cacheValues option. */
                            if (opts._cacheValues && lastTweensContainer && lastTweensContainer[property]) {
                                if (startValue === undefined) {
                                    startValue = lastTweensContainer[property].endValue + lastTweensContainer[property].unitType;
                                }

                                /* The previous call's rootPropertyValue is extracted from the element's data cache since that's the
                                 instance of rootPropertyValue that gets freshly updated by the tweening process, whereas the rootPropertyValue
                                 attached to the incoming lastTweensContainer is equal to the root property's value prior to any tweening. */
                                rootPropertyValue = data.rootPropertyValueCache[rootProperty];
                                /* If values were not transferred from a previous Velocity call, query the DOM as needed. */
                            } else {
                                /* Handle hooked properties. */
                                if (CSS.Hooks.registered[property]) {
                                    if (startValue === undefined) {
                                        rootPropertyValue = CSS.getPropertyValue(element, rootProperty); /* GET */
                                        /* Note: The following getPropertyValue() call does not actually trigger a DOM query;
                                         getPropertyValue() will extract the hook from rootPropertyValue. */
                                        startValue = CSS.getPropertyValue(element, property, rootPropertyValue);
                                        /* If startValue is already defined via forcefeeding, do not query the DOM for the root property's value;
                                         just grab rootProperty's zero-value template from CSS.Hooks. This overwrites the element's actual
                                         root property value (if one is set), but this is acceptable since the primary reason users forcefeed is
                                         to avoid DOM queries, and thus we likewise avoid querying the DOM for the root property's value. */
                                    } else {
                                        /* Grab this hook's zero-value template, e.g. "0px 0px 0px black". */
                                        rootPropertyValue = CSS.Hooks.templates[rootProperty][1];
                                    }
                                    /* Handle non-hooked properties that haven't already been defined via forcefeeding. */
                                } else if (startValue === undefined) {
                                    startValue = CSS.getPropertyValue(element, property); /* GET */
                                }
                            }

                            /**************************
                             Value Data Extraction
                             **************************/

                            var separatedValue,
                                endValueUnitType,
                                startValueUnitType,
                                operator = false;

                            /* Separates a property value into its numeric value and its unit type. */
                            var separateValue = function separateValue(property, value) {
                                var unitType, numericValue;

                                numericValue = (value || "0").toString().toLowerCase()
                                /* Match the unit type at the end of the value. */
                                .replace(/[%A-z]+$/, function (match) {
                                    /* Grab the unit type. */
                                    unitType = match;

                                    /* Strip the unit type off of value. */
                                    return "";
                                });

                                /* If no unit type was supplied, assign one that is appropriate for this property (e.g. "deg" for rotateZ or "px" for width). */
                                if (!unitType) {
                                    unitType = CSS.Values.getUnitType(property);
                                }

                                return [numericValue, unitType];
                            };

                            if (startValue !== endValue && Type.isString(startValue) && Type.isString(endValue)) {
                                pattern = "";
                                var iStart = 0,
                                    // index in startValue
                                iEnd = 0,
                                    // index in endValue
                                aStart = [],
                                    // array of startValue numbers
                                aEnd = [],
                                    // array of endValue numbers
                                inCalc = 0,
                                    // Keep track of being inside a "calc()" so we don't duplicate it
                                inRGB = 0,
                                    // Keep track of being inside an RGB as we can't use fractional values
                                inRGBA = 0; // Keep track of being inside an RGBA as we must pass fractional for the alpha channel

                                startValue = CSS.Hooks.fixColors(startValue);
                                endValue = CSS.Hooks.fixColors(endValue);
                                while (iStart < startValue.length && iEnd < endValue.length) {
                                    var cStart = startValue[iStart],
                                        cEnd = endValue[iEnd];

                                    if (/[\d\.]/.test(cStart) && /[\d\.]/.test(cEnd)) {
                                        var tStart = cStart,
                                            // temporary character buffer
                                        tEnd = cEnd,
                                            // temporary character buffer
                                        dotStart = ".",
                                            // Make sure we can only ever match a single dot in a decimal
                                        dotEnd = "."; // Make sure we can only ever match a single dot in a decimal

                                        while (++iStart < startValue.length) {
                                            cStart = startValue[iStart];
                                            if (cStart === dotStart) {
                                                dotStart = ".."; // Can never match two characters
                                            } else if (!/\d/.test(cStart)) {
                                                break;
                                            }
                                            tStart += cStart;
                                        }
                                        while (++iEnd < endValue.length) {
                                            cEnd = endValue[iEnd];
                                            if (cEnd === dotEnd) {
                                                dotEnd = ".."; // Can never match two characters
                                            } else if (!/\d/.test(cEnd)) {
                                                break;
                                            }
                                            tEnd += cEnd;
                                        }
                                        var uStart = CSS.Hooks.getUnit(startValue, iStart),
                                            // temporary unit type
                                        uEnd = CSS.Hooks.getUnit(endValue, iEnd); // temporary unit type

                                        iStart += uStart.length;
                                        iEnd += uEnd.length;
                                        if (uStart === uEnd) {
                                            // Same units
                                            if (tStart === tEnd) {
                                                // Same numbers, so just copy over
                                                pattern += tStart + uStart;
                                            } else {
                                                // Different numbers, so store them
                                                pattern += "{" + aStart.length + (inRGB ? "!" : "") + "}" + uStart;
                                                aStart.push(parseFloat(tStart));
                                                aEnd.push(parseFloat(tEnd));
                                            }
                                        } else {
                                            // Different units, so put into a "calc(from + to)" and animate each side to/from zero
                                            var nStart = parseFloat(tStart),
                                                nEnd = parseFloat(tEnd);

                                            pattern += (inCalc < 5 ? "calc" : "") + "(" + (nStart ? "{" + aStart.length + (inRGB ? "!" : "") + "}" : "0") + uStart + " + " + (nEnd ? "{" + (aStart.length + (nStart ? 1 : 0)) + (inRGB ? "!" : "") + "}" : "0") + uEnd + ")";
                                            if (nStart) {
                                                aStart.push(nStart);
                                                aEnd.push(0);
                                            }
                                            if (nEnd) {
                                                aStart.push(0);
                                                aEnd.push(nEnd);
                                            }
                                        }
                                    } else if (cStart === cEnd) {
                                        pattern += cStart;
                                        iStart++;
                                        iEnd++;
                                        // Keep track of being inside a calc()
                                        if (inCalc === 0 && cStart === "c" || inCalc === 1 && cStart === "a" || inCalc === 2 && cStart === "l" || inCalc === 3 && cStart === "c" || inCalc >= 4 && cStart === "(") {
                                            inCalc++;
                                        } else if (inCalc && inCalc < 5 || inCalc >= 4 && cStart === ")" && --inCalc < 5) {
                                            inCalc = 0;
                                        }
                                        // Keep track of being inside an rgb() / rgba()
                                        if (inRGB === 0 && cStart === "r" || inRGB === 1 && cStart === "g" || inRGB === 2 && cStart === "b" || inRGB === 3 && cStart === "a" || inRGB >= 3 && cStart === "(") {
                                            if (inRGB === 3 && cStart === "a") {
                                                inRGBA = 1;
                                            }
                                            inRGB++;
                                        } else if (inRGBA && cStart === ",") {
                                            if (++inRGBA > 3) {
                                                inRGB = inRGBA = 0;
                                            }
                                        } else if (inRGBA && inRGB < (inRGBA ? 5 : 4) || inRGB >= (inRGBA ? 4 : 3) && cStart === ")" && --inRGB < (inRGBA ? 5 : 4)) {
                                            inRGB = inRGBA = 0;
                                        }
                                    } else {
                                        inCalc = 0;
                                        // TODO: changing units, fixing colours
                                        break;
                                    }
                                }
                                if (iStart !== startValue.length || iEnd !== endValue.length) {
                                    if (Velocity.debug) {
                                        console.error("Trying to pattern match mis-matched strings [\"" + endValue + "\", \"" + startValue + "\"]");
                                    }
                                    pattern = undefined;
                                }
                                if (pattern) {
                                    if (aStart.length) {
                                        if (Velocity.debug) {
                                            console.log("Pattern found \"" + pattern + "\" -> ", aStart, aEnd, "[" + startValue + "," + endValue + "]");
                                        }
                                        startValue = aStart;
                                        endValue = aEnd;
                                        endValueUnitType = startValueUnitType = "";
                                    } else {
                                        pattern = undefined;
                                    }
                                }
                            }

                            if (!pattern) {
                                /* Separate startValue. */
                                separatedValue = separateValue(property, startValue);
                                startValue = separatedValue[0];
                                startValueUnitType = separatedValue[1];

                                /* Separate endValue, and extract a value operator (e.g. "+=", "-=") if one exists. */
                                separatedValue = separateValue(property, endValue);
                                endValue = separatedValue[0].replace(/^([+-\/*])=/, function (match, subMatch) {
                                    operator = subMatch;

                                    /* Strip the operator off of the value. */
                                    return "";
                                });
                                endValueUnitType = separatedValue[1];

                                /* Parse float values from endValue and startValue. Default to 0 if NaN is returned. */
                                startValue = parseFloat(startValue) || 0;
                                endValue = parseFloat(endValue) || 0;

                                /***************************************
                                 Property-Specific Value Conversion
                                 ***************************************/

                                /* Custom support for properties that don't actually accept the % unit type, but where pollyfilling is trivial and relatively foolproof. */
                                if (endValueUnitType === "%") {
                                    /* A %-value fontSize/lineHeight is relative to the parent's fontSize (as opposed to the parent's dimensions),
                                     which is identical to the em unit's behavior, so we piggyback off of that. */
                                    if (/^(fontSize|lineHeight)$/.test(property)) {
                                        /* Convert % into an em decimal value. */
                                        endValue = endValue / 100;
                                        endValueUnitType = "em";
                                        /* For scaleX and scaleY, convert the value into its decimal format and strip off the unit type. */
                                    } else if (/^scale/.test(property)) {
                                        endValue = endValue / 100;
                                        endValueUnitType = "";
                                        /* For RGB components, take the defined percentage of 255 and strip off the unit type. */
                                    } else if (/(Red|Green|Blue)$/i.test(property)) {
                                        endValue = endValue / 100 * 255;
                                        endValueUnitType = "";
                                    }
                                }
                            }

                            /***************************
                             Unit Ratio Calculation
                             ***************************/

                            /* When queried, the browser returns (most) CSS property values in pixels. Therefore, if an endValue with a unit type of
                             %, em, or rem is animated toward, startValue must be converted from pixels into the same unit type as endValue in order
                             for value manipulation logic (increment/decrement) to proceed. Further, if the startValue was forcefed or transferred
                             from a previous call, startValue may also not be in pixels. Unit conversion logic therefore consists of two steps:
                             1) Calculating the ratio of %/em/rem/vh/vw relative to pixels
                             2) Converting startValue into the same unit of measurement as endValue based on these ratios. */
                            /* Unit conversion ratios are calculated by inserting a sibling node next to the target node, copying over its position property,
                             setting values with the target unit type then comparing the returned pixel value. */
                            /* Note: Even if only one of these unit types is being animated, all unit ratios are calculated at once since the overhead
                             of batching the SETs and GETs together upfront outweights the potential overhead
                             of layout thrashing caused by re-querying for uncalculated ratios for subsequently-processed properties. */
                            /* Todo: Shift this logic into the calls' first tick instance so that it's synced with RAF. */
                            var calculateUnitRatios = function calculateUnitRatios() {

                                /************************
                                 Same Ratio Checks
                                 ************************/

                                /* The properties below are used to determine whether the element differs sufficiently from this call's
                                 previously iterated element to also differ in its unit conversion ratios. If the properties match up with those
                                 of the prior element, the prior element's conversion ratios are used. Like most optimizations in Velocity,
                                 this is done to minimize DOM querying. */
                                var sameRatioIndicators = {
                                    myParent: element.parentNode || document.body, /* GET */
                                    position: CSS.getPropertyValue(element, "position"), /* GET */
                                    fontSize: CSS.getPropertyValue(element, "fontSize") /* GET */
                                },

                                /* Determine if the same % ratio can be used. % is based on the element's position value and its parent's width and height dimensions. */
                                samePercentRatio = sameRatioIndicators.position === callUnitConversionData.lastPosition && sameRatioIndicators.myParent === callUnitConversionData.lastParent,

                                /* Determine if the same em ratio can be used. em is relative to the element's fontSize. */
                                sameEmRatio = sameRatioIndicators.fontSize === callUnitConversionData.lastFontSize;

                                /* Store these ratio indicators call-wide for the next element to compare against. */
                                callUnitConversionData.lastParent = sameRatioIndicators.myParent;
                                callUnitConversionData.lastPosition = sameRatioIndicators.position;
                                callUnitConversionData.lastFontSize = sameRatioIndicators.fontSize;

                                /***************************
                                 Element-Specific Units
                                 ***************************/

                                /* Note: IE8 rounds to the nearest pixel when returning CSS values, thus we perform conversions using a measurement
                                 of 100 (instead of 1) to give our ratios a precision of at least 2 decimal values. */
                                var measurement = 100,
                                    unitRatios = {};

                                if (!sameEmRatio || !samePercentRatio) {
                                    var dummy = data && data.isSVG ? document.createElementNS("http://www.w3.org/2000/svg", "rect") : document.createElement("div");

                                    Velocity.init(dummy);
                                    sameRatioIndicators.myParent.appendChild(dummy);

                                    /* To accurately and consistently calculate conversion ratios, the element's cascaded overflow and box-sizing are stripped.
                                     Similarly, since width/height can be artificially constrained by their min-/max- equivalents, these are controlled for as well. */
                                    /* Note: Overflow must be also be controlled for per-axis since the overflow property overwrites its per-axis values. */
                                    $.each(["overflow", "overflowX", "overflowY"], function (i, property) {
                                        Velocity.CSS.setPropertyValue(dummy, property, "hidden");
                                    });
                                    Velocity.CSS.setPropertyValue(dummy, "position", sameRatioIndicators.position);
                                    Velocity.CSS.setPropertyValue(dummy, "fontSize", sameRatioIndicators.fontSize);
                                    Velocity.CSS.setPropertyValue(dummy, "boxSizing", "content-box");

                                    /* width and height act as our proxy properties for measuring the horizontal and vertical % ratios. */
                                    $.each(["minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height"], function (i, property) {
                                        Velocity.CSS.setPropertyValue(dummy, property, measurement + "%");
                                    });
                                    /* paddingLeft arbitrarily acts as our proxy property for the em ratio. */
                                    Velocity.CSS.setPropertyValue(dummy, "paddingLeft", measurement + "em");

                                    /* Divide the returned value by the measurement to get the ratio between 1% and 1px. Default to 1 since working with 0 can produce Infinite. */
                                    unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth = (parseFloat(CSS.getPropertyValue(dummy, "width", null, true)) || 1) / measurement; /* GET */
                                    unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight = (parseFloat(CSS.getPropertyValue(dummy, "height", null, true)) || 1) / measurement; /* GET */
                                    unitRatios.emToPx = callUnitConversionData.lastEmToPx = (parseFloat(CSS.getPropertyValue(dummy, "paddingLeft")) || 1) / measurement; /* GET */

                                    sameRatioIndicators.myParent.removeChild(dummy);
                                } else {
                                    unitRatios.emToPx = callUnitConversionData.lastEmToPx;
                                    unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth;
                                    unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight;
                                }

                                /***************************
                                 Element-Agnostic Units
                                 ***************************/

                                /* Whereas % and em ratios are determined on a per-element basis, the rem unit only needs to be checked
                                 once per call since it's exclusively dependant upon document.body's fontSize. If this is the first time
                                 that calculateUnitRatios() is being run during this call, remToPx will still be set to its default value of null,
                                 so we calculate it now. */
                                if (callUnitConversionData.remToPx === null) {
                                    /* Default to browsers' default fontSize of 16px in the case of 0. */
                                    callUnitConversionData.remToPx = parseFloat(CSS.getPropertyValue(document.body, "fontSize")) || 16; /* GET */
                                }

                                /* Similarly, viewport units are %-relative to the window's inner dimensions. */
                                if (callUnitConversionData.vwToPx === null) {
                                    callUnitConversionData.vwToPx = parseFloat(window.innerWidth) / 100; /* GET */
                                    callUnitConversionData.vhToPx = parseFloat(window.innerHeight) / 100; /* GET */
                                }

                                unitRatios.remToPx = callUnitConversionData.remToPx;
                                unitRatios.vwToPx = callUnitConversionData.vwToPx;
                                unitRatios.vhToPx = callUnitConversionData.vhToPx;

                                if (Velocity.debug >= 1) {
                                    console.log("Unit ratios: " + JSON.stringify(unitRatios), element);
                                }
                                return unitRatios;
                            };

                            /********************
                             Unit Conversion
                             ********************/

                            /* The * and / operators, which are not passed in with an associated unit, inherently use startValue's unit. Skip value and unit conversion. */
                            if (/[\/*]/.test(operator)) {
                                endValueUnitType = startValueUnitType;
                                /* If startValue and endValue differ in unit type, convert startValue into the same unit type as endValue so that if endValueUnitType
                                 is a relative unit (%, em, rem), the values set during tweening will continue to be accurately relative even if the metrics they depend
                                 on are dynamically changing during the course of the animation. Conversely, if we always normalized into px and used px for setting values, the px ratio
                                 would become stale if the original unit being animated toward was relative and the underlying metrics change during the animation. */
                                /* Since 0 is 0 in any unit type, no conversion is necessary when startValue is 0 -- we just start at 0 with endValueUnitType. */
                            } else if (startValueUnitType !== endValueUnitType && startValue !== 0) {
                                /* Unit conversion is also skipped when endValue is 0, but *startValueUnitType* must be used for tween values to remain accurate. */
                                /* Note: Skipping unit conversion here means that if endValueUnitType was originally a relative unit, the animation won't relatively
                                 match the underlying metrics if they change, but this is acceptable since we're animating toward invisibility instead of toward visibility,
                                 which remains past the point of the animation's completion. */
                                if (endValue === 0) {
                                    endValueUnitType = startValueUnitType;
                                } else {
                                    /* By this point, we cannot avoid unit conversion (it's undesirable since it causes layout thrashing).
                                     If we haven't already, we trigger calculateUnitRatios(), which runs once per element per call. */
                                    elementUnitConversionData = elementUnitConversionData || calculateUnitRatios();

                                    /* The following RegEx matches CSS properties that have their % values measured relative to the x-axis. */
                                    /* Note: W3C spec mandates that all of margin and padding's properties (even top and bottom) are %-relative to the *width* of the parent element. */
                                    var axis = /margin|padding|left|right|width|text|word|letter/i.test(property) || /X$/.test(property) || property === "x" ? "x" : "y";

                                    /* In order to avoid generating n^2 bespoke conversion functions, unit conversion is a two-step process:
                                     1) Convert startValue into pixels. 2) Convert this new pixel value into endValue's unit type. */
                                    switch (startValueUnitType) {
                                        case "%":
                                            /* Note: translateX and translateY are the only properties that are %-relative to an element's own dimensions -- not its parent's dimensions.
                                             Velocity does not include a special conversion process to account for this behavior. Therefore, animating translateX/Y from a % value
                                             to a non-% value will produce an incorrect start value. Fortunately, this sort of cross-unit conversion is rarely done by users in practice. */
                                            startValue *= axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight;
                                            break;

                                        case "px":
                                            /* px acts as our midpoint in the unit conversion process; do nothing. */
                                            break;

                                        default:
                                            startValue *= elementUnitConversionData[startValueUnitType + "ToPx"];
                                    }

                                    /* Invert the px ratios to convert into to the target unit. */
                                    switch (endValueUnitType) {
                                        case "%":
                                            startValue *= 1 / (axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
                                            break;

                                        case "px":
                                            /* startValue is already in px, do nothing; we're done. */
                                            break;

                                        default:
                                            startValue *= 1 / elementUnitConversionData[endValueUnitType + "ToPx"];
                                    }
                                }
                            }

                            /*********************
                             Relative Values
                             *********************/

                            /* Operator logic must be performed last since it requires unit-normalized start and end values. */
                            /* Note: Relative *percent values* do not behave how most people think; while one would expect "+=50%"
                             to increase the property 1.5x its current value, it in fact increases the percent units in absolute terms:
                             50 points is added on top of the current % value. */
                            switch (operator) {
                                case "+":
                                    endValue = startValue + endValue;
                                    break;

                                case "-":
                                    endValue = startValue - endValue;
                                    break;

                                case "*":
                                    endValue = startValue * endValue;
                                    break;

                                case "/":
                                    endValue = startValue / endValue;
                                    break;
                            }

                            /**************************
                             tweensContainer Push
                             **************************/

                            /* Construct the per-property tween object, and push it to the element's tweensContainer. */
                            tweensContainer[property] = {
                                rootPropertyValue: rootPropertyValue,
                                startValue: startValue,
                                currentValue: startValue,
                                endValue: endValue,
                                unitType: endValueUnitType,
                                easing: easing
                            };
                            if (pattern) {
                                tweensContainer[property].pattern = pattern;
                            }

                            if (Velocity.debug) {
                                console.log("tweensContainer (" + property + "): " + JSON.stringify(tweensContainer[property]), element);
                            }
                        };

                        /* Create a tween out of each property, and append its associated data to tweensContainer. */
                        for (var property in propertiesMap) {

                            if (!propertiesMap.hasOwnProperty(property)) {
                                continue;
                            }
                            /* The original property name's format must be used for the parsePropertyValue() lookup,
                             but we then use its camelCase styling to normalize it for manipulation. */
                            var propertyName = CSS.Names.camelCase(property),
                                valueData = parsePropertyValue(propertiesMap[property]);

                            /* Find shorthand color properties that have been passed a hex string. */
                            /* Would be quicker to use CSS.Lists.colors.includes() if possible */
                            if (CSS.Lists.colors.indexOf(propertyName) >= 0) {
                                /* Parse the value data for each shorthand. */
                                var endValue = valueData[0],
                                    easing = valueData[1],
                                    startValue = valueData[2];

                                if (CSS.RegEx.isHex.test(endValue)) {
                                    /* Convert the hex strings into their RGB component arrays. */
                                    var colorComponents = ["Red", "Green", "Blue"],
                                        endValueRGB = CSS.Values.hexToRgb(endValue),
                                        startValueRGB = startValue ? CSS.Values.hexToRgb(startValue) : undefined;

                                    /* Inject the RGB component tweens into propertiesMap. */
                                    for (var i = 0; i < colorComponents.length; i++) {
                                        var dataArray = [endValueRGB[i]];

                                        if (easing) {
                                            dataArray.push(easing);
                                        }

                                        if (startValueRGB !== undefined) {
                                            dataArray.push(startValueRGB[i]);
                                        }

                                        fixPropertyValue(propertyName + colorComponents[i], dataArray);
                                    }
                                    /* If we have replaced a shortcut color value then don't update the standard property name */
                                    continue;
                                }
                            }
                            fixPropertyValue(propertyName, valueData);
                        }

                        /* Along with its property data, store a reference to the element itself onto tweensContainer. */
                        tweensContainer.element = element;
                    }

                    /*****************
                     Call Push
                     *****************/

                    /* Note: tweensContainer can be empty if all of the properties in this call's property map were skipped due to not
                     being supported by the browser. The element property is used for checking that the tweensContainer has been appended to. */
                    if (tweensContainer.element) {
                        /* Apply the "velocity-animating" indicator class. */
                        CSS.Values.addClass(element, "velocity-animating");

                        /* The call array houses the tweensContainers for each element being animated in the current call. */
                        call.push(tweensContainer);

                        data = Data(element);

                        if (data) {
                            /* Store the tweensContainer and options if we're working on the default effects queue, so that they can be used by the reverse command. */
                            if (opts.queue === "") {

                                data.tweensContainer = tweensContainer;
                                data.opts = opts;
                            }

                            /* Switch on the element's animating flag. */
                            data.isAnimating = true;
                        }

                        /* Once the final element in this call's element set has been processed, push the call array onto
                         Velocity.State.calls for the animation tick to immediately begin processing. */
                        if (elementsIndex === elementsLength - 1) {
                            /* Add the current call plus its associated metadata (the element set and the call's options) onto the global call container.
                             Anything on this call container is subjected to tick() processing. */
                            Velocity.State.calls.push([call, elements, opts, null, promiseData.resolver, null, 0]);

                            /* If the animation tick isn't running, start it. (Velocity shuts it off when there are no active calls to process.) */
                            if (Velocity.State.isTicking === false) {
                                Velocity.State.isTicking = true;

                                /* Start the tick loop. */
                                tick();
                            }
                        } else {
                            elementsIndex++;
                        }
                    }
                }

                /* When the queue option is set to false, the call skips the element's queue and fires immediately. */
                if (opts.queue === false) {
                    /* Since this buildQueue call doesn't respect the element's existing queue (which is where a delay option would have been appended),
                     we manually inject the delay property here with an explicit setTimeout. */
                    if (opts.delay) {

                        /* Temporarily store delayed elements to facilitate access for global pause/resume */
                        var callIndex = Velocity.State.delayedElements.count++;
                        Velocity.State.delayedElements[callIndex] = element;

                        var delayComplete = function (index) {
                            return function () {
                                /* Clear the temporary element */
                                Velocity.State.delayedElements[index] = false;

                                /* Finally, issue the call */
                                buildQueue();
                            };
                        }(callIndex);

                        Data(element).delayBegin = new Date().getTime();
                        Data(element).delay = parseFloat(opts.delay);
                        Data(element).delayTimer = {
                            setTimeout: setTimeout(buildQueue, parseFloat(opts.delay)),
                            next: delayComplete
                        };
                    } else {
                        buildQueue();
                    }
                    /* Otherwise, the call undergoes element queueing as normal. */
                    /* Note: To interoperate with jQuery, Velocity uses jQuery's own $.queue() stack for queuing logic. */
                } else {
                    $.queue(element, opts.queue, function (next, clearQueue) {
                        /* If the clearQueue flag was passed in by the stop command, resolve this call's promise. (Promises can only be resolved once,
                         so it's fine if this is repeatedly triggered for each element in the associated call.) */
                        if (clearQueue === true) {
                            if (promiseData.promise) {
                                promiseData.resolver(elements);
                            }

                            /* Do not continue with animation queueing. */
                            return true;
                        }

                        /* This flag indicates to the upcoming completeCall() function that this queue entry was initiated by Velocity.
                         See completeCall() for further details. */
                        Velocity.velocityQueueEntryFlag = true;

                        buildQueue(next);
                    });
                }

                /*********************
                 Auto-Dequeuing
                 *********************/

                /* As per jQuery's $.queue() behavior, to fire the first non-custom-queue entry on an element, the element
                 must be dequeued if its queue stack consists *solely* of the current call. (This can be determined by checking
                 for the "inprogress" item that jQuery prepends to active queue stack arrays.) Regardless, whenever the element's
                 queue is further appended with additional items -- including $.delay()'s or even $.animate() calls, the queue's
                 first entry is automatically fired. This behavior contrasts that of custom queues, which never auto-fire. */
                /* Note: When an element set is being subjected to a non-parallel Velocity call, the animation will not begin until
                 each one of the elements in the set has reached the end of its individually pre-existing queue chain. */
                /* Note: Unfortunately, most people don't fully grasp jQuery's powerful, yet quirky, $.queue() function.
                 Lean more here: http://stackoverflow.com/questions/1058158/can-somebody-explain-jquery-queue-to-me */
                if ((opts.queue === "" || opts.queue === "fx") && $.queue(element)[0] !== "inprogress") {
                    $.dequeue(element);
                }
            }

            /**************************
             Element Set Iteration
             **************************/

            /* If the "nodeType" property exists on the elements variable, we're animating a single element.
             Place it in an array so that $.each() can iterate over it. */
            $.each(elements, function (i, element) {
                /* Ensure each element in a set has a nodeType (is a real element) to avoid throwing errors. */
                if (Type.isNode(element)) {
                    processElement(element, i);
                }
            });

            /******************
             Option: Loop
             ******************/

            /* The loop option accepts an integer indicating how many times the element should loop between the values in the
             current call's properties map and the element's property values prior to this call. */
            /* Note: The loop option's logic is performed here -- after element processing -- because the current call needs
             to undergo its queue insertion prior to the loop option generating its series of constituent "reverse" calls,
             which chain after the current call. Two reverse calls (two "alternations") constitute one loop. */
            opts = $.extend({}, Velocity.defaults, options);
            opts.loop = parseInt(opts.loop, 10);
            var reverseCallsCount = opts.loop * 2 - 1;

            if (opts.loop) {
                /* Double the loop count to convert it into its appropriate number of "reverse" calls.
                 Subtract 1 from the resulting value since the current call is included in the total alternation count. */
                for (var x = 0; x < reverseCallsCount; x++) {
                    /* Since the logic for the reverse action occurs inside Queueing and therefore this call's options object
                     isn't parsed until then as well, the current call's delay option must be explicitly passed into the reverse
                     call so that the delay logic that occurs inside *Pre-Queueing* can process it. */
                    var reverseOptions = {
                        delay: opts.delay,
                        progress: opts.progress
                    };

                    /* If a complete callback was passed into this call, transfer it to the loop redirect's final "reverse" call
                     so that it's triggered when the entire redirect is complete (and not when the very first animation is complete). */
                    if (x === reverseCallsCount - 1) {
                        reverseOptions.display = opts.display;
                        reverseOptions.visibility = opts.visibility;
                        reverseOptions.complete = opts.complete;
                    }

                    animate(elements, "reverse", reverseOptions);
                }
            }

            /***************
             Chaining
             ***************/

            /* Return the elements back to the call chain, with wrapped elements taking precedence in case Velocity was called via the $.fn. extension. */
            return getChain();
        };

        /* Turn Velocity into the animation function, extended with the pre-existing Velocity object. */
        Velocity = $.extend(animate, Velocity);
        /* For legacy support, also expose the literal animate method. */
        Velocity.animate = animate;

        /**************
         Timing
         **************/

        /* Ticker function. */
        var ticker = window.requestAnimationFrame || rAFShim;

        /* Inactive browser tabs pause rAF, which results in all active animations immediately sprinting to their completion states when the tab refocuses.
         To get around this, we dynamically switch rAF to setTimeout (which the browser *doesn't* pause) when the tab loses focus. We skip this for mobile
         devices to avoid wasting battery power on inactive tabs. */
        /* Note: Tab focus detection doesn't work on older versions of IE, but that's okay since they don't support rAF to begin with. */
        if (!Velocity.State.isMobile && document.hidden !== undefined) {
            var updateTicker = function updateTicker() {
                /* Reassign the rAF function (which the global tick() function uses) based on the tab's focus state. */
                if (document.hidden) {
                    ticker = function ticker(callback) {
                        /* The tick function needs a truthy first argument in order to pass its internal timestamp check. */
                        return setTimeout(function () {
                            callback(true);
                        }, 16);
                    };

                    /* The rAF loop has been paused by the browser, so we manually restart the tick. */
                    tick();
                } else {
                    ticker = window.requestAnimationFrame || rAFShim;
                }
            };

            /* Page could be sitting in the background at this time (i.e. opened as new tab) so making sure we use correct ticker from the start */
            updateTicker();

            /* And then run check again every time visibility changes */
            document.addEventListener("visibilitychange", updateTicker);
        }

        /************
         Tick
         ************/

        /* Note: All calls to Velocity are pushed to the Velocity.State.calls array, which is fully iterated through upon each tick. */
        function tick(timestamp) {
            /* An empty timestamp argument indicates that this is the first tick occurence since ticking was turned on.
             We leverage this metadata to fully ignore the first tick pass since RAF's initial pass is fired whenever
             the browser's next tick sync time occurs, which results in the first elements subjected to Velocity
             calls being animated out of sync with any elements animated immediately thereafter. In short, we ignore
             the first RAF tick pass so that elements being immediately consecutively animated -- instead of simultaneously animated
             by the same Velocity call -- are properly batched into the same initial RAF tick and consequently remain in sync thereafter. */
            if (timestamp) {
                /* We normally use RAF's high resolution timestamp but as it can be significantly offset when the browser is
                 under high stress we give the option for choppiness over allowing the browser to drop huge chunks of frames.
                 We use performance.now() and shim it if it doesn't exist for when the tab is hidden. */
                var timeCurrent = Velocity.timestamp && timestamp !== true ? timestamp : performance.now();

                /********************
                 Call Iteration
                 ********************/

                var callsLength = Velocity.State.calls.length;

                /* To speed up iterating over this array, it is compacted (falsey items -- calls that have completed -- are removed)
                 when its length has ballooned to a point that can impact tick performance. This only becomes necessary when animation
                 has been continuous with many elements over a long period of time; whenever all active calls are completed, completeCall() clears Velocity.State.calls. */
                if (callsLength > 10000) {
                    Velocity.State.calls = compactSparseArray(Velocity.State.calls);
                    callsLength = Velocity.State.calls.length;
                }

                /* Iterate through each active call. */
                for (var i = 0; i < callsLength; i++) {
                    /* When a Velocity call is completed, its Velocity.State.calls entry is set to false. Continue on to the next call. */
                    if (!Velocity.State.calls[i]) {
                        continue;
                    }

                    /************************
                     Call-Wide Variables
                     ************************/

                    var callContainer = Velocity.State.calls[i],
                        call = callContainer[0],
                        opts = callContainer[2],
                        timeStart = callContainer[3],
                        firstTick = !!timeStart,
                        tweenDummyValue = null,
                        pauseObject = callContainer[5],
                        millisecondsEllapsed = callContainer[6];

                    /* If timeStart is undefined, then this is the first time that this call has been processed by tick().
                     We assign timeStart now so that its value is as close to the real animation start time as possible.
                     (Conversely, had timeStart been defined when this call was added to Velocity.State.calls, the delay
                     between that time and now would cause the first few frames of the tween to be skipped since
                     percentComplete is calculated relative to timeStart.) */
                    /* Further, subtract 16ms (the approximate resolution of RAF) from the current time value so that the
                     first tick iteration isn't wasted by animating at 0% tween completion, which would produce the
                     same style value as the element's current value. */
                    if (!timeStart) {
                        timeStart = Velocity.State.calls[i][3] = timeCurrent - 16;
                    }

                    /* If a pause object is present, skip processing unless it has been set to resume */
                    if (pauseObject) {
                        if (pauseObject.resume === true) {
                            /* Update the time start to accomodate the paused completion amount */
                            timeStart = callContainer[3] = Math.round(timeCurrent - millisecondsEllapsed - 16);

                            /* Remove pause object after processing */
                            callContainer[5] = null;
                        } else {
                            continue;
                        }
                    }

                    millisecondsEllapsed = callContainer[6] = timeCurrent - timeStart;

                    /* The tween's completion percentage is relative to the tween's start time, not the tween's start value
                     (which would result in unpredictable tween durations since JavaScript's timers are not particularly accurate).
                     Accordingly, we ensure that percentComplete does not exceed 1. */
                    var percentComplete = Math.min(millisecondsEllapsed / opts.duration, 1);

                    /**********************
                     Element Iteration
                     **********************/

                    /* For every call, iterate through each of the elements in its set. */
                    for (var j = 0, callLength = call.length; j < callLength; j++) {
                        var tweensContainer = call[j],
                            element = tweensContainer.element;

                        /* Check to see if this element has been deleted midway through the animation by checking for the
                         continued existence of its data cache. If it's gone, or the element is currently paused, skip animating this element. */
                        if (!Data(element)) {
                            continue;
                        }

                        var transformPropertyExists = false;

                        /**********************************
                         Display & Visibility Toggling
                         **********************************/

                        /* If the display option is set to non-"none", set it upfront so that the element can become visible before tweening begins.
                         (Otherwise, display's "none" value is set in completeCall() once the animation has completed.) */
                        if (opts.display !== undefined && opts.display !== null && opts.display !== "none") {
                            if (opts.display === "flex") {
                                var flexValues = ["-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex"];

                                $.each(flexValues, function (i, flexValue) {
                                    CSS.setPropertyValue(element, "display", flexValue);
                                });
                            }

                            CSS.setPropertyValue(element, "display", opts.display);
                        }

                        /* Same goes with the visibility option, but its "none" equivalent is "hidden". */
                        if (opts.visibility !== undefined && opts.visibility !== "hidden") {
                            CSS.setPropertyValue(element, "visibility", opts.visibility);
                        }

                        /************************
                         Property Iteration
                         ************************/

                        /* For every element, iterate through each property. */
                        for (var property in tweensContainer) {
                            /* Note: In addition to property tween data, tweensContainer contains a reference to its associated element. */
                            if (tweensContainer.hasOwnProperty(property) && property !== "element") {
                                var tween = tweensContainer[property],
                                    currentValue,

                                /* Easing can either be a pre-genereated function or a string that references a pre-registered easing
                                 on the Velocity.Easings object. In either case, return the appropriate easing *function*. */
                                easing = Type.isString(tween.easing) ? Velocity.Easings[tween.easing] : tween.easing;

                                /******************************
                                 Current Value Calculation
                                 ******************************/

                                if (Type.isString(tween.pattern)) {
                                    var patternReplace = percentComplete === 1 ? function ($0, index, round) {
                                        var result = tween.endValue[index];

                                        return round ? Math.round(result) : result;
                                    } : function ($0, index, round) {
                                        var startValue = tween.startValue[index],
                                            tweenDelta = tween.endValue[index] - startValue,
                                            result = startValue + tweenDelta * easing(percentComplete, opts, tweenDelta);

                                        return round ? Math.round(result) : result;
                                    };

                                    currentValue = tween.pattern.replace(/{(\d+)(!)?}/g, patternReplace);
                                } else if (percentComplete === 1) {
                                    /* If this is the last tick pass (if we've reached 100% completion for this tween),
                                     ensure that currentValue is explicitly set to its target endValue so that it's not subjected to any rounding. */
                                    currentValue = tween.endValue;
                                } else {
                                    /* Otherwise, calculate currentValue based on the current delta from startValue. */
                                    var tweenDelta = tween.endValue - tween.startValue;

                                    currentValue = tween.startValue + tweenDelta * easing(percentComplete, opts, tweenDelta);
                                    /* If no value change is occurring, don't proceed with DOM updating. */
                                }
                                if (!firstTick && currentValue === tween.currentValue) {
                                    continue;
                                }

                                tween.currentValue = currentValue;

                                /* If we're tweening a fake 'tween' property in order to log transition values, update the one-per-call variable so that
                                 it can be passed into the progress callback. */
                                if (property === "tween") {
                                    tweenDummyValue = currentValue;
                                } else {
                                    /******************
                                     Hooks: Part I
                                     ******************/
                                    var hookRoot;

                                    /* For hooked properties, the newly-updated rootPropertyValueCache is cached onto the element so that it can be used
                                     for subsequent hooks in this call that are associated with the same root property. If we didn't cache the updated
                                     rootPropertyValue, each subsequent update to the root property in this tick pass would reset the previous hook's
                                     updates to rootPropertyValue prior to injection. A nice performance byproduct of rootPropertyValue caching is that
                                     subsequently chained animations using the same hookRoot but a different hook can use this cached rootPropertyValue. */
                                    if (CSS.Hooks.registered[property]) {
                                        hookRoot = CSS.Hooks.getRoot(property);

                                        var rootPropertyValueCache = Data(element).rootPropertyValueCache[hookRoot];

                                        if (rootPropertyValueCache) {
                                            tween.rootPropertyValue = rootPropertyValueCache;
                                        }
                                    }

                                    /*****************
                                     DOM Update
                                     *****************/

                                    /* setPropertyValue() returns an array of the property name and property value post any normalization that may have been performed. */
                                    /* Note: To solve an IE<=8 positioning bug, the unit type is dropped when setting a property value of 0. */
                                    var adjustedSetData = CSS.setPropertyValue(element, /* SET */
                                    property, tween.currentValue + (IE < 9 && parseFloat(currentValue) === 0 ? "" : tween.unitType), tween.rootPropertyValue, tween.scrollData);

                                    /*******************
                                     Hooks: Part II
                                     *******************/

                                    /* Now that we have the hook's updated rootPropertyValue (the post-processed value provided by adjustedSetData), cache it onto the element. */
                                    if (CSS.Hooks.registered[property]) {
                                        /* Since adjustedSetData contains normalized data ready for DOM updating, the rootPropertyValue needs to be re-extracted from its normalized form. ?? */
                                        if (CSS.Normalizations.registered[hookRoot]) {
                                            Data(element).rootPropertyValueCache[hookRoot] = CSS.Normalizations.registered[hookRoot]("extract", null, adjustedSetData[1]);
                                        } else {
                                            Data(element).rootPropertyValueCache[hookRoot] = adjustedSetData[1];
                                        }
                                    }

                                    /***************
                                     Transforms
                                     ***************/

                                    /* Flag whether a transform property is being animated so that flushTransformCache() can be triggered once this tick pass is complete. */
                                    if (adjustedSetData[0] === "transform") {
                                        transformPropertyExists = true;
                                    }
                                }
                            }
                        }

                        /****************
                         mobileHA
                         ****************/

                        /* If mobileHA is enabled, set the translate3d transform to null to force hardware acceleration.
                         It's safe to override this property since Velocity doesn't actually support its animation (hooks are used in its place). */
                        if (opts.mobileHA) {
                            /* Don't set the null transform hack if we've already done so. */
                            if (Data(element).transformCache.translate3d === undefined) {
                                /* All entries on the transformCache object are later concatenated into a single transform string via flushTransformCache(). */
                                Data(element).transformCache.translate3d = "(0px, 0px, 0px)";

                                transformPropertyExists = true;
                            }
                        }

                        if (transformPropertyExists) {
                            CSS.flushTransformCache(element);
                        }
                    }

                    /* The non-"none" display value is only applied to an element once -- when its associated call is first ticked through.
                     Accordingly, it's set to false so that it isn't re-processed by this call in the next tick. */
                    if (opts.display !== undefined && opts.display !== "none") {
                        Velocity.State.calls[i][2].display = false;
                    }
                    if (opts.visibility !== undefined && opts.visibility !== "hidden") {
                        Velocity.State.calls[i][2].visibility = false;
                    }

                    /* Pass the elements and the timing data (percentComplete, msRemaining, timeStart, tweenDummyValue) into the progress callback. */
                    if (opts.progress) {
                        opts.progress.call(callContainer[1], callContainer[1], percentComplete, Math.max(0, timeStart + opts.duration - timeCurrent), timeStart, tweenDummyValue);
                    }

                    /* If this call has finished tweening, pass its index to completeCall() to handle call cleanup. */
                    if (percentComplete === 1) {
                        completeCall(i);
                    }
                }
            }

            /* Note: completeCall() sets the isTicking flag to false when the last call on Velocity.State.calls has completed. */
            if (Velocity.State.isTicking) {
                ticker(tick);
            }
        }

        /**********************
         Call Completion
         **********************/

        /* Note: Unlike tick(), which processes all active calls at once, call completion is handled on a per-call basis. */
        function completeCall(callIndex, isStopped) {
            /* Ensure the call exists. */
            if (!Velocity.State.calls[callIndex]) {
                return false;
            }

            /* Pull the metadata from the call. */
            var call = Velocity.State.calls[callIndex][0],
                elements = Velocity.State.calls[callIndex][1],
                opts = Velocity.State.calls[callIndex][2],
                resolver = Velocity.State.calls[callIndex][4];

            var remainingCallsExist = false;

            /*************************
             Element Finalization
             *************************/

            for (var i = 0, callLength = call.length; i < callLength; i++) {
                var element = call[i].element;

                /* If the user set display to "none" (intending to hide the element), set it now that the animation has completed. */
                /* Note: display:none isn't set when calls are manually stopped (via Velocity("stop"). */
                /* Note: Display gets ignored with "reverse" calls and infinite loops, since this behavior would be undesirable. */
                if (!isStopped && !opts.loop) {
                    if (opts.display === "none") {
                        CSS.setPropertyValue(element, "display", opts.display);
                    }

                    if (opts.visibility === "hidden") {
                        CSS.setPropertyValue(element, "visibility", opts.visibility);
                    }
                }

                /* If the element's queue is empty (if only the "inprogress" item is left at position 0) or if its queue is about to run
                 a non-Velocity-initiated entry, turn off the isAnimating flag. A non-Velocity-initiatied queue entry's logic might alter
                 an element's CSS values and thereby cause Velocity's cached value data to go stale. To detect if a queue entry was initiated by Velocity,
                 we check for the existence of our special Velocity.queueEntryFlag declaration, which minifiers won't rename since the flag
                 is assigned to jQuery's global $ object and thus exists out of Velocity's own scope. */
                var data = Data(element);

                if (opts.loop !== true && ($.queue(element)[1] === undefined || !/\.velocityQueueEntryFlag/i.test($.queue(element)[1]))) {
                    /* The element may have been deleted. Ensure that its data cache still exists before acting on it. */
                    if (data) {
                        data.isAnimating = false;
                        /* Clear the element's rootPropertyValueCache, which will become stale. */
                        data.rootPropertyValueCache = {};

                        var transformHAPropertyExists = false;
                        /* If any 3D transform subproperty is at its default value (regardless of unit type), remove it. */
                        $.each(CSS.Lists.transforms3D, function (i, transformName) {
                            var defaultValue = /^scale/.test(transformName) ? 1 : 0,
                                currentValue = data.transformCache[transformName];

                            if (data.transformCache[transformName] !== undefined && new RegExp("^\\(" + defaultValue + "[^.]").test(currentValue)) {
                                transformHAPropertyExists = true;

                                delete data.transformCache[transformName];
                            }
                        });

                        /* Mobile devices have hardware acceleration removed at the end of the animation in order to avoid hogging the GPU's memory. */
                        if (opts.mobileHA) {
                            transformHAPropertyExists = true;
                            delete data.transformCache.translate3d;
                        }

                        /* Flush the subproperty removals to the DOM. */
                        if (transformHAPropertyExists) {
                            CSS.flushTransformCache(element);
                        }

                        /* Remove the "velocity-animating" indicator class. */
                        CSS.Values.removeClass(element, "velocity-animating");
                    }
                }

                /*********************
                 Option: Complete
                 *********************/

                /* Complete is fired once per call (not once per element) and is passed the full raw DOM element set as both its context and its first argument. */
                /* Note: Callbacks aren't fired when calls are manually stopped (via Velocity("stop"). */
                if (!isStopped && opts.complete && !opts.loop && i === callLength - 1) {
                    /* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
                    try {
                        opts.complete.call(elements, elements);
                    } catch (error) {
                        setTimeout(function () {
                            throw error;
                        }, 1);
                    }
                }

                /**********************
                 Promise Resolving
                 **********************/

                /* Note: Infinite loops don't return promises. */
                if (resolver && opts.loop !== true) {
                    resolver(elements);
                }

                /****************************
                 Option: Loop (Infinite)
                 ****************************/

                if (data && opts.loop === true && !isStopped) {
                    /* If a rotateX/Y/Z property is being animated by 360 deg with loop:true, swap tween start/end values to enable
                     continuous iterative rotation looping. (Otherise, the element would just rotate back and forth.) */
                    $.each(data.tweensContainer, function (propertyName, tweenContainer) {
                        if (/^rotate/.test(propertyName) && (parseFloat(tweenContainer.startValue) - parseFloat(tweenContainer.endValue)) % 360 === 0) {
                            var oldStartValue = tweenContainer.startValue;

                            tweenContainer.startValue = tweenContainer.endValue;
                            tweenContainer.endValue = oldStartValue;
                        }

                        if (/^backgroundPosition/.test(propertyName) && parseFloat(tweenContainer.endValue) === 100 && tweenContainer.unitType === "%") {
                            tweenContainer.endValue = 0;
                            tweenContainer.startValue = 100;
                        }
                    });

                    Velocity(element, "reverse", { loop: true, delay: opts.delay });
                }

                /***************
                 Dequeueing
                 ***************/

                /* Fire the next call in the queue so long as this call's queue wasn't set to false (to trigger a parallel animation),
                 which would have already caused the next call to fire. Note: Even if the end of the animation queue has been reached,
                 $.dequeue() must still be called in order to completely clear jQuery's animation queue. */
                if (opts.queue !== false) {
                    $.dequeue(element, opts.queue);
                }
            }

            /************************
             Calls Array Cleanup
             ************************/

            /* Since this call is complete, set it to false so that the rAF tick skips it. This array is later compacted via compactSparseArray().
             (For performance reasons, the call is set to false instead of being deleted from the array: http://www.html5rocks.com/en/tutorials/speed/v8/) */
            Velocity.State.calls[callIndex] = false;

            /* Iterate through the calls array to determine if this was the final in-progress animation.
             If so, set a flag to end ticking and clear the calls array. */
            for (var j = 0, callsLength = Velocity.State.calls.length; j < callsLength; j++) {
                if (Velocity.State.calls[j] !== false) {
                    remainingCallsExist = true;

                    break;
                }
            }

            if (remainingCallsExist === false) {
                /* tick() will detect this flag upon its next iteration and subsequently turn itself off. */
                Velocity.State.isTicking = false;

                /* Clear the calls array so that its length is reset. */
                delete Velocity.State.calls;
                Velocity.State.calls = [];
            }
        }

        /******************
         Frameworks
         ******************/

        /* Both jQuery and Zepto allow their $.fn object to be extended to allow wrapped elements to be subjected to plugin calls.
         If either framework is loaded, register a "velocity" extension pointing to Velocity's core animate() method.  Velocity
         also registers itself onto a global container (window.jQuery || window.Zepto || window) so that certain features are
         accessible beyond just a per-element scope. This master object contains an .animate() method, which is later assigned to $.fn
         (if jQuery or Zepto are present). Accordingly, Velocity can both act on wrapped DOM elements and stand alone for targeting raw DOM elements. */
        global.Velocity = Velocity;

        if (global !== window) {
            /* Assign the element function to Velocity's core animate() method. */
            global.fn.velocity = animate;
            /* Assign the object function's defaults to Velocity's global defaults object. */
            global.fn.velocity.defaults = Velocity.defaults;
        }

        /***********************
         Packaged Redirects
         ***********************/

        /* slideUp, slideDown */
        $.each(["Down", "Up"], function (i, direction) {
            Velocity.Redirects["slide" + direction] = function (element, options, elementsIndex, elementsSize, elements, promiseData) {
                var opts = $.extend({}, options),
                    begin = opts.begin,
                    complete = opts.complete,
                    inlineValues = {},
                    computedValues = { height: "", marginTop: "", marginBottom: "", paddingTop: "", paddingBottom: "" };

                if (opts.display === undefined) {
                    /* Show the element before slideDown begins and hide the element after slideUp completes. */
                    /* Note: Inline elements cannot have dimensions animated, so they're reverted to inline-block. */
                    opts.display = direction === "Down" ? Velocity.CSS.Values.getDisplayType(element) === "inline" ? "inline-block" : "block" : "none";
                }

                opts.begin = function () {
                    /* If the user passed in a begin callback, fire it now. */
                    if (elementsIndex === 0 && begin) {
                        begin.call(elements, elements);
                    }

                    /* Cache the elements' original vertical dimensional property values so that we can animate back to them. */
                    for (var property in computedValues) {
                        if (!computedValues.hasOwnProperty(property)) {
                            continue;
                        }
                        inlineValues[property] = element.style[property];

                        /* For slideDown, use forcefeeding to animate all vertical properties from 0. For slideUp,
                         use forcefeeding to start from computed values and animate down to 0. */
                        var propertyValue = CSS.getPropertyValue(element, property);
                        computedValues[property] = direction === "Down" ? [propertyValue, 0] : [0, propertyValue];
                    }

                    /* Force vertical overflow content to clip so that sliding works as expected. */
                    inlineValues.overflow = element.style.overflow;
                    element.style.overflow = "hidden";
                };

                opts.complete = function () {
                    /* Reset element to its pre-slide inline values once its slide animation is complete. */
                    for (var property in inlineValues) {
                        if (inlineValues.hasOwnProperty(property)) {
                            element.style[property] = inlineValues[property];
                        }
                    }

                    /* If the user passed in a complete callback, fire it now. */
                    if (elementsIndex === elementsSize - 1) {
                        if (complete) {
                            complete.call(elements, elements);
                        }
                        if (promiseData) {
                            promiseData.resolver(elements);
                        }
                    }
                };

                Velocity(element, computedValues, opts);
            };
        });

        /* fadeIn, fadeOut */
        $.each(["In", "Out"], function (i, direction) {
            Velocity.Redirects["fade" + direction] = function (element, options, elementsIndex, elementsSize, elements, promiseData) {
                var opts = $.extend({}, options),
                    complete = opts.complete,
                    propertiesMap = { opacity: direction === "In" ? 1 : 0 };

                /* Since redirects are triggered individually for each element in the animated set, avoid repeatedly triggering
                 callbacks by firing them only when the final element has been reached. */
                if (elementsIndex !== 0) {
                    opts.begin = null;
                }
                if (elementsIndex !== elementsSize - 1) {
                    opts.complete = null;
                } else {
                    opts.complete = function () {
                        if (complete) {
                            complete.call(elements, elements);
                        }
                        if (promiseData) {
                            promiseData.resolver(elements);
                        }
                    };
                }

                /* If a display was passed in, use it. Otherwise, default to "none" for fadeOut or the element-specific default for fadeIn. */
                /* Note: We allow users to pass in "null" to skip display setting altogether. */
                if (opts.display === undefined) {
                    opts.display = direction === "In" ? "auto" : "none";
                }

                Velocity(this, propertiesMap, opts);
            };
        });

        return Velocity;
    }(window.jQuery || window.Zepto || window, window, window ? window.document : undefined);
});

/******************
 Known Issues
 ******************/

/* The CSS spec mandates that the translateX/Y/Z transforms are %-relative to the element itself -- not its parent.
 Velocity, however, doesn't make this distinction. Thus, converting to or from the % unit with these subproperties
 will produce an inaccurate conversion value. The same issue exists with the cx/cy attributes of SVG circles and ellipses. */

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * страница About
 */
exports.default = {
  /**
   * метод инициализации для страницы About
   */
  init: function init() {}
};

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * страница Home
 */
exports.default = {
  /**
   * метод инициализации для страницы
   */
  init: function init() {
    /**
     * инициализируем сладейр для home page
     */
    this.main_slider();
    this.try_ES6();
  },


  /**
   * метод для иницилизации слайдера
   */
  main_slider: function main_slider() {
    console.log('Main slider for home page', this);
  },
  try_ES6: function try_ES6() {},
  example_wp_ajax: function example_wp_ajax() {}
};

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('../libs/materialize/global');

require('../libs/materialize/velocity');

require('../libs/materialize/jquery.easing.1.3');

require('../libs/materialize/scrollspy');

require('../libs/materialize/tabs');

exports.default = {
    /**
     * метод для инициализации модального
     * окна, которое есть на нескольких страницах
     */
    init: function init() {
        this.headerFunctions();
    },
    headerFunctions: function headerFunctions() {
        $('.scrollspy').scrollSpy({
            scrollOffset: 0
        });
    }
};

},{"../libs/materialize/global":2,"../libs/materialize/jquery.easing.1.3":3,"../libs/materialize/scrollspy":4,"../libs/materialize/tabs":5,"../libs/materialize/velocity":6}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvZ2xvYmFsLmpzIiwiYXNzZXRzL2pzL2xpYnMvbWF0ZXJpYWxpemUvZ2xvYmFsLmpzIiwiYXNzZXRzL2pzL2xpYnMvbWF0ZXJpYWxpemUvanF1ZXJ5LmVhc2luZy4xLjMuanMiLCJhc3NldHMvanMvbGlicy9tYXRlcmlhbGl6ZS9zY3JvbGxzcHkuanMiLCJhc3NldHMvanMvbGlicy9tYXRlcmlhbGl6ZS90YWJzLmpzIiwiYXNzZXRzL2pzL2xpYnMvbWF0ZXJpYWxpemUvdmVsb2NpdHkuanMiLCJhc3NldHMvanMvbW9kdWxlcy9BQk9VVC5qcyIsImFzc2V0cy9qcy9tb2R1bGVzL0hPTUUuanMiLCJhc3NldHMvanMvbW9kdWxlcy9nbG9iYWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUNBOzs7O0FBSUEsSUFBSSxPQUFPLElBQVg7QUFDQTs7OztBQUlBLFFBQVEsT0FBTyxJQUFQLENBQVksSUFBcEI7QUFDSSxTQUFLLFdBQUw7QUFDSSxlQUFPLGVBQUssSUFBTCxDQUFVLElBQVYsZ0JBQVA7QUFDQTtBQUNKLFNBQUssWUFBTDtBQUNBLFNBQUssY0FBTDtBQUNJLGVBQU8sZ0JBQU0sSUFBTixDQUFXLElBQVgsaUJBQVA7QUFDQTtBQUNKO0FBQ0ksZUFBTyxnQkFBTTtBQUNULG9CQUFRLEdBQVIsQ0FBWSxjQUFaO0FBQ0gsU0FGRDtBQVRSO0FBYUE7OztBQUdBLEVBQUUsUUFBRixFQUFZLEtBQVosQ0FBa0IsaUJBQU8sSUFBUCxFQUFsQixFQUFpQyxNQUFqQzs7Ozs7OztBQzVCQTtBQUNBLENBQUMsVUFBUyxNQUFULEVBQWdCO0FBQ2YsTUFBRyxPQUFPLE9BQVYsRUFBa0I7QUFDaEIsa0JBQWMsRUFBZDtBQUNELEdBRkQsTUFFTztBQUNMLFdBQU8sV0FBUCxHQUFxQixFQUFyQjtBQUNEO0FBQ0YsQ0FO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Q0FFbEI7QUF6QlUsQzs7Ozs7Ozs7O0FDSGY7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O2tCQUVlO0FBQ1g7Ozs7QUFJQSxRQUxXLGtCQUtMO0FBQ0YsYUFBSyxlQUFMO0FBQ0gsS0FQVTtBQVNYLG1CQVRXLDZCQVNRO0FBQ2YsVUFBRSxZQUFGLEVBQWdCLFNBQWhCLENBQTBCO0FBQ3RCLDBCQUFjO0FBRFEsU0FBMUI7QUFHSDtBQWJVLEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEdMT0JBTCBmcm9tIFwiLi9tb2R1bGVzL2dsb2JhbFwiO1xuaW1wb3J0IEhPTUUgZnJvbSBcIi4vbW9kdWxlcy9IT01FXCI7XG5pbXBvcnQgQUJPVVQgZnJvbSBcIi4vbW9kdWxlcy9BQk9VVFwiO1xuLyoqXG4gKiDQodC+0LfQtNCw0LXQvCDRhNGD0L3QutGG0LjRjiBpbml0LCDQutC+0YLQvtGA0LDRj1xuICog0LHRg9C00LXRgiDQstGL0LfRi9Cy0LDRgtGM0YHRjyDQsiDQu9GO0LHQvtC8INGB0LvRg9GH0LDQtVxuICovXG5sZXQgaW5pdCA9IG51bGw7XG4vKipcbiAqINCf0LXRgNC10LHQuNGA0LDQtdC8IHdpbmRvdy52YXJzLnBhZ2UsXG4gKiDRh9GC0L7QsdGLINCy0YvRj9GB0L3QuNGC0YwsINC60LDQutCw0Y8g0YMg0L3QsNGBINGB0YLRgNCw0L3QuNGG0LBcbiAqL1xuc3dpdGNoIChnbG9iYWwudmFycy5wYWdlKSB7XG4gICAgY2FzZSAnaG9tZV9wYWdlJzpcbiAgICAgICAgaW5pdCA9IEhPTUUuaW5pdC5iaW5kKEhPTUUpO1xuICAgICAgICBicmVhaztcbiAgICBjYXNlICdhYm91dF9wYWdlJzpcbiAgICBjYXNlICdjb250YWN0X3BhZ2UnOlxuICAgICAgICBpbml0ID0gQUJPVVQuaW5pdC5iaW5kKEFCT1VUKTtcbiAgICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgICAgaW5pdCA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZWZhdWx0IGluaXQnKTtcbiAgICAgICAgfTtcbn1cbi8qKlxuICog0JLQtdGI0LDQtdC8INC90LAgZG9jdW1lbnQub25yZWFkeSDQvdCw0YjRgyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRjiDRgdGC0YDQsNC90LjRhtGLXG4gKi9cbiQoZG9jdW1lbnQpLnJlYWR5KEdMT0JBTC5pbml0KCksIGluaXQoKSk7IiwiLy8gUmVxdWlyZWQgZm9yIE1ldGVvciBwYWNrYWdlLCB0aGUgdXNlIG9mIHdpbmRvdyBwcmV2ZW50cyBleHBvcnQgYnkgTWV0ZW9yXG4oZnVuY3Rpb24od2luZG93KXtcbiAgaWYod2luZG93LlBhY2thZ2Upe1xuICAgIE1hdGVyaWFsaXplID0ge307XG4gIH0gZWxzZSB7XG4gICAgd2luZG93Lk1hdGVyaWFsaXplID0ge307XG4gIH1cbn0pKHdpbmRvdyk7XG5cblxuLypcbiAqIHJhZi5qc1xuICogaHR0cHM6Ly9naXRodWIuY29tL25ncnltYW4vcmFmLmpzXG4gKlxuICogb3JpZ2luYWwgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHBvbHlmaWxsIGJ5IEVyaWsgTcO2bGxlclxuICogaW5zcGlyZWQgZnJvbSBwYXVsX2lyaXNoIGdpc3QgYW5kIHBvc3RcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgbmdyeW1hblxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICovXG4oZnVuY3Rpb24od2luZG93KSB7XG4gIHZhciBsYXN0VGltZSA9IDAsXG4gICAgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddLFxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUsXG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUsXG4gICAgaSA9IHZlbmRvcnMubGVuZ3RoO1xuXG4gIC8vIHRyeSB0byB1bi1wcmVmaXggZXhpc3RpbmcgcmFmXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAhcmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbaV0gKyAnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1tpXSArICdDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgfVxuXG4gIC8vIHBvbHlmaWxsIHdpdGggc2V0VGltZW91dCBmYWxsYmFja1xuICAvLyBoZWF2aWx5IGluc3BpcmVkIGZyb20gQGRhcml1cyBnaXN0IG1vZDogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vcGF1bGlyaXNoLzE1Nzk2NzEjY29tbWVudC04Mzc5NDVcbiAgaWYgKCFyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgIWNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgIHZhciBub3cgPSArRGF0ZS5ub3coKSxcbiAgICAgICAgbmV4dFRpbWUgPSBNYXRoLm1heChsYXN0VGltZSArIDE2LCBub3cpO1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGNhbGxiYWNrKGxhc3RUaW1lID0gbmV4dFRpbWUpO1xuICAgICAgfSwgbmV4dFRpbWUgLSBub3cpO1xuICAgIH07XG5cbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSA9IGNsZWFyVGltZW91dDtcbiAgfVxuXG4gIC8vIGV4cG9ydCB0byB3aW5kb3dcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gY2FuY2VsQW5pbWF0aW9uRnJhbWU7XG59KHdpbmRvdykpO1xuXG5cbi8vIFVuaXF1ZSBJRFxuTWF0ZXJpYWxpemUuZ3VpZCA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gczQoKSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDApXG4gICAgICAudG9TdHJpbmcoMTYpXG4gICAgICAuc3Vic3RyaW5nKDEpO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArXG4gICAgICAgICAgIHM0KCkgKyAnLScgKyBzNCgpICsgczQoKSArIHM0KCk7XG4gIH07XG59KSgpO1xuXG4vKipcbiAqIEVzY2FwZXMgaGFzaCBmcm9tIHNwZWNpYWwgY2hhcmFjdGVyc1xuICogQHBhcmFtIHtzdHJpbmd9IGhhc2ggIFN0cmluZyByZXR1cm5lZCBmcm9tIHRoaXMuaGFzaFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuTWF0ZXJpYWxpemUuZXNjYXBlSGFzaCA9IGZ1bmN0aW9uKGhhc2gpIHtcbiAgcmV0dXJuIGhhc2gucmVwbGFjZSggLyg6fFxcLnxcXFt8XFxdfCx8PSkvZywgXCJcXFxcJDFcIiApO1xufTtcblxuTWF0ZXJpYWxpemUuZWxlbWVudE9yUGFyZW50SXNGaXhlZCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICB2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuICAgIHZhciAkY2hlY2tFbGVtZW50cyA9ICRlbGVtZW50LmFkZCgkZWxlbWVudC5wYXJlbnRzKCkpO1xuICAgIHZhciBpc0ZpeGVkID0gZmFsc2U7XG4gICAgJGNoZWNrRWxlbWVudHMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICBpZiAoJCh0aGlzKS5jc3MoXCJwb3NpdGlvblwiKSA9PT0gXCJmaXhlZFwiKSB7XG4gICAgICAgICAgICBpc0ZpeGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBpc0ZpeGVkO1xufTtcblxuXG4vKipcbiAqIEdldCB0aW1lIGluIG1zXG4gKiBAbGljZW5zZSBodHRwczovL3Jhdy5naXRodWIuY29tL2phc2hrZW5hcy91bmRlcnNjb3JlL21hc3Rlci9MSUNFTlNFXG4gKiBAdHlwZSB7ZnVuY3Rpb259XG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbnZhciBnZXRUaW1lID0gKERhdGUubm93IHx8IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xufSk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAqIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuICogYXMgbXVjaCBhcyBpdCBjYW4sIHdpdGhvdXQgZXZlciBnb2luZyBtb3JlIHRoYW4gb25jZSBwZXIgYHdhaXRgIGR1cmF0aW9uO1xuICogYnV0IGlmIHlvdSdkIGxpa2UgdG8gZGlzYWJsZSB0aGUgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2UsIHBhc3NcbiAqIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuICogQGxpY2Vuc2UgaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9qYXNoa2VuYXMvdW5kZXJzY29yZS9tYXN0ZXIvTElDRU5TRVxuICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuY1xuICogQHBhcmFtIHtudW1iZXJ9IHdhaXRcbiAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0aW9uc1xuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5NYXRlcmlhbGl6ZS50aHJvdHRsZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgdmFyIHRpbWVvdXQgPSBudWxsO1xuICB2YXIgcHJldmlvdXMgPSAwO1xuICBvcHRpb25zIHx8IChvcHRpb25zID0ge30pO1xuICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgcHJldmlvdXMgPSBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlID8gMCA6IGdldFRpbWUoKTtcbiAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgfTtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbm93ID0gZ2V0VGltZSgpO1xuICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSkgcHJldmlvdXMgPSBub3c7XG4gICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xuICAgIGNvbnRleHQgPSB0aGlzO1xuICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgaWYgKHJlbWFpbmluZyA8PSAwKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9IGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn07XG5cblxuLy8gVmVsb2NpdHkgaGFzIGNvbmZsaWN0cyB3aGVuIGxvYWRlZCB3aXRoIGpRdWVyeSwgdGhpcyB3aWxsIGNoZWNrIGZvciBpdFxuLy8gRmlyc3QsIGNoZWNrIGlmIGluIG5vQ29uZmxpY3QgbW9kZVxudmFyIFZlbDtcbmlmIChqUXVlcnkpIHtcbiAgVmVsID0galF1ZXJ5LlZlbG9jaXR5O1xufSBlbHNlIGlmICgkKSB7XG4gIFZlbCA9ICQuVmVsb2NpdHk7XG59IGVsc2Uge1xuICBWZWwgPSBWZWxvY2l0eTtcbn1cbiIsIi8qXG4gKiBqUXVlcnkgRWFzaW5nIHYxLjMgLSBodHRwOi8vZ3NnZC5jby51ay9zYW5kYm94L2pxdWVyeS9lYXNpbmcvXG4gKlxuICogVXNlcyB0aGUgYnVpbHQgaW4gZWFzaW5nIGNhcGFiaWxpdGllcyBhZGRlZCBJbiBqUXVlcnkgMS4xXG4gKiB0byBvZmZlciBtdWx0aXBsZSBlYXNpbmcgb3B0aW9uc1xuICpcbiAqIFRFUk1TIE9GIFVTRSAtIGpRdWVyeSBFYXNpbmdcbiAqXG4gKiBPcGVuIHNvdXJjZSB1bmRlciB0aGUgQlNEIExpY2Vuc2UuXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMDggR2VvcmdlIE1jR2lubGV5IFNtaXRoXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dCBtb2RpZmljYXRpb24sXG4gKiBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4gKlxuICogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2ZcbiAqIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0XG4gKiBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFsc1xuICogcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuICpcbiAqIE5laXRoZXIgdGhlIG5hbWUgb2YgdGhlIGF1dGhvciBub3IgdGhlIG5hbWVzIG9mIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlXG4gKiBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxuICpcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORCBBTllcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRlxuICogTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiAgQ09QWVJJR0hUIE9XTkVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLFxuICogIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURVxuICogIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRFxuICogQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkdcbiAqICBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRFxuICogT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuICpcbiovXG5cbi8vIHQ6IGN1cnJlbnQgdGltZSwgYjogYmVnSW5uSW5nIHZhbHVlLCBjOiBjaGFuZ2UgSW4gdmFsdWUsIGQ6IGR1cmF0aW9uXG5qUXVlcnkuZWFzaW5nWydqc3dpbmcnXSA9IGpRdWVyeS5lYXNpbmdbJ3N3aW5nJ107XG5cbmpRdWVyeS5leHRlbmQoIGpRdWVyeS5lYXNpbmcsXG57XG5cdGRlZjogJ2Vhc2VPdXRRdWFkJyxcblx0c3dpbmc6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0Ly9hbGVydChqUXVlcnkuZWFzaW5nLmRlZmF1bHQpO1xuXHRcdHJldHVybiBqUXVlcnkuZWFzaW5nW2pRdWVyeS5lYXNpbmcuZGVmXSh4LCB0LCBiLCBjLCBkKTtcblx0fSxcblx0ZWFzZUluUXVhZDogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcblx0XHRyZXR1cm4gYyoodC89ZCkqdCArIGI7XG5cdH0sXG5cdGVhc2VPdXRRdWFkOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xuXHRcdHJldHVybiAtYyAqKHQvPWQpKih0LTIpICsgYjtcblx0fSxcblx0ZWFzZUluT3V0UXVhZDogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcblx0XHRpZiAoKHQvPWQvMikgPCAxKSByZXR1cm4gYy8yKnQqdCArIGI7XG5cdFx0cmV0dXJuIC1jLzIgKiAoKC0tdCkqKHQtMikgLSAxKSArIGI7XG5cdH0sXG5cdGVhc2VJbkN1YmljOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xuXHRcdHJldHVybiBjKih0Lz1kKSp0KnQgKyBiO1xuXHR9LFxuXHRlYXNlT3V0Q3ViaWM6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0cmV0dXJuIGMqKCh0PXQvZC0xKSp0KnQgKyAxKSArIGI7XG5cdH0sXG5cdGVhc2VJbk91dEN1YmljOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xuXHRcdGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqdCp0KnQgKyBiO1xuXHRcdHJldHVybiBjLzIqKCh0LT0yKSp0KnQgKyAyKSArIGI7XG5cdH0sXG5cdGVhc2VJblF1YXJ0OiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xuXHRcdHJldHVybiBjKih0Lz1kKSp0KnQqdCArIGI7XG5cdH0sXG5cdGVhc2VPdXRRdWFydDogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcblx0XHRyZXR1cm4gLWMgKiAoKHQ9dC9kLTEpKnQqdCp0IC0gMSkgKyBiO1xuXHR9LFxuXHRlYXNlSW5PdXRRdWFydDogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcblx0XHRpZiAoKHQvPWQvMikgPCAxKSByZXR1cm4gYy8yKnQqdCp0KnQgKyBiO1xuXHRcdHJldHVybiAtYy8yICogKCh0LT0yKSp0KnQqdCAtIDIpICsgYjtcblx0fSxcblx0ZWFzZUluUXVpbnQ6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0cmV0dXJuIGMqKHQvPWQpKnQqdCp0KnQgKyBiO1xuXHR9LFxuXHRlYXNlT3V0UXVpbnQ6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0cmV0dXJuIGMqKCh0PXQvZC0xKSp0KnQqdCp0ICsgMSkgKyBiO1xuXHR9LFxuXHRlYXNlSW5PdXRRdWludDogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcblx0XHRpZiAoKHQvPWQvMikgPCAxKSByZXR1cm4gYy8yKnQqdCp0KnQqdCArIGI7XG5cdFx0cmV0dXJuIGMvMiooKHQtPTIpKnQqdCp0KnQgKyAyKSArIGI7XG5cdH0sXG5cdGVhc2VJblNpbmU6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0cmV0dXJuIC1jICogTWF0aC5jb3ModC9kICogKE1hdGguUEkvMikpICsgYyArIGI7XG5cdH0sXG5cdGVhc2VPdXRTaW5lOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xuXHRcdHJldHVybiBjICogTWF0aC5zaW4odC9kICogKE1hdGguUEkvMikpICsgYjtcblx0fSxcblx0ZWFzZUluT3V0U2luZTogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcblx0XHRyZXR1cm4gLWMvMiAqIChNYXRoLmNvcyhNYXRoLlBJKnQvZCkgLSAxKSArIGI7XG5cdH0sXG5cdGVhc2VJbkV4cG86IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0cmV0dXJuICh0PT0wKSA/IGIgOiBjICogTWF0aC5wb3coMiwgMTAgKiAodC9kIC0gMSkpICsgYjtcblx0fSxcblx0ZWFzZU91dEV4cG86IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0cmV0dXJuICh0PT1kKSA/IGIrYyA6IGMgKiAoLU1hdGgucG93KDIsIC0xMCAqIHQvZCkgKyAxKSArIGI7XG5cdH0sXG5cdGVhc2VJbk91dEV4cG86IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0aWYgKHQ9PTApIHJldHVybiBiO1xuXHRcdGlmICh0PT1kKSByZXR1cm4gYitjO1xuXHRcdGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIgKiBNYXRoLnBvdygyLCAxMCAqICh0IC0gMSkpICsgYjtcblx0XHRyZXR1cm4gYy8yICogKC1NYXRoLnBvdygyLCAtMTAgKiAtLXQpICsgMikgKyBiO1xuXHR9LFxuXHRlYXNlSW5DaXJjOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xuXHRcdHJldHVybiAtYyAqIChNYXRoLnNxcnQoMSAtICh0Lz1kKSp0KSAtIDEpICsgYjtcblx0fSxcblx0ZWFzZU91dENpcmM6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0cmV0dXJuIGMgKiBNYXRoLnNxcnQoMSAtICh0PXQvZC0xKSp0KSArIGI7XG5cdH0sXG5cdGVhc2VJbk91dENpcmM6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0aWYgKCh0Lz1kLzIpIDwgMSkgcmV0dXJuIC1jLzIgKiAoTWF0aC5zcXJ0KDEgLSB0KnQpIC0gMSkgKyBiO1xuXHRcdHJldHVybiBjLzIgKiAoTWF0aC5zcXJ0KDEgLSAodC09MikqdCkgKyAxKSArIGI7XG5cdH0sXG5cdGVhc2VJbkVsYXN0aWM6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0dmFyIHM9MS43MDE1ODt2YXIgcD0wO3ZhciBhPWM7XG5cdFx0aWYgKHQ9PTApIHJldHVybiBiOyAgaWYgKCh0Lz1kKT09MSkgcmV0dXJuIGIrYzsgIGlmICghcCkgcD1kKi4zO1xuXHRcdGlmIChhIDwgTWF0aC5hYnMoYykpIHsgYT1jOyB2YXIgcz1wLzQ7IH1cblx0XHRlbHNlIHZhciBzID0gcC8oMipNYXRoLlBJKSAqIE1hdGguYXNpbiAoYy9hKTtcblx0XHRyZXR1cm4gLShhKk1hdGgucG93KDIsMTAqKHQtPTEpKSAqIE1hdGguc2luKCAodCpkLXMpKigyKk1hdGguUEkpL3AgKSkgKyBiO1xuXHR9LFxuXHRlYXNlT3V0RWxhc3RpYzogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcblx0XHR2YXIgcz0xLjcwMTU4O3ZhciBwPTA7dmFyIGE9Yztcblx0XHRpZiAodD09MCkgcmV0dXJuIGI7ICBpZiAoKHQvPWQpPT0xKSByZXR1cm4gYitjOyAgaWYgKCFwKSBwPWQqLjM7XG5cdFx0aWYgKGEgPCBNYXRoLmFicyhjKSkgeyBhPWM7IHZhciBzPXAvNDsgfVxuXHRcdGVsc2UgdmFyIHMgPSBwLygyKk1hdGguUEkpICogTWF0aC5hc2luIChjL2EpO1xuXHRcdHJldHVybiBhKk1hdGgucG93KDIsLTEwKnQpICogTWF0aC5zaW4oICh0KmQtcykqKDIqTWF0aC5QSSkvcCApICsgYyArIGI7XG5cdH0sXG5cdGVhc2VJbk91dEVsYXN0aWM6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0dmFyIHM9MS43MDE1ODt2YXIgcD0wO3ZhciBhPWM7XG5cdFx0aWYgKHQ9PTApIHJldHVybiBiOyAgaWYgKCh0Lz1kLzIpPT0yKSByZXR1cm4gYitjOyAgaWYgKCFwKSBwPWQqKC4zKjEuNSk7XG5cdFx0aWYgKGEgPCBNYXRoLmFicyhjKSkgeyBhPWM7IHZhciBzPXAvNDsgfVxuXHRcdGVsc2UgdmFyIHMgPSBwLygyKk1hdGguUEkpICogTWF0aC5hc2luIChjL2EpO1xuXHRcdGlmICh0IDwgMSkgcmV0dXJuIC0uNSooYSpNYXRoLnBvdygyLDEwKih0LT0xKSkgKiBNYXRoLnNpbiggKHQqZC1zKSooMipNYXRoLlBJKS9wICkpICsgYjtcblx0XHRyZXR1cm4gYSpNYXRoLnBvdygyLC0xMCoodC09MSkpICogTWF0aC5zaW4oICh0KmQtcykqKDIqTWF0aC5QSSkvcCApKi41ICsgYyArIGI7XG5cdH0sXG5cdGVhc2VJbkJhY2s6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkLCBzKSB7XG5cdFx0aWYgKHMgPT0gdW5kZWZpbmVkKSBzID0gMS43MDE1ODtcblx0XHRyZXR1cm4gYyoodC89ZCkqdCooKHMrMSkqdCAtIHMpICsgYjtcblx0fSxcblx0ZWFzZU91dEJhY2s6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkLCBzKSB7XG5cdFx0aWYgKHMgPT0gdW5kZWZpbmVkKSBzID0gMS43MDE1ODtcblx0XHRyZXR1cm4gYyooKHQ9dC9kLTEpKnQqKChzKzEpKnQgKyBzKSArIDEpICsgYjtcblx0fSxcblx0ZWFzZUluT3V0QmFjazogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQsIHMpIHtcblx0XHRpZiAocyA9PSB1bmRlZmluZWQpIHMgPSAxLjcwMTU4O1xuXHRcdGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqKHQqdCooKChzKj0oMS41MjUpKSsxKSp0IC0gcykpICsgYjtcblx0XHRyZXR1cm4gYy8yKigodC09MikqdCooKChzKj0oMS41MjUpKSsxKSp0ICsgcykgKyAyKSArIGI7XG5cdH0sXG5cdGVhc2VJbkJvdW5jZTogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcblx0XHRyZXR1cm4gYyAtIGpRdWVyeS5lYXNpbmcuZWFzZU91dEJvdW5jZSAoeCwgZC10LCAwLCBjLCBkKSArIGI7XG5cdH0sXG5cdGVhc2VPdXRCb3VuY2U6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0aWYgKCh0Lz1kKSA8ICgxLzIuNzUpKSB7XG5cdFx0XHRyZXR1cm4gYyooNy41NjI1KnQqdCkgKyBiO1xuXHRcdH0gZWxzZSBpZiAodCA8ICgyLzIuNzUpKSB7XG5cdFx0XHRyZXR1cm4gYyooNy41NjI1Kih0LT0oMS41LzIuNzUpKSp0ICsgLjc1KSArIGI7XG5cdFx0fSBlbHNlIGlmICh0IDwgKDIuNS8yLjc1KSkge1xuXHRcdFx0cmV0dXJuIGMqKDcuNTYyNSoodC09KDIuMjUvMi43NSkpKnQgKyAuOTM3NSkgKyBiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gYyooNy41NjI1Kih0LT0oMi42MjUvMi43NSkpKnQgKyAuOTg0Mzc1KSArIGI7XG5cdFx0fVxuXHR9LFxuXHRlYXNlSW5PdXRCb3VuY2U6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0aWYgKHQgPCBkLzIpIHJldHVybiBqUXVlcnkuZWFzaW5nLmVhc2VJbkJvdW5jZSAoeCwgdCoyLCAwLCBjLCBkKSAqIC41ICsgYjtcblx0XHRyZXR1cm4galF1ZXJ5LmVhc2luZy5lYXNlT3V0Qm91bmNlICh4LCB0KjItZCwgMCwgYywgZCkgKiAuNSArIGMqLjUgKyBiO1xuXHR9XG59KTtcblxuLypcbiAqXG4gKiBURVJNUyBPRiBVU0UgLSBFQVNJTkcgRVFVQVRJT05TXG4gKlxuICogT3BlbiBzb3VyY2UgdW5kZXIgdGhlIEJTRCBMaWNlbnNlLlxuICpcbiAqIENvcHlyaWdodCDCqSAyMDAxIFJvYmVydCBQZW5uZXJcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0IG1vZGlmaWNhdGlvbixcbiAqIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcbiAqXG4gKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBvZlxuICogY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3RcbiAqIG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzXG4gKiBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4gKlxuICogTmVpdGhlciB0aGUgbmFtZSBvZiB0aGUgYXV0aG9yIG5vciB0aGUgbmFtZXMgb2YgY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2VcbiAqIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXG4gKlxuICogVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCIgQU5EIEFOWVxuICogRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GXG4gKiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqICBDT1BZUklHSFQgT1dORVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsXG4gKiAgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFXG4gKiAgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEXG4gKiBBTkQgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElOR1xuICogIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEXG4gKiBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4gKlxuICovIiwiLyoqXG4gKiBFeHRlbmQganF1ZXJ5IHdpdGggYSBzY3JvbGxzcHkgcGx1Z2luLlxuICogVGhpcyB3YXRjaGVzIHRoZSB3aW5kb3cgc2Nyb2xsIGFuZCBmaXJlcyBldmVudHMgd2hlbiBlbGVtZW50cyBhcmUgc2Nyb2xsZWQgaW50byB2aWV3cG9ydC5cbiAqXG4gKiB0aHJvdHRsZSgpIGFuZCBnZXRUaW1lKCkgdGFrZW4gZnJvbSBVbmRlcnNjb3JlLmpzXG4gKiBodHRwczovL2dpdGh1Yi5jb20vamFzaGtlbmFzL3VuZGVyc2NvcmVcbiAqXG4gKiBAYXV0aG9yIENvcHlyaWdodCAyMDEzIEpvaG4gU21hcnRcbiAqIEBsaWNlbnNlIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20vdGhlc21hcnQvanF1ZXJ5LXNjcm9sbHNweS9tYXN0ZXIvTElDRU5TRVxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vdGhlc21hcnRcbiAqIEB2ZXJzaW9uIDAuMS4yXG4gKi9cbihmdW5jdGlvbigkKSB7XG5cblx0dmFyIGpXaW5kb3cgPSAkKHdpbmRvdyk7XG5cdHZhciBlbGVtZW50cyA9IFtdO1xuXHR2YXIgZWxlbWVudHNJblZpZXcgPSBbXTtcblx0dmFyIGlzU3B5aW5nID0gZmFsc2U7XG5cdHZhciB0aWNrcyA9IDA7XG5cdHZhciB1bmlxdWVfaWQgPSAxO1xuXHR2YXIgb2Zmc2V0ID0ge1xuXHRcdHRvcCA6IDAsXG5cdFx0cmlnaHQgOiAwLFxuXHRcdGJvdHRvbSA6IDAsXG5cdFx0bGVmdCA6IDAsXG5cdH07XG5cblx0LyoqXG5cdCAqIEZpbmQgZWxlbWVudHMgdGhhdCBhcmUgd2l0aGluIHRoZSBib3VuZGFyeVxuXHQgKiBAcGFyYW0ge251bWJlcn0gdG9wXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSByaWdodFxuXHQgKiBAcGFyYW0ge251bWJlcn0gYm90dG9tXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBsZWZ0XG5cdCAqIEByZXR1cm4ge2pRdWVyeX1cdFx0QSBjb2xsZWN0aW9uIG9mIGVsZW1lbnRzXG5cdCAqL1xuXHRmdW5jdGlvbiBmaW5kRWxlbWVudHModG9wLCByaWdodCwgYm90dG9tLCBsZWZ0KSB7XG5cdFx0dmFyIGhpdHMgPSAkKCk7XG5cdFx0JC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbihpLCBlbGVtZW50KSB7XG5cdFx0XHRpZiAoZWxlbWVudC5oZWlnaHQoKSA+IDApIHtcblx0XHRcdFx0dmFyIGVsVG9wID0gZWxlbWVudC5vZmZzZXQoKS50b3AsXG5cdFx0XHRcdFx0ZWxMZWZ0ID0gZWxlbWVudC5vZmZzZXQoKS5sZWZ0LFxuXHRcdFx0XHRcdGVsUmlnaHQgPSBlbExlZnQgKyBlbGVtZW50LndpZHRoKCksXG5cdFx0XHRcdFx0ZWxCb3R0b20gPSBlbFRvcCArIGVsZW1lbnQuaGVpZ2h0KCk7XG5cblx0XHRcdFx0dmFyIGlzSW50ZXJzZWN0ID0gIShlbExlZnQgPiByaWdodCB8fFxuXHRcdFx0XHRcdGVsUmlnaHQgPCBsZWZ0IHx8XG5cdFx0XHRcdFx0ZWxUb3AgPiBib3R0b20gfHxcblx0XHRcdFx0XHRlbEJvdHRvbSA8IHRvcCk7XG5cblx0XHRcdFx0aWYgKGlzSW50ZXJzZWN0KSB7XG5cdFx0XHRcdFx0aGl0cy5wdXNoKGVsZW1lbnQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gaGl0cztcblx0fVxuXG5cblx0LyoqXG5cdCAqIENhbGxlZCB3aGVuIHRoZSB1c2VyIHNjcm9sbHMgdGhlIHdpbmRvd1xuXHQgKi9cblx0ZnVuY3Rpb24gb25TY3JvbGwoc2Nyb2xsT2Zmc2V0KSB7XG5cdFx0Ly8gdW5pcXVlIHRpY2sgaWRcblx0XHQrK3RpY2tzO1xuXG5cdFx0Ly8gdmlld3BvcnQgcmVjdGFuZ2xlXG5cdFx0dmFyIHRvcCA9IGpXaW5kb3cuc2Nyb2xsVG9wKCksXG5cdFx0XHRsZWZ0ID0galdpbmRvdy5zY3JvbGxMZWZ0KCksXG5cdFx0XHRyaWdodCA9IGxlZnQgKyBqV2luZG93LndpZHRoKCksXG5cdFx0XHRib3R0b20gPSB0b3AgKyBqV2luZG93LmhlaWdodCgpO1xuXG5cdFx0Ly8gZGV0ZXJtaW5lIHdoaWNoIGVsZW1lbnRzIGFyZSBpbiB2aWV3XG5cdFx0dmFyIGludGVyc2VjdGlvbnMgPSBmaW5kRWxlbWVudHModG9wK29mZnNldC50b3AgKyBzY3JvbGxPZmZzZXQgfHwgMjAwLCByaWdodCtvZmZzZXQucmlnaHQsIGJvdHRvbStvZmZzZXQuYm90dG9tLCBsZWZ0K29mZnNldC5sZWZ0KTtcblx0XHQkLmVhY2goaW50ZXJzZWN0aW9ucywgZnVuY3Rpb24oaSwgZWxlbWVudCkge1xuXG5cdFx0XHR2YXIgbGFzdFRpY2sgPSBlbGVtZW50LmRhdGEoJ3Njcm9sbFNweTp0aWNrcycpO1xuXHRcdFx0aWYgKHR5cGVvZiBsYXN0VGljayAhPSAnbnVtYmVyJykge1xuXHRcdFx0XHQvLyBlbnRlcmVkIGludG8gdmlld1xuXHRcdFx0XHRlbGVtZW50LnRyaWdnZXJIYW5kbGVyKCdzY3JvbGxTcHk6ZW50ZXInKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gdXBkYXRlIHRpY2sgaWRcblx0XHRcdGVsZW1lbnQuZGF0YSgnc2Nyb2xsU3B5OnRpY2tzJywgdGlja3MpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gZGV0ZXJtaW5lIHdoaWNoIGVsZW1lbnRzIGFyZSBubyBsb25nZXIgaW4gdmlld1xuXHRcdCQuZWFjaChlbGVtZW50c0luVmlldywgZnVuY3Rpb24oaSwgZWxlbWVudCkge1xuXHRcdFx0dmFyIGxhc3RUaWNrID0gZWxlbWVudC5kYXRhKCdzY3JvbGxTcHk6dGlja3MnKTtcblx0XHRcdGlmICh0eXBlb2YgbGFzdFRpY2sgPT0gJ251bWJlcicgJiYgbGFzdFRpY2sgIT09IHRpY2tzKSB7XG5cdFx0XHRcdC8vIGV4aXRlZCBmcm9tIHZpZXdcblx0XHRcdFx0ZWxlbWVudC50cmlnZ2VySGFuZGxlcignc2Nyb2xsU3B5OmV4aXQnKTtcblx0XHRcdFx0ZWxlbWVudC5kYXRhKCdzY3JvbGxTcHk6dGlja3MnLCBudWxsKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vIHJlbWVtYmVyIGVsZW1lbnRzIGluIHZpZXcgZm9yIG5leHQgdGlja1xuXHRcdGVsZW1lbnRzSW5WaWV3ID0gaW50ZXJzZWN0aW9ucztcblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxsZWQgd2hlbiB3aW5kb3cgaXMgcmVzaXplZFxuXHQqL1xuXHRmdW5jdGlvbiBvbldpblNpemUoKSB7XG5cdFx0aldpbmRvdy50cmlnZ2VyKCdzY3JvbGxTcHk6d2luU2l6ZScpO1xuXHR9XG5cblxuXHQvKipcblx0ICogRW5hYmxlcyBTY3JvbGxTcHkgdXNpbmcgYSBzZWxlY3RvclxuXHQgKiBAcGFyYW0ge2pRdWVyeXxzdHJpbmd9IHNlbGVjdG9yICBUaGUgZWxlbWVudHMgY29sbGVjdGlvbiwgb3IgYSBzZWxlY3RvclxuXHQgKiBAcGFyYW0ge09iamVjdD19IG9wdGlvbnNcdE9wdGlvbmFsLlxuICAgICAgICB0aHJvdHRsZSA6IG51bWJlciAtPiBzY3JvbGxzcHkgdGhyb3R0bGluZy4gRGVmYXVsdDogMTAwIG1zXG4gICAgICAgIG9mZnNldFRvcCA6IG51bWJlciAtPiBvZmZzZXQgZnJvbSB0b3AuIERlZmF1bHQ6IDBcbiAgICAgICAgb2Zmc2V0UmlnaHQgOiBudW1iZXIgLT4gb2Zmc2V0IGZyb20gcmlnaHQuIERlZmF1bHQ6IDBcbiAgICAgICAgb2Zmc2V0Qm90dG9tIDogbnVtYmVyIC0+IG9mZnNldCBmcm9tIGJvdHRvbS4gRGVmYXVsdDogMFxuICAgICAgICBvZmZzZXRMZWZ0IDogbnVtYmVyIC0+IG9mZnNldCBmcm9tIGxlZnQuIERlZmF1bHQ6IDBcblx0ICogQHJldHVybnMge2pRdWVyeX1cblx0ICovXG5cdCQuc2Nyb2xsU3B5ID0gZnVuY3Rpb24oc2VsZWN0b3IsIG9wdGlvbnMpIHtcblx0ICB2YXIgZGVmYXVsdHMgPSB7XG5cdFx0XHR0aHJvdHRsZTogMTAwLFxuXHRcdFx0c2Nyb2xsT2Zmc2V0OiAyMDAgLy8gb2Zmc2V0IC0gMjAwIGFsbG93cyBlbGVtZW50cyBuZWFyIGJvdHRvbSBvZiBwYWdlIHRvIHNjcm9sbFxuICAgIH07XG4gICAgb3B0aW9ucyA9ICQuZXh0ZW5kKGRlZmF1bHRzLCBvcHRpb25zKTtcblxuXHRcdHZhciB2aXNpYmxlID0gW107XG5cdFx0c2VsZWN0b3IgPSAkKHNlbGVjdG9yKTtcblx0XHRzZWxlY3Rvci5lYWNoKGZ1bmN0aW9uKGksIGVsZW1lbnQpIHtcblx0XHRcdGVsZW1lbnRzLnB1c2goJChlbGVtZW50KSk7XG5cdFx0XHQkKGVsZW1lbnQpLmRhdGEoXCJzY3JvbGxTcHk6aWRcIiwgaSk7XG5cdFx0XHQvLyBTbW9vdGggc2Nyb2xsIHRvIHNlY3Rpb25cblx0XHQgICQoJ2FbaHJlZj1cIiMnICsgJChlbGVtZW50KS5hdHRyKCdpZCcpICsgJ1wiXScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHQgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCAgICB2YXIgb2Zmc2V0ID0gJChNYXRlcmlhbGl6ZS5lc2NhcGVIYXNoKHRoaXMuaGFzaCkpLm9mZnNldCgpLnRvcCArIDE7XG5cdCAgICBcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiBvZmZzZXQgLSBvcHRpb25zLnNjcm9sbE9mZnNldCB9LCB7ZHVyYXRpb246IDQwMCwgcXVldWU6IGZhbHNlLCBlYXNpbmc6ICdlYXNlT3V0Q3ViaWMnfSk7XG5cdFx0ICB9KTtcblx0XHR9KTtcblxuXHRcdG9mZnNldC50b3AgPSBvcHRpb25zLm9mZnNldFRvcCB8fCAwO1xuXHRcdG9mZnNldC5yaWdodCA9IG9wdGlvbnMub2Zmc2V0UmlnaHQgfHwgMDtcblx0XHRvZmZzZXQuYm90dG9tID0gb3B0aW9ucy5vZmZzZXRCb3R0b20gfHwgMDtcblx0XHRvZmZzZXQubGVmdCA9IG9wdGlvbnMub2Zmc2V0TGVmdCB8fCAwO1xuXG5cdFx0dmFyIHRocm90dGxlZFNjcm9sbCA9IE1hdGVyaWFsaXplLnRocm90dGxlKGZ1bmN0aW9uKCkge1xuXHRcdFx0b25TY3JvbGwob3B0aW9ucy5zY3JvbGxPZmZzZXQpO1xuXHRcdH0sIG9wdGlvbnMudGhyb3R0bGUgfHwgMTAwKTtcblx0XHR2YXIgcmVhZHlTY3JvbGwgPSBmdW5jdGlvbigpe1xuXHRcdFx0JChkb2N1bWVudCkucmVhZHkodGhyb3R0bGVkU2Nyb2xsKTtcblx0XHR9O1xuXG5cdFx0aWYgKCFpc1NweWluZykge1xuXHRcdFx0aldpbmRvdy5vbignc2Nyb2xsJywgcmVhZHlTY3JvbGwpO1xuXHRcdFx0aldpbmRvdy5vbigncmVzaXplJywgcmVhZHlTY3JvbGwpO1xuXHRcdFx0aXNTcHlpbmcgPSB0cnVlO1xuXHRcdH1cblxuXHRcdC8vIHBlcmZvcm0gYSBzY2FuIG9uY2UsIGFmdGVyIGN1cnJlbnQgZXhlY3V0aW9uIGNvbnRleHQsIGFuZCBhZnRlciBkb20gaXMgcmVhZHlcblx0XHRzZXRUaW1lb3V0KHJlYWR5U2Nyb2xsLCAwKTtcblxuXG5cdFx0c2VsZWN0b3Iub24oJ3Njcm9sbFNweTplbnRlcicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmlzaWJsZSA9ICQuZ3JlcCh2aXNpYmxlLCBmdW5jdGlvbih2YWx1ZSkge1xuXHQgICAgICByZXR1cm4gdmFsdWUuaGVpZ2h0KCkgIT0gMDtcblx0ICAgIH0pO1xuXG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXG5cdFx0XHRpZiAodmlzaWJsZVswXSkge1xuXHRcdFx0XHQkKCdhW2hyZWY9XCIjJyArIHZpc2libGVbMF0uYXR0cignaWQnKSArICdcIl0nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcdGlmICgkdGhpcy5kYXRhKCdzY3JvbGxTcHk6aWQnKSA8IHZpc2libGVbMF0uZGF0YSgnc2Nyb2xsU3B5OmlkJykpIHtcblx0XHRcdFx0XHR2aXNpYmxlLnVuc2hpZnQoJCh0aGlzKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dmlzaWJsZS5wdXNoKCQodGhpcykpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dmlzaWJsZS5wdXNoKCQodGhpcykpO1xuXHRcdFx0fVxuXG5cblx0XHRcdCQoJ2FbaHJlZj1cIiMnICsgdmlzaWJsZVswXS5hdHRyKCdpZCcpICsgJ1wiXScpLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHR9KTtcblx0XHRzZWxlY3Rvci5vbignc2Nyb2xsU3B5OmV4aXQnLCBmdW5jdGlvbigpIHtcblx0XHRcdHZpc2libGUgPSAkLmdyZXAodmlzaWJsZSwgZnVuY3Rpb24odmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIHZhbHVlLmhlaWdodCgpICE9IDA7XG5cdCAgICB9KTtcblxuXHRcdFx0aWYgKHZpc2libGVbMF0pIHtcblx0XHRcdFx0JCgnYVtocmVmPVwiIycgKyB2aXNpYmxlWzBdLmF0dHIoJ2lkJykgKyAnXCJdJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXHRcdFx0XHR2aXNpYmxlID0gJC5ncmVwKHZpc2libGUsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdCAgICAgICAgcmV0dXJuIHZhbHVlLmF0dHIoJ2lkJykgIT0gJHRoaXMuYXR0cignaWQnKTtcblx0ICAgICAgfSk7XG5cdCAgICAgIGlmICh2aXNpYmxlWzBdKSB7IC8vIENoZWNrIGlmIGVtcHR5XG5cdFx0XHRcdFx0JCgnYVtocmVmPVwiIycgKyB2aXNpYmxlWzBdLmF0dHIoJ2lkJykgKyAnXCJdJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHQgICAgICB9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gc2VsZWN0b3I7XG5cdH07XG5cblx0LyoqXG5cdCAqIExpc3RlbiBmb3Igd2luZG93IHJlc2l6ZSBldmVudHNcblx0ICogQHBhcmFtIHtPYmplY3Q9fSBvcHRpb25zXHRcdFx0XHRcdFx0T3B0aW9uYWwuIFNldCB7IHRocm90dGxlOiBudW1iZXIgfSB0byBjaGFuZ2UgdGhyb3R0bGluZy4gRGVmYXVsdDogMTAwIG1zXG5cdCAqIEByZXR1cm5zIHtqUXVlcnl9XHRcdCQod2luZG93KVxuXHQgKi9cblx0JC53aW5TaXplU3B5ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdCQud2luU2l6ZVNweSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4galdpbmRvdzsgfTsgLy8gbG9jayBmcm9tIG11bHRpcGxlIGNhbGxzXG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge1xuXHRcdFx0dGhyb3R0bGU6IDEwMFxuXHRcdH07XG5cdFx0cmV0dXJuIGpXaW5kb3cub24oJ3Jlc2l6ZScsIE1hdGVyaWFsaXplLnRocm90dGxlKG9uV2luU2l6ZSwgb3B0aW9ucy50aHJvdHRsZSB8fCAxMDApKTtcblx0fTtcblxuXHQvKipcblx0ICogRW5hYmxlcyBTY3JvbGxTcHkgb24gYSBjb2xsZWN0aW9uIG9mIGVsZW1lbnRzXG5cdCAqIGUuZy4gJCgnLnNjcm9sbFNweScpLnNjcm9sbFNweSgpXG5cdCAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0aW9uc1x0T3B0aW9uYWwuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGhyb3R0bGUgOiBudW1iZXIgLT4gc2Nyb2xsc3B5IHRocm90dGxpbmcuIERlZmF1bHQ6IDEwMCBtc1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9mZnNldFRvcCA6IG51bWJlciAtPiBvZmZzZXQgZnJvbSB0b3AuIERlZmF1bHQ6IDBcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvZmZzZXRSaWdodCA6IG51bWJlciAtPiBvZmZzZXQgZnJvbSByaWdodC4gRGVmYXVsdDogMFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9mZnNldEJvdHRvbSA6IG51bWJlciAtPiBvZmZzZXQgZnJvbSBib3R0b20uIERlZmF1bHQ6IDBcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvZmZzZXRMZWZ0IDogbnVtYmVyIC0+IG9mZnNldCBmcm9tIGxlZnQuIERlZmF1bHQ6IDBcblx0ICogQHJldHVybnMge2pRdWVyeX1cblx0ICovXG5cdCQuZm4uc2Nyb2xsU3B5ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdHJldHVybiAkLnNjcm9sbFNweSgkKHRoaXMpLCBvcHRpb25zKTtcblx0fTtcblxufSkoalF1ZXJ5KTtcbiIsIihmdW5jdGlvbiAoJCkge1xuXG4gIHZhciBtZXRob2RzID0ge1xuICAgIGluaXQgOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIG9uU2hvdzogbnVsbFxuICAgICAgfTtcbiAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZChkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8gRm9yIGVhY2ggc2V0IG9mIHRhYnMsIHdlIHdhbnQgdG8ga2VlcCB0cmFjayBvZlxuICAgICAgICAvLyB3aGljaCB0YWIgaXMgYWN0aXZlIGFuZCBpdHMgYXNzb2NpYXRlZCBjb250ZW50XG4gICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICAgICAgICB3aW5kb3dfd2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcblxuICAgICAgICB2YXIgJGFjdGl2ZSwgJGNvbnRlbnQsICRsaW5rcyA9ICR0aGlzLmZpbmQoJ2xpIGEnKSxcbiAgICAgICAgICAgICR0YWJzX3dpZHRoID0gJHRoaXMud2lkdGgoKSxcbiAgICAgICAgICAgICR0YWJfd2lkdGggPSBNYXRoLm1heCgkdGFic193aWR0aCwgJHRoaXNbMF0uc2Nyb2xsV2lkdGgpIC8gJGxpbmtzLmxlbmd0aCxcbiAgICAgICAgICAgICRpbmRleCA9IDA7XG5cbiAgICAgICAgLy8gRmluZHMgcmlnaHQgYXR0cmlidXRlIGZvciBpbmRpY2F0b3IgYmFzZWQgb24gYWN0aXZlIHRhYi5cbiAgICAgICAgLy8gZWw6IGpRdWVyeSBPYmplY3RcbiAgICAgICAgdmFyIGNhbGNSaWdodFBvcyA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgcmV0dXJuICR0YWJzX3dpZHRoIC0gZWwucG9zaXRpb24oKS5sZWZ0IC0gZWwub3V0ZXJXaWR0aCgpIC0gJHRoaXMuc2Nyb2xsTGVmdCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEZpbmRzIGxlZnQgYXR0cmlidXRlIGZvciBpbmRpY2F0b3IgYmFzZWQgb24gYWN0aXZlIHRhYi5cbiAgICAgICAgLy8gZWw6IGpRdWVyeSBPYmplY3RcbiAgICAgICAgdmFyIGNhbGNMZWZ0UG9zID0gZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICByZXR1cm4gZWwucG9zaXRpb24oKS5sZWZ0ICsgJHRoaXMuc2Nyb2xsTGVmdCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIElmIHRoZSBsb2NhdGlvbi5oYXNoIG1hdGNoZXMgb25lIG9mIHRoZSBsaW5rcywgdXNlIHRoYXQgYXMgdGhlIGFjdGl2ZSB0YWIuXG5cbiAgICAgICAgJGFjdGl2ZSA9ICQoJGxpbmtzLmZpbHRlcignW2hyZWY9XCInK2xvY2F0aW9uLmhhc2grJ1wiXScpKTtcblxuICAgICAgICAvLyBJZiBubyBtYXRjaCBpcyBmb3VuZCwgdXNlIHRoZSBmaXJzdCBsaW5rIG9yIGFueSB3aXRoIGNsYXNzICdhY3RpdmUnIGFzIHRoZSBpbml0aWFsIGFjdGl2ZSB0YWIuXG4gICAgICAgIGlmICgkYWN0aXZlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICRhY3RpdmUgPSAkKHRoaXMpLmZpbmQoJ2xpIGEuYWN0aXZlJykuZmlyc3QoKTtcblxuICAgICAgICB9XG4gICAgICAgIGlmICgkYWN0aXZlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICRhY3RpdmUgPSAkKHRoaXMpLmZpbmQoJ2xpIGEnKS5maXJzdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gJGFjdGl2ZS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICRpbmRleCA9ICRsaW5rcy5pbmRleCgkYWN0aXZlKTtcbiAgICAgICAgaWYgKCRpbmRleCA8IDApIHtcbiAgICAgICAgICAkaW5kZXggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCRhY3RpdmVbMF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICRjb250ZW50ID0gJCgkYWN0aXZlWzBdLmhhc2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYXBwZW5kIGluZGljYXRvciB0aGVuIHNldCBpbmRpY2F0b3Igd2lkdGggdG8gdGFiIHdpZHRoXG4gICAgICAgICR0aGlzLmFwcGVuZCgnPGRpdiBjbGFzcz1cImluZGljYXRvclwiPjwvZGl2PicpO1xuICAgICAgICB2YXIgJGluZGljYXRvciA9ICR0aGlzLmZpbmQoJy5pbmRpY2F0b3InKTtcbiAgICAgICAgaWYgKCR0aGlzLmlzKFwiOnZpc2libGVcIikpIHtcbiAgICAgICAgICAvLyAkaW5kaWNhdG9yLmNzcyh7XCJyaWdodFwiOiAkdGFic193aWR0aCAtICgoJGluZGV4ICsgMSkgKiAkdGFiX3dpZHRoKX0pO1xuICAgICAgICAgIC8vICRpbmRpY2F0b3IuY3NzKHtcImxlZnRcIjogJGluZGV4ICogJHRhYl93aWR0aH0pO1xuXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRpbmRpY2F0b3IuY3NzKHtcInJpZ2h0XCI6IGNhbGNSaWdodFBvcygkYWN0aXZlKSB9KTtcbiAgICAgICAgICAgICRpbmRpY2F0b3IuY3NzKHtcImxlZnRcIjogY2FsY0xlZnRQb3MoJGFjdGl2ZSkgfSk7XG4gICAgICAgICAgfSwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJHRhYnNfd2lkdGggPSAkdGhpcy53aWR0aCgpO1xuICAgICAgICAgICR0YWJfd2lkdGggPSBNYXRoLm1heCgkdGFic193aWR0aCwgJHRoaXNbMF0uc2Nyb2xsV2lkdGgpIC8gJGxpbmtzLmxlbmd0aDtcbiAgICAgICAgICBpZiAoJGluZGV4IDwgMCkge1xuICAgICAgICAgICAgJGluZGV4ID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCR0YWJfd2lkdGggIT09IDAgJiYgJHRhYnNfd2lkdGggIT09IDApIHtcbiAgICAgICAgICAgICRpbmRpY2F0b3IuY3NzKHtcInJpZ2h0XCI6IGNhbGNSaWdodFBvcygkYWN0aXZlKSB9KTtcbiAgICAgICAgICAgICRpbmRpY2F0b3IuY3NzKHtcImxlZnRcIjogY2FsY0xlZnRQb3MoJGFjdGl2ZSkgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBIaWRlIHRoZSByZW1haW5pbmcgY29udGVudFxuICAgICAgICAkbGlua3Mubm90KCRhY3RpdmUpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICQoTWF0ZXJpYWxpemUuZXNjYXBlSGFzaCh0aGlzLmhhc2gpKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJGFjdGl2ZSA9ICR0aGlzLmZpbmQoJ2xpIGEuYWN0aXZlJyk7XG4gICAgICAgICAgJGluZGljYXRvci52ZWxvY2l0eSh7XCJsZWZ0XCI6IGNhbGNMZWZ0UG9zKCRhY3RpdmUpIH0sIHsgZHVyYXRpb246IDQwMCwgcXVldWU6IGZhbHNlLCBlYXNpbmc6ICdlYXNlT3V0UXVhZCd9KTtcbiAgICAgICAgICAkaW5kaWNhdG9yLnZlbG9jaXR5KHtcInJpZ2h0XCI6IGNhbGNSaWdodFBvcygkYWN0aXZlKSB9LCB7ZHVyYXRpb246IDQwMCwgcXVldWU6IGZhbHNlLCBlYXNpbmc6ICdlYXNlT3V0UXVhZCcsIGRlbGF5OiA5MH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICAkLmZuLnRhYnMgPSBmdW5jdGlvbihtZXRob2RPck9wdGlvbnMpIHtcbiAgICBpZiAoIG1ldGhvZHNbbWV0aG9kT3JPcHRpb25zXSApIHtcbiAgICAgIHJldHVybiBtZXRob2RzWyBtZXRob2RPck9wdGlvbnMgXS5hcHBseSggdGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApKTtcbiAgICB9IGVsc2UgaWYgKCB0eXBlb2YgbWV0aG9kT3JPcHRpb25zID09PSAnb2JqZWN0JyB8fCAhIG1ldGhvZE9yT3B0aW9ucyApIHtcbiAgICAgIC8vIERlZmF1bHQgdG8gXCJpbml0XCJcbiAgICAgIHJldHVybiBtZXRob2RzLmluaXQuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIH0gZWxzZSB7XG4gICAgICAkLmVycm9yKCAnTWV0aG9kICcgKyAgbWV0aG9kT3JPcHRpb25zICsgJyBkb2VzIG5vdCBleGlzdCBvbiBqUXVlcnkudGFicycgKTtcbiAgICB9XG4gIH07XG5cbiAgJCh3aW5kb3cpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICQoJy5zaXRlLW5hdiB1bCcpLnRhYnMoKTtcbiAgICB9LCAyMDApO1xuICB9KTtcbn0oIGpRdWVyeSApKTsiLCIvKiEgVmVsb2NpdHlKUy5vcmcgKDEuNC4yKS4gKEMpIDIwMTQgSnVsaWFuIFNoYXBpcm8uIE1JVCBAbGljZW5zZTogZW4ud2lraXBlZGlhLm9yZy93aWtpL01JVF9MaWNlbnNlICovXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqXG4gVmVsb2NpdHkgalF1ZXJ5IFNoaW1cbiAqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKiEgVmVsb2NpdHlKUy5vcmcgalF1ZXJ5IFNoaW0gKDEuMC4xKS4gKEMpIDIwMTQgVGhlIGpRdWVyeSBGb3VuZGF0aW9uLiBNSVQgQGxpY2Vuc2U6IGVuLndpa2lwZWRpYS5vcmcvd2lraS9NSVRfTGljZW5zZS4gKi9cblxuLyogVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBqUXVlcnkgZnVuY3Rpb25zIHRoYXQgVmVsb2NpdHkgcmVsaWVzIG9uLCB0aGVyZWJ5IHJlbW92aW5nIFZlbG9jaXR5J3MgZGVwZW5kZW5jeSBvbiBhIGZ1bGwgY29weSBvZiBqUXVlcnksIGFuZCBhbGxvd2luZyBpdCB0byB3b3JrIGluIGFueSBlbnZpcm9ubWVudC4gKi9cbi8qIFRoZXNlIHNoaW1tZWQgZnVuY3Rpb25zIGFyZSBvbmx5IHVzZWQgaWYgalF1ZXJ5IGlzbid0IHByZXNlbnQuIElmIGJvdGggdGhpcyBzaGltIGFuZCBqUXVlcnkgYXJlIGxvYWRlZCwgVmVsb2NpdHkgZGVmYXVsdHMgdG8galF1ZXJ5IHByb3Blci4gKi9cbi8qIEJyb3dzZXIgc3VwcG9ydDogVXNpbmcgdGhpcyBzaGltIGluc3RlYWQgb2YgalF1ZXJ5IHByb3BlciByZW1vdmVzIHN1cHBvcnQgZm9yIElFOC4gKi9cblxuKGZ1bmN0aW9uKHdpbmRvdykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIC8qKioqKioqKioqKioqKipcbiAgICAgU2V0dXBcbiAgICAgKioqKioqKioqKioqKioqL1xuXG4gICAgLyogSWYgalF1ZXJ5IGlzIGFscmVhZHkgbG9hZGVkLCB0aGVyZSdzIG5vIHBvaW50IGluIGxvYWRpbmcgdGhpcyBzaGltLiAqL1xuICAgIGlmICh3aW5kb3cualF1ZXJ5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKiBqUXVlcnkgYmFzZS4gKi9cbiAgICB2YXIgJCA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiBuZXcgJC5mbi5pbml0KHNlbGVjdG9yLCBjb250ZXh0KTtcbiAgICB9O1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqXG4gICAgIFByaXZhdGUgTWV0aG9kc1xuICAgICAqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qIGpRdWVyeSAqL1xuICAgICQuaXNXaW5kb3cgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgLyoganNoaW50IGVxZXFlcTogZmFsc2UgKi9cbiAgICAgICAgcmV0dXJuIG9iaiAmJiBvYmogPT09IG9iai53aW5kb3c7XG4gICAgfTtcblxuICAgIC8qIGpRdWVyeSAqL1xuICAgICQudHlwZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICBpZiAoIW9iaikge1xuICAgICAgICAgICAgcmV0dXJuIG9iaiArIFwiXCI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygb2JqID09PSBcImZ1bmN0aW9uXCIgP1xuICAgICAgICBjbGFzczJ0eXBlW3RvU3RyaW5nLmNhbGwob2JqKV0gfHwgXCJvYmplY3RcIiA6XG4gICAgICAgICAgICB0eXBlb2Ygb2JqO1xuICAgIH07XG5cbiAgICAvKiBqUXVlcnkgKi9cbiAgICAkLmlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgICAgcmV0dXJuICQudHlwZShvYmopID09PSBcImFycmF5XCI7XG4gICAgICAgIH07XG5cbiAgICAvKiBqUXVlcnkgKi9cbiAgICBmdW5jdGlvbiBpc0FycmF5bGlrZShvYmopIHtcbiAgICAgICAgdmFyIGxlbmd0aCA9IG9iai5sZW5ndGgsXG4gICAgICAgICAgICB0eXBlID0gJC50eXBlKG9iaik7XG5cbiAgICAgICAgaWYgKHR5cGUgPT09IFwiZnVuY3Rpb25cIiB8fCAkLmlzV2luZG93KG9iaikpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvYmoubm9kZVR5cGUgPT09IDEgJiYgbGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0eXBlID09PSBcImFycmF5XCIgfHwgbGVuZ3RoID09PSAwIHx8IHR5cGVvZiBsZW5ndGggPT09IFwibnVtYmVyXCIgJiYgbGVuZ3RoID4gMCAmJiAobGVuZ3RoIC0gMSkgaW4gb2JqO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKipcbiAgICAgJCBNZXRob2RzXG4gICAgICoqKioqKioqKioqKioqKi9cblxuICAgIC8qIGpRdWVyeTogU3VwcG9ydCByZW1vdmVkIGZvciBJRTw5LiAqL1xuICAgICQuaXNQbGFpbk9iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICB2YXIga2V5O1xuXG4gICAgICAgIGlmICghb2JqIHx8ICQudHlwZShvYmopICE9PSBcIm9iamVjdFwiIHx8IG9iai5ub2RlVHlwZSB8fCAkLmlzV2luZG93KG9iaikpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAob2JqLmNvbnN0cnVjdG9yICYmXG4gICAgICAgICAgICAgICAgIWhhc093bi5jYWxsKG9iaiwgXCJjb25zdHJ1Y3RvclwiKSAmJlxuICAgICAgICAgICAgICAgICFoYXNPd24uY2FsbChvYmouY29uc3RydWN0b3IucHJvdG90eXBlLCBcImlzUHJvdG90eXBlT2ZcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleSA9PT0gdW5kZWZpbmVkIHx8IGhhc093bi5jYWxsKG9iaiwga2V5KTtcbiAgICB9O1xuXG4gICAgLyogalF1ZXJ5ICovXG4gICAgJC5lYWNoID0gZnVuY3Rpb24ob2JqLCBjYWxsYmFjaywgYXJncykge1xuICAgICAgICB2YXIgdmFsdWUsXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIGxlbmd0aCA9IG9iai5sZW5ndGgsXG4gICAgICAgICAgICBpc0FycmF5ID0gaXNBcnJheWxpa2Uob2JqKTtcblxuICAgICAgICBpZiAoYXJncykge1xuICAgICAgICAgICAgaWYgKGlzQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY2FsbGJhY2suYXBwbHkob2JqW2ldLCBhcmdzKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChpIGluIG9iaikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjYWxsYmFjay5hcHBseShvYmpbaV0sIGFyZ3MpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoaXNBcnJheSkge1xuICAgICAgICAgICAgICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjYWxsYmFjay5jYWxsKG9ialtpXSwgaSwgb2JqW2ldKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChpIGluIG9iaikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjYWxsYmFjay5jYWxsKG9ialtpXSwgaSwgb2JqW2ldKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfTtcblxuICAgIC8qIEN1c3RvbSAqL1xuICAgICQuZGF0YSA9IGZ1bmN0aW9uKG5vZGUsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgLyogJC5nZXREYXRhKCkgKi9cbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciBnZXRJZCA9IG5vZGVbJC5leHBhbmRvXSxcbiAgICAgICAgICAgICAgICBzdG9yZSA9IGdldElkICYmIGNhY2hlW2dldElkXTtcblxuICAgICAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdG9yZSkge1xuICAgICAgICAgICAgICAgIGlmIChrZXkgaW4gc3RvcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogJC5zZXREYXRhKCkgKi9cbiAgICAgICAgfSBlbHNlIGlmIChrZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdmFyIHNldElkID0gbm9kZVskLmV4cGFuZG9dIHx8IChub2RlWyQuZXhwYW5kb10gPSArKyQudXVpZCk7XG5cbiAgICAgICAgICAgIGNhY2hlW3NldElkXSA9IGNhY2hlW3NldElkXSB8fCB7fTtcbiAgICAgICAgICAgIGNhY2hlW3NldElkXVtrZXldID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKiBDdXN0b20gKi9cbiAgICAkLnJlbW92ZURhdGEgPSBmdW5jdGlvbihub2RlLCBrZXlzKSB7XG4gICAgICAgIHZhciBpZCA9IG5vZGVbJC5leHBhbmRvXSxcbiAgICAgICAgICAgIHN0b3JlID0gaWQgJiYgY2FjaGVbaWRdO1xuXG4gICAgICAgIGlmIChzdG9yZSkge1xuICAgICAgICAgICAgLy8gQ2xlYW51cCB0aGUgZW50aXJlIHN0b3JlIGlmIG5vIGtleXMgYXJlIHByb3ZpZGVkLlxuICAgICAgICAgICAgaWYgKCFrZXlzKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGNhY2hlW2lkXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJC5lYWNoKGtleXMsIGZ1bmN0aW9uKF8sIGtleSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgc3RvcmVba2V5XTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKiBqUXVlcnkgKi9cbiAgICAkLmV4dGVuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3JjLCBjb3B5SXNBcnJheSwgY29weSwgbmFtZSwgb3B0aW9ucywgY2xvbmUsXG4gICAgICAgICAgICB0YXJnZXQgPSBhcmd1bWVudHNbMF0gfHwge30sXG4gICAgICAgICAgICBpID0gMSxcbiAgICAgICAgICAgIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsXG4gICAgICAgICAgICBkZWVwID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICBkZWVwID0gdGFyZ2V0O1xuXG4gICAgICAgICAgICB0YXJnZXQgPSBhcmd1bWVudHNbaV0gfHwge307XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCAhPT0gXCJvYmplY3RcIiAmJiAkLnR5cGUodGFyZ2V0KSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB0YXJnZXQgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAgIHRhcmdldCA9IHRoaXM7XG4gICAgICAgICAgICBpLS07XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoKG9wdGlvbnMgPSBhcmd1bWVudHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgZm9yIChuYW1lIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzcmMgPSB0YXJnZXRbbmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGNvcHkgPSBvcHRpb25zW25hbWVdO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgPT09IGNvcHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlZXAgJiYgY29weSAmJiAoJC5pc1BsYWluT2JqZWN0KGNvcHkpIHx8IChjb3B5SXNBcnJheSA9ICQuaXNBcnJheShjb3B5KSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29weUlzQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3B5SXNBcnJheSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lID0gc3JjICYmICQuaXNBcnJheShzcmMpID8gc3JjIDogW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmUgPSBzcmMgJiYgJC5pc1BsYWluT2JqZWN0KHNyYykgPyBzcmMgOiB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdID0gJC5leHRlbmQoZGVlcCwgY2xvbmUsIGNvcHkpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29weSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0gPSBjb3B5O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9O1xuXG4gICAgLyogalF1ZXJ5IDEuNC4zICovXG4gICAgJC5xdWV1ZSA9IGZ1bmN0aW9uKGVsZW0sIHR5cGUsIGRhdGEpIHtcbiAgICAgICAgZnVuY3Rpb24gJG1ha2VBcnJheShhcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgIHZhciByZXQgPSByZXN1bHRzIHx8IFtdO1xuXG4gICAgICAgICAgICBpZiAoYXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzQXJyYXlsaWtlKE9iamVjdChhcnIpKSkge1xuICAgICAgICAgICAgICAgICAgICAvKiAkLm1lcmdlICovXG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbihmaXJzdCwgc2Vjb25kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGVuID0gK3NlY29uZC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaiA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSA9IGZpcnN0Lmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGogPCBsZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFtpKytdID0gc2Vjb25kW2orK107XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZW4gIT09IGxlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChzZWNvbmRbal0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFtpKytdID0gc2Vjb25kW2orK107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdC5sZW5ndGggPSBpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmlyc3Q7XG4gICAgICAgICAgICAgICAgICAgIH0pKHJldCwgdHlwZW9mIGFyciA9PT0gXCJzdHJpbmdcIiA/IFthcnJdIDogYXJyKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBbXS5wdXNoLmNhbGwocmV0LCBhcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZWxlbSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdHlwZSA9ICh0eXBlIHx8IFwiZnhcIikgKyBcInF1ZXVlXCI7XG5cbiAgICAgICAgdmFyIHEgPSAkLmRhdGEoZWxlbSwgdHlwZSk7XG5cbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gcSB8fCBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcSB8fCAkLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgICAgIHEgPSAkLmRhdGEoZWxlbSwgdHlwZSwgJG1ha2VBcnJheShkYXRhKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBxLnB1c2goZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcTtcbiAgICB9O1xuXG4gICAgLyogalF1ZXJ5IDEuNC4zICovXG4gICAgJC5kZXF1ZXVlID0gZnVuY3Rpb24oZWxlbXMsIHR5cGUpIHtcbiAgICAgICAgLyogQ3VzdG9tOiBFbWJlZCBlbGVtZW50IGl0ZXJhdGlvbi4gKi9cbiAgICAgICAgJC5lYWNoKGVsZW1zLm5vZGVUeXBlID8gW2VsZW1zXSA6IGVsZW1zLCBmdW5jdGlvbihpLCBlbGVtKSB7XG4gICAgICAgICAgICB0eXBlID0gdHlwZSB8fCBcImZ4XCI7XG5cbiAgICAgICAgICAgIHZhciBxdWV1ZSA9ICQucXVldWUoZWxlbSwgdHlwZSksXG4gICAgICAgICAgICAgICAgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuXG4gICAgICAgICAgICBpZiAoZm4gPT09IFwiaW5wcm9ncmVzc1wiKSB7XG4gICAgICAgICAgICAgICAgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZm4pIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gXCJmeFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXVlLnVuc2hpZnQoXCJpbnByb2dyZXNzXCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZuLmNhbGwoZWxlbSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQuZGVxdWV1ZShlbGVtLCB0eXBlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKioqKioqKioqKioqKioqKipcbiAgICAgJC5mbiBNZXRob2RzXG4gICAgICoqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qIGpRdWVyeSAqL1xuICAgICQuZm4gPSAkLnByb3RvdHlwZSA9IHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICAgICAgICAgIC8qIEp1c3QgcmV0dXJuIHRoZSBlbGVtZW50IHdyYXBwZWQgaW5zaWRlIGFuIGFycmF5OyBkb24ndCBwcm9jZWVkIHdpdGggdGhlIGFjdHVhbCBqUXVlcnkgbm9kZSB3cmFwcGluZyBwcm9jZXNzLiAqL1xuICAgICAgICAgICAgaWYgKHNlbGVjdG9yLm5vZGVUeXBlKSB7XG4gICAgICAgICAgICAgICAgdGhpc1swXSA9IHNlbGVjdG9yO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBhIERPTSBub2RlLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb2Zmc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8qIGpRdWVyeSBhbHRlcmVkIGNvZGU6IERyb3BwZWQgZGlzY29ubmVjdGVkIERPTSBub2RlIGNoZWNraW5nLiAqL1xuICAgICAgICAgICAgdmFyIGJveCA9IHRoaXNbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0ID8gdGhpc1swXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSA6IHt0b3A6IDAsIGxlZnQ6IDB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRvcDogYm94LnRvcCArICh3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuc2Nyb2xsVG9wIHx8IDApIC0gKGRvY3VtZW50LmNsaWVudFRvcCB8fCAwKSxcbiAgICAgICAgICAgICAgICBsZWZ0OiBib3gubGVmdCArICh3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jdW1lbnQuc2Nyb2xsTGVmdCB8fCAwKSAtIChkb2N1bWVudC5jbGllbnRMZWZ0IHx8IDApXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICBwb3NpdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvKiBqUXVlcnkgKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uIG9mZnNldFBhcmVudEZuKGVsZW0pIHtcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0UGFyZW50ID0gZWxlbS5vZmZzZXRQYXJlbnQ7XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAob2Zmc2V0UGFyZW50ICYmIG9mZnNldFBhcmVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9PSBcImh0bWxcIiAmJiBvZmZzZXRQYXJlbnQuc3R5bGUgJiYgb2Zmc2V0UGFyZW50LnN0eWxlLnBvc2l0aW9uID09PSBcInN0YXRpY1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIG9mZnNldFBhcmVudCA9IG9mZnNldFBhcmVudC5vZmZzZXRQYXJlbnQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9mZnNldFBhcmVudCB8fCBkb2N1bWVudDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogWmVwdG8gKi9cbiAgICAgICAgICAgIHZhciBlbGVtID0gdGhpc1swXSxcbiAgICAgICAgICAgICAgICBvZmZzZXRQYXJlbnQgPSBvZmZzZXRQYXJlbnRGbihlbGVtKSxcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSB0aGlzLm9mZnNldCgpLFxuICAgICAgICAgICAgICAgIHBhcmVudE9mZnNldCA9IC9eKD86Ym9keXxodG1sKSQvaS50ZXN0KG9mZnNldFBhcmVudC5ub2RlTmFtZSkgPyB7dG9wOiAwLCBsZWZ0OiAwfSA6ICQob2Zmc2V0UGFyZW50KS5vZmZzZXQoKTtcblxuICAgICAgICAgICAgb2Zmc2V0LnRvcCAtPSBwYXJzZUZsb2F0KGVsZW0uc3R5bGUubWFyZ2luVG9wKSB8fCAwO1xuICAgICAgICAgICAgb2Zmc2V0LmxlZnQgLT0gcGFyc2VGbG9hdChlbGVtLnN0eWxlLm1hcmdpbkxlZnQpIHx8IDA7XG5cbiAgICAgICAgICAgIGlmIChvZmZzZXRQYXJlbnQuc3R5bGUpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnRPZmZzZXQudG9wICs9IHBhcnNlRmxvYXQob2Zmc2V0UGFyZW50LnN0eWxlLmJvcmRlclRvcFdpZHRoKSB8fCAwO1xuICAgICAgICAgICAgICAgIHBhcmVudE9mZnNldC5sZWZ0ICs9IHBhcnNlRmxvYXQob2Zmc2V0UGFyZW50LnN0eWxlLmJvcmRlckxlZnRXaWR0aCkgfHwgMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0b3A6IG9mZnNldC50b3AgLSBwYXJlbnRPZmZzZXQudG9wLFxuICAgICAgICAgICAgICAgIGxlZnQ6IG9mZnNldC5sZWZ0IC0gcGFyZW50T2Zmc2V0LmxlZnRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgUHJpdmF0ZSBWYXJpYWJsZXNcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qIEZvciAkLmRhdGEoKSAqL1xuICAgIHZhciBjYWNoZSA9IHt9O1xuICAgICQuZXhwYW5kbyA9IFwidmVsb2NpdHlcIiArIChuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG4gICAgJC51dWlkID0gMDtcblxuICAgIC8qIEZvciAkLnF1ZXVlKCkgKi9cbiAgICB2YXIgY2xhc3MydHlwZSA9IHt9LFxuICAgICAgICBoYXNPd24gPSBjbGFzczJ0eXBlLmhhc093blByb3BlcnR5LFxuICAgICAgICB0b1N0cmluZyA9IGNsYXNzMnR5cGUudG9TdHJpbmc7XG5cbiAgICB2YXIgdHlwZXMgPSBcIkJvb2xlYW4gTnVtYmVyIFN0cmluZyBGdW5jdGlvbiBBcnJheSBEYXRlIFJlZ0V4cCBPYmplY3QgRXJyb3JcIi5zcGxpdChcIiBcIik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0eXBlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjbGFzczJ0eXBlW1wiW29iamVjdCBcIiArIHR5cGVzW2ldICsgXCJdXCJdID0gdHlwZXNbaV0udG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICAvKiBNYWtlcyAkKG5vZGUpIHBvc3NpYmxlLCB3aXRob3V0IGhhdmluZyB0byBjYWxsIGluaXQuICovXG4gICAgJC5mbi5pbml0LnByb3RvdHlwZSA9ICQuZm47XG5cbiAgICAvKiBHbG9iYWxpemUgVmVsb2NpdHkgb250byB0aGUgd2luZG93LCBhbmQgYXNzaWduIGl0cyBVdGlsaXRpZXMgcHJvcGVydHkuICovXG4gICAgd2luZG93LlZlbG9jaXR5ID0ge1V0aWxpdGllczogJH07XG59KSh3aW5kb3cpO1xuXG4vKioqKioqKioqKioqKioqKioqXG4gVmVsb2NpdHkuanNcbiAqKioqKioqKioqKioqKioqKiovXG5cbihmdW5jdGlvbihmYWN0b3J5KSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgLyogQ29tbW9uSlMgbW9kdWxlLiAqL1xuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICAgICAgLyogQU1EIG1vZHVsZS4gKi9cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShmYWN0b3J5KTtcbiAgICAgICAgLyogQnJvd3NlciBnbG9iYWxzLiAqL1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZhY3RvcnkoKTtcbiAgICB9XG59KGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHJldHVybiBmdW5jdGlvbihnbG9iYWwsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuXG4gICAgICAgIC8qKioqKioqKioqKioqKipcbiAgICAgICAgIFN1bW1hcnlcbiAgICAgICAgICoqKioqKioqKioqKioqKi9cblxuICAgICAgICAvKlxuICAgICAgICAgLSBDU1M6IENTUyBzdGFjayB0aGF0IHdvcmtzIGluZGVwZW5kZW50bHkgZnJvbSB0aGUgcmVzdCBvZiBWZWxvY2l0eS5cbiAgICAgICAgIC0gYW5pbWF0ZSgpOiBDb3JlIGFuaW1hdGlvbiBtZXRob2QgdGhhdCBpdGVyYXRlcyBvdmVyIHRoZSB0YXJnZXRlZCBlbGVtZW50cyBhbmQgcXVldWVzIHRoZSBpbmNvbWluZyBjYWxsIG9udG8gZWFjaCBlbGVtZW50IGluZGl2aWR1YWxseS5cbiAgICAgICAgIC0gUHJlLVF1ZXVlaW5nOiBQcmVwYXJlIHRoZSBlbGVtZW50IGZvciBhbmltYXRpb24gYnkgaW5zdGFudGlhdGluZyBpdHMgZGF0YSBjYWNoZSBhbmQgcHJvY2Vzc2luZyB0aGUgY2FsbCdzIG9wdGlvbnMuXG4gICAgICAgICAtIFF1ZXVlaW5nOiBUaGUgbG9naWMgdGhhdCBydW5zIG9uY2UgdGhlIGNhbGwgaGFzIHJlYWNoZWQgaXRzIHBvaW50IG9mIGV4ZWN1dGlvbiBpbiB0aGUgZWxlbWVudCdzICQucXVldWUoKSBzdGFjay5cbiAgICAgICAgIE1vc3QgbG9naWMgaXMgcGxhY2VkIGhlcmUgdG8gYXZvaWQgcmlza2luZyBpdCBiZWNvbWluZyBzdGFsZSAoaWYgdGhlIGVsZW1lbnQncyBwcm9wZXJ0aWVzIGhhdmUgY2hhbmdlZCkuXG4gICAgICAgICAtIFB1c2hpbmc6IENvbnNvbGlkYXRpb24gb2YgdGhlIHR3ZWVuIGRhdGEgZm9sbG93ZWQgYnkgaXRzIHB1c2ggb250byB0aGUgZ2xvYmFsIGluLXByb2dyZXNzIGNhbGxzIGNvbnRhaW5lci5cbiAgICAgICAgIC0gdGljaygpOiBUaGUgc2luZ2xlIHJlcXVlc3RBbmltYXRpb25GcmFtZSBsb29wIHJlc3BvbnNpYmxlIGZvciB0d2VlbmluZyBhbGwgaW4tcHJvZ3Jlc3MgY2FsbHMuXG4gICAgICAgICAtIGNvbXBsZXRlQ2FsbCgpOiBIYW5kbGVzIHRoZSBjbGVhbnVwIHByb2Nlc3MgZm9yIGVhY2ggVmVsb2NpdHkgY2FsbC5cbiAgICAgICAgICovXG5cbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgSGVscGVyIEZ1bmN0aW9uc1xuICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIC8qIElFIGRldGVjdGlvbi4gR2lzdDogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vanVsaWFuc2hhcGlyby85MDk4NjA5ICovXG4gICAgICAgIHZhciBJRSA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5kb2N1bWVudE1vZGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRNb2RlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gNzsgaSA+IDQ7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBkaXYuaW5uZXJIVE1MID0gXCI8IS0tW2lmIElFIFwiICsgaSArIFwiXT48c3Bhbj48L3NwYW4+PCFbZW5kaWZdLS0+XCI7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNwYW5cIikubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSkoKTtcblxuICAgICAgICAvKiByQUYgc2hpbS4gR2lzdDogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vanVsaWFuc2hhcGlyby85NDk3NTEzICovXG4gICAgICAgIHZhciByQUZTaGltID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRpbWVMYXN0ID0gMDtcblxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGltZUN1cnJlbnQgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZURlbHRhO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIER5bmFtaWNhbGx5IHNldCBkZWxheSBvbiBhIHBlci10aWNrIGJhc2lzIHRvIG1hdGNoIDYwZnBzLiAqL1xuICAgICAgICAgICAgICAgICAgICAvKiBUZWNobmlxdWUgYnkgRXJpayBNb2xsZXIuIE1JVCBsaWNlbnNlOiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9wYXVsaXJpc2gvMTU3OTY3MSAqL1xuICAgICAgICAgICAgICAgICAgICB0aW1lRGVsdGEgPSBNYXRoLm1heCgwLCAxNiAtICh0aW1lQ3VycmVudCAtIHRpbWVMYXN0KSk7XG4gICAgICAgICAgICAgICAgICAgIHRpbWVMYXN0ID0gdGltZUN1cnJlbnQgKyB0aW1lRGVsdGE7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayh0aW1lQ3VycmVudCArIHRpbWVEZWx0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0sIHRpbWVEZWx0YSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgfSkoKTtcblxuICAgICAgICB2YXIgcGVyZm9ybWFuY2UgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcGVyZiA9IHdpbmRvdy5wZXJmb3JtYW5jZSB8fCB7fTtcblxuICAgICAgICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGVyZiwgXCJub3dcIikpIHtcbiAgICAgICAgICAgICAgICB2YXIgbm93T2Zmc2V0ID0gcGVyZi50aW1pbmcgJiYgcGVyZi50aW1pbmcuZG9tQ29tcGxldGUgPyBwZXJmLnRpbWluZy5kb21Db21wbGV0ZSA6IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgICAgICAgICBwZXJmLm5vdyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAtIG5vd09mZnNldDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHBlcmY7XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgLyogQXJyYXkgY29tcGFjdGluZy4gQ29weXJpZ2h0IExvLURhc2guIE1JVCBMaWNlbnNlOiBodHRwczovL2dpdGh1Yi5jb20vbG9kYXNoL2xvZGFzaC9ibG9iL21hc3Rlci9MSUNFTlNFLnR4dCAqL1xuICAgICAgICBmdW5jdGlvbiBjb21wYWN0U3BhcnNlQXJyYXkoYXJyYXkpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgICAgICAgIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMCxcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBbXTtcblxuICAgICAgICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfc2xpY2UgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgLy8gQ2FuJ3QgYmUgdXNlZCB3aXRoIERPTSBlbGVtZW50cyBpbiBJRSA8IDlcbiAgICAgICAgICAgICAgICBzbGljZS5jYWxsKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IC8vIEZhaWxzIGluIElFIDwgOVxuICAgICAgICAgICAgICAgIC8vIFRoaXMgd2lsbCB3b3JrIGZvciBnZW51aW5lIGFycmF5cywgYXJyYXktbGlrZSBvYmplY3RzLFxuICAgICAgICAgICAgICAgIC8vIE5hbWVkTm9kZU1hcCAoYXR0cmlidXRlcywgZW50aXRpZXMsIG5vdGF0aW9ucyksXG4gICAgICAgICAgICAgICAgLy8gTm9kZUxpc3QgKGUuZy4sIGdldEVsZW1lbnRzQnlUYWdOYW1lKSwgSFRNTENvbGxlY3Rpb24gKGUuZy4sIGNoaWxkTm9kZXMpLFxuICAgICAgICAgICAgICAgIC8vIGFuZCB3aWxsIG5vdCBmYWlsIG9uIG90aGVyIERPTSBvYmplY3RzIChhcyBkbyBET00gZWxlbWVudHMgaW4gSUUgPCA5KVxuICAgICAgICAgICAgICAgIHNsaWNlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpID0gdGhpcy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9uZSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICgtLWkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9uZVtpXSA9IHRoaXNbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNsb25lZDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNsaWNlO1xuICAgICAgICB9KSgpOyAvLyBUT0RPOiBJRTgsIENhY2hlIG9mIEFycmF5LnByb3RvdHlwZS5zbGljZSB0aGF0IHdvcmtzIG9uIElFOFxuXG4gICAgICAgIGZ1bmN0aW9uIHNhbml0aXplRWxlbWVudHMoZWxlbWVudHMpIHtcbiAgICAgICAgICAgIC8qIFVud3JhcCBqUXVlcnkvWmVwdG8gb2JqZWN0cy4gKi9cbiAgICAgICAgICAgIGlmIChUeXBlLmlzV3JhcHBlZChlbGVtZW50cykpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50cyA9IF9zbGljZS5jYWxsKGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICAvKiBXcmFwIGEgc2luZ2xlIGVsZW1lbnQgaW4gYW4gYXJyYXkgc28gdGhhdCAkLmVhY2goKSBjYW4gaXRlcmF0ZSB3aXRoIHRoZSBlbGVtZW50IGluc3RlYWQgb2YgaXRzIG5vZGUncyBjaGlsZHJlbi4gKi9cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoVHlwZS5pc05vZGUoZWxlbWVudHMpKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudHMgPSBbZWxlbWVudHNdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudHM7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgVHlwZSA9IHtcbiAgICAgICAgICAgIGlzTnVtYmVyOiBmdW5jdGlvbih2YXJpYWJsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAodHlwZW9mIHZhcmlhYmxlID09PSBcIm51bWJlclwiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpc1N0cmluZzogZnVuY3Rpb24odmFyaWFibGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHR5cGVvZiB2YXJpYWJsZSA9PT0gXCJzdHJpbmdcIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXNBcnJheTogQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbih2YXJpYWJsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFyaWFibGUpID09PSBcIltvYmplY3QgQXJyYXldXCI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXNGdW5jdGlvbjogZnVuY3Rpb24odmFyaWFibGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhcmlhYmxlKSA9PT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzTm9kZTogZnVuY3Rpb24odmFyaWFibGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFyaWFibGUgJiYgdmFyaWFibGUubm9kZVR5cGU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyogRGV0ZXJtaW5lIGlmIHZhcmlhYmxlIGlzIGFuIGFycmF5LWxpa2Ugd3JhcHBlZCBqUXVlcnksIFplcHRvIG9yIHNpbWlsYXIgZWxlbWVudCwgb3IgZXZlbiBhIE5vZGVMaXN0IGV0Yy4gKi9cbiAgICAgICAgICAgIC8qIE5PVEU6IEhUTUxGb3JtRWxlbWVudHMgYWxzbyBoYXZlIGEgbGVuZ3RoLiAqL1xuICAgICAgICAgICAgaXNXcmFwcGVkOiBmdW5jdGlvbih2YXJpYWJsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YXJpYWJsZVxuICAgICAgICAgICAgICAgICAgICAmJiBUeXBlLmlzTnVtYmVyKHZhcmlhYmxlLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgJiYgIVR5cGUuaXNTdHJpbmcodmFyaWFibGUpXG4gICAgICAgICAgICAgICAgICAgICYmICFUeXBlLmlzRnVuY3Rpb24odmFyaWFibGUpXG4gICAgICAgICAgICAgICAgICAgICYmICFUeXBlLmlzTm9kZSh2YXJpYWJsZSlcbiAgICAgICAgICAgICAgICAgICAgJiYgKHZhcmlhYmxlLmxlbmd0aCA9PT0gMCB8fCBUeXBlLmlzTm9kZSh2YXJpYWJsZVswXSkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzU1ZHOiBmdW5jdGlvbih2YXJpYWJsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuU1ZHRWxlbWVudCAmJiAodmFyaWFibGUgaW5zdGFuY2VvZiB3aW5kb3cuU1ZHRWxlbWVudCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXNFbXB0eU9iamVjdDogZnVuY3Rpb24odmFyaWFibGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBuYW1lIGluIHZhcmlhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YXJpYWJsZS5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqKioqKioqKioqKioqKioqXG4gICAgICAgICBEZXBlbmRlbmNpZXNcbiAgICAgICAgICoqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIHZhciAkLFxuICAgICAgICAgICAgaXNKUXVlcnkgPSBmYWxzZTtcblxuICAgICAgICBpZiAoZ2xvYmFsLmZuICYmIGdsb2JhbC5mbi5qcXVlcnkpIHtcbiAgICAgICAgICAgICQgPSBnbG9iYWw7XG4gICAgICAgICAgICBpc0pRdWVyeSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkID0gd2luZG93LlZlbG9jaXR5LlV0aWxpdGllcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChJRSA8PSA4ICYmICFpc0pRdWVyeSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVmVsb2NpdHk6IElFOCBhbmQgYmVsb3cgcmVxdWlyZSBqUXVlcnkgdG8gYmUgbG9hZGVkIGJlZm9yZSBWZWxvY2l0eS5cIik7XG4gICAgICAgIH0gZWxzZSBpZiAoSUUgPD0gNykge1xuICAgICAgICAgICAgLyogUmV2ZXJ0IHRvIGpRdWVyeSdzICQuYW5pbWF0ZSgpLCBhbmQgbG9zZSBWZWxvY2l0eSdzIGV4dHJhIGZlYXR1cmVzLiAqL1xuICAgICAgICAgICAgalF1ZXJ5LmZuLnZlbG9jaXR5ID0galF1ZXJ5LmZuLmFuaW1hdGU7XG5cbiAgICAgICAgICAgIC8qIE5vdyB0aGF0ICQuZm4udmVsb2NpdHkgaXMgYWxpYXNlZCwgYWJvcnQgdGhpcyBWZWxvY2l0eSBkZWNsYXJhdGlvbi4gKi9cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKlxuICAgICAgICAgQ29uc3RhbnRzXG4gICAgICAgICAqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICB2YXIgRFVSQVRJT05fREVGQVVMVCA9IDQwMCxcbiAgICAgICAgICAgIEVBU0lOR19ERUZBVUxUID0gXCJzd2luZ1wiO1xuXG4gICAgICAgIC8qKioqKioqKioqKioqXG4gICAgICAgICBTdGF0ZVxuICAgICAgICAgKioqKioqKioqKioqKi9cblxuICAgICAgICB2YXIgVmVsb2NpdHkgPSB7XG4gICAgICAgICAgICAvKiBDb250YWluZXIgZm9yIHBhZ2Utd2lkZSBWZWxvY2l0eSBzdGF0ZSBkYXRhLiAqL1xuICAgICAgICAgICAgU3RhdGU6IHtcbiAgICAgICAgICAgICAgICAvKiBEZXRlY3QgbW9iaWxlIGRldmljZXMgdG8gZGV0ZXJtaW5lIGlmIG1vYmlsZUhBIHNob3VsZCBiZSB0dXJuZWQgb24uICovXG4gICAgICAgICAgICAgICAgaXNNb2JpbGU6IC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxcbiAgICAgICAgICAgICAgICAvKiBUaGUgbW9iaWxlSEEgb3B0aW9uJ3MgYmVoYXZpb3IgY2hhbmdlcyBvbiBvbGRlciBBbmRyb2lkIGRldmljZXMgKEdpbmdlcmJyZWFkLCB2ZXJzaW9ucyAyLjMuMy0yLjMuNykuICovXG4gICAgICAgICAgICAgICAgaXNBbmRyb2lkOiAvQW5kcm9pZC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksXG4gICAgICAgICAgICAgICAgaXNHaW5nZXJicmVhZDogL0FuZHJvaWQgMlxcLjNcXC5bMy03XS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksXG4gICAgICAgICAgICAgICAgaXNDaHJvbWU6IHdpbmRvdy5jaHJvbWUsXG4gICAgICAgICAgICAgICAgaXNGaXJlZm94OiAvRmlyZWZveC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksXG4gICAgICAgICAgICAgICAgLyogQ3JlYXRlIGEgY2FjaGVkIGVsZW1lbnQgZm9yIHJlLXVzZSB3aGVuIGNoZWNraW5nIGZvciBDU1MgcHJvcGVydHkgcHJlZml4ZXMuICovXG4gICAgICAgICAgICAgICAgcHJlZml4RWxlbWVudDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcbiAgICAgICAgICAgICAgICAvKiBDYWNoZSBldmVyeSBwcmVmaXggbWF0Y2ggdG8gYXZvaWQgcmVwZWF0aW5nIGxvb2t1cHMuICovXG4gICAgICAgICAgICAgICAgcHJlZml4TWF0Y2hlczoge30sXG4gICAgICAgICAgICAgICAgLyogQ2FjaGUgdGhlIGFuY2hvciB1c2VkIGZvciBhbmltYXRpbmcgd2luZG93IHNjcm9sbGluZy4gKi9cbiAgICAgICAgICAgICAgICBzY3JvbGxBbmNob3I6IG51bGwsXG4gICAgICAgICAgICAgICAgLyogQ2FjaGUgdGhlIGJyb3dzZXItc3BlY2lmaWMgcHJvcGVydHkgbmFtZXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBzY3JvbGwgYW5jaG9yLiAqL1xuICAgICAgICAgICAgICAgIHNjcm9sbFByb3BlcnR5TGVmdDogbnVsbCxcbiAgICAgICAgICAgICAgICBzY3JvbGxQcm9wZXJ0eVRvcDogbnVsbCxcbiAgICAgICAgICAgICAgICAvKiBLZWVwIHRyYWNrIG9mIHdoZXRoZXIgb3VyIFJBRiB0aWNrIGlzIHJ1bm5pbmcuICovXG4gICAgICAgICAgICAgICAgaXNUaWNraW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAvKiBDb250YWluZXIgZm9yIGV2ZXJ5IGluLXByb2dyZXNzIGNhbGwgdG8gVmVsb2NpdHkuICovXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtdLFxuICAgICAgICAgICAgICAgIGRlbGF5ZWRFbGVtZW50czoge1xuICAgICAgICAgICAgICAgICAgICBjb3VudDogMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiBWZWxvY2l0eSdzIGN1c3RvbSBDU1Mgc3RhY2suIE1hZGUgZ2xvYmFsIGZvciB1bml0IHRlc3RpbmcuICovXG4gICAgICAgICAgICBDU1M6IHsvKiBEZWZpbmVkIGJlbG93LiAqL30sXG4gICAgICAgICAgICAvKiBBIHNoaW0gb2YgdGhlIGpRdWVyeSB1dGlsaXR5IGZ1bmN0aW9ucyB1c2VkIGJ5IFZlbG9jaXR5IC0tIHByb3ZpZGVkIGJ5IFZlbG9jaXR5J3Mgb3B0aW9uYWwgalF1ZXJ5IHNoaW0uICovXG4gICAgICAgICAgICBVdGlsaXRpZXM6ICQsXG4gICAgICAgICAgICAvKiBDb250YWluZXIgZm9yIHRoZSB1c2VyJ3MgY3VzdG9tIGFuaW1hdGlvbiByZWRpcmVjdHMgdGhhdCBhcmUgcmVmZXJlbmNlZCBieSBuYW1lIGluIHBsYWNlIG9mIHRoZSBwcm9wZXJ0aWVzIG1hcCBhcmd1bWVudC4gKi9cbiAgICAgICAgICAgIFJlZGlyZWN0czogey8qIE1hbnVhbGx5IHJlZ2lzdGVyZWQgYnkgdGhlIHVzZXIuICovfSxcbiAgICAgICAgICAgIEVhc2luZ3M6IHsvKiBEZWZpbmVkIGJlbG93LiAqL30sXG4gICAgICAgICAgICAvKiBBdHRlbXB0IHRvIHVzZSBFUzYgUHJvbWlzZXMgYnkgZGVmYXVsdC4gVXNlcnMgY2FuIG92ZXJyaWRlIHRoaXMgd2l0aCBhIHRoaXJkLXBhcnR5IHByb21pc2VzIGxpYnJhcnkuICovXG4gICAgICAgICAgICBQcm9taXNlOiB3aW5kb3cuUHJvbWlzZSxcbiAgICAgICAgICAgIC8qIFZlbG9jaXR5IG9wdGlvbiBkZWZhdWx0cywgd2hpY2ggY2FuIGJlIG92ZXJyaWRlbiBieSB0aGUgdXNlci4gKi9cbiAgICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICAgICAgcXVldWU6IFwiXCIsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IERVUkFUSU9OX0RFRkFVTFQsXG4gICAgICAgICAgICAgICAgZWFzaW5nOiBFQVNJTkdfREVGQVVMVCxcbiAgICAgICAgICAgICAgICBiZWdpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxvb3A6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRlbGF5OiBmYWxzZSxcbiAgICAgICAgICAgICAgICBtb2JpbGVIQTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAvKiBBZHZhbmNlZDogU2V0IHRvIGZhbHNlIHRvIHByZXZlbnQgcHJvcGVydHkgdmFsdWVzIGZyb20gYmVpbmcgY2FjaGVkIGJldHdlZW4gY29uc2VjdXRpdmUgVmVsb2NpdHktaW5pdGlhdGVkIGNoYWluIGNhbGxzLiAqL1xuICAgICAgICAgICAgICAgIF9jYWNoZVZhbHVlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAvKiBBZHZhbmNlZDogU2V0IHRvIGZhbHNlIGlmIHRoZSBwcm9taXNlIHNob3VsZCBhbHdheXMgcmVzb2x2ZSBvbiBlbXB0eSBlbGVtZW50IGxpc3RzLiAqL1xuICAgICAgICAgICAgICAgIHByb21pc2VSZWplY3RFbXB0eTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qIEEgZGVzaWduIGdvYWwgb2YgVmVsb2NpdHkgaXMgdG8gY2FjaGUgZGF0YSB3aGVyZXZlciBwb3NzaWJsZSBpbiBvcmRlciB0byBhdm9pZCBET00gcmVxdWVyeWluZy4gQWNjb3JkaW5nbHksIGVhY2ggZWxlbWVudCBoYXMgYSBkYXRhIGNhY2hlLiAqL1xuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICQuZGF0YShlbGVtZW50LCBcInZlbG9jaXR5XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgLyogU3RvcmUgd2hldGhlciB0aGlzIGlzIGFuIFNWRyBlbGVtZW50LCBzaW5jZSBpdHMgcHJvcGVydGllcyBhcmUgcmV0cmlldmVkIGFuZCB1cGRhdGVkIGRpZmZlcmVudGx5IHRoYW4gc3RhbmRhcmQgSFRNTCBlbGVtZW50cy4gKi9cbiAgICAgICAgICAgICAgICAgICAgaXNTVkc6IFR5cGUuaXNTVkcoZWxlbWVudCksXG4gICAgICAgICAgICAgICAgICAgIC8qIEtlZXAgdHJhY2sgb2Ygd2hldGhlciB0aGUgZWxlbWVudCBpcyBjdXJyZW50bHkgYmVpbmcgYW5pbWF0ZWQgYnkgVmVsb2NpdHkuXG4gICAgICAgICAgICAgICAgICAgICBUaGlzIGlzIHVzZWQgdG8gZW5zdXJlIHRoYXQgcHJvcGVydHkgdmFsdWVzIGFyZSBub3QgdHJhbnNmZXJyZWQgYmV0d2VlbiBub24tY29uc2VjdXRpdmUgKHN0YWxlKSBjYWxscy4gKi9cbiAgICAgICAgICAgICAgICAgICAgaXNBbmltYXRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAvKiBBIHJlZmVyZW5jZSB0byB0aGUgZWxlbWVudCdzIGxpdmUgY29tcHV0ZWRTdHlsZSBvYmplY3QuIExlYXJuIG1vcmUgaGVyZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vZG9jcy9XZWIvQVBJL3dpbmRvdy5nZXRDb21wdXRlZFN0eWxlICovXG4gICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkU3R5bGU6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIC8qIFR3ZWVuIGRhdGEgaXMgY2FjaGVkIGZvciBlYWNoIGFuaW1hdGlvbiBvbiB0aGUgZWxlbWVudCBzbyB0aGF0IGRhdGEgY2FuIGJlIHBhc3NlZCBhY3Jvc3MgY2FsbHMgLS1cbiAgICAgICAgICAgICAgICAgICAgIGluIHBhcnRpY3VsYXIsIGVuZCB2YWx1ZXMgYXJlIHVzZWQgYXMgc3Vic2VxdWVudCBzdGFydCB2YWx1ZXMgaW4gY29uc2VjdXRpdmUgVmVsb2NpdHkgY2FsbHMuICovXG4gICAgICAgICAgICAgICAgICAgIHR3ZWVuc0NvbnRhaW5lcjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgLyogVGhlIGZ1bGwgcm9vdCBwcm9wZXJ0eSB2YWx1ZXMgb2YgZWFjaCBDU1MgaG9vayBiZWluZyBhbmltYXRlZCBvbiB0aGlzIGVsZW1lbnQgYXJlIGNhY2hlZCBzbyB0aGF0OlxuICAgICAgICAgICAgICAgICAgICAgMSkgQ29uY3VycmVudGx5LWFuaW1hdGluZyBob29rcyBzaGFyaW5nIHRoZSBzYW1lIHJvb3QgY2FuIGhhdmUgdGhlaXIgcm9vdCB2YWx1ZXMnIG1lcmdlZCBpbnRvIG9uZSB3aGlsZSB0d2VlbmluZy5cbiAgICAgICAgICAgICAgICAgICAgIDIpIFBvc3QtaG9vay1pbmplY3Rpb24gcm9vdCB2YWx1ZXMgY2FuIGJlIHRyYW5zZmVycmVkIG92ZXIgdG8gY29uc2VjdXRpdmVseSBjaGFpbmVkIFZlbG9jaXR5IGNhbGxzIGFzIHN0YXJ0aW5nIHJvb3QgdmFsdWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZUNhY2hlOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgLyogQSBjYWNoZSBmb3IgdHJhbnNmb3JtIHVwZGF0ZXMsIHdoaWNoIG11c3QgYmUgbWFudWFsbHkgZmx1c2hlZCB2aWEgQ1NTLmZsdXNoVHJhbnNmb3JtQ2FjaGUoKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtQ2FjaGU6IHt9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyogQSBwYXJhbGxlbCB0byBqUXVlcnkncyAkLmNzcygpLCB1c2VkIGZvciBnZXR0aW5nL3NldHRpbmcgVmVsb2NpdHkncyBob29rZWQgQ1NTIHByb3BlcnRpZXMuICovXG4gICAgICAgICAgICBob29rOiBudWxsLCAvKiBEZWZpbmVkIGJlbG93LiAqL1xuICAgICAgICAgICAgLyogVmVsb2NpdHktd2lkZSBhbmltYXRpb24gdGltZSByZW1hcHBpbmcgZm9yIHRlc3RpbmcgcHVycG9zZXMuICovXG4gICAgICAgICAgICBtb2NrOiBmYWxzZSxcbiAgICAgICAgICAgIHZlcnNpb246IHttYWpvcjogMSwgbWlub3I6IDQsIHBhdGNoOiAyfSxcbiAgICAgICAgICAgIC8qIFNldCB0byAxIG9yIDIgKG1vc3QgdmVyYm9zZSkgdG8gb3V0cHV0IGRlYnVnIGluZm8gdG8gY29uc29sZS4gKi9cbiAgICAgICAgICAgIGRlYnVnOiBmYWxzZSxcbiAgICAgICAgICAgIC8qIFVzZSByQUYgaGlnaCByZXNvbHV0aW9uIHRpbWVzdGFtcCB3aGVuIGF2YWlsYWJsZSAqL1xuICAgICAgICAgICAgdGltZXN0YW1wOiB0cnVlLFxuICAgICAgICAgICAgLyogUGF1c2UgYWxsIGFuaW1hdGlvbnMgKi9cbiAgICAgICAgICAgIHBhdXNlQWxsOiBmdW5jdGlvbihxdWV1ZU5hbWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFRpbWUgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuXG4gICAgICAgICAgICAgICAgJC5lYWNoKFZlbG9jaXR5LlN0YXRlLmNhbGxzLCBmdW5jdGlvbihpLCBhY3RpdmVDYWxsKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUNhbGwpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgd2UgaGF2ZSBhIHF1ZXVlTmFtZSBhbmQgdGhpcyBjYWxsIGlzIG5vdCBvbiB0aGF0IHF1ZXVlLCBza2lwICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocXVldWVOYW1lICE9PSB1bmRlZmluZWQgJiYgKChhY3RpdmVDYWxsWzJdLnF1ZXVlICE9PSBxdWV1ZU5hbWUpIHx8IChhY3RpdmVDYWxsWzJdLnF1ZXVlID09PSBmYWxzZSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNldCBjYWxsIHRvIHBhdXNlZCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlQ2FsbFs1XSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bWU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvKiBQYXVzZSB0aW1lcnMgb24gYW55IGN1cnJlbnRseSBkZWxheWVkIGNhbGxzICovXG4gICAgICAgICAgICAgICAgJC5lYWNoKFZlbG9jaXR5LlN0YXRlLmRlbGF5ZWRFbGVtZW50cywgZnVuY3Rpb24oaywgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwYXVzZURlbGF5T25FbGVtZW50KGVsZW1lbnQsIGN1cnJlbnRUaW1lKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiBSZXN1bWUgYWxsIGFuaW1hdGlvbnMgKi9cbiAgICAgICAgICAgIHJlc3VtZUFsbDogZnVuY3Rpb24ocXVldWVOYW1lKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRUaW1lID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcblxuICAgICAgICAgICAgICAgICQuZWFjaChWZWxvY2l0eS5TdGF0ZS5jYWxscywgZnVuY3Rpb24oaSwgYWN0aXZlQ2FsbCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVDYWxsKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHdlIGhhdmUgYSBxdWV1ZU5hbWUgYW5kIHRoaXMgY2FsbCBpcyBub3Qgb24gdGhhdCBxdWV1ZSwgc2tpcCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHF1ZXVlTmFtZSAhPT0gdW5kZWZpbmVkICYmICgoYWN0aXZlQ2FsbFsyXS5xdWV1ZSAhPT0gcXVldWVOYW1lKSB8fCAoYWN0aXZlQ2FsbFsyXS5xdWV1ZSA9PT0gZmFsc2UpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBTZXQgY2FsbCB0byByZXN1bWVkIGlmIGl0IHdhcyBwYXVzZWQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVDYWxsWzVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlQ2FsbFs1XS5yZXN1bWUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLyogUmVzdW1lIHRpbWVycyBvbiBhbnkgY3VycmVudGx5IGRlbGF5ZWQgY2FsbHMgKi9cbiAgICAgICAgICAgICAgICAkLmVhY2goVmVsb2NpdHkuU3RhdGUuZGVsYXllZEVsZW1lbnRzLCBmdW5jdGlvbihrLCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc3VtZURlbGF5T25FbGVtZW50KGVsZW1lbnQsIGN1cnJlbnRUaW1lKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKiBSZXRyaWV2ZSB0aGUgYXBwcm9wcmlhdGUgc2Nyb2xsIGFuY2hvciBhbmQgcHJvcGVydHkgbmFtZSBmb3IgdGhlIGJyb3dzZXI6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XaW5kb3cuc2Nyb2xsWSAqL1xuICAgICAgICBpZiAod2luZG93LnBhZ2VZT2Zmc2V0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLnNjcm9sbEFuY2hvciA9IHdpbmRvdztcbiAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLnNjcm9sbFByb3BlcnR5TGVmdCA9IFwicGFnZVhPZmZzZXRcIjtcbiAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLnNjcm9sbFByb3BlcnR5VG9wID0gXCJwYWdlWU9mZnNldFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuc2Nyb2xsQW5jaG9yID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZSB8fCBkb2N1bWVudC5ib2R5O1xuICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuc2Nyb2xsUHJvcGVydHlMZWZ0ID0gXCJzY3JvbGxMZWZ0XCI7XG4gICAgICAgICAgICBWZWxvY2l0eS5TdGF0ZS5zY3JvbGxQcm9wZXJ0eVRvcCA9IFwic2Nyb2xsVG9wXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvKiBTaG9ydGhhbmQgYWxpYXMgZm9yIGpRdWVyeSdzICQuZGF0YSgpIHV0aWxpdHkuICovXG4gICAgICAgIGZ1bmN0aW9uIERhdGEoZWxlbWVudCkge1xuICAgICAgICAgICAgLyogSGFyZGNvZGUgYSByZWZlcmVuY2UgdG8gdGhlIHBsdWdpbiBuYW1lLiAqL1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gJC5kYXRhKGVsZW1lbnQsIFwidmVsb2NpdHlcIik7XG5cbiAgICAgICAgICAgIC8qIGpRdWVyeSA8PTEuNC4yIHJldHVybnMgbnVsbCBpbnN0ZWFkIG9mIHVuZGVmaW5lZCB3aGVuIG5vIG1hdGNoIGlzIGZvdW5kLiBXZSBub3JtYWxpemUgdGhpcyBiZWhhdmlvci4gKi9cbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZSA9PT0gbnVsbCA/IHVuZGVmaW5lZCA6IHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqKioqKioqKioqKioqXG4gICAgICAgICBEZWxheSBUaW1lclxuICAgICAgICAgKioqKioqKioqKioqKiovXG5cbiAgICAgICAgZnVuY3Rpb24gcGF1c2VEZWxheU9uRWxlbWVudChlbGVtZW50LCBjdXJyZW50VGltZSkge1xuICAgICAgICAgICAgLyogQ2hlY2sgZm9yIGFueSBkZWxheSB0aW1lcnMsIGFuZCBwYXVzZSB0aGUgc2V0IHRpbWVvdXRzICh3aGlsZSBwcmVzZXJ2aW5nIHRpbWUgZGF0YSlcbiAgICAgICAgICAgICB0byBiZSByZXN1bWVkIHdoZW4gdGhlIFwicmVzdW1lXCIgY29tbWFuZCBpcyBpc3N1ZWQgKi9cbiAgICAgICAgICAgIHZhciBkYXRhID0gRGF0YShlbGVtZW50KTtcbiAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEuZGVsYXlUaW1lciAmJiAhZGF0YS5kZWxheVBhdXNlZCkge1xuICAgICAgICAgICAgICAgIGRhdGEuZGVsYXlSZW1haW5pbmcgPSBkYXRhLmRlbGF5IC0gY3VycmVudFRpbWUgKyBkYXRhLmRlbGF5QmVnaW47XG4gICAgICAgICAgICAgICAgZGF0YS5kZWxheVBhdXNlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGRhdGEuZGVsYXlUaW1lci5zZXRUaW1lb3V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlc3VtZURlbGF5T25FbGVtZW50KGVsZW1lbnQsIGN1cnJlbnRUaW1lKSB7XG4gICAgICAgICAgICAvKiBDaGVjayBmb3IgYW55IHBhdXNlZCB0aW1lcnMgYW5kIHJlc3VtZSAqL1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBEYXRhKGVsZW1lbnQpO1xuICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5kZWxheVRpbWVyICYmIGRhdGEuZGVsYXlQYXVzZWQpIHtcbiAgICAgICAgICAgICAgICAvKiBJZiB0aGUgZWxlbWVudCB3YXMgbWlkLWRlbGF5LCByZSBpbml0aWF0ZSB0aGUgdGltZW91dCB3aXRoIHRoZSByZW1haW5pbmcgZGVsYXkgKi9cbiAgICAgICAgICAgICAgICBkYXRhLmRlbGF5UGF1c2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZGF0YS5kZWxheVRpbWVyLnNldFRpbWVvdXQgPSBzZXRUaW1lb3V0KGRhdGEuZGVsYXlUaW1lci5uZXh0LCBkYXRhLmRlbGF5UmVtYWluaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cblxuICAgICAgICAvKioqKioqKioqKioqKipcbiAgICAgICAgIEVhc2luZ1xuICAgICAgICAgKioqKioqKioqKioqKiovXG5cbiAgICAgICAgLyogU3RlcCBlYXNpbmcgZ2VuZXJhdG9yLiAqL1xuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZVN0ZXAoc3RlcHMpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQocCAqIHN0ZXBzKSAqICgxIC8gc3RlcHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIEJlemllciBjdXJ2ZSBmdW5jdGlvbiBnZW5lcmF0b3IuIENvcHlyaWdodCBHYWV0YW4gUmVuYXVkZWF1LiBNSVQgTGljZW5zZTogaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NSVRfTGljZW5zZSAqL1xuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZUJlemllcihtWDEsIG1ZMSwgbVgyLCBtWTIpIHtcbiAgICAgICAgICAgIHZhciBORVdUT05fSVRFUkFUSU9OUyA9IDQsXG4gICAgICAgICAgICAgICAgTkVXVE9OX01JTl9TTE9QRSA9IDAuMDAxLFxuICAgICAgICAgICAgICAgIFNVQkRJVklTSU9OX1BSRUNJU0lPTiA9IDAuMDAwMDAwMSxcbiAgICAgICAgICAgICAgICBTVUJESVZJU0lPTl9NQVhfSVRFUkFUSU9OUyA9IDEwLFxuICAgICAgICAgICAgICAgIGtTcGxpbmVUYWJsZVNpemUgPSAxMSxcbiAgICAgICAgICAgICAgICBrU2FtcGxlU3RlcFNpemUgPSAxLjAgLyAoa1NwbGluZVRhYmxlU2l6ZSAtIDEuMCksXG4gICAgICAgICAgICAgICAgZmxvYXQzMkFycmF5U3VwcG9ydGVkID0gXCJGbG9hdDMyQXJyYXlcIiBpbiB3aW5kb3c7XG5cbiAgICAgICAgICAgIC8qIE11c3QgY29udGFpbiBmb3VyIGFyZ3VtZW50cy4gKi9cbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSA0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBBcmd1bWVudHMgbXVzdCBiZSBudW1iZXJzLiAqL1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1tpXSAhPT0gXCJudW1iZXJcIiB8fCBpc05hTihhcmd1bWVudHNbaV0pIHx8ICFpc0Zpbml0ZShhcmd1bWVudHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIFggdmFsdWVzIG11c3QgYmUgaW4gdGhlIFswLCAxXSByYW5nZS4gKi9cbiAgICAgICAgICAgIG1YMSA9IE1hdGgubWluKG1YMSwgMSk7XG4gICAgICAgICAgICBtWDIgPSBNYXRoLm1pbihtWDIsIDEpO1xuICAgICAgICAgICAgbVgxID0gTWF0aC5tYXgobVgxLCAwKTtcbiAgICAgICAgICAgIG1YMiA9IE1hdGgubWF4KG1YMiwgMCk7XG5cbiAgICAgICAgICAgIHZhciBtU2FtcGxlVmFsdWVzID0gZmxvYXQzMkFycmF5U3VwcG9ydGVkID8gbmV3IEZsb2F0MzJBcnJheShrU3BsaW5lVGFibGVTaXplKSA6IG5ldyBBcnJheShrU3BsaW5lVGFibGVTaXplKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gQShhQTEsIGFBMikge1xuICAgICAgICAgICAgICAgIHJldHVybiAxLjAgLSAzLjAgKiBhQTIgKyAzLjAgKiBhQTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBCKGFBMSwgYUEyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDMuMCAqIGFBMiAtIDYuMCAqIGFBMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIEMoYUExKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDMuMCAqIGFBMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gY2FsY0JlemllcihhVCwgYUExLCBhQTIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKChBKGFBMSwgYUEyKSAqIGFUICsgQihhQTEsIGFBMikpICogYVQgKyBDKGFBMSkpICogYVQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFNsb3BlKGFULCBhQTEsIGFBMikge1xuICAgICAgICAgICAgICAgIHJldHVybiAzLjAgKiBBKGFBMSwgYUEyKSAqIGFUICogYVQgKyAyLjAgKiBCKGFBMSwgYUEyKSAqIGFUICsgQyhhQTEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBuZXd0b25SYXBoc29uSXRlcmF0ZShhWCwgYUd1ZXNzVCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTkVXVE9OX0lURVJBVElPTlM7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudFNsb3BlID0gZ2V0U2xvcGUoYUd1ZXNzVCwgbVgxLCBtWDIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U2xvcGUgPT09IDAuMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFHdWVzc1Q7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudFggPSBjYWxjQmV6aWVyKGFHdWVzc1QsIG1YMSwgbVgyKSAtIGFYO1xuICAgICAgICAgICAgICAgICAgICBhR3Vlc3NUIC09IGN1cnJlbnRYIC8gY3VycmVudFNsb3BlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBhR3Vlc3NUO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBjYWxjU2FtcGxlVmFsdWVzKCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga1NwbGluZVRhYmxlU2l6ZTsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1TYW1wbGVWYWx1ZXNbaV0gPSBjYWxjQmV6aWVyKGkgKiBrU2FtcGxlU3RlcFNpemUsIG1YMSwgbVgyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGJpbmFyeVN1YmRpdmlkZShhWCwgYUEsIGFCKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRYLCBjdXJyZW50VCwgaSA9IDA7XG5cbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUID0gYUEgKyAoYUIgLSBhQSkgLyAyLjA7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRYID0gY2FsY0JlemllcihjdXJyZW50VCwgbVgxLCBtWDIpIC0gYVg7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50WCA+IDAuMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYUIgPSBjdXJyZW50VDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFBID0gY3VycmVudFQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IHdoaWxlIChNYXRoLmFicyhjdXJyZW50WCkgPiBTVUJESVZJU0lPTl9QUkVDSVNJT04gJiYgKytpIDwgU1VCRElWSVNJT05fTUFYX0lURVJBVElPTlMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRUO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRURm9yWChhWCkge1xuICAgICAgICAgICAgICAgIHZhciBpbnRlcnZhbFN0YXJ0ID0gMC4wLFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2FtcGxlID0gMSxcbiAgICAgICAgICAgICAgICAgICAgbGFzdFNhbXBsZSA9IGtTcGxpbmVUYWJsZVNpemUgLSAxO1xuXG4gICAgICAgICAgICAgICAgZm9yICg7IGN1cnJlbnRTYW1wbGUgIT09IGxhc3RTYW1wbGUgJiYgbVNhbXBsZVZhbHVlc1tjdXJyZW50U2FtcGxlXSA8PSBhWDsgKytjdXJyZW50U2FtcGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGludGVydmFsU3RhcnQgKz0ga1NhbXBsZVN0ZXBTaXplO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC0tY3VycmVudFNhbXBsZTtcblxuICAgICAgICAgICAgICAgIHZhciBkaXN0ID0gKGFYIC0gbVNhbXBsZVZhbHVlc1tjdXJyZW50U2FtcGxlXSkgLyAobVNhbXBsZVZhbHVlc1tjdXJyZW50U2FtcGxlICsgMV0gLSBtU2FtcGxlVmFsdWVzW2N1cnJlbnRTYW1wbGVdKSxcbiAgICAgICAgICAgICAgICAgICAgZ3Vlc3NGb3JUID0gaW50ZXJ2YWxTdGFydCArIGRpc3QgKiBrU2FtcGxlU3RlcFNpemUsXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxTbG9wZSA9IGdldFNsb3BlKGd1ZXNzRm9yVCwgbVgxLCBtWDIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGluaXRpYWxTbG9wZSA+PSBORVdUT05fTUlOX1NMT1BFKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXd0b25SYXBoc29uSXRlcmF0ZShhWCwgZ3Vlc3NGb3JUKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluaXRpYWxTbG9wZSA9PT0gMC4wKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBndWVzc0ZvclQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJpbmFyeVN1YmRpdmlkZShhWCwgaW50ZXJ2YWxTdGFydCwgaW50ZXJ2YWxTdGFydCArIGtTYW1wbGVTdGVwU2l6ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgX3ByZWNvbXB1dGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHByZWNvbXB1dGUoKSB7XG4gICAgICAgICAgICAgICAgX3ByZWNvbXB1dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAobVgxICE9PSBtWTEgfHwgbVgyICE9PSBtWTIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsY1NhbXBsZVZhbHVlcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGYgPSBmdW5jdGlvbihhWCkge1xuICAgICAgICAgICAgICAgIGlmICghX3ByZWNvbXB1dGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZWNvbXB1dGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG1YMSA9PT0gbVkxICYmIG1YMiA9PT0gbVkyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhWDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFYID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYVggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGNCZXppZXIoZ2V0VEZvclgoYVgpLCBtWTEsIG1ZMik7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmLmdldENvbnRyb2xQb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW3t4OiBtWDEsIHk6IG1ZMX0sIHt4OiBtWDIsIHk6IG1ZMn1dO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIHN0ciA9IFwiZ2VuZXJhdGVCZXppZXIoXCIgKyBbbVgxLCBtWTEsIG1YMiwgbVkyXSArIFwiKVwiO1xuICAgICAgICAgICAgZi50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gZjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIFJ1bmdlLUt1dHRhIHNwcmluZyBwaHlzaWNzIGZ1bmN0aW9uIGdlbmVyYXRvci4gQWRhcHRlZCBmcm9tIEZyYW1lci5qcywgY29weXJpZ2h0IEtvZW4gQm9rLiBNSVQgTGljZW5zZTogaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NSVRfTGljZW5zZSAqL1xuICAgICAgICAvKiBHaXZlbiBhIHRlbnNpb24sIGZyaWN0aW9uLCBhbmQgZHVyYXRpb24sIGEgc2ltdWxhdGlvbiBhdCA2MEZQUyB3aWxsIGZpcnN0IHJ1biB3aXRob3V0IGEgZGVmaW5lZCBkdXJhdGlvbiBpbiBvcmRlciB0byBjYWxjdWxhdGUgdGhlIGZ1bGwgcGF0aC4gQSBzZWNvbmQgcGFzc1xuICAgICAgICAgdGhlbiBhZGp1c3RzIHRoZSB0aW1lIGRlbHRhIC0tIHVzaW5nIHRoZSByZWxhdGlvbiBiZXR3ZWVuIGFjdHVhbCB0aW1lIGFuZCBkdXJhdGlvbiAtLSB0byBjYWxjdWxhdGUgdGhlIHBhdGggZm9yIHRoZSBkdXJhdGlvbi1jb25zdHJhaW5lZCBhbmltYXRpb24uICovXG4gICAgICAgIHZhciBnZW5lcmF0ZVNwcmluZ1JLNCA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNwcmluZ0FjY2VsZXJhdGlvbkZvclN0YXRlKHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICgtc3RhdGUudGVuc2lvbiAqIHN0YXRlLngpIC0gKHN0YXRlLmZyaWN0aW9uICogc3RhdGUudik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHNwcmluZ0V2YWx1YXRlU3RhdGVXaXRoRGVyaXZhdGl2ZShpbml0aWFsU3RhdGUsIGR0LCBkZXJpdmF0aXZlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICAgICAgICAgICAgICB4OiBpbml0aWFsU3RhdGUueCArIGRlcml2YXRpdmUuZHggKiBkdCxcbiAgICAgICAgICAgICAgICAgICAgdjogaW5pdGlhbFN0YXRlLnYgKyBkZXJpdmF0aXZlLmR2ICogZHQsXG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb246IGluaXRpYWxTdGF0ZS50ZW5zaW9uLFxuICAgICAgICAgICAgICAgICAgICBmcmljdGlvbjogaW5pdGlhbFN0YXRlLmZyaWN0aW9uXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7ZHg6IHN0YXRlLnYsIGR2OiBzcHJpbmdBY2NlbGVyYXRpb25Gb3JTdGF0ZShzdGF0ZSl9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBzcHJpbmdJbnRlZ3JhdGVTdGF0ZShzdGF0ZSwgZHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgYSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR4OiBzdGF0ZS52LFxuICAgICAgICAgICAgICAgICAgICAgICAgZHY6IHNwcmluZ0FjY2VsZXJhdGlvbkZvclN0YXRlKHN0YXRlKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBiID0gc3ByaW5nRXZhbHVhdGVTdGF0ZVdpdGhEZXJpdmF0aXZlKHN0YXRlLCBkdCAqIDAuNSwgYSksXG4gICAgICAgICAgICAgICAgICAgIGMgPSBzcHJpbmdFdmFsdWF0ZVN0YXRlV2l0aERlcml2YXRpdmUoc3RhdGUsIGR0ICogMC41LCBiKSxcbiAgICAgICAgICAgICAgICAgICAgZCA9IHNwcmluZ0V2YWx1YXRlU3RhdGVXaXRoRGVyaXZhdGl2ZShzdGF0ZSwgZHQsIGMpLFxuICAgICAgICAgICAgICAgICAgICBkeGR0ID0gMS4wIC8gNi4wICogKGEuZHggKyAyLjAgKiAoYi5keCArIGMuZHgpICsgZC5keCksXG4gICAgICAgICAgICAgICAgICAgIGR2ZHQgPSAxLjAgLyA2LjAgKiAoYS5kdiArIDIuMCAqIChiLmR2ICsgYy5kdikgKyBkLmR2KTtcblxuICAgICAgICAgICAgICAgIHN0YXRlLnggPSBzdGF0ZS54ICsgZHhkdCAqIGR0O1xuICAgICAgICAgICAgICAgIHN0YXRlLnYgPSBzdGF0ZS52ICsgZHZkdCAqIGR0O1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gc3ByaW5nUks0RmFjdG9yeSh0ZW5zaW9uLCBmcmljdGlvbiwgZHVyYXRpb24pIHtcblxuICAgICAgICAgICAgICAgIHZhciBpbml0U3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4OiAtMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHY6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgZnJpY3Rpb246IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aCA9IFswXSxcbiAgICAgICAgICAgICAgICAgICAgdGltZV9sYXBzZWQgPSAwLFxuICAgICAgICAgICAgICAgICAgICB0b2xlcmFuY2UgPSAxIC8gMTAwMDAsXG4gICAgICAgICAgICAgICAgICAgIERUID0gMTYgLyAxMDAwLFxuICAgICAgICAgICAgICAgICAgICBoYXZlX2R1cmF0aW9uLCBkdCwgbGFzdF9zdGF0ZTtcblxuICAgICAgICAgICAgICAgIHRlbnNpb24gPSBwYXJzZUZsb2F0KHRlbnNpb24pIHx8IDUwMDtcbiAgICAgICAgICAgICAgICBmcmljdGlvbiA9IHBhcnNlRmxvYXQoZnJpY3Rpb24pIHx8IDIwO1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uID0gZHVyYXRpb24gfHwgbnVsbDtcblxuICAgICAgICAgICAgICAgIGluaXRTdGF0ZS50ZW5zaW9uID0gdGVuc2lvbjtcbiAgICAgICAgICAgICAgICBpbml0U3RhdGUuZnJpY3Rpb24gPSBmcmljdGlvbjtcblxuICAgICAgICAgICAgICAgIGhhdmVfZHVyYXRpb24gPSBkdXJhdGlvbiAhPT0gbnVsbDtcblxuICAgICAgICAgICAgICAgIC8qIENhbGN1bGF0ZSB0aGUgYWN0dWFsIHRpbWUgaXQgdGFrZXMgZm9yIHRoaXMgYW5pbWF0aW9uIHRvIGNvbXBsZXRlIHdpdGggdGhlIHByb3ZpZGVkIGNvbmRpdGlvbnMuICovXG4gICAgICAgICAgICAgICAgaWYgKGhhdmVfZHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUnVuIHRoZSBzaW11bGF0aW9uIHdpdGhvdXQgYSBkdXJhdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgdGltZV9sYXBzZWQgPSBzcHJpbmdSSzRGYWN0b3J5KHRlbnNpb24sIGZyaWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgLyogQ29tcHV0ZSB0aGUgYWRqdXN0ZWQgdGltZSBkZWx0YS4gKi9cbiAgICAgICAgICAgICAgICAgICAgZHQgPSB0aW1lX2xhcHNlZCAvIGR1cmF0aW9uICogRFQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZHQgPSBEVDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAvKiBOZXh0L3N0ZXAgZnVuY3Rpb24gLiovXG4gICAgICAgICAgICAgICAgICAgIGxhc3Rfc3RhdGUgPSBzcHJpbmdJbnRlZ3JhdGVTdGF0ZShsYXN0X3N0YXRlIHx8IGluaXRTdGF0ZSwgZHQpO1xuICAgICAgICAgICAgICAgICAgICAvKiBTdG9yZSB0aGUgcG9zaXRpb24uICovXG4gICAgICAgICAgICAgICAgICAgIHBhdGgucHVzaCgxICsgbGFzdF9zdGF0ZS54KTtcbiAgICAgICAgICAgICAgICAgICAgdGltZV9sYXBzZWQgKz0gMTY7XG4gICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBjaGFuZ2UgdGhyZXNob2xkIGlzIHJlYWNoZWQsIGJyZWFrLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoIShNYXRoLmFicyhsYXN0X3N0YXRlLngpID4gdG9sZXJhbmNlICYmIE1hdGguYWJzKGxhc3Rfc3RhdGUudikgPiB0b2xlcmFuY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qIElmIGR1cmF0aW9uIGlzIG5vdCBkZWZpbmVkLCByZXR1cm4gdGhlIGFjdHVhbCB0aW1lIHJlcXVpcmVkIGZvciBjb21wbGV0aW5nIHRoaXMgYW5pbWF0aW9uLiBPdGhlcndpc2UsIHJldHVybiBhIGNsb3N1cmUgdGhhdCBob2xkcyB0aGVcbiAgICAgICAgICAgICAgICAgY29tcHV0ZWQgcGF0aCBhbmQgcmV0dXJucyBhIHNuYXBzaG90IG9mIHRoZSBwb3NpdGlvbiBhY2NvcmRpbmcgdG8gYSBnaXZlbiBwZXJjZW50Q29tcGxldGUuICovXG4gICAgICAgICAgICAgICAgcmV0dXJuICFoYXZlX2R1cmF0aW9uID8gdGltZV9sYXBzZWQgOiBmdW5jdGlvbihwZXJjZW50Q29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGhbIChwZXJjZW50Q29tcGxldGUgKiAocGF0aC5sZW5ndGggLSAxKSkgfCAwIF07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0oKSk7XG5cbiAgICAgICAgLyogalF1ZXJ5IGVhc2luZ3MuICovXG4gICAgICAgIFZlbG9jaXR5LkVhc2luZ3MgPSB7XG4gICAgICAgICAgICBsaW5lYXI6IGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzd2luZzogZnVuY3Rpb24ocCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAwLjUgLSBNYXRoLmNvcyhwICogTWF0aC5QSSkgLyAyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qIEJvbnVzIFwic3ByaW5nXCIgZWFzaW5nLCB3aGljaCBpcyBhIGxlc3MgZXhhZ2dlcmF0ZWQgdmVyc2lvbiBvZiBlYXNlSW5PdXRFbGFzdGljLiAqL1xuICAgICAgICAgICAgc3ByaW5nOiBmdW5jdGlvbihwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDEgLSAoTWF0aC5jb3MocCAqIDQuNSAqIE1hdGguUEkpICogTWF0aC5leHAoLXAgKiA2KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogQ1NTMyBhbmQgUm9iZXJ0IFBlbm5lciBlYXNpbmdzLiAqL1xuICAgICAgICAkLmVhY2goXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgW1wiZWFzZVwiLCBbMC4yNSwgMC4xLCAwLjI1LCAxLjBdXSxcbiAgICAgICAgICAgICAgICBbXCJlYXNlLWluXCIsIFswLjQyLCAwLjAsIDEuMDAsIDEuMF1dLFxuICAgICAgICAgICAgICAgIFtcImVhc2Utb3V0XCIsIFswLjAwLCAwLjAsIDAuNTgsIDEuMF1dLFxuICAgICAgICAgICAgICAgIFtcImVhc2UtaW4tb3V0XCIsIFswLjQyLCAwLjAsIDAuNTgsIDEuMF1dLFxuICAgICAgICAgICAgICAgIFtcImVhc2VJblNpbmVcIiwgWzAuNDcsIDAsIDAuNzQ1LCAwLjcxNV1dLFxuICAgICAgICAgICAgICAgIFtcImVhc2VPdXRTaW5lXCIsIFswLjM5LCAwLjU3NSwgMC41NjUsIDFdXSxcbiAgICAgICAgICAgICAgICBbXCJlYXNlSW5PdXRTaW5lXCIsIFswLjQ0NSwgMC4wNSwgMC41NSwgMC45NV1dLFxuICAgICAgICAgICAgICAgIFtcImVhc2VJblF1YWRcIiwgWzAuNTUsIDAuMDg1LCAwLjY4LCAwLjUzXV0sXG4gICAgICAgICAgICAgICAgW1wiZWFzZU91dFF1YWRcIiwgWzAuMjUsIDAuNDYsIDAuNDUsIDAuOTRdXSxcbiAgICAgICAgICAgICAgICBbXCJlYXNlSW5PdXRRdWFkXCIsIFswLjQ1NSwgMC4wMywgMC41MTUsIDAuOTU1XV0sXG4gICAgICAgICAgICAgICAgW1wiZWFzZUluQ3ViaWNcIiwgWzAuNTUsIDAuMDU1LCAwLjY3NSwgMC4xOV1dLFxuICAgICAgICAgICAgICAgIFtcImVhc2VPdXRDdWJpY1wiLCBbMC4yMTUsIDAuNjEsIDAuMzU1LCAxXV0sXG4gICAgICAgICAgICAgICAgW1wiZWFzZUluT3V0Q3ViaWNcIiwgWzAuNjQ1LCAwLjA0NSwgMC4zNTUsIDFdXSxcbiAgICAgICAgICAgICAgICBbXCJlYXNlSW5RdWFydFwiLCBbMC44OTUsIDAuMDMsIDAuNjg1LCAwLjIyXV0sXG4gICAgICAgICAgICAgICAgW1wiZWFzZU91dFF1YXJ0XCIsIFswLjE2NSwgMC44NCwgMC40NCwgMV1dLFxuICAgICAgICAgICAgICAgIFtcImVhc2VJbk91dFF1YXJ0XCIsIFswLjc3LCAwLCAwLjE3NSwgMV1dLFxuICAgICAgICAgICAgICAgIFtcImVhc2VJblF1aW50XCIsIFswLjc1NSwgMC4wNSwgMC44NTUsIDAuMDZdXSxcbiAgICAgICAgICAgICAgICBbXCJlYXNlT3V0UXVpbnRcIiwgWzAuMjMsIDEsIDAuMzIsIDFdXSxcbiAgICAgICAgICAgICAgICBbXCJlYXNlSW5PdXRRdWludFwiLCBbMC44NiwgMCwgMC4wNywgMV1dLFxuICAgICAgICAgICAgICAgIFtcImVhc2VJbkV4cG9cIiwgWzAuOTUsIDAuMDUsIDAuNzk1LCAwLjAzNV1dLFxuICAgICAgICAgICAgICAgIFtcImVhc2VPdXRFeHBvXCIsIFswLjE5LCAxLCAwLjIyLCAxXV0sXG4gICAgICAgICAgICAgICAgW1wiZWFzZUluT3V0RXhwb1wiLCBbMSwgMCwgMCwgMV1dLFxuICAgICAgICAgICAgICAgIFtcImVhc2VJbkNpcmNcIiwgWzAuNiwgMC4wNCwgMC45OCwgMC4zMzVdXSxcbiAgICAgICAgICAgICAgICBbXCJlYXNlT3V0Q2lyY1wiLCBbMC4wNzUsIDAuODIsIDAuMTY1LCAxXV0sXG4gICAgICAgICAgICAgICAgW1wiZWFzZUluT3V0Q2lyY1wiLCBbMC43ODUsIDAuMTM1LCAwLjE1LCAwLjg2XV1cbiAgICAgICAgICAgIF0sIGZ1bmN0aW9uKGksIGVhc2luZ0FycmF5KSB7XG4gICAgICAgICAgICAgICAgVmVsb2NpdHkuRWFzaW5nc1tlYXNpbmdBcnJheVswXV0gPSBnZW5lcmF0ZUJlemllci5hcHBseShudWxsLCBlYXNpbmdBcnJheVsxXSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAvKiBEZXRlcm1pbmUgdGhlIGFwcHJvcHJpYXRlIGVhc2luZyB0eXBlIGdpdmVuIGFuIGVhc2luZyBpbnB1dC4gKi9cbiAgICAgICAgZnVuY3Rpb24gZ2V0RWFzaW5nKHZhbHVlLCBkdXJhdGlvbikge1xuICAgICAgICAgICAgdmFyIGVhc2luZyA9IHZhbHVlO1xuXG4gICAgICAgICAgICAvKiBUaGUgZWFzaW5nIG9wdGlvbiBjYW4gZWl0aGVyIGJlIGEgc3RyaW5nIHRoYXQgcmVmZXJlbmNlcyBhIHByZS1yZWdpc3RlcmVkIGVhc2luZyxcbiAgICAgICAgICAgICBvciBpdCBjYW4gYmUgYSB0d28tL2ZvdXItaXRlbSBhcnJheSBvZiBpbnRlZ2VycyB0byBiZSBjb252ZXJ0ZWQgaW50byBhIGJlemllci9zcHJpbmcgZnVuY3Rpb24uICovXG4gICAgICAgICAgICBpZiAoVHlwZS5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAvKiBFbnN1cmUgdGhhdCB0aGUgZWFzaW5nIGhhcyBiZWVuIGFzc2lnbmVkIHRvIGpRdWVyeSdzIFZlbG9jaXR5LkVhc2luZ3Mgb2JqZWN0LiAqL1xuICAgICAgICAgICAgICAgIGlmICghVmVsb2NpdHkuRWFzaW5nc1t2YWx1ZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgZWFzaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChUeXBlLmlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGVhc2luZyA9IGdlbmVyYXRlU3RlcC5hcHBseShudWxsLCB2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFR5cGUuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgLyogc3ByaW5nUks0IG11c3QgYmUgcGFzc2VkIHRoZSBhbmltYXRpb24ncyBkdXJhdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAvKiBOb3RlOiBJZiB0aGUgc3ByaW5nUks0IGFycmF5IGNvbnRhaW5zIG5vbi1udW1iZXJzLCBnZW5lcmF0ZVNwcmluZ1JLNCgpIHJldHVybnMgYW4gZWFzaW5nXG4gICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlZCB3aXRoIGRlZmF1bHQgdGVuc2lvbiBhbmQgZnJpY3Rpb24gdmFsdWVzLiAqL1xuICAgICAgICAgICAgICAgIGVhc2luZyA9IGdlbmVyYXRlU3ByaW5nUks0LmFwcGx5KG51bGwsIHZhbHVlLmNvbmNhdChbZHVyYXRpb25dKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFR5cGUuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSA0KSB7XG4gICAgICAgICAgICAgICAgLyogTm90ZTogSWYgdGhlIGJlemllciBhcnJheSBjb250YWlucyBub24tbnVtYmVycywgZ2VuZXJhdGVCZXppZXIoKSByZXR1cm5zIGZhbHNlLiAqL1xuICAgICAgICAgICAgICAgIGVhc2luZyA9IGdlbmVyYXRlQmV6aWVyLmFwcGx5KG51bGwsIHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWFzaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIFJldmVydCB0byB0aGUgVmVsb2NpdHktd2lkZSBkZWZhdWx0IGVhc2luZyB0eXBlLCBvciBmYWxsIGJhY2sgdG8gXCJzd2luZ1wiICh3aGljaCBpcyBhbHNvIGpRdWVyeSdzIGRlZmF1bHQpXG4gICAgICAgICAgICAgaWYgdGhlIFZlbG9jaXR5LXdpZGUgZGVmYXVsdCBoYXMgYmVlbiBpbmNvcnJlY3RseSBtb2RpZmllZC4gKi9cbiAgICAgICAgICAgIGlmIChlYXNpbmcgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKFZlbG9jaXR5LkVhc2luZ3NbVmVsb2NpdHkuZGVmYXVsdHMuZWFzaW5nXSkge1xuICAgICAgICAgICAgICAgICAgICBlYXNpbmcgPSBWZWxvY2l0eS5kZWZhdWx0cy5lYXNpbmc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZWFzaW5nID0gRUFTSU5HX0RFRkFVTFQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZWFzaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqKioqKioqKioqKioqKioqXG4gICAgICAgICBDU1MgU3RhY2tcbiAgICAgICAgICoqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIC8qIFRoZSBDU1Mgb2JqZWN0IGlzIGEgaGlnaGx5IGNvbmRlbnNlZCBhbmQgcGVyZm9ybWFudCBDU1Mgc3RhY2sgdGhhdCBmdWxseSByZXBsYWNlcyBqUXVlcnkncy5cbiAgICAgICAgIEl0IGhhbmRsZXMgdGhlIHZhbGlkYXRpb24sIGdldHRpbmcsIGFuZCBzZXR0aW5nIG9mIGJvdGggc3RhbmRhcmQgQ1NTIHByb3BlcnRpZXMgYW5kIENTUyBwcm9wZXJ0eSBob29rcy4gKi9cbiAgICAgICAgLyogTm90ZTogQSBcIkNTU1wiIHNob3J0aGFuZCBpcyBhbGlhc2VkIHNvIHRoYXQgb3VyIGNvZGUgaXMgZWFzaWVyIHRvIHJlYWQuICovXG4gICAgICAgIHZhciBDU1MgPSBWZWxvY2l0eS5DU1MgPSB7XG4gICAgICAgICAgICAvKioqKioqKioqKioqKlxuICAgICAgICAgICAgIFJlZ0V4XG4gICAgICAgICAgICAgKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgUmVnRXg6IHtcbiAgICAgICAgICAgICAgICBpc0hleDogL14jKFtBLWZcXGRdezN9KXsxLDJ9JC9pLFxuICAgICAgICAgICAgICAgIC8qIFVud3JhcCBhIHByb3BlcnR5IHZhbHVlJ3Mgc3Vycm91bmRpbmcgdGV4dCwgZS5nLiBcInJnYmEoNCwgMywgMiwgMSlcIiA9PT4gXCI0LCAzLCAyLCAxXCIgYW5kIFwicmVjdCg0cHggM3B4IDJweCAxcHgpXCIgPT0+IFwiNHB4IDNweCAycHggMXB4XCIuICovXG4gICAgICAgICAgICAgICAgdmFsdWVVbndyYXA6IC9eW0Etel0rXFwoKC4qKVxcKSQvaSxcbiAgICAgICAgICAgICAgICB3cmFwcGVkVmFsdWVBbHJlYWR5RXh0cmFjdGVkOiAvWzAtOS5dKyBbMC05Ll0rIFswLTkuXSsoIFswLTkuXSspPy8sXG4gICAgICAgICAgICAgICAgLyogU3BsaXQgYSBtdWx0aS12YWx1ZSBwcm9wZXJ0eSBpbnRvIGFuIGFycmF5IG9mIHN1YnZhbHVlcywgZS5nLiBcInJnYmEoNCwgMywgMiwgMSkgNHB4IDNweCAycHggMXB4XCIgPT0+IFsgXCJyZ2JhKDQsIDMsIDIsIDEpXCIsIFwiNHB4XCIsIFwiM3B4XCIsIFwiMnB4XCIsIFwiMXB4XCIgXS4gKi9cbiAgICAgICAgICAgICAgICB2YWx1ZVNwbGl0OiAvKFtBLXpdK1xcKC4rXFwpKXwoKFtBLXowLTkjLS5dKz8pKD89XFxzfCQpKS9pZ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKioqKioqKioqKipcbiAgICAgICAgICAgICBMaXN0c1xuICAgICAgICAgICAgICoqKioqKioqKioqKi9cblxuICAgICAgICAgICAgTGlzdHM6IHtcbiAgICAgICAgICAgICAgICBjb2xvcnM6IFtcImZpbGxcIiwgXCJzdHJva2VcIiwgXCJzdG9wQ29sb3JcIiwgXCJjb2xvclwiLCBcImJhY2tncm91bmRDb2xvclwiLCBcImJvcmRlckNvbG9yXCIsIFwiYm9yZGVyVG9wQ29sb3JcIiwgXCJib3JkZXJSaWdodENvbG9yXCIsIFwiYm9yZGVyQm90dG9tQ29sb3JcIiwgXCJib3JkZXJMZWZ0Q29sb3JcIiwgXCJvdXRsaW5lQ29sb3JcIl0sXG4gICAgICAgICAgICAgICAgdHJhbnNmb3Jtc0Jhc2U6IFtcInRyYW5zbGF0ZVhcIiwgXCJ0cmFuc2xhdGVZXCIsIFwic2NhbGVcIiwgXCJzY2FsZVhcIiwgXCJzY2FsZVlcIiwgXCJza2V3WFwiLCBcInNrZXdZXCIsIFwicm90YXRlWlwiXSxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1zM0Q6IFtcInRyYW5zZm9ybVBlcnNwZWN0aXZlXCIsIFwidHJhbnNsYXRlWlwiLCBcInNjYWxlWlwiLCBcInJvdGF0ZVhcIiwgXCJyb3RhdGVZXCJdLFxuICAgICAgICAgICAgICAgIHVuaXRzOiBbXG4gICAgICAgICAgICAgICAgICAgIFwiJVwiLCAvLyByZWxhdGl2ZVxuICAgICAgICAgICAgICAgICAgICBcImVtXCIsIFwiZXhcIiwgXCJjaFwiLCBcInJlbVwiLCAvLyBmb250IHJlbGF0aXZlXG4gICAgICAgICAgICAgICAgICAgIFwidndcIiwgXCJ2aFwiLCBcInZtaW5cIiwgXCJ2bWF4XCIsIC8vIHZpZXdwb3J0IHJlbGF0aXZlXG4gICAgICAgICAgICAgICAgICAgIFwiY21cIiwgXCJtbVwiLCBcIlFcIiwgXCJpblwiLCBcInBjXCIsIFwicHRcIiwgXCJweFwiLCAvLyBhYnNvbHV0ZSBsZW5ndGhzXG4gICAgICAgICAgICAgICAgICAgIFwiZGVnXCIsIFwiZ3JhZFwiLCBcInJhZFwiLCBcInR1cm5cIiwgLy8gYW5nbGVzXG4gICAgICAgICAgICAgICAgICAgIFwic1wiLCBcIm1zXCIgLy8gdGltZVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgY29sb3JOYW1lczoge1xuICAgICAgICAgICAgICAgICAgICBcImFsaWNlYmx1ZVwiOiBcIjI0MCwyNDgsMjU1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYW50aXF1ZXdoaXRlXCI6IFwiMjUwLDIzNSwyMTVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhcXVhbWFyaW5lXCI6IFwiMTI3LDI1NSwyMTJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhcXVhXCI6IFwiMCwyNTUsMjU1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYXp1cmVcIjogXCIyNDAsMjU1LDI1NVwiLFxuICAgICAgICAgICAgICAgICAgICBcImJlaWdlXCI6IFwiMjQ1LDI0NSwyMjBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJiaXNxdWVcIjogXCIyNTUsMjI4LDE5NlwiLFxuICAgICAgICAgICAgICAgICAgICBcImJsYWNrXCI6IFwiMCwwLDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJibGFuY2hlZGFsbW9uZFwiOiBcIjI1NSwyMzUsMjA1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYmx1ZXZpb2xldFwiOiBcIjEzOCw0MywyMjZcIixcbiAgICAgICAgICAgICAgICAgICAgXCJibHVlXCI6IFwiMCwwLDI1NVwiLFxuICAgICAgICAgICAgICAgICAgICBcImJyb3duXCI6IFwiMTY1LDQyLDQyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYnVybHl3b29kXCI6IFwiMjIyLDE4NCwxMzVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjYWRldGJsdWVcIjogXCI5NSwxNTgsMTYwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY2hhcnRyZXVzZVwiOiBcIjEyNywyNTUsMFwiLFxuICAgICAgICAgICAgICAgICAgICBcImNob2NvbGF0ZVwiOiBcIjIxMCwxMDUsMzBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjb3JhbFwiOiBcIjI1NSwxMjcsODBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjb3JuZmxvd2VyYmx1ZVwiOiBcIjEwMCwxNDksMjM3XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY29ybnNpbGtcIjogXCIyNTUsMjQ4LDIyMFwiLFxuICAgICAgICAgICAgICAgICAgICBcImNyaW1zb25cIjogXCIyMjAsMjAsNjBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjeWFuXCI6IFwiMCwyNTUsMjU1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGFya2JsdWVcIjogXCIwLDAsMTM5XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGFya2N5YW5cIjogXCIwLDEzOSwxMzlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkYXJrZ29sZGVucm9kXCI6IFwiMTg0LDEzNCwxMVwiLFxuICAgICAgICAgICAgICAgICAgICBcImRhcmtncmF5XCI6IFwiMTY5LDE2OSwxNjlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkYXJrZ3JleVwiOiBcIjE2OSwxNjksMTY5XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGFya2dyZWVuXCI6IFwiMCwxMDAsMFwiLFxuICAgICAgICAgICAgICAgICAgICBcImRhcmtraGFraVwiOiBcIjE4OSwxODMsMTA3XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGFya21hZ2VudGFcIjogXCIxMzksMCwxMzlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkYXJrb2xpdmVncmVlblwiOiBcIjg1LDEwNyw0N1wiLFxuICAgICAgICAgICAgICAgICAgICBcImRhcmtvcmFuZ2VcIjogXCIyNTUsMTQwLDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkYXJrb3JjaGlkXCI6IFwiMTUzLDUwLDIwNFwiLFxuICAgICAgICAgICAgICAgICAgICBcImRhcmtyZWRcIjogXCIxMzksMCwwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGFya3NhbG1vblwiOiBcIjIzMywxNTAsMTIyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGFya3NlYWdyZWVuXCI6IFwiMTQzLDE4OCwxNDNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkYXJrc2xhdGVibHVlXCI6IFwiNzIsNjEsMTM5XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGFya3NsYXRlZ3JheVwiOiBcIjQ3LDc5LDc5XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGFya3R1cnF1b2lzZVwiOiBcIjAsMjA2LDIwOVwiLFxuICAgICAgICAgICAgICAgICAgICBcImRhcmt2aW9sZXRcIjogXCIxNDgsMCwyMTFcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkZWVwcGlua1wiOiBcIjI1NSwyMCwxNDdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkZWVwc2t5Ymx1ZVwiOiBcIjAsMTkxLDI1NVwiLFxuICAgICAgICAgICAgICAgICAgICBcImRpbWdyYXlcIjogXCIxMDUsMTA1LDEwNVwiLFxuICAgICAgICAgICAgICAgICAgICBcImRpbWdyZXlcIjogXCIxMDUsMTA1LDEwNVwiLFxuICAgICAgICAgICAgICAgICAgICBcImRvZGdlcmJsdWVcIjogXCIzMCwxNDQsMjU1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZmlyZWJyaWNrXCI6IFwiMTc4LDM0LDM0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZmxvcmFsd2hpdGVcIjogXCIyNTUsMjUwLDI0MFwiLFxuICAgICAgICAgICAgICAgICAgICBcImZvcmVzdGdyZWVuXCI6IFwiMzQsMTM5LDM0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZnVjaHNpYVwiOiBcIjI1NSwwLDI1NVwiLFxuICAgICAgICAgICAgICAgICAgICBcImdhaW5zYm9yb1wiOiBcIjIyMCwyMjAsMjIwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZ2hvc3R3aGl0ZVwiOiBcIjI0OCwyNDgsMjU1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZ29sZFwiOiBcIjI1NSwyMTUsMFwiLFxuICAgICAgICAgICAgICAgICAgICBcImdvbGRlbnJvZFwiOiBcIjIxOCwxNjUsMzJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJncmF5XCI6IFwiMTI4LDEyOCwxMjhcIixcbiAgICAgICAgICAgICAgICAgICAgXCJncmV5XCI6IFwiMTI4LDEyOCwxMjhcIixcbiAgICAgICAgICAgICAgICAgICAgXCJncmVlbnllbGxvd1wiOiBcIjE3MywyNTUsNDdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJncmVlblwiOiBcIjAsMTI4LDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJob25leWRld1wiOiBcIjI0MCwyNTUsMjQwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaG90cGlua1wiOiBcIjI1NSwxMDUsMTgwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaW5kaWFucmVkXCI6IFwiMjA1LDkyLDkyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaW5kaWdvXCI6IFwiNzUsMCwxMzBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpdm9yeVwiOiBcIjI1NSwyNTUsMjQwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwia2hha2lcIjogXCIyNDAsMjMwLDE0MFwiLFxuICAgICAgICAgICAgICAgICAgICBcImxhdmVuZGVyYmx1c2hcIjogXCIyNTUsMjQwLDI0NVwiLFxuICAgICAgICAgICAgICAgICAgICBcImxhdmVuZGVyXCI6IFwiMjMwLDIzMCwyNTBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYXduZ3JlZW5cIjogXCIxMjQsMjUyLDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsZW1vbmNoaWZmb25cIjogXCIyNTUsMjUwLDIwNVwiLFxuICAgICAgICAgICAgICAgICAgICBcImxpZ2h0Ymx1ZVwiOiBcIjE3MywyMTYsMjMwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGlnaHRjb3JhbFwiOiBcIjI0MCwxMjgsMTI4XCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGlnaHRjeWFuXCI6IFwiMjI0LDI1NSwyNTVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsaWdodGdvbGRlbnJvZHllbGxvd1wiOiBcIjI1MCwyNTAsMjEwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGlnaHRncmF5XCI6IFwiMjExLDIxMSwyMTFcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsaWdodGdyZXlcIjogXCIyMTEsMjExLDIxMVwiLFxuICAgICAgICAgICAgICAgICAgICBcImxpZ2h0Z3JlZW5cIjogXCIxNDQsMjM4LDE0NFwiLFxuICAgICAgICAgICAgICAgICAgICBcImxpZ2h0cGlua1wiOiBcIjI1NSwxODIsMTkzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGlnaHRzYWxtb25cIjogXCIyNTUsMTYwLDEyMlwiLFxuICAgICAgICAgICAgICAgICAgICBcImxpZ2h0c2VhZ3JlZW5cIjogXCIzMiwxNzgsMTcwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGlnaHRza3libHVlXCI6IFwiMTM1LDIwNiwyNTBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsaWdodHNsYXRlZ3JheVwiOiBcIjExOSwxMzYsMTUzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGlnaHRzdGVlbGJsdWVcIjogXCIxNzYsMTk2LDIyMlwiLFxuICAgICAgICAgICAgICAgICAgICBcImxpZ2h0eWVsbG93XCI6IFwiMjU1LDI1NSwyMjRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsaW1lZ3JlZW5cIjogXCI1MCwyMDUsNTBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsaW1lXCI6IFwiMCwyNTUsMFwiLFxuICAgICAgICAgICAgICAgICAgICBcImxpbmVuXCI6IFwiMjUwLDI0MCwyMzBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtYWdlbnRhXCI6IFwiMjU1LDAsMjU1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWFyb29uXCI6IFwiMTI4LDAsMFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm1lZGl1bWFxdWFtYXJpbmVcIjogXCIxMDIsMjA1LDE3MFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm1lZGl1bWJsdWVcIjogXCIwLDAsMjA1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWVkaXVtb3JjaGlkXCI6IFwiMTg2LDg1LDIxMVwiLFxuICAgICAgICAgICAgICAgICAgICBcIm1lZGl1bXB1cnBsZVwiOiBcIjE0NywxMTIsMjE5XCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWVkaXVtc2VhZ3JlZW5cIjogXCI2MCwxNzksMTEzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWVkaXVtc2xhdGVibHVlXCI6IFwiMTIzLDEwNCwyMzhcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtZWRpdW1zcHJpbmdncmVlblwiOiBcIjAsMjUwLDE1NFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm1lZGl1bXR1cnF1b2lzZVwiOiBcIjcyLDIwOSwyMDRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtZWRpdW12aW9sZXRyZWRcIjogXCIxOTksMjEsMTMzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWlkbmlnaHRibHVlXCI6IFwiMjUsMjUsMTEyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWludGNyZWFtXCI6IFwiMjQ1LDI1NSwyNTBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtaXN0eXJvc2VcIjogXCIyNTUsMjI4LDIyNVwiLFxuICAgICAgICAgICAgICAgICAgICBcIm1vY2Nhc2luXCI6IFwiMjU1LDIyOCwxODFcIixcbiAgICAgICAgICAgICAgICAgICAgXCJuYXZham93aGl0ZVwiOiBcIjI1NSwyMjIsMTczXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibmF2eVwiOiBcIjAsMCwxMjhcIixcbiAgICAgICAgICAgICAgICAgICAgXCJvbGRsYWNlXCI6IFwiMjUzLDI0NSwyMzBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJvbGl2ZWRyYWJcIjogXCIxMDcsMTQyLDM1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwib2xpdmVcIjogXCIxMjgsMTI4LDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJvcmFuZ2VyZWRcIjogXCIyNTUsNjksMFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm9yYW5nZVwiOiBcIjI1NSwxNjUsMFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm9yY2hpZFwiOiBcIjIxOCwxMTIsMjE0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGFsZWdvbGRlbnJvZFwiOiBcIjIzOCwyMzIsMTcwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGFsZWdyZWVuXCI6IFwiMTUyLDI1MSwxNTJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwYWxldHVycXVvaXNlXCI6IFwiMTc1LDIzOCwyMzhcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwYWxldmlvbGV0cmVkXCI6IFwiMjE5LDExMiwxNDdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwYXBheWF3aGlwXCI6IFwiMjU1LDIzOSwyMTNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwZWFjaHB1ZmZcIjogXCIyNTUsMjE4LDE4NVwiLFxuICAgICAgICAgICAgICAgICAgICBcInBlcnVcIjogXCIyMDUsMTMzLDYzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGlua1wiOiBcIjI1NSwxOTIsMjAzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGx1bVwiOiBcIjIyMSwxNjAsMjIxXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicG93ZGVyYmx1ZVwiOiBcIjE3NiwyMjQsMjMwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicHVycGxlXCI6IFwiMTI4LDAsMTI4XCIsXG4gICAgICAgICAgICAgICAgICAgIFwicmVkXCI6IFwiMjU1LDAsMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInJvc3licm93blwiOiBcIjE4OCwxNDMsMTQzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicm95YWxibHVlXCI6IFwiNjUsMTA1LDIyNVwiLFxuICAgICAgICAgICAgICAgICAgICBcInNhZGRsZWJyb3duXCI6IFwiMTM5LDY5LDE5XCIsXG4gICAgICAgICAgICAgICAgICAgIFwic2FsbW9uXCI6IFwiMjUwLDEyOCwxMTRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzYW5keWJyb3duXCI6IFwiMjQ0LDE2NCw5NlwiLFxuICAgICAgICAgICAgICAgICAgICBcInNlYWdyZWVuXCI6IFwiNDYsMTM5LDg3XCIsXG4gICAgICAgICAgICAgICAgICAgIFwic2Vhc2hlbGxcIjogXCIyNTUsMjQ1LDIzOFwiLFxuICAgICAgICAgICAgICAgICAgICBcInNpZW5uYVwiOiBcIjE2MCw4Miw0NVwiLFxuICAgICAgICAgICAgICAgICAgICBcInNpbHZlclwiOiBcIjE5MiwxOTIsMTkyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic2t5Ymx1ZVwiOiBcIjEzNSwyMDYsMjM1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwic2xhdGVibHVlXCI6IFwiMTA2LDkwLDIwNVwiLFxuICAgICAgICAgICAgICAgICAgICBcInNsYXRlZ3JheVwiOiBcIjExMiwxMjgsMTQ0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwic25vd1wiOiBcIjI1NSwyNTAsMjUwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3ByaW5nZ3JlZW5cIjogXCIwLDI1NSwxMjdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdGVlbGJsdWVcIjogXCI3MCwxMzAsMTgwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGFuXCI6IFwiMjEwLDE4MCwxNDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZWFsXCI6IFwiMCwxMjgsMTI4XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGhpc3RsZVwiOiBcIjIxNiwxOTEsMjE2XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9tYXRvXCI6IFwiMjU1LDk5LDcxXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHVycXVvaXNlXCI6IFwiNjQsMjI0LDIwOFwiLFxuICAgICAgICAgICAgICAgICAgICBcInZpb2xldFwiOiBcIjIzOCwxMzAsMjM4XCIsXG4gICAgICAgICAgICAgICAgICAgIFwid2hlYXRcIjogXCIyNDUsMjIyLDE3OVwiLFxuICAgICAgICAgICAgICAgICAgICBcIndoaXRlc21va2VcIjogXCIyNDUsMjQ1LDI0NVwiLFxuICAgICAgICAgICAgICAgICAgICBcIndoaXRlXCI6IFwiMjU1LDI1NSwyNTVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ5ZWxsb3dncmVlblwiOiBcIjE1NCwyMDUsNTBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ5ZWxsb3dcIjogXCIyNTUsMjU1LDBcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKioqKioqKioqKioqXG4gICAgICAgICAgICAgSG9va3NcbiAgICAgICAgICAgICAqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIC8qIEhvb2tzIGFsbG93IGEgc3VicHJvcGVydHkgKGUuZy4gXCJib3hTaGFkb3dCbHVyXCIpIG9mIGEgY29tcG91bmQtdmFsdWUgQ1NTIHByb3BlcnR5XG4gICAgICAgICAgICAgKGUuZy4gXCJib3hTaGFkb3c6IFggWSBCbHVyIFNwcmVhZCBDb2xvclwiKSB0byBiZSBhbmltYXRlZCBhcyBpZiBpdCB3ZXJlIGEgZGlzY3JldGUgcHJvcGVydHkuICovXG4gICAgICAgICAgICAvKiBOb3RlOiBCZXlvbmQgZW5hYmxpbmcgZmluZS1ncmFpbmVkIHByb3BlcnR5IGFuaW1hdGlvbiwgaG9va2luZyBpcyBuZWNlc3Nhcnkgc2luY2UgVmVsb2NpdHkgb25seVxuICAgICAgICAgICAgIHR3ZWVucyBwcm9wZXJ0aWVzIHdpdGggc2luZ2xlIG51bWVyaWMgdmFsdWVzOyB1bmxpa2UgQ1NTIHRyYW5zaXRpb25zLCBWZWxvY2l0eSBkb2VzIG5vdCBpbnRlcnBvbGF0ZSBjb21wb3VuZC12YWx1ZXMuICovXG4gICAgICAgICAgICBIb29rczoge1xuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICBSZWdpc3RyYXRpb25cbiAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAvKiBUZW1wbGF0ZXMgYXJlIGEgY29uY2lzZSB3YXkgb2YgaW5kaWNhdGluZyB3aGljaCBzdWJwcm9wZXJ0aWVzIG11c3QgYmUgaW5kaXZpZHVhbGx5IHJlZ2lzdGVyZWQgZm9yIGVhY2ggY29tcG91bmQtdmFsdWUgQ1NTIHByb3BlcnR5LiAqL1xuICAgICAgICAgICAgICAgIC8qIEVhY2ggdGVtcGxhdGUgY29uc2lzdHMgb2YgdGhlIGNvbXBvdW5kLXZhbHVlJ3MgYmFzZSBuYW1lLCBpdHMgY29uc3RpdHVlbnQgc3VicHJvcGVydHkgbmFtZXMsIGFuZCB0aG9zZSBzdWJwcm9wZXJ0aWVzJyBkZWZhdWx0IHZhbHVlcy4gKi9cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0U2hhZG93XCI6IFtcIkNvbG9yIFggWSBCbHVyXCIsIFwiYmxhY2sgMHB4IDBweCAwcHhcIl0sXG4gICAgICAgICAgICAgICAgICAgIFwiYm94U2hhZG93XCI6IFtcIkNvbG9yIFggWSBCbHVyIFNwcmVhZFwiLCBcImJsYWNrIDBweCAwcHggMHB4IDBweFwiXSxcbiAgICAgICAgICAgICAgICAgICAgXCJjbGlwXCI6IFtcIlRvcCBSaWdodCBCb3R0b20gTGVmdFwiLCBcIjBweCAwcHggMHB4IDBweFwiXSxcbiAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kUG9zaXRpb25cIjogW1wiWCBZXCIsIFwiMCUgMCVcIl0sXG4gICAgICAgICAgICAgICAgICAgIFwidHJhbnNmb3JtT3JpZ2luXCI6IFtcIlggWSBaXCIsIFwiNTAlIDUwJSAwcHhcIl0sXG4gICAgICAgICAgICAgICAgICAgIFwicGVyc3BlY3RpdmVPcmlnaW5cIjogW1wiWCBZXCIsIFwiNTAlIDUwJVwiXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLyogQSBcInJlZ2lzdGVyZWRcIiBob29rIGlzIG9uZSB0aGF0IGhhcyBiZWVuIGNvbnZlcnRlZCBmcm9tIGl0cyB0ZW1wbGF0ZSBmb3JtIGludG8gYSBsaXZlLFxuICAgICAgICAgICAgICAgICB0d2VlbmFibGUgcHJvcGVydHkuIEl0IGNvbnRhaW5zIGRhdGEgdG8gYXNzb2NpYXRlIGl0IHdpdGggaXRzIHJvb3QgcHJvcGVydHkuICovXG4gICAgICAgICAgICAgICAgcmVnaXN0ZXJlZDoge1xuICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBBIHJlZ2lzdGVyZWQgaG9vayBsb29rcyBsaWtlIHRoaXMgPT0+IHRleHRTaGFkb3dCbHVyOiBbIFwidGV4dFNoYWRvd1wiLCAzIF0sXG4gICAgICAgICAgICAgICAgICAgICB3aGljaCBjb25zaXN0cyBvZiB0aGUgc3VicHJvcGVydHkncyBuYW1lLCB0aGUgYXNzb2NpYXRlZCByb290IHByb3BlcnR5J3MgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgIGFuZCB0aGUgc3VicHJvcGVydHkncyBwb3NpdGlvbiBpbiB0aGUgcm9vdCdzIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLyogQ29udmVydCB0aGUgdGVtcGxhdGVzIGludG8gaW5kaXZpZHVhbCBob29rcyB0aGVuIGFwcGVuZCB0aGVtIHRvIHRoZSByZWdpc3RlcmVkIG9iamVjdCBhYm92ZS4gKi9cbiAgICAgICAgICAgICAgICByZWdpc3RlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIENvbG9yIGhvb2tzIHJlZ2lzdHJhdGlvbjogQ29sb3JzIGFyZSBkZWZhdWx0ZWQgdG8gd2hpdGUgLS0gYXMgb3Bwb3NlZCB0byBibGFjayAtLSBzaW5jZSBjb2xvcnMgdGhhdCBhcmVcbiAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRseSBzZXQgdG8gXCJ0cmFuc3BhcmVudFwiIGRlZmF1bHQgdG8gdGhlaXIgcmVzcGVjdGl2ZSB0ZW1wbGF0ZSBiZWxvdyB3aGVuIGNvbG9yLWFuaW1hdGVkLFxuICAgICAgICAgICAgICAgICAgICAgYW5kIHdoaXRlIGlzIHR5cGljYWxseSBhIGNsb3NlciBtYXRjaCB0byB0cmFuc3BhcmVudCB0aGFuIGJsYWNrIGlzLiBBbiBleGNlcHRpb24gaXMgbWFkZSBmb3IgdGV4dCAoXCJjb2xvclwiKSxcbiAgICAgICAgICAgICAgICAgICAgIHdoaWNoIGlzIGFsbW9zdCBhbHdheXMgc2V0IGNsb3NlciB0byBibGFjayB0aGFuIHdoaXRlLiAqL1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IENTUy5MaXN0cy5jb2xvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZ2JDb21wb25lbnRzID0gKENTUy5MaXN0cy5jb2xvcnNbaV0gPT09IFwiY29sb3JcIikgPyBcIjAgMCAwIDFcIiA6IFwiMjU1IDI1NSAyNTUgMVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLkhvb2tzLnRlbXBsYXRlc1tDU1MuTGlzdHMuY29sb3JzW2ldXSA9IFtcIlJlZCBHcmVlbiBCbHVlIEFscGhhXCIsIHJnYkNvbXBvbmVudHNdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvb3RQcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2tUZW1wbGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2tOYW1lcztcblxuICAgICAgICAgICAgICAgICAgICAvKiBJbiBJRSwgY29sb3IgdmFsdWVzIGluc2lkZSBjb21wb3VuZC12YWx1ZSBwcm9wZXJ0aWVzIGFyZSBwb3NpdGlvbmVkIGF0IHRoZSBlbmQgdGhlIHZhbHVlIGluc3RlYWQgb2YgYXQgdGhlIGJlZ2lubmluZy5cbiAgICAgICAgICAgICAgICAgICAgIFRodXMsIHdlIHJlLWFycmFuZ2UgdGhlIHRlbXBsYXRlcyBhY2NvcmRpbmdseS4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKElFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHJvb3RQcm9wZXJ0eSBpbiBDU1MuSG9va3MudGVtcGxhdGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFDU1MuSG9va3MudGVtcGxhdGVzLmhhc093blByb3BlcnR5KHJvb3RQcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2tUZW1wbGF0ZSA9IENTUy5Ib29rcy50ZW1wbGF0ZXNbcm9vdFByb3BlcnR5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rTmFtZXMgPSBob29rVGVtcGxhdGVbMF0uc3BsaXQoXCIgXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlZmF1bHRWYWx1ZXMgPSBob29rVGVtcGxhdGVbMV0ubWF0Y2goQ1NTLlJlZ0V4LnZhbHVlU3BsaXQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhvb2tOYW1lc1swXSA9PT0gXCJDb2xvclwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFJlcG9zaXRpb24gYm90aCB0aGUgaG9vaydzIG5hbWUgYW5kIGl0cyBkZWZhdWx0IHZhbHVlIHRvIHRoZSBlbmQgb2YgdGhlaXIgcmVzcGVjdGl2ZSBzdHJpbmdzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rTmFtZXMucHVzaChob29rTmFtZXMuc2hpZnQoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZXMucHVzaChkZWZhdWx0VmFsdWVzLnNoaWZ0KCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFJlcGxhY2UgdGhlIGV4aXN0aW5nIHRlbXBsYXRlIGZvciB0aGUgaG9vaydzIHJvb3QgcHJvcGVydHkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENTUy5Ib29rcy50ZW1wbGF0ZXNbcm9vdFByb3BlcnR5XSA9IFtob29rTmFtZXMuam9pbihcIiBcIiksIGRlZmF1bHRWYWx1ZXMuam9pbihcIiBcIildO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIEhvb2sgcmVnaXN0cmF0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHJvb3RQcm9wZXJ0eSBpbiBDU1MuSG9va3MudGVtcGxhdGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIUNTUy5Ib29rcy50ZW1wbGF0ZXMuaGFzT3duUHJvcGVydHkocm9vdFByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaG9va1RlbXBsYXRlID0gQ1NTLkhvb2tzLnRlbXBsYXRlc1tyb290UHJvcGVydHldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaG9va05hbWVzID0gaG9va1RlbXBsYXRlWzBdLnNwbGl0KFwiIFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBob29rTmFtZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWhvb2tOYW1lcy5oYXNPd25Qcm9wZXJ0eShqKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZ1bGxIb29rTmFtZSA9IHJvb3RQcm9wZXJ0eSArIGhvb2tOYW1lc1tqXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9va1Bvc2l0aW9uID0gajtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZvciBlYWNoIGhvb2ssIHJlZ2lzdGVyIGl0cyBmdWxsIG5hbWUgKGUuZy4gdGV4dFNoYWRvd0JsdXIpIHdpdGggaXRzIHJvb3QgcHJvcGVydHkgKGUuZy4gdGV4dFNoYWRvdylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIHRoZSBob29rJ3MgcG9zaXRpb24gaW4gaXRzIHRlbXBsYXRlJ3MgZGVmYXVsdCB2YWx1ZSBzdHJpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLkhvb2tzLnJlZ2lzdGVyZWRbZnVsbEhvb2tOYW1lXSA9IFtyb290UHJvcGVydHksIGhvb2tQb3NpdGlvbl07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICBJbmplY3Rpb24gYW5kIEV4dHJhY3Rpb25cbiAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAvKiBMb29rIHVwIHRoZSByb290IHByb3BlcnR5IGFzc29jaWF0ZWQgd2l0aCB0aGUgaG9vayAoZS5nLiByZXR1cm4gXCJ0ZXh0U2hhZG93XCIgZm9yIFwidGV4dFNoYWRvd0JsdXJcIikuICovXG4gICAgICAgICAgICAgICAgLyogU2luY2UgYSBob29rIGNhbm5vdCBiZSBzZXQgZGlyZWN0bHkgKHRoZSBicm93c2VyIHdvbid0IHJlY29nbml6ZSBpdCksIHN0eWxlIHVwZGF0aW5nIGZvciBob29rcyBpcyByb3V0ZWQgdGhyb3VnaCB0aGUgaG9vaydzIHJvb3QgcHJvcGVydHkuICovXG4gICAgICAgICAgICAgICAgZ2V0Um9vdDogZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhvb2tEYXRhID0gQ1NTLkhvb2tzLnJlZ2lzdGVyZWRbcHJvcGVydHldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChob29rRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhvb2tEYXRhWzBdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlcmUgd2FzIG5vIGhvb2sgbWF0Y2gsIHJldHVybiB0aGUgcHJvcGVydHkgbmFtZSB1bnRvdWNoZWQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldFVuaXQ6IGZ1bmN0aW9uKHN0ciwgc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVuaXQgPSAoc3RyLnN1YnN0cihzdGFydCB8fCAwLCA1KS5tYXRjaCgvXlthLXolXSsvKSB8fCBbXSlbMF0gfHwgXCJcIjtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodW5pdCAmJiBDU1MuTGlzdHMudW5pdHMuaW5kZXhPZih1bml0KSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5pdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZpeENvbG9yczogZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvKHJnYmE/XFwoXFxzKik/KFxcYlthLXpdK1xcYikvZywgZnVuY3Rpb24oJDAsICQxLCAkMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5MaXN0cy5jb2xvck5hbWVzLmhhc093blByb3BlcnR5KCQyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoJDEgPyAkMSA6IFwicmdiYShcIikgKyBDU1MuTGlzdHMuY29sb3JOYW1lc1skMl0gKyAoJDEgPyBcIlwiIDogXCIsMSlcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJDEgKyAkMjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKiBDb252ZXJ0IGFueSByb290UHJvcGVydHlWYWx1ZSwgbnVsbCBvciBvdGhlcndpc2UsIGludG8gYSBzcGFjZS1kZWxpbWl0ZWQgbGlzdCBvZiBob29rIHZhbHVlcyBzbyB0aGF0XG4gICAgICAgICAgICAgICAgIHRoZSB0YXJnZXRlZCBob29rIGNhbiBiZSBpbmplY3RlZCBvciBleHRyYWN0ZWQgYXQgaXRzIHN0YW5kYXJkIHBvc2l0aW9uLiAqL1xuICAgICAgICAgICAgICAgIGNsZWFuUm9vdFByb3BlcnR5VmFsdWU6IGZ1bmN0aW9uKHJvb3RQcm9wZXJ0eSwgcm9vdFByb3BlcnR5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIHJvb3RQcm9wZXJ0eVZhbHVlIGlzIHdyYXBwZWQgd2l0aCBcInJnYigpXCIsIFwiY2xpcCgpXCIsIGV0Yy4sIHJlbW92ZSB0aGUgd3JhcHBpbmcgdG8gbm9ybWFsaXplIHRoZSB2YWx1ZSBiZWZvcmUgbWFuaXB1bGF0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ1NTLlJlZ0V4LnZhbHVlVW53cmFwLnRlc3Qocm9vdFByb3BlcnR5VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSA9IHJvb3RQcm9wZXJ0eVZhbHVlLm1hdGNoKENTUy5SZWdFeC52YWx1ZVVud3JhcClbMV07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKiBJZiByb290UHJvcGVydHlWYWx1ZSBpcyBhIENTUyBudWxsLXZhbHVlIChmcm9tIHdoaWNoIHRoZXJlJ3MgaW5oZXJlbnRseSBubyBob29rIHZhbHVlIHRvIGV4dHJhY3QpLFxuICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdCB0byB0aGUgcm9vdCdzIGRlZmF1bHQgdmFsdWUgYXMgZGVmaW5lZCBpbiBDU1MuSG9va3MudGVtcGxhdGVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBDU1MgbnVsbC12YWx1ZXMgaW5jbHVkZSBcIm5vbmVcIiwgXCJhdXRvXCIsIGFuZCBcInRyYW5zcGFyZW50XCIuIFRoZXkgbXVzdCBiZSBjb252ZXJ0ZWQgaW50byB0aGVpclxuICAgICAgICAgICAgICAgICAgICAgemVyby12YWx1ZXMgKGUuZy4gdGV4dFNoYWRvdzogXCJub25lXCIgPT0+IHRleHRTaGFkb3c6IFwiMHB4IDBweCAwcHggYmxhY2tcIikgZm9yIGhvb2sgbWFuaXB1bGF0aW9uIHRvIHByb2NlZWQuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChDU1MuVmFsdWVzLmlzQ1NTTnVsbFZhbHVlKHJvb3RQcm9wZXJ0eVZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWUgPSBDU1MuSG9va3MudGVtcGxhdGVzW3Jvb3RQcm9wZXJ0eV1bMV07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcm9vdFByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKiBFeHRyYWN0ZWQgdGhlIGhvb2sncyB2YWx1ZSBmcm9tIGl0cyByb290IHByb3BlcnR5J3MgdmFsdWUuIFRoaXMgaXMgdXNlZCB0byBnZXQgdGhlIHN0YXJ0aW5nIHZhbHVlIG9mIGFuIGFuaW1hdGluZyBob29rLiAqL1xuICAgICAgICAgICAgICAgIGV4dHJhY3RWYWx1ZTogZnVuY3Rpb24oZnVsbEhvb2tOYW1lLCByb290UHJvcGVydHlWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaG9va0RhdGEgPSBDU1MuSG9va3MucmVnaXN0ZXJlZFtmdWxsSG9va05hbWVdO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChob29rRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhvb2tSb290ID0gaG9va0RhdGFbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9va1Bvc2l0aW9uID0gaG9va0RhdGFbMV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlID0gQ1NTLkhvb2tzLmNsZWFuUm9vdFByb3BlcnR5VmFsdWUoaG9va1Jvb3QsIHJvb3RQcm9wZXJ0eVZhbHVlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogU3BsaXQgcm9vdFByb3BlcnR5VmFsdWUgaW50byBpdHMgY29uc3RpdHVlbnQgaG9vayB2YWx1ZXMgdGhlbiBncmFiIHRoZSBkZXNpcmVkIGhvb2sgYXQgaXRzIHN0YW5kYXJkIHBvc2l0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvb3RQcm9wZXJ0eVZhbHVlLnRvU3RyaW5nKCkubWF0Y2goQ1NTLlJlZ0V4LnZhbHVlU3BsaXQpW2hvb2tQb3NpdGlvbl07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgcHJvdmlkZWQgZnVsbEhvb2tOYW1lIGlzbid0IGEgcmVnaXN0ZXJlZCBob29rLCByZXR1cm4gdGhlIHJvb3RQcm9wZXJ0eVZhbHVlIHRoYXQgd2FzIHBhc3NlZCBpbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByb290UHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLyogSW5qZWN0IHRoZSBob29rJ3MgdmFsdWUgaW50byBpdHMgcm9vdCBwcm9wZXJ0eSdzIHZhbHVlLiBUaGlzIGlzIHVzZWQgdG8gcGllY2UgYmFjayB0b2dldGhlciB0aGUgcm9vdCBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgICBvbmNlIFZlbG9jaXR5IGhhcyB1cGRhdGVkIG9uZSBvZiBpdHMgaW5kaXZpZHVhbGx5IGhvb2tlZCB2YWx1ZXMgdGhyb3VnaCB0d2VlbmluZy4gKi9cbiAgICAgICAgICAgICAgICBpbmplY3RWYWx1ZTogZnVuY3Rpb24oZnVsbEhvb2tOYW1lLCBob29rVmFsdWUsIHJvb3RQcm9wZXJ0eVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBob29rRGF0YSA9IENTUy5Ib29rcy5yZWdpc3RlcmVkW2Z1bGxIb29rTmFtZV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGhvb2tEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaG9va1Jvb3QgPSBob29rRGF0YVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rUG9zaXRpb24gPSBob29rRGF0YVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZVBhcnRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlVXBkYXRlZDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWUgPSBDU1MuSG9va3MuY2xlYW5Sb290UHJvcGVydHlWYWx1ZShob29rUm9vdCwgcm9vdFByb3BlcnR5VmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBTcGxpdCByb290UHJvcGVydHlWYWx1ZSBpbnRvIGl0cyBpbmRpdmlkdWFsIGhvb2sgdmFsdWVzLCByZXBsYWNlIHRoZSB0YXJnZXRlZCB2YWx1ZSB3aXRoIGhvb2tWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGVuIHJlY29uc3RydWN0IHRoZSByb290UHJvcGVydHlWYWx1ZSBzdHJpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZVBhcnRzID0gcm9vdFByb3BlcnR5VmFsdWUudG9TdHJpbmcoKS5tYXRjaChDU1MuUmVnRXgudmFsdWVTcGxpdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZVBhcnRzW2hvb2tQb3NpdGlvbl0gPSBob29rVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZVVwZGF0ZWQgPSByb290UHJvcGVydHlWYWx1ZVBhcnRzLmpvaW4oXCIgXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcm9vdFByb3BlcnR5VmFsdWVVcGRhdGVkO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIHByb3ZpZGVkIGZ1bGxIb29rTmFtZSBpc24ndCBhIHJlZ2lzdGVyZWQgaG9vaywgcmV0dXJuIHRoZSByb290UHJvcGVydHlWYWx1ZSB0aGF0IHdhcyBwYXNzZWQgaW4uICovXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcm9vdFByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICBOb3JtYWxpemF0aW9uc1xuICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIC8qIE5vcm1hbGl6YXRpb25zIHN0YW5kYXJkaXplIENTUyBwcm9wZXJ0eSBtYW5pcHVsYXRpb24gYnkgcG9sbHlmaWxsaW5nIGJyb3dzZXItc3BlY2lmaWMgaW1wbGVtZW50YXRpb25zIChlLmcuIG9wYWNpdHkpXG4gICAgICAgICAgICAgYW5kIHJlZm9ybWF0dGluZyBzcGVjaWFsIHByb3BlcnRpZXMgKGUuZy4gY2xpcCwgcmdiYSkgdG8gbG9vayBsaWtlIHN0YW5kYXJkIG9uZXMuICovXG4gICAgICAgICAgICBOb3JtYWxpemF0aW9uczoge1xuICAgICAgICAgICAgICAgIC8qIE5vcm1hbGl6YXRpb25zIGFyZSBwYXNzZWQgYSBub3JtYWxpemF0aW9uIHRhcmdldCAoZWl0aGVyIHRoZSBwcm9wZXJ0eSdzIG5hbWUsIGl0cyBleHRyYWN0ZWQgdmFsdWUsIG9yIGl0cyBpbmplY3RlZCB2YWx1ZSksXG4gICAgICAgICAgICAgICAgIHRoZSB0YXJnZXRlZCBlbGVtZW50ICh3aGljaCBtYXkgbmVlZCB0byBiZSBxdWVyaWVkKSwgYW5kIHRoZSB0YXJnZXRlZCBwcm9wZXJ0eSB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICByZWdpc3RlcmVkOiB7XG4gICAgICAgICAgICAgICAgICAgIGNsaXA6IGZ1bmN0aW9uKHR5cGUsIGVsZW1lbnQsIHByb3BlcnR5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJuYW1lXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcImNsaXBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDbGlwIG5lZWRzIHRvIGJlIHVud3JhcHBlZCBhbmQgc3RyaXBwZWQgb2YgaXRzIGNvbW1hcyBkdXJpbmcgZXh0cmFjdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZXh0cmFjdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXh0cmFjdGVkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIFZlbG9jaXR5IGFsc28gZXh0cmFjdGVkIHRoaXMgdmFsdWUsIHNraXAgZXh0cmFjdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5SZWdFeC53cmFwcGVkVmFsdWVBbHJlYWR5RXh0cmFjdGVkLnRlc3QocHJvcGVydHlWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RlZCA9IHByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBSZW1vdmUgdGhlIFwicmVjdCgpXCIgd3JhcHBlci4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RlZCA9IHByb3BlcnR5VmFsdWUudG9TdHJpbmcoKS5tYXRjaChDU1MuUmVnRXgudmFsdWVVbndyYXApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTdHJpcCBvZmYgY29tbWFzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdGVkID0gZXh0cmFjdGVkID8gZXh0cmFjdGVkWzFdLnJlcGxhY2UoLywoXFxzKyk/L2csIFwiIFwiKSA6IHByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXh0cmFjdGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENsaXAgbmVlZHMgdG8gYmUgcmUtd3JhcHBlZCBkdXJpbmcgaW5qZWN0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpbmplY3RcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwicmVjdChcIiArIHByb3BlcnR5VmFsdWUgKyBcIilcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgYmx1cjogZnVuY3Rpb24odHlwZSwgZWxlbWVudCwgcHJvcGVydHlWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm5hbWVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFZlbG9jaXR5LlN0YXRlLmlzRmlyZWZveCA/IFwiZmlsdGVyXCIgOiBcIi13ZWJraXQtZmlsdGVyXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImV4dHJhY3RcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4dHJhY3RlZCA9IHBhcnNlRmxvYXQocHJvcGVydHlWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgZXh0cmFjdGVkIGlzIE5hTiwgbWVhbmluZyB0aGUgdmFsdWUgaXNuJ3QgYWxyZWFkeSBleHRyYWN0ZWQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKGV4dHJhY3RlZCB8fCBleHRyYWN0ZWQgPT09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYmx1ckNvbXBvbmVudCA9IHByb3BlcnR5VmFsdWUudG9TdHJpbmcoKS5tYXRjaCgvYmx1clxcKChbMC05XStbQS16XSspXFwpL2kpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgZmlsdGVyIHN0cmluZyBoYWQgYSBibHVyIGNvbXBvbmVudCwgcmV0dXJuIGp1c3QgdGhlIGJsdXIgdmFsdWUgYW5kIHVuaXQgdHlwZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChibHVyQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdGVkID0gYmx1ckNvbXBvbmVudFsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgY29tcG9uZW50IGRvZXNuJ3QgZXhpc3QsIGRlZmF1bHQgYmx1ciB0byAwLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYWN0ZWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4dHJhY3RlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBCbHVyIG5lZWRzIHRvIGJlIHJlLXdyYXBwZWQgZHVyaW5nIGluamVjdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaW5qZWN0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZvciB0aGUgYmx1ciBlZmZlY3QgdG8gYmUgZnVsbHkgZGUtYXBwbGllZCwgaXQgbmVlZHMgdG8gYmUgc2V0IHRvIFwibm9uZVwiIGluc3RlYWQgb2YgMC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwYXJzZUZsb2F0KHByb3BlcnR5VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJub25lXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJibHVyKFwiICsgcHJvcGVydHlWYWx1ZSArIFwiKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIC8qIDw9SUU4IGRvIG5vdCBzdXBwb3J0IHRoZSBzdGFuZGFyZCBvcGFjaXR5IHByb3BlcnR5LiBUaGV5IHVzZSBmaWx0ZXI6YWxwaGEob3BhY2l0eT1JTlQpIGluc3RlYWQuICovXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IGZ1bmN0aW9uKHR5cGUsIGVsZW1lbnQsIHByb3BlcnR5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChJRSA8PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJuYW1lXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJmaWx0ZXJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImV4dHJhY3RcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIDw9SUU4IHJldHVybiBhIFwiZmlsdGVyXCIgdmFsdWUgb2YgXCJhbHBoYShvcGFjaXR5PVxcZHsxLDN9KVwiLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEV4dHJhY3QgdGhlIHZhbHVlIGFuZCBjb252ZXJ0IGl0IHRvIGEgZGVjaW1hbCB2YWx1ZSB0byBtYXRjaCB0aGUgc3RhbmRhcmQgQ1NTIG9wYWNpdHkgcHJvcGVydHkncyBmb3JtYXR0aW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4dHJhY3RlZCA9IHByb3BlcnR5VmFsdWUudG9TdHJpbmcoKS5tYXRjaCgvYWxwaGFcXChvcGFjaXR5PSguKilcXCkvaSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleHRyYWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDb252ZXJ0IHRvIGRlY2ltYWwgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IGV4dHJhY3RlZFsxXSAvIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogV2hlbiBleHRyYWN0aW5nIG9wYWNpdHksIGRlZmF1bHQgdG8gMSBzaW5jZSBhIG51bGwgdmFsdWUgbWVhbnMgb3BhY2l0eSBoYXNuJ3QgYmVlbiBzZXQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaW5qZWN0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBPcGFjaWZpZWQgZWxlbWVudHMgYXJlIHJlcXVpcmVkIHRvIGhhdmUgdGhlaXIgem9vbSBwcm9wZXJ0eSBzZXQgdG8gYSBub24temVybyB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuem9vbSA9IDE7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNldHRpbmcgdGhlIGZpbHRlciBwcm9wZXJ0eSBvbiBlbGVtZW50cyB3aXRoIGNlcnRhaW4gZm9udCBwcm9wZXJ0eSBjb21iaW5hdGlvbnMgY2FuIHJlc3VsdCBpbiBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGx5IHVuYXBwZWFsaW5nIHVsdHJhLWJvbGRpbmcgZWZmZWN0LiBUaGVyZSdzIG5vIHdheSB0byByZW1lZHkgdGhpcyB0aHJvdWdob3V0IGEgdHdlZW4sIGJ1dCBkcm9wcGluZyB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSBhbHRvZ2V0aGVyICh3aGVuIG9wYWNpdHkgaGl0cyAxKSBhdCBsZWFzdHMgZW5zdXJlcyB0aGF0IHRoZSBnbGl0Y2ggaXMgZ29uZSBwb3N0LXR3ZWVuaW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlRmxvYXQocHJvcGVydHlWYWx1ZSkgPj0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBBcyBwZXIgdGhlIGZpbHRlciBwcm9wZXJ0eSdzIHNwZWMsIGNvbnZlcnQgdGhlIGRlY2ltYWwgdmFsdWUgdG8gYSB3aG9sZSBudW1iZXIgYW5kIHdyYXAgdGhlIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcImFscGhhKG9wYWNpdHk9XCIgKyBwYXJzZUludChwYXJzZUZsb2F0KHByb3BlcnR5VmFsdWUpICogMTAwLCAxMCkgKyBcIilcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogV2l0aCBhbGwgb3RoZXIgYnJvd3NlcnMsIG5vcm1hbGl6YXRpb24gaXMgbm90IHJlcXVpcmVkOyByZXR1cm4gdGhlIHNhbWUgdmFsdWVzIHRoYXQgd2VyZSBwYXNzZWQgaW4uICovXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibmFtZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwib3BhY2l0eVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZXh0cmFjdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpbmplY3RcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgIEJhdGNoZWQgUmVnaXN0cmF0aW9uc1xuICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIC8qIE5vdGU6IEJhdGNoZWQgbm9ybWFsaXphdGlvbnMgZXh0ZW5kIHRoZSBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZCBvYmplY3QuICovXG4gICAgICAgICAgICAgICAgcmVnaXN0ZXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgVHJhbnNmb3Jtc1xuICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgLyogVHJhbnNmb3JtcyBhcmUgdGhlIHN1YnByb3BlcnRpZXMgY29udGFpbmVkIGJ5IHRoZSBDU1MgXCJ0cmFuc2Zvcm1cIiBwcm9wZXJ0eS4gVHJhbnNmb3JtcyBtdXN0IHVuZGVyZ28gbm9ybWFsaXphdGlvblxuICAgICAgICAgICAgICAgICAgICAgc28gdGhhdCB0aGV5IGNhbiBiZSByZWZlcmVuY2VkIGluIGEgcHJvcGVydGllcyBtYXAgYnkgdGhlaXIgaW5kaXZpZHVhbCBuYW1lcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogV2hlbiB0cmFuc2Zvcm1zIGFyZSBcInNldFwiLCB0aGV5IGFyZSBhY3R1YWxseSBhc3NpZ25lZCB0byBhIHBlci1lbGVtZW50IHRyYW5zZm9ybUNhY2hlLiBXaGVuIGFsbCB0cmFuc2Zvcm1cbiAgICAgICAgICAgICAgICAgICAgIHNldHRpbmcgaXMgY29tcGxldGUgY29tcGxldGUsIENTUy5mbHVzaFRyYW5zZm9ybUNhY2hlKCkgbXVzdCBiZSBtYW51YWxseSBjYWxsZWQgdG8gZmx1c2ggdGhlIHZhbHVlcyB0byB0aGUgRE9NLlxuICAgICAgICAgICAgICAgICAgICAgVHJhbnNmb3JtIHNldHRpbmcgaXMgYmF0Y2hlZCBpbiB0aGlzIHdheSB0byBpbXByb3ZlIHBlcmZvcm1hbmNlOiB0aGUgdHJhbnNmb3JtIHN0eWxlIG9ubHkgbmVlZHMgdG8gYmUgdXBkYXRlZFxuICAgICAgICAgICAgICAgICAgICAgb25jZSB3aGVuIG11bHRpcGxlIHRyYW5zZm9ybSBzdWJwcm9wZXJ0aWVzIGFyZSBiZWluZyBhbmltYXRlZCBzaW11bHRhbmVvdXNseS4gKi9cbiAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogSUU5IGFuZCBBbmRyb2lkIEdpbmdlcmJyZWFkIGhhdmUgc3VwcG9ydCBmb3IgMkQgLS0gYnV0IG5vdCAzRCAtLSB0cmFuc2Zvcm1zLiBTaW5jZSBhbmltYXRpbmcgdW5zdXBwb3J0ZWRcbiAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybSBwcm9wZXJ0aWVzIHJlc3VsdHMgaW4gdGhlIGJyb3dzZXIgaWdub3JpbmcgdGhlICplbnRpcmUqIHRyYW5zZm9ybSBzdHJpbmcsIHdlIHByZXZlbnQgdGhlc2UgM0QgdmFsdWVzXG4gICAgICAgICAgICAgICAgICAgICBmcm9tIGJlaW5nIG5vcm1hbGl6ZWQgZm9yIHRoZXNlIGJyb3dzZXJzIHNvIHRoYXQgdHdlZW5pbmcgc2tpcHMgdGhlc2UgcHJvcGVydGllcyBhbHRvZ2V0aGVyXG4gICAgICAgICAgICAgICAgICAgICAoc2luY2UgaXQgd2lsbCBpZ25vcmUgdGhlbSBhcyBiZWluZyB1bnN1cHBvcnRlZCBieSB0aGUgYnJvd3Nlci4pICovXG4gICAgICAgICAgICAgICAgICAgIGlmICgoIUlFIHx8IElFID4gOSkgJiYgIVZlbG9jaXR5LlN0YXRlLmlzR2luZ2VyYnJlYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFNpbmNlIHRoZSBzdGFuZGFsb25lIENTUyBcInBlcnNwZWN0aXZlXCIgcHJvcGVydHkgYW5kIHRoZSBDU1MgdHJhbnNmb3JtIFwicGVyc3BlY3RpdmVcIiBzdWJwcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlIHRoZSBzYW1lIG5hbWUsIHRoZSBsYXR0ZXIgaXMgZ2l2ZW4gYSB1bmlxdWUgdG9rZW4gd2l0aGluIFZlbG9jaXR5OiBcInRyYW5zZm9ybVBlcnNwZWN0aXZlXCIuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBDU1MuTGlzdHMudHJhbnNmb3Jtc0Jhc2UgPSBDU1MuTGlzdHMudHJhbnNmb3Jtc0Jhc2UuY29uY2F0KENTUy5MaXN0cy50cmFuc2Zvcm1zM0QpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBDU1MuTGlzdHMudHJhbnNmb3Jtc0Jhc2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFdyYXAgdGhlIGR5bmFtaWNhbGx5IGdlbmVyYXRlZCBub3JtYWxpemF0aW9uIGZ1bmN0aW9uIGluIGEgbmV3IHNjb3BlIHNvIHRoYXQgdHJhbnNmb3JtTmFtZSdzIHZhbHVlIGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgcGFpcmVkIHdpdGggaXRzIHJlc3BlY3RpdmUgZnVuY3Rpb24uIChPdGhlcndpc2UsIGFsbCBmdW5jdGlvbnMgd291bGQgdGFrZSB0aGUgZmluYWwgZm9yIGxvb3AncyB0cmFuc2Zvcm1OYW1lLikgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNmb3JtTmFtZSA9IENTUy5MaXN0cy50cmFuc2Zvcm1zQmFzZVtpXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW3RyYW5zZm9ybU5hbWVdID0gZnVuY3Rpb24odHlwZSwgZWxlbWVudCwgcHJvcGVydHlWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSBub3JtYWxpemVkIHByb3BlcnR5IG5hbWUgaXMgdGhlIHBhcmVudCBcInRyYW5zZm9ybVwiIHByb3BlcnR5IC0tIHRoZSBwcm9wZXJ0eSB0aGF0IGlzIGFjdHVhbGx5IHNldCBpbiBDU1MuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibmFtZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcInRyYW5zZm9ybVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVHJhbnNmb3JtIHZhbHVlcyBhcmUgY2FjaGVkIG9udG8gYSBwZXItZWxlbWVudCB0cmFuc2Zvcm1DYWNoZSBvYmplY3QuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZXh0cmFjdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoaXMgdHJhbnNmb3JtIGhhcyB5ZXQgdG8gYmUgYXNzaWduZWQgYSB2YWx1ZSwgcmV0dXJuIGl0cyBudWxsIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChEYXRhKGVsZW1lbnQpID09PSB1bmRlZmluZWQgfHwgRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZVt0cmFuc2Zvcm1OYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNjYWxlIENTUy5MaXN0cy50cmFuc2Zvcm1zQmFzZSBkZWZhdWx0IHRvIDEgd2hlcmVhcyBhbGwgb3RoZXIgdHJhbnNmb3JtIHByb3BlcnRpZXMgZGVmYXVsdCB0byAwLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gL15zY2FsZS9pLnRlc3QodHJhbnNmb3JtTmFtZSkgPyAxIDogMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogV2hlbiB0cmFuc2Zvcm0gdmFsdWVzIGFyZSBzZXQsIHRoZXkgYXJlIHdyYXBwZWQgaW4gcGFyZW50aGVzZXMgYXMgcGVyIHRoZSBDU1Mgc3BlYy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRodXMsIHdoZW4gZXh0cmFjdGluZyB0aGVpciB2YWx1ZXMgKGZvciB0d2VlbiBjYWxjdWxhdGlvbnMpLCB3ZSBzdHJpcCBvZmYgdGhlIHBhcmVudGhlc2VzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZVt0cmFuc2Zvcm1OYW1lXS5yZXBsYWNlKC9bKCldL2csIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImluamVjdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbnZhbGlkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiBhbiBpbmRpdmlkdWFsIHRyYW5zZm9ybSBwcm9wZXJ0eSBjb250YWlucyBhbiB1bnN1cHBvcnRlZCB1bml0IHR5cGUsIHRoZSBicm93c2VyIGlnbm9yZXMgdGhlICplbnRpcmUqIHRyYW5zZm9ybSBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGh1cywgcHJvdGVjdCB1c2VycyBmcm9tIHRoZW1zZWx2ZXMgYnkgc2tpcHBpbmcgc2V0dGluZyBmb3IgdHJhbnNmb3JtIHZhbHVlcyBzdXBwbGllZCB3aXRoIGludmFsaWQgdW5pdCB0eXBlcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTd2l0Y2ggb24gdGhlIGJhc2UgdHJhbnNmb3JtIHR5cGU7IGlnbm9yZSB0aGUgYXhpcyBieSByZW1vdmluZyB0aGUgbGFzdCBsZXR0ZXIgZnJvbSB0aGUgdHJhbnNmb3JtJ3MgbmFtZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRyYW5zZm9ybU5hbWUuc3Vic3RyKDAsIHRyYW5zZm9ybU5hbWUubGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogV2hpdGVsaXN0IHVuaXQgdHlwZXMgZm9yIGVhY2ggdHJhbnNmb3JtLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwidHJhbnNsYXRlXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZhbGlkID0gIS8oJXxweHxlbXxyZW18dnd8dmh8XFxkKSQvaS50ZXN0KHByb3BlcnR5VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNpbmNlIGFuIGF4aXMtZnJlZSBcInNjYWxlXCIgcHJvcGVydHkgaXMgc3VwcG9ydGVkIGFzIHdlbGwsIGEgbGl0dGxlIGhhY2sgaXMgdXNlZCBoZXJlIHRvIGRldGVjdCBpdCBieSBjaG9wcGluZyBvZmYgaXRzIGxhc3QgbGV0dGVyLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2NhbFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2NhbGVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENocm9tZSBvbiBBbmRyb2lkIGhhcyBhIGJ1ZyBpbiB3aGljaCBzY2FsZWQgZWxlbWVudHMgYmx1ciBpZiB0aGVpciBpbml0aWFsIHNjYWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgaXMgYmVsb3cgMSAod2hpY2ggY2FuIGhhcHBlbiB3aXRoIGZvcmNlZmVlZGluZykuIFRodXMsIHdlIGRldGVjdCBhIHlldC11bnNldCBzY2FsZSBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZCBlbnN1cmUgdGhhdCBpdHMgZmlyc3QgdmFsdWUgaXMgYWx3YXlzIDEuIE1vcmUgaW5mbzogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDQxNzg5MC9jc3MzLWFuaW1hdGlvbnMtd2l0aC10cmFuc2Zvcm0tY2F1c2VzLWJsdXJyZWQtZWxlbWVudHMtb24td2Via2l0LzEwNDE3OTYyIzEwNDE3OTYyICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkuU3RhdGUuaXNBbmRyb2lkICYmIERhdGEoZWxlbWVudCkudHJhbnNmb3JtQ2FjaGVbdHJhbnNmb3JtTmFtZV0gPT09IHVuZGVmaW5lZCAmJiBwcm9wZXJ0eVZhbHVlIDwgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZhbGlkID0gIS8oXFxkKSQvaS50ZXN0KHByb3BlcnR5VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJza2V3XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZhbGlkID0gIS8oZGVnfFxcZCkkL2kudGVzdChwcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwicm90YXRlXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZhbGlkID0gIS8oZGVnfFxcZCkkL2kudGVzdChwcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW52YWxpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBBcyBwZXIgdGhlIENTUyBzcGVjLCB3cmFwIHRoZSB2YWx1ZSBpbiBwYXJlbnRoZXNlcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZVt0cmFuc2Zvcm1OYW1lXSA9IFwiKFwiICsgcHJvcGVydHlWYWx1ZSArIFwiKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFsdGhvdWdoIHRoZSB2YWx1ZSBpcyBzZXQgb24gdGhlIHRyYW5zZm9ybUNhY2hlIG9iamVjdCwgcmV0dXJuIHRoZSBuZXdseS11cGRhdGVkIHZhbHVlIGZvciB0aGUgY2FsbGluZyBjb2RlIHRvIHByb2Nlc3MgYXMgbm9ybWFsLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlW3RyYW5zZm9ybU5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgQ29sb3JzXG4gICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIFNpbmNlIFZlbG9jaXR5IG9ubHkgYW5pbWF0ZXMgYSBzaW5nbGUgbnVtZXJpYyB2YWx1ZSBwZXIgcHJvcGVydHksIGNvbG9yIGFuaW1hdGlvbiBpcyBhY2hpZXZlZCBieSBob29raW5nIHRoZSBpbmRpdmlkdWFsIFJHQkEgY29tcG9uZW50cyBvZiBDU1MgY29sb3IgcHJvcGVydGllcy5cbiAgICAgICAgICAgICAgICAgICAgIEFjY29yZGluZ2x5LCBjb2xvciB2YWx1ZXMgbXVzdCBiZSBub3JtYWxpemVkIChlLmcuIFwiI2ZmMDAwMFwiLCBcInJlZFwiLCBhbmQgXCJyZ2IoMjU1LCAwLCAwKVwiID09PiBcIjI1NSAwIDAgMVwiKSBzbyB0aGF0IHRoZWlyIGNvbXBvbmVudHMgY2FuIGJlIGluamVjdGVkL2V4dHJhY3RlZCBieSBDU1MuSG9va3MgbG9naWMuICovXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgQ1NTLkxpc3RzLmNvbG9ycy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogV3JhcCB0aGUgZHluYW1pY2FsbHkgZ2VuZXJhdGVkIG5vcm1hbGl6YXRpb24gZnVuY3Rpb24gaW4gYSBuZXcgc2NvcGUgc28gdGhhdCBjb2xvck5hbWUncyB2YWx1ZSBpcyBwYWlyZWQgd2l0aCBpdHMgcmVzcGVjdGl2ZSBmdW5jdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAoT3RoZXJ3aXNlLCBhbGwgZnVuY3Rpb25zIHdvdWxkIHRha2UgdGhlIGZpbmFsIGZvciBsb29wJ3MgY29sb3JOYW1lLikgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29sb3JOYW1lID0gQ1NTLkxpc3RzLmNvbG9yc1tqXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IEluIElFPD04LCB3aGljaCBzdXBwb3J0IHJnYiBidXQgbm90IHJnYmEsIGNvbG9yIHByb3BlcnRpZXMgYXJlIHJldmVydGVkIHRvIHJnYiBieSBzdHJpcHBpbmcgb2ZmIHRoZSBhbHBoYSBjb21wb25lbnQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbY29sb3JOYW1lXSA9IGZ1bmN0aW9uKHR5cGUsIGVsZW1lbnQsIHByb3BlcnR5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibmFtZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb2xvck5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDb252ZXJ0IGFsbCBjb2xvciB2YWx1ZXMgaW50byB0aGUgcmdiIGZvcm1hdC4gKE9sZCBJRSBjYW4gcmV0dXJuIGhleCB2YWx1ZXMgYW5kIGNvbG9yIG5hbWVzIGluc3RlYWQgb2YgcmdiL3JnYmEuKSAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImV4dHJhY3RcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXh0cmFjdGVkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGNvbG9yIGlzIGFscmVhZHkgaW4gaXRzIGhvb2thYmxlIGZvcm0gKGUuZy4gXCIyNTUgMjU1IDI1NSAxXCIpIGR1ZSB0byBoYXZpbmcgYmVlbiBwcmV2aW91c2x5IGV4dHJhY3RlZCwgc2tpcCBleHRyYWN0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDU1MuUmVnRXgud3JhcHBlZFZhbHVlQWxyZWFkeUV4dHJhY3RlZC50ZXN0KHByb3BlcnR5VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RlZCA9IHByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnZlcnRlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yTmFtZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhY2s6IFwicmdiKDAsIDAsIDApXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmx1ZTogXCJyZ2IoMCwgMCwgMjU1KVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyYXk6IFwicmdiKDEyOCwgMTI4LCAxMjgpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JlZW46IFwicmdiKDAsIDEyOCwgMClcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWQ6IFwicmdiKDI1NSwgMCwgMClcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGl0ZTogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDb252ZXJ0IGNvbG9yIG5hbWVzIHRvIHJnYi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC9eW0Etel0rJC9pLnRlc3QocHJvcGVydHlWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2xvck5hbWVzW3Byb3BlcnR5VmFsdWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0ZWQgPSBjb2xvck5hbWVzW3Byb3BlcnR5VmFsdWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiBhbiB1bm1hdGNoZWQgY29sb3IgbmFtZSBpcyBwcm92aWRlZCwgZGVmYXVsdCB0byBibGFjay4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0ZWQgPSBjb2xvck5hbWVzLmJsYWNrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ29udmVydCBoZXggdmFsdWVzIHRvIHJnYi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChDU1MuUmVnRXguaXNIZXgudGVzdChwcm9wZXJ0eVZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udmVydGVkID0gXCJyZ2IoXCIgKyBDU1MuVmFsdWVzLmhleFRvUmdiKHByb3BlcnR5VmFsdWUpLmpvaW4oXCIgXCIpICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgcHJvdmlkZWQgY29sb3IgZG9lc24ndCBtYXRjaCBhbnkgb2YgdGhlIGFjY2VwdGVkIGNvbG9yIGZvcm1hdHMsIGRlZmF1bHQgdG8gYmxhY2suICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoISgvXnJnYmE/XFwoL2kudGVzdChwcm9wZXJ0eVZhbHVlKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnZlcnRlZCA9IGNvbG9yTmFtZXMuYmxhY2s7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBSZW1vdmUgdGhlIHN1cnJvdW5kaW5nIFwicmdiL3JnYmEoKVwiIHN0cmluZyB0aGVuIHJlcGxhY2UgY29tbWFzIHdpdGggc3BhY2VzIGFuZCBzdHJpcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwZWF0ZWQgc3BhY2VzIChpbiBjYXNlIHRoZSB2YWx1ZSBpbmNsdWRlZCBzcGFjZXMgdG8gYmVnaW4gd2l0aCkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RlZCA9IChjb252ZXJ0ZWQgfHwgcHJvcGVydHlWYWx1ZSkudG9TdHJpbmcoKS5tYXRjaChDU1MuUmVnRXgudmFsdWVVbndyYXApWzFdLnJlcGxhY2UoLywoXFxzKyk/L2csIFwiIFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTbyBsb25nIGFzIHRoaXMgaXNuJ3QgPD1JRTgsIGFkZCBhIGZvdXJ0aCAoYWxwaGEpIGNvbXBvbmVudCBpZiBpdCdzIG1pc3NpbmcgYW5kIGRlZmF1bHQgaXQgdG8gMSAodmlzaWJsZSkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCghSUUgfHwgSUUgPiA4KSAmJiBleHRyYWN0ZWQuc3BsaXQoXCIgXCIpLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYWN0ZWQgKz0gXCIgMVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBleHRyYWN0ZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaW5qZWN0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgd2UgaGF2ZSBhIHBhdHRlcm4gdGhlbiBpdCBtaWdodCBhbHJlYWR5IGhhdmUgdGhlIHJpZ2h0IHZhbHVlcyAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgvXnJnYi8udGVzdChwcm9wZXJ0eVZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGlzIGlzIElFPD04IGFuZCBhbiBhbHBoYSBjb21wb25lbnQgZXhpc3RzLCBzdHJpcCBpdCBvZmYuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKElFIDw9IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5VmFsdWUuc3BsaXQoXCIgXCIpLmxlbmd0aCA9PT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IHByb3BlcnR5VmFsdWUuc3BsaXQoL1xccysvKS5zbGljZSgwLCAzKS5qb2luKFwiIFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBPdGhlcndpc2UsIGFkZCBhIGZvdXJ0aCAoYWxwaGEpIGNvbXBvbmVudCBpZiBpdCdzIG1pc3NpbmcgYW5kIGRlZmF1bHQgaXQgdG8gMSAodmlzaWJsZSkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wZXJ0eVZhbHVlLnNwbGl0KFwiIFwiKS5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSArPSBcIiAxXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogUmUtaW5zZXJ0IHRoZSBicm93c2VyLWFwcHJvcHJpYXRlIHdyYXBwZXIoXCJyZ2IvcmdiYSgpXCIpLCBpbnNlcnQgY29tbWFzLCBhbmQgc3RyaXAgb2ZmIGRlY2ltYWwgdW5pdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb24gYWxsIHZhbHVlcyBidXQgdGhlIGZvdXJ0aCAoUiwgRywgYW5kIEIgb25seSBhY2NlcHQgd2hvbGUgbnVtYmVycykuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChJRSA8PSA4ID8gXCJyZ2JcIiA6IFwicmdiYVwiKSArIFwiKFwiICsgcHJvcGVydHlWYWx1ZS5yZXBsYWNlKC9cXHMrL2csIFwiLFwiKS5yZXBsYWNlKC9cXC4oXFxkKSsoPz0sKS9nLCBcIlwiKSArIFwiKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgIERpbWVuc2lvbnNcbiAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBhdWdtZW50RGltZW5zaW9uKG5hbWUsIGVsZW1lbnQsIHdhbnRJbm5lcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzQm9yZGVyQm94ID0gQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJib3hTaXppbmdcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpID09PSBcImJvcmRlci1ib3hcIjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQm9yZGVyQm94ID09PSAod2FudElubmVyIHx8IGZhbHNlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIGluIGJveC1zaXppbmcgbW9kZSwgdGhlIENTUyB3aWR0aCAvIGhlaWdodCBhY2Nlc3NvcnMgYWxyZWFkeSBnaXZlIHRoZSBvdXRlcldpZHRoIC8gb3V0ZXJIZWlnaHQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdWdtZW50ID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lkZXMgPSBuYW1lID09PSBcIndpZHRoXCIgPyBbXCJMZWZ0XCIsIFwiUmlnaHRcIl0gOiBbXCJUb3BcIiwgXCJCb3R0b21cIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkcyA9IFtcInBhZGRpbmdcIiArIHNpZGVzWzBdLCBcInBhZGRpbmdcIiArIHNpZGVzWzFdLCBcImJvcmRlclwiICsgc2lkZXNbMF0gKyBcIldpZHRoXCIsIFwiYm9yZGVyXCIgKyBzaWRlc1sxXSArIFwiV2lkdGhcIl07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdChDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBmaWVsZHNbaV0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc05hTih2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1Z21lbnQgKz0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdhbnRJbm5lciA/IC1hdWdtZW50IDogYXVnbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdldERpbWVuc2lvbihuYW1lLCB3YW50SW5uZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih0eXBlLCBlbGVtZW50LCBwcm9wZXJ0eVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJuYW1lXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImV4dHJhY3RcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHByb3BlcnR5VmFsdWUpICsgYXVnbWVudERpbWVuc2lvbihuYW1lLCBlbGVtZW50LCB3YW50SW5uZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaW5qZWN0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKHBhcnNlRmxvYXQocHJvcGVydHlWYWx1ZSkgLSBhdWdtZW50RGltZW5zaW9uKG5hbWUsIGVsZW1lbnQsIHdhbnRJbm5lcikpICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWQuaW5uZXJXaWR0aCA9IGdldERpbWVuc2lvbihcIndpZHRoXCIsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZC5pbm5lckhlaWdodCA9IGdldERpbWVuc2lvbihcImhlaWdodFwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWQub3V0ZXJXaWR0aCA9IGdldERpbWVuc2lvbihcIndpZHRoXCIpO1xuICAgICAgICAgICAgICAgICAgICBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZC5vdXRlckhlaWdodCA9IGdldERpbWVuc2lvbihcImhlaWdodFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgIENTUyBQcm9wZXJ0eSBOYW1lc1xuICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgTmFtZXM6IHtcbiAgICAgICAgICAgICAgICAvKiBDYW1lbGNhc2UgYSBwcm9wZXJ0eSBuYW1lIGludG8gaXRzIEphdmFTY3JpcHQgbm90YXRpb24gKGUuZy4gXCJiYWNrZ3JvdW5kLWNvbG9yXCIgPT0+IFwiYmFja2dyb3VuZENvbG9yXCIpLlxuICAgICAgICAgICAgICAgICBDYW1lbGNhc2luZyBpcyB1c2VkIHRvIG5vcm1hbGl6ZSBwcm9wZXJ0eSBuYW1lcyBiZXR3ZWVuIGFuZCBhY3Jvc3MgY2FsbHMuICovXG4gICAgICAgICAgICAgICAgY2FtZWxDYXNlOiBmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHkucmVwbGFjZSgvLShcXHcpL2csIGZ1bmN0aW9uKG1hdGNoLCBzdWJNYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1Yk1hdGNoLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLyogRm9yIFNWRyBlbGVtZW50cywgc29tZSBwcm9wZXJ0aWVzIChuYW1lbHksIGRpbWVuc2lvbmFsIG9uZXMpIGFyZSBHRVQvU0VUIHZpYSB0aGUgZWxlbWVudCdzIEhUTUwgYXR0cmlidXRlcyAoaW5zdGVhZCBvZiB2aWEgQ1NTIHN0eWxlcykuICovXG4gICAgICAgICAgICAgICAgU1ZHQXR0cmlidXRlOiBmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgU1ZHQXR0cmlidXRlcyA9IFwid2lkdGh8aGVpZ2h0fHh8eXxjeHxjeXxyfHJ4fHJ5fHgxfHgyfHkxfHkyXCI7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogQ2VydGFpbiBicm93c2VycyByZXF1aXJlIGFuIFNWRyB0cmFuc2Zvcm0gdG8gYmUgYXBwbGllZCBhcyBhbiBhdHRyaWJ1dGUuIChPdGhlcndpc2UsIGFwcGxpY2F0aW9uIHZpYSBDU1MgaXMgcHJlZmVyYWJsZSBkdWUgdG8gM0Qgc3VwcG9ydC4pICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChJRSB8fCAoVmVsb2NpdHkuU3RhdGUuaXNBbmRyb2lkICYmICFWZWxvY2l0eS5TdGF0ZS5pc0Nocm9tZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFNWR0F0dHJpYnV0ZXMgKz0gXCJ8dHJhbnNmb3JtXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChcIl4oXCIgKyBTVkdBdHRyaWJ1dGVzICsgXCIpJFwiLCBcImlcIikudGVzdChwcm9wZXJ0eSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKiBEZXRlcm1pbmUgd2hldGhlciBhIHByb3BlcnR5IHNob3VsZCBiZSBzZXQgd2l0aCBhIHZlbmRvciBwcmVmaXguICovXG4gICAgICAgICAgICAgICAgLyogSWYgYSBwcmVmaXhlZCB2ZXJzaW9uIG9mIHRoZSBwcm9wZXJ0eSBleGlzdHMsIHJldHVybiBpdC4gT3RoZXJ3aXNlLCByZXR1cm4gdGhlIG9yaWdpbmFsIHByb3BlcnR5IG5hbWUuXG4gICAgICAgICAgICAgICAgIElmIHRoZSBwcm9wZXJ0eSBpcyBub3QgYXQgYWxsIHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciwgcmV0dXJuIGEgZmFsc2UgZmxhZy4gKi9cbiAgICAgICAgICAgICAgICBwcmVmaXhDaGVjazogZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhpcyBwcm9wZXJ0eSBoYXMgYWxyZWFkeSBiZWVuIGNoZWNrZWQsIHJldHVybiB0aGUgY2FjaGVkIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkuU3RhdGUucHJlZml4TWF0Y2hlc1twcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbVmVsb2NpdHkuU3RhdGUucHJlZml4TWF0Y2hlc1twcm9wZXJ0eV0sIHRydWVdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZlbmRvcnMgPSBbXCJcIiwgXCJXZWJraXRcIiwgXCJNb3pcIiwgXCJtc1wiLCBcIk9cIl07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCB2ZW5kb3JzTGVuZ3RoID0gdmVuZG9ycy5sZW5ndGg7IGkgPCB2ZW5kb3JzTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlQcmVmaXhlZDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5UHJlZml4ZWQgPSBwcm9wZXJ0eTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDYXBpdGFsaXplIHRoZSBmaXJzdCBsZXR0ZXIgb2YgdGhlIHByb3BlcnR5IHRvIGNvbmZvcm0gdG8gSmF2YVNjcmlwdCB2ZW5kb3IgcHJlZml4IG5vdGF0aW9uIChlLmcuIHdlYmtpdEZpbHRlcikuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5UHJlZml4ZWQgPSB2ZW5kb3JzW2ldICsgcHJvcGVydHkucmVwbGFjZSgvXlxcdy8sIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDaGVjayBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0aGlzIHByb3BlcnR5IGFzIHByZWZpeGVkLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUeXBlLmlzU3RyaW5nKFZlbG9jaXR5LlN0YXRlLnByZWZpeEVsZW1lbnQuc3R5bGVbcHJvcGVydHlQcmVmaXhlZF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENhY2hlIHRoZSBtYXRjaC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUucHJlZml4TWF0Y2hlc1twcm9wZXJ0eV0gPSBwcm9wZXJ0eVByZWZpeGVkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbcHJvcGVydHlQcmVmaXhlZCwgdHJ1ZV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgdGhpcyBwcm9wZXJ0eSBpbiBhbnkgZm9ybSwgaW5jbHVkZSBhIGZhbHNlIGZsYWcgc28gdGhhdCB0aGUgY2FsbGVyIGNhbiBkZWNpZGUgaG93IHRvIHByb2NlZWQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3Byb3BlcnR5LCBmYWxzZV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgIENTUyBQcm9wZXJ0eSBWYWx1ZXNcbiAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIFZhbHVlczoge1xuICAgICAgICAgICAgICAgIC8qIEhleCB0byBSR0IgY29udmVyc2lvbi4gQ29weXJpZ2h0IFRpbSBEb3duOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU2MjM4MzgvcmdiLXRvLWhleC1hbmQtaGV4LXRvLXJnYiAqL1xuICAgICAgICAgICAgICAgIGhleFRvUmdiOiBmdW5jdGlvbihoZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNob3J0Zm9ybVJlZ2V4ID0gL14jPyhbYS1mXFxkXSkoW2EtZlxcZF0pKFthLWZcXGRdKSQvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvbmdmb3JtUmVnZXggPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmdiUGFydHM7XG5cbiAgICAgICAgICAgICAgICAgICAgaGV4ID0gaGV4LnJlcGxhY2Uoc2hvcnRmb3JtUmVnZXgsIGZ1bmN0aW9uKG0sIHIsIGcsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByICsgciArIGcgKyBnICsgYiArIGI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHJnYlBhcnRzID0gbG9uZ2Zvcm1SZWdleC5leGVjKGhleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJnYlBhcnRzID8gW3BhcnNlSW50KHJnYlBhcnRzWzFdLCAxNiksIHBhcnNlSW50KHJnYlBhcnRzWzJdLCAxNiksIHBhcnNlSW50KHJnYlBhcnRzWzNdLCAxNildIDogWzAsIDAsIDBdO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaXNDU1NOdWxsVmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFRoZSBicm93c2VyIGRlZmF1bHRzIENTUyB2YWx1ZXMgdGhhdCBoYXZlIG5vdCBiZWVuIHNldCB0byBlaXRoZXIgMCBvciBvbmUgb2Ygc2V2ZXJhbCBwb3NzaWJsZSBudWxsLXZhbHVlIHN0cmluZ3MuXG4gICAgICAgICAgICAgICAgICAgICBUaHVzLCB3ZSBjaGVjayBmb3IgYm90aCBmYWxzaW5lc3MgYW5kIHRoZXNlIHNwZWNpYWwgc3RyaW5ncy4gKi9cbiAgICAgICAgICAgICAgICAgICAgLyogTnVsbC12YWx1ZSBjaGVja2luZyBpcyBwZXJmb3JtZWQgdG8gZGVmYXVsdCB0aGUgc3BlY2lhbCBzdHJpbmdzIHRvIDAgKGZvciB0aGUgc2FrZSBvZiB0d2VlbmluZykgb3IgdGhlaXIgaG9va1xuICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVzIGFzIGRlZmluZWQgYXMgQ1NTLkhvb2tzIChmb3IgdGhlIHNha2Ugb2YgaG9vayBpbmplY3Rpb24vZXh0cmFjdGlvbikuICovXG4gICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IENocm9tZSByZXR1cm5zIFwicmdiYSgwLCAwLCAwLCAwKVwiIGZvciBhbiB1bmRlZmluZWQgY29sb3Igd2hlcmVhcyBJRSByZXR1cm5zIFwidHJhbnNwYXJlbnRcIi4gKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICghdmFsdWUgfHwgL14obm9uZXxhdXRvfHRyYW5zcGFyZW50fChyZ2JhXFwoMCwgPzAsID8wLCA/MFxcKSkpJC9pLnRlc3QodmFsdWUpKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qIFJldHJpZXZlIGEgcHJvcGVydHkncyBkZWZhdWx0IHVuaXQgdHlwZS4gVXNlZCBmb3IgYXNzaWduaW5nIGEgdW5pdCB0eXBlIHdoZW4gb25lIGlzIG5vdCBzdXBwbGllZCBieSB0aGUgdXNlci4gKi9cbiAgICAgICAgICAgICAgICBnZXRVbml0VHlwZTogZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKC9eKHJvdGF0ZXxza2V3KS9pLnRlc3QocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJkZWdcIjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgvKF4oc2NhbGV8c2NhbGVYfHNjYWxlWXxzY2FsZVp8YWxwaGF8ZmxleEdyb3d8ZmxleEhlaWdodHx6SW5kZXh8Zm9udFdlaWdodCkkKXwoKG9wYWNpdHl8cmVkfGdyZWVufGJsdWV8YWxwaGEpJCkvaS50ZXN0KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogVGhlIGFib3ZlIHByb3BlcnRpZXMgYXJlIHVuaXRsZXNzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBEZWZhdWx0IHRvIHB4IGZvciBhbGwgb3RoZXIgcHJvcGVydGllcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qIEhUTUwgZWxlbWVudHMgZGVmYXVsdCB0byBhbiBhc3NvY2lhdGVkIGRpc3BsYXkgdHlwZSB3aGVuIHRoZXkncmUgbm90IHNldCB0byBkaXNwbGF5Om5vbmUuICovXG4gICAgICAgICAgICAgICAgLyogTm90ZTogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIGZvciBjb3JyZWN0bHkgc2V0dGluZyB0aGUgbm9uLVwibm9uZVwiIGRpc3BsYXkgdmFsdWUgaW4gY2VydGFpbiBWZWxvY2l0eSByZWRpcmVjdHMsIHN1Y2ggYXMgZmFkZUluL091dC4gKi9cbiAgICAgICAgICAgICAgICBnZXREaXNwbGF5VHlwZTogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFnTmFtZSA9IGVsZW1lbnQgJiYgZWxlbWVudC50YWdOYW1lLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoL14oYnxiaWd8aXxzbWFsbHx0dHxhYmJyfGFjcm9ueW18Y2l0ZXxjb2RlfGRmbnxlbXxrYmR8c3Ryb25nfHNhbXB8dmFyfGF8YmRvfGJyfGltZ3xtYXB8b2JqZWN0fHF8c2NyaXB0fHNwYW58c3VifHN1cHxidXR0b258aW5wdXR8bGFiZWx8c2VsZWN0fHRleHRhcmVhKSQvaS50ZXN0KHRhZ05hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJpbmxpbmVcIjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgvXihsaSkkL2kudGVzdCh0YWdOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwibGlzdC1pdGVtXCI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoL14odHIpJC9pLnRlc3QodGFnTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcInRhYmxlLXJvd1wiO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKC9eKHRhYmxlKSQvaS50ZXN0KHRhZ05hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJ0YWJsZVwiO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKC9eKHRib2R5KSQvaS50ZXN0KHRhZ05hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJ0YWJsZS1yb3ctZ3JvdXBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIERlZmF1bHQgdG8gXCJibG9ja1wiIHdoZW4gbm8gbWF0Y2ggaXMgZm91bmQuICovXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJibG9ja1wiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKiBUaGUgY2xhc3MgYWRkL3JlbW92ZSBmdW5jdGlvbnMgYXJlIHVzZWQgdG8gdGVtcG9yYXJpbHkgYXBwbHkgYSBcInZlbG9jaXR5LWFuaW1hdGluZ1wiIGNsYXNzIHRvIGVsZW1lbnRzIHdoaWxlIHRoZXkncmUgYW5pbWF0aW5nLiAqL1xuICAgICAgICAgICAgICAgIGFkZENsYXNzOiBmdW5jdGlvbihlbGVtZW50LCBjbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChUeXBlLmlzU3RyaW5nKGVsZW1lbnQuY2xhc3NOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVsZW1lbnQuY2xhc3NOYW1lIGlzIGFyb3VuZCAxNSUgZmFzdGVyIHRoZW4gc2V0L2dldEF0dHJpYnV0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lICs9IChlbGVtZW50LmNsYXNzTmFtZS5sZW5ndGggPyBcIiBcIiA6IFwiXCIpICsgY2xhc3NOYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXb3JrIGFyb3VuZCBmb3IgSUUgc3RyaWN0IG1vZGUgYW5pbWF0aW5nIFNWRyAtIGFuZCBhbnl0aGluZyBlbHNlIHRoYXQgZG9lc24ndCBiZWhhdmUgY29ycmVjdGx5IC0gdGhlIHNhbWUgd2F5IGpRdWVyeSBkb2VzIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRDbGFzcyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKElFIDw9IDcgPyBcImNsYXNzTmFtZVwiIDogXCJjbGFzc1wiKSB8fCBcIlwiO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBjdXJyZW50Q2xhc3MgKyAoY3VycmVudENsYXNzID8gXCIgXCIgOiBcIlwiKSArIGNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlbW92ZUNsYXNzOiBmdW5jdGlvbihlbGVtZW50LCBjbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChUeXBlLmlzU3RyaW5nKGVsZW1lbnQuY2xhc3NOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVsZW1lbnQuY2xhc3NOYW1lIGlzIGFyb3VuZCAxNSUgZmFzdGVyIHRoZW4gc2V0L2dldEF0dHJpYnV0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IE5lZWQgc29tZSBqc3BlcmYgdGVzdHMgb24gcGVyZm9ybWFuY2UgLSBjYW4gd2UgZ2V0IHJpZCBvZiB0aGUgcmVnZXggYW5kIG1heWJlIHVzZSBzcGxpdCAvIGFycmF5IG1hbmlwdWxhdGlvbj9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lLnRvU3RyaW5nKCkucmVwbGFjZShuZXcgUmVnRXhwKFwiKF58XFxcXHMpXCIgKyBjbGFzc05hbWUuc3BsaXQoXCIgXCIpLmpvaW4oXCJ8XCIpICsgXCIoXFxcXHN8JClcIiwgXCJnaVwiKSwgXCIgXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXb3JrIGFyb3VuZCBmb3IgSUUgc3RyaWN0IG1vZGUgYW5pbWF0aW5nIFNWRyAtIGFuZCBhbnl0aGluZyBlbHNlIHRoYXQgZG9lc24ndCBiZWhhdmUgY29ycmVjdGx5IC0gdGhlIHNhbWUgd2F5IGpRdWVyeSBkb2VzIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRDbGFzcyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKElFIDw9IDcgPyBcImNsYXNzTmFtZVwiIDogXCJjbGFzc1wiKSB8fCBcIlwiO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBjdXJyZW50Q2xhc3MucmVwbGFjZShuZXcgUmVnRXhwKFwiKF58XFxzKVwiICsgY2xhc3NOYW1lLnNwbGl0KFwiIFwiKS5qb2luKFwifFwiKSArIFwiKFxcc3wkKVwiLCBcImdpXCIpLCBcIiBcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgU3R5bGUgR2V0dGluZyAmIFNldHRpbmdcbiAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAvKiBUaGUgc2luZ3VsYXIgZ2V0UHJvcGVydHlWYWx1ZSwgd2hpY2ggcm91dGVzIHRoZSBsb2dpYyBmb3IgYWxsIG5vcm1hbGl6YXRpb25zLCBob29rcywgYW5kIHN0YW5kYXJkIENTUyBwcm9wZXJ0aWVzLiAqL1xuICAgICAgICAgICAgZ2V0UHJvcGVydHlWYWx1ZTogZnVuY3Rpb24oZWxlbWVudCwgcHJvcGVydHksIHJvb3RQcm9wZXJ0eVZhbHVlLCBmb3JjZVN0eWxlTG9va3VwKSB7XG4gICAgICAgICAgICAgICAgLyogR2V0IGFuIGVsZW1lbnQncyBjb21wdXRlZCBwcm9wZXJ0eSB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAvKiBOb3RlOiBSZXRyaWV2aW5nIHRoZSB2YWx1ZSBvZiBhIENTUyBwcm9wZXJ0eSBjYW5ub3Qgc2ltcGx5IGJlIHBlcmZvcm1lZCBieSBjaGVja2luZyBhbiBlbGVtZW50J3NcbiAgICAgICAgICAgICAgICAgc3R5bGUgYXR0cmlidXRlICh3aGljaCBvbmx5IHJlZmxlY3RzIHVzZXItZGVmaW5lZCB2YWx1ZXMpLiBJbnN0ZWFkLCB0aGUgYnJvd3NlciBtdXN0IGJlIHF1ZXJpZWQgZm9yIGEgcHJvcGVydHknc1xuICAgICAgICAgICAgICAgICAqY29tcHV0ZWQqIHZhbHVlLiBZb3UgY2FuIHJlYWQgbW9yZSBhYm91dCBnZXRDb21wdXRlZFN0eWxlIGhlcmU6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL2RvY3MvV2ViL0FQSS93aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSAqL1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNvbXB1dGVQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFdoZW4gYm94LXNpemluZyBpc24ndCBzZXQgdG8gYm9yZGVyLWJveCwgaGVpZ2h0IGFuZCB3aWR0aCBzdHlsZSB2YWx1ZXMgYXJlIGluY29ycmVjdGx5IGNvbXB1dGVkIHdoZW4gYW5cbiAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQncyBzY3JvbGxiYXJzIGFyZSB2aXNpYmxlICh3aGljaCBleHBhbmRzIHRoZSBlbGVtZW50J3MgZGltZW5zaW9ucykuIFRodXMsIHdlIGRlZmVyIHRvIHRoZSBtb3JlIGFjY3VyYXRlXG4gICAgICAgICAgICAgICAgICAgICBvZmZzZXRIZWlnaHQvV2lkdGggcHJvcGVydHksIHdoaWNoIGluY2x1ZGVzIHRoZSB0b3RhbCBkaW1lbnNpb25zIGZvciBpbnRlcmlvciwgYm9yZGVyLCBwYWRkaW5nLCBhbmQgc2Nyb2xsYmFyLlxuICAgICAgICAgICAgICAgICAgICAgV2Ugc3VidHJhY3QgYm9yZGVyIGFuZCBwYWRkaW5nIHRvIGdldCB0aGUgc3VtIG9mIGludGVyaW9yICsgc2Nyb2xsYmFyLiAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29tcHV0ZWRWYWx1ZSA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogSUU8PTggZG9lc24ndCBzdXBwb3J0IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlLCB0aHVzIHdlIGRlZmVyIHRvIGpRdWVyeSwgd2hpY2ggaGFzIGFuIGV4dGVuc2l2ZSBhcnJheVxuICAgICAgICAgICAgICAgICAgICAgb2YgaGFja3MgdG8gYWNjdXJhdGVseSByZXRyaWV2ZSBJRTggcHJvcGVydHkgdmFsdWVzLiBSZS1pbXBsZW1lbnRpbmcgdGhhdCBsb2dpYyBoZXJlIGlzIG5vdCB3b3J0aCBibG9hdGluZyB0aGVcbiAgICAgICAgICAgICAgICAgICAgIGNvZGViYXNlIGZvciBhIGR5aW5nIGJyb3dzZXIuIFRoZSBwZXJmb3JtYW5jZSByZXBlcmN1c3Npb25zIG9mIHVzaW5nIGpRdWVyeSBoZXJlIGFyZSBtaW5pbWFsIHNpbmNlXG4gICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eSBpcyBvcHRpbWl6ZWQgdG8gcmFyZWx5IChhbmQgc29tZXRpbWVzIG5ldmVyKSBxdWVyeSB0aGUgRE9NLiBGdXJ0aGVyLCB0aGUgJC5jc3MoKSBjb2RlcGF0aCBpc24ndCB0aGF0IHNsb3cuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChJRSA8PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFZhbHVlID0gJC5jc3MoZWxlbWVudCwgcHJvcGVydHkpOyAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFsbCBvdGhlciBicm93c2VycyBzdXBwb3J0IGdldENvbXB1dGVkU3R5bGUuIFRoZSByZXR1cm5lZCBsaXZlIG9iamVjdCByZWZlcmVuY2UgaXMgY2FjaGVkIG9udG8gaXRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgYXNzb2NpYXRlZCBlbGVtZW50IHNvIHRoYXQgaXQgZG9lcyBub3QgbmVlZCB0byBiZSByZWZldGNoZWQgdXBvbiBldmVyeSBHRVQuICovXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBCcm93c2VycyBkbyBub3QgcmV0dXJuIGhlaWdodCBhbmQgd2lkdGggdmFsdWVzIGZvciBlbGVtZW50cyB0aGF0IGFyZSBzZXQgdG8gZGlzcGxheTpcIm5vbmVcIi4gVGh1cywgd2UgdGVtcG9yYXJpbHlcbiAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGUgZGlzcGxheSB0byB0aGUgZWxlbWVudCB0eXBlJ3MgZGVmYXVsdCB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b2dnbGVEaXNwbGF5ID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgvXih3aWR0aHxoZWlnaHQpJC8udGVzdChwcm9wZXJ0eSkgJiYgQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJkaXNwbGF5XCIpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlRGlzcGxheSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLnNldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJkaXNwbGF5XCIsIENTUy5WYWx1ZXMuZ2V0RGlzcGxheVR5cGUoZWxlbWVudCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmV2ZXJ0RGlzcGxheSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2dnbGVEaXNwbGF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENTUy5zZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmb3JjZVN0eWxlTG9va3VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09PSBcImhlaWdodFwiICYmIENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiYm94U2l6aW5nXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSAhPT0gXCJib3JkZXItYm94XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRlbnRCb3hIZWlnaHQgPSBlbGVtZW50Lm9mZnNldEhlaWdodCAtIChwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiYm9yZGVyVG9wV2lkdGhcIikpIHx8IDApIC0gKHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJib3JkZXJCb3R0b21XaWR0aFwiKSkgfHwgMCkgLSAocGFyc2VGbG9hdChDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcInBhZGRpbmdUb3BcIikpIHx8IDApIC0gKHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJwYWRkaW5nQm90dG9tXCIpKSB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV2ZXJ0RGlzcGxheSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250ZW50Qm94SGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcGVydHkgPT09IFwid2lkdGhcIiAmJiBDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcImJveFNpemluZ1wiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkgIT09IFwiYm9yZGVyLWJveFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb250ZW50Qm94V2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoIC0gKHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJib3JkZXJMZWZ0V2lkdGhcIikpIHx8IDApIC0gKHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJib3JkZXJSaWdodFdpZHRoXCIpKSB8fCAwKSAtIChwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwicGFkZGluZ0xlZnRcIikpIHx8IDApIC0gKHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJwYWRkaW5nUmlnaHRcIikpIHx8IDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXZlcnREaXNwbGF5KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnRCb3hXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb21wdXRlZFN0eWxlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBGb3IgZWxlbWVudHMgdGhhdCBWZWxvY2l0eSBoYXNuJ3QgYmVlbiBjYWxsZWQgb24gZGlyZWN0bHkgKGUuZy4gd2hlbiBWZWxvY2l0eSBxdWVyaWVzIHRoZSBET00gb24gYmVoYWxmXG4gICAgICAgICAgICAgICAgICAgICAgICAgb2YgYSBwYXJlbnQgb2YgYW4gZWxlbWVudCBpdHMgYW5pbWF0aW5nKSwgcGVyZm9ybSBhIGRpcmVjdCBnZXRDb21wdXRlZFN0eWxlIGxvb2t1cCBzaW5jZSB0aGUgb2JqZWN0IGlzbid0IGNhY2hlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChEYXRhKGVsZW1lbnQpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCk7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBjb21wdXRlZFN0eWxlIG9iamVjdCBoYXMgeWV0IHRvIGJlIGNhY2hlZCwgZG8gc28gbm93LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghRGF0YShlbGVtZW50KS5jb21wdXRlZFN0eWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcHV0ZWRTdHlsZSA9IERhdGEoZWxlbWVudCkuY29tcHV0ZWRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpOyAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiBjb21wdXRlZFN0eWxlIGlzIGNhY2hlZCwgdXNlIGl0LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFN0eWxlID0gRGF0YShlbGVtZW50KS5jb21wdXRlZFN0eWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJRSBhbmQgRmlyZWZveCBkbyBub3QgcmV0dXJuIGEgdmFsdWUgZm9yIHRoZSBnZW5lcmljIGJvcmRlckNvbG9yIC0tIHRoZXkgb25seSByZXR1cm4gaW5kaXZpZHVhbCB2YWx1ZXMgZm9yIGVhY2ggYm9yZGVyIHNpZGUncyBjb2xvci5cbiAgICAgICAgICAgICAgICAgICAgICAgICBBbHNvLCBpbiBhbGwgYnJvd3NlcnMsIHdoZW4gYm9yZGVyIGNvbG9ycyBhcmVuJ3QgYWxsIHRoZSBzYW1lLCBhIGNvbXBvdW5kIHZhbHVlIGlzIHJldHVybmVkIHRoYXQgVmVsb2NpdHkgaXNuJ3Qgc2V0dXAgdG8gcGFyc2UuXG4gICAgICAgICAgICAgICAgICAgICAgICAgU28sIGFzIGEgcG9seWZpbGwgZm9yIHF1ZXJ5aW5nIGluZGl2aWR1YWwgYm9yZGVyIHNpZGUgY29sb3JzLCB3ZSBqdXN0IHJldHVybiB0aGUgdG9wIGJvcmRlcidzIGNvbG9yIGFuZCBhbmltYXRlIGFsbCBib3JkZXJzIGZyb20gdGhhdCB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJib3JkZXJDb2xvclwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkgPSBcImJvcmRlclRvcENvbG9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElFOSBoYXMgYSBidWcgaW4gd2hpY2ggdGhlIFwiZmlsdGVyXCIgcHJvcGVydHkgbXVzdCBiZSBhY2Nlc3NlZCBmcm9tIGNvbXB1dGVkU3R5bGUgdXNpbmcgdGhlIGdldFByb3BlcnR5VmFsdWUgbWV0aG9kXG4gICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGVhZCBvZiBhIGRpcmVjdCBwcm9wZXJ0eSBsb29rdXAuIFRoZSBnZXRQcm9wZXJ0eVZhbHVlIG1ldGhvZCBpcyBzbG93ZXIgdGhhbiBhIGRpcmVjdCBsb29rdXAsIHdoaWNoIGlzIHdoeSB3ZSBhdm9pZCBpdCBieSBkZWZhdWx0LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKElFID09PSA5ICYmIHByb3BlcnR5ID09PSBcImZpbHRlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcHV0ZWRWYWx1ZSA9IGNvbXB1dGVkU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eSk7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFZhbHVlID0gY29tcHV0ZWRTdHlsZVtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZhbGwgYmFjayB0byB0aGUgcHJvcGVydHkncyBzdHlsZSB2YWx1ZSAoaWYgZGVmaW5lZCkgd2hlbiBjb21wdXRlZFZhbHVlIHJldHVybnMgbm90aGluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICB3aGljaCBjYW4gaGFwcGVuIHdoZW4gdGhlIGVsZW1lbnQgaGFzbid0IGJlZW4gcGFpbnRlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wdXRlZFZhbHVlID09PSBcIlwiIHx8IGNvbXB1dGVkVmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFZhbHVlID0gZWxlbWVudC5zdHlsZVtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldmVydERpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIEZvciB0b3AsIHJpZ2h0LCBib3R0b20sIGFuZCBsZWZ0IChUUkJMKSB2YWx1ZXMgdGhhdCBhcmUgc2V0IHRvIFwiYXV0b1wiIG9uIGVsZW1lbnRzIG9mIFwiZml4ZWRcIiBvciBcImFic29sdXRlXCIgcG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICBkZWZlciB0byBqUXVlcnkgZm9yIGNvbnZlcnRpbmcgXCJhdXRvXCIgdG8gYSBudW1lcmljIHZhbHVlLiAoRm9yIGVsZW1lbnRzIHdpdGggYSBcInN0YXRpY1wiIG9yIFwicmVsYXRpdmVcIiBwb3NpdGlvbiwgXCJhdXRvXCIgaGFzIHRoZSBzYW1lXG4gICAgICAgICAgICAgICAgICAgICBlZmZlY3QgYXMgYmVpbmcgc2V0IHRvIDAsIHNvIG5vIGNvbnZlcnNpb24gaXMgbmVjZXNzYXJ5LikgKi9cbiAgICAgICAgICAgICAgICAgICAgLyogQW4gZXhhbXBsZSBvZiB3aHkgbnVtZXJpYyBjb252ZXJzaW9uIGlzIG5lY2Vzc2FyeTogV2hlbiBhbiBlbGVtZW50IHdpdGggXCJwb3NpdGlvbjphYnNvbHV0ZVwiIGhhcyBhbiB1bnRvdWNoZWQgXCJsZWZ0XCJcbiAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5LCB3aGljaCByZXZlcnRzIHRvIFwiYXV0b1wiLCBsZWZ0J3MgdmFsdWUgaXMgMCByZWxhdGl2ZSB0byBpdHMgcGFyZW50IGVsZW1lbnQsIGJ1dCBpcyBvZnRlbiBub24temVybyByZWxhdGl2ZVxuICAgICAgICAgICAgICAgICAgICAgdG8gaXRzICpjb250YWluaW5nKiAobm90IHBhcmVudCkgZWxlbWVudCwgd2hpY2ggaXMgdGhlIG5lYXJlc3QgXCJwb3NpdGlvbjpyZWxhdGl2ZVwiIGFuY2VzdG9yIG9yIHRoZSB2aWV3cG9ydCAoYW5kIGFsd2F5cyB0aGUgdmlld3BvcnQgaW4gdGhlIGNhc2Ugb2YgXCJwb3NpdGlvbjpmaXhlZFwiKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXB1dGVkVmFsdWUgPT09IFwiYXV0b1wiICYmIC9eKHRvcHxyaWdodHxib3R0b218bGVmdCkkL2kudGVzdChwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IGNvbXB1dGVQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwicG9zaXRpb25cIik7IC8qIEdFVCAqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBGb3IgYWJzb2x1dGUgcG9zaXRpb25pbmcsIGpRdWVyeSdzICQucG9zaXRpb24oKSBvbmx5IHJldHVybnMgdmFsdWVzIGZvciB0b3AgYW5kIGxlZnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQgYW5kIGJvdHRvbSB3aWxsIGhhdmUgdGhlaXIgXCJhdXRvXCIgdmFsdWUgcmV2ZXJ0ZWQgdG8gMC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IEEgalF1ZXJ5IG9iamVjdCBtdXN0IGJlIGNyZWF0ZWQgaGVyZSBzaW5jZSBqUXVlcnkgZG9lc24ndCBoYXZlIGEgbG93LWxldmVsIGFsaWFzIGZvciAkLnBvc2l0aW9uKCkuXG4gICAgICAgICAgICAgICAgICAgICAgICAgTm90IGEgYmlnIGRlYWwgc2luY2Ugd2UncmUgY3VycmVudGx5IGluIGEgR0VUIGJhdGNoIGFueXdheS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb3NpdGlvbiA9PT0gXCJmaXhlZFwiIHx8IChwb3NpdGlvbiA9PT0gXCJhYnNvbHV0ZVwiICYmIC90b3B8bGVmdC9pLnRlc3QocHJvcGVydHkpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IGpRdWVyeSBzdHJpcHMgdGhlIHBpeGVsIHVuaXQgZnJvbSBpdHMgcmV0dXJuZWQgdmFsdWVzOyB3ZSByZS1hZGQgaXQgaGVyZSB0byBjb25mb3JtIHdpdGggY29tcHV0ZVByb3BlcnR5VmFsdWUncyBiZWhhdmlvci4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFZhbHVlID0gJChlbGVtZW50KS5wb3NpdGlvbigpW3Byb3BlcnR5XSArIFwicHhcIjsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcHV0ZWRWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlWYWx1ZTtcblxuICAgICAgICAgICAgICAgIC8qIElmIHRoaXMgaXMgYSBob29rZWQgcHJvcGVydHkgKGUuZy4gXCJjbGlwTGVmdFwiIGluc3RlYWQgb2YgdGhlIHJvb3QgcHJvcGVydHkgb2YgXCJjbGlwXCIpLFxuICAgICAgICAgICAgICAgICBleHRyYWN0IHRoZSBob29rJ3MgdmFsdWUgZnJvbSBhIG5vcm1hbGl6ZWQgcm9vdFByb3BlcnR5VmFsdWUgdXNpbmcgQ1NTLkhvb2tzLmV4dHJhY3RWYWx1ZSgpLiAqL1xuICAgICAgICAgICAgICAgIGlmIChDU1MuSG9va3MucmVnaXN0ZXJlZFtwcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhvb2sgPSBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2tSb290ID0gQ1NTLkhvb2tzLmdldFJvb3QoaG9vayk7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogSWYgYSBjYWNoZWQgcm9vdFByb3BlcnR5VmFsdWUgd2Fzbid0IHBhc3NlZCBpbiAod2hpY2ggVmVsb2NpdHkgYWx3YXlzIGF0dGVtcHRzIHRvIGRvIGluIG9yZGVyIHRvIGF2b2lkIHJlcXVlcnlpbmcgdGhlIERPTSksXG4gICAgICAgICAgICAgICAgICAgICBxdWVyeSB0aGUgRE9NIGZvciB0aGUgcm9vdCBwcm9wZXJ0eSdzIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAocm9vdFByb3BlcnR5VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogU2luY2UgdGhlIGJyb3dzZXIgaXMgbm93IGJlaW5nIGRpcmVjdGx5IHF1ZXJpZWQsIHVzZSB0aGUgb2ZmaWNpYWwgcG9zdC1wcmVmaXhpbmcgcHJvcGVydHkgbmFtZSBmb3IgdGhpcyBsb29rdXAuICovXG4gICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSA9IENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIENTUy5OYW1lcy5wcmVmaXhDaGVjayhob29rUm9vdClbMF0pOyAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIHRoaXMgcm9vdCBoYXMgYSBub3JtYWxpemF0aW9uIHJlZ2lzdGVyZWQsIHBlZm9ybSB0aGUgYXNzb2NpYXRlZCBub3JtYWxpemF0aW9uIGV4dHJhY3Rpb24uICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtob29rUm9vdF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlID0gQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbaG9va1Jvb3RdKFwiZXh0cmFjdFwiLCBlbGVtZW50LCByb290UHJvcGVydHlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKiBFeHRyYWN0IHRoZSBob29rJ3MgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSBDU1MuSG9va3MuZXh0cmFjdFZhbHVlKGhvb2ssIHJvb3RQcm9wZXJ0eVZhbHVlKTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGlzIGlzIGEgbm9ybWFsaXplZCBwcm9wZXJ0eSAoZS5nLiBcIm9wYWNpdHlcIiBiZWNvbWVzIFwiZmlsdGVyXCIgaW4gPD1JRTgpIG9yIFwidHJhbnNsYXRlWFwiIGJlY29tZXMgXCJ0cmFuc2Zvcm1cIiksXG4gICAgICAgICAgICAgICAgICAgICBub3JtYWxpemUgdGhlIHByb3BlcnR5J3MgbmFtZSBhbmQgdmFsdWUsIGFuZCBoYW5kbGUgdGhlIHNwZWNpYWwgY2FzZSBvZiB0cmFuc2Zvcm1zLiAqL1xuICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBOb3JtYWxpemluZyBhIHByb3BlcnR5IGlzIG11dHVhbGx5IGV4Y2x1c2l2ZSBmcm9tIGhvb2tpbmcgYSBwcm9wZXJ0eSBzaW5jZSBob29rLWV4dHJhY3RlZCB2YWx1ZXMgYXJlIHN0cmljdGx5XG4gICAgICAgICAgICAgICAgICAgICBudW1lcmljYWwgYW5kIHRoZXJlZm9yZSBkbyBub3QgcmVxdWlyZSBub3JtYWxpemF0aW9uIGV4dHJhY3Rpb24uICovXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtwcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vcm1hbGl6ZWRQcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkUHJvcGVydHlWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkUHJvcGVydHlOYW1lID0gQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbcHJvcGVydHldKFwibmFtZVwiLCBlbGVtZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBUcmFuc2Zvcm0gdmFsdWVzIGFyZSBjYWxjdWxhdGVkIHZpYSBub3JtYWxpemF0aW9uIGV4dHJhY3Rpb24gKHNlZSBiZWxvdyksIHdoaWNoIGNoZWNrcyBhZ2FpbnN0IHRoZSBlbGVtZW50J3MgdHJhbnNmb3JtQ2FjaGUuXG4gICAgICAgICAgICAgICAgICAgICBBdCBubyBwb2ludCBkbyB0cmFuc2Zvcm0gR0VUcyBldmVyIGFjdHVhbGx5IHF1ZXJ5IHRoZSBET007IGluaXRpYWwgc3R5bGVzaGVldCB2YWx1ZXMgYXJlIG5ldmVyIHByb2Nlc3NlZC5cbiAgICAgICAgICAgICAgICAgICAgIFRoaXMgaXMgYmVjYXVzZSBwYXJzaW5nIDNEIHRyYW5zZm9ybSBtYXRyaWNlcyBpcyBub3QgYWx3YXlzIGFjY3VyYXRlIGFuZCB3b3VsZCBibG9hdCBvdXIgY29kZWJhc2U7XG4gICAgICAgICAgICAgICAgICAgICB0aHVzLCBub3JtYWxpemF0aW9uIGV4dHJhY3Rpb24gZGVmYXVsdHMgaW5pdGlhbCB0cmFuc2Zvcm0gdmFsdWVzIHRvIHRoZWlyIHplcm8tdmFsdWVzIChlLmcuIDEgZm9yIHNjYWxlWCBhbmQgMCBmb3IgdHJhbnNsYXRlWCkuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChub3JtYWxpemVkUHJvcGVydHlOYW1lICE9PSBcInRyYW5zZm9ybVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkUHJvcGVydHlWYWx1ZSA9IGNvbXB1dGVQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIENTUy5OYW1lcy5wcmVmaXhDaGVjayhub3JtYWxpemVkUHJvcGVydHlOYW1lKVswXSk7IC8qIEdFVCAqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgdmFsdWUgaXMgYSBDU1MgbnVsbC12YWx1ZSBhbmQgdGhpcyBwcm9wZXJ0eSBoYXMgYSBob29rIHRlbXBsYXRlLCB1c2UgdGhhdCB6ZXJvLXZhbHVlIHRlbXBsYXRlIHNvIHRoYXQgaG9va3MgY2FuIGJlIGV4dHJhY3RlZCBmcm9tIGl0LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5WYWx1ZXMuaXNDU1NOdWxsVmFsdWUobm9ybWFsaXplZFByb3BlcnR5VmFsdWUpICYmIENTUy5Ib29rcy50ZW1wbGF0ZXNbcHJvcGVydHldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZFByb3BlcnR5VmFsdWUgPSBDU1MuSG9va3MudGVtcGxhdGVzW3Byb3BlcnR5XVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtwcm9wZXJ0eV0oXCJleHRyYWN0XCIsIGVsZW1lbnQsIG5vcm1hbGl6ZWRQcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiBJZiBhIChudW1lcmljKSB2YWx1ZSB3YXNuJ3QgcHJvZHVjZWQgdmlhIGhvb2sgZXh0cmFjdGlvbiBvciBub3JtYWxpemF0aW9uLCBxdWVyeSB0aGUgRE9NLiAqL1xuICAgICAgICAgICAgICAgIGlmICghL15bXFxkLV0vLnRlc3QocHJvcGVydHlWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogRm9yIFNWRyBlbGVtZW50cywgZGltZW5zaW9uYWwgcHJvcGVydGllcyAod2hpY2ggU1ZHQXR0cmlidXRlKCkgZGV0ZWN0cykgYXJlIHR3ZWVuZWQgdmlhXG4gICAgICAgICAgICAgICAgICAgICB0aGVpciBIVE1MIGF0dHJpYnV0ZSB2YWx1ZXMgaW5zdGVhZCBvZiB0aGVpciBDU1Mgc3R5bGUgdmFsdWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IERhdGEoZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5pc1NWRyAmJiBDU1MuTmFtZXMuU1ZHQXR0cmlidXRlKHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogU2luY2UgdGhlIGhlaWdodC93aWR0aCBhdHRyaWJ1dGUgdmFsdWVzIG11c3QgYmUgc2V0IG1hbnVhbGx5LCB0aGV5IGRvbid0IHJlZmxlY3QgY29tcHV0ZWQgdmFsdWVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgIFRodXMsIHdlIHVzZSB1c2UgZ2V0QkJveCgpIHRvIGVuc3VyZSB3ZSBhbHdheXMgZ2V0IHZhbHVlcyBmb3IgZWxlbWVudHMgd2l0aCB1bmRlZmluZWQgaGVpZ2h0L3dpZHRoIGF0dHJpYnV0ZXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoL14oaGVpZ2h0fHdpZHRoKSQvaS50ZXN0KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZpcmVmb3ggdGhyb3dzIGFuIGVycm9yIGlmIC5nZXRCQm94KCkgaXMgY2FsbGVkIG9uIGFuIFNWRyB0aGF0IGlzbid0IGF0dGFjaGVkIHRvIHRoZSBET00uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IGVsZW1lbnQuZ2V0QkJveCgpW3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogT3RoZXJ3aXNlLCBhY2Nlc3MgdGhlIGF0dHJpYnV0ZSB2YWx1ZSBkaXJlY3RseS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKHByb3BlcnR5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSBjb21wdXRlUHJvcGVydHlWYWx1ZShlbGVtZW50LCBDU1MuTmFtZXMucHJlZml4Q2hlY2socHJvcGVydHkpWzBdKTsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiBTaW5jZSBwcm9wZXJ0eSBsb29rdXBzIGFyZSBmb3IgYW5pbWF0aW9uIHB1cnBvc2VzICh3aGljaCBlbnRhaWxzIGNvbXB1dGluZyB0aGUgbnVtZXJpYyBkZWx0YSBiZXR3ZWVuIHN0YXJ0IGFuZCBlbmQgdmFsdWVzKSxcbiAgICAgICAgICAgICAgICAgY29udmVydCBDU1MgbnVsbC12YWx1ZXMgdG8gYW4gaW50ZWdlciBvZiB2YWx1ZSAwLiAqL1xuICAgICAgICAgICAgICAgIGlmIChDU1MuVmFsdWVzLmlzQ1NTTnVsbFZhbHVlKHByb3BlcnR5VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5kZWJ1ZyA+PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2V0IFwiICsgcHJvcGVydHkgKyBcIjogXCIgKyBwcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiBUaGUgc2luZ3VsYXIgc2V0UHJvcGVydHlWYWx1ZSwgd2hpY2ggcm91dGVzIHRoZSBsb2dpYyBmb3IgYWxsIG5vcm1hbGl6YXRpb25zLCBob29rcywgYW5kIHN0YW5kYXJkIENTUyBwcm9wZXJ0aWVzLiAqL1xuICAgICAgICAgICAgc2V0UHJvcGVydHlWYWx1ZTogZnVuY3Rpb24oZWxlbWVudCwgcHJvcGVydHksIHByb3BlcnR5VmFsdWUsIHJvb3RQcm9wZXJ0eVZhbHVlLCBzY3JvbGxEYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5TmFtZSA9IHByb3BlcnR5O1xuXG4gICAgICAgICAgICAgICAgLyogSW4gb3JkZXIgdG8gYmUgc3ViamVjdGVkIHRvIGNhbGwgb3B0aW9ucyBhbmQgZWxlbWVudCBxdWV1ZWluZywgc2Nyb2xsIGFuaW1hdGlvbiBpcyByb3V0ZWQgdGhyb3VnaCBWZWxvY2l0eSBhcyBpZiBpdCB3ZXJlIGEgc3RhbmRhcmQgQ1NTIHByb3BlcnR5LiAqL1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJzY3JvbGxcIikge1xuICAgICAgICAgICAgICAgICAgICAvKiBJZiBhIGNvbnRhaW5lciBvcHRpb24gaXMgcHJlc2VudCwgc2Nyb2xsIHRoZSBjb250YWluZXIgaW5zdGVhZCBvZiB0aGUgYnJvd3NlciB3aW5kb3cuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChzY3JvbGxEYXRhLmNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsRGF0YS5jb250YWluZXJbXCJzY3JvbGxcIiArIHNjcm9sbERhdGEuZGlyZWN0aW9uXSA9IHByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBPdGhlcndpc2UsIFZlbG9jaXR5IGRlZmF1bHRzIHRvIHNjcm9sbGluZyB0aGUgYnJvd3NlciB3aW5kb3cuICovXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsRGF0YS5kaXJlY3Rpb24gPT09IFwiTGVmdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKHByb3BlcnR5VmFsdWUsIHNjcm9sbERhdGEuYWx0ZXJuYXRlVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oc2Nyb2xsRGF0YS5hbHRlcm5hdGVWYWx1ZSwgcHJvcGVydHlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvKiBUcmFuc2Zvcm1zICh0cmFuc2xhdGVYLCByb3RhdGVaLCBldGMuKSBhcmUgYXBwbGllZCB0byBhIHBlci1lbGVtZW50IHRyYW5zZm9ybUNhY2hlIG9iamVjdCwgd2hpY2ggaXMgbWFudWFsbHkgZmx1c2hlZCB2aWEgZmx1c2hUcmFuc2Zvcm1DYWNoZSgpLlxuICAgICAgICAgICAgICAgICAgICAgVGh1cywgZm9yIG5vdywgd2UgbWVyZWx5IGNhY2hlIHRyYW5zZm9ybXMgYmVpbmcgU0VULiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbcHJvcGVydHldICYmIENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW3Byb3BlcnR5XShcIm5hbWVcIiwgZWxlbWVudCkgPT09IFwidHJhbnNmb3JtXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFBlcmZvcm0gYSBub3JtYWxpemF0aW9uIGluamVjdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFRoZSBub3JtYWxpemF0aW9uIGxvZ2ljIGhhbmRsZXMgdGhlIHRyYW5zZm9ybUNhY2hlIHVwZGF0aW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbcHJvcGVydHldKFwiaW5qZWN0XCIsIGVsZW1lbnQsIHByb3BlcnR5VmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUgPSBcInRyYW5zZm9ybVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IERhdGEoZWxlbWVudCkudHJhbnNmb3JtQ2FjaGVbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogSW5qZWN0IGhvb2tzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5Ib29rcy5yZWdpc3RlcmVkW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBob29rTmFtZSA9IHByb3BlcnR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rUm9vdCA9IENTUy5Ib29rcy5nZXRSb290KHByb3BlcnR5KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIGEgY2FjaGVkIHJvb3RQcm9wZXJ0eVZhbHVlIHdhcyBub3QgcHJvdmlkZWQsIHF1ZXJ5IHRoZSBET00gZm9yIHRoZSBob29rUm9vdCdzIGN1cnJlbnQgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWUgPSByb290UHJvcGVydHlWYWx1ZSB8fCBDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBob29rUm9vdCk7IC8qIEdFVCAqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IENTUy5Ib29rcy5pbmplY3RWYWx1ZShob29rTmFtZSwgcHJvcGVydHlWYWx1ZSwgcm9vdFByb3BlcnR5VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gaG9va1Jvb3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vcm1hbGl6ZSBuYW1lcyBhbmQgdmFsdWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtwcm9wZXJ0eV0oXCJpbmplY3RcIiwgZWxlbWVudCwgcHJvcGVydHlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkgPSBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtwcm9wZXJ0eV0oXCJuYW1lXCIsIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBBc3NpZ24gdGhlIGFwcHJvcHJpYXRlIHZlbmRvciBwcmVmaXggYmVmb3JlIHBlcmZvcm1pbmcgYW4gb2ZmaWNpYWwgc3R5bGUgdXBkYXRlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lID0gQ1NTLk5hbWVzLnByZWZpeENoZWNrKHByb3BlcnR5KVswXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogQSB0cnkvY2F0Y2ggaXMgdXNlZCBmb3IgSUU8PTgsIHdoaWNoIHRocm93cyBhbiBlcnJvciB3aGVuIFwiaW52YWxpZFwiIENTUyB2YWx1ZXMgYXJlIHNldCwgZS5nLiBhIG5lZ2F0aXZlIHdpZHRoLlxuICAgICAgICAgICAgICAgICAgICAgICAgIFRyeS9jYXRjaCBpcyBhdm9pZGVkIGZvciBvdGhlciBicm93c2VycyBzaW5jZSBpdCBpbmN1cnMgYSBwZXJmb3JtYW5jZSBvdmVyaGVhZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChJRSA8PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtwcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkuZGVidWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IFtcIiArIHByb3BlcnR5VmFsdWUgKyBcIl0gZm9yIFtcIiArIHByb3BlcnR5TmFtZSArIFwiXVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTVkcgZWxlbWVudHMgaGF2ZSB0aGVpciBkaW1lbnNpb25hbCBwcm9wZXJ0aWVzICh3aWR0aCwgaGVpZ2h0LCB4LCB5LCBjeCwgZXRjLikgYXBwbGllZCBkaXJlY3RseSBhcyBhdHRyaWJ1dGVzIGluc3RlYWQgb2YgYXMgc3R5bGVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IElFOCBkb2VzIG5vdCBzdXBwb3J0IFNWRyBlbGVtZW50cywgc28gaXQncyBva2F5IHRoYXQgd2Ugc2tpcCBpdCBmb3IgU1ZHIGFuaW1hdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBEYXRhKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5pc1NWRyAmJiBDU1MuTmFtZXMuU1ZHQXR0cmlidXRlKHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBGb3IgU1ZHIGF0dHJpYnV0ZXMsIHZlbmRvci1wcmVmaXhlZCBwcm9wZXJ0eSBuYW1lcyBhcmUgbmV2ZXIgdXNlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogTm90IGFsbCBDU1MgcHJvcGVydGllcyBjYW4gYmUgYW5pbWF0ZWQgdmlhIGF0dHJpYnV0ZXMsIGJ1dCB0aGUgYnJvd3NlciB3b24ndCB0aHJvdyBhbiBlcnJvciBmb3IgdW5zdXBwb3J0ZWQgcHJvcGVydGllcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUocHJvcGVydHksIHByb3BlcnR5VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbcHJvcGVydHlOYW1lXSA9IHByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkuZGVidWcgPj0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2V0IFwiICsgcHJvcGVydHkgKyBcIiAoXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIik6IFwiICsgcHJvcGVydHlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiBSZXR1cm4gdGhlIG5vcm1hbGl6ZWQgcHJvcGVydHkgbmFtZSBhbmQgdmFsdWUgaW4gY2FzZSB0aGUgY2FsbGVyIHdhbnRzIHRvIGtub3cgaG93IHRoZXNlIHZhbHVlcyB3ZXJlIG1vZGlmaWVkIGJlZm9yZSBiZWluZyBhcHBsaWVkIHRvIHRoZSBET00uICovXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VmFsdWVdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qIFRvIGluY3JlYXNlIHBlcmZvcm1hbmNlIGJ5IGJhdGNoaW5nIHRyYW5zZm9ybSB1cGRhdGVzIGludG8gYSBzaW5nbGUgU0VULCB0cmFuc2Zvcm1zIGFyZSBub3QgZGlyZWN0bHkgYXBwbGllZCB0byBhbiBlbGVtZW50IHVudGlsIGZsdXNoVHJhbnNmb3JtQ2FjaGUoKSBpcyBjYWxsZWQuICovXG4gICAgICAgICAgICAvKiBOb3RlOiBWZWxvY2l0eSBhcHBsaWVzIHRyYW5zZm9ybSBwcm9wZXJ0aWVzIGluIHRoZSBzYW1lIG9yZGVyIHRoYXQgdGhleSBhcmUgY2hyb25vZ2ljYWxseSBpbnRyb2R1Y2VkIHRvIHRoZSBlbGVtZW50J3MgQ1NTIHN0eWxlcy4gKi9cbiAgICAgICAgICAgIGZsdXNoVHJhbnNmb3JtQ2FjaGU6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgdHJhbnNmb3JtU3RyaW5nID0gXCJcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IERhdGEoZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAvKiBDZXJ0YWluIGJyb3dzZXJzIHJlcXVpcmUgdGhhdCBTVkcgdHJhbnNmb3JtcyBiZSBhcHBsaWVkIGFzIGFuIGF0dHJpYnV0ZS4gSG93ZXZlciwgdGhlIFNWRyB0cmFuc2Zvcm0gYXR0cmlidXRlIHRha2VzIGEgbW9kaWZpZWQgdmVyc2lvbiBvZiBDU1MncyB0cmFuc2Zvcm0gc3RyaW5nXG4gICAgICAgICAgICAgICAgICh1bml0cyBhcmUgZHJvcHBlZCBhbmQsIGV4Y2VwdCBmb3Igc2tld1gvWSwgc3VicHJvcGVydGllcyBhcmUgbWVyZ2VkIGludG8gdGhlaXIgbWFzdGVyIHByb3BlcnR5IC0tIGUuZy4gc2NhbGVYIGFuZCBzY2FsZVkgYXJlIG1lcmdlZCBpbnRvIHNjYWxlKFggWSkuICovXG4gICAgICAgICAgICAgICAgaWYgKChJRSB8fCAoVmVsb2NpdHkuU3RhdGUuaXNBbmRyb2lkICYmICFWZWxvY2l0eS5TdGF0ZS5pc0Nocm9tZSkpICYmIGRhdGEgJiYgZGF0YS5pc1NWRykge1xuICAgICAgICAgICAgICAgICAgICAvKiBTaW5jZSB0cmFuc2Zvcm0gdmFsdWVzIGFyZSBzdG9yZWQgaW4gdGhlaXIgcGFyZW50aGVzZXMtd3JhcHBlZCBmb3JtLCB3ZSB1c2UgYSBoZWxwZXIgZnVuY3Rpb24gdG8gc3RyaXAgb3V0IHRoZWlyIG51bWVyaWMgdmFsdWVzLlxuICAgICAgICAgICAgICAgICAgICAgRnVydGhlciwgU1ZHIHRyYW5zZm9ybSBwcm9wZXJ0aWVzIG9ubHkgdGFrZSB1bml0bGVzcyAocmVwcmVzZW50aW5nIHBpeGVscykgdmFsdWVzLCBzbyBpdCdzIG9rYXkgdGhhdCBwYXJzZUZsb2F0KCkgc3RyaXBzIHRoZSB1bml0IHN1ZmZpeGVkIHRvIHRoZSBmbG9hdCB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIGdldFRyYW5zZm9ybUZsb2F0ID0gZnVuY3Rpb24odHJhbnNmb3JtUHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIHRyYW5zZm9ybVByb3BlcnR5KSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgLyogQ3JlYXRlIGFuIG9iamVjdCB0byBvcmdhbml6ZSBhbGwgdGhlIHRyYW5zZm9ybXMgdGhhdCB3ZSdsbCBhcHBseSB0byB0aGUgU1ZHIGVsZW1lbnQuIFRvIGtlZXAgdGhlIGxvZ2ljIHNpbXBsZSxcbiAgICAgICAgICAgICAgICAgICAgIHdlIHByb2Nlc3MgKmFsbCogdHJhbnNmb3JtIHByb3BlcnRpZXMgLS0gZXZlbiB0aG9zZSB0aGF0IG1heSBub3QgYmUgZXhwbGljaXRseSBhcHBsaWVkIChzaW5jZSB0aGV5IGRlZmF1bHQgdG8gdGhlaXIgemVyby12YWx1ZXMgYW55d2F5KS4gKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIFNWR1RyYW5zZm9ybXMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGU6IFtnZXRUcmFuc2Zvcm1GbG9hdChcInRyYW5zbGF0ZVhcIiksIGdldFRyYW5zZm9ybUZsb2F0KFwidHJhbnNsYXRlWVwiKV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBza2V3WDogW2dldFRyYW5zZm9ybUZsb2F0KFwic2tld1hcIildLCBza2V3WTogW2dldFRyYW5zZm9ybUZsb2F0KFwic2tld1lcIildLFxuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIHNjYWxlIHByb3BlcnR5IGlzIHNldCAobm9uLTEpLCB1c2UgdGhhdCB2YWx1ZSBmb3IgdGhlIHNjYWxlWCBhbmQgc2NhbGVZIHZhbHVlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzIGJlaGF2aW9yIG1pbWljcyB0aGUgcmVzdWx0IG9mIGFuaW1hdGluZyBhbGwgdGhlc2UgcHJvcGVydGllcyBhdCBvbmNlIG9uIEhUTUwgZWxlbWVudHMpLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IGdldFRyYW5zZm9ybUZsb2F0KFwic2NhbGVcIikgIT09IDEgPyBbZ2V0VHJhbnNmb3JtRmxvYXQoXCJzY2FsZVwiKSwgZ2V0VHJhbnNmb3JtRmxvYXQoXCJzY2FsZVwiKV0gOiBbZ2V0VHJhbnNmb3JtRmxvYXQoXCJzY2FsZVhcIiksIGdldFRyYW5zZm9ybUZsb2F0KFwic2NhbGVZXCIpXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFNWRydzIHJvdGF0ZSB0cmFuc2Zvcm0gdGFrZXMgdGhyZWUgdmFsdWVzOiByb3RhdGlvbiBkZWdyZWVzIGZvbGxvd2VkIGJ5IHRoZSBYIGFuZCBZIHZhbHVlc1xuICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmluaW5nIHRoZSByb3RhdGlvbidzIG9yaWdpbiBwb2ludC4gV2UgaWdub3JlIHRoZSBvcmlnaW4gdmFsdWVzIChkZWZhdWx0IHRoZW0gdG8gMCkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICByb3RhdGU6IFtnZXRUcmFuc2Zvcm1GbG9hdChcInJvdGF0ZVpcIiksIDAsIDBdXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgLyogSXRlcmF0ZSB0aHJvdWdoIHRoZSB0cmFuc2Zvcm0gcHJvcGVydGllcyBpbiB0aGUgdXNlci1kZWZpbmVkIHByb3BlcnR5IG1hcCBvcmRlci5cbiAgICAgICAgICAgICAgICAgICAgIChUaGlzIG1pbWljcyB0aGUgYmVoYXZpb3Igb2Ygbm9uLVNWRyB0cmFuc2Zvcm0gYW5pbWF0aW9uLikgKi9cbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKERhdGEoZWxlbWVudCkudHJhbnNmb3JtQ2FjaGUsIGZ1bmN0aW9uKHRyYW5zZm9ybU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEV4Y2VwdCBmb3Igd2l0aCBza2V3WC9ZLCByZXZlcnQgdGhlIGF4aXMtc3BlY2lmaWMgdHJhbnNmb3JtIHN1YnByb3BlcnRpZXMgdG8gdGhlaXIgYXhpcy1mcmVlIG1hc3RlclxuICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgc28gdGhhdCB0aGV5IG1hdGNoIHVwIHdpdGggU1ZHJ3MgYWNjZXB0ZWQgdHJhbnNmb3JtIHByb3BlcnRpZXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoL150cmFuc2xhdGUvaS50ZXN0KHRyYW5zZm9ybU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtTmFtZSA9IFwidHJhbnNsYXRlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKC9ec2NhbGUvaS50ZXN0KHRyYW5zZm9ybU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtTmFtZSA9IFwic2NhbGVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoL15yb3RhdGUvaS50ZXN0KHRyYW5zZm9ybU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtTmFtZSA9IFwicm90YXRlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIENoZWNrIHRoYXQgd2UgaGF2ZW4ndCB5ZXQgZGVsZXRlZCB0aGUgcHJvcGVydHkgZnJvbSB0aGUgU1ZHVHJhbnNmb3JtcyBjb250YWluZXIuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoU1ZHVHJhbnNmb3Jtc1t0cmFuc2Zvcm1OYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFwcGVuZCB0aGUgdHJhbnNmb3JtIHByb3BlcnR5IGluIHRoZSBTVkctc3VwcG9ydGVkIHRyYW5zZm9ybSBmb3JtYXQuIEFzIHBlciB0aGUgc3BlYywgc3Vycm91bmQgdGhlIHNwYWNlLWRlbGltaXRlZCB2YWx1ZXMgaW4gcGFyZW50aGVzZXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtU3RyaW5nICs9IHRyYW5zZm9ybU5hbWUgKyBcIihcIiArIFNWR1RyYW5zZm9ybXNbdHJhbnNmb3JtTmFtZV0uam9pbihcIiBcIikgKyBcIilcIiArIFwiIFwiO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQWZ0ZXIgcHJvY2Vzc2luZyBhbiBTVkcgdHJhbnNmb3JtIHByb3BlcnR5LCBkZWxldGUgaXQgZnJvbSB0aGUgU1ZHVHJhbnNmb3JtcyBjb250YWluZXIgc28gd2UgZG9uJ3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmUtaW5zZXJ0IHRoZSBzYW1lIG1hc3RlciBwcm9wZXJ0eSBpZiB3ZSBlbmNvdW50ZXIgYW5vdGhlciBvbmUgb2YgaXRzIGF4aXMtc3BlY2lmaWMgcHJvcGVydGllcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgU1ZHVHJhbnNmb3Jtc1t0cmFuc2Zvcm1OYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRyYW5zZm9ybVZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGVyc3BlY3RpdmU7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogVHJhbnNmb3JtIHByb3BlcnRpZXMgYXJlIHN0b3JlZCBhcyBtZW1iZXJzIG9mIHRoZSB0cmFuc2Zvcm1DYWNoZSBvYmplY3QuIENvbmNhdGVuYXRlIGFsbCB0aGUgbWVtYmVycyBpbnRvIGEgc3RyaW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAkLmVhY2goRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZSwgZnVuY3Rpb24odHJhbnNmb3JtTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtVmFsdWUgPSBEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlW3RyYW5zZm9ybU5hbWVdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBUcmFuc2Zvcm0ncyBwZXJzcGVjdGl2ZSBzdWJwcm9wZXJ0eSBtdXN0IGJlIHNldCBmaXJzdCBpbiBvcmRlciB0byB0YWtlIGVmZmVjdC4gU3RvcmUgaXQgdGVtcG9yYXJpbHkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHJhbnNmb3JtTmFtZSA9PT0gXCJ0cmFuc2Zvcm1QZXJzcGVjdGl2ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyc3BlY3RpdmUgPSB0cmFuc2Zvcm1WYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogSUU5IG9ubHkgc3VwcG9ydHMgb25lIHJvdGF0aW9uIHR5cGUsIHJvdGF0ZVosIHdoaWNoIGl0IHJlZmVycyB0byBhcyBcInJvdGF0ZVwiLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKElFID09PSA5ICYmIHRyYW5zZm9ybU5hbWUgPT09IFwicm90YXRlWlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtTmFtZSA9IFwicm90YXRlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybVN0cmluZyArPSB0cmFuc2Zvcm1OYW1lICsgdHJhbnNmb3JtVmFsdWUgKyBcIiBcIjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogSWYgcHJlc2VudCwgc2V0IHRoZSBwZXJzcGVjdGl2ZSBzdWJwcm9wZXJ0eSBmaXJzdC4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBlcnNwZWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1TdHJpbmcgPSBcInBlcnNwZWN0aXZlXCIgKyBwZXJzcGVjdGl2ZSArIFwiIFwiICsgdHJhbnNmb3JtU3RyaW5nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgQ1NTLnNldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJ0cmFuc2Zvcm1cIiwgdHJhbnNmb3JtU3RyaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKiBSZWdpc3RlciBob29rcyBhbmQgbm9ybWFsaXphdGlvbnMuICovXG4gICAgICAgIENTUy5Ib29rcy5yZWdpc3RlcigpO1xuICAgICAgICBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXIoKTtcblxuICAgICAgICAvKiBBbGxvdyBob29rIHNldHRpbmcgaW4gdGhlIHNhbWUgZmFzaGlvbiBhcyBqUXVlcnkncyAkLmNzcygpLiAqL1xuICAgICAgICBWZWxvY2l0eS5ob29rID0gZnVuY3Rpb24oZWxlbWVudHMsIGFyZzIsIGFyZzMpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZTtcblxuICAgICAgICAgICAgZWxlbWVudHMgPSBzYW5pdGl6ZUVsZW1lbnRzKGVsZW1lbnRzKTtcblxuICAgICAgICAgICAgJC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbihpLCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgLyogSW5pdGlhbGl6ZSBWZWxvY2l0eSdzIHBlci1lbGVtZW50IGRhdGEgY2FjaGUgaWYgdGhpcyBlbGVtZW50IGhhc24ndCBwcmV2aW91c2x5IGJlZW4gYW5pbWF0ZWQuICovXG4gICAgICAgICAgICAgICAgaWYgKERhdGEoZWxlbWVudCkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5pbml0KGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qIEdldCBwcm9wZXJ0eSB2YWx1ZS4gSWYgYW4gZWxlbWVudCBzZXQgd2FzIHBhc3NlZCBpbiwgb25seSByZXR1cm4gdGhlIHZhbHVlIGZvciB0aGUgZmlyc3QgZWxlbWVudC4gKi9cbiAgICAgICAgICAgICAgICBpZiAoYXJnMyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIGFyZzIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8qIFNldCBwcm9wZXJ0eSB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvKiBzUFYgcmV0dXJucyBhbiBhcnJheSBvZiB0aGUgbm9ybWFsaXplZCBwcm9wZXJ0eU5hbWUvcHJvcGVydHlWYWx1ZSBwYWlyIHVzZWQgdG8gdXBkYXRlIHRoZSBET00uICovXG4gICAgICAgICAgICAgICAgICAgIHZhciBhZGp1c3RlZFNldCA9IENTUy5zZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIGFyZzIsIGFyZzMpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIFRyYW5zZm9ybSBwcm9wZXJ0aWVzIGRvbid0IGF1dG9tYXRpY2FsbHkgc2V0LiBUaGV5IGhhdmUgdG8gYmUgZmx1c2hlZCB0byB0aGUgRE9NLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWRqdXN0ZWRTZXRbMF0gPT09IFwidHJhbnNmb3JtXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LkNTUy5mbHVzaFRyYW5zZm9ybUNhY2hlKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBhZGp1c3RlZFNldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKlxuICAgICAgICAgQW5pbWF0aW9uXG4gICAgICAgICAqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICB2YXIgYW5pbWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG9wdHM7XG5cbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICBDYWxsIENoYWluXG4gICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAvKiBMb2dpYyBmb3IgZGV0ZXJtaW5pbmcgd2hhdCB0byByZXR1cm4gdG8gdGhlIGNhbGwgc3RhY2sgd2hlbiBleGl0aW5nIG91dCBvZiBWZWxvY2l0eS4gKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldENoYWluKCkge1xuICAgICAgICAgICAgICAgIC8qIElmIHdlIGFyZSB1c2luZyB0aGUgdXRpbGl0eSBmdW5jdGlvbiwgYXR0ZW1wdCB0byByZXR1cm4gdGhpcyBjYWxsJ3MgcHJvbWlzZS4gSWYgbm8gcHJvbWlzZSBsaWJyYXJ5IHdhcyBkZXRlY3RlZCxcbiAgICAgICAgICAgICAgICAgZGVmYXVsdCB0byBudWxsIGluc3RlYWQgb2YgcmV0dXJuaW5nIHRoZSB0YXJnZXRlZCBlbGVtZW50cyBzbyB0aGF0IHV0aWxpdHkgZnVuY3Rpb24ncyByZXR1cm4gdmFsdWUgaXMgc3RhbmRhcmRpemVkLiAqL1xuICAgICAgICAgICAgICAgIGlmIChpc1V0aWxpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2VEYXRhLnByb21pc2UgfHwgbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgLyogT3RoZXJ3aXNlLCBpZiB3ZSdyZSB1c2luZyAkLmZuLCByZXR1cm4gdGhlIGpRdWVyeS0vWmVwdG8td3JhcHBlZCBlbGVtZW50IHNldC4gKi9cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudHNXcmFwcGVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICBBcmd1bWVudHMgQXNzaWdubWVudFxuICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIC8qIFRvIGFsbG93IGZvciBleHByZXNzaXZlIENvZmZlZVNjcmlwdCBjb2RlLCBWZWxvY2l0eSBzdXBwb3J0cyBhbiBhbHRlcm5hdGl2ZSBzeW50YXggaW4gd2hpY2ggXCJlbGVtZW50c1wiIChvciBcImVcIiksIFwicHJvcGVydGllc1wiIChvciBcInBcIiksIGFuZCBcIm9wdGlvbnNcIiAob3IgXCJvXCIpXG4gICAgICAgICAgICAgb2JqZWN0cyBhcmUgZGVmaW5lZCBvbiBhIGNvbnRhaW5lciBvYmplY3QgdGhhdCdzIHBhc3NlZCBpbiBhcyBWZWxvY2l0eSdzIHNvbGUgYXJndW1lbnQuICovXG4gICAgICAgICAgICAvKiBOb3RlOiBTb21lIGJyb3dzZXJzIGF1dG9tYXRpY2FsbHkgcG9wdWxhdGUgYXJndW1lbnRzIHdpdGggYSBcInByb3BlcnRpZXNcIiBvYmplY3QuIFdlIGRldGVjdCBpdCBieSBjaGVja2luZyBmb3IgaXRzIGRlZmF1bHQgXCJuYW1lc1wiIHByb3BlcnR5LiAqL1xuICAgICAgICAgICAgdmFyIHN5bnRhY3RpY1N1Z2FyID0gKGFyZ3VtZW50c1swXSAmJiAoYXJndW1lbnRzWzBdLnAgfHwgKCgkLmlzUGxhaW5PYmplY3QoYXJndW1lbnRzWzBdLnByb3BlcnRpZXMpICYmICFhcmd1bWVudHNbMF0ucHJvcGVydGllcy5uYW1lcykgfHwgVHlwZS5pc1N0cmluZyhhcmd1bWVudHNbMF0ucHJvcGVydGllcykpKSksXG4gICAgICAgICAgICAgICAgLyogV2hldGhlciBWZWxvY2l0eSB3YXMgY2FsbGVkIHZpYSB0aGUgdXRpbGl0eSBmdW5jdGlvbiAoYXMgb3Bwb3NlZCB0byBvbiBhIGpRdWVyeS9aZXB0byBvYmplY3QpLiAqL1xuICAgICAgICAgICAgICAgIGlzVXRpbGl0eSxcbiAgICAgICAgICAgICAgICAvKiBXaGVuIFZlbG9jaXR5IGlzIGNhbGxlZCB2aWEgdGhlIHV0aWxpdHkgZnVuY3Rpb24gKCQuVmVsb2NpdHkoKS9WZWxvY2l0eSgpKSwgZWxlbWVudHMgYXJlIGV4cGxpY2l0bHlcbiAgICAgICAgICAgICAgICAgcGFzc2VkIGluIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXIuIFRodXMsIGFyZ3VtZW50IHBvc2l0aW9uaW5nIHZhcmllcy4gV2Ugbm9ybWFsaXplIHRoZW0gaGVyZS4gKi9cbiAgICAgICAgICAgICAgICBlbGVtZW50c1dyYXBwZWQsXG4gICAgICAgICAgICAgICAgYXJndW1lbnRJbmRleDtcblxuICAgICAgICAgICAgdmFyIGVsZW1lbnRzLFxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXNNYXAsXG4gICAgICAgICAgICAgICAgb3B0aW9ucztcblxuICAgICAgICAgICAgLyogRGV0ZWN0IGpRdWVyeS9aZXB0byBlbGVtZW50cyBiZWluZyBhbmltYXRlZCB2aWEgdGhlICQuZm4gbWV0aG9kLiAqL1xuICAgICAgICAgICAgaWYgKFR5cGUuaXNXcmFwcGVkKHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgaXNVdGlsaXR5ID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBhcmd1bWVudEluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICBlbGVtZW50cyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgZWxlbWVudHNXcmFwcGVkID0gdGhpcztcbiAgICAgICAgICAgICAgICAvKiBPdGhlcndpc2UsIHJhdyBlbGVtZW50cyBhcmUgYmVpbmcgYW5pbWF0ZWQgdmlhIHRoZSB1dGlsaXR5IGZ1bmN0aW9uLiAqL1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpc1V0aWxpdHkgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgYXJndW1lbnRJbmRleCA9IDE7XG4gICAgICAgICAgICAgICAgZWxlbWVudHMgPSBzeW50YWN0aWNTdWdhciA/IChhcmd1bWVudHNbMF0uZWxlbWVudHMgfHwgYXJndW1lbnRzWzBdLmUpIDogYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgUHJvbWlzZXNcbiAgICAgICAgICAgICAqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIHZhciBwcm9taXNlRGF0YSA9IHtcbiAgICAgICAgICAgICAgICBwcm9taXNlOiBudWxsLFxuICAgICAgICAgICAgICAgIHJlc29sdmVyOiBudWxsLFxuICAgICAgICAgICAgICAgIHJlamVjdGVyOiBudWxsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvKiBJZiB0aGlzIGNhbGwgd2FzIG1hZGUgdmlhIHRoZSB1dGlsaXR5IGZ1bmN0aW9uICh3aGljaCBpcyB0aGUgZGVmYXVsdCBtZXRob2Qgb2YgaW52b2NhdGlvbiB3aGVuIGpRdWVyeS9aZXB0byBhcmUgbm90IGJlaW5nIHVzZWQpLCBhbmQgaWZcbiAgICAgICAgICAgICBwcm9taXNlIHN1cHBvcnQgd2FzIGRldGVjdGVkLCBjcmVhdGUgYSBwcm9taXNlIG9iamVjdCBmb3IgdGhpcyBjYWxsIGFuZCBzdG9yZSByZWZlcmVuY2VzIHRvIGl0cyByZXNvbHZlciBhbmQgcmVqZWN0ZXIgbWV0aG9kcy4gVGhlIHJlc29sdmVcbiAgICAgICAgICAgICBtZXRob2QgaXMgdXNlZCB3aGVuIGEgY2FsbCBjb21wbGV0ZXMgbmF0dXJhbGx5IG9yIGlzIHByZW1hdHVyZWx5IHN0b3BwZWQgYnkgdGhlIHVzZXIuIEluIGJvdGggY2FzZXMsIGNvbXBsZXRlQ2FsbCgpIGhhbmRsZXMgdGhlIGFzc29jaWF0ZWRcbiAgICAgICAgICAgICBjYWxsIGNsZWFudXAgYW5kIHByb21pc2UgcmVzb2x2aW5nIGxvZ2ljLiBUaGUgcmVqZWN0IG1ldGhvZCBpcyB1c2VkIHdoZW4gYW4gaW52YWxpZCBzZXQgb2YgYXJndW1lbnRzIGlzIHBhc3NlZCBpbnRvIGEgVmVsb2NpdHkgY2FsbC4gKi9cbiAgICAgICAgICAgIC8qIE5vdGU6IFZlbG9jaXR5IGVtcGxveXMgYSBjYWxsLWJhc2VkIHF1ZXVlaW5nIGFyY2hpdGVjdHVyZSwgd2hpY2ggbWVhbnMgdGhhdCBzdG9wcGluZyBhbiBhbmltYXRpbmcgZWxlbWVudCBhY3R1YWxseSBzdG9wcyB0aGUgZnVsbCBjYWxsIHRoYXRcbiAgICAgICAgICAgICB0cmlnZ2VyZWQgaXQgLS0gbm90IHRoYXQgb25lIGVsZW1lbnQgZXhjbHVzaXZlbHkuIFNpbWlsYXJseSwgdGhlcmUgaXMgb25lIHByb21pc2UgcGVyIGNhbGwsIGFuZCBhbGwgZWxlbWVudHMgdGFyZ2V0ZWQgYnkgYSBWZWxvY2l0eSBjYWxsIGFyZVxuICAgICAgICAgICAgIGdyb3VwZWQgdG9nZXRoZXIgZm9yIHRoZSBwdXJwb3NlcyBvZiByZXNvbHZpbmcgYW5kIHJlamVjdGluZyBhIHByb21pc2UuICovXG4gICAgICAgICAgICBpZiAoaXNVdGlsaXR5ICYmIFZlbG9jaXR5LlByb21pc2UpIHtcbiAgICAgICAgICAgICAgICBwcm9taXNlRGF0YS5wcm9taXNlID0gbmV3IFZlbG9jaXR5LlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHByb21pc2VEYXRhLnJlc29sdmVyID0gcmVzb2x2ZTtcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZURhdGEucmVqZWN0ZXIgPSByZWplY3Q7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzeW50YWN0aWNTdWdhcikge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXNNYXAgPSBhcmd1bWVudHNbMF0ucHJvcGVydGllcyB8fCBhcmd1bWVudHNbMF0ucDtcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gYXJndW1lbnRzWzBdLm9wdGlvbnMgfHwgYXJndW1lbnRzWzBdLm87XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXNNYXAgPSBhcmd1bWVudHNbYXJndW1lbnRJbmRleF07XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IGFyZ3VtZW50c1thcmd1bWVudEluZGV4ICsgMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsZW1lbnRzID0gc2FuaXRpemVFbGVtZW50cyhlbGVtZW50cyk7XG5cbiAgICAgICAgICAgIGlmICghZWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvbWlzZURhdGEucHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXByb3BlcnRpZXNNYXAgfHwgIW9wdGlvbnMgfHwgb3B0aW9ucy5wcm9taXNlUmVqZWN0RW1wdHkgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlRGF0YS5yZWplY3RlcigpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZURhdGEucmVzb2x2ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIFRoZSBsZW5ndGggb2YgdGhlIGVsZW1lbnQgc2V0IChpbiB0aGUgZm9ybSBvZiBhIG5vZGVMaXN0IG9yIGFuIGFycmF5IG9mIGVsZW1lbnRzKSBpcyBkZWZhdWx0ZWQgdG8gMSBpbiBjYXNlIGFcbiAgICAgICAgICAgICBzaW5nbGUgcmF3IERPTSBlbGVtZW50IGlzIHBhc3NlZCBpbiAod2hpY2ggZG9lc24ndCBjb250YWluIGEgbGVuZ3RoIHByb3BlcnR5KS4gKi9cbiAgICAgICAgICAgIHZhciBlbGVtZW50c0xlbmd0aCA9IGVsZW1lbnRzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBlbGVtZW50c0luZGV4ID0gMDtcblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgIEFyZ3VtZW50IE92ZXJsb2FkaW5nXG4gICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAvKiBTdXBwb3J0IGlzIGluY2x1ZGVkIGZvciBqUXVlcnkncyBhcmd1bWVudCBvdmVybG9hZGluZzogJC5hbmltYXRlKHByb3BlcnR5TWFwIFssIGR1cmF0aW9uXSBbLCBlYXNpbmddIFssIGNvbXBsZXRlXSkuXG4gICAgICAgICAgICAgT3ZlcmxvYWRpbmcgaXMgZGV0ZWN0ZWQgYnkgY2hlY2tpbmcgZm9yIHRoZSBhYnNlbmNlIG9mIGFuIG9iamVjdCBiZWluZyBwYXNzZWQgaW50byBvcHRpb25zLiAqL1xuICAgICAgICAgICAgLyogTm90ZTogVGhlIHN0b3AvZmluaXNoL3BhdXNlL3Jlc3VtZSBhY3Rpb25zIGRvIG5vdCBhY2NlcHQgYW5pbWF0aW9uIG9wdGlvbnMsIGFuZCBhcmUgdGhlcmVmb3JlIGV4Y2x1ZGVkIGZyb20gdGhpcyBjaGVjay4gKi9cbiAgICAgICAgICAgIGlmICghL14oc3RvcHxmaW5pc2h8ZmluaXNoQWxsfHBhdXNlfHJlc3VtZSkkL2kudGVzdChwcm9wZXJ0aWVzTWFwKSAmJiAhJC5pc1BsYWluT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgICAgICAgICAgICAgLyogVGhlIHV0aWxpdHkgZnVuY3Rpb24gc2hpZnRzIGFsbCBhcmd1bWVudHMgb25lIHBvc2l0aW9uIHRvIHRoZSByaWdodCwgc28gd2UgYWRqdXN0IGZvciB0aGF0IG9mZnNldC4gKi9cbiAgICAgICAgICAgICAgICB2YXIgc3RhcnRpbmdBcmd1bWVudFBvc2l0aW9uID0gYXJndW1lbnRJbmRleCArIDE7XG5cbiAgICAgICAgICAgICAgICBvcHRpb25zID0ge307XG5cbiAgICAgICAgICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggYWxsIG9wdGlvbnMgYXJndW1lbnRzICovXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHN0YXJ0aW5nQXJndW1lbnRQb3NpdGlvbjsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAvKiBUcmVhdCBhIG51bWJlciBhcyBhIGR1cmF0aW9uLiBQYXJzZSBpdCBvdXQuICovXG4gICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFRoZSBmb2xsb3dpbmcgUmVnRXggd2lsbCByZXR1cm4gdHJ1ZSBpZiBwYXNzZWQgYW4gYXJyYXkgd2l0aCBhIG51bWJlciBhcyBpdHMgZmlyc3QgaXRlbS5cbiAgICAgICAgICAgICAgICAgICAgIFRodXMsIGFycmF5cyBhcmUgc2tpcHBlZCBmcm9tIHRoaXMgY2hlY2suICovXG4gICAgICAgICAgICAgICAgICAgIGlmICghVHlwZS5pc0FycmF5KGFyZ3VtZW50c1tpXSkgJiYgKC9eKGZhc3R8bm9ybWFsfHNsb3cpJC9pLnRlc3QoYXJndW1lbnRzW2ldKSB8fCAvXlxcZC8udGVzdChhcmd1bWVudHNbaV0pKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5kdXJhdGlvbiA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRyZWF0IHN0cmluZ3MgYW5kIGFycmF5cyBhcyBlYXNpbmdzLiAqL1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFR5cGUuaXNTdHJpbmcoYXJndW1lbnRzW2ldKSB8fCBUeXBlLmlzQXJyYXkoYXJndW1lbnRzW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5lYXNpbmcgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBUcmVhdCBhIGZ1bmN0aW9uIGFzIGEgY29tcGxldGUgY2FsbGJhY2suICovXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoVHlwZS5pc0Z1bmN0aW9uKGFyZ3VtZW50c1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuY29tcGxldGUgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICBBY3Rpb24gRGV0ZWN0aW9uXG4gICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAvKiBWZWxvY2l0eSdzIGJlaGF2aW9yIGlzIGNhdGVnb3JpemVkIGludG8gXCJhY3Rpb25zXCI6IEVsZW1lbnRzIGNhbiBlaXRoZXIgYmUgc3BlY2lhbGx5IHNjcm9sbGVkIGludG8gdmlldyxcbiAgICAgICAgICAgICBvciB0aGV5IGNhbiBiZSBzdGFydGVkLCBzdG9wcGVkLCBwYXVzZWQsIHJlc3VtZWQsIG9yIHJldmVyc2VkIC4gSWYgYSBsaXRlcmFsIG9yIHJlZmVyZW5jZWQgcHJvcGVydGllcyBtYXAgaXMgcGFzc2VkIGluIGFzIFZlbG9jaXR5J3NcbiAgICAgICAgICAgICBmaXJzdCBhcmd1bWVudCwgdGhlIGFzc29jaWF0ZWQgYWN0aW9uIGlzIFwic3RhcnRcIi4gQWx0ZXJuYXRpdmVseSwgXCJzY3JvbGxcIiwgXCJyZXZlcnNlXCIsIFwicGF1c2VcIiwgXCJyZXN1bWVcIiBvciBcInN0b3BcIiBjYW4gYmUgcGFzc2VkIGluXG4gICAgICAgICAgICAgaW5zdGVhZCBvZiBhIHByb3BlcnRpZXMgbWFwLiAqL1xuICAgICAgICAgICAgdmFyIGFjdGlvbjtcblxuICAgICAgICAgICAgc3dpdGNoIChwcm9wZXJ0aWVzTWFwKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcInNjcm9sbFwiOlxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24gPSBcInNjcm9sbFwiO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgXCJyZXZlcnNlXCI6XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbiA9IFwicmV2ZXJzZVwiO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgXCJwYXVzZVwiOlxuXG4gICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICBBY3Rpb246IFBhdXNlXG4gICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VGltZSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogSGFuZGxlIGRlbGF5IHRpbWVycyAqL1xuICAgICAgICAgICAgICAgICAgICAkLmVhY2goZWxlbWVudHMsIGZ1bmN0aW9uKGksIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdXNlRGVsYXlPbkVsZW1lbnQoZWxlbWVudCwgY3VycmVudFRpbWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBQYXVzZSBhbmQgUmVzdW1lIGFyZSBjYWxsLXdpZGUgKG5vdCBvbiBhIHBlciBlbGVtZW50IGJhc2lzKS4gVGh1cywgY2FsbGluZyBwYXVzZSBvciByZXN1bWUgb24gYVxuICAgICAgICAgICAgICAgICAgICAgc2luZ2xlIGVsZW1lbnQgd2lsbCBjYXVzZSBhbnkgY2FsbHMgdGhhdCBjb250YWludCB0d2VlbnMgZm9yIHRoYXQgZWxlbWVudCB0byBiZSBwYXVzZWQvcmVzdW1lZFxuICAgICAgICAgICAgICAgICAgICAgYXMgd2VsbC4gKi9cblxuICAgICAgICAgICAgICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggYWxsIGNhbGxzIGFuZCBwYXVzZSBhbnkgdGhhdCBjb250YWluIGFueSBvZiBvdXIgZWxlbWVudHMgKi9cbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKFZlbG9jaXR5LlN0YXRlLmNhbGxzLCBmdW5jdGlvbihpLCBhY3RpdmVDYWxsKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogSW5hY3RpdmUgY2FsbHMgYXJlIHNldCB0byBmYWxzZSBieSB0aGUgbG9naWMgaW5zaWRlIGNvbXBsZXRlQ2FsbCgpLiBTa2lwIHRoZW0uICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQ2FsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCB0aGUgYWN0aXZlIGNhbGwncyB0YXJnZXRlZCBlbGVtZW50cy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goYWN0aXZlQ2FsbFsxXSwgZnVuY3Rpb24oaywgYWN0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcXVldWVOYW1lID0gKG9wdGlvbnMgPT09IHVuZGVmaW5lZCkgPyBcIlwiIDogb3B0aW9ucztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocXVldWVOYW1lICE9PSB0cnVlICYmIChhY3RpdmVDYWxsWzJdLnF1ZXVlICE9PSBxdWV1ZU5hbWUpICYmICEob3B0aW9ucyA9PT0gdW5kZWZpbmVkICYmIGFjdGl2ZUNhbGxbMl0ucXVldWUgPT09IGZhbHNlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggdGhlIGNhbGxzIHRhcmdldGVkIGJ5IHRoZSBzdG9wIGNvbW1hbmQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChlbGVtZW50cywgZnVuY3Rpb24obCwgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2hlY2sgdGhhdCB0aGlzIGNhbGwgd2FzIGFwcGxpZWQgdG8gdGhlIHRhcmdldCBlbGVtZW50LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQgPT09IGFjdGl2ZUVsZW1lbnQpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNldCBjYWxsIHRvIHBhdXNlZCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZUNhbGxbNV0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VtZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogT25jZSB3ZSBtYXRjaCBhbiBlbGVtZW50LCB3ZSBjYW4gYm91bmNlIG91dCB0byB0aGUgbmV4dCBjYWxsIGVudGlyZWx5ICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogUHJvY2VlZCB0byBjaGVjayBuZXh0IGNhbGwgaWYgd2UgaGF2ZSBhbHJlYWR5IG1hdGNoZWQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBTaW5jZSBwYXVzZSBjcmVhdGVzIG5vIG5ldyB0d2VlbnMsIGV4aXQgb3V0IG9mIFZlbG9jaXR5LiAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0Q2hhaW4oKTtcblxuICAgICAgICAgICAgICAgIGNhc2UgXCJyZXN1bWVcIjpcblxuICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgQWN0aW9uOiBSZXN1bWVcbiAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgLyogSGFuZGxlIGRlbGF5IHRpbWVycyAqL1xuICAgICAgICAgICAgICAgICAgICAkLmVhY2goZWxlbWVudHMsIGZ1bmN0aW9uKGksIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VtZURlbGF5T25FbGVtZW50KGVsZW1lbnQsIGN1cnJlbnRUaW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogUGF1c2UgYW5kIFJlc3VtZSBhcmUgY2FsbC13aWRlIChub3Qgb24gYSBwZXIgZWxlbW50IGJhc2lzKS4gVGh1cywgY2FsbGluZyBwYXVzZSBvciByZXN1bWUgb24gYVxuICAgICAgICAgICAgICAgICAgICAgc2luZ2xlIGVsZW1lbnQgd2lsbCBjYXVzZSBhbnkgY2FsbHMgdGhhdCBjb250YWludCB0d2VlbnMgZm9yIHRoYXQgZWxlbWVudCB0byBiZSBwYXVzZWQvcmVzdW1lZFxuICAgICAgICAgICAgICAgICAgICAgYXMgd2VsbC4gKi9cblxuICAgICAgICAgICAgICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggYWxsIGNhbGxzIGFuZCBwYXVzZSBhbnkgdGhhdCBjb250YWluIGFueSBvZiBvdXIgZWxlbWVudHMgKi9cbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKFZlbG9jaXR5LlN0YXRlLmNhbGxzLCBmdW5jdGlvbihpLCBhY3RpdmVDYWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEluYWN0aXZlIGNhbGxzIGFyZSBzZXQgdG8gZmFsc2UgYnkgdGhlIGxvZ2ljIGluc2lkZSBjb21wbGV0ZUNhbGwoKS4gU2tpcCB0aGVtLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUNhbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggdGhlIGFjdGl2ZSBjYWxsJ3MgdGFyZ2V0ZWQgZWxlbWVudHMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGFjdGl2ZUNhbGxbMV0sIGZ1bmN0aW9uKGssIGFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHF1ZXVlTmFtZSA9IChvcHRpb25zID09PSB1bmRlZmluZWQpID8gXCJcIiA6IG9wdGlvbnM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHF1ZXVlTmFtZSAhPT0gdHJ1ZSAmJiAoYWN0aXZlQ2FsbFsyXS5xdWV1ZSAhPT0gcXVldWVOYW1lKSAmJiAhKG9wdGlvbnMgPT09IHVuZGVmaW5lZCAmJiBhY3RpdmVDYWxsWzJdLnF1ZXVlID09PSBmYWxzZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU2tpcCBhbnkgY2FsbHMgdGhhdCBoYXZlIG5ldmVyIGJlZW4gcGF1c2VkICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYWN0aXZlQ2FsbFs1XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggdGhlIGNhbGxzIHRhcmdldGVkIGJ5IHRoZSBzdG9wIGNvbW1hbmQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChlbGVtZW50cywgZnVuY3Rpb24obCwgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2hlY2sgdGhhdCB0aGlzIGNhbGwgd2FzIGFwcGxpZWQgdG8gdGhlIHRhcmdldCBlbGVtZW50LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQgPT09IGFjdGl2ZUVsZW1lbnQpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZsYWcgYSBwYXVzZSBvYmplY3QgdG8gYmUgcmVzdW1lZCwgd2hpY2ggd2lsbCBvY2N1ciBkdXJpbmcgdGhlIG5leHQgdGljay4gSW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkaXRpb24sIHRoZSBwYXVzZSBvYmplY3Qgd2lsbCBhdCB0aGF0IHRpbWUgYmUgZGVsZXRlZCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZUNhbGxbNV0ucmVzdW1lID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE9uY2Ugd2UgbWF0Y2ggYW4gZWxlbWVudCwgd2UgY2FuIGJvdW5jZSBvdXQgdG8gdGhlIG5leHQgY2FsbCBlbnRpcmVseSAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFByb2NlZWQgdG8gY2hlY2sgbmV4dCBjYWxsIGlmIHdlIGhhdmUgYWxyZWFkeSBtYXRjaGVkICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogU2luY2UgcmVzdW1lIGNyZWF0ZXMgbm8gbmV3IHR3ZWVucywgZXhpdCBvdXQgb2YgVmVsb2NpdHkuICovXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRDaGFpbigpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBcImZpbmlzaFwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJmaW5pc2hBbGxcIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwic3RvcFwiOlxuICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgQWN0aW9uOiBTdG9wXG4gICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIENsZWFyIHRoZSBjdXJyZW50bHktYWN0aXZlIGRlbGF5IG9uIGVhY2ggdGFyZ2V0ZWQgZWxlbWVudC4gKi9cbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbihpLCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoRGF0YShlbGVtZW50KSAmJiBEYXRhKGVsZW1lbnQpLmRlbGF5VGltZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTdG9wIHRoZSB0aW1lciBmcm9tIHRyaWdnZXJpbmcgaXRzIGNhY2hlZCBuZXh0KCkgZnVuY3Rpb24uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KERhdGEoZWxlbWVudCkuZGVsYXlUaW1lci5zZXRUaW1lb3V0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE1hbnVhbGx5IGNhbGwgdGhlIG5leHQoKSBmdW5jdGlvbiBzbyB0aGF0IHRoZSBzdWJzZXF1ZW50IHF1ZXVlIGl0ZW1zIGNhbiBwcm9ncmVzcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoRGF0YShlbGVtZW50KS5kZWxheVRpbWVyLm5leHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS5kZWxheVRpbWVyLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgRGF0YShlbGVtZW50KS5kZWxheVRpbWVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB3ZSB3YW50IHRvIGZpbmlzaCBldmVyeXRoaW5nIGluIHRoZSBxdWV1ZSwgd2UgaGF2ZSB0byBpdGVyYXRlIHRocm91Z2ggaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgY2FsbCBlYWNoIGZ1bmN0aW9uLiBUaGlzIHdpbGwgbWFrZSB0aGVtIGFjdGl2ZSBjYWxscyBiZWxvdywgd2hpY2ggd2lsbFxuICAgICAgICAgICAgICAgICAgICAgICAgIGNhdXNlIHRoZW0gdG8gYmUgYXBwbGllZCB2aWEgdGhlIGR1cmF0aW9uIHNldHRpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllc01hcCA9PT0gXCJmaW5pc2hBbGxcIiAmJiAob3B0aW9ucyA9PT0gdHJ1ZSB8fCBUeXBlLmlzU3RyaW5nKG9wdGlvbnMpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCB0aGUgaXRlbXMgaW4gdGhlIGVsZW1lbnQncyBxdWV1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goJC5xdWV1ZShlbGVtZW50LCBUeXBlLmlzU3RyaW5nKG9wdGlvbnMpID8gb3B0aW9ucyA6IFwiXCIpLCBmdW5jdGlvbihfLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSBxdWV1ZSBhcnJheSBjYW4gY29udGFpbiBhbiBcImlucHJvZ3Jlc3NcIiBzdHJpbmcsIHdoaWNoIHdlIHNraXAuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUeXBlLmlzRnVuY3Rpb24oaXRlbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2xlYXJpbmcgdGhlICQucXVldWUoKSBhcnJheSBpcyBhY2hpZXZlZCBieSByZXNldHRpbmcgaXQgdG8gW10uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5xdWV1ZShlbGVtZW50LCBUeXBlLmlzU3RyaW5nKG9wdGlvbnMpID8gb3B0aW9ucyA6IFwiXCIsIFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhbGxzVG9TdG9wID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgLyogV2hlbiB0aGUgc3RvcCBhY3Rpb24gaXMgdHJpZ2dlcmVkLCB0aGUgZWxlbWVudHMnIGN1cnJlbnRseSBhY3RpdmUgY2FsbCBpcyBpbW1lZGlhdGVseSBzdG9wcGVkLiBUaGUgYWN0aXZlIGNhbGwgbWlnaHQgaGF2ZVxuICAgICAgICAgICAgICAgICAgICAgYmVlbiBhcHBsaWVkIHRvIG11bHRpcGxlIGVsZW1lbnRzLCBpbiB3aGljaCBjYXNlIGFsbCBvZiB0aGUgY2FsbCdzIGVsZW1lbnRzIHdpbGwgYmUgc3RvcHBlZC4gV2hlbiBhbiBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICBpcyBzdG9wcGVkLCB0aGUgbmV4dCBpdGVtIGluIGl0cyBhbmltYXRpb24gcXVldWUgaXMgaW1tZWRpYXRlbHkgdHJpZ2dlcmVkLiAqL1xuICAgICAgICAgICAgICAgICAgICAvKiBBbiBhZGRpdGlvbmFsIGFyZ3VtZW50IG1heSBiZSBwYXNzZWQgaW4gdG8gY2xlYXIgYW4gZWxlbWVudCdzIHJlbWFpbmluZyBxdWV1ZWQgY2FsbHMuIEVpdGhlciB0cnVlICh3aGljaCBkZWZhdWx0cyB0byB0aGUgXCJmeFwiIHF1ZXVlKVxuICAgICAgICAgICAgICAgICAgICAgb3IgYSBjdXN0b20gcXVldWUgc3RyaW5nIGNhbiBiZSBwYXNzZWQgaW4uICovXG4gICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFRoZSBzdG9wIGNvbW1hbmQgcnVucyBwcmlvciB0byBWZWxvY2l0eSdzIFF1ZXVlaW5nIHBoYXNlIHNpbmNlIGl0cyBiZWhhdmlvciBpcyBpbnRlbmRlZCB0byB0YWtlIGVmZmVjdCAqaW1tZWRpYXRlbHkqLFxuICAgICAgICAgICAgICAgICAgICAgcmVnYXJkbGVzcyBvZiB0aGUgZWxlbWVudCdzIGN1cnJlbnQgcXVldWUgc3RhdGUuICovXG5cbiAgICAgICAgICAgICAgICAgICAgLyogSXRlcmF0ZSB0aHJvdWdoIGV2ZXJ5IGFjdGl2ZSBjYWxsLiAqL1xuICAgICAgICAgICAgICAgICAgICAkLmVhY2goVmVsb2NpdHkuU3RhdGUuY2FsbHMsIGZ1bmN0aW9uKGksIGFjdGl2ZUNhbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEluYWN0aXZlIGNhbGxzIGFyZSBzZXQgdG8gZmFsc2UgYnkgdGhlIGxvZ2ljIGluc2lkZSBjb21wbGV0ZUNhbGwoKS4gU2tpcCB0aGVtLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUNhbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggdGhlIGFjdGl2ZSBjYWxsJ3MgdGFyZ2V0ZWQgZWxlbWVudHMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGFjdGl2ZUNhbGxbMV0sIGZ1bmN0aW9uKGssIGFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdHJ1ZSB3YXMgcGFzc2VkIGluIGFzIGEgc2Vjb25kYXJ5IGFyZ3VtZW50LCBjbGVhciBhYnNvbHV0ZWx5IGFsbCBjYWxscyBvbiB0aGlzIGVsZW1lbnQuIE90aGVyd2lzZSwgb25seVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXIgY2FsbHMgYXNzb2NpYXRlZCB3aXRoIHRoZSByZWxldmFudCBxdWV1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2FsbCBzdG9wcGluZyBsb2dpYyB3b3JrcyBhcyBmb2xsb3dzOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBvcHRpb25zID09PSB0cnVlIC0tPiBzdG9wIGN1cnJlbnQgZGVmYXVsdCBxdWV1ZSBjYWxscyAoYW5kIHF1ZXVlOmZhbHNlIGNhbGxzKSwgaW5jbHVkaW5nIHJlbWFpbmluZyBxdWV1ZWQgb25lcy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gb3B0aW9ucyA9PT0gdW5kZWZpbmVkIC0tPiBzdG9wIGN1cnJlbnQgcXVldWU6XCJcIiBjYWxsIGFuZCBhbGwgcXVldWU6ZmFsc2UgY2FsbHMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIG9wdGlvbnMgPT09IGZhbHNlIC0tPiBzdG9wIG9ubHkgcXVldWU6ZmFsc2UgY2FsbHMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIG9wdGlvbnMgPT09IFwiY3VzdG9tXCIgLS0+IHN0b3AgY3VycmVudCBxdWV1ZTpcImN1c3RvbVwiIGNhbGwsIGluY2x1ZGluZyByZW1haW5pbmcgcXVldWVkIG9uZXMgKHRoZXJlIGlzIG5vIGZ1bmN0aW9uYWxpdHkgdG8gb25seSBjbGVhciB0aGUgY3VycmVudGx5LXJ1bm5pbmcgcXVldWU6XCJjdXN0b21cIiBjYWxsKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHF1ZXVlTmFtZSA9IChvcHRpb25zID09PSB1bmRlZmluZWQpID8gXCJcIiA6IG9wdGlvbnM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHF1ZXVlTmFtZSAhPT0gdHJ1ZSAmJiAoYWN0aXZlQ2FsbFsyXS5xdWV1ZSAhPT0gcXVldWVOYW1lKSAmJiAhKG9wdGlvbnMgPT09IHVuZGVmaW5lZCAmJiBhY3RpdmVDYWxsWzJdLnF1ZXVlID09PSBmYWxzZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSXRlcmF0ZSB0aHJvdWdoIHRoZSBjYWxscyB0YXJnZXRlZCBieSB0aGUgc3RvcCBjb21tYW5kLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goZWxlbWVudHMsIGZ1bmN0aW9uKGwsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENoZWNrIHRoYXQgdGhpcyBjYWxsIHdhcyBhcHBsaWVkIHRvIHRoZSB0YXJnZXQgZWxlbWVudC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50ID09PSBhY3RpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogT3B0aW9uYWxseSBjbGVhciB0aGUgcmVtYWluaW5nIHF1ZXVlZCBjYWxscy4gSWYgd2UncmUgZG9pbmcgXCJmaW5pc2hBbGxcIiB0aGlzIHdvbid0IGZpbmQgYW55dGhpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1ZSB0byB0aGUgcXVldWUtY2xlYXJpbmcgYWJvdmUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgPT09IHRydWUgfHwgVHlwZS5pc1N0cmluZyhvcHRpb25zKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggdGhlIGl0ZW1zIGluIHRoZSBlbGVtZW50J3MgcXVldWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaCgkLnF1ZXVlKGVsZW1lbnQsIFR5cGUuaXNTdHJpbmcob3B0aW9ucykgPyBvcHRpb25zIDogXCJcIiksIGZ1bmN0aW9uKF8sIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSBxdWV1ZSBhcnJheSBjYW4gY29udGFpbiBhbiBcImlucHJvZ3Jlc3NcIiBzdHJpbmcsIHdoaWNoIHdlIHNraXAuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVHlwZS5pc0Z1bmN0aW9uKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogUGFzcyB0aGUgaXRlbSdzIGNhbGxiYWNrIGEgZmxhZyBpbmRpY2F0aW5nIHRoYXQgd2Ugd2FudCB0byBhYm9ydCBmcm9tIHRoZSBxdWV1ZSBjYWxsLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoU3BlY2lmaWNhbGx5LCB0aGUgcXVldWUgd2lsbCByZXNvbHZlIHRoZSBjYWxsJ3MgYXNzb2NpYXRlZCBwcm9taXNlIHRoZW4gYWJvcnQuKSAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtKG51bGwsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDbGVhcmluZyB0aGUgJC5xdWV1ZSgpIGFycmF5IGlzIGFjaGlldmVkIGJ5IHJlc2V0dGluZyBpdCB0byBbXS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5xdWV1ZShlbGVtZW50LCBUeXBlLmlzU3RyaW5nKG9wdGlvbnMpID8gb3B0aW9ucyA6IFwiXCIsIFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllc01hcCA9PT0gXCJzdG9wXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU2luY2UgXCJyZXZlcnNlXCIgdXNlcyBjYWNoZWQgc3RhcnQgdmFsdWVzICh0aGUgcHJldmlvdXMgY2FsbCdzIGVuZFZhbHVlcyksIHRoZXNlIHZhbHVlcyBtdXN0IGJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkIHRvIHJlZmxlY3QgdGhlIGZpbmFsIHZhbHVlIHRoYXQgdGhlIGVsZW1lbnRzIHdlcmUgYWN0dWFsbHkgdHdlZW5lZCB0by4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogSWYgb25seSBxdWV1ZTpmYWxzZSBhbmltYXRpb25zIGFyZSBjdXJyZW50bHkgcnVubmluZyBvbiBhbiBlbGVtZW50LCBpdCB3b24ndCBoYXZlIGEgdHdlZW5zQ29udGFpbmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuIEFsc28sIHF1ZXVlOmZhbHNlIGFuaW1hdGlvbnMgY2FuJ3QgYmUgcmV2ZXJzZWQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gRGF0YShlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS50d2VlbnNDb250YWluZXIgJiYgcXVldWVOYW1lICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGRhdGEudHdlZW5zQ29udGFpbmVyLCBmdW5jdGlvbihtLCBhY3RpdmVUd2Vlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZVR3ZWVuLmVuZFZhbHVlID0gYWN0aXZlVHdlZW4uY3VycmVudFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsc1RvU3RvcC5wdXNoKGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcGVydGllc01hcCA9PT0gXCJmaW5pc2hcIiB8fCBwcm9wZXJ0aWVzTWFwID09PSBcImZpbmlzaEFsbFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRvIGdldCBhY3RpdmUgdHdlZW5zIHRvIGZpbmlzaCBpbW1lZGlhdGVseSwgd2UgZm9yY2VmdWxseSBzaG9ydGVuIHRoZWlyIGR1cmF0aW9ucyB0byAxbXMgc28gdGhhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhleSBmaW5pc2ggdXBvbiB0aGUgbmV4dCByQWYgdGljayB0aGVuIHByb2NlZWQgd2l0aCBub3JtYWwgY2FsbCBjb21wbGV0aW9uIGxvZ2ljLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVDYWxsWzJdLmR1cmF0aW9uID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBQcmVtYXR1cmVseSBjYWxsIGNvbXBsZXRlQ2FsbCgpIG9uIGVhY2ggbWF0Y2hlZCBhY3RpdmUgY2FsbC4gUGFzcyBhbiBhZGRpdGlvbmFsIGZsYWcgZm9yIFwic3RvcFwiIHRvIGluZGljYXRlXG4gICAgICAgICAgICAgICAgICAgICB0aGF0IHRoZSBjb21wbGV0ZSBjYWxsYmFjayBhbmQgZGlzcGxheTpub25lIHNldHRpbmcgc2hvdWxkIGJlIHNraXBwZWQgc2luY2Ugd2UncmUgY29tcGxldGluZyBwcmVtYXR1cmVseS4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXNNYXAgPT09IFwic3RvcFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goY2FsbHNUb1N0b3AsIGZ1bmN0aW9uKGksIGopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZUNhbGwoaiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2VEYXRhLnByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJbW1lZGlhdGVseSByZXNvbHZlIHRoZSBwcm9taXNlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHN0b3AgY2FsbCBzaW5jZSBzdG9wIHJ1bnMgc3luY2hyb25vdXNseS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlRGF0YS5yZXNvbHZlcihlbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKiBTaW5jZSB3ZSdyZSBzdG9wcGluZywgYW5kIG5vdCBwcm9jZWVkaW5nIHdpdGggcXVldWVpbmcsIGV4aXQgb3V0IG9mIFZlbG9jaXR5LiAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0Q2hhaW4oKTtcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIC8qIFRyZWF0IGEgbm9uLWVtcHR5IHBsYWluIG9iamVjdCBhcyBhIGxpdGVyYWwgcHJvcGVydGllcyBtYXAuICovXG4gICAgICAgICAgICAgICAgICAgIGlmICgkLmlzUGxhaW5PYmplY3QocHJvcGVydGllc01hcCkgJiYgIVR5cGUuaXNFbXB0eU9iamVjdChwcm9wZXJ0aWVzTWFwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uID0gXCJzdGFydFwiO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgIFJlZGlyZWN0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIENoZWNrIGlmIGEgc3RyaW5nIG1hdGNoZXMgYSByZWdpc3RlcmVkIHJlZGlyZWN0IChzZWUgUmVkaXJlY3RzIGFib3ZlKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChUeXBlLmlzU3RyaW5nKHByb3BlcnRpZXNNYXApICYmIFZlbG9jaXR5LlJlZGlyZWN0c1twcm9wZXJ0aWVzTWFwXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0cyA9ICQuZXh0ZW5kKHt9LCBvcHRpb25zKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGR1cmF0aW9uT3JpZ2luYWwgPSBvcHRzLmR1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5T3JpZ2luYWwgPSBvcHRzLmRlbGF5IHx8IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBiYWNrd2FyZHMgb3B0aW9uIHdhcyBwYXNzZWQgaW4sIHJldmVyc2UgdGhlIGVsZW1lbnQgc2V0IHNvIHRoYXQgZWxlbWVudHMgYW5pbWF0ZSBmcm9tIHRoZSBsYXN0IHRvIHRoZSBmaXJzdC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLmJhY2t3YXJkcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzID0gJC5leHRlbmQodHJ1ZSwgW10sIGVsZW1lbnRzKS5yZXZlcnNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEluZGl2aWR1YWxseSB0cmlnZ2VyIHRoZSByZWRpcmVjdCBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSBzZXQgdG8gcHJldmVudCB1c2VycyBmcm9tIGhhdmluZyB0byBoYW5kbGUgaXRlcmF0aW9uIGxvZ2ljIGluIHRoZWlyIHJlZGlyZWN0LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbihlbGVtZW50SW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgc3RhZ2dlciBvcHRpb24gd2FzIHBhc3NlZCBpbiwgc3VjY2Vzc2l2ZWx5IGRlbGF5IGVhY2ggZWxlbWVudCBieSB0aGUgc3RhZ2dlciB2YWx1ZSAoaW4gbXMpLiBSZXRhaW4gdGhlIG9yaWdpbmFsIGRlbGF5IHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZUZsb2F0KG9wdHMuc3RhZ2dlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5kZWxheSA9IGRlbGF5T3JpZ2luYWwgKyAocGFyc2VGbG9hdChvcHRzLnN0YWdnZXIpICogZWxlbWVudEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFR5cGUuaXNGdW5jdGlvbihvcHRzLnN0YWdnZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuZGVsYXkgPSBkZWxheU9yaWdpbmFsICsgb3B0cy5zdGFnZ2VyLmNhbGwoZWxlbWVudCwgZWxlbWVudEluZGV4LCBlbGVtZW50c0xlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGRyYWcgb3B0aW9uIHdhcyBwYXNzZWQgaW4sIHN1Y2Nlc3NpdmVseSBpbmNyZWFzZS9kZWNyZWFzZSAoZGVwZW5kaW5nIG9uIHRoZSBwcmVzZW5zZSBvZiBvcHRzLmJhY2t3YXJkcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGR1cmF0aW9uIG9mIGVhY2ggZWxlbWVudCdzIGFuaW1hdGlvbiwgdXNpbmcgZmxvb3JzIHRvIHByZXZlbnQgcHJvZHVjaW5nIHZlcnkgc2hvcnQgZHVyYXRpb25zLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLmRyYWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRGVmYXVsdCB0aGUgZHVyYXRpb24gb2YgVUkgcGFjayBlZmZlY3RzIChjYWxsb3V0cyBhbmQgdHJhbnNpdGlvbnMpIHRvIDEwMDBtcyBpbnN0ZWFkIG9mIHRoZSB1c3VhbCBkZWZhdWx0IGR1cmF0aW9uIG9mIDQwMG1zLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmR1cmF0aW9uID0gcGFyc2VGbG9hdChkdXJhdGlvbk9yaWdpbmFsKSB8fCAoL14oY2FsbG91dHx0cmFuc2l0aW9uKS8udGVzdChwcm9wZXJ0aWVzTWFwKSA/IDEwMDAgOiBEVVJBVElPTl9ERUZBVUxUKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBGb3IgZWFjaCBlbGVtZW50LCB0YWtlIHRoZSBncmVhdGVyIGR1cmF0aW9uIG9mOiBBKSBhbmltYXRpb24gY29tcGxldGlvbiBwZXJjZW50YWdlIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW5hbCBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEIpIDc1JSBvZiB0aGUgb3JpZ2luYWwgZHVyYXRpb24sIG9yIEMpIGEgMjAwbXMgZmFsbGJhY2sgKGluIGNhc2UgZHVyYXRpb24gaXMgYWxyZWFkeSBzZXQgdG8gYSBsb3cgdmFsdWUpLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGVuZCByZXN1bHQgaXMgYSBiYXNlbGluZSBvZiA3NSUgb2YgdGhlIHJlZGlyZWN0J3MgZHVyYXRpb24gdGhhdCBpbmNyZWFzZXMvZGVjcmVhc2VzIGFzIHRoZSBlbmQgb2YgdGhlIGVsZW1lbnQgc2V0IGlzIGFwcHJvYWNoZWQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuZHVyYXRpb24gPSBNYXRoLm1heChvcHRzLmR1cmF0aW9uICogKG9wdHMuYmFja3dhcmRzID8gMSAtIGVsZW1lbnRJbmRleCAvIGVsZW1lbnRzTGVuZ3RoIDogKGVsZW1lbnRJbmRleCArIDEpIC8gZWxlbWVudHNMZW5ndGgpLCBvcHRzLmR1cmF0aW9uICogMC43NSwgMjAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBQYXNzIGluIHRoZSBjYWxsJ3Mgb3B0cyBvYmplY3Qgc28gdGhhdCB0aGUgcmVkaXJlY3QgY2FuIG9wdGlvbmFsbHkgZXh0ZW5kIGl0LiBJdCBkZWZhdWx0cyB0byBhbiBlbXB0eSBvYmplY3QgaW5zdGVhZCBvZiBudWxsIHRvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZHVjZSB0aGUgb3B0cyBjaGVja2luZyBsb2dpYyByZXF1aXJlZCBpbnNpZGUgdGhlIHJlZGlyZWN0LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LlJlZGlyZWN0c1twcm9wZXJ0aWVzTWFwXS5jYWxsKGVsZW1lbnQsIGVsZW1lbnQsIG9wdHMgfHwge30sIGVsZW1lbnRJbmRleCwgZWxlbWVudHNMZW5ndGgsIGVsZW1lbnRzLCBwcm9taXNlRGF0YS5wcm9taXNlID8gcHJvbWlzZURhdGEgOiB1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNpbmNlIHRoZSBhbmltYXRpb24gbG9naWMgcmVzaWRlcyB3aXRoaW4gdGhlIHJlZGlyZWN0J3Mgb3duIGNvZGUsIGFib3J0IHRoZSByZW1haW5kZXIgb2YgdGhpcyBjYWxsLlxuICAgICAgICAgICAgICAgICAgICAgICAgIChUaGUgcGVyZm9ybWFuY2Ugb3ZlcmhlYWQgdXAgdG8gdGhpcyBwb2ludCBpcyB2aXJ0dWFsbHkgbm9uLWV4aXN0YW50LikgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFRoZSBqUXVlcnkgY2FsbCBjaGFpbiBpcyBrZXB0IGludGFjdCBieSByZXR1cm5pbmcgdGhlIGNvbXBsZXRlIGVsZW1lbnQgc2V0LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldENoYWluKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWJvcnRFcnJvciA9IFwiVmVsb2NpdHk6IEZpcnN0IGFyZ3VtZW50IChcIiArIHByb3BlcnRpZXNNYXAgKyBcIikgd2FzIG5vdCBhIHByb3BlcnR5IG1hcCwgYSBrbm93biBhY3Rpb24sIG9yIGEgcmVnaXN0ZXJlZCByZWRpcmVjdC4gQWJvcnRpbmcuXCI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlRGF0YS5wcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZURhdGEucmVqZWN0ZXIobmV3IEVycm9yKGFib3J0RXJyb3IpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYWJvcnRFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRDaGFpbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgIENhbGwtV2lkZSBWYXJpYWJsZXNcbiAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgLyogQSBjb250YWluZXIgZm9yIENTUyB1bml0IGNvbnZlcnNpb24gcmF0aW9zIChlLmcuICUsIHJlbSwgYW5kIGVtID09PiBweCkgdGhhdCBpcyB1c2VkIHRvIGNhY2hlIHJhdGlvcyBhY3Jvc3MgYWxsIGVsZW1lbnRzXG4gICAgICAgICAgICAgYmVpbmcgYW5pbWF0ZWQgaW4gYSBzaW5nbGUgVmVsb2NpdHkgY2FsbC4gQ2FsY3VsYXRpbmcgdW5pdCByYXRpb3MgbmVjZXNzaXRhdGVzIERPTSBxdWVyeWluZyBhbmQgdXBkYXRpbmcsIGFuZCBpcyB0aGVyZWZvcmVcbiAgICAgICAgICAgICBhdm9pZGVkICh2aWEgY2FjaGluZykgd2hlcmV2ZXIgcG9zc2libGUuIFRoaXMgY29udGFpbmVyIGlzIGNhbGwtd2lkZSBpbnN0ZWFkIG9mIHBhZ2Utd2lkZSB0byBhdm9pZCB0aGUgcmlzayBvZiB1c2luZyBzdGFsZVxuICAgICAgICAgICAgIGNvbnZlcnNpb24gbWV0cmljcyBhY3Jvc3MgVmVsb2NpdHkgYW5pbWF0aW9ucyB0aGF0IGFyZSBub3QgaW1tZWRpYXRlbHkgY29uc2VjdXRpdmVseSBjaGFpbmVkLiAqL1xuICAgICAgICAgICAgdmFyIGNhbGxVbml0Q29udmVyc2lvbkRhdGEgPSB7XG4gICAgICAgICAgICAgICAgbGFzdFBhcmVudDogbnVsbCxcbiAgICAgICAgICAgICAgICBsYXN0UG9zaXRpb246IG51bGwsXG4gICAgICAgICAgICAgICAgbGFzdEZvbnRTaXplOiBudWxsLFxuICAgICAgICAgICAgICAgIGxhc3RQZXJjZW50VG9QeFdpZHRoOiBudWxsLFxuICAgICAgICAgICAgICAgIGxhc3RQZXJjZW50VG9QeEhlaWdodDogbnVsbCxcbiAgICAgICAgICAgICAgICBsYXN0RW1Ub1B4OiBudWxsLFxuICAgICAgICAgICAgICAgIHJlbVRvUHg6IG51bGwsXG4gICAgICAgICAgICAgICAgdndUb1B4OiBudWxsLFxuICAgICAgICAgICAgICAgIHZoVG9QeDogbnVsbFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLyogQSBjb250YWluZXIgZm9yIGFsbCB0aGUgZW5zdWluZyB0d2VlbiBkYXRhIGFuZCBtZXRhZGF0YSBhc3NvY2lhdGVkIHdpdGggdGhpcyBjYWxsLiBUaGlzIGNvbnRhaW5lciBnZXRzIHB1c2hlZCB0byB0aGUgcGFnZS13aWRlXG4gICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuY2FsbHMgYXJyYXkgdGhhdCBpcyBwcm9jZXNzZWQgZHVyaW5nIGFuaW1hdGlvbiB0aWNraW5nLiAqL1xuICAgICAgICAgICAgdmFyIGNhbGwgPSBbXTtcblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgIEVsZW1lbnQgUHJvY2Vzc2luZ1xuICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgLyogRWxlbWVudCBwcm9jZXNzaW5nIGNvbnNpc3RzIG9mIHRocmVlIHBhcnRzIC0tIGRhdGEgcHJvY2Vzc2luZyB0aGF0IGNhbm5vdCBnbyBzdGFsZSBhbmQgZGF0YSBwcm9jZXNzaW5nIHRoYXQgKmNhbiogZ28gc3RhbGUgKGkuZS4gdGhpcmQtcGFydHkgc3R5bGUgbW9kaWZpY2F0aW9ucyk6XG4gICAgICAgICAgICAgMSkgUHJlLVF1ZXVlaW5nOiBFbGVtZW50LXdpZGUgdmFyaWFibGVzLCBpbmNsdWRpbmcgdGhlIGVsZW1lbnQncyBkYXRhIHN0b3JhZ2UsIGFyZSBpbnN0YW50aWF0ZWQuIENhbGwgb3B0aW9ucyBhcmUgcHJlcGFyZWQuIElmIHRyaWdnZXJlZCwgdGhlIFN0b3AgYWN0aW9uIGlzIGV4ZWN1dGVkLlxuICAgICAgICAgICAgIDIpIFF1ZXVlaW5nOiBUaGUgbG9naWMgdGhhdCBydW5zIG9uY2UgdGhpcyBjYWxsIGhhcyByZWFjaGVkIGl0cyBwb2ludCBvZiBleGVjdXRpb24gaW4gdGhlIGVsZW1lbnQncyAkLnF1ZXVlKCkgc3RhY2suIE1vc3QgbG9naWMgaXMgcGxhY2VkIGhlcmUgdG8gYXZvaWQgcmlza2luZyBpdCBiZWNvbWluZyBzdGFsZS5cbiAgICAgICAgICAgICAzKSBQdXNoaW5nOiBDb25zb2xpZGF0aW9uIG9mIHRoZSB0d2VlbiBkYXRhIGZvbGxvd2VkIGJ5IGl0cyBwdXNoIG9udG8gdGhlIGdsb2JhbCBpbi1wcm9ncmVzcyBjYWxscyBjb250YWluZXIuXG4gICAgICAgICAgICAgYGVsZW1lbnRBcnJheUluZGV4YCBhbGxvd3MgcGFzc2luZyBpbmRleCBvZiB0aGUgZWxlbWVudCBpbiB0aGUgb3JpZ2luYWwgYXJyYXkgdG8gdmFsdWUgZnVuY3Rpb25zLlxuICAgICAgICAgICAgIElmIGBlbGVtZW50c0luZGV4YCB3ZXJlIHVzZWQgaW5zdGVhZCB0aGUgaW5kZXggd291bGQgYmUgZGV0ZXJtaW5lZCBieSB0aGUgZWxlbWVudHMnIHBlci1lbGVtZW50IHF1ZXVlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiBwcm9jZXNzRWxlbWVudChlbGVtZW50LCBlbGVtZW50QXJyYXlJbmRleCkge1xuXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgUGFydCBJOiBQcmUtUXVldWVpbmdcbiAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgRWxlbWVudC1XaWRlIFZhcmlhYmxlc1xuICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICB2YXIgLyogVGhlIHJ1bnRpbWUgb3B0cyBvYmplY3QgaXMgdGhlIGV4dGVuc2lvbiBvZiB0aGUgY3VycmVudCBjYWxsJ3Mgb3B0aW9ucyBhbmQgVmVsb2NpdHkncyBwYWdlLXdpZGUgb3B0aW9uIGRlZmF1bHRzLiAqL1xuICAgICAgICAgICAgICAgICAgICBvcHRzID0gJC5leHRlbmQoe30sIFZlbG9jaXR5LmRlZmF1bHRzLCBvcHRpb25zKSxcbiAgICAgICAgICAgICAgICAgICAgLyogQSBjb250YWluZXIgZm9yIHRoZSBwcm9jZXNzZWQgZGF0YSBhc3NvY2lhdGVkIHdpdGggZWFjaCBwcm9wZXJ0eSBpbiB0aGUgcHJvcGVydHlNYXAuXG4gICAgICAgICAgICAgICAgICAgICAoRWFjaCBwcm9wZXJ0eSBpbiB0aGUgbWFwIHByb2R1Y2VzIGl0cyBvd24gXCJ0d2VlblwiLikgKi9cbiAgICAgICAgICAgICAgICAgICAgdHdlZW5zQ29udGFpbmVyID0ge30sXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRVbml0Q29udmVyc2lvbkRhdGE7XG5cbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgIEVsZW1lbnQgSW5pdFxuICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICBpZiAoRGF0YShlbGVtZW50KSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LmluaXQoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICBPcHRpb246IERlbGF5XG4gICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIC8qIFNpbmNlIHF1ZXVlOmZhbHNlIGRvZXNuJ3QgcmVzcGVjdCB0aGUgaXRlbSdzIGV4aXN0aW5nIHF1ZXVlLCB3ZSBhdm9pZCBpbmplY3RpbmcgaXRzIGRlbGF5IGhlcmUgKGl0J3Mgc2V0IGxhdGVyIG9uKS4gKi9cbiAgICAgICAgICAgICAgICAvKiBOb3RlOiBWZWxvY2l0eSByb2xscyBpdHMgb3duIGRlbGF5IGZ1bmN0aW9uIHNpbmNlIGpRdWVyeSBkb2Vzbid0IGhhdmUgYSB1dGlsaXR5IGFsaWFzIGZvciAkLmZuLmRlbGF5KClcbiAgICAgICAgICAgICAgICAgKGFuZCB0aHVzIHJlcXVpcmVzIGpRdWVyeSBlbGVtZW50IGNyZWF0aW9uLCB3aGljaCB3ZSBhdm9pZCBzaW5jZSBpdHMgb3ZlcmhlYWQgaW5jbHVkZXMgRE9NIHF1ZXJ5aW5nKS4gKi9cbiAgICAgICAgICAgICAgICBpZiAocGFyc2VGbG9hdChvcHRzLmRlbGF5KSAmJiBvcHRzLnF1ZXVlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAkLnF1ZXVlKGVsZW1lbnQsIG9wdHMucXVldWUsIGZ1bmN0aW9uKG5leHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoaXMgaXMgYSBmbGFnIHVzZWQgdG8gaW5kaWNhdGUgdG8gdGhlIHVwY29taW5nIGNvbXBsZXRlQ2FsbCgpIGZ1bmN0aW9uIHRoYXQgdGhpcyBxdWV1ZSBlbnRyeSB3YXMgaW5pdGlhdGVkIGJ5IFZlbG9jaXR5LiBTZWUgY29tcGxldGVDYWxsKCkgZm9yIGZ1cnRoZXIgZGV0YWlscy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LnZlbG9jaXR5UXVldWVFbnRyeUZsYWcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBUaGUgZW5zdWluZyBxdWV1ZSBpdGVtICh3aGljaCBpcyBhc3NpZ25lZCB0byB0aGUgXCJuZXh0XCIgYXJndW1lbnQgdGhhdCAkLnF1ZXVlKCkgYXV0b21hdGljYWxseSBwYXNzZXMgaW4pIHdpbGwgYmUgdHJpZ2dlcmVkIGFmdGVyIGEgc2V0VGltZW91dCBkZWxheS5cbiAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgc2V0VGltZW91dCBpcyBzdG9yZWQgc28gdGhhdCBpdCBjYW4gYmUgc3ViamVjdGVkIHRvIGNsZWFyVGltZW91dCgpIGlmIHRoaXMgYW5pbWF0aW9uIGlzIHByZW1hdHVyZWx5IHN0b3BwZWQgdmlhIFZlbG9jaXR5J3MgXCJzdG9wXCIgY29tbWFuZCwgYW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgZGVsYXlCZWdpbi9kZWxheVRpbWUgaXMgdXNlZCB0byBlbnN1cmUgd2UgY2FuIFwicGF1c2VcIiBhbmQgXCJyZXN1bWVcIiBhIHR3ZWVuIHRoYXQgaXMgc3RpbGwgbWlkLWRlbGF5LiAqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBUZW1wb3JhcmlseSBzdG9yZSBkZWxheWVkIGVsZW1lbnRzIHRvIGZhY2lsaXRlIGFjY2VzcyBmb3IgZ2xvYmFsIHBhdXNlL3Jlc3VtZSAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNhbGxJbmRleCA9IFZlbG9jaXR5LlN0YXRlLmRlbGF5ZWRFbGVtZW50cy5jb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuZGVsYXllZEVsZW1lbnRzW2NhbGxJbmRleF0gPSBlbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVsYXlDb21wbGV0ZSA9IChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2xlYXIgdGhlIHRlbXBvcmFyeSBlbGVtZW50ICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLmRlbGF5ZWRFbGVtZW50c1tpbmRleF0gPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBGaW5hbGx5LCBpc3N1ZSB0aGUgY2FsbCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKGNhbGxJbmRleCk7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS5kZWxheUJlZ2luID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGEoZWxlbWVudCkuZGVsYXkgPSBwYXJzZUZsb2F0KG9wdHMuZGVsYXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS5kZWxheVRpbWVyID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQ6IHNldFRpbWVvdXQobmV4dCwgcGFyc2VGbG9hdChvcHRzLmRlbGF5KSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dDogZGVsYXlDb21wbGV0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICBPcHRpb246IER1cmF0aW9uXG4gICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIC8qIFN1cHBvcnQgZm9yIGpRdWVyeSdzIG5hbWVkIGR1cmF0aW9ucy4gKi9cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKG9wdHMuZHVyYXRpb24udG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJmYXN0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmR1cmF0aW9uID0gMjAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm5vcm1hbFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5kdXJhdGlvbiA9IERVUkFUSU9OX0RFRkFVTFQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2xvd1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5kdXJhdGlvbiA9IDYwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBSZW1vdmUgdGhlIHBvdGVudGlhbCBcIm1zXCIgc3VmZml4IGFuZCBkZWZhdWx0IHRvIDEgaWYgdGhlIHVzZXIgaXMgYXR0ZW1wdGluZyB0byBzZXQgYSBkdXJhdGlvbiBvZiAwIChpbiBvcmRlciB0byBwcm9kdWNlIGFuIGltbWVkaWF0ZSBzdHlsZSBjaGFuZ2UpLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5kdXJhdGlvbiA9IHBhcnNlRmxvYXQob3B0cy5kdXJhdGlvbikgfHwgMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgIEdsb2JhbCBPcHRpb246IE1vY2tcbiAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgaWYgKFZlbG9jaXR5Lm1vY2sgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIEluIG1vY2sgbW9kZSwgYWxsIGFuaW1hdGlvbnMgYXJlIGZvcmNlZCB0byAxbXMgc28gdGhhdCB0aGV5IG9jY3VyIGltbWVkaWF0ZWx5IHVwb24gdGhlIG5leHQgckFGIHRpY2suXG4gICAgICAgICAgICAgICAgICAgICBBbHRlcm5hdGl2ZWx5LCBhIG11bHRpcGxpZXIgY2FuIGJlIHBhc3NlZCBpbiB0byB0aW1lIHJlbWFwIGFsbCBkZWxheXMgYW5kIGR1cmF0aW9ucy4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKFZlbG9jaXR5Lm1vY2sgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuZHVyYXRpb24gPSBvcHRzLmRlbGF5ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuZHVyYXRpb24gKj0gcGFyc2VGbG9hdChWZWxvY2l0eS5tb2NrKSB8fCAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5kZWxheSAqPSBwYXJzZUZsb2F0KFZlbG9jaXR5Lm1vY2spIHx8IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICBPcHRpb246IEVhc2luZ1xuICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgb3B0cy5lYXNpbmcgPSBnZXRFYXNpbmcob3B0cy5lYXNpbmcsIG9wdHMuZHVyYXRpb24pO1xuXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgT3B0aW9uOiBDYWxsYmFja3NcbiAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIC8qIENhbGxiYWNrcyBtdXN0IGZ1bmN0aW9ucy4gT3RoZXJ3aXNlLCBkZWZhdWx0IHRvIG51bGwuICovXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMuYmVnaW4gJiYgIVR5cGUuaXNGdW5jdGlvbihvcHRzLmJlZ2luKSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRzLmJlZ2luID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAob3B0cy5wcm9ncmVzcyAmJiAhVHlwZS5pc0Z1bmN0aW9uKG9wdHMucHJvZ3Jlc3MpKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdHMucHJvZ3Jlc3MgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChvcHRzLmNvbXBsZXRlICYmICFUeXBlLmlzRnVuY3Rpb24ob3B0cy5jb21wbGV0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5jb21wbGV0ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICBPcHRpb246IERpc3BsYXkgJiBWaXNpYmlsaXR5XG4gICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIC8qIFJlZmVyIHRvIFZlbG9jaXR5J3MgZG9jdW1lbnRhdGlvbiAoVmVsb2NpdHlKUy5vcmcvI2Rpc3BsYXlBbmRWaXNpYmlsaXR5KSBmb3IgYSBkZXNjcmlwdGlvbiBvZiB0aGUgZGlzcGxheSBhbmQgdmlzaWJpbGl0eSBvcHRpb25zJyBiZWhhdmlvci4gKi9cbiAgICAgICAgICAgICAgICAvKiBOb3RlOiBXZSBzdHJpY3RseSBjaGVjayBmb3IgdW5kZWZpbmVkIGluc3RlYWQgb2YgZmFsc2luZXNzIGJlY2F1c2UgZGlzcGxheSBhY2NlcHRzIGFuIGVtcHR5IHN0cmluZyB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICBpZiAob3B0cy5kaXNwbGF5ICE9PSB1bmRlZmluZWQgJiYgb3B0cy5kaXNwbGF5ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdHMuZGlzcGxheSA9IG9wdHMuZGlzcGxheS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogVXNlcnMgY2FuIHBhc3MgaW4gYSBzcGVjaWFsIFwiYXV0b1wiIHZhbHVlIHRvIGluc3RydWN0IFZlbG9jaXR5IHRvIHNldCB0aGUgZWxlbWVudCB0byBpdHMgZGVmYXVsdCBkaXNwbGF5IHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5kaXNwbGF5ID09PSBcImF1dG9cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5kaXNwbGF5ID0gVmVsb2NpdHkuQ1NTLlZhbHVlcy5nZXREaXNwbGF5VHlwZShlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChvcHRzLnZpc2liaWxpdHkgIT09IHVuZGVmaW5lZCAmJiBvcHRzLnZpc2liaWxpdHkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0cy52aXNpYmlsaXR5ID0gb3B0cy52aXNpYmlsaXR5LnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICBPcHRpb246IG1vYmlsZUhBXG4gICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAvKiBXaGVuIHNldCB0byB0cnVlLCBhbmQgaWYgdGhpcyBpcyBhIG1vYmlsZSBkZXZpY2UsIG1vYmlsZUhBIGF1dG9tYXRpY2FsbHkgZW5hYmxlcyBoYXJkd2FyZSBhY2NlbGVyYXRpb24gKHZpYSBhIG51bGwgdHJhbnNmb3JtIGhhY2spXG4gICAgICAgICAgICAgICAgIG9uIGFuaW1hdGluZyBlbGVtZW50cy4gSEEgaXMgcmVtb3ZlZCBmcm9tIHRoZSBlbGVtZW50IGF0IHRoZSBjb21wbGV0aW9uIG9mIGl0cyBhbmltYXRpb24uICovXG4gICAgICAgICAgICAgICAgLyogTm90ZTogQW5kcm9pZCBHaW5nZXJicmVhZCBkb2Vzbid0IHN1cHBvcnQgSEEuIElmIGEgbnVsbCB0cmFuc2Zvcm0gaGFjayAobW9iaWxlSEEpIGlzIGluIGZhY3Qgc2V0LCBpdCB3aWxsIHByZXZlbnQgb3RoZXIgdHJhbmZvcm0gc3VicHJvcGVydGllcyBmcm9tIHRha2luZyBlZmZlY3QuICovXG4gICAgICAgICAgICAgICAgLyogTm90ZTogWW91IGNhbiByZWFkIG1vcmUgYWJvdXQgdGhlIHVzZSBvZiBtb2JpbGVIQSBpbiBWZWxvY2l0eSdzIGRvY3VtZW50YXRpb246IFZlbG9jaXR5SlMub3JnLyNtb2JpbGVIQS4gKi9cbiAgICAgICAgICAgICAgICBvcHRzLm1vYmlsZUhBID0gKG9wdHMubW9iaWxlSEEgJiYgVmVsb2NpdHkuU3RhdGUuaXNNb2JpbGUgJiYgIVZlbG9jaXR5LlN0YXRlLmlzR2luZ2VyYnJlYWQpO1xuXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgIFBhcnQgSUk6IFF1ZXVlaW5nXG4gICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgLyogV2hlbiBhIHNldCBvZiBlbGVtZW50cyBpcyB0YXJnZXRlZCBieSBhIFZlbG9jaXR5IGNhbGwsIHRoZSBzZXQgaXMgYnJva2VuIHVwIGFuZCBlYWNoIGVsZW1lbnQgaGFzIHRoZSBjdXJyZW50IFZlbG9jaXR5IGNhbGwgaW5kaXZpZHVhbGx5IHF1ZXVlZCBvbnRvIGl0LlxuICAgICAgICAgICAgICAgICBJbiB0aGlzIHdheSwgZWFjaCBlbGVtZW50J3MgZXhpc3RpbmcgcXVldWUgaXMgcmVzcGVjdGVkOyBzb21lIGVsZW1lbnRzIG1heSBhbHJlYWR5IGJlIGFuaW1hdGluZyBhbmQgYWNjb3JkaW5nbHkgc2hvdWxkIG5vdCBoYXZlIHRoaXMgY3VycmVudCBWZWxvY2l0eSBjYWxsIHRyaWdnZXJlZCBpbW1lZGlhdGVseS4gKi9cbiAgICAgICAgICAgICAgICAvKiBJbiBlYWNoIHF1ZXVlLCB0d2VlbiBkYXRhIGlzIHByb2Nlc3NlZCBmb3IgZWFjaCBhbmltYXRpbmcgcHJvcGVydHkgdGhlbiBwdXNoZWQgb250byB0aGUgY2FsbC13aWRlIGNhbGxzIGFycmF5LiBXaGVuIHRoZSBsYXN0IGVsZW1lbnQgaW4gdGhlIHNldCBoYXMgaGFkIGl0cyB0d2VlbnMgcHJvY2Vzc2VkLFxuICAgICAgICAgICAgICAgICB0aGUgY2FsbCBhcnJheSBpcyBwdXNoZWQgdG8gVmVsb2NpdHkuU3RhdGUuY2FsbHMgZm9yIGxpdmUgcHJvY2Vzc2luZyBieSB0aGUgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHRpY2suICovXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gYnVpbGRRdWV1ZShuZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhLCBsYXN0VHdlZW5zQ29udGFpbmVyO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICBPcHRpb246IEJlZ2luXG4gICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIFRoZSBiZWdpbiBjYWxsYmFjayBpcyBmaXJlZCBvbmNlIHBlciBjYWxsIC0tIG5vdCBvbmNlIHBlciBlbGVtZW5ldCAtLSBhbmQgaXMgcGFzc2VkIHRoZSBmdWxsIHJhdyBET00gZWxlbWVudCBzZXQgYXMgYm90aCBpdHMgY29udGV4dCBhbmQgaXRzIGZpcnN0IGFyZ3VtZW50LiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5iZWdpbiAmJiBlbGVtZW50c0luZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBXZSB0aHJvdyBjYWxsYmFja3MgaW4gYSBzZXRUaW1lb3V0IHNvIHRoYXQgdGhyb3duIGVycm9ycyBkb24ndCBoYWx0IHRoZSBleGVjdXRpb24gb2YgVmVsb2NpdHkgaXRzZWxmLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmJlZ2luLmNhbGwoZWxlbWVudHMsIGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgIFR3ZWVuIERhdGEgQ29uc3RydWN0aW9uIChmb3IgU2Nyb2xsKVxuICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogSW4gb3JkZXIgdG8gYmUgc3ViamVjdGVkIHRvIGNoYWluaW5nIGFuZCBhbmltYXRpb24gb3B0aW9ucywgc2Nyb2xsJ3MgdHdlZW5pbmcgaXMgcm91dGVkIHRocm91Z2ggVmVsb2NpdHkgYXMgaWYgaXQgd2VyZSBhIHN0YW5kYXJkIENTUyBwcm9wZXJ0eSBhbmltYXRpb24uICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3Rpb24gPT09IFwic2Nyb2xsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSBzY3JvbGwgYWN0aW9uIHVuaXF1ZWx5IHRha2VzIGFuIG9wdGlvbmFsIFwib2Zmc2V0XCIgb3B0aW9uIC0tIHNwZWNpZmllZCBpbiBwaXhlbHMgLS0gdGhhdCBvZmZzZXRzIHRoZSB0YXJnZXRlZCBzY3JvbGwgcG9zaXRpb24uICovXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2Nyb2xsRGlyZWN0aW9uID0gKC9eeCQvaS50ZXN0KG9wdHMuYXhpcykgPyBcIkxlZnRcIiA6IFwiVG9wXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbE9mZnNldCA9IHBhcnNlRmxvYXQob3B0cy5vZmZzZXQpIHx8IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUG9zaXRpb25DdXJyZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFBvc2l0aW9uQ3VycmVudEFsdGVybmF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxQb3NpdGlvbkVuZDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogU2Nyb2xsIGFsc28gdW5pcXVlbHkgdGFrZXMgYW4gb3B0aW9uYWwgXCJjb250YWluZXJcIiBvcHRpb24sIHdoaWNoIGluZGljYXRlcyB0aGUgcGFyZW50IGVsZW1lbnQgdGhhdCBzaG91bGQgYmUgc2Nyb2xsZWQgLS1cbiAgICAgICAgICAgICAgICAgICAgICAgICBhcyBvcHBvc2VkIHRvIHRoZSBicm93c2VyIHdpbmRvdyBpdHNlbGYuIFRoaXMgaXMgdXNlZnVsIGZvciBzY3JvbGxpbmcgdG93YXJkIGFuIGVsZW1lbnQgdGhhdCdzIGluc2lkZSBhbiBvdmVyZmxvd2luZyBwYXJlbnQgZWxlbWVudC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLmNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEVuc3VyZSB0aGF0IGVpdGhlciBhIGpRdWVyeSBvYmplY3Qgb3IgYSByYXcgRE9NIGVsZW1lbnQgd2FzIHBhc3NlZCBpbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVHlwZS5pc1dyYXBwZWQob3B0cy5jb250YWluZXIpIHx8IFR5cGUuaXNOb2RlKG9wdHMuY29udGFpbmVyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBFeHRyYWN0IHRoZSByYXcgRE9NIGVsZW1lbnQgZnJvbSB0aGUgalF1ZXJ5IHdyYXBwZXIuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuY29udGFpbmVyID0gb3B0cy5jb250YWluZXJbMF0gfHwgb3B0cy5jb250YWluZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFVubGlrZSBvdGhlciBwcm9wZXJ0aWVzIGluIFZlbG9jaXR5LCB0aGUgYnJvd3NlcidzIHNjcm9sbCBwb3NpdGlvbiBpcyBuZXZlciBjYWNoZWQgc2luY2UgaXQgc28gZnJlcXVlbnRseSBjaGFuZ2VzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZHVlIHRvIHRoZSB1c2VyJ3MgbmF0dXJhbCBpbnRlcmFjdGlvbiB3aXRoIHRoZSBwYWdlKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUG9zaXRpb25DdXJyZW50ID0gb3B0cy5jb250YWluZXJbXCJzY3JvbGxcIiArIHNjcm9sbERpcmVjdGlvbl07IC8qIEdFVCAqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qICQucG9zaXRpb24oKSB2YWx1ZXMgYXJlIHJlbGF0aXZlIHRvIHRoZSBjb250YWluZXIncyBjdXJyZW50bHkgdmlld2FibGUgYXJlYSAod2l0aG91dCB0YWtpbmcgaW50byBhY2NvdW50IHRoZSBjb250YWluZXIncyB0cnVlIGRpbWVuc2lvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIHNheSwgZm9yIGV4YW1wbGUsIGlmIHRoZSBjb250YWluZXIgd2FzIG5vdCBvdmVyZmxvd2luZykuIFRodXMsIHRoZSBzY3JvbGwgZW5kIHZhbHVlIGlzIHRoZSBzdW0gb2YgdGhlIGNoaWxkIGVsZW1lbnQncyBwb3NpdGlvbiAqYW5kKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIHNjcm9sbCBjb250YWluZXIncyBjdXJyZW50IHNjcm9sbCBwb3NpdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUG9zaXRpb25FbmQgPSAoc2Nyb2xsUG9zaXRpb25DdXJyZW50ICsgJChlbGVtZW50KS5wb3NpdGlvbigpW3Njcm9sbERpcmVjdGlvbi50b0xvd2VyQ2FzZSgpXSkgKyBzY3JvbGxPZmZzZXQ7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiBhIHZhbHVlIG90aGVyIHRoYW4gYSBqUXVlcnkgb2JqZWN0IG9yIGEgcmF3IERPTSBlbGVtZW50IHdhcyBwYXNzZWQgaW4sIGRlZmF1bHQgdG8gbnVsbCBzbyB0aGF0IHRoaXMgb3B0aW9uIGlzIGlnbm9yZWQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5jb250YWluZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIHdpbmRvdyBpdHNlbGYgaXMgYmVpbmcgc2Nyb2xsZWQgLS0gbm90IGEgY29udGFpbmluZyBlbGVtZW50IC0tIHBlcmZvcm0gYSBsaXZlIHNjcm9sbCBwb3NpdGlvbiBsb29rdXAgdXNpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGFwcHJvcHJpYXRlIGNhY2hlZCBwcm9wZXJ0eSBuYW1lcyAod2hpY2ggZGlmZmVyIGJhc2VkIG9uIGJyb3dzZXIgdHlwZSkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUG9zaXRpb25DdXJyZW50ID0gVmVsb2NpdHkuU3RhdGUuc2Nyb2xsQW5jaG9yW1ZlbG9jaXR5LlN0YXRlW1wic2Nyb2xsUHJvcGVydHlcIiArIHNjcm9sbERpcmVjdGlvbl1dOyAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBXaGVuIHNjcm9sbGluZyB0aGUgYnJvd3NlciB3aW5kb3csIGNhY2hlIHRoZSBhbHRlcm5hdGUgYXhpcydzIGN1cnJlbnQgdmFsdWUgc2luY2Ugd2luZG93LnNjcm9sbFRvKCkgZG9lc24ndCBsZXQgdXMgY2hhbmdlIG9ubHkgb25lIHZhbHVlIGF0IGEgdGltZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxQb3NpdGlvbkN1cnJlbnRBbHRlcm5hdGUgPSBWZWxvY2l0eS5TdGF0ZS5zY3JvbGxBbmNob3JbVmVsb2NpdHkuU3RhdGVbXCJzY3JvbGxQcm9wZXJ0eVwiICsgKHNjcm9sbERpcmVjdGlvbiA9PT0gXCJMZWZ0XCIgPyBcIlRvcFwiIDogXCJMZWZ0XCIpXV07IC8qIEdFVCAqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVW5saWtlICQucG9zaXRpb24oKSwgJC5vZmZzZXQoKSB2YWx1ZXMgYXJlIHJlbGF0aXZlIHRvIHRoZSBicm93c2VyIHdpbmRvdydzIHRydWUgZGltZW5zaW9ucyAtLSBub3QgbWVyZWx5IGl0cyBjdXJyZW50bHkgdmlld2FibGUgYXJlYSAtLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgdGhlcmVmb3JlIGVuZCB2YWx1ZXMgZG8gbm90IG5lZWQgdG8gYmUgY29tcG91bmRlZCBvbnRvIGN1cnJlbnQgdmFsdWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFBvc2l0aW9uRW5kID0gJChlbGVtZW50KS5vZmZzZXQoKVtzY3JvbGxEaXJlY3Rpb24udG9Mb3dlckNhc2UoKV0gKyBzY3JvbGxPZmZzZXQ7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBTaW5jZSB0aGVyZSdzIG9ubHkgb25lIGZvcm1hdCB0aGF0IHNjcm9sbCdzIGFzc29jaWF0ZWQgdHdlZW5zQ29udGFpbmVyIGNhbiB0YWtlLCB3ZSBjcmVhdGUgaXQgbWFudWFsbHkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICB0d2VlbnNDb250YWluZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZTogc2Nyb2xsUG9zaXRpb25DdXJyZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWU6IHNjcm9sbFBvc2l0aW9uQ3VycmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWU6IHNjcm9sbFBvc2l0aW9uRW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0VHlwZTogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFzaW5nOiBvcHRzLmVhc2luZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsRGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyOiBvcHRzLmNvbnRhaW5lcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogc2Nyb2xsRGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWx0ZXJuYXRlVmFsdWU6IHNjcm9sbFBvc2l0aW9uQ3VycmVudEFsdGVybmF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkuZGVidWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInR3ZWVuc0NvbnRhaW5lciAoc2Nyb2xsKTogXCIsIHR3ZWVuc0NvbnRhaW5lci5zY3JvbGwsIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgVHdlZW4gRGF0YSBDb25zdHJ1Y3Rpb24gKGZvciBSZXZlcnNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogUmV2ZXJzZSBhY3RzIGxpa2UgYSBcInN0YXJ0XCIgYWN0aW9uIGluIHRoYXQgYSBwcm9wZXJ0eSBtYXAgaXMgYW5pbWF0ZWQgdG93YXJkLiBUaGUgb25seSBkaWZmZXJlbmNlIGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGhhdCB0aGUgcHJvcGVydHkgbWFwIHVzZWQgZm9yIHJldmVyc2UgaXMgdGhlIGludmVyc2Ugb2YgdGhlIG1hcCB1c2VkIGluIHRoZSBwcmV2aW91cyBjYWxsLiBUaHVzLCB3ZSBtYW5pcHVsYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGhlIHByZXZpb3VzIGNhbGwgdG8gY29uc3RydWN0IG91ciBuZXcgbWFwOiB1c2UgdGhlIHByZXZpb3VzIG1hcCdzIGVuZCB2YWx1ZXMgYXMgb3VyIG5ldyBtYXAncyBzdGFydCB2YWx1ZXMuIENvcHkgb3ZlciBhbGwgb3RoZXIgZGF0YS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFJldmVyc2UgY2FuIGJlIGRpcmVjdGx5IGNhbGxlZCB2aWEgdGhlIFwicmV2ZXJzZVwiIHBhcmFtZXRlciwgb3IgaXQgY2FuIGJlIGluZGlyZWN0bHkgdHJpZ2dlcmVkIHZpYSB0aGUgbG9vcCBvcHRpb24uIChMb29wcyBhcmUgY29tcG9zZWQgb2YgbXVsdGlwbGUgcmV2ZXJzZXMuKSAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogUmV2ZXJzZSBjYWxscyBkbyBub3QgbmVlZCB0byBiZSBjb25zZWN1dGl2ZWx5IGNoYWluZWQgb250byBhIGN1cnJlbnRseS1hbmltYXRpbmcgZWxlbWVudCBpbiBvcmRlciB0byBvcGVyYXRlIG9uIGNhY2hlZCB2YWx1ZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgdGhlcmUgaXMgbm8gaGFybSB0byByZXZlcnNlIGJlaW5nIGNhbGxlZCBvbiBhIHBvdGVudGlhbGx5IHN0YWxlIGRhdGEgY2FjaGUgc2luY2UgcmV2ZXJzZSdzIGJlaGF2aW9yIGlzIHNpbXBseSBkZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgYXMgcmV2ZXJ0aW5nIHRvIHRoZSBlbGVtZW50J3MgdmFsdWVzIGFzIHRoZXkgd2VyZSBwcmlvciB0byB0aGUgcHJldmlvdXMgKlZlbG9jaXR5KiBjYWxsLiAqL1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gXCJyZXZlcnNlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBEYXRhKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBBYm9ydCBpZiB0aGVyZSBpcyBubyBwcmlvciBhbmltYXRpb24gZGF0YSB0byByZXZlcnNlIHRvLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWRhdGEudHdlZW5zQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRGVxdWV1ZSB0aGUgZWxlbWVudCBzbyB0aGF0IHRoaXMgcXVldWUgZW50cnkgcmVsZWFzZXMgaXRzZWxmIGltbWVkaWF0ZWx5LCBhbGxvd2luZyBzdWJzZXF1ZW50IHF1ZXVlIGVudHJpZXMgdG8gcnVuLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZGVxdWV1ZShlbGVtZW50LCBvcHRzLnF1ZXVlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPcHRpb25zIFBhcnNpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGVsZW1lbnQgd2FzIGhpZGRlbiB2aWEgdGhlIGRpc3BsYXkgb3B0aW9uIGluIHRoZSBwcmV2aW91cyBjYWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXZlcnQgZGlzcGxheSB0byBcImF1dG9cIiBwcmlvciB0byByZXZlcnNhbCBzbyB0aGF0IHRoZSBlbGVtZW50IGlzIHZpc2libGUgYWdhaW4uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEub3B0cy5kaXNwbGF5ID09PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLm9wdHMuZGlzcGxheSA9IFwiYXV0b1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLm9wdHMudmlzaWJpbGl0eSA9PT0gXCJoaWRkZW5cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLm9wdHMudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBsb29wIG9wdGlvbiB3YXMgc2V0IGluIHRoZSBwcmV2aW91cyBjYWxsLCBkaXNhYmxlIGl0IHNvIHRoYXQgXCJyZXZlcnNlXCIgY2FsbHMgYXJlbid0IHJlY3Vyc2l2ZWx5IGdlbmVyYXRlZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRnVydGhlciwgcmVtb3ZlIHRoZSBwcmV2aW91cyBjYWxsJ3MgY2FsbGJhY2sgb3B0aW9uczsgdHlwaWNhbGx5LCB1c2VycyBkbyBub3Qgd2FudCB0aGVzZSB0byBiZSByZWZpcmVkLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEub3B0cy5sb29wID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5vcHRzLmJlZ2luID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLm9wdHMuY29tcGxldGUgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU2luY2Ugd2UncmUgZXh0ZW5kaW5nIGFuIG9wdHMgb2JqZWN0IHRoYXQgaGFzIGFscmVhZHkgYmVlbiBleHRlbmRlZCB3aXRoIHRoZSBkZWZhdWx0cyBvcHRpb25zIG9iamVjdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2UgcmVtb3ZlIG5vbi1leHBsaWNpdGx5LWRlZmluZWQgcHJvcGVydGllcyB0aGF0IGFyZSBhdXRvLWFzc2lnbmVkIHZhbHVlcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMuZWFzaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBvcHRzLmVhc2luZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMuZHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG9wdHMuZHVyYXRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVGhlIG9wdHMgb2JqZWN0IHVzZWQgZm9yIHJldmVyc2FsIGlzIGFuIGV4dGVuc2lvbiBvZiB0aGUgb3B0aW9ucyBvYmplY3Qgb3B0aW9uYWxseSBwYXNzZWQgaW50byB0aGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldmVyc2UgY2FsbCBwbHVzIHRoZSBvcHRpb25zIHVzZWQgaW4gdGhlIHByZXZpb3VzIFZlbG9jaXR5IGNhbGwuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cyA9ICQuZXh0ZW5kKHt9LCBkYXRhLm9wdHMsIG9wdHMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVHdlZW5zIENvbnRhaW5lciBSZWNvbnN0cnVjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ3JlYXRlIGEgZGVlcHkgY29weSAoaW5kaWNhdGVkIHZpYSB0aGUgdHJ1ZSBmbGFnKSBvZiB0aGUgcHJldmlvdXMgY2FsbCdzIHR3ZWVuc0NvbnRhaW5lci4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VHdlZW5zQ29udGFpbmVyID0gJC5leHRlbmQodHJ1ZSwge30sIGRhdGEgPyBkYXRhLnR3ZWVuc0NvbnRhaW5lciA6IG51bGwpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTWFuaXB1bGF0ZSB0aGUgcHJldmlvdXMgdHdlZW5zQ29udGFpbmVyIGJ5IHJlcGxhY2luZyBpdHMgZW5kIHZhbHVlcyBhbmQgY3VycmVudFZhbHVlcyB3aXRoIGl0cyBzdGFydCB2YWx1ZXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbGFzdFR3ZWVuIGluIGxhc3RUd2VlbnNDb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSW4gYWRkaXRpb24gdG8gdHdlZW4gZGF0YSwgdHdlZW5zQ29udGFpbmVycyBjb250YWluIGFuIGVsZW1lbnQgcHJvcGVydHkgdGhhdCB3ZSBpZ25vcmUgaGVyZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RUd2VlbnNDb250YWluZXIuaGFzT3duUHJvcGVydHkobGFzdFR3ZWVuKSAmJiBsYXN0VHdlZW4gIT09IFwiZWxlbWVudFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFzdFN0YXJ0VmFsdWUgPSBsYXN0VHdlZW5zQ29udGFpbmVyW2xhc3RUd2Vlbl0uc3RhcnRWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFR3ZWVuc0NvbnRhaW5lcltsYXN0VHdlZW5dLnN0YXJ0VmFsdWUgPSBsYXN0VHdlZW5zQ29udGFpbmVyW2xhc3RUd2Vlbl0uY3VycmVudFZhbHVlID0gbGFzdFR3ZWVuc0NvbnRhaW5lcltsYXN0VHdlZW5dLmVuZFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFR3ZWVuc0NvbnRhaW5lcltsYXN0VHdlZW5dLmVuZFZhbHVlID0gbGFzdFN0YXJ0VmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEVhc2luZyBpcyB0aGUgb25seSBvcHRpb24gdGhhdCBlbWJlZHMgaW50byB0aGUgaW5kaXZpZHVhbCB0d2VlbiBkYXRhIChzaW5jZSBpdCBjYW4gYmUgZGVmaW5lZCBvbiBhIHBlci1wcm9wZXJ0eSBiYXNpcykuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWNjb3JkaW5nbHksIGV2ZXJ5IHByb3BlcnR5J3MgZWFzaW5nIHZhbHVlIG11c3QgYmUgdXBkYXRlZCB3aGVuIGFuIG9wdGlvbnMgb2JqZWN0IGlzIHBhc3NlZCBpbiB3aXRoIGEgcmV2ZXJzZSBjYWxsLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBzaWRlIGVmZmVjdCBvZiB0aGlzIGV4dGVuc2liaWxpdHkgaXMgdGhhdCBhbGwgcGVyLXByb3BlcnR5IGVhc2luZyB2YWx1ZXMgYXJlIGZvcmNlZnVsbHkgcmVzZXQgdG8gdGhlIG5ldyB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghVHlwZS5pc0VtcHR5T2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFR3ZWVuc0NvbnRhaW5lcltsYXN0VHdlZW5dLmVhc2luZyA9IG9wdHMuZWFzaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkuZGVidWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJldmVyc2UgdHdlZW5zQ29udGFpbmVyIChcIiArIGxhc3RUd2VlbiArIFwiKTogXCIgKyBKU09OLnN0cmluZ2lmeShsYXN0VHdlZW5zQ29udGFpbmVyW2xhc3RUd2Vlbl0pLCBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuc0NvbnRhaW5lciA9IGxhc3RUd2VlbnNDb250YWluZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgIFR3ZWVuIERhdGEgQ29uc3RydWN0aW9uIChmb3IgU3RhcnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhY3Rpb24gPT09IFwic3RhcnRcIikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgIFZhbHVlIFRyYW5zZmVycmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoaXMgcXVldWUgZW50cnkgZm9sbG93cyBhIHByZXZpb3VzIFZlbG9jaXR5LWluaXRpYXRlZCBxdWV1ZSBlbnRyeSAqYW5kKiBpZiB0aGlzIGVudHJ5IHdhcyBjcmVhdGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgdGhlIGVsZW1lbnQgd2FzIGluIHRoZSBwcm9jZXNzIG9mIGJlaW5nIGFuaW1hdGVkIGJ5IFZlbG9jaXR5LCB0aGVuIHRoaXMgY3VycmVudCBjYWxsIGlzIHNhZmUgdG8gdXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGVuZCB2YWx1ZXMgZnJvbSB0aGUgcHJpb3IgY2FsbCBhcyBpdHMgc3RhcnQgdmFsdWVzLiBWZWxvY2l0eSBhdHRlbXB0cyB0byBwZXJmb3JtIHRoaXMgdmFsdWUgdHJhbnNmZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzIHdoZW5ldmVyIHBvc3NpYmxlIGluIG9yZGVyIHRvIGF2b2lkIHJlcXVlcnlpbmcgdGhlIERPTS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHZhbHVlcyBhcmVuJ3QgdHJhbnNmZXJyZWQgZnJvbSBhIHByaW9yIGNhbGwgYW5kIHN0YXJ0IHZhbHVlcyB3ZXJlIG5vdCBmb3JjZWZlZCBieSB0aGUgdXNlciAobW9yZSBvbiB0aGlzIGJlbG93KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGVuIHRoZSBET00gaXMgcXVlcmllZCBmb3IgdGhlIGVsZW1lbnQncyBjdXJyZW50IHZhbHVlcyBhcyBhIGxhc3QgcmVzb3J0LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogQ29udmVyc2VseSwgYW5pbWF0aW9uIHJldmVyc2FsIChhbmQgbG9vcGluZykgKmFsd2F5cyogcGVyZm9ybSBpbnRlci1jYWxsIHZhbHVlIHRyYW5zZmVyczsgdGhleSBuZXZlciByZXF1ZXJ5IHRoZSBET00uICovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBEYXRhKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBUaGUgcGVyLWVsZW1lbnQgaXNBbmltYXRpbmcgZmxhZyBpcyB1c2VkIHRvIGluZGljYXRlIHdoZXRoZXIgaXQncyBzYWZlIChpLmUuIHRoZSBkYXRhIGlzbid0IHN0YWxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgIHRvIHRyYW5zZmVyIG92ZXIgZW5kIHZhbHVlcyB0byB1c2UgYXMgc3RhcnQgdmFsdWVzLiBJZiBpdCdzIHNldCB0byB0cnVlIGFuZCB0aGVyZSBpcyBhIHByZXZpb3VzXG4gICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkgY2FsbCB0byBwdWxsIHZhbHVlcyBmcm9tLCBkbyBzby4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEudHdlZW5zQ29udGFpbmVyICYmIGRhdGEuaXNBbmltYXRpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VHdlZW5zQ29udGFpbmVyID0gZGF0YS50d2VlbnNDb250YWluZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICBUd2VlbiBEYXRhIENhbGN1bGF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBUaGlzIGZ1bmN0aW9uIHBhcnNlcyBwcm9wZXJ0eSBkYXRhIGFuZCBkZWZhdWx0cyBlbmRWYWx1ZSwgZWFzaW5nLCBhbmQgc3RhcnRWYWx1ZSBhcyBhcHByb3ByaWF0ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFByb3BlcnR5IG1hcCB2YWx1ZXMgY2FuIGVpdGhlciB0YWtlIHRoZSBmb3JtIG9mIDEpIGEgc2luZ2xlIHZhbHVlIHJlcHJlc2VudGluZyB0aGUgZW5kIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgIG9yIDIpIGFuIGFycmF5IGluIHRoZSBmb3JtIG9mIFsgZW5kVmFsdWUsIFssIGVhc2luZ10gWywgc3RhcnRWYWx1ZV0gXS5cbiAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgb3B0aW9uYWwgdGhpcmQgcGFyYW1ldGVyIGlzIGEgZm9yY2VmZWQgc3RhcnRWYWx1ZSB0byBiZSB1c2VkIGluc3RlYWQgb2YgcXVlcnlpbmcgdGhlIERPTSBmb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZWxlbWVudCdzIGN1cnJlbnQgdmFsdWUuIFJlYWQgVmVsb2NpdHkncyBkb2NtZW50YXRpb24gdG8gbGVhcm4gbW9yZSBhYm91dCBmb3JjZWZlZWRpbmc6IFZlbG9jaXR5SlMub3JnLyNmb3JjZWZlZWRpbmcgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJzZVByb3BlcnR5VmFsdWUgPSBmdW5jdGlvbih2YWx1ZURhdGEsIHNraXBSZXNvbHZpbmdFYXNpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZW5kVmFsdWUsIGVhc2luZywgc3RhcnRWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHdlIGhhdmUgYSBmdW5jdGlvbiBhcyB0aGUgbWFpbiBhcmd1bWVudCB0aGVuIHJlc29sdmUgaXQgZmlyc3QsIGluIGNhc2UgaXQgcmV0dXJucyBhbiBhcnJheSB0aGF0IG5lZWRzIHRvIGJlIHNwbGl0ICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFR5cGUuaXNGdW5jdGlvbih2YWx1ZURhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlRGF0YSA9IHZhbHVlRGF0YS5jYWxsKGVsZW1lbnQsIGVsZW1lbnRBcnJheUluZGV4LCBlbGVtZW50c0xlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSGFuZGxlIHRoZSBhcnJheSBmb3JtYXQsIHdoaWNoIGNhbiBiZSBzdHJ1Y3R1cmVkIGFzIG9uZSBvZiB0aHJlZSBwb3RlbnRpYWwgb3ZlcmxvYWRzOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBKSBbIGVuZFZhbHVlLCBlYXNpbmcsIHN0YXJ0VmFsdWUgXSwgQikgWyBlbmRWYWx1ZSwgZWFzaW5nIF0sIG9yIEMpIFsgZW5kVmFsdWUsIHN0YXJ0VmFsdWUgXSAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUeXBlLmlzQXJyYXkodmFsdWVEYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBlbmRWYWx1ZSBpcyBhbHdheXMgdGhlIGZpcnN0IGl0ZW0gaW4gdGhlIGFycmF5LiBEb24ndCBib3RoZXIgdmFsaWRhdGluZyBlbmRWYWx1ZSdzIHZhbHVlIG5vd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2luY2UgdGhlIGVuc3VpbmcgcHJvcGVydHkgY3ljbGluZyBsb2dpYyBkb2VzIHRoYXQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gdmFsdWVEYXRhWzBdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFR3by1pdGVtIGFycmF5IGZvcm1hdDogSWYgdGhlIHNlY29uZCBpdGVtIGlzIGEgbnVtYmVyLCBmdW5jdGlvbiwgb3IgaGV4IHN0cmluZywgdHJlYXQgaXQgYXMgYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQgdmFsdWUgc2luY2UgZWFzaW5ncyBjYW4gb25seSBiZSBub24taGV4IHN0cmluZ3Mgb3IgYXJyYXlzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKCFUeXBlLmlzQXJyYXkodmFsdWVEYXRhWzFdKSAmJiAvXltcXGQtXS8udGVzdCh2YWx1ZURhdGFbMV0pKSB8fCBUeXBlLmlzRnVuY3Rpb24odmFsdWVEYXRhWzFdKSB8fCBDU1MuUmVnRXguaXNIZXgudGVzdCh2YWx1ZURhdGFbMV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gdmFsdWVEYXRhWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVHdvIG9yIHRocmVlLWl0ZW0gYXJyYXk6IElmIHRoZSBzZWNvbmQgaXRlbSBpcyBhIG5vbi1oZXggc3RyaW5nIGVhc2luZyBuYW1lIG9yIGFuIGFycmF5LCB0cmVhdCBpdCBhcyBhbiBlYXNpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoKFR5cGUuaXNTdHJpbmcodmFsdWVEYXRhWzFdKSAmJiAhQ1NTLlJlZ0V4LmlzSGV4LnRlc3QodmFsdWVEYXRhWzFdKSAmJiBWZWxvY2l0eS5FYXNpbmdzW3ZhbHVlRGF0YVsxXV0pIHx8IFR5cGUuaXNBcnJheSh2YWx1ZURhdGFbMV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmcgPSBza2lwUmVzb2x2aW5nRWFzaW5nID8gdmFsdWVEYXRhWzFdIDogZ2V0RWFzaW5nKHZhbHVlRGF0YVsxXSwgb3B0cy5kdXJhdGlvbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIERvbid0IGJvdGhlciB2YWxpZGF0aW5nIHN0YXJ0VmFsdWUncyB2YWx1ZSBub3cgc2luY2UgdGhlIGVuc3VpbmcgcHJvcGVydHkgY3ljbGluZyBsb2dpYyBpbmhlcmVudGx5IGRvZXMgdGhhdC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSB2YWx1ZURhdGFbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gdmFsdWVEYXRhWzFdIHx8IHZhbHVlRGF0YVsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBIYW5kbGUgdGhlIHNpbmdsZS12YWx1ZSBmb3JtYXQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSB2YWx1ZURhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRGVmYXVsdCB0byB0aGUgY2FsbCdzIGVhc2luZyBpZiBhIHBlci1wcm9wZXJ0eSBlYXNpbmcgdHlwZSB3YXMgbm90IGRlZmluZWQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFza2lwUmVzb2x2aW5nRWFzaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZyA9IGVhc2luZyB8fCBvcHRzLmVhc2luZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiBmdW5jdGlvbnMgd2VyZSBwYXNzZWQgaW4gYXMgdmFsdWVzLCBwYXNzIHRoZSBmdW5jdGlvbiB0aGUgY3VycmVudCBlbGVtZW50IGFzIGl0cyBjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbHVzIHRoZSBlbGVtZW50J3MgaW5kZXggYW5kIHRoZSBlbGVtZW50IHNldCdzIHNpemUgYXMgYXJndW1lbnRzLiBUaGVuLCBhc3NpZ24gdGhlIHJldHVybmVkIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUeXBlLmlzRnVuY3Rpb24oZW5kVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gZW5kVmFsdWUuY2FsbChlbGVtZW50LCBlbGVtZW50QXJyYXlJbmRleCwgZWxlbWVudHNMZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUeXBlLmlzRnVuY3Rpb24oc3RhcnRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IHN0YXJ0VmFsdWUuY2FsbChlbGVtZW50LCBlbGVtZW50QXJyYXlJbmRleCwgZWxlbWVudHNMZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFsbG93IHN0YXJ0VmFsdWUgdG8gYmUgbGVmdCBhcyB1bmRlZmluZWQgdG8gaW5kaWNhdGUgdG8gdGhlIGVuc3VpbmcgY29kZSB0aGF0IGl0cyB2YWx1ZSB3YXMgbm90IGZvcmNlZmVkLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbZW5kVmFsdWUgfHwgMCwgZWFzaW5nLCBzdGFydFZhbHVlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaXhQcm9wZXJ0eVZhbHVlID0gZnVuY3Rpb24ocHJvcGVydHksIHZhbHVlRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEluIGNhc2UgdGhpcyBwcm9wZXJ0eSBpcyBhIGhvb2ssIHRoZXJlIGFyZSBjaXJjdW1zdGFuY2VzIHdoZXJlIHdlIHdpbGwgaW50ZW5kIHRvIHdvcmsgb24gdGhlIGhvb2sncyByb290IHByb3BlcnR5IGFuZCBub3QgdGhlIGhvb2tlZCBzdWJwcm9wZXJ0eS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm9vdFByb3BlcnR5ID0gQ1NTLkhvb2tzLmdldFJvb3QocHJvcGVydHkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBQYXJzZSBvdXQgZW5kVmFsdWUsIGVhc2luZywgYW5kIHN0YXJ0VmFsdWUgZnJvbSB0aGUgcHJvcGVydHkncyBkYXRhLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IHZhbHVlRGF0YVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFzaW5nID0gdmFsdWVEYXRhWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gdmFsdWVEYXRhWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0YXJ0IFZhbHVlIFNvdXJjaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogT3RoZXIgdGhhbiBmb3IgdGhlIGR1bW15IHR3ZWVuIHByb3BlcnR5LCBwcm9wZXJ0aWVzIHRoYXQgYXJlIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIgKGFuZCBkbyBub3QgaGF2ZSBhbiBhc3NvY2lhdGVkIG5vcm1hbGl6YXRpb24pIHdpbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5oZXJlbnRseSBwcm9kdWNlIG5vIHN0eWxlIGNoYW5nZXMgd2hlbiBzZXQsIHNvIHRoZXkgYXJlIHNraXBwZWQgaW4gb3JkZXIgdG8gZGVjcmVhc2UgYW5pbWF0aW9uIHRpY2sgb3ZlcmhlYWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFByb3BlcnR5IHN1cHBvcnQgaXMgZGV0ZXJtaW5lZCB2aWEgcHJlZml4Q2hlY2soKSwgd2hpY2ggcmV0dXJucyBhIGZhbHNlIGZsYWcgd2hlbiBubyBzdXBwb3J0ZWQgaXMgZGV0ZWN0ZWQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogU2luY2UgU1ZHIGVsZW1lbnRzIGhhdmUgc29tZSBvZiB0aGVpciBwcm9wZXJ0aWVzIGRpcmVjdGx5IGFwcGxpZWQgYXMgSFRNTCBhdHRyaWJ1dGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVyZSBpcyBubyB3YXkgdG8gY2hlY2sgZm9yIHRoZWlyIGV4cGxpY2l0IGJyb3dzZXIgc3VwcG9ydCwgYW5kIHNvIHdlIHNraXAgc2tpcCB0aGlzIGNoZWNrIGZvciB0aGVtLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoIWRhdGEgfHwgIWRhdGEuaXNTVkcpICYmIHJvb3RQcm9wZXJ0eSAhPT0gXCJ0d2VlblwiICYmIENTUy5OYW1lcy5wcmVmaXhDaGVjayhyb290UHJvcGVydHkpWzFdID09PSBmYWxzZSAmJiBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtyb290UHJvcGVydHldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFZlbG9jaXR5LmRlYnVnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNraXBwaW5nIFtcIiArIHJvb3RQcm9wZXJ0eSArIFwiXSBkdWUgdG8gYSBsYWNrIG9mIGJyb3dzZXIgc3VwcG9ydC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBkaXNwbGF5IG9wdGlvbiBpcyBiZWluZyBzZXQgdG8gYSBub24tXCJub25lXCIgKGUuZy4gXCJibG9ja1wiKSBhbmQgb3BhY2l0eSAoZmlsdGVyIG9uIElFPD04KSBpcyBiZWluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRlZCB0byBhbiBlbmRWYWx1ZSBvZiBub24temVybywgdGhlIHVzZXIncyBpbnRlbnRpb24gaXMgdG8gZmFkZSBpbiBmcm9tIGludmlzaWJsZSwgdGh1cyB3ZSBmb3JjZWZlZWQgb3BhY2l0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhIHN0YXJ0VmFsdWUgb2YgMCBpZiBpdHMgc3RhcnRWYWx1ZSBoYXNuJ3QgYWxyZWFkeSBiZWVuIHNvdXJjZWQgYnkgdmFsdWUgdHJhbnNmZXJyaW5nIG9yIHByaW9yIGZvcmNlZmVlZGluZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKChvcHRzLmRpc3BsYXkgIT09IHVuZGVmaW5lZCAmJiBvcHRzLmRpc3BsYXkgIT09IG51bGwgJiYgb3B0cy5kaXNwbGF5ICE9PSBcIm5vbmVcIikgfHwgKG9wdHMudmlzaWJpbGl0eSAhPT0gdW5kZWZpbmVkICYmIG9wdHMudmlzaWJpbGl0eSAhPT0gXCJoaWRkZW5cIikpICYmIC9vcGFjaXR5fGZpbHRlci8udGVzdChwcm9wZXJ0eSkgJiYgIXN0YXJ0VmFsdWUgJiYgZW5kVmFsdWUgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdmFsdWVzIGhhdmUgYmVlbiB0cmFuc2ZlcnJlZCBmcm9tIHRoZSBwcmV2aW91cyBWZWxvY2l0eSBjYWxsLCBleHRyYWN0IHRoZSBlbmRWYWx1ZSBhbmQgcm9vdFByb3BlcnR5VmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIGFsbCBvZiB0aGUgY3VycmVudCBjYWxsJ3MgcHJvcGVydGllcyB0aGF0IHdlcmUgKmFsc28qIGFuaW1hdGVkIGluIHRoZSBwcmV2aW91cyBjYWxsLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFZhbHVlIHRyYW5zZmVycmluZyBjYW4gb3B0aW9uYWxseSBiZSBkaXNhYmxlZCBieSB0aGUgdXNlciB2aWEgdGhlIF9jYWNoZVZhbHVlcyBvcHRpb24uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuX2NhY2hlVmFsdWVzICYmIGxhc3RUd2VlbnNDb250YWluZXIgJiYgbGFzdFR3ZWVuc0NvbnRhaW5lcltwcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IGxhc3RUd2VlbnNDb250YWluZXJbcHJvcGVydHldLmVuZFZhbHVlICsgbGFzdFR3ZWVuc0NvbnRhaW5lcltwcm9wZXJ0eV0udW5pdFR5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBUaGUgcHJldmlvdXMgY2FsbCdzIHJvb3RQcm9wZXJ0eVZhbHVlIGlzIGV4dHJhY3RlZCBmcm9tIHRoZSBlbGVtZW50J3MgZGF0YSBjYWNoZSBzaW5jZSB0aGF0J3MgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZSBvZiByb290UHJvcGVydHlWYWx1ZSB0aGF0IGdldHMgZnJlc2hseSB1cGRhdGVkIGJ5IHRoZSB0d2VlbmluZyBwcm9jZXNzLCB3aGVyZWFzIHRoZSByb290UHJvcGVydHlWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNoZWQgdG8gdGhlIGluY29taW5nIGxhc3RUd2VlbnNDb250YWluZXIgaXMgZXF1YWwgdG8gdGhlIHJvb3QgcHJvcGVydHkncyB2YWx1ZSBwcmlvciB0byBhbnkgdHdlZW5pbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlID0gZGF0YS5yb290UHJvcGVydHlWYWx1ZUNhY2hlW3Jvb3RQcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHZhbHVlcyB3ZXJlIG5vdCB0cmFuc2ZlcnJlZCBmcm9tIGEgcHJldmlvdXMgVmVsb2NpdHkgY2FsbCwgcXVlcnkgdGhlIERPTSBhcyBuZWVkZWQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSGFuZGxlIGhvb2tlZCBwcm9wZXJ0aWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoQ1NTLkhvb2tzLnJlZ2lzdGVyZWRbcHJvcGVydHldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWUgPSBDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCByb290UHJvcGVydHkpOyAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBUaGUgZm9sbG93aW5nIGdldFByb3BlcnR5VmFsdWUoKSBjYWxsIGRvZXMgbm90IGFjdHVhbGx5IHRyaWdnZXIgYSBET00gcXVlcnk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldFByb3BlcnR5VmFsdWUoKSB3aWxsIGV4dHJhY3QgdGhlIGhvb2sgZnJvbSByb290UHJvcGVydHlWYWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgcHJvcGVydHksIHJvb3RQcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiBzdGFydFZhbHVlIGlzIGFscmVhZHkgZGVmaW5lZCB2aWEgZm9yY2VmZWVkaW5nLCBkbyBub3QgcXVlcnkgdGhlIERPTSBmb3IgdGhlIHJvb3QgcHJvcGVydHkncyB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganVzdCBncmFiIHJvb3RQcm9wZXJ0eSdzIHplcm8tdmFsdWUgdGVtcGxhdGUgZnJvbSBDU1MuSG9va3MuIFRoaXMgb3ZlcndyaXRlcyB0aGUgZWxlbWVudCdzIGFjdHVhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290IHByb3BlcnR5IHZhbHVlIChpZiBvbmUgaXMgc2V0KSwgYnV0IHRoaXMgaXMgYWNjZXB0YWJsZSBzaW5jZSB0aGUgcHJpbWFyeSByZWFzb24gdXNlcnMgZm9yY2VmZWVkIGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGF2b2lkIERPTSBxdWVyaWVzLCBhbmQgdGh1cyB3ZSBsaWtld2lzZSBhdm9pZCBxdWVyeWluZyB0aGUgRE9NIGZvciB0aGUgcm9vdCBwcm9wZXJ0eSdzIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBHcmFiIHRoaXMgaG9vaydzIHplcm8tdmFsdWUgdGVtcGxhdGUsIGUuZy4gXCIwcHggMHB4IDBweCBibGFja1wiLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlID0gQ1NTLkhvb2tzLnRlbXBsYXRlc1tyb290UHJvcGVydHldWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSGFuZGxlIG5vbi1ob29rZWQgcHJvcGVydGllcyB0aGF0IGhhdmVuJ3QgYWxyZWFkeSBiZWVuIGRlZmluZWQgdmlhIGZvcmNlZmVlZGluZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdGFydFZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSBDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBwcm9wZXJ0eSk7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZhbHVlIERhdGEgRXh0cmFjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZXBhcmF0ZWRWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWVVbml0VHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZVVuaXRUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRvciA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU2VwYXJhdGVzIGEgcHJvcGVydHkgdmFsdWUgaW50byBpdHMgbnVtZXJpYyB2YWx1ZSBhbmQgaXRzIHVuaXQgdHlwZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VwYXJhdGVWYWx1ZSA9IGZ1bmN0aW9uKHByb3BlcnR5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdW5pdFR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1lcmljVmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtZXJpY1ZhbHVlID0gKHZhbHVlIHx8IFwiMFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBNYXRjaCB0aGUgdW5pdCB0eXBlIGF0IHRoZSBlbmQgb2YgdGhlIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1slQS16XSskLywgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBHcmFiIHRoZSB1bml0IHR5cGUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFR5cGUgPSBtYXRjaDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFN0cmlwIHRoZSB1bml0IHR5cGUgb2ZmIG9mIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgbm8gdW5pdCB0eXBlIHdhcyBzdXBwbGllZCwgYXNzaWduIG9uZSB0aGF0IGlzIGFwcHJvcHJpYXRlIGZvciB0aGlzIHByb3BlcnR5IChlLmcuIFwiZGVnXCIgZm9yIHJvdGF0ZVogb3IgXCJweFwiIGZvciB3aWR0aCkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdW5pdFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRUeXBlID0gQ1NTLlZhbHVlcy5nZXRVbml0VHlwZShwcm9wZXJ0eSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW251bWVyaWNWYWx1ZSwgdW5pdFR5cGVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRWYWx1ZSAhPT0gZW5kVmFsdWUgJiYgVHlwZS5pc1N0cmluZyhzdGFydFZhbHVlKSAmJiBUeXBlLmlzU3RyaW5nKGVuZFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlTdGFydCA9IDAsIC8vIGluZGV4IGluIHN0YXJ0VmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlFbmQgPSAwLCAvLyBpbmRleCBpbiBlbmRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYVN0YXJ0ID0gW10sIC8vIGFycmF5IG9mIHN0YXJ0VmFsdWUgbnVtYmVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYUVuZCA9IFtdLCAvLyBhcnJheSBvZiBlbmRWYWx1ZSBudW1iZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbkNhbGMgPSAwLCAvLyBLZWVwIHRyYWNrIG9mIGJlaW5nIGluc2lkZSBhIFwiY2FsYygpXCIgc28gd2UgZG9uJ3QgZHVwbGljYXRlIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpblJHQiA9IDAsIC8vIEtlZXAgdHJhY2sgb2YgYmVpbmcgaW5zaWRlIGFuIFJHQiBhcyB3ZSBjYW4ndCB1c2UgZnJhY3Rpb25hbCB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluUkdCQSA9IDA7IC8vIEtlZXAgdHJhY2sgb2YgYmVpbmcgaW5zaWRlIGFuIFJHQkEgYXMgd2UgbXVzdCBwYXNzIGZyYWN0aW9uYWwgZm9yIHRoZSBhbHBoYSBjaGFubmVsXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IENTUy5Ib29rcy5maXhDb2xvcnMoc3RhcnRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gQ1NTLkhvb2tzLmZpeENvbG9ycyhlbmRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChpU3RhcnQgPCBzdGFydFZhbHVlLmxlbmd0aCAmJiBpRW5kIDwgZW5kVmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY1N0YXJ0ID0gc3RhcnRWYWx1ZVtpU3RhcnRdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNFbmQgPSBlbmRWYWx1ZVtpRW5kXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC9bXFxkXFwuXS8udGVzdChjU3RhcnQpICYmIC9bXFxkXFwuXS8udGVzdChjRW5kKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0U3RhcnQgPSBjU3RhcnQsIC8vIHRlbXBvcmFyeSBjaGFyYWN0ZXIgYnVmZmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRFbmQgPSBjRW5kLCAvLyB0ZW1wb3JhcnkgY2hhcmFjdGVyIGJ1ZmZlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb3RTdGFydCA9IFwiLlwiLCAvLyBNYWtlIHN1cmUgd2UgY2FuIG9ubHkgZXZlciBtYXRjaCBhIHNpbmdsZSBkb3QgaW4gYSBkZWNpbWFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvdEVuZCA9IFwiLlwiOyAvLyBNYWtlIHN1cmUgd2UgY2FuIG9ubHkgZXZlciBtYXRjaCBhIHNpbmdsZSBkb3QgaW4gYSBkZWNpbWFsXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoKytpU3RhcnQgPCBzdGFydFZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjU3RhcnQgPSBzdGFydFZhbHVlW2lTdGFydF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjU3RhcnQgPT09IGRvdFN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb3RTdGFydCA9IFwiLi5cIjsgLy8gQ2FuIG5ldmVyIG1hdGNoIHR3byBjaGFyYWN0ZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIS9cXGQvLnRlc3QoY1N0YXJ0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdFN0YXJ0ICs9IGNTdGFydDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCsraUVuZCA8IGVuZFZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjRW5kID0gZW5kVmFsdWVbaUVuZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjRW5kID09PSBkb3RFbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvdEVuZCA9IFwiLi5cIjsgLy8gQ2FuIG5ldmVyIG1hdGNoIHR3byBjaGFyYWN0ZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIS9cXGQvLnRlc3QoY0VuZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRFbmQgKz0gY0VuZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVTdGFydCA9IENTUy5Ib29rcy5nZXRVbml0KHN0YXJ0VmFsdWUsIGlTdGFydCksIC8vIHRlbXBvcmFyeSB1bml0IHR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdUVuZCA9IENTUy5Ib29rcy5nZXRVbml0KGVuZFZhbHVlLCBpRW5kKTsgLy8gdGVtcG9yYXJ5IHVuaXQgdHlwZVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaVN0YXJ0ICs9IHVTdGFydC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaUVuZCArPSB1RW5kLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodVN0YXJ0ID09PSB1RW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNhbWUgdW5pdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRTdGFydCA9PT0gdEVuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2FtZSBudW1iZXJzLCBzbyBqdXN0IGNvcHkgb3ZlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybiArPSB0U3RhcnQgKyB1U3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEaWZmZXJlbnQgbnVtYmVycywgc28gc3RvcmUgdGhlbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybiArPSBcIntcIiArIGFTdGFydC5sZW5ndGggKyAoaW5SR0IgPyBcIiFcIiA6IFwiXCIpICsgXCJ9XCIgKyB1U3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhU3RhcnQucHVzaChwYXJzZUZsb2F0KHRTdGFydCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYUVuZC5wdXNoKHBhcnNlRmxvYXQodEVuZCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGlmZmVyZW50IHVuaXRzLCBzbyBwdXQgaW50byBhIFwiY2FsYyhmcm9tICsgdG8pXCIgYW5kIGFuaW1hdGUgZWFjaCBzaWRlIHRvL2Zyb20gemVyb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgblN0YXJ0ID0gcGFyc2VGbG9hdCh0U3RhcnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbkVuZCA9IHBhcnNlRmxvYXQodEVuZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybiArPSAoaW5DYWxjIDwgNSA/IFwiY2FsY1wiIDogXCJcIikgKyBcIihcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAoblN0YXJ0ID8gXCJ7XCIgKyBhU3RhcnQubGVuZ3RoICsgKGluUkdCID8gXCIhXCIgOiBcIlwiKSArIFwifVwiIDogXCIwXCIpICsgdVN0YXJ0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIFwiICsgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgKG5FbmQgPyBcIntcIiArIChhU3RhcnQubGVuZ3RoICsgKG5TdGFydCA/IDEgOiAwKSkgKyAoaW5SR0IgPyBcIiFcIiA6IFwiXCIpICsgXCJ9XCIgOiBcIjBcIikgKyB1RW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIFwiKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoblN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhU3RhcnQucHVzaChuU3RhcnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYUVuZC5wdXNoKDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuRW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhU3RhcnQucHVzaCgwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFFbmQucHVzaChuRW5kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY1N0YXJ0ID09PSBjRW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybiArPSBjU3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaVN0YXJ0Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaUVuZCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtlZXAgdHJhY2sgb2YgYmVpbmcgaW5zaWRlIGEgY2FsYygpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluQ2FsYyA9PT0gMCAmJiBjU3RhcnQgPT09IFwiY1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGluQ2FsYyA9PT0gMSAmJiBjU3RhcnQgPT09IFwiYVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGluQ2FsYyA9PT0gMiAmJiBjU3RhcnQgPT09IFwibFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGluQ2FsYyA9PT0gMyAmJiBjU3RhcnQgPT09IFwiY1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGluQ2FsYyA+PSA0ICYmIGNTdGFydCA9PT0gXCIoXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5DYWxjKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgoaW5DYWxjICYmIGluQ2FsYyA8IDUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGluQ2FsYyA+PSA0ICYmIGNTdGFydCA9PT0gXCIpXCIgJiYgLS1pbkNhbGMgPCA1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluQ2FsYyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtlZXAgdHJhY2sgb2YgYmVpbmcgaW5zaWRlIGFuIHJnYigpIC8gcmdiYSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluUkdCID09PSAwICYmIGNTdGFydCA9PT0gXCJyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgaW5SR0IgPT09IDEgJiYgY1N0YXJ0ID09PSBcImdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBpblJHQiA9PT0gMiAmJiBjU3RhcnQgPT09IFwiYlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGluUkdCID09PSAzICYmIGNTdGFydCA9PT0gXCJhXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgaW5SR0IgPj0gMyAmJiBjU3RhcnQgPT09IFwiKFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpblJHQiA9PT0gMyAmJiBjU3RhcnQgPT09IFwiYVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpblJHQkEgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluUkdCKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpblJHQkEgJiYgY1N0YXJ0ID09PSBcIixcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKytpblJHQkEgPiAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpblJHQiA9IGluUkdCQSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKChpblJHQkEgJiYgaW5SR0IgPCAoaW5SR0JBID8gNSA6IDQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBpblJHQiA+PSAoaW5SR0JBID8gNCA6IDMpICYmIGNTdGFydCA9PT0gXCIpXCIgJiYgLS1pblJHQiA8IChpblJHQkEgPyA1IDogNCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5SR0IgPSBpblJHQkEgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5DYWxjID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBjaGFuZ2luZyB1bml0cywgZml4aW5nIGNvbG91cnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaVN0YXJ0ICE9PSBzdGFydFZhbHVlLmxlbmd0aCB8fCBpRW5kICE9PSBlbmRWYWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5kZWJ1Zykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJUcnlpbmcgdG8gcGF0dGVybiBtYXRjaCBtaXMtbWF0Y2hlZCBzdHJpbmdzIFtcXFwiXCIgKyBlbmRWYWx1ZSArIFwiXFxcIiwgXFxcIlwiICsgc3RhcnRWYWx1ZSArIFwiXFxcIl1cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXR0ZXJuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYVN0YXJ0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5kZWJ1Zykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBhdHRlcm4gZm91bmQgXFxcIlwiICsgcGF0dGVybiArIFwiXFxcIiAtPiBcIiwgYVN0YXJ0LCBhRW5kLCBcIltcIiArIHN0YXJ0VmFsdWUgKyBcIixcIiArIGVuZFZhbHVlICsgXCJdXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gYVN0YXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gYUVuZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZVVuaXRUeXBlID0gc3RhcnRWYWx1ZVVuaXRUeXBlID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcGF0dGVybikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTZXBhcmF0ZSBzdGFydFZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXBhcmF0ZWRWYWx1ZSA9IHNlcGFyYXRlVmFsdWUocHJvcGVydHksIHN0YXJ0VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gc2VwYXJhdGVkVmFsdWVbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWVVbml0VHlwZSA9IHNlcGFyYXRlZFZhbHVlWzFdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNlcGFyYXRlIGVuZFZhbHVlLCBhbmQgZXh0cmFjdCBhIHZhbHVlIG9wZXJhdG9yIChlLmcuIFwiKz1cIiwgXCItPVwiKSBpZiBvbmUgZXhpc3RzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXBhcmF0ZWRWYWx1ZSA9IHNlcGFyYXRlVmFsdWUocHJvcGVydHksIGVuZFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSBzZXBhcmF0ZWRWYWx1ZVswXS5yZXBsYWNlKC9eKFsrLVxcLypdKT0vLCBmdW5jdGlvbihtYXRjaCwgc3ViTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yID0gc3ViTWF0Y2g7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFN0cmlwIHRoZSBvcGVyYXRvciBvZmYgb2YgdGhlIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZVVuaXRUeXBlID0gc2VwYXJhdGVkVmFsdWVbMV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogUGFyc2UgZmxvYXQgdmFsdWVzIGZyb20gZW5kVmFsdWUgYW5kIHN0YXJ0VmFsdWUuIERlZmF1bHQgdG8gMCBpZiBOYU4gaXMgcmV0dXJuZWQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSBwYXJzZUZsb2F0KHN0YXJ0VmFsdWUpIHx8IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gcGFyc2VGbG9hdChlbmRWYWx1ZSkgfHwgMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQcm9wZXJ0eS1TcGVjaWZpYyBWYWx1ZSBDb252ZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ3VzdG9tIHN1cHBvcnQgZm9yIHByb3BlcnRpZXMgdGhhdCBkb24ndCBhY3R1YWxseSBhY2NlcHQgdGhlICUgdW5pdCB0eXBlLCBidXQgd2hlcmUgcG9sbHlmaWxsaW5nIGlzIHRyaXZpYWwgYW5kIHJlbGF0aXZlbHkgZm9vbHByb29mLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW5kVmFsdWVVbml0VHlwZSA9PT0gXCIlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEEgJS12YWx1ZSBmb250U2l6ZS9saW5lSGVpZ2h0IGlzIHJlbGF0aXZlIHRvIHRoZSBwYXJlbnQncyBmb250U2l6ZSAoYXMgb3Bwb3NlZCB0byB0aGUgcGFyZW50J3MgZGltZW5zaW9ucyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpY2ggaXMgaWRlbnRpY2FsIHRvIHRoZSBlbSB1bml0J3MgYmVoYXZpb3IsIHNvIHdlIHBpZ2d5YmFjayBvZmYgb2YgdGhhdC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgvXihmb250U2l6ZXxsaW5lSGVpZ2h0KSQvLnRlc3QocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ29udmVydCAlIGludG8gYW4gZW0gZGVjaW1hbCB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IGVuZFZhbHVlIC8gMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlVW5pdFR5cGUgPSBcImVtXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRm9yIHNjYWxlWCBhbmQgc2NhbGVZLCBjb252ZXJ0IHRoZSB2YWx1ZSBpbnRvIGl0cyBkZWNpbWFsIGZvcm1hdCBhbmQgc3RyaXAgb2ZmIHRoZSB1bml0IHR5cGUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKC9ec2NhbGUvLnRlc3QocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSBlbmRWYWx1ZSAvIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZVVuaXRUeXBlID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBGb3IgUkdCIGNvbXBvbmVudHMsIHRha2UgdGhlIGRlZmluZWQgcGVyY2VudGFnZSBvZiAyNTUgYW5kIHN0cmlwIG9mZiB0aGUgdW5pdCB0eXBlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgvKFJlZHxHcmVlbnxCbHVlKSQvaS50ZXN0KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gKGVuZFZhbHVlIC8gMTAwKSAqIDI1NTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZVVuaXRUeXBlID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVW5pdCBSYXRpbyBDYWxjdWxhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBXaGVuIHF1ZXJpZWQsIHRoZSBicm93c2VyIHJldHVybnMgKG1vc3QpIENTUyBwcm9wZXJ0eSB2YWx1ZXMgaW4gcGl4ZWxzLiBUaGVyZWZvcmUsIGlmIGFuIGVuZFZhbHVlIHdpdGggYSB1bml0IHR5cGUgb2ZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJSwgZW0sIG9yIHJlbSBpcyBhbmltYXRlZCB0b3dhcmQsIHN0YXJ0VmFsdWUgbXVzdCBiZSBjb252ZXJ0ZWQgZnJvbSBwaXhlbHMgaW50byB0aGUgc2FtZSB1bml0IHR5cGUgYXMgZW5kVmFsdWUgaW4gb3JkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIHZhbHVlIG1hbmlwdWxhdGlvbiBsb2dpYyAoaW5jcmVtZW50L2RlY3JlbWVudCkgdG8gcHJvY2VlZC4gRnVydGhlciwgaWYgdGhlIHN0YXJ0VmFsdWUgd2FzIGZvcmNlZmVkIG9yIHRyYW5zZmVycmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gYSBwcmV2aW91cyBjYWxsLCBzdGFydFZhbHVlIG1heSBhbHNvIG5vdCBiZSBpbiBwaXhlbHMuIFVuaXQgY29udmVyc2lvbiBsb2dpYyB0aGVyZWZvcmUgY29uc2lzdHMgb2YgdHdvIHN0ZXBzOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAxKSBDYWxjdWxhdGluZyB0aGUgcmF0aW8gb2YgJS9lbS9yZW0vdmgvdncgcmVsYXRpdmUgdG8gcGl4ZWxzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDIpIENvbnZlcnRpbmcgc3RhcnRWYWx1ZSBpbnRvIHRoZSBzYW1lIHVuaXQgb2YgbWVhc3VyZW1lbnQgYXMgZW5kVmFsdWUgYmFzZWQgb24gdGhlc2UgcmF0aW9zLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFVuaXQgY29udmVyc2lvbiByYXRpb3MgYXJlIGNhbGN1bGF0ZWQgYnkgaW5zZXJ0aW5nIGEgc2libGluZyBub2RlIG5leHQgdG8gdGhlIHRhcmdldCBub2RlLCBjb3B5aW5nIG92ZXIgaXRzIHBvc2l0aW9uIHByb3BlcnR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nIHZhbHVlcyB3aXRoIHRoZSB0YXJnZXQgdW5pdCB0eXBlIHRoZW4gY29tcGFyaW5nIHRoZSByZXR1cm5lZCBwaXhlbCB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBFdmVuIGlmIG9ubHkgb25lIG9mIHRoZXNlIHVuaXQgdHlwZXMgaXMgYmVpbmcgYW5pbWF0ZWQsIGFsbCB1bml0IHJhdGlvcyBhcmUgY2FsY3VsYXRlZCBhdCBvbmNlIHNpbmNlIHRoZSBvdmVyaGVhZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZiBiYXRjaGluZyB0aGUgU0VUcyBhbmQgR0VUcyB0b2dldGhlciB1cGZyb250IG91dHdlaWdodHMgdGhlIHBvdGVudGlhbCBvdmVyaGVhZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZiBsYXlvdXQgdGhyYXNoaW5nIGNhdXNlZCBieSByZS1xdWVyeWluZyBmb3IgdW5jYWxjdWxhdGVkIHJhdGlvcyBmb3Igc3Vic2VxdWVudGx5LXByb2Nlc3NlZCBwcm9wZXJ0aWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRvZG86IFNoaWZ0IHRoaXMgbG9naWMgaW50byB0aGUgY2FsbHMnIGZpcnN0IHRpY2sgaW5zdGFuY2Ugc28gdGhhdCBpdCdzIHN5bmNlZCB3aXRoIFJBRi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2FsY3VsYXRlVW5pdFJhdGlvcyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNhbWUgUmF0aW8gQ2hlY2tzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVGhlIHByb3BlcnRpZXMgYmVsb3cgYXJlIHVzZWQgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGVsZW1lbnQgZGlmZmVycyBzdWZmaWNpZW50bHkgZnJvbSB0aGlzIGNhbGwnc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNseSBpdGVyYXRlZCBlbGVtZW50IHRvIGFsc28gZGlmZmVyIGluIGl0cyB1bml0IGNvbnZlcnNpb24gcmF0aW9zLiBJZiB0aGUgcHJvcGVydGllcyBtYXRjaCB1cCB3aXRoIHRob3NlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZiB0aGUgcHJpb3IgZWxlbWVudCwgdGhlIHByaW9yIGVsZW1lbnQncyBjb252ZXJzaW9uIHJhdGlvcyBhcmUgdXNlZC4gTGlrZSBtb3N0IG9wdGltaXphdGlvbnMgaW4gVmVsb2NpdHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzIGlzIGRvbmUgdG8gbWluaW1pemUgRE9NIHF1ZXJ5aW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2FtZVJhdGlvSW5kaWNhdG9ycyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBteVBhcmVudDogZWxlbWVudC5wYXJlbnROb2RlIHx8IGRvY3VtZW50LmJvZHksIC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcInBvc2l0aW9uXCIpLCAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJmb250U2l6ZVwiKSAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBEZXRlcm1pbmUgaWYgdGhlIHNhbWUgJSByYXRpbyBjYW4gYmUgdXNlZC4gJSBpcyBiYXNlZCBvbiB0aGUgZWxlbWVudCdzIHBvc2l0aW9uIHZhbHVlIGFuZCBpdHMgcGFyZW50J3Mgd2lkdGggYW5kIGhlaWdodCBkaW1lbnNpb25zLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2FtZVBlcmNlbnRSYXRpbyA9ICgoc2FtZVJhdGlvSW5kaWNhdG9ycy5wb3NpdGlvbiA9PT0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0UG9zaXRpb24pICYmIChzYW1lUmF0aW9JbmRpY2F0b3JzLm15UGFyZW50ID09PSBjYWxsVW5pdENvbnZlcnNpb25EYXRhLmxhc3RQYXJlbnQpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIERldGVybWluZSBpZiB0aGUgc2FtZSBlbSByYXRpbyBjYW4gYmUgdXNlZC4gZW0gaXMgcmVsYXRpdmUgdG8gdGhlIGVsZW1lbnQncyBmb250U2l6ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhbWVFbVJhdGlvID0gKHNhbWVSYXRpb0luZGljYXRvcnMuZm9udFNpemUgPT09IGNhbGxVbml0Q29udmVyc2lvbkRhdGEubGFzdEZvbnRTaXplKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTdG9yZSB0aGVzZSByYXRpbyBpbmRpY2F0b3JzIGNhbGwtd2lkZSBmb3IgdGhlIG5leHQgZWxlbWVudCB0byBjb21wYXJlIGFnYWluc3QuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxVbml0Q29udmVyc2lvbkRhdGEubGFzdFBhcmVudCA9IHNhbWVSYXRpb0luZGljYXRvcnMubXlQYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxVbml0Q29udmVyc2lvbkRhdGEubGFzdFBvc2l0aW9uID0gc2FtZVJhdGlvSW5kaWNhdG9ycy5wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0Rm9udFNpemUgPSBzYW1lUmF0aW9JbmRpY2F0b3JzLmZvbnRTaXplO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVsZW1lbnQtU3BlY2lmaWMgVW5pdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBJRTggcm91bmRzIHRvIHRoZSBuZWFyZXN0IHBpeGVsIHdoZW4gcmV0dXJuaW5nIENTUyB2YWx1ZXMsIHRodXMgd2UgcGVyZm9ybSBjb252ZXJzaW9ucyB1c2luZyBhIG1lYXN1cmVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZiAxMDAgKGluc3RlYWQgb2YgMSkgdG8gZ2l2ZSBvdXIgcmF0aW9zIGEgcHJlY2lzaW9uIG9mIGF0IGxlYXN0IDIgZGVjaW1hbCB2YWx1ZXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZWFzdXJlbWVudCA9IDEwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MgPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNhbWVFbVJhdGlvIHx8ICFzYW1lUGVyY2VudFJhdGlvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZHVtbXkgPSBkYXRhICYmIGRhdGEuaXNTVkcgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcInJlY3RcIikgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5pbml0KGR1bW15KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhbWVSYXRpb0luZGljYXRvcnMubXlQYXJlbnQuYXBwZW5kQ2hpbGQoZHVtbXkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBUbyBhY2N1cmF0ZWx5IGFuZCBjb25zaXN0ZW50bHkgY2FsY3VsYXRlIGNvbnZlcnNpb24gcmF0aW9zLCB0aGUgZWxlbWVudCdzIGNhc2NhZGVkIG92ZXJmbG93IGFuZCBib3gtc2l6aW5nIGFyZSBzdHJpcHBlZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaW1pbGFybHksIHNpbmNlIHdpZHRoL2hlaWdodCBjYW4gYmUgYXJ0aWZpY2lhbGx5IGNvbnN0cmFpbmVkIGJ5IHRoZWlyIG1pbi0vbWF4LSBlcXVpdmFsZW50cywgdGhlc2UgYXJlIGNvbnRyb2xsZWQgZm9yIGFzIHdlbGwuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBPdmVyZmxvdyBtdXN0IGJlIGFsc28gYmUgY29udHJvbGxlZCBmb3IgcGVyLWF4aXMgc2luY2UgdGhlIG92ZXJmbG93IHByb3BlcnR5IG92ZXJ3cml0ZXMgaXRzIHBlci1heGlzIHZhbHVlcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChbXCJvdmVyZmxvd1wiLCBcIm92ZXJmbG93WFwiLCBcIm92ZXJmbG93WVwiXSwgZnVuY3Rpb24oaSwgcHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5DU1Muc2V0UHJvcGVydHlWYWx1ZShkdW1teSwgcHJvcGVydHksIFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5DU1Muc2V0UHJvcGVydHlWYWx1ZShkdW1teSwgXCJwb3NpdGlvblwiLCBzYW1lUmF0aW9JbmRpY2F0b3JzLnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGR1bW15LCBcImZvbnRTaXplXCIsIHNhbWVSYXRpb0luZGljYXRvcnMuZm9udFNpemUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuQ1NTLnNldFByb3BlcnR5VmFsdWUoZHVtbXksIFwiYm94U2l6aW5nXCIsIFwiY29udGVudC1ib3hcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIHdpZHRoIGFuZCBoZWlnaHQgYWN0IGFzIG91ciBwcm94eSBwcm9wZXJ0aWVzIGZvciBtZWFzdXJpbmcgdGhlIGhvcml6b250YWwgYW5kIHZlcnRpY2FsICUgcmF0aW9zLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKFtcIm1pbldpZHRoXCIsIFwibWF4V2lkdGhcIiwgXCJ3aWR0aFwiLCBcIm1pbkhlaWdodFwiLCBcIm1heEhlaWdodFwiLCBcImhlaWdodFwiXSwgZnVuY3Rpb24oaSwgcHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5DU1Muc2V0UHJvcGVydHlWYWx1ZShkdW1teSwgcHJvcGVydHksIG1lYXN1cmVtZW50ICsgXCIlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBwYWRkaW5nTGVmdCBhcmJpdHJhcmlseSBhY3RzIGFzIG91ciBwcm94eSBwcm9wZXJ0eSBmb3IgdGhlIGVtIHJhdGlvLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuQ1NTLnNldFByb3BlcnR5VmFsdWUoZHVtbXksIFwicGFkZGluZ0xlZnRcIiwgbWVhc3VyZW1lbnQgKyBcImVtXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBEaXZpZGUgdGhlIHJldHVybmVkIHZhbHVlIGJ5IHRoZSBtZWFzdXJlbWVudCB0byBnZXQgdGhlIHJhdGlvIGJldHdlZW4gMSUgYW5kIDFweC4gRGVmYXVsdCB0byAxIHNpbmNlIHdvcmtpbmcgd2l0aCAwIGNhbiBwcm9kdWNlIEluZmluaXRlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFJhdGlvcy5wZXJjZW50VG9QeFdpZHRoID0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0UGVyY2VudFRvUHhXaWR0aCA9IChwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGR1bW15LCBcIndpZHRoXCIsIG51bGwsIHRydWUpKSB8fCAxKSAvIG1lYXN1cmVtZW50OyAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MucGVyY2VudFRvUHhIZWlnaHQgPSBjYWxsVW5pdENvbnZlcnNpb25EYXRhLmxhc3RQZXJjZW50VG9QeEhlaWdodCA9IChwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGR1bW15LCBcImhlaWdodFwiLCBudWxsLCB0cnVlKSkgfHwgMSkgLyBtZWFzdXJlbWVudDsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0UmF0aW9zLmVtVG9QeCA9IGNhbGxVbml0Q29udmVyc2lvbkRhdGEubGFzdEVtVG9QeCA9IChwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGR1bW15LCBcInBhZGRpbmdMZWZ0XCIpKSB8fCAxKSAvIG1lYXN1cmVtZW50OyAvKiBHRVQgKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2FtZVJhdGlvSW5kaWNhdG9ycy5teVBhcmVudC5yZW1vdmVDaGlsZChkdW1teSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0UmF0aW9zLmVtVG9QeCA9IGNhbGxVbml0Q29udmVyc2lvbkRhdGEubGFzdEVtVG9QeDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MucGVyY2VudFRvUHhXaWR0aCA9IGNhbGxVbml0Q29udmVyc2lvbkRhdGEubGFzdFBlcmNlbnRUb1B4V2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0UmF0aW9zLnBlcmNlbnRUb1B4SGVpZ2h0ID0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0UGVyY2VudFRvUHhIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFbGVtZW50LUFnbm9zdGljIFVuaXRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogV2hlcmVhcyAlIGFuZCBlbSByYXRpb3MgYXJlIGRldGVybWluZWQgb24gYSBwZXItZWxlbWVudCBiYXNpcywgdGhlIHJlbSB1bml0IG9ubHkgbmVlZHMgdG8gYmUgY2hlY2tlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25jZSBwZXIgY2FsbCBzaW5jZSBpdCdzIGV4Y2x1c2l2ZWx5IGRlcGVuZGFudCB1cG9uIGRvY3VtZW50LmJvZHkncyBmb250U2l6ZS4gSWYgdGhpcyBpcyB0aGUgZmlyc3QgdGltZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdCBjYWxjdWxhdGVVbml0UmF0aW9zKCkgaXMgYmVpbmcgcnVuIGR1cmluZyB0aGlzIGNhbGwsIHJlbVRvUHggd2lsbCBzdGlsbCBiZSBzZXQgdG8gaXRzIGRlZmF1bHQgdmFsdWUgb2YgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvIHdlIGNhbGN1bGF0ZSBpdCBub3cuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsVW5pdENvbnZlcnNpb25EYXRhLnJlbVRvUHggPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIERlZmF1bHQgdG8gYnJvd3NlcnMnIGRlZmF1bHQgZm9udFNpemUgb2YgMTZweCBpbiB0aGUgY2FzZSBvZiAwLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5yZW1Ub1B4ID0gcGFyc2VGbG9hdChDU1MuZ2V0UHJvcGVydHlWYWx1ZShkb2N1bWVudC5ib2R5LCBcImZvbnRTaXplXCIpKSB8fCAxNjsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTaW1pbGFybHksIHZpZXdwb3J0IHVuaXRzIGFyZSAlLXJlbGF0aXZlIHRvIHRoZSB3aW5kb3cncyBpbm5lciBkaW1lbnNpb25zLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbFVuaXRDb252ZXJzaW9uRGF0YS52d1RvUHggPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxVbml0Q29udmVyc2lvbkRhdGEudndUb1B4ID0gcGFyc2VGbG9hdCh3aW5kb3cuaW5uZXJXaWR0aCkgLyAxMDA7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbFVuaXRDb252ZXJzaW9uRGF0YS52aFRvUHggPSBwYXJzZUZsb2F0KHdpbmRvdy5pbm5lckhlaWdodCkgLyAxMDA7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFJhdGlvcy5yZW1Ub1B4ID0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5yZW1Ub1B4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0UmF0aW9zLnZ3VG9QeCA9IGNhbGxVbml0Q29udmVyc2lvbkRhdGEudndUb1B4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0UmF0aW9zLnZoVG9QeCA9IGNhbGxVbml0Q29udmVyc2lvbkRhdGEudmhUb1B4O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5kZWJ1ZyA+PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVuaXQgcmF0aW9zOiBcIiArIEpTT04uc3RyaW5naWZ5KHVuaXRSYXRpb3MpLCBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5pdFJhdGlvcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFVuaXQgQ29udmVyc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSAqIGFuZCAvIG9wZXJhdG9ycywgd2hpY2ggYXJlIG5vdCBwYXNzZWQgaW4gd2l0aCBhbiBhc3NvY2lhdGVkIHVuaXQsIGluaGVyZW50bHkgdXNlIHN0YXJ0VmFsdWUncyB1bml0LiBTa2lwIHZhbHVlIGFuZCB1bml0IGNvbnZlcnNpb24uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC9bXFwvKl0vLnRlc3Qob3BlcmF0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlVW5pdFR5cGUgPSBzdGFydFZhbHVlVW5pdFR5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHN0YXJ0VmFsdWUgYW5kIGVuZFZhbHVlIGRpZmZlciBpbiB1bml0IHR5cGUsIGNvbnZlcnQgc3RhcnRWYWx1ZSBpbnRvIHRoZSBzYW1lIHVuaXQgdHlwZSBhcyBlbmRWYWx1ZSBzbyB0aGF0IGlmIGVuZFZhbHVlVW5pdFR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzIGEgcmVsYXRpdmUgdW5pdCAoJSwgZW0sIHJlbSksIHRoZSB2YWx1ZXMgc2V0IGR1cmluZyB0d2VlbmluZyB3aWxsIGNvbnRpbnVlIHRvIGJlIGFjY3VyYXRlbHkgcmVsYXRpdmUgZXZlbiBpZiB0aGUgbWV0cmljcyB0aGV5IGRlcGVuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb24gYXJlIGR5bmFtaWNhbGx5IGNoYW5naW5nIGR1cmluZyB0aGUgY291cnNlIG9mIHRoZSBhbmltYXRpb24uIENvbnZlcnNlbHksIGlmIHdlIGFsd2F5cyBub3JtYWxpemVkIGludG8gcHggYW5kIHVzZWQgcHggZm9yIHNldHRpbmcgdmFsdWVzLCB0aGUgcHggcmF0aW9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvdWxkIGJlY29tZSBzdGFsZSBpZiB0aGUgb3JpZ2luYWwgdW5pdCBiZWluZyBhbmltYXRlZCB0b3dhcmQgd2FzIHJlbGF0aXZlIGFuZCB0aGUgdW5kZXJseWluZyBtZXRyaWNzIGNoYW5nZSBkdXJpbmcgdGhlIGFuaW1hdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU2luY2UgMCBpcyAwIGluIGFueSB1bml0IHR5cGUsIG5vIGNvbnZlcnNpb24gaXMgbmVjZXNzYXJ5IHdoZW4gc3RhcnRWYWx1ZSBpcyAwIC0tIHdlIGp1c3Qgc3RhcnQgYXQgMCB3aXRoIGVuZFZhbHVlVW5pdFR5cGUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgoc3RhcnRWYWx1ZVVuaXRUeXBlICE9PSBlbmRWYWx1ZVVuaXRUeXBlKSAmJiBzdGFydFZhbHVlICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFVuaXQgY29udmVyc2lvbiBpcyBhbHNvIHNraXBwZWQgd2hlbiBlbmRWYWx1ZSBpcyAwLCBidXQgKnN0YXJ0VmFsdWVVbml0VHlwZSogbXVzdCBiZSB1c2VkIGZvciB0d2VlbiB2YWx1ZXMgdG8gcmVtYWluIGFjY3VyYXRlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBTa2lwcGluZyB1bml0IGNvbnZlcnNpb24gaGVyZSBtZWFucyB0aGF0IGlmIGVuZFZhbHVlVW5pdFR5cGUgd2FzIG9yaWdpbmFsbHkgYSByZWxhdGl2ZSB1bml0LCB0aGUgYW5pbWF0aW9uIHdvbid0IHJlbGF0aXZlbHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoIHRoZSB1bmRlcmx5aW5nIG1ldHJpY3MgaWYgdGhleSBjaGFuZ2UsIGJ1dCB0aGlzIGlzIGFjY2VwdGFibGUgc2luY2Ugd2UncmUgYW5pbWF0aW5nIHRvd2FyZCBpbnZpc2liaWxpdHkgaW5zdGVhZCBvZiB0b3dhcmQgdmlzaWJpbGl0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWNoIHJlbWFpbnMgcGFzdCB0aGUgcG9pbnQgb2YgdGhlIGFuaW1hdGlvbidzIGNvbXBsZXRpb24uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbmRWYWx1ZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWVVbml0VHlwZSA9IHN0YXJ0VmFsdWVVbml0VHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEJ5IHRoaXMgcG9pbnQsIHdlIGNhbm5vdCBhdm9pZCB1bml0IGNvbnZlcnNpb24gKGl0J3MgdW5kZXNpcmFibGUgc2luY2UgaXQgY2F1c2VzIGxheW91dCB0aHJhc2hpbmcpLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIElmIHdlIGhhdmVuJ3QgYWxyZWFkeSwgd2UgdHJpZ2dlciBjYWxjdWxhdGVVbml0UmF0aW9zKCksIHdoaWNoIHJ1bnMgb25jZSBwZXIgZWxlbWVudCBwZXIgY2FsbC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRVbml0Q29udmVyc2lvbkRhdGEgPSBlbGVtZW50VW5pdENvbnZlcnNpb25EYXRhIHx8IGNhbGN1bGF0ZVVuaXRSYXRpb3MoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVGhlIGZvbGxvd2luZyBSZWdFeCBtYXRjaGVzIENTUyBwcm9wZXJ0aWVzIHRoYXQgaGF2ZSB0aGVpciAlIHZhbHVlcyBtZWFzdXJlZCByZWxhdGl2ZSB0byB0aGUgeC1heGlzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogVzNDIHNwZWMgbWFuZGF0ZXMgdGhhdCBhbGwgb2YgbWFyZ2luIGFuZCBwYWRkaW5nJ3MgcHJvcGVydGllcyAoZXZlbiB0b3AgYW5kIGJvdHRvbSkgYXJlICUtcmVsYXRpdmUgdG8gdGhlICp3aWR0aCogb2YgdGhlIHBhcmVudCBlbGVtZW50LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF4aXMgPSAoL21hcmdpbnxwYWRkaW5nfGxlZnR8cmlnaHR8d2lkdGh8dGV4dHx3b3JkfGxldHRlci9pLnRlc3QocHJvcGVydHkpIHx8IC9YJC8udGVzdChwcm9wZXJ0eSkgfHwgcHJvcGVydHkgPT09IFwieFwiKSA/IFwieFwiIDogXCJ5XCI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEluIG9yZGVyIHRvIGF2b2lkIGdlbmVyYXRpbmcgbl4yIGJlc3Bva2UgY29udmVyc2lvbiBmdW5jdGlvbnMsIHVuaXQgY29udmVyc2lvbiBpcyBhIHR3by1zdGVwIHByb2Nlc3M6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMSkgQ29udmVydCBzdGFydFZhbHVlIGludG8gcGl4ZWxzLiAyKSBDb252ZXJ0IHRoaXMgbmV3IHBpeGVsIHZhbHVlIGludG8gZW5kVmFsdWUncyB1bml0IHR5cGUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHN0YXJ0VmFsdWVVbml0VHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCIlXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IHRyYW5zbGF0ZVggYW5kIHRyYW5zbGF0ZVkgYXJlIHRoZSBvbmx5IHByb3BlcnRpZXMgdGhhdCBhcmUgJS1yZWxhdGl2ZSB0byBhbiBlbGVtZW50J3Mgb3duIGRpbWVuc2lvbnMgLS0gbm90IGl0cyBwYXJlbnQncyBkaW1lbnNpb25zLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkgZG9lcyBub3QgaW5jbHVkZSBhIHNwZWNpYWwgY29udmVyc2lvbiBwcm9jZXNzIHRvIGFjY291bnQgZm9yIHRoaXMgYmVoYXZpb3IuIFRoZXJlZm9yZSwgYW5pbWF0aW5nIHRyYW5zbGF0ZVgvWSBmcm9tIGEgJSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub24tJSB2YWx1ZSB3aWxsIHByb2R1Y2UgYW4gaW5jb3JyZWN0IHN0YXJ0IHZhbHVlLiBGb3J0dW5hdGVseSwgdGhpcyBzb3J0IG9mIGNyb3NzLXVuaXQgY29udmVyc2lvbiBpcyByYXJlbHkgZG9uZSBieSB1c2VycyBpbiBwcmFjdGljZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSAqPSAoYXhpcyA9PT0gXCJ4XCIgPyBlbGVtZW50VW5pdENvbnZlcnNpb25EYXRhLnBlcmNlbnRUb1B4V2lkdGggOiBlbGVtZW50VW5pdENvbnZlcnNpb25EYXRhLnBlcmNlbnRUb1B4SGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwicHhcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogcHggYWN0cyBhcyBvdXIgbWlkcG9pbnQgaW4gdGhlIHVuaXQgY29udmVyc2lvbiBwcm9jZXNzOyBkbyBub3RoaW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgKj0gZWxlbWVudFVuaXRDb252ZXJzaW9uRGF0YVtzdGFydFZhbHVlVW5pdFR5cGUgKyBcIlRvUHhcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEludmVydCB0aGUgcHggcmF0aW9zIHRvIGNvbnZlcnQgaW50byB0byB0aGUgdGFyZ2V0IHVuaXQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGVuZFZhbHVlVW5pdFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiJVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlICo9IDEgLyAoYXhpcyA9PT0gXCJ4XCIgPyBlbGVtZW50VW5pdENvbnZlcnNpb25EYXRhLnBlcmNlbnRUb1B4V2lkdGggOiBlbGVtZW50VW5pdENvbnZlcnNpb25EYXRhLnBlcmNlbnRUb1B4SGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwicHhcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogc3RhcnRWYWx1ZSBpcyBhbHJlYWR5IGluIHB4LCBkbyBub3RoaW5nOyB3ZSdyZSBkb25lLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgKj0gMSAvIGVsZW1lbnRVbml0Q29udmVyc2lvbkRhdGFbZW5kVmFsdWVVbml0VHlwZSArIFwiVG9QeFwiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVsYXRpdmUgVmFsdWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE9wZXJhdG9yIGxvZ2ljIG11c3QgYmUgcGVyZm9ybWVkIGxhc3Qgc2luY2UgaXQgcmVxdWlyZXMgdW5pdC1ub3JtYWxpemVkIHN0YXJ0IGFuZCBlbmQgdmFsdWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFJlbGF0aXZlICpwZXJjZW50IHZhbHVlcyogZG8gbm90IGJlaGF2ZSBob3cgbW9zdCBwZW9wbGUgdGhpbms7IHdoaWxlIG9uZSB3b3VsZCBleHBlY3QgXCIrPTUwJVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGluY3JlYXNlIHRoZSBwcm9wZXJ0eSAxLjV4IGl0cyBjdXJyZW50IHZhbHVlLCBpdCBpbiBmYWN0IGluY3JlYXNlcyB0aGUgcGVyY2VudCB1bml0cyBpbiBhYnNvbHV0ZSB0ZXJtczpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgNTAgcG9pbnRzIGlzIGFkZGVkIG9uIHRvcCBvZiB0aGUgY3VycmVudCAlIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAob3BlcmF0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIitcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gc3RhcnRWYWx1ZSArIGVuZFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIi1cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gc3RhcnRWYWx1ZSAtIGVuZFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIipcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gc3RhcnRWYWx1ZSAqIGVuZFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIi9cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gc3RhcnRWYWx1ZSAvIGVuZFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuc0NvbnRhaW5lciBQdXNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IHRoZSBwZXItcHJvcGVydHkgdHdlZW4gb2JqZWN0LCBhbmQgcHVzaCBpdCB0byB0aGUgZWxlbWVudCdzIHR3ZWVuc0NvbnRhaW5lci4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0d2VlbnNDb250YWluZXJbcHJvcGVydHldID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZTogcm9vdFByb3BlcnR5VmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWU6IHN0YXJ0VmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZTogc3RhcnRWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWU6IGVuZFZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0VHlwZTogZW5kVmFsdWVVbml0VHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFzaW5nOiBlYXNpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXR0ZXJuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuc0NvbnRhaW5lcltwcm9wZXJ0eV0ucGF0dGVybiA9IHBhdHRlcm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFZlbG9jaXR5LmRlYnVnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidHdlZW5zQ29udGFpbmVyIChcIiArIHByb3BlcnR5ICsgXCIpOiBcIiArIEpTT04uc3RyaW5naWZ5KHR3ZWVuc0NvbnRhaW5lcltwcm9wZXJ0eV0pLCBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBDcmVhdGUgYSB0d2VlbiBvdXQgb2YgZWFjaCBwcm9wZXJ0eSwgYW5kIGFwcGVuZCBpdHMgYXNzb2NpYXRlZCBkYXRhIHRvIHR3ZWVuc0NvbnRhaW5lci4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHByb3BlcnRpZXNNYXApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcHJvcGVydGllc01hcC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSBvcmlnaW5hbCBwcm9wZXJ0eSBuYW1lJ3MgZm9ybWF0IG11c3QgYmUgdXNlZCBmb3IgdGhlIHBhcnNlUHJvcGVydHlWYWx1ZSgpIGxvb2t1cCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0IHdlIHRoZW4gdXNlIGl0cyBjYW1lbENhc2Ugc3R5bGluZyB0byBub3JtYWxpemUgaXQgZm9yIG1hbmlwdWxhdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlOYW1lID0gQ1NTLk5hbWVzLmNhbWVsQ2FzZShwcm9wZXJ0eSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlRGF0YSA9IHBhcnNlUHJvcGVydHlWYWx1ZShwcm9wZXJ0aWVzTWFwW3Byb3BlcnR5XSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBGaW5kIHNob3J0aGFuZCBjb2xvciBwcm9wZXJ0aWVzIHRoYXQgaGF2ZSBiZWVuIHBhc3NlZCBhIGhleCBzdHJpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogV291bGQgYmUgcXVpY2tlciB0byB1c2UgQ1NTLkxpc3RzLmNvbG9ycy5pbmNsdWRlcygpIGlmIHBvc3NpYmxlICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5MaXN0cy5jb2xvcnMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogUGFyc2UgdGhlIHZhbHVlIGRhdGEgZm9yIGVhY2ggc2hvcnRoYW5kLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZW5kVmFsdWUgPSB2YWx1ZURhdGFbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmcgPSB2YWx1ZURhdGFbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gdmFsdWVEYXRhWzJdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDU1MuUmVnRXguaXNIZXgudGVzdChlbmRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENvbnZlcnQgdGhlIGhleCBzdHJpbmdzIGludG8gdGhlaXIgUkdCIGNvbXBvbmVudCBhcnJheXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29sb3JDb21wb25lbnRzID0gW1wiUmVkXCIsIFwiR3JlZW5cIiwgXCJCbHVlXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlUkdCID0gQ1NTLlZhbHVlcy5oZXhUb1JnYihlbmRWYWx1ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZVJHQiA9IHN0YXJ0VmFsdWUgPyBDU1MuVmFsdWVzLmhleFRvUmdiKHN0YXJ0VmFsdWUpIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJbmplY3QgdGhlIFJHQiBjb21wb25lbnQgdHdlZW5zIGludG8gcHJvcGVydGllc01hcC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sb3JDb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFBcnJheSA9IFtlbmRWYWx1ZVJHQltpXV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWFzaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFBcnJheS5wdXNoKGVhc2luZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0VmFsdWVSR0IgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQXJyYXkucHVzaChzdGFydFZhbHVlUkdCW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXhQcm9wZXJ0eVZhbHVlKHByb3BlcnR5TmFtZSArIGNvbG9yQ29tcG9uZW50c1tpXSwgZGF0YUFycmF5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHdlIGhhdmUgcmVwbGFjZWQgYSBzaG9ydGN1dCBjb2xvciB2YWx1ZSB0aGVuIGRvbid0IHVwZGF0ZSB0aGUgc3RhbmRhcmQgcHJvcGVydHkgbmFtZSAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZml4UHJvcGVydHlWYWx1ZShwcm9wZXJ0eU5hbWUsIHZhbHVlRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFsb25nIHdpdGggaXRzIHByb3BlcnR5IGRhdGEsIHN0b3JlIGEgcmVmZXJlbmNlIHRvIHRoZSBlbGVtZW50IGl0c2VsZiBvbnRvIHR3ZWVuc0NvbnRhaW5lci4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuc0NvbnRhaW5lci5lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgQ2FsbCBQdXNoXG4gICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiB0d2VlbnNDb250YWluZXIgY2FuIGJlIGVtcHR5IGlmIGFsbCBvZiB0aGUgcHJvcGVydGllcyBpbiB0aGlzIGNhbGwncyBwcm9wZXJ0eSBtYXAgd2VyZSBza2lwcGVkIGR1ZSB0byBub3RcbiAgICAgICAgICAgICAgICAgICAgIGJlaW5nIHN1cHBvcnRlZCBieSB0aGUgYnJvd3Nlci4gVGhlIGVsZW1lbnQgcHJvcGVydHkgaXMgdXNlZCBmb3IgY2hlY2tpbmcgdGhhdCB0aGUgdHdlZW5zQ29udGFpbmVyIGhhcyBiZWVuIGFwcGVuZGVkIHRvLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAodHdlZW5zQ29udGFpbmVyLmVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFwcGx5IHRoZSBcInZlbG9jaXR5LWFuaW1hdGluZ1wiIGluZGljYXRvciBjbGFzcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIENTUy5WYWx1ZXMuYWRkQ2xhc3MoZWxlbWVudCwgXCJ2ZWxvY2l0eS1hbmltYXRpbmdcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSBjYWxsIGFycmF5IGhvdXNlcyB0aGUgdHdlZW5zQ29udGFpbmVycyBmb3IgZWFjaCBlbGVtZW50IGJlaW5nIGFuaW1hdGVkIGluIHRoZSBjdXJyZW50IGNhbGwuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsLnB1c2godHdlZW5zQ29udGFpbmVyKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IERhdGEoZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU3RvcmUgdGhlIHR3ZWVuc0NvbnRhaW5lciBhbmQgb3B0aW9ucyBpZiB3ZSdyZSB3b3JraW5nIG9uIHRoZSBkZWZhdWx0IGVmZmVjdHMgcXVldWUsIHNvIHRoYXQgdGhleSBjYW4gYmUgdXNlZCBieSB0aGUgcmV2ZXJzZSBjb21tYW5kLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLnF1ZXVlID09PSBcIlwiKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS50d2VlbnNDb250YWluZXIgPSB0d2VlbnNDb250YWluZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEub3B0cyA9IG9wdHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU3dpdGNoIG9uIHRoZSBlbGVtZW50J3MgYW5pbWF0aW5nIGZsYWcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5pc0FuaW1hdGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE9uY2UgdGhlIGZpbmFsIGVsZW1lbnQgaW4gdGhpcyBjYWxsJ3MgZWxlbWVudCBzZXQgaGFzIGJlZW4gcHJvY2Vzc2VkLCBwdXNoIHRoZSBjYWxsIGFycmF5IG9udG9cbiAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5TdGF0ZS5jYWxscyBmb3IgdGhlIGFuaW1hdGlvbiB0aWNrIHRvIGltbWVkaWF0ZWx5IGJlZ2luIHByb2Nlc3NpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudHNJbmRleCA9PT0gZWxlbWVudHNMZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQWRkIHRoZSBjdXJyZW50IGNhbGwgcGx1cyBpdHMgYXNzb2NpYXRlZCBtZXRhZGF0YSAodGhlIGVsZW1lbnQgc2V0IGFuZCB0aGUgY2FsbCdzIG9wdGlvbnMpIG9udG8gdGhlIGdsb2JhbCBjYWxsIGNvbnRhaW5lci5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQW55dGhpbmcgb24gdGhpcyBjYWxsIGNvbnRhaW5lciBpcyBzdWJqZWN0ZWQgdG8gdGljaygpIHByb2Nlc3NpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuY2FsbHMucHVzaChbY2FsbCwgZWxlbWVudHMsIG9wdHMsIG51bGwsIHByb21pc2VEYXRhLnJlc29sdmVyLCBudWxsLCAwXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgYW5pbWF0aW9uIHRpY2sgaXNuJ3QgcnVubmluZywgc3RhcnQgaXQuIChWZWxvY2l0eSBzaHV0cyBpdCBvZmYgd2hlbiB0aGVyZSBhcmUgbm8gYWN0aXZlIGNhbGxzIHRvIHByb2Nlc3MuKSAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5TdGF0ZS5pc1RpY2tpbmcgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLmlzVGlja2luZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU3RhcnQgdGhlIHRpY2sgbG9vcC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGljaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudHNJbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyogV2hlbiB0aGUgcXVldWUgb3B0aW9uIGlzIHNldCB0byBmYWxzZSwgdGhlIGNhbGwgc2tpcHMgdGhlIGVsZW1lbnQncyBxdWV1ZSBhbmQgZmlyZXMgaW1tZWRpYXRlbHkuICovXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMucXVldWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFNpbmNlIHRoaXMgYnVpbGRRdWV1ZSBjYWxsIGRvZXNuJ3QgcmVzcGVjdCB0aGUgZWxlbWVudCdzIGV4aXN0aW5nIHF1ZXVlICh3aGljaCBpcyB3aGVyZSBhIGRlbGF5IG9wdGlvbiB3b3VsZCBoYXZlIGJlZW4gYXBwZW5kZWQpLFxuICAgICAgICAgICAgICAgICAgICAgd2UgbWFudWFsbHkgaW5qZWN0IHRoZSBkZWxheSBwcm9wZXJ0eSBoZXJlIHdpdGggYW4gZXhwbGljaXQgc2V0VGltZW91dC4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuZGVsYXkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogVGVtcG9yYXJpbHkgc3RvcmUgZGVsYXllZCBlbGVtZW50cyB0byBmYWNpbGl0YXRlIGFjY2VzcyBmb3IgZ2xvYmFsIHBhdXNlL3Jlc3VtZSAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNhbGxJbmRleCA9IFZlbG9jaXR5LlN0YXRlLmRlbGF5ZWRFbGVtZW50cy5jb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuZGVsYXllZEVsZW1lbnRzW2NhbGxJbmRleF0gPSBlbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVsYXlDb21wbGV0ZSA9IChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2xlYXIgdGhlIHRlbXBvcmFyeSBlbGVtZW50ICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLmRlbGF5ZWRFbGVtZW50c1tpbmRleF0gPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBGaW5hbGx5LCBpc3N1ZSB0aGUgY2FsbCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZFF1ZXVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKGNhbGxJbmRleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGEoZWxlbWVudCkuZGVsYXlCZWdpbiA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLmRlbGF5ID0gcGFyc2VGbG9hdChvcHRzLmRlbGF5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGEoZWxlbWVudCkuZGVsYXlUaW1lciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0OiBzZXRUaW1lb3V0KGJ1aWxkUXVldWUsIHBhcnNlRmxvYXQob3B0cy5kZWxheSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHQ6IGRlbGF5Q29tcGxldGVcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBidWlsZFF1ZXVlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLyogT3RoZXJ3aXNlLCB0aGUgY2FsbCB1bmRlcmdvZXMgZWxlbWVudCBxdWV1ZWluZyBhcyBub3JtYWwuICovXG4gICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFRvIGludGVyb3BlcmF0ZSB3aXRoIGpRdWVyeSwgVmVsb2NpdHkgdXNlcyBqUXVlcnkncyBvd24gJC5xdWV1ZSgpIHN0YWNrIGZvciBxdWV1aW5nIGxvZ2ljLiAqL1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQucXVldWUoZWxlbWVudCwgb3B0cy5xdWV1ZSwgZnVuY3Rpb24obmV4dCwgY2xlYXJRdWV1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGNsZWFyUXVldWUgZmxhZyB3YXMgcGFzc2VkIGluIGJ5IHRoZSBzdG9wIGNvbW1hbmQsIHJlc29sdmUgdGhpcyBjYWxsJ3MgcHJvbWlzZS4gKFByb21pc2VzIGNhbiBvbmx5IGJlIHJlc29sdmVkIG9uY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgc28gaXQncyBmaW5lIGlmIHRoaXMgaXMgcmVwZWF0ZWRseSB0cmlnZ2VyZWQgZm9yIGVhY2ggZWxlbWVudCBpbiB0aGUgYXNzb2NpYXRlZCBjYWxsLikgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjbGVhclF1ZXVlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2VEYXRhLnByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZURhdGEucmVzb2x2ZXIoZWxlbWVudHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIERvIG5vdCBjb250aW51ZSB3aXRoIGFuaW1hdGlvbiBxdWV1ZWluZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogVGhpcyBmbGFnIGluZGljYXRlcyB0byB0aGUgdXBjb21pbmcgY29tcGxldGVDYWxsKCkgZnVuY3Rpb24gdGhhdCB0aGlzIHF1ZXVlIGVudHJ5IHdhcyBpbml0aWF0ZWQgYnkgVmVsb2NpdHkuXG4gICAgICAgICAgICAgICAgICAgICAgICAgU2VlIGNvbXBsZXRlQ2FsbCgpIGZvciBmdXJ0aGVyIGRldGFpbHMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS52ZWxvY2l0eVF1ZXVlRW50cnlGbGFnID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRRdWV1ZShuZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICBBdXRvLURlcXVldWluZ1xuICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAvKiBBcyBwZXIgalF1ZXJ5J3MgJC5xdWV1ZSgpIGJlaGF2aW9yLCB0byBmaXJlIHRoZSBmaXJzdCBub24tY3VzdG9tLXF1ZXVlIGVudHJ5IG9uIGFuIGVsZW1lbnQsIHRoZSBlbGVtZW50XG4gICAgICAgICAgICAgICAgIG11c3QgYmUgZGVxdWV1ZWQgaWYgaXRzIHF1ZXVlIHN0YWNrIGNvbnNpc3RzICpzb2xlbHkqIG9mIHRoZSBjdXJyZW50IGNhbGwuIChUaGlzIGNhbiBiZSBkZXRlcm1pbmVkIGJ5IGNoZWNraW5nXG4gICAgICAgICAgICAgICAgIGZvciB0aGUgXCJpbnByb2dyZXNzXCIgaXRlbSB0aGF0IGpRdWVyeSBwcmVwZW5kcyB0byBhY3RpdmUgcXVldWUgc3RhY2sgYXJyYXlzLikgUmVnYXJkbGVzcywgd2hlbmV2ZXIgdGhlIGVsZW1lbnQnc1xuICAgICAgICAgICAgICAgICBxdWV1ZSBpcyBmdXJ0aGVyIGFwcGVuZGVkIHdpdGggYWRkaXRpb25hbCBpdGVtcyAtLSBpbmNsdWRpbmcgJC5kZWxheSgpJ3Mgb3IgZXZlbiAkLmFuaW1hdGUoKSBjYWxscywgdGhlIHF1ZXVlJ3NcbiAgICAgICAgICAgICAgICAgZmlyc3QgZW50cnkgaXMgYXV0b21hdGljYWxseSBmaXJlZC4gVGhpcyBiZWhhdmlvciBjb250cmFzdHMgdGhhdCBvZiBjdXN0b20gcXVldWVzLCB3aGljaCBuZXZlciBhdXRvLWZpcmUuICovXG4gICAgICAgICAgICAgICAgLyogTm90ZTogV2hlbiBhbiBlbGVtZW50IHNldCBpcyBiZWluZyBzdWJqZWN0ZWQgdG8gYSBub24tcGFyYWxsZWwgVmVsb2NpdHkgY2FsbCwgdGhlIGFuaW1hdGlvbiB3aWxsIG5vdCBiZWdpbiB1bnRpbFxuICAgICAgICAgICAgICAgICBlYWNoIG9uZSBvZiB0aGUgZWxlbWVudHMgaW4gdGhlIHNldCBoYXMgcmVhY2hlZCB0aGUgZW5kIG9mIGl0cyBpbmRpdmlkdWFsbHkgcHJlLWV4aXN0aW5nIHF1ZXVlIGNoYWluLiAqL1xuICAgICAgICAgICAgICAgIC8qIE5vdGU6IFVuZm9ydHVuYXRlbHksIG1vc3QgcGVvcGxlIGRvbid0IGZ1bGx5IGdyYXNwIGpRdWVyeSdzIHBvd2VyZnVsLCB5ZXQgcXVpcmt5LCAkLnF1ZXVlKCkgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgIExlYW4gbW9yZSBoZXJlOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwNTgxNTgvY2FuLXNvbWVib2R5LWV4cGxhaW4tanF1ZXJ5LXF1ZXVlLXRvLW1lICovXG4gICAgICAgICAgICAgICAgaWYgKChvcHRzLnF1ZXVlID09PSBcIlwiIHx8IG9wdHMucXVldWUgPT09IFwiZnhcIikgJiYgJC5xdWV1ZShlbGVtZW50KVswXSAhPT0gXCJpbnByb2dyZXNzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgJC5kZXF1ZXVlKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgRWxlbWVudCBTZXQgSXRlcmF0aW9uXG4gICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIC8qIElmIHRoZSBcIm5vZGVUeXBlXCIgcHJvcGVydHkgZXhpc3RzIG9uIHRoZSBlbGVtZW50cyB2YXJpYWJsZSwgd2UncmUgYW5pbWF0aW5nIGEgc2luZ2xlIGVsZW1lbnQuXG4gICAgICAgICAgICAgUGxhY2UgaXQgaW4gYW4gYXJyYXkgc28gdGhhdCAkLmVhY2goKSBjYW4gaXRlcmF0ZSBvdmVyIGl0LiAqL1xuICAgICAgICAgICAgJC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbihpLCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgLyogRW5zdXJlIGVhY2ggZWxlbWVudCBpbiBhIHNldCBoYXMgYSBub2RlVHlwZSAoaXMgYSByZWFsIGVsZW1lbnQpIHRvIGF2b2lkIHRocm93aW5nIGVycm9ycy4gKi9cbiAgICAgICAgICAgICAgICBpZiAoVHlwZS5pc05vZGUoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0VsZW1lbnQoZWxlbWVudCwgaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICBPcHRpb246IExvb3BcbiAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIC8qIFRoZSBsb29wIG9wdGlvbiBhY2NlcHRzIGFuIGludGVnZXIgaW5kaWNhdGluZyBob3cgbWFueSB0aW1lcyB0aGUgZWxlbWVudCBzaG91bGQgbG9vcCBiZXR3ZWVuIHRoZSB2YWx1ZXMgaW4gdGhlXG4gICAgICAgICAgICAgY3VycmVudCBjYWxsJ3MgcHJvcGVydGllcyBtYXAgYW5kIHRoZSBlbGVtZW50J3MgcHJvcGVydHkgdmFsdWVzIHByaW9yIHRvIHRoaXMgY2FsbC4gKi9cbiAgICAgICAgICAgIC8qIE5vdGU6IFRoZSBsb29wIG9wdGlvbidzIGxvZ2ljIGlzIHBlcmZvcm1lZCBoZXJlIC0tIGFmdGVyIGVsZW1lbnQgcHJvY2Vzc2luZyAtLSBiZWNhdXNlIHRoZSBjdXJyZW50IGNhbGwgbmVlZHNcbiAgICAgICAgICAgICB0byB1bmRlcmdvIGl0cyBxdWV1ZSBpbnNlcnRpb24gcHJpb3IgdG8gdGhlIGxvb3Agb3B0aW9uIGdlbmVyYXRpbmcgaXRzIHNlcmllcyBvZiBjb25zdGl0dWVudCBcInJldmVyc2VcIiBjYWxscyxcbiAgICAgICAgICAgICB3aGljaCBjaGFpbiBhZnRlciB0aGUgY3VycmVudCBjYWxsLiBUd28gcmV2ZXJzZSBjYWxscyAodHdvIFwiYWx0ZXJuYXRpb25zXCIpIGNvbnN0aXR1dGUgb25lIGxvb3AuICovXG4gICAgICAgICAgICBvcHRzID0gJC5leHRlbmQoe30sIFZlbG9jaXR5LmRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAgICAgICAgIG9wdHMubG9vcCA9IHBhcnNlSW50KG9wdHMubG9vcCwgMTApO1xuICAgICAgICAgICAgdmFyIHJldmVyc2VDYWxsc0NvdW50ID0gKG9wdHMubG9vcCAqIDIpIC0gMTtcblxuICAgICAgICAgICAgaWYgKG9wdHMubG9vcCkge1xuICAgICAgICAgICAgICAgIC8qIERvdWJsZSB0aGUgbG9vcCBjb3VudCB0byBjb252ZXJ0IGl0IGludG8gaXRzIGFwcHJvcHJpYXRlIG51bWJlciBvZiBcInJldmVyc2VcIiBjYWxscy5cbiAgICAgICAgICAgICAgICAgU3VidHJhY3QgMSBmcm9tIHRoZSByZXN1bHRpbmcgdmFsdWUgc2luY2UgdGhlIGN1cnJlbnQgY2FsbCBpcyBpbmNsdWRlZCBpbiB0aGUgdG90YWwgYWx0ZXJuYXRpb24gY291bnQuICovXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCByZXZlcnNlQ2FsbHNDb3VudDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFNpbmNlIHRoZSBsb2dpYyBmb3IgdGhlIHJldmVyc2UgYWN0aW9uIG9jY3VycyBpbnNpZGUgUXVldWVpbmcgYW5kIHRoZXJlZm9yZSB0aGlzIGNhbGwncyBvcHRpb25zIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICAgaXNuJ3QgcGFyc2VkIHVudGlsIHRoZW4gYXMgd2VsbCwgdGhlIGN1cnJlbnQgY2FsbCdzIGRlbGF5IG9wdGlvbiBtdXN0IGJlIGV4cGxpY2l0bHkgcGFzc2VkIGludG8gdGhlIHJldmVyc2VcbiAgICAgICAgICAgICAgICAgICAgIGNhbGwgc28gdGhhdCB0aGUgZGVsYXkgbG9naWMgdGhhdCBvY2N1cnMgaW5zaWRlICpQcmUtUXVldWVpbmcqIGNhbiBwcm9jZXNzIGl0LiAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmV2ZXJzZU9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxheTogb3B0cy5kZWxheSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzOiBvcHRzLnByb2dyZXNzXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgLyogSWYgYSBjb21wbGV0ZSBjYWxsYmFjayB3YXMgcGFzc2VkIGludG8gdGhpcyBjYWxsLCB0cmFuc2ZlciBpdCB0byB0aGUgbG9vcCByZWRpcmVjdCdzIGZpbmFsIFwicmV2ZXJzZVwiIGNhbGxcbiAgICAgICAgICAgICAgICAgICAgIHNvIHRoYXQgaXQncyB0cmlnZ2VyZWQgd2hlbiB0aGUgZW50aXJlIHJlZGlyZWN0IGlzIGNvbXBsZXRlIChhbmQgbm90IHdoZW4gdGhlIHZlcnkgZmlyc3QgYW5pbWF0aW9uIGlzIGNvbXBsZXRlKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKHggPT09IHJldmVyc2VDYWxsc0NvdW50IC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZU9wdGlvbnMuZGlzcGxheSA9IG9wdHMuZGlzcGxheTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldmVyc2VPcHRpb25zLnZpc2liaWxpdHkgPSBvcHRzLnZpc2liaWxpdHk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXZlcnNlT3B0aW9ucy5jb21wbGV0ZSA9IG9wdHMuY29tcGxldGU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBhbmltYXRlKGVsZW1lbnRzLCBcInJldmVyc2VcIiwgcmV2ZXJzZU9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKlxuICAgICAgICAgICAgIENoYWluaW5nXG4gICAgICAgICAgICAgKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAvKiBSZXR1cm4gdGhlIGVsZW1lbnRzIGJhY2sgdG8gdGhlIGNhbGwgY2hhaW4sIHdpdGggd3JhcHBlZCBlbGVtZW50cyB0YWtpbmcgcHJlY2VkZW5jZSBpbiBjYXNlIFZlbG9jaXR5IHdhcyBjYWxsZWQgdmlhIHRoZSAkLmZuLiBleHRlbnNpb24uICovXG4gICAgICAgICAgICByZXR1cm4gZ2V0Q2hhaW4oKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBUdXJuIFZlbG9jaXR5IGludG8gdGhlIGFuaW1hdGlvbiBmdW5jdGlvbiwgZXh0ZW5kZWQgd2l0aCB0aGUgcHJlLWV4aXN0aW5nIFZlbG9jaXR5IG9iamVjdC4gKi9cbiAgICAgICAgVmVsb2NpdHkgPSAkLmV4dGVuZChhbmltYXRlLCBWZWxvY2l0eSk7XG4gICAgICAgIC8qIEZvciBsZWdhY3kgc3VwcG9ydCwgYWxzbyBleHBvc2UgdGhlIGxpdGVyYWwgYW5pbWF0ZSBtZXRob2QuICovXG4gICAgICAgIFZlbG9jaXR5LmFuaW1hdGUgPSBhbmltYXRlO1xuXG4gICAgICAgIC8qKioqKioqKioqKioqKlxuICAgICAgICAgVGltaW5nXG4gICAgICAgICAqKioqKioqKioqKioqKi9cblxuICAgICAgICAvKiBUaWNrZXIgZnVuY3Rpb24uICovXG4gICAgICAgIHZhciB0aWNrZXIgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHJBRlNoaW07XG5cbiAgICAgICAgLyogSW5hY3RpdmUgYnJvd3NlciB0YWJzIHBhdXNlIHJBRiwgd2hpY2ggcmVzdWx0cyBpbiBhbGwgYWN0aXZlIGFuaW1hdGlvbnMgaW1tZWRpYXRlbHkgc3ByaW50aW5nIHRvIHRoZWlyIGNvbXBsZXRpb24gc3RhdGVzIHdoZW4gdGhlIHRhYiByZWZvY3VzZXMuXG4gICAgICAgICBUbyBnZXQgYXJvdW5kIHRoaXMsIHdlIGR5bmFtaWNhbGx5IHN3aXRjaCByQUYgdG8gc2V0VGltZW91dCAod2hpY2ggdGhlIGJyb3dzZXIgKmRvZXNuJ3QqIHBhdXNlKSB3aGVuIHRoZSB0YWIgbG9zZXMgZm9jdXMuIFdlIHNraXAgdGhpcyBmb3IgbW9iaWxlXG4gICAgICAgICBkZXZpY2VzIHRvIGF2b2lkIHdhc3RpbmcgYmF0dGVyeSBwb3dlciBvbiBpbmFjdGl2ZSB0YWJzLiAqL1xuICAgICAgICAvKiBOb3RlOiBUYWIgZm9jdXMgZGV0ZWN0aW9uIGRvZXNuJ3Qgd29yayBvbiBvbGRlciB2ZXJzaW9ucyBvZiBJRSwgYnV0IHRoYXQncyBva2F5IHNpbmNlIHRoZXkgZG9uJ3Qgc3VwcG9ydCByQUYgdG8gYmVnaW4gd2l0aC4gKi9cbiAgICAgICAgaWYgKCFWZWxvY2l0eS5TdGF0ZS5pc01vYmlsZSAmJiBkb2N1bWVudC5oaWRkZW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdmFyIHVwZGF0ZVRpY2tlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8qIFJlYXNzaWduIHRoZSByQUYgZnVuY3Rpb24gKHdoaWNoIHRoZSBnbG9iYWwgdGljaygpIGZ1bmN0aW9uIHVzZXMpIGJhc2VkIG9uIHRoZSB0YWIncyBmb2N1cyBzdGF0ZS4gKi9cbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuaGlkZGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpY2tlciA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBUaGUgdGljayBmdW5jdGlvbiBuZWVkcyBhIHRydXRoeSBmaXJzdCBhcmd1bWVudCBpbiBvcmRlciB0byBwYXNzIGl0cyBpbnRlcm5hbCB0aW1lc3RhbXAgY2hlY2suICovXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDE2KTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBUaGUgckFGIGxvb3AgaGFzIGJlZW4gcGF1c2VkIGJ5IHRoZSBicm93c2VyLCBzbyB3ZSBtYW51YWxseSByZXN0YXJ0IHRoZSB0aWNrLiAqL1xuICAgICAgICAgICAgICAgICAgICB0aWNrKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGlja2VyID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCByQUZTaGltO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8qIFBhZ2UgY291bGQgYmUgc2l0dGluZyBpbiB0aGUgYmFja2dyb3VuZCBhdCB0aGlzIHRpbWUgKGkuZS4gb3BlbmVkIGFzIG5ldyB0YWIpIHNvIG1ha2luZyBzdXJlIHdlIHVzZSBjb3JyZWN0IHRpY2tlciBmcm9tIHRoZSBzdGFydCAqL1xuICAgICAgICAgICAgdXBkYXRlVGlja2VyKCk7XG5cbiAgICAgICAgICAgIC8qIEFuZCB0aGVuIHJ1biBjaGVjayBhZ2FpbiBldmVyeSB0aW1lIHZpc2liaWxpdHkgY2hhbmdlcyAqL1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInZpc2liaWxpdHljaGFuZ2VcIiwgdXBkYXRlVGlja2VyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKioqKioqKioqKipcbiAgICAgICAgIFRpY2tcbiAgICAgICAgICoqKioqKioqKioqKi9cblxuICAgICAgICAvKiBOb3RlOiBBbGwgY2FsbHMgdG8gVmVsb2NpdHkgYXJlIHB1c2hlZCB0byB0aGUgVmVsb2NpdHkuU3RhdGUuY2FsbHMgYXJyYXksIHdoaWNoIGlzIGZ1bGx5IGl0ZXJhdGVkIHRocm91Z2ggdXBvbiBlYWNoIHRpY2suICovXG4gICAgICAgIGZ1bmN0aW9uIHRpY2sodGltZXN0YW1wKSB7XG4gICAgICAgICAgICAvKiBBbiBlbXB0eSB0aW1lc3RhbXAgYXJndW1lbnQgaW5kaWNhdGVzIHRoYXQgdGhpcyBpcyB0aGUgZmlyc3QgdGljayBvY2N1cmVuY2Ugc2luY2UgdGlja2luZyB3YXMgdHVybmVkIG9uLlxuICAgICAgICAgICAgIFdlIGxldmVyYWdlIHRoaXMgbWV0YWRhdGEgdG8gZnVsbHkgaWdub3JlIHRoZSBmaXJzdCB0aWNrIHBhc3Mgc2luY2UgUkFGJ3MgaW5pdGlhbCBwYXNzIGlzIGZpcmVkIHdoZW5ldmVyXG4gICAgICAgICAgICAgdGhlIGJyb3dzZXIncyBuZXh0IHRpY2sgc3luYyB0aW1lIG9jY3Vycywgd2hpY2ggcmVzdWx0cyBpbiB0aGUgZmlyc3QgZWxlbWVudHMgc3ViamVjdGVkIHRvIFZlbG9jaXR5XG4gICAgICAgICAgICAgY2FsbHMgYmVpbmcgYW5pbWF0ZWQgb3V0IG9mIHN5bmMgd2l0aCBhbnkgZWxlbWVudHMgYW5pbWF0ZWQgaW1tZWRpYXRlbHkgdGhlcmVhZnRlci4gSW4gc2hvcnQsIHdlIGlnbm9yZVxuICAgICAgICAgICAgIHRoZSBmaXJzdCBSQUYgdGljayBwYXNzIHNvIHRoYXQgZWxlbWVudHMgYmVpbmcgaW1tZWRpYXRlbHkgY29uc2VjdXRpdmVseSBhbmltYXRlZCAtLSBpbnN0ZWFkIG9mIHNpbXVsdGFuZW91c2x5IGFuaW1hdGVkXG4gICAgICAgICAgICAgYnkgdGhlIHNhbWUgVmVsb2NpdHkgY2FsbCAtLSBhcmUgcHJvcGVybHkgYmF0Y2hlZCBpbnRvIHRoZSBzYW1lIGluaXRpYWwgUkFGIHRpY2sgYW5kIGNvbnNlcXVlbnRseSByZW1haW4gaW4gc3luYyB0aGVyZWFmdGVyLiAqL1xuICAgICAgICAgICAgaWYgKHRpbWVzdGFtcCkge1xuICAgICAgICAgICAgICAgIC8qIFdlIG5vcm1hbGx5IHVzZSBSQUYncyBoaWdoIHJlc29sdXRpb24gdGltZXN0YW1wIGJ1dCBhcyBpdCBjYW4gYmUgc2lnbmlmaWNhbnRseSBvZmZzZXQgd2hlbiB0aGUgYnJvd3NlciBpc1xuICAgICAgICAgICAgICAgICB1bmRlciBoaWdoIHN0cmVzcyB3ZSBnaXZlIHRoZSBvcHRpb24gZm9yIGNob3BwaW5lc3Mgb3ZlciBhbGxvd2luZyB0aGUgYnJvd3NlciB0byBkcm9wIGh1Z2UgY2h1bmtzIG9mIGZyYW1lcy5cbiAgICAgICAgICAgICAgICAgV2UgdXNlIHBlcmZvcm1hbmNlLm5vdygpIGFuZCBzaGltIGl0IGlmIGl0IGRvZXNuJ3QgZXhpc3QgZm9yIHdoZW4gdGhlIHRhYiBpcyBoaWRkZW4uICovXG4gICAgICAgICAgICAgICAgdmFyIHRpbWVDdXJyZW50ID0gVmVsb2NpdHkudGltZXN0YW1wICYmIHRpbWVzdGFtcCAhPT0gdHJ1ZSA/IHRpbWVzdGFtcCA6IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgIENhbGwgSXRlcmF0aW9uXG4gICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgdmFyIGNhbGxzTGVuZ3RoID0gVmVsb2NpdHkuU3RhdGUuY2FsbHMubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgLyogVG8gc3BlZWQgdXAgaXRlcmF0aW5nIG92ZXIgdGhpcyBhcnJheSwgaXQgaXMgY29tcGFjdGVkIChmYWxzZXkgaXRlbXMgLS0gY2FsbHMgdGhhdCBoYXZlIGNvbXBsZXRlZCAtLSBhcmUgcmVtb3ZlZClcbiAgICAgICAgICAgICAgICAgd2hlbiBpdHMgbGVuZ3RoIGhhcyBiYWxsb29uZWQgdG8gYSBwb2ludCB0aGF0IGNhbiBpbXBhY3QgdGljayBwZXJmb3JtYW5jZS4gVGhpcyBvbmx5IGJlY29tZXMgbmVjZXNzYXJ5IHdoZW4gYW5pbWF0aW9uXG4gICAgICAgICAgICAgICAgIGhhcyBiZWVuIGNvbnRpbnVvdXMgd2l0aCBtYW55IGVsZW1lbnRzIG92ZXIgYSBsb25nIHBlcmlvZCBvZiB0aW1lOyB3aGVuZXZlciBhbGwgYWN0aXZlIGNhbGxzIGFyZSBjb21wbGV0ZWQsIGNvbXBsZXRlQ2FsbCgpIGNsZWFycyBWZWxvY2l0eS5TdGF0ZS5jYWxscy4gKi9cbiAgICAgICAgICAgICAgICBpZiAoY2FsbHNMZW5ndGggPiAxMDAwMCkge1xuICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5TdGF0ZS5jYWxscyA9IGNvbXBhY3RTcGFyc2VBcnJheShWZWxvY2l0eS5TdGF0ZS5jYWxscyk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxzTGVuZ3RoID0gVmVsb2NpdHkuU3RhdGUuY2FsbHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCBlYWNoIGFjdGl2ZSBjYWxsLiAqL1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbHNMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAvKiBXaGVuIGEgVmVsb2NpdHkgY2FsbCBpcyBjb21wbGV0ZWQsIGl0cyBWZWxvY2l0eS5TdGF0ZS5jYWxscyBlbnRyeSBpcyBzZXQgdG8gZmFsc2UuIENvbnRpbnVlIG9uIHRvIHRoZSBuZXh0IGNhbGwuICovXG4gICAgICAgICAgICAgICAgICAgIGlmICghVmVsb2NpdHkuU3RhdGUuY2FsbHNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgQ2FsbC1XaWRlIFZhcmlhYmxlc1xuICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjYWxsQ29udGFpbmVyID0gVmVsb2NpdHkuU3RhdGUuY2FsbHNbaV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsID0gY2FsbENvbnRhaW5lclswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMgPSBjYWxsQ29udGFpbmVyWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZVN0YXJ0ID0gY2FsbENvbnRhaW5lclszXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0VGljayA9ICEhdGltZVN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW5EdW1teVZhbHVlID0gbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdXNlT2JqZWN0ID0gY2FsbENvbnRhaW5lcls1XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbGxpc2Vjb25kc0VsbGFwc2VkID0gY2FsbENvbnRhaW5lcls2XTtcblxuXG5cbiAgICAgICAgICAgICAgICAgICAgLyogSWYgdGltZVN0YXJ0IGlzIHVuZGVmaW5lZCwgdGhlbiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lIHRoYXQgdGhpcyBjYWxsIGhhcyBiZWVuIHByb2Nlc3NlZCBieSB0aWNrKCkuXG4gICAgICAgICAgICAgICAgICAgICBXZSBhc3NpZ24gdGltZVN0YXJ0IG5vdyBzbyB0aGF0IGl0cyB2YWx1ZSBpcyBhcyBjbG9zZSB0byB0aGUgcmVhbCBhbmltYXRpb24gc3RhcnQgdGltZSBhcyBwb3NzaWJsZS5cbiAgICAgICAgICAgICAgICAgICAgIChDb252ZXJzZWx5LCBoYWQgdGltZVN0YXJ0IGJlZW4gZGVmaW5lZCB3aGVuIHRoaXMgY2FsbCB3YXMgYWRkZWQgdG8gVmVsb2NpdHkuU3RhdGUuY2FsbHMsIHRoZSBkZWxheVxuICAgICAgICAgICAgICAgICAgICAgYmV0d2VlbiB0aGF0IHRpbWUgYW5kIG5vdyB3b3VsZCBjYXVzZSB0aGUgZmlyc3QgZmV3IGZyYW1lcyBvZiB0aGUgdHdlZW4gdG8gYmUgc2tpcHBlZCBzaW5jZVxuICAgICAgICAgICAgICAgICAgICAgcGVyY2VudENvbXBsZXRlIGlzIGNhbGN1bGF0ZWQgcmVsYXRpdmUgdG8gdGltZVN0YXJ0LikgKi9cbiAgICAgICAgICAgICAgICAgICAgLyogRnVydGhlciwgc3VidHJhY3QgMTZtcyAodGhlIGFwcHJveGltYXRlIHJlc29sdXRpb24gb2YgUkFGKSBmcm9tIHRoZSBjdXJyZW50IHRpbWUgdmFsdWUgc28gdGhhdCB0aGVcbiAgICAgICAgICAgICAgICAgICAgIGZpcnN0IHRpY2sgaXRlcmF0aW9uIGlzbid0IHdhc3RlZCBieSBhbmltYXRpbmcgYXQgMCUgdHdlZW4gY29tcGxldGlvbiwgd2hpY2ggd291bGQgcHJvZHVjZSB0aGVcbiAgICAgICAgICAgICAgICAgICAgIHNhbWUgc3R5bGUgdmFsdWUgYXMgdGhlIGVsZW1lbnQncyBjdXJyZW50IHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRpbWVTdGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGltZVN0YXJ0ID0gVmVsb2NpdHkuU3RhdGUuY2FsbHNbaV1bM10gPSB0aW1lQ3VycmVudCAtIDE2O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogSWYgYSBwYXVzZSBvYmplY3QgaXMgcHJlc2VudCwgc2tpcCBwcm9jZXNzaW5nIHVubGVzcyBpdCBoYXMgYmVlbiBzZXQgdG8gcmVzdW1lICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXVzZU9iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhdXNlT2JqZWN0LnJlc3VtZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFVwZGF0ZSB0aGUgdGltZSBzdGFydCB0byBhY2NvbW9kYXRlIHRoZSBwYXVzZWQgY29tcGxldGlvbiBhbW91bnQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lU3RhcnQgPSBjYWxsQ29udGFpbmVyWzNdID0gTWF0aC5yb3VuZCh0aW1lQ3VycmVudCAtIG1pbGxpc2Vjb25kc0VsbGFwc2VkIC0gMTYpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogUmVtb3ZlIHBhdXNlIG9iamVjdCBhZnRlciBwcm9jZXNzaW5nICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbENvbnRhaW5lcls1XSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbWlsbGlzZWNvbmRzRWxsYXBzZWQgPSBjYWxsQ29udGFpbmVyWzZdID0gdGltZUN1cnJlbnQgLSB0aW1lU3RhcnQ7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogVGhlIHR3ZWVuJ3MgY29tcGxldGlvbiBwZXJjZW50YWdlIGlzIHJlbGF0aXZlIHRvIHRoZSB0d2VlbidzIHN0YXJ0IHRpbWUsIG5vdCB0aGUgdHdlZW4ncyBzdGFydCB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgKHdoaWNoIHdvdWxkIHJlc3VsdCBpbiB1bnByZWRpY3RhYmxlIHR3ZWVuIGR1cmF0aW9ucyBzaW5jZSBKYXZhU2NyaXB0J3MgdGltZXJzIGFyZSBub3QgcGFydGljdWxhcmx5IGFjY3VyYXRlKS5cbiAgICAgICAgICAgICAgICAgICAgIEFjY29yZGluZ2x5LCB3ZSBlbnN1cmUgdGhhdCBwZXJjZW50Q29tcGxldGUgZG9lcyBub3QgZXhjZWVkIDEuICovXG4gICAgICAgICAgICAgICAgICAgIHZhciBwZXJjZW50Q29tcGxldGUgPSBNYXRoLm1pbigobWlsbGlzZWNvbmRzRWxsYXBzZWQpIC8gb3B0cy5kdXJhdGlvbiwgMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgIEVsZW1lbnQgSXRlcmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIEZvciBldmVyeSBjYWxsLCBpdGVyYXRlIHRocm91Z2ggZWFjaCBvZiB0aGUgZWxlbWVudHMgaW4gaXRzIHNldC4gKi9cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGNhbGxMZW5ndGggPSBjYWxsLmxlbmd0aDsgaiA8IGNhbGxMZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHR3ZWVuc0NvbnRhaW5lciA9IGNhbGxbal0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IHR3ZWVuc0NvbnRhaW5lci5lbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBDaGVjayB0byBzZWUgaWYgdGhpcyBlbGVtZW50IGhhcyBiZWVuIGRlbGV0ZWQgbWlkd2F5IHRocm91Z2ggdGhlIGFuaW1hdGlvbiBieSBjaGVja2luZyBmb3IgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWVkIGV4aXN0ZW5jZSBvZiBpdHMgZGF0YSBjYWNoZS4gSWYgaXQncyBnb25lLCBvciB0aGUgZWxlbWVudCBpcyBjdXJyZW50bHkgcGF1c2VkLCBza2lwIGFuaW1hdGluZyB0aGlzIGVsZW1lbnQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIURhdGEoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRyYW5zZm9ybVByb3BlcnR5RXhpc3RzID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgRGlzcGxheSAmIFZpc2liaWxpdHkgVG9nZ2xpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgZGlzcGxheSBvcHRpb24gaXMgc2V0IHRvIG5vbi1cIm5vbmVcIiwgc2V0IGl0IHVwZnJvbnQgc28gdGhhdCB0aGUgZWxlbWVudCBjYW4gYmVjb21lIHZpc2libGUgYmVmb3JlIHR3ZWVuaW5nIGJlZ2lucy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAoT3RoZXJ3aXNlLCBkaXNwbGF5J3MgXCJub25lXCIgdmFsdWUgaXMgc2V0IGluIGNvbXBsZXRlQ2FsbCgpIG9uY2UgdGhlIGFuaW1hdGlvbiBoYXMgY29tcGxldGVkLikgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLmRpc3BsYXkgIT09IHVuZGVmaW5lZCAmJiBvcHRzLmRpc3BsYXkgIT09IG51bGwgJiYgb3B0cy5kaXNwbGF5ICE9PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLmRpc3BsYXkgPT09IFwiZmxleFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmbGV4VmFsdWVzID0gW1wiLXdlYmtpdC1ib3hcIiwgXCItbW96LWJveFwiLCBcIi1tcy1mbGV4Ym94XCIsIFwiLXdlYmtpdC1mbGV4XCJdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChmbGV4VmFsdWVzLCBmdW5jdGlvbihpLCBmbGV4VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENTUy5zZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiZGlzcGxheVwiLCBmbGV4VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDU1Muc2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcImRpc3BsYXlcIiwgb3B0cy5kaXNwbGF5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogU2FtZSBnb2VzIHdpdGggdGhlIHZpc2liaWxpdHkgb3B0aW9uLCBidXQgaXRzIFwibm9uZVwiIGVxdWl2YWxlbnQgaXMgXCJoaWRkZW5cIi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLnZpc2liaWxpdHkgIT09IHVuZGVmaW5lZCAmJiBvcHRzLnZpc2liaWxpdHkgIT09IFwiaGlkZGVuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDU1Muc2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcInZpc2liaWxpdHlcIiwgb3B0cy52aXNpYmlsaXR5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgIFByb3BlcnR5IEl0ZXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogRm9yIGV2ZXJ5IGVsZW1lbnQsIGl0ZXJhdGUgdGhyb3VnaCBlYWNoIHByb3BlcnR5LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gdHdlZW5zQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogSW4gYWRkaXRpb24gdG8gcHJvcGVydHkgdHdlZW4gZGF0YSwgdHdlZW5zQ29udGFpbmVyIGNvbnRhaW5zIGEgcmVmZXJlbmNlIHRvIGl0cyBhc3NvY2lhdGVkIGVsZW1lbnQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR3ZWVuc0NvbnRhaW5lci5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkgJiYgcHJvcGVydHkgIT09IFwiZWxlbWVudFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0d2VlbiA9IHR3ZWVuc0NvbnRhaW5lcltwcm9wZXJ0eV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBFYXNpbmcgY2FuIGVpdGhlciBiZSBhIHByZS1nZW5lcmVhdGVkIGZ1bmN0aW9uIG9yIGEgc3RyaW5nIHRoYXQgcmVmZXJlbmNlcyBhIHByZS1yZWdpc3RlcmVkIGVhc2luZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uIHRoZSBWZWxvY2l0eS5FYXNpbmdzIG9iamVjdC4gSW4gZWl0aGVyIGNhc2UsIHJldHVybiB0aGUgYXBwcm9wcmlhdGUgZWFzaW5nICpmdW5jdGlvbiouICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmcgPSBUeXBlLmlzU3RyaW5nKHR3ZWVuLmVhc2luZykgPyBWZWxvY2l0eS5FYXNpbmdzW3R3ZWVuLmVhc2luZ10gOiB0d2Vlbi5lYXNpbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ3VycmVudCBWYWx1ZSBDYWxjdWxhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUeXBlLmlzU3RyaW5nKHR3ZWVuLnBhdHRlcm4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGF0dGVyblJlcGxhY2UgPSBwZXJjZW50Q29tcGxldGUgPT09IDEgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCQwLCBpbmRleCwgcm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHR3ZWVuLmVuZFZhbHVlW2luZGV4XTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcm91bmQgPyBNYXRoLnJvdW5kKHJlc3VsdCkgOiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oJDAsIGluZGV4LCByb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhcnRWYWx1ZSA9IHR3ZWVuLnN0YXJ0VmFsdWVbaW5kZXhdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW5EZWx0YSA9IHR3ZWVuLmVuZFZhbHVlW2luZGV4XSAtIHN0YXJ0VmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBzdGFydFZhbHVlICsgKHR3ZWVuRGVsdGEgKiBlYXNpbmcocGVyY2VudENvbXBsZXRlLCBvcHRzLCB0d2VlbkRlbHRhKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvdW5kID8gTWF0aC5yb3VuZChyZXN1bHQpIDogcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZSA9IHR3ZWVuLnBhdHRlcm4ucmVwbGFjZSgveyhcXGQrKSghKT99L2csIHBhdHRlcm5SZXBsYWNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwZXJjZW50Q29tcGxldGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoaXMgaXMgdGhlIGxhc3QgdGljayBwYXNzIChpZiB3ZSd2ZSByZWFjaGVkIDEwMCUgY29tcGxldGlvbiBmb3IgdGhpcyB0d2VlbiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5zdXJlIHRoYXQgY3VycmVudFZhbHVlIGlzIGV4cGxpY2l0bHkgc2V0IHRvIGl0cyB0YXJnZXQgZW5kVmFsdWUgc28gdGhhdCBpdCdzIG5vdCBzdWJqZWN0ZWQgdG8gYW55IHJvdW5kaW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlID0gdHdlZW4uZW5kVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBPdGhlcndpc2UsIGNhbGN1bGF0ZSBjdXJyZW50VmFsdWUgYmFzZWQgb24gdGhlIGN1cnJlbnQgZGVsdGEgZnJvbSBzdGFydFZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHR3ZWVuRGVsdGEgPSB0d2Vlbi5lbmRWYWx1ZSAtIHR3ZWVuLnN0YXJ0VmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZSA9IHR3ZWVuLnN0YXJ0VmFsdWUgKyAodHdlZW5EZWx0YSAqIGVhc2luZyhwZXJjZW50Q29tcGxldGUsIG9wdHMsIHR3ZWVuRGVsdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIG5vIHZhbHVlIGNoYW5nZSBpcyBvY2N1cnJpbmcsIGRvbid0IHByb2NlZWQgd2l0aCBET00gdXBkYXRpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmaXJzdFRpY2sgJiYgKGN1cnJlbnRWYWx1ZSA9PT0gdHdlZW4uY3VycmVudFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0d2Vlbi5jdXJyZW50VmFsdWUgPSBjdXJyZW50VmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgd2UncmUgdHdlZW5pbmcgYSBmYWtlICd0d2VlbicgcHJvcGVydHkgaW4gb3JkZXIgdG8gbG9nIHRyYW5zaXRpb24gdmFsdWVzLCB1cGRhdGUgdGhlIG9uZS1wZXItY2FsbCB2YXJpYWJsZSBzbyB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdCBjYW4gYmUgcGFzc2VkIGludG8gdGhlIHByb2dyZXNzIGNhbGxiYWNrLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgPT09IFwidHdlZW5cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW5EdW1teVZhbHVlID0gY3VycmVudFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEhvb2tzOiBQYXJ0IElcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKiovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaG9va1Jvb3Q7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZvciBob29rZWQgcHJvcGVydGllcywgdGhlIG5ld2x5LXVwZGF0ZWQgcm9vdFByb3BlcnR5VmFsdWVDYWNoZSBpcyBjYWNoZWQgb250byB0aGUgZWxlbWVudCBzbyB0aGF0IGl0IGNhbiBiZSB1c2VkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIHN1YnNlcXVlbnQgaG9va3MgaW4gdGhpcyBjYWxsIHRoYXQgYXJlIGFzc29jaWF0ZWQgd2l0aCB0aGUgc2FtZSByb290IHByb3BlcnR5LiBJZiB3ZSBkaWRuJ3QgY2FjaGUgdGhlIHVwZGF0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSwgZWFjaCBzdWJzZXF1ZW50IHVwZGF0ZSB0byB0aGUgcm9vdCBwcm9wZXJ0eSBpbiB0aGlzIHRpY2sgcGFzcyB3b3VsZCByZXNldCB0aGUgcHJldmlvdXMgaG9vaydzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlcyB0byByb290UHJvcGVydHlWYWx1ZSBwcmlvciB0byBpbmplY3Rpb24uIEEgbmljZSBwZXJmb3JtYW5jZSBieXByb2R1Y3Qgb2Ygcm9vdFByb3BlcnR5VmFsdWUgY2FjaGluZyBpcyB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2VxdWVudGx5IGNoYWluZWQgYW5pbWF0aW9ucyB1c2luZyB0aGUgc2FtZSBob29rUm9vdCBidXQgYSBkaWZmZXJlbnQgaG9vayBjYW4gdXNlIHRoaXMgY2FjaGVkIHJvb3RQcm9wZXJ0eVZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5Ib29rcy5yZWdpc3RlcmVkW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2tSb290ID0gQ1NTLkhvb2tzLmdldFJvb3QocHJvcGVydHkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGUgPSBEYXRhKGVsZW1lbnQpLnJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGVbaG9va1Jvb3RdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW4ucm9vdFByb3BlcnR5VmFsdWUgPSByb290UHJvcGVydHlWYWx1ZUNhY2hlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRE9NIFVwZGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBzZXRQcm9wZXJ0eVZhbHVlKCkgcmV0dXJucyBhbiBhcnJheSBvZiB0aGUgcHJvcGVydHkgbmFtZSBhbmQgcHJvcGVydHkgdmFsdWUgcG9zdCBhbnkgbm9ybWFsaXphdGlvbiB0aGF0IG1heSBoYXZlIGJlZW4gcGVyZm9ybWVkLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogVG8gc29sdmUgYW4gSUU8PTggcG9zaXRpb25pbmcgYnVnLCB0aGUgdW5pdCB0eXBlIGlzIGRyb3BwZWQgd2hlbiBzZXR0aW5nIGEgcHJvcGVydHkgdmFsdWUgb2YgMC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhZGp1c3RlZFNldERhdGEgPSBDU1Muc2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCAvKiBTRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0d2Vlbi5jdXJyZW50VmFsdWUgKyAoSUUgPCA5ICYmIHBhcnNlRmxvYXQoY3VycmVudFZhbHVlKSA9PT0gMCA/IFwiXCIgOiB0d2Vlbi51bml0VHlwZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW4ucm9vdFByb3BlcnR5VmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW4uc2Nyb2xsRGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSG9va3M6IFBhcnQgSUlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3cgdGhhdCB3ZSBoYXZlIHRoZSBob29rJ3MgdXBkYXRlZCByb290UHJvcGVydHlWYWx1ZSAodGhlIHBvc3QtcHJvY2Vzc2VkIHZhbHVlIHByb3ZpZGVkIGJ5IGFkanVzdGVkU2V0RGF0YSksIGNhY2hlIGl0IG9udG8gdGhlIGVsZW1lbnQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoQ1NTLkhvb2tzLnJlZ2lzdGVyZWRbcHJvcGVydHldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU2luY2UgYWRqdXN0ZWRTZXREYXRhIGNvbnRhaW5zIG5vcm1hbGl6ZWQgZGF0YSByZWFkeSBmb3IgRE9NIHVwZGF0aW5nLCB0aGUgcm9vdFByb3BlcnR5VmFsdWUgbmVlZHMgdG8gYmUgcmUtZXh0cmFjdGVkIGZyb20gaXRzIG5vcm1hbGl6ZWQgZm9ybS4gPz8gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbaG9va1Jvb3RdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERhdGEoZWxlbWVudCkucm9vdFByb3BlcnR5VmFsdWVDYWNoZVtob29rUm9vdF0gPSBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtob29rUm9vdF0oXCJleHRyYWN0XCIsIG51bGwsIGFkanVzdGVkU2V0RGF0YVsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS5yb290UHJvcGVydHlWYWx1ZUNhY2hlW2hvb2tSb290XSA9IGFkanVzdGVkU2V0RGF0YVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUcmFuc2Zvcm1zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBGbGFnIHdoZXRoZXIgYSB0cmFuc2Zvcm0gcHJvcGVydHkgaXMgYmVpbmcgYW5pbWF0ZWQgc28gdGhhdCBmbHVzaFRyYW5zZm9ybUNhY2hlKCkgY2FuIGJlIHRyaWdnZXJlZCBvbmNlIHRoaXMgdGljayBwYXNzIGlzIGNvbXBsZXRlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFkanVzdGVkU2V0RGF0YVswXSA9PT0gXCJ0cmFuc2Zvcm1cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybVByb3BlcnR5RXhpc3RzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgIG1vYmlsZUhBXG4gICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgbW9iaWxlSEEgaXMgZW5hYmxlZCwgc2V0IHRoZSB0cmFuc2xhdGUzZCB0cmFuc2Zvcm0gdG8gbnVsbCB0byBmb3JjZSBoYXJkd2FyZSBhY2NlbGVyYXRpb24uXG4gICAgICAgICAgICAgICAgICAgICAgICAgSXQncyBzYWZlIHRvIG92ZXJyaWRlIHRoaXMgcHJvcGVydHkgc2luY2UgVmVsb2NpdHkgZG9lc24ndCBhY3R1YWxseSBzdXBwb3J0IGl0cyBhbmltYXRpb24gKGhvb2tzIGFyZSB1c2VkIGluIGl0cyBwbGFjZSkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5tb2JpbGVIQSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIERvbid0IHNldCB0aGUgbnVsbCB0cmFuc2Zvcm0gaGFjayBpZiB3ZSd2ZSBhbHJlYWR5IGRvbmUgc28uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKERhdGEoZWxlbWVudCkudHJhbnNmb3JtQ2FjaGUudHJhbnNsYXRlM2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBBbGwgZW50cmllcyBvbiB0aGUgdHJhbnNmb3JtQ2FjaGUgb2JqZWN0IGFyZSBsYXRlciBjb25jYXRlbmF0ZWQgaW50byBhIHNpbmdsZSB0cmFuc2Zvcm0gc3RyaW5nIHZpYSBmbHVzaFRyYW5zZm9ybUNhY2hlKCkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERhdGEoZWxlbWVudCkudHJhbnNmb3JtQ2FjaGUudHJhbnNsYXRlM2QgPSBcIigwcHgsIDBweCwgMHB4KVwiO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybVByb3BlcnR5RXhpc3RzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cmFuc2Zvcm1Qcm9wZXJ0eUV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENTUy5mbHVzaFRyYW5zZm9ybUNhY2hlKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogVGhlIG5vbi1cIm5vbmVcIiBkaXNwbGF5IHZhbHVlIGlzIG9ubHkgYXBwbGllZCB0byBhbiBlbGVtZW50IG9uY2UgLS0gd2hlbiBpdHMgYXNzb2NpYXRlZCBjYWxsIGlzIGZpcnN0IHRpY2tlZCB0aHJvdWdoLlxuICAgICAgICAgICAgICAgICAgICAgQWNjb3JkaW5nbHksIGl0J3Mgc2V0IHRvIGZhbHNlIHNvIHRoYXQgaXQgaXNuJ3QgcmUtcHJvY2Vzc2VkIGJ5IHRoaXMgY2FsbCBpbiB0aGUgbmV4dCB0aWNrLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5kaXNwbGF5ICE9PSB1bmRlZmluZWQgJiYgb3B0cy5kaXNwbGF5ICE9PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuY2FsbHNbaV1bMl0uZGlzcGxheSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLnZpc2liaWxpdHkgIT09IHVuZGVmaW5lZCAmJiBvcHRzLnZpc2liaWxpdHkgIT09IFwiaGlkZGVuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLmNhbGxzW2ldWzJdLnZpc2liaWxpdHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIFBhc3MgdGhlIGVsZW1lbnRzIGFuZCB0aGUgdGltaW5nIGRhdGEgKHBlcmNlbnRDb21wbGV0ZSwgbXNSZW1haW5pbmcsIHRpbWVTdGFydCwgdHdlZW5EdW1teVZhbHVlKSBpbnRvIHRoZSBwcm9ncmVzcyBjYWxsYmFjay4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMucHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMucHJvZ3Jlc3MuY2FsbChjYWxsQ29udGFpbmVyWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxDb250YWluZXJbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyY2VudENvbXBsZXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgubWF4KDAsICh0aW1lU3RhcnQgKyBvcHRzLmR1cmF0aW9uKSAtIHRpbWVDdXJyZW50KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lU3RhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW5EdW1teVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIHRoaXMgY2FsbCBoYXMgZmluaXNoZWQgdHdlZW5pbmcsIHBhc3MgaXRzIGluZGV4IHRvIGNvbXBsZXRlQ2FsbCgpIHRvIGhhbmRsZSBjYWxsIGNsZWFudXAuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChwZXJjZW50Q29tcGxldGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlQ2FsbChpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogTm90ZTogY29tcGxldGVDYWxsKCkgc2V0cyB0aGUgaXNUaWNraW5nIGZsYWcgdG8gZmFsc2Ugd2hlbiB0aGUgbGFzdCBjYWxsIG9uIFZlbG9jaXR5LlN0YXRlLmNhbGxzIGhhcyBjb21wbGV0ZWQuICovXG4gICAgICAgICAgICBpZiAoVmVsb2NpdHkuU3RhdGUuaXNUaWNraW5nKSB7XG4gICAgICAgICAgICAgICAgdGlja2VyKHRpY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgIENhbGwgQ29tcGxldGlvblxuICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAvKiBOb3RlOiBVbmxpa2UgdGljaygpLCB3aGljaCBwcm9jZXNzZXMgYWxsIGFjdGl2ZSBjYWxscyBhdCBvbmNlLCBjYWxsIGNvbXBsZXRpb24gaXMgaGFuZGxlZCBvbiBhIHBlci1jYWxsIGJhc2lzLiAqL1xuICAgICAgICBmdW5jdGlvbiBjb21wbGV0ZUNhbGwoY2FsbEluZGV4LCBpc1N0b3BwZWQpIHtcbiAgICAgICAgICAgIC8qIEVuc3VyZSB0aGUgY2FsbCBleGlzdHMuICovXG4gICAgICAgICAgICBpZiAoIVZlbG9jaXR5LlN0YXRlLmNhbGxzW2NhbGxJbmRleF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIFB1bGwgdGhlIG1ldGFkYXRhIGZyb20gdGhlIGNhbGwuICovXG4gICAgICAgICAgICB2YXIgY2FsbCA9IFZlbG9jaXR5LlN0YXRlLmNhbGxzW2NhbGxJbmRleF1bMF0sXG4gICAgICAgICAgICAgICAgZWxlbWVudHMgPSBWZWxvY2l0eS5TdGF0ZS5jYWxsc1tjYWxsSW5kZXhdWzFdLFxuICAgICAgICAgICAgICAgIG9wdHMgPSBWZWxvY2l0eS5TdGF0ZS5jYWxsc1tjYWxsSW5kZXhdWzJdLFxuICAgICAgICAgICAgICAgIHJlc29sdmVyID0gVmVsb2NpdHkuU3RhdGUuY2FsbHNbY2FsbEluZGV4XVs0XTtcblxuICAgICAgICAgICAgdmFyIHJlbWFpbmluZ0NhbGxzRXhpc3QgPSBmYWxzZTtcblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICBFbGVtZW50IEZpbmFsaXphdGlvblxuICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBjYWxsTGVuZ3RoID0gY2FsbC5sZW5ndGg7IGkgPCBjYWxsTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IGNhbGxbaV0uZWxlbWVudDtcblxuICAgICAgICAgICAgICAgIC8qIElmIHRoZSB1c2VyIHNldCBkaXNwbGF5IHRvIFwibm9uZVwiIChpbnRlbmRpbmcgdG8gaGlkZSB0aGUgZWxlbWVudCksIHNldCBpdCBub3cgdGhhdCB0aGUgYW5pbWF0aW9uIGhhcyBjb21wbGV0ZWQuICovXG4gICAgICAgICAgICAgICAgLyogTm90ZTogZGlzcGxheTpub25lIGlzbid0IHNldCB3aGVuIGNhbGxzIGFyZSBtYW51YWxseSBzdG9wcGVkICh2aWEgVmVsb2NpdHkoXCJzdG9wXCIpLiAqL1xuICAgICAgICAgICAgICAgIC8qIE5vdGU6IERpc3BsYXkgZ2V0cyBpZ25vcmVkIHdpdGggXCJyZXZlcnNlXCIgY2FsbHMgYW5kIGluZmluaXRlIGxvb3BzLCBzaW5jZSB0aGlzIGJlaGF2aW9yIHdvdWxkIGJlIHVuZGVzaXJhYmxlLiAqL1xuICAgICAgICAgICAgICAgIGlmICghaXNTdG9wcGVkICYmICFvcHRzLmxvb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuZGlzcGxheSA9PT0gXCJub25lXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIENTUy5zZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiZGlzcGxheVwiLCBvcHRzLmRpc3BsYXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMudmlzaWJpbGl0eSA9PT0gXCJoaWRkZW5cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLnNldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJ2aXNpYmlsaXR5XCIsIG9wdHMudmlzaWJpbGl0eSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiBJZiB0aGUgZWxlbWVudCdzIHF1ZXVlIGlzIGVtcHR5IChpZiBvbmx5IHRoZSBcImlucHJvZ3Jlc3NcIiBpdGVtIGlzIGxlZnQgYXQgcG9zaXRpb24gMCkgb3IgaWYgaXRzIHF1ZXVlIGlzIGFib3V0IHRvIHJ1blxuICAgICAgICAgICAgICAgICBhIG5vbi1WZWxvY2l0eS1pbml0aWF0ZWQgZW50cnksIHR1cm4gb2ZmIHRoZSBpc0FuaW1hdGluZyBmbGFnLiBBIG5vbi1WZWxvY2l0eS1pbml0aWF0aWVkIHF1ZXVlIGVudHJ5J3MgbG9naWMgbWlnaHQgYWx0ZXJcbiAgICAgICAgICAgICAgICAgYW4gZWxlbWVudCdzIENTUyB2YWx1ZXMgYW5kIHRoZXJlYnkgY2F1c2UgVmVsb2NpdHkncyBjYWNoZWQgdmFsdWUgZGF0YSB0byBnbyBzdGFsZS4gVG8gZGV0ZWN0IGlmIGEgcXVldWUgZW50cnkgd2FzIGluaXRpYXRlZCBieSBWZWxvY2l0eSxcbiAgICAgICAgICAgICAgICAgd2UgY2hlY2sgZm9yIHRoZSBleGlzdGVuY2Ugb2Ygb3VyIHNwZWNpYWwgVmVsb2NpdHkucXVldWVFbnRyeUZsYWcgZGVjbGFyYXRpb24sIHdoaWNoIG1pbmlmaWVycyB3b24ndCByZW5hbWUgc2luY2UgdGhlIGZsYWdcbiAgICAgICAgICAgICAgICAgaXMgYXNzaWduZWQgdG8galF1ZXJ5J3MgZ2xvYmFsICQgb2JqZWN0IGFuZCB0aHVzIGV4aXN0cyBvdXQgb2YgVmVsb2NpdHkncyBvd24gc2NvcGUuICovXG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBEYXRhKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMubG9vcCAhPT0gdHJ1ZSAmJiAoJC5xdWV1ZShlbGVtZW50KVsxXSA9PT0gdW5kZWZpbmVkIHx8ICEvXFwudmVsb2NpdHlRdWV1ZUVudHJ5RmxhZy9pLnRlc3QoJC5xdWV1ZShlbGVtZW50KVsxXSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFRoZSBlbGVtZW50IG1heSBoYXZlIGJlZW4gZGVsZXRlZC4gRW5zdXJlIHRoYXQgaXRzIGRhdGEgY2FjaGUgc3RpbGwgZXhpc3RzIGJlZm9yZSBhY3Rpbmcgb24gaXQuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmlzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBDbGVhciB0aGUgZWxlbWVudCdzIHJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGUsIHdoaWNoIHdpbGwgYmVjb21lIHN0YWxlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5yb290UHJvcGVydHlWYWx1ZUNhY2hlID0ge307XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0cmFuc2Zvcm1IQVByb3BlcnR5RXhpc3RzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiBhbnkgM0QgdHJhbnNmb3JtIHN1YnByb3BlcnR5IGlzIGF0IGl0cyBkZWZhdWx0IHZhbHVlIChyZWdhcmRsZXNzIG9mIHVuaXQgdHlwZSksIHJlbW92ZSBpdC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChDU1MuTGlzdHMudHJhbnNmb3JtczNELCBmdW5jdGlvbihpLCB0cmFuc2Zvcm1OYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlZmF1bHRWYWx1ZSA9IC9ec2NhbGUvLnRlc3QodHJhbnNmb3JtTmFtZSkgPyAxIDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlID0gZGF0YS50cmFuc2Zvcm1DYWNoZVt0cmFuc2Zvcm1OYW1lXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnRyYW5zZm9ybUNhY2hlW3RyYW5zZm9ybU5hbWVdICE9PSB1bmRlZmluZWQgJiYgbmV3IFJlZ0V4cChcIl5cXFxcKFwiICsgZGVmYXVsdFZhbHVlICsgXCJbXi5dXCIpLnRlc3QoY3VycmVudFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1IQVByb3BlcnR5RXhpc3RzID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgZGF0YS50cmFuc2Zvcm1DYWNoZVt0cmFuc2Zvcm1OYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogTW9iaWxlIGRldmljZXMgaGF2ZSBoYXJkd2FyZSBhY2NlbGVyYXRpb24gcmVtb3ZlZCBhdCB0aGUgZW5kIG9mIHRoZSBhbmltYXRpb24gaW4gb3JkZXIgdG8gYXZvaWQgaG9nZ2luZyB0aGUgR1BVJ3MgbWVtb3J5LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMubW9iaWxlSEEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1IQVByb3BlcnR5RXhpc3RzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgZGF0YS50cmFuc2Zvcm1DYWNoZS50cmFuc2xhdGUzZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogRmx1c2ggdGhlIHN1YnByb3BlcnR5IHJlbW92YWxzIHRvIHRoZSBET00uICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHJhbnNmb3JtSEFQcm9wZXJ0eUV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENTUy5mbHVzaFRyYW5zZm9ybUNhY2hlKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBSZW1vdmUgdGhlIFwidmVsb2NpdHktYW5pbWF0aW5nXCIgaW5kaWNhdG9yIGNsYXNzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLlZhbHVlcy5yZW1vdmVDbGFzcyhlbGVtZW50LCBcInZlbG9jaXR5LWFuaW1hdGluZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgT3B0aW9uOiBDb21wbGV0ZVxuICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAvKiBDb21wbGV0ZSBpcyBmaXJlZCBvbmNlIHBlciBjYWxsIChub3Qgb25jZSBwZXIgZWxlbWVudCkgYW5kIGlzIHBhc3NlZCB0aGUgZnVsbCByYXcgRE9NIGVsZW1lbnQgc2V0IGFzIGJvdGggaXRzIGNvbnRleHQgYW5kIGl0cyBmaXJzdCBhcmd1bWVudC4gKi9cbiAgICAgICAgICAgICAgICAvKiBOb3RlOiBDYWxsYmFja3MgYXJlbid0IGZpcmVkIHdoZW4gY2FsbHMgYXJlIG1hbnVhbGx5IHN0b3BwZWQgKHZpYSBWZWxvY2l0eShcInN0b3BcIikuICovXG4gICAgICAgICAgICAgICAgaWYgKCFpc1N0b3BwZWQgJiYgb3B0cy5jb21wbGV0ZSAmJiAhb3B0cy5sb29wICYmIChpID09PSBjYWxsTGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogV2UgdGhyb3cgY2FsbGJhY2tzIGluIGEgc2V0VGltZW91dCBzbyB0aGF0IHRocm93biBlcnJvcnMgZG9uJ3QgaGFsdCB0aGUgZXhlY3V0aW9uIG9mIFZlbG9jaXR5IGl0c2VsZi4gKi9cbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuY29tcGxldGUuY2FsbChlbGVtZW50cywgZWxlbWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgUHJvbWlzZSBSZXNvbHZpbmdcbiAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIC8qIE5vdGU6IEluZmluaXRlIGxvb3BzIGRvbid0IHJldHVybiBwcm9taXNlcy4gKi9cbiAgICAgICAgICAgICAgICBpZiAocmVzb2x2ZXIgJiYgb3B0cy5sb29wICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVyKGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICBPcHRpb246IExvb3AgKEluZmluaXRlKVxuICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgb3B0cy5sb29wID09PSB0cnVlICYmICFpc1N0b3BwZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogSWYgYSByb3RhdGVYL1kvWiBwcm9wZXJ0eSBpcyBiZWluZyBhbmltYXRlZCBieSAzNjAgZGVnIHdpdGggbG9vcDp0cnVlLCBzd2FwIHR3ZWVuIHN0YXJ0L2VuZCB2YWx1ZXMgdG8gZW5hYmxlXG4gICAgICAgICAgICAgICAgICAgICBjb250aW51b3VzIGl0ZXJhdGl2ZSByb3RhdGlvbiBsb29waW5nLiAoT3RoZXJpc2UsIHRoZSBlbGVtZW50IHdvdWxkIGp1c3Qgcm90YXRlIGJhY2sgYW5kIGZvcnRoLikgKi9cbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGRhdGEudHdlZW5zQ29udGFpbmVyLCBmdW5jdGlvbihwcm9wZXJ0eU5hbWUsIHR3ZWVuQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoL15yb3RhdGUvLnRlc3QocHJvcGVydHlOYW1lKSAmJiAoKHBhcnNlRmxvYXQodHdlZW5Db250YWluZXIuc3RhcnRWYWx1ZSkgLSBwYXJzZUZsb2F0KHR3ZWVuQ29udGFpbmVyLmVuZFZhbHVlKSkgJSAzNjAgPT09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9sZFN0YXJ0VmFsdWUgPSB0d2VlbkNvbnRhaW5lci5zdGFydFZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW5Db250YWluZXIuc3RhcnRWYWx1ZSA9IHR3ZWVuQ29udGFpbmVyLmVuZFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuQ29udGFpbmVyLmVuZFZhbHVlID0gb2xkU3RhcnRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC9eYmFja2dyb3VuZFBvc2l0aW9uLy50ZXN0KHByb3BlcnR5TmFtZSkgJiYgcGFyc2VGbG9hdCh0d2VlbkNvbnRhaW5lci5lbmRWYWx1ZSkgPT09IDEwMCAmJiB0d2VlbkNvbnRhaW5lci51bml0VHlwZSA9PT0gXCIlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0d2VlbkNvbnRhaW5lci5lbmRWYWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW5Db250YWluZXIuc3RhcnRWYWx1ZSA9IDEwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkoZWxlbWVudCwgXCJyZXZlcnNlXCIsIHtsb29wOiB0cnVlLCBkZWxheTogb3B0cy5kZWxheX0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgRGVxdWV1ZWluZ1xuICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAvKiBGaXJlIHRoZSBuZXh0IGNhbGwgaW4gdGhlIHF1ZXVlIHNvIGxvbmcgYXMgdGhpcyBjYWxsJ3MgcXVldWUgd2Fzbid0IHNldCB0byBmYWxzZSAodG8gdHJpZ2dlciBhIHBhcmFsbGVsIGFuaW1hdGlvbiksXG4gICAgICAgICAgICAgICAgIHdoaWNoIHdvdWxkIGhhdmUgYWxyZWFkeSBjYXVzZWQgdGhlIG5leHQgY2FsbCB0byBmaXJlLiBOb3RlOiBFdmVuIGlmIHRoZSBlbmQgb2YgdGhlIGFuaW1hdGlvbiBxdWV1ZSBoYXMgYmVlbiByZWFjaGVkLFxuICAgICAgICAgICAgICAgICAkLmRlcXVldWUoKSBtdXN0IHN0aWxsIGJlIGNhbGxlZCBpbiBvcmRlciB0byBjb21wbGV0ZWx5IGNsZWFyIGpRdWVyeSdzIGFuaW1hdGlvbiBxdWV1ZS4gKi9cbiAgICAgICAgICAgICAgICBpZiAob3B0cy5xdWV1ZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJC5kZXF1ZXVlKGVsZW1lbnQsIG9wdHMucXVldWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgIENhbGxzIEFycmF5IENsZWFudXBcbiAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIC8qIFNpbmNlIHRoaXMgY2FsbCBpcyBjb21wbGV0ZSwgc2V0IGl0IHRvIGZhbHNlIHNvIHRoYXQgdGhlIHJBRiB0aWNrIHNraXBzIGl0LiBUaGlzIGFycmF5IGlzIGxhdGVyIGNvbXBhY3RlZCB2aWEgY29tcGFjdFNwYXJzZUFycmF5KCkuXG4gICAgICAgICAgICAgKEZvciBwZXJmb3JtYW5jZSByZWFzb25zLCB0aGUgY2FsbCBpcyBzZXQgdG8gZmFsc2UgaW5zdGVhZCBvZiBiZWluZyBkZWxldGVkIGZyb20gdGhlIGFycmF5OiBodHRwOi8vd3d3Lmh0bWw1cm9ja3MuY29tL2VuL3R1dG9yaWFscy9zcGVlZC92OC8pICovXG4gICAgICAgICAgICBWZWxvY2l0eS5TdGF0ZS5jYWxsc1tjYWxsSW5kZXhdID0gZmFsc2U7XG5cbiAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCB0aGUgY2FsbHMgYXJyYXkgdG8gZGV0ZXJtaW5lIGlmIHRoaXMgd2FzIHRoZSBmaW5hbCBpbi1wcm9ncmVzcyBhbmltYXRpb24uXG4gICAgICAgICAgICAgSWYgc28sIHNldCBhIGZsYWcgdG8gZW5kIHRpY2tpbmcgYW5kIGNsZWFyIHRoZSBjYWxscyBhcnJheS4gKi9cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBjYWxsc0xlbmd0aCA9IFZlbG9jaXR5LlN0YXRlLmNhbGxzLmxlbmd0aDsgaiA8IGNhbGxzTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkuU3RhdGUuY2FsbHNbal0gIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbWFpbmluZ0NhbGxzRXhpc3QgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlbWFpbmluZ0NhbGxzRXhpc3QgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgLyogdGljaygpIHdpbGwgZGV0ZWN0IHRoaXMgZmxhZyB1cG9uIGl0cyBuZXh0IGl0ZXJhdGlvbiBhbmQgc3Vic2VxdWVudGx5IHR1cm4gaXRzZWxmIG9mZi4gKi9cbiAgICAgICAgICAgICAgICBWZWxvY2l0eS5TdGF0ZS5pc1RpY2tpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIC8qIENsZWFyIHRoZSBjYWxscyBhcnJheSBzbyB0aGF0IGl0cyBsZW5ndGggaXMgcmVzZXQuICovXG4gICAgICAgICAgICAgICAgZGVsZXRlIFZlbG9jaXR5LlN0YXRlLmNhbGxzO1xuICAgICAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLmNhbGxzID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKioqKioqKioqKioqKioqKioqXG4gICAgICAgICBGcmFtZXdvcmtzXG4gICAgICAgICAqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgLyogQm90aCBqUXVlcnkgYW5kIFplcHRvIGFsbG93IHRoZWlyICQuZm4gb2JqZWN0IHRvIGJlIGV4dGVuZGVkIHRvIGFsbG93IHdyYXBwZWQgZWxlbWVudHMgdG8gYmUgc3ViamVjdGVkIHRvIHBsdWdpbiBjYWxscy5cbiAgICAgICAgIElmIGVpdGhlciBmcmFtZXdvcmsgaXMgbG9hZGVkLCByZWdpc3RlciBhIFwidmVsb2NpdHlcIiBleHRlbnNpb24gcG9pbnRpbmcgdG8gVmVsb2NpdHkncyBjb3JlIGFuaW1hdGUoKSBtZXRob2QuICBWZWxvY2l0eVxuICAgICAgICAgYWxzbyByZWdpc3RlcnMgaXRzZWxmIG9udG8gYSBnbG9iYWwgY29udGFpbmVyICh3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5aZXB0byB8fCB3aW5kb3cpIHNvIHRoYXQgY2VydGFpbiBmZWF0dXJlcyBhcmVcbiAgICAgICAgIGFjY2Vzc2libGUgYmV5b25kIGp1c3QgYSBwZXItZWxlbWVudCBzY29wZS4gVGhpcyBtYXN0ZXIgb2JqZWN0IGNvbnRhaW5zIGFuIC5hbmltYXRlKCkgbWV0aG9kLCB3aGljaCBpcyBsYXRlciBhc3NpZ25lZCB0byAkLmZuXG4gICAgICAgICAoaWYgalF1ZXJ5IG9yIFplcHRvIGFyZSBwcmVzZW50KS4gQWNjb3JkaW5nbHksIFZlbG9jaXR5IGNhbiBib3RoIGFjdCBvbiB3cmFwcGVkIERPTSBlbGVtZW50cyBhbmQgc3RhbmQgYWxvbmUgZm9yIHRhcmdldGluZyByYXcgRE9NIGVsZW1lbnRzLiAqL1xuICAgICAgICBnbG9iYWwuVmVsb2NpdHkgPSBWZWxvY2l0eTtcblxuICAgICAgICBpZiAoZ2xvYmFsICE9PSB3aW5kb3cpIHtcbiAgICAgICAgICAgIC8qIEFzc2lnbiB0aGUgZWxlbWVudCBmdW5jdGlvbiB0byBWZWxvY2l0eSdzIGNvcmUgYW5pbWF0ZSgpIG1ldGhvZC4gKi9cbiAgICAgICAgICAgIGdsb2JhbC5mbi52ZWxvY2l0eSA9IGFuaW1hdGU7XG4gICAgICAgICAgICAvKiBBc3NpZ24gdGhlIG9iamVjdCBmdW5jdGlvbidzIGRlZmF1bHRzIHRvIFZlbG9jaXR5J3MgZ2xvYmFsIGRlZmF1bHRzIG9iamVjdC4gKi9cbiAgICAgICAgICAgIGdsb2JhbC5mbi52ZWxvY2l0eS5kZWZhdWx0cyA9IFZlbG9jaXR5LmRlZmF1bHRzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICBQYWNrYWdlZCBSZWRpcmVjdHNcbiAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIC8qIHNsaWRlVXAsIHNsaWRlRG93biAqL1xuICAgICAgICAkLmVhY2goW1wiRG93blwiLCBcIlVwXCJdLCBmdW5jdGlvbihpLCBkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIFZlbG9jaXR5LlJlZGlyZWN0c1tcInNsaWRlXCIgKyBkaXJlY3Rpb25dID0gZnVuY3Rpb24oZWxlbWVudCwgb3B0aW9ucywgZWxlbWVudHNJbmRleCwgZWxlbWVudHNTaXplLCBlbGVtZW50cywgcHJvbWlzZURhdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3B0cyA9ICQuZXh0ZW5kKHt9LCBvcHRpb25zKSxcbiAgICAgICAgICAgICAgICAgICAgYmVnaW4gPSBvcHRzLmJlZ2luLFxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZSA9IG9wdHMuY29tcGxldGUsXG4gICAgICAgICAgICAgICAgICAgIGlubGluZVZhbHVlcyA9IHt9LFxuICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFZhbHVlcyA9IHtoZWlnaHQ6IFwiXCIsIG1hcmdpblRvcDogXCJcIiwgbWFyZ2luQm90dG9tOiBcIlwiLCBwYWRkaW5nVG9wOiBcIlwiLCBwYWRkaW5nQm90dG9tOiBcIlwifTtcblxuICAgICAgICAgICAgICAgIGlmIChvcHRzLmRpc3BsYXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAvKiBTaG93IHRoZSBlbGVtZW50IGJlZm9yZSBzbGlkZURvd24gYmVnaW5zIGFuZCBoaWRlIHRoZSBlbGVtZW50IGFmdGVyIHNsaWRlVXAgY29tcGxldGVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBJbmxpbmUgZWxlbWVudHMgY2Fubm90IGhhdmUgZGltZW5zaW9ucyBhbmltYXRlZCwgc28gdGhleSdyZSByZXZlcnRlZCB0byBpbmxpbmUtYmxvY2suICovXG4gICAgICAgICAgICAgICAgICAgIG9wdHMuZGlzcGxheSA9IChkaXJlY3Rpb24gPT09IFwiRG93blwiID8gKFZlbG9jaXR5LkNTUy5WYWx1ZXMuZ2V0RGlzcGxheVR5cGUoZWxlbWVudCkgPT09IFwiaW5saW5lXCIgPyBcImlubGluZS1ibG9ja1wiIDogXCJibG9ja1wiKSA6IFwibm9uZVwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBvcHRzLmJlZ2luID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSB1c2VyIHBhc3NlZCBpbiBhIGJlZ2luIGNhbGxiYWNrLCBmaXJlIGl0IG5vdy4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnRzSW5kZXggPT09IDAgJiYgYmVnaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlZ2luLmNhbGwoZWxlbWVudHMsIGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIENhY2hlIHRoZSBlbGVtZW50cycgb3JpZ2luYWwgdmVydGljYWwgZGltZW5zaW9uYWwgcHJvcGVydHkgdmFsdWVzIHNvIHRoYXQgd2UgY2FuIGFuaW1hdGUgYmFjayB0byB0aGVtLiAqL1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBjb21wdXRlZFZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb21wdXRlZFZhbHVlcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlubGluZVZhbHVlc1twcm9wZXJ0eV0gPSBlbGVtZW50LnN0eWxlW3Byb3BlcnR5XTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogRm9yIHNsaWRlRG93biwgdXNlIGZvcmNlZmVlZGluZyB0byBhbmltYXRlIGFsbCB2ZXJ0aWNhbCBwcm9wZXJ0aWVzIGZyb20gMC4gRm9yIHNsaWRlVXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgdXNlIGZvcmNlZmVlZGluZyB0byBzdGFydCBmcm9tIGNvbXB1dGVkIHZhbHVlcyBhbmQgYW5pbWF0ZSBkb3duIHRvIDAuICovXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlWYWx1ZSA9IENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIHByb3BlcnR5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkVmFsdWVzW3Byb3BlcnR5XSA9IChkaXJlY3Rpb24gPT09IFwiRG93blwiKSA/IFtwcm9wZXJ0eVZhbHVlLCAwXSA6IFswLCBwcm9wZXJ0eVZhbHVlXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIEZvcmNlIHZlcnRpY2FsIG92ZXJmbG93IGNvbnRlbnQgdG8gY2xpcCBzbyB0aGF0IHNsaWRpbmcgd29ya3MgYXMgZXhwZWN0ZWQuICovXG4gICAgICAgICAgICAgICAgICAgIGlubGluZVZhbHVlcy5vdmVyZmxvdyA9IGVsZW1lbnQuc3R5bGUub3ZlcmZsb3c7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBvcHRzLmNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFJlc2V0IGVsZW1lbnQgdG8gaXRzIHByZS1zbGlkZSBpbmxpbmUgdmFsdWVzIG9uY2UgaXRzIHNsaWRlIGFuaW1hdGlvbiBpcyBjb21wbGV0ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gaW5saW5lVmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5saW5lVmFsdWVzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbcHJvcGVydHldID0gaW5saW5lVmFsdWVzW3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSB1c2VyIHBhc3NlZCBpbiBhIGNvbXBsZXRlIGNhbGxiYWNrLCBmaXJlIGl0IG5vdy4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnRzSW5kZXggPT09IGVsZW1lbnRzU2l6ZSAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wbGV0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlLmNhbGwoZWxlbWVudHMsIGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VEYXRhLnJlc29sdmVyKGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBWZWxvY2l0eShlbGVtZW50LCBjb21wdXRlZFZhbHVlcywgb3B0cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICAvKiBmYWRlSW4sIGZhZGVPdXQgKi9cbiAgICAgICAgJC5lYWNoKFtcIkluXCIsIFwiT3V0XCJdLCBmdW5jdGlvbihpLCBkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIFZlbG9jaXR5LlJlZGlyZWN0c1tcImZhZGVcIiArIGRpcmVjdGlvbl0gPSBmdW5jdGlvbihlbGVtZW50LCBvcHRpb25zLCBlbGVtZW50c0luZGV4LCBlbGVtZW50c1NpemUsIGVsZW1lbnRzLCBwcm9taXNlRGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciBvcHRzID0gJC5leHRlbmQoe30sIG9wdGlvbnMpLFxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZSA9IG9wdHMuY29tcGxldGUsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNNYXAgPSB7b3BhY2l0eTogKGRpcmVjdGlvbiA9PT0gXCJJblwiKSA/IDEgOiAwfTtcblxuICAgICAgICAgICAgICAgIC8qIFNpbmNlIHJlZGlyZWN0cyBhcmUgdHJpZ2dlcmVkIGluZGl2aWR1YWxseSBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSBhbmltYXRlZCBzZXQsIGF2b2lkIHJlcGVhdGVkbHkgdHJpZ2dlcmluZ1xuICAgICAgICAgICAgICAgICBjYWxsYmFja3MgYnkgZmlyaW5nIHRoZW0gb25seSB3aGVuIHRoZSBmaW5hbCBlbGVtZW50IGhhcyBiZWVuIHJlYWNoZWQuICovXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnRzSW5kZXggIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5iZWdpbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50c0luZGV4ICE9PSBlbGVtZW50c1NpemUgLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdHMuY29tcGxldGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdHMuY29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wbGV0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlLmNhbGwoZWxlbWVudHMsIGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VEYXRhLnJlc29sdmVyKGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiBJZiBhIGRpc3BsYXkgd2FzIHBhc3NlZCBpbiwgdXNlIGl0LiBPdGhlcndpc2UsIGRlZmF1bHQgdG8gXCJub25lXCIgZm9yIGZhZGVPdXQgb3IgdGhlIGVsZW1lbnQtc3BlY2lmaWMgZGVmYXVsdCBmb3IgZmFkZUluLiAqL1xuICAgICAgICAgICAgICAgIC8qIE5vdGU6IFdlIGFsbG93IHVzZXJzIHRvIHBhc3MgaW4gXCJudWxsXCIgdG8gc2tpcCBkaXNwbGF5IHNldHRpbmcgYWx0b2dldGhlci4gKi9cbiAgICAgICAgICAgICAgICBpZiAob3B0cy5kaXNwbGF5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5kaXNwbGF5ID0gKGRpcmVjdGlvbiA9PT0gXCJJblwiID8gXCJhdXRvXCIgOiBcIm5vbmVcIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgVmVsb2NpdHkodGhpcywgcHJvcGVydGllc01hcCwgb3B0cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gVmVsb2NpdHk7XG4gICAgfSgod2luZG93LmpRdWVyeSB8fCB3aW5kb3cuWmVwdG8gfHwgd2luZG93KSwgd2luZG93LCAod2luZG93ID8gd2luZG93LmRvY3VtZW50IDogdW5kZWZpbmVkKSk7XG59KSk7XG5cbi8qKioqKioqKioqKioqKioqKipcbiBLbm93biBJc3N1ZXNcbiAqKioqKioqKioqKioqKioqKiovXG5cbi8qIFRoZSBDU1Mgc3BlYyBtYW5kYXRlcyB0aGF0IHRoZSB0cmFuc2xhdGVYL1kvWiB0cmFuc2Zvcm1zIGFyZSAlLXJlbGF0aXZlIHRvIHRoZSBlbGVtZW50IGl0c2VsZiAtLSBub3QgaXRzIHBhcmVudC5cbiBWZWxvY2l0eSwgaG93ZXZlciwgZG9lc24ndCBtYWtlIHRoaXMgZGlzdGluY3Rpb24uIFRodXMsIGNvbnZlcnRpbmcgdG8gb3IgZnJvbSB0aGUgJSB1bml0IHdpdGggdGhlc2Ugc3VicHJvcGVydGllc1xuIHdpbGwgcHJvZHVjZSBhbiBpbmFjY3VyYXRlIGNvbnZlcnNpb24gdmFsdWUuIFRoZSBzYW1lIGlzc3VlIGV4aXN0cyB3aXRoIHRoZSBjeC9jeSBhdHRyaWJ1dGVzIG9mIFNWRyBjaXJjbGVzIGFuZCBlbGxpcHNlcy4gKi8iLCIvKipcbiAqINGB0YLRgNCw0L3QuNGG0LAgQWJvdXRcbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICAgIC8qKlxuICAgICAqINC80LXRgtC+0LQg0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Lgg0LTQu9GPINGB0YLRgNCw0L3QuNGG0YsgQWJvdXRcbiAgICAgKi9cbiAgICBpbml0KCl7XG4gICAgICAgIFxuICAgIH1cbn07IiwiLyoqXG4gKiDRgdGC0YDQsNC90LjRhtCwIEhvbWVcbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICAgIC8qKlxuICAgICAqINC80LXRgtC+0LQg0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Lgg0LTQu9GPINGB0YLRgNCw0L3QuNGG0YtcbiAgICAgKi9cbiAgICBpbml0KCl7ICAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INGB0LvQsNC00LXQudGAINC00LvRjyBob21lIHBhZ2VcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubWFpbl9zbGlkZXIoKTtcbiAgICAgICAgdGhpcy50cnlfRVM2KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqINC80LXRgtC+0LQg0LTQu9GPINC40L3QuNGG0LjQu9C40LfQsNGG0LjQuCDRgdC70LDQudC00LXRgNCwXG4gICAgICovXG4gICAgbWFpbl9zbGlkZXIgKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnTWFpbiBzbGlkZXIgZm9yIGhvbWUgcGFnZScsIHRoaXMpO1xuICAgIH0sXG5cbiAgICB0cnlfRVM2ICgpIHtcblxuICAgIH0sXG5cbiAgICBleGFtcGxlX3dwX2FqYXggKCkge1xuXG4gICAgfVxuXG59O1xuIiwiaW1wb3J0ICcuLi9saWJzL21hdGVyaWFsaXplL2dsb2JhbCc7XG5pbXBvcnQgJy4uL2xpYnMvbWF0ZXJpYWxpemUvdmVsb2NpdHknO1xuaW1wb3J0ICcuLi9saWJzL21hdGVyaWFsaXplL2pxdWVyeS5lYXNpbmcuMS4zJztcbmltcG9ydCAnLi4vbGlicy9tYXRlcmlhbGl6ZS9zY3JvbGxzcHknO1xuaW1wb3J0ICcuLi9saWJzL21hdGVyaWFsaXplL3RhYnMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgLyoqXG4gICAgICog0LzQtdGC0L7QtCDQtNC70Y8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Lgg0LzQvtC00LDQu9GM0L3QvtCz0L5cbiAgICAgKiDQvtC60L3QsCwg0LrQvtGC0L7RgNC+0LUg0LXRgdGC0Ywg0L3QsCDQvdC10YHQutC+0LvRjNC60LjRhSDRgdGC0YDQsNC90LjRhtCw0YVcbiAgICAgKi9cbiAgICBpbml0KCl7XG4gICAgICAgIHRoaXMuaGVhZGVyRnVuY3Rpb25zKCk7XG4gICAgfSxcblxuICAgIGhlYWRlckZ1bmN0aW9ucyAoKSB7XG4gICAgICAgICQoJy5zY3JvbGxzcHknKS5zY3JvbGxTcHkoe1xuICAgICAgICAgICAgc2Nyb2xsT2Zmc2V0OiAwXG4gICAgICAgIH0pO1xuICAgIH1cbn07Il19
