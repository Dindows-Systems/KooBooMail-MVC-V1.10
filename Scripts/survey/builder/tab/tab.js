/*
*
* tab
* author: ronglin
* create date: 2010.06.30
*
*/


/*
* config parameters:
* renderTo, items
*/

(function ($) {

    var tab = function (config) {
        $.extend(this, config);
        this.init();
    };

    tab.prototype = {

        renderTo: null,

        width: null,

        height: null,

        el: null,

        currentIndex: 0,

        items: [{ title: 'tab1', width: null, content: 'tab1 content' },
            { title: 'tab2', width: null, content: 'tab2 content'}],

        buildHtml: function () {
            var html = [];
            html.push('<div class="kb-tabcontrol">');
            html.push('<div class="tabtitle">');
            html.push('<ul>');
            for (var i = 0; i < this.items.length; i++)
                html.push('<li class="normal" _tabIndex="' + i + '">' + this.items[i].title + '</li>');
            html.push('</ul>');
            html.push('</div>');
            html.push('<div class="tabcontent">');
            for (var i = 0; i < this.items.length; i++)
                html.push('<div class="tabitem" _tabIndex="' + i + '"></div>');
            html.push('</div>');
            html.push('</div>');
            return html.join('');
        },

        init: function () {
            var html = this.buildHtml(), self = this;
            this.el = $(html).appendTo(this.renderTo);
            if (this.width) this.el.css('width', this.width);
            if (this.height) this.el.css('height', this.height);
            var headItems = $('li', this.el);
            var contentItems = $('.tabitem', this.el);
            headItems.click(function () {
                if (!$(this).hasClass('active')) {
                    // css
                    headItems.removeClass('active').addClass('normal');
                    $(this).removeClass('normal').addClass('active');
                    // show content
                    contentItems.hide();
                    var index = $(this).attr('_tabIndex');
                    $('div[_tabIndex=' + index + ']').show();
                    self.currentIndex = parseInt(index, 10);
                }
            });
            headItems.hover(function () {
                $(this).addClass('hover');
            }, function () {
                $(this).removeClass('hover');
            });
            // values
            headItems.each(function (index) {
                if (w = self.items[index].width) {
                    $(this).css('width', w);
                }
            });
            contentItems.each(function (index) {
                var item = self.items[index];
                if (item.content) $(this).append(item.content);
                item.content = $(this);
            });
            // select first by default.
            this.select(this.currentIndex);
        },

        select: function (index) {
            this.currentIndex = index;
            $('li[_tabIndex=' + index + ']', this.el).click();
        }
    };

    // register
    yardi.tabControl = tab;

})(jQuery);
