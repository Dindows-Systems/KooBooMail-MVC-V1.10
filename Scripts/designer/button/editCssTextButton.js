/*
*
* edit css text button
* author: ronglin
* create date: 2010.06.22
*
*/

/*
* config parameters:
* renderTo, getCssText, setCssText
*/

(function ($) {

    var editCssTextButton = function (config) {
        editCssTextButton.superclass.constructor.call(this, config);
    };

    yardi.extend(editCssTextButton, yardi.imageButton, {

        panel: null,

        title: 'edit css text',

        imageUrl: 'button/images/css_eidt.gif',

        getCssText: null,

        setCssText: null,

        twinklePanel: null,

        onClick: function () {
            var self = this;
            this.panel = new yardi.textPanel({
                title: this.title,
                textValue: this.getCssText(),
                onOk: function (newCssText) {
                    self.setCssText(newCssText, true);
                    self.removePanel();
                },
                onCancel: function (oldCssText) {
                    self.setCssText(oldCssText, false);
                    self.removePanel();
                },
                onPreview: function (cssText) {
                    self.setCssText(cssText, false);
                }
            });
            this.panel.show(this.el);
            // twinkle
            this._twinklePanel = function (ev) {
                if (self.panel && !yardi.isAncestor(self.panel.el[0], ev.target)) {
                    self.panel.twinkle();
                }
            };
            $(document).mousedown(this._twinklePanel);
        },

        removePanel: function () {
            if (this.panel) {
                this.panel.remove();
                this.panel = null;
                $(document).unbind('mousedown', this._twinklePanel);
            }
        },

        remove: function () {
            this.removePanel();
            editCssTextButton.superclass.remove.call(this);
        }
    });

    // register
    yardi.editCssTextButton = editCssTextButton;

})(jQuery);
