/*
*
* sniffer
* author: ronglin
* create date: 2010.06.24
*
*/

(function ($) {

    // text resource
    var options = {
        widthFormatError: 'Invalid input width',
        heightFormatError: 'Invalid input height',
        imgSizeConfirm: 'The image size is too big for this layout.\nAre you sure you want to use this size?',
        deleteImgConfirm: 'Are you sure you want to delete this image?',
        unlinkConfirm: 'Are you sure you want to delete the link?'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.sniffer_js); }

    /*
    * editor sniffer
    */
    var editorSniffer = function (editor) {
        this.editor = editor;
        this.initialize();
    };

    editorSniffer.prototype = {

        editor: null,

        processing: false,

        snifferWatcher: null, linkUtil: null,

        // static status configs
        newElementFlag: 'yardi_',
        blankHolderName: 'blank_img_holder.gif',

        currentPanel: null,
        currentSniffer: null,
        originalHtml: null,

        _documentMousedown: null,

        initialize: function () {
            // twinkle panel
            var self = this;
            $(document).mousedown(this._documentMousedown = function (ev) {
                if (self.currentPanel && !yardi.isAncestor(self.currentPanel.el[0], ev.target)) {
                    self.currentPanel.twinkle();
                }
            });
            // watch the specified document
            this.editor.onMousedown.add(function (sender, ev) {
                if (self.currentSniffer != ev.target || ev.which === 3) {
                    if (self.currentSniffer) {
                        self.clearSniffer();
                        return;
                    }
                    if (ev.which !== 1) { return; }
                    // setTimeout to ensure insert sniffer after the document mousedown event(fire twinkle)
                    setTimeout(function () {
                        if (ev.target.nodeName == 'IMG') {
                            var link, elem = ev.target;
                            while (elem) {
                                var n = elem.nodeName;
                                if (n === 'BODY') { break; }
                                if (n === 'A') { link = elem; break; }
                                elem = elem.parentNode;
                            }
                            self.imgSniffer(ev.target, link);
                        } else if (ev.target.nodeName == 'A') {
                            self.linkSniffer(ev.target);
                        }
                        // other nodeTypes here.
                    }, 10);
                }
            });
            // others
            this.snifferWatcher = new yardi.Monitor({
                scope: this,
                interval: 100,
                tester: function () {
                    if (this.currentSniffer && this.currentSniffer.parentNode) {
                        return false;
                    } else {
                        return true;
                    }
                },
                handler: function () {
                    this.clearSniffer();
                }
            });
            // link type utility
            this.linkUtil = new yardi.linktypeUtility();
        },

        destroy: function () {
            this.clearSniffer();
            $(document).unbind('mousedown', this._documentMousedown);
        },

        isNew: function (el) {
            if (el && el.id && el.id.toString().indexOf(this.newElementFlag) == 0) {
                return true;
            } else {
                return false;
            }
        },

        cleanNew: function () {
            var el = this.currentSniffer;
            if (this.isNew(el)) {
                el.id = null;
                el.removeAttribute('id');
            }
        },

        clearSniffer: function () {
            this.snifferWatcher.stop();
            if (this.isNew(this.currentSniffer) && this.originalHtml != null) {
                this.editor.setHtml(this.originalHtml);
                this.originalHtml = null;
            }
            this.currentSniffer = null;
            if (this.currentPanel) {
                this.currentPanel.remove();
                this.currentPanel = null;
            }
        },

        setSniffer: function (el) {
            this.clearSniffer();
            this.currentSniffer = el;
            this.snifferWatcher.start();
        },

        // for trigger store redo undo list.
        triggerCommend: function (cmd, html) {
            this.editor.onExecCommand.dispatch(this.editor, cmd, html);
        },

        // invoke selection to paste sniffer html
        pasteHtml: function (html) {
            var range = this.editor.Selection.getRange();
            var pelem = this.editor.Selection.getParentElement(range);
            var editorDom = this.editor.el.get(0);
            if (editorDom == pelem || yardi.isAncestor(editorDom, pelem)) {
                if (range.pasteHTML) {
                    range.pasteHTML(html);
                } else {
                    range.deleteContents();
                    range.insertNode($(html).get(0));
                }
            }
        },

        cacheHtml: function () {
            this.originalHtml = this.editor.getHtml();
        },

        getPosition: function (el) {
            var winWidth = $(window).width();
            var selfWdith = this.currentPanel.el.outerWidth();
            var scrollLeft = this.editor.el.get(0).scrollLeft;
            var info = yardi.getElementPosition(el);
            // parameter
            var left = info.x + (info.width / 2) - (selfWdith / 2) - scrollLeft;
            var top = info.y + info.height;
            var overflow = Math.max(0, info.x - scrollLeft + (info.width / 2) + (selfWdith / 2) - winWidth);
            if (left < 0) { overflow = left; }
            // arrow
            var aLeft = (this.currentPanel.el.width() - this.currentPanel.arrowTarget.width()) / 2 + overflow;
            this.currentPanel.arrowLeft(aLeft);
            // ret
            return { left: left - overflow, top: top };
        },

        // public
        insertNewImg: function () {
            if (this.processing) { return; }
            this.processing = true;
            // cache first
            this.cacheHtml();
            // paste new html
            var holderId = this.newElementFlag + Math.random().toString();
            this.pasteHtml('<img id="' + holderId + '" />');
            // show
            var holderSrc = (yardi.rootPath || '') + 'editor/images/' + this.blankHolderName;
            var self = this, img = this.editor.doc.getElementById(holderId);
            if (img) {
                img.onload = function () {
                    this.onload = null; // set to null or when set a new src the onload event would be fired again.
                    setTimeout(function () {
                        self.imgSniffer(img);
                        self.processing = false;
                    }, 10);
                };
                img.src = holderSrc;
            } else {
                this.processing = false;
            }
        },

        // public
        insertNewLink: function () {
            if (this.processing) { return; }
            this.processing = true;
            // cache first
            this.cacheHtml();
            // paste new html
            var holderId = this.newElementFlag + Math.random().toString();
            var innerText = this.editor.Selection.getText();
            this.pasteHtml('<a id="' + holderId + '" href="javascript:;">' + innerText + '</a>');
            // show
            var self = this, link = this.editor.doc.getElementById(holderId);
            if (link) {
                setTimeout(function () {
                    self.linkSniffer(link);
                    self.processing = false;
                }, 10);
            } else {
                this.processing = false;
            }
        },

        imgSniffer: function (img, link) {
            if (link) {
                img._parentLink = link;
                if (!link.getAttribute('href')) {
                    link.setAttribute('href', '#');
                }
            }
            this.setSniffer(img);
            // create img sniffer
            var self = this;
            var panel = new yardi.imagePanel({
                showArrow: true,
                onOk: function (url, alt, width, height, href, html) {
                    try {
                        if (width) {
                            var w = parseFloat(width);
                            if (!yardi.isNumber(w) || w.toString().length != width.length || w < 0) {
                                alert(options.widthFormatError);
                                return;
                            }
                            if (w > self.editor.el.width() && !confirm(options.imgSizeConfirm)) {
                                return;
                            }
                        }
                        if (height) {
                            var h = parseFloat(height);
                            if (!yardi.isNumber(h) || h.toString().length != height.length || h < 0) {
                                alert(options.heightFormatError);
                                return;
                            }
                            if (h > self.editor.el.height() && !confirm(options.imgSizeConfirm)) {
                                return;
                            }
                        }

                        var el = self.currentSniffer;
                        el.src = url;
                        if (alt) {
                            el.alt = alt;
                        } else {
                            el.removeAttribute('alt');
                        }
                        if (width) {
                            el.style.width = width + 'px';
                            el.width = width;
                        } else {
                            el.style.width = '';
                            el.removeAttribute('width');
                        }
                        if (height) {
                            el.style.height = height + 'px';
                            el.height = height;
                        } else {
                            el.style.height = '';
                            el.removeAttribute('height');
                        }

                        var parentLink = el._parentLink;
                        if (href) {
                            if (!parentLink) {
                                parentLink = document.createElement('a');
                                parentLink.setAttribute('target', '_blank');
                                el.parentNode.insertBefore(parentLink, el);
                                parentLink.appendChild(el);
                            }
                            parentLink.setAttribute('href', href);
                        } else if (parentLink) {
                            parentLink.parentNode.insertBefore(el, parentLink);
                            parentLink.parentNode.removeChild(parentLink);
                        }
                    } catch (ex) { }
                    // clean
                    self.cleanNew();
                    self.clearSniffer();
                    self.triggerCommend('insertimage', html);
                },
                onDelete: function () {
                    if (confirm(options.deleteImgConfirm)) {
                        var el = self.currentSniffer;
                        if (!self.isNew(el)) {
                            el.parentNode.removeChild(el);
                            var parentLink = el._parentLink;
                            if (parentLink) { parentLink.parentNode.removeChild(parentLink); }
                        }
                        self.clearSniffer();
                        self.triggerCommend('unimage');
                    }
                },
                onCancel: function () {
                    self.clearSniffer();
                },
                onClose: function () {
                    self.clearSniffer();
                }
            });
            this.currentPanel = panel;
            panel.init();
            panel.showPos(this.getPosition(img));
            // init value
            if (img.src.indexOf(this.blankHolderName) == -1) {
                if (img.getAttribute('src')) { panel.setSrc(img.src); } // when src attribute is empty, the src property is link to the current page.
                if (link) { panel.setHref(link.getAttribute('href')); }
                var info = yardi.getElementPosition(img);
                panel.setWidth(info.width);
                panel.setHeight(info.height);
                panel.setAlt(img.alt);
            }
            // focus
            setTimeout(function () { panel.focus(); }, 400);
        },

        linkSniffer: function (link) {
            this.setSniffer(link);
            // create link sniffer
            var self = this;
            var panel = new yardi.linkPanel({
                showArrow: true,
                onOk: function (txt, url, title, target, html) {
                    try {
                        if (url) {
                            var urlTrim = url.replace(/(^\s*)|(\s*$)/g, '').toLowerCase();
                            if (urlTrim.indexOf('http://') !== 0 && urlTrim.indexOf('#') !== 0) {
                                url = 'http://' + url
                            }
                        }
                        var el = self.currentSniffer;
                        el.innerHTML = txt;
                        el.setAttribute('href', url);
                        if (title) {
                            el.title = title;
                        } else {
                            el.removeAttribute('title');
                        }
                        if (target) {
                            el.target = target;
                        } else {
                            el.removeAttribute('target');
                        }
                        // link type value
                        var v = '';
                        panel.linkTypes.each(function () {
                            if ($(this).attr('checked')) {
                                v = $(this).val();
                                return false;
                            }
                        });
                        self.linkUtil.setTarget($(el));
                        self.linkUtil.setValue(v);
                    } catch (ex) { }
                    // clean
                    self.cleanNew();
                    self.clearSniffer();
                    self.triggerCommend('link', html);
                },
                onUnlink: function () {
                    if (confirm(options.unlinkConfirm)) {
                        var el = self.currentSniffer;
                        if (!self.isNew(el)) {
                            var t = $(el).text(), p = el.parentNode;
                            p.insertBefore(document.createTextNode(t), el);
                            p.removeChild(el);
                        }
                        self.clearSniffer();
                        self.triggerCommend('unlink');
                    }
                },
                onCancel: function () {
                    self.clearSniffer();
                },
                onClose: function () {
                    self.clearSniffer();
                }
            });
            this.currentPanel = panel;
            panel.init();
            panel.showPos(this.getPosition(link));
            // init value
            var href = link.getAttribute('href');
            if (href) { // when href attribute is empty, the href property is link to the current page.
                if (href.indexOf('#') == 0) {
                    // the anchor use the original value.
                    panel.urlTarget.val(href);
                } else {
                    // common link use absolute url.
                    panel.urlTarget.val(link.href.replace('javascript:;', ''));
                }
            }
            if (link.innerHTML) { panel.textTarget.val(link.innerHTML); }
            if (link.title) { panel.titleTarget.val(link.title); }
            if (link.target) { panel.targetTarget.attr('checked', (link.target == '_blank')); }
            self.linkUtil.setTarget($(link));
            var linktype = self.linkUtil.getValue();
            panel.linkTypes.each(function () {
                if ($(this).val() == linktype) {
                    $(this).attr('checked', true);
                    return false;
                }
            });
            setTimeout(function () {
                panel.textTarget.focus();
            }, 400);
        }
    };

    // register
    yardi.editorSniffer = editorSniffer;

})(jQuery);
