/*
*
* variable editor
* author: ronglin
* create date: 2010.06.24
*
*/


/*
* config parameters:
* editNode, renderTo
*/

(function ($) {

    // text resource
    var options = {
        emptyMsg: 'no content editable!'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.varEditor_js); }

    /*
    * variable editor
    */
    var varEditor = function (config) {
        $.extend(this, config);
        this.initialize();
    };

    varEditor.supportList = [];

    varEditor.supportConfigs = {};

    varEditor.registerType = function (key, cls, valid) {
        var item = { cls: cls, valid: valid };
        if (key === '*') {
            varEditor.supportList.push(item);
        } else {
            varEditor.supportConfigs[key] = item;
        }
    };

    varEditor.findConfig = function (node) {
        var kb = ($(node).attr('kb') || $(node).attr('kooboo') || '').toLowerCase();
        var cfg = varEditor.supportConfigs[node.nodeName];
        if (cfg && (!cfg.valid || cfg.valid(kb, node))) {
            return cfg;
        }
        for (var i = 0; i < varEditor.supportList.length; i++) {
            cfg = varEditor.supportList[i];
            if (cfg.valid && cfg.valid(kb, node)) {
                return cfg;
            }
        }
    };

    varEditor.nodeTypes = {
        element: 1,
        attribute: 2,
        text: 3,
        comments: 8,
        document: 9
    };

    varEditor.prototype = {

        el: null,
        panel: null,
        textarea: null,

        // public config
        renderTo: null,
        editNode: null,

        // flags
        sourceView: false,
        varComponents: null,
        emptyMessage: '<div class="msg">' + options.emptyMsg + '</div>',

        initialize: function () {
            this.varComponents = [];
            this.el = $(this.buildHtml()).appendTo(this.renderTo);
            this.panel = $('.kb-vareditor-panel', this.el);
            this.textarea = $('.kb-vareditor-textarea', this.el);
        },

        buildHtml: function () {
            var html = [];
            html.push('<div class="kb-vareditor">');
            html.push('<textarea class="kb-vareditor-textarea"></textarea>');
            html.push('<div class="kb-vareditor-panel"></div>');
            html.push('</div>');
            return html.join('');
        },

        hlComponent: function (sender) {
            $.each(this.varComponents, function (index, item) {
                if (item != sender) {
                    item.unHighlight();
                }
            });
        },

        clearComponents: function () {
            $.each(this.varComponents, function (index, item) {
                item.remove();
            });
            this.varComponents = [];
        },

        createComponent: function (node) {
            var cfg = varEditor.findConfig(node);
            if (cfg) {
                var component = new cfg.cls({ node: node, editor: this });
                component.onHighlight.add(this.hlComponent, this);
                component.render(this.panel);
                this.varComponents.push(component);
                return true;
            }
        },

        // public
        save: function () {
            var success = true;
            $.each(this.varComponents, function (index, item) {
                var ret = item.triggerSync();
                if (ret !== true) {
                    success = false;
                    return false;
                }
            });
            return success;
        },

        // public
        edit: function () {
            // clear
            this.panel.empty();
            // loop
            (function (n) {
                var nodes = n.childNodes;
                for (var i = 0; i < nodes.length; i++) {
                    if (this.createComponent(nodes[i]) !== true) {
                        arguments.callee.call(this, nodes[i]);
                    }
                }
            }).call(this, this.editNode[0]);
            // message
            if (this.varComponents.length == 0) {
                this.panel.html(this.emptyMessage);
            }
            // scroll width
            var self = this;
            setTimeout(function () {
                var scrollWidth = yardi.scrollBarWidth().vertical || 17;
                var p = self.el.parent();
                // reset
                if (p.data('leftsetted')) {
                    p.removeData('leftsetted');
                    self.el.width('');
                    p.css({
                        width: '',
                        left: p.offset().left - scrollWidth
                    });
                }
                // set
                if (!yardi.isScroll(self.panel.get(0)).scrollY) {
                    self.el.width(self.el.width() - scrollWidth);
                    p.css({
                        width: p.width() - scrollWidth,
                        left: p.offset().left + scrollWidth
                    });
                    p.data('leftsetted', true);
                }
            }, 16);
        },

        filterHtml: function (html) {
            // jquery filter
            //html = html.replace(/ jQuery\d+="(?:\d+|null)"/g, '');
            // other filter...
            return html;
        },

        // public
        getHtml: function () {
            var html = this.editNode.html();
            return this.filterHtml(html);
        },

        // public
        setHtml: function (html) {
            html = this.filterHtml(html);
            this.clearComponents();
            this.editNode.html(html);
            this.edit();
        },

        // public
        destroy: function () {
            this.clearComponents();
            this.textarea.remove();
            this.panel.remove();
            this.el.remove();
        },

        // public
        switchView: function () {
            // toggle value
            this.sourceView = !this.sourceView;
            if (this.sourceView) {
                // show or hide els
                this.panel.hide();
                this.textarea.show();
                // content
                var html = this.getHtml();
                this.textarea.val(html);
            } else {
                // show or hide els
                this.textarea.hide();
                this.panel.show();
                // content
                var html = this.textarea.val();
                this.setHtml(html);
            }
        }
    };

    // register
    yardi.varEditor = varEditor;

})(jQuery);
