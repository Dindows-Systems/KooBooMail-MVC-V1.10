/*
*
* group
* author: ronglin
* create date: 2010.08.26
*
*/

/*
*    usage:
*
*    <span groupfor="tt" show="false" >abc</span>
*    <table group="tt"></table>
*/

/*
* config parameters:
* target, context
*/

(function ($) {

    var group = function (config) {
        $.extend(this, config);
        this.initialize();
    };

    group.prototype = {

        target: null, context: null, // config

        groupFor: null, // elements

        collapsed: false, animate: false, // flag

        initialize: function () {
            this.target.addClass('kb-group');
            this.collapsed = (this.target.attr('show') === 'false');
            this.groupFor = $('*[group=' + this.target.attr('groupfor') + ']', this.context);
            // events
            var self = this;
            this.target.click(function () { self.toggle(); });
            // init
            this.applyImg();
            this.applyGrp();
            // place at last
            this.animate = (this.target.attr('animate') === 'true');
        },

        toggle: function () {
            this.collapsed = !this.collapsed;
            this.applyImg();
            this.applyGrp();
        },

        applyImg: function () {
            this.target.removeClass('kb-group-right kb-group-down').addClass(this.collapsed ? 'kb-group-right' : 'kb-group-down');
        },

        applyGrp: function () {
            if (this.animate) {
                this.groupFor[this.collapsed ? 'slideUp' : 'slideDown']();
            } else {
                this.groupFor[this.collapsed ? 'hide' : 'show']();
            }
        }
    };

    // register
    yardi.groupClass = group;

})(jQuery);
