/*
*
* variable editor, config var
* author: ronglin
* create date: 2010.08.09
*
*/

/*
* config parameters:
* node
*/

(function ($) {

    var configInput = function (config) {
        configInput.superclass.constructor.call(this, config);
    };

    yardi.extend(configInput, yardi.varEditor.baseConfig, {

        inputType: '', // textarea, text, date

        initialize: function () {
            configInput.superclass.initialize.call(this);
            this.inputType = (this.node.attr('type') || '').toLowerCase();
        },

        buildHtml: function () {
            var html = [];
            html.push('<fieldset><legend>' + this.name + '</legend>');
            html.push('<div class="row">');
            //html.push('<span>text:</span>');
            if (this.inputType == 'text') {
                html.push('<input _text="1" type="text" />');
            } else if (this.inputType == 'textarea') {
                html.push('<textarea _text="1"></textarea>');
            } else if (this.inputType == 'date') {
                html.push('<input _text="1" type="text" />');
            }
            html.push('</div>');
            html.push('</fieldset>');
            return html.join('');
        },

        bindEvents: function () {
            var self = this;
            var val = (this.node.html() || '').replace(/(^\s*)|(\s*$)/g, ''); // trim
            this.synchronous($('*[_text=1]', this.el), function () {
                self.node.html($(this).val());
            }, val);
            // date
            if (this.inputType == 'date') {
                var fmt = this.node.attr('dateFormat');
                fmt && $.datepicker.setDefaults({ dateFormat: fmt });
                $('*[_text=1]', this.el).datepicker();
            }
        }

    });

    // register
    yardi.varEditor.registerType('*', configInput, function (kb) {
        return kb === 'input';
    });

})(jQuery);
