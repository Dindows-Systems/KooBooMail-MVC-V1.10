/// <reference path="jquery/jquery-1.4.4-vsdoc.js" />
/// <reference path="jquery/jquery.extension.js" />
/// <reference path="jquery/jquery.form.min.js" />

(function ($) {
    jQuery.fn.koobooWatermark = function (text) {
        var input = this;

        if (this.data('watermark')) {
            return this;
        } else {
            this.data('watermark', true);
        }

        var waterMark = $('<div><span></span></div>').addClass('watermark');
        var waterText = waterMark.find('span').html(text);

        this.before(waterMark);

        this.appendTo(waterMark);

        waterMark.click(function () {
            setTimeout(function () {
                input.focus();
            }, 10);
        });

        input.focus(function () {
            waterText.hide();
        }).blur(function () {
            if (!input.val()) {
                waterText.show();
            }
        });

        if (!input.val()) {
            waterText.show();
        } else {
            waterText.hide();
        }
        return this;
    }
})(jQuery);


var message = function () {
    return {
        css: ["info", "warning", "error"],

        hasMessage: function () {
            var node = jQuery("#message-box .message-text");
            if (node.length > 0) {
                return node.html().length > 0;
            }
            else {
                return false;
            }
        },

        hasDetails: function () {
            return jQuery("#message-box .message-details").html().length > 0;
        },

        info: function (text, details, timeout) {
            this.show("info", text, details, timeout);
        },

        warning: function (text, details, timeout) {
            this.show("warning", text, details, timeout);
        },

        error: function (text, details, timeout) {
            this.show("error", text, details, timeout);
        },

        show: function (css, text, details, timeout) {
            jQuery("#message-box .message-text").html(text.htmlDecode());
            jQuery("#message-box .message-details").html(details == null ? "" : details.htmlDecode());
            jQuery("#message-box").attr("class", css).attr("timeout", timeout);
            this.reshow();
        },

        showJson: function (obj) {
            this.show(this.css[obj.Type], obj.Text, obj.Details, obj.TimeoutSeconds)
        },

        reshow: function () {
            jQuery("#message-box .message-link")
                .toggle(this.hasDetails());
            jQuery("#message-box .message-details").hide();
            jQuery("#message-box").css("display", "block");
            // Timeout
            var timeout = jQuery("#message-box").attr("timeout");
            if (timeout && timeout.length > 0) {
                messageTimeOutId = setTimeout(function () {
                    jQuery("#message-box").hide();
                }, timeout * 1000);
            }
            jQuery("#message-box a.close").unbind("onclick").click(function () {
                jQuery.ajax({
                    url: jQuery(this).attr("href"),
                    success: function () {
                        if (typeof (messageTimeOutId) != "undefined") {
                            clearTimeout(messageTimeOutId);
                            jQuery("#message-box").hide();
                        }
                    }
                });
                return false;
            });
        }
    };
} ();

jQuery(function () {

    jQuery(document).initArea();

    // Message
    jQuery("#message-box .message-link a").click(function () {
        if (messageTimeOutId) {
            clearTimeout(messageTimeOutId);
        };
        jQuery("#message-box .message-details").dialog({
            modal: true,
            width: "auto",
            maxWidth: 600,
            close: function () {
                jQuery("#message-box").hide();
            }
        });
        return false;
    });
    if (message.hasMessage()) {
        message.reshow();
    }

    // close popup window when postback success
    var submitSuccess = ($('input:hidden[name=SubmitSuccess]').val() || '').toLower() == 'true';
    if (submitSuccess) {
        jQuery.popContext.getCurrent().close();
        top.location.reload();
    }

});

jQuery.fn.initForm = function() {
    // Numeric
    $(this).filter(".numeric").css("width", 100).numeric();

    // Date picker
    if (window.dateFormat != undefined) {
        $(this).filter(".datepicker").datepicker({
            dateFormat: window.dateFormat
        });
    }
}

jQuery.fn.initArea = function () {

    var selector = this;

    // Sample
    selector.find("a.download").click(function () {
        window.location = "/download" + jQuery(this).attr("href");
        return false;
    });

    // Tooltip
    selector.find(".tooltip-link").yardiTip();

    // Watermark
    selector.find("[watermark]").each(function () {
        jQuery(this).koobooWatermark(jQuery(this).attr("watermark")); //watermark(jQuery(this).attr("watermark"));
    });

    // Multiselect comboBox
    setTimeout(function () {
        selector.find("select[multiple]").each(function () {
            var options =
            {
                width: jQuery(this).width() - 17,
            };
            if (jQuery(this).find("option").length > 20) {
                options.maxDropHeight = 450;
            }
            jQuery(this).dropdownchecklist(options);
        });
    }, 100);


    // Merge fields
    selector.find(".merge-fields a").click(function () {
        var textarea = jQuery(this).parents("td").find("textarea");
        var content = textarea.val();
        var range = textarea.focus().selection();
        textarea.val(content.substring(0, range.start) + jQuery(this).attr("href") + content.substring(range.end));
        return false;
    });

    // Autocomplete
    selector.find("input:text[autocomplete-url]").autocomplete({
        source: function (request, response) {
            jQuery.ajax({
                type: "GET",
                url: this.element.attr("autocomplete-url"),
                data: this.element.attr("id") + "=" + request.term,
                dataType: "json",
                success: function (data) {
                    response(jQuery.map(data, function (item) {
                        return {
                            label: item.UserName,
                            value: item.UserName
                        }
                    }));
                }
            });
        }
    });

    // Form submit
    selector.find("input[action]").click(function () {
        jQuery(this).parents("form").attr("action", jQuery(this).attr("action")).submit();
        return false;
    });

    // Init form inputs
    selector.find("input").initForm();

    // Url view
    selector.find(".view-url").click(function () {
        var url = jQuery(this).prev().val();
        if (url.length > 0) {
            jQuery(this).attr("href", url);
        }
        else {
            jQuery(this).attr("href", "javascript:void");
        }
    });

    // Even and odd color
    selector.find(".table-container tbody tr:odd").addClass("even");

    // Select all
    selector.find(".table-container thead input:checkbox.select-all").click(function () {
        var index = jQuery(this).parents("tr").find("th").index(jQuery(this).parents("th")[0]);
        jQuery(this).parents('table').find("tbody tr").find("td:eq(" + index + ") input:checkbox:enabled").attr('checked', jQuery(this).is(":checked"));
    });

    // Delete confirm
    selector.find(".delete").click(function () {
        if ($(this).find('a').length == 0)
            return false;

        var name = jQuery(this).parents("tr, .item").find(".name");
        if (name.length == 0) {
            return confirm(messages["delete"]);
        }
        else {
            return confirm(messages["deleteName"].replace("{0}", name.text().trim()));
        }
    });

    // Buttons
    selector.find(".dropdown-button span").mouseover(function () {
        var container = jQuery(this).parents(".dropdown-button");
        container.data("focused", true).find("div").show();
    }).mouseout(dropdownButtonMouseout);
    selector.find(".dropdown-button div").mouseover(function () {
        jQuery(this).parents(".dropdown-button").data("focused", true);
    }).mouseout(dropdownButtonMouseout);

    // Dialog
    selector.find('.dialog-link').each(function () {
        var config = {
            frameHeight: '99%',
            popupOnTop: true
        };
        var hanlder = $(this);
        if (hanlder.attr('dialog-config')) {
            $.extend(config, eval('(' + hanlder.attr('dialog-config') + ')'));
        }
        $(this).pop(config);
    })
    selector.find('.dialog-close').click(function () {
        $.popContext.getCurrent().close();
    });
}

function dropdownButtonMouseout() {
    var container = jQuery(this).parents(".dropdown-button");
    container.data("focused", false);
    setTimeout(function () {
        if (!container.data("focused")) {
            container.find("div").hide();
        }
    }, 1);
}

String.prototype.htmlEncode = function () {
    return jQuery('<div/>').text(this.toString()).html();
}

String.prototype.htmlDecode = function () {
    return jQuery('<div/>').html(this.toString()).text();
}


