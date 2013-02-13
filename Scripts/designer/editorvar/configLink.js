/*
*
* variable editor, config link
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
        attrText: 'text:',
        attrHref: 'href:',
        attrDisableTracking: 'disable tracking:',
        attrLinkType: 'link type:',
        attrSrc: 'src:',
        attrAlt: 'alt:',
        attrWidth: 'width:',
        attrHeight: 'height:',
        linkTypeNormal: 'normal',
        linkTypeConfirmSubscription: 'confirm subscription',
        linkTypeUnsubscribe: 'unsubscribe',
        linkTypeOnlineVersion: 'online version',
        linkTypeForward: 'forward',
        imgLibTitle: 'Image library'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.configLink_js); }

    /*
    * config link
    */
    var configLink = function (config) {
        configLink.superclass.constructor.call(this, config);
    };

    yardi.extend(configLink, yardi.varEditor.baseConfig, {

        inputName: null,

        contentImgs: null,

        initialize: function () {
            configLink.superclass.initialize.call(this);
            this.contentImgs = $('img', this.node);
            this.inputName = this.random();
        },

        buildHtml: function () {
            var html = [];
            html.push('<fieldset><legend>' + this.name + '</legend>');
            // inner text
            if (this.contentImgs.length == 0) {
                html.push('<div class="row">');
                html.push('<span>' + options.attrText + '</span><input _html="1" type="text" />');
                html.push('</div>');
            }
            // href
            html.push('<div class="row">');
            html.push('<span>' + options.attrHref + '</span><input _href="1" type="text" />');
            html.push('</div>');
            // is kooboo
            //if (this.kooboo) {
            if (true) {
                // href from    
                //html.push('<div class="row">');
                //html.push('<span>href from:</span><input _hreffrom="1" type="text" />');
                //html.push('</div>');
                // track
                html.push('<div class="row">');
                html.push('<span>' + options.attrDisableTracking + '</span>');
                html.push('<input _track="1" type="checkbox" />');
                html.push('</div>');
                // linktype
                html.push('<div class="row">');
                html.push('<span>' + options.attrLinkType + '</span><br/>');
                var id = this.random();
                html.push('<input type="radio" name="' + this.inputName + '" id="' + id + '" value="" /><label for="' + id + '">' + options.linkTypeNormal + '</label><br/>');
                id = this.random();
                html.push('<input type="radio" name="' + this.inputName + '" id="' + id + '" value="confirm" /><label for="' + id + '">' + options.linkTypeConfirmSubscription + '</label><br/>');
                id = this.random();
                html.push('<input type="radio" name="' + this.inputName + '" id="' + id + '" value="unsubscribe" /><label for="' + id + '">' + options.linkTypeUnsubscribe + '</label><br/>');
                id = this.random();
                html.push('<input type="radio" name="' + this.inputName + '" id="' + id + '" value="onlineversion" /><label for="' + id + '">' + options.linkTypeOnlineVersion + '</label><br/>');
                id = this.random();
                html.push('<input type="radio" name="' + this.inputName + '" id="' + id + '" value="forward" /><label for="' + id + '">' + options.linkTypeForward + '</label>');
                html.push('</div>');
            }
            // inner images
            this.contentImgs.each(function (index) {
                // src
                html.push('<div class="row">');
                html.push('<span>' + options.attrSrc + '</span><br/><input _src="' + index + '" type="text" style="width:130px;" />');
                html.push('<input _lib="' + index + '" type="button" class="kb-btn" value="lib" style="width:24px;" />');
                html.push('</div>');
                // alt
                html.push('<div class="row">');
                html.push('<span>' + options.attrAlt + '</span><input _alt="' + index + '" type="text" />');
                html.push('</div>');
                // size
                html.push('<div class="row">');
                html.push('<span>' + options.attrWidth + ' </span><input _w="' + index + '" type="text" style="width:25px;" />');
                html.push('<span> ' + options.attrHeight + ' </span><input _h="' + index + '" type="text" style="width:25px;" /> px');
                html.push('</div>');
            });
            html.push('</fieldset>');
            return html.join('');
        },

        bindEvents: function () {
            var self = this;
            // inner text
            if (this.contentImgs.length == 0) {
                this.synchronous($('input[_html=1]', this.el), function () {
                    self.node.html($(this).val());
                }, this.node.text());
            }
            // href
            this.synchronous($('input[_href=1]', this.el), function () {
                self.node.attr('href', $(this).val());
            }, this.node.attr('href'));
            // is kooboo
            //if (this.kooboo) {
            if (true) {
                // href from
                //this.synchronous($('input[_hreffrom=1]', this.el), function () {
                //    self.node.attr('hreffrom', $(this).val());
                //}, this.node.attr('hreffrom'));
                // track
                this.synchronous($('input[_track=1]', this.el), function () {
                    if ($(this).attr('checked')) {
                        self.node.attr('track', 'false');
                    } else {
                        self.node.removeAttr('track');
                    }
                }, function (elem) {
                    elem.attr('checked', (self.node.attr('track') || '').toLowerCase() == 'false');
                });
                // linktype
                var linkUtil = new linktypeUtility(self.node);
                this.synchronous($('input[name=' + this.inputName + ']', this.el), function () {
                    if ($(this).data('triggered') === true) { return; }
                    linkUtil.setValue($(this).val());
                }, function (elem) {
                    var val = linkUtil.getValue();
                    elem.each(function () {
                        if ($(this).val() == val) {
                            $(this).attr('checked', true);
                        }
                    });
                });
            }
            // inner images
            var set = function (n, p, v) {
                if (v.jquery) {
                    var o = v, str = o.val(), num = parseFloat(str);
                    if (yardi.isNumber(num) && num.toString().length == str.length) {
                        if (self.editor.editNode[p]() < num && !confirm(options.imgSizeConfirm)) {
                            o.val(n[p]()).focus().select().data('errored', true);
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
                    n.css(p, null).attr(p, v);
                } catch (ex) { }
            };
            this.contentImgs.each(function (index) {
                // src
                self.synchronous($('input[_src=' + index + ']', self.el), function () {
                    var index = $(this).attr('_src');
                    self.contentImgs.eq(index).attr('src', $(this).val());
                }, $(this).attr('src'));
                // alt
                self.synchronous($('input[_alt=' + index + ']', self.el), function () {
                    var index = $(this).attr('_alt');
                    self.contentImgs.eq(index).attr('alt', $(this).val());
                }, $(this).attr('alt'));
                // width
                self.synchronous($('input[_w=' + index + ']', self.el), function () {
                    var index = $(this).attr('_w');
                    var img = self.contentImgs.eq(index);
                    set(img, 'width', $(this));
                }, $(this).width(), 'change');
                set($(this), 'width', $(this).width());
                // height
                self.synchronous($('input[_h=' + index + ']', self.el), function () {
                    var index = $(this).attr('_h');
                    var img = self.contentImgs.eq(index);
                    set(img, 'height', $(this));
                }, $(this).height(), 'change');
                set($(this), 'height', $(this).height());
                // lib
                $('input[_lib=' + index + ']', self.el).click(function () {
                    var index = $(this).attr('_lib');
                    var lib = new yardi.imgLib({
                        outerDialog: true,
                        title: options.imgLibTitle,
                        url: _vpath + 'WebFile/Index',
                        OnSelect: function (url, w, h, alt) {
                            // width (notice: set size first before set url, or the page cause a flash .
                            var ow = $('input[_w=' + index + ']', self.el).change();
                            if (!ow.val()) { ow.val(w); }
                            // heigth
                            var oh = $('input[_h=' + index + ']', self.el).change();
                            if (!oh.val()) { oh.val(h); }
                            // alt
                            var oa = $('input[_alt=' + index + ']', self.el).change();
                            if (!oa.val()) { oa.val(alt); }
                            // url
                            $('input[_src=' + index + ']', self.el).val(url).change();
                        }
                    });
                    lib.show();
                });
            });
        }

    });

    // link type utility
    var linktypeUtility = function (link) {
        this.link = link;
    };

    linktypeUtility.prototype = {

        link: null,

        linkAttrs: ['subscription', 'onlineversion', 'forward'],

        getValue: function () {
            var val = this.link.attr('subscription');
            if (!val && this.link.attr('forward') !== undefined) { val = 'forward'; }
            if (!val && this.link.attr('onlineversion') !== undefined) { val = 'onlineversion'; }
            return (val || '').toLowerCase();
        },

        setValue: function (val) {
            // remove all
            var self = this;
            $.each(this.linkAttrs, function (i, item) {
                self.link.removeAttr(item);
            });
            // set new attr
            if (val) {
                if (val === 'onlineversion' || val === 'forward') {
                    self.link.attr(val, '');
                } else {
                    self.link.attr('subscription', val);
                }
            }
        },

        setTarget: function (link) {
            this.link = link;
        }
    };

    // register
    yardi.varEditor.registerType('A', configLink);
    yardi.linktypeUtility = linktypeUtility;

})(jQuery);
