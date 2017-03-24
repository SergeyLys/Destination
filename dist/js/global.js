(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var _HOME = require('./pages/HOME');

var _HOME2 = _interopRequireDefault(_HOME);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var init = null;

switch (global.vars.page) {
    case 'home_page':
        init = _HOME2.default.init.bind(_HOME2.default);
        break;
    default:
        init = function init() {};
}

$(document).ready(init());

$(window).on('scroll', function () {
    if ($('.first-section').length != 0) {
        var ws = $(window).scrollTop(),
            st = $('.site-header').offset().top;

        if (ws >= st) {
            $('.site-header_inner').addClass('fixed');
        } else {
            $('.site-header_inner').removeClass('fixed');
        }
    } else {
        $('.site-header_inner').addClass('fixed');
    }
});

$(window).on('load', function () {
    $('.preloader').hide(100);
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./pages/HOME":20}],2:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function ($) {

  "use strict";

  var FOUNDATION_VERSION = '6.3.0';

  // Global Foundation object
  // This is attached to the window, or used as a module for AMD/Browserify
  var Foundation = {
    version: FOUNDATION_VERSION,

    /**
     * Stores initialized plugins.
     */
    _plugins: {},

    /**
     * Stores generated unique ids for plugin instances
     */
    _uuids: [],

    /**
     * Returns a boolean for RTL support
     */
    rtl: function rtl() {
      return $('html').attr('dir') === 'rtl';
    },
    /**
     * Defines a Foundation plugin, adding it to the `Foundation` namespace and the list of plugins to initialize when reflowing.
     * @param {Object} plugin - The constructor of the plugin.
     */
    plugin: function plugin(_plugin, name) {
      // Object key to use when adding to global Foundation object
      // Examples: Foundation.Reveal, Foundation.OffCanvas
      var className = name || functionName(_plugin);
      // Object key to use when storing the plugin, also used to create the identifying data attribute for the plugin
      // Examples: data-reveal, data-off-canvas
      var attrName = hyphenate(className);

      // Add to the Foundation object and the plugins list (for reflowing)
      this._plugins[attrName] = this[className] = _plugin;
    },
    /**
     * @function
     * Populates the _uuids array with pointers to each individual plugin instance.
     * Adds the `zfPlugin` data-attribute to programmatically created plugins to allow use of $(selector).foundation(method) calls.
     * Also fires the initialization event for each plugin, consolidating repetitive code.
     * @param {Object} plugin - an instance of a plugin, usually `this` in context.
     * @param {String} name - the name of the plugin, passed as a camelCased string.
     * @fires Plugin#init
     */
    registerPlugin: function registerPlugin(plugin, name) {
      var pluginName = name ? hyphenate(name) : functionName(plugin.constructor).toLowerCase();
      plugin.uuid = this.GetYoDigits(6, pluginName);

      if (!plugin.$element.attr('data-' + pluginName)) {
        plugin.$element.attr('data-' + pluginName, plugin.uuid);
      }
      if (!plugin.$element.data('zfPlugin')) {
        plugin.$element.data('zfPlugin', plugin);
      }
      /**
       * Fires when the plugin has initialized.
       * @event Plugin#init
       */
      plugin.$element.trigger('init.zf.' + pluginName);

      this._uuids.push(plugin.uuid);

      return;
    },
    /**
     * @function
     * Removes the plugins uuid from the _uuids array.
     * Removes the zfPlugin data attribute, as well as the data-plugin-name attribute.
     * Also fires the destroyed event for the plugin, consolidating repetitive code.
     * @param {Object} plugin - an instance of a plugin, usually `this` in context.
     * @fires Plugin#destroyed
     */
    unregisterPlugin: function unregisterPlugin(plugin) {
      var pluginName = hyphenate(functionName(plugin.$element.data('zfPlugin').constructor));

      this._uuids.splice(this._uuids.indexOf(plugin.uuid), 1);
      plugin.$element.removeAttr('data-' + pluginName).removeData('zfPlugin')
      /**
       * Fires when the plugin has been destroyed.
       * @event Plugin#destroyed
       */
      .trigger('destroyed.zf.' + pluginName);
      for (var prop in plugin) {
        plugin[prop] = null; //clean up script to prep for garbage collection.
      }
      return;
    },

    /**
     * @function
     * Causes one or more active plugins to re-initialize, resetting event listeners, recalculating positions, etc.
     * @param {String} plugins - optional string of an individual plugin key, attained by calling `$(element).data('pluginName')`, or string of a plugin class i.e. `'dropdown'`
     * @default If no argument is passed, reflow all currently active plugins.
     */
    reInit: function reInit(plugins) {
      var isJQ = plugins instanceof $;
      try {
        if (isJQ) {
          plugins.each(function () {
            $(this).data('zfPlugin')._init();
          });
        } else {
          var type = typeof plugins === 'undefined' ? 'undefined' : _typeof(plugins),
              _this = this,
              fns = {
            'object': function object(plgs) {
              plgs.forEach(function (p) {
                p = hyphenate(p);
                $('[data-' + p + ']').foundation('_init');
              });
            },
            'string': function string() {
              plugins = hyphenate(plugins);
              $('[data-' + plugins + ']').foundation('_init');
            },
            'undefined': function undefined() {
              this['object'](Object.keys(_this._plugins));
            }
          };
          fns[type](plugins);
        }
      } catch (err) {} finally {
        return plugins;
      }
    },

    /**
     * returns a random base-36 uid with namespacing
     * @function
     * @param {Number} length - number of random base-36 digits desired. Increase for more random strings.
     * @param {String} namespace - name of plugin to be incorporated in uid, optional.
     * @default {String} '' - if no plugin name is provided, nothing is appended to the uid.
     * @returns {String} - unique id
     */
    GetYoDigits: function GetYoDigits(length, namespace) {
      length = length || 6;
      return Math.round(Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)).toString(36).slice(1) + (namespace ? '-' + namespace : '');
    },
    /**
     * Initialize plugins on any elements within `elem` (and `elem` itself) that aren't already initialized.
     * @param {Object} elem - jQuery object containing the element to check inside. Also checks the element itself, unless it's the `document` object.
     * @param {String|Array} plugins - A list of plugins to initialize. Leave this out to initialize everything.
     */
    reflow: function reflow(elem, plugins) {

      // If plugins is undefined, just grab everything
      if (typeof plugins === 'undefined') {
        plugins = Object.keys(this._plugins);
      }
      // If plugins is a string, convert it to an array with one item
      else if (typeof plugins === 'string') {
          plugins = [plugins];
        }

      var _this = this;

      // Iterate through each plugin
      $.each(plugins, function (i, name) {
        // Get the current plugin
        var plugin = _this._plugins[name];

        // Localize the search to all elements inside elem, as well as elem itself, unless elem === document
        var $elem = $(elem).find('[data-' + name + ']').addBack('[data-' + name + ']');

        // For each plugin found, initialize it
        $elem.each(function () {
          var $el = $(this),
              opts = {};
          // Don't double-dip on plugins
          if ($el.data('zfPlugin')) {
            return;
          }

          if ($el.attr('data-options')) {
            var thing = $el.attr('data-options').split(';').forEach(function (e, i) {
              var opt = e.split(':').map(function (el) {
                return el.trim();
              });
              if (opt[0]) opts[opt[0]] = parseValue(opt[1]);
            });
          }
          try {
            $el.data('zfPlugin', new plugin($(this), opts));
          } catch (er) {} finally {
            return;
          }
        });
      });
    },
    getFnName: functionName,
    transitionend: function transitionend($elem) {
      var transitions = {
        'transition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'otransitionend'
      };
      var elem = document.createElement('div'),
          end;

      for (var t in transitions) {
        if (typeof elem.style[t] !== 'undefined') {
          end = transitions[t];
        }
      }
      if (end) {
        return end;
      } else {
        end = setTimeout(function () {
          $elem.triggerHandler('transitionend', [$elem]);
        }, 1);
        return 'transitionend';
      }
    }
  };

  Foundation.util = {
    /**
     * Function for applying a debounce effect to a function call.
     * @function
     * @param {Function} func - Function to be called at end of timeout.
     * @param {Number} delay - Time in ms to delay the call of `func`.
     * @returns function
     */
    throttle: function throttle(func, delay) {
      var timer = null;

      return function () {
        var context = this,
            args = arguments;

        if (timer === null) {
          timer = setTimeout(function () {
            func.apply(context, args);
            timer = null;
          }, delay);
        }
      };
    }
  };

  // TODO: consider not making this a jQuery function
  // TODO: need way to reflow vs. re-initialize
  /**
   * The Foundation jQuery method.
   * @param {String|Array} method - An action to perform on the current jQuery object.
   */
  var foundation = function foundation(method) {
    var type = typeof method === 'undefined' ? 'undefined' : _typeof(method),
        $meta = $('meta.foundation-mq'),
        $noJS = $('.no-js');

    if (!$meta.length) {
      $('<meta class="foundation-mq">').appendTo(document.head);
    }
    if ($noJS.length) {
      $noJS.removeClass('no-js');
    }

    if (type === 'undefined') {
      //needs to initialize the Foundation object, or an individual plugin.
      Foundation.MediaQuery._init();
      Foundation.reflow(this);
    } else if (type === 'string') {
      //an individual method to invoke on a plugin or group of plugins
      var args = Array.prototype.slice.call(arguments, 1); //collect all the arguments, if necessary
      var plugClass = this.data('zfPlugin'); //determine the class of plugin

      if (plugClass !== undefined && plugClass[method] !== undefined) {
        //make sure both the class and method exist
        if (this.length === 1) {
          //if there's only one, call it directly.
          plugClass[method].apply(plugClass, args);
        } else {
          this.each(function (i, el) {
            //otherwise loop through the jQuery collection and invoke the method on each
            plugClass[method].apply($(el).data('zfPlugin'), args);
          });
        }
      } else {
        //error for no class or no method
        throw new ReferenceError("We're sorry, '" + method + "' is not an available method for " + (plugClass ? functionName(plugClass) : 'this element') + '.');
      }
    } else {
      //error for invalid argument type
      throw new TypeError('We\'re sorry, ' + type + ' is not a valid parameter. You must use a string representing the method you wish to invoke.');
    }
    return this;
  };

  window.Foundation = Foundation;
  $.fn.foundation = foundation;

  // Polyfill for requestAnimationFrame
  (function () {
    if (!Date.now || !window.Date.now) window.Date.now = Date.now = function () {
      return new Date().getTime();
    };

    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
      var vp = vendors[i];
      window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame'];
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
      var lastTime = 0;
      window.requestAnimationFrame = function (callback) {
        var now = Date.now();
        var nextTime = Math.max(lastTime + 16, now);
        return setTimeout(function () {
          callback(lastTime = nextTime);
        }, nextTime - now);
      };
      window.cancelAnimationFrame = clearTimeout;
    }
    /**
     * Polyfill for performance.now, required by rAF
     */
    if (!window.performance || !window.performance.now) {
      window.performance = {
        start: Date.now(),
        now: function now() {
          return Date.now() - this.start;
        }
      };
    }
  })();
  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }

      var aArgs = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          fNOP = function fNOP() {},
          fBound = function fBound() {
        return fToBind.apply(this instanceof fNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
      };

      if (this.prototype) {
        // native functions don't have a prototype
        fNOP.prototype = this.prototype;
      }
      fBound.prototype = new fNOP();

      return fBound;
    };
  }
  // Polyfill to get the name of a function in IE9
  function functionName(fn) {
    if (Function.prototype.name === undefined) {
      var funcNameRegex = /function\s([^(]{1,})\(/;
      var results = funcNameRegex.exec(fn.toString());
      return results && results.length > 1 ? results[1].trim() : "";
    } else if (fn.prototype === undefined) {
      return fn.constructor.name;
    } else {
      return fn.prototype.constructor.name;
    }
  }
  function parseValue(str) {
    if ('true' === str) return true;else if ('false' === str) return false;else if (!isNaN(str * 1)) return parseFloat(str);
    return str;
  }
  // Convert PascalCase to kebab-case
  // Thank you: http://stackoverflow.com/a/8955580
  function hyphenate(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
}(jQuery);

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function ($) {

  /**
   * Reveal module.
   * @module foundation.reveal
   * @requires foundation.util.keyboard
   * @requires foundation.util.box
   * @requires foundation.util.triggers
   * @requires foundation.util.mediaQuery
   * @requires foundation.util.motion if using animations
   */

  var Reveal = function () {
    /**
     * Creates a new instance of Reveal.
     * @class
     * @param {jQuery} element - jQuery object to use for the modal.
     * @param {Object} options - optional parameters.
     */
    function Reveal(element, options) {
      _classCallCheck(this, Reveal);

      this.$element = element;
      this.options = $.extend({}, Reveal.defaults, this.$element.data(), options);
      this._init();

      Foundation.registerPlugin(this, 'Reveal');
      Foundation.Keyboard.register('Reveal', {
        'ENTER': 'open',
        'SPACE': 'open',
        'ESCAPE': 'close'
      });
    }

    /**
     * Initializes the modal by adding the overlay and close buttons, (if selected).
     * @private
     */


    _createClass(Reveal, [{
      key: '_init',
      value: function _init() {
        this.id = this.$element.attr('id');
        this.isActive = false;
        this.cached = { mq: Foundation.MediaQuery.current };
        this.isMobile = mobileSniff();

        this.$anchor = $('[data-open="' + this.id + '"]').length ? $('[data-open="' + this.id + '"]') : $('[data-toggle="' + this.id + '"]');
        this.$anchor.attr({
          'aria-controls': this.id,
          'aria-haspopup': true,
          'tabindex': 0
        });

        if (this.options.fullScreen || this.$element.hasClass('full')) {
          this.options.fullScreen = true;
          this.options.overlay = false;
        }
        if (this.options.overlay && !this.$overlay) {
          this.$overlay = this._makeOverlay(this.id);
        }

        this.$element.attr({
          'role': 'dialog',
          'aria-hidden': true,
          'data-yeti-box': this.id,
          'data-resize': this.id
        });

        if (this.$overlay) {
          this.$element.detach().appendTo(this.$overlay);
        } else {
          this.$element.detach().appendTo($(this.options.appendTo));
          this.$element.addClass('without-overlay');
        }
        this._events();
        if (this.options.deepLink && window.location.hash === '#' + this.id) {
          $(window).one('load.zf.reveal', this.open.bind(this));
        }
      }

      /**
       * Creates an overlay div to display behind the modal.
       * @private
       */

    }, {
      key: '_makeOverlay',
      value: function _makeOverlay() {
        return $('<div></div>').addClass('reveal-overlay').appendTo(this.options.appendTo);
      }

      /**
       * Updates position of modal
       * TODO:  Figure out if we actually need to cache these values or if it doesn't matter
       * @private
       */

    }, {
      key: '_updatePosition',
      value: function _updatePosition() {
        var width = this.$element.outerWidth();
        var outerWidth = $(window).width();
        var height = this.$element.outerHeight();
        var outerHeight = $(window).height();
        var left, top;
        if (this.options.hOffset === 'auto') {
          left = parseInt((outerWidth - width) / 2, 10);
        } else {
          left = parseInt(this.options.hOffset, 10);
        }
        if (this.options.vOffset === 'auto') {
          if (height > outerHeight) {
            top = parseInt(Math.min(100, outerHeight / 10), 10);
          } else {
            top = parseInt((outerHeight - height) / 4, 10);
          }
        } else {
          top = parseInt(this.options.vOffset, 10);
        }
        this.$element.css({ top: top + 'px' });
        // only worry about left if we don't have an overlay or we havea  horizontal offset,
        // otherwise we're perfectly in the middle
        if (!this.$overlay || this.options.hOffset !== 'auto') {
          this.$element.css({ left: left + 'px' });
          this.$element.css({ margin: '0px' });
        }
      }

      /**
       * Adds event handlers for the modal.
       * @private
       */

    }, {
      key: '_events',
      value: function _events() {
        var _this2 = this;

        var _this = this;

        this.$element.on({
          'open.zf.trigger': this.open.bind(this),
          'close.zf.trigger': function closeZfTrigger(event, $element) {
            if (event.target === _this.$element[0] || $(event.target).parents('[data-closable]')[0] === $element) {
              // only close reveal when it's explicitly called
              return _this2.close.apply(_this2);
            }
          },
          'toggle.zf.trigger': this.toggle.bind(this),
          'resizeme.zf.trigger': function resizemeZfTrigger() {
            _this._updatePosition();
          }
        });

        if (this.$anchor.length) {
          this.$anchor.on('keydown.zf.reveal', function (e) {
            if (e.which === 13 || e.which === 32) {
              e.stopPropagation();
              e.preventDefault();
              _this.open();
            }
          });
        }

        if (this.options.closeOnClick && this.options.overlay) {
          this.$overlay.off('.zf.reveal').on('click.zf.reveal', function (e) {
            if (e.target === _this.$element[0] || $.contains(_this.$element[0], e.target) || !$.contains(document, e.target)) {
              return;
            }
            _this.close();
          });
        }
        if (this.options.deepLink) {
          $(window).on('popstate.zf.reveal:' + this.id, this._handleState.bind(this));
        }
      }

      /**
       * Handles modal methods on back/forward button clicks or any other event that triggers popstate.
       * @private
       */

    }, {
      key: '_handleState',
      value: function _handleState(e) {
        if (window.location.hash === '#' + this.id && !this.isActive) {
          this.open();
        } else {
          this.close();
        }
      }

      /**
       * Opens the modal controlled by `this.$anchor`, and closes all others by default.
       * @function
       * @fires Reveal#closeme
       * @fires Reveal#open
       */

    }, {
      key: 'open',
      value: function open() {
        var _this3 = this;

        if (this.options.deepLink) {
          var hash = '#' + this.id;

          if (window.history.pushState) {
            window.history.pushState(null, null, hash);
          } else {
            window.location.hash = hash;
          }
        }

        this.isActive = true;

        // Make elements invisible, but remove display: none so we can get size and positioning
        this.$element.css({ 'visibility': 'hidden' }).show().scrollTop(0);
        if (this.options.overlay) {
          this.$overlay.css({ 'visibility': 'hidden' }).show();
        }

        this._updatePosition();

        this.$element.hide().css({ 'visibility': '' });

        if (this.$overlay) {
          this.$overlay.css({ 'visibility': '' }).hide();
          if (this.$element.hasClass('fast')) {
            this.$overlay.addClass('fast');
          } else if (this.$element.hasClass('slow')) {
            this.$overlay.addClass('slow');
          }
        }

        if (!this.options.multipleOpened) {
          /**
           * Fires immediately before the modal opens.
           * Closes any other modals that are currently open
           * @event Reveal#closeme
           */
          this.$element.trigger('closeme.zf.reveal', this.id);
        }

        var _this = this;

        function addRevealOpenClasses() {
          if (_this.isMobile) {
            if (!_this.originalScrollPos) {
              _this.originalScrollPos = window.pageYOffset;
            }
            $('html, body').addClass('is-reveal-open');
          } else {
            $('body').addClass('is-reveal-open');
          }
        }
        // Motion UI method of reveal
        if (this.options.animationIn) {
          var afterAnimation = function afterAnimation() {
            _this.$element.attr({
              'aria-hidden': false,
              'tabindex': -1
            }).focus();
            addRevealOpenClasses();
            Foundation.Keyboard.trapFocus(_this.$element);
          };

          if (this.options.overlay) {
            Foundation.Motion.animateIn(this.$overlay, 'fade-in');
          }
          Foundation.Motion.animateIn(this.$element, this.options.animationIn, function () {
            if (_this3.$element) {
              // protect against object having been removed
              _this3.focusableElements = Foundation.Keyboard.findFocusable(_this3.$element);
              afterAnimation();
            }
          });
        }
        // jQuery method of reveal
        else {
            if (this.options.overlay) {
              this.$overlay.show(0);
            }
            this.$element.show(this.options.showDelay);
          }

        // handle accessibility
        this.$element.attr({
          'aria-hidden': false,
          'tabindex': -1
        }).focus();
        Foundation.Keyboard.trapFocus(this.$element);

        /**
         * Fires when the modal has successfully opened.
         * @event Reveal#open
         */
        this.$element.trigger('open.zf.reveal');

        addRevealOpenClasses();

        setTimeout(function () {
          _this3._extraHandlers();
        }, 0);
      }

      /**
       * Adds extra event handlers for the body and window if necessary.
       * @private
       */

    }, {
      key: '_extraHandlers',
      value: function _extraHandlers() {
        var _this = this;
        if (!this.$element) {
          return;
        } // If we're in the middle of cleanup, don't freak out
        this.focusableElements = Foundation.Keyboard.findFocusable(this.$element);

        if (!this.options.overlay && this.options.closeOnClick && !this.options.fullScreen) {
          $('body').on('click.zf.reveal', function (e) {
            if (e.target === _this.$element[0] || $.contains(_this.$element[0], e.target) || !$.contains(document, e.target)) {
              return;
            }
            _this.close();
          });
        }

        if (this.options.closeOnEsc) {
          $(window).on('keydown.zf.reveal', function (e) {
            Foundation.Keyboard.handleKey(e, 'Reveal', {
              close: function close() {
                if (_this.options.closeOnEsc) {
                  _this.close();
                  _this.$anchor.focus();
                }
              }
            });
          });
        }

        // lock focus within modal while tabbing
        this.$element.on('keydown.zf.reveal', function (e) {
          var $target = $(this);
          // handle keyboard event with keyboard util
          Foundation.Keyboard.handleKey(e, 'Reveal', {
            open: function open() {
              if (_this.$element.find(':focus').is(_this.$element.find('[data-close]'))) {
                setTimeout(function () {
                  // set focus back to anchor if close button has been activated
                  _this.$anchor.focus();
                }, 1);
              } else if ($target.is(_this.focusableElements)) {
                // dont't trigger if acual element has focus (i.e. inputs, links, ...)
                _this.open();
              }
            },
            close: function close() {
              if (_this.options.closeOnEsc) {
                _this.close();
                _this.$anchor.focus();
              }
            },
            handled: function handled(preventDefault) {
              if (preventDefault) {
                e.preventDefault();
              }
            }
          });
        });
      }

      /**
       * Closes the modal.
       * @function
       * @fires Reveal#closed
       */

    }, {
      key: 'close',
      value: function close() {
        if (!this.isActive || !this.$element.is(':visible')) {
          return false;
        }
        var _this = this;

        // Motion UI method of hiding
        if (this.options.animationOut) {
          if (this.options.overlay) {
            Foundation.Motion.animateOut(this.$overlay, 'fade-out', finishUp);
          } else {
            finishUp();
          }

          Foundation.Motion.animateOut(this.$element, this.options.animationOut);
        }
        // jQuery method of hiding
        else {
            if (this.options.overlay) {
              this.$overlay.hide(0, finishUp);
            } else {
              finishUp();
            }

            this.$element.hide(this.options.hideDelay);
          }

        // Conditionals to remove extra event listeners added on open
        if (this.options.closeOnEsc) {
          $(window).off('keydown.zf.reveal');
        }

        if (!this.options.overlay && this.options.closeOnClick) {
          $('body').off('click.zf.reveal');
        }

        this.$element.off('keydown.zf.reveal');

        function finishUp() {
          if (_this.isMobile) {
            $('html, body').removeClass('is-reveal-open');
            if (_this.originalScrollPos) {
              $('body').scrollTop(_this.originalScrollPos);
              _this.originalScrollPos = null;
            }
          } else {
            $('body').removeClass('is-reveal-open');
          }

          Foundation.Keyboard.releaseFocus(_this.$element);

          _this.$element.attr('aria-hidden', true);

          /**
          * Fires when the modal is done closing.
          * @event Reveal#closed
          */
          _this.$element.trigger('closed.zf.reveal');
        }

        /**
        * Resets the modal content
        * This prevents a running video to keep going in the background
        */
        if (this.options.resetOnClose) {
          this.$element.html(this.$element.html());
        }

        this.isActive = false;
        if (_this.options.deepLink) {
          if (window.history.replaceState) {
            window.history.replaceState('', document.title, window.location.href.replace('#' + this.id, ''));
          } else {
            window.location.hash = '';
          }
        }
      }

      /**
       * Toggles the open/closed state of a modal.
       * @function
       */

    }, {
      key: 'toggle',
      value: function toggle() {
        if (this.isActive) {
          this.close();
        } else {
          this.open();
        }
      }
    }, {
      key: 'destroy',


      /**
       * Destroys an instance of a modal.
       * @function
       */
      value: function destroy() {
        if (this.options.overlay) {
          this.$element.appendTo($(this.options.appendTo)); // move $element outside of $overlay to prevent error unregisterPlugin()
          this.$overlay.hide().off().remove();
        }
        this.$element.hide().off();
        this.$anchor.off('.zf');
        $(window).off('.zf.reveal:' + this.id);

        Foundation.unregisterPlugin(this);
      }
    }]);

    return Reveal;
  }();

  Reveal.defaults = {
    /**
     * Motion-UI class to use for animated elements. If none used, defaults to simple show/hide.
     * @option
     * @example 'slide-in-left'
     */
    animationIn: '',
    /**
     * Motion-UI class to use for animated elements. If none used, defaults to simple show/hide.
     * @option
     * @example 'slide-out-right'
     */
    animationOut: '',
    /**
     * Time, in ms, to delay the opening of a modal after a click if no animation used.
     * @option
     * @example 10
     */
    showDelay: 0,
    /**
     * Time, in ms, to delay the closing of a modal after a click if no animation used.
     * @option
     * @example 10
     */
    hideDelay: 0,
    /**
     * Allows a click on the body/overlay to close the modal.
     * @option
     * @example true
     */
    closeOnClick: true,
    /**
     * Allows the modal to close if the user presses the `ESCAPE` key.
     * @option
     * @example true
     */
    closeOnEsc: true,
    /**
     * If true, allows multiple modals to be displayed at once.
     * @option
     * @example false
     */
    multipleOpened: false,
    /**
     * Distance, in pixels, the modal should push down from the top of the screen.
     * @option
     * @example auto
     */
    vOffset: 'auto',
    /**
     * Distance, in pixels, the modal should push in from the side of the screen.
     * @option
     * @example auto
     */
    hOffset: 'auto',
    /**
     * Allows the modal to be fullscreen, completely blocking out the rest of the view. JS checks for this as well.
     * @option
     * @example false
     */
    fullScreen: false,
    /**
     * Percentage of screen height the modal should push up from the bottom of the view.
     * @option
     * @example 10
     */
    btmOffsetPct: 10,
    /**
     * Allows the modal to generate an overlay div, which will cover the view when modal opens.
     * @option
     * @example true
     */
    overlay: true,
    /**
     * Allows the modal to remove and reinject markup on close. Should be true if using video elements w/o using provider's api, otherwise, videos will continue to play in the background.
     * @option
     * @example false
     */
    resetOnClose: false,
    /**
     * Allows the modal to alter the url on open/close, and allows the use of the `back` button to close modals. ALSO, allows a modal to auto-maniacally open on page load IF the hash === the modal's user-set id.
     * @option
     * @example false
     */
    deepLink: false,
    /**
    * Allows the modal to append to custom div.
    * @option
    * @example false
    */
    appendTo: "body"

  };

  // Window exports
  Foundation.plugin(Reveal, 'Reveal');

  function iPhoneSniff() {
    return (/iP(ad|hone|od).*OS/.test(window.navigator.userAgent)
    );
  }

  function androidSniff() {
    return (/Android/.test(window.navigator.userAgent)
    );
  }

  function mobileSniff() {
    return iPhoneSniff() || androidSniff();
  }
}(jQuery);

},{}],4:[function(require,module,exports){
'use strict';

!function ($) {

  Foundation.Box = {
    ImNotTouchingYou: ImNotTouchingYou,
    GetDimensions: GetDimensions,
    GetOffsets: GetOffsets
  };

  /**
   * Compares the dimensions of an element to a container and determines collision events with container.
   * @function
   * @param {jQuery} element - jQuery object to test for collisions.
   * @param {jQuery} parent - jQuery object to use as bounding container.
   * @param {Boolean} lrOnly - set to true to check left and right values only.
   * @param {Boolean} tbOnly - set to true to check top and bottom values only.
   * @default if no parent object passed, detects collisions with `window`.
   * @returns {Boolean} - true if collision free, false if a collision in any direction.
   */
  function ImNotTouchingYou(element, parent, lrOnly, tbOnly) {
    var eleDims = GetDimensions(element),
        top,
        bottom,
        left,
        right;

    if (parent) {
      var parDims = GetDimensions(parent);

      bottom = eleDims.offset.top + eleDims.height <= parDims.height + parDims.offset.top;
      top = eleDims.offset.top >= parDims.offset.top;
      left = eleDims.offset.left >= parDims.offset.left;
      right = eleDims.offset.left + eleDims.width <= parDims.width + parDims.offset.left;
    } else {
      bottom = eleDims.offset.top + eleDims.height <= eleDims.windowDims.height + eleDims.windowDims.offset.top;
      top = eleDims.offset.top >= eleDims.windowDims.offset.top;
      left = eleDims.offset.left >= eleDims.windowDims.offset.left;
      right = eleDims.offset.left + eleDims.width <= eleDims.windowDims.width;
    }

    var allDirs = [bottom, top, left, right];

    if (lrOnly) {
      return left === right === true;
    }

    if (tbOnly) {
      return top === bottom === true;
    }

    return allDirs.indexOf(false) === -1;
  };

  /**
   * Uses native methods to return an object of dimension values.
   * @function
   * @param {jQuery || HTML} element - jQuery object or DOM element for which to get the dimensions. Can be any element other that document or window.
   * @returns {Object} - nested object of integer pixel values
   * TODO - if element is window, return only those values.
   */
  function GetDimensions(elem, test) {
    elem = elem.length ? elem[0] : elem;

    if (elem === window || elem === document) {
      throw new Error("I'm sorry, Dave. I'm afraid I can't do that.");
    }

    var rect = elem.getBoundingClientRect(),
        parRect = elem.parentNode.getBoundingClientRect(),
        winRect = document.body.getBoundingClientRect(),
        winY = window.pageYOffset,
        winX = window.pageXOffset;

    return {
      width: rect.width,
      height: rect.height,
      offset: {
        top: rect.top + winY,
        left: rect.left + winX
      },
      parentDims: {
        width: parRect.width,
        height: parRect.height,
        offset: {
          top: parRect.top + winY,
          left: parRect.left + winX
        }
      },
      windowDims: {
        width: winRect.width,
        height: winRect.height,
        offset: {
          top: winY,
          left: winX
        }
      }
    };
  }

  /**
   * Returns an object of top and left integer pixel values for dynamically rendered elements,
   * such as: Tooltip, Reveal, and Dropdown
   * @function
   * @param {jQuery} element - jQuery object for the element being positioned.
   * @param {jQuery} anchor - jQuery object for the element's anchor point.
   * @param {String} position - a string relating to the desired position of the element, relative to it's anchor
   * @param {Number} vOffset - integer pixel value of desired vertical separation between anchor and element.
   * @param {Number} hOffset - integer pixel value of desired horizontal separation between anchor and element.
   * @param {Boolean} isOverflow - if a collision event is detected, sets to true to default the element to full width - any desired offset.
   * TODO alter/rewrite to work with `em` values as well/instead of pixels
   */
  function GetOffsets(element, anchor, position, vOffset, hOffset, isOverflow) {
    var $eleDims = GetDimensions(element),
        $anchorDims = anchor ? GetDimensions(anchor) : null;

    switch (position) {
      case 'top':
        return {
          left: Foundation.rtl() ? $anchorDims.offset.left - $eleDims.width + $anchorDims.width : $anchorDims.offset.left,
          top: $anchorDims.offset.top - ($eleDims.height + vOffset)
        };
        break;
      case 'left':
        return {
          left: $anchorDims.offset.left - ($eleDims.width + hOffset),
          top: $anchorDims.offset.top
        };
        break;
      case 'right':
        return {
          left: $anchorDims.offset.left + $anchorDims.width + hOffset,
          top: $anchorDims.offset.top
        };
        break;
      case 'center top':
        return {
          left: $anchorDims.offset.left + $anchorDims.width / 2 - $eleDims.width / 2,
          top: $anchorDims.offset.top - ($eleDims.height + vOffset)
        };
        break;
      case 'center bottom':
        return {
          left: isOverflow ? hOffset : $anchorDims.offset.left + $anchorDims.width / 2 - $eleDims.width / 2,
          top: $anchorDims.offset.top + $anchorDims.height + vOffset
        };
        break;
      case 'center left':
        return {
          left: $anchorDims.offset.left - ($eleDims.width + hOffset),
          top: $anchorDims.offset.top + $anchorDims.height / 2 - $eleDims.height / 2
        };
        break;
      case 'center right':
        return {
          left: $anchorDims.offset.left + $anchorDims.width + hOffset + 1,
          top: $anchorDims.offset.top + $anchorDims.height / 2 - $eleDims.height / 2
        };
        break;
      case 'center':
        return {
          left: $eleDims.windowDims.offset.left + $eleDims.windowDims.width / 2 - $eleDims.width / 2,
          top: $eleDims.windowDims.offset.top + $eleDims.windowDims.height / 2 - $eleDims.height / 2
        };
        break;
      case 'reveal':
        return {
          left: ($eleDims.windowDims.width - $eleDims.width) / 2,
          top: $eleDims.windowDims.offset.top + vOffset
        };
      case 'reveal full':
        return {
          left: $eleDims.windowDims.offset.left,
          top: $eleDims.windowDims.offset.top
        };
        break;
      case 'left bottom':
        return {
          left: $anchorDims.offset.left,
          top: $anchorDims.offset.top + $anchorDims.height + vOffset
        };
        break;
      case 'right bottom':
        return {
          left: $anchorDims.offset.left + $anchorDims.width + hOffset - $eleDims.width,
          top: $anchorDims.offset.top + $anchorDims.height + vOffset
        };
        break;
      default:
        return {
          left: Foundation.rtl() ? $anchorDims.offset.left - $eleDims.width + $anchorDims.width : $anchorDims.offset.left + hOffset,
          top: $anchorDims.offset.top + $anchorDims.height + vOffset
        };
    }
  }
}(jQuery);

},{}],5:[function(require,module,exports){
/*******************************************
 *                                         *
 * This util was created by Marius Olbertz *
 * Please thank Marius on GitHub /owlbertz *
 * or the web http://www.mariusolbertz.de/ *
 *                                         *
 ******************************************/

'use strict';

!function ($) {

  var keyCodes = {
    9: 'TAB',
    13: 'ENTER',
    27: 'ESCAPE',
    32: 'SPACE',
    37: 'ARROW_LEFT',
    38: 'ARROW_UP',
    39: 'ARROW_RIGHT',
    40: 'ARROW_DOWN'
  };

  var commands = {};

  var Keyboard = {
    keys: getKeyCodes(keyCodes),

    /**
     * Parses the (keyboard) event and returns a String that represents its key
     * Can be used like Foundation.parseKey(event) === Foundation.keys.SPACE
     * @param {Event} event - the event generated by the event handler
     * @return String key - String that represents the key pressed
     */
    parseKey: function parseKey(event) {
      var key = keyCodes[event.which || event.keyCode] || String.fromCharCode(event.which).toUpperCase();

      // Remove un-printable characters, e.g. for `fromCharCode` calls for CTRL only events
      key = key.replace(/\W+/, '');

      if (event.shiftKey) key = 'SHIFT_' + key;
      if (event.ctrlKey) key = 'CTRL_' + key;
      if (event.altKey) key = 'ALT_' + key;

      // Remove trailing underscore, in case only modifiers were used (e.g. only `CTRL_ALT`)
      key = key.replace(/_$/, '');

      return key;
    },


    /**
     * Handles the given (keyboard) event
     * @param {Event} event - the event generated by the event handler
     * @param {String} component - Foundation component's name, e.g. Slider or Reveal
     * @param {Objects} functions - collection of functions that are to be executed
     */
    handleKey: function handleKey(event, component, functions) {
      var commandList = commands[component],
          keyCode = this.parseKey(event),
          cmds,
          command,
          fn;

      if (!commandList) return;

      if (typeof commandList.ltr === 'undefined') {
        // this component does not differentiate between ltr and rtl
        cmds = commandList; // use plain list
      } else {
        // merge ltr and rtl: if document is rtl, rtl overwrites ltr and vice versa
        if (Foundation.rtl()) cmds = $.extend({}, commandList.ltr, commandList.rtl);else cmds = $.extend({}, commandList.rtl, commandList.ltr);
      }
      command = cmds[keyCode];

      fn = functions[command];
      if (fn && typeof fn === 'function') {
        // execute function  if exists
        var returnValue = fn.apply();
        if (functions.handled || typeof functions.handled === 'function') {
          // execute function when event was handled
          functions.handled(returnValue);
        }
      } else {
        if (functions.unhandled || typeof functions.unhandled === 'function') {
          // execute function when event was not handled
          functions.unhandled();
        }
      }
    },


    /**
     * Finds all focusable elements within the given `$element`
     * @param {jQuery} $element - jQuery object to search within
     * @return {jQuery} $focusable - all focusable elements within `$element`
     */
    findFocusable: function findFocusable($element) {
      if (!$element) {
        return false;
      }
      return $element.find('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]').filter(function () {
        if (!$(this).is(':visible') || $(this).attr('tabindex') < 0) {
          return false;
        } //only have visible elements and those that have a tabindex greater or equal 0
        return true;
      });
    },


    /**
     * Returns the component name name
     * @param {Object} component - Foundation component, e.g. Slider or Reveal
     * @return String componentName
     */

    register: function register(componentName, cmds) {
      commands[componentName] = cmds;
    },


    /**
     * Traps the focus in the given element.
     * @param  {jQuery} $element  jQuery object to trap the foucs into.
     */
    trapFocus: function trapFocus($element) {
      var $focusable = Foundation.Keyboard.findFocusable($element),
          $firstFocusable = $focusable.eq(0),
          $lastFocusable = $focusable.eq(-1);

      $element.on('keydown.zf.trapfocus', function (event) {
        if (event.target === $lastFocusable[0] && Foundation.Keyboard.parseKey(event) === 'TAB') {
          event.preventDefault();
          $firstFocusable.focus();
        } else if (event.target === $firstFocusable[0] && Foundation.Keyboard.parseKey(event) === 'SHIFT_TAB') {
          event.preventDefault();
          $lastFocusable.focus();
        }
      });
    },

    /**
     * Releases the trapped focus from the given element.
     * @param  {jQuery} $element  jQuery object to release the focus for.
     */
    releaseFocus: function releaseFocus($element) {
      $element.off('keydown.zf.trapfocus');
    }
  };

  /*
   * Constants for easier comparing.
   * Can be used like Foundation.parseKey(event) === Foundation.keys.SPACE
   */
  function getKeyCodes(kcs) {
    var k = {};
    for (var kc in kcs) {
      k[kcs[kc]] = kcs[kc];
    }return k;
  }

  Foundation.Keyboard = Keyboard;
}(jQuery);

},{}],6:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function ($) {

  // Default set of media queries
  var defaultQueries = {
    'default': 'only screen',
    landscape: 'only screen and (orientation: landscape)',
    portrait: 'only screen and (orientation: portrait)',
    retina: 'only screen and (-webkit-min-device-pixel-ratio: 2),' + 'only screen and (min--moz-device-pixel-ratio: 2),' + 'only screen and (-o-min-device-pixel-ratio: 2/1),' + 'only screen and (min-device-pixel-ratio: 2),' + 'only screen and (min-resolution: 192dpi),' + 'only screen and (min-resolution: 2dppx)'
  };

  var MediaQuery = {
    queries: [],

    current: '',

    /**
     * Initializes the media query helper, by extracting the breakpoint list from the CSS and activating the breakpoint watcher.
     * @function
     * @private
     */
    _init: function _init() {
      var self = this;
      var extractedStyles = $('.foundation-mq').css('font-family');
      var namedQueries;

      namedQueries = parseStyleToObject(extractedStyles);

      for (var key in namedQueries) {
        if (namedQueries.hasOwnProperty(key)) {
          self.queries.push({
            name: key,
            value: 'only screen and (min-width: ' + namedQueries[key] + ')'
          });
        }
      }

      this.current = this._getCurrentSize();

      this._watcher();
    },


    /**
     * Checks if the screen is at least as wide as a breakpoint.
     * @function
     * @param {String} size - Name of the breakpoint to check.
     * @returns {Boolean} `true` if the breakpoint matches, `false` if it's smaller.
     */
    atLeast: function atLeast(size) {
      var query = this.get(size);

      if (query) {
        return window.matchMedia(query).matches;
      }

      return false;
    },


    /**
     * Checks if the screen matches to a breakpoint.
     * @function
     * @param {String} size - Name of the breakpoint to check, either 'small only' or 'small'. Omitting 'only' falls back to using atLeast() method.
     * @returns {Boolean} `true` if the breakpoint matches, `false` if it does not.
     */
    is: function is(size) {
      size = size.trim().split(' ');
      if (size.length > 1 && size[1] === 'only') {
        if (size[0] === this._getCurrentSize()) return true;
      } else {
        return this.atLeast(size[0]);
      }
      return false;
    },


    /**
     * Gets the media query of a breakpoint.
     * @function
     * @param {String} size - Name of the breakpoint to get.
     * @returns {String|null} - The media query of the breakpoint, or `null` if the breakpoint doesn't exist.
     */
    get: function get(size) {
      for (var i in this.queries) {
        if (this.queries.hasOwnProperty(i)) {
          var query = this.queries[i];
          if (size === query.name) return query.value;
        }
      }

      return null;
    },


    /**
     * Gets the current breakpoint name by testing every breakpoint and returning the last one to match (the biggest one).
     * @function
     * @private
     * @returns {String} Name of the current breakpoint.
     */
    _getCurrentSize: function _getCurrentSize() {
      var matched;

      for (var i = 0; i < this.queries.length; i++) {
        var query = this.queries[i];

        if (window.matchMedia(query.value).matches) {
          matched = query;
        }
      }

      if ((typeof matched === 'undefined' ? 'undefined' : _typeof(matched)) === 'object') {
        return matched.name;
      } else {
        return matched;
      }
    },


    /**
     * Activates the breakpoint watcher, which fires an event on the window whenever the breakpoint changes.
     * @function
     * @private
     */
    _watcher: function _watcher() {
      var _this = this;

      $(window).on('resize.zf.mediaquery', function () {
        var newSize = _this._getCurrentSize(),
            currentSize = _this.current;

        if (newSize !== currentSize) {
          // Change the current media query
          _this.current = newSize;

          // Broadcast the media query change on the window
          $(window).trigger('changed.zf.mediaquery', [newSize, currentSize]);
        }
      });
    }
  };

  Foundation.MediaQuery = MediaQuery;

  // matchMedia() polyfill - Test a CSS media type/query in JS.
  // Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license
  window.matchMedia || (window.matchMedia = function () {
    'use strict';

    // For browsers that support matchMedium api such as IE 9 and webkit

    var styleMedia = window.styleMedia || window.media;

    // For those that don't support matchMedium
    if (!styleMedia) {
      var style = document.createElement('style'),
          script = document.getElementsByTagName('script')[0],
          info = null;

      style.type = 'text/css';
      style.id = 'matchmediajs-test';

      script && script.parentNode && script.parentNode.insertBefore(style, script);

      // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
      info = 'getComputedStyle' in window && window.getComputedStyle(style, null) || style.currentStyle;

      styleMedia = {
        matchMedium: function matchMedium(media) {
          var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

          // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
          if (style.styleSheet) {
            style.styleSheet.cssText = text;
          } else {
            style.textContent = text;
          }

          // Test if media query is true or false
          return info.width === '1px';
        }
      };
    }

    return function (media) {
      return {
        matches: styleMedia.matchMedium(media || 'all'),
        media: media || 'all'
      };
    };
  }());

  // Thank you: https://github.com/sindresorhus/query-string
  function parseStyleToObject(str) {
    var styleObject = {};

    if (typeof str !== 'string') {
      return styleObject;
    }

    str = str.trim().slice(1, -1); // browsers re-quote string style values

    if (!str) {
      return styleObject;
    }

    styleObject = str.split('&').reduce(function (ret, param) {
      var parts = param.replace(/\+/g, ' ').split('=');
      var key = parts[0];
      var val = parts[1];
      key = decodeURIComponent(key);

      // missing `=` should be `null`:
      // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
      val = val === undefined ? null : decodeURIComponent(val);

      if (!ret.hasOwnProperty(key)) {
        ret[key] = val;
      } else if (Array.isArray(ret[key])) {
        ret[key].push(val);
      } else {
        ret[key] = [ret[key], val];
      }
      return ret;
    }, {});

    return styleObject;
  }

  Foundation.MediaQuery = MediaQuery;
}(jQuery);

},{}],7:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function ($) {

  var MutationObserver = function () {
    var prefixes = ['WebKit', 'Moz', 'O', 'Ms', ''];
    for (var i = 0; i < prefixes.length; i++) {
      if (prefixes[i] + 'MutationObserver' in window) {
        return window[prefixes[i] + 'MutationObserver'];
      }
    }
    return false;
  }();

  var triggers = function triggers(el, type) {
    el.data(type).split(' ').forEach(function (id) {
      $('#' + id)[type === 'close' ? 'trigger' : 'triggerHandler'](type + '.zf.trigger', [el]);
    });
  };
  // Elements with [data-open] will reveal a plugin that supports it when clicked.
  $(document).on('click.zf.trigger', '[data-open]', function () {
    triggers($(this), 'open');
  });

  // Elements with [data-close] will close a plugin that supports it when clicked.
  // If used without a value on [data-close], the event will bubble, allowing it to close a parent component.
  $(document).on('click.zf.trigger', '[data-close]', function () {
    var id = $(this).data('close');
    if (id) {
      triggers($(this), 'close');
    } else {
      $(this).trigger('close.zf.trigger');
    }
  });

  // Elements with [data-toggle] will toggle a plugin that supports it when clicked.
  $(document).on('click.zf.trigger', '[data-toggle]', function () {
    var id = $(this).data('toggle');
    if (id) {
      triggers($(this), 'toggle');
    } else {
      $(this).trigger('toggle.zf.trigger');
    }
  });

  // Elements with [data-closable] will respond to close.zf.trigger events.
  $(document).on('close.zf.trigger', '[data-closable]', function (e) {
    e.stopPropagation();
    var animation = $(this).data('closable');

    if (animation !== '') {
      Foundation.Motion.animateOut($(this), animation, function () {
        $(this).trigger('closed.zf');
      });
    } else {
      $(this).fadeOut().trigger('closed.zf');
    }
  });

  $(document).on('focus.zf.trigger blur.zf.trigger', '[data-toggle-focus]', function () {
    var id = $(this).data('toggle-focus');
    $('#' + id).triggerHandler('toggle.zf.trigger', [$(this)]);
  });

  /**
  * Fires once after all other scripts have loaded
  * @function
  * @private
  */
  $(window).on('load', function () {
    checkListeners();
  });

  function checkListeners() {
    eventsListener();
    resizeListener();
    scrollListener();
    mutateListener();
    closemeListener();
  }

  //******** only fires this function once on load, if there's something to watch ********
  function closemeListener(pluginName) {
    var yetiBoxes = $('[data-yeti-box]'),
        plugNames = ['dropdown', 'tooltip', 'reveal'];

    if (pluginName) {
      if (typeof pluginName === 'string') {
        plugNames.push(pluginName);
      } else if ((typeof pluginName === 'undefined' ? 'undefined' : _typeof(pluginName)) === 'object' && typeof pluginName[0] === 'string') {
        plugNames.concat(pluginName);
      } else {}
    }
    if (yetiBoxes.length) {
      var listeners = plugNames.map(function (name) {
        return 'closeme.zf.' + name;
      }).join(' ');

      $(window).off(listeners).on(listeners, function (e, pluginId) {
        var plugin = e.namespace.split('.')[0];
        var plugins = $('[data-' + plugin + ']').not('[data-yeti-box="' + pluginId + '"]');

        plugins.each(function () {
          var _this = $(this);

          _this.triggerHandler('close.zf.trigger', [_this]);
        });
      });
    }
  }

  function resizeListener(debounce) {
    var timer = void 0,
        $nodes = $('[data-resize]');
    if ($nodes.length) {
      $(window).off('resize.zf.trigger').on('resize.zf.trigger', function (e) {
        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(function () {

          if (!MutationObserver) {
            //fallback for IE 9
            $nodes.each(function () {
              $(this).triggerHandler('resizeme.zf.trigger');
            });
          }
          //trigger all listening elements and signal a resize event
          $nodes.attr('data-events', "resize");
        }, debounce || 10); //default time to emit resize event
      });
    }
  }

  function scrollListener(debounce) {
    var timer = void 0,
        $nodes = $('[data-scroll]');
    if ($nodes.length) {
      $(window).off('scroll.zf.trigger').on('scroll.zf.trigger', function (e) {
        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(function () {

          if (!MutationObserver) {
            //fallback for IE 9
            $nodes.each(function () {
              $(this).triggerHandler('scrollme.zf.trigger');
            });
          }
          //trigger all listening elements and signal a scroll event
          $nodes.attr('data-events', "scroll");
        }, debounce || 10); //default time to emit scroll event
      });
    }
  }

  function mutateListener(debounce) {
    var $nodes = $('[data-mutate]');
    if ($nodes.length && MutationObserver) {
      //trigger all listening elements and signal a mutate event
      //no IE 9 or 10
      $nodes.each(function () {
        $(this).triggerHandler('mutateme.zf.trigger');
      });
    }
  }

  function eventsListener() {
    if (!MutationObserver) {
      return false;
    }
    var nodes = document.querySelectorAll('[data-resize], [data-scroll], [data-mutate]');

    //element callback
    var listeningElementsMutation = function listeningElementsMutation(mutationRecordsList) {
      var $target = $(mutationRecordsList[0].target);

      //trigger the event handler for the element depending on type
      switch (mutationRecordsList[0].type) {

        case "attributes":
          if ($target.attr("data-events") === "scroll" && mutationRecordsList[0].attributeName === "data-events") {
            $target.triggerHandler('scrollme.zf.trigger', [$target, window.pageYOffset]);
          }
          if ($target.attr("data-events") === "resize" && mutationRecordsList[0].attributeName === "data-events") {
            $target.triggerHandler('resizeme.zf.trigger', [$target]);
          }
          if (mutationRecordsList[0].attributeName === "style") {
            $target.closest("[data-mutate]").attr("data-events", "mutate");
            $target.closest("[data-mutate]").triggerHandler('mutateme.zf.trigger', [$target.closest("[data-mutate]")]);
          }
          break;

        case "childList":
          $target.closest("[data-mutate]").attr("data-events", "mutate");
          $target.closest("[data-mutate]").triggerHandler('mutateme.zf.trigger', [$target.closest("[data-mutate]")]);
          break;

        default:
          return false;
        //nothing
      }
    };

    if (nodes.length) {
      //for each element that needs to listen for resizing, scrolling, or mutation add a single observer
      for (var i = 0; i <= nodes.length - 1; i++) {
        var elementObserver = new MutationObserver(listeningElementsMutation);
        elementObserver.observe(nodes[i], { attributes: true, childList: true, characterData: false, subtree: true, attributeFilter: ["data-events", "style"] });
      }
    }
  }

  // ------------------------------------

  // [PH]
  // Foundation.CheckWatchers = checkWatchers;
  Foundation.IHearYou = checkListeners;
  // Foundation.ISeeYou = scrollListener;
  // Foundation.IFeelYou = closemeListener;
}(jQuery);

// function domMutationObserver(debounce) {
//   // !!! This is coming soon and needs more work; not active  !!! //
//   var timer,
//   nodes = document.querySelectorAll('[data-mutate]');
//   //
//   if (nodes.length) {
//     // var MutationObserver = (function () {
//     //   var prefixes = ['WebKit', 'Moz', 'O', 'Ms', ''];
//     //   for (var i=0; i < prefixes.length; i++) {
//     //     if (prefixes[i] + 'MutationObserver' in window) {
//     //       return window[prefixes[i] + 'MutationObserver'];
//     //     }
//     //   }
//     //   return false;
//     // }());
//
//
//     //for the body, we need to listen for all changes effecting the style and class attributes
//     var bodyObserver = new MutationObserver(bodyMutation);
//     bodyObserver.observe(document.body, { attributes: true, childList: true, characterData: false, subtree:true, attributeFilter:["style", "class"]});
//
//
//     //body callback
//     function bodyMutation(mutate) {
//       //trigger all listening elements and signal a mutation event
//       if (timer) { clearTimeout(timer); }
//
//       timer = setTimeout(function() {
//         bodyObserver.disconnect();
//         $('[data-mutate]').attr('data-events',"mutate");
//       }, debounce || 150);
//     }
//   }
// }

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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
          setTimeout(function () {
            $active = $this.find('li a.active');
            if ($active.length != 0) {
              $indicator.velocity({ "left": calcLeftPos($active) }, { duration: 400, queue: false, easing: 'easeOutQuad' });
              $indicator.velocity({ "right": calcRightPos($active) }, { duration: 400, queue: false, easing: 'easeOutQuad', delay: 90 });
            }
          }, 100);
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

},{}],12:[function(require,module,exports){
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

                if (Velocity.debug >= 2) {}

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
                                if (Velocity.debug) {}
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

                        if (Velocity.debug >= 2) {}
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
                        } else {}

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

                        if (Velocity.debug) {}

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

                                    if (Velocity.debug) {}
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
                                if (Velocity.debug) {}
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
                                    if (Velocity.debug) {}
                                    pattern = undefined;
                                }
                                if (pattern) {
                                    if (aStart.length) {
                                        if (Velocity.debug) {}
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

                                if (Velocity.debug >= 1) {}
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

                            if (Velocity.debug) {}
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

},{}],13:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.6.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
/* global window, document, define, jQuery, setInterval, clearInterval */
(function (factory) {
    factory(jQuery);
})(function ($) {
    'use strict';

    var Slick = window.Slick || {};

    Slick = function () {

        var instanceUid = 0;

        function Slick(element, settings) {

            var _ = this,
                dataSettings;

            _.defaults = {
                accessibility: true,
                adaptiveHeight: false,
                appendArrows: $(element),
                appendDots: $(element),
                arrows: true,
                asNavFor: null,
                prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
                nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
                autoplay: false,
                autoplaySpeed: 3000,
                centerMode: false,
                centerPadding: '50px',
                cssEase: 'ease',
                customPaging: function customPaging(slider, i) {
                    return $('<button type="button" data-role="none" role="button" tabindex="0" />').text(i + 1);
                },
                dots: false,
                dotsClass: 'slick-dots',
                draggable: true,
                easing: 'linear',
                edgeFriction: 0.35,
                fade: false,
                focusOnSelect: false,
                infinite: true,
                initialSlide: 0,
                lazyLoad: 'ondemand',
                mobileFirst: false,
                pauseOnHover: true,
                pauseOnFocus: true,
                pauseOnDotsHover: false,
                respondTo: 'window',
                responsive: null,
                rows: 1,
                rtl: false,
                slide: '',
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: true,
                swipeToSlide: false,
                touchMove: true,
                touchThreshold: 5,
                useCSS: true,
                useTransform: true,
                variableWidth: false,
                vertical: false,
                verticalSwiping: false,
                waitForAnimate: true,
                zIndex: 1000
            };

            _.initials = {
                animating: false,
                dragging: false,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: false,
                slideOffset: 0,
                swipeLeft: null,
                $list: null,
                touchObject: {},
                transformsEnabled: false,
                unslicked: false
            };

            $.extend(_, _.initials);

            _.activeBreakpoint = null;
            _.animType = null;
            _.animProp = null;
            _.breakpoints = [];
            _.breakpointSettings = [];
            _.cssTransitions = false;
            _.focussed = false;
            _.interrupted = false;
            _.hidden = 'hidden';
            _.paused = true;
            _.positionProp = null;
            _.respondTo = null;
            _.rowCount = 1;
            _.shouldClick = true;
            _.$slider = $(element);
            _.$slidesCache = null;
            _.transformType = null;
            _.transitionType = null;
            _.visibilityChange = 'visibilitychange';
            _.windowWidth = 0;
            _.windowTimer = null;

            dataSettings = $(element).data('slick') || {};

            _.options = $.extend({}, _.defaults, settings, dataSettings);

            _.currentSlide = _.options.initialSlide;

            _.originalSettings = _.options;

            if (typeof document.mozHidden !== 'undefined') {
                _.hidden = 'mozHidden';
                _.visibilityChange = 'mozvisibilitychange';
            } else if (typeof document.webkitHidden !== 'undefined') {
                _.hidden = 'webkitHidden';
                _.visibilityChange = 'webkitvisibilitychange';
            }

            _.autoPlay = $.proxy(_.autoPlay, _);
            _.autoPlayClear = $.proxy(_.autoPlayClear, _);
            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
            _.changeSlide = $.proxy(_.changeSlide, _);
            _.clickHandler = $.proxy(_.clickHandler, _);
            _.selectHandler = $.proxy(_.selectHandler, _);
            _.setPosition = $.proxy(_.setPosition, _);
            _.swipeHandler = $.proxy(_.swipeHandler, _);
            _.dragHandler = $.proxy(_.dragHandler, _);
            _.keyHandler = $.proxy(_.keyHandler, _);

            _.instanceUid = instanceUid++;

            // A simple way to check for HTML strings
            // Strict HTML recognition (must start with <)
            // Extracted from jQuery v1.11 source
            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;

            _.registerBreakpoints();
            _.init(true);
        }

        return Slick;
    }();

    Slick.prototype.activateADA = function () {
        var _ = this;

        _.$slideTrack.find('.slick-active').attr({
            'aria-hidden': 'false'
        }).find('a, input, button, select').attr({
            'tabindex': '0'
        });
    };

    Slick.prototype.addSlide = Slick.prototype.slickAdd = function (markup, index, addBefore) {

        var _ = this;

        if (typeof index === 'boolean') {
            addBefore = index;
            index = null;
        } else if (index < 0 || index >= _.slideCount) {
            return false;
        }

        _.unload();

        if (typeof index === 'number') {
            if (index === 0 && _.$slides.length === 0) {
                $(markup).appendTo(_.$slideTrack);
            } else if (addBefore) {
                $(markup).insertBefore(_.$slides.eq(index));
            } else {
                $(markup).insertAfter(_.$slides.eq(index));
            }
        } else {
            if (addBefore === true) {
                $(markup).prependTo(_.$slideTrack);
            } else {
                $(markup).appendTo(_.$slideTrack);
            }
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slides.each(function (index, element) {
            $(element).attr('data-slick-index', index);
        });

        _.$slidesCache = _.$slides;

        _.reinit();
    };

    Slick.prototype.animateHeight = function () {
        var _ = this;
        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.animate({
                height: targetHeight
            }, _.options.speed);
        }
    };

    Slick.prototype.animateSlide = function (targetLeft, callback) {

        var animProps = {},
            _ = this;

        _.animateHeight();

        if (_.options.rtl === true && _.options.vertical === false) {
            targetLeft = -targetLeft;
        }
        if (_.transformsEnabled === false) {
            if (_.options.vertical === false) {
                _.$slideTrack.animate({
                    left: targetLeft
                }, _.options.speed, _.options.easing, callback);
            } else {
                _.$slideTrack.animate({
                    top: targetLeft
                }, _.options.speed, _.options.easing, callback);
            }
        } else {

            if (_.cssTransitions === false) {
                if (_.options.rtl === true) {
                    _.currentLeft = -_.currentLeft;
                }
                $({
                    animStart: _.currentLeft
                }).animate({
                    animStart: targetLeft
                }, {
                    duration: _.options.speed,
                    easing: _.options.easing,
                    step: function step(now) {
                        now = Math.ceil(now);
                        if (_.options.vertical === false) {
                            animProps[_.animType] = 'translate(' + now + 'px, 0px)';
                            _.$slideTrack.css(animProps);
                        } else {
                            animProps[_.animType] = 'translate(0px,' + now + 'px)';
                            _.$slideTrack.css(animProps);
                        }
                    },
                    complete: function complete() {
                        if (callback) {
                            callback.call();
                        }
                    }
                });
            } else {

                _.applyTransition();
                targetLeft = Math.ceil(targetLeft);

                if (_.options.vertical === false) {
                    animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
                } else {
                    animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
                }
                _.$slideTrack.css(animProps);

                if (callback) {
                    setTimeout(function () {

                        _.disableTransition();

                        callback.call();
                    }, _.options.speed);
                }
            }
        }
    };

    Slick.prototype.getNavTarget = function () {

        var _ = this,
            asNavFor = _.options.asNavFor;

        if (asNavFor && asNavFor !== null) {
            asNavFor = $(asNavFor).not(_.$slider);
        }

        return asNavFor;
    };

    Slick.prototype.asNavFor = function (index) {

        var _ = this,
            asNavFor = _.getNavTarget();

        if (asNavFor !== null && (typeof asNavFor === 'undefined' ? 'undefined' : _typeof(asNavFor)) === 'object') {
            asNavFor.each(function () {
                var target = $(this).slick('getSlick');
                if (!target.unslicked) {
                    target.slideHandler(index, true);
                }
            });
        }
    };

    Slick.prototype.applyTransition = function (slide) {

        var _ = this,
            transition = {};

        if (_.options.fade === false) {
            transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
        } else {
            transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
        }

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }
    };

    Slick.prototype.autoPlay = function () {

        var _ = this;

        _.autoPlayClear();

        if (_.slideCount > _.options.slidesToShow) {
            _.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoplaySpeed);
        }
    };

    Slick.prototype.autoPlayClear = function () {

        var _ = this;

        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }
    };

    Slick.prototype.autoPlayIterator = function () {

        var _ = this,
            slideTo = _.currentSlide + _.options.slidesToScroll;

        if (!_.paused && !_.interrupted && !_.focussed) {

            if (_.options.infinite === false) {

                if (_.direction === 1 && _.currentSlide + 1 === _.slideCount - 1) {
                    _.direction = 0;
                } else if (_.direction === 0) {

                    slideTo = _.currentSlide - _.options.slidesToScroll;

                    if (_.currentSlide - 1 === 0) {
                        _.direction = 1;
                    }
                }
            }

            _.slideHandler(slideTo);
        }
    };

    Slick.prototype.buildArrows = function () {

        var _ = this;

        if (_.options.arrows === true) {

            _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
            _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

            if (_.slideCount > _.options.slidesToShow) {

                _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
                _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

                if (_.htmlExpr.test(_.options.prevArrow)) {
                    _.$prevArrow.prependTo(_.options.appendArrows);
                }

                if (_.htmlExpr.test(_.options.nextArrow)) {
                    _.$nextArrow.appendTo(_.options.appendArrows);
                }

                if (_.options.infinite !== true) {
                    _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                }
            } else {

                _.$prevArrow.add(_.$nextArrow).addClass('slick-hidden').attr({
                    'aria-disabled': 'true',
                    'tabindex': '-1'
                });
            }
        }
    };

    Slick.prototype.buildDots = function () {

        var _ = this,
            i,
            dot;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$slider.addClass('slick-dotted');

            dot = $('<ul />').addClass(_.options.dotsClass);

            for (i = 0; i <= _.getDotCount(); i += 1) {
                dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
            }

            _.$dots = dot.appendTo(_.options.appendDots);

            _.$dots.find('li').first().addClass('slick-active').attr('aria-hidden', 'false');
        }
    };

    Slick.prototype.buildOut = function () {

        var _ = this;

        _.$slides = _.$slider.children(_.options.slide + ':not(.slick-cloned)').addClass('slick-slide');

        _.slideCount = _.$slides.length;

        _.$slides.each(function (index, element) {
            $(element).attr('data-slick-index', index).data('originalStyling', $(element).attr('style') || '');
        });

        _.$slider.addClass('slick-slider');

        _.$slideTrack = _.slideCount === 0 ? $('<div class="slick-track"/>').appendTo(_.$slider) : _.$slides.wrapAll('<div class="slick-track"/>').parent();

        _.$list = _.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent();
        _.$slideTrack.css('opacity', 0);

        if (_.options.centerMode === true || _.options.swipeToSlide === true) {
            _.options.slidesToScroll = 1;
        }

        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

        _.setupInfinite();

        _.buildArrows();

        _.buildDots();

        _.updateDots();

        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        if (_.options.draggable === true) {
            _.$list.addClass('draggable');
        }
    };

    Slick.prototype.buildRows = function () {

        var _ = this,
            a,
            b,
            c,
            newSlides,
            numOfSlides,
            originalSlides,
            slidesPerSection;

        newSlides = document.createDocumentFragment();
        originalSlides = _.$slider.children();

        if (_.options.rows > 1) {

            slidesPerSection = _.options.slidesPerRow * _.options.rows;
            numOfSlides = Math.ceil(originalSlides.length / slidesPerSection);

            for (a = 0; a < numOfSlides; a++) {
                var slide = document.createElement('div');
                for (b = 0; b < _.options.rows; b++) {
                    var row = document.createElement('div');
                    for (c = 0; c < _.options.slidesPerRow; c++) {
                        var target = a * slidesPerSection + (b * _.options.slidesPerRow + c);
                        if (originalSlides.get(target)) {
                            row.appendChild(originalSlides.get(target));
                        }
                    }
                    slide.appendChild(row);
                }
                newSlides.appendChild(slide);
            }

            _.$slider.empty().append(newSlides);
            _.$slider.children().children().children().css({
                'width': 100 / _.options.slidesPerRow + '%',
                'display': 'inline-block'
            });
        }
    };

    Slick.prototype.checkResponsive = function (initial, forceUpdate) {

        var _ = this,
            breakpoint,
            targetBreakpoint,
            respondToWidth,
            triggerBreakpoint = false;
        var sliderWidth = _.$slider.width();
        var windowWidth = window.innerWidth || $(window).width();

        if (_.respondTo === 'window') {
            respondToWidth = windowWidth;
        } else if (_.respondTo === 'slider') {
            respondToWidth = sliderWidth;
        } else if (_.respondTo === 'min') {
            respondToWidth = Math.min(windowWidth, sliderWidth);
        }

        if (_.options.responsive && _.options.responsive.length && _.options.responsive !== null) {

            targetBreakpoint = null;

            for (breakpoint in _.breakpoints) {
                if (_.breakpoints.hasOwnProperty(breakpoint)) {
                    if (_.originalSettings.mobileFirst === false) {
                        if (respondToWidth < _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    } else {
                        if (respondToWidth > _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    }
                }
            }

            if (targetBreakpoint !== null) {
                if (_.activeBreakpoint !== null) {
                    if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
                        _.activeBreakpoint = targetBreakpoint;
                        if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                            _.unslick(targetBreakpoint);
                        } else {
                            _.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]);
                            if (initial === true) {
                                _.currentSlide = _.options.initialSlide;
                            }
                            _.refresh(initial);
                        }
                        triggerBreakpoint = targetBreakpoint;
                    }
                } else {
                    _.activeBreakpoint = targetBreakpoint;
                    if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                        _.unslick(targetBreakpoint);
                    } else {
                        _.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]);
                        if (initial === true) {
                            _.currentSlide = _.options.initialSlide;
                        }
                        _.refresh(initial);
                    }
                    triggerBreakpoint = targetBreakpoint;
                }
            } else {
                if (_.activeBreakpoint !== null) {
                    _.activeBreakpoint = null;
                    _.options = _.originalSettings;
                    if (initial === true) {
                        _.currentSlide = _.options.initialSlide;
                    }
                    _.refresh(initial);
                    triggerBreakpoint = targetBreakpoint;
                }
            }

            // only trigger breakpoints during an actual break. not on initialize.
            if (!initial && triggerBreakpoint !== false) {
                _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
            }
        }
    };

    Slick.prototype.changeSlide = function (event, dontAnimate) {

        var _ = this,
            $target = $(event.currentTarget),
            indexOffset,
            slideOffset,
            unevenOffset;

        // If target is a link, prevent default action.
        if ($target.is('a')) {
            event.preventDefault();
        }

        // If target is not the <li> element (ie: a child), find the <li>.
        if (!$target.is('li')) {
            $target = $target.closest('li');
        }

        unevenOffset = _.slideCount % _.options.slidesToScroll !== 0;
        indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

        switch (event.data.message) {

            case 'previous':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
                }
                break;

            case 'next':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
                }
                break;

            case 'index':
                var index = event.data.index === 0 ? 0 : event.data.index || $target.index() * _.options.slidesToScroll;

                _.slideHandler(_.checkNavigable(index), false, dontAnimate);
                $target.children().trigger('focus');
                break;

            default:
                return;
        }
    };

    Slick.prototype.checkNavigable = function (index) {

        var _ = this,
            navigables,
            prevNavigable;

        navigables = _.getNavigableIndexes();
        prevNavigable = 0;
        if (index > navigables[navigables.length - 1]) {
            index = navigables[navigables.length - 1];
        } else {
            for (var n in navigables) {
                if (index < navigables[n]) {
                    index = prevNavigable;
                    break;
                }
                prevNavigable = navigables[n];
            }
        }

        return index;
    };

    Slick.prototype.cleanUpEvents = function () {

        var _ = this;

        if (_.options.dots && _.$dots !== null) {

            $('li', _.$dots).off('click.slick', _.changeSlide).off('mouseenter.slick', $.proxy(_.interrupt, _, true)).off('mouseleave.slick', $.proxy(_.interrupt, _, false));
        }

        _.$slider.off('focus.slick blur.slick');

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
            _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);
        }

        _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
        _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
        _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
        _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

        _.$list.off('click.slick', _.clickHandler);

        $(document).off(_.visibilityChange, _.visibility);

        _.cleanUpSlideEvents();

        if (_.options.accessibility === true) {
            _.$list.off('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().off('click.slick', _.selectHandler);
        }

        $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);

        $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);

        $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);

        $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(document).off('ready.slick.slick-' + _.instanceUid, _.setPosition);
    };

    Slick.prototype.cleanUpSlideEvents = function () {

        var _ = this;

        _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));
        _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));
    };

    Slick.prototype.cleanUpRows = function () {

        var _ = this,
            originalSlides;

        if (_.options.rows > 1) {
            originalSlides = _.$slides.children().children();
            originalSlides.removeAttr('style');
            _.$slider.empty().append(originalSlides);
        }
    };

    Slick.prototype.clickHandler = function (event) {

        var _ = this;

        if (_.shouldClick === false) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
        }
    };

    Slick.prototype.destroy = function (refresh) {

        var _ = this;

        _.autoPlayClear();

        _.touchObject = {};

        _.cleanUpEvents();

        $('.slick-cloned', _.$slider).detach();

        if (_.$dots) {
            _.$dots.remove();
        }

        if (_.$prevArrow && _.$prevArrow.length) {

            _.$prevArrow.removeClass('slick-disabled slick-arrow slick-hidden').removeAttr('aria-hidden aria-disabled tabindex').css('display', '');

            if (_.htmlExpr.test(_.options.prevArrow)) {
                _.$prevArrow.remove();
            }
        }

        if (_.$nextArrow && _.$nextArrow.length) {

            _.$nextArrow.removeClass('slick-disabled slick-arrow slick-hidden').removeAttr('aria-hidden aria-disabled tabindex').css('display', '');

            if (_.htmlExpr.test(_.options.nextArrow)) {
                _.$nextArrow.remove();
            }
        }

        if (_.$slides) {

            _.$slides.removeClass('slick-slide slick-active slick-center slick-visible slick-current').removeAttr('aria-hidden').removeAttr('data-slick-index').each(function () {
                $(this).attr('style', $(this).data('originalStyling'));
            });

            _.$slideTrack.children(this.options.slide).detach();

            _.$slideTrack.detach();

            _.$list.detach();

            _.$slider.append(_.$slides);
        }

        _.cleanUpRows();

        _.$slider.removeClass('slick-slider');
        _.$slider.removeClass('slick-initialized');
        _.$slider.removeClass('slick-dotted');

        _.unslicked = true;

        if (!refresh) {
            _.$slider.trigger('destroy', [_]);
        }
    };

    Slick.prototype.disableTransition = function (slide) {

        var _ = this,
            transition = {};

        transition[_.transitionType] = '';

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }
    };

    Slick.prototype.fadeSlide = function (slideIndex, callback) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).css({
                zIndex: _.options.zIndex
            });

            _.$slides.eq(slideIndex).animate({
                opacity: 1
            }, _.options.speed, _.options.easing, callback);
        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 1,
                zIndex: _.options.zIndex
            });

            if (callback) {
                setTimeout(function () {

                    _.disableTransition(slideIndex);

                    callback.call();
                }, _.options.speed);
            }
        }
    };

    Slick.prototype.fadeSlideOut = function (slideIndex) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).animate({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            }, _.options.speed, _.options.easing);
        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            });
        }
    };

    Slick.prototype.filterSlides = Slick.prototype.slickFilter = function (filter) {

        var _ = this;

        if (filter !== null) {

            _.$slidesCache = _.$slides;

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

            _.reinit();
        }
    };

    Slick.prototype.focusHandler = function () {

        var _ = this;

        _.$slider.off('focus.slick blur.slick').on('focus.slick blur.slick', '*:not(.slick-arrow)', function (event) {

            event.stopImmediatePropagation();
            var $sf = $(this);

            setTimeout(function () {

                if (_.options.pauseOnFocus) {
                    _.focussed = $sf.is(':focus');
                    _.autoPlay();
                }
            }, 0);
        });
    };

    Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function () {

        var _ = this;
        return _.currentSlide;
    };

    Slick.prototype.getDotCount = function () {

        var _ = this;

        var breakPoint = 0;
        var counter = 0;
        var pagerQty = 0;

        if (_.options.infinite === true) {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToScroll;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        } else if (_.options.centerMode === true) {
            pagerQty = _.slideCount;
        } else if (!_.options.asNavFor) {
            pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
        } else {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToScroll;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        }

        return pagerQty - 1;
    };

    Slick.prototype.getLeft = function (slideIndex) {

        var _ = this,
            targetLeft,
            verticalHeight,
            verticalOffset = 0,
            targetSlide;

        _.slideOffset = 0;
        verticalHeight = _.$slides.first().outerHeight(true);

        if (_.options.infinite === true) {
            if (_.slideCount > _.options.slidesToShow) {
                _.slideOffset = _.slideWidth * _.options.slidesToShow * -1;
                verticalOffset = verticalHeight * _.options.slidesToShow * -1;
            }
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
                    if (slideIndex > _.slideCount) {
                        _.slideOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth * -1;
                        verticalOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight * -1;
                    } else {
                        _.slideOffset = _.slideCount % _.options.slidesToScroll * _.slideWidth * -1;
                        verticalOffset = _.slideCount % _.options.slidesToScroll * verticalHeight * -1;
                    }
                }
            }
        } else {
            if (slideIndex + _.options.slidesToShow > _.slideCount) {
                _.slideOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * _.slideWidth;
                verticalOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * verticalHeight;
            }
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.slideOffset = 0;
            verticalOffset = 0;
        }

        if (_.options.centerMode === true && _.options.infinite === true) {
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
        } else if (_.options.centerMode === true) {
            _.slideOffset = 0;
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
        }

        if (_.options.vertical === false) {
            targetLeft = slideIndex * _.slideWidth * -1 + _.slideOffset;
        } else {
            targetLeft = slideIndex * verticalHeight * -1 + verticalOffset;
        }

        if (_.options.variableWidth === true) {

            if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
            } else {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
            }

            if (_.options.rtl === true) {
                if (targetSlide[0]) {
                    targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                } else {
                    targetLeft = 0;
                }
            } else {
                targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
            }

            if (_.options.centerMode === true) {
                if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
                } else {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
                }

                if (_.options.rtl === true) {
                    if (targetSlide[0]) {
                        targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                    } else {
                        targetLeft = 0;
                    }
                } else {
                    targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
                }

                targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
            }
        }

        return targetLeft;
    };

    Slick.prototype.getOption = Slick.prototype.slickGetOption = function (option) {

        var _ = this;

        return _.options[option];
    };

    Slick.prototype.getNavigableIndexes = function () {

        var _ = this,
            breakPoint = 0,
            counter = 0,
            indexes = [],
            max;

        if (_.options.infinite === false) {
            max = _.slideCount;
        } else {
            breakPoint = _.options.slidesToScroll * -1;
            counter = _.options.slidesToScroll * -1;
            max = _.slideCount * 2;
        }

        while (breakPoint < max) {
            indexes.push(breakPoint);
            breakPoint = counter + _.options.slidesToScroll;
            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        }

        return indexes;
    };

    Slick.prototype.getSlick = function () {

        return this;
    };

    Slick.prototype.getSlideCount = function () {

        var _ = this,
            slidesTraversed,
            swipedSlide,
            centerOffset;

        centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;

        if (_.options.swipeToSlide === true) {
            _.$slideTrack.find('.slick-slide').each(function (index, slide) {
                if (slide.offsetLeft - centerOffset + $(slide).outerWidth() / 2 > _.swipeLeft * -1) {
                    swipedSlide = slide;
                    return false;
                }
            });

            slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;

            return slidesTraversed;
        } else {
            return _.options.slidesToScroll;
        }
    };

    Slick.prototype.goTo = Slick.prototype.slickGoTo = function (slide, dontAnimate) {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'index',
                index: parseInt(slide)
            }
        }, dontAnimate);
    };

    Slick.prototype.init = function (creation) {

        var _ = this;

        if (!$(_.$slider).hasClass('slick-initialized')) {

            $(_.$slider).addClass('slick-initialized');

            _.buildRows();
            _.buildOut();
            _.setProps();
            _.startLoad();
            _.loadSlider();
            _.initializeEvents();
            _.updateArrows();
            _.updateDots();
            _.checkResponsive(true);
            _.focusHandler();
        }

        if (creation) {
            _.$slider.trigger('init', [_]);
        }

        if (_.options.accessibility === true) {
            _.initADA();
        }

        if (_.options.autoplay) {

            _.paused = false;
            _.autoPlay();
        }
    };

    Slick.prototype.initADA = function () {
        var _ = this;
        _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
            'aria-hidden': 'true',
            'tabindex': '-1'
        }).find('a, input, button, select').attr({
            'tabindex': '-1'
        });

        _.$slideTrack.attr('role', 'listbox');

        _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function (i) {
            $(this).attr({
                'role': 'option',
                'aria-describedby': 'slick-slide' + _.instanceUid + i + ''
            });
        });

        if (_.$dots !== null) {
            _.$dots.attr('role', 'tablist').find('li').each(function (i) {
                $(this).attr({
                    'role': 'presentation',
                    'aria-selected': 'false',
                    'aria-controls': 'navigation' + _.instanceUid + i + '',
                    'id': 'slick-slide' + _.instanceUid + i + ''
                });
            }).first().attr('aria-selected', 'true').end().find('button').attr('role', 'button').end().closest('div').attr('role', 'toolbar');
        }
        _.activateADA();
    };

    Slick.prototype.initArrowEvents = function () {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow.off('click.slick').on('click.slick', {
                message: 'previous'
            }, _.changeSlide);
            _.$nextArrow.off('click.slick').on('click.slick', {
                message: 'next'
            }, _.changeSlide);
        }
    };

    Slick.prototype.initDotEvents = function () {

        var _ = this;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            $('li', _.$dots).on('click.slick', {
                message: 'index'
            }, _.changeSlide);
        }

        if (_.options.dots === true && _.options.pauseOnDotsHover === true) {

            $('li', _.$dots).on('mouseenter.slick', $.proxy(_.interrupt, _, true)).on('mouseleave.slick', $.proxy(_.interrupt, _, false));
        }
    };

    Slick.prototype.initSlideEvents = function () {

        var _ = this;

        if (_.options.pauseOnHover) {

            _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));
            _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));
        }
    };

    Slick.prototype.initializeEvents = function () {

        var _ = this;

        _.initArrowEvents();

        _.initDotEvents();
        _.initSlideEvents();

        _.$list.on('touchstart.slick mousedown.slick', {
            action: 'start'
        }, _.swipeHandler);
        _.$list.on('touchmove.slick mousemove.slick', {
            action: 'move'
        }, _.swipeHandler);
        _.$list.on('touchend.slick mouseup.slick', {
            action: 'end'
        }, _.swipeHandler);
        _.$list.on('touchcancel.slick mouseleave.slick', {
            action: 'end'
        }, _.swipeHandler);

        _.$list.on('click.slick', _.clickHandler);

        $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

        if (_.options.accessibility === true) {
            _.$list.on('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));

        $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));

        $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);

        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(document).on('ready.slick.slick-' + _.instanceUid, _.setPosition);
    };

    Slick.prototype.initUI = function () {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.show();
            _.$nextArrow.show();
        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.show();
        }
    };

    Slick.prototype.keyHandler = function (event) {

        var _ = this;
        //Dont slide if the cursor is inside the form fields and arrow keys are pressed
        if (!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
            if (event.keyCode === 37 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'next' : 'previous'
                    }
                });
            } else if (event.keyCode === 39 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'previous' : 'next'
                    }
                });
            }
        }
    };

    Slick.prototype.lazyLoad = function () {

        var _ = this,
            loadRange,
            cloneRange,
            rangeStart,
            rangeEnd;

        function loadImages(imagesScope) {

            $('img[data-lazy]', imagesScope).each(function () {

                var image = $(this),
                    imageSource = $(this).attr('data-lazy'),
                    imageToLoad = document.createElement('img');

                imageToLoad.onload = function () {

                    image.animate({ opacity: 0 }, 100, function () {
                        image.attr('src', imageSource).animate({ opacity: 1 }, 200, function () {
                            image.removeAttr('data-lazy').removeClass('slick-loading');
                        });
                        _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
                    });
                };

                imageToLoad.onerror = function () {

                    image.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error');

                    _.$slider.trigger('lazyLoadError', [_, image, imageSource]);
                };

                imageToLoad.src = imageSource;
            });
        }

        if (_.options.centerMode === true) {
            if (_.options.infinite === true) {
                rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
                rangeEnd = rangeStart + _.options.slidesToShow + 2;
            } else {
                rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
                rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
            }
        } else {
            rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
            rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
            if (_.options.fade === true) {
                if (rangeStart > 0) rangeStart--;
                if (rangeEnd <= _.slideCount) rangeEnd++;
            }
        }

        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);
        loadImages(loadRange);

        if (_.slideCount <= _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-slide');
            loadImages(cloneRange);
        } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
            loadImages(cloneRange);
        } else if (_.currentSlide === 0) {
            cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
            loadImages(cloneRange);
        }
    };

    Slick.prototype.loadSlider = function () {

        var _ = this;

        _.setPosition();

        _.$slideTrack.css({
            opacity: 1
        });

        _.$slider.removeClass('slick-loading');

        _.initUI();

        if (_.options.lazyLoad === 'progressive') {
            _.progressiveLazyLoad();
        }
    };

    Slick.prototype.next = Slick.prototype.slickNext = function () {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'next'
            }
        });
    };

    Slick.prototype.orientationChange = function () {

        var _ = this;

        _.checkResponsive();
        _.setPosition();
    };

    Slick.prototype.pause = Slick.prototype.slickPause = function () {

        var _ = this;

        _.autoPlayClear();
        _.paused = true;
    };

    Slick.prototype.play = Slick.prototype.slickPlay = function () {

        var _ = this;

        _.autoPlay();
        _.options.autoplay = true;
        _.paused = false;
        _.focussed = false;
        _.interrupted = false;
    };

    Slick.prototype.postSlide = function (index) {

        var _ = this;

        if (!_.unslicked) {

            _.$slider.trigger('afterChange', [_, index]);

            _.animating = false;

            _.setPosition();

            _.swipeLeft = null;

            if (_.options.autoplay) {
                _.autoPlay();
            }

            if (_.options.accessibility === true) {
                _.initADA();
            }
        }
    };

    Slick.prototype.prev = Slick.prototype.slickPrev = function () {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'previous'
            }
        });
    };

    Slick.prototype.preventDefault = function (event) {

        event.preventDefault();
    };

    Slick.prototype.progressiveLazyLoad = function (tryCount) {

        tryCount = tryCount || 1;

        var _ = this,
            $imgsToLoad = $('img[data-lazy]', _.$slider),
            image,
            imageSource,
            imageToLoad;

        if ($imgsToLoad.length) {

            image = $imgsToLoad.first();
            imageSource = image.attr('data-lazy');
            imageToLoad = document.createElement('img');

            imageToLoad.onload = function () {

                image.attr('src', imageSource).removeAttr('data-lazy').removeClass('slick-loading');

                if (_.options.adaptiveHeight === true) {
                    _.setPosition();
                }

                _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
                _.progressiveLazyLoad();
            };

            imageToLoad.onerror = function () {

                if (tryCount < 3) {

                    /**
                     * try to load the image 3 times,
                     * leave a slight delay so we don't get
                     * servers blocking the request.
                     */
                    setTimeout(function () {
                        _.progressiveLazyLoad(tryCount + 1);
                    }, 500);
                } else {

                    image.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error');

                    _.$slider.trigger('lazyLoadError', [_, image, imageSource]);

                    _.progressiveLazyLoad();
                }
            };

            imageToLoad.src = imageSource;
        } else {

            _.$slider.trigger('allImagesLoaded', [_]);
        }
    };

    Slick.prototype.refresh = function (initializing) {

        var _ = this,
            currentSlide,
            lastVisibleIndex;

        lastVisibleIndex = _.slideCount - _.options.slidesToShow;

        // in non-infinite sliders, we don't want to go past the
        // last visible index.
        if (!_.options.infinite && _.currentSlide > lastVisibleIndex) {
            _.currentSlide = lastVisibleIndex;
        }

        // if less slides than to show, go to start.
        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;
        }

        currentSlide = _.currentSlide;

        _.destroy(true);

        $.extend(_, _.initials, { currentSlide: currentSlide });

        _.init();

        if (!initializing) {

            _.changeSlide({
                data: {
                    message: 'index',
                    index: currentSlide
                }
            }, false);
        }
    };

    Slick.prototype.registerBreakpoints = function () {

        var _ = this,
            breakpoint,
            currentBreakpoint,
            l,
            responsiveSettings = _.options.responsive || null;

        if ($.type(responsiveSettings) === 'array' && responsiveSettings.length) {

            _.respondTo = _.options.respondTo || 'window';

            for (breakpoint in responsiveSettings) {

                l = _.breakpoints.length - 1;
                currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

                if (responsiveSettings.hasOwnProperty(breakpoint)) {

                    // loop through the breakpoints and cut out any existing
                    // ones with the same breakpoint number, we don't want dupes.
                    while (l >= 0) {
                        if (_.breakpoints[l] && _.breakpoints[l] === currentBreakpoint) {
                            _.breakpoints.splice(l, 1);
                        }
                        l--;
                    }

                    _.breakpoints.push(currentBreakpoint);
                    _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;
                }
            }

            _.breakpoints.sort(function (a, b) {
                return _.options.mobileFirst ? a - b : b - a;
            });
        }
    };

    Slick.prototype.reinit = function () {

        var _ = this;

        _.$slides = _.$slideTrack.children(_.options.slide).addClass('slick-slide');

        _.slideCount = _.$slides.length;

        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
            _.currentSlide = _.currentSlide - _.options.slidesToScroll;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;
        }

        _.registerBreakpoints();

        _.setProps();
        _.setupInfinite();
        _.buildArrows();
        _.updateArrows();
        _.initArrowEvents();
        _.buildDots();
        _.updateDots();
        _.initDotEvents();
        _.cleanUpSlideEvents();
        _.initSlideEvents();

        _.checkResponsive(false, true);

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        _.setPosition();
        _.focusHandler();

        _.paused = !_.options.autoplay;
        _.autoPlay();

        _.$slider.trigger('reInit', [_]);
    };

    Slick.prototype.resize = function () {

        var _ = this;

        if ($(window).width() !== _.windowWidth) {
            clearTimeout(_.windowDelay);
            _.windowDelay = window.setTimeout(function () {
                _.windowWidth = $(window).width();
                _.checkResponsive();
                if (!_.unslicked) {
                    _.setPosition();
                }
            }, 50);
        }
    };

    Slick.prototype.removeSlide = Slick.prototype.slickRemove = function (index, removeBefore, removeAll) {

        var _ = this;

        if (typeof index === 'boolean') {
            removeBefore = index;
            index = removeBefore === true ? 0 : _.slideCount - 1;
        } else {
            index = removeBefore === true ? --index : index;
        }

        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
            return false;
        }

        _.unload();

        if (removeAll === true) {
            _.$slideTrack.children().remove();
        } else {
            _.$slideTrack.children(this.options.slide).eq(index).remove();
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slidesCache = _.$slides;

        _.reinit();
    };

    Slick.prototype.setCSS = function (position) {

        var _ = this,
            positionProps = {},
            x,
            y;

        if (_.options.rtl === true) {
            position = -position;
        }
        x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
        y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';

        positionProps[_.positionProp] = position;

        if (_.transformsEnabled === false) {
            _.$slideTrack.css(positionProps);
        } else {
            positionProps = {};
            if (_.cssTransitions === false) {
                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
                _.$slideTrack.css(positionProps);
            } else {
                positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
                _.$slideTrack.css(positionProps);
            }
        }
    };

    Slick.prototype.setDimensions = function () {

        var _ = this;

        if (_.options.vertical === false) {
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: '0px ' + _.options.centerPadding
                });
            }
        } else {
            _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: _.options.centerPadding + ' 0px'
                });
            }
        }

        _.listWidth = _.$list.width();
        _.listHeight = _.$list.height();

        if (_.options.vertical === false && _.options.variableWidth === false) {
            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
            _.$slideTrack.width(Math.ceil(_.slideWidth * _.$slideTrack.children('.slick-slide').length));
        } else if (_.options.variableWidth === true) {
            _.$slideTrack.width(5000 * _.slideCount);
        } else {
            _.slideWidth = Math.ceil(_.listWidth);
            _.$slideTrack.height(Math.ceil(_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length));
        }

        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
        if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);
    };

    Slick.prototype.setFade = function () {

        var _ = this,
            targetLeft;

        _.$slides.each(function (index, element) {
            targetLeft = _.slideWidth * index * -1;
            if (_.options.rtl === true) {
                $(element).css({
                    position: 'relative',
                    right: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            } else {
                $(element).css({
                    position: 'relative',
                    left: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            }
        });

        _.$slides.eq(_.currentSlide).css({
            zIndex: _.options.zIndex - 1,
            opacity: 1
        });
    };

    Slick.prototype.setHeight = function () {

        var _ = this;

        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.css('height', targetHeight);
        }
    };

    Slick.prototype.setOption = Slick.prototype.slickSetOption = function () {

        /**
         * accepts arguments in format of:
         *
         *  - for changing a single option's value:
         *     .slick("setOption", option, value, refresh )
         *
         *  - for changing a set of responsive options:
         *     .slick("setOption", 'responsive', [{}, ...], refresh )
         *
         *  - for updating multiple values at once (not responsive)
         *     .slick("setOption", { 'option': value, ... }, refresh )
         */

        var _ = this,
            l,
            item,
            option,
            value,
            refresh = false,
            type;

        if ($.type(arguments[0]) === 'object') {

            option = arguments[0];
            refresh = arguments[1];
            type = 'multiple';
        } else if ($.type(arguments[0]) === 'string') {

            option = arguments[0];
            value = arguments[1];
            refresh = arguments[2];

            if (arguments[0] === 'responsive' && $.type(arguments[1]) === 'array') {

                type = 'responsive';
            } else if (typeof arguments[1] !== 'undefined') {

                type = 'single';
            }
        }

        if (type === 'single') {

            _.options[option] = value;
        } else if (type === 'multiple') {

            $.each(option, function (opt, val) {

                _.options[opt] = val;
            });
        } else if (type === 'responsive') {

            for (item in value) {

                if ($.type(_.options.responsive) !== 'array') {

                    _.options.responsive = [value[item]];
                } else {

                    l = _.options.responsive.length - 1;

                    // loop through the responsive object and splice out duplicates.
                    while (l >= 0) {

                        if (_.options.responsive[l].breakpoint === value[item].breakpoint) {

                            _.options.responsive.splice(l, 1);
                        }

                        l--;
                    }

                    _.options.responsive.push(value[item]);
                }
            }
        }

        if (refresh) {

            _.unload();
            _.reinit();
        }
    };

    Slick.prototype.setPosition = function () {

        var _ = this;

        _.setDimensions();

        _.setHeight();

        if (_.options.fade === false) {
            _.setCSS(_.getLeft(_.currentSlide));
        } else {
            _.setFade();
        }

        _.$slider.trigger('setPosition', [_]);
    };

    Slick.prototype.setProps = function () {

        var _ = this,
            bodyStyle = document.body.style;

        _.positionProp = _.options.vertical === true ? 'top' : 'left';

        if (_.positionProp === 'top') {
            _.$slider.addClass('slick-vertical');
        } else {
            _.$slider.removeClass('slick-vertical');
        }

        if (bodyStyle.WebkitTransition !== undefined || bodyStyle.MozTransition !== undefined || bodyStyle.msTransition !== undefined) {
            if (_.options.useCSS === true) {
                _.cssTransitions = true;
            }
        }

        if (_.options.fade) {
            if (typeof _.options.zIndex === 'number') {
                if (_.options.zIndex < 3) {
                    _.options.zIndex = 3;
                }
            } else {
                _.options.zIndex = _.defaults.zIndex;
            }
        }

        if (bodyStyle.OTransform !== undefined) {
            _.animType = 'OTransform';
            _.transformType = '-o-transform';
            _.transitionType = 'OTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.MozTransform !== undefined) {
            _.animType = 'MozTransform';
            _.transformType = '-moz-transform';
            _.transitionType = 'MozTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.webkitTransform !== undefined) {
            _.animType = 'webkitTransform';
            _.transformType = '-webkit-transform';
            _.transitionType = 'webkitTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.msTransform !== undefined) {
            _.animType = 'msTransform';
            _.transformType = '-ms-transform';
            _.transitionType = 'msTransition';
            if (bodyStyle.msTransform === undefined) _.animType = false;
        }
        if (bodyStyle.transform !== undefined && _.animType !== false) {
            _.animType = 'transform';
            _.transformType = 'transform';
            _.transitionType = 'transition';
        }
        _.transformsEnabled = _.options.useTransform && _.animType !== null && _.animType !== false;
    };

    Slick.prototype.setSlideClasses = function (index) {

        var _ = this,
            centerOffset,
            allSlides,
            indexOffset,
            remainder;

        allSlides = _.$slider.find('.slick-slide').removeClass('slick-active slick-center slick-current').attr('aria-hidden', 'true');

        _.$slides.eq(index).addClass('slick-current');

        if (_.options.centerMode === true) {

            centerOffset = Math.floor(_.options.slidesToShow / 2);

            if (_.options.infinite === true) {

                if (index >= centerOffset && index <= _.slideCount - 1 - centerOffset) {

                    _.$slides.slice(index - centerOffset, index + centerOffset + 1).addClass('slick-active').attr('aria-hidden', 'false');
                } else {

                    indexOffset = _.options.slidesToShow + index;
                    allSlides.slice(indexOffset - centerOffset + 1, indexOffset + centerOffset + 2).addClass('slick-active').attr('aria-hidden', 'false');
                }

                if (index === 0) {

                    allSlides.eq(allSlides.length - 1 - _.options.slidesToShow).addClass('slick-center');
                } else if (index === _.slideCount - 1) {

                    allSlides.eq(_.options.slidesToShow).addClass('slick-center');
                }
            }

            _.$slides.eq(index).addClass('slick-center');
        } else {

            if (index >= 0 && index <= _.slideCount - _.options.slidesToShow) {

                _.$slides.slice(index, index + _.options.slidesToShow).addClass('slick-active').attr('aria-hidden', 'false');
            } else if (allSlides.length <= _.options.slidesToShow) {

                allSlides.addClass('slick-active').attr('aria-hidden', 'false');
            } else {

                remainder = _.slideCount % _.options.slidesToShow;
                indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

                if (_.options.slidesToShow == _.options.slidesToScroll && _.slideCount - index < _.options.slidesToShow) {

                    allSlides.slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder).addClass('slick-active').attr('aria-hidden', 'false');
                } else {

                    allSlides.slice(indexOffset, indexOffset + _.options.slidesToShow).addClass('slick-active').attr('aria-hidden', 'false');
                }
            }
        }

        if (_.options.lazyLoad === 'ondemand') {
            _.lazyLoad();
        }
    };

    Slick.prototype.setupInfinite = function () {

        var _ = this,
            i,
            slideIndex,
            infiniteCount;

        if (_.options.fade === true) {
            _.options.centerMode = false;
        }

        if (_.options.infinite === true && _.options.fade === false) {

            slideIndex = null;

            if (_.slideCount > _.options.slidesToShow) {

                if (_.options.centerMode === true) {
                    infiniteCount = _.options.slidesToShow + 1;
                } else {
                    infiniteCount = _.options.slidesToShow;
                }

                for (i = _.slideCount; i > _.slideCount - infiniteCount; i -= 1) {
                    slideIndex = i - 1;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '').attr('data-slick-index', slideIndex - _.slideCount).prependTo(_.$slideTrack).addClass('slick-cloned');
                }
                for (i = 0; i < infiniteCount; i += 1) {
                    slideIndex = i;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '').attr('data-slick-index', slideIndex + _.slideCount).appendTo(_.$slideTrack).addClass('slick-cloned');
                }
                _.$slideTrack.find('.slick-cloned').find('[id]').each(function () {
                    $(this).attr('id', '');
                });
            }
        }
    };

    Slick.prototype.interrupt = function (toggle) {

        var _ = this;

        if (!toggle) {
            _.autoPlay();
        }
        _.interrupted = toggle;
    };

    Slick.prototype.selectHandler = function (event) {

        var _ = this;

        var targetElement = $(event.target).is('.slick-slide') ? $(event.target) : $(event.target).parents('.slick-slide');

        var index = parseInt(targetElement.attr('data-slick-index'));

        if (!index) index = 0;

        if (_.slideCount <= _.options.slidesToShow) {

            _.setSlideClasses(index);
            _.asNavFor(index);
            return;
        }

        _.slideHandler(index);
    };

    Slick.prototype.slideHandler = function (index, sync, dontAnimate) {

        var targetSlide,
            animSlide,
            oldSlide,
            slideLeft,
            targetLeft = null,
            _ = this,
            navTarget;

        sync = sync || false;

        if (_.animating === true && _.options.waitForAnimate === true) {
            return;
        }

        if (_.options.fade === true && _.currentSlide === index) {
            return;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            return;
        }

        if (sync === false) {
            _.asNavFor(index);
        }

        targetSlide = index;
        targetLeft = _.getLeft(targetSlide);
        slideLeft = _.getLeft(_.currentSlide);

        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

        if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true) {
                    _.animateSlide(slideLeft, function () {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > _.slideCount - _.options.slidesToScroll)) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true) {
                    _.animateSlide(slideLeft, function () {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        }

        if (_.options.autoplay) {
            clearInterval(_.autoPlayTimer);
        }

        if (targetSlide < 0) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = _.slideCount - _.slideCount % _.options.slidesToScroll;
            } else {
                animSlide = _.slideCount + targetSlide;
            }
        } else if (targetSlide >= _.slideCount) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = 0;
            } else {
                animSlide = targetSlide - _.slideCount;
            }
        } else {
            animSlide = targetSlide;
        }

        _.animating = true;

        _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

        oldSlide = _.currentSlide;
        _.currentSlide = animSlide;

        _.setSlideClasses(_.currentSlide);

        if (_.options.asNavFor) {

            navTarget = _.getNavTarget();
            navTarget = navTarget.slick('getSlick');

            if (navTarget.slideCount <= navTarget.options.slidesToShow) {
                navTarget.setSlideClasses(_.currentSlide);
            }
        }

        _.updateDots();
        _.updateArrows();

        if (_.options.fade === true) {
            if (dontAnimate !== true) {

                _.fadeSlideOut(oldSlide);

                _.fadeSlide(animSlide, function () {
                    _.postSlide(animSlide);
                });
            } else {
                _.postSlide(animSlide);
            }
            _.animateHeight();
            return;
        }

        if (dontAnimate !== true) {
            _.animateSlide(targetLeft, function () {
                _.postSlide(animSlide);
            });
        } else {
            _.postSlide(animSlide);
        }
    };

    Slick.prototype.startLoad = function () {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.hide();
            _.$nextArrow.hide();
        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.hide();
        }

        _.$slider.addClass('slick-loading');
    };

    Slick.prototype.swipeDirection = function () {

        var xDist,
            yDist,
            r,
            swipeAngle,
            _ = this;

        xDist = _.touchObject.startX - _.touchObject.curX;
        yDist = _.touchObject.startY - _.touchObject.curY;
        r = Math.atan2(yDist, xDist);

        swipeAngle = Math.round(r * 180 / Math.PI);
        if (swipeAngle < 0) {
            swipeAngle = 360 - Math.abs(swipeAngle);
        }

        if (swipeAngle <= 45 && swipeAngle >= 0) {
            return _.options.rtl === false ? 'left' : 'right';
        }
        if (swipeAngle <= 360 && swipeAngle >= 315) {
            return _.options.rtl === false ? 'left' : 'right';
        }
        if (swipeAngle >= 135 && swipeAngle <= 225) {
            return _.options.rtl === false ? 'right' : 'left';
        }
        if (_.options.verticalSwiping === true) {
            if (swipeAngle >= 35 && swipeAngle <= 135) {
                return 'down';
            } else {
                return 'up';
            }
        }

        return 'vertical';
    };

    Slick.prototype.swipeEnd = function (event) {

        var _ = this,
            slideCount,
            direction;

        _.dragging = false;
        _.interrupted = false;
        _.shouldClick = _.touchObject.swipeLength > 10 ? false : true;

        if (_.touchObject.curX === undefined) {
            return false;
        }

        if (_.touchObject.edgeHit === true) {
            _.$slider.trigger('edge', [_, _.swipeDirection()]);
        }

        if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {

            direction = _.swipeDirection();

            switch (direction) {

                case 'left':
                case 'down':

                    slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide + _.getSlideCount()) : _.currentSlide + _.getSlideCount();

                    _.currentDirection = 0;

                    break;

                case 'right':
                case 'up':

                    slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide - _.getSlideCount()) : _.currentSlide - _.getSlideCount();

                    _.currentDirection = 1;

                    break;

                default:

            }

            if (direction != 'vertical') {

                _.slideHandler(slideCount);
                _.touchObject = {};
                _.$slider.trigger('swipe', [_, direction]);
            }
        } else {

            if (_.touchObject.startX !== _.touchObject.curX) {

                _.slideHandler(_.currentSlide);
                _.touchObject = {};
            }
        }
    };

    Slick.prototype.swipeHandler = function (event) {

        var _ = this;

        if (_.options.swipe === false || 'ontouchend' in document && _.options.swipe === false) {
            return;
        } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
            return;
        }

        _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ? event.originalEvent.touches.length : 1;

        _.touchObject.minSwipe = _.listWidth / _.options.touchThreshold;

        if (_.options.verticalSwiping === true) {
            _.touchObject.minSwipe = _.listHeight / _.options.touchThreshold;
        }

        switch (event.data.action) {

            case 'start':
                _.swipeStart(event);
                break;

            case 'move':
                _.swipeMove(event);
                break;

            case 'end':
                _.swipeEnd(event);
                break;

        }
    };

    Slick.prototype.swipeMove = function (event) {

        var _ = this,
            edgeWasHit = false,
            curLeft,
            swipeDirection,
            swipeLength,
            positionOffset,
            touches;

        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

        if (!_.dragging || touches && touches.length !== 1) {
            return false;
        }

        curLeft = _.getLeft(_.currentSlide);

        _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
        _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

        _.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));

        if (_.options.verticalSwiping === true) {
            _.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));
        }

        swipeDirection = _.swipeDirection();

        if (swipeDirection === 'vertical') {
            return;
        }

        if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
            event.preventDefault();
        }

        positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
        if (_.options.verticalSwiping === true) {
            positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
        }

        swipeLength = _.touchObject.swipeLength;

        _.touchObject.edgeHit = false;

        if (_.options.infinite === false) {
            if (_.currentSlide === 0 && swipeDirection === 'right' || _.currentSlide >= _.getDotCount() && swipeDirection === 'left') {
                swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
                _.touchObject.edgeHit = true;
            }
        }

        if (_.options.vertical === false) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        } else {
            _.swipeLeft = curLeft + swipeLength * (_.$list.height() / _.listWidth) * positionOffset;
        }
        if (_.options.verticalSwiping === true) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        }

        if (_.options.fade === true || _.options.touchMove === false) {
            return false;
        }

        if (_.animating === true) {
            _.swipeLeft = null;
            return false;
        }

        _.setCSS(_.swipeLeft);
    };

    Slick.prototype.swipeStart = function (event) {

        var _ = this,
            touches;

        _.interrupted = true;

        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
            _.touchObject = {};
            return false;
        }

        if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
            touches = event.originalEvent.touches[0];
        }

        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

        _.dragging = true;
    };

    Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function () {

        var _ = this;

        if (_.$slidesCache !== null) {

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.appendTo(_.$slideTrack);

            _.reinit();
        }
    };

    Slick.prototype.unload = function () {

        var _ = this;

        $('.slick-cloned', _.$slider).remove();

        if (_.$dots) {
            _.$dots.remove();
        }

        if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
            _.$prevArrow.remove();
        }

        if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
            _.$nextArrow.remove();
        }

        _.$slides.removeClass('slick-slide slick-active slick-visible slick-current').attr('aria-hidden', 'true').css('width', '');
    };

    Slick.prototype.unslick = function (fromBreakpoint) {

        var _ = this;
        _.$slider.trigger('unslick', [_, fromBreakpoint]);
        _.destroy();
    };

    Slick.prototype.updateArrows = function () {

        var _ = this,
            centerOffset;

        centerOffset = Math.floor(_.options.slidesToShow / 2);

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow && !_.options.infinite) {

            _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            if (_.currentSlide === 0) {

                _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            }
        }
    };

    Slick.prototype.updateDots = function () {

        var _ = this;

        if (_.$dots !== null) {

            _.$dots.find('li').removeClass('slick-active').attr('aria-hidden', 'true');

            _.$dots.find('li').eq(Math.floor(_.currentSlide / _.options.slidesToScroll)).addClass('slick-active').attr('aria-hidden', 'false');
        }
    };

    Slick.prototype.visibility = function () {

        var _ = this;

        if (_.options.autoplay) {

            if (document[_.hidden]) {

                _.interrupted = true;
            } else {

                _.interrupted = false;
            }
        }
    };

    $.fn.slick = function () {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if ((typeof opt === 'undefined' ? 'undefined' : _typeof(opt)) == 'object' || typeof opt == 'undefined') _[i].slick = new Slick(_[i], opt);else ret = _[i].slick[opt].apply(_[i].slick, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };
});

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    init: function init() {
        this.formSubmit();
    },
    formSubmit: function formSubmit() {

        var actions = {
            "1": 'http://shop.predestination.ru//order/confirm/fe-op-stupen-1-offline/?t=46428#form',
            "2": 'http://shop.predestination.ru/order/confirm/fe-op-stupen-1-offline_LOKOMOTIV/?t=20911#form',
            "3": 'http://shop.predestination.ru/order/confirm/fe-op-stupen-1-offline_LOKOMOTIV_21days/?t=66780#form',
            "4": 'http://shop.predestination.ru/order/confirm/fe-op-stupen-1-offline_LOKOMOTIV_21days_1year/?t=34323#form'
        };

        $('form').each(function () {
            var that = $(this);
            $(this).attr('action', actions[3]);

            $(this).find('select').on('change', function () {
                that.attr('action', actions[$(this).val()]);
            });
        });
    }
};

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('../libs/materialize/global');

require('../libs/materialize/velocity');

require('../libs/materialize/jquery.easing.1.3');

require('../libs/materialize/scrollspy');

require('../libs/materialize/tabs');

// import '../libs/materialize/waves';

exports.default = {
    init: function init() {
        this.headerFunctions();
    },
    headerFunctions: function headerFunctions() {
        $('.scrollspy').scrollSpy({
            scrollOffset: 0
        });

        $('.menu-button').on('click', function () {
            $(this).find('.sandwich').toggleClass('active');
            $('.site-nav').toggleClass('active');
        });

        $('.site-nav').on('click', function () {
            $('.sandwich').removeClass('active');
            $(this).removeClass('active');
        });

        if ($('.first-section').length != 0) {
            var ws = $(window).scrollTop(),
                st = $('.site-header').offset().top;

            if (ws >= st) {
                $('.site-header_inner').addClass('fixed');
            } else {
                $('.site-header_inner').removeClass('fixed');
            }
        } else {
            $('.site-header_inner').addClass('fixed');
        }

        $('.has-anchor').on('click', function (e) {
            e.preventDefault();
            var anchor = $(this).attr('href');

            $('body, html').animate({
                'scrollTop': $(anchor).offset().top - $('.site-header_inner').height() * 3
            }, 500);
        });

        $('.coach-item').each(function () {
            $(this).find('.show-more').on('click', function (e) {
                $(this).toggleClass('active');
                $(e.target).parent().parent().find('.hidden-content').slideToggle();
            });
        });
    }
};

},{"../libs/materialize/global":8,"../libs/materialize/jquery.easing.1.3":9,"../libs/materialize/scrollspy":10,"../libs/materialize/tabs":11,"../libs/materialize/velocity":12}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

require('../libs/foundation/foundation.core.js');

require('../libs/foundation/foundation.reveal.js');

require('../libs/foundation/foundation.util.keyboard.js');

require('../libs/foundation/foundation.util.box.js');

require('../libs/foundation/foundation.util.triggers.js');

require('../libs/foundation/foundation.util.mediaQuery.js');

exports.default = {
	init: function init() {
		this.reveal();
	},
	reveal: function reveal() {
		$(document).foundation();

		var reveals = $('.reveal');

		reveals.on('open.zf.reveal', function (e) {
			$(this).addClass('fadeInBottom');
			if ($(this).find('iframe').length != 0) {
				var src = $(this).find('iframe').attr('data-src');
				$(this).find('iframe')[0].src = src + "&autoplay=1";
			}
			if ($(this).find('.lazy-images').length != 0) {
				$(this).find('img').each(function () {
					$(this).attr('src', $(this).attr('data-src'));
				});
			}
		}).on('closed.zf.reveal', function (e) {
			$(this).removeClass('fadeInBottom');
			if ($(this).find('iframe').length != 0) {
				$(this).find('iframe').attr('src', '');
			}
		});
	}
};

},{"../libs/foundation/foundation.core.js":2,"../libs/foundation/foundation.reveal.js":3,"../libs/foundation/foundation.util.box.js":4,"../libs/foundation/foundation.util.keyboard.js":5,"../libs/foundation/foundation.util.mediaQuery.js":6,"../libs/foundation/foundation.util.triggers.js":7}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../libs/slick');

exports.default = {
  init: function init() {
    this.sliders();
  },
  sliders: function sliders() {
    $('.slider').each(function () {
      if ($(this).hasClass('double-slider')) {
        $(this).slick({
          slidesToShow: 2,
          slidesToScroll: 2,
          lazyLoad: 'ondemand',
          prevArrow: $(this).parent('.slider-wrapper').find('.prev-btn'),
          nextArrow: $(this).parent('.slider-wrapper').find('.next-btn'),
          responsive: [{
            breakpoint: 767,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 2
            }
          }]
        });
      } else if ($(this).hasClass('testimonials-slider')) {
        $(this).slick({
          lazyLoad: 'ondemand',
          prevArrow: $(this).parent('.slider-wrapper').find('.prev-btn'),
          nextArrow: $(this).parent('.slider-wrapper').find('.next-btn'),
          slidesToShow: 1
        });
      } else {
        $(this).slick({
          prevArrow: $(this).parent('.slider-wrapper').find('.prev-btn'),
          nextArrow: $(this).parent('.slider-wrapper').find('.next-btn'),
          slidesToShow: 1
        });
      }
    });

    $('.top-slider').find('.slide-description').each(function () {
      var that = $(this);
      $(this).find('.show-more').on('click', function (e) {
        e.preventDefault();
        $(this).toggleClass('active');
        that.find('.hidden-description').slideToggle();
      });
    });
  }
};

},{"../libs/slick":13}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    init: function init() {
        this.tabSwitcher();
        this.tabsToSelect();
    },
    tabSwitcher: function tabSwitcher() {
        var activeTab = $('.tab-links a.active').attr('href');

        if ($(activeTab).length) {
            $('.tab-content').find('' + activeTab).addClass('active');
        }

        $('.tab-links a').on('click', function (e) {
            e.preventDefault();
            var anchor = $(this).attr('href');

            $(this).parent().find('a').removeClass('active');
            $(this).addClass('active');

            if ($(anchor).length) {
                $('.tab-content').find('.tab-item').removeClass('active');
                $(anchor).addClass('active');
            }
        });
    },
    tabsToSelect: function tabsToSelect() {
        function transform() {
            if ($(window).width() <= 767) {
                $('.tabs-wrapper').each(function () {
                    if ($(this).find('.tab-selector').length == 0) {
                        var that = $(this);
                        var tabsWrap = $('<div></div>').addClass('tab-selector');
                        var activeTab = $('<span></span>').addClass('active-tab');
                        $(this).find('.tab-links').wrapAll(tabsWrap);
                        $(this).find('.tab-selector').append(activeTab);
                        activeTab.html($(this).find('.tab-links > a.active').html());

                        $('.tab-selector').on('click', function (e) {
                            if ($(window).width() <= 767) {
                                e.stopPropagation();
                                that.find('.tab-links').slideToggle();
                            }
                        });

                        $('.tab-selector a').on('click', function (e) {
                            if ($(window).width() <= 767) {
                                e.stopPropagation();
                                that.find('.tab-links').slideUp(100);
                                activeTab.html($(this).html());
                            }
                        });

                        $(document).on('click', function () {
                            if ($(window).width() <= 767) {
                                that.find('.tab-links').slideUp(100);
                            }
                        });
                    }
                });
            }
        }

        transform();

        $(window).on('resize', transform);
    }
};

},{}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('../libs/foundation/foundation.core.js');

exports.default = {
    init: function init() {
        this.loadTestimonials();
    },
    loadTestimonials: function loadTestimonials() {

        var url = $('.testimonials-wrapper').attr('data-content');

        function objToArray(data) {
            var array = $.map(data, function (value, index) {
                return [value];
            });
            return array;
        }

        function loadItems(start, stop, data) {
            for (var i = start; i < stop && i < data.length; i++) {
                var item;
                if (data[i][0].src != '') {
                    item = '<div class="testimonial-item">\n                                <div class="testimonial-image"><img src="' + data[i][0].image + '" alt="pic"></div>\n                                <div class="testimonial-content">\n                                    <div class="title"><h3>' + data[i][0].title + '</h3><span>' + data[i][0].subtitle + '</span></div>\n                                    <div class="description"><p>' + data[i][0].text + '</p></div>\n                                    <a href="javascript:void(0)" data-open="testimonial-popup' + i + '" class="popup-video-btn popup-link"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><defs><style>.cls-1 {fill: #ef2146;fill-rule: evenodd;}</style></defs><path id="ic-play" class="cls-1" d="M668,16204a14,14,0,1,1-14,14A14.021,14.021,0,0,1,668,16204Zm0,2a12,12,0,1,1-12,12A12.018,12.018,0,0,1,668,16206Zm4.994,12.5-7.983,5.5v-11Z" transform="translate(-654 -16204)"/></svg><span>\u0421\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0432\u0438\u0434\u0435\u043E \u043E\u0442\u0437\u044B\u0432</span></a>\n                                </div>\n                                <div id="testimonial-popup' + i + '" data-reveal class="reveal">\n                                    <button data-close type="button" class="close-button icon-cancel"></button>\n                                    <div class="reveal-wrapper">\n                                        <div class="video-wrapper"><iframe data-src=\'' + data[i][0].src + '\' src="" width="640" height="360" frameborder="0" allowfullscreen></iframe></div>\n                                    </div>\n                                </div>\n                            </div>';
                } else {
                    item = '<div class="testimonial-item">\n                                <div class="testimonial-image"><img src="' + data[i][0].image + '" alt="pic"></div>\n                                <div class="testimonial-content">\n                                    <div class="title"><h3>' + data[i][0].title + '</h3><span>' + data[i][0].subtitle + '</span></div>\n                                    <div class="description"><p>' + data[i][0].text + '</p></div>\n                                </div>\n                            </div>';
                }
                var $items = $(item);
                var $grid = $('.testimonials-wrapper');
                $grid.append($items);
            }
        }

        function revealsInit() {
            $('.testimonials-wrapper').foundation();

            var reveals = $('.reveal');

            reveals.on('open.zf.reveal', function (e) {
                $(this).addClass('fadeInBottom');
                if ($(this).find('iframe').length != 0) {
                    var src = $(this).find('iframe').attr('data-src');
                    $(this).find('iframe')[0].src = src + "&autoplay=1";
                }
            }).on('closed.zf.reveal', function (e) {
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
            success: function success(data) {
                loadItems(0, 4, objToArray(data));
            },
            error: function error() {}
        }).done(function (data) {
            revealsInit();

            if ($('.testimonials-wrapper').find('.testimonial-item').length == objToArray(data).length) {
                $('.add-more').css({ 'display': 'none' });
            }
        });

        $('.add-more').on('click', function (e) {
            e.preventDefault();
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'json',
                success: function success(data) {
                    var currentItemLength = $('.testimonials-wrapper').find('.testimonial-item').length;
                    objToArray(data);
                    if (currentItemLength < objToArray(data).length) {
                        loadItems(currentItemLength, currentItemLength + 4, objToArray(data));
                    }
                },
                error: function error() {}
            }).done(function (data) {
                revealsInit();

                if ($('.testimonials-wrapper').find('.testimonial-item').length == objToArray(data).length) {
                    $('.add-more').css({ 'display': 'none' });
                }
            });
        });
    }
};

},{"../libs/foundation/foundation.core.js":2}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _headerFunctions = require("../modules/headerFunctions");

var _headerFunctions2 = _interopRequireDefault(_headerFunctions);

var _reveal = require("../modules/reveal");

var _reveal2 = _interopRequireDefault(_reveal);

var _tabSwitcher = require("../modules/tabSwitcher");

var _tabSwitcher2 = _interopRequireDefault(_tabSwitcher);

var _sliders = require("../modules/sliders");

var _sliders2 = _interopRequireDefault(_sliders);

var _testimonials = require("../modules/testimonials");

var _testimonials2 = _interopRequireDefault(_testimonials);

var _formSubmit = require("../modules/formSubmit");

var _formSubmit2 = _interopRequireDefault(_formSubmit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    init: function init() {
        _headerFunctions2.default.init();
        _reveal2.default.init();
        _tabSwitcher2.default.init();
        _sliders2.default.init();
        _testimonials2.default.init();
        _formSubmit2.default.init();
    }
};

},{"../modules/formSubmit":14,"../modules/headerFunctions":15,"../modules/reveal":16,"../modules/sliders":17,"../modules/tabSwitcher":18,"../modules/testimonials":19}],21:[function(require,module,exports){
(function (global){
"use strict";

require("core-js/shim");

require("regenerator-runtime/runtime");

require("core-js/fn/regexp/escape");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"core-js/fn/regexp/escape":22,"core-js/shim":315,"regenerator-runtime/runtime":317}],22:[function(require,module,exports){
'use strict';

require('../../modules/core.regexp.escape');
module.exports = require('../../modules/_core').RegExp.escape;

},{"../../modules/_core":43,"../../modules/core.regexp.escape":139}],23:[function(require,module,exports){
'use strict';

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],24:[function(require,module,exports){
'use strict';

var cof = require('./_cof');
module.exports = function (it, msg) {
  if (typeof it != 'number' && cof(it) != 'Number') throw TypeError(msg);
  return +it;
};

},{"./_cof":38}],25:[function(require,module,exports){
'use strict';

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables'),
    ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

},{"./_hide":60,"./_wks":137}],26:[function(require,module,exports){
'use strict';

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || forbiddenField !== undefined && forbiddenField in it) {
    throw TypeError(name + ': incorrect invocation!');
  }return it;
};

},{}],27:[function(require,module,exports){
'use strict';

var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":69}],28:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';

var toObject = require('./_to-object'),
    toIndex = require('./_to-index'),
    toLength = require('./_to-length');

module.exports = [].copyWithin || function copyWithin(target /*= 0*/, start /*= 0, end = @length*/) {
  var O = toObject(this),
      len = toLength(O.length),
      to = toIndex(target, len),
      from = toIndex(start, len),
      end = arguments.length > 2 ? arguments[2] : undefined,
      count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to),
      inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];else delete O[to];
    to += inc;
    from += inc;
  }return O;
};

},{"./_to-index":125,"./_to-length":128,"./_to-object":129}],29:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';

var toObject = require('./_to-object'),
    toIndex = require('./_to-index'),
    toLength = require('./_to-length');
module.exports = function fill(value /*, start = 0, end = @length */) {
  var O = toObject(this),
      length = toLength(O.length),
      aLen = arguments.length,
      index = toIndex(aLen > 1 ? arguments[1] : undefined, length),
      end = aLen > 2 ? arguments[2] : undefined,
      endPos = end === undefined ? length : toIndex(end, length);
  while (endPos > index) {
    O[index++] = value;
  }return O;
};

},{"./_to-index":125,"./_to-length":128,"./_to-object":129}],30:[function(require,module,exports){
'use strict';

var forOf = require('./_for-of');

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":57}],31:[function(require,module,exports){
'use strict';

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject'),
    toLength = require('./_to-length'),
    toIndex = require('./_to-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this),
        length = toLength(O.length),
        index = toIndex(fromIndex, length),
        value;
    // Array#includes uses SameValueZero equality algorithm
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      if (value != value) return true;
      // Array#toIndex ignores holes, Array#includes - not
    } else for (; length > index; index++) {
      if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      }
    }return !IS_INCLUDES && -1;
  };
};

},{"./_to-index":125,"./_to-iobject":127,"./_to-length":128}],32:[function(require,module,exports){
'use strict';

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = require('./_ctx'),
    IObject = require('./_iobject'),
    toObject = require('./_to-object'),
    toLength = require('./_to-length'),
    asc = require('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1,
      IS_FILTER = TYPE == 2,
      IS_SOME = TYPE == 3,
      IS_EVERY = TYPE == 4,
      IS_FIND_INDEX = TYPE == 6,
      NO_HOLES = TYPE == 5 || IS_FIND_INDEX,
      create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this),
        self = IObject(O),
        f = ctx(callbackfn, that, 3),
        length = toLength(self.length),
        index = 0,
        result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined,
        val,
        res;
    for (; length > index; index++) {
      if (NO_HOLES || index in self) {
        val = self[index];
        res = f(val, index, O);
        if (TYPE) {
          if (IS_MAP) result[index] = res; // map
          else if (res) switch (TYPE) {
              case 3:
                return true; // some
              case 5:
                return val; // find
              case 6:
                return index; // findIndex
              case 2:
                result.push(val); // filter
            } else if (IS_EVERY) return false; // every
        }
      }
    }return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

},{"./_array-species-create":35,"./_ctx":45,"./_iobject":65,"./_to-length":128,"./_to-object":129}],33:[function(require,module,exports){
'use strict';

var aFunction = require('./_a-function'),
    toObject = require('./_to-object'),
    IObject = require('./_iobject'),
    toLength = require('./_to-length');

module.exports = function (that, callbackfn, aLen, memo, isRight) {
  aFunction(callbackfn);
  var O = toObject(that),
      self = IObject(O),
      length = toLength(O.length),
      index = isRight ? length - 1 : 0,
      i = isRight ? -1 : 1;
  if (aLen < 2) for (;;) {
    if (index in self) {
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if (isRight ? index < 0 : length <= index) {
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for (; isRight ? index >= 0 : length > index; index += i) {
    if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
  }return memo;
};

},{"./_a-function":23,"./_iobject":65,"./_to-length":128,"./_to-object":129}],34:[function(require,module,exports){
'use strict';

var isObject = require('./_is-object'),
    isArray = require('./_is-array'),
    SPECIES = require('./_wks')('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  }return C === undefined ? Array : C;
};

},{"./_is-array":67,"./_is-object":69,"./_wks":137}],35:[function(require,module,exports){
'use strict';

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":34}],36:[function(require,module,exports){
'use strict';

var aFunction = require('./_a-function'),
    isObject = require('./_is-object'),
    invoke = require('./_invoke'),
    arraySlice = [].slice,
    factories = {};

var construct = function construct(F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) {
      n[i] = 'a[' + i + ']';
    }factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  }return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /*, args... */) {
  var fn = aFunction(this),
      partArgs = arraySlice.call(arguments, 1);
  var bound = function bound() /* args... */{
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};

},{"./_a-function":23,"./_invoke":64,"./_is-object":69}],37:[function(require,module,exports){
'use strict';

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof'),
    TAG = require('./_wks')('toStringTag')
// ES3 wrong here
,
    ARG = cof(function () {
  return arguments;
}()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function tryGet(it, key) {
  try {
    return it[key];
  } catch (e) {/* empty */}
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
  // @@toStringTag case
  : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
  // builtinTag case
  : ARG ? cof(O)
  // ES3 arguments fallback
  : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":38,"./_wks":137}],38:[function(require,module,exports){
"use strict";

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],39:[function(require,module,exports){
'use strict';

var dP = require('./_object-dp').f,
    create = require('./_object-create'),
    redefineAll = require('./_redefine-all'),
    ctx = require('./_ctx'),
    anInstance = require('./_an-instance'),
    defined = require('./_defined'),
    forOf = require('./_for-of'),
    $iterDefine = require('./_iter-define'),
    step = require('./_iter-step'),
    setSpecies = require('./_set-species'),
    DESCRIPTORS = require('./_descriptors'),
    fastKey = require('./_meta').fastKey,
    SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function getEntry(that, key) {
  // fast case
  var index = fastKey(key),
      entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function getConstructor(wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._i = create(null); // index
      that._f = undefined; // first entry
      that._l = undefined; // last entry
      that[SIZE] = 0; // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = this, data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function _delete(key) {
        var that = this,
            entry = getEntry(that, key);
        if (entry) {
          var next = entry.n,
              prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        }return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */) {
        anInstance(this, C, 'forEach');
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3),
            entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) {
            entry = entry.p;
          }
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function get() {
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function def(that, key, value) {
    var entry = getEntry(that, key),
        prev,
        index;
    // change existing entry
    if (entry) {
      entry.v = value;
      // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key, // <- key
        v: value, // <- value
        p: prev = that._l, // <- previous entry
        n: undefined, // <- next entry
        r: false // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    }return that;
  },
  getEntry: getEntry,
  setStrong: function setStrong(C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = iterated; // target
      this._k = kind; // kind
      this._l = undefined; // previous
    }, function () {
      var that = this,
          kind = that._k,
          entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) {
        entry = entry.p;
      } // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

},{"./_an-instance":26,"./_ctx":45,"./_defined":47,"./_descriptors":48,"./_for-of":57,"./_iter-define":73,"./_iter-step":75,"./_meta":82,"./_object-create":86,"./_object-dp":87,"./_redefine-all":106,"./_set-species":111}],40:[function(require,module,exports){
'use strict';

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = require('./_classof'),
    from = require('./_array-from-iterable');
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

},{"./_array-from-iterable":30,"./_classof":37}],41:[function(require,module,exports){
'use strict';

var redefineAll = require('./_redefine-all'),
    getWeak = require('./_meta').getWeak,
    anObject = require('./_an-object'),
    isObject = require('./_is-object'),
    anInstance = require('./_an-instance'),
    forOf = require('./_for-of'),
    createArrayMethod = require('./_array-methods'),
    $has = require('./_has'),
    arrayFind = createArrayMethod(5),
    arrayFindIndex = createArrayMethod(6),
    id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function uncaughtFrozenStore(that) {
  return that._l || (that._l = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function UncaughtFrozenStore() {
  this.a = [];
};
var findUncaughtFrozen = function findUncaughtFrozen(store, key) {
  return arrayFind(store.a, function (it) {
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function get(key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function has(key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function set(key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;else this.a.push([key, value]);
  },
  'delete': function _delete(key) {
    var index = arrayFindIndex(this.a, function (it) {
      return it[0] === key;
    });
    if (~index) this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function getConstructor(wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._i = id++; // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function _delete(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(this)['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(this).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function def(that, key, value) {
    var data = getWeak(anObject(key), true);
    if (data === true) uncaughtFrozenStore(that).set(key, value);else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};

},{"./_an-instance":26,"./_an-object":27,"./_array-methods":32,"./_for-of":57,"./_has":59,"./_is-object":69,"./_meta":82,"./_redefine-all":106}],42:[function(require,module,exports){
'use strict';

var global = require('./_global'),
    $export = require('./_export'),
    redefine = require('./_redefine'),
    redefineAll = require('./_redefine-all'),
    meta = require('./_meta'),
    forOf = require('./_for-of'),
    anInstance = require('./_an-instance'),
    isObject = require('./_is-object'),
    fails = require('./_fails'),
    $iterDetect = require('./_iter-detect'),
    setToStringTag = require('./_set-to-string-tag'),
    inheritIfRequired = require('./_inherit-if-required');

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME],
      C = Base,
      ADDER = IS_MAP ? 'set' : 'add',
      proto = C && C.prototype,
      O = {};
  var fixMethod = function fixMethod(KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY, KEY == 'delete' ? function (a) {
      return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
    } : KEY == 'has' ? function has(a) {
      return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
    } : KEY == 'get' ? function get(a) {
      return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
    } : KEY == 'add' ? function add(a) {
      fn.call(this, a === 0 ? 0 : a);return this;
    } : function set(a, b) {
      fn.call(this, a === 0 ? 0 : a, b);return this;
    });
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C()
    // early implementations not supports chaining
    ,
        HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    ,
        THROWS_ON_PRIMITIVES = fails(function () {
      instance.has(1);
    })
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    ,
        ACCEPT_ITERABLES = $iterDetect(function (iter) {
      new C(iter);
    }) // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    ,
        BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C(),
          index = 5;
      while (index--) {
        $instance[ADDER](index, index);
      }return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

},{"./_an-instance":26,"./_export":52,"./_fails":54,"./_for-of":57,"./_global":58,"./_inherit-if-required":63,"./_is-object":69,"./_iter-detect":74,"./_meta":82,"./_redefine":107,"./_redefine-all":106,"./_set-to-string-tag":112}],43:[function(require,module,exports){
'use strict';

var core = module.exports = { version: '2.4.0' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],44:[function(require,module,exports){
'use strict';

var $defineProperty = require('./_object-dp'),
    createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));else object[index] = value;
};

},{"./_object-dp":87,"./_property-desc":105}],45:[function(require,module,exports){
'use strict';

// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1:
      return function (a) {
        return fn.call(that, a);
      };
    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };
    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }
  return function () /* ...args */{
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":23}],46:[function(require,module,exports){
'use strict';

var anObject = require('./_an-object'),
    toPrimitive = require('./_to-primitive'),
    NUMBER = 'number';

module.exports = function (hint) {
  if (hint !== 'string' && hint !== NUMBER && hint !== 'default') throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};

},{"./_an-object":27,"./_to-primitive":130}],47:[function(require,module,exports){
"use strict";

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],48:[function(require,module,exports){
'use strict';

// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

},{"./_fails":54}],49:[function(require,module,exports){
'use strict';

var isObject = require('./_is-object'),
    document = require('./_global').document
// in old IE typeof document.createElement is 'object'
,
    is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":58,"./_is-object":69}],50:[function(require,module,exports){
'use strict';

// IE 8- don't enum bug keys
module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

},{}],51:[function(require,module,exports){
'use strict';

// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys'),
    gOPS = require('./_object-gops'),
    pIE = require('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it),
      getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it),
        isEnum = pIE.f,
        i = 0,
        key;
    while (symbols.length > i) {
      if (isEnum.call(it, key = symbols[i++])) result.push(key);
    }
  }return result;
};

},{"./_object-gops":93,"./_object-keys":96,"./_object-pie":97}],52:[function(require,module,exports){
'use strict';

var global = require('./_global'),
    core = require('./_core'),
    hide = require('./_hide'),
    redefine = require('./_redefine'),
    ctx = require('./_ctx'),
    PROTOTYPE = 'prototype';

var $export = function $export(type, name, source) {
  var IS_FORCED = type & $export.F,
      IS_GLOBAL = type & $export.G,
      IS_STATIC = type & $export.S,
      IS_PROTO = type & $export.P,
      IS_BIND = type & $export.B,
      target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE],
      exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
      expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {}),
      key,
      own,
      out,
      exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1; // forced
$export.G = 2; // global
$export.S = 4; // static
$export.P = 8; // proto
$export.B = 16; // bind
$export.W = 32; // wrap
$export.U = 64; // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

},{"./_core":43,"./_ctx":45,"./_global":58,"./_hide":60,"./_redefine":107}],53:[function(require,module,exports){
'use strict';

var MATCH = require('./_wks')('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) {/* empty */}
  }return true;
};

},{"./_wks":137}],54:[function(require,module,exports){
"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],55:[function(require,module,exports){
'use strict';

var hide = require('./_hide'),
    redefine = require('./_redefine'),
    fails = require('./_fails'),
    defined = require('./_defined'),
    wks = require('./_wks');

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY),
      fns = exec(defined, SYMBOL, ''[KEY]),
      strfn = fns[0],
      rxfn = fns[1];
  if (fails(function () {
    var O = {};
    O[SYMBOL] = function () {
      return 7;
    };
    return ''[KEY](O) != 7;
  })) {
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
    // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
    // 21.2.5.11 RegExp.prototype[@@split](string, limit)
    ? function (string, arg) {
      return rxfn.call(string, this, arg);
    }
    // 21.2.5.6 RegExp.prototype[@@match](string)
    // 21.2.5.9 RegExp.prototype[@@search](string)
    : function (string) {
      return rxfn.call(string, this);
    });
  }
};

},{"./_defined":47,"./_fails":54,"./_hide":60,"./_redefine":107,"./_wks":137}],56:[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags

var anObject = require('./_an-object');
module.exports = function () {
  var that = anObject(this),
      result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

},{"./_an-object":27}],57:[function(require,module,exports){
'use strict';

var ctx = require('./_ctx'),
    call = require('./_iter-call'),
    isArrayIter = require('./_is-array-iter'),
    anObject = require('./_an-object'),
    toLength = require('./_to-length'),
    getIterFn = require('./core.get-iterator-method'),
    BREAK = {},
    RETURN = {};
var _exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () {
    return iterable;
  } : getIterFn(iterable),
      f = ctx(fn, that, entries ? 2 : 1),
      index = 0,
      length,
      step,
      iterator,
      result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
_exports.BREAK = BREAK;
_exports.RETURN = RETURN;

},{"./_an-object":27,"./_ctx":45,"./_is-array-iter":66,"./_iter-call":71,"./_to-length":128,"./core.get-iterator-method":138}],58:[function(require,module,exports){
'use strict';

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],59:[function(require,module,exports){
"use strict";

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],60:[function(require,module,exports){
'use strict';

var dP = require('./_object-dp'),
    createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":48,"./_object-dp":87,"./_property-desc":105}],61:[function(require,module,exports){
'use strict';

module.exports = require('./_global').document && document.documentElement;

},{"./_global":58}],62:[function(require,module,exports){
'use strict';

module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

},{"./_descriptors":48,"./_dom-create":49,"./_fails":54}],63:[function(require,module,exports){
'use strict';

var isObject = require('./_is-object'),
    setPrototypeOf = require('./_set-proto').set;
module.exports = function (that, target, C) {
  var P,
      S = target.constructor;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  }return that;
};

},{"./_is-object":69,"./_set-proto":110}],64:[function(require,module,exports){
"use strict";

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
                  var un = that === undefined;
                  switch (args.length) {
                                    case 0:
                                                      return un ? fn() : fn.call(that);
                                    case 1:
                                                      return un ? fn(args[0]) : fn.call(that, args[0]);
                                    case 2:
                                                      return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
                                    case 3:
                                                      return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);
                                    case 4:
                                                      return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
                  }return fn.apply(that, args);
};

},{}],65:[function(require,module,exports){
'use strict';

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":38}],66:[function(require,module,exports){
'use strict';

// check on default Array iterator
var Iterators = require('./_iterators'),
    ITERATOR = require('./_wks')('iterator'),
    ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":76,"./_wks":137}],67:[function(require,module,exports){
'use strict';

// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":38}],68:[function(require,module,exports){
'use strict';

// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object'),
    floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

},{"./_is-object":69}],69:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (it) {
  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) === 'object' ? it !== null : typeof it === 'function';
};

},{}],70:[function(require,module,exports){
'use strict';

// 7.2.8 IsRegExp(argument)
var isObject = require('./_is-object'),
    cof = require('./_cof'),
    MATCH = require('./_wks')('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};

},{"./_cof":38,"./_is-object":69,"./_wks":137}],71:[function(require,module,exports){
'use strict';

// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":27}],72:[function(require,module,exports){
'use strict';

var create = require('./_object-create'),
    descriptor = require('./_property-desc'),
    setToStringTag = require('./_set-to-string-tag'),
    IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () {
  return this;
});

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":60,"./_object-create":86,"./_property-desc":105,"./_set-to-string-tag":112,"./_wks":137}],73:[function(require,module,exports){
'use strict';

var LIBRARY = require('./_library'),
    $export = require('./_export'),
    redefine = require('./_redefine'),
    hide = require('./_hide'),
    has = require('./_has'),
    Iterators = require('./_iterators'),
    $iterCreate = require('./_iter-create'),
    setToStringTag = require('./_set-to-string-tag'),
    getPrototypeOf = require('./_object-gpo'),
    ITERATOR = require('./_wks')('iterator'),
    BUGGY = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
,
    FF_ITERATOR = '@@iterator',
    KEYS = 'keys',
    VALUES = 'values';

var returnThis = function returnThis() {
  return this;
};

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function getMethod(kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS:
        return function keys() {
          return new Constructor(this, kind);
        };
      case VALUES:
        return function values() {
          return new Constructor(this, kind);
        };
    }return function entries() {
      return new Constructor(this, kind);
    };
  };
  var TAG = NAME + ' Iterator',
      DEF_VALUES = DEFAULT == VALUES,
      VALUES_BUG = false,
      proto = Base.prototype,
      $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT],
      $default = $native || getMethod(DEFAULT),
      $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined,
      $anyNative = NAME == 'Array' ? proto.entries || $native : $native,
      methods,
      key,
      IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() {
      return $native.call(this);
    };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":52,"./_has":59,"./_hide":60,"./_iter-create":72,"./_iterators":76,"./_library":78,"./_object-gpo":94,"./_redefine":107,"./_set-to-string-tag":112,"./_wks":137}],74:[function(require,module,exports){
'use strict';

var ITERATOR = require('./_wks')('iterator'),
    SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () {
    SAFE_CLOSING = true;
  };
  Array.from(riter, function () {
    throw 2;
  });
} catch (e) {/* empty */}

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7],
        iter = arr[ITERATOR]();
    iter.next = function () {
      return { done: safe = true };
    };
    arr[ITERATOR] = function () {
      return iter;
    };
    exec(arr);
  } catch (e) {/* empty */}
  return safe;
};

},{"./_wks":137}],75:[function(require,module,exports){
"use strict";

module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],76:[function(require,module,exports){
"use strict";

module.exports = {};

},{}],77:[function(require,module,exports){
'use strict';

var getKeys = require('./_object-keys'),
    toIObject = require('./_to-iobject');
module.exports = function (object, el) {
  var O = toIObject(object),
      keys = getKeys(O),
      length = keys.length,
      index = 0,
      key;
  while (length > index) {
    if (O[key = keys[index++]] === el) return key;
  }
};

},{"./_object-keys":96,"./_to-iobject":127}],78:[function(require,module,exports){
"use strict";

module.exports = false;

},{}],79:[function(require,module,exports){
"use strict";

// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = !$expm1
// Old FF bug
|| $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
// Tor Browser bug
|| $expm1(-2e-17) != -2e-17 ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;

},{}],80:[function(require,module,exports){
"use strict";

// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};

},{}],81:[function(require,module,exports){
"use strict";

// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x) {
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

},{}],82:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var META = require('./_uid')('meta'),
    isObject = require('./_is-object'),
    has = require('./_has'),
    setDesc = require('./_object-dp').f,
    id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function setMeta(it) {
  setDesc(it, META, { value: {
      i: 'O' + ++id, // object ID
      w: {} // weak collections IDs
    } });
};
var fastKey = function fastKey(it, create) {
  // return primitive with prefix
  if (!isObject(it)) return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
    // return object ID
  }return it[META].i;
};
var getWeak = function getWeak(it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
    // return hash weak collections IDs
  }return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function onFreeze(it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_fails":54,"./_has":59,"./_is-object":69,"./_object-dp":87,"./_uid":134}],83:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Map = require('./es6.map'),
    $export = require('./_export'),
    shared = require('./_shared')('metadata'),
    store = shared.store || (shared.store = new (require('./es6.weak-map'))());

var getOrCreateMetadataMap = function getOrCreateMetadataMap(target, targetKey, create) {
  var targetMetadata = store.get(target);
  if (!targetMetadata) {
    if (!create) return undefined;
    store.set(target, targetMetadata = new Map());
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if (!keyMetadata) {
    if (!create) return undefined;
    targetMetadata.set(targetKey, keyMetadata = new Map());
  }return keyMetadata;
};
var ordinaryHasOwnMetadata = function ordinaryHasOwnMetadata(MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};
var ordinaryGetOwnMetadata = function ordinaryGetOwnMetadata(MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};
var ordinaryDefineOwnMetadata = function ordinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};
var ordinaryOwnMetadataKeys = function ordinaryOwnMetadataKeys(target, targetKey) {
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false),
      keys = [];
  if (metadataMap) metadataMap.forEach(function (_, key) {
    keys.push(key);
  });
  return keys;
};
var toMetaKey = function toMetaKey(it) {
  return it === undefined || (typeof it === 'undefined' ? 'undefined' : _typeof(it)) == 'symbol' ? it : String(it);
};
var exp = function exp(O) {
  $export($export.S, 'Reflect', O);
};

module.exports = {
  store: store,
  map: getOrCreateMetadataMap,
  has: ordinaryHasOwnMetadata,
  get: ordinaryGetOwnMetadata,
  set: ordinaryDefineOwnMetadata,
  keys: ordinaryOwnMetadataKeys,
  key: toMetaKey,
  exp: exp
};

},{"./_export":52,"./_shared":114,"./es6.map":169,"./es6.weak-map":275}],84:[function(require,module,exports){
'use strict';

var global = require('./_global'),
    macrotask = require('./_task').set,
    Observer = global.MutationObserver || global.WebKitMutationObserver,
    process = global.process,
    Promise = global.Promise,
    isNode = require('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function flush() {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();else last = undefined;
        throw e;
      }
    }last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function notify() {
      process.nextTick(flush);
    };
    // browsers with MutationObserver
  } else if (Observer) {
    var toggle = true,
        node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function notify() {
      node.data = toggle = !toggle;
    };
    // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function notify() {
      promise.then(flush);
    };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout
  } else {
    notify = function notify() {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    }last = task;
  };
};

},{"./_cof":38,"./_global":58,"./_task":124}],85:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)

var getKeys = require('./_object-keys'),
    gOPS = require('./_object-gops'),
    pIE = require('./_object-pie'),
    toObject = require('./_to-object'),
    IObject = require('./_iobject'),
    $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {},
      B = {},
      S = Symbol(),
      K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) {
    B[k] = k;
  });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) {
  // eslint-disable-line no-unused-vars
  var T = toObject(target),
      aLen = arguments.length,
      index = 1,
      getSymbols = gOPS.f,
      isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]),
        keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S),
        length = keys.length,
        j = 0,
        key;
    while (length > j) {
      if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
    }
  }return T;
} : $assign;

},{"./_fails":54,"./_iobject":65,"./_object-gops":93,"./_object-keys":96,"./_object-pie":97,"./_to-object":129}],86:[function(require,module,exports){
'use strict';

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object'),
    dPs = require('./_object-dps'),
    enumBugKeys = require('./_enum-bug-keys'),
    IE_PROTO = require('./_shared-key')('IE_PROTO'),
    Empty = function Empty() {/* empty */},
    PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var _createDict = function createDict() {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe'),
      i = enumBugKeys.length,
      lt = '<',
      gt = '>',
      iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  _createDict = iframeDocument.F;
  while (i--) {
    delete _createDict[PROTOTYPE][enumBugKeys[i]];
  }return _createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = _createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":27,"./_dom-create":49,"./_enum-bug-keys":50,"./_html":61,"./_object-dps":88,"./_shared-key":113}],87:[function(require,module,exports){
'use strict';

var anObject = require('./_an-object'),
    IE8_DOM_DEFINE = require('./_ie8-dom-define'),
    toPrimitive = require('./_to-primitive'),
    dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":27,"./_descriptors":48,"./_ie8-dom-define":62,"./_to-primitive":130}],88:[function(require,module,exports){
'use strict';

var dP = require('./_object-dp'),
    anObject = require('./_an-object'),
    getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties),
      length = keys.length,
      i = 0,
      P;
  while (length > i) {
    dP.f(O, P = keys[i++], Properties[P]);
  }return O;
};

},{"./_an-object":27,"./_descriptors":48,"./_object-dp":87,"./_object-keys":96}],89:[function(require,module,exports){
'use strict';

// Forced replacement prototype accessors methods
module.exports = require('./_library') || !require('./_fails')(function () {
  var K = Math.random();
  // In FF throws only define methods
  __defineSetter__.call(null, K, function () {/* empty */});
  delete require('./_global')[K];
});

},{"./_fails":54,"./_global":58,"./_library":78}],90:[function(require,module,exports){
'use strict';

var pIE = require('./_object-pie'),
    createDesc = require('./_property-desc'),
    toIObject = require('./_to-iobject'),
    toPrimitive = require('./_to-primitive'),
    has = require('./_has'),
    IE8_DOM_DEFINE = require('./_ie8-dom-define'),
    gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) {/* empty */}
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

},{"./_descriptors":48,"./_has":59,"./_ie8-dom-define":62,"./_object-pie":97,"./_property-desc":105,"./_to-iobject":127,"./_to-primitive":130}],91:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject'),
    gOPN = require('./_object-gopn').f,
    toString = {}.toString;

var windowNames = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) == 'object' && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function getWindowNames(it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":92,"./_to-iobject":127}],92:[function(require,module,exports){
'use strict';

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal'),
    hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_enum-bug-keys":50,"./_object-keys-internal":95}],93:[function(require,module,exports){
"use strict";

exports.f = Object.getOwnPropertySymbols;

},{}],94:[function(require,module,exports){
'use strict';

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has'),
    toObject = require('./_to-object'),
    IE_PROTO = require('./_shared-key')('IE_PROTO'),
    ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  }return O instanceof Object ? ObjectProto : null;
};

},{"./_has":59,"./_shared-key":113,"./_to-object":129}],95:[function(require,module,exports){
'use strict';

var has = require('./_has'),
    toIObject = require('./_to-iobject'),
    arrayIndexOf = require('./_array-includes')(false),
    IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object),
      i = 0,
      result = [],
      key;
  for (key in O) {
    if (key != IE_PROTO) has(O, key) && result.push(key);
  } // Don't enum bug & hidden keys
  while (names.length > i) {
    if (has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
  }return result;
};

},{"./_array-includes":31,"./_has":59,"./_shared-key":113,"./_to-iobject":127}],96:[function(require,module,exports){
'use strict';

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal'),
    enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":50,"./_object-keys-internal":95}],97:[function(require,module,exports){
"use strict";

exports.f = {}.propertyIsEnumerable;

},{}],98:[function(require,module,exports){
'use strict';

// most Object methods by ES6 should accept primitives
var $export = require('./_export'),
    core = require('./_core'),
    fails = require('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY],
      exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () {
    fn(1);
  }), 'Object', exp);
};

},{"./_core":43,"./_export":52,"./_fails":54}],99:[function(require,module,exports){
'use strict';

var getKeys = require('./_object-keys'),
    toIObject = require('./_to-iobject'),
    isEnum = require('./_object-pie').f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it),
        keys = getKeys(O),
        length = keys.length,
        i = 0,
        result = [],
        key;
    while (length > i) {
      if (isEnum.call(O, key = keys[i++])) {
        result.push(isEntries ? [key, O[key]] : O[key]);
      }
    }return result;
  };
};

},{"./_object-keys":96,"./_object-pie":97,"./_to-iobject":127}],100:[function(require,module,exports){
'use strict';

// all object keys, includes non-enumerable and symbols
var gOPN = require('./_object-gopn'),
    gOPS = require('./_object-gops'),
    anObject = require('./_an-object'),
    Reflect = require('./_global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it)),
      getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};

},{"./_an-object":27,"./_global":58,"./_object-gopn":92,"./_object-gops":93}],101:[function(require,module,exports){
'use strict';

var $parseFloat = require('./_global').parseFloat,
    $trim = require('./_string-trim').trim;

module.exports = 1 / $parseFloat(require('./_string-ws') + '-0') !== -Infinity ? function parseFloat(str) {
  var string = $trim(String(str), 3),
      result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;

},{"./_global":58,"./_string-trim":122,"./_string-ws":123}],102:[function(require,module,exports){
'use strict';

var $parseInt = require('./_global').parseInt,
    $trim = require('./_string-trim').trim,
    ws = require('./_string-ws'),
    hex = /^[\-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, radix >>> 0 || (hex.test(string) ? 16 : 10));
} : $parseInt;

},{"./_global":58,"./_string-trim":122,"./_string-ws":123}],103:[function(require,module,exports){
'use strict';

var path = require('./_path'),
    invoke = require('./_invoke'),
    aFunction = require('./_a-function');
module.exports = function () /* ...pargs */{
  var fn = aFunction(this),
      length = arguments.length,
      pargs = Array(length),
      i = 0,
      _ = path._,
      holder = false;
  while (length > i) {
    if ((pargs[i] = arguments[i++]) === _) holder = true;
  }return function () /* ...args */{
    var that = this,
        aLen = arguments.length,
        j = 0,
        k = 0,
        args;
    if (!holder && !aLen) return invoke(fn, pargs, that);
    args = pargs.slice();
    if (holder) for (; length > j; j++) {
      if (args[j] === _) args[j] = arguments[k++];
    }while (aLen > k) {
      args.push(arguments[k++]);
    }return invoke(fn, args, that);
  };
};

},{"./_a-function":23,"./_invoke":64,"./_path":104}],104:[function(require,module,exports){
'use strict';

module.exports = require('./_global');

},{"./_global":58}],105:[function(require,module,exports){
"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],106:[function(require,module,exports){
'use strict';

var redefine = require('./_redefine');
module.exports = function (target, src, safe) {
  for (var key in src) {
    redefine(target, key, src[key], safe);
  }return target;
};

},{"./_redefine":107}],107:[function(require,module,exports){
'use strict';

var global = require('./_global'),
    hide = require('./_hide'),
    has = require('./_has'),
    SRC = require('./_uid')('src'),
    TO_STRING = 'toString',
    $toString = Function[TO_STRING],
    TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else {
    if (!safe) {
      delete O[key];
      hide(O, key, val);
    } else {
      if (O[key]) O[key] = val;else hide(O, key, val);
    }
  }
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":43,"./_global":58,"./_has":59,"./_hide":60,"./_uid":134}],108:[function(require,module,exports){
"use strict";

module.exports = function (regExp, replace) {
  var replacer = replace === Object(replace) ? function (part) {
    return replace[part];
  } : replace;
  return function (it) {
    return String(it).replace(regExp, replacer);
  };
};

},{}],109:[function(require,module,exports){
"use strict";

// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

},{}],110:[function(require,module,exports){
'use strict';

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object'),
    anObject = require('./_an-object');
var check = function check(O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
  function (test, buggy, set) {
    try {
      set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
      set(test, []);
      buggy = !(test instanceof Array);
    } catch (e) {
      buggy = true;
    }
    return function setPrototypeOf(O, proto) {
      check(O, proto);
      if (buggy) O.__proto__ = proto;else set(O, proto);
      return O;
    };
  }({}, false) : undefined),
  check: check
};

},{"./_an-object":27,"./_ctx":45,"./_is-object":69,"./_object-gopd":90}],111:[function(require,module,exports){
'use strict';

var global = require('./_global'),
    dP = require('./_object-dp'),
    DESCRIPTORS = require('./_descriptors'),
    SPECIES = require('./_wks')('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function get() {
      return this;
    }
  });
};

},{"./_descriptors":48,"./_global":58,"./_object-dp":87,"./_wks":137}],112:[function(require,module,exports){
'use strict';

var def = require('./_object-dp').f,
    has = require('./_has'),
    TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":59,"./_object-dp":87,"./_wks":137}],113:[function(require,module,exports){
'use strict';

var shared = require('./_shared')('keys'),
    uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":114,"./_uid":134}],114:[function(require,module,exports){
'use strict';

var global = require('./_global'),
    SHARED = '__core-js_shared__',
    store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};

},{"./_global":58}],115:[function(require,module,exports){
'use strict';

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object'),
    aFunction = require('./_a-function'),
    SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor,
      S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":23,"./_an-object":27,"./_wks":137}],116:[function(require,module,exports){
'use strict';

var fails = require('./_fails');

module.exports = function (method, arg) {
  return !!method && fails(function () {
    arg ? method.call(null, function () {}, 1) : method.call(null);
  });
};

},{"./_fails":54}],117:[function(require,module,exports){
'use strict';

var toInteger = require('./_to-integer'),
    defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that)),
        i = toInteger(pos),
        l = s.length,
        a,
        b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":47,"./_to-integer":126}],118:[function(require,module,exports){
'use strict';

// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./_is-regexp'),
    defined = require('./_defined');

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};

},{"./_defined":47,"./_is-regexp":70}],119:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    fails = require('./_fails'),
    defined = require('./_defined'),
    quot = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function createHTML(string, tag, attribute, value) {
  var S = String(defined(string)),
      p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function (NAME, exec) {
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function () {
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};

},{"./_defined":47,"./_export":52,"./_fails":54}],120:[function(require,module,exports){
'use strict';

// https://github.com/tc39/proposal-string-pad-start-end
var toLength = require('./_to-length'),
    repeat = require('./_string-repeat'),
    defined = require('./_defined');

module.exports = function (that, maxLength, fillString, left) {
  var S = String(defined(that)),
      stringLength = S.length,
      fillStr = fillString === undefined ? ' ' : String(fillString),
      intMaxLength = toLength(maxLength);
  if (intMaxLength <= stringLength || fillStr == '') return S;
  var fillLen = intMaxLength - stringLength,
      stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};

},{"./_defined":47,"./_string-repeat":121,"./_to-length":128}],121:[function(require,module,exports){
'use strict';

var toInteger = require('./_to-integer'),
    defined = require('./_defined');

module.exports = function repeat(count) {
  var str = String(defined(this)),
      res = '',
      n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (; n > 0; (n >>>= 1) && (str += str)) {
    if (n & 1) res += str;
  }return res;
};

},{"./_defined":47,"./_to-integer":126}],122:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    defined = require('./_defined'),
    fails = require('./_fails'),
    spaces = require('./_string-ws'),
    space = '[' + spaces + ']',
    non = '\u200B\x85',
    ltrim = RegExp('^' + space + space + '*'),
    rtrim = RegExp(space + space + '*$');

var exporter = function exporter(KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;

},{"./_defined":47,"./_export":52,"./_fails":54,"./_string-ws":123}],123:[function(require,module,exports){
'use strict';

module.exports = '\t\n\x0B\f\r \xA0\u1680\u180E\u2000\u2001\u2002\u2003' + '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

},{}],124:[function(require,module,exports){
'use strict';

var ctx = require('./_ctx'),
    invoke = require('./_invoke'),
    html = require('./_html'),
    cel = require('./_dom-create'),
    global = require('./_global'),
    process = global.process,
    setTask = global.setImmediate,
    clearTask = global.clearImmediate,
    MessageChannel = global.MessageChannel,
    counter = 0,
    queue = {},
    ONREADYSTATECHANGE = 'onreadystatechange',
    defer,
    channel,
    port;
var run = function run() {
  var id = +this;
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function listener(event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [],
        i = 1;
    while (arguments.length > i) {
      args.push(arguments[i++]);
    }queue[++counter] = function () {
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (require('./_cof')(process) == 'process') {
    defer = function defer(id) {
      process.nextTick(ctx(run, id, 1));
    };
    // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function defer(id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
    // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function defer(id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
    // Rest old browsers
  } else {
    defer = function defer(id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_cof":38,"./_ctx":45,"./_dom-create":49,"./_global":58,"./_html":61,"./_invoke":64}],125:[function(require,module,exports){
'use strict';

var toInteger = require('./_to-integer'),
    max = Math.max,
    min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":126}],126:[function(require,module,exports){
"use strict";

// 7.1.4 ToInteger
var ceil = Math.ceil,
    floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],127:[function(require,module,exports){
'use strict';

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject'),
    defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":47,"./_iobject":65}],128:[function(require,module,exports){
'use strict';

// 7.1.15 ToLength
var toInteger = require('./_to-integer'),
    min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":126}],129:[function(require,module,exports){
'use strict';

// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":47}],130:[function(require,module,exports){
'use strict';

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":69}],131:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

if (require('./_descriptors')) {
  var LIBRARY = require('./_library'),
      global = require('./_global'),
      fails = require('./_fails'),
      $export = require('./_export'),
      $typed = require('./_typed'),
      $buffer = require('./_typed-buffer'),
      ctx = require('./_ctx'),
      anInstance = require('./_an-instance'),
      propertyDesc = require('./_property-desc'),
      hide = require('./_hide'),
      redefineAll = require('./_redefine-all'),
      toInteger = require('./_to-integer'),
      toLength = require('./_to-length'),
      toIndex = require('./_to-index'),
      toPrimitive = require('./_to-primitive'),
      has = require('./_has'),
      same = require('./_same-value'),
      classof = require('./_classof'),
      isObject = require('./_is-object'),
      toObject = require('./_to-object'),
      isArrayIter = require('./_is-array-iter'),
      create = require('./_object-create'),
      getPrototypeOf = require('./_object-gpo'),
      gOPN = require('./_object-gopn').f,
      getIterFn = require('./core.get-iterator-method'),
      uid = require('./_uid'),
      wks = require('./_wks'),
      createArrayMethod = require('./_array-methods'),
      createArrayIncludes = require('./_array-includes'),
      speciesConstructor = require('./_species-constructor'),
      ArrayIterators = require('./es6.array.iterator'),
      Iterators = require('./_iterators'),
      $iterDetect = require('./_iter-detect'),
      setSpecies = require('./_set-species'),
      arrayFill = require('./_array-fill'),
      arrayCopyWithin = require('./_array-copy-within'),
      $DP = require('./_object-dp'),
      $GOPD = require('./_object-gopd'),
      dP = $DP.f,
      gOPD = $GOPD.f,
      RangeError = global.RangeError,
      TypeError = global.TypeError,
      Uint8Array = global.Uint8Array,
      ARRAY_BUFFER = 'ArrayBuffer',
      SHARED_BUFFER = 'Shared' + ARRAY_BUFFER,
      BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT',
      PROTOTYPE = 'prototype',
      ArrayProto = Array[PROTOTYPE],
      $ArrayBuffer = $buffer.ArrayBuffer,
      $DataView = $buffer.DataView,
      arrayForEach = createArrayMethod(0),
      arrayFilter = createArrayMethod(2),
      arraySome = createArrayMethod(3),
      arrayEvery = createArrayMethod(4),
      arrayFind = createArrayMethod(5),
      arrayFindIndex = createArrayMethod(6),
      arrayIncludes = createArrayIncludes(true),
      arrayIndexOf = createArrayIncludes(false),
      arrayValues = ArrayIterators.values,
      arrayKeys = ArrayIterators.keys,
      arrayEntries = ArrayIterators.entries,
      arrayLastIndexOf = ArrayProto.lastIndexOf,
      arrayReduce = ArrayProto.reduce,
      arrayReduceRight = ArrayProto.reduceRight,
      arrayJoin = ArrayProto.join,
      arraySort = ArrayProto.sort,
      arraySlice = ArrayProto.slice,
      arrayToString = ArrayProto.toString,
      arrayToLocaleString = ArrayProto.toLocaleString,
      ITERATOR = wks('iterator'),
      TAG = wks('toStringTag'),
      TYPED_CONSTRUCTOR = uid('typed_constructor'),
      DEF_CONSTRUCTOR = uid('def_constructor'),
      ALL_CONSTRUCTORS = $typed.CONSTR,
      TYPED_ARRAY = $typed.TYPED,
      VIEW = $typed.VIEW,
      WRONG_LENGTH = 'Wrong length!';

  var $map = createArrayMethod(1, function (O, length) {
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function () {
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
    new Uint8Array(1).set({});
  });

  var strictToLength = function strictToLength(it, SAME) {
    if (it === undefined) throw TypeError(WRONG_LENGTH);
    var number = +it,
        length = toLength(it);
    if (SAME && !same(number, length)) throw RangeError(WRONG_LENGTH);
    return length;
  };

  var toOffset = function toOffset(it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function validate(it) {
    if (isObject(it) && TYPED_ARRAY in it) return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function allocate(C, length) {
    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
      throw TypeError('It is not a typed array constructor!');
    }return new C(length);
  };

  var speciesFromList = function speciesFromList(O, list) {
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function fromList(C, list) {
    var index = 0,
        length = list.length,
        result = allocate(C, length);
    while (length > index) {
      result[index] = list[index++];
    }return result;
  };

  var addGetter = function addGetter(it, key, internal) {
    dP(it, key, { get: function get() {
        return this._d[internal];
      } });
  };

  var $from = function from(source /*, mapfn, thisArg */) {
    var O = toObject(source),
        aLen = arguments.length,
        mapfn = aLen > 1 ? arguments[1] : undefined,
        mapping = mapfn !== undefined,
        iterFn = getIterFn(O),
        i,
        length,
        values,
        result,
        step,
        iterator;
    if (iterFn != undefined && !isArrayIter(iterFn)) {
      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
        values.push(step.value);
      }O = values;
    }
    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of() /*...items*/{
    var index = 0,
        length = arguments.length,
        result = allocate(this, length);
    while (length > index) {
      result[index] = arguments[index++];
    }return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function () {
    arrayToLocaleString.call(new Uint8Array(1));
  });

  var $toLocaleString = function toLocaleString() {
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /*, end */) {
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /*, thisArg */) {
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /*, start, end */) {
      // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /*, thisArg */) {
      return speciesFromList(this, arrayFilter(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /*, thisArg */) {
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /*, thisArg */) {
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /*, thisArg */) {
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /*, fromIndex */) {
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /*, fromIndex */) {
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator) {
      // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /*, fromIndex */) {
      // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /*, thisArg */) {
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /*, initialValue */) {
      // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /*, initialValue */) {
      // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse() {
      var that = this,
          length = validate(that).length,
          middle = Math.floor(length / 2),
          index = 0,
          value;
      while (index < middle) {
        value = that[index];
        that[index++] = that[--length];
        that[length] = value;
      }return that;
    },
    some: function some(callbackfn /*, thisArg */) {
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn) {
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end) {
      var O = validate(this),
          length = O.length,
          $begin = toIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(O.buffer, O.byteOffset + $begin * O.BYTES_PER_ELEMENT, toLength((end === undefined ? length : toIndex(end, length)) - $begin));
    }
  };

  var $slice = function slice(start, end) {
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /*, offset */) {
    validate(this);
    var offset = toOffset(arguments[1], 1),
        length = this.length,
        src = toObject(arrayLike),
        len = toLength(src.length),
        index = 0;
    if (len + offset > length) throw RangeError(WRONG_LENGTH);
    while (index < len) {
      this[offset + index] = src[index++];
    }
  };

  var $iterators = {
    entries: function entries() {
      return arrayEntries.call(validate(this));
    },
    keys: function keys() {
      return arrayKeys.call(validate(this));
    },
    values: function values() {
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function isTAIndex(target, key) {
    return isObject(target) && target[TYPED_ARRAY] && (typeof key === 'undefined' ? 'undefined' : _typeof(key)) != 'symbol' && key in target && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key) {
    return isTAIndex(target, key = toPrimitive(key, true)) ? propertyDesc(2, target[key]) : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc) {
    if (isTAIndex(target, key = toPrimitive(key, true)) && isObject(desc) && has(desc, 'value') && !has(desc, 'get') && !has(desc, 'set')
    // TODO: add validation descriptor w/o calling accessors
    && !desc.configurable && (!has(desc, 'writable') || desc.writable) && (!has(desc, 'enumerable') || desc.enumerable)) {
      target[key] = desc.value;
      return target;
    } else return dP(target, key, desc);
  };

  if (!ALL_CONSTRUCTORS) {
    $GOPD.f = $getDesc;
    $DP.f = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty: $setDesc
  });

  if (fails(function () {
    arrayToString.call({});
  })) {
    arrayToString = arrayToLocaleString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice: $slice,
    set: $set,
    constructor: function constructor() {/* noop */},
    toString: arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function get() {
      return this[TYPED_ARRAY];
    }
  });

  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
    CLAMPED = !!CLAMPED;
    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array',
        ISNT_UINT8 = NAME != 'Uint8Array',
        GETTER = 'get' + KEY,
        SETTER = 'set' + KEY,
        TypedArray = global[NAME],
        Base = TypedArray || {},
        TAC = TypedArray && getPrototypeOf(TypedArray),
        FORCED = !TypedArray || !$typed.ABV,
        O = {},
        TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function getter(that, index) {
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function setter(that, index, value) {
      var data = that._d;
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function addElement(that, index) {
      dP(that, index, {
        get: function get() {
          return getter(this, index);
        },
        set: function set(value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if (FORCED) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME, '_d');
        var index = 0,
            offset = 0,
            buffer,
            byteLength,
            length,
            klass;
        if (!isObject(data)) {
          length = strictToLength(data, true);
          byteLength = length * BYTES;
          buffer = new $ArrayBuffer(byteLength);
        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (TYPED_ARRAY in data) {
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while (index < length) {
          addElement(that, index++);
        }
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if (!$iterDetect(function (iter) {
      // V8 works with iterators, but fails in many other cases
      // https://code.google.com/p/v8/issues/detail?id=4552
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if (!isObject(data)) return new Base(strictToLength(data, ISNT_UINT8));
        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          return $length !== undefined ? new Base(data, toOffset($offset, BYTES), $length) : $offset !== undefined ? new Base(data, toOffset($offset, BYTES)) : new Base(data);
        }
        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator = TypedArrayPrototype[ITERATOR],
        CORRECT_ITER_NAME = !!$nativeIterator && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined),
        $iterator = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
      dP(TypedArrayPrototype, TAG, {
        get: function get() {
          return NAME;
        }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES,
      from: $from,
      of: $of
    });

    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    $export($export.P + $export.F * (TypedArrayPrototype.toString != arrayToString), NAME, { toString: arrayToString });

    $export($export.P + $export.F * fails(function () {
      new TypedArray(1).slice();
    }), NAME, { slice: $slice });

    $export($export.P + $export.F * (fails(function () {
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
    }) || !fails(function () {
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, { toLocaleString: $toLocaleString });

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function () {/* empty */};

},{"./_an-instance":26,"./_array-copy-within":28,"./_array-fill":29,"./_array-includes":31,"./_array-methods":32,"./_classof":37,"./_ctx":45,"./_descriptors":48,"./_export":52,"./_fails":54,"./_global":58,"./_has":59,"./_hide":60,"./_is-array-iter":66,"./_is-object":69,"./_iter-detect":74,"./_iterators":76,"./_library":78,"./_object-create":86,"./_object-dp":87,"./_object-gopd":90,"./_object-gopn":92,"./_object-gpo":94,"./_property-desc":105,"./_redefine-all":106,"./_same-value":109,"./_set-species":111,"./_species-constructor":115,"./_to-index":125,"./_to-integer":126,"./_to-length":128,"./_to-object":129,"./_to-primitive":130,"./_typed":133,"./_typed-buffer":132,"./_uid":134,"./_wks":137,"./core.get-iterator-method":138,"./es6.array.iterator":150}],132:[function(require,module,exports){
'use strict';

var global = require('./_global'),
    DESCRIPTORS = require('./_descriptors'),
    LIBRARY = require('./_library'),
    $typed = require('./_typed'),
    hide = require('./_hide'),
    redefineAll = require('./_redefine-all'),
    fails = require('./_fails'),
    anInstance = require('./_an-instance'),
    toInteger = require('./_to-integer'),
    toLength = require('./_to-length'),
    gOPN = require('./_object-gopn').f,
    dP = require('./_object-dp').f,
    arrayFill = require('./_array-fill'),
    setToStringTag = require('./_set-to-string-tag'),
    ARRAY_BUFFER = 'ArrayBuffer',
    DATA_VIEW = 'DataView',
    PROTOTYPE = 'prototype',
    WRONG_LENGTH = 'Wrong length!',
    WRONG_INDEX = 'Wrong index!',
    $ArrayBuffer = global[ARRAY_BUFFER],
    $DataView = global[DATA_VIEW],
    Math = global.Math,
    RangeError = global.RangeError,
    Infinity = global.Infinity,
    BaseBuffer = $ArrayBuffer,
    abs = Math.abs,
    pow = Math.pow,
    floor = Math.floor,
    log = Math.log,
    LN2 = Math.LN2,
    BUFFER = 'buffer',
    BYTE_LENGTH = 'byteLength',
    BYTE_OFFSET = 'byteOffset',
    $BUFFER = DESCRIPTORS ? '_b' : BUFFER,
    $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH,
    $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
var packIEEE754 = function packIEEE754(value, mLen, nBytes) {
  var buffer = Array(nBytes),
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0,
      i = 0,
      s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0,
      e,
      m,
      c;
  value = abs(value);
  if (value != value || value === Infinity) {
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if (value * (c = pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8) {}
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8) {}
  buffer[--i] |= s * 128;
  return buffer;
};
var unpackIEEE754 = function unpackIEEE754(buffer, mLen, nBytes) {
  var eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = eLen - 7,
      i = nBytes - 1,
      s = buffer[i--],
      e = s & 127,
      m;
  s >>= 7;
  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8) {}
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8) {}
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  }return (s ? -1 : 1) * m * pow(2, e - mLen);
};

var unpackI32 = function unpackI32(bytes) {
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
};
var packI8 = function packI8(it) {
  return [it & 0xff];
};
var packI16 = function packI16(it) {
  return [it & 0xff, it >> 8 & 0xff];
};
var packI32 = function packI32(it) {
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
};
var packF64 = function packF64(it) {
  return packIEEE754(it, 52, 8);
};
var packF32 = function packF32(it) {
  return packIEEE754(it, 23, 4);
};

var addGetter = function addGetter(C, key, internal) {
  dP(C[PROTOTYPE], key, { get: function get() {
      return this[internal];
    } });
};

var get = function get(view, bytes, index, isLittleEndian) {
  var numIndex = +index,
      intIndex = toInteger(numIndex);
  if (numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b,
      start = intIndex + view[$OFFSET],
      pack = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
};
var set = function set(view, bytes, index, conversion, value, isLittleEndian) {
  var numIndex = +index,
      intIndex = toInteger(numIndex);
  if (numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b,
      start = intIndex + view[$OFFSET],
      pack = conversion(+value);
  for (var i = 0; i < bytes; i++) {
    store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
  }
};

var validateArrayBufferArguments = function validateArrayBufferArguments(that, length) {
  anInstance(that, $ArrayBuffer, ARRAY_BUFFER);
  var numberLength = +length,
      byteLength = toLength(numberLength);
  if (numberLength != byteLength) throw RangeError(WRONG_LENGTH);
  return byteLength;
};

if (!$typed.ABV) {
  $ArrayBuffer = function ArrayBuffer(length) {
    var byteLength = validateArrayBufferArguments(this, length);
    this._b = arrayFill.call(Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH],
        offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /*, littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /*, littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /*, littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /*, littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /*, littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /*, littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /*, littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /*, littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /*, littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /*, littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /*, littleEndian */) {
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /*, littleEndian */) {
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if (!fails(function () {
    new $ArrayBuffer(); // eslint-disable-line no-new
  }) || !fails(function () {
    new $ArrayBuffer(.5); // eslint-disable-line no-new
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      return new BaseBuffer(validateArrayBufferArguments(this, length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
    };
    if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2)),
      $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;

},{"./_an-instance":26,"./_array-fill":29,"./_descriptors":48,"./_fails":54,"./_global":58,"./_hide":60,"./_library":78,"./_object-dp":87,"./_object-gopn":92,"./_redefine-all":106,"./_set-to-string-tag":112,"./_to-integer":126,"./_to-length":128,"./_typed":133}],133:[function(require,module,exports){
'use strict';

var global = require('./_global'),
    hide = require('./_hide'),
    uid = require('./_uid'),
    TYPED = uid('typed_array'),
    VIEW = uid('view'),
    ABV = !!(global.ArrayBuffer && global.DataView),
    CONSTR = ABV,
    i = 0,
    l = 9,
    Typed;

var TypedArrayConstructors = 'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'.split(',');

while (i < l) {
  if (Typed = global[TypedArrayConstructors[i++]]) {
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV: ABV,
  CONSTR: CONSTR,
  TYPED: TYPED,
  VIEW: VIEW
};

},{"./_global":58,"./_hide":60,"./_uid":134}],134:[function(require,module,exports){
'use strict';

var id = 0,
    px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],135:[function(require,module,exports){
'use strict';

var global = require('./_global'),
    core = require('./_core'),
    LIBRARY = require('./_library'),
    wksExt = require('./_wks-ext'),
    defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_core":43,"./_global":58,"./_library":78,"./_object-dp":87,"./_wks-ext":136}],136:[function(require,module,exports){
'use strict';

exports.f = require('./_wks');

},{"./_wks":137}],137:[function(require,module,exports){
'use strict';

var store = require('./_shared')('wks'),
    uid = require('./_uid'),
    _Symbol = require('./_global').Symbol,
    USE_SYMBOL = typeof _Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":58,"./_shared":114,"./_uid":134}],138:[function(require,module,exports){
'use strict';

var classof = require('./_classof'),
    ITERATOR = require('./_wks')('iterator'),
    Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};

},{"./_classof":37,"./_core":43,"./_iterators":76,"./_wks":137}],139:[function(require,module,exports){
'use strict';

// https://github.com/benjamingr/RexExp.escape
var $export = require('./_export'),
    $re = require('./_replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', { escape: function escape(it) {
    return $re(it);
  } });

},{"./_export":52,"./_replacer":108}],140:[function(require,module,exports){
'use strict';

// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { copyWithin: require('./_array-copy-within') });

require('./_add-to-unscopables')('copyWithin');

},{"./_add-to-unscopables":25,"./_array-copy-within":28,"./_export":52}],141:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    $every = require('./_array-methods')(4);

$export($export.P + $export.F * !require('./_strict-method')([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":32,"./_export":52,"./_strict-method":116}],142:[function(require,module,exports){
'use strict';

// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { fill: require('./_array-fill') });

require('./_add-to-unscopables')('fill');

},{"./_add-to-unscopables":25,"./_array-fill":29,"./_export":52}],143:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    $filter = require('./_array-methods')(2);

$export($export.P + $export.F * !require('./_strict-method')([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":32,"./_export":52,"./_strict-method":116}],144:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)

var $export = require('./_export'),
    $find = require('./_array-methods')(6),
    KEY = 'findIndex',
    forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () {
  forced = false;
});
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /*, that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_add-to-unscopables":25,"./_array-methods":32,"./_export":52}],145:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)

var $export = require('./_export'),
    $find = require('./_array-methods')(5),
    KEY = 'find',
    forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () {
  forced = false;
});
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /*, that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_add-to-unscopables":25,"./_array-methods":32,"./_export":52}],146:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    $forEach = require('./_array-methods')(0),
    STRICT = require('./_strict-method')([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":32,"./_export":52,"./_strict-method":116}],147:[function(require,module,exports){
'use strict';

var ctx = require('./_ctx'),
    $export = require('./_export'),
    toObject = require('./_to-object'),
    call = require('./_iter-call'),
    isArrayIter = require('./_is-array-iter'),
    toLength = require('./_to-length'),
    createProperty = require('./_create-property'),
    getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) {
  Array.from(iter);
}), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /*, mapfn = undefined, thisArg = undefined*/) {
    var O = toObject(arrayLike),
        C = typeof this == 'function' ? this : Array,
        aLen = arguments.length,
        mapfn = aLen > 1 ? arguments[1] : undefined,
        mapping = mapfn !== undefined,
        index = 0,
        iterFn = getIterFn(O),
        length,
        result,
        step,
        iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":44,"./_ctx":45,"./_export":52,"./_is-array-iter":66,"./_iter-call":71,"./_iter-detect":74,"./_to-length":128,"./_to-object":129,"./core.get-iterator-method":138}],148:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    $indexOf = require('./_array-includes')(false),
    $native = [].indexOf,
    NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /*, fromIndex = 0 */) {
    return NEGATIVE_ZERO
    // convert -0 to +0
    ? $native.apply(this, arguments) || 0 : $indexOf(this, searchElement, arguments[1]);
  }
});

},{"./_array-includes":31,"./_export":52,"./_strict-method":116}],149:[function(require,module,exports){
'use strict';

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = require('./_export');

$export($export.S, 'Array', { isArray: require('./_is-array') });

},{"./_export":52,"./_is-array":67}],150:[function(require,module,exports){
'use strict';

var addToUnscopables = require('./_add-to-unscopables'),
    step = require('./_iter-step'),
    Iterators = require('./_iterators'),
    toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0; // next index
  this._k = kind; // kind
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t,
      kind = this._k,
      index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":25,"./_iter-define":73,"./_iter-step":75,"./_iterators":76,"./_to-iobject":127}],151:[function(require,module,exports){
'use strict';
// 22.1.3.13 Array.prototype.join(separator)

var $export = require('./_export'),
    toIObject = require('./_to-iobject'),
    arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (require('./_iobject') != Object || !require('./_strict-method')(arrayJoin)), 'Array', {
  join: function join(separator) {
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});

},{"./_export":52,"./_iobject":65,"./_strict-method":116,"./_to-iobject":127}],152:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    toIObject = require('./_to-iobject'),
    toInteger = require('./_to-integer'),
    toLength = require('./_to-length'),
    $native = [].lastIndexOf,
    NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /*, fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO) return $native.apply(this, arguments) || 0;
    var O = toIObject(this),
        length = toLength(O.length),
        index = length - 1;
    if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
    if (index < 0) index = length + index;
    for (; index >= 0; index--) {
      if (index in O) if (O[index] === searchElement) return index || 0;
    }return -1;
  }
});

},{"./_export":52,"./_strict-method":116,"./_to-integer":126,"./_to-iobject":127,"./_to-length":128}],153:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    $map = require('./_array-methods')(1);

$export($export.P + $export.F * !require('./_strict-method')([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":32,"./_export":52,"./_strict-method":116}],154:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    createProperty = require('./_create-property');

// WebKit Array.of isn't generic
$export($export.S + $export.F * require('./_fails')(function () {
  function F() {}
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of() /* ...args */{
    var index = 0,
        aLen = arguments.length,
        result = new (typeof this == 'function' ? this : Array)(aLen);
    while (aLen > index) {
      createProperty(result, index, arguments[index++]);
    }result.length = aLen;
    return result;
  }
});

},{"./_create-property":44,"./_export":52,"./_fails":54}],155:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});

},{"./_array-reduce":33,"./_export":52,"./_strict-method":116}],156:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});

},{"./_array-reduce":33,"./_export":52,"./_strict-method":116}],157:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    html = require('./_html'),
    cof = require('./_cof'),
    toIndex = require('./_to-index'),
    toLength = require('./_to-length'),
    arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * require('./_fails')(function () {
  if (html) arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end) {
    var len = toLength(this.length),
        klass = cof(this);
    end = end === undefined ? len : end;
    if (klass == 'Array') return arraySlice.call(this, begin, end);
    var start = toIndex(begin, len),
        upTo = toIndex(end, len),
        size = toLength(upTo - start),
        cloned = Array(size),
        i = 0;
    for (; i < size; i++) {
      cloned[i] = klass == 'String' ? this.charAt(start + i) : this[start + i];
    }return cloned;
  }
});

},{"./_cof":38,"./_export":52,"./_fails":54,"./_html":61,"./_to-index":125,"./_to-length":128}],158:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    $some = require('./_array-methods')(3);

$export($export.P + $export.F * !require('./_strict-method')([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":32,"./_export":52,"./_strict-method":116}],159:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    aFunction = require('./_a-function'),
    toObject = require('./_to-object'),
    fails = require('./_fails'),
    $sort = [].sort,
    test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !require('./_strict-method')($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined ? $sort.call(toObject(this)) : $sort.call(toObject(this), aFunction(comparefn));
  }
});

},{"./_a-function":23,"./_export":52,"./_fails":54,"./_strict-method":116,"./_to-object":129}],160:[function(require,module,exports){
'use strict';

require('./_set-species')('Array');

},{"./_set-species":111}],161:[function(require,module,exports){
'use strict';

// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = require('./_export');

$export($export.S, 'Date', { now: function now() {
    return new Date().getTime();
  } });

},{"./_export":52}],162:[function(require,module,exports){
'use strict';
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()

var $export = require('./_export'),
    fails = require('./_fails'),
    getTime = Date.prototype.getTime;

var lz = function lz(num) {
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (fails(function () {
  return new Date(-5e13 - 1).toISOString() != '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  new Date(NaN).toISOString();
})), 'Date', {
  toISOString: function toISOString() {
    if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
    var d = this,
        y = d.getUTCFullYear(),
        m = d.getUTCMilliseconds(),
        s = y < 0 ? '-' : y > 9999 ? '+' : '';
    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) + '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) + 'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) + ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
  }
});

},{"./_export":52,"./_fails":54}],163:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    toObject = require('./_to-object'),
    toPrimitive = require('./_to-primitive');

$export($export.P + $export.F * require('./_fails')(function () {
  return new Date(NaN).toJSON() !== null || Date.prototype.toJSON.call({ toISOString: function toISOString() {
      return 1;
    } }) !== 1;
}), 'Date', {
  toJSON: function toJSON(key) {
    var O = toObject(this),
        pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});

},{"./_export":52,"./_fails":54,"./_to-object":129,"./_to-primitive":130}],164:[function(require,module,exports){
'use strict';

var TO_PRIMITIVE = require('./_wks')('toPrimitive'),
    proto = Date.prototype;

if (!(TO_PRIMITIVE in proto)) require('./_hide')(proto, TO_PRIMITIVE, require('./_date-to-primitive'));

},{"./_date-to-primitive":46,"./_hide":60,"./_wks":137}],165:[function(require,module,exports){
'use strict';

var DateProto = Date.prototype,
    INVALID_DATE = 'Invalid Date',
    TO_STRING = 'toString',
    $toString = DateProto[TO_STRING],
    getTime = DateProto.getTime;
if (new Date(NaN) + '' != INVALID_DATE) {
  require('./_redefine')(DateProto, TO_STRING, function toString() {
    var value = getTime.call(this);
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}

},{"./_redefine":107}],166:[function(require,module,exports){
'use strict';

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = require('./_export');

$export($export.P, 'Function', { bind: require('./_bind') });

},{"./_bind":36,"./_export":52}],167:[function(require,module,exports){
'use strict';

var isObject = require('./_is-object'),
    getPrototypeOf = require('./_object-gpo'),
    HAS_INSTANCE = require('./_wks')('hasInstance'),
    FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if (!(HAS_INSTANCE in FunctionProto)) require('./_object-dp').f(FunctionProto, HAS_INSTANCE, { value: function value(O) {
    if (typeof this != 'function' || !isObject(O)) return false;
    if (!isObject(this.prototype)) return O instanceof this;
    // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
    while (O = getPrototypeOf(O)) {
      if (this.prototype === O) return true;
    }return false;
  } });

},{"./_is-object":69,"./_object-dp":87,"./_object-gpo":94,"./_wks":137}],168:[function(require,module,exports){
'use strict';

var dP = require('./_object-dp').f,
    createDesc = require('./_property-desc'),
    has = require('./_has'),
    FProto = Function.prototype,
    nameRE = /^\s*function ([^ (]*)/,
    NAME = 'name';

var isExtensible = Object.isExtensible || function () {
  return true;
};

// 19.2.4.2 name
NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function get() {
    try {
      var that = this,
          name = ('' + that).match(nameRE)[1];
      has(that, NAME) || !isExtensible(that) || dP(that, NAME, createDesc(5, name));
      return name;
    } catch (e) {
      return '';
    }
  }
});

},{"./_descriptors":48,"./_has":59,"./_object-dp":87,"./_property-desc":105}],169:[function(require,module,exports){
'use strict';

var strong = require('./_collection-strong');

// 23.1 Map Objects
module.exports = require('./_collection')('Map', function (get) {
  return function Map() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);

},{"./_collection":42,"./_collection-strong":39}],170:[function(require,module,exports){
'use strict';

// 20.2.2.3 Math.acosh(x)
var $export = require('./_export'),
    log1p = require('./_math-log1p'),
    sqrt = Math.sqrt,
    $acosh = Math.acosh;

$export($export.S + $export.F * !($acosh
// V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
&& Math.floor($acosh(Number.MAX_VALUE)) == 710
// Tor Browser bug: Math.acosh(Infinity) -> NaN 
&& $acosh(Infinity) == Infinity), 'Math', {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156 ? Math.log(x) + Math.LN2 : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});

},{"./_export":52,"./_math-log1p":80}],171:[function(require,module,exports){
'use strict';

// 20.2.2.5 Math.asinh(x)
var $export = require('./_export'),
    $asinh = Math.asinh;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0 
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', { asinh: asinh });

},{"./_export":52}],172:[function(require,module,exports){
'use strict';

// 20.2.2.7 Math.atanh(x)
var $export = require('./_export'),
    $atanh = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0 
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});

},{"./_export":52}],173:[function(require,module,exports){
'use strict';

// 20.2.2.9 Math.cbrt(x)
var $export = require('./_export'),
    sign = require('./_math-sign');

$export($export.S, 'Math', {
  cbrt: function cbrt(x) {
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});

},{"./_export":52,"./_math-sign":81}],174:[function(require,module,exports){
'use strict';

// 20.2.2.11 Math.clz32(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});

},{"./_export":52}],175:[function(require,module,exports){
'use strict';

// 20.2.2.12 Math.cosh(x)
var $export = require('./_export'),
    exp = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x) {
    return (exp(x = +x) + exp(-x)) / 2;
  }
});

},{"./_export":52}],176:[function(require,module,exports){
'use strict';

// 20.2.2.14 Math.expm1(x)
var $export = require('./_export'),
    $expm1 = require('./_math-expm1');

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', { expm1: $expm1 });

},{"./_export":52,"./_math-expm1":79}],177:[function(require,module,exports){
'use strict';

// 20.2.2.16 Math.fround(x)
var $export = require('./_export'),
    sign = require('./_math-sign'),
    pow = Math.pow,
    EPSILON = pow(2, -52),
    EPSILON32 = pow(2, -23),
    MAX32 = pow(2, 127) * (2 - EPSILON32),
    MIN32 = pow(2, -126);

var roundTiesToEven = function roundTiesToEven(n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

$export($export.S, 'Math', {
  fround: function fround(x) {
    var $abs = Math.abs(x),
        $sign = sign(x),
        a,
        result;
    if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if (result > MAX32 || result != result) return $sign * Infinity;
    return $sign * result;
  }
});

},{"./_export":52,"./_math-sign":81}],178:[function(require,module,exports){
'use strict';

// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = require('./_export'),
    abs = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2) {
    // eslint-disable-line no-unused-vars
    var sum = 0,
        i = 0,
        aLen = arguments.length,
        larg = 0,
        arg,
        div;
    while (i < aLen) {
      arg = abs(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});

},{"./_export":52}],179:[function(require,module,exports){
'use strict';

// 20.2.2.18 Math.imul(x, y)
var $export = require('./_export'),
    $imul = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * require('./_fails')(function () {
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y) {
    var UINT16 = 0xffff,
        xn = +x,
        yn = +y,
        xl = UINT16 & xn,
        yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

},{"./_export":52,"./_fails":54}],180:[function(require,module,exports){
'use strict';

// 20.2.2.21 Math.log10(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log10: function log10(x) {
    return Math.log(x) / Math.LN10;
  }
});

},{"./_export":52}],181:[function(require,module,exports){
'use strict';

// 20.2.2.20 Math.log1p(x)
var $export = require('./_export');

$export($export.S, 'Math', { log1p: require('./_math-log1p') });

},{"./_export":52,"./_math-log1p":80}],182:[function(require,module,exports){
'use strict';

// 20.2.2.22 Math.log2(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log2: function log2(x) {
    return Math.log(x) / Math.LN2;
  }
});

},{"./_export":52}],183:[function(require,module,exports){
'use strict';

// 20.2.2.28 Math.sign(x)
var $export = require('./_export');

$export($export.S, 'Math', { sign: require('./_math-sign') });

},{"./_export":52,"./_math-sign":81}],184:[function(require,module,exports){
'use strict';

// 20.2.2.30 Math.sinh(x)
var $export = require('./_export'),
    expm1 = require('./_math-expm1'),
    exp = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * require('./_fails')(function () {
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x) {
    return Math.abs(x = +x) < 1 ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});

},{"./_export":52,"./_fails":54,"./_math-expm1":79}],185:[function(require,module,exports){
'use strict';

// 20.2.2.33 Math.tanh(x)
var $export = require('./_export'),
    expm1 = require('./_math-expm1'),
    exp = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x) {
    var a = expm1(x = +x),
        b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});

},{"./_export":52,"./_math-expm1":79}],186:[function(require,module,exports){
'use strict';

// 20.2.2.34 Math.trunc(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});

},{"./_export":52}],187:[function(require,module,exports){
'use strict';

var global = require('./_global'),
    has = require('./_has'),
    cof = require('./_cof'),
    inheritIfRequired = require('./_inherit-if-required'),
    toPrimitive = require('./_to-primitive'),
    fails = require('./_fails'),
    gOPN = require('./_object-gopn').f,
    gOPD = require('./_object-gopd').f,
    dP = require('./_object-dp').f,
    $trim = require('./_string-trim').trim,
    NUMBER = 'Number',
    $Number = global[NUMBER],
    Base = $Number,
    proto = $Number.prototype
// Opera ~12 has broken Object#toString
,
    BROKEN_COF = cof(require('./_object-create')(proto)) == NUMBER,
    TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function toNumber(argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0),
        third,
        radix,
        maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66:case 98:
          radix = 2;maxCode = 49;break; // fast equal /^0b[01]+$/i
        case 79:case 111:
          radix = 8;maxCode = 55;break; // fast equal /^0o[0-7]+$/i
        default:
          return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      }return parseInt(digits, radix);
    }
  }return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value,
        that = this;
    return that instanceof $Number
    // check on 1..constructor(foo) case
    && (BROKEN_COF ? fails(function () {
      proto.valueOf.call(that);
    }) : cof(that) != NUMBER) ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = require('./_descriptors') ? gOPN(Base) : (
  // ES3:
  'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
  // ES6 (in case, if modules with ES6 Number statics required before):
  'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' + 'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger').split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./_redefine')(global, NUMBER, $Number);
}

},{"./_cof":38,"./_descriptors":48,"./_fails":54,"./_global":58,"./_has":59,"./_inherit-if-required":63,"./_object-create":86,"./_object-dp":87,"./_object-gopd":90,"./_object-gopn":92,"./_redefine":107,"./_string-trim":122,"./_to-primitive":130}],188:[function(require,module,exports){
'use strict';

// 20.1.2.1 Number.EPSILON
var $export = require('./_export');

$export($export.S, 'Number', { EPSILON: Math.pow(2, -52) });

},{"./_export":52}],189:[function(require,module,exports){
'use strict';

// 20.1.2.2 Number.isFinite(number)
var $export = require('./_export'),
    _isFinite = require('./_global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});

},{"./_export":52,"./_global":58}],190:[function(require,module,exports){
'use strict';

// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', { isInteger: require('./_is-integer') });

},{"./_export":52,"./_is-integer":68}],191:[function(require,module,exports){
'use strict';

// 20.1.2.4 Number.isNaN(number)
var $export = require('./_export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    return number != number;
  }
});

},{"./_export":52}],192:[function(require,module,exports){
'use strict';

// 20.1.2.5 Number.isSafeInteger(number)
var $export = require('./_export'),
    isInteger = require('./_is-integer'),
    abs = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number) {
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});

},{"./_export":52,"./_is-integer":68}],193:[function(require,module,exports){
'use strict';

// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });

},{"./_export":52}],194:[function(require,module,exports){
'use strict';

// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });

},{"./_export":52}],195:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    $parseFloat = require('./_parse-float');
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', { parseFloat: $parseFloat });

},{"./_export":52,"./_parse-float":101}],196:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    $parseInt = require('./_parse-int');
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });

},{"./_export":52,"./_parse-int":102}],197:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    toInteger = require('./_to-integer'),
    aNumberValue = require('./_a-number-value'),
    repeat = require('./_string-repeat'),
    $toFixed = 1..toFixed,
    floor = Math.floor,
    data = [0, 0, 0, 0, 0, 0],
    ERROR = 'Number.toFixed: incorrect invocation!',
    ZERO = '0';

var multiply = function multiply(n, c) {
  var i = -1,
      c2 = c;
  while (++i < 6) {
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function divide(n) {
  var i = 6,
      c = 0;
  while (--i >= 0) {
    c += data[i];
    data[i] = floor(c / n);
    c = c % n * 1e7;
  }
};
var numToString = function numToString() {
  var i = 6,
      s = '';
  while (--i >= 0) {
    if (s !== '' || i === 0 || data[i] !== 0) {
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  }return s;
};
var pow = function pow(x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function log(x) {
  var n = 0,
      x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  }return n;
};

$export($export.P + $export.F * (!!$toFixed && (0.00008.toFixed(3) !== '0.000' || 0.9.toFixed(0) !== '1' || 1.255.toFixed(2) !== '1.25' || 1000000000000000128..toFixed(0) !== '1000000000000000128') || !require('./_fails')(function () {
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits) {
    var x = aNumberValue(this, ERROR),
        f = toInteger(fractionDigits),
        s = '',
        m = ZERO,
        e,
        z,
        j,
        k;
    if (f < 0 || f > 20) throw RangeError(ERROR);
    if (x != x) return 'NaN';
    if (x <= -1e21 || x >= 1e21) return String(x);
    if (x < 0) {
      s = '-';
      x = -x;
    }
    if (x > 1e-21) {
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(0, z);
        j = f;
        while (j >= 7) {
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if (f > 0) {
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    }return m;
  }
});

},{"./_a-number-value":24,"./_export":52,"./_fails":54,"./_string-repeat":121,"./_to-integer":126}],198:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    $fails = require('./_fails'),
    aNumberValue = require('./_a-number-value'),
    $toPrecision = 1..toPrecision;

$export($export.P + $export.F * ($fails(function () {
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function () {
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision) {
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision);
  }
});

},{"./_a-number-value":24,"./_export":52,"./_fails":54}],199:[function(require,module,exports){
'use strict';

// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":52,"./_object-assign":85}],200:[function(require,module,exports){
'use strict';

var $export = require('./_export');
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: require('./_object-create') });

},{"./_export":52,"./_object-create":86}],201:[function(require,module,exports){
'use strict';

var $export = require('./_export');
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperties: require('./_object-dps') });

},{"./_descriptors":48,"./_export":52,"./_object-dps":88}],202:[function(require,module,exports){
'use strict';

var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_descriptors":48,"./_export":52,"./_object-dp":87}],203:[function(require,module,exports){
'use strict';

// 19.1.2.5 Object.freeze(O)
var isObject = require('./_is-object'),
    meta = require('./_meta').onFreeze;

require('./_object-sap')('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});

},{"./_is-object":69,"./_meta":82,"./_object-sap":98}],204:[function(require,module,exports){
'use strict';

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./_to-iobject'),
    $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

},{"./_object-gopd":90,"./_object-sap":98,"./_to-iobject":127}],205:[function(require,module,exports){
'use strict';

// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./_object-sap')('getOwnPropertyNames', function () {
  return require('./_object-gopn-ext').f;
});

},{"./_object-gopn-ext":91,"./_object-sap":98}],206:[function(require,module,exports){
'use strict';

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = require('./_to-object'),
    $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});

},{"./_object-gpo":94,"./_object-sap":98,"./_to-object":129}],207:[function(require,module,exports){
'use strict';

// 19.1.2.11 Object.isExtensible(O)
var isObject = require('./_is-object');

require('./_object-sap')('isExtensible', function ($isExtensible) {
  return function isExtensible(it) {
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});

},{"./_is-object":69,"./_object-sap":98}],208:[function(require,module,exports){
'use strict';

// 19.1.2.12 Object.isFrozen(O)
var isObject = require('./_is-object');

require('./_object-sap')('isFrozen', function ($isFrozen) {
  return function isFrozen(it) {
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});

},{"./_is-object":69,"./_object-sap":98}],209:[function(require,module,exports){
'use strict';

// 19.1.2.13 Object.isSealed(O)
var isObject = require('./_is-object');

require('./_object-sap')('isSealed', function ($isSealed) {
  return function isSealed(it) {
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});

},{"./_is-object":69,"./_object-sap":98}],210:[function(require,module,exports){
'use strict';

// 19.1.3.10 Object.is(value1, value2)
var $export = require('./_export');
$export($export.S, 'Object', { is: require('./_same-value') });

},{"./_export":52,"./_same-value":109}],211:[function(require,module,exports){
'use strict';

// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object'),
    $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_object-keys":96,"./_object-sap":98,"./_to-object":129}],212:[function(require,module,exports){
'use strict';

// 19.1.2.15 Object.preventExtensions(O)
var isObject = require('./_is-object'),
    meta = require('./_meta').onFreeze;

require('./_object-sap')('preventExtensions', function ($preventExtensions) {
  return function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});

},{"./_is-object":69,"./_meta":82,"./_object-sap":98}],213:[function(require,module,exports){
'use strict';

// 19.1.2.17 Object.seal(O)
var isObject = require('./_is-object'),
    meta = require('./_meta').onFreeze;

require('./_object-sap')('seal', function ($seal) {
  return function seal(it) {
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});

},{"./_is-object":69,"./_meta":82,"./_object-sap":98}],214:[function(require,module,exports){
'use strict';

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', { setPrototypeOf: require('./_set-proto').set });

},{"./_export":52,"./_set-proto":110}],215:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()

var classof = require('./_classof'),
    test = {};
test[require('./_wks')('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  require('./_redefine')(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}

},{"./_classof":37,"./_redefine":107,"./_wks":137}],216:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    $parseFloat = require('./_parse-float');
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), { parseFloat: $parseFloat });

},{"./_export":52,"./_parse-float":101}],217:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    $parseInt = require('./_parse-int');
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });

},{"./_export":52,"./_parse-int":102}],218:[function(require,module,exports){
'use strict';

var LIBRARY = require('./_library'),
    global = require('./_global'),
    ctx = require('./_ctx'),
    classof = require('./_classof'),
    $export = require('./_export'),
    isObject = require('./_is-object'),
    aFunction = require('./_a-function'),
    anInstance = require('./_an-instance'),
    forOf = require('./_for-of'),
    speciesConstructor = require('./_species-constructor'),
    task = require('./_task').set,
    microtask = require('./_microtask')(),
    PROMISE = 'Promise',
    TypeError = global.TypeError,
    process = global.process,
    $Promise = global[PROMISE],
    process = global.process,
    isNode = classof(process) == 'process',
    empty = function empty() {/* empty */},
    Internal,
    GenericPromiseCapability,
    Wrapper;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1),
        FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) {/* empty */}
}();

// helpers
var sameConstructor = function sameConstructor(a, b) {
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function isThenable(it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function newPromiseCapability(C) {
  return sameConstructor($Promise, C) ? new PromiseCapability(C) : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function GenericPromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
};
var perform = function perform(exec) {
  try {
    exec();
  } catch (e) {
    return { error: e };
  }
};
var notify = function notify(promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v,
        ok = promise._s == 1,
        i = 0;
    var run = function run(reaction) {
      var handler = ok ? reaction.ok : reaction.fail,
          resolve = reaction.resolve,
          reject = reaction.reject,
          domain = reaction.domain,
          result,
          then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) {
      run(chain[i++]);
    } // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function onUnhandled(promise) {
  task.call(global, function () {
    var value = promise._v,
        abrupt,
        handler,
        console;
    if (isUnhandled(promise)) {
      abrupt = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {}
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    }promise._a = undefined;
    if (abrupt) throw abrupt.error;
  });
};
var isUnhandled = function isUnhandled(promise) {
  if (promise._h == 1) return false;
  var chain = promise._a || promise._c,
      i = 0,
      reaction;
  while (chain.length > i) {
    reaction = chain[i++];
    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
  }return true;
};
var onHandleUnhandled = function onHandleUnhandled(promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function $reject(value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function $resolve(value) {
  var promise = this,
      then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor) {
    this._c = []; // <- awaiting reactions
    this._a = undefined; // <- checked in isUnhandled reactions
    this._s = 0; // <- state
    this._d = false; // <- done
    this._v = undefined; // <- value
    this._h = 0; // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false; // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function _catch(onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function PromiseCapability() {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this),
        $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if (x instanceof $Promise && sameConstructor(x.constructor, this)) return x;
    var capability = newPromiseCapability(this),
        $$resolve = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this,
        capability = newPromiseCapability(C),
        resolve = capability.resolve,
        reject = capability.reject;
    var abrupt = perform(function () {
      var values = [],
          index = 0,
          remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++,
            alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (abrupt) reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this,
        capability = newPromiseCapability(C),
        reject = capability.reject;
    var abrupt = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (abrupt) reject(abrupt.error);
    return capability.promise;
  }
});

},{"./_a-function":23,"./_an-instance":26,"./_classof":37,"./_core":43,"./_ctx":45,"./_export":52,"./_for-of":57,"./_global":58,"./_is-object":69,"./_iter-detect":74,"./_library":78,"./_microtask":84,"./_redefine-all":106,"./_set-species":111,"./_set-to-string-tag":112,"./_species-constructor":115,"./_task":124,"./_wks":137}],219:[function(require,module,exports){
'use strict';

// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export = require('./_export'),
    aFunction = require('./_a-function'),
    anObject = require('./_an-object'),
    rApply = (require('./_global').Reflect || {}).apply,
    fApply = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !require('./_fails')(function () {
  rApply(function () {});
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList) {
    var T = aFunction(target),
        L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});

},{"./_a-function":23,"./_an-object":27,"./_export":52,"./_fails":54,"./_global":58}],220:[function(require,module,exports){
'use strict';

// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export = require('./_export'),
    create = require('./_object-create'),
    aFunction = require('./_a-function'),
    anObject = require('./_an-object'),
    isObject = require('./_is-object'),
    fails = require('./_fails'),
    bind = require('./_bind'),
    rConstruct = (require('./_global').Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() {}
  return !(rConstruct(function () {}, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  rConstruct(function () {});
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /*, newTarget*/) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0:
          return new Target();
        case 1:
          return new Target(args[0]);
        case 2:
          return new Target(args[0], args[1]);
        case 3:
          return new Target(args[0], args[1], args[2]);
        case 4:
          return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype,
        instance = create(isObject(proto) ? proto : Object.prototype),
        result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

},{"./_a-function":23,"./_an-object":27,"./_bind":36,"./_export":52,"./_fails":54,"./_global":58,"./_is-object":69,"./_object-create":86}],221:[function(require,module,exports){
'use strict';

// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP = require('./_object-dp'),
    $export = require('./_export'),
    anObject = require('./_an-object'),
    toPrimitive = require('./_to-primitive');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./_fails')(function () {
  Reflect.defineProperty(dP.f({}, 1, { value: 1 }), 1, { value: 2 });
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_an-object":27,"./_export":52,"./_fails":54,"./_object-dp":87,"./_to-primitive":130}],222:[function(require,module,exports){
'use strict';

// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export = require('./_export'),
    gOPD = require('./_object-gopd').f,
    anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});

},{"./_an-object":27,"./_export":52,"./_object-gopd":90}],223:[function(require,module,exports){
'use strict';
// 26.1.5 Reflect.enumerate(target)

var $export = require('./_export'),
    anObject = require('./_an-object');
var Enumerate = function Enumerate(iterated) {
  this._t = anObject(iterated); // target
  this._i = 0; // next index
  var keys = this._k = [] // keys
  ,
      key;
  for (key in iterated) {
    keys.push(key);
  }
};
require('./_iter-create')(Enumerate, 'Object', function () {
  var that = this,
      keys = that._k,
      key;
  do {
    if (that._i >= keys.length) return { value: undefined, done: true };
  } while (!((key = keys[that._i++]) in that._t));
  return { value: key, done: false };
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target) {
    return new Enumerate(target);
  }
});

},{"./_an-object":27,"./_export":52,"./_iter-create":72}],224:[function(require,module,exports){
'use strict';

// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD = require('./_object-gopd'),
    $export = require('./_export'),
    anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return gOPD.f(anObject(target), propertyKey);
  }
});

},{"./_an-object":27,"./_export":52,"./_object-gopd":90}],225:[function(require,module,exports){
'use strict';

// 26.1.8 Reflect.getPrototypeOf(target)
var $export = require('./_export'),
    getProto = require('./_object-gpo'),
    anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target) {
    return getProto(anObject(target));
  }
});

},{"./_an-object":27,"./_export":52,"./_object-gpo":94}],226:[function(require,module,exports){
'use strict';

// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD = require('./_object-gopd'),
    getPrototypeOf = require('./_object-gpo'),
    has = require('./_has'),
    $export = require('./_export'),
    isObject = require('./_is-object'),
    anObject = require('./_an-object');

function get(target, propertyKey /*, receiver*/) {
  var receiver = arguments.length < 3 ? target : arguments[2],
      desc,
      proto;
  if (anObject(target) === receiver) return target[propertyKey];
  if (desc = gOPD.f(target, propertyKey)) return has(desc, 'value') ? desc.value : desc.get !== undefined ? desc.get.call(receiver) : undefined;
  if (isObject(proto = getPrototypeOf(target))) return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', { get: get });

},{"./_an-object":27,"./_export":52,"./_has":59,"./_is-object":69,"./_object-gopd":90,"./_object-gpo":94}],227:[function(require,module,exports){
'use strict';

// 26.1.9 Reflect.has(target, propertyKey)
var $export = require('./_export');

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});

},{"./_export":52}],228:[function(require,module,exports){
'use strict';

// 26.1.10 Reflect.isExtensible(target)
var $export = require('./_export'),
    anObject = require('./_an-object'),
    $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target) {
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});

},{"./_an-object":27,"./_export":52}],229:[function(require,module,exports){
'use strict';

// 26.1.11 Reflect.ownKeys(target)
var $export = require('./_export');

$export($export.S, 'Reflect', { ownKeys: require('./_own-keys') });

},{"./_export":52,"./_own-keys":100}],230:[function(require,module,exports){
'use strict';

// 26.1.12 Reflect.preventExtensions(target)
var $export = require('./_export'),
    anObject = require('./_an-object'),
    $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target) {
    anObject(target);
    try {
      if ($preventExtensions) $preventExtensions(target);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_an-object":27,"./_export":52}],231:[function(require,module,exports){
'use strict';

// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export = require('./_export'),
    setProto = require('./_set-proto');

if (setProto) $export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_export":52,"./_set-proto":110}],232:[function(require,module,exports){
'use strict';

// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP = require('./_object-dp'),
    gOPD = require('./_object-gopd'),
    getPrototypeOf = require('./_object-gpo'),
    has = require('./_has'),
    $export = require('./_export'),
    createDesc = require('./_property-desc'),
    anObject = require('./_an-object'),
    isObject = require('./_is-object');

function set(target, propertyKey, V /*, receiver*/) {
  var receiver = arguments.length < 4 ? target : arguments[3],
      ownDesc = gOPD.f(anObject(target), propertyKey),
      existingDescriptor,
      proto;
  if (!ownDesc) {
    if (isObject(proto = getPrototypeOf(target))) {
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if (has(ownDesc, 'value')) {
    if (ownDesc.writable === false || !isObject(receiver)) return false;
    existingDescriptor = gOPD.f(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    dP.f(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', { set: set });

},{"./_an-object":27,"./_export":52,"./_has":59,"./_is-object":69,"./_object-dp":87,"./_object-gopd":90,"./_object-gpo":94,"./_property-desc":105}],233:[function(require,module,exports){
'use strict';

var global = require('./_global'),
    inheritIfRequired = require('./_inherit-if-required'),
    dP = require('./_object-dp').f,
    gOPN = require('./_object-gopn').f,
    isRegExp = require('./_is-regexp'),
    $flags = require('./_flags'),
    $RegExp = global.RegExp,
    Base = $RegExp,
    proto = $RegExp.prototype,
    re1 = /a/g,
    re2 = /a/g
// "new" creates a new object, old webkit buggy here
,
    CORRECT_NEW = new $RegExp(re1) !== re1;

if (require('./_descriptors') && (!CORRECT_NEW || require('./_fails')(function () {
  re2[require('./_wks')('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp,
        piRE = isRegExp(p),
        fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p : inheritIfRequired(CORRECT_NEW ? new Base(piRE && !fiU ? p.source : p, f) : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f), tiRE ? this : proto, $RegExp);
  };
  var proxy = function proxy(key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function get() {
        return Base[key];
      },
      set: function set(it) {
        Base[key] = it;
      }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) {
    proxy(keys[i++]);
  }proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  require('./_redefine')(global, 'RegExp', $RegExp);
}

require('./_set-species')('RegExp');

},{"./_descriptors":48,"./_fails":54,"./_flags":56,"./_global":58,"./_inherit-if-required":63,"./_is-regexp":70,"./_object-dp":87,"./_object-gopn":92,"./_redefine":107,"./_set-species":111,"./_wks":137}],234:[function(require,module,exports){
'use strict';

// 21.2.5.3 get RegExp.prototype.flags()
if (require('./_descriptors') && /./g.flags != 'g') require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});

},{"./_descriptors":48,"./_flags":56,"./_object-dp":87}],235:[function(require,module,exports){
'use strict';

// @@match logic
require('./_fix-re-wks')('match', 1, function (defined, MATCH, $match) {
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp) {
    'use strict';

    var O = defined(this),
        fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});

},{"./_fix-re-wks":55}],236:[function(require,module,exports){
'use strict';

// @@replace logic
require('./_fix-re-wks')('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    'use strict';

    var O = defined(this),
        fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined ? fn.call(searchValue, O, replaceValue) : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});

},{"./_fix-re-wks":55}],237:[function(require,module,exports){
'use strict';

// @@search logic
require('./_fix-re-wks')('search', 1, function (defined, SEARCH, $search) {
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp) {
    'use strict';

    var O = defined(this),
        fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});

},{"./_fix-re-wks":55}],238:[function(require,module,exports){
'use strict';

// @@split logic
require('./_fix-re-wks')('split', 2, function (defined, SPLIT, $split) {
  'use strict';

  var isRegExp = require('./_is-regexp'),
      _split = $split,
      $push = [].push,
      $SPLIT = 'split',
      LENGTH = 'length',
      LAST_INDEX = 'lastIndex';
  if ('abbc'[$SPLIT](/(b)*/)[1] == 'c' || 'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 || 'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 || '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 || '.'[$SPLIT](/()()/)[LENGTH] > 1 || ''[$SPLIT](/.?/)[LENGTH]) {
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function $split(separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while (match = separatorCopy.exec(string)) {
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
            for (i = 1; i < arguments[LENGTH] - 2; i++) {
              if (arguments[i] === undefined) match[i] = undefined;
            }
          });
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
    // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    $split = function $split(separator, limit) {
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit) {
    var O = defined(this),
        fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});

},{"./_fix-re-wks":55,"./_is-regexp":70}],239:[function(require,module,exports){
'use strict';

require('./es6.regexp.flags');
var anObject = require('./_an-object'),
    $flags = require('./_flags'),
    DESCRIPTORS = require('./_descriptors'),
    TO_STRING = 'toString',
    $toString = /./[TO_STRING];

var define = function define(fn) {
  require('./_redefine')(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (require('./_fails')(function () {
  return $toString.call({ source: 'a', flags: 'b' }) != '/a/b';
})) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/', 'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
  // FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}

},{"./_an-object":27,"./_descriptors":48,"./_fails":54,"./_flags":56,"./_redefine":107,"./es6.regexp.flags":234}],240:[function(require,module,exports){
'use strict';

var strong = require('./_collection-strong');

// 23.2 Set Objects
module.exports = require('./_collection')('Set', function (get) {
  return function Set() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);

},{"./_collection":42,"./_collection-strong":39}],241:[function(require,module,exports){
'use strict';
// B.2.3.2 String.prototype.anchor(name)

require('./_string-html')('anchor', function (createHTML) {
  return function anchor(name) {
    return createHTML(this, 'a', 'name', name);
  };
});

},{"./_string-html":119}],242:[function(require,module,exports){
'use strict';
// B.2.3.3 String.prototype.big()

require('./_string-html')('big', function (createHTML) {
  return function big() {
    return createHTML(this, 'big', '', '');
  };
});

},{"./_string-html":119}],243:[function(require,module,exports){
'use strict';
// B.2.3.4 String.prototype.blink()

require('./_string-html')('blink', function (createHTML) {
  return function blink() {
    return createHTML(this, 'blink', '', '');
  };
});

},{"./_string-html":119}],244:[function(require,module,exports){
'use strict';
// B.2.3.5 String.prototype.bold()

require('./_string-html')('bold', function (createHTML) {
  return function bold() {
    return createHTML(this, 'b', '', '');
  };
});

},{"./_string-html":119}],245:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    $at = require('./_string-at')(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos) {
    return $at(this, pos);
  }
});

},{"./_export":52,"./_string-at":117}],246:[function(require,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';

var $export = require('./_export'),
    toLength = require('./_to-length'),
    context = require('./_string-context'),
    ENDS_WITH = 'endsWith',
    $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /*, endPosition = @length */) {
    var that = context(this, searchString, ENDS_WITH),
        endPosition = arguments.length > 1 ? arguments[1] : undefined,
        len = toLength(that.length),
        end = endPosition === undefined ? len : Math.min(toLength(endPosition), len),
        search = String(searchString);
    return $endsWith ? $endsWith.call(that, search, end) : that.slice(end - search.length, end) === search;
  }
});

},{"./_export":52,"./_fails-is-regexp":53,"./_string-context":118,"./_to-length":128}],247:[function(require,module,exports){
'use strict';
// B.2.3.6 String.prototype.fixed()

require('./_string-html')('fixed', function (createHTML) {
  return function fixed() {
    return createHTML(this, 'tt', '', '');
  };
});

},{"./_string-html":119}],248:[function(require,module,exports){
'use strict';
// B.2.3.7 String.prototype.fontcolor(color)

require('./_string-html')('fontcolor', function (createHTML) {
  return function fontcolor(color) {
    return createHTML(this, 'font', 'color', color);
  };
});

},{"./_string-html":119}],249:[function(require,module,exports){
'use strict';
// B.2.3.8 String.prototype.fontsize(size)

require('./_string-html')('fontsize', function (createHTML) {
  return function fontsize(size) {
    return createHTML(this, 'font', 'size', size);
  };
});

},{"./_string-html":119}],250:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    toIndex = require('./_to-index'),
    fromCharCode = String.fromCharCode,
    $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x) {
    // eslint-disable-line no-unused-vars
    var res = [],
        aLen = arguments.length,
        i = 0,
        code;
    while (aLen > i) {
      code = +arguments[i++];
      if (toIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000 ? fromCharCode(code) : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00));
    }return res.join('');
  }
});

},{"./_export":52,"./_to-index":125}],251:[function(require,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';

var $export = require('./_export'),
    context = require('./_string-context'),
    INCLUDES = 'includes';

$export($export.P + $export.F * require('./_fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /*, position = 0 */) {
    return !!~context(this, searchString, INCLUDES).indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"./_export":52,"./_fails-is-regexp":53,"./_string-context":118}],252:[function(require,module,exports){
'use strict';
// B.2.3.9 String.prototype.italics()

require('./_string-html')('italics', function (createHTML) {
  return function italics() {
    return createHTML(this, 'i', '', '');
  };
});

},{"./_string-html":119}],253:[function(require,module,exports){
'use strict';

var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0; // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t,
      index = this._i,
      point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":73,"./_string-at":117}],254:[function(require,module,exports){
'use strict';
// B.2.3.10 String.prototype.link(url)

require('./_string-html')('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});

},{"./_string-html":119}],255:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    toIObject = require('./_to-iobject'),
    toLength = require('./_to-length');

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite) {
    var tpl = toIObject(callSite.raw),
        len = toLength(tpl.length),
        aLen = arguments.length,
        res = [],
        i = 0;
    while (len > i) {
      res.push(String(tpl[i++]));
      if (i < aLen) res.push(String(arguments[i]));
    }return res.join('');
  }
});

},{"./_export":52,"./_to-iobject":127,"./_to-length":128}],256:[function(require,module,exports){
'use strict';

var $export = require('./_export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./_string-repeat')
});

},{"./_export":52,"./_string-repeat":121}],257:[function(require,module,exports){
'use strict';
// B.2.3.11 String.prototype.small()

require('./_string-html')('small', function (createHTML) {
  return function small() {
    return createHTML(this, 'small', '', '');
  };
});

},{"./_string-html":119}],258:[function(require,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';

var $export = require('./_export'),
    toLength = require('./_to-length'),
    context = require('./_string-context'),
    STARTS_WITH = 'startsWith',
    $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /*, position = 0 */) {
    var that = context(this, searchString, STARTS_WITH),
        index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length)),
        search = String(searchString);
    return $startsWith ? $startsWith.call(that, search, index) : that.slice(index, index + search.length) === search;
  }
});

},{"./_export":52,"./_fails-is-regexp":53,"./_string-context":118,"./_to-length":128}],259:[function(require,module,exports){
'use strict';
// B.2.3.12 String.prototype.strike()

require('./_string-html')('strike', function (createHTML) {
  return function strike() {
    return createHTML(this, 'strike', '', '');
  };
});

},{"./_string-html":119}],260:[function(require,module,exports){
'use strict';
// B.2.3.13 String.prototype.sub()

require('./_string-html')('sub', function (createHTML) {
  return function sub() {
    return createHTML(this, 'sub', '', '');
  };
});

},{"./_string-html":119}],261:[function(require,module,exports){
'use strict';
// B.2.3.14 String.prototype.sup()

require('./_string-html')('sup', function (createHTML) {
  return function sup() {
    return createHTML(this, 'sup', '', '');
  };
});

},{"./_string-html":119}],262:[function(require,module,exports){
'use strict';
// 21.1.3.25 String.prototype.trim()

require('./_string-trim')('trim', function ($trim) {
  return function trim() {
    return $trim(this, 3);
  };
});

},{"./_string-trim":122}],263:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var global = require('./_global'),
    has = require('./_has'),
    DESCRIPTORS = require('./_descriptors'),
    $export = require('./_export'),
    redefine = require('./_redefine'),
    META = require('./_meta').KEY,
    $fails = require('./_fails'),
    shared = require('./_shared'),
    setToStringTag = require('./_set-to-string-tag'),
    uid = require('./_uid'),
    wks = require('./_wks'),
    wksExt = require('./_wks-ext'),
    wksDefine = require('./_wks-define'),
    keyOf = require('./_keyof'),
    enumKeys = require('./_enum-keys'),
    isArray = require('./_is-array'),
    anObject = require('./_an-object'),
    toIObject = require('./_to-iobject'),
    toPrimitive = require('./_to-primitive'),
    createDesc = require('./_property-desc'),
    _create = require('./_object-create'),
    gOPNExt = require('./_object-gopn-ext'),
    $GOPD = require('./_object-gopd'),
    $DP = require('./_object-dp'),
    $keys = require('./_object-keys'),
    gOPD = $GOPD.f,
    dP = $DP.f,
    gOPN = gOPNExt.f,
    $Symbol = global.Symbol,
    $JSON = global.JSON,
    _stringify = $JSON && $JSON.stringify,
    PROTOTYPE = 'prototype',
    HIDDEN = wks('_hidden'),
    TO_PRIMITIVE = wks('toPrimitive'),
    isEnum = {}.propertyIsEnumerable,
    SymbolRegistry = shared('symbol-registry'),
    AllSymbols = shared('symbols'),
    OPSymbols = shared('op-symbols'),
    ObjectProto = Object[PROTOTYPE],
    USE_NATIVE = typeof $Symbol == 'function',
    QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function get() {
      return dP(this, 'a', { value: 7 }).a;
    }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function wrap(tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && _typeof($Symbol.iterator) == 'symbol' ? function (it) {
  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    }return setSymbolDesc(it, key, D);
  }return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P)),
      i = 0,
      l = keys.length,
      key;
  while (l > i) {
    $defineProperty(it, key = keys[i++], P[key]);
  }return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it)),
      result = [],
      i = 0,
      key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  }return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto,
      names = gOPN(IS_OP ? OPSymbols : toIObject(it)),
      result = [],
      i = 0,
      key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  }return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function _Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function $set(value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var symbols =
// 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'.split(','), i = 0; symbols.length > i;) {
  wks(symbols[i++]);
}for (var symbols = $keys(wks.store), i = 0; symbols.length > i;) {
  wksDefine(symbols[i++]);
}$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function _for(key) {
    return has(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key) {
    if (isSymbol(key)) return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function useSetter() {
    setter = true;
  },
  useSimple: function useSimple() {
    setter = false;
  }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    var args = [it],
        i = 1,
        replacer,
        $replacer;
    while (arguments.length > i) {
      args.push(arguments[i++]);
    }replacer = args[1];
    if (typeof replacer == 'function') $replacer = replacer;
    if ($replacer || !isArray(replacer)) replacer = function replacer(key, value) {
      if ($replacer) value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

},{"./_an-object":27,"./_descriptors":48,"./_enum-keys":51,"./_export":52,"./_fails":54,"./_global":58,"./_has":59,"./_hide":60,"./_is-array":67,"./_keyof":77,"./_library":78,"./_meta":82,"./_object-create":86,"./_object-dp":87,"./_object-gopd":90,"./_object-gopn":92,"./_object-gopn-ext":91,"./_object-gops":93,"./_object-keys":96,"./_object-pie":97,"./_property-desc":105,"./_redefine":107,"./_set-to-string-tag":112,"./_shared":114,"./_to-iobject":127,"./_to-primitive":130,"./_uid":134,"./_wks":137,"./_wks-define":135,"./_wks-ext":136}],264:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    $typed = require('./_typed'),
    buffer = require('./_typed-buffer'),
    anObject = require('./_an-object'),
    toIndex = require('./_to-index'),
    toLength = require('./_to-length'),
    isObject = require('./_is-object'),
    ArrayBuffer = require('./_global').ArrayBuffer,
    speciesConstructor = require('./_species-constructor'),
    $ArrayBuffer = buffer.ArrayBuffer,
    $DataView = buffer.DataView,
    $isView = $typed.ABV && ArrayBuffer.isView,
    $slice = $ArrayBuffer.prototype.slice,
    VIEW = $typed.VIEW,
    ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it) {
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * require('./_fails')(function () {
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end) {
    if ($slice !== undefined && end === undefined) return $slice.call(anObject(this), start); // FF fix
    var len = anObject(this).byteLength,
        first = toIndex(start, len),
        final = toIndex(end === undefined ? len : end, len),
        result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first)),
        viewS = new $DataView(this),
        viewT = new $DataView(result),
        index = 0;
    while (first < final) {
      viewT.setUint8(index++, viewS.getUint8(first++));
    }return result;
  }
});

require('./_set-species')(ARRAY_BUFFER);

},{"./_an-object":27,"./_export":52,"./_fails":54,"./_global":58,"./_is-object":69,"./_set-species":111,"./_species-constructor":115,"./_to-index":125,"./_to-length":128,"./_typed":133,"./_typed-buffer":132}],265:[function(require,module,exports){
'use strict';

var $export = require('./_export');
$export($export.G + $export.W + $export.F * !require('./_typed').ABV, {
  DataView: require('./_typed-buffer').DataView
});

},{"./_export":52,"./_typed":133,"./_typed-buffer":132}],266:[function(require,module,exports){
'use strict';

require('./_typed-array')('Float32', 4, function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":131}],267:[function(require,module,exports){
'use strict';

require('./_typed-array')('Float64', 8, function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":131}],268:[function(require,module,exports){
'use strict';

require('./_typed-array')('Int16', 2, function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":131}],269:[function(require,module,exports){
'use strict';

require('./_typed-array')('Int32', 4, function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":131}],270:[function(require,module,exports){
'use strict';

require('./_typed-array')('Int8', 1, function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":131}],271:[function(require,module,exports){
'use strict';

require('./_typed-array')('Uint16', 2, function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":131}],272:[function(require,module,exports){
'use strict';

require('./_typed-array')('Uint32', 4, function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":131}],273:[function(require,module,exports){
'use strict';

require('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":131}],274:[function(require,module,exports){
'use strict';

require('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);

},{"./_typed-array":131}],275:[function(require,module,exports){
'use strict';

var each = require('./_array-methods')(0),
    redefine = require('./_redefine'),
    meta = require('./_meta'),
    assign = require('./_object-assign'),
    weak = require('./_collection-weak'),
    isObject = require('./_is-object'),
    getWeak = meta.getWeak,
    isExtensible = Object.isExtensible,
    uncaughtFrozenStore = weak.ufstore,
    tmp = {},
    InternalMap;

var wrapper = function wrapper(get) {
  return function WeakMap() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key) {
    if (isObject(key)) {
      var data = getWeak(key);
      if (data === true) return uncaughtFrozenStore(this).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value) {
    return weak.def(this, key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = require('./_collection')('WeakMap', wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if (new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7) {
  InternalMap = weak.getConstructor(wrapper);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function (key) {
    var proto = $WeakMap.prototype,
        method = proto[key];
    redefine(proto, key, function (a, b) {
      // store frozen objects on internal weakmap shim
      if (isObject(a) && !isExtensible(a)) {
        if (!this._f) this._f = new InternalMap();
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
        // store all the rest on native weakmap
      }return method.call(this, a, b);
    });
  });
}

},{"./_array-methods":32,"./_collection":42,"./_collection-weak":41,"./_is-object":69,"./_meta":82,"./_object-assign":85,"./_redefine":107}],276:[function(require,module,exports){
'use strict';

var weak = require('./_collection-weak');

// 23.4 WeakSet Objects
require('./_collection')('WeakSet', function (get) {
  return function WeakSet() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value) {
    return weak.def(this, value, true);
  }
}, weak, false, true);

},{"./_collection":42,"./_collection-weak":41}],277:[function(require,module,exports){
'use strict';
// https://github.com/tc39/Array.prototype.includes

var $export = require('./_export'),
    $includes = require('./_array-includes')(true);

$export($export.P, 'Array', {
  includes: function includes(el /*, fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

require('./_add-to-unscopables')('includes');

},{"./_add-to-unscopables":25,"./_array-includes":31,"./_export":52}],278:[function(require,module,exports){
'use strict';

// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
var $export = require('./_export'),
    microtask = require('./_microtask')(),
    process = require('./_global').process,
    isNode = require('./_cof')(process) == 'process';

$export($export.G, {
  asap: function asap(fn) {
    var domain = isNode && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});

},{"./_cof":38,"./_export":52,"./_global":58,"./_microtask":84}],279:[function(require,module,exports){
'use strict';

// https://github.com/ljharb/proposal-is-error
var $export = require('./_export'),
    cof = require('./_cof');

$export($export.S, 'Error', {
  isError: function isError(it) {
    return cof(it) === 'Error';
  }
});

},{"./_cof":38,"./_export":52}],280:[function(require,module,exports){
'use strict';

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = require('./_export');

$export($export.P + $export.R, 'Map', { toJSON: require('./_collection-to-json')('Map') });

},{"./_collection-to-json":40,"./_export":52}],281:[function(require,module,exports){
'use strict';

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  iaddh: function iaddh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0,
        $x1 = x1 >>> 0,
        $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});

},{"./_export":52}],282:[function(require,module,exports){
'use strict';

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  imulh: function imulh(u, v) {
    var UINT16 = 0xffff,
        $u = +u,
        $v = +v,
        u0 = $u & UINT16,
        v0 = $v & UINT16,
        u1 = $u >> 16,
        v1 = $v >> 16,
        t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});

},{"./_export":52}],283:[function(require,module,exports){
'use strict';

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  isubh: function isubh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0,
        $x1 = x1 >>> 0,
        $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});

},{"./_export":52}],284:[function(require,module,exports){
'use strict';

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  umulh: function umulh(u, v) {
    var UINT16 = 0xffff,
        $u = +u,
        $v = +v,
        u0 = $u & UINT16,
        v0 = $v & UINT16,
        u1 = $u >>> 16,
        v1 = $v >>> 16,
        t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});

},{"./_export":52}],285:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    toObject = require('./_to-object'),
    aFunction = require('./_a-function'),
    $defineProperty = require('./_object-dp');

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter) {
    $defineProperty.f(toObject(this), P, { get: aFunction(getter), enumerable: true, configurable: true });
  }
});

},{"./_a-function":23,"./_descriptors":48,"./_export":52,"./_object-dp":87,"./_object-forced-pam":89,"./_to-object":129}],286:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    toObject = require('./_to-object'),
    aFunction = require('./_a-function'),
    $defineProperty = require('./_object-dp');

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter) {
    $defineProperty.f(toObject(this), P, { set: aFunction(setter), enumerable: true, configurable: true });
  }
});

},{"./_a-function":23,"./_descriptors":48,"./_export":52,"./_object-dp":87,"./_object-forced-pam":89,"./_to-object":129}],287:[function(require,module,exports){
'use strict';

// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export'),
    $entries = require('./_object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});

},{"./_export":52,"./_object-to-array":99}],288:[function(require,module,exports){
'use strict';

// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = require('./_export'),
    ownKeys = require('./_own-keys'),
    toIObject = require('./_to-iobject'),
    gOPD = require('./_object-gopd'),
    createProperty = require('./_create-property');

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object),
        getDesc = gOPD.f,
        keys = ownKeys(O),
        result = {},
        i = 0,
        key;
    while (keys.length > i) {
      createProperty(result, key = keys[i++], getDesc(O, key));
    }return result;
  }
});

},{"./_create-property":44,"./_export":52,"./_object-gopd":90,"./_own-keys":100,"./_to-iobject":127}],289:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    toObject = require('./_to-object'),
    toPrimitive = require('./_to-primitive'),
    getPrototypeOf = require('./_object-gpo'),
    getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupGetter__: function __lookupGetter__(P) {
    var O = toObject(this),
        K = toPrimitive(P, true),
        D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.get;
    } while (O = getPrototypeOf(O));
  }
});

},{"./_descriptors":48,"./_export":52,"./_object-forced-pam":89,"./_object-gopd":90,"./_object-gpo":94,"./_to-object":129,"./_to-primitive":130}],290:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    toObject = require('./_to-object'),
    toPrimitive = require('./_to-primitive'),
    getPrototypeOf = require('./_object-gpo'),
    getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupSetter__: function __lookupSetter__(P) {
    var O = toObject(this),
        K = toPrimitive(P, true),
        D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.set;
    } while (O = getPrototypeOf(O));
  }
});

},{"./_descriptors":48,"./_export":52,"./_object-forced-pam":89,"./_object-gopd":90,"./_object-gpo":94,"./_to-object":129,"./_to-primitive":130}],291:[function(require,module,exports){
'use strict';

// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export'),
    $values = require('./_object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});

},{"./_export":52,"./_object-to-array":99}],292:[function(require,module,exports){
'use strict';
// https://github.com/zenparsing/es-observable

var $export = require('./_export'),
    global = require('./_global'),
    core = require('./_core'),
    microtask = require('./_microtask')(),
    OBSERVABLE = require('./_wks')('observable'),
    aFunction = require('./_a-function'),
    anObject = require('./_an-object'),
    anInstance = require('./_an-instance'),
    redefineAll = require('./_redefine-all'),
    hide = require('./_hide'),
    forOf = require('./_for-of'),
    RETURN = forOf.RETURN;

var getMethod = function getMethod(fn) {
  return fn == null ? undefined : aFunction(fn);
};

var cleanupSubscription = function cleanupSubscription(subscription) {
  var cleanup = subscription._c;
  if (cleanup) {
    subscription._c = undefined;
    cleanup();
  }
};

var subscriptionClosed = function subscriptionClosed(subscription) {
  return subscription._o === undefined;
};

var closeSubscription = function closeSubscription(subscription) {
  if (!subscriptionClosed(subscription)) {
    subscription._o = undefined;
    cleanupSubscription(subscription);
  }
};

var Subscription = function Subscription(observer, subscriber) {
  anObject(observer);
  this._c = undefined;
  this._o = observer;
  observer = new SubscriptionObserver(this);
  try {
    var cleanup = subscriber(observer),
        subscription = cleanup;
    if (cleanup != null) {
      if (typeof cleanup.unsubscribe === 'function') cleanup = function cleanup() {
        subscription.unsubscribe();
      };else aFunction(cleanup);
      this._c = cleanup;
    }
  } catch (e) {
    observer.error(e);
    return;
  }if (subscriptionClosed(this)) cleanupSubscription(this);
};

Subscription.prototype = redefineAll({}, {
  unsubscribe: function unsubscribe() {
    closeSubscription(this);
  }
});

var SubscriptionObserver = function SubscriptionObserver(subscription) {
  this._s = subscription;
};

SubscriptionObserver.prototype = redefineAll({}, {
  next: function next(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      try {
        var m = getMethod(observer.next);
        if (m) return m.call(observer, value);
      } catch (e) {
        try {
          closeSubscription(subscription);
        } finally {
          throw e;
        }
      }
    }
  },
  error: function error(value) {
    var subscription = this._s;
    if (subscriptionClosed(subscription)) throw value;
    var observer = subscription._o;
    subscription._o = undefined;
    try {
      var m = getMethod(observer.error);
      if (!m) throw value;
      value = m.call(observer, value);
    } catch (e) {
      try {
        cleanupSubscription(subscription);
      } finally {
        throw e;
      }
    }cleanupSubscription(subscription);
    return value;
  },
  complete: function complete(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      subscription._o = undefined;
      try {
        var m = getMethod(observer.complete);
        value = m ? m.call(observer, value) : undefined;
      } catch (e) {
        try {
          cleanupSubscription(subscription);
        } finally {
          throw e;
        }
      }cleanupSubscription(subscription);
      return value;
    }
  }
});

var $Observable = function Observable(subscriber) {
  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
};

redefineAll($Observable.prototype, {
  subscribe: function subscribe(observer) {
    return new Subscription(observer, this._f);
  },
  forEach: function forEach(fn) {
    var that = this;
    return new (core.Promise || global.Promise)(function (resolve, reject) {
      aFunction(fn);
      var subscription = that.subscribe({
        next: function next(value) {
          try {
            return fn(value);
          } catch (e) {
            reject(e);
            subscription.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
    });
  }
});

redefineAll($Observable, {
  from: function from(x) {
    var C = typeof this === 'function' ? this : $Observable;
    var method = getMethod(anObject(x)[OBSERVABLE]);
    if (method) {
      var observable = anObject(method.call(x));
      return observable.constructor === C ? observable : new C(function (observer) {
        return observable.subscribe(observer);
      });
    }
    return new C(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          try {
            if (forOf(x, false, function (it) {
              observer.next(it);
              if (done) return RETURN;
            }) === RETURN) return;
          } catch (e) {
            if (done) throw e;
            observer.error(e);
            return;
          }observer.complete();
        }
      });
      return function () {
        done = true;
      };
    });
  },
  of: function of() {
    for (var i = 0, l = arguments.length, items = Array(l); i < l;) {
      items[i] = arguments[i++];
    }return new (typeof this === 'function' ? this : $Observable)(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          for (var i = 0; i < items.length; ++i) {
            observer.next(items[i]);
            if (done) return;
          }observer.complete();
        }
      });
      return function () {
        done = true;
      };
    });
  }
});

hide($Observable.prototype, OBSERVABLE, function () {
  return this;
});

$export($export.G, { Observable: $Observable });

require('./_set-species')('Observable');

},{"./_a-function":23,"./_an-instance":26,"./_an-object":27,"./_core":43,"./_export":52,"./_for-of":57,"./_global":58,"./_hide":60,"./_microtask":84,"./_redefine-all":106,"./_set-species":111,"./_wks":137}],293:[function(require,module,exports){
'use strict';

var metadata = require('./_metadata'),
    anObject = require('./_an-object'),
    toMetaKey = metadata.key,
    ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({ defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey) {
    ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
  } });

},{"./_an-object":27,"./_metadata":83}],294:[function(require,module,exports){
'use strict';

var metadata = require('./_metadata'),
    anObject = require('./_an-object'),
    toMetaKey = metadata.key,
    getOrCreateMetadataMap = metadata.map,
    store = metadata.store;

metadata.exp({ deleteMetadata: function deleteMetadata(metadataKey, target /*, targetKey */) {
    var targetKey = arguments.length < 3 ? undefined : toMetaKey(arguments[2]),
        metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
    if (metadataMap === undefined || !metadataMap['delete'](metadataKey)) return false;
    if (metadataMap.size) return true;
    var targetMetadata = store.get(target);
    targetMetadata['delete'](targetKey);
    return !!targetMetadata.size || store['delete'](target);
  } });

},{"./_an-object":27,"./_metadata":83}],295:[function(require,module,exports){
'use strict';

var Set = require('./es6.set'),
    from = require('./_array-from-iterable'),
    metadata = require('./_metadata'),
    anObject = require('./_an-object'),
    getPrototypeOf = require('./_object-gpo'),
    ordinaryOwnMetadataKeys = metadata.keys,
    toMetaKey = metadata.key;

var ordinaryMetadataKeys = function ordinaryMetadataKeys(O, P) {
  var oKeys = ordinaryOwnMetadataKeys(O, P),
      parent = getPrototypeOf(O);
  if (parent === null) return oKeys;
  var pKeys = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
};

metadata.exp({ getMetadataKeys: function getMetadataKeys(target /*, targetKey */) {
    return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
  } });

},{"./_an-object":27,"./_array-from-iterable":30,"./_metadata":83,"./_object-gpo":94,"./es6.set":240}],296:[function(require,module,exports){
'use strict';

var metadata = require('./_metadata'),
    anObject = require('./_an-object'),
    getPrototypeOf = require('./_object-gpo'),
    ordinaryHasOwnMetadata = metadata.has,
    ordinaryGetOwnMetadata = metadata.get,
    toMetaKey = metadata.key;

var ordinaryGetMetadata = function ordinaryGetMetadata(MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

metadata.exp({ getMetadata: function getMetadata(metadataKey, target /*, targetKey */) {
    return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
  } });

},{"./_an-object":27,"./_metadata":83,"./_object-gpo":94}],297:[function(require,module,exports){
'use strict';

var metadata = require('./_metadata'),
    anObject = require('./_an-object'),
    ordinaryOwnMetadataKeys = metadata.keys,
    toMetaKey = metadata.key;

metadata.exp({ getOwnMetadataKeys: function getOwnMetadataKeys(target /*, targetKey */) {
    return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
  } });

},{"./_an-object":27,"./_metadata":83}],298:[function(require,module,exports){
'use strict';

var metadata = require('./_metadata'),
    anObject = require('./_an-object'),
    ordinaryGetOwnMetadata = metadata.get,
    toMetaKey = metadata.key;

metadata.exp({ getOwnMetadata: function getOwnMetadata(metadataKey, target /*, targetKey */) {
    return ordinaryGetOwnMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
  } });

},{"./_an-object":27,"./_metadata":83}],299:[function(require,module,exports){
'use strict';

var metadata = require('./_metadata'),
    anObject = require('./_an-object'),
    getPrototypeOf = require('./_object-gpo'),
    ordinaryHasOwnMetadata = metadata.has,
    toMetaKey = metadata.key;

var ordinaryHasMetadata = function ordinaryHasMetadata(MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

metadata.exp({ hasMetadata: function hasMetadata(metadataKey, target /*, targetKey */) {
    return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
  } });

},{"./_an-object":27,"./_metadata":83,"./_object-gpo":94}],300:[function(require,module,exports){
'use strict';

var metadata = require('./_metadata'),
    anObject = require('./_an-object'),
    ordinaryHasOwnMetadata = metadata.has,
    toMetaKey = metadata.key;

metadata.exp({ hasOwnMetadata: function hasOwnMetadata(metadataKey, target /*, targetKey */) {
    return ordinaryHasOwnMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
  } });

},{"./_an-object":27,"./_metadata":83}],301:[function(require,module,exports){
'use strict';

var metadata = require('./_metadata'),
    anObject = require('./_an-object'),
    aFunction = require('./_a-function'),
    toMetaKey = metadata.key,
    ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({ metadata: function metadata(metadataKey, metadataValue) {
    return function decorator(target, targetKey) {
      ordinaryDefineOwnMetadata(metadataKey, metadataValue, (targetKey !== undefined ? anObject : aFunction)(target), toMetaKey(targetKey));
    };
  } });

},{"./_a-function":23,"./_an-object":27,"./_metadata":83}],302:[function(require,module,exports){
'use strict';

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = require('./_export');

$export($export.P + $export.R, 'Set', { toJSON: require('./_collection-to-json')('Set') });

},{"./_collection-to-json":40,"./_export":52}],303:[function(require,module,exports){
'use strict';
// https://github.com/mathiasbynens/String.prototype.at

var $export = require('./_export'),
    $at = require('./_string-at')(true);

$export($export.P, 'String', {
  at: function at(pos) {
    return $at(this, pos);
  }
});

},{"./_export":52,"./_string-at":117}],304:[function(require,module,exports){
'use strict';
// https://tc39.github.io/String.prototype.matchAll/

var $export = require('./_export'),
    defined = require('./_defined'),
    toLength = require('./_to-length'),
    isRegExp = require('./_is-regexp'),
    getFlags = require('./_flags'),
    RegExpProto = RegExp.prototype;

var $RegExpStringIterator = function $RegExpStringIterator(regexp, string) {
  this._r = regexp;
  this._s = string;
};

require('./_iter-create')($RegExpStringIterator, 'RegExp String', function next() {
  var match = this._r.exec(this._s);
  return { value: match, done: match === null };
});

$export($export.P, 'String', {
  matchAll: function matchAll(regexp) {
    defined(this);
    if (!isRegExp(regexp)) throw TypeError(regexp + ' is not a regexp!');
    var S = String(this),
        flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp),
        rx = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
    rx.lastIndex = toLength(regexp.lastIndex);
    return new $RegExpStringIterator(rx, S);
  }
});

},{"./_defined":47,"./_export":52,"./_flags":56,"./_is-regexp":70,"./_iter-create":72,"./_to-length":128}],305:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end

var $export = require('./_export'),
    $pad = require('./_string-pad');

$export($export.P, 'String', {
  padEnd: function padEnd(maxLength /*, fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});

},{"./_export":52,"./_string-pad":120}],306:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end

var $export = require('./_export'),
    $pad = require('./_string-pad');

$export($export.P, 'String', {
  padStart: function padStart(maxLength /*, fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});

},{"./_export":52,"./_string-pad":120}],307:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim

require('./_string-trim')('trimLeft', function ($trim) {
  return function trimLeft() {
    return $trim(this, 1);
  };
}, 'trimStart');

},{"./_string-trim":122}],308:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim

require('./_string-trim')('trimRight', function ($trim) {
  return function trimRight() {
    return $trim(this, 2);
  };
}, 'trimEnd');

},{"./_string-trim":122}],309:[function(require,module,exports){
'use strict';

require('./_wks-define')('asyncIterator');

},{"./_wks-define":135}],310:[function(require,module,exports){
'use strict';

require('./_wks-define')('observable');

},{"./_wks-define":135}],311:[function(require,module,exports){
'use strict';

// https://github.com/ljharb/proposal-global
var $export = require('./_export');

$export($export.S, 'System', { global: require('./_global') });

},{"./_export":52,"./_global":58}],312:[function(require,module,exports){
'use strict';

var $iterators = require('./es6.array.iterator'),
    redefine = require('./_redefine'),
    global = require('./_global'),
    hide = require('./_hide'),
    Iterators = require('./_iterators'),
    wks = require('./_wks'),
    ITERATOR = wks('iterator'),
    TO_STRING_TAG = wks('toStringTag'),
    ArrayValues = Iterators.Array;

for (var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++) {
  var NAME = collections[i],
      Collection = global[NAME],
      proto = Collection && Collection.prototype,
      key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    for (key in $iterators) {
      if (!proto[key]) redefine(proto, key, $iterators[key], true);
    }
  }
}

},{"./_global":58,"./_hide":60,"./_iterators":76,"./_redefine":107,"./_wks":137,"./es6.array.iterator":150}],313:[function(require,module,exports){
'use strict';

var $export = require('./_export'),
    $task = require('./_task');
$export($export.G + $export.B, {
  setImmediate: $task.set,
  clearImmediate: $task.clear
});

},{"./_export":52,"./_task":124}],314:[function(require,module,exports){
'use strict';

// ie9- setTimeout & setInterval additional parameters fix
var global = require('./_global'),
    $export = require('./_export'),
    invoke = require('./_invoke'),
    partial = require('./_partial'),
    navigator = global.navigator,
    MSIE = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function wrap(set) {
  return MSIE ? function (fn, time /*, ...args */) {
    return set(invoke(partial, [].slice.call(arguments, 2), typeof fn == 'function' ? fn : Function(fn)), time);
  } : set;
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout: wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});

},{"./_export":52,"./_global":58,"./_invoke":64,"./_partial":103}],315:[function(require,module,exports){
'use strict';

require('./modules/es6.symbol');
require('./modules/es6.object.create');
require('./modules/es6.object.define-property');
require('./modules/es6.object.define-properties');
require('./modules/es6.object.get-own-property-descriptor');
require('./modules/es6.object.get-prototype-of');
require('./modules/es6.object.keys');
require('./modules/es6.object.get-own-property-names');
require('./modules/es6.object.freeze');
require('./modules/es6.object.seal');
require('./modules/es6.object.prevent-extensions');
require('./modules/es6.object.is-frozen');
require('./modules/es6.object.is-sealed');
require('./modules/es6.object.is-extensible');
require('./modules/es6.object.assign');
require('./modules/es6.object.is');
require('./modules/es6.object.set-prototype-of');
require('./modules/es6.object.to-string');
require('./modules/es6.function.bind');
require('./modules/es6.function.name');
require('./modules/es6.function.has-instance');
require('./modules/es6.parse-int');
require('./modules/es6.parse-float');
require('./modules/es6.number.constructor');
require('./modules/es6.number.to-fixed');
require('./modules/es6.number.to-precision');
require('./modules/es6.number.epsilon');
require('./modules/es6.number.is-finite');
require('./modules/es6.number.is-integer');
require('./modules/es6.number.is-nan');
require('./modules/es6.number.is-safe-integer');
require('./modules/es6.number.max-safe-integer');
require('./modules/es6.number.min-safe-integer');
require('./modules/es6.number.parse-float');
require('./modules/es6.number.parse-int');
require('./modules/es6.math.acosh');
require('./modules/es6.math.asinh');
require('./modules/es6.math.atanh');
require('./modules/es6.math.cbrt');
require('./modules/es6.math.clz32');
require('./modules/es6.math.cosh');
require('./modules/es6.math.expm1');
require('./modules/es6.math.fround');
require('./modules/es6.math.hypot');
require('./modules/es6.math.imul');
require('./modules/es6.math.log10');
require('./modules/es6.math.log1p');
require('./modules/es6.math.log2');
require('./modules/es6.math.sign');
require('./modules/es6.math.sinh');
require('./modules/es6.math.tanh');
require('./modules/es6.math.trunc');
require('./modules/es6.string.from-code-point');
require('./modules/es6.string.raw');
require('./modules/es6.string.trim');
require('./modules/es6.string.iterator');
require('./modules/es6.string.code-point-at');
require('./modules/es6.string.ends-with');
require('./modules/es6.string.includes');
require('./modules/es6.string.repeat');
require('./modules/es6.string.starts-with');
require('./modules/es6.string.anchor');
require('./modules/es6.string.big');
require('./modules/es6.string.blink');
require('./modules/es6.string.bold');
require('./modules/es6.string.fixed');
require('./modules/es6.string.fontcolor');
require('./modules/es6.string.fontsize');
require('./modules/es6.string.italics');
require('./modules/es6.string.link');
require('./modules/es6.string.small');
require('./modules/es6.string.strike');
require('./modules/es6.string.sub');
require('./modules/es6.string.sup');
require('./modules/es6.date.now');
require('./modules/es6.date.to-json');
require('./modules/es6.date.to-iso-string');
require('./modules/es6.date.to-string');
require('./modules/es6.date.to-primitive');
require('./modules/es6.array.is-array');
require('./modules/es6.array.from');
require('./modules/es6.array.of');
require('./modules/es6.array.join');
require('./modules/es6.array.slice');
require('./modules/es6.array.sort');
require('./modules/es6.array.for-each');
require('./modules/es6.array.map');
require('./modules/es6.array.filter');
require('./modules/es6.array.some');
require('./modules/es6.array.every');
require('./modules/es6.array.reduce');
require('./modules/es6.array.reduce-right');
require('./modules/es6.array.index-of');
require('./modules/es6.array.last-index-of');
require('./modules/es6.array.copy-within');
require('./modules/es6.array.fill');
require('./modules/es6.array.find');
require('./modules/es6.array.find-index');
require('./modules/es6.array.species');
require('./modules/es6.array.iterator');
require('./modules/es6.regexp.constructor');
require('./modules/es6.regexp.to-string');
require('./modules/es6.regexp.flags');
require('./modules/es6.regexp.match');
require('./modules/es6.regexp.replace');
require('./modules/es6.regexp.search');
require('./modules/es6.regexp.split');
require('./modules/es6.promise');
require('./modules/es6.map');
require('./modules/es6.set');
require('./modules/es6.weak-map');
require('./modules/es6.weak-set');
require('./modules/es6.typed.array-buffer');
require('./modules/es6.typed.data-view');
require('./modules/es6.typed.int8-array');
require('./modules/es6.typed.uint8-array');
require('./modules/es6.typed.uint8-clamped-array');
require('./modules/es6.typed.int16-array');
require('./modules/es6.typed.uint16-array');
require('./modules/es6.typed.int32-array');
require('./modules/es6.typed.uint32-array');
require('./modules/es6.typed.float32-array');
require('./modules/es6.typed.float64-array');
require('./modules/es6.reflect.apply');
require('./modules/es6.reflect.construct');
require('./modules/es6.reflect.define-property');
require('./modules/es6.reflect.delete-property');
require('./modules/es6.reflect.enumerate');
require('./modules/es6.reflect.get');
require('./modules/es6.reflect.get-own-property-descriptor');
require('./modules/es6.reflect.get-prototype-of');
require('./modules/es6.reflect.has');
require('./modules/es6.reflect.is-extensible');
require('./modules/es6.reflect.own-keys');
require('./modules/es6.reflect.prevent-extensions');
require('./modules/es6.reflect.set');
require('./modules/es6.reflect.set-prototype-of');
require('./modules/es7.array.includes');
require('./modules/es7.string.at');
require('./modules/es7.string.pad-start');
require('./modules/es7.string.pad-end');
require('./modules/es7.string.trim-left');
require('./modules/es7.string.trim-right');
require('./modules/es7.string.match-all');
require('./modules/es7.symbol.async-iterator');
require('./modules/es7.symbol.observable');
require('./modules/es7.object.get-own-property-descriptors');
require('./modules/es7.object.values');
require('./modules/es7.object.entries');
require('./modules/es7.object.define-getter');
require('./modules/es7.object.define-setter');
require('./modules/es7.object.lookup-getter');
require('./modules/es7.object.lookup-setter');
require('./modules/es7.map.to-json');
require('./modules/es7.set.to-json');
require('./modules/es7.system.global');
require('./modules/es7.error.is-error');
require('./modules/es7.math.iaddh');
require('./modules/es7.math.isubh');
require('./modules/es7.math.imulh');
require('./modules/es7.math.umulh');
require('./modules/es7.reflect.define-metadata');
require('./modules/es7.reflect.delete-metadata');
require('./modules/es7.reflect.get-metadata');
require('./modules/es7.reflect.get-metadata-keys');
require('./modules/es7.reflect.get-own-metadata');
require('./modules/es7.reflect.get-own-metadata-keys');
require('./modules/es7.reflect.has-metadata');
require('./modules/es7.reflect.has-own-metadata');
require('./modules/es7.reflect.metadata');
require('./modules/es7.asap');
require('./modules/es7.observable');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/_core');

},{"./modules/_core":43,"./modules/es6.array.copy-within":140,"./modules/es6.array.every":141,"./modules/es6.array.fill":142,"./modules/es6.array.filter":143,"./modules/es6.array.find":145,"./modules/es6.array.find-index":144,"./modules/es6.array.for-each":146,"./modules/es6.array.from":147,"./modules/es6.array.index-of":148,"./modules/es6.array.is-array":149,"./modules/es6.array.iterator":150,"./modules/es6.array.join":151,"./modules/es6.array.last-index-of":152,"./modules/es6.array.map":153,"./modules/es6.array.of":154,"./modules/es6.array.reduce":156,"./modules/es6.array.reduce-right":155,"./modules/es6.array.slice":157,"./modules/es6.array.some":158,"./modules/es6.array.sort":159,"./modules/es6.array.species":160,"./modules/es6.date.now":161,"./modules/es6.date.to-iso-string":162,"./modules/es6.date.to-json":163,"./modules/es6.date.to-primitive":164,"./modules/es6.date.to-string":165,"./modules/es6.function.bind":166,"./modules/es6.function.has-instance":167,"./modules/es6.function.name":168,"./modules/es6.map":169,"./modules/es6.math.acosh":170,"./modules/es6.math.asinh":171,"./modules/es6.math.atanh":172,"./modules/es6.math.cbrt":173,"./modules/es6.math.clz32":174,"./modules/es6.math.cosh":175,"./modules/es6.math.expm1":176,"./modules/es6.math.fround":177,"./modules/es6.math.hypot":178,"./modules/es6.math.imul":179,"./modules/es6.math.log10":180,"./modules/es6.math.log1p":181,"./modules/es6.math.log2":182,"./modules/es6.math.sign":183,"./modules/es6.math.sinh":184,"./modules/es6.math.tanh":185,"./modules/es6.math.trunc":186,"./modules/es6.number.constructor":187,"./modules/es6.number.epsilon":188,"./modules/es6.number.is-finite":189,"./modules/es6.number.is-integer":190,"./modules/es6.number.is-nan":191,"./modules/es6.number.is-safe-integer":192,"./modules/es6.number.max-safe-integer":193,"./modules/es6.number.min-safe-integer":194,"./modules/es6.number.parse-float":195,"./modules/es6.number.parse-int":196,"./modules/es6.number.to-fixed":197,"./modules/es6.number.to-precision":198,"./modules/es6.object.assign":199,"./modules/es6.object.create":200,"./modules/es6.object.define-properties":201,"./modules/es6.object.define-property":202,"./modules/es6.object.freeze":203,"./modules/es6.object.get-own-property-descriptor":204,"./modules/es6.object.get-own-property-names":205,"./modules/es6.object.get-prototype-of":206,"./modules/es6.object.is":210,"./modules/es6.object.is-extensible":207,"./modules/es6.object.is-frozen":208,"./modules/es6.object.is-sealed":209,"./modules/es6.object.keys":211,"./modules/es6.object.prevent-extensions":212,"./modules/es6.object.seal":213,"./modules/es6.object.set-prototype-of":214,"./modules/es6.object.to-string":215,"./modules/es6.parse-float":216,"./modules/es6.parse-int":217,"./modules/es6.promise":218,"./modules/es6.reflect.apply":219,"./modules/es6.reflect.construct":220,"./modules/es6.reflect.define-property":221,"./modules/es6.reflect.delete-property":222,"./modules/es6.reflect.enumerate":223,"./modules/es6.reflect.get":226,"./modules/es6.reflect.get-own-property-descriptor":224,"./modules/es6.reflect.get-prototype-of":225,"./modules/es6.reflect.has":227,"./modules/es6.reflect.is-extensible":228,"./modules/es6.reflect.own-keys":229,"./modules/es6.reflect.prevent-extensions":230,"./modules/es6.reflect.set":232,"./modules/es6.reflect.set-prototype-of":231,"./modules/es6.regexp.constructor":233,"./modules/es6.regexp.flags":234,"./modules/es6.regexp.match":235,"./modules/es6.regexp.replace":236,"./modules/es6.regexp.search":237,"./modules/es6.regexp.split":238,"./modules/es6.regexp.to-string":239,"./modules/es6.set":240,"./modules/es6.string.anchor":241,"./modules/es6.string.big":242,"./modules/es6.string.blink":243,"./modules/es6.string.bold":244,"./modules/es6.string.code-point-at":245,"./modules/es6.string.ends-with":246,"./modules/es6.string.fixed":247,"./modules/es6.string.fontcolor":248,"./modules/es6.string.fontsize":249,"./modules/es6.string.from-code-point":250,"./modules/es6.string.includes":251,"./modules/es6.string.italics":252,"./modules/es6.string.iterator":253,"./modules/es6.string.link":254,"./modules/es6.string.raw":255,"./modules/es6.string.repeat":256,"./modules/es6.string.small":257,"./modules/es6.string.starts-with":258,"./modules/es6.string.strike":259,"./modules/es6.string.sub":260,"./modules/es6.string.sup":261,"./modules/es6.string.trim":262,"./modules/es6.symbol":263,"./modules/es6.typed.array-buffer":264,"./modules/es6.typed.data-view":265,"./modules/es6.typed.float32-array":266,"./modules/es6.typed.float64-array":267,"./modules/es6.typed.int16-array":268,"./modules/es6.typed.int32-array":269,"./modules/es6.typed.int8-array":270,"./modules/es6.typed.uint16-array":271,"./modules/es6.typed.uint32-array":272,"./modules/es6.typed.uint8-array":273,"./modules/es6.typed.uint8-clamped-array":274,"./modules/es6.weak-map":275,"./modules/es6.weak-set":276,"./modules/es7.array.includes":277,"./modules/es7.asap":278,"./modules/es7.error.is-error":279,"./modules/es7.map.to-json":280,"./modules/es7.math.iaddh":281,"./modules/es7.math.imulh":282,"./modules/es7.math.isubh":283,"./modules/es7.math.umulh":284,"./modules/es7.object.define-getter":285,"./modules/es7.object.define-setter":286,"./modules/es7.object.entries":287,"./modules/es7.object.get-own-property-descriptors":288,"./modules/es7.object.lookup-getter":289,"./modules/es7.object.lookup-setter":290,"./modules/es7.object.values":291,"./modules/es7.observable":292,"./modules/es7.reflect.define-metadata":293,"./modules/es7.reflect.delete-metadata":294,"./modules/es7.reflect.get-metadata":296,"./modules/es7.reflect.get-metadata-keys":295,"./modules/es7.reflect.get-own-metadata":298,"./modules/es7.reflect.get-own-metadata-keys":297,"./modules/es7.reflect.has-metadata":299,"./modules/es7.reflect.has-own-metadata":300,"./modules/es7.reflect.metadata":301,"./modules/es7.set.to-json":302,"./modules/es7.string.at":303,"./modules/es7.string.match-all":304,"./modules/es7.string.pad-end":305,"./modules/es7.string.pad-start":306,"./modules/es7.string.trim-left":307,"./modules/es7.string.trim-right":308,"./modules/es7.symbol.async-iterator":309,"./modules/es7.symbol.observable":310,"./modules/es7.system.global":311,"./modules/web.dom.iterable":312,"./modules/web.immediate":313,"./modules/web.timers":314}],316:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],317:[function(require,module,exports){
(function (process,global){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!function (global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = (typeof module === "undefined" ? "undefined" : _typeof(module)) === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      prototype[method] = function (arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction ||
    // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  runtime.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function (arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if ((typeof process === "undefined" ? "undefined" : _typeof(process)) === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
      // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
      // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function (innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

    return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  Gp.toString = function () {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function (object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function stop() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
}(
// Among the various tricks for obtaining a reference to the global
// object, this seems to be the most reliable technique that does not
// use indirect eval (which violates Content Security Policy).
(typeof global === "undefined" ? "undefined" : _typeof(global)) === "object" ? global : (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" ? window : (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" ? self : undefined);

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":316}]},{},[1,21]);
