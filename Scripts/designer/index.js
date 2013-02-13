/*
*
* index
* author: ronglin
* create date: 2010.06.04
*
*/

yardi.designerClass = function () {

    // text resource
    var options = {
        sourceViewTitle: 'source view',
        actionEdit: 'Edit',
        actionDelete: 'Delete',
        actionCopy: 'Copy',
        actionMove: 'Move',
        actionAdd: 'Add'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.index_js); }

    // closure fields
    var redoundo = new yardi.redoundoCore();
    var templateRoot = $('#templateRoot');
    var cache = $('<div class="kb-designer-cache"></div>').appendTo('body');

    // jquery method wrapper
    $.fn._slideDown = function (callback) {
        $(this).removeClass('kb-widget').slideDown('normal', function () {
            $(this).show().addClass('kb-widget');
            callback && callback.call(this);
        });
    };

    $.fn._slideUp = function (callback) {
        $(this).removeClass('kb-widget').slideUp('normal', function () {
            $(this).hide().addClass('kb-widget');
            callback && callback.call(this);
        });
    };

    // get parent iframe element
    var targetIframe = function () {
        window.__rid = Math.random().toString();
        var frm, frms = window.parent.document.getElementsByTagName('iframe');
        for (var i = 0; i < frms.length; i++) {
            if (frms[i].contentWindow.__rid == window.__rid) {
                frm = frms[i];
                break;
            }
        }
        return frm;
    } ();

    // css manager
    var getOrCreateCssNode = function (id) {
        var n = $('#' + id);
        if (n.length > 0) {
            return n.get(0);
        } else {
            var node = document.createElement('style');
            node.setAttribute('type', 'text/css');
            node.setAttribute('id', id);
            document.getElementsByTagName('head')[0].appendChild(node);
            return node;
        }
    };
    var koobooCssId = 'kooboo_css';
    var koobooCss = yardi.styleSheetClass.resolveNode(getOrCreateCssNode(koobooCssId));

    // some instance
    var leftBar;
    var resizer;

    // editor
    var currentEditor;
    var currentEditorToolbar;

    // variable editor
    var currentVarEditor;
    var currentVarEditorToolbar;

    // temporary variables
    var offsetfix = { left: 1, top: 1 };
    var originalContent; // widget content cache

    // page mask
    var enableMask = true;
    var mask = enableMask ? $('<div class="kb-designer-mask"></div>').appendTo('body') : null;
    var _showmask = function (html) {
        if (mask) {
            mask.show().html(html || '').animate({ opacity: 0.6 }, { duration: 400 });
            yardi.zTop(mask);
            yardi.ismasking = true;
        }
        leftBar.lockSlide(true);
    };
    var _hidemask = function () {
        if (mask) {
            mask.hide().empty().css({ opacity: 0 });
            yardi.zOld(mask);
            yardi.ismasking = false;
        }
        leftBar.lockSlide(false);
        //resizer && resizer.trim();
    };

    // menu anchor bars
    var menuAnchorbarObjs = {};
    var menuAnchorbarObjsEach = function (isLock, doHide, except) {
        for (var key in menuAnchorbarObjs) {
            var instance = menuAnchorbarObjs[key];
            if (except == null || instance != except) {
                if (doHide) instance.hide(true);
                instance.lock(isLock);
            }
        }
    };

    // source view panel
    var sourcePanel;
    var _sourcePanelTwinkle = function (ev) {
        if (sourcePanel && !yardi.isAncestor(sourcePanel.el[0], ev.target)) {
            sourcePanel.twinkle();
        }
    };
    var _sourcePanelClose = function () {
        sourcePanel.remove();
        sourcePanel = null;
        $(document).unbind('mousedown', _sourcePanelTwinkle);
    };
    var _setEditorContent = function (content) {
        if (currentEditor) { currentEditor.setHtml(content); }
        if (currentVarEditor) { currentVarEditor.setHtml(content); }
    };
    var _getEditorContent = function () {
        if (currentEditor) { return currentEditor.getHtml(); };
        if (currentVarEditor) { return currentVarEditor.getHtml(); };
    };
    var _showSourcePanel = function (ev) {
        if (currentVarEditor) {
            currentVarEditor.hlComponent(null);
        }
        sourcePanel = new yardi.textPanel({
            title: options.sourceViewTitle,
            textValue: _getEditorContent(),
            onOk: function (newHtml) {
                _setEditorContent(newHtml);
                _sourcePanelClose();
            },
            onCancel: function (oldHtml) {
                _setEditorContent(oldHtml);
                _sourcePanelClose();
            },
            onPreview: function (html) {
                _setEditorContent(html);
            }
        });
        sourcePanel.show(ev.target);
        // bind tween event
        $(document).mousedown(_sourcePanelTwinkle);
    };

    // widget place holder
    var placeholder;
    var removePlaceholder = function () {
        if (placeholder) {
            placeholder.remove();
            placeholder = null;
        }
    };
    var createPlaceholder = function (refEl) {
        removePlaceholder();
        placeholder = $('<div class="kb-widget-placeholder" onselectstart="return false;"></div>');
        placeholder.insertBefore(refEl); // must use insertBefore for the redo undo function.
        placeholder.css({
            //width: refEl.width(),
            height: refEl.height(),
            borderWidth: refEl.css('borderWidth') || 1,
            marginTop: refEl.css('marginTop'),
            marginLeft: refEl.css('marginLeft'),
            marginRight: refEl.css('marginRight'),
            marginBottom: refEl.css('marginBottom'),
            paddingTop: refEl.css('paddingTop'),
            paddingLeft: refEl.css('paddingLeft'),
            paddingRight: refEl.css('paddingRight'),
            paddingBottom: refEl.css('paddingBottom')
        });
        return placeholder;
    };
    var getPlaceholderCss = function () {
        if (placeholder) {
            var pos = placeholder.position();
            return {
                width: placeholder.width(),
                top: pos.top + offsetfix.top,
                left: pos.left + offsetfix.left
            }
        }
    };

    // mouse move direction
    var moveDirection = { left: false, top: false, right: false, bottom: false };
    var originalPosition = { left: 0, top: 0 };
    var judgeMoveDirection = function (currentPosition) {
        moveDirection.left = (originalPosition.left > currentPosition.left);
        moveDirection.right = !moveDirection.left;
        moveDirection.top = (originalPosition.top > currentPosition.top);
        moveDirection.bottom = !moveDirection.top;
        originalPosition = currentPosition;
    };

    // generate key by increase number count.
    var generateNewKey = function (oldKey, query) {
        var num = '', i = oldKey.length - 1;
        for (; i > -1; i--) {
            var charCode = oldKey.charCodeAt(i);
            if (charCode >= 48 && charCode <= 57) { // "0-9"
                num = oldKey.charAt(i) + num;
            } else {
                break;
            }
        }
        var prefix = oldKey.substring(0, i + 1);
        var subfix = (parseInt(num || '0', 10) + 1).toString();
        var newKey = prefix + subfix;
        if (query(newKey).length > 0) {
            return generateNewKey(newKey, query);
        } else {
            return newKey;
        }
    };

    // copy style, this mask will cover the widget container element, 
    // and then the background color in the container will be converd too.
    var copyBackground = function (source, target) {
        if (!enableMask) { return; }
        var element = source, rootElement = templateRoot.get(0), color;
        while (element != rootElement) {
            var s = yardi.currentStyle(element, 'backgroundColor');
            // chrome use rgba(0, 0, 0, 0) instead of transparent.
            if (s && (s = s.toLowerCase()) != 'transparent' && s != 'rgba(0, 0, 0, 0)') {
                color = s;
                break;
            }
            element = element.parentNode;
        }
        target.style['backgroundColor'] = (color || '#FFFFFF');
        target.setAttribute('bgcopied', '1');
    };
    var deleteBackground = function (element) {
        if (!enableMask) { return; }
        if (element.getAttribute('bgcopied') == '1') {
            element.removeAttribute('bgcopied');
            element.style['backgroundColor'] = '';
        }
    };

    var nextSibling = function (el) {
        if (!el) { return; }
        var next = el.nextSibling;
        while (next && next.nodeType != 1) {
            next = next.nextSibling;
        }
        return next;
    };

    // widget's prototype functions
    var _scrollToWidget = function (el, callback) {
        var elemBounding;
        if (el.css('display') == 'none') {
            var temp = $('<div style="width:1px; height:1px;"></div>').insertAfter(el);
            elemBounding = temp.get(0).getBoundingClientRect();
            temp.remove();
        } else {
            elemBounding = el.get(0).getBoundingClientRect();
        }
        var elemHeight = el.height();
        var windowHeight = $(window.parent).height();
        var iframeBouding = targetIframe.getBoundingClientRect();
        var boundingTop = elemBounding.top + iframeBouding.top;
        var scrollOffset = 0, centerOffset = (windowHeight - elemHeight) / 2;
        if (boundingTop < 0) {
            scrollOffset = boundingTop;
            if (centerOffset > 0) { scrollOffset -= centerOffset; }
        } else if (boundingTop + elemHeight > windowHeight) {
            scrollOffset = boundingTop + elemHeight - windowHeight;
            if (centerOffset > 0) { scrollOffset += centerOffset; }
        }
        // do scroll to view
        if (scrollOffset != 0) {
            var scrollEl = (yardi.isSafari || yardi.isChrome) ? window.parent.document.body : window.parent.document.documentElement;
            var scrollTop = $(scrollEl).attr('scrollTop') + scrollOffset;
            $(scrollEl).animate({ scrollTop: scrollTop }, 500, function () { callback(true); });
        } else {
            callback(false);
        }
    };
    var _maskWidget = function (el) {
        var css = el.offset(), m = $('<div class="kb-widget-mask"></div>').appendTo(cache);
        return m.css($.extend(css, { width: el.width(), height: el.height() }));
    };
    var _unmaskWidget = function () {
        $('.kb-widget-mask', cache).remove();
    };
    var _highlightWidget = function (el, callback) {
        var m = _maskWidget(el);
        setTimeout(function () {
            _unmaskWidget();
            callback && callback();
        }, 500);
    };
    var _addWidget = function (templateId, targetId) {
        // get target container.
        var target = $('#' + targetId + '[kooboo=position]');
        if (target.length == 0) { target = $('[kooboo=position]:eq(0)'); } // if can't find target insert to first position.
        // copy template.
        var template = $('#' + templateId).clone();
        if (template.length == 0) { return; }
        var widget = _wrapWidget(template.appendTo(target)).hide();
        // generate new identification.
        var oldKey = widget.attr('keyid');
        var oldTitle = widget.attr('title');
        var newKey = generateNewKey(oldKey.replace('t_', ''), function (k) { return $('#' + k); });
        var newTitle = generateNewKey(oldTitle, function (k) { return $('[title=' + k + ']'); });
        widget.attr('keyid', newKey).attr('title', newTitle);
        widget.children().attr('id', newKey).attr('title', newTitle);
        // bind designer objects
        var bar = _bindMenuAnchorBar(widget);
        _bindDrag(bar.el, newKey);
        _bindDrop(bar.alignTo);
        // show
        _showWidget(newKey);
        // ret
        return widget;
    };
    var _hideWidget = function (key, callback) {
        menuAnchorbarObjsEach(true, true);
        var el = menuAnchorbarObjs[key].alignTo;
        _scrollToWidget(el, function (scrolled) {
            var fn = function () {
                _highlightWidget(el, function () {
                    el._slideUp(function () {
                        menuAnchorbarObjsEach(false, false);
                        resizer && resizer.trim();
                        callback && callback();
                    });
                });
            }
            scrolled ? setTimeout(fn, 300) : fn();
        });
    };
    var _showWidget = function (key, callback) {
        menuAnchorbarObjsEach(true, true);
        var el = menuAnchorbarObjs[key].alignTo;
        _scrollToWidget(el, function (scrolled) {
            var fn = function () {
                el._slideDown(function () {
                    menuAnchorbarObjsEach(false, false);
                    _highlightWidget(el);
                    callback && callback();
                });
            };
            scrolled ? setTimeout(fn, 300) : fn();
        });
    };
    var _deleteWidget = function (key) {
        var alignTo = menuAnchorbarObjs[key].alignTo;
        // remove the anchorbar
        menuAnchorbarObjs[key].remove();
        delete menuAnchorbarObjs[key];
        // remove the widget
        alignTo.remove();
    };
    var _copyWidget = function () {
        // copy element
        var copyedAlignTo = this.alignTo.clone().hide();
        copyedAlignTo.insertAfter(this.alignTo);
        var oldKey = this.alignTo.attr('keyid');
        var oldTitle = this.alignTo.attr('title');
        var newKey = generateNewKey(oldKey, function (k) { return $('#' + k); });
        var newTitle = generateNewKey(oldTitle, function (k) { return $('[title=' + k + ']'); });
        copyedAlignTo.attr('keyid', newKey).attr('title', newTitle);
        copyedAlignTo.children().attr('id', newKey).attr('title', newTitle);
        copyedAlignTo.removeClass('kb-anchorbar-highlight');
        // bind designer objects
        var bar = _bindMenuAnchorBar(copyedAlignTo);
        _bindDrag(bar.el, newKey);
        _bindDrop(bar.alignTo);
        // show
        _showWidget(newKey);
        // ret
        return copyedAlignTo;
    };
    var _wrapWidget = function (widget) {
        var wrap, id = widget.attr('id'), title = widget.attr('title'), float = widget.css('float');
        wrap = widget.wrap('<div kooboo="widget_wrapper" keyid="' + id + '" title="' + title + '"></div>').parent();
        if (float && float != 'none') {
            // fix widget float bug.
            // when widget set to float left or right, it break away the wrapper
            wrap.css({
                float: float,
                minWidth: widget.css('width')
            });
        }
        return wrap;
    };

    // bind a menu anchorbar to a widget.
    var _bindMenuAnchorBar = function (item) {
        var key = item.attr('keyid');
        var title = item.attr('title');
        menuAnchorbarObjs[key] = new yardi.menuAnchorBar({
            alignTo: item,
            renderTo: cache,
            nameTitle: title,
            onEdit: function (ev) {
                // cache widget html
                originalContent = this.alignTo.html();
                // new editor
                yardi.zTop(this.alignTo);
                currentEditor = new yardi.editor({
                    el: this.alignTo,
                    onInitialized: function () {
                        // copy background
                        copyBackground(this.el.get(0), this.el.get(0));
                        // current editor anchorbar
                        currentEditorToolbar = new yardi.editorAnchorBar({
                            alignTo: this.el,
                            renderTo: cache,
                            editor: this
                        });
                        currentEditorToolbar.show();
                        currentEditorToolbar.lock(true);
                    }
                });
                // state
                menuAnchorbarObjsEach(true, true, this);
                _showmask();
            },
            onEditText: function () {
                // cache widget html
                originalContent = this.alignTo.html();
                // current editor anchorbar
                yardi.zTop(this.alignTo);
                currentVarEditorToolbar = new yardi.varAnchorBar({
                    alignTo: this.alignTo,
                    renderTo: cache
                });
                currentVarEditorToolbar.show();
                currentVarEditorToolbar.lock(true);
                // new var editor
                currentVarEditor = new yardi.varEditor({
                    editNode: this.alignTo,
                    renderTo: currentVarEditorToolbar.el
                });
                currentVarEditor.edit();
                // copy background
                copyBackground(this.alignTo.get(0), this.alignTo.get(0));
                // state
                menuAnchorbarObjsEach(true, true, this);
                _showmask();
            },
            onSave: function () {
                yardi.zOld(this.alignTo);
                if (currentEditor) {
                    // cache the editor result
                    //var html = currentEditor.getHtml();
                    // delete background
                    deleteBackground(currentEditor.el.get(0));
                    // remove editor
                    currentEditor.remove();
                    currentEditor = null;
                    // editor toolbar
                    currentEditorToolbar.remove();
                    currentEditorToolbar = null;
                    // set new value to widget
                    //this.alignTo.html(html);
                }
                if (currentVarEditor) {
                    // remove editor
                    if (!currentVarEditor.save()) { return false; }
                    currentVarEditor.destroy();
                    currentVarEditor = null;
                    // remove toolbar
                    currentVarEditorToolbar.remove();
                    currentVarEditorToolbar = null;
                    // delete background
                    deleteBackground(this.alignTo.get(0));
                }
                // commit history
                var newHtml = this.alignTo.html();
                if (newHtml != originalContent) {
                    var key = this.alignTo.attr('keyid');
                    var name = this.alignTo.attr('title');
                    var delegate = function (key, html) {
                        return function (ev) {
                            var w = menuAnchorbarObjs[key].alignTo;
                            _scrollToWidget(w, function () {
                                w.html(html);
                                ev.done();
                            });
                        };
                    };
                    redoundo.commit({
                        name: options.actionEdit + ' ' + name,
                        undo: delegate(key, originalContent),
                        redo: delegate(key, newHtml)
                    });
                }
                // status
                menuAnchorbarObjsEach(false, true, this);
                originalContent = null;
                _hidemask();
            },
            onCancel: function () {
                yardi.zOld(this.alignTo);
                if (currentEditor) {
                    // delete background
                    deleteBackground(currentEditor.el.get(0));
                    // remove editor
                    currentEditor.setHtml(originalContent);
                    currentEditor.remove();
                    currentEditor = null;
                    // editor toolbar
                    currentEditorToolbar.remove();
                    currentEditorToolbar = null;
                    // reset widget inner html
                    //this.alignTo.html(originalContent);
                }
                if (currentVarEditor) {
                    // remove editor
                    currentVarEditor.destroy();
                    currentVarEditor = null;
                    // remove toolbar
                    currentVarEditorToolbar.remove();
                    currentVarEditorToolbar = null;
                    // reset widget inner html
                    this.alignTo.html(originalContent);
                    // delete background
                    deleteBackground(this.alignTo.get(0));
                }
                // reset status
                menuAnchorbarObjsEach(false, true, this);
                originalContent = null;
                _hidemask();
            },
            onViewSource: function (ev) {
                _showSourcePanel(ev);
                //if (currentEditor) {
                //    currentEditor.switchView();
                //    currentEditor.triggerUpdateToolbar();
                //    //currentEditorToolbar.isEnable(!currentEditor.sourceView);
                //}
                //if (currentVarEditor) {
                //    currentVarEditor.switchView();
                //}
            },
            onDelete: function () {
                var key = this.alignTo.attr('keyid');
                var name = this.alignTo.attr('title');
                _hideWidget(key, false);
                // commit history
                redoundo.commit({
                    name: options.actionDelete + ' ' + name,
                    undo: function (key) {
                        return function (ev) { _showWidget(key, function () { ev.done(); }); };
                    } (key),
                    redo: function (key) {
                        return function (ev) { _hideWidget(key, function () { ev.done(); }); };
                    } (key)
                });
            },
            onCopy: function () {
                var widget = _copyWidget.call(this);
                var key = widget.attr('keyid');
                var name = widget.attr('title');
                // commit history
                redoundo.commit({
                    name: options.actionCopy + ' ' + name,
                    undo: function (key) {
                        return function (ev) { _hideWidget(key, function () { ev.done(); }); };
                    } (key),
                    redo: function (key) {
                        return function (ev) { _showWidget(key, function () { ev.done(); }); };
                    } (key)
                });
            }
        });
        return menuAnchorbarObjs[key];
    };

    // bind drag actions to anchorbar element.
    var _bindDrag = function (item, key) {
        // cache anchorbar key.
        item.attr('anchorbarKey', key);
        item.draggable({
            // limit the items drag inside root.
            //containment: templateRoot,
            // refresh positions every drag
            refreshPositions: true,
            // start drag after move distance
            distance: 4,
            // draging callback
            drag: function (event, ui) {
                // get bar instance
                var key = ui.helper.attr('anchorbarKey');
                var bar = menuAnchorbarObjs[key];
                // drag the widget too.
                bar.alignTo.css({
                    top: ui.offset.top - offsetfix.top,
                    left: ui.offset.left - offsetfix.left
                });
                // judge move direction
                judgeMoveDirection(ui.position);
            },
            // start before drag.
            start: function (event, ui) {
                // get bar instance
                var key = ui.helper.attr('anchorbarKey');
                var bar = menuAnchorbarObjs[key];
                if (!bar.isEditing && bar.canDrag) {
                    // mark to ignore once drop in kooboo position.
                    bar.alignTo.parent().attr('_ignoreOnce', '1');
                    // set true to prevent windon resize event.
                    bar.dragging = true;
                    // create position holder element
                    createPlaceholder(bar.alignTo);
                    // init the widgets state
                    menuAnchorbarObjsEach(true, false);
                    // set align style
                    var w = bar.alignTo.width();
                    bar.alignTo.addClass('kb-widget-drapping');
                    bar.alignTo.width(w);
                    // disabled self drop
                    bar.alignTo.droppable('option', 'disabled', true);
                    return true;
                }
                return false;
            },
            // stop the drag.
            stop: function (event, ui) {
                var key = ui.helper.attr('anchorbarKey');
                var bar = menuAnchorbarObjs[key];
                var name = bar.alignTo.attr('title');
                ui.helper.animate(getPlaceholderCss() || ui.originalPosition, {
                    duration: 400,
                    step: function (now, ctx) {
                        // when anchorbar el is dropping, move widget too
                        if (ctx.prop == 'top') now = now - offsetfix.top;
                        if (ctx.prop == 'left') now = now - offsetfix.left;
                        bar.alignTo.css(ctx.prop, now);
                    },
                    complete: function () {
                        var cachedPar = bar.alignTo.parent().get(0);
                        var cachedNext = nextSibling(bar.alignTo.get(0));
                        // remove the ignore once mark in kooboo position.
                        bar.alignTo.parent().removeAttr('_ignoreOnce');
                        // reset to false
                        bar.dragging = false;
                        // reset the widgets state
                        menuAnchorbarObjsEach(false, true);
                        // replace position holder
                        bar.alignTo.insertAfter(placeholder);
                        removePlaceholder();
                        // reset align styles
                        bar.alignTo.removeClass('kb-widget-drapping');
                        bar.alignTo.css({ top: '', left: '', width: '' }); //bar.alignTo.css({ top: null, left: null, width: null });
                        // enabled self drop
                        bar.alignTo.droppable('option', 'disabled', false);
                        // commit history
                        var cachedNewPar = bar.alignTo.parent().get(0);
                        var cachedNewNext = nextSibling(bar.alignTo.get(0));
                        if (cachedNewNext != cachedNext || cachedPar != cachedNewPar) {
                            var delegate = function (key, par, next) {
                                return function (ev) {
                                    _hideWidget(key, function () {
                                        var to = menuAnchorbarObjs[key].alignTo;
                                        if (next) {
                                            to.insertBefore(next);
                                        } else {
                                            to.appendTo(par);
                                        }
                                        _showWidget(key, function () { ev.done(); });
                                    });
                                };
                            };
                            redoundo.commit({
                                name: options.actionMove + ' ' + name,
                                undo: delegate(key, cachedPar, cachedNext),
                                redo: delegate(key, cachedNewPar, cachedNewNext)
                            });
                        }
                    }
                });
            }
            //helper: 'clone'
            //helper: function (ev) {
            //    var key = $(this).attr('anchorbarKey');
            //    var bar = menuAnchorbarObjs[key];
            //    return bar.el.html();
            //}
        });
    };

    // bind drop actions to widget element.
    var _bindDrop = function (item) {
        item.droppable({
            tolerance: 'pointer',
            accept: '.kb-menuanchorbar',
            activate: function (event, ui) { },
            deactivate: function (event, ui) { },
            over: function (event, ui) {
                if ($(this).attr('kooboo') == 'position') {
                    if ($(this).attr('_ignoreOnce') == '1') {
                        $(this).removeAttr('_ignoreOnce');
                        return;
                    }
                    $(this).append(placeholder);
                } else {
                    if (moveDirection.bottom) {
                        placeholder.insertAfter(this);
                    } else {
                        placeholder.insertBefore(this);
                    }
                }
            },
            out: function (event, ui) { },
            drop: function (event, ui) { }
        });
    };

    // disalbe all template link action.
    // set all link be opened in new window.
    $('a', templateRoot).live('click', function () {
        return false;
    }).each(function () {
        var h = $(this).attr('href');
        h && (h.indexOf('#') !== 0) && $(this).attr('target', '_blank');
    });

    // set min-width style to templateRoot with a value a bit large than it's width.
    // do this is intend to let the template background visible by default.
    templateRoot.css({ 'min-width': templateRoot.width() + 80 });

    // disable backspace when is not editing
    $(document).keydown(function (ev) {
        if (ev.keyCode !== 8) { return; }
        var o = ev.target, tag = o.tagName.toUpperCase();
        if ((tag == 'TEXTAREA') ||
            (tag == 'INPUT' && o.type.toUpperCase() == 'TEXT' && o.readOnly !== true) ||
            (currentEditor && yardi.isAncestor(currentEditor.el.get(0), o)) ||
            (currentEditor && currentEditor.el.get(0) == o)) {
            return;
        }
        // prevent go to previous page
        ev.preventDefault();
    });

    // core functions
    return {

        // wrap widgets is necessary, for some widget is not a div container.
        // so it may be can not support the contentEditable and the editor may be invalidation.

        getWidgets: function () {
            return $('*[kooboo=widget_wrapper]', templateRoot);
        },

        wrapWidgets: function () {
            $('*[kooboo=widget]', templateRoot).each(function () {
                _wrapWidget($(this));
            });
        },

        unwrapWidgets: function (el) {
            $('*[kooboo=widget]', el).each(function () {
                $(this).unwrap();
            });
            $('*[kooboo=position]', el).each(function () {
                $(this).removeClass('ui-droppable kb-position');
            });
        },

        createBars: function () {
            var templates = [];
            $('*[kooboo=widget]', $('#html_template')).each(function () {
                var key = $(this).attr('id');
                if (!key) {
                    key = $(this).attr('title') || Math.random().toString().substr(2);
                    key = key.replace(/ /g, '');
                    key = generateNewKey(key, function (k) { return $('#' + k); });
                    $(this).attr('id', key);
                }
                templates.push($(this));
            });
            leftBar = new yardi.sideBar({
                renderTo: $('#designerBars'),
                redoundo: redoundo,
                templates: templates,
                koobooCss: koobooCss,
                templateRoot: templateRoot,
                parentIframe: targetIframe,
                onAdd: function (btn, id, title, target) {
                    var widget = _addWidget(id, target);
                    if (widget) {
                        var key = widget.attr('keyid');
                        var name = widget.attr('title');
                        // commit history
                        redoundo.commit({
                            name: options.actionAdd + ' ' + name,
                            undo: function (key) {
                                return function (ev) { _hideWidget(key, function () { ev.done(); }); };
                            } (key),
                            redo: function (key) {
                                return function (ev) { _showWidget(key, function () { ev.done(); }); };
                            } (key)
                        });
                    }
                }
            });
        },

        bindResizer: function () {
            if (targetIframe) {
                // this may be failure for the cross domain error.
                resizer = new yardi.resizerClass({ target: targetIframe, showUI: false });
                //setTimeout(function () { resizer.lock('x'); }, 500);
                // if resizer instance create success, then set target overlow to hidden.
                targetIframe.style.overflow = 'hidden';
                // load the resizer.css to parent document.
                if (resizer.doc != document) {
                    var shs = new yardi.sheetsHelper(resizer.doc);
                    shs.swapStyleSheet('css_resizer', yardi.rootPath + 'resizer/resizer.css');
                }
            }
        },

        bindMenuAnchorBars: function () {
            this.getWidgets().each(function () {
                _bindMenuAnchorBar($(this).addClass('kb-widget'));
            });
        },

        bindDrags: function () {
            for (var key in menuAnchorbarObjs) {
                _bindDrag(menuAnchorbarObjs[key].el, key);
            }
        },

        bindDrops: function () {
            $('*[kooboo=position]', templateRoot).each(function () {
                _bindDrop($(this).addClass('kb-position'));
            });
            for (var key in menuAnchorbarObjs) {
                _bindDrop(menuAnchorbarObjs[key].alignTo);
            }
        },

        // public
        redo: function () {
            redoundo.redo();
        },

        // public
        undo: function () {
            redoundo.undo();
        },

        // public
        isChanged: function () {
            return (redoundo.canUndo() || redoundo.overflowed);
        },

        // public
        isEditing: function () {
            //return (originalContent != null);
            return (currentEditor != null || currentVarEditor != null);
        },

        // public
        showMask: function (html) {
            _showmask(html);
        },

        // public
        hideMask: function () {
            _hidemask();
        },

        // public
        isMasked: function () {
            return yardi.ismasking;
        },

        // public
        getHtml: function () {
            // cancel the editing
            if (this.isEditing()) {
                $.each(menuAnchorbarObjs, function (k, o) {
                    if (!o.isEditing) { return; }
                    // if is editing default to cancel the edit.
                    o.components.btnCancel.el.click();
                });
            }

            // remove the hidden widgets
            var cloned = templateRoot.clone().appendTo(cache);
            $('*[kooboo=widget_wrapper]', cloned).each(function () {
                if ($(this).css('display') == 'none') {
                    $(this).remove();
                }
            });

            // unwrap and then get html
            this.unwrapWidgets(cloned);

            // get inner html
            var html = yardi.innerHTML(cloned.get(0)); //var html = cloned.html();

            // remove the supernumerary attributes
            html = html.replace(/ jQuery\d+="(?:\d+|null)"/g, '');
            html = html.replace(/ aria-disabled="false"/g, '');
            html = html.replace(/ style="true"/g, '');
            html = html.replace(/ style=""/g, '');
            html = html.replace(/ class=""/g, '');

            // ret
            cloned.remove();
            return html;
        },

        // public
        getCss: function () {
            // css
            var css = [];
            css.push('<style id="' + koobooCssId + '" type="text/css">\n');
            //css.push(koobooCss.getRuleTextAll());
            css.push(leftBar.barComponents.stylesheetDesigner.getCssTextAll());
            css.push('\n</style>\n');
            // ret
            return css.join('');
        },

        // public
        showDialog: function (cfg, outerApi) {
            // empty implement, this function will overrrided in nested page.
        }

        //, test: function () {
        //    alert(this.getHtml());
        //    alert(this.getCss());
        //}
    };
};

yardi.rootPath = _vpath + 'Scripts/designer/';

yardi.publiced = true;
yardi.modeling = false;
yardi.dialoging = false;
yardi.ismasking = false;

var designer;

$(function () {

    // create designer.
    designer = yardi.designerClass();

    // bind or create left bars.
    designer.createBars();

    // wrap widgets a div container.
    designer.wrapWidgets();

    if (yardi.publiced) {
        // bind resizer, this must catch some cross domain error.
        try { designer.bindResizer(); } catch (ex) { }
    }

    // bind anchorbars to template blocks.
    designer.bindMenuAnchorBars();

    // bind drag drop actions.
    designer.bindDrags();
    designer.bindDrops();

    // report load event.
    window.parent && window.parent.iframeLoaded && window.parent.iframeLoaded(designer, window);

    // report unload event.
    $(window).unload(function () {
        window.parent && window.parent.iframeUnload && window.parent.iframeUnload();
    });

});