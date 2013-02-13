/*
*
* tip
* author: ronglin
* create date: 2010.06.30
*
*/

/*
* config parameters:
* renderTo, title, message
*/

(function ($) {

    var tip = function (config) {
        tip.superclass.constructor.call(this, config);
    };

    yardi.extend(tip, yardi.imageButton, {

        // public config
        message: null, title: null,

        imageUrl: 'tip/images/tip.gif',

        tipPanel: null,

        initialize: function () {
            tip.superclass.initialize.call(this);
            this.el.addClass('kb-tip-button');
        },

        remove: function () {
            tip.superclass.remove.call(this);
            if (this.tipPanel) {
                this.tipPanel.remove();
                this.tipPanel = null;
            }
        },

        buildTipHtml: function () {
            var html = [];
            html.push('<div class="kb-tip-panel">');
            html.push('<div class="title"></div>');
            html.push('<div class="body"></div>');
            html.push('</div>');
            return html.join('');
        },

        onClick: function (ev) {
            if (this.tipPanel == null) {
                this.tipPanel = $(this.buildTipHtml()).appendTo('body');
            }
            $('.title', this.tipPanel).html(this.title);
            $('.body', this.tipPanel).html(this.message);

            var pos = yardi.flatPos($(this.tipPanel), $(this.el));
            this.tipPanel.css(pos);
            this.tipPanel.show('fast');
            // register hide event
            var self = this;
            window.setTimeout(function () {
                $(document).one('click', function () {
                    self.tipPanel.hide('fast', function () {
                        self.tipPanel.remove();
                        self.tipPanel = null;
                    });
                });
            }, 10);
        }
    });

    // register
    yardi.tipClass = tip;

})(jQuery);
