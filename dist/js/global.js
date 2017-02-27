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

},{"./modules/ABOUT":5,"./modules/HOME":6,"./modules/global":7}],2:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('../libs/materialize/global');

require('../libs/materialize/velocity');

require('../libs/materialize/scrollspy');

exports.default = {
    /**
     * метод для инициализации модального
     * окна, которое есть на нескольких страницах
     */
    init: function init() {
        this.headerFunctions();
    },
    headerFunctions: function headerFunctions() {
        $('.scrollspy').scrollSpy();
    }
};

},{"../libs/materialize/global":2,"../libs/materialize/scrollspy":3,"../libs/materialize/velocity":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvZ2xvYmFsLmpzIiwiYXNzZXRzL2pzL2xpYnMvbWF0ZXJpYWxpemUvZ2xvYmFsLmpzIiwiYXNzZXRzL2pzL2xpYnMvbWF0ZXJpYWxpemUvc2Nyb2xsc3B5LmpzIiwiYXNzZXRzL2pzL2xpYnMvbWF0ZXJpYWxpemUvdmVsb2NpdHkuanMiLCJhc3NldHMvanMvbW9kdWxlcy9BQk9VVC5qcyIsImFzc2V0cy9qcy9tb2R1bGVzL0hPTUUuanMiLCJhc3NldHMvanMvbW9kdWxlcy9nbG9iYWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUNBOzs7O0FBSUEsSUFBSSxPQUFPLElBQVg7QUFDQTs7OztBQUlBLFFBQVEsT0FBTyxJQUFQLENBQVksSUFBcEI7QUFDSSxTQUFLLFdBQUw7QUFDSSxlQUFPLGVBQUssSUFBTCxDQUFVLElBQVYsZ0JBQVA7QUFDQTtBQUNKLFNBQUssWUFBTDtBQUNBLFNBQUssY0FBTDtBQUNJLGVBQU8sZ0JBQU0sSUFBTixDQUFXLElBQVgsaUJBQVA7QUFDQTtBQUNKO0FBQ0ksZUFBTyxnQkFBTTtBQUNULG9CQUFRLEdBQVIsQ0FBWSxjQUFaO0FBQ0gsU0FGRDtBQVRSO0FBYUE7OztBQUdBLEVBQUUsUUFBRixFQUFZLEtBQVosQ0FBa0IsaUJBQU8sSUFBUCxFQUFsQixFQUFpQyxNQUFqQzs7Ozs7OztBQzVCQTtBQUNBLENBQUMsVUFBUyxNQUFULEVBQWdCO0FBQ2YsTUFBRyxPQUFPLE9BQVYsRUFBa0I7QUFDaEIsa0JBQWMsRUFBZDtBQUNELEdBRkQsTUFFTztBQUNMLFdBQU8sV0FBUCxHQUFxQixFQUFyQjtBQUNEO0FBQ0YsQ0FORCxFQU1HLE1BTkg7O0FBU0E7Ozs7Ozs7Ozs7QUFVQyxXQUFTLE1BQVQsRUFBaUI7QUFDaEIsTUFBSSxXQUFXLENBQWY7QUFBQSxNQUNFLFVBQVUsQ0FB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QVksUUFBWixDQUFxQixRQUFyQjtBQUNIO0FBQ0oscUJBUEQ7QUFRSDs7QUFFRDtBQUNBO0FBQ0Esb0JBQUksS0FBSyxPQUFMLEtBQWlCLFNBQXJCLEVBQWdDO0FBQzVCLHlCQUFLLE9BQUwsR0FBZ0IsY0FBYyxJQUFkLEdBQXFCLE1BQXJCLEdBQThCLE1BQTlDO0FBQ0g7O0FBRUQseUJBQVMsSUFBVCxFQUFlLGFBQWYsRUFBOEIsSUFBOUI7QUFDSCxhQTlCRDtBQStCSCxTQWhDRDs7QUFrQ0EsZUFBTyxRQUFQO0FBQ0gsS0FwcUlNLENBb3FJSixPQUFPLE1BQVAsSUFBaUIsT0FBTyxLQUF4QixJQUFpQyxNQXBxSTdCLEVBb3FJc0MsTUFwcUl0QyxFQW9xSStDLFNBQVMsT0FBTyxRQUFoQixHQUEyQixTQXBxSTFFLENBQVA7QUFxcUlILENBbnJJQSxDQUFEOztBQXFySUE7Ozs7QUFJQTs7Ozs7Ozs7OztBQy9sSkE7OztrQkFHZTtBQUNYOzs7QUFHQSxNQUpXLGtCQUlMLENBRUw7QUFOVSxDOzs7Ozs7OztBQ0hmOzs7a0JBR2U7QUFDWDs7O0FBR0EsTUFKVyxrQkFJTDtBQUNGOzs7QUFHQSxTQUFLLFdBQUw7QUFDQSxTQUFLLE9BQUw7QUFDSCxHQVZVOzs7QUFZWDs7O0FBR0EsYUFmVyx5QkFlSTtBQUNYLFlBQVEsR0FBUixDQUFZLDJCQUFaLEVBQXlDLElBQXpDO0FBQ0gsR0FqQlU7QUFtQlgsU0FuQlcscUJBbUJBLENBRVYsQ0FyQlU7QUF1QlgsaUJBdkJXLDZCQXVCUSxDQUVsQjtBQXpCVSxDOzs7Ozs7Ozs7QUNIZjs7QUFDQTs7QUFDQTs7a0JBRWU7QUFDWDs7OztBQUlBLFFBTFcsa0JBS0w7QUFDRixhQUFLLGVBQUw7QUFDSCxLQVBVO0FBU1gsbUJBVFcsNkJBU1E7QUFDZixVQUFFLFlBQUYsRUFBZ0IsU0FBaEI7QUFDSDtBQVhVLEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEdMT0JBTCBmcm9tIFwiLi9tb2R1bGVzL2dsb2JhbFwiO1xuaW1wb3J0IEhPTUUgZnJvbSBcIi4vbW9kdWxlcy9IT01FXCI7XG5pbXBvcnQgQUJPVVQgZnJvbSBcIi4vbW9kdWxlcy9BQk9VVFwiO1xuLyoqXG4gKiDQodC+0LfQtNCw0LXQvCDRhNGD0L3QutGG0LjRjiBpbml0LCDQutC+0YLQvtGA0LDRj1xuICog0LHRg9C00LXRgiDQstGL0LfRi9Cy0LDRgtGM0YHRjyDQsiDQu9GO0LHQvtC8INGB0LvRg9GH0LDQtVxuICovXG5sZXQgaW5pdCA9IG51bGw7XG4vKipcbiAqINCf0LXRgNC10LHQuNGA0LDQtdC8IHdpbmRvdy52YXJzLnBhZ2UsXG4gKiDRh9GC0L7QsdGLINCy0YvRj9GB0L3QuNGC0YwsINC60LDQutCw0Y8g0YMg0L3QsNGBINGB0YLRgNCw0L3QuNGG0LBcbiAqL1xuc3dpdGNoIChnbG9iYWwudmFycy5wYWdlKSB7XG4gICAgY2FzZSAnaG9tZV9wYWdlJzpcbiAgICAgICAgaW5pdCA9IEhPTUUuaW5pdC5iaW5kKEhPTUUpO1xuICAgICAgICBicmVhaztcbiAgICBjYXNlICdhYm91dF9wYWdlJzpcbiAgICBjYXNlICdjb250YWN0X3BhZ2UnOlxuICAgICAgICBpbml0ID0gQUJPVVQuaW5pdC5iaW5kKEFCT1VUKTtcbiAgICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgICAgaW5pdCA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZWZhdWx0IGluaXQnKTtcbiAgICAgICAgfTtcbn1cbi8qKlxuICog0JLQtdGI0LDQtdC8INC90LAgZG9jdW1lbnQub25yZWFkeSDQvdCw0YjRgyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRjiDRgdGC0YDQsNC90LjRhtGLXG4gKi9cbiQoZG9jdW1lbnQpLnJlYWR5KEdMT0JBTC5pbml0KCksIGluaXQoKSk7IiwiLy8gUmVxdWlyZWQgZm9yIE1ldGVvciBwYWNrYWdlLCB0aGUgdXNlIG9mIHdpbmRvdyBwcmV2ZW50cyBleHBvcnQgYnkgTWV0ZW9yXG4oZnVuY3Rpb24od2luZG93KXtcbiAgaWYod2luZG93LlBhY2thZ2Upe1xuICAgIE1hdGVyaWFsaXplID0ge307XG4gIH0gZWxzZSB7XG4gICAgd2luZG93Lk1hdGVyaWFsaXplID0ge307XG4gIH1cbn0pKHdpbmRvdyk7XG5cblxuLypcbiAqIHJhZi5qc1xuICogaHR0cHM6Ly9naXRodWIuY29tL25ncnltYW4vcmFmLmpzXG4gKlxuICogb3JpZ2luYWwgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHBvbHlmaWxsIGJ5IEVyaWsgTcO2bGxlclxuICogaW5zcGlyZWQgZnJvbSBwYXVsX2lyaXNoIGdpc3QgYW5kIHBvc3RcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgbmdyeW1hblxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICovXG4oZnVuY3Rpb24od2luZG93KSB7XG4gIHZhciBsYXN0VGltZSA9IDAsXG4gICAgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddLFxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUsXG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUsXG4gICAgaSA9IHZlbmRvcnMubGVuZ3RoO1xuXG4gIC8vIHRyeSB0byB1bi1wcmVmaXggZXhpc3RpbmcgcmFmXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAhcmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbaV0gKyAnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1tpXSArICdDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgfVxuXG4gIC8vIHBvbHlmaWxsIHdpdGggc2V0VGltZW91dCBmYWxsYmFja1xuICAvLyBoZWF2aWx5IGluc3BpcmVkIGZyb20gQGRhcml1cyBnaXN0IG1vZDogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vcGF1bGlyaXNoLzE1Nzk2NzEjY29tbWVudC04Mzc5NDVcbiAgaWYgKCFyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgIWNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgIHZhciBub3cgPSArRGF0ZS5ub3coKSxcbiAgICAgICAgbmV4dFRpbWUgPSBNYXRoLm1heChsYXN0VGltZSArIDE2LCBub3cpO1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGNhbGxiYWNrKGxhc3RUaW1lID0gbmV4dFRpbWUpO1xuICAgICAgfSwgbmV4dFRpbWUgLSBub3cpO1xuICAgIH07XG5cbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSA9IGNsZWFyVGltZW91dDtcbiAgfVxuXG4gIC8vIGV4cG9ydCB0byB3aW5kb3dcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gY2FuY2VsQW5pbWF0aW9uRnJhbWU7XG59KHdpbmRvdykpO1xuXG5cbi8vIFVuaXF1ZSBJRFxuTWF0ZXJpYWxpemUuZ3VpZCA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gczQoKSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDApXG4gICAgICAudG9TdHJpbmcoMTYpXG4gICAgICAuc3Vic3RyaW5nKDEpO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArXG4gICAgICAgICAgIHM0KCkgKyAnLScgKyBzNCgpICsgczQoKSArIHM0KCk7XG4gIH07XG59KSgpO1xuXG4vKipcbiAqIEVzY2FwZXMgaGFzaCBmcm9tIHNwZWNpYWwgY2hhcmFjdGVyc1xuICogQHBhcmFtIHtzdHJpbmd9IGhhc2ggIFN0cmluZyByZXR1cm5lZCBmcm9tIHRoaXMuaGFzaFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuTWF0ZXJpYWxpemUuZXNjYXBlSGFzaCA9IGZ1bmN0aW9uKGhhc2gpIHtcbiAgcmV0dXJuIGhhc2gucmVwbGFjZSggLyg6fFxcLnxcXFt8XFxdfCx8PSkvZywgXCJcXFxcJDFcIiApO1xufTtcblxuTWF0ZXJpYWxpemUuZWxlbWVudE9yUGFyZW50SXNGaXhlZCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICB2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuICAgIHZhciAkY2hlY2tFbGVtZW50cyA9ICRlbGVtZW50LmFkZCgkZWxlbWVudC5wYXJlbnRzKCkpO1xuICAgIHZhciBpc0ZpeGVkID0gZmFsc2U7XG4gICAgJGNoZWNrRWxlbWVudHMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICBpZiAoJCh0aGlzKS5jc3MoXCJwb3NpdGlvblwiKSA9PT0gXCJmaXhlZFwiKSB7XG4gICAgICAgICAgICBpc0ZpeGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBpc0ZpeGVkO1xufTtcblxuXG4vKipcbiAqIEdldCB0aW1lIGluIG1zXG4gKiBAbGljZW5zZSBodHRwczovL3Jhdy5naXRodWIuY29tL2phc2hrZW5hcy91bmRlcnNjb3JlL21hc3Rlci9MSUNFTlNFXG4gKiBAdHlwZSB7ZnVuY3Rpb259XG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbnZhciBnZXRUaW1lID0gKERhdGUubm93IHx8IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xufSk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAqIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuICogYXMgbXVjaCBhcyBpdCBjYW4sIHdpdGhvdXQgZXZlciBnb2luZyBtb3JlIHRoYW4gb25jZSBwZXIgYHdhaXRgIGR1cmF0aW9uO1xuICogYnV0IGlmIHlvdSdkIGxpa2UgdG8gZGlzYWJsZSB0aGUgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2UsIHBhc3NcbiAqIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuICogQGxpY2Vuc2UgaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9qYXNoa2VuYXMvdW5kZXJzY29yZS9tYXN0ZXIvTElDRU5TRVxuICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuY1xuICogQHBhcmFtIHtudW1iZXJ9IHdhaXRcbiAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0aW9uc1xuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5NYXRlcmlhbGl6ZS50aHJvdHRsZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgdmFyIHRpbWVvdXQgPSBudWxsO1xuICB2YXIgcHJldmlvdXMgPSAwO1xuICBvcHRpb25zIHx8IChvcHRpb25zID0ge30pO1xuICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgcHJldmlvdXMgPSBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlID8gMCA6IGdldFRpbWUoKTtcbiAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgfTtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbm93ID0gZ2V0VGltZSgpO1xuICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSkgcHJldmlvdXMgPSBub3c7XG4gICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xuICAgIGNvbnRleHQgPSB0aGlzO1xuICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgaWYgKHJlbWFpbmluZyA8PSAwKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9IGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn07XG5cblxuLy8gVmVsb2NpdHkgaGFzIGNvbmZsaWN0cyB3aGVuIGxvYWRlZCB3aXRoIGpRdWVyeSwgdGhpcyB3aWxsIGNoZWNrIGZvciBpdFxuLy8gRmlyc3QsIGNoZWNrIGlmIGluIG5vQ29uZmxpY3QgbW9kZVxudmFyIFZlbDtcbmlmIChqUXVlcnkpIHtcbiAgVmVsID0galF1ZXJ5LlZlbG9jaXR5O1xufSBlbHNlIGlmICgkKSB7XG4gIFZlbCA9ICQuVmVsb2NpdHk7XG59IGVsc2Uge1xuICBWZWwgPSBWZWxvY2l0eTtcbn1cbiIsIi8qKlxuICogRXh0ZW5kIGpxdWVyeSB3aXRoIGEgc2Nyb2xsc3B5IHBsdWdpbi5cbiAqIFRoaXMgd2F0Y2hlcyB0aGUgd2luZG93IHNjcm9sbCBhbmQgZmlyZXMgZXZlbnRzIHdoZW4gZWxlbWVudHMgYXJlIHNjcm9sbGVkIGludG8gdmlld3BvcnQuXG4gKlxuICogdGhyb3R0bGUoKSBhbmQgZ2V0VGltZSgpIHRha2VuIGZyb20gVW5kZXJzY29yZS5qc1xuICogaHR0cHM6Ly9naXRodWIuY29tL2phc2hrZW5hcy91bmRlcnNjb3JlXG4gKlxuICogQGF1dGhvciBDb3B5cmlnaHQgMjAxMyBKb2huIFNtYXJ0XG4gKiBAbGljZW5zZSBodHRwczovL3Jhdy5naXRodWIuY29tL3RoZXNtYXJ0L2pxdWVyeS1zY3JvbGxzcHkvbWFzdGVyL0xJQ0VOU0VcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3RoZXNtYXJ0XG4gKiBAdmVyc2lvbiAwLjEuMlxuICovXG4oZnVuY3Rpb24oJCkge1xuXG5cdHZhciBqV2luZG93ID0gJCh3aW5kb3cpO1xuXHR2YXIgZWxlbWVudHMgPSBbXTtcblx0dmFyIGVsZW1lbnRzSW5WaWV3ID0gW107XG5cdHZhciBpc1NweWluZyA9IGZhbHNlO1xuXHR2YXIgdGlja3MgPSAwO1xuXHR2YXIgdW5pcXVlX2lkID0gMTtcblx0dmFyIG9mZnNldCA9IHtcblx0XHR0b3AgOiAwLFxuXHRcdHJpZ2h0IDogMCxcblx0XHRib3R0b20gOiAwLFxuXHRcdGxlZnQgOiAwLFxuXHR9XG5cblx0LyoqXG5cdCAqIEZpbmQgZWxlbWVudHMgdGhhdCBhcmUgd2l0aGluIHRoZSBib3VuZGFyeVxuXHQgKiBAcGFyYW0ge251bWJlcn0gdG9wXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSByaWdodFxuXHQgKiBAcGFyYW0ge251bWJlcn0gYm90dG9tXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBsZWZ0XG5cdCAqIEByZXR1cm4ge2pRdWVyeX1cdFx0QSBjb2xsZWN0aW9uIG9mIGVsZW1lbnRzXG5cdCAqL1xuXHRmdW5jdGlvbiBmaW5kRWxlbWVudHModG9wLCByaWdodCwgYm90dG9tLCBsZWZ0KSB7XG5cdFx0dmFyIGhpdHMgPSAkKCk7XG5cdFx0JC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbihpLCBlbGVtZW50KSB7XG5cdFx0XHRpZiAoZWxlbWVudC5oZWlnaHQoKSA+IDApIHtcblx0XHRcdFx0dmFyIGVsVG9wID0gZWxlbWVudC5vZmZzZXQoKS50b3AsXG5cdFx0XHRcdFx0ZWxMZWZ0ID0gZWxlbWVudC5vZmZzZXQoKS5sZWZ0LFxuXHRcdFx0XHRcdGVsUmlnaHQgPSBlbExlZnQgKyBlbGVtZW50LndpZHRoKCksXG5cdFx0XHRcdFx0ZWxCb3R0b20gPSBlbFRvcCArIGVsZW1lbnQuaGVpZ2h0KCk7XG5cblx0XHRcdFx0dmFyIGlzSW50ZXJzZWN0ID0gIShlbExlZnQgPiByaWdodCB8fFxuXHRcdFx0XHRcdGVsUmlnaHQgPCBsZWZ0IHx8XG5cdFx0XHRcdFx0ZWxUb3AgPiBib3R0b20gfHxcblx0XHRcdFx0XHRlbEJvdHRvbSA8IHRvcCk7XG5cblx0XHRcdFx0aWYgKGlzSW50ZXJzZWN0KSB7XG5cdFx0XHRcdFx0aGl0cy5wdXNoKGVsZW1lbnQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gaGl0cztcblx0fVxuXG5cblx0LyoqXG5cdCAqIENhbGxlZCB3aGVuIHRoZSB1c2VyIHNjcm9sbHMgdGhlIHdpbmRvd1xuXHQgKi9cblx0ZnVuY3Rpb24gb25TY3JvbGwoc2Nyb2xsT2Zmc2V0KSB7XG5cdFx0Ly8gdW5pcXVlIHRpY2sgaWRcblx0XHQrK3RpY2tzO1xuXG5cdFx0Ly8gdmlld3BvcnQgcmVjdGFuZ2xlXG5cdFx0dmFyIHRvcCA9IGpXaW5kb3cuc2Nyb2xsVG9wKCksXG5cdFx0XHRsZWZ0ID0galdpbmRvdy5zY3JvbGxMZWZ0KCksXG5cdFx0XHRyaWdodCA9IGxlZnQgKyBqV2luZG93LndpZHRoKCksXG5cdFx0XHRib3R0b20gPSB0b3AgKyBqV2luZG93LmhlaWdodCgpO1xuXG5cdFx0Ly8gZGV0ZXJtaW5lIHdoaWNoIGVsZW1lbnRzIGFyZSBpbiB2aWV3XG5cdFx0dmFyIGludGVyc2VjdGlvbnMgPSBmaW5kRWxlbWVudHModG9wK29mZnNldC50b3AgKyBzY3JvbGxPZmZzZXQgfHwgMjAwLCByaWdodCtvZmZzZXQucmlnaHQsIGJvdHRvbStvZmZzZXQuYm90dG9tLCBsZWZ0K29mZnNldC5sZWZ0KTtcblx0XHQkLmVhY2goaW50ZXJzZWN0aW9ucywgZnVuY3Rpb24oaSwgZWxlbWVudCkge1xuXG5cdFx0XHR2YXIgbGFzdFRpY2sgPSBlbGVtZW50LmRhdGEoJ3Njcm9sbFNweTp0aWNrcycpO1xuXHRcdFx0aWYgKHR5cGVvZiBsYXN0VGljayAhPSAnbnVtYmVyJykge1xuXHRcdFx0XHQvLyBlbnRlcmVkIGludG8gdmlld1xuXHRcdFx0XHRlbGVtZW50LnRyaWdnZXJIYW5kbGVyKCdzY3JvbGxTcHk6ZW50ZXInKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gdXBkYXRlIHRpY2sgaWRcblx0XHRcdGVsZW1lbnQuZGF0YSgnc2Nyb2xsU3B5OnRpY2tzJywgdGlja3MpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gZGV0ZXJtaW5lIHdoaWNoIGVsZW1lbnRzIGFyZSBubyBsb25nZXIgaW4gdmlld1xuXHRcdCQuZWFjaChlbGVtZW50c0luVmlldywgZnVuY3Rpb24oaSwgZWxlbWVudCkge1xuXHRcdFx0dmFyIGxhc3RUaWNrID0gZWxlbWVudC5kYXRhKCdzY3JvbGxTcHk6dGlja3MnKTtcblx0XHRcdGlmICh0eXBlb2YgbGFzdFRpY2sgPT0gJ251bWJlcicgJiYgbGFzdFRpY2sgIT09IHRpY2tzKSB7XG5cdFx0XHRcdC8vIGV4aXRlZCBmcm9tIHZpZXdcblx0XHRcdFx0ZWxlbWVudC50cmlnZ2VySGFuZGxlcignc2Nyb2xsU3B5OmV4aXQnKTtcblx0XHRcdFx0ZWxlbWVudC5kYXRhKCdzY3JvbGxTcHk6dGlja3MnLCBudWxsKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vIHJlbWVtYmVyIGVsZW1lbnRzIGluIHZpZXcgZm9yIG5leHQgdGlja1xuXHRcdGVsZW1lbnRzSW5WaWV3ID0gaW50ZXJzZWN0aW9ucztcblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxsZWQgd2hlbiB3aW5kb3cgaXMgcmVzaXplZFxuXHQqL1xuXHRmdW5jdGlvbiBvbldpblNpemUoKSB7XG5cdFx0aldpbmRvdy50cmlnZ2VyKCdzY3JvbGxTcHk6d2luU2l6ZScpO1xuXHR9XG5cblxuXHQvKipcblx0ICogRW5hYmxlcyBTY3JvbGxTcHkgdXNpbmcgYSBzZWxlY3RvclxuXHQgKiBAcGFyYW0ge2pRdWVyeXxzdHJpbmd9IHNlbGVjdG9yICBUaGUgZWxlbWVudHMgY29sbGVjdGlvbiwgb3IgYSBzZWxlY3RvclxuXHQgKiBAcGFyYW0ge09iamVjdD19IG9wdGlvbnNcdE9wdGlvbmFsLlxuICAgICAgICB0aHJvdHRsZSA6IG51bWJlciAtPiBzY3JvbGxzcHkgdGhyb3R0bGluZy4gRGVmYXVsdDogMTAwIG1zXG4gICAgICAgIG9mZnNldFRvcCA6IG51bWJlciAtPiBvZmZzZXQgZnJvbSB0b3AuIERlZmF1bHQ6IDBcbiAgICAgICAgb2Zmc2V0UmlnaHQgOiBudW1iZXIgLT4gb2Zmc2V0IGZyb20gcmlnaHQuIERlZmF1bHQ6IDBcbiAgICAgICAgb2Zmc2V0Qm90dG9tIDogbnVtYmVyIC0+IG9mZnNldCBmcm9tIGJvdHRvbS4gRGVmYXVsdDogMFxuICAgICAgICBvZmZzZXRMZWZ0IDogbnVtYmVyIC0+IG9mZnNldCBmcm9tIGxlZnQuIERlZmF1bHQ6IDBcblx0ICogQHJldHVybnMge2pRdWVyeX1cblx0ICovXG5cdCQuc2Nyb2xsU3B5ID0gZnVuY3Rpb24oc2VsZWN0b3IsIG9wdGlvbnMpIHtcblx0ICB2YXIgZGVmYXVsdHMgPSB7XG5cdFx0XHR0aHJvdHRsZTogMTAwLFxuXHRcdFx0c2Nyb2xsT2Zmc2V0OiAyMDAgLy8gb2Zmc2V0IC0gMjAwIGFsbG93cyBlbGVtZW50cyBuZWFyIGJvdHRvbSBvZiBwYWdlIHRvIHNjcm9sbFxuICAgIH07XG4gICAgb3B0aW9ucyA9ICQuZXh0ZW5kKGRlZmF1bHRzLCBvcHRpb25zKTtcblxuXHRcdHZhciB2aXNpYmxlID0gW107XG5cdFx0c2VsZWN0b3IgPSAkKHNlbGVjdG9yKTtcblx0XHRzZWxlY3Rvci5lYWNoKGZ1bmN0aW9uKGksIGVsZW1lbnQpIHtcblx0XHRcdGVsZW1lbnRzLnB1c2goJChlbGVtZW50KSk7XG5cdFx0XHQkKGVsZW1lbnQpLmRhdGEoXCJzY3JvbGxTcHk6aWRcIiwgaSk7XG5cdFx0XHQvLyBTbW9vdGggc2Nyb2xsIHRvIHNlY3Rpb25cblx0XHQgICQoJ2FbaHJlZj1cIiMnICsgJChlbGVtZW50KS5hdHRyKCdpZCcpICsgJ1wiXScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHQgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCAgICB2YXIgb2Zmc2V0ID0gJChNYXRlcmlhbGl6ZS5lc2NhcGVIYXNoKHRoaXMuaGFzaCkpLm9mZnNldCgpLnRvcCArIDE7XG5cdCAgICBcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiBvZmZzZXQgLSBvcHRpb25zLnNjcm9sbE9mZnNldCB9LCB7ZHVyYXRpb246IDQwMCwgcXVldWU6IGZhbHNlLCBlYXNpbmc6ICdlYXNlT3V0Q3ViaWMnfSk7XG5cdFx0ICB9KTtcblx0XHR9KTtcblxuXHRcdG9mZnNldC50b3AgPSBvcHRpb25zLm9mZnNldFRvcCB8fCAwO1xuXHRcdG9mZnNldC5yaWdodCA9IG9wdGlvbnMub2Zmc2V0UmlnaHQgfHwgMDtcblx0XHRvZmZzZXQuYm90dG9tID0gb3B0aW9ucy5vZmZzZXRCb3R0b20gfHwgMDtcblx0XHRvZmZzZXQubGVmdCA9IG9wdGlvbnMub2Zmc2V0TGVmdCB8fCAwO1xuXG5cdFx0dmFyIHRocm90dGxlZFNjcm9sbCA9IE1hdGVyaWFsaXplLnRocm90dGxlKGZ1bmN0aW9uKCkge1xuXHRcdFx0b25TY3JvbGwob3B0aW9ucy5zY3JvbGxPZmZzZXQpO1xuXHRcdH0sIG9wdGlvbnMudGhyb3R0bGUgfHwgMTAwKTtcblx0XHR2YXIgcmVhZHlTY3JvbGwgPSBmdW5jdGlvbigpe1xuXHRcdFx0JChkb2N1bWVudCkucmVhZHkodGhyb3R0bGVkU2Nyb2xsKTtcblx0XHR9O1xuXG5cdFx0aWYgKCFpc1NweWluZykge1xuXHRcdFx0aldpbmRvdy5vbignc2Nyb2xsJywgcmVhZHlTY3JvbGwpO1xuXHRcdFx0aldpbmRvdy5vbigncmVzaXplJywgcmVhZHlTY3JvbGwpO1xuXHRcdFx0aXNTcHlpbmcgPSB0cnVlO1xuXHRcdH1cblxuXHRcdC8vIHBlcmZvcm0gYSBzY2FuIG9uY2UsIGFmdGVyIGN1cnJlbnQgZXhlY3V0aW9uIGNvbnRleHQsIGFuZCBhZnRlciBkb20gaXMgcmVhZHlcblx0XHRzZXRUaW1lb3V0KHJlYWR5U2Nyb2xsLCAwKTtcblxuXG5cdFx0c2VsZWN0b3Iub24oJ3Njcm9sbFNweTplbnRlcicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmlzaWJsZSA9ICQuZ3JlcCh2aXNpYmxlLCBmdW5jdGlvbih2YWx1ZSkge1xuXHQgICAgICByZXR1cm4gdmFsdWUuaGVpZ2h0KCkgIT0gMDtcblx0ICAgIH0pO1xuXG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXG5cdFx0XHRpZiAodmlzaWJsZVswXSkge1xuXHRcdFx0XHQkKCdhW2hyZWY9XCIjJyArIHZpc2libGVbMF0uYXR0cignaWQnKSArICdcIl0nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcdGlmICgkdGhpcy5kYXRhKCdzY3JvbGxTcHk6aWQnKSA8IHZpc2libGVbMF0uZGF0YSgnc2Nyb2xsU3B5OmlkJykpIHtcblx0XHRcdFx0XHR2aXNpYmxlLnVuc2hpZnQoJCh0aGlzKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dmlzaWJsZS5wdXNoKCQodGhpcykpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dmlzaWJsZS5wdXNoKCQodGhpcykpO1xuXHRcdFx0fVxuXG5cblx0XHRcdCQoJ2FbaHJlZj1cIiMnICsgdmlzaWJsZVswXS5hdHRyKCdpZCcpICsgJ1wiXScpLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHR9KTtcblx0XHRzZWxlY3Rvci5vbignc2Nyb2xsU3B5OmV4aXQnLCBmdW5jdGlvbigpIHtcblx0XHRcdHZpc2libGUgPSAkLmdyZXAodmlzaWJsZSwgZnVuY3Rpb24odmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIHZhbHVlLmhlaWdodCgpICE9IDA7XG5cdCAgICB9KTtcblxuXHRcdFx0aWYgKHZpc2libGVbMF0pIHtcblx0XHRcdFx0JCgnYVtocmVmPVwiIycgKyB2aXNpYmxlWzBdLmF0dHIoJ2lkJykgKyAnXCJdJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXHRcdFx0XHR2aXNpYmxlID0gJC5ncmVwKHZpc2libGUsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdCAgICAgICAgcmV0dXJuIHZhbHVlLmF0dHIoJ2lkJykgIT0gJHRoaXMuYXR0cignaWQnKTtcblx0ICAgICAgfSk7XG5cdCAgICAgIGlmICh2aXNpYmxlWzBdKSB7IC8vIENoZWNrIGlmIGVtcHR5XG5cdFx0XHRcdFx0JCgnYVtocmVmPVwiIycgKyB2aXNpYmxlWzBdLmF0dHIoJ2lkJykgKyAnXCJdJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHQgICAgICB9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gc2VsZWN0b3I7XG5cdH07XG5cblx0LyoqXG5cdCAqIExpc3RlbiBmb3Igd2luZG93IHJlc2l6ZSBldmVudHNcblx0ICogQHBhcmFtIHtPYmplY3Q9fSBvcHRpb25zXHRcdFx0XHRcdFx0T3B0aW9uYWwuIFNldCB7IHRocm90dGxlOiBudW1iZXIgfSB0byBjaGFuZ2UgdGhyb3R0bGluZy4gRGVmYXVsdDogMTAwIG1zXG5cdCAqIEByZXR1cm5zIHtqUXVlcnl9XHRcdCQod2luZG93KVxuXHQgKi9cblx0JC53aW5TaXplU3B5ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdCQud2luU2l6ZVNweSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4galdpbmRvdzsgfTsgLy8gbG9jayBmcm9tIG11bHRpcGxlIGNhbGxzXG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge1xuXHRcdFx0dGhyb3R0bGU6IDEwMFxuXHRcdH07XG5cdFx0cmV0dXJuIGpXaW5kb3cub24oJ3Jlc2l6ZScsIE1hdGVyaWFsaXplLnRocm90dGxlKG9uV2luU2l6ZSwgb3B0aW9ucy50aHJvdHRsZSB8fCAxMDApKTtcblx0fTtcblxuXHQvKipcblx0ICogRW5hYmxlcyBTY3JvbGxTcHkgb24gYSBjb2xsZWN0aW9uIG9mIGVsZW1lbnRzXG5cdCAqIGUuZy4gJCgnLnNjcm9sbFNweScpLnNjcm9sbFNweSgpXG5cdCAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0aW9uc1x0T3B0aW9uYWwuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGhyb3R0bGUgOiBudW1iZXIgLT4gc2Nyb2xsc3B5IHRocm90dGxpbmcuIERlZmF1bHQ6IDEwMCBtc1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9mZnNldFRvcCA6IG51bWJlciAtPiBvZmZzZXQgZnJvbSB0b3AuIERlZmF1bHQ6IDBcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvZmZzZXRSaWdodCA6IG51bWJlciAtPiBvZmZzZXQgZnJvbSByaWdodC4gRGVmYXVsdDogMFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9mZnNldEJvdHRvbSA6IG51bWJlciAtPiBvZmZzZXQgZnJvbSBib3R0b20uIERlZmF1bHQ6IDBcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvZmZzZXRMZWZ0IDogbnVtYmVyIC0+IG9mZnNldCBmcm9tIGxlZnQuIERlZmF1bHQ6IDBcblx0ICogQHJldHVybnMge2pRdWVyeX1cblx0ICovXG5cdCQuZm4uc2Nyb2xsU3B5ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdHJldHVybiAkLnNjcm9sbFNweSgkKHRoaXMpLCBvcHRpb25zKTtcblx0fTtcblxufSkoalF1ZXJ5KTtcbiIsIi8qISBWZWxvY2l0eUpTLm9yZyAoMS40LjIpLiAoQykgMjAxNCBKdWxpYW4gU2hhcGlyby4gTUlUIEBsaWNlbnNlOiBlbi53aWtpcGVkaWEub3JnL3dpa2kvTUlUX0xpY2Vuc2UgKi9cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKipcbiBWZWxvY2l0eSBqUXVlcnkgU2hpbVxuICoqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qISBWZWxvY2l0eUpTLm9yZyBqUXVlcnkgU2hpbSAoMS4wLjEpLiAoQykgMjAxNCBUaGUgalF1ZXJ5IEZvdW5kYXRpb24uIE1JVCBAbGljZW5zZTogZW4ud2lraXBlZGlhLm9yZy93aWtpL01JVF9MaWNlbnNlLiAqL1xuXG4vKiBUaGlzIGZpbGUgY29udGFpbnMgdGhlIGpRdWVyeSBmdW5jdGlvbnMgdGhhdCBWZWxvY2l0eSByZWxpZXMgb24sIHRoZXJlYnkgcmVtb3ZpbmcgVmVsb2NpdHkncyBkZXBlbmRlbmN5IG9uIGEgZnVsbCBjb3B5IG9mIGpRdWVyeSwgYW5kIGFsbG93aW5nIGl0IHRvIHdvcmsgaW4gYW55IGVudmlyb25tZW50LiAqL1xuLyogVGhlc2Ugc2hpbW1lZCBmdW5jdGlvbnMgYXJlIG9ubHkgdXNlZCBpZiBqUXVlcnkgaXNuJ3QgcHJlc2VudC4gSWYgYm90aCB0aGlzIHNoaW0gYW5kIGpRdWVyeSBhcmUgbG9hZGVkLCBWZWxvY2l0eSBkZWZhdWx0cyB0byBqUXVlcnkgcHJvcGVyLiAqL1xuLyogQnJvd3NlciBzdXBwb3J0OiBVc2luZyB0aGlzIHNoaW0gaW5zdGVhZCBvZiBqUXVlcnkgcHJvcGVyIHJlbW92ZXMgc3VwcG9ydCBmb3IgSUU4LiAqL1xuXG4oZnVuY3Rpb24od2luZG93KSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgLyoqKioqKioqKioqKioqKlxuICAgICBTZXR1cFxuICAgICAqKioqKioqKioqKioqKiovXG5cbiAgICAvKiBJZiBqUXVlcnkgaXMgYWxyZWFkeSBsb2FkZWQsIHRoZXJlJ3Mgbm8gcG9pbnQgaW4gbG9hZGluZyB0aGlzIHNoaW0uICovXG4gICAgaWYgKHdpbmRvdy5qUXVlcnkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qIGpRdWVyeSBiYXNlLiAqL1xuICAgIHZhciAkID0gZnVuY3Rpb24oc2VsZWN0b3IsIGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyAkLmZuLmluaXQoc2VsZWN0b3IsIGNvbnRleHQpO1xuICAgIH07XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKipcbiAgICAgUHJpdmF0ZSBNZXRob2RzXG4gICAgICoqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyogalF1ZXJ5ICovXG4gICAgJC5pc1dpbmRvdyA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAvKiBqc2hpbnQgZXFlcWVxOiBmYWxzZSAqL1xuICAgICAgICByZXR1cm4gb2JqICYmIG9iaiA9PT0gb2JqLndpbmRvdztcbiAgICB9O1xuXG4gICAgLyogalF1ZXJ5ICovXG4gICAgJC50eXBlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIGlmICghb2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqICsgXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBvYmogPT09IFwiZnVuY3Rpb25cIiA/XG4gICAgICAgIGNsYXNzMnR5cGVbdG9TdHJpbmcuY2FsbChvYmopXSB8fCBcIm9iamVjdFwiIDpcbiAgICAgICAgICAgIHR5cGVvZiBvYmo7XG4gICAgfTtcblxuICAgIC8qIGpRdWVyeSAqL1xuICAgICQuaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gJC50eXBlKG9iaikgPT09IFwiYXJyYXlcIjtcbiAgICAgICAgfTtcblxuICAgIC8qIGpRdWVyeSAqL1xuICAgIGZ1bmN0aW9uIGlzQXJyYXlsaWtlKG9iaikge1xuICAgICAgICB2YXIgbGVuZ3RoID0gb2JqLmxlbmd0aCxcbiAgICAgICAgICAgIHR5cGUgPSAkLnR5cGUob2JqKTtcblxuICAgICAgICBpZiAodHlwZSA9PT0gXCJmdW5jdGlvblwiIHx8ICQuaXNXaW5kb3cob2JqKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9iai5ub2RlVHlwZSA9PT0gMSAmJiBsZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHR5cGUgPT09IFwiYXJyYXlcIiB8fCBsZW5ndGggPT09IDAgfHwgdHlwZW9mIGxlbmd0aCA9PT0gXCJudW1iZXJcIiAmJiBsZW5ndGggPiAwICYmIChsZW5ndGggLSAxKSBpbiBvYmo7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKlxuICAgICAkIE1ldGhvZHNcbiAgICAgKioqKioqKioqKioqKioqL1xuXG4gICAgLyogalF1ZXJ5OiBTdXBwb3J0IHJlbW92ZWQgZm9yIElFPDkuICovXG4gICAgJC5pc1BsYWluT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIHZhciBrZXk7XG5cbiAgICAgICAgaWYgKCFvYmogfHwgJC50eXBlKG9iaikgIT09IFwib2JqZWN0XCIgfHwgb2JqLm5vZGVUeXBlIHx8ICQuaXNXaW5kb3cob2JqKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChvYmouY29uc3RydWN0b3IgJiZcbiAgICAgICAgICAgICAgICAhaGFzT3duLmNhbGwob2JqLCBcImNvbnN0cnVjdG9yXCIpICYmXG4gICAgICAgICAgICAgICAgIWhhc093bi5jYWxsKG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsIFwiaXNQcm90b3R5cGVPZlwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5ID09PSB1bmRlZmluZWQgfHwgaGFzT3duLmNhbGwob2JqLCBrZXkpO1xuICAgIH07XG5cbiAgICAvKiBqUXVlcnkgKi9cbiAgICAkLmVhY2ggPSBmdW5jdGlvbihvYmosIGNhbGxiYWNrLCBhcmdzKSB7XG4gICAgICAgIHZhciB2YWx1ZSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgbGVuZ3RoID0gb2JqLmxlbmd0aCxcbiAgICAgICAgICAgIGlzQXJyYXkgPSBpc0FycmF5bGlrZShvYmopO1xuXG4gICAgICAgIGlmIChhcmdzKSB7XG4gICAgICAgICAgICBpZiAoaXNBcnJheSkge1xuICAgICAgICAgICAgICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjYWxsYmFjay5hcHBseShvYmpbaV0sIGFyZ3MpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgaW4gb2JqKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNhbGxiYWNrLmFwcGx5KG9ialtpXSwgYXJncyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChpc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNhbGxiYWNrLmNhbGwob2JqW2ldLCBpLCBvYmpbaV0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgaW4gb2JqKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNhbGxiYWNrLmNhbGwob2JqW2ldLCBpLCBvYmpbaV0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9O1xuXG4gICAgLyogQ3VzdG9tICovXG4gICAgJC5kYXRhID0gZnVuY3Rpb24obm9kZSwga2V5LCB2YWx1ZSkge1xuICAgICAgICAvKiAkLmdldERhdGEoKSAqL1xuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdmFyIGdldElkID0gbm9kZVskLmV4cGFuZG9dLFxuICAgICAgICAgICAgICAgIHN0b3JlID0gZ2V0SWQgJiYgY2FjaGVbZ2V0SWRdO1xuXG4gICAgICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RvcmU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0b3JlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleSBpbiBzdG9yZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RvcmVba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiAkLnNldERhdGEoKSAqL1xuICAgICAgICB9IGVsc2UgaWYgKGtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXIgc2V0SWQgPSBub2RlWyQuZXhwYW5kb10gfHwgKG5vZGVbJC5leHBhbmRvXSA9ICsrJC51dWlkKTtcblxuICAgICAgICAgICAgY2FjaGVbc2V0SWRdID0gY2FjaGVbc2V0SWRdIHx8IHt9O1xuICAgICAgICAgICAgY2FjaGVbc2V0SWRdW2tleV0gPSB2YWx1ZTtcblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qIEN1c3RvbSAqL1xuICAgICQucmVtb3ZlRGF0YSA9IGZ1bmN0aW9uKG5vZGUsIGtleXMpIHtcbiAgICAgICAgdmFyIGlkID0gbm9kZVskLmV4cGFuZG9dLFxuICAgICAgICAgICAgc3RvcmUgPSBpZCAmJiBjYWNoZVtpZF07XG5cbiAgICAgICAgaWYgKHN0b3JlKSB7XG4gICAgICAgICAgICAvLyBDbGVhbnVwIHRoZSBlbnRpcmUgc3RvcmUgaWYgbm8ga2V5cyBhcmUgcHJvdmlkZWQuXG4gICAgICAgICAgICBpZiAoIWtleXMpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgY2FjaGVbaWRdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkLmVhY2goa2V5cywgZnVuY3Rpb24oXywga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzdG9yZVtrZXldO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qIGpRdWVyeSAqL1xuICAgICQuZXh0ZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzcmMsIGNvcHlJc0FycmF5LCBjb3B5LCBuYW1lLCBvcHRpb25zLCBjbG9uZSxcbiAgICAgICAgICAgIHRhcmdldCA9IGFyZ3VtZW50c1swXSB8fCB7fSxcbiAgICAgICAgICAgIGkgPSAxLFxuICAgICAgICAgICAgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCxcbiAgICAgICAgICAgIGRlZXAgPSBmYWxzZTtcblxuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICAgIGRlZXAgPSB0YXJnZXQ7XG5cbiAgICAgICAgICAgIHRhcmdldCA9IGFyZ3VtZW50c1tpXSB8fCB7fTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ICE9PSBcIm9iamVjdFwiICYmICQudHlwZSh0YXJnZXQpICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHRhcmdldCA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGkgPT09IGxlbmd0aCkge1xuICAgICAgICAgICAgdGFyZ2V0ID0gdGhpcztcbiAgICAgICAgICAgIGktLTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgob3B0aW9ucyA9IGFyZ3VtZW50c1tpXSkpIHtcbiAgICAgICAgICAgICAgICBmb3IgKG5hbWUgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNyYyA9IHRhcmdldFtuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgY29weSA9IG9wdGlvbnNbbmFtZV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldCA9PT0gY29weSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVlcCAmJiBjb3B5ICYmICgkLmlzUGxhaW5PYmplY3QoY29weSkgfHwgKGNvcHlJc0FycmF5ID0gJC5pc0FycmF5KGNvcHkpKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb3B5SXNBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvcHlJc0FycmF5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmUgPSBzcmMgJiYgJC5pc0FycmF5KHNyYykgPyBzcmMgOiBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZSA9IHNyYyAmJiAkLmlzUGxhaW5PYmplY3Qoc3JjKSA/IHNyYyA6IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0gPSAkLmV4dGVuZChkZWVwLCBjbG9uZSwgY29weSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb3B5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtuYW1lXSA9IGNvcHk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH07XG5cbiAgICAvKiBqUXVlcnkgMS40LjMgKi9cbiAgICAkLnF1ZXVlID0gZnVuY3Rpb24oZWxlbSwgdHlwZSwgZGF0YSkge1xuICAgICAgICBmdW5jdGlvbiAkbWFrZUFycmF5KGFyciwgcmVzdWx0cykge1xuICAgICAgICAgICAgdmFyIHJldCA9IHJlc3VsdHMgfHwgW107XG5cbiAgICAgICAgICAgIGlmIChhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNBcnJheWxpa2UoT2JqZWN0KGFycikpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qICQubWVyZ2UgKi9cbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsZW4gPSArc2Vjb25kLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpID0gZmlyc3QubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaiA8IGxlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0W2krK10gPSBzZWNvbmRbaisrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxlbiAhPT0gbGVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHNlY29uZFtqXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0W2krK10gPSBzZWNvbmRbaisrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0Lmxlbmd0aCA9IGk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmaXJzdDtcbiAgICAgICAgICAgICAgICAgICAgfSkocmV0LCB0eXBlb2YgYXJyID09PSBcInN0cmluZ1wiID8gW2Fycl0gOiBhcnIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIFtdLnB1c2guY2FsbChyZXQsIGFycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFlbGVtKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0eXBlID0gKHR5cGUgfHwgXCJmeFwiKSArIFwicXVldWVcIjtcblxuICAgICAgICB2YXIgcSA9ICQuZGF0YShlbGVtLCB0eXBlKTtcblxuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBxIHx8IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFxIHx8ICQuaXNBcnJheShkYXRhKSkge1xuICAgICAgICAgICAgcSA9ICQuZGF0YShlbGVtLCB0eXBlLCAkbWFrZUFycmF5KGRhdGEpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHEucHVzaChkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBxO1xuICAgIH07XG5cbiAgICAvKiBqUXVlcnkgMS40LjMgKi9cbiAgICAkLmRlcXVldWUgPSBmdW5jdGlvbihlbGVtcywgdHlwZSkge1xuICAgICAgICAvKiBDdXN0b206IEVtYmVkIGVsZW1lbnQgaXRlcmF0aW9uLiAqL1xuICAgICAgICAkLmVhY2goZWxlbXMubm9kZVR5cGUgPyBbZWxlbXNdIDogZWxlbXMsIGZ1bmN0aW9uKGksIGVsZW0pIHtcbiAgICAgICAgICAgIHR5cGUgPSB0eXBlIHx8IFwiZnhcIjtcblxuICAgICAgICAgICAgdmFyIHF1ZXVlID0gJC5xdWV1ZShlbGVtLCB0eXBlKSxcbiAgICAgICAgICAgICAgICBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG5cbiAgICAgICAgICAgIGlmIChmbiA9PT0gXCJpbnByb2dyZXNzXCIpIHtcbiAgICAgICAgICAgICAgICBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmbikge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBcImZ4XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcXVldWUudW5zaGlmdChcImlucHJvZ3Jlc3NcIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm4uY2FsbChlbGVtLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJC5kZXF1ZXVlKGVsZW0sIHR5cGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKlxuICAgICAkLmZuIE1ldGhvZHNcbiAgICAgKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyogalF1ZXJ5ICovXG4gICAgJC5mbiA9ICQucHJvdG90eXBlID0ge1xuICAgICAgICBpbml0OiBmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgICAgICAgICAgLyogSnVzdCByZXR1cm4gdGhlIGVsZW1lbnQgd3JhcHBlZCBpbnNpZGUgYW4gYXJyYXk7IGRvbid0IHByb2NlZWQgd2l0aCB0aGUgYWN0dWFsIGpRdWVyeSBub2RlIHdyYXBwaW5nIHByb2Nlc3MuICovXG4gICAgICAgICAgICBpZiAoc2VsZWN0b3Iubm9kZVR5cGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzWzBdID0gc2VsZWN0b3I7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGEgRE9NIG5vZGUuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBvZmZzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLyogalF1ZXJ5IGFsdGVyZWQgY29kZTogRHJvcHBlZCBkaXNjb25uZWN0ZWQgRE9NIG5vZGUgY2hlY2tpbmcuICovXG4gICAgICAgICAgICB2YXIgYm94ID0gdGhpc1swXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QgPyB0aGlzWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIDoge3RvcDogMCwgbGVmdDogMH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdG9wOiBib3gudG9wICsgKHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5zY3JvbGxUb3AgfHwgMCkgLSAoZG9jdW1lbnQuY2xpZW50VG9wIHx8IDApLFxuICAgICAgICAgICAgICAgIGxlZnQ6IGJveC5sZWZ0ICsgKHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2N1bWVudC5zY3JvbGxMZWZ0IHx8IDApIC0gKGRvY3VtZW50LmNsaWVudExlZnQgfHwgMClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIHBvc2l0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8qIGpRdWVyeSAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gb2Zmc2V0UGFyZW50Rm4oZWxlbSkge1xuICAgICAgICAgICAgICAgIHZhciBvZmZzZXRQYXJlbnQgPSBlbGVtLm9mZnNldFBhcmVudDtcblxuICAgICAgICAgICAgICAgIHdoaWxlIChvZmZzZXRQYXJlbnQgJiYgb2Zmc2V0UGFyZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09IFwiaHRtbFwiICYmIG9mZnNldFBhcmVudC5zdHlsZSAmJiBvZmZzZXRQYXJlbnQuc3R5bGUucG9zaXRpb24gPT09IFwic3RhdGljXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0UGFyZW50ID0gb2Zmc2V0UGFyZW50Lm9mZnNldFBhcmVudDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gb2Zmc2V0UGFyZW50IHx8IGRvY3VtZW50O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBaZXB0byAqL1xuICAgICAgICAgICAgdmFyIGVsZW0gPSB0aGlzWzBdLFxuICAgICAgICAgICAgICAgIG9mZnNldFBhcmVudCA9IG9mZnNldFBhcmVudEZuKGVsZW0pLFxuICAgICAgICAgICAgICAgIG9mZnNldCA9IHRoaXMub2Zmc2V0KCksXG4gICAgICAgICAgICAgICAgcGFyZW50T2Zmc2V0ID0gL14oPzpib2R5fGh0bWwpJC9pLnRlc3Qob2Zmc2V0UGFyZW50Lm5vZGVOYW1lKSA/IHt0b3A6IDAsIGxlZnQ6IDB9IDogJChvZmZzZXRQYXJlbnQpLm9mZnNldCgpO1xuXG4gICAgICAgICAgICBvZmZzZXQudG9wIC09IHBhcnNlRmxvYXQoZWxlbS5zdHlsZS5tYXJnaW5Ub3ApIHx8IDA7XG4gICAgICAgICAgICBvZmZzZXQubGVmdCAtPSBwYXJzZUZsb2F0KGVsZW0uc3R5bGUubWFyZ2luTGVmdCkgfHwgMDtcblxuICAgICAgICAgICAgaWYgKG9mZnNldFBhcmVudC5zdHlsZSkge1xuICAgICAgICAgICAgICAgIHBhcmVudE9mZnNldC50b3AgKz0gcGFyc2VGbG9hdChvZmZzZXRQYXJlbnQuc3R5bGUuYm9yZGVyVG9wV2lkdGgpIHx8IDA7XG4gICAgICAgICAgICAgICAgcGFyZW50T2Zmc2V0LmxlZnQgKz0gcGFyc2VGbG9hdChvZmZzZXRQYXJlbnQuc3R5bGUuYm9yZGVyTGVmdFdpZHRoKSB8fCAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRvcDogb2Zmc2V0LnRvcCAtIHBhcmVudE9mZnNldC50b3AsXG4gICAgICAgICAgICAgICAgbGVmdDogb2Zmc2V0LmxlZnQgLSBwYXJlbnRPZmZzZXQubGVmdFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuICAgICBQcml2YXRlIFZhcmlhYmxlc1xuICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyogRm9yICQuZGF0YSgpICovXG4gICAgdmFyIGNhY2hlID0ge307XG4gICAgJC5leHBhbmRvID0gXCJ2ZWxvY2l0eVwiICsgKG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgICAkLnV1aWQgPSAwO1xuXG4gICAgLyogRm9yICQucXVldWUoKSAqL1xuICAgIHZhciBjbGFzczJ0eXBlID0ge30sXG4gICAgICAgIGhhc093biA9IGNsYXNzMnR5cGUuaGFzT3duUHJvcGVydHksXG4gICAgICAgIHRvU3RyaW5nID0gY2xhc3MydHlwZS50b1N0cmluZztcblxuICAgIHZhciB0eXBlcyA9IFwiQm9vbGVhbiBOdW1iZXIgU3RyaW5nIEZ1bmN0aW9uIEFycmF5IERhdGUgUmVnRXhwIE9iamVjdCBFcnJvclwiLnNwbGl0KFwiIFwiKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHR5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNsYXNzMnR5cGVbXCJbb2JqZWN0IFwiICsgdHlwZXNbaV0gKyBcIl1cIl0gPSB0eXBlc1tpXS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIC8qIE1ha2VzICQobm9kZSkgcG9zc2libGUsIHdpdGhvdXQgaGF2aW5nIHRvIGNhbGwgaW5pdC4gKi9cbiAgICAkLmZuLmluaXQucHJvdG90eXBlID0gJC5mbjtcblxuICAgIC8qIEdsb2JhbGl6ZSBWZWxvY2l0eSBvbnRvIHRoZSB3aW5kb3csIGFuZCBhc3NpZ24gaXRzIFV0aWxpdGllcyBwcm9wZXJ0eS4gKi9cbiAgICB3aW5kb3cuVmVsb2NpdHkgPSB7VXRpbGl0aWVzOiAkfTtcbn0pKHdpbmRvdyk7XG5cbi8qKioqKioqKioqKioqKioqKipcbiBWZWxvY2l0eS5qc1xuICoqKioqKioqKioqKioqKioqKi9cblxuKGZ1bmN0aW9uKGZhY3RvcnkpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAvKiBDb21tb25KUyBtb2R1bGUuICovXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgICAgICAvKiBBTUQgbW9kdWxlLiAqL1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKGZhY3RvcnkpO1xuICAgICAgICAvKiBCcm93c2VyIGdsb2JhbHMuICovXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmFjdG9yeSgpO1xuICAgIH1cbn0oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGdsb2JhbCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgLyoqKioqKioqKioqKioqKlxuICAgICAgICAgU3VtbWFyeVxuICAgICAgICAgKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIC8qXG4gICAgICAgICAtIENTUzogQ1NTIHN0YWNrIHRoYXQgd29ya3MgaW5kZXBlbmRlbnRseSBmcm9tIHRoZSByZXN0IG9mIFZlbG9jaXR5LlxuICAgICAgICAgLSBhbmltYXRlKCk6IENvcmUgYW5pbWF0aW9uIG1ldGhvZCB0aGF0IGl0ZXJhdGVzIG92ZXIgdGhlIHRhcmdldGVkIGVsZW1lbnRzIGFuZCBxdWV1ZXMgdGhlIGluY29taW5nIGNhbGwgb250byBlYWNoIGVsZW1lbnQgaW5kaXZpZHVhbGx5LlxuICAgICAgICAgLSBQcmUtUXVldWVpbmc6IFByZXBhcmUgdGhlIGVsZW1lbnQgZm9yIGFuaW1hdGlvbiBieSBpbnN0YW50aWF0aW5nIGl0cyBkYXRhIGNhY2hlIGFuZCBwcm9jZXNzaW5nIHRoZSBjYWxsJ3Mgb3B0aW9ucy5cbiAgICAgICAgIC0gUXVldWVpbmc6IFRoZSBsb2dpYyB0aGF0IHJ1bnMgb25jZSB0aGUgY2FsbCBoYXMgcmVhY2hlZCBpdHMgcG9pbnQgb2YgZXhlY3V0aW9uIGluIHRoZSBlbGVtZW50J3MgJC5xdWV1ZSgpIHN0YWNrLlxuICAgICAgICAgTW9zdCBsb2dpYyBpcyBwbGFjZWQgaGVyZSB0byBhdm9pZCByaXNraW5nIGl0IGJlY29taW5nIHN0YWxlIChpZiB0aGUgZWxlbWVudCdzIHByb3BlcnRpZXMgaGF2ZSBjaGFuZ2VkKS5cbiAgICAgICAgIC0gUHVzaGluZzogQ29uc29saWRhdGlvbiBvZiB0aGUgdHdlZW4gZGF0YSBmb2xsb3dlZCBieSBpdHMgcHVzaCBvbnRvIHRoZSBnbG9iYWwgaW4tcHJvZ3Jlc3MgY2FsbHMgY29udGFpbmVyLlxuICAgICAgICAgLSB0aWNrKCk6IFRoZSBzaW5nbGUgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGxvb3AgcmVzcG9uc2libGUgZm9yIHR3ZWVuaW5nIGFsbCBpbi1wcm9ncmVzcyBjYWxscy5cbiAgICAgICAgIC0gY29tcGxldGVDYWxsKCk6IEhhbmRsZXMgdGhlIGNsZWFudXAgcHJvY2VzcyBmb3IgZWFjaCBWZWxvY2l0eSBjYWxsLlxuICAgICAgICAgKi9cblxuICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICBIZWxwZXIgRnVuY3Rpb25zXG4gICAgICAgICAqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgLyogSUUgZGV0ZWN0aW9uLiBHaXN0OiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9qdWxpYW5zaGFwaXJvLzkwOTg2MDkgKi9cbiAgICAgICAgdmFyIElFID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmRvY3VtZW50TW9kZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudE1vZGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSA3OyBpID4gNDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGRpdi5pbm5lckhUTUwgPSBcIjwhLS1baWYgSUUgXCIgKyBpICsgXCJdPjxzcGFuPjwvc3Bhbj48IVtlbmRpZl0tLT5cIjtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic3BhblwiKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdiA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9KSgpO1xuXG4gICAgICAgIC8qIHJBRiBzaGltLiBHaXN0OiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9qdWxpYW5zaGFwaXJvLzk0OTc1MTMgKi9cbiAgICAgICAgdmFyIHJBRlNoaW0gPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGltZUxhc3QgPSAwO1xuXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0aW1lQ3VycmVudCA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lRGVsdGE7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogRHluYW1pY2FsbHkgc2V0IGRlbGF5IG9uIGEgcGVyLXRpY2sgYmFzaXMgdG8gbWF0Y2ggNjBmcHMuICovXG4gICAgICAgICAgICAgICAgICAgIC8qIFRlY2huaXF1ZSBieSBFcmlrIE1vbGxlci4gTUlUIGxpY2Vuc2U6IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC8xNTc5NjcxICovXG4gICAgICAgICAgICAgICAgICAgIHRpbWVEZWx0YSA9IE1hdGgubWF4KDAsIDE2IC0gKHRpbWVDdXJyZW50IC0gdGltZUxhc3QpKTtcbiAgICAgICAgICAgICAgICAgICAgdGltZUxhc3QgPSB0aW1lQ3VycmVudCArIHRpbWVEZWx0YTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRpbWVDdXJyZW50ICsgdGltZURlbHRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgdGltZURlbHRhKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICB9KSgpO1xuXG4gICAgICAgIHZhciBwZXJmb3JtYW5jZSA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwZXJmID0gd2luZG93LnBlcmZvcm1hbmNlIHx8IHt9O1xuXG4gICAgICAgICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwZXJmLCBcIm5vd1wiKSkge1xuICAgICAgICAgICAgICAgIHZhciBub3dPZmZzZXQgPSBwZXJmLnRpbWluZyAmJiBwZXJmLnRpbWluZy5kb21Db21wbGV0ZSA/IHBlcmYudGltaW5nLmRvbUNvbXBsZXRlIDogKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcblxuICAgICAgICAgICAgICAgIHBlcmYubm93ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAobmV3IERhdGUoKSkuZ2V0VGltZSgpIC0gbm93T2Zmc2V0O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcGVyZjtcbiAgICAgICAgfSkoKTtcblxuICAgICAgICAvKiBBcnJheSBjb21wYWN0aW5nLiBDb3B5cmlnaHQgTG8tRGFzaC4gTUlUIExpY2Vuc2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9sb2Rhc2gvbG9kYXNoL2Jsb2IvbWFzdGVyL0xJQ0VOU0UudHh0ICovXG4gICAgICAgIGZ1bmN0aW9uIGNvbXBhY3RTcGFyc2VBcnJheShhcnJheSkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwLFxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIF9zbGljZSA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvLyBDYW4ndCBiZSB1c2VkIHdpdGggRE9NIGVsZW1lbnRzIGluIElFIDwgOVxuICAgICAgICAgICAgICAgIHNsaWNlLmNhbGwoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgLy8gRmFpbHMgaW4gSUUgPCA5XG4gICAgICAgICAgICAgICAgLy8gVGhpcyB3aWxsIHdvcmsgZm9yIGdlbnVpbmUgYXJyYXlzLCBhcnJheS1saWtlIG9iamVjdHMsXG4gICAgICAgICAgICAgICAgLy8gTmFtZWROb2RlTWFwIChhdHRyaWJ1dGVzLCBlbnRpdGllcywgbm90YXRpb25zKSxcbiAgICAgICAgICAgICAgICAvLyBOb2RlTGlzdCAoZS5nLiwgZ2V0RWxlbWVudHNCeVRhZ05hbWUpLCBIVE1MQ29sbGVjdGlvbiAoZS5nLiwgY2hpbGROb2RlcyksXG4gICAgICAgICAgICAgICAgLy8gYW5kIHdpbGwgbm90IGZhaWwgb24gb3RoZXIgRE9NIG9iamVjdHMgKGFzIGRvIERPTSBlbGVtZW50cyBpbiBJRSA8IDkpXG4gICAgICAgICAgICAgICAgc2xpY2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKC0taSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lW2ldID0gdGhpc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2xvbmVkO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2xpY2U7XG4gICAgICAgIH0pKCk7IC8vIFRPRE86IElFOCwgQ2FjaGUgb2YgQXJyYXkucHJvdG90eXBlLnNsaWNlIHRoYXQgd29ya3Mgb24gSUU4XG5cbiAgICAgICAgZnVuY3Rpb24gc2FuaXRpemVFbGVtZW50cyhlbGVtZW50cykge1xuICAgICAgICAgICAgLyogVW53cmFwIGpRdWVyeS9aZXB0byBvYmplY3RzLiAqL1xuICAgICAgICAgICAgaWYgKFR5cGUuaXNXcmFwcGVkKGVsZW1lbnRzKSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzID0gX3NsaWNlLmNhbGwoZWxlbWVudHMpO1xuICAgICAgICAgICAgICAgIC8qIFdyYXAgYSBzaW5nbGUgZWxlbWVudCBpbiBhbiBhcnJheSBzbyB0aGF0ICQuZWFjaCgpIGNhbiBpdGVyYXRlIHdpdGggdGhlIGVsZW1lbnQgaW5zdGVhZCBvZiBpdHMgbm9kZSdzIGNoaWxkcmVuLiAqL1xuICAgICAgICAgICAgfSBlbHNlIGlmIChUeXBlLmlzTm9kZShlbGVtZW50cykpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50cyA9IFtlbGVtZW50c107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50cztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBUeXBlID0ge1xuICAgICAgICAgICAgaXNOdW1iZXI6IGZ1bmN0aW9uKHZhcmlhYmxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh0eXBlb2YgdmFyaWFibGUgPT09IFwibnVtYmVyXCIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzU3RyaW5nOiBmdW5jdGlvbih2YXJpYWJsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAodHlwZW9mIHZhcmlhYmxlID09PSBcInN0cmluZ1wiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpc0FycmF5OiBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKHZhcmlhYmxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YXJpYWJsZSkgPT09IFwiW29iamVjdCBBcnJheV1cIjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpc0Z1bmN0aW9uOiBmdW5jdGlvbih2YXJpYWJsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFyaWFibGUpID09PSBcIltvYmplY3QgRnVuY3Rpb25dXCI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXNOb2RlOiBmdW5jdGlvbih2YXJpYWJsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YXJpYWJsZSAmJiB2YXJpYWJsZS5ub2RlVHlwZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiBEZXRlcm1pbmUgaWYgdmFyaWFibGUgaXMgYW4gYXJyYXktbGlrZSB3cmFwcGVkIGpRdWVyeSwgWmVwdG8gb3Igc2ltaWxhciBlbGVtZW50LCBvciBldmVuIGEgTm9kZUxpc3QgZXRjLiAqL1xuICAgICAgICAgICAgLyogTk9URTogSFRNTEZvcm1FbGVtZW50cyBhbHNvIGhhdmUgYSBsZW5ndGguICovXG4gICAgICAgICAgICBpc1dyYXBwZWQ6IGZ1bmN0aW9uKHZhcmlhYmxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhcmlhYmxlXG4gICAgICAgICAgICAgICAgICAgICYmIFR5cGUuaXNOdW1iZXIodmFyaWFibGUubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAmJiAhVHlwZS5pc1N0cmluZyh2YXJpYWJsZSlcbiAgICAgICAgICAgICAgICAgICAgJiYgIVR5cGUuaXNGdW5jdGlvbih2YXJpYWJsZSlcbiAgICAgICAgICAgICAgICAgICAgJiYgIVR5cGUuaXNOb2RlKHZhcmlhYmxlKVxuICAgICAgICAgICAgICAgICAgICAmJiAodmFyaWFibGUubGVuZ3RoID09PSAwIHx8IFR5cGUuaXNOb2RlKHZhcmlhYmxlWzBdKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXNTVkc6IGZ1bmN0aW9uKHZhcmlhYmxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5TVkdFbGVtZW50ICYmICh2YXJpYWJsZSBpbnN0YW5jZW9mIHdpbmRvdy5TVkdFbGVtZW50KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpc0VtcHR5T2JqZWN0OiBmdW5jdGlvbih2YXJpYWJsZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIG5hbWUgaW4gdmFyaWFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhcmlhYmxlLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKioqKioqKioqKioqKioqKipcbiAgICAgICAgIERlcGVuZGVuY2llc1xuICAgICAgICAgKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgdmFyICQsXG4gICAgICAgICAgICBpc0pRdWVyeSA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChnbG9iYWwuZm4gJiYgZ2xvYmFsLmZuLmpxdWVyeSkge1xuICAgICAgICAgICAgJCA9IGdsb2JhbDtcbiAgICAgICAgICAgIGlzSlF1ZXJ5ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQgPSB3aW5kb3cuVmVsb2NpdHkuVXRpbGl0aWVzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKElFIDw9IDggJiYgIWlzSlF1ZXJ5KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJWZWxvY2l0eTogSUU4IGFuZCBiZWxvdyByZXF1aXJlIGpRdWVyeSB0byBiZSBsb2FkZWQgYmVmb3JlIFZlbG9jaXR5LlwiKTtcbiAgICAgICAgfSBlbHNlIGlmIChJRSA8PSA3KSB7XG4gICAgICAgICAgICAvKiBSZXZlcnQgdG8galF1ZXJ5J3MgJC5hbmltYXRlKCksIGFuZCBsb3NlIFZlbG9jaXR5J3MgZXh0cmEgZmVhdHVyZXMuICovXG4gICAgICAgICAgICBqUXVlcnkuZm4udmVsb2NpdHkgPSBqUXVlcnkuZm4uYW5pbWF0ZTtcblxuICAgICAgICAgICAgLyogTm93IHRoYXQgJC5mbi52ZWxvY2l0eSBpcyBhbGlhc2VkLCBhYm9ydCB0aGlzIFZlbG9jaXR5IGRlY2xhcmF0aW9uLiAqL1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqKioqKioqKioqKioqKioqXG4gICAgICAgICBDb25zdGFudHNcbiAgICAgICAgICoqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIHZhciBEVVJBVElPTl9ERUZBVUxUID0gNDAwLFxuICAgICAgICAgICAgRUFTSU5HX0RFRkFVTFQgPSBcInN3aW5nXCI7XG5cbiAgICAgICAgLyoqKioqKioqKioqKipcbiAgICAgICAgIFN0YXRlXG4gICAgICAgICAqKioqKioqKioqKioqL1xuXG4gICAgICAgIHZhciBWZWxvY2l0eSA9IHtcbiAgICAgICAgICAgIC8qIENvbnRhaW5lciBmb3IgcGFnZS13aWRlIFZlbG9jaXR5IHN0YXRlIGRhdGEuICovXG4gICAgICAgICAgICBTdGF0ZToge1xuICAgICAgICAgICAgICAgIC8qIERldGVjdCBtb2JpbGUgZGV2aWNlcyB0byBkZXRlcm1pbmUgaWYgbW9iaWxlSEEgc2hvdWxkIGJlIHR1cm5lZCBvbi4gKi9cbiAgICAgICAgICAgICAgICBpc01vYmlsZTogL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLFxuICAgICAgICAgICAgICAgIC8qIFRoZSBtb2JpbGVIQSBvcHRpb24ncyBiZWhhdmlvciBjaGFuZ2VzIG9uIG9sZGVyIEFuZHJvaWQgZGV2aWNlcyAoR2luZ2VyYnJlYWQsIHZlcnNpb25zIDIuMy4zLTIuMy43KS4gKi9cbiAgICAgICAgICAgICAgICBpc0FuZHJvaWQ6IC9BbmRyb2lkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxcbiAgICAgICAgICAgICAgICBpc0dpbmdlcmJyZWFkOiAvQW5kcm9pZCAyXFwuM1xcLlszLTddL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxcbiAgICAgICAgICAgICAgICBpc0Nocm9tZTogd2luZG93LmNocm9tZSxcbiAgICAgICAgICAgICAgICBpc0ZpcmVmb3g6IC9GaXJlZm94L2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxcbiAgICAgICAgICAgICAgICAvKiBDcmVhdGUgYSBjYWNoZWQgZWxlbWVudCBmb3IgcmUtdXNlIHdoZW4gY2hlY2tpbmcgZm9yIENTUyBwcm9wZXJ0eSBwcmVmaXhlcy4gKi9cbiAgICAgICAgICAgICAgICBwcmVmaXhFbGVtZW50OiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLFxuICAgICAgICAgICAgICAgIC8qIENhY2hlIGV2ZXJ5IHByZWZpeCBtYXRjaCB0byBhdm9pZCByZXBlYXRpbmcgbG9va3Vwcy4gKi9cbiAgICAgICAgICAgICAgICBwcmVmaXhNYXRjaGVzOiB7fSxcbiAgICAgICAgICAgICAgICAvKiBDYWNoZSB0aGUgYW5jaG9yIHVzZWQgZm9yIGFuaW1hdGluZyB3aW5kb3cgc2Nyb2xsaW5nLiAqL1xuICAgICAgICAgICAgICAgIHNjcm9sbEFuY2hvcjogbnVsbCxcbiAgICAgICAgICAgICAgICAvKiBDYWNoZSB0aGUgYnJvd3Nlci1zcGVjaWZpYyBwcm9wZXJ0eSBuYW1lcyBhc3NvY2lhdGVkIHdpdGggdGhlIHNjcm9sbCBhbmNob3IuICovXG4gICAgICAgICAgICAgICAgc2Nyb2xsUHJvcGVydHlMZWZ0OiBudWxsLFxuICAgICAgICAgICAgICAgIHNjcm9sbFByb3BlcnR5VG9wOiBudWxsLFxuICAgICAgICAgICAgICAgIC8qIEtlZXAgdHJhY2sgb2Ygd2hldGhlciBvdXIgUkFGIHRpY2sgaXMgcnVubmluZy4gKi9cbiAgICAgICAgICAgICAgICBpc1RpY2tpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIC8qIENvbnRhaW5lciBmb3IgZXZlcnkgaW4tcHJvZ3Jlc3MgY2FsbCB0byBWZWxvY2l0eS4gKi9cbiAgICAgICAgICAgICAgICBjYWxsczogW10sXG4gICAgICAgICAgICAgICAgZGVsYXllZEVsZW1lbnRzOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qIFZlbG9jaXR5J3MgY3VzdG9tIENTUyBzdGFjay4gTWFkZSBnbG9iYWwgZm9yIHVuaXQgdGVzdGluZy4gKi9cbiAgICAgICAgICAgIENTUzogey8qIERlZmluZWQgYmVsb3cuICovfSxcbiAgICAgICAgICAgIC8qIEEgc2hpbSBvZiB0aGUgalF1ZXJ5IHV0aWxpdHkgZnVuY3Rpb25zIHVzZWQgYnkgVmVsb2NpdHkgLS0gcHJvdmlkZWQgYnkgVmVsb2NpdHkncyBvcHRpb25hbCBqUXVlcnkgc2hpbS4gKi9cbiAgICAgICAgICAgIFV0aWxpdGllczogJCxcbiAgICAgICAgICAgIC8qIENvbnRhaW5lciBmb3IgdGhlIHVzZXIncyBjdXN0b20gYW5pbWF0aW9uIHJlZGlyZWN0cyB0aGF0IGFyZSByZWZlcmVuY2VkIGJ5IG5hbWUgaW4gcGxhY2Ugb2YgdGhlIHByb3BlcnRpZXMgbWFwIGFyZ3VtZW50LiAqL1xuICAgICAgICAgICAgUmVkaXJlY3RzOiB7LyogTWFudWFsbHkgcmVnaXN0ZXJlZCBieSB0aGUgdXNlci4gKi99LFxuICAgICAgICAgICAgRWFzaW5nczogey8qIERlZmluZWQgYmVsb3cuICovfSxcbiAgICAgICAgICAgIC8qIEF0dGVtcHQgdG8gdXNlIEVTNiBQcm9taXNlcyBieSBkZWZhdWx0LiBVc2VycyBjYW4gb3ZlcnJpZGUgdGhpcyB3aXRoIGEgdGhpcmQtcGFydHkgcHJvbWlzZXMgbGlicmFyeS4gKi9cbiAgICAgICAgICAgIFByb21pc2U6IHdpbmRvdy5Qcm9taXNlLFxuICAgICAgICAgICAgLyogVmVsb2NpdHkgb3B0aW9uIGRlZmF1bHRzLCB3aGljaCBjYW4gYmUgb3ZlcnJpZGVuIGJ5IHRoZSB1c2VyLiAqL1xuICAgICAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgICAgICBxdWV1ZTogXCJcIixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogRFVSQVRJT05fREVGQVVMVCxcbiAgICAgICAgICAgICAgICBlYXNpbmc6IEVBU0lOR19ERUZBVUxULFxuICAgICAgICAgICAgICAgIGJlZ2luOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9ncmVzczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbG9vcDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZGVsYXk6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG1vYmlsZUhBOiB0cnVlLFxuICAgICAgICAgICAgICAgIC8qIEFkdmFuY2VkOiBTZXQgdG8gZmFsc2UgdG8gcHJldmVudCBwcm9wZXJ0eSB2YWx1ZXMgZnJvbSBiZWluZyBjYWNoZWQgYmV0d2VlbiBjb25zZWN1dGl2ZSBWZWxvY2l0eS1pbml0aWF0ZWQgY2hhaW4gY2FsbHMuICovXG4gICAgICAgICAgICAgICAgX2NhY2hlVmFsdWVzOiB0cnVlLFxuICAgICAgICAgICAgICAgIC8qIEFkdmFuY2VkOiBTZXQgdG8gZmFsc2UgaWYgdGhlIHByb21pc2Ugc2hvdWxkIGFsd2F5cyByZXNvbHZlIG9uIGVtcHR5IGVsZW1lbnQgbGlzdHMuICovXG4gICAgICAgICAgICAgICAgcHJvbWlzZVJlamVjdEVtcHR5OiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyogQSBkZXNpZ24gZ29hbCBvZiBWZWxvY2l0eSBpcyB0byBjYWNoZSBkYXRhIHdoZXJldmVyIHBvc3NpYmxlIGluIG9yZGVyIHRvIGF2b2lkIERPTSByZXF1ZXJ5aW5nLiBBY2NvcmRpbmdseSwgZWFjaCBlbGVtZW50IGhhcyBhIGRhdGEgY2FjaGUuICovXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgJC5kYXRhKGVsZW1lbnQsIFwidmVsb2NpdHlcIiwge1xuICAgICAgICAgICAgICAgICAgICAvKiBTdG9yZSB3aGV0aGVyIHRoaXMgaXMgYW4gU1ZHIGVsZW1lbnQsIHNpbmNlIGl0cyBwcm9wZXJ0aWVzIGFyZSByZXRyaWV2ZWQgYW5kIHVwZGF0ZWQgZGlmZmVyZW50bHkgdGhhbiBzdGFuZGFyZCBIVE1MIGVsZW1lbnRzLiAqL1xuICAgICAgICAgICAgICAgICAgICBpc1NWRzogVHlwZS5pc1NWRyhlbGVtZW50KSxcbiAgICAgICAgICAgICAgICAgICAgLyogS2VlcCB0cmFjayBvZiB3aGV0aGVyIHRoZSBlbGVtZW50IGlzIGN1cnJlbnRseSBiZWluZyBhbmltYXRlZCBieSBWZWxvY2l0eS5cbiAgICAgICAgICAgICAgICAgICAgIFRoaXMgaXMgdXNlZCB0byBlbnN1cmUgdGhhdCBwcm9wZXJ0eSB2YWx1ZXMgYXJlIG5vdCB0cmFuc2ZlcnJlZCBiZXR3ZWVuIG5vbi1jb25zZWN1dGl2ZSAoc3RhbGUpIGNhbGxzLiAqL1xuICAgICAgICAgICAgICAgICAgICBpc0FuaW1hdGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIC8qIEEgcmVmZXJlbmNlIHRvIHRoZSBlbGVtZW50J3MgbGl2ZSBjb21wdXRlZFN0eWxlIG9iamVjdC4gTGVhcm4gbW9yZSBoZXJlOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9kb2NzL1dlYi9BUEkvd2luZG93LmdldENvbXB1dGVkU3R5bGUgKi9cbiAgICAgICAgICAgICAgICAgICAgY29tcHV0ZWRTdHlsZTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgLyogVHdlZW4gZGF0YSBpcyBjYWNoZWQgZm9yIGVhY2ggYW5pbWF0aW9uIG9uIHRoZSBlbGVtZW50IHNvIHRoYXQgZGF0YSBjYW4gYmUgcGFzc2VkIGFjcm9zcyBjYWxscyAtLVxuICAgICAgICAgICAgICAgICAgICAgaW4gcGFydGljdWxhciwgZW5kIHZhbHVlcyBhcmUgdXNlZCBhcyBzdWJzZXF1ZW50IHN0YXJ0IHZhbHVlcyBpbiBjb25zZWN1dGl2ZSBWZWxvY2l0eSBjYWxscy4gKi9cbiAgICAgICAgICAgICAgICAgICAgdHdlZW5zQ29udGFpbmVyOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAvKiBUaGUgZnVsbCByb290IHByb3BlcnR5IHZhbHVlcyBvZiBlYWNoIENTUyBob29rIGJlaW5nIGFuaW1hdGVkIG9uIHRoaXMgZWxlbWVudCBhcmUgY2FjaGVkIHNvIHRoYXQ6XG4gICAgICAgICAgICAgICAgICAgICAxKSBDb25jdXJyZW50bHktYW5pbWF0aW5nIGhvb2tzIHNoYXJpbmcgdGhlIHNhbWUgcm9vdCBjYW4gaGF2ZSB0aGVpciByb290IHZhbHVlcycgbWVyZ2VkIGludG8gb25lIHdoaWxlIHR3ZWVuaW5nLlxuICAgICAgICAgICAgICAgICAgICAgMikgUG9zdC1ob29rLWluamVjdGlvbiByb290IHZhbHVlcyBjYW4gYmUgdHJhbnNmZXJyZWQgb3ZlciB0byBjb25zZWN1dGl2ZWx5IGNoYWluZWQgVmVsb2NpdHkgY2FsbHMgYXMgc3RhcnRpbmcgcm9vdCB2YWx1ZXMuICovXG4gICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGU6IHt9LFxuICAgICAgICAgICAgICAgICAgICAvKiBBIGNhY2hlIGZvciB0cmFuc2Zvcm0gdXBkYXRlcywgd2hpY2ggbXVzdCBiZSBtYW51YWxseSBmbHVzaGVkIHZpYSBDU1MuZmx1c2hUcmFuc2Zvcm1DYWNoZSgpLiAqL1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1DYWNoZToge31cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiBBIHBhcmFsbGVsIHRvIGpRdWVyeSdzICQuY3NzKCksIHVzZWQgZm9yIGdldHRpbmcvc2V0dGluZyBWZWxvY2l0eSdzIGhvb2tlZCBDU1MgcHJvcGVydGllcy4gKi9cbiAgICAgICAgICAgIGhvb2s6IG51bGwsIC8qIERlZmluZWQgYmVsb3cuICovXG4gICAgICAgICAgICAvKiBWZWxvY2l0eS13aWRlIGFuaW1hdGlvbiB0aW1lIHJlbWFwcGluZyBmb3IgdGVzdGluZyBwdXJwb3Nlcy4gKi9cbiAgICAgICAgICAgIG1vY2s6IGZhbHNlLFxuICAgICAgICAgICAgdmVyc2lvbjoge21ham9yOiAxLCBtaW5vcjogNCwgcGF0Y2g6IDJ9LFxuICAgICAgICAgICAgLyogU2V0IHRvIDEgb3IgMiAobW9zdCB2ZXJib3NlKSB0byBvdXRwdXQgZGVidWcgaW5mbyB0byBjb25zb2xlLiAqL1xuICAgICAgICAgICAgZGVidWc6IGZhbHNlLFxuICAgICAgICAgICAgLyogVXNlIHJBRiBoaWdoIHJlc29sdXRpb24gdGltZXN0YW1wIHdoZW4gYXZhaWxhYmxlICovXG4gICAgICAgICAgICB0aW1lc3RhbXA6IHRydWUsXG4gICAgICAgICAgICAvKiBQYXVzZSBhbGwgYW5pbWF0aW9ucyAqL1xuICAgICAgICAgICAgcGF1c2VBbGw6IGZ1bmN0aW9uKHF1ZXVlTmFtZSkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VGltZSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgICAgICAgICAkLmVhY2goVmVsb2NpdHkuU3RhdGUuY2FsbHMsIGZ1bmN0aW9uKGksIGFjdGl2ZUNhbGwpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQ2FsbCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB3ZSBoYXZlIGEgcXVldWVOYW1lIGFuZCB0aGlzIGNhbGwgaXMgbm90IG9uIHRoYXQgcXVldWUsIHNraXAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxdWV1ZU5hbWUgIT09IHVuZGVmaW5lZCAmJiAoKGFjdGl2ZUNhbGxbMl0ucXVldWUgIT09IHF1ZXVlTmFtZSkgfHwgKGFjdGl2ZUNhbGxbMl0ucXVldWUgPT09IGZhbHNlKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogU2V0IGNhbGwgdG8gcGF1c2VkICovXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVDYWxsWzVdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VtZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8qIFBhdXNlIHRpbWVycyBvbiBhbnkgY3VycmVudGx5IGRlbGF5ZWQgY2FsbHMgKi9cbiAgICAgICAgICAgICAgICAkLmVhY2goVmVsb2NpdHkuU3RhdGUuZGVsYXllZEVsZW1lbnRzLCBmdW5jdGlvbihrLCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBhdXNlRGVsYXlPbkVsZW1lbnQoZWxlbWVudCwgY3VycmVudFRpbWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qIFJlc3VtZSBhbGwgYW5pbWF0aW9ucyAqL1xuICAgICAgICAgICAgcmVzdW1lQWxsOiBmdW5jdGlvbihxdWV1ZU5hbWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFRpbWUgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuXG4gICAgICAgICAgICAgICAgJC5lYWNoKFZlbG9jaXR5LlN0YXRlLmNhbGxzLCBmdW5jdGlvbihpLCBhY3RpdmVDYWxsKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUNhbGwpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgd2UgaGF2ZSBhIHF1ZXVlTmFtZSBhbmQgdGhpcyBjYWxsIGlzIG5vdCBvbiB0aGF0IHF1ZXVlLCBza2lwICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocXVldWVOYW1lICE9PSB1bmRlZmluZWQgJiYgKChhY3RpdmVDYWxsWzJdLnF1ZXVlICE9PSBxdWV1ZU5hbWUpIHx8IChhY3RpdmVDYWxsWzJdLnF1ZXVlID09PSBmYWxzZSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNldCBjYWxsIHRvIHJlc3VtZWQgaWYgaXQgd2FzIHBhdXNlZCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUNhbGxbNV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVDYWxsWzVdLnJlc3VtZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvKiBSZXN1bWUgdGltZXJzIG9uIGFueSBjdXJyZW50bHkgZGVsYXllZCBjYWxscyAqL1xuICAgICAgICAgICAgICAgICQuZWFjaChWZWxvY2l0eS5TdGF0ZS5kZWxheWVkRWxlbWVudHMsIGZ1bmN0aW9uKGssIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzdW1lRGVsYXlPbkVsZW1lbnQoZWxlbWVudCwgY3VycmVudFRpbWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qIFJldHJpZXZlIHRoZSBhcHByb3ByaWF0ZSBzY3JvbGwgYW5jaG9yIGFuZCBwcm9wZXJ0eSBuYW1lIGZvciB0aGUgYnJvd3NlcjogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dpbmRvdy5zY3JvbGxZICovXG4gICAgICAgIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuc2Nyb2xsQW5jaG9yID0gd2luZG93O1xuICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuc2Nyb2xsUHJvcGVydHlMZWZ0ID0gXCJwYWdlWE9mZnNldFwiO1xuICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuc2Nyb2xsUHJvcGVydHlUb3AgPSBcInBhZ2VZT2Zmc2V0XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBWZWxvY2l0eS5TdGF0ZS5zY3JvbGxBbmNob3IgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgfHwgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlIHx8IGRvY3VtZW50LmJvZHk7XG4gICAgICAgICAgICBWZWxvY2l0eS5TdGF0ZS5zY3JvbGxQcm9wZXJ0eUxlZnQgPSBcInNjcm9sbExlZnRcIjtcbiAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLnNjcm9sbFByb3BlcnR5VG9wID0gXCJzY3JvbGxUb3BcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIFNob3J0aGFuZCBhbGlhcyBmb3IgalF1ZXJ5J3MgJC5kYXRhKCkgdXRpbGl0eS4gKi9cbiAgICAgICAgZnVuY3Rpb24gRGF0YShlbGVtZW50KSB7XG4gICAgICAgICAgICAvKiBIYXJkY29kZSBhIHJlZmVyZW5jZSB0byB0aGUgcGx1Z2luIG5hbWUuICovXG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSAkLmRhdGEoZWxlbWVudCwgXCJ2ZWxvY2l0eVwiKTtcblxuICAgICAgICAgICAgLyogalF1ZXJ5IDw9MS40LjIgcmV0dXJucyBudWxsIGluc3RlYWQgb2YgdW5kZWZpbmVkIHdoZW4gbm8gbWF0Y2ggaXMgZm91bmQuIFdlIG5vcm1hbGl6ZSB0aGlzIGJlaGF2aW9yLiAqL1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlID09PSBudWxsID8gdW5kZWZpbmVkIDogcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvKioqKioqKioqKioqKipcbiAgICAgICAgIERlbGF5IFRpbWVyXG4gICAgICAgICAqKioqKioqKioqKioqKi9cblxuICAgICAgICBmdW5jdGlvbiBwYXVzZURlbGF5T25FbGVtZW50KGVsZW1lbnQsIGN1cnJlbnRUaW1lKSB7XG4gICAgICAgICAgICAvKiBDaGVjayBmb3IgYW55IGRlbGF5IHRpbWVycywgYW5kIHBhdXNlIHRoZSBzZXQgdGltZW91dHMgKHdoaWxlIHByZXNlcnZpbmcgdGltZSBkYXRhKVxuICAgICAgICAgICAgIHRvIGJlIHJlc3VtZWQgd2hlbiB0aGUgXCJyZXN1bWVcIiBjb21tYW5kIGlzIGlzc3VlZCAqL1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBEYXRhKGVsZW1lbnQpO1xuICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5kZWxheVRpbWVyICYmICFkYXRhLmRlbGF5UGF1c2VkKSB7XG4gICAgICAgICAgICAgICAgZGF0YS5kZWxheVJlbWFpbmluZyA9IGRhdGEuZGVsYXkgLSBjdXJyZW50VGltZSArIGRhdGEuZGVsYXlCZWdpbjtcbiAgICAgICAgICAgICAgICBkYXRhLmRlbGF5UGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoZGF0YS5kZWxheVRpbWVyLnNldFRpbWVvdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVzdW1lRGVsYXlPbkVsZW1lbnQoZWxlbWVudCwgY3VycmVudFRpbWUpIHtcbiAgICAgICAgICAgIC8qIENoZWNrIGZvciBhbnkgcGF1c2VkIHRpbWVycyBhbmQgcmVzdW1lICovXG4gICAgICAgICAgICB2YXIgZGF0YSA9IERhdGEoZWxlbWVudCk7XG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmRlbGF5VGltZXIgJiYgZGF0YS5kZWxheVBhdXNlZCkge1xuICAgICAgICAgICAgICAgIC8qIElmIHRoZSBlbGVtZW50IHdhcyBtaWQtZGVsYXksIHJlIGluaXRpYXRlIHRoZSB0aW1lb3V0IHdpdGggdGhlIHJlbWFpbmluZyBkZWxheSAqL1xuICAgICAgICAgICAgICAgIGRhdGEuZGVsYXlQYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBkYXRhLmRlbGF5VGltZXIuc2V0VGltZW91dCA9IHNldFRpbWVvdXQoZGF0YS5kZWxheVRpbWVyLm5leHQsIGRhdGEuZGVsYXlSZW1haW5pbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuXG4gICAgICAgIC8qKioqKioqKioqKioqKlxuICAgICAgICAgRWFzaW5nXG4gICAgICAgICAqKioqKioqKioqKioqKi9cblxuICAgICAgICAvKiBTdGVwIGVhc2luZyBnZW5lcmF0b3IuICovXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlU3RlcChzdGVwcykge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChwICogc3RlcHMpICogKDEgLyBzdGVwcyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyogQmV6aWVyIGN1cnZlIGZ1bmN0aW9uIGdlbmVyYXRvci4gQ29weXJpZ2h0IEdhZXRhbiBSZW5hdWRlYXUuIE1JVCBMaWNlbnNlOiBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL01JVF9MaWNlbnNlICovXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlQmV6aWVyKG1YMSwgbVkxLCBtWDIsIG1ZMikge1xuICAgICAgICAgICAgdmFyIE5FV1RPTl9JVEVSQVRJT05TID0gNCxcbiAgICAgICAgICAgICAgICBORVdUT05fTUlOX1NMT1BFID0gMC4wMDEsXG4gICAgICAgICAgICAgICAgU1VCRElWSVNJT05fUFJFQ0lTSU9OID0gMC4wMDAwMDAxLFxuICAgICAgICAgICAgICAgIFNVQkRJVklTSU9OX01BWF9JVEVSQVRJT05TID0gMTAsXG4gICAgICAgICAgICAgICAga1NwbGluZVRhYmxlU2l6ZSA9IDExLFxuICAgICAgICAgICAgICAgIGtTYW1wbGVTdGVwU2l6ZSA9IDEuMCAvIChrU3BsaW5lVGFibGVTaXplIC0gMS4wKSxcbiAgICAgICAgICAgICAgICBmbG9hdDMyQXJyYXlTdXBwb3J0ZWQgPSBcIkZsb2F0MzJBcnJheVwiIGluIHdpbmRvdztcblxuICAgICAgICAgICAgLyogTXVzdCBjb250YWluIGZvdXIgYXJndW1lbnRzLiAqL1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIEFyZ3VtZW50cyBtdXN0IGJlIG51bWJlcnMuICovXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDQ7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzW2ldICE9PSBcIm51bWJlclwiIHx8IGlzTmFOKGFyZ3VtZW50c1tpXSkgfHwgIWlzRmluaXRlKGFyZ3VtZW50c1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogWCB2YWx1ZXMgbXVzdCBiZSBpbiB0aGUgWzAsIDFdIHJhbmdlLiAqL1xuICAgICAgICAgICAgbVgxID0gTWF0aC5taW4obVgxLCAxKTtcbiAgICAgICAgICAgIG1YMiA9IE1hdGgubWluKG1YMiwgMSk7XG4gICAgICAgICAgICBtWDEgPSBNYXRoLm1heChtWDEsIDApO1xuICAgICAgICAgICAgbVgyID0gTWF0aC5tYXgobVgyLCAwKTtcblxuICAgICAgICAgICAgdmFyIG1TYW1wbGVWYWx1ZXMgPSBmbG9hdDMyQXJyYXlTdXBwb3J0ZWQgPyBuZXcgRmxvYXQzMkFycmF5KGtTcGxpbmVUYWJsZVNpemUpIDogbmV3IEFycmF5KGtTcGxpbmVUYWJsZVNpemUpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBBKGFBMSwgYUEyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDEuMCAtIDMuMCAqIGFBMiArIDMuMCAqIGFBMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIEIoYUExLCBhQTIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMy4wICogYUEyIC0gNi4wICogYUExO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gQyhhQTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMy4wICogYUExO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBjYWxjQmV6aWVyKGFULCBhQTEsIGFBMikge1xuICAgICAgICAgICAgICAgIHJldHVybiAoKEEoYUExLCBhQTIpICogYVQgKyBCKGFBMSwgYUEyKSkgKiBhVCArIEMoYUExKSkgKiBhVDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0U2xvcGUoYVQsIGFBMSwgYUEyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDMuMCAqIEEoYUExLCBhQTIpICogYVQgKiBhVCArIDIuMCAqIEIoYUExLCBhQTIpICogYVQgKyBDKGFBMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIG5ld3RvblJhcGhzb25JdGVyYXRlKGFYLCBhR3Vlc3NUKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBORVdUT05fSVRFUkFUSU9OUzsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50U2xvcGUgPSBnZXRTbG9wZShhR3Vlc3NULCBtWDEsIG1YMik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRTbG9wZSA9PT0gMC4wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYUd1ZXNzVDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50WCA9IGNhbGNCZXppZXIoYUd1ZXNzVCwgbVgxLCBtWDIpIC0gYVg7XG4gICAgICAgICAgICAgICAgICAgIGFHdWVzc1QgLT0gY3VycmVudFggLyBjdXJyZW50U2xvcGU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFHdWVzc1Q7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGNTYW1wbGVWYWx1ZXMoKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrU3BsaW5lVGFibGVTaXplOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgbVNhbXBsZVZhbHVlc1tpXSA9IGNhbGNCZXppZXIoaSAqIGtTYW1wbGVTdGVwU2l6ZSwgbVgxLCBtWDIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gYmluYXJ5U3ViZGl2aWRlKGFYLCBhQSwgYUIpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFgsIGN1cnJlbnRULCBpID0gMDtcblxuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFQgPSBhQSArIChhQiAtIGFBKSAvIDIuMDtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFggPSBjYWxjQmV6aWVyKGN1cnJlbnRULCBtWDEsIG1YMikgLSBhWDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRYID4gMC4wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhQiA9IGN1cnJlbnRUO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYUEgPSBjdXJyZW50VDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKE1hdGguYWJzKGN1cnJlbnRYKSA+IFNVQkRJVklTSU9OX1BSRUNJU0lPTiAmJiArK2kgPCBTVUJESVZJU0lPTl9NQVhfSVRFUkFUSU9OUyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudFQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFRGb3JYKGFYKSB7XG4gICAgICAgICAgICAgICAgdmFyIGludGVydmFsU3RhcnQgPSAwLjAsXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTYW1wbGUgPSAxLFxuICAgICAgICAgICAgICAgICAgICBsYXN0U2FtcGxlID0ga1NwbGluZVRhYmxlU2l6ZSAtIDE7XG5cbiAgICAgICAgICAgICAgICBmb3IgKDsgY3VycmVudFNhbXBsZSAhPT0gbGFzdFNhbXBsZSAmJiBtU2FtcGxlVmFsdWVzW2N1cnJlbnRTYW1wbGVdIDw9IGFYOyArK2N1cnJlbnRTYW1wbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWxTdGFydCArPSBrU2FtcGxlU3RlcFNpemU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLS1jdXJyZW50U2FtcGxlO1xuXG4gICAgICAgICAgICAgICAgdmFyIGRpc3QgPSAoYVggLSBtU2FtcGxlVmFsdWVzW2N1cnJlbnRTYW1wbGVdKSAvIChtU2FtcGxlVmFsdWVzW2N1cnJlbnRTYW1wbGUgKyAxXSAtIG1TYW1wbGVWYWx1ZXNbY3VycmVudFNhbXBsZV0pLFxuICAgICAgICAgICAgICAgICAgICBndWVzc0ZvclQgPSBpbnRlcnZhbFN0YXJ0ICsgZGlzdCAqIGtTYW1wbGVTdGVwU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgaW5pdGlhbFNsb3BlID0gZ2V0U2xvcGUoZ3Vlc3NGb3JULCBtWDEsIG1YMik7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbFNsb3BlID49IE5FV1RPTl9NSU5fU0xPUEUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ld3RvblJhcGhzb25JdGVyYXRlKGFYLCBndWVzc0ZvclQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5pdGlhbFNsb3BlID09PSAwLjApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGd1ZXNzRm9yVDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmluYXJ5U3ViZGl2aWRlKGFYLCBpbnRlcnZhbFN0YXJ0LCBpbnRlcnZhbFN0YXJ0ICsga1NhbXBsZVN0ZXBTaXplKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBfcHJlY29tcHV0ZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gcHJlY29tcHV0ZSgpIHtcbiAgICAgICAgICAgICAgICBfcHJlY29tcHV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChtWDEgIT09IG1ZMSB8fCBtWDIgIT09IG1ZMikge1xuICAgICAgICAgICAgICAgICAgICBjYWxjU2FtcGxlVmFsdWVzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZiA9IGZ1bmN0aW9uKGFYKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfcHJlY29tcHV0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJlY29tcHV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobVgxID09PSBtWTEgJiYgbVgyID09PSBtWTIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFYO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYVggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhWCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsY0JlemllcihnZXRURm9yWChhWCksIG1ZMSwgbVkyKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGYuZ2V0Q29udHJvbFBvaW50cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbe3g6IG1YMSwgeTogbVkxfSwge3g6IG1YMiwgeTogbVkyfV07XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgc3RyID0gXCJnZW5lcmF0ZUJlemllcihcIiArIFttWDEsIG1ZMSwgbVgyLCBtWTJdICsgXCIpXCI7XG4gICAgICAgICAgICBmLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBmO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogUnVuZ2UtS3V0dGEgc3ByaW5nIHBoeXNpY3MgZnVuY3Rpb24gZ2VuZXJhdG9yLiBBZGFwdGVkIGZyb20gRnJhbWVyLmpzLCBjb3B5cmlnaHQgS29lbiBCb2suIE1JVCBMaWNlbnNlOiBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL01JVF9MaWNlbnNlICovXG4gICAgICAgIC8qIEdpdmVuIGEgdGVuc2lvbiwgZnJpY3Rpb24sIGFuZCBkdXJhdGlvbiwgYSBzaW11bGF0aW9uIGF0IDYwRlBTIHdpbGwgZmlyc3QgcnVuIHdpdGhvdXQgYSBkZWZpbmVkIGR1cmF0aW9uIGluIG9yZGVyIHRvIGNhbGN1bGF0ZSB0aGUgZnVsbCBwYXRoLiBBIHNlY29uZCBwYXNzXG4gICAgICAgICB0aGVuIGFkanVzdHMgdGhlIHRpbWUgZGVsdGEgLS0gdXNpbmcgdGhlIHJlbGF0aW9uIGJldHdlZW4gYWN0dWFsIHRpbWUgYW5kIGR1cmF0aW9uIC0tIHRvIGNhbGN1bGF0ZSB0aGUgcGF0aCBmb3IgdGhlIGR1cmF0aW9uLWNvbnN0cmFpbmVkIGFuaW1hdGlvbi4gKi9cbiAgICAgICAgdmFyIGdlbmVyYXRlU3ByaW5nUks0ID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gc3ByaW5nQWNjZWxlcmF0aW9uRm9yU3RhdGUoc3RhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKC1zdGF0ZS50ZW5zaW9uICogc3RhdGUueCkgLSAoc3RhdGUuZnJpY3Rpb24gKiBzdGF0ZS52KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gc3ByaW5nRXZhbHVhdGVTdGF0ZVdpdGhEZXJpdmF0aXZlKGluaXRpYWxTdGF0ZSwgZHQsIGRlcml2YXRpdmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHg6IGluaXRpYWxTdGF0ZS54ICsgZGVyaXZhdGl2ZS5keCAqIGR0LFxuICAgICAgICAgICAgICAgICAgICB2OiBpbml0aWFsU3RhdGUudiArIGRlcml2YXRpdmUuZHYgKiBkdCxcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbjogaW5pdGlhbFN0YXRlLnRlbnNpb24sXG4gICAgICAgICAgICAgICAgICAgIGZyaWN0aW9uOiBpbml0aWFsU3RhdGUuZnJpY3Rpb25cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtkeDogc3RhdGUudiwgZHY6IHNwcmluZ0FjY2VsZXJhdGlvbkZvclN0YXRlKHN0YXRlKX07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHNwcmluZ0ludGVncmF0ZVN0YXRlKHN0YXRlLCBkdCkge1xuICAgICAgICAgICAgICAgIHZhciBhID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZHg6IHN0YXRlLnYsXG4gICAgICAgICAgICAgICAgICAgICAgICBkdjogc3ByaW5nQWNjZWxlcmF0aW9uRm9yU3RhdGUoc3RhdGUpXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGIgPSBzcHJpbmdFdmFsdWF0ZVN0YXRlV2l0aERlcml2YXRpdmUoc3RhdGUsIGR0ICogMC41LCBhKSxcbiAgICAgICAgICAgICAgICAgICAgYyA9IHNwcmluZ0V2YWx1YXRlU3RhdGVXaXRoRGVyaXZhdGl2ZShzdGF0ZSwgZHQgKiAwLjUsIGIpLFxuICAgICAgICAgICAgICAgICAgICBkID0gc3ByaW5nRXZhbHVhdGVTdGF0ZVdpdGhEZXJpdmF0aXZlKHN0YXRlLCBkdCwgYyksXG4gICAgICAgICAgICAgICAgICAgIGR4ZHQgPSAxLjAgLyA2LjAgKiAoYS5keCArIDIuMCAqIChiLmR4ICsgYy5keCkgKyBkLmR4KSxcbiAgICAgICAgICAgICAgICAgICAgZHZkdCA9IDEuMCAvIDYuMCAqIChhLmR2ICsgMi4wICogKGIuZHYgKyBjLmR2KSArIGQuZHYpO1xuXG4gICAgICAgICAgICAgICAgc3RhdGUueCA9IHN0YXRlLnggKyBkeGR0ICogZHQ7XG4gICAgICAgICAgICAgICAgc3RhdGUudiA9IHN0YXRlLnYgKyBkdmR0ICogZHQ7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBzcHJpbmdSSzRGYWN0b3J5KHRlbnNpb24sIGZyaWN0aW9uLCBkdXJhdGlvbikge1xuXG4gICAgICAgICAgICAgICAgdmFyIGluaXRTdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgdjogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnNpb246IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBmcmljdGlvbjogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBwYXRoID0gWzBdLFxuICAgICAgICAgICAgICAgICAgICB0aW1lX2xhcHNlZCA9IDAsXG4gICAgICAgICAgICAgICAgICAgIHRvbGVyYW5jZSA9IDEgLyAxMDAwMCxcbiAgICAgICAgICAgICAgICAgICAgRFQgPSAxNiAvIDEwMDAsXG4gICAgICAgICAgICAgICAgICAgIGhhdmVfZHVyYXRpb24sIGR0LCBsYXN0X3N0YXRlO1xuXG4gICAgICAgICAgICAgICAgdGVuc2lvbiA9IHBhcnNlRmxvYXQodGVuc2lvbikgfHwgNTAwO1xuICAgICAgICAgICAgICAgIGZyaWN0aW9uID0gcGFyc2VGbG9hdChmcmljdGlvbikgfHwgMjA7XG4gICAgICAgICAgICAgICAgZHVyYXRpb24gPSBkdXJhdGlvbiB8fCBudWxsO1xuXG4gICAgICAgICAgICAgICAgaW5pdFN0YXRlLnRlbnNpb24gPSB0ZW5zaW9uO1xuICAgICAgICAgICAgICAgIGluaXRTdGF0ZS5mcmljdGlvbiA9IGZyaWN0aW9uO1xuXG4gICAgICAgICAgICAgICAgaGF2ZV9kdXJhdGlvbiA9IGR1cmF0aW9uICE9PSBudWxsO1xuXG4gICAgICAgICAgICAgICAgLyogQ2FsY3VsYXRlIHRoZSBhY3R1YWwgdGltZSBpdCB0YWtlcyBmb3IgdGhpcyBhbmltYXRpb24gdG8gY29tcGxldGUgd2l0aCB0aGUgcHJvdmlkZWQgY29uZGl0aW9ucy4gKi9cbiAgICAgICAgICAgICAgICBpZiAoaGF2ZV9kdXJhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAvKiBSdW4gdGhlIHNpbXVsYXRpb24gd2l0aG91dCBhIGR1cmF0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICB0aW1lX2xhcHNlZCA9IHNwcmluZ1JLNEZhY3RvcnkodGVuc2lvbiwgZnJpY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAvKiBDb21wdXRlIHRoZSBhZGp1c3RlZCB0aW1lIGRlbHRhLiAqL1xuICAgICAgICAgICAgICAgICAgICBkdCA9IHRpbWVfbGFwc2VkIC8gZHVyYXRpb24gKiBEVDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkdCA9IERUO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIE5leHQvc3RlcCBmdW5jdGlvbiAuKi9cbiAgICAgICAgICAgICAgICAgICAgbGFzdF9zdGF0ZSA9IHNwcmluZ0ludGVncmF0ZVN0YXRlKGxhc3Rfc3RhdGUgfHwgaW5pdFN0YXRlLCBkdCk7XG4gICAgICAgICAgICAgICAgICAgIC8qIFN0b3JlIHRoZSBwb3NpdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgcGF0aC5wdXNoKDEgKyBsYXN0X3N0YXRlLngpO1xuICAgICAgICAgICAgICAgICAgICB0aW1lX2xhcHNlZCArPSAxNjtcbiAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGNoYW5nZSB0aHJlc2hvbGQgaXMgcmVhY2hlZCwgYnJlYWsuICovXG4gICAgICAgICAgICAgICAgICAgIGlmICghKE1hdGguYWJzKGxhc3Rfc3RhdGUueCkgPiB0b2xlcmFuY2UgJiYgTWF0aC5hYnMobGFzdF9zdGF0ZS52KSA+IHRvbGVyYW5jZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyogSWYgZHVyYXRpb24gaXMgbm90IGRlZmluZWQsIHJldHVybiB0aGUgYWN0dWFsIHRpbWUgcmVxdWlyZWQgZm9yIGNvbXBsZXRpbmcgdGhpcyBhbmltYXRpb24uIE90aGVyd2lzZSwgcmV0dXJuIGEgY2xvc3VyZSB0aGF0IGhvbGRzIHRoZVxuICAgICAgICAgICAgICAgICBjb21wdXRlZCBwYXRoIGFuZCByZXR1cm5zIGEgc25hcHNob3Qgb2YgdGhlIHBvc2l0aW9uIGFjY29yZGluZyB0byBhIGdpdmVuIHBlcmNlbnRDb21wbGV0ZS4gKi9cbiAgICAgICAgICAgICAgICByZXR1cm4gIWhhdmVfZHVyYXRpb24gPyB0aW1lX2xhcHNlZCA6IGZ1bmN0aW9uKHBlcmNlbnRDb21wbGV0ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGF0aFsgKHBlcmNlbnRDb21wbGV0ZSAqIChwYXRoLmxlbmd0aCAtIDEpKSB8IDAgXTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSgpKTtcblxuICAgICAgICAvKiBqUXVlcnkgZWFzaW5ncy4gKi9cbiAgICAgICAgVmVsb2NpdHkuRWFzaW5ncyA9IHtcbiAgICAgICAgICAgIGxpbmVhcjogZnVuY3Rpb24ocCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN3aW5nOiBmdW5jdGlvbihwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNSAtIE1hdGguY29zKHAgKiBNYXRoLlBJKSAvIDI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyogQm9udXMgXCJzcHJpbmdcIiBlYXNpbmcsIHdoaWNoIGlzIGEgbGVzcyBleGFnZ2VyYXRlZCB2ZXJzaW9uIG9mIGVhc2VJbk91dEVsYXN0aWMuICovXG4gICAgICAgICAgICBzcHJpbmc6IGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMSAtIChNYXRoLmNvcyhwICogNC41ICogTWF0aC5QSSkgKiBNYXRoLmV4cCgtcCAqIDYpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKiBDU1MzIGFuZCBSb2JlcnQgUGVubmVyIGVhc2luZ3MuICovXG4gICAgICAgICQuZWFjaChcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBbXCJlYXNlXCIsIFswLjI1LCAwLjEsIDAuMjUsIDEuMF1dLFxuICAgICAgICAgICAgICAgIFtcImVhc2UtaW5cIiwgWzAuNDIsIDAuMCwgMS4wMCwgMS4wXV0sXG4gICAgICAgICAgICAgICAgW1wiZWFzZS1vdXRcIiwgWzAuMDAsIDAuMCwgMC41OCwgMS4wXV0sXG4gICAgICAgICAgICAgICAgW1wiZWFzZS1pbi1vdXRcIiwgWzAuNDIsIDAuMCwgMC41OCwgMS4wXV0sXG4gICAgICAgICAgICAgICAgW1wiZWFzZUluU2luZVwiLCBbMC40NywgMCwgMC43NDUsIDAuNzE1XV0sXG4gICAgICAgICAgICAgICAgW1wiZWFzZU91dFNpbmVcIiwgWzAuMzksIDAuNTc1LCAwLjU2NSwgMV1dLFxuICAgICAgICAgICAgICAgIFtcImVhc2VJbk91dFNpbmVcIiwgWzAuNDQ1LCAwLjA1LCAwLjU1LCAwLjk1XV0sXG4gICAgICAgICAgICAgICAgW1wiZWFzZUluUXVhZFwiLCBbMC41NSwgMC4wODUsIDAuNjgsIDAuNTNdXSxcbiAgICAgICAgICAgICAgICBbXCJlYXNlT3V0UXVhZFwiLCBbMC4yNSwgMC40NiwgMC40NSwgMC45NF1dLFxuICAgICAgICAgICAgICAgIFtcImVhc2VJbk91dFF1YWRcIiwgWzAuNDU1LCAwLjAzLCAwLjUxNSwgMC45NTVdXSxcbiAgICAgICAgICAgICAgICBbXCJlYXNlSW5DdWJpY1wiLCBbMC41NSwgMC4wNTUsIDAuNjc1LCAwLjE5XV0sXG4gICAgICAgICAgICAgICAgW1wiZWFzZU91dEN1YmljXCIsIFswLjIxNSwgMC42MSwgMC4zNTUsIDFdXSxcbiAgICAgICAgICAgICAgICBbXCJlYXNlSW5PdXRDdWJpY1wiLCBbMC42NDUsIDAuMDQ1LCAwLjM1NSwgMV1dLFxuICAgICAgICAgICAgICAgIFtcImVhc2VJblF1YXJ0XCIsIFswLjg5NSwgMC4wMywgMC42ODUsIDAuMjJdXSxcbiAgICAgICAgICAgICAgICBbXCJlYXNlT3V0UXVhcnRcIiwgWzAuMTY1LCAwLjg0LCAwLjQ0LCAxXV0sXG4gICAgICAgICAgICAgICAgW1wiZWFzZUluT3V0UXVhcnRcIiwgWzAuNzcsIDAsIDAuMTc1LCAxXV0sXG4gICAgICAgICAgICAgICAgW1wiZWFzZUluUXVpbnRcIiwgWzAuNzU1LCAwLjA1LCAwLjg1NSwgMC4wNl1dLFxuICAgICAgICAgICAgICAgIFtcImVhc2VPdXRRdWludFwiLCBbMC4yMywgMSwgMC4zMiwgMV1dLFxuICAgICAgICAgICAgICAgIFtcImVhc2VJbk91dFF1aW50XCIsIFswLjg2LCAwLCAwLjA3LCAxXV0sXG4gICAgICAgICAgICAgICAgW1wiZWFzZUluRXhwb1wiLCBbMC45NSwgMC4wNSwgMC43OTUsIDAuMDM1XV0sXG4gICAgICAgICAgICAgICAgW1wiZWFzZU91dEV4cG9cIiwgWzAuMTksIDEsIDAuMjIsIDFdXSxcbiAgICAgICAgICAgICAgICBbXCJlYXNlSW5PdXRFeHBvXCIsIFsxLCAwLCAwLCAxXV0sXG4gICAgICAgICAgICAgICAgW1wiZWFzZUluQ2lyY1wiLCBbMC42LCAwLjA0LCAwLjk4LCAwLjMzNV1dLFxuICAgICAgICAgICAgICAgIFtcImVhc2VPdXRDaXJjXCIsIFswLjA3NSwgMC44MiwgMC4xNjUsIDFdXSxcbiAgICAgICAgICAgICAgICBbXCJlYXNlSW5PdXRDaXJjXCIsIFswLjc4NSwgMC4xMzUsIDAuMTUsIDAuODZdXVxuICAgICAgICAgICAgXSwgZnVuY3Rpb24oaSwgZWFzaW5nQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBWZWxvY2l0eS5FYXNpbmdzW2Vhc2luZ0FycmF5WzBdXSA9IGdlbmVyYXRlQmV6aWVyLmFwcGx5KG51bGwsIGVhc2luZ0FycmF5WzFdKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIC8qIERldGVybWluZSB0aGUgYXBwcm9wcmlhdGUgZWFzaW5nIHR5cGUgZ2l2ZW4gYW4gZWFzaW5nIGlucHV0LiAqL1xuICAgICAgICBmdW5jdGlvbiBnZXRFYXNpbmcodmFsdWUsIGR1cmF0aW9uKSB7XG4gICAgICAgICAgICB2YXIgZWFzaW5nID0gdmFsdWU7XG5cbiAgICAgICAgICAgIC8qIFRoZSBlYXNpbmcgb3B0aW9uIGNhbiBlaXRoZXIgYmUgYSBzdHJpbmcgdGhhdCByZWZlcmVuY2VzIGEgcHJlLXJlZ2lzdGVyZWQgZWFzaW5nLFxuICAgICAgICAgICAgIG9yIGl0IGNhbiBiZSBhIHR3by0vZm91ci1pdGVtIGFycmF5IG9mIGludGVnZXJzIHRvIGJlIGNvbnZlcnRlZCBpbnRvIGEgYmV6aWVyL3NwcmluZyBmdW5jdGlvbi4gKi9cbiAgICAgICAgICAgIGlmIChUeXBlLmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIC8qIEVuc3VyZSB0aGF0IHRoZSBlYXNpbmcgaGFzIGJlZW4gYXNzaWduZWQgdG8galF1ZXJ5J3MgVmVsb2NpdHkuRWFzaW5ncyBvYmplY3QuICovXG4gICAgICAgICAgICAgICAgaWYgKCFWZWxvY2l0eS5FYXNpbmdzW3ZhbHVlXSkge1xuICAgICAgICAgICAgICAgICAgICBlYXNpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFR5cGUuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgZWFzaW5nID0gZ2VuZXJhdGVTdGVwLmFwcGx5KG51bGwsIHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoVHlwZS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAvKiBzcHJpbmdSSzQgbXVzdCBiZSBwYXNzZWQgdGhlIGFuaW1hdGlvbidzIGR1cmF0aW9uLiAqL1xuICAgICAgICAgICAgICAgIC8qIE5vdGU6IElmIHRoZSBzcHJpbmdSSzQgYXJyYXkgY29udGFpbnMgbm9uLW51bWJlcnMsIGdlbmVyYXRlU3ByaW5nUks0KCkgcmV0dXJucyBhbiBlYXNpbmdcbiAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVkIHdpdGggZGVmYXVsdCB0ZW5zaW9uIGFuZCBmcmljdGlvbiB2YWx1ZXMuICovXG4gICAgICAgICAgICAgICAgZWFzaW5nID0gZ2VuZXJhdGVTcHJpbmdSSzQuYXBwbHkobnVsbCwgdmFsdWUuY29uY2F0KFtkdXJhdGlvbl0pKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoVHlwZS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDQpIHtcbiAgICAgICAgICAgICAgICAvKiBOb3RlOiBJZiB0aGUgYmV6aWVyIGFycmF5IGNvbnRhaW5zIG5vbi1udW1iZXJzLCBnZW5lcmF0ZUJlemllcigpIHJldHVybnMgZmFsc2UuICovXG4gICAgICAgICAgICAgICAgZWFzaW5nID0gZ2VuZXJhdGVCZXppZXIuYXBwbHkobnVsbCwgdmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlYXNpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogUmV2ZXJ0IHRvIHRoZSBWZWxvY2l0eS13aWRlIGRlZmF1bHQgZWFzaW5nIHR5cGUsIG9yIGZhbGwgYmFjayB0byBcInN3aW5nXCIgKHdoaWNoIGlzIGFsc28galF1ZXJ5J3MgZGVmYXVsdClcbiAgICAgICAgICAgICBpZiB0aGUgVmVsb2NpdHktd2lkZSBkZWZhdWx0IGhhcyBiZWVuIGluY29ycmVjdGx5IG1vZGlmaWVkLiAqL1xuICAgICAgICAgICAgaWYgKGVhc2luZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkuRWFzaW5nc1tWZWxvY2l0eS5kZWZhdWx0cy5lYXNpbmddKSB7XG4gICAgICAgICAgICAgICAgICAgIGVhc2luZyA9IFZlbG9jaXR5LmRlZmF1bHRzLmVhc2luZztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlYXNpbmcgPSBFQVNJTkdfREVGQVVMVDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBlYXNpbmc7XG4gICAgICAgIH1cblxuICAgICAgICAvKioqKioqKioqKioqKioqKipcbiAgICAgICAgIENTUyBTdGFja1xuICAgICAgICAgKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgLyogVGhlIENTUyBvYmplY3QgaXMgYSBoaWdobHkgY29uZGVuc2VkIGFuZCBwZXJmb3JtYW50IENTUyBzdGFjayB0aGF0IGZ1bGx5IHJlcGxhY2VzIGpRdWVyeSdzLlxuICAgICAgICAgSXQgaGFuZGxlcyB0aGUgdmFsaWRhdGlvbiwgZ2V0dGluZywgYW5kIHNldHRpbmcgb2YgYm90aCBzdGFuZGFyZCBDU1MgcHJvcGVydGllcyBhbmQgQ1NTIHByb3BlcnR5IGhvb2tzLiAqL1xuICAgICAgICAvKiBOb3RlOiBBIFwiQ1NTXCIgc2hvcnRoYW5kIGlzIGFsaWFzZWQgc28gdGhhdCBvdXIgY29kZSBpcyBlYXNpZXIgdG8gcmVhZC4gKi9cbiAgICAgICAgdmFyIENTUyA9IFZlbG9jaXR5LkNTUyA9IHtcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqXG4gICAgICAgICAgICAgUmVnRXhcbiAgICAgICAgICAgICAqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICBSZWdFeDoge1xuICAgICAgICAgICAgICAgIGlzSGV4OiAvXiMoW0EtZlxcZF17M30pezEsMn0kL2ksXG4gICAgICAgICAgICAgICAgLyogVW53cmFwIGEgcHJvcGVydHkgdmFsdWUncyBzdXJyb3VuZGluZyB0ZXh0LCBlLmcuIFwicmdiYSg0LCAzLCAyLCAxKVwiID09PiBcIjQsIDMsIDIsIDFcIiBhbmQgXCJyZWN0KDRweCAzcHggMnB4IDFweClcIiA9PT4gXCI0cHggM3B4IDJweCAxcHhcIi4gKi9cbiAgICAgICAgICAgICAgICB2YWx1ZVVud3JhcDogL15bQS16XStcXCgoLiopXFwpJC9pLFxuICAgICAgICAgICAgICAgIHdyYXBwZWRWYWx1ZUFscmVhZHlFeHRyYWN0ZWQ6IC9bMC05Ll0rIFswLTkuXSsgWzAtOS5dKyggWzAtOS5dKyk/LyxcbiAgICAgICAgICAgICAgICAvKiBTcGxpdCBhIG11bHRpLXZhbHVlIHByb3BlcnR5IGludG8gYW4gYXJyYXkgb2Ygc3VidmFsdWVzLCBlLmcuIFwicmdiYSg0LCAzLCAyLCAxKSA0cHggM3B4IDJweCAxcHhcIiA9PT4gWyBcInJnYmEoNCwgMywgMiwgMSlcIiwgXCI0cHhcIiwgXCIzcHhcIiwgXCIycHhcIiwgXCIxcHhcIiBdLiAqL1xuICAgICAgICAgICAgICAgIHZhbHVlU3BsaXQ6IC8oW0Etel0rXFwoLitcXCkpfCgoW0EtejAtOSMtLl0rPykoPz1cXHN8JCkpL2lnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqKioqKioqKioqKlxuICAgICAgICAgICAgIExpc3RzXG4gICAgICAgICAgICAgKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICBMaXN0czoge1xuICAgICAgICAgICAgICAgIGNvbG9yczogW1wiZmlsbFwiLCBcInN0cm9rZVwiLCBcInN0b3BDb2xvclwiLCBcImNvbG9yXCIsIFwiYmFja2dyb3VuZENvbG9yXCIsIFwiYm9yZGVyQ29sb3JcIiwgXCJib3JkZXJUb3BDb2xvclwiLCBcImJvcmRlclJpZ2h0Q29sb3JcIiwgXCJib3JkZXJCb3R0b21Db2xvclwiLCBcImJvcmRlckxlZnRDb2xvclwiLCBcIm91dGxpbmVDb2xvclwiXSxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1zQmFzZTogW1widHJhbnNsYXRlWFwiLCBcInRyYW5zbGF0ZVlcIiwgXCJzY2FsZVwiLCBcInNjYWxlWFwiLCBcInNjYWxlWVwiLCBcInNrZXdYXCIsIFwic2tld1lcIiwgXCJyb3RhdGVaXCJdLFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybXMzRDogW1widHJhbnNmb3JtUGVyc3BlY3RpdmVcIiwgXCJ0cmFuc2xhdGVaXCIsIFwic2NhbGVaXCIsIFwicm90YXRlWFwiLCBcInJvdGF0ZVlcIl0sXG4gICAgICAgICAgICAgICAgdW5pdHM6IFtcbiAgICAgICAgICAgICAgICAgICAgXCIlXCIsIC8vIHJlbGF0aXZlXG4gICAgICAgICAgICAgICAgICAgIFwiZW1cIiwgXCJleFwiLCBcImNoXCIsIFwicmVtXCIsIC8vIGZvbnQgcmVsYXRpdmVcbiAgICAgICAgICAgICAgICAgICAgXCJ2d1wiLCBcInZoXCIsIFwidm1pblwiLCBcInZtYXhcIiwgLy8gdmlld3BvcnQgcmVsYXRpdmVcbiAgICAgICAgICAgICAgICAgICAgXCJjbVwiLCBcIm1tXCIsIFwiUVwiLCBcImluXCIsIFwicGNcIiwgXCJwdFwiLCBcInB4XCIsIC8vIGFic29sdXRlIGxlbmd0aHNcbiAgICAgICAgICAgICAgICAgICAgXCJkZWdcIiwgXCJncmFkXCIsIFwicmFkXCIsIFwidHVyblwiLCAvLyBhbmdsZXNcbiAgICAgICAgICAgICAgICAgICAgXCJzXCIsIFwibXNcIiAvLyB0aW1lXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBjb2xvck5hbWVzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiYWxpY2VibHVlXCI6IFwiMjQwLDI0OCwyNTVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhbnRpcXVld2hpdGVcIjogXCIyNTAsMjM1LDIxNVwiLFxuICAgICAgICAgICAgICAgICAgICBcImFxdWFtYXJpbmVcIjogXCIxMjcsMjU1LDIxMlwiLFxuICAgICAgICAgICAgICAgICAgICBcImFxdWFcIjogXCIwLDI1NSwyNTVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhenVyZVwiOiBcIjI0MCwyNTUsMjU1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYmVpZ2VcIjogXCIyNDUsMjQ1LDIyMFwiLFxuICAgICAgICAgICAgICAgICAgICBcImJpc3F1ZVwiOiBcIjI1NSwyMjgsMTk2XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYmxhY2tcIjogXCIwLDAsMFwiLFxuICAgICAgICAgICAgICAgICAgICBcImJsYW5jaGVkYWxtb25kXCI6IFwiMjU1LDIzNSwyMDVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJibHVldmlvbGV0XCI6IFwiMTM4LDQzLDIyNlwiLFxuICAgICAgICAgICAgICAgICAgICBcImJsdWVcIjogXCIwLDAsMjU1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYnJvd25cIjogXCIxNjUsNDIsNDJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJidXJseXdvb2RcIjogXCIyMjIsMTg0LDEzNVwiLFxuICAgICAgICAgICAgICAgICAgICBcImNhZGV0Ymx1ZVwiOiBcIjk1LDE1OCwxNjBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjaGFydHJldXNlXCI6IFwiMTI3LDI1NSwwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY2hvY29sYXRlXCI6IFwiMjEwLDEwNSwzMFwiLFxuICAgICAgICAgICAgICAgICAgICBcImNvcmFsXCI6IFwiMjU1LDEyNyw4MFwiLFxuICAgICAgICAgICAgICAgICAgICBcImNvcm5mbG93ZXJibHVlXCI6IFwiMTAwLDE0OSwyMzdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjb3Juc2lsa1wiOiBcIjI1NSwyNDgsMjIwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY3JpbXNvblwiOiBcIjIyMCwyMCw2MFwiLFxuICAgICAgICAgICAgICAgICAgICBcImN5YW5cIjogXCIwLDI1NSwyNTVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkYXJrYmx1ZVwiOiBcIjAsMCwxMzlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkYXJrY3lhblwiOiBcIjAsMTM5LDEzOVwiLFxuICAgICAgICAgICAgICAgICAgICBcImRhcmtnb2xkZW5yb2RcIjogXCIxODQsMTM0LDExXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGFya2dyYXlcIjogXCIxNjksMTY5LDE2OVwiLFxuICAgICAgICAgICAgICAgICAgICBcImRhcmtncmV5XCI6IFwiMTY5LDE2OSwxNjlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkYXJrZ3JlZW5cIjogXCIwLDEwMCwwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGFya2toYWtpXCI6IFwiMTg5LDE4MywxMDdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkYXJrbWFnZW50YVwiOiBcIjEzOSwwLDEzOVwiLFxuICAgICAgICAgICAgICAgICAgICBcImRhcmtvbGl2ZWdyZWVuXCI6IFwiODUsMTA3LDQ3XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGFya29yYW5nZVwiOiBcIjI1NSwxNDAsMFwiLFxuICAgICAgICAgICAgICAgICAgICBcImRhcmtvcmNoaWRcIjogXCIxNTMsNTAsMjA0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGFya3JlZFwiOiBcIjEzOSwwLDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkYXJrc2FsbW9uXCI6IFwiMjMzLDE1MCwxMjJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkYXJrc2VhZ3JlZW5cIjogXCIxNDMsMTg4LDE0M1wiLFxuICAgICAgICAgICAgICAgICAgICBcImRhcmtzbGF0ZWJsdWVcIjogXCI3Miw2MSwxMzlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkYXJrc2xhdGVncmF5XCI6IFwiNDcsNzksNzlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkYXJrdHVycXVvaXNlXCI6IFwiMCwyMDYsMjA5XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGFya3Zpb2xldFwiOiBcIjE0OCwwLDIxMVwiLFxuICAgICAgICAgICAgICAgICAgICBcImRlZXBwaW5rXCI6IFwiMjU1LDIwLDE0N1wiLFxuICAgICAgICAgICAgICAgICAgICBcImRlZXBza3libHVlXCI6IFwiMCwxOTEsMjU1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGltZ3JheVwiOiBcIjEwNSwxMDUsMTA1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGltZ3JleVwiOiBcIjEwNSwxMDUsMTA1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZG9kZ2VyYmx1ZVwiOiBcIjMwLDE0NCwyNTVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJmaXJlYnJpY2tcIjogXCIxNzgsMzQsMzRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJmbG9yYWx3aGl0ZVwiOiBcIjI1NSwyNTAsMjQwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZm9yZXN0Z3JlZW5cIjogXCIzNCwxMzksMzRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJmdWNoc2lhXCI6IFwiMjU1LDAsMjU1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZ2FpbnNib3JvXCI6IFwiMjIwLDIyMCwyMjBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJnaG9zdHdoaXRlXCI6IFwiMjQ4LDI0OCwyNTVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJnb2xkXCI6IFwiMjU1LDIxNSwwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZ29sZGVucm9kXCI6IFwiMjE4LDE2NSwzMlwiLFxuICAgICAgICAgICAgICAgICAgICBcImdyYXlcIjogXCIxMjgsMTI4LDEyOFwiLFxuICAgICAgICAgICAgICAgICAgICBcImdyZXlcIjogXCIxMjgsMTI4LDEyOFwiLFxuICAgICAgICAgICAgICAgICAgICBcImdyZWVueWVsbG93XCI6IFwiMTczLDI1NSw0N1wiLFxuICAgICAgICAgICAgICAgICAgICBcImdyZWVuXCI6IFwiMCwxMjgsMFwiLFxuICAgICAgICAgICAgICAgICAgICBcImhvbmV5ZGV3XCI6IFwiMjQwLDI1NSwyNDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJob3RwaW5rXCI6IFwiMjU1LDEwNSwxODBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpbmRpYW5yZWRcIjogXCIyMDUsOTIsOTJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpbmRpZ29cIjogXCI3NSwwLDEzMFwiLFxuICAgICAgICAgICAgICAgICAgICBcIml2b3J5XCI6IFwiMjU1LDI1NSwyNDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJraGFraVwiOiBcIjI0MCwyMzAsMTQwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGF2ZW5kZXJibHVzaFwiOiBcIjI1NSwyNDAsMjQ1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGF2ZW5kZXJcIjogXCIyMzAsMjMwLDI1MFwiLFxuICAgICAgICAgICAgICAgICAgICBcImxhd25ncmVlblwiOiBcIjEyNCwyNTIsMFwiLFxuICAgICAgICAgICAgICAgICAgICBcImxlbW9uY2hpZmZvblwiOiBcIjI1NSwyNTAsMjA1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGlnaHRibHVlXCI6IFwiMTczLDIxNiwyMzBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsaWdodGNvcmFsXCI6IFwiMjQwLDEyOCwxMjhcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsaWdodGN5YW5cIjogXCIyMjQsMjU1LDI1NVwiLFxuICAgICAgICAgICAgICAgICAgICBcImxpZ2h0Z29sZGVucm9keWVsbG93XCI6IFwiMjUwLDI1MCwyMTBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsaWdodGdyYXlcIjogXCIyMTEsMjExLDIxMVwiLFxuICAgICAgICAgICAgICAgICAgICBcImxpZ2h0Z3JleVwiOiBcIjIxMSwyMTEsMjExXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGlnaHRncmVlblwiOiBcIjE0NCwyMzgsMTQ0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGlnaHRwaW5rXCI6IFwiMjU1LDE4MiwxOTNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsaWdodHNhbG1vblwiOiBcIjI1NSwxNjAsMTIyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGlnaHRzZWFncmVlblwiOiBcIjMyLDE3OCwxNzBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsaWdodHNreWJsdWVcIjogXCIxMzUsMjA2LDI1MFwiLFxuICAgICAgICAgICAgICAgICAgICBcImxpZ2h0c2xhdGVncmF5XCI6IFwiMTE5LDEzNiwxNTNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsaWdodHN0ZWVsYmx1ZVwiOiBcIjE3NiwxOTYsMjIyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGlnaHR5ZWxsb3dcIjogXCIyNTUsMjU1LDIyNFwiLFxuICAgICAgICAgICAgICAgICAgICBcImxpbWVncmVlblwiOiBcIjUwLDIwNSw1MFwiLFxuICAgICAgICAgICAgICAgICAgICBcImxpbWVcIjogXCIwLDI1NSwwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGluZW5cIjogXCIyNTAsMjQwLDIzMFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm1hZ2VudGFcIjogXCIyNTUsMCwyNTVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtYXJvb25cIjogXCIxMjgsMCwwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWVkaXVtYXF1YW1hcmluZVwiOiBcIjEwMiwyMDUsMTcwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWVkaXVtYmx1ZVwiOiBcIjAsMCwyMDVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtZWRpdW1vcmNoaWRcIjogXCIxODYsODUsMjExXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWVkaXVtcHVycGxlXCI6IFwiMTQ3LDExMiwyMTlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtZWRpdW1zZWFncmVlblwiOiBcIjYwLDE3OSwxMTNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtZWRpdW1zbGF0ZWJsdWVcIjogXCIxMjMsMTA0LDIzOFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm1lZGl1bXNwcmluZ2dyZWVuXCI6IFwiMCwyNTAsMTU0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWVkaXVtdHVycXVvaXNlXCI6IFwiNzIsMjA5LDIwNFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm1lZGl1bXZpb2xldHJlZFwiOiBcIjE5OSwyMSwxMzNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtaWRuaWdodGJsdWVcIjogXCIyNSwyNSwxMTJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtaW50Y3JlYW1cIjogXCIyNDUsMjU1LDI1MFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm1pc3R5cm9zZVwiOiBcIjI1NSwyMjgsMjI1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwibW9jY2FzaW5cIjogXCIyNTUsMjI4LDE4MVwiLFxuICAgICAgICAgICAgICAgICAgICBcIm5hdmFqb3doaXRlXCI6IFwiMjU1LDIyMiwxNzNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJuYXZ5XCI6IFwiMCwwLDEyOFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm9sZGxhY2VcIjogXCIyNTMsMjQ1LDIzMFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm9saXZlZHJhYlwiOiBcIjEwNywxNDIsMzVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJvbGl2ZVwiOiBcIjEyOCwxMjgsMFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm9yYW5nZXJlZFwiOiBcIjI1NSw2OSwwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwib3JhbmdlXCI6IFwiMjU1LDE2NSwwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwib3JjaGlkXCI6IFwiMjE4LDExMiwyMTRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwYWxlZ29sZGVucm9kXCI6IFwiMjM4LDIzMiwxNzBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwYWxlZ3JlZW5cIjogXCIxNTIsMjUxLDE1MlwiLFxuICAgICAgICAgICAgICAgICAgICBcInBhbGV0dXJxdW9pc2VcIjogXCIxNzUsMjM4LDIzOFwiLFxuICAgICAgICAgICAgICAgICAgICBcInBhbGV2aW9sZXRyZWRcIjogXCIyMTksMTEyLDE0N1wiLFxuICAgICAgICAgICAgICAgICAgICBcInBhcGF5YXdoaXBcIjogXCIyNTUsMjM5LDIxM1wiLFxuICAgICAgICAgICAgICAgICAgICBcInBlYWNocHVmZlwiOiBcIjI1NSwyMTgsMTg1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGVydVwiOiBcIjIwNSwxMzMsNjNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwaW5rXCI6IFwiMjU1LDE5MiwyMDNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwbHVtXCI6IFwiMjIxLDE2MCwyMjFcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwb3dkZXJibHVlXCI6IFwiMTc2LDIyNCwyMzBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwdXJwbGVcIjogXCIxMjgsMCwxMjhcIixcbiAgICAgICAgICAgICAgICAgICAgXCJyZWRcIjogXCIyNTUsMCwwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicm9zeWJyb3duXCI6IFwiMTg4LDE0MywxNDNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJyb3lhbGJsdWVcIjogXCI2NSwxMDUsMjI1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwic2FkZGxlYnJvd25cIjogXCIxMzksNjksMTlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzYWxtb25cIjogXCIyNTAsMTI4LDExNFwiLFxuICAgICAgICAgICAgICAgICAgICBcInNhbmR5YnJvd25cIjogXCIyNDQsMTY0LDk2XCIsXG4gICAgICAgICAgICAgICAgICAgIFwic2VhZ3JlZW5cIjogXCI0NiwxMzksODdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzZWFzaGVsbFwiOiBcIjI1NSwyNDUsMjM4XCIsXG4gICAgICAgICAgICAgICAgICAgIFwic2llbm5hXCI6IFwiMTYwLDgyLDQ1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwic2lsdmVyXCI6IFwiMTkyLDE5MiwxOTJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJza3libHVlXCI6IFwiMTM1LDIwNiwyMzVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzbGF0ZWJsdWVcIjogXCIxMDYsOTAsMjA1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwic2xhdGVncmF5XCI6IFwiMTEyLDEyOCwxNDRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzbm93XCI6IFwiMjU1LDI1MCwyNTBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzcHJpbmdncmVlblwiOiBcIjAsMjU1LDEyN1wiLFxuICAgICAgICAgICAgICAgICAgICBcInN0ZWVsYmx1ZVwiOiBcIjcwLDEzMCwxODBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0YW5cIjogXCIyMTAsMTgwLDE0MFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRlYWxcIjogXCIwLDEyOCwxMjhcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0aGlzdGxlXCI6IFwiMjE2LDE5MSwyMTZcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b21hdG9cIjogXCIyNTUsOTksNzFcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0dXJxdW9pc2VcIjogXCI2NCwyMjQsMjA4XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmlvbGV0XCI6IFwiMjM4LDEzMCwyMzhcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ3aGVhdFwiOiBcIjI0NSwyMjIsMTc5XCIsXG4gICAgICAgICAgICAgICAgICAgIFwid2hpdGVzbW9rZVwiOiBcIjI0NSwyNDUsMjQ1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwid2hpdGVcIjogXCIyNTUsMjU1LDI1NVwiLFxuICAgICAgICAgICAgICAgICAgICBcInllbGxvd2dyZWVuXCI6IFwiMTU0LDIwNSw1MFwiLFxuICAgICAgICAgICAgICAgICAgICBcInllbGxvd1wiOiBcIjI1NSwyNTUsMFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKioqKioqKioqKipcbiAgICAgICAgICAgICBIb29rc1xuICAgICAgICAgICAgICoqKioqKioqKioqKi9cblxuICAgICAgICAgICAgLyogSG9va3MgYWxsb3cgYSBzdWJwcm9wZXJ0eSAoZS5nLiBcImJveFNoYWRvd0JsdXJcIikgb2YgYSBjb21wb3VuZC12YWx1ZSBDU1MgcHJvcGVydHlcbiAgICAgICAgICAgICAoZS5nLiBcImJveFNoYWRvdzogWCBZIEJsdXIgU3ByZWFkIENvbG9yXCIpIHRvIGJlIGFuaW1hdGVkIGFzIGlmIGl0IHdlcmUgYSBkaXNjcmV0ZSBwcm9wZXJ0eS4gKi9cbiAgICAgICAgICAgIC8qIE5vdGU6IEJleW9uZCBlbmFibGluZyBmaW5lLWdyYWluZWQgcHJvcGVydHkgYW5pbWF0aW9uLCBob29raW5nIGlzIG5lY2Vzc2FyeSBzaW5jZSBWZWxvY2l0eSBvbmx5XG4gICAgICAgICAgICAgdHdlZW5zIHByb3BlcnRpZXMgd2l0aCBzaW5nbGUgbnVtZXJpYyB2YWx1ZXM7IHVubGlrZSBDU1MgdHJhbnNpdGlvbnMsIFZlbG9jaXR5IGRvZXMgbm90IGludGVycG9sYXRlIGNvbXBvdW5kLXZhbHVlcy4gKi9cbiAgICAgICAgICAgIEhvb2tzOiB7XG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgIFJlZ2lzdHJhdGlvblxuICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIC8qIFRlbXBsYXRlcyBhcmUgYSBjb25jaXNlIHdheSBvZiBpbmRpY2F0aW5nIHdoaWNoIHN1YnByb3BlcnRpZXMgbXVzdCBiZSBpbmRpdmlkdWFsbHkgcmVnaXN0ZXJlZCBmb3IgZWFjaCBjb21wb3VuZC12YWx1ZSBDU1MgcHJvcGVydHkuICovXG4gICAgICAgICAgICAgICAgLyogRWFjaCB0ZW1wbGF0ZSBjb25zaXN0cyBvZiB0aGUgY29tcG91bmQtdmFsdWUncyBiYXNlIG5hbWUsIGl0cyBjb25zdGl0dWVudCBzdWJwcm9wZXJ0eSBuYW1lcywgYW5kIHRob3NlIHN1YnByb3BlcnRpZXMnIGRlZmF1bHQgdmFsdWVzLiAqL1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlczoge1xuICAgICAgICAgICAgICAgICAgICBcInRleHRTaGFkb3dcIjogW1wiQ29sb3IgWCBZIEJsdXJcIiwgXCJibGFjayAwcHggMHB4IDBweFwiXSxcbiAgICAgICAgICAgICAgICAgICAgXCJib3hTaGFkb3dcIjogW1wiQ29sb3IgWCBZIEJsdXIgU3ByZWFkXCIsIFwiYmxhY2sgMHB4IDBweCAwcHggMHB4XCJdLFxuICAgICAgICAgICAgICAgICAgICBcImNsaXBcIjogW1wiVG9wIFJpZ2h0IEJvdHRvbSBMZWZ0XCIsIFwiMHB4IDBweCAwcHggMHB4XCJdLFxuICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmRQb3NpdGlvblwiOiBbXCJYIFlcIiwgXCIwJSAwJVwiXSxcbiAgICAgICAgICAgICAgICAgICAgXCJ0cmFuc2Zvcm1PcmlnaW5cIjogW1wiWCBZIFpcIiwgXCI1MCUgNTAlIDBweFwiXSxcbiAgICAgICAgICAgICAgICAgICAgXCJwZXJzcGVjdGl2ZU9yaWdpblwiOiBbXCJYIFlcIiwgXCI1MCUgNTAlXCJdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKiBBIFwicmVnaXN0ZXJlZFwiIGhvb2sgaXMgb25lIHRoYXQgaGFzIGJlZW4gY29udmVydGVkIGZyb20gaXRzIHRlbXBsYXRlIGZvcm0gaW50byBhIGxpdmUsXG4gICAgICAgICAgICAgICAgIHR3ZWVuYWJsZSBwcm9wZXJ0eS4gSXQgY29udGFpbnMgZGF0YSB0byBhc3NvY2lhdGUgaXQgd2l0aCBpdHMgcm9vdCBwcm9wZXJ0eS4gKi9cbiAgICAgICAgICAgICAgICByZWdpc3RlcmVkOiB7XG4gICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IEEgcmVnaXN0ZXJlZCBob29rIGxvb2tzIGxpa2UgdGhpcyA9PT4gdGV4dFNoYWRvd0JsdXI6IFsgXCJ0ZXh0U2hhZG93XCIsIDMgXSxcbiAgICAgICAgICAgICAgICAgICAgIHdoaWNoIGNvbnNpc3RzIG9mIHRoZSBzdWJwcm9wZXJ0eSdzIG5hbWUsIHRoZSBhc3NvY2lhdGVkIHJvb3QgcHJvcGVydHkncyBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgYW5kIHRoZSBzdWJwcm9wZXJ0eSdzIHBvc2l0aW9uIGluIHRoZSByb290J3MgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKiBDb252ZXJ0IHRoZSB0ZW1wbGF0ZXMgaW50byBpbmRpdmlkdWFsIGhvb2tzIHRoZW4gYXBwZW5kIHRoZW0gdG8gdGhlIHJlZ2lzdGVyZWQgb2JqZWN0IGFib3ZlLiAqL1xuICAgICAgICAgICAgICAgIHJlZ2lzdGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogQ29sb3IgaG9va3MgcmVnaXN0cmF0aW9uOiBDb2xvcnMgYXJlIGRlZmF1bHRlZCB0byB3aGl0ZSAtLSBhcyBvcHBvc2VkIHRvIGJsYWNrIC0tIHNpbmNlIGNvbG9ycyB0aGF0IGFyZVxuICAgICAgICAgICAgICAgICAgICAgY3VycmVudGx5IHNldCB0byBcInRyYW5zcGFyZW50XCIgZGVmYXVsdCB0byB0aGVpciByZXNwZWN0aXZlIHRlbXBsYXRlIGJlbG93IHdoZW4gY29sb3ItYW5pbWF0ZWQsXG4gICAgICAgICAgICAgICAgICAgICBhbmQgd2hpdGUgaXMgdHlwaWNhbGx5IGEgY2xvc2VyIG1hdGNoIHRvIHRyYW5zcGFyZW50IHRoYW4gYmxhY2sgaXMuIEFuIGV4Y2VwdGlvbiBpcyBtYWRlIGZvciB0ZXh0IChcImNvbG9yXCIpLFxuICAgICAgICAgICAgICAgICAgICAgd2hpY2ggaXMgYWxtb3N0IGFsd2F5cyBzZXQgY2xvc2VyIHRvIGJsYWNrIHRoYW4gd2hpdGUuICovXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgQ1NTLkxpc3RzLmNvbG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJnYkNvbXBvbmVudHMgPSAoQ1NTLkxpc3RzLmNvbG9yc1tpXSA9PT0gXCJjb2xvclwiKSA/IFwiMCAwIDAgMVwiIDogXCIyNTUgMjU1IDI1NSAxXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBDU1MuSG9va3MudGVtcGxhdGVzW0NTUy5MaXN0cy5jb2xvcnNbaV1dID0gW1wiUmVkIEdyZWVuIEJsdWUgQWxwaGFcIiwgcmdiQ29tcG9uZW50c107XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgcm9vdFByb3BlcnR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgaG9va1RlbXBsYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaG9va05hbWVzO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIEluIElFLCBjb2xvciB2YWx1ZXMgaW5zaWRlIGNvbXBvdW5kLXZhbHVlIHByb3BlcnRpZXMgYXJlIHBvc2l0aW9uZWQgYXQgdGhlIGVuZCB0aGUgdmFsdWUgaW5zdGVhZCBvZiBhdCB0aGUgYmVnaW5uaW5nLlxuICAgICAgICAgICAgICAgICAgICAgVGh1cywgd2UgcmUtYXJyYW5nZSB0aGUgdGVtcGxhdGVzIGFjY29yZGluZ2x5LiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoSUUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAocm9vdFByb3BlcnR5IGluIENTUy5Ib29rcy50ZW1wbGF0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIUNTUy5Ib29rcy50ZW1wbGF0ZXMuaGFzT3duUHJvcGVydHkocm9vdFByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9va1RlbXBsYXRlID0gQ1NTLkhvb2tzLnRlbXBsYXRlc1tyb290UHJvcGVydHldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2tOYW1lcyA9IGhvb2tUZW1wbGF0ZVswXS5zcGxpdChcIiBcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVmYXVsdFZhbHVlcyA9IGhvb2tUZW1wbGF0ZVsxXS5tYXRjaChDU1MuUmVnRXgudmFsdWVTcGxpdCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaG9va05hbWVzWzBdID09PSBcIkNvbG9yXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogUmVwb3NpdGlvbiBib3RoIHRoZSBob29rJ3MgbmFtZSBhbmQgaXRzIGRlZmF1bHQgdmFsdWUgdG8gdGhlIGVuZCBvZiB0aGVpciByZXNwZWN0aXZlIHN0cmluZ3MuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2tOYW1lcy5wdXNoKGhvb2tOYW1lcy5zaGlmdCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlcy5wdXNoKGRlZmF1bHRWYWx1ZXMuc2hpZnQoKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogUmVwbGFjZSB0aGUgZXhpc3RpbmcgdGVtcGxhdGUgZm9yIHRoZSBob29rJ3Mgcm9vdCBwcm9wZXJ0eS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLkhvb2tzLnRlbXBsYXRlc1tyb290UHJvcGVydHldID0gW2hvb2tOYW1lcy5qb2luKFwiIFwiKSwgZGVmYXVsdFZhbHVlcy5qb2luKFwiIFwiKV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogSG9vayByZWdpc3RyYXRpb24uICovXG4gICAgICAgICAgICAgICAgICAgIGZvciAocm9vdFByb3BlcnR5IGluIENTUy5Ib29rcy50ZW1wbGF0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghQ1NTLkhvb2tzLnRlbXBsYXRlcy5oYXNPd25Qcm9wZXJ0eShyb290UHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBob29rVGVtcGxhdGUgPSBDU1MuSG9va3MudGVtcGxhdGVzW3Jvb3RQcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgICAgICAgICBob29rTmFtZXMgPSBob29rVGVtcGxhdGVbMF0uc3BsaXQoXCIgXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqIGluIGhvb2tOYW1lcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaG9va05hbWVzLmhhc093blByb3BlcnR5KGopKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZnVsbEhvb2tOYW1lID0gcm9vdFByb3BlcnR5ICsgaG9va05hbWVzW2pdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rUG9zaXRpb24gPSBqO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRm9yIGVhY2ggaG9vaywgcmVnaXN0ZXIgaXRzIGZ1bGwgbmFtZSAoZS5nLiB0ZXh0U2hhZG93Qmx1cikgd2l0aCBpdHMgcm9vdCBwcm9wZXJ0eSAoZS5nLiB0ZXh0U2hhZG93KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgdGhlIGhvb2sncyBwb3NpdGlvbiBpbiBpdHMgdGVtcGxhdGUncyBkZWZhdWx0IHZhbHVlIHN0cmluZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDU1MuSG9va3MucmVnaXN0ZXJlZFtmdWxsSG9va05hbWVdID0gW3Jvb3RQcm9wZXJ0eSwgaG9va1Bvc2l0aW9uXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgIEluamVjdGlvbiBhbmQgRXh0cmFjdGlvblxuICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIC8qIExvb2sgdXAgdGhlIHJvb3QgcHJvcGVydHkgYXNzb2NpYXRlZCB3aXRoIHRoZSBob29rIChlLmcuIHJldHVybiBcInRleHRTaGFkb3dcIiBmb3IgXCJ0ZXh0U2hhZG93Qmx1clwiKS4gKi9cbiAgICAgICAgICAgICAgICAvKiBTaW5jZSBhIGhvb2sgY2Fubm90IGJlIHNldCBkaXJlY3RseSAodGhlIGJyb3dzZXIgd29uJ3QgcmVjb2duaXplIGl0KSwgc3R5bGUgdXBkYXRpbmcgZm9yIGhvb2tzIGlzIHJvdXRlZCB0aHJvdWdoIHRoZSBob29rJ3Mgcm9vdCBwcm9wZXJ0eS4gKi9cbiAgICAgICAgICAgICAgICBnZXRSb290OiBmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaG9va0RhdGEgPSBDU1MuSG9va3MucmVnaXN0ZXJlZFtwcm9wZXJ0eV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGhvb2tEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaG9va0RhdGFbMF07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGVyZSB3YXMgbm8gaG9vayBtYXRjaCwgcmV0dXJuIHRoZSBwcm9wZXJ0eSBuYW1lIHVudG91Y2hlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0VW5pdDogZnVuY3Rpb24oc3RyLCBzdGFydCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdW5pdCA9IChzdHIuc3Vic3RyKHN0YXJ0IHx8IDAsIDUpLm1hdGNoKC9eW2EteiVdKy8pIHx8IFtdKVswXSB8fCBcIlwiO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh1bml0ICYmIENTUy5MaXN0cy51bml0cy5pbmRleE9mKHVuaXQpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1bml0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZml4Q29sb3JzOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8ocmdiYT9cXChcXHMqKT8oXFxiW2Etel0rXFxiKS9nLCBmdW5jdGlvbigkMCwgJDEsICQyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQ1NTLkxpc3RzLmNvbG9yTmFtZXMuaGFzT3duUHJvcGVydHkoJDIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgkMSA/ICQxIDogXCJyZ2JhKFwiKSArIENTUy5MaXN0cy5jb2xvck5hbWVzWyQyXSArICgkMSA/IFwiXCIgOiBcIiwxKVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkMSArICQyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qIENvbnZlcnQgYW55IHJvb3RQcm9wZXJ0eVZhbHVlLCBudWxsIG9yIG90aGVyd2lzZSwgaW50byBhIHNwYWNlLWRlbGltaXRlZCBsaXN0IG9mIGhvb2sgdmFsdWVzIHNvIHRoYXRcbiAgICAgICAgICAgICAgICAgdGhlIHRhcmdldGVkIGhvb2sgY2FuIGJlIGluamVjdGVkIG9yIGV4dHJhY3RlZCBhdCBpdHMgc3RhbmRhcmQgcG9zaXRpb24uICovXG4gICAgICAgICAgICAgICAgY2xlYW5Sb290UHJvcGVydHlWYWx1ZTogZnVuY3Rpb24ocm9vdFByb3BlcnR5LCByb290UHJvcGVydHlWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgcm9vdFByb3BlcnR5VmFsdWUgaXMgd3JhcHBlZCB3aXRoIFwicmdiKClcIiwgXCJjbGlwKClcIiwgZXRjLiwgcmVtb3ZlIHRoZSB3cmFwcGluZyB0byBub3JtYWxpemUgdGhlIHZhbHVlIGJlZm9yZSBtYW5pcHVsYXRpb24uICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChDU1MuUmVnRXgudmFsdWVVbndyYXAudGVzdChyb290UHJvcGVydHlWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlID0gcm9vdFByb3BlcnR5VmFsdWUubWF0Y2goQ1NTLlJlZ0V4LnZhbHVlVW53cmFwKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIHJvb3RQcm9wZXJ0eVZhbHVlIGlzIGEgQ1NTIG51bGwtdmFsdWUgKGZyb20gd2hpY2ggdGhlcmUncyBpbmhlcmVudGx5IG5vIGhvb2sgdmFsdWUgdG8gZXh0cmFjdCksXG4gICAgICAgICAgICAgICAgICAgICBkZWZhdWx0IHRvIHRoZSByb290J3MgZGVmYXVsdCB2YWx1ZSBhcyBkZWZpbmVkIGluIENTUy5Ib29rcy50ZW1wbGF0ZXMuICovXG4gICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IENTUyBudWxsLXZhbHVlcyBpbmNsdWRlIFwibm9uZVwiLCBcImF1dG9cIiwgYW5kIFwidHJhbnNwYXJlbnRcIi4gVGhleSBtdXN0IGJlIGNvbnZlcnRlZCBpbnRvIHRoZWlyXG4gICAgICAgICAgICAgICAgICAgICB6ZXJvLXZhbHVlcyAoZS5nLiB0ZXh0U2hhZG93OiBcIm5vbmVcIiA9PT4gdGV4dFNoYWRvdzogXCIwcHggMHB4IDBweCBibGFja1wiKSBmb3IgaG9vayBtYW5pcHVsYXRpb24gdG8gcHJvY2VlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5WYWx1ZXMuaXNDU1NOdWxsVmFsdWUocm9vdFByb3BlcnR5VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSA9IENTUy5Ib29rcy50ZW1wbGF0ZXNbcm9vdFByb3BlcnR5XVsxXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByb290UHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qIEV4dHJhY3RlZCB0aGUgaG9vaydzIHZhbHVlIGZyb20gaXRzIHJvb3QgcHJvcGVydHkncyB2YWx1ZS4gVGhpcyBpcyB1c2VkIHRvIGdldCB0aGUgc3RhcnRpbmcgdmFsdWUgb2YgYW4gYW5pbWF0aW5nIGhvb2suICovXG4gICAgICAgICAgICAgICAgZXh0cmFjdFZhbHVlOiBmdW5jdGlvbihmdWxsSG9va05hbWUsIHJvb3RQcm9wZXJ0eVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBob29rRGF0YSA9IENTUy5Ib29rcy5yZWdpc3RlcmVkW2Z1bGxIb29rTmFtZV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGhvb2tEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaG9va1Jvb3QgPSBob29rRGF0YVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rUG9zaXRpb24gPSBob29rRGF0YVsxXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWUgPSBDU1MuSG9va3MuY2xlYW5Sb290UHJvcGVydHlWYWx1ZShob29rUm9vdCwgcm9vdFByb3BlcnR5VmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBTcGxpdCByb290UHJvcGVydHlWYWx1ZSBpbnRvIGl0cyBjb25zdGl0dWVudCBob29rIHZhbHVlcyB0aGVuIGdyYWIgdGhlIGRlc2lyZWQgaG9vayBhdCBpdHMgc3RhbmRhcmQgcG9zaXRpb24uICovXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcm9vdFByb3BlcnR5VmFsdWUudG9TdHJpbmcoKS5tYXRjaChDU1MuUmVnRXgudmFsdWVTcGxpdClbaG9va1Bvc2l0aW9uXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBwcm92aWRlZCBmdWxsSG9va05hbWUgaXNuJ3QgYSByZWdpc3RlcmVkIGhvb2ssIHJldHVybiB0aGUgcm9vdFByb3BlcnR5VmFsdWUgdGhhdCB3YXMgcGFzc2VkIGluLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvb3RQcm9wZXJ0eVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKiBJbmplY3QgdGhlIGhvb2sncyB2YWx1ZSBpbnRvIGl0cyByb290IHByb3BlcnR5J3MgdmFsdWUuIFRoaXMgaXMgdXNlZCB0byBwaWVjZSBiYWNrIHRvZ2V0aGVyIHRoZSByb290IHByb3BlcnR5XG4gICAgICAgICAgICAgICAgIG9uY2UgVmVsb2NpdHkgaGFzIHVwZGF0ZWQgb25lIG9mIGl0cyBpbmRpdmlkdWFsbHkgaG9va2VkIHZhbHVlcyB0aHJvdWdoIHR3ZWVuaW5nLiAqL1xuICAgICAgICAgICAgICAgIGluamVjdFZhbHVlOiBmdW5jdGlvbihmdWxsSG9va05hbWUsIGhvb2tWYWx1ZSwgcm9vdFByb3BlcnR5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhvb2tEYXRhID0gQ1NTLkhvb2tzLnJlZ2lzdGVyZWRbZnVsbEhvb2tOYW1lXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaG9va0RhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBob29rUm9vdCA9IGhvb2tEYXRhWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2tQb3NpdGlvbiA9IGhvb2tEYXRhWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlUGFydHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWVVcGRhdGVkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSA9IENTUy5Ib29rcy5jbGVhblJvb3RQcm9wZXJ0eVZhbHVlKGhvb2tSb290LCByb290UHJvcGVydHlWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNwbGl0IHJvb3RQcm9wZXJ0eVZhbHVlIGludG8gaXRzIGluZGl2aWR1YWwgaG9vayB2YWx1ZXMsIHJlcGxhY2UgdGhlIHRhcmdldGVkIHZhbHVlIHdpdGggaG9va1ZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW4gcmVjb25zdHJ1Y3QgdGhlIHJvb3RQcm9wZXJ0eVZhbHVlIHN0cmluZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlUGFydHMgPSByb290UHJvcGVydHlWYWx1ZS50b1N0cmluZygpLm1hdGNoKENTUy5SZWdFeC52YWx1ZVNwbGl0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlUGFydHNbaG9va1Bvc2l0aW9uXSA9IGhvb2tWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlVXBkYXRlZCA9IHJvb3RQcm9wZXJ0eVZhbHVlUGFydHMuam9pbihcIiBcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByb290UHJvcGVydHlWYWx1ZVVwZGF0ZWQ7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgcHJvdmlkZWQgZnVsbEhvb2tOYW1lIGlzbid0IGEgcmVnaXN0ZXJlZCBob29rLCByZXR1cm4gdGhlIHJvb3RQcm9wZXJ0eVZhbHVlIHRoYXQgd2FzIHBhc3NlZCBpbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByb290UHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgIE5vcm1hbGl6YXRpb25zXG4gICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgLyogTm9ybWFsaXphdGlvbnMgc3RhbmRhcmRpemUgQ1NTIHByb3BlcnR5IG1hbmlwdWxhdGlvbiBieSBwb2xseWZpbGxpbmcgYnJvd3Nlci1zcGVjaWZpYyBpbXBsZW1lbnRhdGlvbnMgKGUuZy4gb3BhY2l0eSlcbiAgICAgICAgICAgICBhbmQgcmVmb3JtYXR0aW5nIHNwZWNpYWwgcHJvcGVydGllcyAoZS5nLiBjbGlwLCByZ2JhKSB0byBsb29rIGxpa2Ugc3RhbmRhcmQgb25lcy4gKi9cbiAgICAgICAgICAgIE5vcm1hbGl6YXRpb25zOiB7XG4gICAgICAgICAgICAgICAgLyogTm9ybWFsaXphdGlvbnMgYXJlIHBhc3NlZCBhIG5vcm1hbGl6YXRpb24gdGFyZ2V0IChlaXRoZXIgdGhlIHByb3BlcnR5J3MgbmFtZSwgaXRzIGV4dHJhY3RlZCB2YWx1ZSwgb3IgaXRzIGluamVjdGVkIHZhbHVlKSxcbiAgICAgICAgICAgICAgICAgdGhlIHRhcmdldGVkIGVsZW1lbnQgKHdoaWNoIG1heSBuZWVkIHRvIGJlIHF1ZXJpZWQpLCBhbmQgdGhlIHRhcmdldGVkIHByb3BlcnR5IHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgIHJlZ2lzdGVyZWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgY2xpcDogZnVuY3Rpb24odHlwZSwgZWxlbWVudCwgcHJvcGVydHlWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm5hbWVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY2xpcFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENsaXAgbmVlZHMgdG8gYmUgdW53cmFwcGVkIGFuZCBzdHJpcHBlZCBvZiBpdHMgY29tbWFzIGR1cmluZyBleHRyYWN0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJleHRyYWN0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHRyYWN0ZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgVmVsb2NpdHkgYWxzbyBleHRyYWN0ZWQgdGhpcyB2YWx1ZSwgc2tpcCBleHRyYWN0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoQ1NTLlJlZ0V4LndyYXBwZWRWYWx1ZUFscmVhZHlFeHRyYWN0ZWQudGVzdChwcm9wZXJ0eVZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdGVkID0gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFJlbW92ZSB0aGUgXCJyZWN0KClcIiB3cmFwcGVyLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdGVkID0gcHJvcGVydHlWYWx1ZS50b1N0cmluZygpLm1hdGNoKENTUy5SZWdFeC52YWx1ZVVud3JhcCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFN0cmlwIG9mZiBjb21tYXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYWN0ZWQgPSBleHRyYWN0ZWQgPyBleHRyYWN0ZWRbMV0ucmVwbGFjZSgvLChcXHMrKT8vZywgXCIgXCIpIDogcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBleHRyYWN0ZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2xpcCBuZWVkcyB0byBiZSByZS13cmFwcGVkIGR1cmluZyBpbmplY3Rpb24uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImluamVjdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJyZWN0KFwiICsgcHJvcGVydHlWYWx1ZSArIFwiKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBibHVyOiBmdW5jdGlvbih0eXBlLCBlbGVtZW50LCBwcm9wZXJ0eVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibmFtZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVmVsb2NpdHkuU3RhdGUuaXNGaXJlZm94ID8gXCJmaWx0ZXJcIiA6IFwiLXdlYmtpdC1maWx0ZXJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZXh0cmFjdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXh0cmFjdGVkID0gcGFyc2VGbG9hdChwcm9wZXJ0eVZhbHVlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiBleHRyYWN0ZWQgaXMgTmFOLCBtZWFuaW5nIHRoZSB2YWx1ZSBpc24ndCBhbHJlYWR5IGV4dHJhY3RlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoZXh0cmFjdGVkIHx8IGV4dHJhY3RlZCA9PT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBibHVyQ29tcG9uZW50ID0gcHJvcGVydHlWYWx1ZS50b1N0cmluZygpLm1hdGNoKC9ibHVyXFwoKFswLTldK1tBLXpdKylcXCkvaSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBmaWx0ZXIgc3RyaW5nIGhhZCBhIGJsdXIgY29tcG9uZW50LCByZXR1cm4ganVzdCB0aGUgYmx1ciB2YWx1ZSBhbmQgdW5pdCB0eXBlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJsdXJDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYWN0ZWQgPSBibHVyQ29tcG9uZW50WzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBjb21wb25lbnQgZG9lc24ndCBleGlzdCwgZGVmYXVsdCBibHVyIHRvIDAuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RlZCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXh0cmFjdGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEJsdXIgbmVlZHMgdG8gYmUgcmUtd3JhcHBlZCBkdXJpbmcgaW5qZWN0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpbmplY3RcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRm9yIHRoZSBibHVyIGVmZmVjdCB0byBiZSBmdWxseSBkZS1hcHBsaWVkLCBpdCBuZWVkcyB0byBiZSBzZXQgdG8gXCJub25lXCIgaW5zdGVhZCBvZiAwLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXBhcnNlRmxvYXQocHJvcGVydHlWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcImJsdXIoXCIgKyBwcm9wZXJ0eVZhbHVlICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgLyogPD1JRTggZG8gbm90IHN1cHBvcnQgdGhlIHN0YW5kYXJkIG9wYWNpdHkgcHJvcGVydHkuIFRoZXkgdXNlIGZpbHRlcjphbHBoYShvcGFjaXR5PUlOVCkgaW5zdGVhZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogZnVuY3Rpb24odHlwZSwgZWxlbWVudCwgcHJvcGVydHlWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKElFIDw9IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm5hbWVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcImZpbHRlclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZXh0cmFjdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogPD1JRTggcmV0dXJuIGEgXCJmaWx0ZXJcIiB2YWx1ZSBvZiBcImFscGhhKG9wYWNpdHk9XFxkezEsM30pXCIuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRXh0cmFjdCB0aGUgdmFsdWUgYW5kIGNvbnZlcnQgaXQgdG8gYSBkZWNpbWFsIHZhbHVlIHRvIG1hdGNoIHRoZSBzdGFuZGFyZCBDU1Mgb3BhY2l0eSBwcm9wZXJ0eSdzIGZvcm1hdHRpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXh0cmFjdGVkID0gcHJvcGVydHlWYWx1ZS50b1N0cmluZygpLm1hdGNoKC9hbHBoYVxcKG9wYWNpdHk9KC4qKVxcKS9pKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4dHJhY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENvbnZlcnQgdG8gZGVjaW1hbCB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gZXh0cmFjdGVkWzFdIC8gMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBXaGVuIGV4dHJhY3Rpbmcgb3BhY2l0eSwgZGVmYXVsdCB0byAxIHNpbmNlIGEgbnVsbCB2YWx1ZSBtZWFucyBvcGFjaXR5IGhhc24ndCBiZWVuIHNldC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpbmplY3RcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE9wYWNpZmllZCBlbGVtZW50cyBhcmUgcmVxdWlyZWQgdG8gaGF2ZSB0aGVpciB6b29tIHByb3BlcnR5IHNldCB0byBhIG5vbi16ZXJvIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS56b29tID0gMTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU2V0dGluZyB0aGUgZmlsdGVyIHByb3BlcnR5IG9uIGVsZW1lbnRzIHdpdGggY2VydGFpbiBmb250IHByb3BlcnR5IGNvbWJpbmF0aW9ucyBjYW4gcmVzdWx0IGluIGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWdobHkgdW5hcHBlYWxpbmcgdWx0cmEtYm9sZGluZyBlZmZlY3QuIFRoZXJlJ3Mgbm8gd2F5IHRvIHJlbWVkeSB0aGlzIHRocm91Z2hvdXQgYSB0d2VlbiwgYnV0IGRyb3BwaW5nIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlIGFsdG9nZXRoZXIgKHdoZW4gb3BhY2l0eSBoaXRzIDEpIGF0IGxlYXN0cyBlbnN1cmVzIHRoYXQgdGhlIGdsaXRjaCBpcyBnb25lIHBvc3QtdHdlZW5pbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VGbG9hdChwcm9wZXJ0eVZhbHVlKSA+PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFzIHBlciB0aGUgZmlsdGVyIHByb3BlcnR5J3Mgc3BlYywgY29udmVydCB0aGUgZGVjaW1hbCB2YWx1ZSB0byBhIHdob2xlIG51bWJlciBhbmQgd3JhcCB0aGUgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiYWxwaGEob3BhY2l0eT1cIiArIHBhcnNlSW50KHBhcnNlRmxvYXQocHJvcGVydHlWYWx1ZSkgKiAxMDAsIDEwKSArIFwiKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBXaXRoIGFsbCBvdGhlciBicm93c2Vycywgbm9ybWFsaXphdGlvbiBpcyBub3QgcmVxdWlyZWQ7IHJldHVybiB0aGUgc2FtZSB2YWx1ZXMgdGhhdCB3ZXJlIHBhc3NlZCBpbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJuYW1lXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJvcGFjaXR5XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJleHRyYWN0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImluamVjdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgQmF0Y2hlZCBSZWdpc3RyYXRpb25zXG4gICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgLyogTm90ZTogQmF0Y2hlZCBub3JtYWxpemF0aW9ucyBleHRlbmQgdGhlIENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkIG9iamVjdC4gKi9cbiAgICAgICAgICAgICAgICByZWdpc3RlcjogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICBUcmFuc2Zvcm1zXG4gICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAvKiBUcmFuc2Zvcm1zIGFyZSB0aGUgc3VicHJvcGVydGllcyBjb250YWluZWQgYnkgdGhlIENTUyBcInRyYW5zZm9ybVwiIHByb3BlcnR5LiBUcmFuc2Zvcm1zIG11c3QgdW5kZXJnbyBub3JtYWxpemF0aW9uXG4gICAgICAgICAgICAgICAgICAgICBzbyB0aGF0IHRoZXkgY2FuIGJlIHJlZmVyZW5jZWQgaW4gYSBwcm9wZXJ0aWVzIG1hcCBieSB0aGVpciBpbmRpdmlkdWFsIG5hbWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBXaGVuIHRyYW5zZm9ybXMgYXJlIFwic2V0XCIsIHRoZXkgYXJlIGFjdHVhbGx5IGFzc2lnbmVkIHRvIGEgcGVyLWVsZW1lbnQgdHJhbnNmb3JtQ2FjaGUuIFdoZW4gYWxsIHRyYW5zZm9ybVxuICAgICAgICAgICAgICAgICAgICAgc2V0dGluZyBpcyBjb21wbGV0ZSBjb21wbGV0ZSwgQ1NTLmZsdXNoVHJhbnNmb3JtQ2FjaGUoKSBtdXN0IGJlIG1hbnVhbGx5IGNhbGxlZCB0byBmbHVzaCB0aGUgdmFsdWVzIHRvIHRoZSBET00uXG4gICAgICAgICAgICAgICAgICAgICBUcmFuc2Zvcm0gc2V0dGluZyBpcyBiYXRjaGVkIGluIHRoaXMgd2F5IHRvIGltcHJvdmUgcGVyZm9ybWFuY2U6IHRoZSB0cmFuc2Zvcm0gc3R5bGUgb25seSBuZWVkcyB0byBiZSB1cGRhdGVkXG4gICAgICAgICAgICAgICAgICAgICBvbmNlIHdoZW4gbXVsdGlwbGUgdHJhbnNmb3JtIHN1YnByb3BlcnRpZXMgYXJlIGJlaW5nIGFuaW1hdGVkIHNpbXVsdGFuZW91c2x5LiAqL1xuICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBJRTkgYW5kIEFuZHJvaWQgR2luZ2VyYnJlYWQgaGF2ZSBzdXBwb3J0IGZvciAyRCAtLSBidXQgbm90IDNEIC0tIHRyYW5zZm9ybXMuIFNpbmNlIGFuaW1hdGluZyB1bnN1cHBvcnRlZFxuICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtIHByb3BlcnRpZXMgcmVzdWx0cyBpbiB0aGUgYnJvd3NlciBpZ25vcmluZyB0aGUgKmVudGlyZSogdHJhbnNmb3JtIHN0cmluZywgd2UgcHJldmVudCB0aGVzZSAzRCB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgIGZyb20gYmVpbmcgbm9ybWFsaXplZCBmb3IgdGhlc2UgYnJvd3NlcnMgc28gdGhhdCB0d2VlbmluZyBza2lwcyB0aGVzZSBwcm9wZXJ0aWVzIGFsdG9nZXRoZXJcbiAgICAgICAgICAgICAgICAgICAgIChzaW5jZSBpdCB3aWxsIGlnbm9yZSB0aGVtIGFzIGJlaW5nIHVuc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLikgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKCghSUUgfHwgSUUgPiA5KSAmJiAhVmVsb2NpdHkuU3RhdGUuaXNHaW5nZXJicmVhZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogU2luY2UgdGhlIHN0YW5kYWxvbmUgQ1NTIFwicGVyc3BlY3RpdmVcIiBwcm9wZXJ0eSBhbmQgdGhlIENTUyB0cmFuc2Zvcm0gXCJwZXJzcGVjdGl2ZVwiIHN1YnByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmUgdGhlIHNhbWUgbmFtZSwgdGhlIGxhdHRlciBpcyBnaXZlbiBhIHVuaXF1ZSB0b2tlbiB3aXRoaW4gVmVsb2NpdHk6IFwidHJhbnNmb3JtUGVyc3BlY3RpdmVcIi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIENTUy5MaXN0cy50cmFuc2Zvcm1zQmFzZSA9IENTUy5MaXN0cy50cmFuc2Zvcm1zQmFzZS5jb25jYXQoQ1NTLkxpc3RzLnRyYW5zZm9ybXMzRCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IENTUy5MaXN0cy50cmFuc2Zvcm1zQmFzZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogV3JhcCB0aGUgZHluYW1pY2FsbHkgZ2VuZXJhdGVkIG5vcm1hbGl6YXRpb24gZnVuY3Rpb24gaW4gYSBuZXcgc2NvcGUgc28gdGhhdCB0cmFuc2Zvcm1OYW1lJ3MgdmFsdWUgaXNcbiAgICAgICAgICAgICAgICAgICAgICAgICBwYWlyZWQgd2l0aCBpdHMgcmVzcGVjdGl2ZSBmdW5jdGlvbi4gKE90aGVyd2lzZSwgYWxsIGZ1bmN0aW9ucyB3b3VsZCB0YWtlIHRoZSBmaW5hbCBmb3IgbG9vcCdzIHRyYW5zZm9ybU5hbWUuKSAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0cmFuc2Zvcm1OYW1lID0gQ1NTLkxpc3RzLnRyYW5zZm9ybXNCYXNlW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbdHJhbnNmb3JtTmFtZV0gPSBmdW5jdGlvbih0eXBlLCBlbGVtZW50LCBwcm9wZXJ0eVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVGhlIG5vcm1hbGl6ZWQgcHJvcGVydHkgbmFtZSBpcyB0aGUgcGFyZW50IFwidHJhbnNmb3JtXCIgcHJvcGVydHkgLS0gdGhlIHByb3BlcnR5IHRoYXQgaXMgYWN0dWFsbHkgc2V0IGluIENTUy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJuYW1lXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNmb3JtXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBUcmFuc2Zvcm0gdmFsdWVzIGFyZSBjYWNoZWQgb250byBhIHBlci1lbGVtZW50IHRyYW5zZm9ybUNhY2hlIG9iamVjdC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJleHRyYWN0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhpcyB0cmFuc2Zvcm0gaGFzIHlldCB0byBiZSBhc3NpZ25lZCBhIHZhbHVlLCByZXR1cm4gaXRzIG51bGwgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKERhdGEoZWxlbWVudCkgPT09IHVuZGVmaW5lZCB8fCBEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlW3RyYW5zZm9ybU5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU2NhbGUgQ1NTLkxpc3RzLnRyYW5zZm9ybXNCYXNlIGRlZmF1bHQgdG8gMSB3aGVyZWFzIGFsbCBvdGhlciB0cmFuc2Zvcm0gcHJvcGVydGllcyBkZWZhdWx0IHRvIDAuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAvXnNjYWxlL2kudGVzdCh0cmFuc2Zvcm1OYW1lKSA/IDEgOiAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBXaGVuIHRyYW5zZm9ybSB2YWx1ZXMgYXJlIHNldCwgdGhleSBhcmUgd3JhcHBlZCBpbiBwYXJlbnRoZXNlcyBhcyBwZXIgdGhlIENTUyBzcGVjLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGh1cywgd2hlbiBleHRyYWN0aW5nIHRoZWlyIHZhbHVlcyAoZm9yIHR3ZWVuIGNhbGN1bGF0aW9ucyksIHdlIHN0cmlwIG9mZiB0aGUgcGFyZW50aGVzZXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlW3RyYW5zZm9ybU5hbWVdLnJlcGxhY2UoL1soKV0vZywgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaW5qZWN0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGludmFsaWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIGFuIGluZGl2aWR1YWwgdHJhbnNmb3JtIHByb3BlcnR5IGNvbnRhaW5zIGFuIHVuc3VwcG9ydGVkIHVuaXQgdHlwZSwgdGhlIGJyb3dzZXIgaWdub3JlcyB0aGUgKmVudGlyZSogdHJhbnNmb3JtIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaHVzLCBwcm90ZWN0IHVzZXJzIGZyb20gdGhlbXNlbHZlcyBieSBza2lwcGluZyBzZXR0aW5nIGZvciB0cmFuc2Zvcm0gdmFsdWVzIHN1cHBsaWVkIHdpdGggaW52YWxpZCB1bml0IHR5cGVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFN3aXRjaCBvbiB0aGUgYmFzZSB0cmFuc2Zvcm0gdHlwZTsgaWdub3JlIHRoZSBheGlzIGJ5IHJlbW92aW5nIHRoZSBsYXN0IGxldHRlciBmcm9tIHRoZSB0cmFuc2Zvcm0ncyBuYW1lLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodHJhbnNmb3JtTmFtZS5zdWJzdHIoMCwgdHJhbnNmb3JtTmFtZS5sZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBXaGl0ZWxpc3QgdW5pdCB0eXBlcyBmb3IgZWFjaCB0cmFuc2Zvcm0uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ0cmFuc2xhdGVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmFsaWQgPSAhLyglfHB4fGVtfHJlbXx2d3x2aHxcXGQpJC9pLnRlc3QocHJvcGVydHlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU2luY2UgYW4gYXhpcy1mcmVlIFwic2NhbGVcIiBwcm9wZXJ0eSBpcyBzdXBwb3J0ZWQgYXMgd2VsbCwgYSBsaXR0bGUgaGFjayBpcyB1c2VkIGhlcmUgdG8gZGV0ZWN0IGl0IGJ5IGNob3BwaW5nIG9mZiBpdHMgbGFzdCBsZXR0ZXIuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzY2FsXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzY2FsZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2hyb21lIG9uIEFuZHJvaWQgaGFzIGEgYnVnIGluIHdoaWNoIHNjYWxlZCBlbGVtZW50cyBibHVyIGlmIHRoZWlyIGluaXRpYWwgc2NhbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSBpcyBiZWxvdyAxICh3aGljaCBjYW4gaGFwcGVuIHdpdGggZm9yY2VmZWVkaW5nKS4gVGh1cywgd2UgZGV0ZWN0IGEgeWV0LXVuc2V0IHNjYWxlIHByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIGVuc3VyZSB0aGF0IGl0cyBmaXJzdCB2YWx1ZSBpcyBhbHdheXMgMS4gTW9yZSBpbmZvOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwNDE3ODkwL2NzczMtYW5pbWF0aW9ucy13aXRoLXRyYW5zZm9ybS1jYXVzZXMtYmx1cnJlZC1lbGVtZW50cy1vbi13ZWJraXQvMTA0MTc5NjIjMTA0MTc5NjIgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5TdGF0ZS5pc0FuZHJvaWQgJiYgRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZVt0cmFuc2Zvcm1OYW1lXSA9PT0gdW5kZWZpbmVkICYmIHByb3BlcnR5VmFsdWUgPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmFsaWQgPSAhLyhcXGQpJC9pLnRlc3QocHJvcGVydHlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNrZXdcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmFsaWQgPSAhLyhkZWd8XFxkKSQvaS50ZXN0KHByb3BlcnR5VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyb3RhdGVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmFsaWQgPSAhLyhkZWd8XFxkKSQvaS50ZXN0KHByb3BlcnR5VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpbnZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFzIHBlciB0aGUgQ1NTIHNwZWMsIHdyYXAgdGhlIHZhbHVlIGluIHBhcmVudGhlc2VzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlW3RyYW5zZm9ybU5hbWVdID0gXCIoXCIgKyBwcm9wZXJ0eVZhbHVlICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQWx0aG91Z2ggdGhlIHZhbHVlIGlzIHNldCBvbiB0aGUgdHJhbnNmb3JtQ2FjaGUgb2JqZWN0LCByZXR1cm4gdGhlIG5ld2x5LXVwZGF0ZWQgdmFsdWUgZm9yIHRoZSBjYWxsaW5nIGNvZGUgdG8gcHJvY2VzcyBhcyBub3JtYWwuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERhdGEoZWxlbWVudCkudHJhbnNmb3JtQ2FjaGVbdHJhbnNmb3JtTmFtZV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICBDb2xvcnNcbiAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgLyogU2luY2UgVmVsb2NpdHkgb25seSBhbmltYXRlcyBhIHNpbmdsZSBudW1lcmljIHZhbHVlIHBlciBwcm9wZXJ0eSwgY29sb3IgYW5pbWF0aW9uIGlzIGFjaGlldmVkIGJ5IGhvb2tpbmcgdGhlIGluZGl2aWR1YWwgUkdCQSBjb21wb25lbnRzIG9mIENTUyBjb2xvciBwcm9wZXJ0aWVzLlxuICAgICAgICAgICAgICAgICAgICAgQWNjb3JkaW5nbHksIGNvbG9yIHZhbHVlcyBtdXN0IGJlIG5vcm1hbGl6ZWQgKGUuZy4gXCIjZmYwMDAwXCIsIFwicmVkXCIsIGFuZCBcInJnYigyNTUsIDAsIDApXCIgPT0+IFwiMjU1IDAgMCAxXCIpIHNvIHRoYXQgdGhlaXIgY29tcG9uZW50cyBjYW4gYmUgaW5qZWN0ZWQvZXh0cmFjdGVkIGJ5IENTUy5Ib29rcyBsb2dpYy4gKi9cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBDU1MuTGlzdHMuY29sb3JzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBXcmFwIHRoZSBkeW5hbWljYWxseSBnZW5lcmF0ZWQgbm9ybWFsaXphdGlvbiBmdW5jdGlvbiBpbiBhIG5ldyBzY29wZSBzbyB0aGF0IGNvbG9yTmFtZSdzIHZhbHVlIGlzIHBhaXJlZCB3aXRoIGl0cyByZXNwZWN0aXZlIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAgIChPdGhlcndpc2UsIGFsbCBmdW5jdGlvbnMgd291bGQgdGFrZSB0aGUgZmluYWwgZm9yIGxvb3AncyBjb2xvck5hbWUuKSAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2xvck5hbWUgPSBDU1MuTGlzdHMuY29sb3JzW2pdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogSW4gSUU8PTgsIHdoaWNoIHN1cHBvcnQgcmdiIGJ1dCBub3QgcmdiYSwgY29sb3IgcHJvcGVydGllcyBhcmUgcmV2ZXJ0ZWQgdG8gcmdiIGJ5IHN0cmlwcGluZyBvZmYgdGhlIGFscGhhIGNvbXBvbmVudC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtjb2xvck5hbWVdID0gZnVuY3Rpb24odHlwZSwgZWxlbWVudCwgcHJvcGVydHlWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJuYW1lXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbG9yTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENvbnZlcnQgYWxsIGNvbG9yIHZhbHVlcyBpbnRvIHRoZSByZ2IgZm9ybWF0LiAoT2xkIElFIGNhbiByZXR1cm4gaGV4IHZhbHVlcyBhbmQgY29sb3IgbmFtZXMgaW5zdGVhZCBvZiByZ2IvcmdiYS4pICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZXh0cmFjdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHRyYWN0ZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgY29sb3IgaXMgYWxyZWFkeSBpbiBpdHMgaG9va2FibGUgZm9ybSAoZS5nLiBcIjI1NSAyNTUgMjU1IDFcIikgZHVlIHRvIGhhdmluZyBiZWVuIHByZXZpb3VzbHkgZXh0cmFjdGVkLCBza2lwIGV4dHJhY3Rpb24uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5SZWdFeC53cmFwcGVkVmFsdWVBbHJlYWR5RXh0cmFjdGVkLnRlc3QocHJvcGVydHlWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdGVkID0gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udmVydGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3JOYW1lcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibGFjazogXCJyZ2IoMCwgMCwgMClcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibHVlOiBcInJnYigwLCAwLCAyNTUpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JheTogXCJyZ2IoMTI4LCAxMjgsIDEyOClcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmVlbjogXCJyZ2IoMCwgMTI4LCAwKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZDogXCJyZ2IoMjU1LCAwLCAwKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaXRlOiBcInJnYigyNTUsIDI1NSwgMjU1KVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENvbnZlcnQgY29sb3IgbmFtZXMgdG8gcmdiLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoL15bQS16XSskL2kudGVzdChwcm9wZXJ0eVZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbG9yTmFtZXNbcHJvcGVydHlWYWx1ZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnZlcnRlZCA9IGNvbG9yTmFtZXNbcHJvcGVydHlWYWx1ZV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIGFuIHVubWF0Y2hlZCBjb2xvciBuYW1lIGlzIHByb3ZpZGVkLCBkZWZhdWx0IHRvIGJsYWNrLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnZlcnRlZCA9IGNvbG9yTmFtZXMuYmxhY2s7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDb252ZXJ0IGhleCB2YWx1ZXMgdG8gcmdiLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKENTUy5SZWdFeC5pc0hleC50ZXN0KHByb3BlcnR5VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0ZWQgPSBcInJnYihcIiArIENTUy5WYWx1ZXMuaGV4VG9SZ2IocHJvcGVydHlWYWx1ZSkuam9pbihcIiBcIikgKyBcIilcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBwcm92aWRlZCBjb2xvciBkb2Vzbid0IG1hdGNoIGFueSBvZiB0aGUgYWNjZXB0ZWQgY29sb3IgZm9ybWF0cywgZGVmYXVsdCB0byBibGFjay4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghKC9ecmdiYT9cXCgvaS50ZXN0KHByb3BlcnR5VmFsdWUpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udmVydGVkID0gY29sb3JOYW1lcy5ibGFjaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFJlbW92ZSB0aGUgc3Vycm91bmRpbmcgXCJyZ2IvcmdiYSgpXCIgc3RyaW5nIHRoZW4gcmVwbGFjZSBjb21tYXMgd2l0aCBzcGFjZXMgYW5kIHN0cmlwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBlYXRlZCBzcGFjZXMgKGluIGNhc2UgdGhlIHZhbHVlIGluY2x1ZGVkIHNwYWNlcyB0byBiZWdpbiB3aXRoKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdGVkID0gKGNvbnZlcnRlZCB8fCBwcm9wZXJ0eVZhbHVlKS50b1N0cmluZygpLm1hdGNoKENTUy5SZWdFeC52YWx1ZVVud3JhcClbMV0ucmVwbGFjZSgvLChcXHMrKT8vZywgXCIgXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNvIGxvbmcgYXMgdGhpcyBpc24ndCA8PUlFOCwgYWRkIGEgZm91cnRoIChhbHBoYSkgY29tcG9uZW50IGlmIGl0J3MgbWlzc2luZyBhbmQgZGVmYXVsdCBpdCB0byAxICh2aXNpYmxlKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKCFJRSB8fCBJRSA+IDgpICYmIGV4dHJhY3RlZC5zcGxpdChcIiBcIikubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RlZCArPSBcIiAxXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4dHJhY3RlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpbmplY3RcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB3ZSBoYXZlIGEgcGF0dGVybiB0aGVuIGl0IG1pZ2h0IGFscmVhZHkgaGF2ZSB0aGUgcmlnaHQgdmFsdWVzICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC9ecmdiLy50ZXN0KHByb3BlcnR5VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoaXMgaXMgSUU8PTggYW5kIGFuIGFscGhhIGNvbXBvbmVudCBleGlzdHMsIHN0cmlwIGl0IG9mZi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoSUUgPD0gOCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlWYWx1ZS5zcGxpdChcIiBcIikubGVuZ3RoID09PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gcHJvcGVydHlWYWx1ZS5zcGxpdCgvXFxzKy8pLnNsaWNlKDAsIDMpLmpvaW4oXCIgXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE90aGVyd2lzZSwgYWRkIGEgZm91cnRoIChhbHBoYSkgY29tcG9uZW50IGlmIGl0J3MgbWlzc2luZyBhbmQgZGVmYXVsdCBpdCB0byAxICh2aXNpYmxlKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BlcnR5VmFsdWUuc3BsaXQoXCIgXCIpLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlICs9IFwiIDFcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBSZS1pbnNlcnQgdGhlIGJyb3dzZXItYXBwcm9wcmlhdGUgd3JhcHBlcihcInJnYi9yZ2JhKClcIiksIGluc2VydCBjb21tYXMsIGFuZCBzdHJpcCBvZmYgZGVjaW1hbCB1bml0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbiBhbGwgdmFsdWVzIGJ1dCB0aGUgZm91cnRoIChSLCBHLCBhbmQgQiBvbmx5IGFjY2VwdCB3aG9sZSBudW1iZXJzKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKElFIDw9IDggPyBcInJnYlwiIDogXCJyZ2JhXCIpICsgXCIoXCIgKyBwcm9wZXJ0eVZhbHVlLnJlcGxhY2UoL1xccysvZywgXCIsXCIpLnJlcGxhY2UoL1xcLihcXGQpKyg/PSwpL2csIFwiXCIpICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgRGltZW5zaW9uc1xuICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKiovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGF1Z21lbnREaW1lbnNpb24obmFtZSwgZWxlbWVudCwgd2FudElubmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNCb3JkZXJCb3ggPSBDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcImJveFNpemluZ1wiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkgPT09IFwiYm9yZGVyLWJveFwiO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNCb3JkZXJCb3ggPT09ICh3YW50SW5uZXIgfHwgZmFsc2UpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogaW4gYm94LXNpemluZyBtb2RlLCB0aGUgQ1NTIHdpZHRoIC8gaGVpZ2h0IGFjY2Vzc29ycyBhbHJlYWR5IGdpdmUgdGhlIG91dGVyV2lkdGggLyBvdXRlckhlaWdodC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1Z21lbnQgPSAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWRlcyA9IG5hbWUgPT09IFwid2lkdGhcIiA/IFtcIkxlZnRcIiwgXCJSaWdodFwiXSA6IFtcIlRvcFwiLCBcIkJvdHRvbVwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzID0gW1wicGFkZGluZ1wiICsgc2lkZXNbMF0sIFwicGFkZGluZ1wiICsgc2lkZXNbMV0sIFwiYm9yZGVyXCIgKyBzaWRlc1swXSArIFwiV2lkdGhcIiwgXCJib3JkZXJcIiArIHNpZGVzWzFdICsgXCJXaWR0aFwiXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIGZpZWxkc1tpXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXVnbWVudCArPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2FudElubmVyID8gLWF1Z21lbnQgOiBhdWdtZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2V0RGltZW5zaW9uKG5hbWUsIHdhbnRJbm5lcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHR5cGUsIGVsZW1lbnQsIHByb3BlcnR5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm5hbWVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZXh0cmFjdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQocHJvcGVydHlWYWx1ZSkgKyBhdWdtZW50RGltZW5zaW9uKG5hbWUsIGVsZW1lbnQsIHdhbnRJbm5lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpbmplY3RcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAocGFyc2VGbG9hdChwcm9wZXJ0eVZhbHVlKSAtIGF1Z21lbnREaW1lbnNpb24obmFtZSwgZWxlbWVudCwgd2FudElubmVyKSkgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZC5pbm5lcldpZHRoID0gZ2V0RGltZW5zaW9uKFwid2lkdGhcIiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkLmlubmVySGVpZ2h0ID0gZ2V0RGltZW5zaW9uKFwiaGVpZ2h0XCIsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZC5vdXRlcldpZHRoID0gZ2V0RGltZW5zaW9uKFwid2lkdGhcIik7XG4gICAgICAgICAgICAgICAgICAgIENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkLm91dGVySGVpZ2h0ID0gZ2V0RGltZW5zaW9uKFwiaGVpZ2h0XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgQ1NTIFByb3BlcnR5IE5hbWVzXG4gICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICBOYW1lczoge1xuICAgICAgICAgICAgICAgIC8qIENhbWVsY2FzZSBhIHByb3BlcnR5IG5hbWUgaW50byBpdHMgSmF2YVNjcmlwdCBub3RhdGlvbiAoZS5nLiBcImJhY2tncm91bmQtY29sb3JcIiA9PT4gXCJiYWNrZ3JvdW5kQ29sb3JcIikuXG4gICAgICAgICAgICAgICAgIENhbWVsY2FzaW5nIGlzIHVzZWQgdG8gbm9ybWFsaXplIHByb3BlcnR5IG5hbWVzIGJldHdlZW4gYW5kIGFjcm9zcyBjYWxscy4gKi9cbiAgICAgICAgICAgICAgICBjYW1lbENhc2U6IGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eS5yZXBsYWNlKC8tKFxcdykvZywgZnVuY3Rpb24obWF0Y2gsIHN1Yk1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3ViTWF0Y2gudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvKiBGb3IgU1ZHIGVsZW1lbnRzLCBzb21lIHByb3BlcnRpZXMgKG5hbWVseSwgZGltZW5zaW9uYWwgb25lcykgYXJlIEdFVC9TRVQgdmlhIHRoZSBlbGVtZW50J3MgSFRNTCBhdHRyaWJ1dGVzIChpbnN0ZWFkIG9mIHZpYSBDU1Mgc3R5bGVzKS4gKi9cbiAgICAgICAgICAgICAgICBTVkdBdHRyaWJ1dGU6IGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBTVkdBdHRyaWJ1dGVzID0gXCJ3aWR0aHxoZWlnaHR8eHx5fGN4fGN5fHJ8cnh8cnl8eDF8eDJ8eTF8eTJcIjtcblxuICAgICAgICAgICAgICAgICAgICAvKiBDZXJ0YWluIGJyb3dzZXJzIHJlcXVpcmUgYW4gU1ZHIHRyYW5zZm9ybSB0byBiZSBhcHBsaWVkIGFzIGFuIGF0dHJpYnV0ZS4gKE90aGVyd2lzZSwgYXBwbGljYXRpb24gdmlhIENTUyBpcyBwcmVmZXJhYmxlIGR1ZSB0byAzRCBzdXBwb3J0LikgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKElFIHx8IChWZWxvY2l0eS5TdGF0ZS5pc0FuZHJvaWQgJiYgIVZlbG9jaXR5LlN0YXRlLmlzQ2hyb21lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgU1ZHQXR0cmlidXRlcyArPSBcInx0cmFuc2Zvcm1cIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKFwiXihcIiArIFNWR0F0dHJpYnV0ZXMgKyBcIikkXCIsIFwiaVwiKS50ZXN0KHByb3BlcnR5KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qIERldGVybWluZSB3aGV0aGVyIGEgcHJvcGVydHkgc2hvdWxkIGJlIHNldCB3aXRoIGEgdmVuZG9yIHByZWZpeC4gKi9cbiAgICAgICAgICAgICAgICAvKiBJZiBhIHByZWZpeGVkIHZlcnNpb24gb2YgdGhlIHByb3BlcnR5IGV4aXN0cywgcmV0dXJuIGl0LiBPdGhlcndpc2UsIHJldHVybiB0aGUgb3JpZ2luYWwgcHJvcGVydHkgbmFtZS5cbiAgICAgICAgICAgICAgICAgSWYgdGhlIHByb3BlcnR5IGlzIG5vdCBhdCBhbGwgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLCByZXR1cm4gYSBmYWxzZSBmbGFnLiAqL1xuICAgICAgICAgICAgICAgIHByZWZpeENoZWNrOiBmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGlzIHByb3BlcnR5IGhhcyBhbHJlYWR5IGJlZW4gY2hlY2tlZCwgcmV0dXJuIHRoZSBjYWNoZWQgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5TdGF0ZS5wcmVmaXhNYXRjaGVzW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtWZWxvY2l0eS5TdGF0ZS5wcmVmaXhNYXRjaGVzW3Byb3BlcnR5XSwgdHJ1ZV07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmVuZG9ycyA9IFtcIlwiLCBcIldlYmtpdFwiLCBcIk1velwiLCBcIm1zXCIsIFwiT1wiXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIHZlbmRvcnNMZW5ndGggPSB2ZW5kb3JzLmxlbmd0aDsgaSA8IHZlbmRvcnNMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eVByZWZpeGVkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlQcmVmaXhlZCA9IHByb3BlcnR5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENhcGl0YWxpemUgdGhlIGZpcnN0IGxldHRlciBvZiB0aGUgcHJvcGVydHkgdG8gY29uZm9ybSB0byBKYXZhU2NyaXB0IHZlbmRvciBwcmVmaXggbm90YXRpb24gKGUuZy4gd2Via2l0RmlsdGVyKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlQcmVmaXhlZCA9IHZlbmRvcnNbaV0gKyBwcm9wZXJ0eS5yZXBsYWNlKC9eXFx3LywgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2gudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENoZWNrIGlmIHRoZSBicm93c2VyIHN1cHBvcnRzIHRoaXMgcHJvcGVydHkgYXMgcHJlZml4ZWQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFR5cGUuaXNTdHJpbmcoVmVsb2NpdHkuU3RhdGUucHJlZml4RWxlbWVudC5zdHlsZVtwcm9wZXJ0eVByZWZpeGVkXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2FjaGUgdGhlIG1hdGNoLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5TdGF0ZS5wcmVmaXhNYXRjaGVzW3Byb3BlcnR5XSA9IHByb3BlcnR5UHJlZml4ZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtwcm9wZXJ0eVByZWZpeGVkLCB0cnVlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCB0aGlzIHByb3BlcnR5IGluIGFueSBmb3JtLCBpbmNsdWRlIGEgZmFsc2UgZmxhZyBzbyB0aGF0IHRoZSBjYWxsZXIgY2FuIGRlY2lkZSBob3cgdG8gcHJvY2VlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbcHJvcGVydHksIGZhbHNlXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgQ1NTIFByb3BlcnR5IFZhbHVlc1xuICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgVmFsdWVzOiB7XG4gICAgICAgICAgICAgICAgLyogSGV4IHRvIFJHQiBjb252ZXJzaW9uLiBDb3B5cmlnaHQgVGltIERvd246IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTYyMzgzOC9yZ2ItdG8taGV4LWFuZC1oZXgtdG8tcmdiICovXG4gICAgICAgICAgICAgICAgaGV4VG9SZ2I6IGZ1bmN0aW9uKGhleCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2hvcnRmb3JtUmVnZXggPSAvXiM/KFthLWZcXGRdKShbYS1mXFxkXSkoW2EtZlxcZF0pJC9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9uZ2Zvcm1SZWdleCA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICByZ2JQYXJ0cztcblxuICAgICAgICAgICAgICAgICAgICBoZXggPSBoZXgucmVwbGFjZShzaG9ydGZvcm1SZWdleCwgZnVuY3Rpb24obSwgciwgZywgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHIgKyByICsgZyArIGcgKyBiICsgYjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmdiUGFydHMgPSBsb25nZm9ybVJlZ2V4LmV4ZWMoaGV4KTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmdiUGFydHMgPyBbcGFyc2VJbnQocmdiUGFydHNbMV0sIDE2KSwgcGFyc2VJbnQocmdiUGFydHNbMl0sIDE2KSwgcGFyc2VJbnQocmdiUGFydHNbM10sIDE2KV0gOiBbMCwgMCwgMF07XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpc0NTU051bGxWYWx1ZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogVGhlIGJyb3dzZXIgZGVmYXVsdHMgQ1NTIHZhbHVlcyB0aGF0IGhhdmUgbm90IGJlZW4gc2V0IHRvIGVpdGhlciAwIG9yIG9uZSBvZiBzZXZlcmFsIHBvc3NpYmxlIG51bGwtdmFsdWUgc3RyaW5ncy5cbiAgICAgICAgICAgICAgICAgICAgIFRodXMsIHdlIGNoZWNrIGZvciBib3RoIGZhbHNpbmVzcyBhbmQgdGhlc2Ugc3BlY2lhbCBzdHJpbmdzLiAqL1xuICAgICAgICAgICAgICAgICAgICAvKiBOdWxsLXZhbHVlIGNoZWNraW5nIGlzIHBlcmZvcm1lZCB0byBkZWZhdWx0IHRoZSBzcGVjaWFsIHN0cmluZ3MgdG8gMCAoZm9yIHRoZSBzYWtlIG9mIHR3ZWVuaW5nKSBvciB0aGVpciBob29rXG4gICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZXMgYXMgZGVmaW5lZCBhcyBDU1MuSG9va3MgKGZvciB0aGUgc2FrZSBvZiBob29rIGluamVjdGlvbi9leHRyYWN0aW9uKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogQ2hyb21lIHJldHVybnMgXCJyZ2JhKDAsIDAsIDAsIDApXCIgZm9yIGFuIHVuZGVmaW5lZCBjb2xvciB3aGVyZWFzIElFIHJldHVybnMgXCJ0cmFuc3BhcmVudFwiLiAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCF2YWx1ZSB8fCAvXihub25lfGF1dG98dHJhbnNwYXJlbnR8KHJnYmFcXCgwLCA/MCwgPzAsID8wXFwpKSkkL2kudGVzdCh2YWx1ZSkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLyogUmV0cmlldmUgYSBwcm9wZXJ0eSdzIGRlZmF1bHQgdW5pdCB0eXBlLiBVc2VkIGZvciBhc3NpZ25pbmcgYSB1bml0IHR5cGUgd2hlbiBvbmUgaXMgbm90IHN1cHBsaWVkIGJ5IHRoZSB1c2VyLiAqL1xuICAgICAgICAgICAgICAgIGdldFVuaXRUeXBlOiBmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoL14ocm90YXRlfHNrZXcpL2kudGVzdChwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcImRlZ1wiO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKC8oXihzY2FsZXxzY2FsZVh8c2NhbGVZfHNjYWxlWnxhbHBoYXxmbGV4R3Jvd3xmbGV4SGVpZ2h0fHpJbmRleHxmb250V2VpZ2h0KSQpfCgob3BhY2l0eXxyZWR8Z3JlZW58Ymx1ZXxhbHBoYSkkKS9pLnRlc3QocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBUaGUgYWJvdmUgcHJvcGVydGllcyBhcmUgdW5pdGxlc3MuICovXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIERlZmF1bHQgdG8gcHggZm9yIGFsbCBvdGhlciBwcm9wZXJ0aWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLyogSFRNTCBlbGVtZW50cyBkZWZhdWx0IHRvIGFuIGFzc29jaWF0ZWQgZGlzcGxheSB0eXBlIHdoZW4gdGhleSdyZSBub3Qgc2V0IHRvIGRpc3BsYXk6bm9uZS4gKi9cbiAgICAgICAgICAgICAgICAvKiBOb3RlOiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgZm9yIGNvcnJlY3RseSBzZXR0aW5nIHRoZSBub24tXCJub25lXCIgZGlzcGxheSB2YWx1ZSBpbiBjZXJ0YWluIFZlbG9jaXR5IHJlZGlyZWN0cywgc3VjaCBhcyBmYWRlSW4vT3V0LiAqL1xuICAgICAgICAgICAgICAgIGdldERpc3BsYXlUeXBlOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWdOYW1lID0gZWxlbWVudCAmJiBlbGVtZW50LnRhZ05hbWUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICgvXihifGJpZ3xpfHNtYWxsfHR0fGFiYnJ8YWNyb255bXxjaXRlfGNvZGV8ZGZufGVtfGtiZHxzdHJvbmd8c2FtcHx2YXJ8YXxiZG98YnJ8aW1nfG1hcHxvYmplY3R8cXxzY3JpcHR8c3BhbnxzdWJ8c3VwfGJ1dHRvbnxpbnB1dHxsYWJlbHxzZWxlY3R8dGV4dGFyZWEpJC9pLnRlc3QodGFnTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcImlubGluZVwiO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKC9eKGxpKSQvaS50ZXN0KHRhZ05hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJsaXN0LWl0ZW1cIjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgvXih0cikkL2kudGVzdCh0YWdOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwidGFibGUtcm93XCI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoL14odGFibGUpJC9pLnRlc3QodGFnTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcInRhYmxlXCI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoL14odGJvZHkpJC9pLnRlc3QodGFnTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcInRhYmxlLXJvdy1ncm91cFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogRGVmYXVsdCB0byBcImJsb2NrXCIgd2hlbiBubyBtYXRjaCBpcyBmb3VuZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcImJsb2NrXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qIFRoZSBjbGFzcyBhZGQvcmVtb3ZlIGZ1bmN0aW9ucyBhcmUgdXNlZCB0byB0ZW1wb3JhcmlseSBhcHBseSBhIFwidmVsb2NpdHktYW5pbWF0aW5nXCIgY2xhc3MgdG8gZWxlbWVudHMgd2hpbGUgdGhleSdyZSBhbmltYXRpbmcuICovXG4gICAgICAgICAgICAgICAgYWRkQ2xhc3M6IGZ1bmN0aW9uKGVsZW1lbnQsIGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFR5cGUuaXNTdHJpbmcoZWxlbWVudC5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRWxlbWVudC5jbGFzc05hbWUgaXMgYXJvdW5kIDE1JSBmYXN0ZXIgdGhlbiBzZXQvZ2V0QXR0cmlidXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc05hbWUgKz0gKGVsZW1lbnQuY2xhc3NOYW1lLmxlbmd0aCA/IFwiIFwiIDogXCJcIikgKyBjbGFzc05hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdvcmsgYXJvdW5kIGZvciBJRSBzdHJpY3QgbW9kZSBhbmltYXRpbmcgU1ZHIC0gYW5kIGFueXRoaW5nIGVsc2UgdGhhdCBkb2Vzbid0IGJlaGF2ZSBjb3JyZWN0bHkgLSB0aGUgc2FtZSB3YXkgalF1ZXJ5IGRvZXMgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudENsYXNzID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoSUUgPD0gNyA/IFwiY2xhc3NOYW1lXCIgOiBcImNsYXNzXCIpIHx8IFwiXCI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGN1cnJlbnRDbGFzcyArIChjdXJyZW50Q2xhc3MgPyBcIiBcIiA6IFwiXCIpICsgY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uKGVsZW1lbnQsIGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFR5cGUuaXNTdHJpbmcoZWxlbWVudC5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRWxlbWVudC5jbGFzc05hbWUgaXMgYXJvdW5kIDE1JSBmYXN0ZXIgdGhlbiBzZXQvZ2V0QXR0cmlidXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogTmVlZCBzb21lIGpzcGVyZiB0ZXN0cyBvbiBwZXJmb3JtYW5jZSAtIGNhbiB3ZSBnZXQgcmlkIG9mIHRoZSByZWdleCBhbmQgbWF5YmUgdXNlIHNwbGl0IC8gYXJyYXkgbWFuaXB1bGF0aW9uP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUudG9TdHJpbmcoKS5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoXnxcXFxccylcIiArIGNsYXNzTmFtZS5zcGxpdChcIiBcIikuam9pbihcInxcIikgKyBcIihcXFxcc3wkKVwiLCBcImdpXCIpLCBcIiBcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdvcmsgYXJvdW5kIGZvciBJRSBzdHJpY3QgbW9kZSBhbmltYXRpbmcgU1ZHIC0gYW5kIGFueXRoaW5nIGVsc2UgdGhhdCBkb2Vzbid0IGJlaGF2ZSBjb3JyZWN0bHkgLSB0aGUgc2FtZSB3YXkgalF1ZXJ5IGRvZXMgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudENsYXNzID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoSUUgPD0gNyA/IFwiY2xhc3NOYW1lXCIgOiBcImNsYXNzXCIpIHx8IFwiXCI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGN1cnJlbnRDbGFzcy5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoXnxcXHMpXCIgKyBjbGFzc05hbWUuc3BsaXQoXCIgXCIpLmpvaW4oXCJ8XCIpICsgXCIoXFxzfCQpXCIsIFwiZ2lcIiksIFwiIFwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICBTdHlsZSBHZXR0aW5nICYgU2V0dGluZ1xuICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIC8qIFRoZSBzaW5ndWxhciBnZXRQcm9wZXJ0eVZhbHVlLCB3aGljaCByb3V0ZXMgdGhlIGxvZ2ljIGZvciBhbGwgbm9ybWFsaXphdGlvbnMsIGhvb2tzLCBhbmQgc3RhbmRhcmQgQ1NTIHByb3BlcnRpZXMuICovXG4gICAgICAgICAgICBnZXRQcm9wZXJ0eVZhbHVlOiBmdW5jdGlvbihlbGVtZW50LCBwcm9wZXJ0eSwgcm9vdFByb3BlcnR5VmFsdWUsIGZvcmNlU3R5bGVMb29rdXApIHtcbiAgICAgICAgICAgICAgICAvKiBHZXQgYW4gZWxlbWVudCdzIGNvbXB1dGVkIHByb3BlcnR5IHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgIC8qIE5vdGU6IFJldHJpZXZpbmcgdGhlIHZhbHVlIG9mIGEgQ1NTIHByb3BlcnR5IGNhbm5vdCBzaW1wbHkgYmUgcGVyZm9ybWVkIGJ5IGNoZWNraW5nIGFuIGVsZW1lbnQnc1xuICAgICAgICAgICAgICAgICBzdHlsZSBhdHRyaWJ1dGUgKHdoaWNoIG9ubHkgcmVmbGVjdHMgdXNlci1kZWZpbmVkIHZhbHVlcykuIEluc3RlYWQsIHRoZSBicm93c2VyIG11c3QgYmUgcXVlcmllZCBmb3IgYSBwcm9wZXJ0eSdzXG4gICAgICAgICAgICAgICAgICpjb21wdXRlZCogdmFsdWUuIFlvdSBjYW4gcmVhZCBtb3JlIGFib3V0IGdldENvbXB1dGVkU3R5bGUgaGVyZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vZG9jcy9XZWIvQVBJL3dpbmRvdy5nZXRDb21wdXRlZFN0eWxlICovXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gY29tcHV0ZVByb3BlcnR5VmFsdWUoZWxlbWVudCwgcHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogV2hlbiBib3gtc2l6aW5nIGlzbid0IHNldCB0byBib3JkZXItYm94LCBoZWlnaHQgYW5kIHdpZHRoIHN0eWxlIHZhbHVlcyBhcmUgaW5jb3JyZWN0bHkgY29tcHV0ZWQgd2hlbiBhblxuICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCdzIHNjcm9sbGJhcnMgYXJlIHZpc2libGUgKHdoaWNoIGV4cGFuZHMgdGhlIGVsZW1lbnQncyBkaW1lbnNpb25zKS4gVGh1cywgd2UgZGVmZXIgdG8gdGhlIG1vcmUgYWNjdXJhdGVcbiAgICAgICAgICAgICAgICAgICAgIG9mZnNldEhlaWdodC9XaWR0aCBwcm9wZXJ0eSwgd2hpY2ggaW5jbHVkZXMgdGhlIHRvdGFsIGRpbWVuc2lvbnMgZm9yIGludGVyaW9yLCBib3JkZXIsIHBhZGRpbmcsIGFuZCBzY3JvbGxiYXIuXG4gICAgICAgICAgICAgICAgICAgICBXZSBzdWJ0cmFjdCBib3JkZXIgYW5kIHBhZGRpbmcgdG8gZ2V0IHRoZSBzdW0gb2YgaW50ZXJpb3IgKyBzY3JvbGxiYXIuICovXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21wdXRlZFZhbHVlID0gMDtcblxuICAgICAgICAgICAgICAgICAgICAvKiBJRTw9OCBkb2Vzbid0IHN1cHBvcnQgd2luZG93LmdldENvbXB1dGVkU3R5bGUsIHRodXMgd2UgZGVmZXIgdG8galF1ZXJ5LCB3aGljaCBoYXMgYW4gZXh0ZW5zaXZlIGFycmF5XG4gICAgICAgICAgICAgICAgICAgICBvZiBoYWNrcyB0byBhY2N1cmF0ZWx5IHJldHJpZXZlIElFOCBwcm9wZXJ0eSB2YWx1ZXMuIFJlLWltcGxlbWVudGluZyB0aGF0IGxvZ2ljIGhlcmUgaXMgbm90IHdvcnRoIGJsb2F0aW5nIHRoZVxuICAgICAgICAgICAgICAgICAgICAgY29kZWJhc2UgZm9yIGEgZHlpbmcgYnJvd3Nlci4gVGhlIHBlcmZvcm1hbmNlIHJlcGVyY3Vzc2lvbnMgb2YgdXNpbmcgalF1ZXJ5IGhlcmUgYXJlIG1pbmltYWwgc2luY2VcbiAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5IGlzIG9wdGltaXplZCB0byByYXJlbHkgKGFuZCBzb21ldGltZXMgbmV2ZXIpIHF1ZXJ5IHRoZSBET00uIEZ1cnRoZXIsIHRoZSAkLmNzcygpIGNvZGVwYXRoIGlzbid0IHRoYXQgc2xvdy4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKElFIDw9IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkVmFsdWUgPSAkLmNzcyhlbGVtZW50LCBwcm9wZXJ0eSk7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogQWxsIG90aGVyIGJyb3dzZXJzIHN1cHBvcnQgZ2V0Q29tcHV0ZWRTdHlsZS4gVGhlIHJldHVybmVkIGxpdmUgb2JqZWN0IHJlZmVyZW5jZSBpcyBjYWNoZWQgb250byBpdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICBhc3NvY2lhdGVkIGVsZW1lbnQgc28gdGhhdCBpdCBkb2VzIG5vdCBuZWVkIHRvIGJlIHJlZmV0Y2hlZCB1cG9uIGV2ZXJ5IEdFVC4gKi9cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEJyb3dzZXJzIGRvIG5vdCByZXR1cm4gaGVpZ2h0IGFuZCB3aWR0aCB2YWx1ZXMgZm9yIGVsZW1lbnRzIHRoYXQgYXJlIHNldCB0byBkaXNwbGF5Olwibm9uZVwiLiBUaHVzLCB3ZSB0ZW1wb3JhcmlseVxuICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZSBkaXNwbGF5IHRvIHRoZSBlbGVtZW50IHR5cGUncyBkZWZhdWx0IHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRvZ2dsZURpc3BsYXkgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC9eKHdpZHRofGhlaWdodCkkLy50ZXN0KHByb3BlcnR5KSAmJiBDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcImRpc3BsYXlcIikgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVEaXNwbGF5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDU1Muc2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcImRpc3BsYXlcIiwgQ1NTLlZhbHVlcy5nZXREaXNwbGF5VHlwZShlbGVtZW50KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXZlcnREaXNwbGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvZ2dsZURpc3BsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLnNldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWZvcmNlU3R5bGVMb29rdXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgPT09IFwiaGVpZ2h0XCIgJiYgQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJib3hTaXppbmdcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpICE9PSBcImJvcmRlci1ib3hcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udGVudEJveEhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0IC0gKHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJib3JkZXJUb3BXaWR0aFwiKSkgfHwgMCkgLSAocGFyc2VGbG9hdChDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcImJvcmRlckJvdHRvbVdpZHRoXCIpKSB8fCAwKSAtIChwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwicGFkZGluZ1RvcFwiKSkgfHwgMCkgLSAocGFyc2VGbG9hdChDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcInBhZGRpbmdCb3R0b21cIikpIHx8IDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXZlcnREaXNwbGF5KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnRCb3hIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wZXJ0eSA9PT0gXCJ3aWR0aFwiICYmIENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiYm94U2l6aW5nXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSAhPT0gXCJib3JkZXItYm94XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRlbnRCb3hXaWR0aCA9IGVsZW1lbnQub2Zmc2V0V2lkdGggLSAocGFyc2VGbG9hdChDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcImJvcmRlckxlZnRXaWR0aFwiKSkgfHwgMCkgLSAocGFyc2VGbG9hdChDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcImJvcmRlclJpZ2h0V2lkdGhcIikpIHx8IDApIC0gKHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJwYWRkaW5nTGVmdFwiKSkgfHwgMCkgLSAocGFyc2VGbG9hdChDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcInBhZGRpbmdSaWdodFwiKSkgfHwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldmVydERpc3BsYXkoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudEJveFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXB1dGVkU3R5bGU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZvciBlbGVtZW50cyB0aGF0IFZlbG9jaXR5IGhhc24ndCBiZWVuIGNhbGxlZCBvbiBkaXJlY3RseSAoZS5nLiB3aGVuIFZlbG9jaXR5IHF1ZXJpZXMgdGhlIERPTSBvbiBiZWhhbGZcbiAgICAgICAgICAgICAgICAgICAgICAgICBvZiBhIHBhcmVudCBvZiBhbiBlbGVtZW50IGl0cyBhbmltYXRpbmcpLCBwZXJmb3JtIGEgZGlyZWN0IGdldENvbXB1dGVkU3R5bGUgbG9va3VwIHNpbmNlIHRoZSBvYmplY3QgaXNuJ3QgY2FjaGVkLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKERhdGEoZWxlbWVudCkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkU3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKTsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGNvbXB1dGVkU3R5bGUgb2JqZWN0IGhhcyB5ZXQgdG8gYmUgY2FjaGVkLCBkbyBzbyBub3cuICovXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFEYXRhKGVsZW1lbnQpLmNvbXB1dGVkU3R5bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFN0eWxlID0gRGF0YShlbGVtZW50KS5jb21wdXRlZFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCk7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIGNvbXB1dGVkU3R5bGUgaXMgY2FjaGVkLCB1c2UgaXQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkU3R5bGUgPSBEYXRhKGVsZW1lbnQpLmNvbXB1dGVkU3R5bGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElFIGFuZCBGaXJlZm94IGRvIG5vdCByZXR1cm4gYSB2YWx1ZSBmb3IgdGhlIGdlbmVyaWMgYm9yZGVyQ29sb3IgLS0gdGhleSBvbmx5IHJldHVybiBpbmRpdmlkdWFsIHZhbHVlcyBmb3IgZWFjaCBib3JkZXIgc2lkZSdzIGNvbG9yLlxuICAgICAgICAgICAgICAgICAgICAgICAgIEFsc28sIGluIGFsbCBicm93c2Vycywgd2hlbiBib3JkZXIgY29sb3JzIGFyZW4ndCBhbGwgdGhlIHNhbWUsIGEgY29tcG91bmQgdmFsdWUgaXMgcmV0dXJuZWQgdGhhdCBWZWxvY2l0eSBpc24ndCBzZXR1cCB0byBwYXJzZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICBTbywgYXMgYSBwb2x5ZmlsbCBmb3IgcXVlcnlpbmcgaW5kaXZpZHVhbCBib3JkZXIgc2lkZSBjb2xvcnMsIHdlIGp1c3QgcmV0dXJuIHRoZSB0b3AgYm9yZGVyJ3MgY29sb3IgYW5kIGFuaW1hdGUgYWxsIGJvcmRlcnMgZnJvbSB0aGF0IHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09PSBcImJvcmRlckNvbG9yXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eSA9IFwiYm9yZGVyVG9wQ29sb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogSUU5IGhhcyBhIGJ1ZyBpbiB3aGljaCB0aGUgXCJmaWx0ZXJcIiBwcm9wZXJ0eSBtdXN0IGJlIGFjY2Vzc2VkIGZyb20gY29tcHV0ZWRTdHlsZSB1c2luZyB0aGUgZ2V0UHJvcGVydHlWYWx1ZSBtZXRob2RcbiAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0ZWFkIG9mIGEgZGlyZWN0IHByb3BlcnR5IGxvb2t1cC4gVGhlIGdldFByb3BlcnR5VmFsdWUgbWV0aG9kIGlzIHNsb3dlciB0aGFuIGEgZGlyZWN0IGxvb2t1cCwgd2hpY2ggaXMgd2h5IHdlIGF2b2lkIGl0IGJ5IGRlZmF1bHQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoSUUgPT09IDkgJiYgcHJvcGVydHkgPT09IFwiZmlsdGVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFZhbHVlID0gY29tcHV0ZWRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKHByb3BlcnR5KTsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkVmFsdWUgPSBjb21wdXRlZFN0eWxlW3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogRmFsbCBiYWNrIHRvIHRoZSBwcm9wZXJ0eSdzIHN0eWxlIHZhbHVlIChpZiBkZWZpbmVkKSB3aGVuIGNvbXB1dGVkVmFsdWUgcmV0dXJucyBub3RoaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWNoIGNhbiBoYXBwZW4gd2hlbiB0aGUgZWxlbWVudCBoYXNuJ3QgYmVlbiBwYWludGVkLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXB1dGVkVmFsdWUgPT09IFwiXCIgfHwgY29tcHV0ZWRWYWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkVmFsdWUgPSBlbGVtZW50LnN0eWxlW3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV2ZXJ0RGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogRm9yIHRvcCwgcmlnaHQsIGJvdHRvbSwgYW5kIGxlZnQgKFRSQkwpIHZhbHVlcyB0aGF0IGFyZSBzZXQgdG8gXCJhdXRvXCIgb24gZWxlbWVudHMgb2YgXCJmaXhlZFwiIG9yIFwiYWJzb2x1dGVcIiBwb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgIGRlZmVyIHRvIGpRdWVyeSBmb3IgY29udmVydGluZyBcImF1dG9cIiB0byBhIG51bWVyaWMgdmFsdWUuIChGb3IgZWxlbWVudHMgd2l0aCBhIFwic3RhdGljXCIgb3IgXCJyZWxhdGl2ZVwiIHBvc2l0aW9uLCBcImF1dG9cIiBoYXMgdGhlIHNhbWVcbiAgICAgICAgICAgICAgICAgICAgIGVmZmVjdCBhcyBiZWluZyBzZXQgdG8gMCwgc28gbm8gY29udmVyc2lvbiBpcyBuZWNlc3NhcnkuKSAqL1xuICAgICAgICAgICAgICAgICAgICAvKiBBbiBleGFtcGxlIG9mIHdoeSBudW1lcmljIGNvbnZlcnNpb24gaXMgbmVjZXNzYXJ5OiBXaGVuIGFuIGVsZW1lbnQgd2l0aCBcInBvc2l0aW9uOmFic29sdXRlXCIgaGFzIGFuIHVudG91Y2hlZCBcImxlZnRcIlxuICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHksIHdoaWNoIHJldmVydHMgdG8gXCJhdXRvXCIsIGxlZnQncyB2YWx1ZSBpcyAwIHJlbGF0aXZlIHRvIGl0cyBwYXJlbnQgZWxlbWVudCwgYnV0IGlzIG9mdGVuIG5vbi16ZXJvIHJlbGF0aXZlXG4gICAgICAgICAgICAgICAgICAgICB0byBpdHMgKmNvbnRhaW5pbmcqIChub3QgcGFyZW50KSBlbGVtZW50LCB3aGljaCBpcyB0aGUgbmVhcmVzdCBcInBvc2l0aW9uOnJlbGF0aXZlXCIgYW5jZXN0b3Igb3IgdGhlIHZpZXdwb3J0IChhbmQgYWx3YXlzIHRoZSB2aWV3cG9ydCBpbiB0aGUgY2FzZSBvZiBcInBvc2l0aW9uOmZpeGVkXCIpLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcHV0ZWRWYWx1ZSA9PT0gXCJhdXRvXCIgJiYgL14odG9wfHJpZ2h0fGJvdHRvbXxsZWZ0KSQvaS50ZXN0KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBvc2l0aW9uID0gY29tcHV0ZVByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJwb3NpdGlvblwiKTsgLyogR0VUICovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZvciBhYnNvbHV0ZSBwb3NpdGlvbmluZywgalF1ZXJ5J3MgJC5wb3NpdGlvbigpIG9ubHkgcmV0dXJucyB2YWx1ZXMgZm9yIHRvcCBhbmQgbGVmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICByaWdodCBhbmQgYm90dG9tIHdpbGwgaGF2ZSB0aGVpciBcImF1dG9cIiB2YWx1ZSByZXZlcnRlZCB0byAwLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogQSBqUXVlcnkgb2JqZWN0IG11c3QgYmUgY3JlYXRlZCBoZXJlIHNpbmNlIGpRdWVyeSBkb2Vzbid0IGhhdmUgYSBsb3ctbGV2ZWwgYWxpYXMgZm9yICQucG9zaXRpb24oKS5cbiAgICAgICAgICAgICAgICAgICAgICAgICBOb3QgYSBiaWcgZGVhbCBzaW5jZSB3ZSdyZSBjdXJyZW50bHkgaW4gYSBHRVQgYmF0Y2ggYW55d2F5LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBvc2l0aW9uID09PSBcImZpeGVkXCIgfHwgKHBvc2l0aW9uID09PSBcImFic29sdXRlXCIgJiYgL3RvcHxsZWZ0L2kudGVzdChwcm9wZXJ0eSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogalF1ZXJ5IHN0cmlwcyB0aGUgcGl4ZWwgdW5pdCBmcm9tIGl0cyByZXR1cm5lZCB2YWx1ZXM7IHdlIHJlLWFkZCBpdCBoZXJlIHRvIGNvbmZvcm0gd2l0aCBjb21wdXRlUHJvcGVydHlWYWx1ZSdzIGJlaGF2aW9yLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkVmFsdWUgPSAkKGVsZW1lbnQpLnBvc2l0aW9uKClbcHJvcGVydHldICsgXCJweFwiOyAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb21wdXRlZFZhbHVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eVZhbHVlO1xuXG4gICAgICAgICAgICAgICAgLyogSWYgdGhpcyBpcyBhIGhvb2tlZCBwcm9wZXJ0eSAoZS5nLiBcImNsaXBMZWZ0XCIgaW5zdGVhZCBvZiB0aGUgcm9vdCBwcm9wZXJ0eSBvZiBcImNsaXBcIiksXG4gICAgICAgICAgICAgICAgIGV4dHJhY3QgdGhlIGhvb2sncyB2YWx1ZSBmcm9tIGEgbm9ybWFsaXplZCByb290UHJvcGVydHlWYWx1ZSB1c2luZyBDU1MuSG9va3MuZXh0cmFjdFZhbHVlKCkuICovXG4gICAgICAgICAgICAgICAgaWYgKENTUy5Ib29rcy5yZWdpc3RlcmVkW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaG9vayA9IHByb3BlcnR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgaG9va1Jvb3QgPSBDU1MuSG9va3MuZ2V0Um9vdChob29rKTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBJZiBhIGNhY2hlZCByb290UHJvcGVydHlWYWx1ZSB3YXNuJ3QgcGFzc2VkIGluICh3aGljaCBWZWxvY2l0eSBhbHdheXMgYXR0ZW1wdHMgdG8gZG8gaW4gb3JkZXIgdG8gYXZvaWQgcmVxdWVyeWluZyB0aGUgRE9NKSxcbiAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5IHRoZSBET00gZm9yIHRoZSByb290IHByb3BlcnR5J3MgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChyb290UHJvcGVydHlWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBTaW5jZSB0aGUgYnJvd3NlciBpcyBub3cgYmVpbmcgZGlyZWN0bHkgcXVlcmllZCwgdXNlIHRoZSBvZmZpY2lhbCBwb3N0LXByZWZpeGluZyBwcm9wZXJ0eSBuYW1lIGZvciB0aGlzIGxvb2t1cC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlID0gQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgQ1NTLk5hbWVzLnByZWZpeENoZWNrKGhvb2tSb290KVswXSk7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhpcyByb290IGhhcyBhIG5vcm1hbGl6YXRpb24gcmVnaXN0ZXJlZCwgcGVmb3JtIHRoZSBhc3NvY2lhdGVkIG5vcm1hbGl6YXRpb24gZXh0cmFjdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2hvb2tSb290XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWUgPSBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtob29rUm9vdF0oXCJleHRyYWN0XCIsIGVsZW1lbnQsIHJvb3RQcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIEV4dHJhY3QgdGhlIGhvb2sncyB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IENTUy5Ib29rcy5leHRyYWN0VmFsdWUoaG9vaywgcm9vdFByb3BlcnR5VmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIHRoaXMgaXMgYSBub3JtYWxpemVkIHByb3BlcnR5IChlLmcuIFwib3BhY2l0eVwiIGJlY29tZXMgXCJmaWx0ZXJcIiBpbiA8PUlFOCkgb3IgXCJ0cmFuc2xhdGVYXCIgYmVjb21lcyBcInRyYW5zZm9ybVwiKSxcbiAgICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZSB0aGUgcHJvcGVydHkncyBuYW1lIGFuZCB2YWx1ZSwgYW5kIGhhbmRsZSB0aGUgc3BlY2lhbCBjYXNlIG9mIHRyYW5zZm9ybXMuICovXG4gICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IE5vcm1hbGl6aW5nIGEgcHJvcGVydHkgaXMgbXV0dWFsbHkgZXhjbHVzaXZlIGZyb20gaG9va2luZyBhIHByb3BlcnR5IHNpbmNlIGhvb2stZXh0cmFjdGVkIHZhbHVlcyBhcmUgc3RyaWN0bHlcbiAgICAgICAgICAgICAgICAgICAgIG51bWVyaWNhbCBhbmQgdGhlcmVmb3JlIGRvIG5vdCByZXF1aXJlIG5vcm1hbGl6YXRpb24gZXh0cmFjdGlvbi4gKi9cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbm9ybWFsaXplZFByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRQcm9wZXJ0eVZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRQcm9wZXJ0eU5hbWUgPSBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtwcm9wZXJ0eV0oXCJuYW1lXCIsIGVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIFRyYW5zZm9ybSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgdmlhIG5vcm1hbGl6YXRpb24gZXh0cmFjdGlvbiAoc2VlIGJlbG93KSwgd2hpY2ggY2hlY2tzIGFnYWluc3QgdGhlIGVsZW1lbnQncyB0cmFuc2Zvcm1DYWNoZS5cbiAgICAgICAgICAgICAgICAgICAgIEF0IG5vIHBvaW50IGRvIHRyYW5zZm9ybSBHRVRzIGV2ZXIgYWN0dWFsbHkgcXVlcnkgdGhlIERPTTsgaW5pdGlhbCBzdHlsZXNoZWV0IHZhbHVlcyBhcmUgbmV2ZXIgcHJvY2Vzc2VkLlxuICAgICAgICAgICAgICAgICAgICAgVGhpcyBpcyBiZWNhdXNlIHBhcnNpbmcgM0QgdHJhbnNmb3JtIG1hdHJpY2VzIGlzIG5vdCBhbHdheXMgYWNjdXJhdGUgYW5kIHdvdWxkIGJsb2F0IG91ciBjb2RlYmFzZTtcbiAgICAgICAgICAgICAgICAgICAgIHRodXMsIG5vcm1hbGl6YXRpb24gZXh0cmFjdGlvbiBkZWZhdWx0cyBpbml0aWFsIHRyYW5zZm9ybSB2YWx1ZXMgdG8gdGhlaXIgemVyby12YWx1ZXMgKGUuZy4gMSBmb3Igc2NhbGVYIGFuZCAwIGZvciB0cmFuc2xhdGVYKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vcm1hbGl6ZWRQcm9wZXJ0eU5hbWUgIT09IFwidHJhbnNmb3JtXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRQcm9wZXJ0eVZhbHVlID0gY29tcHV0ZVByb3BlcnR5VmFsdWUoZWxlbWVudCwgQ1NTLk5hbWVzLnByZWZpeENoZWNrKG5vcm1hbGl6ZWRQcm9wZXJ0eU5hbWUpWzBdKTsgLyogR0VUICovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSB2YWx1ZSBpcyBhIENTUyBudWxsLXZhbHVlIGFuZCB0aGlzIHByb3BlcnR5IGhhcyBhIGhvb2sgdGVtcGxhdGUsIHVzZSB0aGF0IHplcm8tdmFsdWUgdGVtcGxhdGUgc28gdGhhdCBob29rcyBjYW4gYmUgZXh0cmFjdGVkIGZyb20gaXQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQ1NTLlZhbHVlcy5pc0NTU051bGxWYWx1ZShub3JtYWxpemVkUHJvcGVydHlWYWx1ZSkgJiYgQ1NTLkhvb2tzLnRlbXBsYXRlc1twcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkUHJvcGVydHlWYWx1ZSA9IENTUy5Ib29rcy50ZW1wbGF0ZXNbcHJvcGVydHldWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW3Byb3BlcnR5XShcImV4dHJhY3RcIiwgZWxlbWVudCwgbm9ybWFsaXplZFByb3BlcnR5VmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qIElmIGEgKG51bWVyaWMpIHZhbHVlIHdhc24ndCBwcm9kdWNlZCB2aWEgaG9vayBleHRyYWN0aW9uIG9yIG5vcm1hbGl6YXRpb24sIHF1ZXJ5IHRoZSBET00uICovXG4gICAgICAgICAgICAgICAgaWYgKCEvXltcXGQtXS8udGVzdChwcm9wZXJ0eVZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAvKiBGb3IgU1ZHIGVsZW1lbnRzLCBkaW1lbnNpb25hbCBwcm9wZXJ0aWVzICh3aGljaCBTVkdBdHRyaWJ1dGUoKSBkZXRlY3RzKSBhcmUgdHdlZW5lZCB2aWFcbiAgICAgICAgICAgICAgICAgICAgIHRoZWlyIEhUTUwgYXR0cmlidXRlIHZhbHVlcyBpbnN0ZWFkIG9mIHRoZWlyIENTUyBzdHlsZSB2YWx1ZXMuICovXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gRGF0YShlbGVtZW50KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmlzU1ZHICYmIENTUy5OYW1lcy5TVkdBdHRyaWJ1dGUocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBTaW5jZSB0aGUgaGVpZ2h0L3dpZHRoIGF0dHJpYnV0ZSB2YWx1ZXMgbXVzdCBiZSBzZXQgbWFudWFsbHksIHRoZXkgZG9uJ3QgcmVmbGVjdCBjb21wdXRlZCB2YWx1ZXMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgVGh1cywgd2UgdXNlIHVzZSBnZXRCQm94KCkgdG8gZW5zdXJlIHdlIGFsd2F5cyBnZXQgdmFsdWVzIGZvciBlbGVtZW50cyB3aXRoIHVuZGVmaW5lZCBoZWlnaHQvd2lkdGggYXR0cmlidXRlcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgvXihoZWlnaHR8d2lkdGgpJC9pLnRlc3QocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRmlyZWZveCB0aHJvd3MgYW4gZXJyb3IgaWYgLmdldEJCb3goKSBpcyBjYWxsZWQgb24gYW4gU1ZHIHRoYXQgaXNuJ3QgYXR0YWNoZWQgdG8gdGhlIERPTS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gZWxlbWVudC5nZXRCQm94KClbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBPdGhlcndpc2UsIGFjY2VzcyB0aGUgYXR0cmlidXRlIHZhbHVlIGRpcmVjdGx5LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUocHJvcGVydHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IGNvbXB1dGVQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIENTUy5OYW1lcy5wcmVmaXhDaGVjayhwcm9wZXJ0eSlbMF0pOyAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qIFNpbmNlIHByb3BlcnR5IGxvb2t1cHMgYXJlIGZvciBhbmltYXRpb24gcHVycG9zZXMgKHdoaWNoIGVudGFpbHMgY29tcHV0aW5nIHRoZSBudW1lcmljIGRlbHRhIGJldHdlZW4gc3RhcnQgYW5kIGVuZCB2YWx1ZXMpLFxuICAgICAgICAgICAgICAgICBjb252ZXJ0IENTUyBudWxsLXZhbHVlcyB0byBhbiBpbnRlZ2VyIG9mIHZhbHVlIDAuICovXG4gICAgICAgICAgICAgICAgaWYgKENTUy5WYWx1ZXMuaXNDU1NOdWxsVmFsdWUocHJvcGVydHlWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKFZlbG9jaXR5LmRlYnVnID49IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJHZXQgXCIgKyBwcm9wZXJ0eSArIFwiOiBcIiArIHByb3BlcnR5VmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qIFRoZSBzaW5ndWxhciBzZXRQcm9wZXJ0eVZhbHVlLCB3aGljaCByb3V0ZXMgdGhlIGxvZ2ljIGZvciBhbGwgbm9ybWFsaXphdGlvbnMsIGhvb2tzLCBhbmQgc3RhbmRhcmQgQ1NTIHByb3BlcnRpZXMuICovXG4gICAgICAgICAgICBzZXRQcm9wZXJ0eVZhbHVlOiBmdW5jdGlvbihlbGVtZW50LCBwcm9wZXJ0eSwgcHJvcGVydHlWYWx1ZSwgcm9vdFByb3BlcnR5VmFsdWUsIHNjcm9sbERhdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlOYW1lID0gcHJvcGVydHk7XG5cbiAgICAgICAgICAgICAgICAvKiBJbiBvcmRlciB0byBiZSBzdWJqZWN0ZWQgdG8gY2FsbCBvcHRpb25zIGFuZCBlbGVtZW50IHF1ZXVlaW5nLCBzY3JvbGwgYW5pbWF0aW9uIGlzIHJvdXRlZCB0aHJvdWdoIFZlbG9jaXR5IGFzIGlmIGl0IHdlcmUgYSBzdGFuZGFyZCBDU1MgcHJvcGVydHkuICovXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09PSBcInNjcm9sbFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIElmIGEgY29udGFpbmVyIG9wdGlvbiBpcyBwcmVzZW50LCBzY3JvbGwgdGhlIGNvbnRhaW5lciBpbnN0ZWFkIG9mIHRoZSBicm93c2VyIHdpbmRvdy4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjcm9sbERhdGEuY29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxEYXRhLmNvbnRhaW5lcltcInNjcm9sbFwiICsgc2Nyb2xsRGF0YS5kaXJlY3Rpb25dID0gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE90aGVyd2lzZSwgVmVsb2NpdHkgZGVmYXVsdHMgdG8gc2Nyb2xsaW5nIHRoZSBicm93c2VyIHdpbmRvdy4gKi9cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY3JvbGxEYXRhLmRpcmVjdGlvbiA9PT0gXCJMZWZ0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8ocHJvcGVydHlWYWx1ZSwgc2Nyb2xsRGF0YS5hbHRlcm5hdGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyhzY3JvbGxEYXRhLmFsdGVybmF0ZVZhbHVlLCBwcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFRyYW5zZm9ybXMgKHRyYW5zbGF0ZVgsIHJvdGF0ZVosIGV0Yy4pIGFyZSBhcHBsaWVkIHRvIGEgcGVyLWVsZW1lbnQgdHJhbnNmb3JtQ2FjaGUgb2JqZWN0LCB3aGljaCBpcyBtYW51YWxseSBmbHVzaGVkIHZpYSBmbHVzaFRyYW5zZm9ybUNhY2hlKCkuXG4gICAgICAgICAgICAgICAgICAgICBUaHVzLCBmb3Igbm93LCB3ZSBtZXJlbHkgY2FjaGUgdHJhbnNmb3JtcyBiZWluZyBTRVQuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtwcm9wZXJ0eV0gJiYgQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbcHJvcGVydHldKFwibmFtZVwiLCBlbGVtZW50KSA9PT0gXCJ0cmFuc2Zvcm1cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogUGVyZm9ybSBhIG5vcm1hbGl6YXRpb24gaW5qZWN0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogVGhlIG5vcm1hbGl6YXRpb24gbG9naWMgaGFuZGxlcyB0aGUgdHJhbnNmb3JtQ2FjaGUgdXBkYXRpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtwcm9wZXJ0eV0oXCJpbmplY3RcIiwgZWxlbWVudCwgcHJvcGVydHlWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZSA9IFwidHJhbnNmb3JtXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZVtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJbmplY3QgaG9va3MuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQ1NTLkhvb2tzLnJlZ2lzdGVyZWRbcHJvcGVydHldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhvb2tOYW1lID0gcHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2tSb290ID0gQ1NTLkhvb2tzLmdldFJvb3QocHJvcGVydHkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgYSBjYWNoZWQgcm9vdFByb3BlcnR5VmFsdWUgd2FzIG5vdCBwcm92aWRlZCwgcXVlcnkgdGhlIERPTSBmb3IgdGhlIGhvb2tSb290J3MgY3VycmVudCB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSA9IHJvb3RQcm9wZXJ0eVZhbHVlIHx8IENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIGhvb2tSb290KTsgLyogR0VUICovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gQ1NTLkhvb2tzLmluamVjdFZhbHVlKGhvb2tOYW1lLCBwcm9wZXJ0eVZhbHVlLCByb290UHJvcGVydHlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkgPSBob29rUm9vdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogTm9ybWFsaXplIG5hbWVzIGFuZCB2YWx1ZXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbcHJvcGVydHldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW3Byb3BlcnR5XShcImluamVjdFwiLCBlbGVtZW50LCBwcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eSA9IENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW3Byb3BlcnR5XShcIm5hbWVcIiwgZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFzc2lnbiB0aGUgYXBwcm9wcmlhdGUgdmVuZG9yIHByZWZpeCBiZWZvcmUgcGVyZm9ybWluZyBhbiBvZmZpY2lhbCBzdHlsZSB1cGRhdGUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUgPSBDU1MuTmFtZXMucHJlZml4Q2hlY2socHJvcGVydHkpWzBdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBBIHRyeS9jYXRjaCBpcyB1c2VkIGZvciBJRTw9OCwgd2hpY2ggdGhyb3dzIGFuIGVycm9yIHdoZW4gXCJpbnZhbGlkXCIgQ1NTIHZhbHVlcyBhcmUgc2V0LCBlLmcuIGEgbmVnYXRpdmUgd2lkdGguXG4gICAgICAgICAgICAgICAgICAgICAgICAgVHJ5L2NhdGNoIGlzIGF2b2lkZWQgZm9yIG90aGVyIGJyb3dzZXJzIHNpbmNlIGl0IGluY3VycyBhIHBlcmZvcm1hbmNlIG92ZXJoZWFkLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKElFIDw9IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlW3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5kZWJ1Zykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJCcm93c2VyIGRvZXMgbm90IHN1cHBvcnQgW1wiICsgcHJvcGVydHlWYWx1ZSArIFwiXSBmb3IgW1wiICsgcHJvcGVydHlOYW1lICsgXCJdXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNWRyBlbGVtZW50cyBoYXZlIHRoZWlyIGRpbWVuc2lvbmFsIHByb3BlcnRpZXMgKHdpZHRoLCBoZWlnaHQsIHgsIHksIGN4LCBldGMuKSBhcHBsaWVkIGRpcmVjdGx5IGFzIGF0dHJpYnV0ZXMgaW5zdGVhZCBvZiBhcyBzdHlsZXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogSUU4IGRvZXMgbm90IHN1cHBvcnQgU1ZHIGVsZW1lbnRzLCBzbyBpdCdzIG9rYXkgdGhhdCB3ZSBza2lwIGl0IGZvciBTVkcgYW5pbWF0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IERhdGEoZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmlzU1ZHICYmIENTUy5OYW1lcy5TVkdBdHRyaWJ1dGUocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IEZvciBTVkcgYXR0cmlidXRlcywgdmVuZG9yLXByZWZpeGVkIHByb3BlcnR5IG5hbWVzIGFyZSBuZXZlciB1c2VkLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBOb3QgYWxsIENTUyBwcm9wZXJ0aWVzIGNhbiBiZSBhbmltYXRlZCB2aWEgYXR0cmlidXRlcywgYnV0IHRoZSBicm93c2VyIHdvbid0IHRocm93IGFuIGVycm9yIGZvciB1bnN1cHBvcnRlZCBwcm9wZXJ0aWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShwcm9wZXJ0eSwgcHJvcGVydHlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtwcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5kZWJ1ZyA+PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTZXQgXCIgKyBwcm9wZXJ0eSArIFwiIChcIiArIHByb3BlcnR5TmFtZSArIFwiKTogXCIgKyBwcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qIFJldHVybiB0aGUgbm9ybWFsaXplZCBwcm9wZXJ0eSBuYW1lIGFuZCB2YWx1ZSBpbiBjYXNlIHRoZSBjYWxsZXIgd2FudHMgdG8ga25vdyBob3cgdGhlc2UgdmFsdWVzIHdlcmUgbW9kaWZpZWQgYmVmb3JlIGJlaW5nIGFwcGxpZWQgdG8gdGhlIERPTS4gKi9cbiAgICAgICAgICAgICAgICByZXR1cm4gW3Byb3BlcnR5TmFtZSwgcHJvcGVydHlWYWx1ZV07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyogVG8gaW5jcmVhc2UgcGVyZm9ybWFuY2UgYnkgYmF0Y2hpbmcgdHJhbnNmb3JtIHVwZGF0ZXMgaW50byBhIHNpbmdsZSBTRVQsIHRyYW5zZm9ybXMgYXJlIG5vdCBkaXJlY3RseSBhcHBsaWVkIHRvIGFuIGVsZW1lbnQgdW50aWwgZmx1c2hUcmFuc2Zvcm1DYWNoZSgpIGlzIGNhbGxlZC4gKi9cbiAgICAgICAgICAgIC8qIE5vdGU6IFZlbG9jaXR5IGFwcGxpZXMgdHJhbnNmb3JtIHByb3BlcnRpZXMgaW4gdGhlIHNhbWUgb3JkZXIgdGhhdCB0aGV5IGFyZSBjaHJvbm9naWNhbGx5IGludHJvZHVjZWQgdG8gdGhlIGVsZW1lbnQncyBDU1Mgc3R5bGVzLiAqL1xuICAgICAgICAgICAgZmx1c2hUcmFuc2Zvcm1DYWNoZTogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHZhciB0cmFuc2Zvcm1TdHJpbmcgPSBcIlwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhID0gRGF0YShlbGVtZW50KTtcblxuICAgICAgICAgICAgICAgIC8qIENlcnRhaW4gYnJvd3NlcnMgcmVxdWlyZSB0aGF0IFNWRyB0cmFuc2Zvcm1zIGJlIGFwcGxpZWQgYXMgYW4gYXR0cmlidXRlLiBIb3dldmVyLCB0aGUgU1ZHIHRyYW5zZm9ybSBhdHRyaWJ1dGUgdGFrZXMgYSBtb2RpZmllZCB2ZXJzaW9uIG9mIENTUydzIHRyYW5zZm9ybSBzdHJpbmdcbiAgICAgICAgICAgICAgICAgKHVuaXRzIGFyZSBkcm9wcGVkIGFuZCwgZXhjZXB0IGZvciBza2V3WC9ZLCBzdWJwcm9wZXJ0aWVzIGFyZSBtZXJnZWQgaW50byB0aGVpciBtYXN0ZXIgcHJvcGVydHkgLS0gZS5nLiBzY2FsZVggYW5kIHNjYWxlWSBhcmUgbWVyZ2VkIGludG8gc2NhbGUoWCBZKS4gKi9cbiAgICAgICAgICAgICAgICBpZiAoKElFIHx8IChWZWxvY2l0eS5TdGF0ZS5pc0FuZHJvaWQgJiYgIVZlbG9jaXR5LlN0YXRlLmlzQ2hyb21lKSkgJiYgZGF0YSAmJiBkYXRhLmlzU1ZHKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFNpbmNlIHRyYW5zZm9ybSB2YWx1ZXMgYXJlIHN0b3JlZCBpbiB0aGVpciBwYXJlbnRoZXNlcy13cmFwcGVkIGZvcm0sIHdlIHVzZSBhIGhlbHBlciBmdW5jdGlvbiB0byBzdHJpcCBvdXQgdGhlaXIgbnVtZXJpYyB2YWx1ZXMuXG4gICAgICAgICAgICAgICAgICAgICBGdXJ0aGVyLCBTVkcgdHJhbnNmb3JtIHByb3BlcnRpZXMgb25seSB0YWtlIHVuaXRsZXNzIChyZXByZXNlbnRpbmcgcGl4ZWxzKSB2YWx1ZXMsIHNvIGl0J3Mgb2theSB0aGF0IHBhcnNlRmxvYXQoKSBzdHJpcHMgdGhlIHVuaXQgc3VmZml4ZWQgdG8gdGhlIGZsb2F0IHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgZ2V0VHJhbnNmb3JtRmxvYXQgPSBmdW5jdGlvbih0cmFuc2Zvcm1Qcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgdHJhbnNmb3JtUHJvcGVydHkpKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBDcmVhdGUgYW4gb2JqZWN0IHRvIG9yZ2FuaXplIGFsbCB0aGUgdHJhbnNmb3JtcyB0aGF0IHdlJ2xsIGFwcGx5IHRvIHRoZSBTVkcgZWxlbWVudC4gVG8ga2VlcCB0aGUgbG9naWMgc2ltcGxlLFxuICAgICAgICAgICAgICAgICAgICAgd2UgcHJvY2VzcyAqYWxsKiB0cmFuc2Zvcm0gcHJvcGVydGllcyAtLSBldmVuIHRob3NlIHRoYXQgbWF5IG5vdCBiZSBleHBsaWNpdGx5IGFwcGxpZWQgKHNpbmNlIHRoZXkgZGVmYXVsdCB0byB0aGVpciB6ZXJvLXZhbHVlcyBhbnl3YXkpLiAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgU1ZHVHJhbnNmb3JtcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZTogW2dldFRyYW5zZm9ybUZsb2F0KFwidHJhbnNsYXRlWFwiKSwgZ2V0VHJhbnNmb3JtRmxvYXQoXCJ0cmFuc2xhdGVZXCIpXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNrZXdYOiBbZ2V0VHJhbnNmb3JtRmxvYXQoXCJza2V3WFwiKV0sIHNrZXdZOiBbZ2V0VHJhbnNmb3JtRmxvYXQoXCJza2V3WVwiKV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgc2NhbGUgcHJvcGVydHkgaXMgc2V0IChub24tMSksIHVzZSB0aGF0IHZhbHVlIGZvciB0aGUgc2NhbGVYIGFuZCBzY2FsZVkgdmFsdWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMgYmVoYXZpb3IgbWltaWNzIHRoZSByZXN1bHQgb2YgYW5pbWF0aW5nIGFsbCB0aGVzZSBwcm9wZXJ0aWVzIGF0IG9uY2Ugb24gSFRNTCBlbGVtZW50cykuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogZ2V0VHJhbnNmb3JtRmxvYXQoXCJzY2FsZVwiKSAhPT0gMSA/IFtnZXRUcmFuc2Zvcm1GbG9hdChcInNjYWxlXCIpLCBnZXRUcmFuc2Zvcm1GbG9hdChcInNjYWxlXCIpXSA6IFtnZXRUcmFuc2Zvcm1GbG9hdChcInNjYWxlWFwiKSwgZ2V0VHJhbnNmb3JtRmxvYXQoXCJzY2FsZVlcIildLFxuICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogU1ZHJ3Mgcm90YXRlIHRyYW5zZm9ybSB0YWtlcyB0aHJlZSB2YWx1ZXM6IHJvdGF0aW9uIGRlZ3JlZXMgZm9sbG93ZWQgYnkgdGhlIFggYW5kIFkgdmFsdWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgZGVmaW5pbmcgdGhlIHJvdGF0aW9uJ3Mgb3JpZ2luIHBvaW50LiBXZSBpZ25vcmUgdGhlIG9yaWdpbiB2YWx1ZXMgKGRlZmF1bHQgdGhlbSB0byAwKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdGF0ZTogW2dldFRyYW5zZm9ybUZsb2F0KFwicm90YXRlWlwiKSwgMCwgMF1cbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggdGhlIHRyYW5zZm9ybSBwcm9wZXJ0aWVzIGluIHRoZSB1c2VyLWRlZmluZWQgcHJvcGVydHkgbWFwIG9yZGVyLlxuICAgICAgICAgICAgICAgICAgICAgKFRoaXMgbWltaWNzIHRoZSBiZWhhdmlvciBvZiBub24tU1ZHIHRyYW5zZm9ybSBhbmltYXRpb24uKSAqL1xuICAgICAgICAgICAgICAgICAgICAkLmVhY2goRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZSwgZnVuY3Rpb24odHJhbnNmb3JtTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogRXhjZXB0IGZvciB3aXRoIHNrZXdYL1ksIHJldmVydCB0aGUgYXhpcy1zcGVjaWZpYyB0cmFuc2Zvcm0gc3VicHJvcGVydGllcyB0byB0aGVpciBheGlzLWZyZWUgbWFzdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyBzbyB0aGF0IHRoZXkgbWF0Y2ggdXAgd2l0aCBTVkcncyBhY2NlcHRlZCB0cmFuc2Zvcm0gcHJvcGVydGllcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgvXnRyYW5zbGF0ZS9pLnRlc3QodHJhbnNmb3JtTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1OYW1lID0gXCJ0cmFuc2xhdGVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoL15zY2FsZS9pLnRlc3QodHJhbnNmb3JtTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1OYW1lID0gXCJzY2FsZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgvXnJvdGF0ZS9pLnRlc3QodHJhbnNmb3JtTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1OYW1lID0gXCJyb3RhdGVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2hlY2sgdGhhdCB3ZSBoYXZlbid0IHlldCBkZWxldGVkIHRoZSBwcm9wZXJ0eSBmcm9tIHRoZSBTVkdUcmFuc2Zvcm1zIGNvbnRhaW5lci4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTVkdUcmFuc2Zvcm1zW3RyYW5zZm9ybU5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQXBwZW5kIHRoZSB0cmFuc2Zvcm0gcHJvcGVydHkgaW4gdGhlIFNWRy1zdXBwb3J0ZWQgdHJhbnNmb3JtIGZvcm1hdC4gQXMgcGVyIHRoZSBzcGVjLCBzdXJyb3VuZCB0aGUgc3BhY2UtZGVsaW1pdGVkIHZhbHVlcyBpbiBwYXJlbnRoZXNlcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1TdHJpbmcgKz0gdHJhbnNmb3JtTmFtZSArIFwiKFwiICsgU1ZHVHJhbnNmb3Jtc1t0cmFuc2Zvcm1OYW1lXS5qb2luKFwiIFwiKSArIFwiKVwiICsgXCIgXCI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBBZnRlciBwcm9jZXNzaW5nIGFuIFNWRyB0cmFuc2Zvcm0gcHJvcGVydHksIGRlbGV0ZSBpdCBmcm9tIHRoZSBTVkdUcmFuc2Zvcm1zIGNvbnRhaW5lciBzbyB3ZSBkb24ndFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZS1pbnNlcnQgdGhlIHNhbWUgbWFzdGVyIHByb3BlcnR5IGlmIHdlIGVuY291bnRlciBhbm90aGVyIG9uZSBvZiBpdHMgYXhpcy1zcGVjaWZpYyBwcm9wZXJ0aWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBTVkdUcmFuc2Zvcm1zW3RyYW5zZm9ybU5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNmb3JtVmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJzcGVjdGl2ZTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBUcmFuc2Zvcm0gcHJvcGVydGllcyBhcmUgc3RvcmVkIGFzIG1lbWJlcnMgb2YgdGhlIHRyYW5zZm9ybUNhY2hlIG9iamVjdC4gQ29uY2F0ZW5hdGUgYWxsIHRoZSBtZW1iZXJzIGludG8gYSBzdHJpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlLCBmdW5jdGlvbih0cmFuc2Zvcm1OYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1WYWx1ZSA9IERhdGEoZWxlbWVudCkudHJhbnNmb3JtQ2FjaGVbdHJhbnNmb3JtTmFtZV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRyYW5zZm9ybSdzIHBlcnNwZWN0aXZlIHN1YnByb3BlcnR5IG11c3QgYmUgc2V0IGZpcnN0IGluIG9yZGVyIHRvIHRha2UgZWZmZWN0LiBTdG9yZSBpdCB0ZW1wb3JhcmlseS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cmFuc2Zvcm1OYW1lID09PSBcInRyYW5zZm9ybVBlcnNwZWN0aXZlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJzcGVjdGl2ZSA9IHRyYW5zZm9ybVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJRTkgb25seSBzdXBwb3J0cyBvbmUgcm90YXRpb24gdHlwZSwgcm90YXRlWiwgd2hpY2ggaXQgcmVmZXJzIHRvIGFzIFwicm90YXRlXCIuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoSUUgPT09IDkgJiYgdHJhbnNmb3JtTmFtZSA9PT0gXCJyb3RhdGVaXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1OYW1lID0gXCJyb3RhdGVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtU3RyaW5nICs9IHRyYW5zZm9ybU5hbWUgKyB0cmFuc2Zvcm1WYWx1ZSArIFwiIFwiO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBJZiBwcmVzZW50LCBzZXQgdGhlIHBlcnNwZWN0aXZlIHN1YnByb3BlcnR5IGZpcnN0LiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAocGVyc3BlY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybVN0cmluZyA9IFwicGVyc3BlY3RpdmVcIiArIHBlcnNwZWN0aXZlICsgXCIgXCIgKyB0cmFuc2Zvcm1TdHJpbmc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBDU1Muc2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcInRyYW5zZm9ybVwiLCB0cmFuc2Zvcm1TdHJpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qIFJlZ2lzdGVyIGhvb2tzIGFuZCBub3JtYWxpemF0aW9ucy4gKi9cbiAgICAgICAgQ1NTLkhvb2tzLnJlZ2lzdGVyKCk7XG4gICAgICAgIENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcigpO1xuXG4gICAgICAgIC8qIEFsbG93IGhvb2sgc2V0dGluZyBpbiB0aGUgc2FtZSBmYXNoaW9uIGFzIGpRdWVyeSdzICQuY3NzKCkuICovXG4gICAgICAgIFZlbG9jaXR5Lmhvb2sgPSBmdW5jdGlvbihlbGVtZW50cywgYXJnMiwgYXJnMykge1xuICAgICAgICAgICAgdmFyIHZhbHVlO1xuXG4gICAgICAgICAgICBlbGVtZW50cyA9IHNhbml0aXplRWxlbWVudHMoZWxlbWVudHMpO1xuXG4gICAgICAgICAgICAkLmVhY2goZWxlbWVudHMsIGZ1bmN0aW9uKGksIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAvKiBJbml0aWFsaXplIFZlbG9jaXR5J3MgcGVyLWVsZW1lbnQgZGF0YSBjYWNoZSBpZiB0aGlzIGVsZW1lbnQgaGFzbid0IHByZXZpb3VzbHkgYmVlbiBhbmltYXRlZC4gKi9cbiAgICAgICAgICAgICAgICBpZiAoRGF0YShlbGVtZW50KSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LmluaXQoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyogR2V0IHByb3BlcnR5IHZhbHVlLiBJZiBhbiBlbGVtZW50IHNldCB3YXMgcGFzc2VkIGluLCBvbmx5IHJldHVybiB0aGUgdmFsdWUgZm9yIHRoZSBmaXJzdCBlbGVtZW50LiAqL1xuICAgICAgICAgICAgICAgIGlmIChhcmczID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgYXJnMik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLyogU2V0IHByb3BlcnR5IHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIHNQViByZXR1cm5zIGFuIGFycmF5IG9mIHRoZSBub3JtYWxpemVkIHByb3BlcnR5TmFtZS9wcm9wZXJ0eVZhbHVlIHBhaXIgdXNlZCB0byB1cGRhdGUgdGhlIERPTS4gKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIGFkanVzdGVkU2V0ID0gQ1NTLnNldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgYXJnMiwgYXJnMyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogVHJhbnNmb3JtIHByb3BlcnRpZXMgZG9uJ3QgYXV0b21hdGljYWxseSBzZXQuIFRoZXkgaGF2ZSB0byBiZSBmbHVzaGVkIHRvIHRoZSBET00uICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChhZGp1c3RlZFNldFswXSA9PT0gXCJ0cmFuc2Zvcm1cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuQ1NTLmZsdXNoVHJhbnNmb3JtQ2FjaGUoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGFkanVzdGVkU2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqKioqKioqKioqKioqKioqXG4gICAgICAgICBBbmltYXRpb25cbiAgICAgICAgICoqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIHZhciBhbmltYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgb3B0cztcblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgIENhbGwgQ2hhaW5cbiAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIC8qIExvZ2ljIGZvciBkZXRlcm1pbmluZyB3aGF0IHRvIHJldHVybiB0byB0aGUgY2FsbCBzdGFjayB3aGVuIGV4aXRpbmcgb3V0IG9mIFZlbG9jaXR5LiAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0Q2hhaW4oKSB7XG4gICAgICAgICAgICAgICAgLyogSWYgd2UgYXJlIHVzaW5nIHRoZSB1dGlsaXR5IGZ1bmN0aW9uLCBhdHRlbXB0IHRvIHJldHVybiB0aGlzIGNhbGwncyBwcm9taXNlLiBJZiBubyBwcm9taXNlIGxpYnJhcnkgd2FzIGRldGVjdGVkLFxuICAgICAgICAgICAgICAgICBkZWZhdWx0IHRvIG51bGwgaW5zdGVhZCBvZiByZXR1cm5pbmcgdGhlIHRhcmdldGVkIGVsZW1lbnRzIHNvIHRoYXQgdXRpbGl0eSBmdW5jdGlvbidzIHJldHVybiB2YWx1ZSBpcyBzdGFuZGFyZGl6ZWQuICovXG4gICAgICAgICAgICAgICAgaWYgKGlzVXRpbGl0eSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZURhdGEucHJvbWlzZSB8fCBudWxsO1xuICAgICAgICAgICAgICAgICAgICAvKiBPdGhlcndpc2UsIGlmIHdlJ3JlIHVzaW5nICQuZm4sIHJldHVybiB0aGUgalF1ZXJ5LS9aZXB0by13cmFwcGVkIGVsZW1lbnQgc2V0LiAqL1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50c1dyYXBwZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgIEFyZ3VtZW50cyBBc3NpZ25tZW50XG4gICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgLyogVG8gYWxsb3cgZm9yIGV4cHJlc3NpdmUgQ29mZmVlU2NyaXB0IGNvZGUsIFZlbG9jaXR5IHN1cHBvcnRzIGFuIGFsdGVybmF0aXZlIHN5bnRheCBpbiB3aGljaCBcImVsZW1lbnRzXCIgKG9yIFwiZVwiKSwgXCJwcm9wZXJ0aWVzXCIgKG9yIFwicFwiKSwgYW5kIFwib3B0aW9uc1wiIChvciBcIm9cIilcbiAgICAgICAgICAgICBvYmplY3RzIGFyZSBkZWZpbmVkIG9uIGEgY29udGFpbmVyIG9iamVjdCB0aGF0J3MgcGFzc2VkIGluIGFzIFZlbG9jaXR5J3Mgc29sZSBhcmd1bWVudC4gKi9cbiAgICAgICAgICAgIC8qIE5vdGU6IFNvbWUgYnJvd3NlcnMgYXV0b21hdGljYWxseSBwb3B1bGF0ZSBhcmd1bWVudHMgd2l0aCBhIFwicHJvcGVydGllc1wiIG9iamVjdC4gV2UgZGV0ZWN0IGl0IGJ5IGNoZWNraW5nIGZvciBpdHMgZGVmYXVsdCBcIm5hbWVzXCIgcHJvcGVydHkuICovXG4gICAgICAgICAgICB2YXIgc3ludGFjdGljU3VnYXIgPSAoYXJndW1lbnRzWzBdICYmIChhcmd1bWVudHNbMF0ucCB8fCAoKCQuaXNQbGFpbk9iamVjdChhcmd1bWVudHNbMF0ucHJvcGVydGllcykgJiYgIWFyZ3VtZW50c1swXS5wcm9wZXJ0aWVzLm5hbWVzKSB8fCBUeXBlLmlzU3RyaW5nKGFyZ3VtZW50c1swXS5wcm9wZXJ0aWVzKSkpKSxcbiAgICAgICAgICAgICAgICAvKiBXaGV0aGVyIFZlbG9jaXR5IHdhcyBjYWxsZWQgdmlhIHRoZSB1dGlsaXR5IGZ1bmN0aW9uIChhcyBvcHBvc2VkIHRvIG9uIGEgalF1ZXJ5L1plcHRvIG9iamVjdCkuICovXG4gICAgICAgICAgICAgICAgaXNVdGlsaXR5LFxuICAgICAgICAgICAgICAgIC8qIFdoZW4gVmVsb2NpdHkgaXMgY2FsbGVkIHZpYSB0aGUgdXRpbGl0eSBmdW5jdGlvbiAoJC5WZWxvY2l0eSgpL1ZlbG9jaXR5KCkpLCBlbGVtZW50cyBhcmUgZXhwbGljaXRseVxuICAgICAgICAgICAgICAgICBwYXNzZWQgaW4gYXMgdGhlIGZpcnN0IHBhcmFtZXRlci4gVGh1cywgYXJndW1lbnQgcG9zaXRpb25pbmcgdmFyaWVzLiBXZSBub3JtYWxpemUgdGhlbSBoZXJlLiAqL1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzV3JhcHBlZCxcbiAgICAgICAgICAgICAgICBhcmd1bWVudEluZGV4O1xuXG4gICAgICAgICAgICB2YXIgZWxlbWVudHMsXG4gICAgICAgICAgICAgICAgcHJvcGVydGllc01hcCxcbiAgICAgICAgICAgICAgICBvcHRpb25zO1xuXG4gICAgICAgICAgICAvKiBEZXRlY3QgalF1ZXJ5L1plcHRvIGVsZW1lbnRzIGJlaW5nIGFuaW1hdGVkIHZpYSB0aGUgJC5mbiBtZXRob2QuICovXG4gICAgICAgICAgICBpZiAoVHlwZS5pc1dyYXBwZWQodGhpcykpIHtcbiAgICAgICAgICAgICAgICBpc1V0aWxpdHkgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGFyZ3VtZW50SW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzID0gdGhpcztcbiAgICAgICAgICAgICAgICBlbGVtZW50c1dyYXBwZWQgPSB0aGlzO1xuICAgICAgICAgICAgICAgIC8qIE90aGVyd2lzZSwgcmF3IGVsZW1lbnRzIGFyZSBiZWluZyBhbmltYXRlZCB2aWEgdGhlIHV0aWxpdHkgZnVuY3Rpb24uICovXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlzVXRpbGl0eSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBhcmd1bWVudEluZGV4ID0gMTtcbiAgICAgICAgICAgICAgICBlbGVtZW50cyA9IHN5bnRhY3RpY1N1Z2FyID8gKGFyZ3VtZW50c1swXS5lbGVtZW50cyB8fCBhcmd1bWVudHNbMF0uZSkgOiBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKipcbiAgICAgICAgICAgICBQcm9taXNlc1xuICAgICAgICAgICAgICoqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgdmFyIHByb21pc2VEYXRhID0ge1xuICAgICAgICAgICAgICAgIHByb21pc2U6IG51bGwsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZXI6IG51bGwsXG4gICAgICAgICAgICAgICAgcmVqZWN0ZXI6IG51bGxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8qIElmIHRoaXMgY2FsbCB3YXMgbWFkZSB2aWEgdGhlIHV0aWxpdHkgZnVuY3Rpb24gKHdoaWNoIGlzIHRoZSBkZWZhdWx0IG1ldGhvZCBvZiBpbnZvY2F0aW9uIHdoZW4galF1ZXJ5L1plcHRvIGFyZSBub3QgYmVpbmcgdXNlZCksIGFuZCBpZlxuICAgICAgICAgICAgIHByb21pc2Ugc3VwcG9ydCB3YXMgZGV0ZWN0ZWQsIGNyZWF0ZSBhIHByb21pc2Ugb2JqZWN0IGZvciB0aGlzIGNhbGwgYW5kIHN0b3JlIHJlZmVyZW5jZXMgdG8gaXRzIHJlc29sdmVyIGFuZCByZWplY3RlciBtZXRob2RzLiBUaGUgcmVzb2x2ZVxuICAgICAgICAgICAgIG1ldGhvZCBpcyB1c2VkIHdoZW4gYSBjYWxsIGNvbXBsZXRlcyBuYXR1cmFsbHkgb3IgaXMgcHJlbWF0dXJlbHkgc3RvcHBlZCBieSB0aGUgdXNlci4gSW4gYm90aCBjYXNlcywgY29tcGxldGVDYWxsKCkgaGFuZGxlcyB0aGUgYXNzb2NpYXRlZFxuICAgICAgICAgICAgIGNhbGwgY2xlYW51cCBhbmQgcHJvbWlzZSByZXNvbHZpbmcgbG9naWMuIFRoZSByZWplY3QgbWV0aG9kIGlzIHVzZWQgd2hlbiBhbiBpbnZhbGlkIHNldCBvZiBhcmd1bWVudHMgaXMgcGFzc2VkIGludG8gYSBWZWxvY2l0eSBjYWxsLiAqL1xuICAgICAgICAgICAgLyogTm90ZTogVmVsb2NpdHkgZW1wbG95cyBhIGNhbGwtYmFzZWQgcXVldWVpbmcgYXJjaGl0ZWN0dXJlLCB3aGljaCBtZWFucyB0aGF0IHN0b3BwaW5nIGFuIGFuaW1hdGluZyBlbGVtZW50IGFjdHVhbGx5IHN0b3BzIHRoZSBmdWxsIGNhbGwgdGhhdFxuICAgICAgICAgICAgIHRyaWdnZXJlZCBpdCAtLSBub3QgdGhhdCBvbmUgZWxlbWVudCBleGNsdXNpdmVseS4gU2ltaWxhcmx5LCB0aGVyZSBpcyBvbmUgcHJvbWlzZSBwZXIgY2FsbCwgYW5kIGFsbCBlbGVtZW50cyB0YXJnZXRlZCBieSBhIFZlbG9jaXR5IGNhbGwgYXJlXG4gICAgICAgICAgICAgZ3JvdXBlZCB0b2dldGhlciBmb3IgdGhlIHB1cnBvc2VzIG9mIHJlc29sdmluZyBhbmQgcmVqZWN0aW5nIGEgcHJvbWlzZS4gKi9cbiAgICAgICAgICAgIGlmIChpc1V0aWxpdHkgJiYgVmVsb2NpdHkuUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIHByb21pc2VEYXRhLnByb21pc2UgPSBuZXcgVmVsb2NpdHkuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZURhdGEucmVzb2x2ZXIgPSByZXNvbHZlO1xuICAgICAgICAgICAgICAgICAgICBwcm9taXNlRGF0YS5yZWplY3RlciA9IHJlamVjdDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN5bnRhY3RpY1N1Z2FyKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllc01hcCA9IGFyZ3VtZW50c1swXS5wcm9wZXJ0aWVzIHx8IGFyZ3VtZW50c1swXS5wO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBhcmd1bWVudHNbMF0ub3B0aW9ucyB8fCBhcmd1bWVudHNbMF0ubztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllc01hcCA9IGFyZ3VtZW50c1thcmd1bWVudEluZGV4XTtcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gYXJndW1lbnRzW2FyZ3VtZW50SW5kZXggKyAxXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZWxlbWVudHMgPSBzYW5pdGl6ZUVsZW1lbnRzKGVsZW1lbnRzKTtcblxuICAgICAgICAgICAgaWYgKCFlbGVtZW50cykge1xuICAgICAgICAgICAgICAgIGlmIChwcm9taXNlRGF0YS5wcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcHJvcGVydGllc01hcCB8fCAhb3B0aW9ucyB8fCBvcHRpb25zLnByb21pc2VSZWplY3RFbXB0eSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VEYXRhLnJlamVjdGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlRGF0YS5yZXNvbHZlcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogVGhlIGxlbmd0aCBvZiB0aGUgZWxlbWVudCBzZXQgKGluIHRoZSBmb3JtIG9mIGEgbm9kZUxpc3Qgb3IgYW4gYXJyYXkgb2YgZWxlbWVudHMpIGlzIGRlZmF1bHRlZCB0byAxIGluIGNhc2UgYVxuICAgICAgICAgICAgIHNpbmdsZSByYXcgRE9NIGVsZW1lbnQgaXMgcGFzc2VkIGluICh3aGljaCBkb2Vzbid0IGNvbnRhaW4gYSBsZW5ndGggcHJvcGVydHkpLiAqL1xuICAgICAgICAgICAgdmFyIGVsZW1lbnRzTGVuZ3RoID0gZWxlbWVudHMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGVsZW1lbnRzSW5kZXggPSAwO1xuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgQXJndW1lbnQgT3ZlcmxvYWRpbmdcbiAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIC8qIFN1cHBvcnQgaXMgaW5jbHVkZWQgZm9yIGpRdWVyeSdzIGFyZ3VtZW50IG92ZXJsb2FkaW5nOiAkLmFuaW1hdGUocHJvcGVydHlNYXAgWywgZHVyYXRpb25dIFssIGVhc2luZ10gWywgY29tcGxldGVdKS5cbiAgICAgICAgICAgICBPdmVybG9hZGluZyBpcyBkZXRlY3RlZCBieSBjaGVja2luZyBmb3IgdGhlIGFic2VuY2Ugb2YgYW4gb2JqZWN0IGJlaW5nIHBhc3NlZCBpbnRvIG9wdGlvbnMuICovXG4gICAgICAgICAgICAvKiBOb3RlOiBUaGUgc3RvcC9maW5pc2gvcGF1c2UvcmVzdW1lIGFjdGlvbnMgZG8gbm90IGFjY2VwdCBhbmltYXRpb24gb3B0aW9ucywgYW5kIGFyZSB0aGVyZWZvcmUgZXhjbHVkZWQgZnJvbSB0aGlzIGNoZWNrLiAqL1xuICAgICAgICAgICAgaWYgKCEvXihzdG9wfGZpbmlzaHxmaW5pc2hBbGx8cGF1c2V8cmVzdW1lKSQvaS50ZXN0KHByb3BlcnRpZXNNYXApICYmICEkLmlzUGxhaW5PYmplY3Qob3B0aW9ucykpIHtcbiAgICAgICAgICAgICAgICAvKiBUaGUgdXRpbGl0eSBmdW5jdGlvbiBzaGlmdHMgYWxsIGFyZ3VtZW50cyBvbmUgcG9zaXRpb24gdG8gdGhlIHJpZ2h0LCBzbyB3ZSBhZGp1c3QgZm9yIHRoYXQgb2Zmc2V0LiAqL1xuICAgICAgICAgICAgICAgIHZhciBzdGFydGluZ0FyZ3VtZW50UG9zaXRpb24gPSBhcmd1bWVudEluZGV4ICsgMTtcblxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcblxuICAgICAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCBhbGwgb3B0aW9ucyBhcmd1bWVudHMgKi9cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gc3RhcnRpbmdBcmd1bWVudFBvc2l0aW9uOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFRyZWF0IGEgbnVtYmVyIGFzIGEgZHVyYXRpb24uIFBhcnNlIGl0IG91dC4gKi9cbiAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogVGhlIGZvbGxvd2luZyBSZWdFeCB3aWxsIHJldHVybiB0cnVlIGlmIHBhc3NlZCBhbiBhcnJheSB3aXRoIGEgbnVtYmVyIGFzIGl0cyBmaXJzdCBpdGVtLlxuICAgICAgICAgICAgICAgICAgICAgVGh1cywgYXJyYXlzIGFyZSBza2lwcGVkIGZyb20gdGhpcyBjaGVjay4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFUeXBlLmlzQXJyYXkoYXJndW1lbnRzW2ldKSAmJiAoL14oZmFzdHxub3JtYWx8c2xvdykkL2kudGVzdChhcmd1bWVudHNbaV0pIHx8IC9eXFxkLy50ZXN0KGFyZ3VtZW50c1tpXSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmR1cmF0aW9uID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogVHJlYXQgc3RyaW5ncyBhbmQgYXJyYXlzIGFzIGVhc2luZ3MuICovXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoVHlwZS5pc1N0cmluZyhhcmd1bWVudHNbaV0pIHx8IFR5cGUuaXNBcnJheShhcmd1bWVudHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmVhc2luZyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRyZWF0IGEgZnVuY3Rpb24gYXMgYSBjb21wbGV0ZSBjYWxsYmFjay4gKi9cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChUeXBlLmlzRnVuY3Rpb24oYXJndW1lbnRzW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5jb21wbGV0ZSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgIEFjdGlvbiBEZXRlY3Rpb25cbiAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIC8qIFZlbG9jaXR5J3MgYmVoYXZpb3IgaXMgY2F0ZWdvcml6ZWQgaW50byBcImFjdGlvbnNcIjogRWxlbWVudHMgY2FuIGVpdGhlciBiZSBzcGVjaWFsbHkgc2Nyb2xsZWQgaW50byB2aWV3LFxuICAgICAgICAgICAgIG9yIHRoZXkgY2FuIGJlIHN0YXJ0ZWQsIHN0b3BwZWQsIHBhdXNlZCwgcmVzdW1lZCwgb3IgcmV2ZXJzZWQgLiBJZiBhIGxpdGVyYWwgb3IgcmVmZXJlbmNlZCBwcm9wZXJ0aWVzIG1hcCBpcyBwYXNzZWQgaW4gYXMgVmVsb2NpdHknc1xuICAgICAgICAgICAgIGZpcnN0IGFyZ3VtZW50LCB0aGUgYXNzb2NpYXRlZCBhY3Rpb24gaXMgXCJzdGFydFwiLiBBbHRlcm5hdGl2ZWx5LCBcInNjcm9sbFwiLCBcInJldmVyc2VcIiwgXCJwYXVzZVwiLCBcInJlc3VtZVwiIG9yIFwic3RvcFwiIGNhbiBiZSBwYXNzZWQgaW5cbiAgICAgICAgICAgICBpbnN0ZWFkIG9mIGEgcHJvcGVydGllcyBtYXAuICovXG4gICAgICAgICAgICB2YXIgYWN0aW9uO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHByb3BlcnRpZXNNYXApIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwic2Nyb2xsXCI6XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbiA9IFwic2Nyb2xsXCI7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBcInJldmVyc2VcIjpcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uID0gXCJyZXZlcnNlXCI7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBcInBhdXNlXCI6XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgIEFjdGlvbjogUGF1c2VcbiAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRUaW1lID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBIYW5kbGUgZGVsYXkgdGltZXJzICovXG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChlbGVtZW50cywgZnVuY3Rpb24oaSwgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF1c2VEZWxheU9uRWxlbWVudChlbGVtZW50LCBjdXJyZW50VGltZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIFBhdXNlIGFuZCBSZXN1bWUgYXJlIGNhbGwtd2lkZSAobm90IG9uIGEgcGVyIGVsZW1lbnQgYmFzaXMpLiBUaHVzLCBjYWxsaW5nIHBhdXNlIG9yIHJlc3VtZSBvbiBhXG4gICAgICAgICAgICAgICAgICAgICBzaW5nbGUgZWxlbWVudCB3aWxsIGNhdXNlIGFueSBjYWxscyB0aGF0IGNvbnRhaW50IHR3ZWVucyBmb3IgdGhhdCBlbGVtZW50IHRvIGJlIHBhdXNlZC9yZXN1bWVkXG4gICAgICAgICAgICAgICAgICAgICBhcyB3ZWxsLiAqL1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCBhbGwgY2FsbHMgYW5kIHBhdXNlIGFueSB0aGF0IGNvbnRhaW4gYW55IG9mIG91ciBlbGVtZW50cyAqL1xuICAgICAgICAgICAgICAgICAgICAkLmVhY2goVmVsb2NpdHkuU3RhdGUuY2FsbHMsIGZ1bmN0aW9uKGksIGFjdGl2ZUNhbGwpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJbmFjdGl2ZSBjYWxscyBhcmUgc2V0IHRvIGZhbHNlIGJ5IHRoZSBsb2dpYyBpbnNpZGUgY29tcGxldGVDYWxsKCkuIFNraXAgdGhlbS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVDYWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSXRlcmF0ZSB0aHJvdWdoIHRoZSBhY3RpdmUgY2FsbCdzIHRhcmdldGVkIGVsZW1lbnRzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChhY3RpdmVDYWxsWzFdLCBmdW5jdGlvbihrLCBhY3RpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBxdWV1ZU5hbWUgPSAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiBvcHRpb25zO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxdWV1ZU5hbWUgIT09IHRydWUgJiYgKGFjdGl2ZUNhbGxbMl0ucXVldWUgIT09IHF1ZXVlTmFtZSkgJiYgIShvcHRpb25zID09PSB1bmRlZmluZWQgJiYgYWN0aXZlQ2FsbFsyXS5xdWV1ZSA9PT0gZmFsc2UpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCB0aGUgY2FsbHMgdGFyZ2V0ZWQgYnkgdGhlIHN0b3AgY29tbWFuZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbihsLCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDaGVjayB0aGF0IHRoaXMgY2FsbCB3YXMgYXBwbGllZCB0byB0aGUgdGFyZ2V0IGVsZW1lbnQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCA9PT0gYWN0aXZlRWxlbWVudCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU2V0IGNhbGwgdG8gcGF1c2VkICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlQ2FsbFs1XSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdW1lOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBPbmNlIHdlIG1hdGNoIGFuIGVsZW1lbnQsIHdlIGNhbiBib3VuY2Ugb3V0IHRvIHRoZSBuZXh0IGNhbGwgZW50aXJlbHkgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBQcm9jZWVkIHRvIGNoZWNrIG5leHQgY2FsbCBpZiB3ZSBoYXZlIGFscmVhZHkgbWF0Y2hlZCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIFNpbmNlIHBhdXNlIGNyZWF0ZXMgbm8gbmV3IHR3ZWVucywgZXhpdCBvdXQgb2YgVmVsb2NpdHkuICovXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRDaGFpbigpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBcInJlc3VtZVwiOlxuXG4gICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICBBY3Rpb246IFJlc3VtZVxuICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAvKiBIYW5kbGUgZGVsYXkgdGltZXJzICovXG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChlbGVtZW50cywgZnVuY3Rpb24oaSwgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdW1lRGVsYXlPbkVsZW1lbnQoZWxlbWVudCwgY3VycmVudFRpbWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBQYXVzZSBhbmQgUmVzdW1lIGFyZSBjYWxsLXdpZGUgKG5vdCBvbiBhIHBlciBlbGVtbnQgYmFzaXMpLiBUaHVzLCBjYWxsaW5nIHBhdXNlIG9yIHJlc3VtZSBvbiBhXG4gICAgICAgICAgICAgICAgICAgICBzaW5nbGUgZWxlbWVudCB3aWxsIGNhdXNlIGFueSBjYWxscyB0aGF0IGNvbnRhaW50IHR3ZWVucyBmb3IgdGhhdCBlbGVtZW50IHRvIGJlIHBhdXNlZC9yZXN1bWVkXG4gICAgICAgICAgICAgICAgICAgICBhcyB3ZWxsLiAqL1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCBhbGwgY2FsbHMgYW5kIHBhdXNlIGFueSB0aGF0IGNvbnRhaW4gYW55IG9mIG91ciBlbGVtZW50cyAqL1xuICAgICAgICAgICAgICAgICAgICAkLmVhY2goVmVsb2NpdHkuU3RhdGUuY2FsbHMsIGZ1bmN0aW9uKGksIGFjdGl2ZUNhbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogSW5hY3RpdmUgY2FsbHMgYXJlIHNldCB0byBmYWxzZSBieSB0aGUgbG9naWMgaW5zaWRlIGNvbXBsZXRlQ2FsbCgpLiBTa2lwIHRoZW0uICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQ2FsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCB0aGUgYWN0aXZlIGNhbGwncyB0YXJnZXRlZCBlbGVtZW50cy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goYWN0aXZlQ2FsbFsxXSwgZnVuY3Rpb24oaywgYWN0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcXVldWVOYW1lID0gKG9wdGlvbnMgPT09IHVuZGVmaW5lZCkgPyBcIlwiIDogb3B0aW9ucztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocXVldWVOYW1lICE9PSB0cnVlICYmIChhY3RpdmVDYWxsWzJdLnF1ZXVlICE9PSBxdWV1ZU5hbWUpICYmICEob3B0aW9ucyA9PT0gdW5kZWZpbmVkICYmIGFjdGl2ZUNhbGxbMl0ucXVldWUgPT09IGZhbHNlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTa2lwIGFueSBjYWxscyB0aGF0IGhhdmUgbmV2ZXIgYmVlbiBwYXVzZWQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhY3RpdmVDYWxsWzVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCB0aGUgY2FsbHMgdGFyZ2V0ZWQgYnkgdGhlIHN0b3AgY29tbWFuZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbihsLCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDaGVjayB0aGF0IHRoaXMgY2FsbCB3YXMgYXBwbGllZCB0byB0aGUgdGFyZ2V0IGVsZW1lbnQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCA9PT0gYWN0aXZlRWxlbWVudCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRmxhZyBhIHBhdXNlIG9iamVjdCB0byBiZSByZXN1bWVkLCB3aGljaCB3aWxsIG9jY3VyIGR1cmluZyB0aGUgbmV4dCB0aWNrLiBJblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbiwgdGhlIHBhdXNlIG9iamVjdCB3aWxsIGF0IHRoYXQgdGltZSBiZSBkZWxldGVkICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlQ2FsbFs1XS5yZXN1bWUgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogT25jZSB3ZSBtYXRjaCBhbiBlbGVtZW50LCB3ZSBjYW4gYm91bmNlIG91dCB0byB0aGUgbmV4dCBjYWxsIGVudGlyZWx5ICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogUHJvY2VlZCB0byBjaGVjayBuZXh0IGNhbGwgaWYgd2UgaGF2ZSBhbHJlYWR5IG1hdGNoZWQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBTaW5jZSByZXN1bWUgY3JlYXRlcyBubyBuZXcgdHdlZW5zLCBleGl0IG91dCBvZiBWZWxvY2l0eS4gKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldENoYWluKCk7XG5cbiAgICAgICAgICAgICAgICBjYXNlIFwiZmluaXNoXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcImZpbmlzaEFsbFwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJzdG9wXCI6XG4gICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICBBY3Rpb246IFN0b3BcbiAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgLyogQ2xlYXIgdGhlIGN1cnJlbnRseS1hY3RpdmUgZGVsYXkgb24gZWFjaCB0YXJnZXRlZCBlbGVtZW50LiAqL1xuICAgICAgICAgICAgICAgICAgICAkLmVhY2goZWxlbWVudHMsIGZ1bmN0aW9uKGksIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChEYXRhKGVsZW1lbnQpICYmIERhdGEoZWxlbWVudCkuZGVsYXlUaW1lcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFN0b3AgdGhlIHRpbWVyIGZyb20gdHJpZ2dlcmluZyBpdHMgY2FjaGVkIG5leHQoKSBmdW5jdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoRGF0YShlbGVtZW50KS5kZWxheVRpbWVyLnNldFRpbWVvdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTWFudWFsbHkgY2FsbCB0aGUgbmV4dCgpIGZ1bmN0aW9uIHNvIHRoYXQgdGhlIHN1YnNlcXVlbnQgcXVldWUgaXRlbXMgY2FuIHByb2dyZXNzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChEYXRhKGVsZW1lbnQpLmRlbGF5VGltZXIubmV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLmRlbGF5VGltZXIubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBEYXRhKGVsZW1lbnQpLmRlbGF5VGltZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHdlIHdhbnQgdG8gZmluaXNoIGV2ZXJ5dGhpbmcgaW4gdGhlIHF1ZXVlLCB3ZSBoYXZlIHRvIGl0ZXJhdGUgdGhyb3VnaCBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgIGFuZCBjYWxsIGVhY2ggZnVuY3Rpb24uIFRoaXMgd2lsbCBtYWtlIHRoZW0gYWN0aXZlIGNhbGxzIGJlbG93LCB3aGljaCB3aWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgY2F1c2UgdGhlbSB0byBiZSBhcHBsaWVkIHZpYSB0aGUgZHVyYXRpb24gc2V0dGluZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzTWFwID09PSBcImZpbmlzaEFsbFwiICYmIChvcHRpb25zID09PSB0cnVlIHx8IFR5cGUuaXNTdHJpbmcob3B0aW9ucykpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSXRlcmF0ZSB0aHJvdWdoIHRoZSBpdGVtcyBpbiB0aGUgZWxlbWVudCdzIHF1ZXVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaCgkLnF1ZXVlKGVsZW1lbnQsIFR5cGUuaXNTdHJpbmcob3B0aW9ucykgPyBvcHRpb25zIDogXCJcIiksIGZ1bmN0aW9uKF8sIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVGhlIHF1ZXVlIGFycmF5IGNhbiBjb250YWluIGFuIFwiaW5wcm9ncmVzc1wiIHN0cmluZywgd2hpY2ggd2Ugc2tpcC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFR5cGUuaXNGdW5jdGlvbihpdGVtKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDbGVhcmluZyB0aGUgJC5xdWV1ZSgpIGFycmF5IGlzIGFjaGlldmVkIGJ5IHJlc2V0dGluZyBpdCB0byBbXS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLnF1ZXVlKGVsZW1lbnQsIFR5cGUuaXNTdHJpbmcob3B0aW9ucykgPyBvcHRpb25zIDogXCJcIiwgW10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgY2FsbHNUb1N0b3AgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBXaGVuIHRoZSBzdG9wIGFjdGlvbiBpcyB0cmlnZ2VyZWQsIHRoZSBlbGVtZW50cycgY3VycmVudGx5IGFjdGl2ZSBjYWxsIGlzIGltbWVkaWF0ZWx5IHN0b3BwZWQuIFRoZSBhY3RpdmUgY2FsbCBtaWdodCBoYXZlXG4gICAgICAgICAgICAgICAgICAgICBiZWVuIGFwcGxpZWQgdG8gbXVsdGlwbGUgZWxlbWVudHMsIGluIHdoaWNoIGNhc2UgYWxsIG9mIHRoZSBjYWxsJ3MgZWxlbWVudHMgd2lsbCBiZSBzdG9wcGVkLiBXaGVuIGFuIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgIGlzIHN0b3BwZWQsIHRoZSBuZXh0IGl0ZW0gaW4gaXRzIGFuaW1hdGlvbiBxdWV1ZSBpcyBpbW1lZGlhdGVseSB0cmlnZ2VyZWQuICovXG4gICAgICAgICAgICAgICAgICAgIC8qIEFuIGFkZGl0aW9uYWwgYXJndW1lbnQgbWF5IGJlIHBhc3NlZCBpbiB0byBjbGVhciBhbiBlbGVtZW50J3MgcmVtYWluaW5nIHF1ZXVlZCBjYWxscy4gRWl0aGVyIHRydWUgKHdoaWNoIGRlZmF1bHRzIHRvIHRoZSBcImZ4XCIgcXVldWUpXG4gICAgICAgICAgICAgICAgICAgICBvciBhIGN1c3RvbSBxdWV1ZSBzdHJpbmcgY2FuIGJlIHBhc3NlZCBpbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogVGhlIHN0b3AgY29tbWFuZCBydW5zIHByaW9yIHRvIFZlbG9jaXR5J3MgUXVldWVpbmcgcGhhc2Ugc2luY2UgaXRzIGJlaGF2aW9yIGlzIGludGVuZGVkIHRvIHRha2UgZWZmZWN0ICppbW1lZGlhdGVseSosXG4gICAgICAgICAgICAgICAgICAgICByZWdhcmRsZXNzIG9mIHRoZSBlbGVtZW50J3MgY3VycmVudCBxdWV1ZSBzdGF0ZS4gKi9cblxuICAgICAgICAgICAgICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggZXZlcnkgYWN0aXZlIGNhbGwuICovXG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChWZWxvY2l0eS5TdGF0ZS5jYWxscywgZnVuY3Rpb24oaSwgYWN0aXZlQ2FsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogSW5hY3RpdmUgY2FsbHMgYXJlIHNldCB0byBmYWxzZSBieSB0aGUgbG9naWMgaW5zaWRlIGNvbXBsZXRlQ2FsbCgpLiBTa2lwIHRoZW0uICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQ2FsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCB0aGUgYWN0aXZlIGNhbGwncyB0YXJnZXRlZCBlbGVtZW50cy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goYWN0aXZlQ2FsbFsxXSwgZnVuY3Rpb24oaywgYWN0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0cnVlIHdhcyBwYXNzZWQgaW4gYXMgYSBzZWNvbmRhcnkgYXJndW1lbnQsIGNsZWFyIGFic29sdXRlbHkgYWxsIGNhbGxzIG9uIHRoaXMgZWxlbWVudC4gT3RoZXJ3aXNlLCBvbmx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhciBjYWxscyBhc3NvY2lhdGVkIHdpdGggdGhlIHJlbGV2YW50IHF1ZXVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDYWxsIHN0b3BwaW5nIGxvZ2ljIHdvcmtzIGFzIGZvbGxvd3M6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIG9wdGlvbnMgPT09IHRydWUgLS0+IHN0b3AgY3VycmVudCBkZWZhdWx0IHF1ZXVlIGNhbGxzIChhbmQgcXVldWU6ZmFsc2UgY2FsbHMpLCBpbmNsdWRpbmcgcmVtYWluaW5nIHF1ZXVlZCBvbmVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBvcHRpb25zID09PSB1bmRlZmluZWQgLS0+IHN0b3AgY3VycmVudCBxdWV1ZTpcIlwiIGNhbGwgYW5kIGFsbCBxdWV1ZTpmYWxzZSBjYWxscy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gb3B0aW9ucyA9PT0gZmFsc2UgLS0+IHN0b3Agb25seSBxdWV1ZTpmYWxzZSBjYWxscy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gb3B0aW9ucyA9PT0gXCJjdXN0b21cIiAtLT4gc3RvcCBjdXJyZW50IHF1ZXVlOlwiY3VzdG9tXCIgY2FsbCwgaW5jbHVkaW5nIHJlbWFpbmluZyBxdWV1ZWQgb25lcyAodGhlcmUgaXMgbm8gZnVuY3Rpb25hbGl0eSB0byBvbmx5IGNsZWFyIHRoZSBjdXJyZW50bHktcnVubmluZyBxdWV1ZTpcImN1c3RvbVwiIGNhbGwpLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcXVldWVOYW1lID0gKG9wdGlvbnMgPT09IHVuZGVmaW5lZCkgPyBcIlwiIDogb3B0aW9ucztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocXVldWVOYW1lICE9PSB0cnVlICYmIChhY3RpdmVDYWxsWzJdLnF1ZXVlICE9PSBxdWV1ZU5hbWUpICYmICEob3B0aW9ucyA9PT0gdW5kZWZpbmVkICYmIGFjdGl2ZUNhbGxbMl0ucXVldWUgPT09IGZhbHNlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggdGhlIGNhbGxzIHRhcmdldGVkIGJ5IHRoZSBzdG9wIGNvbW1hbmQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChlbGVtZW50cywgZnVuY3Rpb24obCwgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2hlY2sgdGhhdCB0aGlzIGNhbGwgd2FzIGFwcGxpZWQgdG8gdGhlIHRhcmdldCBlbGVtZW50LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQgPT09IGFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBPcHRpb25hbGx5IGNsZWFyIHRoZSByZW1haW5pbmcgcXVldWVkIGNhbGxzLiBJZiB3ZSdyZSBkb2luZyBcImZpbmlzaEFsbFwiIHRoaXMgd29uJ3QgZmluZCBhbnl0aGluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVlIHRvIHRoZSBxdWV1ZS1jbGVhcmluZyBhYm92ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyA9PT0gdHJ1ZSB8fCBUeXBlLmlzU3RyaW5nKG9wdGlvbnMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCB0aGUgaXRlbXMgaW4gdGhlIGVsZW1lbnQncyBxdWV1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKCQucXVldWUoZWxlbWVudCwgVHlwZS5pc1N0cmluZyhvcHRpb25zKSA/IG9wdGlvbnMgOiBcIlwiKSwgZnVuY3Rpb24oXywgaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVGhlIHF1ZXVlIGFycmF5IGNhbiBjb250YWluIGFuIFwiaW5wcm9ncmVzc1wiIHN0cmluZywgd2hpY2ggd2Ugc2tpcC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUeXBlLmlzRnVuY3Rpb24oaXRlbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBQYXNzIHRoZSBpdGVtJ3MgY2FsbGJhY2sgYSBmbGFnIGluZGljYXRpbmcgdGhhdCB3ZSB3YW50IHRvIGFib3J0IGZyb20gdGhlIHF1ZXVlIGNhbGwuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChTcGVjaWZpY2FsbHksIHRoZSBxdWV1ZSB3aWxsIHJlc29sdmUgdGhlIGNhbGwncyBhc3NvY2lhdGVkIHByb21pc2UgdGhlbiBhYm9ydC4pICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0obnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENsZWFyaW5nIHRoZSAkLnF1ZXVlKCkgYXJyYXkgaXMgYWNoaWV2ZWQgYnkgcmVzZXR0aW5nIGl0IHRvIFtdLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLnF1ZXVlKGVsZW1lbnQsIFR5cGUuaXNTdHJpbmcob3B0aW9ucykgPyBvcHRpb25zIDogXCJcIiwgW10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzTWFwID09PSBcInN0b3BcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTaW5jZSBcInJldmVyc2VcIiB1c2VzIGNhY2hlZCBzdGFydCB2YWx1ZXMgKHRoZSBwcmV2aW91cyBjYWxsJ3MgZW5kVmFsdWVzKSwgdGhlc2UgdmFsdWVzIG11c3QgYmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWQgdG8gcmVmbGVjdCB0aGUgZmluYWwgdmFsdWUgdGhhdCB0aGUgZWxlbWVudHMgd2VyZSBhY3R1YWxseSB0d2VlbmVkIHRvLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBJZiBvbmx5IHF1ZXVlOmZhbHNlIGFuaW1hdGlvbnMgYXJlIGN1cnJlbnRseSBydW5uaW5nIG9uIGFuIGVsZW1lbnQsIGl0IHdvbid0IGhhdmUgYSB0d2VlbnNDb250YWluZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC4gQWxzbywgcXVldWU6ZmFsc2UgYW5pbWF0aW9ucyBjYW4ndCBiZSByZXZlcnNlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBEYXRhKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLnR3ZWVuc0NvbnRhaW5lciAmJiBxdWV1ZU5hbWUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goZGF0YS50d2VlbnNDb250YWluZXIsIGZ1bmN0aW9uKG0sIGFjdGl2ZVR3ZWVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlVHdlZW4uZW5kVmFsdWUgPSBhY3RpdmVUd2Vlbi5jdXJyZW50VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxzVG9TdG9wLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wZXJ0aWVzTWFwID09PSBcImZpbmlzaFwiIHx8IHByb3BlcnRpZXNNYXAgPT09IFwiZmluaXNoQWxsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVG8gZ2V0IGFjdGl2ZSB0d2VlbnMgdG8gZmluaXNoIGltbWVkaWF0ZWx5LCB3ZSBmb3JjZWZ1bGx5IHNob3J0ZW4gdGhlaXIgZHVyYXRpb25zIHRvIDFtcyBzbyB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGV5IGZpbmlzaCB1cG9uIHRoZSBuZXh0IHJBZiB0aWNrIHRoZW4gcHJvY2VlZCB3aXRoIG5vcm1hbCBjYWxsIGNvbXBsZXRpb24gbG9naWMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZUNhbGxbMl0uZHVyYXRpb24gPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIFByZW1hdHVyZWx5IGNhbGwgY29tcGxldGVDYWxsKCkgb24gZWFjaCBtYXRjaGVkIGFjdGl2ZSBjYWxsLiBQYXNzIGFuIGFkZGl0aW9uYWwgZmxhZyBmb3IgXCJzdG9wXCIgdG8gaW5kaWNhdGVcbiAgICAgICAgICAgICAgICAgICAgIHRoYXQgdGhlIGNvbXBsZXRlIGNhbGxiYWNrIGFuZCBkaXNwbGF5Om5vbmUgc2V0dGluZyBzaG91bGQgYmUgc2tpcHBlZCBzaW5jZSB3ZSdyZSBjb21wbGV0aW5nIHByZW1hdHVyZWx5LiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllc01hcCA9PT0gXCJzdG9wXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChjYWxsc1RvU3RvcCwgZnVuY3Rpb24oaSwgaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlQ2FsbChqLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZURhdGEucHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEltbWVkaWF0ZWx5IHJlc29sdmUgdGhlIHByb21pc2UgYXNzb2NpYXRlZCB3aXRoIHRoaXMgc3RvcCBjYWxsIHNpbmNlIHN0b3AgcnVucyBzeW5jaHJvbm91c2x5LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VEYXRhLnJlc29sdmVyKGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIFNpbmNlIHdlJ3JlIHN0b3BwaW5nLCBhbmQgbm90IHByb2NlZWRpbmcgd2l0aCBxdWV1ZWluZywgZXhpdCBvdXQgb2YgVmVsb2NpdHkuICovXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRDaGFpbigpO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgLyogVHJlYXQgYSBub24tZW1wdHkgcGxhaW4gb2JqZWN0IGFzIGEgbGl0ZXJhbCBwcm9wZXJ0aWVzIG1hcC4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKCQuaXNQbGFpbk9iamVjdChwcm9wZXJ0aWVzTWFwKSAmJiAhVHlwZS5pc0VtcHR5T2JqZWN0KHByb3BlcnRpZXNNYXApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24gPSBcInN0YXJ0XCI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgUmVkaXJlY3RzXG4gICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2hlY2sgaWYgYSBzdHJpbmcgbWF0Y2hlcyBhIHJlZ2lzdGVyZWQgcmVkaXJlY3QgKHNlZSBSZWRpcmVjdHMgYWJvdmUpLiAqL1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFR5cGUuaXNTdHJpbmcocHJvcGVydGllc01hcCkgJiYgVmVsb2NpdHkuUmVkaXJlY3RzW3Byb3BlcnRpZXNNYXBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRzID0gJC5leHRlbmQoe30sIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZHVyYXRpb25PcmlnaW5hbCA9IG9wdHMuZHVyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsYXlPcmlnaW5hbCA9IG9wdHMuZGVsYXkgfHwgMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGJhY2t3YXJkcyBvcHRpb24gd2FzIHBhc3NlZCBpbiwgcmV2ZXJzZSB0aGUgZWxlbWVudCBzZXQgc28gdGhhdCBlbGVtZW50cyBhbmltYXRlIGZyb20gdGhlIGxhc3QgdG8gdGhlIGZpcnN0LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuYmFja3dhcmRzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMgPSAkLmV4dGVuZCh0cnVlLCBbXSwgZWxlbWVudHMpLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogSW5kaXZpZHVhbGx5IHRyaWdnZXIgdGhlIHJlZGlyZWN0IGZvciBlYWNoIGVsZW1lbnQgaW4gdGhlIHNldCB0byBwcmV2ZW50IHVzZXJzIGZyb20gaGF2aW5nIHRvIGhhbmRsZSBpdGVyYXRpb24gbG9naWMgaW4gdGhlaXIgcmVkaXJlY3QuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goZWxlbWVudHMsIGZ1bmN0aW9uKGVsZW1lbnRJbmRleCwgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBzdGFnZ2VyIG9wdGlvbiB3YXMgcGFzc2VkIGluLCBzdWNjZXNzaXZlbHkgZGVsYXkgZWFjaCBlbGVtZW50IGJ5IHRoZSBzdGFnZ2VyIHZhbHVlIChpbiBtcykuIFJldGFpbiB0aGUgb3JpZ2luYWwgZGVsYXkgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlRmxvYXQob3B0cy5zdGFnZ2VyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmRlbGF5ID0gZGVsYXlPcmlnaW5hbCArIChwYXJzZUZsb2F0KG9wdHMuc3RhZ2dlcikgKiBlbGVtZW50SW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoVHlwZS5pc0Z1bmN0aW9uKG9wdHMuc3RhZ2dlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5kZWxheSA9IGRlbGF5T3JpZ2luYWwgKyBvcHRzLnN0YWdnZXIuY2FsbChlbGVtZW50LCBlbGVtZW50SW5kZXgsIGVsZW1lbnRzTGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgZHJhZyBvcHRpb24gd2FzIHBhc3NlZCBpbiwgc3VjY2Vzc2l2ZWx5IGluY3JlYXNlL2RlY3JlYXNlIChkZXBlbmRpbmcgb24gdGhlIHByZXNlbnNlIG9mIG9wdHMuYmFja3dhcmRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZHVyYXRpb24gb2YgZWFjaCBlbGVtZW50J3MgYW5pbWF0aW9uLCB1c2luZyBmbG9vcnMgdG8gcHJldmVudCBwcm9kdWNpbmcgdmVyeSBzaG9ydCBkdXJhdGlvbnMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuZHJhZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBEZWZhdWx0IHRoZSBkdXJhdGlvbiBvZiBVSSBwYWNrIGVmZmVjdHMgKGNhbGxvdXRzIGFuZCB0cmFuc2l0aW9ucykgdG8gMTAwMG1zIGluc3RlYWQgb2YgdGhlIHVzdWFsIGRlZmF1bHQgZHVyYXRpb24gb2YgNDAwbXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuZHVyYXRpb24gPSBwYXJzZUZsb2F0KGR1cmF0aW9uT3JpZ2luYWwpIHx8ICgvXihjYWxsb3V0fHRyYW5zaXRpb24pLy50ZXN0KHByb3BlcnRpZXNNYXApID8gMTAwMCA6IERVUkFUSU9OX0RFRkFVTFQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZvciBlYWNoIGVsZW1lbnQsIHRha2UgdGhlIGdyZWF0ZXIgZHVyYXRpb24gb2Y6IEEpIGFuaW1hdGlvbiBjb21wbGV0aW9uIHBlcmNlbnRhZ2UgcmVsYXRpdmUgdG8gdGhlIG9yaWdpbmFsIGR1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQikgNzUlIG9mIHRoZSBvcmlnaW5hbCBkdXJhdGlvbiwgb3IgQykgYSAyMDBtcyBmYWxsYmFjayAoaW4gY2FzZSBkdXJhdGlvbiBpcyBhbHJlYWR5IHNldCB0byBhIGxvdyB2YWx1ZSkuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgZW5kIHJlc3VsdCBpcyBhIGJhc2VsaW5lIG9mIDc1JSBvZiB0aGUgcmVkaXJlY3QncyBkdXJhdGlvbiB0aGF0IGluY3JlYXNlcy9kZWNyZWFzZXMgYXMgdGhlIGVuZCBvZiB0aGUgZWxlbWVudCBzZXQgaXMgYXBwcm9hY2hlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5kdXJhdGlvbiA9IE1hdGgubWF4KG9wdHMuZHVyYXRpb24gKiAob3B0cy5iYWNrd2FyZHMgPyAxIC0gZWxlbWVudEluZGV4IC8gZWxlbWVudHNMZW5ndGggOiAoZWxlbWVudEluZGV4ICsgMSkgLyBlbGVtZW50c0xlbmd0aCksIG9wdHMuZHVyYXRpb24gKiAwLjc1LCAyMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFBhc3MgaW4gdGhlIGNhbGwncyBvcHRzIG9iamVjdCBzbyB0aGF0IHRoZSByZWRpcmVjdCBjYW4gb3B0aW9uYWxseSBleHRlbmQgaXQuIEl0IGRlZmF1bHRzIHRvIGFuIGVtcHR5IG9iamVjdCBpbnN0ZWFkIG9mIG51bGwgdG9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVkdWNlIHRoZSBvcHRzIGNoZWNraW5nIGxvZ2ljIHJlcXVpcmVkIGluc2lkZSB0aGUgcmVkaXJlY3QuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuUmVkaXJlY3RzW3Byb3BlcnRpZXNNYXBdLmNhbGwoZWxlbWVudCwgZWxlbWVudCwgb3B0cyB8fCB7fSwgZWxlbWVudEluZGV4LCBlbGVtZW50c0xlbmd0aCwgZWxlbWVudHMsIHByb21pc2VEYXRhLnByb21pc2UgPyBwcm9taXNlRGF0YSA6IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogU2luY2UgdGhlIGFuaW1hdGlvbiBsb2dpYyByZXNpZGVzIHdpdGhpbiB0aGUgcmVkaXJlY3QncyBvd24gY29kZSwgYWJvcnQgdGhlIHJlbWFpbmRlciBvZiB0aGlzIGNhbGwuXG4gICAgICAgICAgICAgICAgICAgICAgICAgKFRoZSBwZXJmb3JtYW5jZSBvdmVyaGVhZCB1cCB0byB0aGlzIHBvaW50IGlzIHZpcnR1YWxseSBub24tZXhpc3RhbnQuKSAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogVGhlIGpRdWVyeSBjYWxsIGNoYWluIGlzIGtlcHQgaW50YWN0IGJ5IHJldHVybmluZyB0aGUgY29tcGxldGUgZWxlbWVudCBzZXQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0Q2hhaW4oKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhYm9ydEVycm9yID0gXCJWZWxvY2l0eTogRmlyc3QgYXJndW1lbnQgKFwiICsgcHJvcGVydGllc01hcCArIFwiKSB3YXMgbm90IGEgcHJvcGVydHkgbWFwLCBhIGtub3duIGFjdGlvbiwgb3IgYSByZWdpc3RlcmVkIHJlZGlyZWN0LiBBYm9ydGluZy5cIjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2VEYXRhLnByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlRGF0YS5yZWplY3RlcihuZXcgRXJyb3IoYWJvcnRFcnJvcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhYm9ydEVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldENoYWluKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgQ2FsbC1XaWRlIFZhcmlhYmxlc1xuICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAvKiBBIGNvbnRhaW5lciBmb3IgQ1NTIHVuaXQgY29udmVyc2lvbiByYXRpb3MgKGUuZy4gJSwgcmVtLCBhbmQgZW0gPT0+IHB4KSB0aGF0IGlzIHVzZWQgdG8gY2FjaGUgcmF0aW9zIGFjcm9zcyBhbGwgZWxlbWVudHNcbiAgICAgICAgICAgICBiZWluZyBhbmltYXRlZCBpbiBhIHNpbmdsZSBWZWxvY2l0eSBjYWxsLiBDYWxjdWxhdGluZyB1bml0IHJhdGlvcyBuZWNlc3NpdGF0ZXMgRE9NIHF1ZXJ5aW5nIGFuZCB1cGRhdGluZywgYW5kIGlzIHRoZXJlZm9yZVxuICAgICAgICAgICAgIGF2b2lkZWQgKHZpYSBjYWNoaW5nKSB3aGVyZXZlciBwb3NzaWJsZS4gVGhpcyBjb250YWluZXIgaXMgY2FsbC13aWRlIGluc3RlYWQgb2YgcGFnZS13aWRlIHRvIGF2b2lkIHRoZSByaXNrIG9mIHVzaW5nIHN0YWxlXG4gICAgICAgICAgICAgY29udmVyc2lvbiBtZXRyaWNzIGFjcm9zcyBWZWxvY2l0eSBhbmltYXRpb25zIHRoYXQgYXJlIG5vdCBpbW1lZGlhdGVseSBjb25zZWN1dGl2ZWx5IGNoYWluZWQuICovXG4gICAgICAgICAgICB2YXIgY2FsbFVuaXRDb252ZXJzaW9uRGF0YSA9IHtcbiAgICAgICAgICAgICAgICBsYXN0UGFyZW50OiBudWxsLFxuICAgICAgICAgICAgICAgIGxhc3RQb3NpdGlvbjogbnVsbCxcbiAgICAgICAgICAgICAgICBsYXN0Rm9udFNpemU6IG51bGwsXG4gICAgICAgICAgICAgICAgbGFzdFBlcmNlbnRUb1B4V2lkdGg6IG51bGwsXG4gICAgICAgICAgICAgICAgbGFzdFBlcmNlbnRUb1B4SGVpZ2h0OiBudWxsLFxuICAgICAgICAgICAgICAgIGxhc3RFbVRvUHg6IG51bGwsXG4gICAgICAgICAgICAgICAgcmVtVG9QeDogbnVsbCxcbiAgICAgICAgICAgICAgICB2d1RvUHg6IG51bGwsXG4gICAgICAgICAgICAgICAgdmhUb1B4OiBudWxsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvKiBBIGNvbnRhaW5lciBmb3IgYWxsIHRoZSBlbnN1aW5nIHR3ZWVuIGRhdGEgYW5kIG1ldGFkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGNhbGwuIFRoaXMgY29udGFpbmVyIGdldHMgcHVzaGVkIHRvIHRoZSBwYWdlLXdpZGVcbiAgICAgICAgICAgICBWZWxvY2l0eS5TdGF0ZS5jYWxscyBhcnJheSB0aGF0IGlzIHByb2Nlc3NlZCBkdXJpbmcgYW5pbWF0aW9uIHRpY2tpbmcuICovXG4gICAgICAgICAgICB2YXIgY2FsbCA9IFtdO1xuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgRWxlbWVudCBQcm9jZXNzaW5nXG4gICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAvKiBFbGVtZW50IHByb2Nlc3NpbmcgY29uc2lzdHMgb2YgdGhyZWUgcGFydHMgLS0gZGF0YSBwcm9jZXNzaW5nIHRoYXQgY2Fubm90IGdvIHN0YWxlIGFuZCBkYXRhIHByb2Nlc3NpbmcgdGhhdCAqY2FuKiBnbyBzdGFsZSAoaS5lLiB0aGlyZC1wYXJ0eSBzdHlsZSBtb2RpZmljYXRpb25zKTpcbiAgICAgICAgICAgICAxKSBQcmUtUXVldWVpbmc6IEVsZW1lbnQtd2lkZSB2YXJpYWJsZXMsIGluY2x1ZGluZyB0aGUgZWxlbWVudCdzIGRhdGEgc3RvcmFnZSwgYXJlIGluc3RhbnRpYXRlZC4gQ2FsbCBvcHRpb25zIGFyZSBwcmVwYXJlZC4gSWYgdHJpZ2dlcmVkLCB0aGUgU3RvcCBhY3Rpb24gaXMgZXhlY3V0ZWQuXG4gICAgICAgICAgICAgMikgUXVldWVpbmc6IFRoZSBsb2dpYyB0aGF0IHJ1bnMgb25jZSB0aGlzIGNhbGwgaGFzIHJlYWNoZWQgaXRzIHBvaW50IG9mIGV4ZWN1dGlvbiBpbiB0aGUgZWxlbWVudCdzICQucXVldWUoKSBzdGFjay4gTW9zdCBsb2dpYyBpcyBwbGFjZWQgaGVyZSB0byBhdm9pZCByaXNraW5nIGl0IGJlY29taW5nIHN0YWxlLlxuICAgICAgICAgICAgIDMpIFB1c2hpbmc6IENvbnNvbGlkYXRpb24gb2YgdGhlIHR3ZWVuIGRhdGEgZm9sbG93ZWQgYnkgaXRzIHB1c2ggb250byB0aGUgZ2xvYmFsIGluLXByb2dyZXNzIGNhbGxzIGNvbnRhaW5lci5cbiAgICAgICAgICAgICBgZWxlbWVudEFycmF5SW5kZXhgIGFsbG93cyBwYXNzaW5nIGluZGV4IG9mIHRoZSBlbGVtZW50IGluIHRoZSBvcmlnaW5hbCBhcnJheSB0byB2YWx1ZSBmdW5jdGlvbnMuXG4gICAgICAgICAgICAgSWYgYGVsZW1lbnRzSW5kZXhgIHdlcmUgdXNlZCBpbnN0ZWFkIHRoZSBpbmRleCB3b3VsZCBiZSBkZXRlcm1pbmVkIGJ5IHRoZSBlbGVtZW50cycgcGVyLWVsZW1lbnQgcXVldWUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NFbGVtZW50KGVsZW1lbnQsIGVsZW1lbnRBcnJheUluZGV4KSB7XG5cbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICBQYXJ0IEk6IFByZS1RdWV1ZWluZ1xuICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICBFbGVtZW50LVdpZGUgVmFyaWFibGVzXG4gICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIHZhciAvKiBUaGUgcnVudGltZSBvcHRzIG9iamVjdCBpcyB0aGUgZXh0ZW5zaW9uIG9mIHRoZSBjdXJyZW50IGNhbGwncyBvcHRpb25zIGFuZCBWZWxvY2l0eSdzIHBhZ2Utd2lkZSBvcHRpb24gZGVmYXVsdHMuICovXG4gICAgICAgICAgICAgICAgICAgIG9wdHMgPSAkLmV4dGVuZCh7fSwgVmVsb2NpdHkuZGVmYXVsdHMsIG9wdGlvbnMpLFxuICAgICAgICAgICAgICAgICAgICAvKiBBIGNvbnRhaW5lciBmb3IgdGhlIHByb2Nlc3NlZCBkYXRhIGFzc29jaWF0ZWQgd2l0aCBlYWNoIHByb3BlcnR5IGluIHRoZSBwcm9wZXJ0eU1hcC5cbiAgICAgICAgICAgICAgICAgICAgIChFYWNoIHByb3BlcnR5IGluIHRoZSBtYXAgcHJvZHVjZXMgaXRzIG93biBcInR3ZWVuXCIuKSAqL1xuICAgICAgICAgICAgICAgICAgICB0d2VlbnNDb250YWluZXIgPSB7fSxcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudFVuaXRDb252ZXJzaW9uRGF0YTtcblxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgRWxlbWVudCBJbml0XG4gICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIGlmIChEYXRhKGVsZW1lbnQpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuaW5pdChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgIE9wdGlvbjogRGVsYXlcbiAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgLyogU2luY2UgcXVldWU6ZmFsc2UgZG9lc24ndCByZXNwZWN0IHRoZSBpdGVtJ3MgZXhpc3RpbmcgcXVldWUsIHdlIGF2b2lkIGluamVjdGluZyBpdHMgZGVsYXkgaGVyZSAoaXQncyBzZXQgbGF0ZXIgb24pLiAqL1xuICAgICAgICAgICAgICAgIC8qIE5vdGU6IFZlbG9jaXR5IHJvbGxzIGl0cyBvd24gZGVsYXkgZnVuY3Rpb24gc2luY2UgalF1ZXJ5IGRvZXNuJ3QgaGF2ZSBhIHV0aWxpdHkgYWxpYXMgZm9yICQuZm4uZGVsYXkoKVxuICAgICAgICAgICAgICAgICAoYW5kIHRodXMgcmVxdWlyZXMgalF1ZXJ5IGVsZW1lbnQgY3JlYXRpb24sIHdoaWNoIHdlIGF2b2lkIHNpbmNlIGl0cyBvdmVyaGVhZCBpbmNsdWRlcyBET00gcXVlcnlpbmcpLiAqL1xuICAgICAgICAgICAgICAgIGlmIChwYXJzZUZsb2F0KG9wdHMuZGVsYXkpICYmIG9wdHMucXVldWUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICQucXVldWUoZWxlbWVudCwgb3B0cy5xdWV1ZSwgZnVuY3Rpb24obmV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogVGhpcyBpcyBhIGZsYWcgdXNlZCB0byBpbmRpY2F0ZSB0byB0aGUgdXBjb21pbmcgY29tcGxldGVDYWxsKCkgZnVuY3Rpb24gdGhhdCB0aGlzIHF1ZXVlIGVudHJ5IHdhcyBpbml0aWF0ZWQgYnkgVmVsb2NpdHkuIFNlZSBjb21wbGV0ZUNhbGwoKSBmb3IgZnVydGhlciBkZXRhaWxzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkudmVsb2NpdHlRdWV1ZUVudHJ5RmxhZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSBlbnN1aW5nIHF1ZXVlIGl0ZW0gKHdoaWNoIGlzIGFzc2lnbmVkIHRvIHRoZSBcIm5leHRcIiBhcmd1bWVudCB0aGF0ICQucXVldWUoKSBhdXRvbWF0aWNhbGx5IHBhc3NlcyBpbikgd2lsbCBiZSB0cmlnZ2VyZWQgYWZ0ZXIgYSBzZXRUaW1lb3V0IGRlbGF5LlxuICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBzZXRUaW1lb3V0IGlzIHN0b3JlZCBzbyB0aGF0IGl0IGNhbiBiZSBzdWJqZWN0ZWQgdG8gY2xlYXJUaW1lb3V0KCkgaWYgdGhpcyBhbmltYXRpb24gaXMgcHJlbWF0dXJlbHkgc3RvcHBlZCB2aWEgVmVsb2NpdHkncyBcInN0b3BcIiBjb21tYW5kLCBhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICBkZWxheUJlZ2luL2RlbGF5VGltZSBpcyB1c2VkIHRvIGVuc3VyZSB3ZSBjYW4gXCJwYXVzZVwiIGFuZCBcInJlc3VtZVwiIGEgdHdlZW4gdGhhdCBpcyBzdGlsbCBtaWQtZGVsYXkuICovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRlbXBvcmFyaWx5IHN0b3JlIGRlbGF5ZWQgZWxlbWVudHMgdG8gZmFjaWxpdGUgYWNjZXNzIGZvciBnbG9iYWwgcGF1c2UvcmVzdW1lICovXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2FsbEluZGV4ID0gVmVsb2NpdHkuU3RhdGUuZGVsYXllZEVsZW1lbnRzLmNvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5TdGF0ZS5kZWxheWVkRWxlbWVudHNbY2FsbEluZGV4XSA9IGVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWxheUNvbXBsZXRlID0gKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDbGVhciB0aGUgdGVtcG9yYXJ5IGVsZW1lbnQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuZGVsYXllZEVsZW1lbnRzW2luZGV4XSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZpbmFsbHksIGlzc3VlIHRoZSBjYWxsICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoY2FsbEluZGV4KTtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLmRlbGF5QmVnaW4gPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS5kZWxheSA9IHBhcnNlRmxvYXQob3B0cy5kZWxheSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLmRlbGF5VGltZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dDogc2V0VGltZW91dChuZXh0LCBwYXJzZUZsb2F0KG9wdHMuZGVsYXkpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0OiBkZWxheUNvbXBsZXRlXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgIE9wdGlvbjogRHVyYXRpb25cbiAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgLyogU3VwcG9ydCBmb3IgalF1ZXJ5J3MgbmFtZWQgZHVyYXRpb25zLiAqL1xuICAgICAgICAgICAgICAgIHN3aXRjaCAob3B0cy5kdXJhdGlvbi50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImZhc3RcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuZHVyYXRpb24gPSAyMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibm9ybWFsXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmR1cmF0aW9uID0gRFVSQVRJT05fREVGQVVMVDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzbG93XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmR1cmF0aW9uID0gNjAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFJlbW92ZSB0aGUgcG90ZW50aWFsIFwibXNcIiBzdWZmaXggYW5kIGRlZmF1bHQgdG8gMSBpZiB0aGUgdXNlciBpcyBhdHRlbXB0aW5nIHRvIHNldCBhIGR1cmF0aW9uIG9mIDAgKGluIG9yZGVyIHRvIHByb2R1Y2UgYW4gaW1tZWRpYXRlIHN0eWxlIGNoYW5nZSkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmR1cmF0aW9uID0gcGFyc2VGbG9hdChvcHRzLmR1cmF0aW9uKSB8fCAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgR2xvYmFsIE9wdGlvbjogTW9ja1xuICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkubW9jayAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogSW4gbW9jayBtb2RlLCBhbGwgYW5pbWF0aW9ucyBhcmUgZm9yY2VkIHRvIDFtcyBzbyB0aGF0IHRoZXkgb2NjdXIgaW1tZWRpYXRlbHkgdXBvbiB0aGUgbmV4dCByQUYgdGljay5cbiAgICAgICAgICAgICAgICAgICAgIEFsdGVybmF0aXZlbHksIGEgbXVsdGlwbGllciBjYW4gYmUgcGFzc2VkIGluIHRvIHRpbWUgcmVtYXAgYWxsIGRlbGF5cyBhbmQgZHVyYXRpb25zLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkubW9jayA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5kdXJhdGlvbiA9IG9wdHMuZGVsYXkgPSAxO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5kdXJhdGlvbiAqPSBwYXJzZUZsb2F0KFZlbG9jaXR5Lm1vY2spIHx8IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmRlbGF5ICo9IHBhcnNlRmxvYXQoVmVsb2NpdHkubW9jaykgfHwgMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgIE9wdGlvbjogRWFzaW5nXG4gICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICBvcHRzLmVhc2luZyA9IGdldEVhc2luZyhvcHRzLmVhc2luZywgb3B0cy5kdXJhdGlvbik7XG5cbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICBPcHRpb246IENhbGxiYWNrc1xuICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgLyogQ2FsbGJhY2tzIG11c3QgZnVuY3Rpb25zLiBPdGhlcndpc2UsIGRlZmF1bHQgdG8gbnVsbC4gKi9cbiAgICAgICAgICAgICAgICBpZiAob3B0cy5iZWdpbiAmJiAhVHlwZS5pc0Z1bmN0aW9uKG9wdHMuYmVnaW4pKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdHMuYmVnaW4gPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChvcHRzLnByb2dyZXNzICYmICFUeXBlLmlzRnVuY3Rpb24ob3B0cy5wcm9ncmVzcykpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5wcm9ncmVzcyA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMuY29tcGxldGUgJiYgIVR5cGUuaXNGdW5jdGlvbihvcHRzLmNvbXBsZXRlKSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRzLmNvbXBsZXRlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgIE9wdGlvbjogRGlzcGxheSAmIFZpc2liaWxpdHlcbiAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgLyogUmVmZXIgdG8gVmVsb2NpdHkncyBkb2N1bWVudGF0aW9uIChWZWxvY2l0eUpTLm9yZy8jZGlzcGxheUFuZFZpc2liaWxpdHkpIGZvciBhIGRlc2NyaXB0aW9uIG9mIHRoZSBkaXNwbGF5IGFuZCB2aXNpYmlsaXR5IG9wdGlvbnMnIGJlaGF2aW9yLiAqL1xuICAgICAgICAgICAgICAgIC8qIE5vdGU6IFdlIHN0cmljdGx5IGNoZWNrIGZvciB1bmRlZmluZWQgaW5zdGVhZCBvZiBmYWxzaW5lc3MgYmVjYXVzZSBkaXNwbGF5IGFjY2VwdHMgYW4gZW1wdHkgc3RyaW5nIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgIGlmIChvcHRzLmRpc3BsYXkgIT09IHVuZGVmaW5lZCAmJiBvcHRzLmRpc3BsYXkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5kaXNwbGF5ID0gb3B0cy5kaXNwbGF5LnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBVc2VycyBjYW4gcGFzcyBpbiBhIHNwZWNpYWwgXCJhdXRvXCIgdmFsdWUgdG8gaW5zdHJ1Y3QgVmVsb2NpdHkgdG8gc2V0IHRoZSBlbGVtZW50IHRvIGl0cyBkZWZhdWx0IGRpc3BsYXkgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLmRpc3BsYXkgPT09IFwiYXV0b1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmRpc3BsYXkgPSBWZWxvY2l0eS5DU1MuVmFsdWVzLmdldERpc3BsYXlUeXBlKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMudmlzaWJpbGl0eSAhPT0gdW5kZWZpbmVkICYmIG9wdHMudmlzaWJpbGl0eSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBvcHRzLnZpc2liaWxpdHkgPSBvcHRzLnZpc2liaWxpdHkudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgIE9wdGlvbjogbW9iaWxlSEFcbiAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIC8qIFdoZW4gc2V0IHRvIHRydWUsIGFuZCBpZiB0aGlzIGlzIGEgbW9iaWxlIGRldmljZSwgbW9iaWxlSEEgYXV0b21hdGljYWxseSBlbmFibGVzIGhhcmR3YXJlIGFjY2VsZXJhdGlvbiAodmlhIGEgbnVsbCB0cmFuc2Zvcm0gaGFjaylcbiAgICAgICAgICAgICAgICAgb24gYW5pbWF0aW5nIGVsZW1lbnRzLiBIQSBpcyByZW1vdmVkIGZyb20gdGhlIGVsZW1lbnQgYXQgdGhlIGNvbXBsZXRpb24gb2YgaXRzIGFuaW1hdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAvKiBOb3RlOiBBbmRyb2lkIEdpbmdlcmJyZWFkIGRvZXNuJ3Qgc3VwcG9ydCBIQS4gSWYgYSBudWxsIHRyYW5zZm9ybSBoYWNrIChtb2JpbGVIQSkgaXMgaW4gZmFjdCBzZXQsIGl0IHdpbGwgcHJldmVudCBvdGhlciB0cmFuZm9ybSBzdWJwcm9wZXJ0aWVzIGZyb20gdGFraW5nIGVmZmVjdC4gKi9cbiAgICAgICAgICAgICAgICAvKiBOb3RlOiBZb3UgY2FuIHJlYWQgbW9yZSBhYm91dCB0aGUgdXNlIG9mIG1vYmlsZUhBIGluIFZlbG9jaXR5J3MgZG9jdW1lbnRhdGlvbjogVmVsb2NpdHlKUy5vcmcvI21vYmlsZUhBLiAqL1xuICAgICAgICAgICAgICAgIG9wdHMubW9iaWxlSEEgPSAob3B0cy5tb2JpbGVIQSAmJiBWZWxvY2l0eS5TdGF0ZS5pc01vYmlsZSAmJiAhVmVsb2NpdHkuU3RhdGUuaXNHaW5nZXJicmVhZCk7XG5cbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgUGFydCBJSTogUXVldWVpbmdcbiAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAvKiBXaGVuIGEgc2V0IG9mIGVsZW1lbnRzIGlzIHRhcmdldGVkIGJ5IGEgVmVsb2NpdHkgY2FsbCwgdGhlIHNldCBpcyBicm9rZW4gdXAgYW5kIGVhY2ggZWxlbWVudCBoYXMgdGhlIGN1cnJlbnQgVmVsb2NpdHkgY2FsbCBpbmRpdmlkdWFsbHkgcXVldWVkIG9udG8gaXQuXG4gICAgICAgICAgICAgICAgIEluIHRoaXMgd2F5LCBlYWNoIGVsZW1lbnQncyBleGlzdGluZyBxdWV1ZSBpcyByZXNwZWN0ZWQ7IHNvbWUgZWxlbWVudHMgbWF5IGFscmVhZHkgYmUgYW5pbWF0aW5nIGFuZCBhY2NvcmRpbmdseSBzaG91bGQgbm90IGhhdmUgdGhpcyBjdXJyZW50IFZlbG9jaXR5IGNhbGwgdHJpZ2dlcmVkIGltbWVkaWF0ZWx5LiAqL1xuICAgICAgICAgICAgICAgIC8qIEluIGVhY2ggcXVldWUsIHR3ZWVuIGRhdGEgaXMgcHJvY2Vzc2VkIGZvciBlYWNoIGFuaW1hdGluZyBwcm9wZXJ0eSB0aGVuIHB1c2hlZCBvbnRvIHRoZSBjYWxsLXdpZGUgY2FsbHMgYXJyYXkuIFdoZW4gdGhlIGxhc3QgZWxlbWVudCBpbiB0aGUgc2V0IGhhcyBoYWQgaXRzIHR3ZWVucyBwcm9jZXNzZWQsXG4gICAgICAgICAgICAgICAgIHRoZSBjYWxsIGFycmF5IGlzIHB1c2hlZCB0byBWZWxvY2l0eS5TdGF0ZS5jYWxscyBmb3IgbGl2ZSBwcm9jZXNzaW5nIGJ5IHRoZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgdGljay4gKi9cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBidWlsZFF1ZXVlKG5leHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEsIGxhc3RUd2VlbnNDb250YWluZXI7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgIE9wdGlvbjogQmVnaW5cbiAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgLyogVGhlIGJlZ2luIGNhbGxiYWNrIGlzIGZpcmVkIG9uY2UgcGVyIGNhbGwgLS0gbm90IG9uY2UgcGVyIGVsZW1lbmV0IC0tIGFuZCBpcyBwYXNzZWQgdGhlIGZ1bGwgcmF3IERPTSBlbGVtZW50IHNldCBhcyBib3RoIGl0cyBjb250ZXh0IGFuZCBpdHMgZmlyc3QgYXJndW1lbnQuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLmJlZ2luICYmIGVsZW1lbnRzSW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFdlIHRocm93IGNhbGxiYWNrcyBpbiBhIHNldFRpbWVvdXQgc28gdGhhdCB0aHJvd24gZXJyb3JzIGRvbid0IGhhbHQgdGhlIGV4ZWN1dGlvbiBvZiBWZWxvY2l0eSBpdHNlbGYuICovXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuYmVnaW4uY2FsbChlbGVtZW50cywgZWxlbWVudHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgVHdlZW4gRGF0YSBDb25zdHJ1Y3Rpb24gKGZvciBTY3JvbGwpXG4gICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBJbiBvcmRlciB0byBiZSBzdWJqZWN0ZWQgdG8gY2hhaW5pbmcgYW5kIGFuaW1hdGlvbiBvcHRpb25zLCBzY3JvbGwncyB0d2VlbmluZyBpcyByb3V0ZWQgdGhyb3VnaCBWZWxvY2l0eSBhcyBpZiBpdCB3ZXJlIGEgc3RhbmRhcmQgQ1NTIHByb3BlcnR5IGFuaW1hdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGlvbiA9PT0gXCJzY3JvbGxcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogVGhlIHNjcm9sbCBhY3Rpb24gdW5pcXVlbHkgdGFrZXMgYW4gb3B0aW9uYWwgXCJvZmZzZXRcIiBvcHRpb24gLS0gc3BlY2lmaWVkIGluIHBpeGVscyAtLSB0aGF0IG9mZnNldHMgdGhlIHRhcmdldGVkIHNjcm9sbCBwb3NpdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzY3JvbGxEaXJlY3Rpb24gPSAoL154JC9pLnRlc3Qob3B0cy5heGlzKSA/IFwiTGVmdFwiIDogXCJUb3BcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsT2Zmc2V0ID0gcGFyc2VGbG9hdChvcHRzLm9mZnNldCkgfHwgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxQb3NpdGlvbkN1cnJlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUG9zaXRpb25DdXJyZW50QWx0ZXJuYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFBvc2l0aW9uRW5kO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBTY3JvbGwgYWxzbyB1bmlxdWVseSB0YWtlcyBhbiBvcHRpb25hbCBcImNvbnRhaW5lclwiIG9wdGlvbiwgd2hpY2ggaW5kaWNhdGVzIHRoZSBwYXJlbnQgZWxlbWVudCB0aGF0IHNob3VsZCBiZSBzY3JvbGxlZCAtLVxuICAgICAgICAgICAgICAgICAgICAgICAgIGFzIG9wcG9zZWQgdG8gdGhlIGJyb3dzZXIgd2luZG93IGl0c2VsZi4gVGhpcyBpcyB1c2VmdWwgZm9yIHNjcm9sbGluZyB0b3dhcmQgYW4gZWxlbWVudCB0aGF0J3MgaW5zaWRlIGFuIG92ZXJmbG93aW5nIHBhcmVudCBlbGVtZW50LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuY29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRW5zdXJlIHRoYXQgZWl0aGVyIGEgalF1ZXJ5IG9iamVjdCBvciBhIHJhdyBET00gZWxlbWVudCB3YXMgcGFzc2VkIGluLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUeXBlLmlzV3JhcHBlZChvcHRzLmNvbnRhaW5lcikgfHwgVHlwZS5pc05vZGUob3B0cy5jb250YWluZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEV4dHJhY3QgdGhlIHJhdyBET00gZWxlbWVudCBmcm9tIHRoZSBqUXVlcnkgd3JhcHBlci4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5jb250YWluZXIgPSBvcHRzLmNvbnRhaW5lclswXSB8fCBvcHRzLmNvbnRhaW5lcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogVW5saWtlIG90aGVyIHByb3BlcnRpZXMgaW4gVmVsb2NpdHksIHRoZSBicm93c2VyJ3Mgc2Nyb2xsIHBvc2l0aW9uIGlzIG5ldmVyIGNhY2hlZCBzaW5jZSBpdCBzbyBmcmVxdWVudGx5IGNoYW5nZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChkdWUgdG8gdGhlIHVzZXIncyBuYXR1cmFsIGludGVyYWN0aW9uIHdpdGggdGhlIHBhZ2UpLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxQb3NpdGlvbkN1cnJlbnQgPSBvcHRzLmNvbnRhaW5lcltcInNjcm9sbFwiICsgc2Nyb2xsRGlyZWN0aW9uXTsgLyogR0VUICovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogJC5wb3NpdGlvbigpIHZhbHVlcyBhcmUgcmVsYXRpdmUgdG8gdGhlIGNvbnRhaW5lcidzIGN1cnJlbnRseSB2aWV3YWJsZSBhcmVhICh3aXRob3V0IHRha2luZyBpbnRvIGFjY291bnQgdGhlIGNvbnRhaW5lcidzIHRydWUgZGltZW5zaW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gc2F5LCBmb3IgZXhhbXBsZSwgaWYgdGhlIGNvbnRhaW5lciB3YXMgbm90IG92ZXJmbG93aW5nKS4gVGh1cywgdGhlIHNjcm9sbCBlbmQgdmFsdWUgaXMgdGhlIHN1bSBvZiB0aGUgY2hpbGQgZWxlbWVudCdzIHBvc2l0aW9uICphbmQqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgc2Nyb2xsIGNvbnRhaW5lcidzIGN1cnJlbnQgc2Nyb2xsIHBvc2l0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxQb3NpdGlvbkVuZCA9IChzY3JvbGxQb3NpdGlvbkN1cnJlbnQgKyAkKGVsZW1lbnQpLnBvc2l0aW9uKClbc2Nyb2xsRGlyZWN0aW9uLnRvTG93ZXJDYXNlKCldKSArIHNjcm9sbE9mZnNldDsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIGEgdmFsdWUgb3RoZXIgdGhhbiBhIGpRdWVyeSBvYmplY3Qgb3IgYSByYXcgRE9NIGVsZW1lbnQgd2FzIHBhc3NlZCBpbiwgZGVmYXVsdCB0byBudWxsIHNvIHRoYXQgdGhpcyBvcHRpb24gaXMgaWdub3JlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmNvbnRhaW5lciA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgd2luZG93IGl0c2VsZiBpcyBiZWluZyBzY3JvbGxlZCAtLSBub3QgYSBjb250YWluaW5nIGVsZW1lbnQgLS0gcGVyZm9ybSBhIGxpdmUgc2Nyb2xsIHBvc2l0aW9uIGxvb2t1cCB1c2luZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgYXBwcm9wcmlhdGUgY2FjaGVkIHByb3BlcnR5IG5hbWVzICh3aGljaCBkaWZmZXIgYmFzZWQgb24gYnJvd3NlciB0eXBlKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxQb3NpdGlvbkN1cnJlbnQgPSBWZWxvY2l0eS5TdGF0ZS5zY3JvbGxBbmNob3JbVmVsb2NpdHkuU3RhdGVbXCJzY3JvbGxQcm9wZXJ0eVwiICsgc2Nyb2xsRGlyZWN0aW9uXV07IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFdoZW4gc2Nyb2xsaW5nIHRoZSBicm93c2VyIHdpbmRvdywgY2FjaGUgdGhlIGFsdGVybmF0ZSBheGlzJ3MgY3VycmVudCB2YWx1ZSBzaW5jZSB3aW5kb3cuc2Nyb2xsVG8oKSBkb2Vzbid0IGxldCB1cyBjaGFuZ2Ugb25seSBvbmUgdmFsdWUgYXQgYSB0aW1lLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFBvc2l0aW9uQ3VycmVudEFsdGVybmF0ZSA9IFZlbG9jaXR5LlN0YXRlLnNjcm9sbEFuY2hvcltWZWxvY2l0eS5TdGF0ZVtcInNjcm9sbFByb3BlcnR5XCIgKyAoc2Nyb2xsRGlyZWN0aW9uID09PSBcIkxlZnRcIiA/IFwiVG9wXCIgOiBcIkxlZnRcIildXTsgLyogR0VUICovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBVbmxpa2UgJC5wb3NpdGlvbigpLCAkLm9mZnNldCgpIHZhbHVlcyBhcmUgcmVsYXRpdmUgdG8gdGhlIGJyb3dzZXIgd2luZG93J3MgdHJ1ZSBkaW1lbnNpb25zIC0tIG5vdCBtZXJlbHkgaXRzIGN1cnJlbnRseSB2aWV3YWJsZSBhcmVhIC0tXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZCB0aGVyZWZvcmUgZW5kIHZhbHVlcyBkbyBub3QgbmVlZCB0byBiZSBjb21wb3VuZGVkIG9udG8gY3VycmVudCB2YWx1ZXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUG9zaXRpb25FbmQgPSAkKGVsZW1lbnQpLm9mZnNldCgpW3Njcm9sbERpcmVjdGlvbi50b0xvd2VyQ2FzZSgpXSArIHNjcm9sbE9mZnNldDsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNpbmNlIHRoZXJlJ3Mgb25seSBvbmUgZm9ybWF0IHRoYXQgc2Nyb2xsJ3MgYXNzb2NpYXRlZCB0d2VlbnNDb250YWluZXIgY2FuIHRha2UsIHdlIGNyZWF0ZSBpdCBtYW51YWxseS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuc0NvbnRhaW5lciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlOiBzY3JvbGxQb3NpdGlvbkN1cnJlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZTogc2Nyb2xsUG9zaXRpb25DdXJyZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZTogc2Nyb2xsUG9zaXRpb25FbmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRUeXBlOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmc6IG9wdHMuZWFzaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxEYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXI6IG9wdHMuY29udGFpbmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uOiBzY3JvbGxEaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHRlcm5hdGVWYWx1ZTogc2Nyb2xsUG9zaXRpb25DdXJyZW50QWx0ZXJuYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6IGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5kZWJ1Zykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidHdlZW5zQ29udGFpbmVyIChzY3JvbGwpOiBcIiwgdHdlZW5zQ29udGFpbmVyLnNjcm9sbCwgZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICBUd2VlbiBEYXRhIENvbnN0cnVjdGlvbiAoZm9yIFJldmVyc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBSZXZlcnNlIGFjdHMgbGlrZSBhIFwic3RhcnRcIiBhY3Rpb24gaW4gdGhhdCBhIHByb3BlcnR5IG1hcCBpcyBhbmltYXRlZCB0b3dhcmQuIFRoZSBvbmx5IGRpZmZlcmVuY2UgaXNcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0IHRoZSBwcm9wZXJ0eSBtYXAgdXNlZCBmb3IgcmV2ZXJzZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgbWFwIHVzZWQgaW4gdGhlIHByZXZpb3VzIGNhbGwuIFRodXMsIHdlIG1hbmlwdWxhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgcHJldmlvdXMgY2FsbCB0byBjb25zdHJ1Y3Qgb3VyIG5ldyBtYXA6IHVzZSB0aGUgcHJldmlvdXMgbWFwJ3MgZW5kIHZhbHVlcyBhcyBvdXIgbmV3IG1hcCdzIHN0YXJ0IHZhbHVlcy4gQ29weSBvdmVyIGFsbCBvdGhlciBkYXRhLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogUmV2ZXJzZSBjYW4gYmUgZGlyZWN0bHkgY2FsbGVkIHZpYSB0aGUgXCJyZXZlcnNlXCIgcGFyYW1ldGVyLCBvciBpdCBjYW4gYmUgaW5kaXJlY3RseSB0cmlnZ2VyZWQgdmlhIHRoZSBsb29wIG9wdGlvbi4gKExvb3BzIGFyZSBjb21wb3NlZCBvZiBtdWx0aXBsZSByZXZlcnNlcy4pICovXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBSZXZlcnNlIGNhbGxzIGRvIG5vdCBuZWVkIHRvIGJlIGNvbnNlY3V0aXZlbHkgY2hhaW5lZCBvbnRvIGEgY3VycmVudGx5LWFuaW1hdGluZyBlbGVtZW50IGluIG9yZGVyIHRvIG9wZXJhdGUgb24gY2FjaGVkIHZhbHVlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGVyZSBpcyBubyBoYXJtIHRvIHJldmVyc2UgYmVpbmcgY2FsbGVkIG9uIGEgcG90ZW50aWFsbHkgc3RhbGUgZGF0YSBjYWNoZSBzaW5jZSByZXZlcnNlJ3MgYmVoYXZpb3IgaXMgc2ltcGx5IGRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICBhcyByZXZlcnRpbmcgdG8gdGhlIGVsZW1lbnQncyB2YWx1ZXMgYXMgdGhleSB3ZXJlIHByaW9yIHRvIHRoZSBwcmV2aW91cyAqVmVsb2NpdHkqIGNhbGwuICovXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uID09PSBcInJldmVyc2VcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IERhdGEoZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFib3J0IGlmIHRoZXJlIGlzIG5vIHByaW9yIGFuaW1hdGlvbiBkYXRhIHRvIHJldmVyc2UgdG8uICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZGF0YS50d2VlbnNDb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBEZXF1ZXVlIHRoZSBlbGVtZW50IHNvIHRoYXQgdGhpcyBxdWV1ZSBlbnRyeSByZWxlYXNlcyBpdHNlbGYgaW1tZWRpYXRlbHksIGFsbG93aW5nIHN1YnNlcXVlbnQgcXVldWUgZW50cmllcyB0byBydW4uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5kZXF1ZXVlKGVsZW1lbnQsIG9wdHMucXVldWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9wdGlvbnMgUGFyc2luZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgZWxlbWVudCB3YXMgaGlkZGVuIHZpYSB0aGUgZGlzcGxheSBvcHRpb24gaW4gdGhlIHByZXZpb3VzIGNhbGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldmVydCBkaXNwbGF5IHRvIFwiYXV0b1wiIHByaW9yIHRvIHJldmVyc2FsIHNvIHRoYXQgdGhlIGVsZW1lbnQgaXMgdmlzaWJsZSBhZ2Fpbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5vcHRzLmRpc3BsYXkgPT09IFwibm9uZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEub3B0cy5kaXNwbGF5ID0gXCJhdXRvXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEub3B0cy52aXNpYmlsaXR5ID09PSBcImhpZGRlblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEub3B0cy52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGxvb3Agb3B0aW9uIHdhcyBzZXQgaW4gdGhlIHByZXZpb3VzIGNhbGwsIGRpc2FibGUgaXQgc28gdGhhdCBcInJldmVyc2VcIiBjYWxscyBhcmVuJ3QgcmVjdXJzaXZlbHkgZ2VuZXJhdGVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBGdXJ0aGVyLCByZW1vdmUgdGhlIHByZXZpb3VzIGNhbGwncyBjYWxsYmFjayBvcHRpb25zOyB0eXBpY2FsbHksIHVzZXJzIGRvIG5vdCB3YW50IHRoZXNlIHRvIGJlIHJlZmlyZWQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5vcHRzLmxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLm9wdHMuYmVnaW4gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEub3B0cy5jb21wbGV0ZSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTaW5jZSB3ZSdyZSBleHRlbmRpbmcgYW4gb3B0cyBvYmplY3QgdGhhdCBoYXMgYWxyZWFkeSBiZWVuIGV4dGVuZGVkIHdpdGggdGhlIGRlZmF1bHRzIG9wdGlvbnMgb2JqZWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3ZSByZW1vdmUgbm9uLWV4cGxpY2l0bHktZGVmaW5lZCBwcm9wZXJ0aWVzIHRoYXQgYXJlIGF1dG8tYXNzaWduZWQgdmFsdWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb3B0aW9ucy5lYXNpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG9wdHMuZWFzaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb3B0aW9ucy5kdXJhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgb3B0cy5kdXJhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBUaGUgb3B0cyBvYmplY3QgdXNlZCBmb3IgcmV2ZXJzYWwgaXMgYW4gZXh0ZW5zaW9uIG9mIHRoZSBvcHRpb25zIG9iamVjdCBvcHRpb25hbGx5IHBhc3NlZCBpbnRvIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZSBjYWxsIHBsdXMgdGhlIG9wdGlvbnMgdXNlZCBpbiB0aGUgcHJldmlvdXMgVmVsb2NpdHkgY2FsbC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzID0gJC5leHRlbmQoe30sIGRhdGEub3B0cywgb3B0cyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUd2VlbnMgQ29udGFpbmVyIFJlY29uc3RydWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDcmVhdGUgYSBkZWVweSBjb3B5IChpbmRpY2F0ZWQgdmlhIHRoZSB0cnVlIGZsYWcpIG9mIHRoZSBwcmV2aW91cyBjYWxsJ3MgdHdlZW5zQ29udGFpbmVyLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RUd2VlbnNDb250YWluZXIgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGF0YSA/IGRhdGEudHdlZW5zQ29udGFpbmVyIDogbnVsbCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBNYW5pcHVsYXRlIHRoZSBwcmV2aW91cyB0d2VlbnNDb250YWluZXIgYnkgcmVwbGFjaW5nIGl0cyBlbmQgdmFsdWVzIGFuZCBjdXJyZW50VmFsdWVzIHdpdGggaXRzIHN0YXJ0IHZhbHVlcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBsYXN0VHdlZW4gaW4gbGFzdFR3ZWVuc0NvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJbiBhZGRpdGlvbiB0byB0d2VlbiBkYXRhLCB0d2VlbnNDb250YWluZXJzIGNvbnRhaW4gYW4gZWxlbWVudCBwcm9wZXJ0eSB0aGF0IHdlIGlnbm9yZSBoZXJlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobGFzdFR3ZWVuc0NvbnRhaW5lci5oYXNPd25Qcm9wZXJ0eShsYXN0VHdlZW4pICYmIGxhc3RUd2VlbiAhPT0gXCJlbGVtZW50XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXN0U3RhcnRWYWx1ZSA9IGxhc3RUd2VlbnNDb250YWluZXJbbGFzdFR3ZWVuXS5zdGFydFZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VHdlZW5zQ29udGFpbmVyW2xhc3RUd2Vlbl0uc3RhcnRWYWx1ZSA9IGxhc3RUd2VlbnNDb250YWluZXJbbGFzdFR3ZWVuXS5jdXJyZW50VmFsdWUgPSBsYXN0VHdlZW5zQ29udGFpbmVyW2xhc3RUd2Vlbl0uZW5kVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VHdlZW5zQ29udGFpbmVyW2xhc3RUd2Vlbl0uZW5kVmFsdWUgPSBsYXN0U3RhcnRWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRWFzaW5nIGlzIHRoZSBvbmx5IG9wdGlvbiB0aGF0IGVtYmVkcyBpbnRvIHRoZSBpbmRpdmlkdWFsIHR3ZWVuIGRhdGEgKHNpbmNlIGl0IGNhbiBiZSBkZWZpbmVkIG9uIGEgcGVyLXByb3BlcnR5IGJhc2lzKS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBY2NvcmRpbmdseSwgZXZlcnkgcHJvcGVydHkncyBlYXNpbmcgdmFsdWUgbXVzdCBiZSB1cGRhdGVkIHdoZW4gYW4gb3B0aW9ucyBvYmplY3QgaXMgcGFzc2VkIGluIHdpdGggYSByZXZlcnNlIGNhbGwuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIHNpZGUgZWZmZWN0IG9mIHRoaXMgZXh0ZW5zaWJpbGl0eSBpcyB0aGF0IGFsbCBwZXItcHJvcGVydHkgZWFzaW5nIHZhbHVlcyBhcmUgZm9yY2VmdWxseSByZXNldCB0byB0aGUgbmV3IHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFUeXBlLmlzRW1wdHlPYmplY3Qob3B0aW9ucykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VHdlZW5zQ29udGFpbmVyW2xhc3RUd2Vlbl0uZWFzaW5nID0gb3B0cy5lYXNpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5kZWJ1Zykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmV2ZXJzZSB0d2VlbnNDb250YWluZXIgKFwiICsgbGFzdFR3ZWVuICsgXCIpOiBcIiArIEpTT04uc3RyaW5naWZ5KGxhc3RUd2VlbnNDb250YWluZXJbbGFzdFR3ZWVuXSksIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW5zQ29udGFpbmVyID0gbGFzdFR3ZWVuc0NvbnRhaW5lcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgVHdlZW4gRGF0YSBDb25zdHJ1Y3Rpb24gKGZvciBTdGFydClcbiAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gXCJzdGFydFwiKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgVmFsdWUgVHJhbnNmZXJyaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhpcyBxdWV1ZSBlbnRyeSBmb2xsb3dzIGEgcHJldmlvdXMgVmVsb2NpdHktaW5pdGlhdGVkIHF1ZXVlIGVudHJ5ICphbmQqIGlmIHRoaXMgZW50cnkgd2FzIGNyZWF0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSB0aGUgZWxlbWVudCB3YXMgaW4gdGhlIHByb2Nlc3Mgb2YgYmVpbmcgYW5pbWF0ZWQgYnkgVmVsb2NpdHksIHRoZW4gdGhpcyBjdXJyZW50IGNhbGwgaXMgc2FmZSB0byB1c2VcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZW5kIHZhbHVlcyBmcm9tIHRoZSBwcmlvciBjYWxsIGFzIGl0cyBzdGFydCB2YWx1ZXMuIFZlbG9jaXR5IGF0dGVtcHRzIHRvIHBlcmZvcm0gdGhpcyB2YWx1ZSB0cmFuc2ZlclxuICAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3Mgd2hlbmV2ZXIgcG9zc2libGUgaW4gb3JkZXIgdG8gYXZvaWQgcmVxdWVyeWluZyB0aGUgRE9NLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdmFsdWVzIGFyZW4ndCB0cmFuc2ZlcnJlZCBmcm9tIGEgcHJpb3IgY2FsbCBhbmQgc3RhcnQgdmFsdWVzIHdlcmUgbm90IGZvcmNlZmVkIGJ5IHRoZSB1c2VyIChtb3JlIG9uIHRoaXMgYmVsb3cpLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW4gdGhlIERPTSBpcyBxdWVyaWVkIGZvciB0aGUgZWxlbWVudCdzIGN1cnJlbnQgdmFsdWVzIGFzIGEgbGFzdCByZXNvcnQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBDb252ZXJzZWx5LCBhbmltYXRpb24gcmV2ZXJzYWwgKGFuZCBsb29waW5nKSAqYWx3YXlzKiBwZXJmb3JtIGludGVyLWNhbGwgdmFsdWUgdHJhbnNmZXJzOyB0aGV5IG5ldmVyIHJlcXVlcnkgdGhlIERPTS4gKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IERhdGEoZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSBwZXItZWxlbWVudCBpc0FuaW1hdGluZyBmbGFnIGlzIHVzZWQgdG8gaW5kaWNhdGUgd2hldGhlciBpdCdzIHNhZmUgKGkuZS4gdGhlIGRhdGEgaXNuJ3Qgc3RhbGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgdG8gdHJhbnNmZXIgb3ZlciBlbmQgdmFsdWVzIHRvIHVzZSBhcyBzdGFydCB2YWx1ZXMuIElmIGl0J3Mgc2V0IHRvIHRydWUgYW5kIHRoZXJlIGlzIGEgcHJldmlvdXNcbiAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eSBjYWxsIHRvIHB1bGwgdmFsdWVzIGZyb20sIGRvIHNvLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS50d2VlbnNDb250YWluZXIgJiYgZGF0YS5pc0FuaW1hdGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RUd2VlbnNDb250YWluZXIgPSBkYXRhLnR3ZWVuc0NvbnRhaW5lcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgIFR3ZWVuIERhdGEgQ2FsY3VsYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoaXMgZnVuY3Rpb24gcGFyc2VzIHByb3BlcnR5IGRhdGEgYW5kIGRlZmF1bHRzIGVuZFZhbHVlLCBlYXNpbmcsIGFuZCBzdGFydFZhbHVlIGFzIGFwcHJvcHJpYXRlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogUHJvcGVydHkgbWFwIHZhbHVlcyBjYW4gZWl0aGVyIHRha2UgdGhlIGZvcm0gb2YgMSkgYSBzaW5nbGUgdmFsdWUgcmVwcmVzZW50aW5nIHRoZSBlbmQgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgb3IgMikgYW4gYXJyYXkgaW4gdGhlIGZvcm0gb2YgWyBlbmRWYWx1ZSwgWywgZWFzaW5nXSBbLCBzdGFydFZhbHVlXSBdLlxuICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBvcHRpb25hbCB0aGlyZCBwYXJhbWV0ZXIgaXMgYSBmb3JjZWZlZCBzdGFydFZhbHVlIHRvIGJlIHVzZWQgaW5zdGVhZCBvZiBxdWVyeWluZyB0aGUgRE9NIGZvclxuICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBlbGVtZW50J3MgY3VycmVudCB2YWx1ZS4gUmVhZCBWZWxvY2l0eSdzIGRvY21lbnRhdGlvbiB0byBsZWFybiBtb3JlIGFib3V0IGZvcmNlZmVlZGluZzogVmVsb2NpdHlKUy5vcmcvI2ZvcmNlZmVlZGluZyAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhcnNlUHJvcGVydHlWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlRGF0YSwgc2tpcFJlc29sdmluZ0Vhc2luZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbmRWYWx1ZSwgZWFzaW5nLCBzdGFydFZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgd2UgaGF2ZSBhIGZ1bmN0aW9uIGFzIHRoZSBtYWluIGFyZ3VtZW50IHRoZW4gcmVzb2x2ZSBpdCBmaXJzdCwgaW4gY2FzZSBpdCByZXR1cm5zIGFuIGFycmF5IHRoYXQgbmVlZHMgdG8gYmUgc3BsaXQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVHlwZS5pc0Z1bmN0aW9uKHZhbHVlRGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVEYXRhID0gdmFsdWVEYXRhLmNhbGwoZWxlbWVudCwgZWxlbWVudEFycmF5SW5kZXgsIGVsZW1lbnRzTGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBIYW5kbGUgdGhlIGFycmF5IGZvcm1hdCwgd2hpY2ggY2FuIGJlIHN0cnVjdHVyZWQgYXMgb25lIG9mIHRocmVlIHBvdGVudGlhbCBvdmVybG9hZHM6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIEEpIFsgZW5kVmFsdWUsIGVhc2luZywgc3RhcnRWYWx1ZSBdLCBCKSBbIGVuZFZhbHVlLCBlYXNpbmcgXSwgb3IgQykgWyBlbmRWYWx1ZSwgc3RhcnRWYWx1ZSBdICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFR5cGUuaXNBcnJheSh2YWx1ZURhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIGVuZFZhbHVlIGlzIGFsd2F5cyB0aGUgZmlyc3QgaXRlbSBpbiB0aGUgYXJyYXkuIERvbid0IGJvdGhlciB2YWxpZGF0aW5nIGVuZFZhbHVlJ3MgdmFsdWUgbm93XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaW5jZSB0aGUgZW5zdWluZyBwcm9wZXJ0eSBjeWNsaW5nIGxvZ2ljIGRvZXMgdGhhdC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSB2YWx1ZURhdGFbMF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVHdvLWl0ZW0gYXJyYXkgZm9ybWF0OiBJZiB0aGUgc2Vjb25kIGl0ZW0gaXMgYSBudW1iZXIsIGZ1bmN0aW9uLCBvciBoZXggc3RyaW5nLCB0cmVhdCBpdCBhcyBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydCB2YWx1ZSBzaW5jZSBlYXNpbmdzIGNhbiBvbmx5IGJlIG5vbi1oZXggc3RyaW5ncyBvciBhcnJheXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoIVR5cGUuaXNBcnJheSh2YWx1ZURhdGFbMV0pICYmIC9eW1xcZC1dLy50ZXN0KHZhbHVlRGF0YVsxXSkpIHx8IFR5cGUuaXNGdW5jdGlvbih2YWx1ZURhdGFbMV0pIHx8IENTUy5SZWdFeC5pc0hleC50ZXN0KHZhbHVlRGF0YVsxXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSB2YWx1ZURhdGFbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBUd28gb3IgdGhyZWUtaXRlbSBhcnJheTogSWYgdGhlIHNlY29uZCBpdGVtIGlzIGEgbm9uLWhleCBzdHJpbmcgZWFzaW5nIG5hbWUgb3IgYW4gYXJyYXksIHRyZWF0IGl0IGFzIGFuIGVhc2luZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgoVHlwZS5pc1N0cmluZyh2YWx1ZURhdGFbMV0pICYmICFDU1MuUmVnRXguaXNIZXgudGVzdCh2YWx1ZURhdGFbMV0pICYmIFZlbG9jaXR5LkVhc2luZ3NbdmFsdWVEYXRhWzFdXSkgfHwgVHlwZS5pc0FycmF5KHZhbHVlRGF0YVsxXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZyA9IHNraXBSZXNvbHZpbmdFYXNpbmcgPyB2YWx1ZURhdGFbMV0gOiBnZXRFYXNpbmcodmFsdWVEYXRhWzFdLCBvcHRzLmR1cmF0aW9uKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRG9uJ3QgYm90aGVyIHZhbGlkYXRpbmcgc3RhcnRWYWx1ZSdzIHZhbHVlIG5vdyBzaW5jZSB0aGUgZW5zdWluZyBwcm9wZXJ0eSBjeWNsaW5nIGxvZ2ljIGluaGVyZW50bHkgZG9lcyB0aGF0LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IHZhbHVlRGF0YVsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSB2YWx1ZURhdGFbMV0gfHwgdmFsdWVEYXRhWzJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEhhbmRsZSB0aGUgc2luZ2xlLXZhbHVlIGZvcm1hdC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IHZhbHVlRGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBEZWZhdWx0IHRvIHRoZSBjYWxsJ3MgZWFzaW5nIGlmIGEgcGVyLXByb3BlcnR5IGVhc2luZyB0eXBlIHdhcyBub3QgZGVmaW5lZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNraXBSZXNvbHZpbmdFYXNpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFzaW5nID0gZWFzaW5nIHx8IG9wdHMuZWFzaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIGZ1bmN0aW9ucyB3ZXJlIHBhc3NlZCBpbiBhcyB2YWx1ZXMsIHBhc3MgdGhlIGZ1bmN0aW9uIHRoZSBjdXJyZW50IGVsZW1lbnQgYXMgaXRzIGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsdXMgdGhlIGVsZW1lbnQncyBpbmRleCBhbmQgdGhlIGVsZW1lbnQgc2V0J3Mgc2l6ZSBhcyBhcmd1bWVudHMuIFRoZW4sIGFzc2lnbiB0aGUgcmV0dXJuZWQgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFR5cGUuaXNGdW5jdGlvbihlbmRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSBlbmRWYWx1ZS5jYWxsKGVsZW1lbnQsIGVsZW1lbnRBcnJheUluZGV4LCBlbGVtZW50c0xlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFR5cGUuaXNGdW5jdGlvbihzdGFydFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gc3RhcnRWYWx1ZS5jYWxsKGVsZW1lbnQsIGVsZW1lbnRBcnJheUluZGV4LCBlbGVtZW50c0xlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQWxsb3cgc3RhcnRWYWx1ZSB0byBiZSBsZWZ0IGFzIHVuZGVmaW5lZCB0byBpbmRpY2F0ZSB0byB0aGUgZW5zdWluZyBjb2RlIHRoYXQgaXRzIHZhbHVlIHdhcyBub3QgZm9yY2VmZWQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtlbmRWYWx1ZSB8fCAwLCBlYXNpbmcsIHN0YXJ0VmFsdWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpeFByb3BlcnR5VmFsdWUgPSBmdW5jdGlvbihwcm9wZXJ0eSwgdmFsdWVEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSW4gY2FzZSB0aGlzIHByb3BlcnR5IGlzIGEgaG9vaywgdGhlcmUgYXJlIGNpcmN1bXN0YW5jZXMgd2hlcmUgd2Ugd2lsbCBpbnRlbmQgdG8gd29yayBvbiB0aGUgaG9vaydzIHJvb3QgcHJvcGVydHkgYW5kIG5vdCB0aGUgaG9va2VkIHN1YnByb3BlcnR5LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb290UHJvcGVydHkgPSBDU1MuSG9va3MuZ2V0Um9vdChwcm9wZXJ0eSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFBhcnNlIG91dCBlbmRWYWx1ZSwgZWFzaW5nLCBhbmQgc3RhcnRWYWx1ZSBmcm9tIHRoZSBwcm9wZXJ0eSdzIGRhdGEuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gdmFsdWVEYXRhWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmcgPSB2YWx1ZURhdGFbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSB2YWx1ZURhdGFbMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm47XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RhcnQgVmFsdWUgU291cmNpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBPdGhlciB0aGFuIGZvciB0aGUgZHVtbXkgdHdlZW4gcHJvcGVydHksIHByb3BlcnRpZXMgdGhhdCBhcmUgbm90IHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciAoYW5kIGRvIG5vdCBoYXZlIGFuIGFzc29jaWF0ZWQgbm9ybWFsaXphdGlvbikgd2lsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmhlcmVudGx5IHByb2R1Y2Ugbm8gc3R5bGUgY2hhbmdlcyB3aGVuIHNldCwgc28gdGhleSBhcmUgc2tpcHBlZCBpbiBvcmRlciB0byBkZWNyZWFzZSBhbmltYXRpb24gdGljayBvdmVyaGVhZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUHJvcGVydHkgc3VwcG9ydCBpcyBkZXRlcm1pbmVkIHZpYSBwcmVmaXhDaGVjaygpLCB3aGljaCByZXR1cm5zIGEgZmFsc2UgZmxhZyB3aGVuIG5vIHN1cHBvcnRlZCBpcyBkZXRlY3RlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBTaW5jZSBTVkcgZWxlbWVudHMgaGF2ZSBzb21lIG9mIHRoZWlyIHByb3BlcnRpZXMgZGlyZWN0bHkgYXBwbGllZCBhcyBIVE1MIGF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZXJlIGlzIG5vIHdheSB0byBjaGVjayBmb3IgdGhlaXIgZXhwbGljaXQgYnJvd3NlciBzdXBwb3J0LCBhbmQgc28gd2Ugc2tpcCBza2lwIHRoaXMgY2hlY2sgZm9yIHRoZW0uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCghZGF0YSB8fCAhZGF0YS5pc1NWRykgJiYgcm9vdFByb3BlcnR5ICE9PSBcInR3ZWVuXCIgJiYgQ1NTLk5hbWVzLnByZWZpeENoZWNrKHJvb3RQcm9wZXJ0eSlbMV0gPT09IGZhbHNlICYmIENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW3Jvb3RQcm9wZXJ0eV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkuZGVidWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2tpcHBpbmcgW1wiICsgcm9vdFByb3BlcnR5ICsgXCJdIGR1ZSB0byBhIGxhY2sgb2YgYnJvd3NlciBzdXBwb3J0LlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGRpc3BsYXkgb3B0aW9uIGlzIGJlaW5nIHNldCB0byBhIG5vbi1cIm5vbmVcIiAoZS5nLiBcImJsb2NrXCIpIGFuZCBvcGFjaXR5IChmaWx0ZXIgb24gSUU8PTgpIGlzIGJlaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGVkIHRvIGFuIGVuZFZhbHVlIG9mIG5vbi16ZXJvLCB0aGUgdXNlcidzIGludGVudGlvbiBpcyB0byBmYWRlIGluIGZyb20gaW52aXNpYmxlLCB0aHVzIHdlIGZvcmNlZmVlZCBvcGFjaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGEgc3RhcnRWYWx1ZSBvZiAwIGlmIGl0cyBzdGFydFZhbHVlIGhhc24ndCBhbHJlYWR5IGJlZW4gc291cmNlZCBieSB2YWx1ZSB0cmFuc2ZlcnJpbmcgb3IgcHJpb3IgZm9yY2VmZWVkaW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoKG9wdHMuZGlzcGxheSAhPT0gdW5kZWZpbmVkICYmIG9wdHMuZGlzcGxheSAhPT0gbnVsbCAmJiBvcHRzLmRpc3BsYXkgIT09IFwibm9uZVwiKSB8fCAob3B0cy52aXNpYmlsaXR5ICE9PSB1bmRlZmluZWQgJiYgb3B0cy52aXNpYmlsaXR5ICE9PSBcImhpZGRlblwiKSkgJiYgL29wYWNpdHl8ZmlsdGVyLy50ZXN0KHByb3BlcnR5KSAmJiAhc3RhcnRWYWx1ZSAmJiBlbmRWYWx1ZSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB2YWx1ZXMgaGF2ZSBiZWVuIHRyYW5zZmVycmVkIGZyb20gdGhlIHByZXZpb3VzIFZlbG9jaXR5IGNhbGwsIGV4dHJhY3QgdGhlIGVuZFZhbHVlIGFuZCByb290UHJvcGVydHlWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgYWxsIG9mIHRoZSBjdXJyZW50IGNhbGwncyBwcm9wZXJ0aWVzIHRoYXQgd2VyZSAqYWxzbyogYW5pbWF0ZWQgaW4gdGhlIHByZXZpb3VzIGNhbGwuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogVmFsdWUgdHJhbnNmZXJyaW5nIGNhbiBvcHRpb25hbGx5IGJlIGRpc2FibGVkIGJ5IHRoZSB1c2VyIHZpYSB0aGUgX2NhY2hlVmFsdWVzIG9wdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5fY2FjaGVWYWx1ZXMgJiYgbGFzdFR3ZWVuc0NvbnRhaW5lciAmJiBsYXN0VHdlZW5zQ29udGFpbmVyW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gbGFzdFR3ZWVuc0NvbnRhaW5lcltwcm9wZXJ0eV0uZW5kVmFsdWUgKyBsYXN0VHdlZW5zQ29udGFpbmVyW3Byb3BlcnR5XS51bml0VHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSBwcmV2aW91cyBjYWxsJ3Mgcm9vdFByb3BlcnR5VmFsdWUgaXMgZXh0cmFjdGVkIGZyb20gdGhlIGVsZW1lbnQncyBkYXRhIGNhY2hlIHNpbmNlIHRoYXQncyB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlIG9mIHJvb3RQcm9wZXJ0eVZhbHVlIHRoYXQgZ2V0cyBmcmVzaGx5IHVwZGF0ZWQgYnkgdGhlIHR3ZWVuaW5nIHByb2Nlc3MsIHdoZXJlYXMgdGhlIHJvb3RQcm9wZXJ0eVZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2hlZCB0byB0aGUgaW5jb21pbmcgbGFzdFR3ZWVuc0NvbnRhaW5lciBpcyBlcXVhbCB0byB0aGUgcm9vdCBwcm9wZXJ0eSdzIHZhbHVlIHByaW9yIHRvIGFueSB0d2VlbmluZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWUgPSBkYXRhLnJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGVbcm9vdFByb3BlcnR5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdmFsdWVzIHdlcmUgbm90IHRyYW5zZmVycmVkIGZyb20gYSBwcmV2aW91cyBWZWxvY2l0eSBjYWxsLCBxdWVyeSB0aGUgRE9NIGFzIG5lZWRlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBIYW5kbGUgaG9va2VkIHByb3BlcnRpZXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDU1MuSG9va3MucmVnaXN0ZXJlZFtwcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFydFZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSA9IENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIHJvb3RQcm9wZXJ0eSk7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFRoZSBmb2xsb3dpbmcgZ2V0UHJvcGVydHlWYWx1ZSgpIGNhbGwgZG9lcyBub3QgYWN0dWFsbHkgdHJpZ2dlciBhIERPTSBxdWVyeTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0UHJvcGVydHlWYWx1ZSgpIHdpbGwgZXh0cmFjdCB0aGUgaG9vayBmcm9tIHJvb3RQcm9wZXJ0eVZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSBDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBwcm9wZXJ0eSwgcm9vdFByb3BlcnR5VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHN0YXJ0VmFsdWUgaXMgYWxyZWFkeSBkZWZpbmVkIHZpYSBmb3JjZWZlZWRpbmcsIGRvIG5vdCBxdWVyeSB0aGUgRE9NIGZvciB0aGUgcm9vdCBwcm9wZXJ0eSdzIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqdXN0IGdyYWIgcm9vdFByb3BlcnR5J3MgemVyby12YWx1ZSB0ZW1wbGF0ZSBmcm9tIENTUy5Ib29rcy4gVGhpcyBvdmVyd3JpdGVzIHRoZSBlbGVtZW50J3MgYWN0dWFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3QgcHJvcGVydHkgdmFsdWUgKGlmIG9uZSBpcyBzZXQpLCBidXQgdGhpcyBpcyBhY2NlcHRhYmxlIHNpbmNlIHRoZSBwcmltYXJ5IHJlYXNvbiB1c2VycyBmb3JjZWZlZWQgaXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYXZvaWQgRE9NIHF1ZXJpZXMsIGFuZCB0aHVzIHdlIGxpa2V3aXNlIGF2b2lkIHF1ZXJ5aW5nIHRoZSBET00gZm9yIHRoZSByb290IHByb3BlcnR5J3MgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEdyYWIgdGhpcyBob29rJ3MgemVyby12YWx1ZSB0ZW1wbGF0ZSwgZS5nLiBcIjBweCAwcHggMHB4IGJsYWNrXCIuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWUgPSBDU1MuSG9va3MudGVtcGxhdGVzW3Jvb3RQcm9wZXJ0eV1bMV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBIYW5kbGUgbm9uLWhvb2tlZCBwcm9wZXJ0aWVzIHRoYXQgaGF2ZW4ndCBhbHJlYWR5IGJlZW4gZGVmaW5lZCB2aWEgZm9yY2VmZWVkaW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN0YXJ0VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIHByb3BlcnR5KTsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmFsdWUgRGF0YSBFeHRyYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlcGFyYXRlZFZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZVVuaXRUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlVW5pdFR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTZXBhcmF0ZXMgYSBwcm9wZXJ0eSB2YWx1ZSBpbnRvIGl0cyBudW1lcmljIHZhbHVlIGFuZCBpdHMgdW5pdCB0eXBlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZXBhcmF0ZVZhbHVlID0gZnVuY3Rpb24ocHJvcGVydHksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1bml0VHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bWVyaWNWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1lcmljVmFsdWUgPSAodmFsdWUgfHwgXCIwXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudG9TdHJpbmcoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE1hdGNoIHRoZSB1bml0IHR5cGUgYXQgdGhlIGVuZCBvZiB0aGUgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvWyVBLXpdKyQvLCBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEdyYWIgdGhlIHVuaXQgdHlwZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0VHlwZSA9IG1hdGNoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU3RyaXAgdGhlIHVuaXQgdHlwZSBvZmYgb2YgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiBubyB1bml0IHR5cGUgd2FzIHN1cHBsaWVkLCBhc3NpZ24gb25lIHRoYXQgaXMgYXBwcm9wcmlhdGUgZm9yIHRoaXMgcHJvcGVydHkgKGUuZy4gXCJkZWdcIiBmb3Igcm90YXRlWiBvciBcInB4XCIgZm9yIHdpZHRoKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF1bml0VHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFR5cGUgPSBDU1MuVmFsdWVzLmdldFVuaXRUeXBlKHByb3BlcnR5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbbnVtZXJpY1ZhbHVlLCB1bml0VHlwZV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFydFZhbHVlICE9PSBlbmRWYWx1ZSAmJiBUeXBlLmlzU3RyaW5nKHN0YXJ0VmFsdWUpICYmIFR5cGUuaXNTdHJpbmcoZW5kVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm4gPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaVN0YXJ0ID0gMCwgLy8gaW5kZXggaW4gc3RhcnRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaUVuZCA9IDAsIC8vIGluZGV4IGluIGVuZFZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhU3RhcnQgPSBbXSwgLy8gYXJyYXkgb2Ygc3RhcnRWYWx1ZSBudW1iZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhRW5kID0gW10sIC8vIGFycmF5IG9mIGVuZFZhbHVlIG51bWJlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluQ2FsYyA9IDAsIC8vIEtlZXAgdHJhY2sgb2YgYmVpbmcgaW5zaWRlIGEgXCJjYWxjKClcIiBzbyB3ZSBkb24ndCBkdXBsaWNhdGUgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluUkdCID0gMCwgLy8gS2VlcCB0cmFjayBvZiBiZWluZyBpbnNpZGUgYW4gUkdCIGFzIHdlIGNhbid0IHVzZSBmcmFjdGlvbmFsIHZhbHVlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5SR0JBID0gMDsgLy8gS2VlcCB0cmFjayBvZiBiZWluZyBpbnNpZGUgYW4gUkdCQSBhcyB3ZSBtdXN0IHBhc3MgZnJhY3Rpb25hbCBmb3IgdGhlIGFscGhhIGNoYW5uZWxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gQ1NTLkhvb2tzLmZpeENvbG9ycyhzdGFydFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSBDU1MuSG9va3MuZml4Q29sb3JzKGVuZFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGlTdGFydCA8IHN0YXJ0VmFsdWUubGVuZ3RoICYmIGlFbmQgPCBlbmRWYWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjU3RhcnQgPSBzdGFydFZhbHVlW2lTdGFydF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY0VuZCA9IGVuZFZhbHVlW2lFbmRdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoL1tcXGRcXC5dLy50ZXN0KGNTdGFydCkgJiYgL1tcXGRcXC5dLy50ZXN0KGNFbmQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRTdGFydCA9IGNTdGFydCwgLy8gdGVtcG9yYXJ5IGNoYXJhY3RlciBidWZmZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdEVuZCA9IGNFbmQsIC8vIHRlbXBvcmFyeSBjaGFyYWN0ZXIgYnVmZmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvdFN0YXJ0ID0gXCIuXCIsIC8vIE1ha2Ugc3VyZSB3ZSBjYW4gb25seSBldmVyIG1hdGNoIGEgc2luZ2xlIGRvdCBpbiBhIGRlY2ltYWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG90RW5kID0gXCIuXCI7IC8vIE1ha2Ugc3VyZSB3ZSBjYW4gb25seSBldmVyIG1hdGNoIGEgc2luZ2xlIGRvdCBpbiBhIGRlY2ltYWxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICgrK2lTdGFydCA8IHN0YXJ0VmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNTdGFydCA9IHN0YXJ0VmFsdWVbaVN0YXJ0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNTdGFydCA9PT0gZG90U3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvdFN0YXJ0ID0gXCIuLlwiOyAvLyBDYW4gbmV2ZXIgbWF0Y2ggdHdvIGNoYXJhY3RlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghL1xcZC8udGVzdChjU3RhcnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0U3RhcnQgKz0gY1N0YXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoKytpRW5kIDwgZW5kVmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNFbmQgPSBlbmRWYWx1ZVtpRW5kXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNFbmQgPT09IGRvdEVuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG90RW5kID0gXCIuLlwiOyAvLyBDYW4gbmV2ZXIgbWF0Y2ggdHdvIGNoYXJhY3RlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghL1xcZC8udGVzdChjRW5kKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdEVuZCArPSBjRW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdVN0YXJ0ID0gQ1NTLkhvb2tzLmdldFVuaXQoc3RhcnRWYWx1ZSwgaVN0YXJ0KSwgLy8gdGVtcG9yYXJ5IHVuaXQgdHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1RW5kID0gQ1NTLkhvb2tzLmdldFVuaXQoZW5kVmFsdWUsIGlFbmQpOyAvLyB0ZW1wb3JhcnkgdW5pdCB0eXBlXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpU3RhcnQgKz0gdVN0YXJ0Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpRW5kICs9IHVFbmQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1U3RhcnQgPT09IHVFbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2FtZSB1bml0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodFN0YXJ0ID09PSB0RW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTYW1lIG51bWJlcnMsIHNvIGp1c3QgY29weSBvdmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuICs9IHRTdGFydCArIHVTdGFydDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERpZmZlcmVudCBudW1iZXJzLCBzbyBzdG9yZSB0aGVtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuICs9IFwie1wiICsgYVN0YXJ0Lmxlbmd0aCArIChpblJHQiA/IFwiIVwiIDogXCJcIikgKyBcIn1cIiArIHVTdGFydDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFTdGFydC5wdXNoKHBhcnNlRmxvYXQodFN0YXJ0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhRW5kLnB1c2gocGFyc2VGbG9hdCh0RW5kKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEaWZmZXJlbnQgdW5pdHMsIHNvIHB1dCBpbnRvIGEgXCJjYWxjKGZyb20gKyB0bylcIiBhbmQgYW5pbWF0ZSBlYWNoIHNpZGUgdG8vZnJvbSB6ZXJvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuU3RhcnQgPSBwYXJzZUZsb2F0KHRTdGFydCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuRW5kID0gcGFyc2VGbG9hdCh0RW5kKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuICs9IChpbkNhbGMgPCA1ID8gXCJjYWxjXCIgOiBcIlwiKSArIFwiKFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIChuU3RhcnQgPyBcIntcIiArIGFTdGFydC5sZW5ndGggKyAoaW5SR0IgPyBcIiFcIiA6IFwiXCIpICsgXCJ9XCIgOiBcIjBcIikgKyB1U3RhcnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCIgKyBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAobkVuZCA/IFwie1wiICsgKGFTdGFydC5sZW5ndGggKyAoblN0YXJ0ID8gMSA6IDApKSArIChpblJHQiA/IFwiIVwiIDogXCJcIikgKyBcIn1cIiA6IFwiMFwiKSArIHVFbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuU3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFTdGFydC5wdXNoKG5TdGFydCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhRW5kLnB1c2goMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5FbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFTdGFydC5wdXNoKDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYUVuZC5wdXNoKG5FbmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjU3RhcnQgPT09IGNFbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuICs9IGNTdGFydDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpU3RhcnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpRW5kKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS2VlcCB0cmFjayBvZiBiZWluZyBpbnNpZGUgYSBjYWxjKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5DYWxjID09PSAwICYmIGNTdGFydCA9PT0gXCJjXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgaW5DYWxjID09PSAxICYmIGNTdGFydCA9PT0gXCJhXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgaW5DYWxjID09PSAyICYmIGNTdGFydCA9PT0gXCJsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgaW5DYWxjID09PSAzICYmIGNTdGFydCA9PT0gXCJjXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgaW5DYWxjID49IDQgJiYgY1N0YXJ0ID09PSBcIihcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbkNhbGMrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKChpbkNhbGMgJiYgaW5DYWxjIDwgNSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgaW5DYWxjID49IDQgJiYgY1N0YXJ0ID09PSBcIilcIiAmJiAtLWluQ2FsYyA8IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5DYWxjID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS2VlcCB0cmFjayBvZiBiZWluZyBpbnNpZGUgYW4gcmdiKCkgLyByZ2JhKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5SR0IgPT09IDAgJiYgY1N0YXJ0ID09PSBcInJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBpblJHQiA9PT0gMSAmJiBjU3RhcnQgPT09IFwiZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGluUkdCID09PSAyICYmIGNTdGFydCA9PT0gXCJiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgaW5SR0IgPT09IDMgJiYgY1N0YXJ0ID09PSBcImFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBpblJHQiA+PSAzICYmIGNTdGFydCA9PT0gXCIoXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluUkdCID09PSAzICYmIGNTdGFydCA9PT0gXCJhXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluUkdCQSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5SR0IrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluUkdCQSAmJiBjU3RhcnQgPT09IFwiLFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgrK2luUkdCQSA+IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluUkdCID0gaW5SR0JBID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoKGluUkdCQSAmJiBpblJHQiA8IChpblJHQkEgPyA1IDogNCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGluUkdCID49IChpblJHQkEgPyA0IDogMykgJiYgY1N0YXJ0ID09PSBcIilcIiAmJiAtLWluUkdCIDwgKGluUkdCQSA/IDUgOiA0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpblJHQiA9IGluUkdCQSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbkNhbGMgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IGNoYW5naW5nIHVuaXRzLCBmaXhpbmcgY29sb3Vyc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpU3RhcnQgIT09IHN0YXJ0VmFsdWUubGVuZ3RoIHx8IGlFbmQgIT09IGVuZFZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFZlbG9jaXR5LmRlYnVnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlRyeWluZyB0byBwYXR0ZXJuIG1hdGNoIG1pcy1tYXRjaGVkIHN0cmluZ3MgW1xcXCJcIiArIGVuZFZhbHVlICsgXCJcXFwiLCBcXFwiXCIgKyBzdGFydFZhbHVlICsgXCJcXFwiXVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm4gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhU3RhcnQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFZlbG9jaXR5LmRlYnVnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUGF0dGVybiBmb3VuZCBcXFwiXCIgKyBwYXR0ZXJuICsgXCJcXFwiIC0+IFwiLCBhU3RhcnQsIGFFbmQsIFwiW1wiICsgc3RhcnRWYWx1ZSArIFwiLFwiICsgZW5kVmFsdWUgKyBcIl1cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSBhU3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSBhRW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlVW5pdFR5cGUgPSBzdGFydFZhbHVlVW5pdFR5cGUgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwYXR0ZXJuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNlcGFyYXRlIHN0YXJ0VmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcGFyYXRlZFZhbHVlID0gc2VwYXJhdGVWYWx1ZShwcm9wZXJ0eSwgc3RhcnRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSBzZXBhcmF0ZWRWYWx1ZVswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZVVuaXRUeXBlID0gc2VwYXJhdGVkVmFsdWVbMV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU2VwYXJhdGUgZW5kVmFsdWUsIGFuZCBleHRyYWN0IGEgdmFsdWUgb3BlcmF0b3IgKGUuZy4gXCIrPVwiLCBcIi09XCIpIGlmIG9uZSBleGlzdHMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcGFyYXRlZFZhbHVlID0gc2VwYXJhdGVWYWx1ZShwcm9wZXJ0eSwgZW5kVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IHNlcGFyYXRlZFZhbHVlWzBdLnJlcGxhY2UoL14oWystXFwvKl0pPS8sIGZ1bmN0aW9uKG1hdGNoLCBzdWJNYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0b3IgPSBzdWJNYXRjaDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU3RyaXAgdGhlIG9wZXJhdG9yIG9mZiBvZiB0aGUgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlVW5pdFR5cGUgPSBzZXBhcmF0ZWRWYWx1ZVsxXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBQYXJzZSBmbG9hdCB2YWx1ZXMgZnJvbSBlbmRWYWx1ZSBhbmQgc3RhcnRWYWx1ZS4gRGVmYXVsdCB0byAwIGlmIE5hTiBpcyByZXR1cm5lZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IHBhcnNlRmxvYXQoc3RhcnRWYWx1ZSkgfHwgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSBwYXJzZUZsb2F0KGVuZFZhbHVlKSB8fCAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFByb3BlcnR5LVNwZWNpZmljIFZhbHVlIENvbnZlcnNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDdXN0b20gc3VwcG9ydCBmb3IgcHJvcGVydGllcyB0aGF0IGRvbid0IGFjdHVhbGx5IGFjY2VwdCB0aGUgJSB1bml0IHR5cGUsIGJ1dCB3aGVyZSBwb2xseWZpbGxpbmcgaXMgdHJpdmlhbCBhbmQgcmVsYXRpdmVseSBmb29scHJvb2YuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbmRWYWx1ZVVuaXRUeXBlID09PSBcIiVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQSAlLXZhbHVlIGZvbnRTaXplL2xpbmVIZWlnaHQgaXMgcmVsYXRpdmUgdG8gdGhlIHBhcmVudCdzIGZvbnRTaXplIChhcyBvcHBvc2VkIHRvIHRoZSBwYXJlbnQncyBkaW1lbnNpb25zKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGljaCBpcyBpZGVudGljYWwgdG8gdGhlIGVtIHVuaXQncyBiZWhhdmlvciwgc28gd2UgcGlnZ3liYWNrIG9mZiBvZiB0aGF0LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC9eKGZvbnRTaXplfGxpbmVIZWlnaHQpJC8udGVzdChwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDb252ZXJ0ICUgaW50byBhbiBlbSBkZWNpbWFsIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gZW5kVmFsdWUgLyAxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWVVbml0VHlwZSA9IFwiZW1cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBGb3Igc2NhbGVYIGFuZCBzY2FsZVksIGNvbnZlcnQgdGhlIHZhbHVlIGludG8gaXRzIGRlY2ltYWwgZm9ybWF0IGFuZCBzdHJpcCBvZmYgdGhlIHVuaXQgdHlwZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoL15zY2FsZS8udGVzdChwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IGVuZFZhbHVlIC8gMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlVW5pdFR5cGUgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZvciBSR0IgY29tcG9uZW50cywgdGFrZSB0aGUgZGVmaW5lZCBwZXJjZW50YWdlIG9mIDI1NSBhbmQgc3RyaXAgb2ZmIHRoZSB1bml0IHR5cGUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKC8oUmVkfEdyZWVufEJsdWUpJC9pLnRlc3QocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSAoZW5kVmFsdWUgLyAxMDApICogMjU1O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlVW5pdFR5cGUgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBVbml0IFJhdGlvIENhbGN1bGF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFdoZW4gcXVlcmllZCwgdGhlIGJyb3dzZXIgcmV0dXJucyAobW9zdCkgQ1NTIHByb3BlcnR5IHZhbHVlcyBpbiBwaXhlbHMuIFRoZXJlZm9yZSwgaWYgYW4gZW5kVmFsdWUgd2l0aCBhIHVuaXQgdHlwZSBvZlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAlLCBlbSwgb3IgcmVtIGlzIGFuaW1hdGVkIHRvd2FyZCwgc3RhcnRWYWx1ZSBtdXN0IGJlIGNvbnZlcnRlZCBmcm9tIHBpeGVscyBpbnRvIHRoZSBzYW1lIHVuaXQgdHlwZSBhcyBlbmRWYWx1ZSBpbiBvcmRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgdmFsdWUgbWFuaXB1bGF0aW9uIGxvZ2ljIChpbmNyZW1lbnQvZGVjcmVtZW50KSB0byBwcm9jZWVkLiBGdXJ0aGVyLCBpZiB0aGUgc3RhcnRWYWx1ZSB3YXMgZm9yY2VmZWQgb3IgdHJhbnNmZXJyZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSBhIHByZXZpb3VzIGNhbGwsIHN0YXJ0VmFsdWUgbWF5IGFsc28gbm90IGJlIGluIHBpeGVscy4gVW5pdCBjb252ZXJzaW9uIGxvZ2ljIHRoZXJlZm9yZSBjb25zaXN0cyBvZiB0d28gc3RlcHM6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEpIENhbGN1bGF0aW5nIHRoZSByYXRpbyBvZiAlL2VtL3JlbS92aC92dyByZWxhdGl2ZSB0byBwaXhlbHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMikgQ29udmVydGluZyBzdGFydFZhbHVlIGludG8gdGhlIHNhbWUgdW5pdCBvZiBtZWFzdXJlbWVudCBhcyBlbmRWYWx1ZSBiYXNlZCBvbiB0aGVzZSByYXRpb3MuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVW5pdCBjb252ZXJzaW9uIHJhdGlvcyBhcmUgY2FsY3VsYXRlZCBieSBpbnNlcnRpbmcgYSBzaWJsaW5nIG5vZGUgbmV4dCB0byB0aGUgdGFyZ2V0IG5vZGUsIGNvcHlpbmcgb3ZlciBpdHMgcG9zaXRpb24gcHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmcgdmFsdWVzIHdpdGggdGhlIHRhcmdldCB1bml0IHR5cGUgdGhlbiBjb21wYXJpbmcgdGhlIHJldHVybmVkIHBpeGVsIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IEV2ZW4gaWYgb25seSBvbmUgb2YgdGhlc2UgdW5pdCB0eXBlcyBpcyBiZWluZyBhbmltYXRlZCwgYWxsIHVuaXQgcmF0aW9zIGFyZSBjYWxjdWxhdGVkIGF0IG9uY2Ugc2luY2UgdGhlIG92ZXJoZWFkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mIGJhdGNoaW5nIHRoZSBTRVRzIGFuZCBHRVRzIHRvZ2V0aGVyIHVwZnJvbnQgb3V0d2VpZ2h0cyB0aGUgcG90ZW50aWFsIG92ZXJoZWFkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mIGxheW91dCB0aHJhc2hpbmcgY2F1c2VkIGJ5IHJlLXF1ZXJ5aW5nIGZvciB1bmNhbGN1bGF0ZWQgcmF0aW9zIGZvciBzdWJzZXF1ZW50bHktcHJvY2Vzc2VkIHByb3BlcnRpZXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVG9kbzogU2hpZnQgdGhpcyBsb2dpYyBpbnRvIHRoZSBjYWxscycgZmlyc3QgdGljayBpbnN0YW5jZSBzbyB0aGF0IGl0J3Mgc3luY2VkIHdpdGggUkFGLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjYWxjdWxhdGVVbml0UmF0aW9zID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2FtZSBSYXRpbyBDaGVja3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBUaGUgcHJvcGVydGllcyBiZWxvdyBhcmUgdXNlZCB0byBkZXRlcm1pbmUgd2hldGhlciB0aGUgZWxlbWVudCBkaWZmZXJzIHN1ZmZpY2llbnRseSBmcm9tIHRoaXMgY2FsbCdzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2aW91c2x5IGl0ZXJhdGVkIGVsZW1lbnQgdG8gYWxzbyBkaWZmZXIgaW4gaXRzIHVuaXQgY29udmVyc2lvbiByYXRpb3MuIElmIHRoZSBwcm9wZXJ0aWVzIG1hdGNoIHVwIHdpdGggdGhvc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mIHRoZSBwcmlvciBlbGVtZW50LCB0aGUgcHJpb3IgZWxlbWVudCdzIGNvbnZlcnNpb24gcmF0aW9zIGFyZSB1c2VkLiBMaWtlIG1vc3Qgb3B0aW1pemF0aW9ucyBpbiBWZWxvY2l0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMgaXMgZG9uZSB0byBtaW5pbWl6ZSBET00gcXVlcnlpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzYW1lUmF0aW9JbmRpY2F0b3JzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG15UGFyZW50OiBlbGVtZW50LnBhcmVudE5vZGUgfHwgZG9jdW1lbnQuYm9keSwgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwicG9zaXRpb25cIiksIC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcImZvbnRTaXplXCIpIC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIERldGVybWluZSBpZiB0aGUgc2FtZSAlIHJhdGlvIGNhbiBiZSB1c2VkLiAlIGlzIGJhc2VkIG9uIHRoZSBlbGVtZW50J3MgcG9zaXRpb24gdmFsdWUgYW5kIGl0cyBwYXJlbnQncyB3aWR0aCBhbmQgaGVpZ2h0IGRpbWVuc2lvbnMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYW1lUGVyY2VudFJhdGlvID0gKChzYW1lUmF0aW9JbmRpY2F0b3JzLnBvc2l0aW9uID09PSBjYWxsVW5pdENvbnZlcnNpb25EYXRhLmxhc3RQb3NpdGlvbikgJiYgKHNhbWVSYXRpb0luZGljYXRvcnMubXlQYXJlbnQgPT09IGNhbGxVbml0Q29udmVyc2lvbkRhdGEubGFzdFBhcmVudCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRGV0ZXJtaW5lIGlmIHRoZSBzYW1lIGVtIHJhdGlvIGNhbiBiZSB1c2VkLiBlbSBpcyByZWxhdGl2ZSB0byB0aGUgZWxlbWVudCdzIGZvbnRTaXplLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2FtZUVtUmF0aW8gPSAoc2FtZVJhdGlvSW5kaWNhdG9ycy5mb250U2l6ZSA9PT0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0Rm9udFNpemUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFN0b3JlIHRoZXNlIHJhdGlvIGluZGljYXRvcnMgY2FsbC13aWRlIGZvciB0aGUgbmV4dCBlbGVtZW50IHRvIGNvbXBhcmUgYWdhaW5zdC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0UGFyZW50ID0gc2FtZVJhdGlvSW5kaWNhdG9ycy5teVBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0UG9zaXRpb24gPSBzYW1lUmF0aW9JbmRpY2F0b3JzLnBvc2l0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsVW5pdENvbnZlcnNpb25EYXRhLmxhc3RGb250U2l6ZSA9IHNhbWVSYXRpb0luZGljYXRvcnMuZm9udFNpemU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRWxlbWVudC1TcGVjaWZpYyBVbml0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IElFOCByb3VuZHMgdG8gdGhlIG5lYXJlc3QgcGl4ZWwgd2hlbiByZXR1cm5pbmcgQ1NTIHZhbHVlcywgdGh1cyB3ZSBwZXJmb3JtIGNvbnZlcnNpb25zIHVzaW5nIGEgbWVhc3VyZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mIDEwMCAoaW5zdGVhZCBvZiAxKSB0byBnaXZlIG91ciByYXRpb3MgYSBwcmVjaXNpb24gb2YgYXQgbGVhc3QgMiBkZWNpbWFsIHZhbHVlcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1lYXN1cmVtZW50ID0gMTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFJhdGlvcyA9IHt9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2FtZUVtUmF0aW8gfHwgIXNhbWVQZXJjZW50UmF0aW8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkdW1teSA9IGRhdGEgJiYgZGF0YS5pc1NWRyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwicmVjdFwiKSA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LmluaXQoZHVtbXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2FtZVJhdGlvSW5kaWNhdG9ycy5teVBhcmVudC5hcHBlbmRDaGlsZChkdW1teSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRvIGFjY3VyYXRlbHkgYW5kIGNvbnNpc3RlbnRseSBjYWxjdWxhdGUgY29udmVyc2lvbiByYXRpb3MsIHRoZSBlbGVtZW50J3MgY2FzY2FkZWQgb3ZlcmZsb3cgYW5kIGJveC1zaXppbmcgYXJlIHN0cmlwcGVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNpbWlsYXJseSwgc2luY2Ugd2lkdGgvaGVpZ2h0IGNhbiBiZSBhcnRpZmljaWFsbHkgY29uc3RyYWluZWQgYnkgdGhlaXIgbWluLS9tYXgtIGVxdWl2YWxlbnRzLCB0aGVzZSBhcmUgY29udHJvbGxlZCBmb3IgYXMgd2VsbC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IE92ZXJmbG93IG11c3QgYmUgYWxzbyBiZSBjb250cm9sbGVkIGZvciBwZXItYXhpcyBzaW5jZSB0aGUgb3ZlcmZsb3cgcHJvcGVydHkgb3ZlcndyaXRlcyBpdHMgcGVyLWF4aXMgdmFsdWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKFtcIm92ZXJmbG93XCIsIFwib3ZlcmZsb3dYXCIsIFwib3ZlcmZsb3dZXCJdLCBmdW5jdGlvbihpLCBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGR1bW15LCBwcm9wZXJ0eSwgXCJoaWRkZW5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGR1bW15LCBcInBvc2l0aW9uXCIsIHNhbWVSYXRpb0luZGljYXRvcnMucG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuQ1NTLnNldFByb3BlcnR5VmFsdWUoZHVtbXksIFwiZm9udFNpemVcIiwgc2FtZVJhdGlvSW5kaWNhdG9ycy5mb250U2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5DU1Muc2V0UHJvcGVydHlWYWx1ZShkdW1teSwgXCJib3hTaXppbmdcIiwgXCJjb250ZW50LWJveFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogd2lkdGggYW5kIGhlaWdodCBhY3QgYXMgb3VyIHByb3h5IHByb3BlcnRpZXMgZm9yIG1lYXN1cmluZyB0aGUgaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgJSByYXRpb3MuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goW1wibWluV2lkdGhcIiwgXCJtYXhXaWR0aFwiLCBcIndpZHRoXCIsIFwibWluSGVpZ2h0XCIsIFwibWF4SGVpZ2h0XCIsIFwiaGVpZ2h0XCJdLCBmdW5jdGlvbihpLCBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGR1bW15LCBwcm9wZXJ0eSwgbWVhc3VyZW1lbnQgKyBcIiVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIHBhZGRpbmdMZWZ0IGFyYml0cmFyaWx5IGFjdHMgYXMgb3VyIHByb3h5IHByb3BlcnR5IGZvciB0aGUgZW0gcmF0aW8uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5DU1Muc2V0UHJvcGVydHlWYWx1ZShkdW1teSwgXCJwYWRkaW5nTGVmdFwiLCBtZWFzdXJlbWVudCArIFwiZW1cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIERpdmlkZSB0aGUgcmV0dXJuZWQgdmFsdWUgYnkgdGhlIG1lYXN1cmVtZW50IHRvIGdldCB0aGUgcmF0aW8gYmV0d2VlbiAxJSBhbmQgMXB4LiBEZWZhdWx0IHRvIDEgc2luY2Ugd29ya2luZyB3aXRoIDAgY2FuIHByb2R1Y2UgSW5maW5pdGUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0UmF0aW9zLnBlcmNlbnRUb1B4V2lkdGggPSBjYWxsVW5pdENvbnZlcnNpb25EYXRhLmxhc3RQZXJjZW50VG9QeFdpZHRoID0gKHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZHVtbXksIFwid2lkdGhcIiwgbnVsbCwgdHJ1ZSkpIHx8IDEpIC8gbWVhc3VyZW1lbnQ7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFJhdGlvcy5wZXJjZW50VG9QeEhlaWdodCA9IGNhbGxVbml0Q29udmVyc2lvbkRhdGEubGFzdFBlcmNlbnRUb1B4SGVpZ2h0ID0gKHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZHVtbXksIFwiaGVpZ2h0XCIsIG51bGwsIHRydWUpKSB8fCAxKSAvIG1lYXN1cmVtZW50OyAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MuZW1Ub1B4ID0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0RW1Ub1B4ID0gKHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZHVtbXksIFwicGFkZGluZ0xlZnRcIikpIHx8IDEpIC8gbWVhc3VyZW1lbnQ7IC8qIEdFVCAqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYW1lUmF0aW9JbmRpY2F0b3JzLm15UGFyZW50LnJlbW92ZUNoaWxkKGR1bW15KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MuZW1Ub1B4ID0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0RW1Ub1B4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFJhdGlvcy5wZXJjZW50VG9QeFdpZHRoID0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0UGVyY2VudFRvUHhXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MucGVyY2VudFRvUHhIZWlnaHQgPSBjYWxsVW5pdENvbnZlcnNpb25EYXRhLmxhc3RQZXJjZW50VG9QeEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVsZW1lbnQtQWdub3N0aWMgVW5pdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBXaGVyZWFzICUgYW5kIGVtIHJhdGlvcyBhcmUgZGV0ZXJtaW5lZCBvbiBhIHBlci1lbGVtZW50IGJhc2lzLCB0aGUgcmVtIHVuaXQgb25seSBuZWVkcyB0byBiZSBjaGVja2VkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbmNlIHBlciBjYWxsIHNpbmNlIGl0J3MgZXhjbHVzaXZlbHkgZGVwZW5kYW50IHVwb24gZG9jdW1lbnQuYm9keSdzIGZvbnRTaXplLiBJZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0IGNhbGN1bGF0ZVVuaXRSYXRpb3MoKSBpcyBiZWluZyBydW4gZHVyaW5nIHRoaXMgY2FsbCwgcmVtVG9QeCB3aWxsIHN0aWxsIGJlIHNldCB0byBpdHMgZGVmYXVsdCB2YWx1ZSBvZiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc28gd2UgY2FsY3VsYXRlIGl0IG5vdy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxVbml0Q29udmVyc2lvbkRhdGEucmVtVG9QeCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRGVmYXVsdCB0byBicm93c2VycycgZGVmYXVsdCBmb250U2l6ZSBvZiAxNnB4IGluIHRoZSBjYXNlIG9mIDAuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsVW5pdENvbnZlcnNpb25EYXRhLnJlbVRvUHggPSBwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGRvY3VtZW50LmJvZHksIFwiZm9udFNpemVcIikpIHx8IDE2OyAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNpbWlsYXJseSwgdmlld3BvcnQgdW5pdHMgYXJlICUtcmVsYXRpdmUgdG8gdGhlIHdpbmRvdydzIGlubmVyIGRpbWVuc2lvbnMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsVW5pdENvbnZlcnNpb25EYXRhLnZ3VG9QeCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbFVuaXRDb252ZXJzaW9uRGF0YS52d1RvUHggPSBwYXJzZUZsb2F0KHdpbmRvdy5pbm5lcldpZHRoKSAvIDEwMDsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsVW5pdENvbnZlcnNpb25EYXRhLnZoVG9QeCA9IHBhcnNlRmxvYXQod2luZG93LmlubmVySGVpZ2h0KSAvIDEwMDsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0UmF0aW9zLnJlbVRvUHggPSBjYWxsVW5pdENvbnZlcnNpb25EYXRhLnJlbVRvUHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MudndUb1B4ID0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS52d1RvUHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MudmhUb1B4ID0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS52aFRvUHg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFZlbG9jaXR5LmRlYnVnID49IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5pdCByYXRpb3M6IFwiICsgSlNPTi5zdHJpbmdpZnkodW5pdFJhdGlvcyksIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1bml0UmF0aW9zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVW5pdCBDb252ZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVGhlICogYW5kIC8gb3BlcmF0b3JzLCB3aGljaCBhcmUgbm90IHBhc3NlZCBpbiB3aXRoIGFuIGFzc29jaWF0ZWQgdW5pdCwgaW5oZXJlbnRseSB1c2Ugc3RhcnRWYWx1ZSdzIHVuaXQuIFNraXAgdmFsdWUgYW5kIHVuaXQgY29udmVyc2lvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoL1tcXC8qXS8udGVzdChvcGVyYXRvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWVVbml0VHlwZSA9IHN0YXJ0VmFsdWVVbml0VHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgc3RhcnRWYWx1ZSBhbmQgZW5kVmFsdWUgZGlmZmVyIGluIHVuaXQgdHlwZSwgY29udmVydCBzdGFydFZhbHVlIGludG8gdGhlIHNhbWUgdW5pdCB0eXBlIGFzIGVuZFZhbHVlIHNvIHRoYXQgaWYgZW5kVmFsdWVVbml0VHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXMgYSByZWxhdGl2ZSB1bml0ICglLCBlbSwgcmVtKSwgdGhlIHZhbHVlcyBzZXQgZHVyaW5nIHR3ZWVuaW5nIHdpbGwgY29udGludWUgdG8gYmUgYWNjdXJhdGVseSByZWxhdGl2ZSBldmVuIGlmIHRoZSBtZXRyaWNzIHRoZXkgZGVwZW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbiBhcmUgZHluYW1pY2FsbHkgY2hhbmdpbmcgZHVyaW5nIHRoZSBjb3Vyc2Ugb2YgdGhlIGFuaW1hdGlvbi4gQ29udmVyc2VseSwgaWYgd2UgYWx3YXlzIG5vcm1hbGl6ZWQgaW50byBweCBhbmQgdXNlZCBweCBmb3Igc2V0dGluZyB2YWx1ZXMsIHRoZSBweCByYXRpb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd291bGQgYmVjb21lIHN0YWxlIGlmIHRoZSBvcmlnaW5hbCB1bml0IGJlaW5nIGFuaW1hdGVkIHRvd2FyZCB3YXMgcmVsYXRpdmUgYW5kIHRoZSB1bmRlcmx5aW5nIG1ldHJpY3MgY2hhbmdlIGR1cmluZyB0aGUgYW5pbWF0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTaW5jZSAwIGlzIDAgaW4gYW55IHVuaXQgdHlwZSwgbm8gY29udmVyc2lvbiBpcyBuZWNlc3Nhcnkgd2hlbiBzdGFydFZhbHVlIGlzIDAgLS0gd2UganVzdCBzdGFydCBhdCAwIHdpdGggZW5kVmFsdWVVbml0VHlwZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKChzdGFydFZhbHVlVW5pdFR5cGUgIT09IGVuZFZhbHVlVW5pdFR5cGUpICYmIHN0YXJ0VmFsdWUgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVW5pdCBjb252ZXJzaW9uIGlzIGFsc28gc2tpcHBlZCB3aGVuIGVuZFZhbHVlIGlzIDAsIGJ1dCAqc3RhcnRWYWx1ZVVuaXRUeXBlKiBtdXN0IGJlIHVzZWQgZm9yIHR3ZWVuIHZhbHVlcyB0byByZW1haW4gYWNjdXJhdGUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFNraXBwaW5nIHVuaXQgY29udmVyc2lvbiBoZXJlIG1lYW5zIHRoYXQgaWYgZW5kVmFsdWVVbml0VHlwZSB3YXMgb3JpZ2luYWxseSBhIHJlbGF0aXZlIHVuaXQsIHRoZSBhbmltYXRpb24gd29uJ3QgcmVsYXRpdmVseVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggdGhlIHVuZGVybHlpbmcgbWV0cmljcyBpZiB0aGV5IGNoYW5nZSwgYnV0IHRoaXMgaXMgYWNjZXB0YWJsZSBzaW5jZSB3ZSdyZSBhbmltYXRpbmcgdG93YXJkIGludmlzaWJpbGl0eSBpbnN0ZWFkIG9mIHRvd2FyZCB2aXNpYmlsaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpY2ggcmVtYWlucyBwYXN0IHRoZSBwb2ludCBvZiB0aGUgYW5pbWF0aW9uJ3MgY29tcGxldGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVuZFZhbHVlID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZVVuaXRUeXBlID0gc3RhcnRWYWx1ZVVuaXRUeXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQnkgdGhpcyBwb2ludCwgd2UgY2Fubm90IGF2b2lkIHVuaXQgY29udmVyc2lvbiAoaXQncyB1bmRlc2lyYWJsZSBzaW5jZSBpdCBjYXVzZXMgbGF5b3V0IHRocmFzaGluZykuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSWYgd2UgaGF2ZW4ndCBhbHJlYWR5LCB3ZSB0cmlnZ2VyIGNhbGN1bGF0ZVVuaXRSYXRpb3MoKSwgd2hpY2ggcnVucyBvbmNlIHBlciBlbGVtZW50IHBlciBjYWxsLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFVuaXRDb252ZXJzaW9uRGF0YSA9IGVsZW1lbnRVbml0Q29udmVyc2lvbkRhdGEgfHwgY2FsY3VsYXRlVW5pdFJhdGlvcygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBUaGUgZm9sbG93aW5nIFJlZ0V4IG1hdGNoZXMgQ1NTIHByb3BlcnRpZXMgdGhhdCBoYXZlIHRoZWlyICUgdmFsdWVzIG1lYXN1cmVkIHJlbGF0aXZlIHRvIHRoZSB4LWF4aXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBXM0Mgc3BlYyBtYW5kYXRlcyB0aGF0IGFsbCBvZiBtYXJnaW4gYW5kIHBhZGRpbmcncyBwcm9wZXJ0aWVzIChldmVuIHRvcCBhbmQgYm90dG9tKSBhcmUgJS1yZWxhdGl2ZSB0byB0aGUgKndpZHRoKiBvZiB0aGUgcGFyZW50IGVsZW1lbnQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXhpcyA9ICgvbWFyZ2lufHBhZGRpbmd8bGVmdHxyaWdodHx3aWR0aHx0ZXh0fHdvcmR8bGV0dGVyL2kudGVzdChwcm9wZXJ0eSkgfHwgL1gkLy50ZXN0KHByb3BlcnR5KSB8fCBwcm9wZXJ0eSA9PT0gXCJ4XCIpID8gXCJ4XCIgOiBcInlcIjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSW4gb3JkZXIgdG8gYXZvaWQgZ2VuZXJhdGluZyBuXjIgYmVzcG9rZSBjb252ZXJzaW9uIGZ1bmN0aW9ucywgdW5pdCBjb252ZXJzaW9uIGlzIGEgdHdvLXN0ZXAgcHJvY2VzczpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAxKSBDb252ZXJ0IHN0YXJ0VmFsdWUgaW50byBwaXhlbHMuIDIpIENvbnZlcnQgdGhpcyBuZXcgcGl4ZWwgdmFsdWUgaW50byBlbmRWYWx1ZSdzIHVuaXQgdHlwZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoc3RhcnRWYWx1ZVVuaXRUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIiVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogdHJhbnNsYXRlWCBhbmQgdHJhbnNsYXRlWSBhcmUgdGhlIG9ubHkgcHJvcGVydGllcyB0aGF0IGFyZSAlLXJlbGF0aXZlIHRvIGFuIGVsZW1lbnQncyBvd24gZGltZW5zaW9ucyAtLSBub3QgaXRzIHBhcmVudCdzIGRpbWVuc2lvbnMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eSBkb2VzIG5vdCBpbmNsdWRlIGEgc3BlY2lhbCBjb252ZXJzaW9uIHByb2Nlc3MgdG8gYWNjb3VudCBmb3IgdGhpcyBiZWhhdmlvci4gVGhlcmVmb3JlLCBhbmltYXRpbmcgdHJhbnNsYXRlWC9ZIGZyb20gYSAlIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vbi0lIHZhbHVlIHdpbGwgcHJvZHVjZSBhbiBpbmNvcnJlY3Qgc3RhcnQgdmFsdWUuIEZvcnR1bmF0ZWx5LCB0aGlzIHNvcnQgb2YgY3Jvc3MtdW5pdCBjb252ZXJzaW9uIGlzIHJhcmVseSBkb25lIGJ5IHVzZXJzIGluIHByYWN0aWNlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlICo9IChheGlzID09PSBcInhcIiA/IGVsZW1lbnRVbml0Q29udmVyc2lvbkRhdGEucGVyY2VudFRvUHhXaWR0aCA6IGVsZW1lbnRVbml0Q29udmVyc2lvbkRhdGEucGVyY2VudFRvUHhIZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJweFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBweCBhY3RzIGFzIG91ciBtaWRwb2ludCBpbiB0aGUgdW5pdCBjb252ZXJzaW9uIHByb2Nlc3M7IGRvIG5vdGhpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSAqPSBlbGVtZW50VW5pdENvbnZlcnNpb25EYXRhW3N0YXJ0VmFsdWVVbml0VHlwZSArIFwiVG9QeFwiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSW52ZXJ0IHRoZSBweCByYXRpb3MgdG8gY29udmVydCBpbnRvIHRvIHRoZSB0YXJnZXQgdW5pdC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZW5kVmFsdWVVbml0VHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCIlXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgKj0gMSAvIChheGlzID09PSBcInhcIiA/IGVsZW1lbnRVbml0Q29udmVyc2lvbkRhdGEucGVyY2VudFRvUHhXaWR0aCA6IGVsZW1lbnRVbml0Q29udmVyc2lvbkRhdGEucGVyY2VudFRvUHhIZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJweFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBzdGFydFZhbHVlIGlzIGFscmVhZHkgaW4gcHgsIGRvIG5vdGhpbmc7IHdlJ3JlIGRvbmUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSAqPSAxIC8gZWxlbWVudFVuaXRDb252ZXJzaW9uRGF0YVtlbmRWYWx1ZVVuaXRUeXBlICsgXCJUb1B4XCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWxhdGl2ZSBWYWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogT3BlcmF0b3IgbG9naWMgbXVzdCBiZSBwZXJmb3JtZWQgbGFzdCBzaW5jZSBpdCByZXF1aXJlcyB1bml0LW5vcm1hbGl6ZWQgc3RhcnQgYW5kIGVuZCB2YWx1ZXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogUmVsYXRpdmUgKnBlcmNlbnQgdmFsdWVzKiBkbyBub3QgYmVoYXZlIGhvdyBtb3N0IHBlb3BsZSB0aGluazsgd2hpbGUgb25lIHdvdWxkIGV4cGVjdCBcIis9NTAlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gaW5jcmVhc2UgdGhlIHByb3BlcnR5IDEuNXggaXRzIGN1cnJlbnQgdmFsdWUsIGl0IGluIGZhY3QgaW5jcmVhc2VzIHRoZSBwZXJjZW50IHVuaXRzIGluIGFic29sdXRlIHRlcm1zOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA1MCBwb2ludHMgaXMgYWRkZWQgb24gdG9wIG9mIHRoZSBjdXJyZW50ICUgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChvcGVyYXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiK1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSBzdGFydFZhbHVlICsgZW5kVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiLVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSBzdGFydFZhbHVlIC0gZW5kVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiKlwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSBzdGFydFZhbHVlICogZW5kVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiL1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSBzdGFydFZhbHVlIC8gZW5kVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW5zQ29udGFpbmVyIFB1c2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgdGhlIHBlci1wcm9wZXJ0eSB0d2VlbiBvYmplY3QsIGFuZCBwdXNoIGl0IHRvIHRoZSBlbGVtZW50J3MgdHdlZW5zQ29udGFpbmVyLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuc0NvbnRhaW5lcltwcm9wZXJ0eV0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlOiByb290UHJvcGVydHlWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZTogc3RhcnRWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlOiBzdGFydFZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZTogZW5kVmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRUeXBlOiBlbmRWYWx1ZVVuaXRUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmc6IGVhc2luZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW5zQ29udGFpbmVyW3Byb3BlcnR5XS5wYXR0ZXJuID0gcGF0dGVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkuZGVidWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0d2VlbnNDb250YWluZXIgKFwiICsgcHJvcGVydHkgKyBcIik6IFwiICsgSlNPTi5zdHJpbmdpZnkodHdlZW5zQ29udGFpbmVyW3Byb3BlcnR5XSksIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIENyZWF0ZSBhIHR3ZWVuIG91dCBvZiBlYWNoIHByb3BlcnR5LCBhbmQgYXBwZW5kIGl0cyBhc3NvY2lhdGVkIGRhdGEgdG8gdHdlZW5zQ29udGFpbmVyLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcHJvcGVydGllc01hcCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwcm9wZXJ0aWVzTWFwLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVGhlIG9yaWdpbmFsIHByb3BlcnR5IG5hbWUncyBmb3JtYXQgbXVzdCBiZSB1c2VkIGZvciB0aGUgcGFyc2VQcm9wZXJ0eVZhbHVlKCkgbG9va3VwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXQgd2UgdGhlbiB1c2UgaXRzIGNhbWVsQ2FzZSBzdHlsaW5nIHRvIG5vcm1hbGl6ZSBpdCBmb3IgbWFuaXB1bGF0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBDU1MuTmFtZXMuY2FtZWxDYXNlKHByb3BlcnR5KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVEYXRhID0gcGFyc2VQcm9wZXJ0eVZhbHVlKHByb3BlcnRpZXNNYXBbcHJvcGVydHldKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZpbmQgc2hvcnRoYW5kIGNvbG9yIHByb3BlcnRpZXMgdGhhdCBoYXZlIGJlZW4gcGFzc2VkIGEgaGV4IHN0cmluZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBXb3VsZCBiZSBxdWlja2VyIHRvIHVzZSBDU1MuTGlzdHMuY29sb3JzLmluY2x1ZGVzKCkgaWYgcG9zc2libGUgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoQ1NTLkxpc3RzLmNvbG9ycy5pbmRleE9mKHByb3BlcnR5TmFtZSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBQYXJzZSB0aGUgdmFsdWUgZGF0YSBmb3IgZWFjaCBzaG9ydGhhbmQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbmRWYWx1ZSA9IHZhbHVlRGF0YVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZyA9IHZhbHVlRGF0YVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSB2YWx1ZURhdGFbMl07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5SZWdFeC5pc0hleC50ZXN0KGVuZFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ29udmVydCB0aGUgaGV4IHN0cmluZ3MgaW50byB0aGVpciBSR0IgY29tcG9uZW50IGFycmF5cy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2xvckNvbXBvbmVudHMgPSBbXCJSZWRcIiwgXCJHcmVlblwiLCBcIkJsdWVcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWVSR0IgPSBDU1MuVmFsdWVzLmhleFRvUmdiKGVuZFZhbHVlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlUkdCID0gc3RhcnRWYWx1ZSA/IENTUy5WYWx1ZXMuaGV4VG9SZ2Ioc3RhcnRWYWx1ZSkgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEluamVjdCB0aGUgUkdCIGNvbXBvbmVudCB0d2VlbnMgaW50byBwcm9wZXJ0aWVzTWFwLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2xvckNvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YUFycmF5ID0gW2VuZFZhbHVlUkdCW2ldXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlYXNpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUFycmF5LnB1c2goZWFzaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRWYWx1ZVJHQiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFBcnJheS5wdXNoKHN0YXJ0VmFsdWVSR0JbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpeFByb3BlcnR5VmFsdWUocHJvcGVydHlOYW1lICsgY29sb3JDb21wb25lbnRzW2ldLCBkYXRhQXJyYXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgd2UgaGF2ZSByZXBsYWNlZCBhIHNob3J0Y3V0IGNvbG9yIHZhbHVlIHRoZW4gZG9uJ3QgdXBkYXRlIHRoZSBzdGFuZGFyZCBwcm9wZXJ0eSBuYW1lICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXhQcm9wZXJ0eVZhbHVlKHByb3BlcnR5TmFtZSwgdmFsdWVEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogQWxvbmcgd2l0aCBpdHMgcHJvcGVydHkgZGF0YSwgc3RvcmUgYSByZWZlcmVuY2UgdG8gdGhlIGVsZW1lbnQgaXRzZWxmIG9udG8gdHdlZW5zQ29udGFpbmVyLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW5zQ29udGFpbmVyLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICBDYWxsIFB1c2hcbiAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IHR3ZWVuc0NvbnRhaW5lciBjYW4gYmUgZW1wdHkgaWYgYWxsIG9mIHRoZSBwcm9wZXJ0aWVzIGluIHRoaXMgY2FsbCdzIHByb3BlcnR5IG1hcCB3ZXJlIHNraXBwZWQgZHVlIHRvIG5vdFxuICAgICAgICAgICAgICAgICAgICAgYmVpbmcgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLiBUaGUgZWxlbWVudCBwcm9wZXJ0eSBpcyB1c2VkIGZvciBjaGVja2luZyB0aGF0IHRoZSB0d2VlbnNDb250YWluZXIgaGFzIGJlZW4gYXBwZW5kZWQgdG8uICovXG4gICAgICAgICAgICAgICAgICAgIGlmICh0d2VlbnNDb250YWluZXIuZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogQXBwbHkgdGhlIFwidmVsb2NpdHktYW5pbWF0aW5nXCIgaW5kaWNhdG9yIGNsYXNzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLlZhbHVlcy5hZGRDbGFzcyhlbGVtZW50LCBcInZlbG9jaXR5LWFuaW1hdGluZ1wiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogVGhlIGNhbGwgYXJyYXkgaG91c2VzIHRoZSB0d2VlbnNDb250YWluZXJzIGZvciBlYWNoIGVsZW1lbnQgYmVpbmcgYW5pbWF0ZWQgaW4gdGhlIGN1cnJlbnQgY2FsbC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGwucHVzaCh0d2VlbnNDb250YWluZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gRGF0YShlbGVtZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTdG9yZSB0aGUgdHdlZW5zQ29udGFpbmVyIGFuZCBvcHRpb25zIGlmIHdlJ3JlIHdvcmtpbmcgb24gdGhlIGRlZmF1bHQgZWZmZWN0cyBxdWV1ZSwgc28gdGhhdCB0aGV5IGNhbiBiZSB1c2VkIGJ5IHRoZSByZXZlcnNlIGNvbW1hbmQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMucXVldWUgPT09IFwiXCIpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnR3ZWVuc0NvbnRhaW5lciA9IHR3ZWVuc0NvbnRhaW5lcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5vcHRzID0gb3B0cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTd2l0Y2ggb24gdGhlIGVsZW1lbnQncyBhbmltYXRpbmcgZmxhZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmlzQW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogT25jZSB0aGUgZmluYWwgZWxlbWVudCBpbiB0aGlzIGNhbGwncyBlbGVtZW50IHNldCBoYXMgYmVlbiBwcm9jZXNzZWQsIHB1c2ggdGhlIGNhbGwgYXJyYXkgb250b1xuICAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLmNhbGxzIGZvciB0aGUgYW5pbWF0aW9uIHRpY2sgdG8gaW1tZWRpYXRlbHkgYmVnaW4gcHJvY2Vzc2luZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50c0luZGV4ID09PSBlbGVtZW50c0xlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBBZGQgdGhlIGN1cnJlbnQgY2FsbCBwbHVzIGl0cyBhc3NvY2lhdGVkIG1ldGFkYXRhICh0aGUgZWxlbWVudCBzZXQgYW5kIHRoZSBjYWxsJ3Mgb3B0aW9ucykgb250byB0aGUgZ2xvYmFsIGNhbGwgY29udGFpbmVyLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBbnl0aGluZyBvbiB0aGlzIGNhbGwgY29udGFpbmVyIGlzIHN1YmplY3RlZCB0byB0aWNrKCkgcHJvY2Vzc2luZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5TdGF0ZS5jYWxscy5wdXNoKFtjYWxsLCBlbGVtZW50cywgb3B0cywgbnVsbCwgcHJvbWlzZURhdGEucmVzb2x2ZXIsIG51bGwsIDBdKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBhbmltYXRpb24gdGljayBpc24ndCBydW5uaW5nLCBzdGFydCBpdC4gKFZlbG9jaXR5IHNodXRzIGl0IG9mZiB3aGVuIHRoZXJlIGFyZSBubyBhY3RpdmUgY2FsbHMgdG8gcHJvY2Vzcy4pICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFZlbG9jaXR5LlN0YXRlLmlzVGlja2luZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuaXNUaWNraW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTdGFydCB0aGUgdGljayBsb29wLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50c0luZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiBXaGVuIHRoZSBxdWV1ZSBvcHRpb24gaXMgc2V0IHRvIGZhbHNlLCB0aGUgY2FsbCBza2lwcyB0aGUgZWxlbWVudCdzIHF1ZXVlIGFuZCBmaXJlcyBpbW1lZGlhdGVseS4gKi9cbiAgICAgICAgICAgICAgICBpZiAob3B0cy5xdWV1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogU2luY2UgdGhpcyBidWlsZFF1ZXVlIGNhbGwgZG9lc24ndCByZXNwZWN0IHRoZSBlbGVtZW50J3MgZXhpc3RpbmcgcXVldWUgKHdoaWNoIGlzIHdoZXJlIGEgZGVsYXkgb3B0aW9uIHdvdWxkIGhhdmUgYmVlbiBhcHBlbmRlZCksXG4gICAgICAgICAgICAgICAgICAgICB3ZSBtYW51YWxseSBpbmplY3QgdGhlIGRlbGF5IHByb3BlcnR5IGhlcmUgd2l0aCBhbiBleHBsaWNpdCBzZXRUaW1lb3V0LiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5kZWxheSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBUZW1wb3JhcmlseSBzdG9yZSBkZWxheWVkIGVsZW1lbnRzIHRvIGZhY2lsaXRhdGUgYWNjZXNzIGZvciBnbG9iYWwgcGF1c2UvcmVzdW1lICovXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2FsbEluZGV4ID0gVmVsb2NpdHkuU3RhdGUuZGVsYXllZEVsZW1lbnRzLmNvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5TdGF0ZS5kZWxheWVkRWxlbWVudHNbY2FsbEluZGV4XSA9IGVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWxheUNvbXBsZXRlID0gKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDbGVhciB0aGUgdGVtcG9yYXJ5IGVsZW1lbnQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuZGVsYXllZEVsZW1lbnRzW2luZGV4XSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZpbmFsbHksIGlzc3VlIHRoZSBjYWxsICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkUXVldWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoY2FsbEluZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS5kZWxheUJlZ2luID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGEoZWxlbWVudCkuZGVsYXkgPSBwYXJzZUZsb2F0KG9wdHMuZGVsYXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS5kZWxheVRpbWVyID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQ6IHNldFRpbWVvdXQoYnVpbGRRdWV1ZSwgcGFyc2VGbG9hdChvcHRzLmRlbGF5KSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dDogZGVsYXlDb21wbGV0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkUXVldWUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvKiBPdGhlcndpc2UsIHRoZSBjYWxsIHVuZGVyZ29lcyBlbGVtZW50IHF1ZXVlaW5nIGFzIG5vcm1hbC4gKi9cbiAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogVG8gaW50ZXJvcGVyYXRlIHdpdGggalF1ZXJ5LCBWZWxvY2l0eSB1c2VzIGpRdWVyeSdzIG93biAkLnF1ZXVlKCkgc3RhY2sgZm9yIHF1ZXVpbmcgbG9naWMuICovXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJC5xdWV1ZShlbGVtZW50LCBvcHRzLnF1ZXVlLCBmdW5jdGlvbihuZXh0LCBjbGVhclF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgY2xlYXJRdWV1ZSBmbGFnIHdhcyBwYXNzZWQgaW4gYnkgdGhlIHN0b3AgY29tbWFuZCwgcmVzb2x2ZSB0aGlzIGNhbGwncyBwcm9taXNlLiAoUHJvbWlzZXMgY2FuIG9ubHkgYmUgcmVzb2x2ZWQgb25jZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICBzbyBpdCdzIGZpbmUgaWYgdGhpcyBpcyByZXBlYXRlZGx5IHRyaWdnZXJlZCBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSBhc3NvY2lhdGVkIGNhbGwuKSAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNsZWFyUXVldWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZURhdGEucHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlRGF0YS5yZXNvbHZlcihlbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRG8gbm90IGNvbnRpbnVlIHdpdGggYW5pbWF0aW9uIHF1ZXVlaW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBUaGlzIGZsYWcgaW5kaWNhdGVzIHRvIHRoZSB1cGNvbWluZyBjb21wbGV0ZUNhbGwoKSBmdW5jdGlvbiB0aGF0IHRoaXMgcXVldWUgZW50cnkgd2FzIGluaXRpYXRlZCBieSBWZWxvY2l0eS5cbiAgICAgICAgICAgICAgICAgICAgICAgICBTZWUgY29tcGxldGVDYWxsKCkgZm9yIGZ1cnRoZXIgZGV0YWlscy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LnZlbG9jaXR5UXVldWVFbnRyeUZsYWcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBidWlsZFF1ZXVlKG5leHQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgIEF1dG8tRGVxdWV1aW5nXG4gICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIC8qIEFzIHBlciBqUXVlcnkncyAkLnF1ZXVlKCkgYmVoYXZpb3IsIHRvIGZpcmUgdGhlIGZpcnN0IG5vbi1jdXN0b20tcXVldWUgZW50cnkgb24gYW4gZWxlbWVudCwgdGhlIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgbXVzdCBiZSBkZXF1ZXVlZCBpZiBpdHMgcXVldWUgc3RhY2sgY29uc2lzdHMgKnNvbGVseSogb2YgdGhlIGN1cnJlbnQgY2FsbC4gKFRoaXMgY2FuIGJlIGRldGVybWluZWQgYnkgY2hlY2tpbmdcbiAgICAgICAgICAgICAgICAgZm9yIHRoZSBcImlucHJvZ3Jlc3NcIiBpdGVtIHRoYXQgalF1ZXJ5IHByZXBlbmRzIHRvIGFjdGl2ZSBxdWV1ZSBzdGFjayBhcnJheXMuKSBSZWdhcmRsZXNzLCB3aGVuZXZlciB0aGUgZWxlbWVudCdzXG4gICAgICAgICAgICAgICAgIHF1ZXVlIGlzIGZ1cnRoZXIgYXBwZW5kZWQgd2l0aCBhZGRpdGlvbmFsIGl0ZW1zIC0tIGluY2x1ZGluZyAkLmRlbGF5KCkncyBvciBldmVuICQuYW5pbWF0ZSgpIGNhbGxzLCB0aGUgcXVldWUnc1xuICAgICAgICAgICAgICAgICBmaXJzdCBlbnRyeSBpcyBhdXRvbWF0aWNhbGx5IGZpcmVkLiBUaGlzIGJlaGF2aW9yIGNvbnRyYXN0cyB0aGF0IG9mIGN1c3RvbSBxdWV1ZXMsIHdoaWNoIG5ldmVyIGF1dG8tZmlyZS4gKi9cbiAgICAgICAgICAgICAgICAvKiBOb3RlOiBXaGVuIGFuIGVsZW1lbnQgc2V0IGlzIGJlaW5nIHN1YmplY3RlZCB0byBhIG5vbi1wYXJhbGxlbCBWZWxvY2l0eSBjYWxsLCB0aGUgYW5pbWF0aW9uIHdpbGwgbm90IGJlZ2luIHVudGlsXG4gICAgICAgICAgICAgICAgIGVhY2ggb25lIG9mIHRoZSBlbGVtZW50cyBpbiB0aGUgc2V0IGhhcyByZWFjaGVkIHRoZSBlbmQgb2YgaXRzIGluZGl2aWR1YWxseSBwcmUtZXhpc3RpbmcgcXVldWUgY2hhaW4uICovXG4gICAgICAgICAgICAgICAgLyogTm90ZTogVW5mb3J0dW5hdGVseSwgbW9zdCBwZW9wbGUgZG9uJ3QgZnVsbHkgZ3Jhc3AgalF1ZXJ5J3MgcG93ZXJmdWwsIHlldCBxdWlya3ksICQucXVldWUoKSBmdW5jdGlvbi5cbiAgICAgICAgICAgICAgICAgTGVhbiBtb3JlIGhlcmU6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTA1ODE1OC9jYW4tc29tZWJvZHktZXhwbGFpbi1qcXVlcnktcXVldWUtdG8tbWUgKi9cbiAgICAgICAgICAgICAgICBpZiAoKG9wdHMucXVldWUgPT09IFwiXCIgfHwgb3B0cy5xdWV1ZSA9PT0gXCJmeFwiKSAmJiAkLnF1ZXVlKGVsZW1lbnQpWzBdICE9PSBcImlucHJvZ3Jlc3NcIikge1xuICAgICAgICAgICAgICAgICAgICAkLmRlcXVldWUoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICBFbGVtZW50IFNldCBJdGVyYXRpb25cbiAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgLyogSWYgdGhlIFwibm9kZVR5cGVcIiBwcm9wZXJ0eSBleGlzdHMgb24gdGhlIGVsZW1lbnRzIHZhcmlhYmxlLCB3ZSdyZSBhbmltYXRpbmcgYSBzaW5nbGUgZWxlbWVudC5cbiAgICAgICAgICAgICBQbGFjZSBpdCBpbiBhbiBhcnJheSBzbyB0aGF0ICQuZWFjaCgpIGNhbiBpdGVyYXRlIG92ZXIgaXQuICovXG4gICAgICAgICAgICAkLmVhY2goZWxlbWVudHMsIGZ1bmN0aW9uKGksIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAvKiBFbnN1cmUgZWFjaCBlbGVtZW50IGluIGEgc2V0IGhhcyBhIG5vZGVUeXBlIChpcyBhIHJlYWwgZWxlbWVudCkgdG8gYXZvaWQgdGhyb3dpbmcgZXJyb3JzLiAqL1xuICAgICAgICAgICAgICAgIGlmIChUeXBlLmlzTm9kZShlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzRWxlbWVudChlbGVtZW50LCBpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgIE9wdGlvbjogTG9vcFxuICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgLyogVGhlIGxvb3Agb3B0aW9uIGFjY2VwdHMgYW4gaW50ZWdlciBpbmRpY2F0aW5nIGhvdyBtYW55IHRpbWVzIHRoZSBlbGVtZW50IHNob3VsZCBsb29wIGJldHdlZW4gdGhlIHZhbHVlcyBpbiB0aGVcbiAgICAgICAgICAgICBjdXJyZW50IGNhbGwncyBwcm9wZXJ0aWVzIG1hcCBhbmQgdGhlIGVsZW1lbnQncyBwcm9wZXJ0eSB2YWx1ZXMgcHJpb3IgdG8gdGhpcyBjYWxsLiAqL1xuICAgICAgICAgICAgLyogTm90ZTogVGhlIGxvb3Agb3B0aW9uJ3MgbG9naWMgaXMgcGVyZm9ybWVkIGhlcmUgLS0gYWZ0ZXIgZWxlbWVudCBwcm9jZXNzaW5nIC0tIGJlY2F1c2UgdGhlIGN1cnJlbnQgY2FsbCBuZWVkc1xuICAgICAgICAgICAgIHRvIHVuZGVyZ28gaXRzIHF1ZXVlIGluc2VydGlvbiBwcmlvciB0byB0aGUgbG9vcCBvcHRpb24gZ2VuZXJhdGluZyBpdHMgc2VyaWVzIG9mIGNvbnN0aXR1ZW50IFwicmV2ZXJzZVwiIGNhbGxzLFxuICAgICAgICAgICAgIHdoaWNoIGNoYWluIGFmdGVyIHRoZSBjdXJyZW50IGNhbGwuIFR3byByZXZlcnNlIGNhbGxzICh0d28gXCJhbHRlcm5hdGlvbnNcIikgY29uc3RpdHV0ZSBvbmUgbG9vcC4gKi9cbiAgICAgICAgICAgIG9wdHMgPSAkLmV4dGVuZCh7fSwgVmVsb2NpdHkuZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgb3B0cy5sb29wID0gcGFyc2VJbnQob3B0cy5sb29wLCAxMCk7XG4gICAgICAgICAgICB2YXIgcmV2ZXJzZUNhbGxzQ291bnQgPSAob3B0cy5sb29wICogMikgLSAxO1xuXG4gICAgICAgICAgICBpZiAob3B0cy5sb29wKSB7XG4gICAgICAgICAgICAgICAgLyogRG91YmxlIHRoZSBsb29wIGNvdW50IHRvIGNvbnZlcnQgaXQgaW50byBpdHMgYXBwcm9wcmlhdGUgbnVtYmVyIG9mIFwicmV2ZXJzZVwiIGNhbGxzLlxuICAgICAgICAgICAgICAgICBTdWJ0cmFjdCAxIGZyb20gdGhlIHJlc3VsdGluZyB2YWx1ZSBzaW5jZSB0aGUgY3VycmVudCBjYWxsIGlzIGluY2x1ZGVkIGluIHRoZSB0b3RhbCBhbHRlcm5hdGlvbiBjb3VudC4gKi9cbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHJldmVyc2VDYWxsc0NvdW50OyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgLyogU2luY2UgdGhlIGxvZ2ljIGZvciB0aGUgcmV2ZXJzZSBhY3Rpb24gb2NjdXJzIGluc2lkZSBRdWV1ZWluZyBhbmQgdGhlcmVmb3JlIHRoaXMgY2FsbCdzIG9wdGlvbnMgb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICBpc24ndCBwYXJzZWQgdW50aWwgdGhlbiBhcyB3ZWxsLCB0aGUgY3VycmVudCBjYWxsJ3MgZGVsYXkgb3B0aW9uIG11c3QgYmUgZXhwbGljaXRseSBwYXNzZWQgaW50byB0aGUgcmV2ZXJzZVxuICAgICAgICAgICAgICAgICAgICAgY2FsbCBzbyB0aGF0IHRoZSBkZWxheSBsb2dpYyB0aGF0IG9jY3VycyBpbnNpZGUgKlByZS1RdWV1ZWluZyogY2FuIHByb2Nlc3MgaXQuICovXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXZlcnNlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5OiBvcHRzLmRlbGF5LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IG9wdHMucHJvZ3Jlc3NcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBJZiBhIGNvbXBsZXRlIGNhbGxiYWNrIHdhcyBwYXNzZWQgaW50byB0aGlzIGNhbGwsIHRyYW5zZmVyIGl0IHRvIHRoZSBsb29wIHJlZGlyZWN0J3MgZmluYWwgXCJyZXZlcnNlXCIgY2FsbFxuICAgICAgICAgICAgICAgICAgICAgc28gdGhhdCBpdCdzIHRyaWdnZXJlZCB3aGVuIHRoZSBlbnRpcmUgcmVkaXJlY3QgaXMgY29tcGxldGUgKGFuZCBub3Qgd2hlbiB0aGUgdmVyeSBmaXJzdCBhbmltYXRpb24gaXMgY29tcGxldGUpLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoeCA9PT0gcmV2ZXJzZUNhbGxzQ291bnQgLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXZlcnNlT3B0aW9ucy5kaXNwbGF5ID0gb3B0cy5kaXNwbGF5O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZU9wdGlvbnMudmlzaWJpbGl0eSA9IG9wdHMudmlzaWJpbGl0eTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldmVyc2VPcHRpb25zLmNvbXBsZXRlID0gb3B0cy5jb21wbGV0ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGUoZWxlbWVudHMsIFwicmV2ZXJzZVwiLCByZXZlcnNlT3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgQ2hhaW5pbmdcbiAgICAgICAgICAgICAqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIC8qIFJldHVybiB0aGUgZWxlbWVudHMgYmFjayB0byB0aGUgY2FsbCBjaGFpbiwgd2l0aCB3cmFwcGVkIGVsZW1lbnRzIHRha2luZyBwcmVjZWRlbmNlIGluIGNhc2UgVmVsb2NpdHkgd2FzIGNhbGxlZCB2aWEgdGhlICQuZm4uIGV4dGVuc2lvbi4gKi9cbiAgICAgICAgICAgIHJldHVybiBnZXRDaGFpbigpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIFR1cm4gVmVsb2NpdHkgaW50byB0aGUgYW5pbWF0aW9uIGZ1bmN0aW9uLCBleHRlbmRlZCB3aXRoIHRoZSBwcmUtZXhpc3RpbmcgVmVsb2NpdHkgb2JqZWN0LiAqL1xuICAgICAgICBWZWxvY2l0eSA9ICQuZXh0ZW5kKGFuaW1hdGUsIFZlbG9jaXR5KTtcbiAgICAgICAgLyogRm9yIGxlZ2FjeSBzdXBwb3J0LCBhbHNvIGV4cG9zZSB0aGUgbGl0ZXJhbCBhbmltYXRlIG1ldGhvZC4gKi9cbiAgICAgICAgVmVsb2NpdHkuYW5pbWF0ZSA9IGFuaW1hdGU7XG5cbiAgICAgICAgLyoqKioqKioqKioqKioqXG4gICAgICAgICBUaW1pbmdcbiAgICAgICAgICoqKioqKioqKioqKioqL1xuXG4gICAgICAgIC8qIFRpY2tlciBmdW5jdGlvbi4gKi9cbiAgICAgICAgdmFyIHRpY2tlciA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgckFGU2hpbTtcblxuICAgICAgICAvKiBJbmFjdGl2ZSBicm93c2VyIHRhYnMgcGF1c2UgckFGLCB3aGljaCByZXN1bHRzIGluIGFsbCBhY3RpdmUgYW5pbWF0aW9ucyBpbW1lZGlhdGVseSBzcHJpbnRpbmcgdG8gdGhlaXIgY29tcGxldGlvbiBzdGF0ZXMgd2hlbiB0aGUgdGFiIHJlZm9jdXNlcy5cbiAgICAgICAgIFRvIGdldCBhcm91bmQgdGhpcywgd2UgZHluYW1pY2FsbHkgc3dpdGNoIHJBRiB0byBzZXRUaW1lb3V0ICh3aGljaCB0aGUgYnJvd3NlciAqZG9lc24ndCogcGF1c2UpIHdoZW4gdGhlIHRhYiBsb3NlcyBmb2N1cy4gV2Ugc2tpcCB0aGlzIGZvciBtb2JpbGVcbiAgICAgICAgIGRldmljZXMgdG8gYXZvaWQgd2FzdGluZyBiYXR0ZXJ5IHBvd2VyIG9uIGluYWN0aXZlIHRhYnMuICovXG4gICAgICAgIC8qIE5vdGU6IFRhYiBmb2N1cyBkZXRlY3Rpb24gZG9lc24ndCB3b3JrIG9uIG9sZGVyIHZlcnNpb25zIG9mIElFLCBidXQgdGhhdCdzIG9rYXkgc2luY2UgdGhleSBkb24ndCBzdXBwb3J0IHJBRiB0byBiZWdpbiB3aXRoLiAqL1xuICAgICAgICBpZiAoIVZlbG9jaXR5LlN0YXRlLmlzTW9iaWxlICYmIGRvY3VtZW50LmhpZGRlbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXIgdXBkYXRlVGlja2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLyogUmVhc3NpZ24gdGhlIHJBRiBmdW5jdGlvbiAod2hpY2ggdGhlIGdsb2JhbCB0aWNrKCkgZnVuY3Rpb24gdXNlcykgYmFzZWQgb24gdGhlIHRhYidzIGZvY3VzIHN0YXRlLiAqL1xuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5oaWRkZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgdGlja2VyID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSB0aWNrIGZ1bmN0aW9uIG5lZWRzIGEgdHJ1dGh5IGZpcnN0IGFyZ3VtZW50IGluIG9yZGVyIHRvIHBhc3MgaXRzIGludGVybmFsIHRpbWVzdGFtcCBjaGVjay4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTYpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIFRoZSByQUYgbG9vcCBoYXMgYmVlbiBwYXVzZWQgYnkgdGhlIGJyb3dzZXIsIHNvIHdlIG1hbnVhbGx5IHJlc3RhcnQgdGhlIHRpY2suICovXG4gICAgICAgICAgICAgICAgICAgIHRpY2soKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aWNrZXIgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHJBRlNoaW07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLyogUGFnZSBjb3VsZCBiZSBzaXR0aW5nIGluIHRoZSBiYWNrZ3JvdW5kIGF0IHRoaXMgdGltZSAoaS5lLiBvcGVuZWQgYXMgbmV3IHRhYikgc28gbWFraW5nIHN1cmUgd2UgdXNlIGNvcnJlY3QgdGlja2VyIGZyb20gdGhlIHN0YXJ0ICovXG4gICAgICAgICAgICB1cGRhdGVUaWNrZXIoKTtcblxuICAgICAgICAgICAgLyogQW5kIHRoZW4gcnVuIGNoZWNrIGFnYWluIGV2ZXJ5IHRpbWUgdmlzaWJpbGl0eSBjaGFuZ2VzICovXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidmlzaWJpbGl0eWNoYW5nZVwiLCB1cGRhdGVUaWNrZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqKioqKioqKioqKlxuICAgICAgICAgVGlja1xuICAgICAgICAgKioqKioqKioqKioqL1xuXG4gICAgICAgIC8qIE5vdGU6IEFsbCBjYWxscyB0byBWZWxvY2l0eSBhcmUgcHVzaGVkIHRvIHRoZSBWZWxvY2l0eS5TdGF0ZS5jYWxscyBhcnJheSwgd2hpY2ggaXMgZnVsbHkgaXRlcmF0ZWQgdGhyb3VnaCB1cG9uIGVhY2ggdGljay4gKi9cbiAgICAgICAgZnVuY3Rpb24gdGljayh0aW1lc3RhbXApIHtcbiAgICAgICAgICAgIC8qIEFuIGVtcHR5IHRpbWVzdGFtcCBhcmd1bWVudCBpbmRpY2F0ZXMgdGhhdCB0aGlzIGlzIHRoZSBmaXJzdCB0aWNrIG9jY3VyZW5jZSBzaW5jZSB0aWNraW5nIHdhcyB0dXJuZWQgb24uXG4gICAgICAgICAgICAgV2UgbGV2ZXJhZ2UgdGhpcyBtZXRhZGF0YSB0byBmdWxseSBpZ25vcmUgdGhlIGZpcnN0IHRpY2sgcGFzcyBzaW5jZSBSQUYncyBpbml0aWFsIHBhc3MgaXMgZmlyZWQgd2hlbmV2ZXJcbiAgICAgICAgICAgICB0aGUgYnJvd3NlcidzIG5leHQgdGljayBzeW5jIHRpbWUgb2NjdXJzLCB3aGljaCByZXN1bHRzIGluIHRoZSBmaXJzdCBlbGVtZW50cyBzdWJqZWN0ZWQgdG8gVmVsb2NpdHlcbiAgICAgICAgICAgICBjYWxscyBiZWluZyBhbmltYXRlZCBvdXQgb2Ygc3luYyB3aXRoIGFueSBlbGVtZW50cyBhbmltYXRlZCBpbW1lZGlhdGVseSB0aGVyZWFmdGVyLiBJbiBzaG9ydCwgd2UgaWdub3JlXG4gICAgICAgICAgICAgdGhlIGZpcnN0IFJBRiB0aWNrIHBhc3Mgc28gdGhhdCBlbGVtZW50cyBiZWluZyBpbW1lZGlhdGVseSBjb25zZWN1dGl2ZWx5IGFuaW1hdGVkIC0tIGluc3RlYWQgb2Ygc2ltdWx0YW5lb3VzbHkgYW5pbWF0ZWRcbiAgICAgICAgICAgICBieSB0aGUgc2FtZSBWZWxvY2l0eSBjYWxsIC0tIGFyZSBwcm9wZXJseSBiYXRjaGVkIGludG8gdGhlIHNhbWUgaW5pdGlhbCBSQUYgdGljayBhbmQgY29uc2VxdWVudGx5IHJlbWFpbiBpbiBzeW5jIHRoZXJlYWZ0ZXIuICovXG4gICAgICAgICAgICBpZiAodGltZXN0YW1wKSB7XG4gICAgICAgICAgICAgICAgLyogV2Ugbm9ybWFsbHkgdXNlIFJBRidzIGhpZ2ggcmVzb2x1dGlvbiB0aW1lc3RhbXAgYnV0IGFzIGl0IGNhbiBiZSBzaWduaWZpY2FudGx5IG9mZnNldCB3aGVuIHRoZSBicm93c2VyIGlzXG4gICAgICAgICAgICAgICAgIHVuZGVyIGhpZ2ggc3RyZXNzIHdlIGdpdmUgdGhlIG9wdGlvbiBmb3IgY2hvcHBpbmVzcyBvdmVyIGFsbG93aW5nIHRoZSBicm93c2VyIHRvIGRyb3AgaHVnZSBjaHVua3Mgb2YgZnJhbWVzLlxuICAgICAgICAgICAgICAgICBXZSB1c2UgcGVyZm9ybWFuY2Uubm93KCkgYW5kIHNoaW0gaXQgaWYgaXQgZG9lc24ndCBleGlzdCBmb3Igd2hlbiB0aGUgdGFiIGlzIGhpZGRlbi4gKi9cbiAgICAgICAgICAgICAgICB2YXIgdGltZUN1cnJlbnQgPSBWZWxvY2l0eS50aW1lc3RhbXAgJiYgdGltZXN0YW1wICE9PSB0cnVlID8gdGltZXN0YW1wIDogcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgQ2FsbCBJdGVyYXRpb25cbiAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICB2YXIgY2FsbHNMZW5ndGggPSBWZWxvY2l0eS5TdGF0ZS5jYWxscy5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAvKiBUbyBzcGVlZCB1cCBpdGVyYXRpbmcgb3ZlciB0aGlzIGFycmF5LCBpdCBpcyBjb21wYWN0ZWQgKGZhbHNleSBpdGVtcyAtLSBjYWxscyB0aGF0IGhhdmUgY29tcGxldGVkIC0tIGFyZSByZW1vdmVkKVxuICAgICAgICAgICAgICAgICB3aGVuIGl0cyBsZW5ndGggaGFzIGJhbGxvb25lZCB0byBhIHBvaW50IHRoYXQgY2FuIGltcGFjdCB0aWNrIHBlcmZvcm1hbmNlLiBUaGlzIG9ubHkgYmVjb21lcyBuZWNlc3Nhcnkgd2hlbiBhbmltYXRpb25cbiAgICAgICAgICAgICAgICAgaGFzIGJlZW4gY29udGludW91cyB3aXRoIG1hbnkgZWxlbWVudHMgb3ZlciBhIGxvbmcgcGVyaW9kIG9mIHRpbWU7IHdoZW5ldmVyIGFsbCBhY3RpdmUgY2FsbHMgYXJlIGNvbXBsZXRlZCwgY29tcGxldGVDYWxsKCkgY2xlYXJzIFZlbG9jaXR5LlN0YXRlLmNhbGxzLiAqL1xuICAgICAgICAgICAgICAgIGlmIChjYWxsc0xlbmd0aCA+IDEwMDAwKSB7XG4gICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLmNhbGxzID0gY29tcGFjdFNwYXJzZUFycmF5KFZlbG9jaXR5LlN0YXRlLmNhbGxzKTtcbiAgICAgICAgICAgICAgICAgICAgY2FsbHNMZW5ndGggPSBWZWxvY2l0eS5TdGF0ZS5jYWxscy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyogSXRlcmF0ZSB0aHJvdWdoIGVhY2ggYWN0aXZlIGNhbGwuICovXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsc0xlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFdoZW4gYSBWZWxvY2l0eSBjYWxsIGlzIGNvbXBsZXRlZCwgaXRzIFZlbG9jaXR5LlN0YXRlLmNhbGxzIGVudHJ5IGlzIHNldCB0byBmYWxzZS4gQ29udGludWUgb24gdG8gdGhlIG5leHQgY2FsbC4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFWZWxvY2l0eS5TdGF0ZS5jYWxsc1tpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICBDYWxsLVdpZGUgVmFyaWFibGVzXG4gICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhbGxDb250YWluZXIgPSBWZWxvY2l0eS5TdGF0ZS5jYWxsc1tpXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGwgPSBjYWxsQ29udGFpbmVyWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0cyA9IGNhbGxDb250YWluZXJbMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lU3RhcnQgPSBjYWxsQ29udGFpbmVyWzNdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RUaWNrID0gISF0aW1lU3RhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0d2VlbkR1bW15VmFsdWUgPSBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF1c2VPYmplY3QgPSBjYWxsQ29udGFpbmVyWzVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWlsbGlzZWNvbmRzRWxsYXBzZWQgPSBjYWxsQ29udGFpbmVyWzZdO1xuXG5cblxuICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aW1lU3RhcnQgaXMgdW5kZWZpbmVkLCB0aGVuIHRoaXMgaXMgdGhlIGZpcnN0IHRpbWUgdGhhdCB0aGlzIGNhbGwgaGFzIGJlZW4gcHJvY2Vzc2VkIGJ5IHRpY2soKS5cbiAgICAgICAgICAgICAgICAgICAgIFdlIGFzc2lnbiB0aW1lU3RhcnQgbm93IHNvIHRoYXQgaXRzIHZhbHVlIGlzIGFzIGNsb3NlIHRvIHRoZSByZWFsIGFuaW1hdGlvbiBzdGFydCB0aW1lIGFzIHBvc3NpYmxlLlxuICAgICAgICAgICAgICAgICAgICAgKENvbnZlcnNlbHksIGhhZCB0aW1lU3RhcnQgYmVlbiBkZWZpbmVkIHdoZW4gdGhpcyBjYWxsIHdhcyBhZGRlZCB0byBWZWxvY2l0eS5TdGF0ZS5jYWxscywgdGhlIGRlbGF5XG4gICAgICAgICAgICAgICAgICAgICBiZXR3ZWVuIHRoYXQgdGltZSBhbmQgbm93IHdvdWxkIGNhdXNlIHRoZSBmaXJzdCBmZXcgZnJhbWVzIG9mIHRoZSB0d2VlbiB0byBiZSBza2lwcGVkIHNpbmNlXG4gICAgICAgICAgICAgICAgICAgICBwZXJjZW50Q29tcGxldGUgaXMgY2FsY3VsYXRlZCByZWxhdGl2ZSB0byB0aW1lU3RhcnQuKSAqL1xuICAgICAgICAgICAgICAgICAgICAvKiBGdXJ0aGVyLCBzdWJ0cmFjdCAxNm1zICh0aGUgYXBwcm94aW1hdGUgcmVzb2x1dGlvbiBvZiBSQUYpIGZyb20gdGhlIGN1cnJlbnQgdGltZSB2YWx1ZSBzbyB0aGF0IHRoZVxuICAgICAgICAgICAgICAgICAgICAgZmlyc3QgdGljayBpdGVyYXRpb24gaXNuJ3Qgd2FzdGVkIGJ5IGFuaW1hdGluZyBhdCAwJSB0d2VlbiBjb21wbGV0aW9uLCB3aGljaCB3b3VsZCBwcm9kdWNlIHRoZVxuICAgICAgICAgICAgICAgICAgICAgc2FtZSBzdHlsZSB2YWx1ZSBhcyB0aGUgZWxlbWVudCdzIGN1cnJlbnQgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGltZVN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lU3RhcnQgPSBWZWxvY2l0eS5TdGF0ZS5jYWxsc1tpXVszXSA9IHRpbWVDdXJyZW50IC0gMTY7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKiBJZiBhIHBhdXNlIG9iamVjdCBpcyBwcmVzZW50LCBza2lwIHByb2Nlc3NpbmcgdW5sZXNzIGl0IGhhcyBiZWVuIHNldCB0byByZXN1bWUgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhdXNlT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGF1c2VPYmplY3QucmVzdW1lID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVXBkYXRlIHRoZSB0aW1lIHN0YXJ0IHRvIGFjY29tb2RhdGUgdGhlIHBhdXNlZCBjb21wbGV0aW9uIGFtb3VudCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVTdGFydCA9IGNhbGxDb250YWluZXJbM10gPSBNYXRoLnJvdW5kKHRpbWVDdXJyZW50IC0gbWlsbGlzZWNvbmRzRWxsYXBzZWQgLSAxNik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBSZW1vdmUgcGF1c2Ugb2JqZWN0IGFmdGVyIHByb2Nlc3NpbmcgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsQ29udGFpbmVyWzVdID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBtaWxsaXNlY29uZHNFbGxhcHNlZCA9IGNhbGxDb250YWluZXJbNl0gPSB0aW1lQ3VycmVudCAtIHRpbWVTdGFydDtcblxuICAgICAgICAgICAgICAgICAgICAvKiBUaGUgdHdlZW4ncyBjb21wbGV0aW9uIHBlcmNlbnRhZ2UgaXMgcmVsYXRpdmUgdG8gdGhlIHR3ZWVuJ3Mgc3RhcnQgdGltZSwgbm90IHRoZSB0d2VlbidzIHN0YXJ0IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAod2hpY2ggd291bGQgcmVzdWx0IGluIHVucHJlZGljdGFibGUgdHdlZW4gZHVyYXRpb25zIHNpbmNlIEphdmFTY3JpcHQncyB0aW1lcnMgYXJlIG5vdCBwYXJ0aWN1bGFybHkgYWNjdXJhdGUpLlxuICAgICAgICAgICAgICAgICAgICAgQWNjb3JkaW5nbHksIHdlIGVuc3VyZSB0aGF0IHBlcmNlbnRDb21wbGV0ZSBkb2VzIG5vdCBleGNlZWQgMS4gKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRDb21wbGV0ZSA9IE1hdGgubWluKChtaWxsaXNlY29uZHNFbGxhcHNlZCkgLyBvcHRzLmR1cmF0aW9uLCAxKTtcblxuICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgRWxlbWVudCBJdGVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgLyogRm9yIGV2ZXJ5IGNhbGwsIGl0ZXJhdGUgdGhyb3VnaCBlYWNoIG9mIHRoZSBlbGVtZW50cyBpbiBpdHMgc2V0LiAqL1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMCwgY2FsbExlbmd0aCA9IGNhbGwubGVuZ3RoOyBqIDwgY2FsbExlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHdlZW5zQ29udGFpbmVyID0gY2FsbFtqXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gdHdlZW5zQ29udGFpbmVyLmVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIENoZWNrIHRvIHNlZSBpZiB0aGlzIGVsZW1lbnQgaGFzIGJlZW4gZGVsZXRlZCBtaWR3YXkgdGhyb3VnaCB0aGUgYW5pbWF0aW9uIGJ5IGNoZWNraW5nIGZvciB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZWQgZXhpc3RlbmNlIG9mIGl0cyBkYXRhIGNhY2hlLiBJZiBpdCdzIGdvbmUsIG9yIHRoZSBlbGVtZW50IGlzIGN1cnJlbnRseSBwYXVzZWQsIHNraXAgYW5pbWF0aW5nIHRoaXMgZWxlbWVudC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghRGF0YShlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNmb3JtUHJvcGVydHlFeGlzdHMgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICBEaXNwbGF5ICYgVmlzaWJpbGl0eSBUb2dnbGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBkaXNwbGF5IG9wdGlvbiBpcyBzZXQgdG8gbm9uLVwibm9uZVwiLCBzZXQgaXQgdXBmcm9udCBzbyB0aGF0IHRoZSBlbGVtZW50IGNhbiBiZWNvbWUgdmlzaWJsZSBiZWZvcmUgdHdlZW5pbmcgYmVnaW5zLlxuICAgICAgICAgICAgICAgICAgICAgICAgIChPdGhlcndpc2UsIGRpc3BsYXkncyBcIm5vbmVcIiB2YWx1ZSBpcyBzZXQgaW4gY29tcGxldGVDYWxsKCkgb25jZSB0aGUgYW5pbWF0aW9uIGhhcyBjb21wbGV0ZWQuKSAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuZGlzcGxheSAhPT0gdW5kZWZpbmVkICYmIG9wdHMuZGlzcGxheSAhPT0gbnVsbCAmJiBvcHRzLmRpc3BsYXkgIT09IFwibm9uZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuZGlzcGxheSA9PT0gXCJmbGV4XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZsZXhWYWx1ZXMgPSBbXCItd2Via2l0LWJveFwiLCBcIi1tb3otYm94XCIsIFwiLW1zLWZsZXhib3hcIiwgXCItd2Via2l0LWZsZXhcIl07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGZsZXhWYWx1ZXMsIGZ1bmN0aW9uKGksIGZsZXhWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLnNldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJkaXNwbGF5XCIsIGZsZXhWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENTUy5zZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiZGlzcGxheVwiLCBvcHRzLmRpc3BsYXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBTYW1lIGdvZXMgd2l0aCB0aGUgdmlzaWJpbGl0eSBvcHRpb24sIGJ1dCBpdHMgXCJub25lXCIgZXF1aXZhbGVudCBpcyBcImhpZGRlblwiLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMudmlzaWJpbGl0eSAhPT0gdW5kZWZpbmVkICYmIG9wdHMudmlzaWJpbGl0eSAhPT0gXCJoaWRkZW5cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENTUy5zZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwidmlzaWJpbGl0eVwiLCBvcHRzLnZpc2liaWxpdHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgUHJvcGVydHkgSXRlcmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBGb3IgZXZlcnkgZWxlbWVudCwgaXRlcmF0ZSB0aHJvdWdoIGVhY2ggcHJvcGVydHkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB0d2VlbnNDb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBJbiBhZGRpdGlvbiB0byBwcm9wZXJ0eSB0d2VlbiBkYXRhLCB0d2VlbnNDb250YWluZXIgY29udGFpbnMgYSByZWZlcmVuY2UgdG8gaXRzIGFzc29jaWF0ZWQgZWxlbWVudC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHdlZW5zQ29udGFpbmVyLmhhc093blByb3BlcnR5KHByb3BlcnR5KSAmJiBwcm9wZXJ0eSAhPT0gXCJlbGVtZW50XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHR3ZWVuID0gdHdlZW5zQ29udGFpbmVyW3Byb3BlcnR5XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEVhc2luZyBjYW4gZWl0aGVyIGJlIGEgcHJlLWdlbmVyZWF0ZWQgZnVuY3Rpb24gb3IgYSBzdHJpbmcgdGhhdCByZWZlcmVuY2VzIGEgcHJlLXJlZ2lzdGVyZWQgZWFzaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb24gdGhlIFZlbG9jaXR5LkVhc2luZ3Mgb2JqZWN0LiBJbiBlaXRoZXIgY2FzZSwgcmV0dXJuIHRoZSBhcHByb3ByaWF0ZSBlYXNpbmcgKmZ1bmN0aW9uKi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZyA9IFR5cGUuaXNTdHJpbmcodHdlZW4uZWFzaW5nKSA/IFZlbG9jaXR5LkVhc2luZ3NbdHdlZW4uZWFzaW5nXSA6IHR3ZWVuLmVhc2luZztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDdXJyZW50IFZhbHVlIENhbGN1bGF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFR5cGUuaXNTdHJpbmcodHdlZW4ucGF0dGVybikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXR0ZXJuUmVwbGFjZSA9IHBlcmNlbnRDb21wbGV0ZSA9PT0gMSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oJDAsIGluZGV4LCByb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gdHdlZW4uZW5kVmFsdWVbaW5kZXhdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByb3VuZCA/IE1hdGgucm91bmQocmVzdWx0KSA6IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigkMCwgaW5kZXgsIHJvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGFydFZhbHVlID0gdHdlZW4uc3RhcnRWYWx1ZVtpbmRleF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0d2VlbkRlbHRhID0gdHdlZW4uZW5kVmFsdWVbaW5kZXhdIC0gc3RhcnRWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHN0YXJ0VmFsdWUgKyAodHdlZW5EZWx0YSAqIGVhc2luZyhwZXJjZW50Q29tcGxldGUsIG9wdHMsIHR3ZWVuRGVsdGEpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcm91bmQgPyBNYXRoLnJvdW5kKHJlc3VsdCkgOiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlID0gdHdlZW4ucGF0dGVybi5yZXBsYWNlKC97KFxcZCspKCEpP30vZywgcGF0dGVyblJlcGxhY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBlcmNlbnRDb21wbGV0ZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhpcyBpcyB0aGUgbGFzdCB0aWNrIHBhc3MgKGlmIHdlJ3ZlIHJlYWNoZWQgMTAwJSBjb21wbGV0aW9uIGZvciB0aGlzIHR3ZWVuKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnN1cmUgdGhhdCBjdXJyZW50VmFsdWUgaXMgZXhwbGljaXRseSBzZXQgdG8gaXRzIHRhcmdldCBlbmRWYWx1ZSBzbyB0aGF0IGl0J3Mgbm90IHN1YmplY3RlZCB0byBhbnkgcm91bmRpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWUgPSB0d2Vlbi5lbmRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE90aGVyd2lzZSwgY2FsY3VsYXRlIGN1cnJlbnRWYWx1ZSBiYXNlZCBvbiB0aGUgY3VycmVudCBkZWx0YSBmcm9tIHN0YXJ0VmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHdlZW5EZWx0YSA9IHR3ZWVuLmVuZFZhbHVlIC0gdHdlZW4uc3RhcnRWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlID0gdHdlZW4uc3RhcnRWYWx1ZSArICh0d2VlbkRlbHRhICogZWFzaW5nKHBlcmNlbnRDb21wbGV0ZSwgb3B0cywgdHdlZW5EZWx0YSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgbm8gdmFsdWUgY2hhbmdlIGlzIG9jY3VycmluZywgZG9uJ3QgcHJvY2VlZCB3aXRoIERPTSB1cGRhdGluZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWZpcnN0VGljayAmJiAoY3VycmVudFZhbHVlID09PSB0d2Vlbi5jdXJyZW50VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuLmN1cnJlbnRWYWx1ZSA9IGN1cnJlbnRWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB3ZSdyZSB0d2VlbmluZyBhIGZha2UgJ3R3ZWVuJyBwcm9wZXJ0eSBpbiBvcmRlciB0byBsb2cgdHJhbnNpdGlvbiB2YWx1ZXMsIHVwZGF0ZSB0aGUgb25lLXBlci1jYWxsIHZhcmlhYmxlIHNvIHRoYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0IGNhbiBiZSBwYXNzZWQgaW50byB0aGUgcHJvZ3Jlc3MgY2FsbGJhY2suICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJ0d2VlblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0d2VlbkR1bW15VmFsdWUgPSBjdXJyZW50VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSG9va3M6IFBhcnQgSVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBob29rUm9vdDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRm9yIGhvb2tlZCBwcm9wZXJ0aWVzLCB0aGUgbmV3bHktdXBkYXRlZCByb290UHJvcGVydHlWYWx1ZUNhY2hlIGlzIGNhY2hlZCBvbnRvIHRoZSBlbGVtZW50IHNvIHRoYXQgaXQgY2FuIGJlIHVzZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3Igc3Vic2VxdWVudCBob29rcyBpbiB0aGlzIGNhbGwgdGhhdCBhcmUgYXNzb2NpYXRlZCB3aXRoIHRoZSBzYW1lIHJvb3QgcHJvcGVydHkuIElmIHdlIGRpZG4ndCBjYWNoZSB0aGUgdXBkYXRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlLCBlYWNoIHN1YnNlcXVlbnQgdXBkYXRlIHRvIHRoZSByb290IHByb3BlcnR5IGluIHRoaXMgdGljayBwYXNzIHdvdWxkIHJlc2V0IHRoZSBwcmV2aW91cyBob29rJ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVzIHRvIHJvb3RQcm9wZXJ0eVZhbHVlIHByaW9yIHRvIGluamVjdGlvbi4gQSBuaWNlIHBlcmZvcm1hbmNlIGJ5cHJvZHVjdCBvZiByb290UHJvcGVydHlWYWx1ZSBjYWNoaW5nIGlzIHRoYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJzZXF1ZW50bHkgY2hhaW5lZCBhbmltYXRpb25zIHVzaW5nIHRoZSBzYW1lIGhvb2tSb290IGJ1dCBhIGRpZmZlcmVudCBob29rIGNhbiB1c2UgdGhpcyBjYWNoZWQgcm9vdFByb3BlcnR5VmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoQ1NTLkhvb2tzLnJlZ2lzdGVyZWRbcHJvcGVydHldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9va1Jvb3QgPSBDU1MuSG9va3MuZ2V0Um9vdChwcm9wZXJ0eSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm9vdFByb3BlcnR5VmFsdWVDYWNoZSA9IERhdGEoZWxlbWVudCkucm9vdFByb3BlcnR5VmFsdWVDYWNoZVtob29rUm9vdF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocm9vdFByb3BlcnR5VmFsdWVDYWNoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0d2Vlbi5yb290UHJvcGVydHlWYWx1ZSA9IHJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBET00gVXBkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIHNldFByb3BlcnR5VmFsdWUoKSByZXR1cm5zIGFuIGFycmF5IG9mIHRoZSBwcm9wZXJ0eSBuYW1lIGFuZCBwcm9wZXJ0eSB2YWx1ZSBwb3N0IGFueSBub3JtYWxpemF0aW9uIHRoYXQgbWF5IGhhdmUgYmVlbiBwZXJmb3JtZWQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBUbyBzb2x2ZSBhbiBJRTw9OCBwb3NpdGlvbmluZyBidWcsIHRoZSB1bml0IHR5cGUgaXMgZHJvcHBlZCB3aGVuIHNldHRpbmcgYSBwcm9wZXJ0eSB2YWx1ZSBvZiAwLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFkanVzdGVkU2V0RGF0YSA9IENTUy5zZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIC8qIFNFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuLmN1cnJlbnRWYWx1ZSArIChJRSA8IDkgJiYgcGFyc2VGbG9hdChjdXJyZW50VmFsdWUpID09PSAwID8gXCJcIiA6IHR3ZWVuLnVuaXRUeXBlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0d2Vlbi5yb290UHJvcGVydHlWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0d2Vlbi5zY3JvbGxEYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBIb29rczogUGFydCBJSVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdyB0aGF0IHdlIGhhdmUgdGhlIGhvb2sncyB1cGRhdGVkIHJvb3RQcm9wZXJ0eVZhbHVlICh0aGUgcG9zdC1wcm9jZXNzZWQgdmFsdWUgcHJvdmlkZWQgYnkgYWRqdXN0ZWRTZXREYXRhKSwgY2FjaGUgaXQgb250byB0aGUgZWxlbWVudC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDU1MuSG9va3MucmVnaXN0ZXJlZFtwcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTaW5jZSBhZGp1c3RlZFNldERhdGEgY29udGFpbnMgbm9ybWFsaXplZCBkYXRhIHJlYWR5IGZvciBET00gdXBkYXRpbmcsIHRoZSByb290UHJvcGVydHlWYWx1ZSBuZWVkcyB0byBiZSByZS1leHRyYWN0ZWQgZnJvbSBpdHMgbm9ybWFsaXplZCBmb3JtLiA/PyAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtob29rUm9vdF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS5yb290UHJvcGVydHlWYWx1ZUNhY2hlW2hvb2tSb290XSA9IENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2hvb2tSb290XShcImV4dHJhY3RcIiwgbnVsbCwgYWRqdXN0ZWRTZXREYXRhWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLnJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGVbaG9va1Jvb3RdID0gYWRqdXN0ZWRTZXREYXRhWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRyYW5zZm9ybXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZsYWcgd2hldGhlciBhIHRyYW5zZm9ybSBwcm9wZXJ0eSBpcyBiZWluZyBhbmltYXRlZCBzbyB0aGF0IGZsdXNoVHJhbnNmb3JtQ2FjaGUoKSBjYW4gYmUgdHJpZ2dlcmVkIG9uY2UgdGhpcyB0aWNrIHBhc3MgaXMgY29tcGxldGUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWRqdXN0ZWRTZXREYXRhWzBdID09PSBcInRyYW5zZm9ybVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtUHJvcGVydHlFeGlzdHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgbW9iaWxlSEFcbiAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiBtb2JpbGVIQSBpcyBlbmFibGVkLCBzZXQgdGhlIHRyYW5zbGF0ZTNkIHRyYW5zZm9ybSB0byBudWxsIHRvIGZvcmNlIGhhcmR3YXJlIGFjY2VsZXJhdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgICBJdCdzIHNhZmUgdG8gb3ZlcnJpZGUgdGhpcyBwcm9wZXJ0eSBzaW5jZSBWZWxvY2l0eSBkb2Vzbid0IGFjdHVhbGx5IHN1cHBvcnQgaXRzIGFuaW1hdGlvbiAoaG9va3MgYXJlIHVzZWQgaW4gaXRzIHBsYWNlKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLm1vYmlsZUhBKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRG9uJ3Qgc2V0IHRoZSBudWxsIHRyYW5zZm9ybSBoYWNrIGlmIHdlJ3ZlIGFscmVhZHkgZG9uZSBzby4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZS50cmFuc2xhdGUzZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFsbCBlbnRyaWVzIG9uIHRoZSB0cmFuc2Zvcm1DYWNoZSBvYmplY3QgYXJlIGxhdGVyIGNvbmNhdGVuYXRlZCBpbnRvIGEgc2luZ2xlIHRyYW5zZm9ybSBzdHJpbmcgdmlhIGZsdXNoVHJhbnNmb3JtQ2FjaGUoKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZS50cmFuc2xhdGUzZCA9IFwiKDBweCwgMHB4LCAwcHgpXCI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtUHJvcGVydHlFeGlzdHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRyYW5zZm9ybVByb3BlcnR5RXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLmZsdXNoVHJhbnNmb3JtQ2FjaGUoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKiBUaGUgbm9uLVwibm9uZVwiIGRpc3BsYXkgdmFsdWUgaXMgb25seSBhcHBsaWVkIHRvIGFuIGVsZW1lbnQgb25jZSAtLSB3aGVuIGl0cyBhc3NvY2lhdGVkIGNhbGwgaXMgZmlyc3QgdGlja2VkIHRocm91Z2guXG4gICAgICAgICAgICAgICAgICAgICBBY2NvcmRpbmdseSwgaXQncyBzZXQgdG8gZmFsc2Ugc28gdGhhdCBpdCBpc24ndCByZS1wcm9jZXNzZWQgYnkgdGhpcyBjYWxsIGluIHRoZSBuZXh0IHRpY2suICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLmRpc3BsYXkgIT09IHVuZGVmaW5lZCAmJiBvcHRzLmRpc3BsYXkgIT09IFwibm9uZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5TdGF0ZS5jYWxsc1tpXVsyXS5kaXNwbGF5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMudmlzaWJpbGl0eSAhPT0gdW5kZWZpbmVkICYmIG9wdHMudmlzaWJpbGl0eSAhPT0gXCJoaWRkZW5cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuY2FsbHNbaV1bMl0udmlzaWJpbGl0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogUGFzcyB0aGUgZWxlbWVudHMgYW5kIHRoZSB0aW1pbmcgZGF0YSAocGVyY2VudENvbXBsZXRlLCBtc1JlbWFpbmluZywgdGltZVN0YXJ0LCB0d2VlbkR1bW15VmFsdWUpIGludG8gdGhlIHByb2dyZXNzIGNhbGxiYWNrLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5wcm9ncmVzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5wcm9ncmVzcy5jYWxsKGNhbGxDb250YWluZXJbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbENvbnRhaW5lclsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJjZW50Q29tcGxldGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5tYXgoMCwgKHRpbWVTdGFydCArIG9wdHMuZHVyYXRpb24pIC0gdGltZUN1cnJlbnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVTdGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0d2VlbkR1bW15VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhpcyBjYWxsIGhhcyBmaW5pc2hlZCB0d2VlbmluZywgcGFzcyBpdHMgaW5kZXggdG8gY29tcGxldGVDYWxsKCkgdG8gaGFuZGxlIGNhbGwgY2xlYW51cC4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBlcmNlbnRDb21wbGV0ZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGVDYWxsKGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBOb3RlOiBjb21wbGV0ZUNhbGwoKSBzZXRzIHRoZSBpc1RpY2tpbmcgZmxhZyB0byBmYWxzZSB3aGVuIHRoZSBsYXN0IGNhbGwgb24gVmVsb2NpdHkuU3RhdGUuY2FsbHMgaGFzIGNvbXBsZXRlZC4gKi9cbiAgICAgICAgICAgIGlmIChWZWxvY2l0eS5TdGF0ZS5pc1RpY2tpbmcpIHtcbiAgICAgICAgICAgICAgICB0aWNrZXIodGljayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgQ2FsbCBDb21wbGV0aW9uXG4gICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIC8qIE5vdGU6IFVubGlrZSB0aWNrKCksIHdoaWNoIHByb2Nlc3NlcyBhbGwgYWN0aXZlIGNhbGxzIGF0IG9uY2UsIGNhbGwgY29tcGxldGlvbiBpcyBoYW5kbGVkIG9uIGEgcGVyLWNhbGwgYmFzaXMuICovXG4gICAgICAgIGZ1bmN0aW9uIGNvbXBsZXRlQ2FsbChjYWxsSW5kZXgsIGlzU3RvcHBlZCkge1xuICAgICAgICAgICAgLyogRW5zdXJlIHRoZSBjYWxsIGV4aXN0cy4gKi9cbiAgICAgICAgICAgIGlmICghVmVsb2NpdHkuU3RhdGUuY2FsbHNbY2FsbEluZGV4XSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogUHVsbCB0aGUgbWV0YWRhdGEgZnJvbSB0aGUgY2FsbC4gKi9cbiAgICAgICAgICAgIHZhciBjYWxsID0gVmVsb2NpdHkuU3RhdGUuY2FsbHNbY2FsbEluZGV4XVswXSxcbiAgICAgICAgICAgICAgICBlbGVtZW50cyA9IFZlbG9jaXR5LlN0YXRlLmNhbGxzW2NhbGxJbmRleF1bMV0sXG4gICAgICAgICAgICAgICAgb3B0cyA9IFZlbG9jaXR5LlN0YXRlLmNhbGxzW2NhbGxJbmRleF1bMl0sXG4gICAgICAgICAgICAgICAgcmVzb2x2ZXIgPSBWZWxvY2l0eS5TdGF0ZS5jYWxsc1tjYWxsSW5kZXhdWzRdO1xuXG4gICAgICAgICAgICB2YXIgcmVtYWluaW5nQ2FsbHNFeGlzdCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgIEVsZW1lbnQgRmluYWxpemF0aW9uXG4gICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGNhbGxMZW5ndGggPSBjYWxsLmxlbmd0aDsgaSA8IGNhbGxMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gY2FsbFtpXS5lbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgLyogSWYgdGhlIHVzZXIgc2V0IGRpc3BsYXkgdG8gXCJub25lXCIgKGludGVuZGluZyB0byBoaWRlIHRoZSBlbGVtZW50KSwgc2V0IGl0IG5vdyB0aGF0IHRoZSBhbmltYXRpb24gaGFzIGNvbXBsZXRlZC4gKi9cbiAgICAgICAgICAgICAgICAvKiBOb3RlOiBkaXNwbGF5Om5vbmUgaXNuJ3Qgc2V0IHdoZW4gY2FsbHMgYXJlIG1hbnVhbGx5IHN0b3BwZWQgKHZpYSBWZWxvY2l0eShcInN0b3BcIikuICovXG4gICAgICAgICAgICAgICAgLyogTm90ZTogRGlzcGxheSBnZXRzIGlnbm9yZWQgd2l0aCBcInJldmVyc2VcIiBjYWxscyBhbmQgaW5maW5pdGUgbG9vcHMsIHNpbmNlIHRoaXMgYmVoYXZpb3Igd291bGQgYmUgdW5kZXNpcmFibGUuICovXG4gICAgICAgICAgICAgICAgaWYgKCFpc1N0b3BwZWQgJiYgIW9wdHMubG9vcCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5kaXNwbGF5ID09PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLnNldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJkaXNwbGF5XCIsIG9wdHMuZGlzcGxheSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy52aXNpYmlsaXR5ID09PSBcImhpZGRlblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBDU1Muc2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcInZpc2liaWxpdHlcIiwgb3B0cy52aXNpYmlsaXR5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qIElmIHRoZSBlbGVtZW50J3MgcXVldWUgaXMgZW1wdHkgKGlmIG9ubHkgdGhlIFwiaW5wcm9ncmVzc1wiIGl0ZW0gaXMgbGVmdCBhdCBwb3NpdGlvbiAwKSBvciBpZiBpdHMgcXVldWUgaXMgYWJvdXQgdG8gcnVuXG4gICAgICAgICAgICAgICAgIGEgbm9uLVZlbG9jaXR5LWluaXRpYXRlZCBlbnRyeSwgdHVybiBvZmYgdGhlIGlzQW5pbWF0aW5nIGZsYWcuIEEgbm9uLVZlbG9jaXR5LWluaXRpYXRpZWQgcXVldWUgZW50cnkncyBsb2dpYyBtaWdodCBhbHRlclxuICAgICAgICAgICAgICAgICBhbiBlbGVtZW50J3MgQ1NTIHZhbHVlcyBhbmQgdGhlcmVieSBjYXVzZSBWZWxvY2l0eSdzIGNhY2hlZCB2YWx1ZSBkYXRhIHRvIGdvIHN0YWxlLiBUbyBkZXRlY3QgaWYgYSBxdWV1ZSBlbnRyeSB3YXMgaW5pdGlhdGVkIGJ5IFZlbG9jaXR5LFxuICAgICAgICAgICAgICAgICB3ZSBjaGVjayBmb3IgdGhlIGV4aXN0ZW5jZSBvZiBvdXIgc3BlY2lhbCBWZWxvY2l0eS5xdWV1ZUVudHJ5RmxhZyBkZWNsYXJhdGlvbiwgd2hpY2ggbWluaWZpZXJzIHdvbid0IHJlbmFtZSBzaW5jZSB0aGUgZmxhZ1xuICAgICAgICAgICAgICAgICBpcyBhc3NpZ25lZCB0byBqUXVlcnkncyBnbG9iYWwgJCBvYmplY3QgYW5kIHRodXMgZXhpc3RzIG91dCBvZiBWZWxvY2l0eSdzIG93biBzY29wZS4gKi9cbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IERhdGEoZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICBpZiAob3B0cy5sb29wICE9PSB0cnVlICYmICgkLnF1ZXVlKGVsZW1lbnQpWzFdID09PSB1bmRlZmluZWQgfHwgIS9cXC52ZWxvY2l0eVF1ZXVlRW50cnlGbGFnL2kudGVzdCgkLnF1ZXVlKGVsZW1lbnQpWzFdKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogVGhlIGVsZW1lbnQgbWF5IGhhdmUgYmVlbiBkZWxldGVkLiBFbnN1cmUgdGhhdCBpdHMgZGF0YSBjYWNoZSBzdGlsbCBleGlzdHMgYmVmb3JlIGFjdGluZyBvbiBpdC4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuaXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIENsZWFyIHRoZSBlbGVtZW50J3Mgcm9vdFByb3BlcnR5VmFsdWVDYWNoZSwgd2hpY2ggd2lsbCBiZWNvbWUgc3RhbGUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGUgPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRyYW5zZm9ybUhBUHJvcGVydHlFeGlzdHMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIGFueSAzRCB0cmFuc2Zvcm0gc3VicHJvcGVydHkgaXMgYXQgaXRzIGRlZmF1bHQgdmFsdWUgKHJlZ2FyZGxlc3Mgb2YgdW5pdCB0eXBlKSwgcmVtb3ZlIGl0LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKENTUy5MaXN0cy50cmFuc2Zvcm1zM0QsIGZ1bmN0aW9uKGksIHRyYW5zZm9ybU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVmYXVsdFZhbHVlID0gL15zY2FsZS8udGVzdCh0cmFuc2Zvcm1OYW1lKSA/IDEgOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWUgPSBkYXRhLnRyYW5zZm9ybUNhY2hlW3RyYW5zZm9ybU5hbWVdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEudHJhbnNmb3JtQ2FjaGVbdHJhbnNmb3JtTmFtZV0gIT09IHVuZGVmaW5lZCAmJiBuZXcgUmVnRXhwKFwiXlxcXFwoXCIgKyBkZWZhdWx0VmFsdWUgKyBcIlteLl1cIikudGVzdChjdXJyZW50VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybUhBUHJvcGVydHlFeGlzdHMgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhLnRyYW5zZm9ybUNhY2hlW3RyYW5zZm9ybU5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBNb2JpbGUgZGV2aWNlcyBoYXZlIGhhcmR3YXJlIGFjY2VsZXJhdGlvbiByZW1vdmVkIGF0IHRoZSBlbmQgb2YgdGhlIGFuaW1hdGlvbiBpbiBvcmRlciB0byBhdm9pZCBob2dnaW5nIHRoZSBHUFUncyBtZW1vcnkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5tb2JpbGVIQSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybUhBUHJvcGVydHlFeGlzdHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhLnRyYW5zZm9ybUNhY2hlLnRyYW5zbGF0ZTNkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBGbHVzaCB0aGUgc3VicHJvcGVydHkgcmVtb3ZhbHMgdG8gdGhlIERPTS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cmFuc2Zvcm1IQVByb3BlcnR5RXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLmZsdXNoVHJhbnNmb3JtQ2FjaGUoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFJlbW92ZSB0aGUgXCJ2ZWxvY2l0eS1hbmltYXRpbmdcIiBpbmRpY2F0b3IgY2xhc3MuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBDU1MuVmFsdWVzLnJlbW92ZUNsYXNzKGVsZW1lbnQsIFwidmVsb2NpdHktYW5pbWF0aW5nXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICBPcHRpb246IENvbXBsZXRlXG4gICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIC8qIENvbXBsZXRlIGlzIGZpcmVkIG9uY2UgcGVyIGNhbGwgKG5vdCBvbmNlIHBlciBlbGVtZW50KSBhbmQgaXMgcGFzc2VkIHRoZSBmdWxsIHJhdyBET00gZWxlbWVudCBzZXQgYXMgYm90aCBpdHMgY29udGV4dCBhbmQgaXRzIGZpcnN0IGFyZ3VtZW50LiAqL1xuICAgICAgICAgICAgICAgIC8qIE5vdGU6IENhbGxiYWNrcyBhcmVuJ3QgZmlyZWQgd2hlbiBjYWxscyBhcmUgbWFudWFsbHkgc3RvcHBlZCAodmlhIFZlbG9jaXR5KFwic3RvcFwiKS4gKi9cbiAgICAgICAgICAgICAgICBpZiAoIWlzU3RvcHBlZCAmJiBvcHRzLmNvbXBsZXRlICYmICFvcHRzLmxvb3AgJiYgKGkgPT09IGNhbGxMZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgICAgICAgICAvKiBXZSB0aHJvdyBjYWxsYmFja3MgaW4gYSBzZXRUaW1lb3V0IHNvIHRoYXQgdGhyb3duIGVycm9ycyBkb24ndCBoYWx0IHRoZSBleGVjdXRpb24gb2YgVmVsb2NpdHkgaXRzZWxmLiAqL1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5jb21wbGV0ZS5jYWxsKGVsZW1lbnRzLCBlbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICBQcm9taXNlIFJlc29sdmluZ1xuICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgLyogTm90ZTogSW5maW5pdGUgbG9vcHMgZG9uJ3QgcmV0dXJuIHByb21pc2VzLiAqL1xuICAgICAgICAgICAgICAgIGlmIChyZXNvbHZlciAmJiBvcHRzLmxvb3AgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZXIoZWxlbWVudHMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgIE9wdGlvbjogTG9vcCAoSW5maW5pdGUpXG4gICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YSAmJiBvcHRzLmxvb3AgPT09IHRydWUgJiYgIWlzU3RvcHBlZCkge1xuICAgICAgICAgICAgICAgICAgICAvKiBJZiBhIHJvdGF0ZVgvWS9aIHByb3BlcnR5IGlzIGJlaW5nIGFuaW1hdGVkIGJ5IDM2MCBkZWcgd2l0aCBsb29wOnRydWUsIHN3YXAgdHdlZW4gc3RhcnQvZW5kIHZhbHVlcyB0byBlbmFibGVcbiAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVvdXMgaXRlcmF0aXZlIHJvdGF0aW9uIGxvb3BpbmcuIChPdGhlcmlzZSwgdGhlIGVsZW1lbnQgd291bGQganVzdCByb3RhdGUgYmFjayBhbmQgZm9ydGguKSAqL1xuICAgICAgICAgICAgICAgICAgICAkLmVhY2goZGF0YS50d2VlbnNDb250YWluZXIsIGZ1bmN0aW9uKHByb3BlcnR5TmFtZSwgdHdlZW5Db250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgvXnJvdGF0ZS8udGVzdChwcm9wZXJ0eU5hbWUpICYmICgocGFyc2VGbG9hdCh0d2VlbkNvbnRhaW5lci5zdGFydFZhbHVlKSAtIHBhcnNlRmxvYXQodHdlZW5Db250YWluZXIuZW5kVmFsdWUpKSAlIDM2MCA9PT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2xkU3RhcnRWYWx1ZSA9IHR3ZWVuQ29udGFpbmVyLnN0YXJ0VmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0d2VlbkNvbnRhaW5lci5zdGFydFZhbHVlID0gdHdlZW5Db250YWluZXIuZW5kVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW5Db250YWluZXIuZW5kVmFsdWUgPSBvbGRTdGFydFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoL15iYWNrZ3JvdW5kUG9zaXRpb24vLnRlc3QocHJvcGVydHlOYW1lKSAmJiBwYXJzZUZsb2F0KHR3ZWVuQ29udGFpbmVyLmVuZFZhbHVlKSA9PT0gMTAwICYmIHR3ZWVuQ29udGFpbmVyLnVuaXRUeXBlID09PSBcIiVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuQ29udGFpbmVyLmVuZFZhbHVlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0d2VlbkNvbnRhaW5lci5zdGFydFZhbHVlID0gMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eShlbGVtZW50LCBcInJldmVyc2VcIiwge2xvb3A6IHRydWUsIGRlbGF5OiBvcHRzLmRlbGF5fSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICBEZXF1ZXVlaW5nXG4gICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIC8qIEZpcmUgdGhlIG5leHQgY2FsbCBpbiB0aGUgcXVldWUgc28gbG9uZyBhcyB0aGlzIGNhbGwncyBxdWV1ZSB3YXNuJ3Qgc2V0IHRvIGZhbHNlICh0byB0cmlnZ2VyIGEgcGFyYWxsZWwgYW5pbWF0aW9uKSxcbiAgICAgICAgICAgICAgICAgd2hpY2ggd291bGQgaGF2ZSBhbHJlYWR5IGNhdXNlZCB0aGUgbmV4dCBjYWxsIHRvIGZpcmUuIE5vdGU6IEV2ZW4gaWYgdGhlIGVuZCBvZiB0aGUgYW5pbWF0aW9uIHF1ZXVlIGhhcyBiZWVuIHJlYWNoZWQsXG4gICAgICAgICAgICAgICAgICQuZGVxdWV1ZSgpIG11c3Qgc3RpbGwgYmUgY2FsbGVkIGluIG9yZGVyIHRvIGNvbXBsZXRlbHkgY2xlYXIgalF1ZXJ5J3MgYW5pbWF0aW9uIHF1ZXVlLiAqL1xuICAgICAgICAgICAgICAgIGlmIChvcHRzLnF1ZXVlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAkLmRlcXVldWUoZWxlbWVudCwgb3B0cy5xdWV1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgQ2FsbHMgQXJyYXkgQ2xlYW51cFxuICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgLyogU2luY2UgdGhpcyBjYWxsIGlzIGNvbXBsZXRlLCBzZXQgaXQgdG8gZmFsc2Ugc28gdGhhdCB0aGUgckFGIHRpY2sgc2tpcHMgaXQuIFRoaXMgYXJyYXkgaXMgbGF0ZXIgY29tcGFjdGVkIHZpYSBjb21wYWN0U3BhcnNlQXJyYXkoKS5cbiAgICAgICAgICAgICAoRm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMsIHRoZSBjYWxsIGlzIHNldCB0byBmYWxzZSBpbnN0ZWFkIG9mIGJlaW5nIGRlbGV0ZWQgZnJvbSB0aGUgYXJyYXk6IGh0dHA6Ly93d3cuaHRtbDVyb2Nrcy5jb20vZW4vdHV0b3JpYWxzL3NwZWVkL3Y4LykgKi9cbiAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLmNhbGxzW2NhbGxJbmRleF0gPSBmYWxzZTtcblxuICAgICAgICAgICAgLyogSXRlcmF0ZSB0aHJvdWdoIHRoZSBjYWxscyBhcnJheSB0byBkZXRlcm1pbmUgaWYgdGhpcyB3YXMgdGhlIGZpbmFsIGluLXByb2dyZXNzIGFuaW1hdGlvbi5cbiAgICAgICAgICAgICBJZiBzbywgc2V0IGEgZmxhZyB0byBlbmQgdGlja2luZyBhbmQgY2xlYXIgdGhlIGNhbGxzIGFycmF5LiAqL1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGNhbGxzTGVuZ3RoID0gVmVsb2NpdHkuU3RhdGUuY2FsbHMubGVuZ3RoOyBqIDwgY2FsbHNMZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5TdGF0ZS5jYWxsc1tqXSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVtYWluaW5nQ2FsbHNFeGlzdCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmVtYWluaW5nQ2FsbHNFeGlzdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAvKiB0aWNrKCkgd2lsbCBkZXRlY3QgdGhpcyBmbGFnIHVwb24gaXRzIG5leHQgaXRlcmF0aW9uIGFuZCBzdWJzZXF1ZW50bHkgdHVybiBpdHNlbGYgb2ZmLiAqL1xuICAgICAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLmlzVGlja2luZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgLyogQ2xlYXIgdGhlIGNhbGxzIGFycmF5IHNvIHRoYXQgaXRzIGxlbmd0aCBpcyByZXNldC4gKi9cbiAgICAgICAgICAgICAgICBkZWxldGUgVmVsb2NpdHkuU3RhdGUuY2FsbHM7XG4gICAgICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuY2FsbHMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKipcbiAgICAgICAgIEZyYW1ld29ya3NcbiAgICAgICAgICoqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAvKiBCb3RoIGpRdWVyeSBhbmQgWmVwdG8gYWxsb3cgdGhlaXIgJC5mbiBvYmplY3QgdG8gYmUgZXh0ZW5kZWQgdG8gYWxsb3cgd3JhcHBlZCBlbGVtZW50cyB0byBiZSBzdWJqZWN0ZWQgdG8gcGx1Z2luIGNhbGxzLlxuICAgICAgICAgSWYgZWl0aGVyIGZyYW1ld29yayBpcyBsb2FkZWQsIHJlZ2lzdGVyIGEgXCJ2ZWxvY2l0eVwiIGV4dGVuc2lvbiBwb2ludGluZyB0byBWZWxvY2l0eSdzIGNvcmUgYW5pbWF0ZSgpIG1ldGhvZC4gIFZlbG9jaXR5XG4gICAgICAgICBhbHNvIHJlZ2lzdGVycyBpdHNlbGYgb250byBhIGdsb2JhbCBjb250YWluZXIgKHdpbmRvdy5qUXVlcnkgfHwgd2luZG93LlplcHRvIHx8IHdpbmRvdykgc28gdGhhdCBjZXJ0YWluIGZlYXR1cmVzIGFyZVxuICAgICAgICAgYWNjZXNzaWJsZSBiZXlvbmQganVzdCBhIHBlci1lbGVtZW50IHNjb3BlLiBUaGlzIG1hc3RlciBvYmplY3QgY29udGFpbnMgYW4gLmFuaW1hdGUoKSBtZXRob2QsIHdoaWNoIGlzIGxhdGVyIGFzc2lnbmVkIHRvICQuZm5cbiAgICAgICAgIChpZiBqUXVlcnkgb3IgWmVwdG8gYXJlIHByZXNlbnQpLiBBY2NvcmRpbmdseSwgVmVsb2NpdHkgY2FuIGJvdGggYWN0IG9uIHdyYXBwZWQgRE9NIGVsZW1lbnRzIGFuZCBzdGFuZCBhbG9uZSBmb3IgdGFyZ2V0aW5nIHJhdyBET00gZWxlbWVudHMuICovXG4gICAgICAgIGdsb2JhbC5WZWxvY2l0eSA9IFZlbG9jaXR5O1xuXG4gICAgICAgIGlmIChnbG9iYWwgIT09IHdpbmRvdykge1xuICAgICAgICAgICAgLyogQXNzaWduIHRoZSBlbGVtZW50IGZ1bmN0aW9uIHRvIFZlbG9jaXR5J3MgY29yZSBhbmltYXRlKCkgbWV0aG9kLiAqL1xuICAgICAgICAgICAgZ2xvYmFsLmZuLnZlbG9jaXR5ID0gYW5pbWF0ZTtcbiAgICAgICAgICAgIC8qIEFzc2lnbiB0aGUgb2JqZWN0IGZ1bmN0aW9uJ3MgZGVmYXVsdHMgdG8gVmVsb2NpdHkncyBnbG9iYWwgZGVmYXVsdHMgb2JqZWN0LiAqL1xuICAgICAgICAgICAgZ2xvYmFsLmZuLnZlbG9jaXR5LmRlZmF1bHRzID0gVmVsb2NpdHkuZGVmYXVsdHM7XG4gICAgICAgIH1cblxuICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgIFBhY2thZ2VkIFJlZGlyZWN0c1xuICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgLyogc2xpZGVVcCwgc2xpZGVEb3duICovXG4gICAgICAgICQuZWFjaChbXCJEb3duXCIsIFwiVXBcIl0sIGZ1bmN0aW9uKGksIGRpcmVjdGlvbikge1xuICAgICAgICAgICAgVmVsb2NpdHkuUmVkaXJlY3RzW1wic2xpZGVcIiArIGRpcmVjdGlvbl0gPSBmdW5jdGlvbihlbGVtZW50LCBvcHRpb25zLCBlbGVtZW50c0luZGV4LCBlbGVtZW50c1NpemUsIGVsZW1lbnRzLCBwcm9taXNlRGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciBvcHRzID0gJC5leHRlbmQoe30sIG9wdGlvbnMpLFxuICAgICAgICAgICAgICAgICAgICBiZWdpbiA9IG9wdHMuYmVnaW4sXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlID0gb3B0cy5jb21wbGV0ZSxcbiAgICAgICAgICAgICAgICAgICAgaW5saW5lVmFsdWVzID0ge30sXG4gICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkVmFsdWVzID0ge2hlaWdodDogXCJcIiwgbWFyZ2luVG9wOiBcIlwiLCBtYXJnaW5Cb3R0b206IFwiXCIsIHBhZGRpbmdUb3A6IFwiXCIsIHBhZGRpbmdCb3R0b206IFwiXCJ9O1xuXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMuZGlzcGxheSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFNob3cgdGhlIGVsZW1lbnQgYmVmb3JlIHNsaWRlRG93biBiZWdpbnMgYW5kIGhpZGUgdGhlIGVsZW1lbnQgYWZ0ZXIgc2xpZGVVcCBjb21wbGV0ZXMuICovXG4gICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IElubGluZSBlbGVtZW50cyBjYW5ub3QgaGF2ZSBkaW1lbnNpb25zIGFuaW1hdGVkLCBzbyB0aGV5J3JlIHJldmVydGVkIHRvIGlubGluZS1ibG9jay4gKi9cbiAgICAgICAgICAgICAgICAgICAgb3B0cy5kaXNwbGF5ID0gKGRpcmVjdGlvbiA9PT0gXCJEb3duXCIgPyAoVmVsb2NpdHkuQ1NTLlZhbHVlcy5nZXREaXNwbGF5VHlwZShlbGVtZW50KSA9PT0gXCJpbmxpbmVcIiA/IFwiaW5saW5lLWJsb2NrXCIgOiBcImJsb2NrXCIpIDogXCJub25lXCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG9wdHMuYmVnaW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIHVzZXIgcGFzc2VkIGluIGEgYmVnaW4gY2FsbGJhY2ssIGZpcmUgaXQgbm93LiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudHNJbmRleCA9PT0gMCAmJiBiZWdpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmVnaW4uY2FsbChlbGVtZW50cywgZWxlbWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogQ2FjaGUgdGhlIGVsZW1lbnRzJyBvcmlnaW5hbCB2ZXJ0aWNhbCBkaW1lbnNpb25hbCBwcm9wZXJ0eSB2YWx1ZXMgc28gdGhhdCB3ZSBjYW4gYW5pbWF0ZSBiYWNrIHRvIHRoZW0uICovXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGNvbXB1dGVkVmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbXB1dGVkVmFsdWVzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaW5saW5lVmFsdWVzW3Byb3BlcnR5XSA9IGVsZW1lbnQuc3R5bGVbcHJvcGVydHldO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBGb3Igc2xpZGVEb3duLCB1c2UgZm9yY2VmZWVkaW5nIHRvIGFuaW1hdGUgYWxsIHZlcnRpY2FsIHByb3BlcnRpZXMgZnJvbSAwLiBGb3Igc2xpZGVVcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICB1c2UgZm9yY2VmZWVkaW5nIHRvIHN0YXJ0IGZyb20gY29tcHV0ZWQgdmFsdWVzIGFuZCBhbmltYXRlIGRvd24gdG8gMC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eVZhbHVlID0gQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgcHJvcGVydHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcHV0ZWRWYWx1ZXNbcHJvcGVydHldID0gKGRpcmVjdGlvbiA9PT0gXCJEb3duXCIpID8gW3Byb3BlcnR5VmFsdWUsIDBdIDogWzAsIHByb3BlcnR5VmFsdWVdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogRm9yY2UgdmVydGljYWwgb3ZlcmZsb3cgY29udGVudCB0byBjbGlwIHNvIHRoYXQgc2xpZGluZyB3b3JrcyBhcyBleHBlY3RlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgaW5saW5lVmFsdWVzLm92ZXJmbG93ID0gZWxlbWVudC5zdHlsZS5vdmVyZmxvdztcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIG9wdHMuY29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUmVzZXQgZWxlbWVudCB0byBpdHMgcHJlLXNsaWRlIGlubGluZSB2YWx1ZXMgb25jZSBpdHMgc2xpZGUgYW5pbWF0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBpbmxpbmVWYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmxpbmVWYWx1ZXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtwcm9wZXJ0eV0gPSBpbmxpbmVWYWx1ZXNbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIHVzZXIgcGFzc2VkIGluIGEgY29tcGxldGUgY2FsbGJhY2ssIGZpcmUgaXQgbm93LiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudHNJbmRleCA9PT0gZWxlbWVudHNTaXplIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGUuY2FsbChlbGVtZW50cywgZWxlbWVudHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2VEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZURhdGEucmVzb2x2ZXIoZWxlbWVudHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIFZlbG9jaXR5KGVsZW1lbnQsIGNvbXB1dGVkVmFsdWVzLCBvcHRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qIGZhZGVJbiwgZmFkZU91dCAqL1xuICAgICAgICAkLmVhY2goW1wiSW5cIiwgXCJPdXRcIl0sIGZ1bmN0aW9uKGksIGRpcmVjdGlvbikge1xuICAgICAgICAgICAgVmVsb2NpdHkuUmVkaXJlY3RzW1wiZmFkZVwiICsgZGlyZWN0aW9uXSA9IGZ1bmN0aW9uKGVsZW1lbnQsIG9wdGlvbnMsIGVsZW1lbnRzSW5kZXgsIGVsZW1lbnRzU2l6ZSwgZWxlbWVudHMsIHByb21pc2VEYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9wdHMgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucyksXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlID0gb3B0cy5jb21wbGV0ZSxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc01hcCA9IHtvcGFjaXR5OiAoZGlyZWN0aW9uID09PSBcIkluXCIpID8gMSA6IDB9O1xuXG4gICAgICAgICAgICAgICAgLyogU2luY2UgcmVkaXJlY3RzIGFyZSB0cmlnZ2VyZWQgaW5kaXZpZHVhbGx5IGZvciBlYWNoIGVsZW1lbnQgaW4gdGhlIGFuaW1hdGVkIHNldCwgYXZvaWQgcmVwZWF0ZWRseSB0cmlnZ2VyaW5nXG4gICAgICAgICAgICAgICAgIGNhbGxiYWNrcyBieSBmaXJpbmcgdGhlbSBvbmx5IHdoZW4gdGhlIGZpbmFsIGVsZW1lbnQgaGFzIGJlZW4gcmVhY2hlZC4gKi9cbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudHNJbmRleCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBvcHRzLmJlZ2luID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnRzSW5kZXggIT09IGVsZW1lbnRzU2l6ZSAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5jb21wbGV0ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5jb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGUuY2FsbChlbGVtZW50cywgZWxlbWVudHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2VEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZURhdGEucmVzb2x2ZXIoZWxlbWVudHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qIElmIGEgZGlzcGxheSB3YXMgcGFzc2VkIGluLCB1c2UgaXQuIE90aGVyd2lzZSwgZGVmYXVsdCB0byBcIm5vbmVcIiBmb3IgZmFkZU91dCBvciB0aGUgZWxlbWVudC1zcGVjaWZpYyBkZWZhdWx0IGZvciBmYWRlSW4uICovXG4gICAgICAgICAgICAgICAgLyogTm90ZTogV2UgYWxsb3cgdXNlcnMgdG8gcGFzcyBpbiBcIm51bGxcIiB0byBza2lwIGRpc3BsYXkgc2V0dGluZyBhbHRvZ2V0aGVyLiAqL1xuICAgICAgICAgICAgICAgIGlmIChvcHRzLmRpc3BsYXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBvcHRzLmRpc3BsYXkgPSAoZGlyZWN0aW9uID09PSBcIkluXCIgPyBcImF1dG9cIiA6IFwibm9uZVwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBWZWxvY2l0eSh0aGlzLCBwcm9wZXJ0aWVzTWFwLCBvcHRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBWZWxvY2l0eTtcbiAgICB9KCh3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5aZXB0byB8fCB3aW5kb3cpLCB3aW5kb3csICh3aW5kb3cgPyB3aW5kb3cuZG9jdW1lbnQgOiB1bmRlZmluZWQpKTtcbn0pKTtcblxuLyoqKioqKioqKioqKioqKioqKlxuIEtub3duIElzc3Vlc1xuICoqKioqKioqKioqKioqKioqKi9cblxuLyogVGhlIENTUyBzcGVjIG1hbmRhdGVzIHRoYXQgdGhlIHRyYW5zbGF0ZVgvWS9aIHRyYW5zZm9ybXMgYXJlICUtcmVsYXRpdmUgdG8gdGhlIGVsZW1lbnQgaXRzZWxmIC0tIG5vdCBpdHMgcGFyZW50LlxuIFZlbG9jaXR5LCBob3dldmVyLCBkb2Vzbid0IG1ha2UgdGhpcyBkaXN0aW5jdGlvbi4gVGh1cywgY29udmVydGluZyB0byBvciBmcm9tIHRoZSAlIHVuaXQgd2l0aCB0aGVzZSBzdWJwcm9wZXJ0aWVzXG4gd2lsbCBwcm9kdWNlIGFuIGluYWNjdXJhdGUgY29udmVyc2lvbiB2YWx1ZS4gVGhlIHNhbWUgaXNzdWUgZXhpc3RzIHdpdGggdGhlIGN4L2N5IGF0dHJpYnV0ZXMgb2YgU1ZHIGNpcmNsZXMgYW5kIGVsbGlwc2VzLiAqLyIsIi8qKlxuICog0YHRgtGA0LDQvdC40YbQsCBBYm91dFxuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgLyoqXG4gICAgICog0LzQtdGC0L7QtCDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuCDQtNC70Y8g0YHRgtGA0LDQvdC40YbRiyBBYm91dFxuICAgICAqL1xuICAgIGluaXQoKXtcbiAgICAgICAgXG4gICAgfVxufTsiLCIvKipcbiAqINGB0YLRgNCw0L3QuNGG0LAgSG9tZVxuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgLyoqXG4gICAgICog0LzQtdGC0L7QtCDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuCDQtNC70Y8g0YHRgtGA0LDQvdC40YbRi1xuICAgICAqL1xuICAgIGluaXQoKXsgICAgICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICAqINC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0YHQu9Cw0LTQtdC50YAg0LTQu9GPIGhvbWUgcGFnZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5tYWluX3NsaWRlcigpO1xuICAgICAgICB0aGlzLnRyeV9FUzYoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0LzQtdGC0L7QtCDQtNC70Y8g0LjQvdC40YbQuNC70LjQt9Cw0YbQuNC4INGB0LvQsNC50LTQtdGA0LBcbiAgICAgKi9cbiAgICBtYWluX3NsaWRlciAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdNYWluIHNsaWRlciBmb3IgaG9tZSBwYWdlJywgdGhpcyk7XG4gICAgfSxcblxuICAgIHRyeV9FUzYgKCkge1xuXG4gICAgfSxcblxuICAgIGV4YW1wbGVfd3BfYWpheCAoKSB7XG5cbiAgICB9XG5cbn07XG4iLCJpbXBvcnQgJy4uL2xpYnMvbWF0ZXJpYWxpemUvZ2xvYmFsJztcbmltcG9ydCAnLi4vbGlicy9tYXRlcmlhbGl6ZS92ZWxvY2l0eSc7XG5pbXBvcnQgJy4uL2xpYnMvbWF0ZXJpYWxpemUvc2Nyb2xsc3B5JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIC8qKlxuICAgICAqINC80LXRgtC+0LQg0LTQu9GPINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNC4INC80L7QtNCw0LvRjNC90L7Qs9C+XG4gICAgICog0L7QutC90LAsINC60L7RgtC+0YDQvtC1INC10YHRgtGMINC90LAg0L3QtdGB0LrQvtC70YzQutC40YUg0YHRgtGA0LDQvdC40YbQsNGFXG4gICAgICovXG4gICAgaW5pdCgpe1xuICAgICAgICB0aGlzLmhlYWRlckZ1bmN0aW9ucygpO1xuICAgIH0sXG5cbiAgICBoZWFkZXJGdW5jdGlvbnMgKCkge1xuICAgICAgICAkKCcuc2Nyb2xsc3B5Jykuc2Nyb2xsU3B5KCk7XG4gICAgfVxufTsiXX0=
