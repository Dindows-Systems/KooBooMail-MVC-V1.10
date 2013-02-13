/*
*
* variable editor anchor bar
* author: ronglin
* create date: 2010.08.06
*
*/


/*
* config parameters:
* alignTo, renderTo
*/

(function ($) {

    var varAnchorBar = function (config) {
        varAnchorBar.superclass.constructor.call(this, config);
    };

    yardi.extend(varAnchorBar, yardi.anchorBar, {

        buildHtml: function () {
            var html = [];
            html.push('<div class="kb-varanchorbar">');
            html.push('</div>');
            return html.join('');
        },

        lock: function (isLock) {
            this.fixed = (isLock === true);
        },

        getAlignCss: function (ev) {
            var pos = this.alignTo.offset();
            return {
                left: pos.left - this.el.outerWidth() - 1,
                top: pos.top - 22    // 22 is  the height of menuAnchorBar
            };
        }
    });

    // register
    yardi.varAnchorBar = varAnchorBar;

})(jQuery);
