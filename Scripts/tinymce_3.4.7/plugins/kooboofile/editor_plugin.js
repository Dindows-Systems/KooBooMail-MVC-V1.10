/*
*
* kooboo file
* author: ronglin
* create date: 2010.12.27
*
*/

(function () {

    var options = {
        url: 'WebFile/Index',
        title: 'File Manager',
        cmdBtnTitle: 'insert file'
    };

    var dialogObject;

    function removeDialog() {
        if (dialogObject) {
            var iframe = dialogObject.children('iframe').get(0);
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

    function showDialog(cfg, outerApi) {
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

    // break leaks
    $(window).bind('unload', function () { removeDialog(); });

    tinymce.create('tinymce.plugins.koobooFile', {

        init: function (ed, url) {
            ed.addCommand('mcekooboofile', function () {
                showDialog({
                    url: ed.getParam('vpath') + options.url,
                    title: ed.getParam('fileMgrTitle') || options.title
                }, {
                    IsTinyMCE: true,
                    OnSelect: function (data) {
                        var elem, url = window.location.protocol + '//' + window.location.host + data.FileUrl;
                        if (data.Width && data.Height) {
                            elem = document.createElement('img');
                            elem.src = url;
                            elem.alt = data.FileName;
                            elem.width = data.Width;
                            elem.height = data.Height;
                        } else {
                            elem = document.createElement('a');
                            elem.href = url;
                            elem.target = '_blank';
                            elem.innerHTML = data.FileName;
                        }
                        ed.focus();
                        ed.selection.setNode(elem);
                    }
                });
            });

            ed.addButton('kooboofile', {
                title: ed.getParam('fileMgrCmdTitle') || options.cmdBtnTitle,
                cmd: 'mcekooboofile',
                image: url + '/btn_file.gif'
            });

            ed.onNodeChange.add(function (ed, cm, n) {
                cm.setDisabled('kooboofile', ed.selection.getContent() != '')
            });
        },

        createControl: function (n, cm) {
            return null;
        },

        getInfo: function () {
            return {
                longname: 'kooboo file plugin for tiny_mce',
                author: 'ronglin chen',
                authorurl: 'http://www.kooboo.com/',
                infourl: 'http://www.kooboo.com/',
                version: tinymce.majorVersion + '.' + tinymce.minorVersion
            };
        }
    });

    tinymce.PluginManager.add('kooboofile', tinymce.plugins.koobooFile);

})();