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
			// options..
			this.options = $.extend(true, {}, $.CubeSlider.defaults, options);

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
				logWarn('Browser may not be supported..');
			}

			this.$el.css({
				'width': this.options.cubeWidth,
				'height': this.options.cubeHeight,
				'position': 'relative',

				'-webkit-perspective': this.options.perspective,
				'-moz-perspective': this.options.perspective,
				'-o-perspective': this.options.perspective,
				'-ms-perspective': this.options.perspective,
				'perspective': this.options.perspective
			});

			this.$el.find('#cube').css({
				'width': '100%',
				'height': '100%',
				'position': 'absolute',

				'-webkit-transform-style': 'preserve-3d',
				'-moz-transform-style': 'preserve-3d',
				'-o-transform-style': 'preserve-3d',
				'-ms-transform-style': 'preserve-3d',
				'transform-style': 'preserve-3d'
			});

			// apply css to all items..
			this.$items.css({
				'width': this.options.cubeWidth,
				'height': '100%',
				'position': 'absolute'
			});

			this.reset();

		},

		_clearPrevItem: function () {
			var self = this;
			window.setTimeout (function () {
				self.$items.not(self.$items.eq(self.current)).css({ 'visibility': 'hidden' });
				self.options.onTransitionComplete(self.current);
			}, this.options.speed * 1000);
		},

		/**
		 * Public methods..
		 */
		next: function () {

			var nextSlide = this.current + 1;

			if (nextSlide === this.itemsCount) {
				return;
			}

			this.$items.eq(this.current).css({
				'-webkit-transition': 'all ' + this.options.speed + 's ' + this.options.easing,
				'-moz-transition': 'all ' + this.options.speed + 's ' + this.options.easing,
				'-o-transition': 'all ' + this.options.speed + 's ' + this.options.easing,
				'-ms-transition': 'all ' + this.options.speed + 's ' + this.options.easing,
				'transition': 'all ' + this.options.speed + 's ' + this.options.easing,

				'-webkit-transform': 'rotateY(-90deg) translate3d(-' + this.cubeHalfWidth + 'px, 0px, ' + this.cubeHalfWidth + 'px)',
				'-moz-transform': 'rotateY(-90deg) translate3d(-' + this.cubeHalfWidth + 'px, 0px, ' + this.cubeHalfWidth + 'px)',
				'-o-transform': 'rotateY(-90deg) translate3d(-' + this.cubeHalfWidth + 'px, 0px, ' + this.cubeHalfWidth + 'px)',
				'-ms-transform': 'rotateY(-90deg) translate3d(-' + this.cubeHalfWidth + 'px, 0px, ' + this.cubeHalfWidth + 'px)',
				'transform': 'rotateY(-90deg) translate3d(-' + this.cubeHalfWidth + 'px, 0px, ' + this.cubeHalfWidth + 'px)'
			});
			
			this.prevItem = this.current;
			this.current += 1;
			
			this.$items.eq(this.current).css({
				'visibility': 'visible',
				'-webkit-transition': 'all ' + this.options.speed + 's ' + this.options.easing,
				'-moz-transition': 'all ' + this.options.speed + 's ' + this.options.easing,
				'-o-transition': 'all ' + this.options.speed + 's ' + this.options.easing,
				'-ms-transition': 'all ' + this.options.speed + 's ' + this.options.easing,
				'transition': 'all ' + this.options.speed + 's ' + this.options.easing,

				'-webkit-transform': 'rotateY(0deg) translate3d(0,0,0)',
				'-moz-transform': 'rotateY(0deg) translate3d(0,0,0)',
				'-o-transform': 'rotateY(0deg) translate3d(0,0,0)',
				'-ms-transform': 'rotateY(0deg) translate3d(0,0,0)',
				'transform': 'rotateY(0deg) translate3d(0,0,0)'
			});

			this._clearPrevItem();
		},

		previous: function () {
			
			var prevSlide = this.current - 1;

			if (prevSlide < 0) {
				return;
			}

			this.$items.eq(this.current).css({
				'-webkit-transition': 'all ' + this.options.speed + 's ' + this.options.easing,
				'-moz-transition': 'all ' + this.options.speed + 's ' + this.options.easing,
				'-o-transition': 'all ' + this.options.speed + 's ' + this.options.easing,
				'-ms-transition': 'all ' + this.options.speed + 's ' + this.options.easing,
				'transition': 'all ' + this.options.speed + 's ' + this.options.easing,

				'-webkit-transform': 'rotateY(90deg) translate3d(' + this.cubeHalfWidth + 'px, 0px, ' + this.cubeHalfWidth + 'px)',
				'-moz-transform': 'rotateY(90deg) translate3d(' + this.cubeHalfWidth + 'px, 0px, ' + this.cubeHalfWidth + 'px)',
				'-o-transform': 'rotateY(90deg) translate3d(' + this.cubeHalfWidth + 'px, 0px, ' + this.cubeHalfWidth + 'px)',
				'-ms-transform': 'rotateY(90deg) translate3d(' + this.cubeHalfWidth + 'px, 0px, ' + this.cubeHalfWidth + 'px)',
				'transform': 'rotateY(90deg) translate3d(' + this.cubeHalfWidth + 'px, 0px, ' + this.cubeHalfWidth + 'px)'
			});
			
			this.prevItem = this.current;
			this.current -= 1;
			
			this.$items.eq(this.current).css({
				'visibility': 'visible',
				'-webkit-transition': 'all ' + this.options.speed + 's ' + this.options.easing,
				'-moz-transition': 'all ' + this.options.speed + 's ' + this.options.easing,
				'-o-transition': 'all ' + this.options.speed + 's ' + this.options.easing,
				'-ms-transition': 'all ' + this.options.speed + 's ' + this.options.easing,
				'transition': 'all ' + this.options.speed + 's ' + this.options.easing,

				'-webkit-transform': 'rotateY(0deg) translate3d(0,0,0)',
				'-moz-transform': 'rotateY(0deg) translate3d(0,0,0)',
				'-o-transform': 'rotateY(0deg) translate3d(0,0,0)',
				'-ms-transform': 'rotateY(0deg) translate3d(0,0,0)',
				'transform': 'rotateY(0deg) translate3d(0,0,0)'
			});

			this._clearPrevItem();
		},

		reset: function () {

			this.current = 0;

			this.$items.css({
				'-webkit-transition': 'none',
				'-moz-transition': 'none',
				'-o-transition': 'none',
				'-ms-transition': 'none',
				'transition': 'none'
			});

			// hide all items except for first one and apply additional css..
			// all items start on the right-hand side..
			this.$items.not(this.$items.eq(this.current)).css({
				'visibility': 'hidden',
				'-webkit-transform': 'rotateY(90deg) translate3d(' + this.cubeHalfWidth + 'px, 0px, ' + this.cubeHalfWidth + 'px)',
				'-moz-transform': 'rotateY(90deg) translate3d(' + this.cubeHalfWidth + 'px, 0px, ' + this.cubeHalfWidth + 'px)',
				'-o-transform': 'rotateY(90deg) translate3d(' + this.cubeHalfWidth + 'px, 0px, ' + this.cubeHalfWidth + 'px)',
				'-ms-transform': 'rotateY(90deg) translate3d(' + this.cubeHalfWidth + 'px, 0px, ' + this.cubeHalfWidth + 'px)',
				'transform': 'rotateY(90deg) translate3d(' + this.cubeHalfWidth + 'px, 0px, ' + this.cubeHalfWidth + 'px)'
			});

			this.$items.eq(this.current).css({
				'visibility': 'visible',

				'-webkit-transform': 'rotateY(0deg) translate3d(0,0,0)',
				'-moz-transform': 'rotateY(0deg) translate3d(0,0,0)',
				'-o-transform': 'rotateY(0deg) translate3d(0,0,0)',
				'-ms-transform': 'rotateY(0deg) translate3d(0,0,0)',
				'transform': 'rotateY(0deg) translate3d(0,0,0)'
			});
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