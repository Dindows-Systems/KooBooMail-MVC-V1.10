/*
*
* add blocks item
* author: ronglin
* create date: 2010.08.16
*
*/

/*
* config parameters:
* templates, onAdd
*/

(function ($) {

    // text resource
    var options = {
        groupTitle: 'Add Widgets',
        btnAdd: 'Add'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.blocksItem_js); }

    /*
    * add blocks item
    */
    var blocksItem = function (config) {
        blocksItem.superclass.constructor.call(this, config);
    };

    yardi.extend(blocksItem, yardi.sideBar.baseItem, {

        // public config
        templates: null,

        // public config
        onAdd: function (btn, id, title, target) { },

        buildHtml: function () {
            var html = [];
            html.push('<div class="kb-add">');
            html.push('<span groupfor="btns" show="false" class="kb-groupbtn">' + options.groupTitle + '</span>');
            html.push('<table class="kb-addtable" group="btns" border="0" cellspacing="0" cellpadding="0">');
            $.each(this.templates, function () {
                html.push('<tr><td>' + this.attr('title') + '</td>');
                html.push('<td style="width:40px;">');
                html.push('<span class="kb-btnadd" keyid="' + this.attr('id') + '" title="' + this.attr('title') + '" target="' + this.attr('target') + '">&nbsp;' + options.btnAdd + '</span>');
                html.push('</td></tr>');
            });
            html.push('</table>');
            html.push('</div>');
            return html.join('');
        },

        bindEvents: function () {
            blocksItem.superclass.bindEvents.call(this);
            var self = this;
            $('span[target]', this.el).click(function () {
                if (yardi.dialoging != true) {
                    var btn = $(this);
                    self.onAdd(btn, btn.attr('keyid'), btn.attr('title'), btn.attr('target'));
                }
            }).hover(function () {
                if (yardi.dialoging != true) {
                    $(this).addClass('kb-hl');
                }
            }, function () {
                $(this).removeClass('kb-hl');
            });
        }

    });

    // register
    yardi.sideBar.blocksItem = blocksItem;

})(jQuery);
