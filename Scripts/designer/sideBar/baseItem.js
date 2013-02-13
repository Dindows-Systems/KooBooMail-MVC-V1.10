/*
*
* base item
* author: ronglin
* create date: 2010.08.16
*
*/

/*
* config parameters:
* 
*/

(function ($) {

    var baseItem = function (config) {
        $.extend(this, config);
        this.initialize();
    };

    baseItem.prototype = {

        el: null,

        initialize: function () {
            var path = (yardi.rootPath || '') + 'sideBar/images';
            var html = new yardi.template(this.buildHtml()).compile({ imgs: path });
            this.el = $(html);
        },

        render: function (to) {
            this.el.appendTo(to);
            this.bindEvents();
            return this;
        },

        remove: function () {
            this.el.remove();
            return this;
        },

        // sub class must override
        buildHtml: function () {
        },

        // sub class must override
        bindEvents: function () {
            var self = this;
            $('span[groupfor]', this.el).each(function () {
                var g = new yardi.groupClass({
                    target: $(this),
                    context: self.el
                });
            });
        }
    };

    // register
    yardi.sideBar.baseItem = baseItem;

})(jQuery);
