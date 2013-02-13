/*
*
* variable editor, base config (abstract class)
* author: ronglin
* create date: 2010.08.09
*
*/

/*
* config parameters:
* node, editor
*
* dispatch events:
* onHighlight, onHover
*/

(function ($) {

    var baseConfig = function (config) {
        $.extend(this, config);
        this.initialize();
    };

    baseConfig.prototype = {

        el: null,

        name: null,

        node: null, editor: null,

        kooboo: null,

        syncList: null,

        initialize: function () {
            // define event
            var self = this;
            $.each(['onHighlight', 'onHover'], function (index, item) {
                var cache = self[item];
                self[item] = new yardi.dispatcher(self);
                if (cache && yardi.isFunction(cache)) {
                    self[item].add(cache);
                }
            });
            // other
            this.node = $(this.node);
            this.name = this.node.attr('title');
            this.kooboo = (this.node.attr('kb') || this.node.attr('kooboo') || '').toLowerCase();
            this.syncList = [];
        },

        render: function (to) {
            // dom
            this.el = $('<div class="kb-vareditor-field">' + this.buildHtml() + '</div>').appendTo(to);
            this.bindEvents();
            // highlight events
            var self = this, threadId;
            var _highlight = function () {
                if (yardi.dialoging == true) { return; }
                clearTimeout(threadId);
                threadId = setTimeout(function () {
                    self.hlWrap();
                }, 100); // this timeout must longer then sync timeout
            };
            this.el.click(_highlight);
            $('input', this.el).focus(_highlight);
            this.node.click(_highlight).hover(function () {
                if (yardi.dialoging == true) { return; }
                if (!self.isHighlighted()) {
                    self.doHover();
                    // fire event
                    self.onHover.dispatch(self);
                }
            }, function () {
                self.isHovered() && self.unHover();
            });
        },

        remove: function () {
            this.unHover();
            this.unHighlight();
            $('input', this.el).unbind();
            this.node.unbind();
            this.el.unbind();
            this.el.remove();
        },

        // not test yet
        //refresh: function () {
        //    // cache insert position
        //    var to = this.el.parent();
        //    var next = this.el.next();
        //    // remove
        //    this.remove();
        //    this.render('body');
        //    if (next.length > 0) {
        //        this.el.insertBefore(next);
        //    } else {
        //        this.el.appendTo(to);
        //    }
        //},

        random: function () {
            return Math.random().toString().substr(2);
        },

        valueable: function (elem) {
            return /input|select|textarea|button/i.test(elem.attr('nodeName'));
        },

        triggerSync: function () {
            // trigger the change(the event always binded) to sync the value to node.
            var success = true, self = this;
            $.each(this.syncList, function (i, o) {
                o.data('triggered', true).change().removeData('triggered');
                if (o.data('errored')) {
                    self.hlWrap();
                    success = false;
                    return false;
                }
            });
            return success;
        },

        synchronous: function (el, func, v, trigger) {
            // cache
            this.syncList.push(el);

            // wrap func
            var threadId;
            var wrapper = function (ev) {
                if (yardi.dialoging == true) { return; }
                var self = this;
                if ($(this).data('triggered') === true) {
                    func.call(self, ev);
                } else {
                    clearTimeout(threadId);
                    threadId = setTimeout(function () {
                        func.call(self, ev);
                    }, 50); // this timeout must shorter then highlight timeout
                }
            };

            // bind this event always
            // for the triggerSync used.
            el.change(wrapper);

            // bind other event
            if (trigger) {
                (trigger != 'change') && el.bind(trigger, wrapper);
            } else {
                el.keyup(wrapper).mouseup(wrapper).blur(wrapper);
            }

            // set old value
            if (v != undefined) {
                if (yardi.isFunction(v)) {
                    v(el);
                } else {
                    if (this.valueable(el)) {
                        el.val(v);
                    } else {
                        el.html(v);
                    }
                }
            }
        },

        scroll2View: function () {
            var bounding = this.el.get(0).getBoundingClientRect(), height = this.el.height();
            var p = this.el.parent(), pBounding = p.get(0).getBoundingClientRect(), pHeight = p.height();
            var offset = 0;
            if (bounding.top < pBounding.top) {
                offset = bounding.top - pBounding.top;
            } else if (bounding.top + height > pBounding.top + pHeight) {
                offset = (bounding.top + height) - (pBounding.top + pHeight);
                if (height > pHeight) { offset = offset - (height - pHeight); }
            }
            if (offset != 0) {
                var scrollTop = p.attr('scrollTop') + offset;
                p.animate({ scrollTop: scrollTop }, 200);
            }
        },

        hlWrap: function () {
            if (!this.isHighlighted()) {
                // action
                this.unHover();
                this.doHighlight();
                this.scroll2View();
                // fire event
                this.onHighlight.dispatch(this);
            }
        },

        doHover: function () {
            this.el.addClass('kb-vareditor-field-hover');
            this.node.addClass('kb-vareditor-node-hover');
        },
        unHover: function () {
            this.el.removeClass('kb-vareditor-field-hover');
            this.node.removeClass('kb-vareditor-node-hover');
        },
        isHovered: function () {
            return this.node.hasClass('kb-vareditor-node-hover');
        },

        doHighlight: function () {
            this.el.addClass('kb-vareditor-field-hl');
            this.node.addClass('kb-vareditor-node-hl');
        },
        unHighlight: function () {
            this.el.removeClass('kb-vareditor-field-hl');
            this.node.removeClass('kb-vareditor-node-hl');
        },
        isHighlighted: function () {
            return this.node.hasClass('kb-vareditor-node-hl');
        },

        // sub class must override
        buildHtml: function () {
        },

        // sub class must override
        bindEvents: function () {
        }
    };

    // register
    yardi.varEditor.baseConfig = baseConfig;

})(jQuery);
