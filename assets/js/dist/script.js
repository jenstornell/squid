/*!
	autosize 4.0.2
	license: MIT
	http://www.jacklmoore.com/autosize
*/
(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['module', 'exports'], factory);
	} else if (typeof exports !== "undefined") {
		factory(module, exports);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod, mod.exports);
		global.autosize = mod.exports;
	}
})(this, function (module, exports) {
	'use strict';

	var map = typeof Map === "function" ? new Map() : function () {
		var keys = [];
		var values = [];

		return {
			has: function has(key) {
				return keys.indexOf(key) > -1;
			},
			get: function get(key) {
				return values[keys.indexOf(key)];
			},
			set: function set(key, value) {
				if (keys.indexOf(key) === -1) {
					keys.push(key);
					values.push(value);
				}
			},
			delete: function _delete(key) {
				var index = keys.indexOf(key);
				if (index > -1) {
					keys.splice(index, 1);
					values.splice(index, 1);
				}
			}
		};
	}();

	var createEvent = function createEvent(name) {
		return new Event(name, { bubbles: true });
	};
	try {
		new Event('test');
	} catch (e) {
		// IE does not support `new Event()`
		createEvent = function createEvent(name) {
			var evt = document.createEvent('Event');
			evt.initEvent(name, true, false);
			return evt;
		};
	}

	function assign(ta) {
		if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || map.has(ta)) return;

		var heightOffset = null;
		var clientWidth = null;
		var cachedHeight = null;

		function init() {
			var style = window.getComputedStyle(ta, null);

			if (style.resize === 'vertical') {
				ta.style.resize = 'none';
			} else if (style.resize === 'both') {
				ta.style.resize = 'horizontal';
			}

			if (style.boxSizing === 'content-box') {
				heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
			} else {
				heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
			}
			// Fix when a textarea is not on document body and heightOffset is Not a Number
			if (isNaN(heightOffset)) {
				heightOffset = 0;
			}

			update();
		}

		function changeOverflow(value) {
			{
				// Chrome/Safari-specific fix:
				// When the textarea y-overflow is hidden, Chrome/Safari do not reflow the text to account for the space
				// made available by removing the scrollbar. The following forces the necessary text reflow.
				var width = ta.style.width;
				ta.style.width = '0px';
				// Force reflow:
				/* jshint ignore:start */
				ta.offsetWidth;
				/* jshint ignore:end */
				ta.style.width = width;
			}

			ta.style.overflowY = value;
		}

		function getParentOverflows(el) {
			var arr = [];

			while (el && el.parentNode && el.parentNode instanceof Element) {
				if (el.parentNode.scrollTop) {
					arr.push({
						node: el.parentNode,
						scrollTop: el.parentNode.scrollTop
					});
				}
				el = el.parentNode;
			}

			return arr;
		}

		function resize() {
			if (ta.scrollHeight === 0) {
				// If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
				return;
			}

			var overflows = getParentOverflows(ta);
			var docTop = document.documentElement && document.documentElement.scrollTop; // Needed for Mobile IE (ticket #240)

			ta.style.height = '';
			ta.style.height = ta.scrollHeight + heightOffset + 'px';

			// used to check if an update is actually necessary on window.resize
			clientWidth = ta.clientWidth;

			// prevents scroll-position jumping
			overflows.forEach(function (el) {
				el.node.scrollTop = el.scrollTop;
			});

			if (docTop) {
				document.documentElement.scrollTop = docTop;
			}
		}

		function update() {
			resize();

			var styleHeight = Math.round(parseFloat(ta.style.height));
			var computed = window.getComputedStyle(ta, null);

			// Using offsetHeight as a replacement for computed.height in IE, because IE does not account use of border-box
			var actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(computed.height)) : ta.offsetHeight;

			// The actual height not matching the style height (set via the resize method) indicates that 
			// the max-height has been exceeded, in which case the overflow should be allowed.
			if (actualHeight < styleHeight) {
				if (computed.overflowY === 'hidden') {
					changeOverflow('scroll');
					resize();
					actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
				}
			} else {
				// Normally keep overflow set to hidden, to avoid flash of scrollbar as the textarea expands.
				if (computed.overflowY !== 'hidden') {
					changeOverflow('hidden');
					resize();
					actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
				}
			}

			if (cachedHeight !== actualHeight) {
				cachedHeight = actualHeight;
				var evt = createEvent('autosize:resized');
				try {
					ta.dispatchEvent(evt);
				} catch (err) {
					// Firefox will throw an error on dispatchEvent for a detached element
					// https://bugzilla.mozilla.org/show_bug.cgi?id=889376
				}
			}
		}

		var pageResize = function pageResize() {
			if (ta.clientWidth !== clientWidth) {
				update();
			}
		};

		var destroy = function (style) {
			window.removeEventListener('resize', pageResize, false);
			ta.removeEventListener('input', update, false);
			ta.removeEventListener('keyup', update, false);
			ta.removeEventListener('autosize:destroy', destroy, false);
			ta.removeEventListener('autosize:update', update, false);

			Object.keys(style).forEach(function (key) {
				ta.style[key] = style[key];
			});

			map.delete(ta);
		}.bind(ta, {
			height: ta.style.height,
			resize: ta.style.resize,
			overflowY: ta.style.overflowY,
			overflowX: ta.style.overflowX,
			wordWrap: ta.style.wordWrap
		});

		ta.addEventListener('autosize:destroy', destroy, false);

		// IE9 does not fire onpropertychange or oninput for deletions,
		// so binding to onkeyup to catch most of those events.
		// There is no way that I know of to detect something like 'cut' in IE9.
		if ('onpropertychange' in ta && 'oninput' in ta) {
			ta.addEventListener('keyup', update, false);
		}

		window.addEventListener('resize', pageResize, false);
		ta.addEventListener('input', update, false);
		ta.addEventListener('autosize:update', update, false);
		ta.style.overflowX = 'hidden';
		ta.style.wordWrap = 'break-word';

		map.set(ta, {
			destroy: destroy,
			update: update
		});

		init();
	}

	function destroy(ta) {
		var methods = map.get(ta);
		if (methods) {
			methods.destroy();
		}
	}

	function update(ta) {
		var methods = map.get(ta);
		if (methods) {
			methods.update();
		}
	}

	var autosize = null;

	// Do nothing in Node.js environment and IE8 (or lower)
	if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
		autosize = function autosize(el) {
			return el;
		};
		autosize.destroy = function (el) {
			return el;
		};
		autosize.update = function (el) {
			return el;
		};
	} else {
		autosize = function autosize(el, options) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], function (x) {
					return assign(x, options);
				});
			}
			return el;
		};
		autosize.destroy = function (el) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], destroy);
			}
			return el;
		};
		autosize.update = function (el) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], update);
			}
			return el;
		};
	}

	exports.default = autosize;
	module.exports = exports['default'];
});
/*!
 * Modals v10.1.2: Simple modal dialogue pop-up windows
 * (c) 2017 Chris Ferdinandi
 * MIT License
 * http://github.com/cferdinandi/modals
 */

(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define([], factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(root);
    } else {
        root.modals = factory(root);
    }
})(typeof global !== 'undefined' ? global : this.window || this.global, (function (root) {

    'use strict';

    //
    // Variables
    //

    var publicApi = {}; // Object for public APIs
    var supports = 'querySelector' in document && 'addEventListener' in root && 'classList' in document.createElement('_'); // Feature test
    var state = 'closed';
    var scrollbarWidth, placeholder, settings;

    // Default settings
    var defaults = {
        selectorToggle: '[data-modal]',
        selectorWindow: '[data-modal-window]',
        selectorClose: '[data-modal-close]',
        modalActiveClass: 'active',
        modalBGClass: 'modal-bg',
        preventBGScroll: true,
        preventBGScrollHtml: true,
        preventBGScrollBody: true,
        backspaceClose: true,
        stopVideo: true,
        callbackOpen: function () {},
        callbackClose: function () {}
    };


    //
    // Methods
    //

    /**
     * A simple forEach() implementation for Arrays, Objects and NodeLists.
     * @private
     * @author Todd Motto
     * @link   https://github.com/toddmotto/foreach
     * @param {Array|Object|NodeList} collection Collection of items to iterate
     * @param {Function}              callback   Callback function for each iteration
     * @param {Array|Object|NodeList} scope      Object/NodeList/Array that forEach is iterating over (aka `this`)
     */
    var forEach = function ( collection, callback, scope ) {
        if ( Object.prototype.toString.call( collection ) === '[object Object]' ) {
            for ( var prop in collection ) {
                if ( Object.prototype.hasOwnProperty.call( collection, prop ) ) {
                    callback.call( scope, collection[prop], prop, collection );
                }
            }
        } else {
            for ( var i = 0, len = collection.length; i < len; i++ ) {
                callback.call( scope, collection[i], i, collection );
            }
        }
    };

    /**
     * Merge two or more objects. Returns a new object.
     * @private
     * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
     * @param {Object}   objects  The objects to merge together
     * @returns {Object}          Merged values of defaults and options
     */
    var extend = function () {

        // Variables
        var extended = {};
        var deep = false;
        var i = 0;
        var length = arguments.length;

        // Check if a deep merge
        if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
            deep = arguments[0];
            i++;
        }

        // Merge the object into the extended object
        var merge = function (obj) {
            for ( var prop in obj ) {
                if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                    // If deep merge and property is an object, merge properties
                    if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                        extended[prop] = extend( true, extended[prop], obj[prop] );
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        // Loop through each object and conduct a merge
        for ( ; i < length; i++ ) {
            var obj = arguments[i];
            merge(obj);
        }

        return extended;

    };

    /**
     * Get the closest matching element up the DOM tree.
     * @private
     * @param  {Element} elem     Starting element
     * @param  {String}  selector Selector to match against
     * @return {Boolean|Element}  Returns null if not match found
     */
    var getClosest = function ( elem, selector ) {

        // Element.matches() polyfill
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function(s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                        i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) {}
                    return i > -1;
                };
        }

        // Get closest match
        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            if ( elem.matches( selector ) ) return elem;
        }

        return null;

    };

    /**
     * Stop YouTube, Vimeo, and HTML5 videos from playing when leaving the slide
     * @private
     * @param  {Element} content The content container the video is in
     * @param  {String} activeClass The class asigned to expanded content areas
     */
    var stopVideos = function ( content, settings ) {

        // Check if stop video enabled
        if ( !settings.stopVideo ) return;

        // Only run if content container was open
        if ( !content.classList.contains( settings.modalActiveClass ) ) return;

        // Check if the video is an iframe or HTML5 video
        var iframe = content.querySelector( 'iframe');
        var video = content.querySelector( 'video' );

        // Stop the video
        if ( iframe ) {
            var iframeSrc = iframe.src;
            iframe.src = iframeSrc;
        }
        if ( video ) {
            video.pause();
        }

    };

    /**
     * Get the width of the scroll bars
     * @private
     */
    var getScrollbarWidth = function () {

        // Setup div
        var outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.width = '100px';
        outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
        document.body.appendChild(outer);

        // Force scrollbars
        var widthNoScroll = outer.offsetWidth;
        outer.style.overflow = 'scroll';

        // Add innerdiv
        var inner = document.createElement('div');
        inner.style.width = '100%';
        outer.appendChild(inner);
        var widthWithScroll = inner.offsetWidth;

        // Remove divs
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;

    };

    /**
     * Create the modal background and append it to the DOM
     * @private
     */
    var createModalBg = function () {

        // If modal BG already exists, don't create another one
        if ( document.querySelector('[data-modal-bg]') ) return;

        // Define the modal background
        var modalBg = document.createElement('div');
        modalBg.setAttribute('data-modal-bg', true);
        modalBg.classList.add( settings.modalBGClass );

        // Append the modal background to the page
        document.body.appendChild(modalBg);

    };

    /**
     * Remove the modal background from the DOM
     * @private
     */
    var removeModalBg = function () {
        var modalBg = document.querySelector( '[data-modal-bg]' );
        if ( !modalBg ) return;
        document.body.removeChild( modalBg );
    };

    /**
     * Close open modal window
     * @public
     * @param  {Object} options
     * @param  {Event} event
     */
    publicApi.closeModal = function (options) {

        // Selectors and variables
        var localSettings = extend( settings || defaults, options || {} ); // Merge user options with defaults
        var modal = document.querySelector( localSettings.selectorWindow + '.' + localSettings.modalActiveClass ); // Get open modal

        // Sanity check
        if ( !modal ) return;

        // Stop videos from playing
        stopVideos( modal, localSettings );

        // Close the modal
        modal.classList.remove( localSettings.modalActiveClass );

        // Remove the modal background from the DOM
        removeModalBg();

        // Set state to closed
        state = 'closed';

        // Reallow background scrolling
        if ( localSettings.preventBGScroll ) {
            document.documentElement.style.overflowY = '';
            document.body.style.overflowY = '';
            document.body.style.paddingRight = '';
        }

        // Run callbacks after closing a modal
        localSettings.callbackClose( placeholder, modal );

        // Bring focus back to the button that toggles the modal
        if ( placeholder ) {
            placeholder.focus();
            placeholder = null;
        }

    };

    /**
     * Open the target modal window
     * @public
     * @param  {Element} toggle The element that toggled the open modal event
     * @param  {String} modalID ID of the modal to open
     * @param  {Object} options
     * @param  {Event} event
     */
    publicApi.openModal = function (toggle, modalID, options) {

        // Define the modal
        var localSettings = extend( settings || defaults, options || {} );  // Merge user options with defaults
        var modal = document.querySelector(modalID);

        // If a modal is already open, close it first
        if ( state === 'open' ) {
            publicApi.closeModal( localSettings );
        }

        // Save the visitor's spot on the page
        if ( toggle ) {
            placeholder = toggle;
        }

        // Activate the modal
        modal.classList.add( localSettings.modalActiveClass );
        createModalBg();
        state = 'open';

        // Bring modal into focus
        modal.setAttribute( 'tabindex', '-1' );
        modal.focus();

        // Prevent background scrolling
        if ( localSettings.preventBGScroll ) {
            if ( localSettings.preventBGScrollHtml ) {
                document.documentElement.style.overflowY = 'hidden';
            }
            if ( localSettings.preventBGScrollBody ) {
                document.body.style.overflowY = 'hidden';
            }
            //document.body.style.paddingRight = scrollbarWidth + 'px';
        }

        localSettings.callbackOpen( toggle, modal ); // Run callbacks after opening a modal

    };

    /**
     * Run a callback after a click or tap, without running duplicate callbacks for the same event
     * @param  {Node}   elem       The element to listen for clicks and taps on
     * @param  {Function} callback The callback function to run on a click or tap
     */
    var onClickOrTap = function (elem, callback, destroy) {

        // Remove event listeners
        if ( destroy ) {
            elem.removeEventListener('touchstart', onTouchStartEvent, false);
            elem.removeEventListener('touchend', onTouchEndEvent, false);
            elem.removeEventListener('click', onClickEvent, false);
            return;
        }

        // Make sure a callback is provided
        if ( !callback || typeof(callback) !== 'function' ) return;

        // Variables
        var isTouch, startX, startY, distX, distY;

        /**
         * touchstart handler
         * @param  {event} event The touchstart event
         */
        var onTouchStartEvent = function (event) {
            // Disable click event
            isTouch = true;

            // Get the starting location and time when finger first touches surface
            startX = event.changedTouches[0].pageX;
            startY = event.changedTouches[0].pageY;
        };

        /**
         * touchend handler
         * @param  {event} event The touchend event
         */
        var onTouchEndEvent = function (event) {

            // Get the distance travelled and how long it took
            distX = event.changedTouches[0].pageX - startX;
            distY = event.changedTouches[0].pageY - startY;

            // If a swipe happened, do nothing
            if ( Math.abs(distX) >= 7 || Math.abs(distY) >= 10 ) return;

            // Run callback
            callback(event);

        };

        /**
         * click handler
         * @param  {event} event The click event
         */
        var onClickEvent = function (event) {
            // If touch is active, reset and bail
            if ( isTouch ) {
                isTouch = false;
                return;
            }

            // Run our callback
            callback(event);
        };

        // Event listeners
        elem.addEventListener('touchstart', onTouchStartEvent, false);
        elem.addEventListener('touchend', onTouchEndEvent, false);
        elem.addEventListener('click', onClickEvent, false);

    };

    /**
     * Handle toggle click events
     * @private
     */
    var eventHandler = function (event) {
        var toggle = event.target;
        var open = getClosest(toggle, settings.selectorToggle);
        var close = getClosest(toggle, settings.selectorClose);
        var modal = getClosest(toggle, settings.selectorWindow);
        var key = event.keyCode;

        if ( key && state === 'open' ) {
            if ( key === 27 || ( settings.backspaceClose && ( key === 8 || key === 46 ) ) ) {
                publicApi.closeModal();
            }
        } else if ( toggle ) {
            if ( modal && !close ) {
                return;
            } else if ( open && ( !key || key === 13 ) ) {
                event.preventDefault();
                publicApi.openModal( open, open.getAttribute('data-modal'), settings );
            } else if ( state === 'open' ) {
                event.preventDefault();
                publicApi.closeModal();
            }
        }
    };

    /**
     * Destroy the current initialization.
     * @public
     */
    publicApi.destroy = function () {
        if ( !settings ) return;
        onClickOrTap(document, null, true);
        document.removeEventListener('keydown', eventHandler, false);
        document.documentElement.style.overflowY = '';
        document.body.style.overflowY = '';
        document.body.style.paddingRight = '';
        scrollbarWidth = null;
        placeholder = null;
        settings = null;
    };

    /**
     * Initialize Modals
     * @public
     * @param {Object} options User settings
     */
    publicApi.init = function ( options ) {

        // feature test
        if ( !supports ) return;

        // Destroy any existing initializations
        publicApi.destroy();

        // Merge user options with defaults
        settings = extend( defaults, options || {} );

        // Get scrollbar width
        scrollbarWidth = getScrollbarWidth();

        // Listen for events
        onClickOrTap(document, eventHandler);
        document.addEventListener('keydown', eventHandler, false);

    };


    //
    // Public APIs
    //

    return publicApi;

}));
/*
SVÅR - JS - Sticky thead
*/

class MySqlQueryTester {
  constructor(options) {
    this.o = Object.assign({}, this.defaults(), options);

    document.addEventListener("DOMContentLoaded", () => {
      this.onClickRun();
      this.onEnter();
      this.onTheadScroll();
    });
  }

  defaults() {
    return {
      root: 'http://localhost/misc/mysql-query-tester/'
    };
  }

  onClickRun() {
    document.querySelector('.button').addEventListener('click', (e) => {
      this.handlerClickRun();
    });
  }

  onEnter() {
    document.querySelector('.button').addEventListener('keyup', (e) => {
      if(e.code == 'Enter') {
        this.handlerClickRun();
      }
    });
  }

  onDoubleClickCell() {
    document.querySelectorAll('.td').forEach(element => {
      element.addEventListener('dblclick', (e) => {
        if(!e.altKey) return;
        let content = e.target.innerHTML;
        document.querySelector('#modal textarea').innerHTML = content;

        modals.openModal( null, '#modal', {
          preventBGScroll: true,
          preventBGScrollHtml: true,
          preventBGScrollBody: true,
        });

        autosize.update(document.querySelector('#modal textarea'));
        console.log('open');

      });
    });
  }

  index(el) {
    return Array.from(el.parentNode.children).indexOf(el)+1;
  }

  handlerClickRun() {
    this.ajax('query');
    this.ajax('table');
  }

  ajax() {
    let sql = document.querySelector('textarea').value;
    document.querySelector('.button').dataset.loading = '';

    fetch(this.o.root + '/core/ajax-table.php', {
      method: 'POST',
      body: sql,
      headers: {
        "Content-Type": "Content-Type: application/json"
    },
    }).then((response) => {
      return response.text();
    })
    .then((text) => {
      document.querySelector('#results').innerHTML = text;

      let table = document.querySelector('#table');

      if(!table) return;

      let width = table.scrollWidth;
      document.querySelector('#scrollbar').style.width = `${width}px`;
      let scroll = new Scrollmirror();
      scroll.init();

      this.onDoubleClickCell();
      delete document.querySelector('.button').dataset.loading;

      this.thead();
    });
  }

  thead() {
    let width = document.querySelector('table').scrollWidth;

    document.querySelector('#thead').style.width = width + 'px';

    let i = 1;
    document.querySelectorAll('th').forEach(th => {
      let th_size = th.offsetWidth;
      document.querySelector(`#thead .th:nth-child(${i})`).style.width = th_size + 'px';
      i++;
    });
  }

  onTheadScroll() {
    window.addEventListener('scroll', function(e) {
      let table = document.querySelector('#table');
      let table_rect = table.getBoundingClientRect();
      if(table_rect.top > 0) {
        delete document.querySelector('#thead-wrap').dataset.fixed;
      } else {
        document.querySelector('#thead-wrap').dataset.fixed = '';
      }
    });
  }
}
class Scrollmirror {
  constructor() {

  }

  init() {
    this.onScroll();
  }

  onScroll() {
    let element = document.querySelector('#scrollbar');
    element.parentNode.addEventListener('scroll', (e) => {
      let scrollLeft = e.target.scrollLeft;
      let table = document.querySelector('#table');

      if(!table) return;
      table.scrollLeft = scrollLeft;

      let thead = document.querySelector('#thead');
      thead.style.marginLeft = -scrollLeft + 'px';

      console.log(scrollLeft);
    });
  }

  runOnScroll() {

  }
}