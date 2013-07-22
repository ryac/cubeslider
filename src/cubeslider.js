/*
 * cubeslider
 * https://github.com/ryac/cubeslider
 *
 * Copyright (c) 2013 Ryan Yacyshyn
 * Licensed under the MIT license.
 */

;(function($, window) {

	'use strict';

	// CSS support detection
	var cssDetect = (function() {
			var props = 'transform,perspective'.split(','),
				CSSprefix = 'Webkit,Moz,O,ms'.split(','),
				d = document.createElement('detect'),
				testObj = {},
				p,
				pty;

			// test prefixed code
			function testPrefixes (prop) {
				var upperProp = prop.charAt(0).toUpperCase() + prop.substr(1),
					all = (prop + ' ' + CSSprefix.join(upperProp + ' ') + upperProp).split(' '),
					i,
					iLen = all.length;

				for (i = 0; i < iLen; i++) {
					if (d.style[all[i]] === '') {
						return true;
					}
				}
				return false;
			}

			for (p in props) {
				pty = props[p];
				testObj[pty] = testPrefixes(pty);
			}

			return testObj;
		}()),

		// 'vendor' variable from iScroll v4.2 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
		// Released under MIT license, http://cubiq.org/license
		vendor = (function () {
			var vendors = 't,webkitT,MozT,msT,OT'.split(','),
				t,
				i = 0,
				d = document.createElement('div').style,
				l = vendors.length;

			for ( ; i < l; i++ ) {
				t = vendors[i] + 'ransform';
				if ( t in d ) {
					return vendors[i].substr(0, vendors[i].length - 1);
				}
			}
			return false;
		})(),

		cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',

		log = function (msg) {
			if (window.console) {
				window.console.log('CubeSlider:: ' + msg);
			}
		},

		logWarn = function (msg) {
			if (window.console) {
				window.console.warn('CubeSlider:: ' + msg);
			}
		};

	$.CubeSlider = function (options, element) {
		this.$el = $(element);
		this._init(options);
	};

	$.CubeSlider.defaults = {
		cubeWidth: 300,
		cubeHeight: 300,
		easing: 'ease-in-out',
		speed: 0.5,
		element: 'div',
		perspective: 800,
		// callbacks..
		onTransitionComplete: function () { return false; }
	};

	$.CubeSlider.prototype = {

		_init: function (options) {

			var cssObj;

			// options..
			this.options = $.extend(true, {}, $.CubeSlider.defaults, options);

			this.animating = false;

			this.cubeHalfWidth = Math.round(this.options.cubeWidth / 2);

			// get all items..
			this.$items = this.$el.find('#cube').children(this.options.element);
			
			// total number of items..
			this.itemsCount = this.$items.length;

			// if no items..
			if (this.itemsCount === 0) {
				logWarn('no items found..');
				return false;
			}

			// check to see if browser supports these..
			this.supports = cssDetect.transform && cssDetect.perspective;

			if (!this.supports) {
				logWarn('browser may not be supported..');
			}

			cssObj = {};
			cssObj.width = this.options.cubeWidth;
			cssObj.height = this.options.cubeHeight;
			cssObj.position = 'relative';

			if (this.supports) {
				cssObj[cssVendor + 'perspective'] = this.options.perspective;
			}

			this.$el.css(cssObj);

			cssObj = {};
			cssObj.width = '100%';
			cssObj.height = '100%';
			cssObj.position = 'absolute';

			if (this.supports) {
				cssObj[cssVendor + 'transform-style'] = 'preserve-3d';
			}

			this.$el.find('#cube').css(cssObj);

			// apply css to all items..
			this.$items.css({
				'width': this.options.cubeWidth,
				'height': '100%',
				'position': 'absolute'
			});

			this.reset();

		},

		onTransitionEnd: function (e) {
			if (e.originalEvent.propertyName.indexOf('transform') > -1) {
				var s = e.data.self;
				s.animating = false;
				s.$items.not(s.$items.eq(s.current)).css({ 'visibility': 'hidden' });
				s.options.onTransitionComplete(s.current);
				s.unbind(s.$items.eq(s.current));
			}
		},

		bind: function (el) {
			el.on('transitionend webkitTransitionEnd', { self: this }, this.onTransitionEnd);
		},

		unbind: function (el) {
			el.off('transitionend webkitTransitionEnd', this.onTransitionEnd);
		},

		/**
		 * Public methods..
		 */
		next: function () {

			var nextSlide = this.current + 1,
				cssObj;

			if (nextSlide === this.itemsCount || this.animating) {
				return;
			}

			if (this.supports) {
				this.animating = true;

				cssObj = {};
				cssObj[cssVendor + 'transition'] = 'all ' + this.options.speed + 's ' + this.options.easing;
				cssObj[cssVendor + 'transform'] = 'rotateY(-90deg) translate3d(-' + this.cubeHalfWidth + 'px, 0px, ' + this.cubeHalfWidth + 'px)';
				this.$items.eq(this.current).css(cssObj);
				
				this.prevItem = this.current;
				this.current += 1;

				cssObj = {};
				cssObj.visibility = 'visible';
				cssObj[cssVendor + 'transition'] = 'all ' + this.options.speed + 's ' + this.options.easing;
				cssObj[cssVendor + 'transform'] = 'rotateY(0deg) translate3d(0,0,0)';
				this.$items.eq(this.current).css(cssObj);

				this.bind(this.$items.eq(this.current));
			}
			else {
				cssObj = {};
				cssObj.visibility = 'hidden';
				this.$items.eq(this.current).css(cssObj);

				this.prevItem = this.current;
				this.current += 1;

				cssObj.visibility = 'visible';
				this.$items.eq(this.current).css(cssObj);
			}
		},

		previous: function () {
			
			var prevSlide = this.current - 1,	
				cssObj;

			if (prevSlide < 0 || this.animating) {
				return;
			}

			if (this.supports) {
				this.animating = true;

				cssObj = {};
				cssObj[cssVendor + 'transition'] = 'all ' + this.options.speed + 's ' + this.options.easing;
				cssObj[cssVendor + 'transform'] = 'rotateY(90deg) translate3d(' + this.cubeHalfWidth + 'px, 0px, ' + this.cubeHalfWidth + 'px)';
				this.$items.eq(this.current).css(cssObj);
				
				this.prevItem = this.current;
				this.current -= 1;
				
				cssObj = {};
				cssObj.visibility = 'visible';
				cssObj[cssVendor + 'transition'] = 'all ' + this.options.speed + 's ' + this.options.easing;
				cssObj[cssVendor + 'transform'] = 'rotateY(0deg) translate3d(0,0,0)';
				this.$items.eq(this.current).css(cssObj);

				this.bind(this.$items.eq(this.current));
			}
			else {
				cssObj = {};
				cssObj.visibility = 'hidden';
				this.$items.eq(this.current).css(cssObj);

				this.prevItem = this.current;
				this.current -= 1;

				cssObj.visibility = 'visible';
				this.$items.eq(this.current).css(cssObj);
			}
		},

		reset: function () {

			if (this.animating) {
				return false;
			}

			var cssObj,
				self = this;

			this.current = 0;

			if (this.supports) {
				cssObj = {};
				cssObj[cssVendor + 'transition'] = 'none';
				this.$items.css(cssObj);

				// hide all items except for first one and apply additional css..
				// all items start on the right-hand side..
				cssObj = {};
				cssObj.visibility = 'hidden';
				cssObj[cssVendor + 'transform'] = 'rotateY(90deg) translate3d(' + this.cubeHalfWidth + 'px, 0px, ' + this.cubeHalfWidth + 'px)';
				this.$items.not(this.$items.eq(this.current)).css(cssObj);

				cssObj = {};
				cssObj.visibility = 'visible';
				cssObj[cssVendor + 'transform'] = 'rotateY(0deg) translate3d(0,0,0)';
				this.$items.eq(this.current).css(cssObj);
			}
			else {
				cssObj = {};
				cssObj.visibility = 'hidden';
				this.$items.not(this.$items.eq(this.current)).css(cssObj);

				cssObj.visibility = 'visible';
				this.$items.eq(this.current).css(cssObj);
			}
		},

		updateHeight: function (h) {
			this.$el.height(h);
		}
	};

	$.fn.cubeslider = function (options) {

		var self = $.data(this, 'cubeslider');

		this.each(function() {
			if (self) {
				self._init();
			}
			else {
				self = $.data(this, 'cubeslider', new $.CubeSlider(options, this));
				log('CubeSlider init..');
			}
		});

		return self;
	};

})(jQuery, window);