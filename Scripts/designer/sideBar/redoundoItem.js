/*
*
* redo undo item
* author: ronglin
* create date: 2010.08.16
*
*/

/*
* config parameters:
* redoundo
*/

(function ($) {

    // text resource
    var options = {
        undoText: 'Undo',
        redoText: 'Redo'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.redoundoItem_js); }

    /*
    * redo undo item
    */
    var reodundoItem = function (config) {
        reodundoItem.superclass.constructor.call(this, config);
    };

    yardi.extend(reodundoItem, yardi.sideBar.baseItem, {

        redoundo: null,

        buildHtml: function () {
            var html = [];
            html.push('<div class="kb-undoredo">');
            html.push('<input type="button" _btn="undo" disabled="disabled" value="' + options.undoText + '" class="kb-button" /><br/>');
            html.push('<input type="button" _btn="redo" disabled="disabled" value="' + options.redoText + '" class="kb-button" />');
            html.push('</div>');
            return html.join('');
        },

        bindEvents: function () {
            reodundoItem.superclass.bindEvents.call(this);
            var self = this;
            var btnUndo = $('input[_btn=undo]', this.el).click(function () {
                if (yardi.dialoging != true) {
                    self.redoundo.undo();
                }
            });
            var btnRedo = $('input[_btn=redo]', this.el).click(function () {
                if (yardi.dialoging != true) {
                    self.redoundo.redo();
                }
            });
            var originalUndo = btnUndo.val();
            var originalRedo = btnRedo.val();
            var disableFunc = function () {
                if (self.redoundo.canUndo()) {
                    var title = originalUndo + ' ' + self.redoundo.prevCmd().name;
                    btnUndo.val(title).attr('title', title);
                    btnUndo.removeAttr('disabled');
                } else {
                    btnUndo.val(originalUndo).removeAttr('title');
                    btnUndo.attr('disabled', 'disabled');
                }
                if (self.redoundo.canRedo()) {
                    var title = originalRedo + ' ' + self.redoundo.nextCmd().name;
                    btnRedo.val(title).attr('title', title);
                    btnRedo.removeAttr('disabled');
                } else {
                    btnRedo.val(originalRedo).removeAttr('title');
                    btnRedo.attr('disabled', 'disabled');
                }
            };
            this.redoundo.onUndo.add(disableFunc);
            this.redoundo.onRedo.add(disableFunc);
            this.redoundo.onCommit.add(disableFunc);
        }

    });

    // register
    yardi.sideBar.reodundoItem = reodundoItem;

})(jQuery);
