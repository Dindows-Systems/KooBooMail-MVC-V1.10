/*
*
* textarea field
* author: ronglin
* create date: 2010.07.01
*
*/

(function ($) {

    // text resource
    var options = {
        fieldTitle: 'Paragraph',
        defaultValueTitle: 'Default Value',
        defaultValueTipCaption: 'Default Value',
        defaultValueTipContent: 'The text placed in this area will appear for the survey taker to replace, Example: Answer here'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.textArea_js); }

    /*
    * textArea
    */
    var textArea = function (config) {
        textArea.superclass.constructor.call(this, config);
    };

    yardi.extend(textArea, yardi.baseField, {

        buildHtml: function () {
            var html = [];
            html.push('<div class="s-field s-textarea">');
            yardi.baseSnippets.fieldCommon(html, this, options.fieldTitle);
            html.push('<div class="wrap"><textarea id="#{n}" name="#{n}" #{sync}="defaultvalue"></textarea></div>');
            html.push('</div>');
            return html.join('');
        },

        buildProHtml: function () {
            var html = [];
            html.push('<div class="s-field-pro s-textarea-pro">');
            yardi.baseSnippets.fieldtitle.p(html, this);
            html.push('<div class="baserow">');
            html.push('<label class="baselabel">' + options.defaultValueTitle + ' #{valueTip}</label>');
            html.push('<textarea #{sync}="defaultvalue" class="defaultvalue"></textarea>');
            html.push('</div>');
            yardi.baseSnippets.guideline.p(html, this);
            yardi.baseSnippets.required.p(html, this);
            html.push('</div>');
            return html.join('');
        },

        getTips: function () {
            var tipsData = textArea.superclass.getTips.call(this);
            return $.extend(tipsData, {
                valueTip: {
                    title: options.defaultValueTipCaption,
                    message: options.defaultValueTipContent
                }
            });
        }

    });

    // reg
    yardi.baseField.register('textArea', textArea);

})(jQuery);
