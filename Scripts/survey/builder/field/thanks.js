/*
*
* thanks field
* author: ronglin
* create date: 2010.07.14
*
*/

(function ($) {

    // text resource
    var options = {
        message: 'Thank you for your participation in our survey. We value and appreciate your input.',
        messageTitle: 'Message',
        messageTipCaption: 'Message',
        messageTipContent: ''
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.thanks_js); }

    /*
    * thanks
    */
    var thanks = function (config) {
        thanks.superclass.constructor.call(this, config);
    };

    yardi.extend(thanks, yardi.baseField, {

        valueField: false,

        disable: function (disabled) {
            thanks.superclass.disable.call(this, disabled);
            this.el[disabled === true ? 'addClass' : 'removeClass']('s-field-nomove');
        },

        buildHtml: function () {
            var html = [];
            html.push('<div class="s-field s-thanks">');
            html.push('<div #{sync}="message" class="wrap">' + options.message + '</div>');
            html.push('</div>');
            return html.join('');
        },

        buildProHtml: function () {
            var html = [];
            html.push('<div class="s-field-pro s-thanks-pro">');
            html.push('<div class="baserow">');
            html.push('<label class="baselabel">' + options.messageTitle + ' #{messageTip}</label>');
            html.push('<textarea #{sync}="message" class="fieldlabel"></textarea>');
            html.push('</div>');
            html.push('</div>');
            return html.join('');
        },

        getTips: function () {
            var tipsData = thanks.superclass.getTips.call(this);
            return $.extend(tipsData, {
                messageTip: {
                    title: options.messageTipCaption,
                    message: options.messageTipContent
                }
            });
        }
    });

    // register
    yardi.baseField.register('thanks', thanks);

})(jQuery);
