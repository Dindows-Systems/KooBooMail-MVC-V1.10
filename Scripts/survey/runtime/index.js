/*
*
* index
* author: ronglin
* create date: 2010.07.08
*
*/

(function () {

    /*
    * core helpers
    */
    var core = {
        ie: function () {
            return ! -[1, ];
        } (),
        on: function (o, type, fn) {
            if (o.addEventListener) { o.addEventListener(type, fn, false); }
            else if (o.attachEvent) { o.attachEvent('on' + type, fn); }
            else { o['on' + type] = fn; }
        },
        unon: function (o, type, fn) {
            if (o.removeEventListener) { o.removeEventListener(type, fn, false); }
            else if (o.detachEvent) { o.detachEvent('on' + type, fn); }
            else { o['on' + type] = null; }
        },
        prevent: function (ev) {
            if (ev.preventDefault) { ev.preventDefault(); }
            else { ev.returnValue = false; }
        },
        css: function (el, p, v) {
            if (v === undefined) {
                var s = el.currentStyle || el.ownerDocument.defaultView.getComputedStyle(el, null);
                return (p === undefined) ? s : s[p];
            } else {
                el.style[p] = v;
            }
        },
        each: function (o, cb) {
            if (undefined === o.length) {
                for (var k in o) {
                    if (cb(o[k], k, o) === false) { break; }
                }
            } else {
                for (var i = 0, len = o.length; i < len; i++) {
                    if (i in o) { if (cb(o[i], i, o) === false) break; }
                }
            }
        },
        extend: function (o, c) {
            if (o && c && typeof c == 'object') { for (var p in c) o[p] = c[p]; }
            return o;
        },
        contains: function (p, c) {
            var ret = false;
            if (p && c) {
                if (p.contains) {
                    return p.contains(c);
                } else if (p.compareDocumentPosition) {
                    return !!(p.compareDocumentPosition(c) & 16);
                } else {
                    while (c = c.parentNode) { ret = c == p || ret; }
                }
            }
            return ret;
        },
        getBy: function (tag, fit, ctx) {
            var list = (ctx || document).getElementsByTagName(tag), els = [], len = 0;
            core.each(list, function (o) {
                if (!fit || fit(o))
                    els[len++] = o;
            });
            return els;
        }
    };

    var $ = function (fn) { $.on(window, 'load', fn); };
    core.extend($, core);

    /*
    * message box
    */
    var messageBox = function (config) {
        $.extend(this, config);
        this.initialize();
    };
    messageBox.prototype = {
        el: null,
        ref: null,
        message: null,
        className: null,
        initialize: function () {
            this.el = document.createElement('div');
            this.el.className = this.className;
            document.body.appendChild(this.el);
            if (this.message) { this.show(this.message); }
        },
        show: function (msg) {
            this.hide();
            var self = this;
            this.position = function () {
                $.css(self.el, 'top', (self.ref.offsetTop + 2) + 'px');
                $.css(self.el, 'left', (self.ref.offsetLeft + self.ref.offsetWidth - 2) + 'px');
            };
            this.position();
            this.el.innerHTML = msg;
            $.css(this.el, 'display', 'block');
            $.on(window, 'resize', this.position);
        },
        hide: function () {
            $.css(this.el, 'display', 'none');
            if (this.position) {
                $.unon(window, 'resize', this.position);
                this.position = null;
            }
        },
        destroy: function () {
            this.hide();
            document.body.removeChild(this.el);
            this.el = this.ref = null;
        }
    };

    /*
    * wraps
    */
    var wraps = function () {
        var guideBox = null;
        var verifyBoxs = [];
        return {
            guideline: function (item) {
                if (guideBox) {
                    if (guideBox.ref == item.ref) { return; }
                    guideBox.destroy();
                    guideBox = null;
                }
                if (item === false) { return; }
                guideBox = new messageBox({
                    ref: (item.ref || item.parent),
                    message: item.msg,
                    className: 'runtime-guideline'
                });
            },
            validation: function (list) {
                $.each(verifyBoxs, function (box) {
                    box.destroy();
                });
                verifyBoxs = [];
                $.each(list, function (item) {
                    verifyBoxs.push(new messageBox({
                        ref: (item.ref || item.parent),
                        message: item.msg,
                        className: 'runtime-validation'
                    }));
                });
            },
            findRef: function (next) {
                var ref;
                while (next) {
                    if (next.className == 'wrap' ||
                        next.className == 'group') {
                        ref = next;
                        break;
                    }
                    next = next.nextSibling;
                }
                return ref;
            },
            scrollIntoView: function (el) {
                // 'true' fix to top, 'false' fix to center
                el.scrollIntoView(true);
            },
            valTags: ['input', 'select', 'textarea']
        };
    } ();

    // bind guideline
    $(function () {
        // collect all guideline
        var timeoutId, fields = [];
        var labels = $.getBy('label', function (item) {
            return (item.className == 'guideline');
        });
        $.each(labels, function (o) {
            fields.push({
                parent: o.parentNode,
                ref: wraps.findRef(o),
                msg: o.innerHTML
            });
        });
        // get focused node
        var focused = null, checkelms = [];
        var checkfn = function (ev) { focused = ev.srcElement || ev.target; }
        $.each(wraps.valTags, function (tag) {
            $.each(document.getElementsByTagName(tag), function (o) { checkelms.push(o); });
        });
        $.on(document, 'click', checkfn);
        $.each(checkelms, function (o) { $.on(o, 'focus', checkfn); });
        // show current guideline
        setInterval(function () {
            var field;
            if (focused) {
                $.each(fields, function (f) {
                    if (f.parent == focused || $.contains(f.parent, focused)) {
                        field = f;
                        return false;
                    }
                });
            }
            wraps.guideline(field || false);
        }, 100);
    });

    // bind close
    $(function () {
        var btnClose = document.getElementById('btnClose');
        if (btnClose) {
            $.on(btnClose, 'click', function () {
                window.opener = null;
                window.open('', '_self');
                window.close();
            });
        }
    });

    // bind required
    $(function () {
        // collect validates
        var form = document.forms[0];
        if (!form) { return; }
        var validates = [];
        var labels = $.getBy('label', function (o) {
            return (o.className == 'require');
        });
        $.each(labels, function (o) {
            if ($.css(o, 'display') == 'inline') {
                var inputs = [], parent = o.parentNode;
                $.each(wraps.valTags, function (tag) {
                    var os = $.getBy(tag, null, parent);
                    if (os.length > 0) { inputs = inputs.concat(os); }
                });
                validates.push({
                    inputs: inputs,
                    parent: parent,
                    ref: wraps.findRef(o),
                    msg: 'This field is required.'
                });
            }
        });
        // form submit
        var isPrevious = false;
        if (window.previousBtnName) {
            var previousBtn = document.getElementById(previousBtnName);
            if (previousBtn) { $.on(previousBtn, 'click', function () { isPrevious = true; }); }
        }
        $.on(form, 'submit', function (ev) {
            if (isPrevious) {
                isPrevious = false;
                return true; // continue
            }
            var empties = [];
            $.each(validates, function (item) {
                var empty = true;
                $.each(item.inputs, function (el) {
                    if (el.parentNode.className == 'comment' && $.css(el.parentNode, 'display') == 'none')
                        return true; // continue
                    if ((el.type == 'checkbox' || el.type == 'radio') && el.checked === true) {
                        empty = false;
                    } else if ((el.tagName == 'TEXTAREA' || el.type == 'text') && el.value != '') {
                        empty = false;
                    } else if (el.tagName == 'SELECT' && el.selectedIndex > -1 && el.childNodes[el.selectedIndex].innerText != '') {
                        empty = false;
                    }
                });
                if (empty) { empties.push(item); }
            });
            wraps.validation(empties);
            if (empties.length > 0) {
                $.prevent(ev);
                wraps.scrollIntoView(empties[0].parent);
                return false; // break
            }
        });
        // thread Id
        if (window.location.href.indexOf('tid=') === -1) {
            var action = form.getAttribute('action');
            if (action && action.indexOf('tid=') === -1) {
                var threadId = Math.random().toString().substr(2);
                form.setAttribute('action', action + '&tid=' + threadId);
            }
        }
    });

})();