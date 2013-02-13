/*
*
* page break field
* author: ronglin
* create date: 2010.07.01
*
*/

(function ($) {

    // text resource
    var options = {
        message: 'Page Break'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.pageBreak_js); }

    /*
    * pageBreak
    */
    var pageBreak = function (config) {
        pageBreak.superclass.constructor.call(this, config);
    };

    yardi.extend(pageBreak, yardi.baseField, {

        buildHtml: function () {
            var html = [];
            html.push('<div class="s-field s-pagebreak">');
            html.push('<label #{sync}="breaktitle" class="title">-----------------------------------' + options.message + '-----------------------------------</label>');
            html.push('<div #{sync}="guideline" class="wrap"></div>');
            html.push('</div>');
            return html.join('');
        },

        buildProHtml: function () {
            var html = [];
            html.push('<div class="s-field-pro s-pagebreak-pro">');
            //html.push('<div class="baserow">');
            //html.push('<label class="baselabel">Field Label #{labelTip}</label>');
            //html.push('<textarea #{sync}="breaktitle" class="fieldlabel"></textarea>');
            //html.push('</div>');
            yardi.baseSnippets.guideline.p(html, this);
            html.push('</div>');
            return html.join('');
        },

        getTips: function () {
            var tipsData = pageBreak.superclass.getTips.call(this);
            return $.extend(tipsData, {
                //labelTip: {
                //    title: 'Field Label',
                //    message: 'Field Label is one or two words placed directly above the field.'
                //}
            });
        }
    });

    // register
    yardi.baseField.register('pageBreak', pageBreak);

})(jQuery);
