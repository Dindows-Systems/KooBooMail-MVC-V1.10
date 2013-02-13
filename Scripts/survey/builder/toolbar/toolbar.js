/*
*
* toolbar
* author: ronglin
* create date: 2010.07.07
*
*/

/*
* config parameters:
* onEdit, onCopy, onRemove, renderBefore
*/

(function ($) {

    var anchorToolbar = function (config) {
        $.extend(this, config);
        this.init();
    };

    anchorToolbar.instances = [];
    anchorToolbar.register = function (o) {
        anchorToolbar.instances.push(o);
    };

    anchorToolbar.prototype = {

        el: null, wrap: null,

        renderBefore: null,

        inited: false,

        isform: false,

        // public config
        onEdit: function () { },
        onCopy: function () { },
        onRemove: function () { },

        // btns
        btnEdit: null, btnCopy: null, btnDelete: null,

        buildHtml: function () {
            var html = [];
            html.push('<div class="kb-anchortoolbar">');
            html.push('<div class="kb-anchortoolbar-wrap"></div>');
            html.push('</div>');
            return html.join('');
        },

        init: function () {
            // build
            var html = this.buildHtml();
            this.el = $(html).insertBefore(this.renderBefore);
            this.wrap = $('.kb-anchortoolbar-wrap', this.el);
            // bind events
            var self = this;
            this.btnEdit = new yardi.imageButton({
                renderTo: this.wrap,
                imageUrl: 'toolbar/images/menu_edit.gif',
                onClick: function () { self.onEdit(); }
            });
            this.wrap.append('<span>&nbsp;</span>');
            this.btnCopy = new yardi.imageButton({
                renderTo: this.wrap,
                imageUrl: 'toolbar/images/menu_copy.gif',
                onClick: function () { self.onCopy(); }
            });
            this.wrap.append('<span>&nbsp;</span>');
            this.btnDelete = new yardi.imageButton({
                renderTo: this.wrap,
                imageUrl: 'toolbar/images/menu_delete.gif',
                onClick: function () { self.onRemove(); }
            });

            //..
            this.btnEdit.el.css('background-color', '#fff');
            this.btnCopy.el.css('background-color', '#fff');
            this.btnDelete.el.css('background-color', '#fff');

            // hide
            this.hide();
            // set status
            this.inited = true;
            // register instance
            anchorToolbar.register(this);
        },

        remove: function () {
            this.btnEdit.remove();
            this.btnCopy.remove();
            this.btnDelete.remove();
            this.wrap.remove();
            this.el.remove();
        },

        action: function (name, editing) {
            if (name == 'over') {
                this.btnEdit.el.show();
            } else if (name == 'out') {
                this.btnEdit.el.hide();
            } else if (name == 'click') {
                $.each(anchorToolbar.instances, function (index, instance) {
                    instance.hide();
                });
                if (this.isform == false) {
                    this.btnCopy.el.show();
                    this.btnCopy.el.prev().show();
                    this.btnDelete.el.show();
                    this.btnDelete.el.prev().show();
                }
            }
        },

        hide: function () {
            //this.btnEdit.el.hide();
            this.btnCopy.el.hide();
            this.btnCopy.el.prev().hide();
            this.btnDelete.el.hide();
            this.btnDelete.el.prev().hide();
        }
    };

    // register
    yardi.anchorToolbar = anchorToolbar;

})(jQuery);
