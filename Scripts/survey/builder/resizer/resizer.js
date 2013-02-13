/*
*
* resizer
* author: ronglin
* create date: 2010.08.01
*
*/

/*
* config parameters:
* target, showUI
*/

(function ($) {

    var resizer = function (config) {
        $.extend(this, config);
        this.init();
    };

    resizer.prototype = {

        el: null, btn: null, mask: null,

        target: null, showUI: true, doc: null,

        monitor: null, lockX: false, lockY: false,

        _docMouseup: null,
        _docMousemove: null,

        // caches
        targetPos: null,
        targetSize: null,
        btnSize: null,
        minSize: null,

        start: function () {
            this.monitor.stop();
            this.disableSelection();
            this.mask.addClass('kb-mask-drapping');
            this.targetSize = { w: this.target.width(), h: this.target.height() };
            this.minSize = this.getTargetSize('min');
        },

        draging: function (offset) {
            // mask
            var w = (this.targetSize.w += offset.x)
            if (w >= this.minSize.w && !this.lockX) this.mask.css({ width: w });
            var h = (this.targetSize.h += offset.y);
            if (h >= this.minSize.h && !this.lockY) this.mask.css({ height: h });
            // btn
            var left = w - this.btnSize.w;
            if (left > 0 && !this.lockX) this.btn.css({ left: this.targetPos.left + left });
            var top = h - this.btnSize.h;
            if (top > 0 && !this.lockY) this.btn.css({ top: this.targetPos.top + top });
        },

        end: function () {
            this.enableSelection();
            this.mask.removeClass('kb-mask-drapping');
            this.target.css({
                width: this.mask.width(),
                height: this.mask.height()
            });
            // fix ie7 z-index bug
            this.mask.css({
                width: 0,
                height: 0
            });
            this.monitor.start();
        },

        getTargetSize: function (fn) {
            var docEl = document.documentElement, body = document.body;
            return {
                w: Math[fn](docEl.scrollWidth, body.scrollWidth),
                h: Math[fn](docEl.scrollHeight, body.scrollHeight)
            };
        },

        enableSelection: function () {
            return $(this.doc.body).attr('unselectable', 'off').css('MozUserSelect', '').unbind('selectstart');
        },

        disableSelection: function () {
            return $(this.doc.body).attr('unselectable', 'on').css('MozUserSelect', 'none').bind('selectstart', function () { return false; });
        },

        init: function () {
            this.target = $(this.target);
            this.doc = this.target.get(0).ownerDocument;
            this.el = $('<div class="kb-resizer"><div class="kb-mask"></div><div class="kb-btn" title="drag to resize or double click to trim size"></div></div>').appendTo(this.doc.body);
            this.btn = $('.kb-btn', this.el);
            this.mask = $('.kb-mask', this.el);
            // init events
            var self = this, drag = false, event;
            // doc event
            this._docMouseup = function () {
                self.end();
                drag = false;
                event = null;
                $(self.doc).unbind('mouseup', self._docMouseup).unbind('mousemove', self._docMousemove);
            };
            this._docMousemove = function (e) {
                if (drag && event) {
                    self.draging({
                        x: e.pageX - event.pageX,
                        y: e.pageY - event.pageY
                    });
                }
                event = e;
                return !drag;
            };
            // btn event
            this.btn.mouseover(function () {
                if (yardi.dialoging != true) {
                    $(this).addClass('kb-btn-hl');
                }
            }).mouseout(function () {
                $(this).removeClass('kb-btn-hl');
            }).mousedown(function (ev) {
                if (yardi.dialoging != true) {
                    drag = true;
                    event = ev;
                    self.start();
                    $(self.doc).mouseup(self._docMouseup).mousemove(self._docMousemove);
                }
            }).dblclick(function () {
                self.trim();
            });
            // other
            this.targetPos = this.target.offset();
            this.mask.css($.extend(this.targetPos, { width: 0, height: 0 }));
            this.btnSize = { w: 32 + 10, h: 32 + 10 }; // image size + offset size
            // monitor
            var oldSize = { w: 0, h: 0 };
            this.monitor = new yardi.Monitor({
                scope: this,
                interval: 50,
                tester: function () {
                    var size = this.getTargetSize('max');
                    if (oldSize.w != size.w || oldSize.h != size.h) {
                        oldSize.w = size.w; oldSize.h = size.h;
                        return true;
                    }
                },
                handler: function () {
                    if (oldSize.w && !this.lockX) {
                        this.btn.css({ left: this.targetPos.left + oldSize.w - this.btnSize.w });
                        this.target.css({ width: oldSize.w });
                    }
                    if (oldSize.h && !this.lockY) {
                        this.btn.css({ top: this.targetPos.top + oldSize.h - this.btnSize.h });
                        this.target.css({ height: oldSize.h });
                    }
                }
            });
            this.monitor.start();
            // showUI
            if (this.showUI !== true) {
                this.btn.hide();
                this.mask.hide();
            }
        },

        // public
        lock: function (dir) {
            // dir: '', 'x', 'y', 'xy';
            dir = (dir || '').toLowerCase();
            this.lockX = (dir.indexOf('x') > -1);
            this.lockY = (dir.indexOf('y') > -1);
            return this;
        },

        // public
        remove: function () {
            $(this.doc).unbind('mouseup', this._docMouseup).unbind('mousemove', this._docMousemove);
            this.monitor.stop();
            this.el.remove();
        },

        // public
        trim: function (force) {
            var min = this.getTargetSize('min');
            var css = {};
            if (!this.lockX || force === true) { css.width = min.w; }
            if (!this.lockY || force === true) { css.height = min.h; }
            this.target.animate(css, 200);
            return this;
        }
    };

    // register
    yardi.resizerClass = resizer;

})(jQuery);
