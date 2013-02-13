/*
*
* variable editor, config list
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
        refreshText: 'refresh'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.configList_js); }

    /*
    * config list
    */
    var configList = function (config) {
        configList.superclass.constructor.call(this, config);
    };

    yardi.extend(configList, yardi.varEditor.baseConfig, {

        items: null, template: null,

        selector: null, titleSelector: null,

        initialize: function () {
            configList.superclass.initialize.call(this);
            debugger;
            this.items = {};
            // cache selector
            this.selector = this.node.attr('selector');
            this.titleSelector = this.node.attr('titleselector');
            // cache template item
            var self = this;
            $.merge($('*[kb=toc-item]', this.node), $('*[kooboo=toc-item]', this.node)).each(function () {
                if (($(this).css('display') || '') == 'none') {
                    self.template = $(this);
                    return false;
                }
            });
        },

        render: function (to) {
            configList.superclass.render.call(this, to);
            var self = this;
            $.merge($('*[kb=toc-item]', this.node), $('*[kooboo=toc-item]', this.node)).each(function () {
                if (($(this).css('display') || '') != 'none') {
                    var rid = Math.random().toString().substr(2);
                    self.items[rid] = new linkItem({
                        rid: rid, mgr: self,
                        node: $(this)
                    });
                }
            });
        },

        buildHtml: function () {
            var html = [], self = this;
            html.push('<fieldset><legend>' + this.name + '</legend>');
            html.push('<div class="row">');
            html.push('<a _refresh="1" href="javascript:;">' + options.refreshText + '</a>');
            html.push('</div>');
            html.push('</fieldset>');
            return html.join('');
        },

        bindEvents: function () {
            // refresh
            var self = this;
            $('*[_refresh=1]', this.el).click(function () {
                self.itemRefresh();
                return false;
            });
        },

        itemRefresh: function () {
            // remove old
            var self = this, targets = [];
            $(this.selector).each(function () {
                if (this.offsetHeight > 0) {
                    targets.push(this);
                }
            });
            $.each(this.items, function () {
                if (!this.exist(targets)) { this.remove(); }
            });
            // generate new
            $.each(targets, function () {
                var id = $(this).attr('id');
                var title = $(this).attr('title'), titleText;
                if (self.titleSelector) {
                    try {
                        var titleObj = $(this).find(self.titleSelector);
                        titleText = titleObj.text().trim();
                    } catch (ex) { }
                }
                if (id && (title || titleText)) {
                    var href = '#' + id;
                    if ($('a[href=' + href + ']', self.node).length == 0) {
                        var rid = Math.random().toString().substr(2);
                        self.items[rid] = new linkItem({
                            rid: rid, mgr: self, href: href,
                            text: (titleText || title), caption: (title || href)
                        });
                    }
                }
            });
        }

    });

    var linkItem = function (config) {
        $.extend(this, config);
        this.initialize();
    };

    linkItem.prototype = {

        mgr: null, rid: null, href: null, text: null, caption: null,

        node: null, editor: null, // if node is null, then href,text,caption can not be null.

        initialize: function () {
            // elements
            if (this.node) {
                var a = $('a', this.node);
                this.href = a.attr('href');
                this.text = a.text();
                this.caption = ($(this.href).attr('title') || this.href);
            } else {
                this.node = this.mgr.template.clone();
                $('a', this.node).attr('href', this.href).text(this.text);
                this.node.appendTo(this.mgr.node).show();
            }
            this.editor = $(this.buildEditor()).appendTo($('fieldset', this.mgr.el));

            // events
            var self = this;
            this.mgr.synchronous($('input', this.editor), function () {
                $('a', self.node).text($(this).val());
            }, $('a', this.node).text());
        },

        buildEditor: function () {
            var html = html || [];
            html.push('<div class="row">');
            html.push('<span>' + this.caption + ':</span><br/>');
            html.push('<input type="text" style="width:160px;" />');
            html.push('</div>');
            return html.join('');
        },

        exist: function (targets) {
            var href = $('a', this.node).attr('href');
            if (href) {
                var o = $(href);
                if (o.length > 0 && o.get(0).offsetHeight > 0) {
                    var has = false;
                    $.each(targets, function () {
                        if (o.get(0) == this) {
                            has = true;
                            return false;
                        }
                    });
                    if (has) {
                        return true;
                    }
                }
            }
            return false;
        },

        remove: function () {
            this.node.remove();
            this.editor.remove();
            delete this.mgr.items[this.rid];
        }
    };


    // register
    yardi.varEditor.registerType('*', configList, function (kb) {
        return kb === 'toc';
    });

})(jQuery);
