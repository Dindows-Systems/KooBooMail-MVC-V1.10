/*
*
* listbox field
* author: ronglin
* create date: 2010.10.20
*
*/

(function ($) {

    // text resource
    var options = {
        fieldTitle: ''
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.listBox_js); }

    /*
    * listBox
    */
    var listBox = function (config) {
        listBox.superclass.constructor.call(this, config);
    };

    yardi.extend(listBox, yardi.baseField, {

        buildHtml: function () {
        }

    });

    // register
    yardi.baseField.register('listBox', listBox);

})(jQuery);
