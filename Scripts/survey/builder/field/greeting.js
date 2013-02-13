/*
*
* greeting field
* author: ronglin
* create date: 2011.01.24
*
*/

(function ($) {

    // text resource
    var options = {
        disableMessage: '<b>Greeting</b> section won\'t be displayed in this survey.',
        enableMessage: 'Thank you for taking the time to complete our survey. We value your feedback.',
        checkLabel: 'Show Greeting.',
        greetingTitle: 'Greeting Message',
        greetingTipCaption: 'Greeting Message',
        greetingTipContent: 'This is a greeting message of the survey.'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.greeting_js); }

    /*
    * greeting
    */
    var greeting = function (config) {
        greeting.superclass.constructor.call(this, config);
    };

    yardi.extend(greeting, yardi.baseField, {

        showGreeting: false,

        init: function () {
            greeting.superclass.init.call(this);
            this.greetingStateNotice();
        },

        serialize: function () {
            greeting.superclass.serialize.call(this);
            this.el.attr('showGreeting', this.showGreeting);
        },

        deserialize: function () {
            greeting.superclass.deserialize.call(this);
            this.showGreeting = (this.el.attr('showGreeting') === 'true');
        },

        disable: function (disabled) {
            greeting.superclass.disable.call(this, disabled);
            this.el[disabled === true ? 'addClass' : 'removeClass']('s-field-nomove');
        },

        greetingStateNotice: function (show) {
            show = (show || this.showGreeting);
            this.el.find('.notice').remove();
            this.el.find('.wrap').show();
            if (show !== true) {
                this.el.find('.wrap').hide();
                this.el.append('<div class="notice">' + options.disableMessage + '</div>');
            }
        },

        buildHtml: function () {
            var html = [];
            html.push('<div class="s-field s-greeting">');
            html.push('<div #{sync}="message" class="wrap">' + options.enableMessage + '</div>');
            html.push('</div>');
            return html.join('');
        },

        buildProHtml: function () {
            var html = [];
            html.push('<div class="s-field-pro s-greeting-pro">');
            html.push('<div class="baserow">');
            html.push('<input #{sync}="showgreeting" id="#{uuid}_showgreeting" type="checkbox" class="basecheck" /><label for="#{uuid}_showgreeting" class="basechecklabel"> ' + options.checkLabel + '</label>');
            html.push('</div>');
            html.push('<div class="baserow">');
            html.push('<label class="baselabel">' + options.greetingTitle + ' #{messageTip}</label>');
            html.push('<textarea #{sync}="message" class="message" maxlength="200"></textarea>');
            html.push('</div>');
            html.push('</div>');
            return html.join('');
        },

        initPro: function () {
            greeting.superclass.initPro.call(this);
            var self = this;
            this.pItems('showgreeting').attr('checked', this.showGreeting).change(function () {
                self.showGreeting = $(this).attr('checked');
                self.el.attr('showGreeting', self.showGreeting);
                self.greetingStateNotice();
            });
        },

        getTips: function () {
            var tipsData = greeting.superclass.getTips.call(this);
            return $.extend(tipsData, {
                messageTip: {
                    title: options.greetingTipCaption,
                    message: options.greetingTipContent
                }
            });
        }
    });

    // register
    yardi.baseField.register('greeting', greeting);

})(jQuery);