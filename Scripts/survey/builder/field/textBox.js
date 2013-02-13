/*
*
* text field
* author: ronglin
* create date: 2010.06.29
*
*/

(function ($) {

    // text resource
    var options = {
        fieldTitle: 'Text',
        defaultValueTitle: 'Default Value',
        defaultValueTipCaption: 'Default Value',
        defaultValueTipContent: 'The text placed in this area will appear for the survey taker to replace, Example: Answer here'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.textBox_js); }

    /*
    * textBox
    */
    var textBox = function (config) {
        textBox.superclass.constructor.call(this, config);
    };

    yardi.extend(textBox, yardi.baseField, {

        buildHtml: function () {
            var html = [];
            html.push('<div class="s-field s-textbox">');
            yardi.baseSnippets.fieldCommon(html, this, options.fieldTitle);
            html.push('<div class="wrap"><input id="#{n}" name="#{n}" #{sync}="defaultvalue" type="text" /></div>');
            html.push('</div>');
            return html.join('');
        },

        buildProHtml: function () {
            var html = [];
            html.push('<div class="s-field-pro s-textbox-pro">');
            yardi.baseSnippets.fieldtitle.p(html, this);
            html.push('<div class="baserow">');
            html.push('<label class="baselabel">' + options.defaultValueTitle + ' #{valueTip}</label>');
            html.push('<input #{sync}="defaultvalue" class="defaultvalue" type="text" />');
            html.push('</div>');
            yardi.baseSnippets.guideline.p(html, this);
            yardi.baseSnippets.required.p(html, this);
            html.push('</div>');
            return html.join('');
        },

        getTips: function () {
            var tipsData = textBox.superclass.getTips.call(this);
            return $.extend(tipsData, {
                valueTip: {
                    title: options.defaultValueTipCaption,
                    message: options.defaultValueTipContent
                }
            });
        }

    });

    // register
    yardi.baseField.register('textBox', textBox);

})(jQuery);
