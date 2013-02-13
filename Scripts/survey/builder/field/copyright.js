/*
*
* copyright field
* author: ronglin
* create date: 2010.07.12
*
*/

(function ($) {

    // text resource
    var options = {
        enabled: 'true',
        copyright: 'Copyright (c) 2011',
        koobooLimited: 'Kooboo Team',
        titleGroupName: 'Title',
        linkUrlGroupName: 'Link Url',
        linkTextGroupName: 'Link Text',
        titleTipCaption: 'Field Title',
        titleTipContent: 'Input information about you or your organization here',
        linkUrlTipCaption: 'Link Url',
        linkUrlTipContent: 'Input your website’s web address here',
        linkTextTipCaption: 'Link Text',
        linkTextTipContent: 'Text inputted here will be hyperlinked to the URL inputted above'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.copyright_js); }

    /*
    * copyright
    */
    var copyright = function (config) {
        copyright.superclass.constructor.call(this, config);
    };

    yardi.extend(copyright, yardi.baseField, {

        disable: function (disabled) {
            copyright.superclass.disable.call(this, disabled);
            this.el[disabled === true ? 'addClass' : 'removeClass']('s-field-nomove');
        },

        buildHtml: function () {
            var html = [];
            html.push('<div class="s-field s-copyright">');
            html.push('<div class="wrap">');
            html.push('<span #{sync}="title" class="title">' + options.copyright + ' </span>');
            html.push('<a #{sync}="linktext" class="link" href="">' + options.koobooLimited + '</a>');
            html.push('</div>');
            html.push('</div>');
            return html.join('');
        },

        buildProHtml: function () {
            var html = [];
            html.push('<div class="s-field-pro s-copyright-pro">');
            html.push('<div class="baserow">');
            html.push('<label class="baselabel">' + options.titleGroupName + ' #{titleTip}</label>');
            html.push('<textarea #{sync}="title" class="textarea"></textarea>');
            html.push('</div>');
            html.push('<div class="baserow">');
            html.push('<label class="baselabel">' + options.linkUrlGroupName + ' #{linkUrlTip}</label>');
            html.push('<input #{sync}="linkhref" type="text" class="textinput" />');
            html.push('</div>');
            html.push('<div class="baserow">');
            html.push('<label class="baselabel">' + options.linkTextGroupName + ' #{linkTextTip}</label>');
            html.push('<textarea #{sync}="linktext" class="linktext"></textarea>');
            html.push('</div>');
            html.push('</div>');
            return html.join('');
        },

        initPro: function () {
            // call base
            copyright.superclass.initPro.call(this);
            // href kit
            var href = this.fItems('linktext').attr('href');
            this.pItems('linkhref').val(href);
        },

        onUpdateValue: function (sender, name) {
            copyright.superclass.onUpdateValue.call(this, sender, name);
            if (name == 'linkhref') {
                this.fItems('linktext').attr('href', sender.val());
            }
        },

        getTips: function () {
            var tipsData = copyright.superclass.getTips.call(this);
            return $.extend(tipsData, {
                titleTip: {
                    title: options.titleTipCaption,
                    message: options.titleTipContent
                },
                linkUrlTip: {
                    title: options.linkUrlTipCaption,
                    message: options.linkUrlTipContent
                },
                linkTextTip: {
                    title: options.linkTextTipCaption,
                    message: options.linkTextTipContent
                }
            });
        }

    });

    // register
    yardi.baseField.register('copyright', copyright);

})(jQuery);
