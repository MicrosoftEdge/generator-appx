(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var wow = require('WOW');

new wow.WOW().init();

},{"WOW":2}],2:[function(require,module,exports){
(function() {
  var MutationObserver, Util, WeakMap, getComputedStyle, getComputedStyleRX,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Util = (function() {
    function Util() {}

    Util.prototype.extend = function(custom, defaults) {
      var key, value;
      for (key in defaults) {
        value = defaults[key];
        if (custom[key] == null) {
          custom[key] = value;
        }
      }
      return custom;
    };

    Util.prototype.isMobile = function(agent) {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
    };

    Util.prototype.createEvent = function(event, bubble, cancel, detail) {
      var customEvent;
      if (bubble == null) {
        bubble = false;
      }
      if (cancel == null) {
        cancel = false;
      }
      if (detail == null) {
        detail = null;
      }
      if (document.createEvent != null) {
        customEvent = document.createEvent('CustomEvent');
        customEvent.initCustomEvent(event, bubble, cancel, detail);
      } else if (document.createEventObject != null) {
        customEvent = document.createEventObject();
        customEvent.eventType = event;
      } else {
        customEvent.eventName = event;
      }
      return customEvent;
    };

    Util.prototype.emitEvent = function(elem, event) {
      if (elem.dispatchEvent != null) {
        return elem.dispatchEvent(event);
      } else if (event in (elem != null)) {
        return elem[event]();
      } else if (("on" + event) in (elem != null)) {
        return elem["on" + event]();
      }
    };

    Util.prototype.addEvent = function(elem, event, fn) {
      if (elem.addEventListener != null) {
        return elem.addEventListener(event, fn, false);
      } else if (elem.attachEvent != null) {
        return elem.attachEvent("on" + event, fn);
      } else {
        return elem[event] = fn;
      }
    };

    Util.prototype.removeEvent = function(elem, event, fn) {
      if (elem.removeEventListener != null) {
        return elem.removeEventListener(event, fn, false);
      } else if (elem.detachEvent != null) {
        return elem.detachEvent("on" + event, fn);
      } else {
        return delete elem[event];
      }
    };

    Util.prototype.innerHeight = function() {
      if ('innerHeight' in window) {
        return window.innerHeight;
      } else {
        return document.documentElement.clientHeight;
      }
    };

    return Util;

  })();

  WeakMap = this.WeakMap || this.MozWeakMap || (WeakMap = (function() {
    function WeakMap() {
      this.keys = [];
      this.values = [];
    }

    WeakMap.prototype.get = function(key) {
      var i, item, j, len, ref;
      ref = this.keys;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        item = ref[i];
        if (item === key) {
          return this.values[i];
        }
      }
    };

    WeakMap.prototype.set = function(key, value) {
      var i, item, j, len, ref;
      ref = this.keys;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        item = ref[i];
        if (item === key) {
          this.values[i] = value;
          return;
        }
      }
      this.keys.push(key);
      return this.values.push(value);
    };

    return WeakMap;

  })());

  MutationObserver = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (MutationObserver = (function() {
    function MutationObserver() {
      if (typeof console !== "undefined" && console !== null) {
        console.warn('MutationObserver is not supported by your browser.');
      }
      if (typeof console !== "undefined" && console !== null) {
        console.warn('WOW.js cannot detect dom mutations, please call .sync() after loading new content.');
      }
    }

    MutationObserver.notSupported = true;

    MutationObserver.prototype.observe = function() {};

    return MutationObserver;

  })());

  getComputedStyle = this.getComputedStyle || function(el, pseudo) {
    this.getPropertyValue = function(prop) {
      var ref;
      if (prop === 'float') {
        prop = 'styleFloat';
      }
      if (getComputedStyleRX.test(prop)) {
        prop.replace(getComputedStyleRX, function(_, _char) {
          return _char.toUpperCase();
        });
      }
      return ((ref = el.currentStyle) != null ? ref[prop] : void 0) || null;
    };
    return this;
  };

  getComputedStyleRX = /(\-([a-z]){1})/g;

  this.WOW = (function() {
    WOW.prototype.defaults = {
      boxClass: 'wow',
      animateClass: 'animated',
      offset: 0,
      mobile: true,
      live: true,
      callback: null
    };

    function WOW(options) {
      if (options == null) {
        options = {};
      }
      this.scrollCallback = bind(this.scrollCallback, this);
      this.scrollHandler = bind(this.scrollHandler, this);
      this.resetAnimation = bind(this.resetAnimation, this);
      this.start = bind(this.start, this);
      this.scrolled = true;
      this.config = this.util().extend(options, this.defaults);
      this.animationNameCache = new WeakMap();
      this.wowEvent = this.util().createEvent(this.config.boxClass);
    }

    WOW.prototype.init = function() {
      var ref;
      this.element = window.document.documentElement;
      if ((ref = document.readyState) === "interactive" || ref === "complete") {
        this.start();
      } else {
        this.util().addEvent(document, 'DOMContentLoaded', this.start);
      }
      return this.finished = [];
    };

    WOW.prototype.start = function() {
      var box, j, len, ref;
      this.stopped = false;
      this.boxes = (function() {
        var j, len, ref, results;
        ref = this.element.querySelectorAll("." + this.config.boxClass);
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          box = ref[j];
          results.push(box);
        }
        return results;
      }).call(this);
      this.all = (function() {
        var j, len, ref, results;
        ref = this.boxes;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          box = ref[j];
          results.push(box);
        }
        return results;
      }).call(this);
      if (this.boxes.length) {
        if (this.disabled()) {
          this.resetStyle();
        } else {
          ref = this.boxes;
          for (j = 0, len = ref.length; j < len; j++) {
            box = ref[j];
            this.applyStyle(box, true);
          }
        }
      }
      if (!this.disabled()) {
        this.util().addEvent(window, 'scroll', this.scrollHandler);
        this.util().addEvent(window, 'resize', this.scrollHandler);
        this.interval = setInterval(this.scrollCallback, 50);
      }
      if (this.config.live) {
        return new MutationObserver((function(_this) {
          return function(records) {
            var k, len1, node, record, results;
            results = [];
            for (k = 0, len1 = records.length; k < len1; k++) {
              record = records[k];
              results.push((function() {
                var l, len2, ref1, results1;
                ref1 = record.addedNodes || [];
                results1 = [];
                for (l = 0, len2 = ref1.length; l < len2; l++) {
                  node = ref1[l];
                  results1.push(this.doSync(node));
                }
                return results1;
              }).call(_this));
            }
            return results;
          };
        })(this)).observe(document.body, {
          childList: true,
          subtree: true
        });
      }
    };

    WOW.prototype.stop = function() {
      this.stopped = true;
      this.util().removeEvent(window, 'scroll', this.scrollHandler);
      this.util().removeEvent(window, 'resize', this.scrollHandler);
      if (this.interval != null) {
        return clearInterval(this.interval);
      }
    };

    WOW.prototype.sync = function(element) {
      if (MutationObserver.notSupported) {
        return this.doSync(this.element);
      }
    };

    WOW.prototype.doSync = function(element) {
      var box, j, len, ref, results;
      if (element == null) {
        element = this.element;
      }
      if (element.nodeType !== 1) {
        return;
      }
      element = element.parentNode || element;
      ref = element.querySelectorAll("." + this.config.boxClass);
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        box = ref[j];
        if (indexOf.call(this.all, box) < 0) {
          this.boxes.push(box);
          this.all.push(box);
          if (this.stopped || this.disabled()) {
            this.resetStyle();
          } else {
            this.applyStyle(box, true);
          }
          results.push(this.scrolled = true);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    WOW.prototype.show = function(box) {
      this.applyStyle(box);
      box.className = box.className + " " + this.config.animateClass;
      if (this.config.callback != null) {
        this.config.callback(box);
      }
      this.util().emitEvent(box, this.wowEvent);
      this.util().addEvent(box, 'animationend', this.resetAnimation);
      this.util().addEvent(box, 'oanimationend', this.resetAnimation);
      this.util().addEvent(box, 'webkitAnimationEnd', this.resetAnimation);
      this.util().addEvent(box, 'MSAnimationEnd', this.resetAnimation);
      return box;
    };

    WOW.prototype.applyStyle = function(box, hidden) {
      var delay, duration, iteration;
      duration = box.getAttribute('data-wow-duration');
      delay = box.getAttribute('data-wow-delay');
      iteration = box.getAttribute('data-wow-iteration');
      return this.animate((function(_this) {
        return function() {
          return _this.customStyle(box, hidden, duration, delay, iteration);
        };
      })(this));
    };

    WOW.prototype.animate = (function() {
      if ('requestAnimationFrame' in window) {
        return function(callback) {
          return window.requestAnimationFrame(callback);
        };
      } else {
        return function(callback) {
          return callback();
        };
      }
    })();

    WOW.prototype.resetStyle = function() {
      var box, j, len, ref, results;
      ref = this.boxes;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        box = ref[j];
        results.push(box.style.visibility = 'visible');
      }
      return results;
    };

    WOW.prototype.resetAnimation = function(event) {
      var target;
      if (event.type.toLowerCase().indexOf('animationend') >= 0) {
        target = event.target || event.srcElement;
        return target.className = target.className.replace(this.config.animateClass, '').trim();
      }
    };

    WOW.prototype.customStyle = function(box, hidden, duration, delay, iteration) {
      if (hidden) {
        this.cacheAnimationName(box);
      }
      box.style.visibility = hidden ? 'hidden' : 'visible';
      if (duration) {
        this.vendorSet(box.style, {
          animationDuration: duration
        });
      }
      if (delay) {
        this.vendorSet(box.style, {
          animationDelay: delay
        });
      }
      if (iteration) {
        this.vendorSet(box.style, {
          animationIterationCount: iteration
        });
      }
      this.vendorSet(box.style, {
        animationName: hidden ? 'none' : this.cachedAnimationName(box)
      });
      return box;
    };

    WOW.prototype.vendors = ["moz", "webkit"];

    WOW.prototype.vendorSet = function(elem, properties) {
      var name, results, value, vendor;
      results = [];
      for (name in properties) {
        value = properties[name];
        elem["" + name] = value;
        results.push((function() {
          var j, len, ref, results1;
          ref = this.vendors;
          results1 = [];
          for (j = 0, len = ref.length; j < len; j++) {
            vendor = ref[j];
            results1.push(elem["" + vendor + (name.charAt(0).toUpperCase()) + (name.substr(1))] = value);
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    WOW.prototype.vendorCSS = function(elem, property) {
      var j, len, ref, result, style, vendor;
      style = getComputedStyle(elem);
      result = style.getPropertyCSSValue(property);
      ref = this.vendors;
      for (j = 0, len = ref.length; j < len; j++) {
        vendor = ref[j];
        result = result || style.getPropertyCSSValue("-" + vendor + "-" + property);
      }
      return result;
    };

    WOW.prototype.animationName = function(box) {
      var animationName;
      try {
        animationName = this.vendorCSS(box, 'animation-name').cssText;
      } catch (_error) {
        animationName = getComputedStyle(box).getPropertyValue('animation-name');
      }
      if (animationName === 'none') {
        return '';
      } else {
        return animationName;
      }
    };

    WOW.prototype.cacheAnimationName = function(box) {
      return this.animationNameCache.set(box, this.animationName(box));
    };

    WOW.prototype.cachedAnimationName = function(box) {
      return this.animationNameCache.get(box);
    };

    WOW.prototype.scrollHandler = function() {
      return this.scrolled = true;
    };

    WOW.prototype.scrollCallback = function() {
      var box;
      if (this.scrolled) {
        this.scrolled = false;
        this.boxes = (function() {
          var j, len, ref, results;
          ref = this.boxes;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            box = ref[j];
            if (!(box)) {
              continue;
            }
            if (this.isVisible(box)) {
              this.show(box);
              continue;
            }
            results.push(box);
          }
          return results;
        }).call(this);
        if (!(this.boxes.length || this.config.live)) {
          return this.stop();
        }
      }
    };

    WOW.prototype.offsetTop = function(element) {
      var top;
      while (element.offsetTop === void 0) {
        element = element.parentNode;
      }
      top = element.offsetTop;
      while (element = element.offsetParent) {
        top += element.offsetTop;
      }
      return top;
    };

    WOW.prototype.isVisible = function(box) {
      var bottom, offset, top, viewBottom, viewTop;
      offset = box.getAttribute('data-wow-offset') || this.config.offset;
      viewTop = window.pageYOffset;
      viewBottom = viewTop + Math.min(this.element.clientHeight, this.util().innerHeight()) - offset;
      top = this.offsetTop(box);
      bottom = top + box.clientHeight;
      return top <= viewBottom && bottom >= viewTop;
    };

    WOW.prototype.util = function() {
      return this._util != null ? this._util : this._util = new Util();
    };

    WOW.prototype.disabled = function() {
      return !this.config.mobile && this.util().isMobile(navigator.userAgent);
    };

    return WOW;

  })();

}).call(this);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYnVuZGxlcy9idW5kbGUuanMiLCJzcmMvYnVuZGxlcy92ZW5kb3Ivd293LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciB3b3cgPSByZXF1aXJlKCdXT1cnKTtcblxubmV3IHdvdy5XT1coKS5pbml0KCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gIHZhciBNdXRhdGlvbk9ic2VydmVyLCBVdGlsLCBXZWFrTWFwLCBnZXRDb21wdXRlZFN0eWxlLCBnZXRDb21wdXRlZFN0eWxlUlgsXG4gICAgYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH0sXG4gICAgaW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9O1xuXG4gIFV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gVXRpbCgpIHt9XG5cbiAgICBVdGlsLnByb3RvdHlwZS5leHRlbmQgPSBmdW5jdGlvbihjdXN0b20sIGRlZmF1bHRzKSB7XG4gICAgICB2YXIga2V5LCB2YWx1ZTtcbiAgICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICAgIHZhbHVlID0gZGVmYXVsdHNba2V5XTtcbiAgICAgICAgaWYgKGN1c3RvbVtrZXldID09IG51bGwpIHtcbiAgICAgICAgICBjdXN0b21ba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gY3VzdG9tO1xuICAgIH07XG5cbiAgICBVdGlsLnByb3RvdHlwZS5pc01vYmlsZSA9IGZ1bmN0aW9uKGFnZW50KSB7XG4gICAgICByZXR1cm4gL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KGFnZW50KTtcbiAgICB9O1xuXG4gICAgVXRpbC5wcm90b3R5cGUuY3JlYXRlRXZlbnQgPSBmdW5jdGlvbihldmVudCwgYnViYmxlLCBjYW5jZWwsIGRldGFpbCkge1xuICAgICAgdmFyIGN1c3RvbUV2ZW50O1xuICAgICAgaWYgKGJ1YmJsZSA9PSBudWxsKSB7XG4gICAgICAgIGJ1YmJsZSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKGNhbmNlbCA9PSBudWxsKSB7XG4gICAgICAgIGNhbmNlbCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKGRldGFpbCA9PSBudWxsKSB7XG4gICAgICAgIGRldGFpbCA9IG51bGw7XG4gICAgICB9XG4gICAgICBpZiAoZG9jdW1lbnQuY3JlYXRlRXZlbnQgIT0gbnVsbCkge1xuICAgICAgICBjdXN0b21FdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgICAgICBjdXN0b21FdmVudC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIGJ1YmJsZSwgY2FuY2VsLCBkZXRhaWwpO1xuICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC5jcmVhdGVFdmVudE9iamVjdCAhPSBudWxsKSB7XG4gICAgICAgIGN1c3RvbUV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnRPYmplY3QoKTtcbiAgICAgICAgY3VzdG9tRXZlbnQuZXZlbnRUeXBlID0gZXZlbnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXN0b21FdmVudC5ldmVudE5hbWUgPSBldmVudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdXN0b21FdmVudDtcbiAgICB9O1xuXG4gICAgVXRpbC5wcm90b3R5cGUuZW1pdEV2ZW50ID0gZnVuY3Rpb24oZWxlbSwgZXZlbnQpIHtcbiAgICAgIGlmIChlbGVtLmRpc3BhdGNoRXZlbnQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZWxlbS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQgaW4gKGVsZW0gIT0gbnVsbCkpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1bZXZlbnRdKCk7XG4gICAgICB9IGVsc2UgaWYgKChcIm9uXCIgKyBldmVudCkgaW4gKGVsZW0gIT0gbnVsbCkpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1bXCJvblwiICsgZXZlbnRdKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIFV0aWwucHJvdG90eXBlLmFkZEV2ZW50ID0gZnVuY3Rpb24oZWxlbSwgZXZlbnQsIGZuKSB7XG4gICAgICBpZiAoZWxlbS5hZGRFdmVudExpc3RlbmVyICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZm4sIGZhbHNlKTtcbiAgICAgIH0gZWxzZSBpZiAoZWxlbS5hdHRhY2hFdmVudCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBlbGVtLmF0dGFjaEV2ZW50KFwib25cIiArIGV2ZW50LCBmbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZWxlbVtldmVudF0gPSBmbjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgVXRpbC5wcm90b3R5cGUucmVtb3ZlRXZlbnQgPSBmdW5jdGlvbihlbGVtLCBldmVudCwgZm4pIHtcbiAgICAgIGlmIChlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBmbiwgZmFsc2UpO1xuICAgICAgfSBlbHNlIGlmIChlbGVtLmRldGFjaEV2ZW50ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGVsZW0uZGV0YWNoRXZlbnQoXCJvblwiICsgZXZlbnQsIGZuKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBkZWxldGUgZWxlbVtldmVudF07XG4gICAgICB9XG4gICAgfTtcblxuICAgIFV0aWwucHJvdG90eXBlLmlubmVySGVpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoJ2lubmVySGVpZ2h0JyBpbiB3aW5kb3cpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gVXRpbDtcblxuICB9KSgpO1xuXG4gIFdlYWtNYXAgPSB0aGlzLldlYWtNYXAgfHwgdGhpcy5Nb3pXZWFrTWFwIHx8IChXZWFrTWFwID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIFdlYWtNYXAoKSB7XG4gICAgICB0aGlzLmtleXMgPSBbXTtcbiAgICAgIHRoaXMudmFsdWVzID0gW107XG4gICAgfVxuXG4gICAgV2Vha01hcC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgaSwgaXRlbSwgaiwgbGVuLCByZWY7XG4gICAgICByZWYgPSB0aGlzLmtleXM7XG4gICAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgICBpdGVtID0gcmVmW2ldO1xuICAgICAgICBpZiAoaXRlbSA9PT0ga2V5KSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIFdlYWtNYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgIHZhciBpLCBpdGVtLCBqLCBsZW4sIHJlZjtcbiAgICAgIHJlZiA9IHRoaXMua2V5cztcbiAgICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICAgIGl0ZW0gPSByZWZbaV07XG4gICAgICAgIGlmIChpdGVtID09PSBrZXkpIHtcbiAgICAgICAgICB0aGlzLnZhbHVlc1tpXSA9IHZhbHVlO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5rZXlzLnB1c2goa2V5KTtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFdlYWtNYXA7XG5cbiAgfSkoKSk7XG5cbiAgTXV0YXRpb25PYnNlcnZlciA9IHRoaXMuTXV0YXRpb25PYnNlcnZlciB8fCB0aGlzLldlYmtpdE11dGF0aW9uT2JzZXJ2ZXIgfHwgdGhpcy5Nb3pNdXRhdGlvbk9ic2VydmVyIHx8IChNdXRhdGlvbk9ic2VydmVyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIE11dGF0aW9uT2JzZXJ2ZXIoKSB7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29uc29sZSAhPT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ011dGF0aW9uT2JzZXJ2ZXIgaXMgbm90IHN1cHBvcnRlZCBieSB5b3VyIGJyb3dzZXIuJyk7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29uc29sZSAhPT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ1dPVy5qcyBjYW5ub3QgZGV0ZWN0IGRvbSBtdXRhdGlvbnMsIHBsZWFzZSBjYWxsIC5zeW5jKCkgYWZ0ZXIgbG9hZGluZyBuZXcgY29udGVudC4nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBNdXRhdGlvbk9ic2VydmVyLm5vdFN1cHBvcnRlZCA9IHRydWU7XG5cbiAgICBNdXRhdGlvbk9ic2VydmVyLnByb3RvdHlwZS5vYnNlcnZlID0gZnVuY3Rpb24oKSB7fTtcblxuICAgIHJldHVybiBNdXRhdGlvbk9ic2VydmVyO1xuXG4gIH0pKCkpO1xuXG4gIGdldENvbXB1dGVkU3R5bGUgPSB0aGlzLmdldENvbXB1dGVkU3R5bGUgfHwgZnVuY3Rpb24oZWwsIHBzZXVkbykge1xuICAgIHRoaXMuZ2V0UHJvcGVydHlWYWx1ZSA9IGZ1bmN0aW9uKHByb3ApIHtcbiAgICAgIHZhciByZWY7XG4gICAgICBpZiAocHJvcCA9PT0gJ2Zsb2F0Jykge1xuICAgICAgICBwcm9wID0gJ3N0eWxlRmxvYXQnO1xuICAgICAgfVxuICAgICAgaWYgKGdldENvbXB1dGVkU3R5bGVSWC50ZXN0KHByb3ApKSB7XG4gICAgICAgIHByb3AucmVwbGFjZShnZXRDb21wdXRlZFN0eWxlUlgsIGZ1bmN0aW9uKF8sIF9jaGFyKSB7XG4gICAgICAgICAgcmV0dXJuIF9jaGFyLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuICgocmVmID0gZWwuY3VycmVudFN0eWxlKSAhPSBudWxsID8gcmVmW3Byb3BdIDogdm9pZCAwKSB8fCBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgZ2V0Q29tcHV0ZWRTdHlsZVJYID0gLyhcXC0oW2Etel0pezF9KS9nO1xuXG4gIHRoaXMuV09XID0gKGZ1bmN0aW9uKCkge1xuICAgIFdPVy5wcm90b3R5cGUuZGVmYXVsdHMgPSB7XG4gICAgICBib3hDbGFzczogJ3dvdycsXG4gICAgICBhbmltYXRlQ2xhc3M6ICdhbmltYXRlZCcsXG4gICAgICBvZmZzZXQ6IDAsXG4gICAgICBtb2JpbGU6IHRydWUsXG4gICAgICBsaXZlOiB0cnVlLFxuICAgICAgY2FsbGJhY2s6IG51bGxcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gV09XKG9wdGlvbnMpIHtcbiAgICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgfVxuICAgICAgdGhpcy5zY3JvbGxDYWxsYmFjayA9IGJpbmQodGhpcy5zY3JvbGxDYWxsYmFjaywgdGhpcyk7XG4gICAgICB0aGlzLnNjcm9sbEhhbmRsZXIgPSBiaW5kKHRoaXMuc2Nyb2xsSGFuZGxlciwgdGhpcyk7XG4gICAgICB0aGlzLnJlc2V0QW5pbWF0aW9uID0gYmluZCh0aGlzLnJlc2V0QW5pbWF0aW9uLCB0aGlzKTtcbiAgICAgIHRoaXMuc3RhcnQgPSBiaW5kKHRoaXMuc3RhcnQsIHRoaXMpO1xuICAgICAgdGhpcy5zY3JvbGxlZCA9IHRydWU7XG4gICAgICB0aGlzLmNvbmZpZyA9IHRoaXMudXRpbCgpLmV4dGVuZChvcHRpb25zLCB0aGlzLmRlZmF1bHRzKTtcbiAgICAgIHRoaXMuYW5pbWF0aW9uTmFtZUNhY2hlID0gbmV3IFdlYWtNYXAoKTtcbiAgICAgIHRoaXMud293RXZlbnQgPSB0aGlzLnV0aWwoKS5jcmVhdGVFdmVudCh0aGlzLmNvbmZpZy5ib3hDbGFzcyk7XG4gICAgfVxuXG4gICAgV09XLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVmO1xuICAgICAgdGhpcy5lbGVtZW50ID0gd2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgIGlmICgocmVmID0gZG9jdW1lbnQucmVhZHlTdGF0ZSkgPT09IFwiaW50ZXJhY3RpdmVcIiB8fCByZWYgPT09IFwiY29tcGxldGVcIikge1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnV0aWwoKS5hZGRFdmVudChkb2N1bWVudCwgJ0RPTUNvbnRlbnRMb2FkZWQnLCB0aGlzLnN0YXJ0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaGVkID0gW107XG4gICAgfTtcblxuICAgIFdPVy5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBib3gsIGosIGxlbiwgcmVmO1xuICAgICAgdGhpcy5zdG9wcGVkID0gZmFsc2U7XG4gICAgICB0aGlzLmJveGVzID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaiwgbGVuLCByZWYsIHJlc3VsdHM7XG4gICAgICAgIHJlZiA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLlwiICsgdGhpcy5jb25maWcuYm94Q2xhc3MpO1xuICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgIGJveCA9IHJlZltqXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2goYm94KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0pLmNhbGwodGhpcyk7XG4gICAgICB0aGlzLmFsbCA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGosIGxlbiwgcmVmLCByZXN1bHRzO1xuICAgICAgICByZWYgPSB0aGlzLmJveGVzO1xuICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgIGJveCA9IHJlZltqXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2goYm94KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0pLmNhbGwodGhpcyk7XG4gICAgICBpZiAodGhpcy5ib3hlcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQoKSkge1xuICAgICAgICAgIHRoaXMucmVzZXRTdHlsZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlZiA9IHRoaXMuYm94ZXM7XG4gICAgICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICBib3ggPSByZWZbal07XG4gICAgICAgICAgICB0aGlzLmFwcGx5U3R5bGUoYm94LCB0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5kaXNhYmxlZCgpKSB7XG4gICAgICAgIHRoaXMudXRpbCgpLmFkZEV2ZW50KHdpbmRvdywgJ3Njcm9sbCcsIHRoaXMuc2Nyb2xsSGFuZGxlcik7XG4gICAgICAgIHRoaXMudXRpbCgpLmFkZEV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScsIHRoaXMuc2Nyb2xsSGFuZGxlcik7XG4gICAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCh0aGlzLnNjcm9sbENhbGxiYWNrLCA1MCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5jb25maWcubGl2ZSkge1xuICAgICAgICByZXR1cm4gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHJlY29yZHMpIHtcbiAgICAgICAgICAgIHZhciBrLCBsZW4xLCBub2RlLCByZWNvcmQsIHJlc3VsdHM7XG4gICAgICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgICAgICBmb3IgKGsgPSAwLCBsZW4xID0gcmVjb3Jkcy5sZW5ndGg7IGsgPCBsZW4xOyBrKyspIHtcbiAgICAgICAgICAgICAgcmVjb3JkID0gcmVjb3Jkc1trXTtcbiAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgbCwgbGVuMiwgcmVmMSwgcmVzdWx0czE7XG4gICAgICAgICAgICAgICAgcmVmMSA9IHJlY29yZC5hZGRlZE5vZGVzIHx8IFtdO1xuICAgICAgICAgICAgICAgIHJlc3VsdHMxID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChsID0gMCwgbGVuMiA9IHJlZjEubGVuZ3RoOyBsIDwgbGVuMjsgbCsrKSB7XG4gICAgICAgICAgICAgICAgICBub2RlID0gcmVmMVtsXTtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdHMxLnB1c2godGhpcy5kb1N5bmMobm9kZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0czE7XG4gICAgICAgICAgICAgIH0pLmNhbGwoX3RoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpKS5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHtcbiAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgc3VidHJlZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgV09XLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnN0b3BwZWQgPSB0cnVlO1xuICAgICAgdGhpcy51dGlsKCkucmVtb3ZlRXZlbnQod2luZG93LCAnc2Nyb2xsJywgdGhpcy5zY3JvbGxIYW5kbGVyKTtcbiAgICAgIHRoaXMudXRpbCgpLnJlbW92ZUV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScsIHRoaXMuc2Nyb2xsSGFuZGxlcik7XG4gICAgICBpZiAodGhpcy5pbnRlcnZhbCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBXT1cucHJvdG90eXBlLnN5bmMgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICBpZiAoTXV0YXRpb25PYnNlcnZlci5ub3RTdXBwb3J0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9TeW5jKHRoaXMuZWxlbWVudCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIFdPVy5wcm90b3R5cGUuZG9TeW5jID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgdmFyIGJveCwgaiwgbGVuLCByZWYsIHJlc3VsdHM7XG4gICAgICBpZiAoZWxlbWVudCA9PSBudWxsKSB7XG4gICAgICAgIGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XG4gICAgICB9XG4gICAgICBpZiAoZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlIHx8IGVsZW1lbnQ7XG4gICAgICByZWYgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuXCIgKyB0aGlzLmNvbmZpZy5ib3hDbGFzcyk7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgYm94ID0gcmVmW2pdO1xuICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKHRoaXMuYWxsLCBib3gpIDwgMCkge1xuICAgICAgICAgIHRoaXMuYm94ZXMucHVzaChib3gpO1xuICAgICAgICAgIHRoaXMuYWxsLnB1c2goYm94KTtcbiAgICAgICAgICBpZiAodGhpcy5zdG9wcGVkIHx8IHRoaXMuZGlzYWJsZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5yZXNldFN0eWxlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYXBwbHlTdHlsZShib3gsIHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5zY3JvbGxlZCA9IHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9O1xuXG4gICAgV09XLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oYm94KSB7XG4gICAgICB0aGlzLmFwcGx5U3R5bGUoYm94KTtcbiAgICAgIGJveC5jbGFzc05hbWUgPSBib3guY2xhc3NOYW1lICsgXCIgXCIgKyB0aGlzLmNvbmZpZy5hbmltYXRlQ2xhc3M7XG4gICAgICBpZiAodGhpcy5jb25maWcuY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNvbmZpZy5jYWxsYmFjayhib3gpO1xuICAgICAgfVxuICAgICAgdGhpcy51dGlsKCkuZW1pdEV2ZW50KGJveCwgdGhpcy53b3dFdmVudCk7XG4gICAgICB0aGlzLnV0aWwoKS5hZGRFdmVudChib3gsICdhbmltYXRpb25lbmQnLCB0aGlzLnJlc2V0QW5pbWF0aW9uKTtcbiAgICAgIHRoaXMudXRpbCgpLmFkZEV2ZW50KGJveCwgJ29hbmltYXRpb25lbmQnLCB0aGlzLnJlc2V0QW5pbWF0aW9uKTtcbiAgICAgIHRoaXMudXRpbCgpLmFkZEV2ZW50KGJveCwgJ3dlYmtpdEFuaW1hdGlvbkVuZCcsIHRoaXMucmVzZXRBbmltYXRpb24pO1xuICAgICAgdGhpcy51dGlsKCkuYWRkRXZlbnQoYm94LCAnTVNBbmltYXRpb25FbmQnLCB0aGlzLnJlc2V0QW5pbWF0aW9uKTtcbiAgICAgIHJldHVybiBib3g7XG4gICAgfTtcblxuICAgIFdPVy5wcm90b3R5cGUuYXBwbHlTdHlsZSA9IGZ1bmN0aW9uKGJveCwgaGlkZGVuKSB7XG4gICAgICB2YXIgZGVsYXksIGR1cmF0aW9uLCBpdGVyYXRpb247XG4gICAgICBkdXJhdGlvbiA9IGJveC5nZXRBdHRyaWJ1dGUoJ2RhdGEtd293LWR1cmF0aW9uJyk7XG4gICAgICBkZWxheSA9IGJveC5nZXRBdHRyaWJ1dGUoJ2RhdGEtd293LWRlbGF5Jyk7XG4gICAgICBpdGVyYXRpb24gPSBib3guZ2V0QXR0cmlidXRlKCdkYXRhLXdvdy1pdGVyYXRpb24nKTtcbiAgICAgIHJldHVybiB0aGlzLmFuaW1hdGUoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuY3VzdG9tU3R5bGUoYm94LCBoaWRkZW4sIGR1cmF0aW9uLCBkZWxheSwgaXRlcmF0aW9uKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICB9O1xuXG4gICAgV09XLnByb3RvdHlwZS5hbmltYXRlID0gKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCdyZXF1ZXN0QW5pbWF0aW9uRnJhbWUnIGluIHdpbmRvdykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICByZXR1cm4gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShjYWxsYmFjayk7XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KSgpO1xuXG4gICAgV09XLnByb3RvdHlwZS5yZXNldFN0eWxlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYm94LCBqLCBsZW4sIHJlZiwgcmVzdWx0cztcbiAgICAgIHJlZiA9IHRoaXMuYm94ZXM7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgYm94ID0gcmVmW2pdO1xuICAgICAgICByZXN1bHRzLnB1c2goYm94LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZScpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfTtcblxuICAgIFdPVy5wcm90b3R5cGUucmVzZXRBbmltYXRpb24gPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgdmFyIHRhcmdldDtcbiAgICAgIGlmIChldmVudC50eXBlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZignYW5pbWF0aW9uZW5kJykgPj0gMCkge1xuICAgICAgICB0YXJnZXQgPSBldmVudC50YXJnZXQgfHwgZXZlbnQuc3JjRWxlbWVudDtcbiAgICAgICAgcmV0dXJuIHRhcmdldC5jbGFzc05hbWUgPSB0YXJnZXQuY2xhc3NOYW1lLnJlcGxhY2UodGhpcy5jb25maWcuYW5pbWF0ZUNsYXNzLCAnJykudHJpbSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBXT1cucHJvdG90eXBlLmN1c3RvbVN0eWxlID0gZnVuY3Rpb24oYm94LCBoaWRkZW4sIGR1cmF0aW9uLCBkZWxheSwgaXRlcmF0aW9uKSB7XG4gICAgICBpZiAoaGlkZGVuKSB7XG4gICAgICAgIHRoaXMuY2FjaGVBbmltYXRpb25OYW1lKGJveCk7XG4gICAgICB9XG4gICAgICBib3guc3R5bGUudmlzaWJpbGl0eSA9IGhpZGRlbiA/ICdoaWRkZW4nIDogJ3Zpc2libGUnO1xuICAgICAgaWYgKGR1cmF0aW9uKSB7XG4gICAgICAgIHRoaXMudmVuZG9yU2V0KGJveC5zdHlsZSwge1xuICAgICAgICAgIGFuaW1hdGlvbkR1cmF0aW9uOiBkdXJhdGlvblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChkZWxheSkge1xuICAgICAgICB0aGlzLnZlbmRvclNldChib3guc3R5bGUsIHtcbiAgICAgICAgICBhbmltYXRpb25EZWxheTogZGVsYXlcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoaXRlcmF0aW9uKSB7XG4gICAgICAgIHRoaXMudmVuZG9yU2V0KGJveC5zdHlsZSwge1xuICAgICAgICAgIGFuaW1hdGlvbkl0ZXJhdGlvbkNvdW50OiBpdGVyYXRpb25cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB0aGlzLnZlbmRvclNldChib3guc3R5bGUsIHtcbiAgICAgICAgYW5pbWF0aW9uTmFtZTogaGlkZGVuID8gJ25vbmUnIDogdGhpcy5jYWNoZWRBbmltYXRpb25OYW1lKGJveClcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGJveDtcbiAgICB9O1xuXG4gICAgV09XLnByb3RvdHlwZS52ZW5kb3JzID0gW1wibW96XCIsIFwid2Via2l0XCJdO1xuXG4gICAgV09XLnByb3RvdHlwZS52ZW5kb3JTZXQgPSBmdW5jdGlvbihlbGVtLCBwcm9wZXJ0aWVzKSB7XG4gICAgICB2YXIgbmFtZSwgcmVzdWx0cywgdmFsdWUsIHZlbmRvcjtcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAobmFtZSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgIHZhbHVlID0gcHJvcGVydGllc1tuYW1lXTtcbiAgICAgICAgZWxlbVtcIlwiICsgbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgaiwgbGVuLCByZWYsIHJlc3VsdHMxO1xuICAgICAgICAgIHJlZiA9IHRoaXMudmVuZG9ycztcbiAgICAgICAgICByZXN1bHRzMSA9IFtdO1xuICAgICAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgdmVuZG9yID0gcmVmW2pdO1xuICAgICAgICAgICAgcmVzdWx0czEucHVzaChlbGVtW1wiXCIgKyB2ZW5kb3IgKyAobmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSkgKyAobmFtZS5zdWJzdHIoMSkpXSA9IHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHMxO1xuICAgICAgICB9KS5jYWxsKHRoaXMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH07XG5cbiAgICBXT1cucHJvdG90eXBlLnZlbmRvckNTUyA9IGZ1bmN0aW9uKGVsZW0sIHByb3BlcnR5KSB7XG4gICAgICB2YXIgaiwgbGVuLCByZWYsIHJlc3VsdCwgc3R5bGUsIHZlbmRvcjtcbiAgICAgIHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtKTtcbiAgICAgIHJlc3VsdCA9IHN0eWxlLmdldFByb3BlcnR5Q1NTVmFsdWUocHJvcGVydHkpO1xuICAgICAgcmVmID0gdGhpcy52ZW5kb3JzO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHZlbmRvciA9IHJlZltqXTtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0IHx8IHN0eWxlLmdldFByb3BlcnR5Q1NTVmFsdWUoXCItXCIgKyB2ZW5kb3IgKyBcIi1cIiArIHByb3BlcnR5KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIFdPVy5wcm90b3R5cGUuYW5pbWF0aW9uTmFtZSA9IGZ1bmN0aW9uKGJveCkge1xuICAgICAgdmFyIGFuaW1hdGlvbk5hbWU7XG4gICAgICB0cnkge1xuICAgICAgICBhbmltYXRpb25OYW1lID0gdGhpcy52ZW5kb3JDU1MoYm94LCAnYW5pbWF0aW9uLW5hbWUnKS5jc3NUZXh0O1xuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICAgIGFuaW1hdGlvbk5hbWUgPSBnZXRDb21wdXRlZFN0eWxlKGJveCkuZ2V0UHJvcGVydHlWYWx1ZSgnYW5pbWF0aW9uLW5hbWUnKTtcbiAgICAgIH1cbiAgICAgIGlmIChhbmltYXRpb25OYW1lID09PSAnbm9uZScpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGFuaW1hdGlvbk5hbWU7XG4gICAgICB9XG4gICAgfTtcblxuICAgIFdPVy5wcm90b3R5cGUuY2FjaGVBbmltYXRpb25OYW1lID0gZnVuY3Rpb24oYm94KSB7XG4gICAgICByZXR1cm4gdGhpcy5hbmltYXRpb25OYW1lQ2FjaGUuc2V0KGJveCwgdGhpcy5hbmltYXRpb25OYW1lKGJveCkpO1xuICAgIH07XG5cbiAgICBXT1cucHJvdG90eXBlLmNhY2hlZEFuaW1hdGlvbk5hbWUgPSBmdW5jdGlvbihib3gpIHtcbiAgICAgIHJldHVybiB0aGlzLmFuaW1hdGlvbk5hbWVDYWNoZS5nZXQoYm94KTtcbiAgICB9O1xuXG4gICAgV09XLnByb3RvdHlwZS5zY3JvbGxIYW5kbGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY3JvbGxlZCA9IHRydWU7XG4gICAgfTtcblxuICAgIFdPVy5wcm90b3R5cGUuc2Nyb2xsQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBib3g7XG4gICAgICBpZiAodGhpcy5zY3JvbGxlZCkge1xuICAgICAgICB0aGlzLnNjcm9sbGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYm94ZXMgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGosIGxlbiwgcmVmLCByZXN1bHRzO1xuICAgICAgICAgIHJlZiA9IHRoaXMuYm94ZXM7XG4gICAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgYm94ID0gcmVmW2pdO1xuICAgICAgICAgICAgaWYgKCEoYm94KSkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlzVmlzaWJsZShib3gpKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2hvdyhib3gpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChib3gpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfSkuY2FsbCh0aGlzKTtcbiAgICAgICAgaWYgKCEodGhpcy5ib3hlcy5sZW5ndGggfHwgdGhpcy5jb25maWcubGl2ZSkpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zdG9wKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgV09XLnByb3RvdHlwZS5vZmZzZXRUb3AgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICB2YXIgdG9wO1xuICAgICAgd2hpbGUgKGVsZW1lbnQub2Zmc2V0VG9wID09PSB2b2lkIDApIHtcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICAgIH1cbiAgICAgIHRvcCA9IGVsZW1lbnQub2Zmc2V0VG9wO1xuICAgICAgd2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudCkge1xuICAgICAgICB0b3AgKz0gZWxlbWVudC5vZmZzZXRUb3A7XG4gICAgICB9XG4gICAgICByZXR1cm4gdG9wO1xuICAgIH07XG5cbiAgICBXT1cucHJvdG90eXBlLmlzVmlzaWJsZSA9IGZ1bmN0aW9uKGJveCkge1xuICAgICAgdmFyIGJvdHRvbSwgb2Zmc2V0LCB0b3AsIHZpZXdCb3R0b20sIHZpZXdUb3A7XG4gICAgICBvZmZzZXQgPSBib3guZ2V0QXR0cmlidXRlKCdkYXRhLXdvdy1vZmZzZXQnKSB8fCB0aGlzLmNvbmZpZy5vZmZzZXQ7XG4gICAgICB2aWV3VG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgdmlld0JvdHRvbSA9IHZpZXdUb3AgKyBNYXRoLm1pbih0aGlzLmVsZW1lbnQuY2xpZW50SGVpZ2h0LCB0aGlzLnV0aWwoKS5pbm5lckhlaWdodCgpKSAtIG9mZnNldDtcbiAgICAgIHRvcCA9IHRoaXMub2Zmc2V0VG9wKGJveCk7XG4gICAgICBib3R0b20gPSB0b3AgKyBib3guY2xpZW50SGVpZ2h0O1xuICAgICAgcmV0dXJuIHRvcCA8PSB2aWV3Qm90dG9tICYmIGJvdHRvbSA+PSB2aWV3VG9wO1xuICAgIH07XG5cbiAgICBXT1cucHJvdG90eXBlLnV0aWwgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl91dGlsICE9IG51bGwgPyB0aGlzLl91dGlsIDogdGhpcy5fdXRpbCA9IG5ldyBVdGlsKCk7XG4gICAgfTtcblxuICAgIFdPVy5wcm90b3R5cGUuZGlzYWJsZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhdGhpcy5jb25maWcubW9iaWxlICYmIHRoaXMudXRpbCgpLmlzTW9iaWxlKG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgIH07XG5cbiAgICByZXR1cm4gV09XO1xuXG4gIH0pKCk7XG5cbn0pLmNhbGwodGhpcyk7XG4iXX0=
