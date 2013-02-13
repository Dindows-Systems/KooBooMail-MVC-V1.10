/*
*
* nest
* author: ronglin
* create date: 2010.12.21
*
*/

(function ($) {

    // text resource
    var options = {
        leaveMessage: 'Are you sure you want to leave page? All your changes might be lost.'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.nest_js); }

    // app settings
    var settings = {
        actionButtons: 'input[type=submit]',
        iframeSelector: '#htmleditor',
        iframeLoading: '#iframeloading',
        cssTextarea: '#htmlstyle',
        htmlTextarea: '#htmlbody',
        subjectInput: '#Subject'
    };

    // closure fields
    var designerCtx;
    var dialogObject;
    var isSubmit = false, subjectChanged = false;

    window.iframeLoaded = function (designer, iframeWindow) {
        designerCtx = designer;
        bindDesignerDialog(designer);
        // leave confirm
        if (options.leaveMessage) {
            // before unload, unbind first for this function maight be call many times.
            $(window).unbind('beforeunload').bind('beforeunload', function (ev) {
                if ((designer.isChanged() || designer.isEditing() || subjectChanged) && !isSubmit) {
                    return settings.leaveMessage;
                }
            });
        }
        // hide iframe loading
        $(settings.iframeLoading).hide();
        $(settings.actionButtons).attr("disabled", false);
    };

    window.iframeUnload = function () {
        // show iframe loading
        $(settings.iframeLoading).show();
        $(settings.actionButtons).attr("disabled", true);
    };

    function removeDialog() {
        if (dialogObject) {
            var iframe = dialogObject.find('iframe').get(0);
            // break leaks
            iframe.outerApi = undefined;
            delete iframe['outerApi'];
            iframe.src = 'javascript:false;';
            iframe.parentNode.removeChild(iframe);
            // remove
            dialogObject.remove();
            dialogObject = undefined;
        }
    };

    function bindDesignerDialog(designer) {
        designer.showDialog = function (cfg, outerApi) {
            removeDialog();
            var settings = $.extend({}, cfg, {
                position: 'center',
                modal: true,
                width: 600,
                height: 400
            });
            dialogObject = $('<div style="overflow:hidden;"><iframe frameBorder="0" style="width:100%;height:100%;" src="' + settings.url + '"></iframe></div>');
            dialogObject.appendTo('body').dialog(settings);
            dialogObject.bind('dialogclose', removeDialog);
            // concat
            dialogObject.children('iframe').get(0).outerApi = $.extend({}, {
                OnCancel: function () { dialogObject.dialog('close'); }
            }, outerApi || {});
        };
    };

    $(function () {
        // disable submit buttons first
        $(settings.actionButtons).attr("disabled", true);

        // get html and encode
        $('form').submit(function () {
            if (!designerCtx) { return; }
            isSubmit = true;
            $(settings.htmlTextarea).val(designerCtx.getHtml());
            $(settings.cssTextarea).val(designerCtx.getCss());
        });

        // when a/b test has a subject field
        $(settings.subjectInput).change(function () {
            subjectChanged = true;
        });

        $(window).bind('unload', function () {
            // if exist
            removeDialog();
            // break leaks
            designerCtx = undefined;
            window.iframeLoaded = undefined;
            window.iframeUnload = undefined;
            // remove mail editor iframe
            var iframe = $(settings.iframeSelector).get(0);
            if (iframe) {
                iframe.src = 'javascript:false;';
                iframe.parentNode.removeChild(iframe);
            }
        });
    });

})(jQuery);