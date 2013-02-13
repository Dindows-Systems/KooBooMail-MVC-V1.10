/*
*
* message
* author: ronglin
* create date: 2010.06.29
*
*/

(function ($) {

    var messageClass = function (renderTo) {

        var template = '<div class="notice-message">' +
                    '<h2>title</h2>' +
                    '<p>message</p></div>';

        var el = $(template).appendTo('body');
        var titleEl = $('h2', el);
        var messageEl = $('p', el);

        return {
            show: function (title, message) {
                titleEl.html('');
                titleEl.html(title);
                messageEl.html('');
                messageEl.html(message);
                el.appendTo(renderTo);
                el.show();
            },
            hide: function () {
                el.hide();
                //el.appendTo('body');
            }
        };
    };

    // register
    yardi.messageClass = messageClass;

})(jQuery);
