/*
*
* resourceLoader
* author: ronglin
* create date: 2010.06.10
*
*/

(function (win) {

    var monitor = function (interval, timeout) {
        this._interval = interval || 50;
        this._timeout = timeout || (30 * 1000);
    };

    monitor.prototype = {

        _interval: null,

        _intervalId: null,

        _timeout: null,

        start: function (condition, callback, scope) {
            var self = this, timecount = 0;
            scope = scope || win;
            this._intervalId = win.setInterval(function () {
                // timeout check
                if (self._timeout) {
                    timecount += self._interval;
                    if (timecount >= self._timeout) {
                        self.stop();
                    }
                }
                // condition check
                if (condition.call(scope) === true) {
                    callback.call(scope);
                }
            }, this._interval);
        },

        stop: function () {
            win.clearInterval(this._intervalId);
            this._intervalId = null;
        }
    };

    var currentStyle = function (node, prop) {
        if (node.currentStyle)
            return node.currentStyle[prop];
        else if (win.getComputedStyle)
            return document.defaultView.getComputedStyle(node, null)[prop];
    };

    var resourceLoader = function (files, onReady) {
        this.files = files || [];
        if (onReady) {
            this.onReady = onReady;
        }
    };

    resourceLoader.prototype = {

        files: [],

        onReady: function (nodes) { },

        createNode: function (type, attrs) {
            var node = document.createElement(type);
            if (attrs) {
                for (var name in attrs) {
                    try {
                        node.setAttribute(name, attrs[name]);
                        node[name] = attrs[name];
                    } catch (ex) { }
                }
            }
            return node;
        },

        appendIn: function (nodes) {
            var head = document.getElementsByTagName('head')[0];
            for (var i = 0; i < nodes.length; i++) {
                head.appendChild(nodes[i]);
            }
        },

        eventOnload: function (node, onload) {
            var listener = function () {
                if (node && node.readyState && /^(?!(?:loaded|complete)$)/.test(node.readyState))
                    return;
                node.onload = node.onreadystatechange = node.onerror = null;
                onload(node);
            };
            if (node.addEventListener) {
                node.addEventListener('load', listener, false);
                node.addEventListener('error', listener, false);
                node.addEventListener('readystatechange', listener, false);
            } else if (node.attachEvent) {
                node.attachEvent('onload', listener);
                node.attachEvent('onerror', listener);
                node.attachEvent('onreadystatechange', listener);
            } else {
                node.onload = node.onreadystatechange = node.onerror = listener;
            }
        },

        watchOnload: function (node, onload) {
            if (!node.myClass) return;
            // create proxy el
            var el = document.createElement('div');
            el.className = node.myClass;
            el.style.display = 'none';
            document.body.appendChild(el);
            // watch
            var m = new monitor(10);
            var listener = function () {
                m.stop();
                document.body.removeChild(el);
                onload(this);
            };
            var cachedCss = { border: null, borderTop: null, borderTopColor: null, borderTopStyle: null, borderTopWidth: null };
            for (var key in cachedCss) {
                cachedCss[key] = currentStyle(el, key);
            }
            m.start(function () {
                for (var key in cachedCss) {
                    if (currentStyle(el, key) != cachedCss[key]) {
                        return true;
                    }
                }
            }, listener, node);
        },

        load: function () {
            var self = this,
            jsNodes = [], readyJsNodes = [],
            cssNodes = [], readyCssNodes = [];
            var checkReady = function (n) {
                if (fn = self.files[n.myIndex].onload) {
                    fn(n);
                }
                if (readyJsNodes.length + readyCssNodes.length == self.files.length) {
                    self.onReady(readyJsNodes.concat(readyCssNodes));
                }
            };
            for (var i = 0, len = this.files.length; i < len; i++) {
                var file = this.files[i], node = null;
                if (file.type != 'css') {
                    node = this.createNode('script', {
                        myIndex: i,
                        src: file.src,
                        type: 'text/javascript',
                        charset: file.charset || document.charset || document.characterSet || 'utf-8'
                    });
                    jsNodes.push(node);
                    this.eventOnload(node, function (n) {
                        readyJsNodes.push(n);
                        checkReady(n);
                    });
                } else {
                    node = this.createNode('link', {
                        myIndex: i,
                        myClass: file.flagClass,
                        href: file.src,
                        type: 'text/css',
                        rel: 'stylesheet',
                        charset: file.charset || document.charset || document.characterSet || 'utf-8'
                    });
                    cssNodes.push(node);
                    this.watchOnload(node, function (n) {
                        readyCssNodes.push(n);
                        checkReady(n);
                    });
                }
            }
            this.appendIn(cssNodes);
            this.appendIn(jsNodes);
        }
    };

    var readyList = [];

    var fireReady = function () {
        win.setTimeout(function () {
            for (var i = 0; i < readyList.length; i++) { readyList[i](); }
            readyList = [];
        }, 0);
    };

    win.resReady = function (fn) {
        readyList.push(fn);
    };

    win.loadRes = function (files, onReady) {
        var loader = new resourceLoader(files, function (readyNodes) {
            fireReady()
            if (onReady) {
                onReady(readyNodes);
            }
        });
        loader.load();
    };

})(window);