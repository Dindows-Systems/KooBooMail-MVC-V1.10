/*
*
* nest
* author: ronglin
* create date: 2011.01.18
*
*/

(function ($) {

    // text resource
    var options = {
        titleEmptyMessage: 'Survey title can not be empty!'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.nest_js); }

    // app settings
    var settings = {
        iframeSelector: '#surveybuilder',
        iframeLoading: '#iframeloading',

        submitForm: 'form[submitform]',
        actionButtons: 'input[type=submit], .survey-action',

        nameInput: 'input[name=SurveyName]',
        htmlInput: 'input[name=SurveyHtml]',

        redoBtn: '#_btnRedo',
        undoBtn: '#_btnUndo',

        previewBtn: '#_btnPreview',
        previewName: '#previewName',
        previewHtml: '#previewHtml',
        previewForm: '#previewform'
    };

    // closure fields
    var builderCtx;

    window.iframeLoaded = function (builder, iframeWindow) {
        builderCtx = builder;
        bindRedoundo(builder.getRedoundo());

        // preview event
        $(settings.previewBtn).unbind().click(function () {
            try {
                $(settings.previewName).val(builder.getFormTitle());
                $(settings.previewHtml).val(encodeURIComponent(builder.getHtml()));
                $(settings.previewForm).get(0).submit();
            } catch (ex) { }
        }).addClass('survey-actionEnable');

        // scroll event
        $(window).unbind('scroll', fireScroll).scroll(fireScroll);

        // iframe loading
        $(settings.iframeLoading).hide();
        $(settings.actionButtons).removeAttr('disabled');
    };

    window.iframeUnload = function () {
        builderCtx = undefined;
        $(settings.iframeLoading).show();
        $(settings.actionButtons).attr('disabled', true);
    };

    function fireScroll() {
        try {
            builderCtx.fireScroll();
        } catch (ex) { }
    }

    function bindRedoundo(redoundo) {
        var btnUndo = $(settings.undoBtn).unbind().click(function () { try { redoundo.undo(); } catch (ex) { } });
        var btnRedo = $(settings.redoBtn).unbind().click(function () { try { redoundo.redo(); } catch (ex) { } });
        var disableFunc = function () {
            btnUndo[redoundo.canUndo() ? 'addClass' : 'removeClass']('survey-actionEnable');
            btnRedo[redoundo.canRedo() ? 'addClass' : 'removeClass']('survey-actionEnable');
        };
        redoundo.onUndo.add(disableFunc);
        redoundo.onRedo.add(disableFunc);
        redoundo.onCommit.add(disableFunc);
    }


    $(function () {

        $(settings.submitForm).submit(function () {
            if (!builderCtx) { return false; }
            var name = builderCtx.getFormTitle();
            var html = builderCtx.getHtml();
            if (name && html) {
                $(settings.nameInput).val(encodeURIComponent(name));
                $(settings.htmlInput).val(encodeURIComponent(html));
                return true;
            }
            if (!name) {
                alert(options.titleEmptyMessage);
                builderCtx.focusFormTitle();
            }
            return false;
        });

        $(window).bind('unload', function () {
            // break leaks
            builderCtx = undefined;
            window.iframeLoaded = undefined;
            window.iframeUnload = undefined;
            // remove mail editor iframe
            try { // some ie9 client throw error.
                var iframe = $(settings.iframeSelector).get(0);
                if (iframe) {
                    iframe.src = 'javascript:false;';
                    iframe.parentNode.removeChild(iframe);
                }
            } catch (ex) { }
        });
    });

})(jQuery);