/*
*
* link panel
* author: ronglin
* create date: 2010.06.17
*
*/


/*
* config parameters:
* width, title, renderTo, onOk, onUnlink, onCancel
*/

(function ($) {

    // text resource
    var options = {
        title: 'link panel',
        attrText: 'Text:',
        attrUrl: 'Url:',
        attrTitle: 'Title:',
        attrLinkType: 'Link Type:',
        btnOk: 'ok',
        btnCancel: 'cancel',
        btnUnlink: 'unlink',
        btnView: 'view',
        emptyUrlMsg: 'please input the url.',
        linktypeNormal: 'normal',
        linktypeConfirmSubscription: 'confirm subscription',
        linktypeUnsubscribe: 'unsubscribe',
        linktypeOnlineVersion: 'online version',
        linktypeForward: 'forward'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.linkPanel_js); }

    /*
    * link panel
    */
    var linkPanel = function (config) {
        config.width = 300;
        linkPanel.superclass.constructor.call(this, config);
    };

    yardi.extend(linkPanel, yardi.arrowPanel, {

        // public config
        title: options.title,
        linkText: '',

        // public event
        onOk: function (txt, url, title, target, html) { },
        onUnlink: function () { },
        onCancel: function () { },

        textTarget: null, urlTarget: null, titleTarget: null, targetTarget: null, linkTypes: null,

        bodyBuilder: function () {
            var html = [];
            html.push('<var class="kb-linkpanel">');
            html.push('<var class="kb-row">');
            html.push(options.attrText + '<input _txt="1" class="kb-text" type="text" />');
            html.push('</var>');
            html.push('<var class="kb-row">');
            html.push(options.attrUrl + '<input _url="1" class="kb-url" type="text" />');
            html.push('<input _viw="1" class="kb-btn kb-view" type="button" value="' + options.btnView + '" />');
            html.push('</var>');
            html.push('<var class="kb-row">');
            html.push(options.attrTitle + '<input _til="1" class="kb-tle" type="text" />');
            html.push('</var>');
            html.push('<var class="kb-row">');
            html.push('<table class="kb-linktype-table">');
            html.push('    <tr>');
            html.push('        <td valign="top" style="width:58px;">');
            html.push(options.attrLinkType);
            html.push('        </td>');
            html.push('        <td>');
            html.push('<span><input id="rdoNormal" name="linktype" type="radio" value="" /><label for="rdoNormal">' + options.linktypeNormal + '</label></span>');
            html.push('<span><input id="rdoUnsubscribe" name="linktype" type="radio" value="unsubscribe" /><label for="rdoUnsubscribe">' + options.linktypeUnsubscribe + '</label></span>');
            html.push('<span><input id="rdoOnlineversion" name="linktype" type="radio" value="onlineversion" /><label for="rdoOnlineversion">' + options.linktypeOnlineVersion + '</label></span>');
            html.push('<span><input id="rdoConfirm" name="linktype" type="radio" value="confirm" /><label for="rdoConfirm">' + options.linktypeConfirmSubscription + '</label></span>');
            html.push('<span><input id="rdoForward" name="linktype" type="radio" value="forward" /><label for="rdoForward">' + options.linktypeForward + '</label></span>');
            html.push('        </td>');
            html.push('    </tr>');
            html.push('</table>');
            html.push('</var>');
            html.push('<var class="kb-row kb-newwin" style="display:none;">'); // hide  target setting
            html.push('<input _chk="1" class="kb-check" id="__check" type="checkbox" /><label for="__check">Open in a new window.</label>');
            html.push('</var>');
            html.push('<var class="kb-bottom">');
            html.push('<input _ok="1" class="kb-btn" type="button" value="' + options.btnOk + '" style="float:left;" />');
            html.push('<input _cnl="1" class="kb-btn" type="button" value="' + options.btnCancel + '" style="float:left;" />');
            html.push('<input _ulk="1" class="kb-btn" type="button" value="' + options.btnUnlink + '" />');
            html.push('</var>');
            html.push('</var>');
            return html.join('');
        },

        buildLinkHtml: function () {
            var html = [];
            html.push('<a href="');
            html.push(this.urlTarget.val());
            html.push('" title="');
            html.push(this.titleTarget.val());
            html.push('" target="');
            //html.push(this.targetTarget.attr('checked') ? '_blank' : '_self');
            html.push('_blank'); // default to _blank
            html.push('">');
            html.push(this.textTarget.val());
            html.push('</a>');
            return html.join('');
        },

        bindEvents: function () {
            linkPanel.superclass.bindEvents.call(this);

            this.textTarget = $('input[_txt=1]', this.el);
            this.urlTarget = $('input[_url=1]', this.el);
            this.titleTarget = $('input[_til=1]', this.el);
            this.targetTarget = $('input[_chk=1]', this.el);
            this.linkTypes = $('input[name=linktype]', this.el);

            var self = this;
            this.textTarget.val(this.linkText);

            // btn ok
            $('input[_ok=1]', this.el).click(function () {
                self.onOk(self.textTarget.val(),
                      self.urlTarget.val(),
                      self.titleTarget.val(),
                //self.targetTarget.attr('checked') ? '_blank' : '_self',
                      '_blank', // default to _blank
                      self.buildLinkHtml());
            });
            // btn unlink
            $('input[_ulk=1]', this.el).click(function () {
                self.onUnlink();
            });
            // btn cancel
            $('input[_cnl=1]', this.el).click(function () {
                self.onCancel();
            });
            // btn view
            $('input[_viw=1]', this.el).click(function () {
                var val = self.urlTarget.val();
                if (val.length > 0) {
                    (val.indexOf('#') != 0) && window.open(val);
                } else {
                    alert(options.emptyUrlMsg);
                }
            });
        }
    });

    // register
    yardi.linkPanel = linkPanel;

})(jQuery);
