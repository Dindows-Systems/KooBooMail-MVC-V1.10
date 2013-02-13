/*
*
* variable editor, config img
* author: ronglin
* create date: 2010.08.09
*
*/

/*
* config parameters:
* node
*/

(function ($) {

    // text resource
    var options = {
        message: 'nubmer format error.',
        imgSizeConfirm: 'The image size is too large.\nThis size may break the layout.\nAre you sure you want to set this size?',
        btnLib: 'lib',
        attrSrc: 'src:',
        attrAlt: 'alt:',
        attrWidth: 'width:',
        attrHeight: 'height:',
        imgLibTitle: 'Image library'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.configImg_js); }

    /*
    * config img
    */
    var configImg = function (config) {
        configImg.superclass.constructor.call(this, config);
    };

    yardi.extend(configImg, yardi.varEditor.baseConfig, {

        buildHtml: function () {
            var html = [];
            html.push('<fieldset><legend>' + this.name + '</legend>');
            html.push('<div class="row">');
            html.push('<span>' + options.attrSrc + '</span><br/>');
            html.push('<input _src="1" type="text" style="width:130px;" />');
            html.push('<input _lib="1" type="button" class="kb-btn" value="' + options.btnLib + '" style="width:24px;" />');
            html.push('</div>');
            html.push('<div class="row">');
            html.push('<span>' + options.attrAlt + '</span><input _alt="1" type="text" />');
            html.push('</div>');
            html.push('<div class="row">');
            html.push('<span>' + options.attrWidth + ' </span><input _w="1" type="text" style="width:25px;" />');
            html.push('<span> ' + options.attrHeight + ' </span><input _h="1" type="text" style="width:25px;" /> px');
            html.push('</div>');
            //if (this.kooboo) {
            //    html.push('<div class="row">');
            //    html.push('<span>src from:</span><input _srcfrom="1" type="text" />');
            //    html.push('</div>');
            //}
            html.push('</fieldset>');
            return html.join('');
        },

        bindEvents: function () {
            var self = this, set = function (p, v) {
                if (v.jquery) {
                    var o = v, str = o.val(), num = parseFloat(str);
                    if (yardi.isNumber(num) && num.toString().length == str.length) {
                        if (self.editor.editNode[p]() < num && !confirm(options.imgSizeConfirm)) {
                            o.val(self.node[p]()).focus().select().data('errored', true);
                            return false;
                        }
                        v = Math.max(num, 0);
                        o.val(v.toString()).removeData('errored');
                    } else {
                        alert(p + ' ' + options.message);
                        o.focus().select().data('errored', true);
                        return false;
                    }
                }
                try {
                    self.node.css(p, null).attr(p, v);
                } catch (ex) { }
            };

            this.synchronous($('input[_src=1]', this.el), function () {
                self.node.attr('src', $(this).val());
            }, this.node.attr('src'));

            this.synchronous($('input[_alt=1]', this.el), function () {
                self.node.attr('alt', $(this).val());
            }, this.node.attr('alt'));

            this.synchronous($('input[_w=1]', this.el), function () {
                if (set('width', $(this)) !== false) {
                    // refresh notice
                    self.hideNotice();
                    self.doHighlight();
                }
            }, this.node.width(), 'change');
            set('width', this.node.width());

            this.synchronous($('input[_h=1]', this.el), function () {
                if (set('height', $(this)) !== false) {
                    // refresh notice
                    self.hideNotice();
                    self.doHighlight();
                }
            }, this.node.height(), 'change');
            set('height', this.node.height());

            //if (this.kooboo) {
            //    this.synchronous($('input[_srcfrom=1]', this.el), function () {
            //        self.node.attr('src', $(this).val());
            //        self.node.attr('srcfrom', $(this).val());
            //    }, this.node.attr('srcfrom'));
            //}

            // library
            $('input[_lib=1]', this.el).click(function (ev) {
                var lib = new yardi.imgLib({
                    outerDialog: true,
                    title: options.imgLibTitle,
                    url: _vpath + 'WebFile/Index',
                    OnSelect: function (url, w, h, alt) {
                        // width (notice: set size first before set url, or the page cause a flash .
                        var ow = $('input[_w=1]', self.el).change();
                        if (!ow.val()) { ow.val(w); }
                        // height
                        var oh = $('input[_h=1]', self.el).change();
                        if (!oh.val()) { oh.val(h); }
                        // alt
                        var oa = $('input[_alt=1]', self.el).change();
                        if (!oa.val()) { oa.val(alt); }
                        // src
                        $('input[_src=1]', self.el).val(url).change();
                        // refresh notice
                        self.hideNotice();
                        self.doHighlight();
                    }
                });
                lib.show();
            });
        },

        // notice element
        _notice: null,

        showNotice: function (cls) {
            if (!this._notice) {
                var pos = this.node.offset(), w = this.node.width(), h = this.node.height();
                // left
                var left = $('<div class="' + cls + '"></div>').appendTo('body');
                left.css({
                    top: pos.top - 1,
                    left: pos.left - 1,
                    width: 0,
                    height: h
                });
                // top
                var top = $('<div class="' + cls + '"></div>').appendTo('body');
                top.css({
                    top: pos.top - 1,
                    left: pos.left - 1,
                    width: w,
                    height: 0
                });
                // right
                var right = $('<div class="' + cls + '"></div>').appendTo('body');
                right.css({
                    top: pos.top - 1,
                    left: pos.left - 1 + w,
                    width: 0,
                    height: h
                });
                // bottom
                var bottom = $('<div class="' + cls + '"></div>').appendTo('body');
                bottom.css({
                    top: pos.top - 1 + h,
                    left: pos.left - 1,
                    width: w,
                    height: 0
                });
                // push
                this._notice = [left, top, right, bottom];
                $.each(this._notice, function (index, item) {
                    item.css({
                        position: 'absolute',
                        zIndex: 4
                    });
                    yardi.zTop(item);
                });
            }
        },

        hideNotice: function () {
            if (this._notice) {
                $.each(this._notice, function (index, item) {
                    item.remove();
                });
                this._notice = null;
            }
        },

        // hover
        doHover: function () {
            configImg.superclass.doHover.call(this);
            this.showNotice('kb-vareditor-img-hover');
        },
        unHover: function () {
            configImg.superclass.unHover.call(this);
            this.hideNotice();
        },

        // highlight
        doHighlight: function () {
            configImg.superclass.doHighlight.call(this);
            this.showNotice('kb-vareditor-img-hl');
        },
        unHighlight: function () {
            configImg.superclass.unHighlight.call(this);
            this.hideNotice();
        }

    });

    // register
    yardi.varEditor.registerType('IMG', configImg);

})(jQuery);
