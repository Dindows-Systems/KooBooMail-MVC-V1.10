/*
*
*   callout
*   author: ronglin
*   create date: 2010.11.18
*
*/


(function () {

    var callout = function (options, refel) {
        this.settings = $.extend({}, callout.defaults, options);
        this.refel = refel;
        this.initialize();
    };

    callout.defaults = {
        color: '#ccc',
        content: '',
        arrowDirection: 'left', // left right up down
        renderTo: '.callout-cache'
    };

    callout.prototype = {

        el: null,

        refel: null,

        settings: null,

        initialize: function () {
            this.el = $(this.buildHtml()).appendTo(this.settings.renderTo);
            this.setColor(this.settings.color);
            this.setContent(this.settings.content);
            // click
            this.el.click(function () {
                $(this).css('z-index', ++maxZIndex);
                return false;
            });
            // interval
            var self = this;
            this.settings._intervalId = setInterval(function () {
                self.fixPos();
            }, 256);
        },

        buildHtml: function () {
            var html = [];
            html.push('<table class="callout" cellpadding="0" cellspacing="0" border="0">');
            switch (this.settings.arrowDirection) {
                case 'left':
                    html.push('<tr><td><em class="left"></em></td>');
                    html.push('<td style="width:100%;"><div class="content"></div></td></tr>');
                    break;
                case 'right':
                    html.push('<tr><td style="width:100%;"><div class="content"></div></td>');
                    html.push('<td><em class="right"></em></td></tr>');
                    break;
                case 'up':
                    html.push('<tr><td><em class="up"></em></td></tr>');
                    html.push('<tr><td><div class="content"></div></td></tr>');
                    break;
                case 'down':
                    html.push('<tr><td><div class="content"></div></td></tr>');
                    html.push('<tr><td><em class="down"></em></td></tr>');
                    break;
            }
            html.push('</table>');
            return html.join('');
        },

        getPos: function (refel) {
            var refPos = refel.offset();
            var refHeight = refel.outerHeight(), refWidth = refel.outerWidth();
            var selHeight = this.el.outerHeight(), selWidth = this.el.outerWidth();
            switch (this.settings.arrowDirection) {
                case 'left':
                    return { left: refPos.left + refWidth, top: refPos.top };
                case 'right':
                    return { left: refPos.left - selWidth, top: refPos.top };
                case 'up':
                    return { left: refPos.left + refWidth / 2, top: refPos.top + refHeight };
                case 'down':
                    return { left: refPos.left + refWidth / 2, top: refPos.top - selHeight };
            }
        },

        // public
        remove: function () {
            clearInterval(this.settings._intervalId);
            this.el.remove();
        },

        // public
        fixPos: function () {
            this.el.css(this.getPos(this.refel));
        },

        // public
        setContent: function (content) {
            this.el.find('.content').html(content);
            this.fixPos();
        },

        // public
        setColor: function (color) {
            this.el.find('.content').css('border-color', color).css('background-color', color);
            var arrow = this.el.find('em');
            switch (this.settings.arrowDirection) {
                case 'left': arrow.css('border-right-color', color); break;
                case 'right': arrow.css('border-left-color', color); break;
                case 'up': arrow.css('border-bottom-color', color); break;
                case 'down': arrow.css('border-top-color', color); break;
            }
        }
    };

    var maxZIndex = null;
    var calloutSet = [];
    var widthIn = function (sx, sy, sw, sh, x, y) {
        return (x >= sx) && (x <= sx + sw) &&
               (y >= sy) && (y <= sy + sh);
    };
    var isIntersect = function (el1, el2) {
        var pos1 = el1.offset(), pos2 = el2.offset();
        var width1 = el1.outerWidth(), width2 = el2.outerWidth();
        var height1 = el1.outerHeight(), height2 = el2.outerHeight();
        var isIn = widthIn(pos1.left, pos1.top, width1, height1, pos2.left, pos2.top) ||
                   widthIn(pos1.left, pos1.top, width1, height1, pos2.left, pos2.top + height2) ||
                   widthIn(pos1.left, pos1.top, width1, height1, pos2.left + width2, pos2.top) ||
                   widthIn(pos1.left, pos1.top, width1, height1, pos2.left + width2, pos2.top + height2);
        return (isIn ? true : false);
    };
    var checkPosition = function (obj, refs) {
        var ok = true;
        $.each(calloutSet, function (index, item) {
            if (isIntersect(obj.el.find('.content'), item.el.find('.content'))) {
                ok = false;
                return false;
            }
        });
        $.each(refs, function (index, item) {
            if (isIntersect(obj.el.find('.content'), $(item))) {
                ok = false;
                return false;
            }
        });
        return ok;
    };

    /*
    * jquery entrance
    */
    $.extend($.fn, {
        callout: function (options) {

            // closure
            options = options || {};

            // check has elements
            if (!this.length) {
                options.debug && window.console && console.warn('nothing selected');
                return this;
            }

            // element cache container
            if (!options.renderTo && $('.callout-cache').length == 0) {
                options.renderTo = $('<div class="callout-cache"></div>').appendTo('body');
            }

            // loop
            var refs = this;
            this.each(function () {

                // get max z-index
                if (maxZIndex === null) {
                    var zmax = 0;
                    $('*').each(function () {
                        var cur = parseInt($(this).css('z-index'));
                        zmax = cur > zmax ? cur : zmax;
                    });
                    maxZIndex = zmax + 1;
                }

                // get cache
                var o = $.data(this, 'callout');
                if (o) { return o; }

                // get color
                var color, c = options.color;
                if (c) { color = (typeof (c) === 'function') ? c.call(this) : c; }

                // get content
                var content, ctn = options.content;
                if (ctn) { content = (typeof (ctn) === 'function') ? ctn.call(this) : ctn; }

                // new instance
                var directions = ['left', 'down', 'right', 'up'], dlen = directions.length - 1, refel = $(this);
                $.each(directions, function (index, item) {
                    o = new callout($.extend({}, options, {
                        color: color || callout.defaults.color,
                        content: content || callout.defaults.content,
                        arrowDirection: item
                    }), refel);
                    var ok = checkPosition(o, refs);
                    if (ok) { return false; }
                    if (index < dlen) { o.remove(); }
                });
                o.el.css('z-index', maxZIndex);

                // set cache
                calloutSet.push(o);
                $.data(this, 'callout', o);

                // ret
                return o;
            });

            // ret
            return this;
        }
    });

})();
