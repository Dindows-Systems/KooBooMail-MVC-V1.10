/*
*
* image panel
* author: ronglin
* create date: 2010.06.17
*
*/


/*
* config parameters:
* width, title, renderTo, onOk, onCancel
*/

(function ($) {

    // text resource
    var options = {
        title: 'image options',
        imgLibTitle: 'Image library',
        attrURL: 'URL:',
        attrALT: 'ALT:',
        attrWidth: 'Width:',
        attrHeight: 'Height:',
        btnOk: 'ok',
        btnCancel: 'cancel',
        btnRemive: 'remove',
        btnLibrary: 'library',
        btnView: 'view',
        attrLinkHref: 'LINK:',
        emptyUrlMsg: 'please input the url.'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.imagePanel_js); }

    /*
    * image panel
    */
    var imagePanel = function (config) {
        config.width = 300;
        imagePanel.superclass.constructor.call(this, config);
    };

    yardi.extend(imagePanel, yardi.arrowPanel, {

        // public config
        title: options.title,

        // public event
        onOk: function (val) { },
        onCancel: function () { },
        onDelete: function () { },

        urlTarget: null, descTarget: null, wTarget: null, hTarget: null, linkHrefTarget: null,

        onLibrary: function (sender, ev) {
            var self = this;
            var lib = new yardi.imgLib({
                outerDialog: true,
                title: options.imgLibTitle,
                url: _vpath + 'WebFile/Index',
                OnSelect: function (url, w, h, alt) {
                    self.setSrc(url); self.setAlt(alt);
                    if (!self.getWidth()) { self.setWidth(w); }
                    if (!self.getHeight()) { self.setHeight(h); }
                }
            });
            lib.show();
        },

        bodyBuilder: function () {
            var html = [];
            html.push('<var class="kb-imagepanel">');
            html.push('<var class="kb-row">');
            html.push(options.attrURL + '<input _url="1" class="kb-url" type="text" />');
            html.push('<input _lib="1" class="kb-btn kb-lib" type="button" value="' + options.btnLibrary + '" />');
            html.push('</var>');
            html.push('<var class="kb-row">');
            html.push(options.attrALT + '<input _desc="1" class="kb-alt" type="text" />');
            html.push('</var>');
            html.push('<var class="kb-row">');
            html.push(options.attrWidth + '<input type="text" _w="1" class="kb-size" />&nbsp;' + options.attrHeight + '<input _h="1" type="text" class="kb-size" />');
            html.push('</var>');
            html.push('<var class="kb-row kb-sep">');
            html.push('</var>');
            html.push('<var class="kb-row">');
            html.push(options.attrLinkHref + '<input class="kb-linkhref" type="text" _linkHref="1">');
            html.push('<input _viw="1" class="kb-btn kb-view" type="button" value="' + options.btnView + '" />');
            html.push('</var>');
            html.push('<var class="kb-bottom">');
            html.push('<input _ok="1" class="kb-btn" type="button" value="' + options.btnOk + '" style="float:left;" />');
            html.push('<input _cnl="1" class="kb-btn" type="button" value="' + options.btnCancel + '" style="float:left;" />');
            html.push('<input _del="1" class="kb-btn" type="button" value="' + options.btnRemive + '" />');
            html.push('</var>');
            html.push('</var>');
            return html.join('');
        },

        buildImageHtml: function () {
            var html = [];
            var linkHref = this.getHref();
            if (linkHref) { html.push('<a href="' + linkHref + '" target="_blank">'); }
            html.push('<img alt="' + this.getAlt() + '"');
            html.push(' src="' + this.getSrc() + '"');
            html.push(' width="' + this.getWidth() + '"');
            html.push(' height="' + this.getHeight() + '"');
            html.push(' />');
            if (linkHref) { html.push('</a>'); }
            return html.join('');
        },

        bindEvents: function () {
            imagePanel.superclass.bindEvents.call(this);
            var self = this;

            this.urlTarget = $('input[_url=1]', this.el);
            this.descTarget = $('input[_desc=1]', this.el);
            this.wTarget = $('input[_w=1]', this.el);
            this.hTarget = $('input[_h=1]', this.el);
            this.linkHrefTarget = $('input[_linkHref=1]', this.el);

            // btn ok
            $('input[_ok=1]', this.el).click(function () {
                self.onOk(self.getSrc(),
                          self.getAlt(),
                          self.getWidth(),
                          self.getHeight(),
                          self.getHref(),
                          self.buildImageHtml());
            });
            // btn view
            $('input[_viw=1]', this.el).click(function () {
                var val = self.getHref();
                if (val.length > 0) {
                    (val.indexOf('#') != 0) && window.open(val);
                } else {
                    alert(options.emptyUrlMsg);
                }
            });
            // btn cancel
            $('input[_cnl=1]', this.el).click(function () {
                self.onCancel();
            });
            // btn library
            $('input[_lib=1]', this.el).click(function (ev) {
                self.onLibrary(self, ev);
            });
            // btn delete
            $('input[_del=1]', this.el).click(function () {
                self.onDelete();
            });
        },

        focus: function () { this.urlTarget.focus(); },

        getSrc: function () { return this.urlTarget.val(); },
        setSrc: function (val) { this.urlTarget.val(val); },

        getAlt: function () { return this.descTarget.val(); },
        setAlt: function (val) { this.descTarget.val(val); },

        getHeight: function () { return this.hTarget.val(); },
        setHeight: function (val) { this.hTarget.val(val); },

        getWidth: function () { return this.wTarget.val(); },
        setWidth: function (val) { this.wTarget.val(val); },

        getHref: function () { return this.linkHrefTarget.val(); },
        setHref: function (val) { this.linkHrefTarget.val(val); }
    });

    // register
    yardi.imagePanel = imagePanel;

})(jQuery);
