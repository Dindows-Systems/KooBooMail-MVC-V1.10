/*
*
* index
* author: ronglin
* create date: 2010.06.22
*
*/

(function ($) {

    // text resource
    var options = {
        tabAddQuestion: 'Add Question',
        tabFieldProperties: 'Field Properties',
        tabFormProperties: 'Form Properties',
        noQuestionNoticeCaption: 'You have no questions yet!',
        noQuestionNoticeContent: 'Click the buttons on the right to add questions to your form.',
        formExistingMsg: 'There is already a forminfo filed.',
        thanksExistingMsg: 'There is already a thanks filed.',
        copyrightExistingMsg: 'There is already a copyright filed.',
        greetingExistingMsg: 'There is already a greeting field.',
        editFieldLabel: 'edit this field',
        componentText: 'Text',
        componentTextArea: 'TextArea',
        componentComboBox: 'ComboBox',
        componentRadioList: 'RadioList',
        componentCheckList: 'CheckList',
        componentRateItemsScale: 'RateItemsScale',
        componentPageBreak: 'PageBreak',
        componentCopyright: 'Copyright'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.index_js); }

    /*
    * index
    */
    yardi.builderClass = function () {

        // closure fields
        var redoundo = new yardi.redoundoCore();
        var designerBar = $('.designer-sidebar');
        var designerHead = $('.designer-head');
        var designerMain = $('.designer-main');
        var designerFoot = $('.designer-foot');

        var isloading = false;
        //var actionBtns = $('.designer-btns');
        var messageObject = yardi.messageClass($('.designer-mesg'));

        // get parent iframe element
        var resizer;
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

        // tab
        var tabObject;
        var tabItems = [{ title: options.tabAddQuestion, width: 100, content: null },
                    { title: options.tabFieldProperties, width: 100, content: null },
                    { title: options.tabFormProperties, width: 100, content: null}];
        var toggleTab = function (sender) {
            if (sender.typeKey == 'formInfo') {
                tabObject.select(2);
            } else {
                tabObject.select(1);
            }
        };

        // sync tab location
        var animateScrollTab = function () {
            var iframeBouding = targetIframe.getBoundingClientRect();
            var bounding = designerBar[0].getBoundingClientRect();
            var boundingTop = bounding.top + iframeBouding.top;
            var marginTop = 0;
            if (boundingTop < 0) {
                marginTop = Math.abs(boundingTop) + 10;
            }
            // bottom limit
            if (marginTop > 0) {
                var overflow = (marginTop + tabObject.el.outerHeight()) - designerMain.parent().outerHeight();
                if (overflow > 0) {
                    marginTop = marginTop - overflow;
                    marginTop = Math.max(marginTop, 0);
                }
            }
            tabObject.el.animate({ 'margin-top': marginTop }, 200);
        };

        // update fileds indexs
        var updateIndexs = function () {
            var setIndex = function (value, fieldEl) {
                var text = '';
                if (yardi.isString(value)) {
                    text = value;
                } else if (yardi.isNumber(value)) {
                    text = value.toString() + '.';
                }
                $('.fieldindex', fieldEl).html(text);
            };
            designerMain.children('div:not(.s-pagebreak)').each(function (index) {
                setIndex(index + 1, $(this));
            });
        };

        // helper function
        var removeUselessNode = function (nodes/*, pub*/) {
            $.each(nodes, function (index, node) {
                $('.kb-anchortoolbar', node).each(function () {
                    $(this).remove();
                });
                //if (pub === true) {
                //    $.each(['.comment', '.require', '.fieldtop'], function (index, selector) {
                //        $(selector, node).each(function () {
                //            if ($(this).css('display') == 'none') {
                //                $(this).remove();
                //            }
                //        });
                //    });
                //    $('input[name=guideline]', node).each(function () {
                //        if ($(this).val() == '') {
                //            $(this).remove();
                //        }
                //    });
                //}
            });
        };

        // helper function
        var removeUselessAttr = function (html/*, pub*/) {
            //if (pub === true) {
            //    html = html.replace(/ f_\d+="\S+"/g, '');
            //    html = html.replace(/ uuid="\d+"/g, '');
            //    html = html.replace(/ empty="false"/g, '');
            //}
            //html = html.replace(/ jQuery\d+="(?:\d+|null)"/g, '');
            //html = html.replace(/ s-field-hover/g, '');
            //html = html.replace(/ s-field-editing/g, '');
            return html;
        };

        // form settings
        var applyFormSettings = function (o) {
            if (oFormField) {
                $('.fieldindex').css('display', oFormField.numbering ? '' : 'none');
                $('.fieldtop').css('display', (oFormField.separator == 0) ? 'none' : 'block').css('height', oFormField.separator);
            }
        };

        // check message
        var checkFieldEmptyMessage = function () {
            if (inputFieldsCount() == 0) {
                messageObject.show(options.noQuestionNoticeCaption, options.noQuestionNoticeContent);
                //actionBtns.hide();
            } else {
                messageObject.hide();
            }
        };

        // editing fields
        var types = yardi.baseField.componentTypes;
        var inputFields = {}, oFormField, oGreetingField, oCopyrightField, oThanksField;
        var inputFieldsCount = function () {
            var count = 0;
            $.each(inputFields, function (key, value) {
                if (value instanceof yardi.baseField)
                    count++;
            });
            return count;
        };
        var enableFields = function (enabled) {
            enabled = (enabled !== false);
            var set = function (item) { item && (enabled === item.isEditing()) && item.disable(!enabled); };
            $.each([oFormField, oGreetingField, oCopyrightField, oThanksField], function (index, item) { set(item); });
            $.each(inputFields, function (key, value) { set(value); });
        };
        var clearFields = function () {
            if (oFormField) {
                oFormField.remove();
                oFormField = null;
            }
            if (oCopyrightField) {
                oCopyrightField.remove();
                oCopyrightField = null;
            }
            if (oThanksField) {
                oThanksField.remove();
                oThanksField = null;
            }
            $.each(inputFields, function (key, value) {
                value.remove();
                delete inputFields[key];
            });
            inputFields = {};
            if (yardi.isIE) {
                animateScrollTab();
            }
            // resize
            resizer && resizer.trim();
        };
        var removeFiled = function (obj) {
            var cb = function () {
                resizer && resizer.trim();
                updateIndexs();
                if (yardi.isIE) {
                    animateScrollTab();
                }
            };
            if (oFormField == obj) {
                oFormField.remove(cb);
                oFormField = null;
            }
            else if (oCopyrightField == obj) {
                oCopyrightField.remove(cb);
                oCopyrightField = null;
            }
            else if (oThanksField == obj) {
                oThanksField.remove(cb);
                oThanksField = null;
            }
            else {
                var key = obj.fieldName;
                delete inputFields[key];
                obj.remove(cb);
            }
            checkFieldEmptyMessage();
        };
        var copyField = function (field) {
            field.disable(false);
            var html = $('<div></div>').append(field.el.eq(0).clone()).html();
            field.disable(true);
            html = html.replace(new RegExp(field.uuid, 'g'), field.newUUID());
            html = html.replace(new RegExp(field.fieldName, 'g'), field.generateFieldName());
            html = removeUselessAttr(html);
            var elem = $(html);
            removeUselessNode([elem]);
            var type = types[field.typeKey];
            createField(type, {
                el: elem,
                renderAfter: field.el,
                onInitialized: function () {
                    this.scrollToView(function (scrolled) {
                        this.mask(500);
                    });
                }
            });
        };
        var createField = function (type, cfg, twinkle) {
            if (isloading) return;
            // types that only one field is need.
            var isForm = (type == types.formInfo);
            if (isForm && oFormField) {
                alert(options.formExistingMsg);
                return oFormField;
            }
            var isThanks = (type == types.thanks);
            if (isThanks && oThanksField) {
                alert(options.thanksExistingMsg);
                return oThanksField;
            }
            var isCopyright = (type == types.copyright);
            if (isCopyright && oCopyrightField) {
                alert(options.copyrightExistingMsg);
                return oCopyrightField;
            }
            var isGreeting = (type == types.greeting);
            if (isGreeting && oGreetingField) {
                alert(options.greetingExistingMsg);
                return oGreetingField;
            }
            // create
            var renderTo = (isForm || isGreeting) ? designerHead : (isCopyright || isThanks) ? designerFoot : designerMain;
            var proRenderTo = tabItems[(isForm ? 2 : 1)].content;
            var config = {
                renderTo: renderTo,
                proRenderTo: proRenderTo,
                onCopy: copyField,
                onRemove: removeFiled,
                onClick: function (sender, isedit) {
                    toggleTab(sender);
                    if (!isedit) { enableFields(true); }
                },
                parentIframe: targetIframe,
                onInitialized: function () {
                    if (twinkle === true) {
                        this.scrollToView(function (scrolled) {
                            this.mask(500);
                        });
                    }
                }
            };
            var f = new type($.extend(config, cfg));
            if (isForm) {
                oFormField = f;
                oFormField.showProperty();
                oFormField.onUpdateValue = function (sender) {
                    window.setTimeout(function () {
                        applyFormSettings(sender);
                    }, 10);
                };
            } else if (isGreeting) {
                oGreetingField = f;
            } else if (isThanks) {
                oThanksField = f;
            } else if (isCopyright) {
                oCopyrightField = f;
            } else {
                inputFields[f.fieldName] = f;
                // flags
                messageObject.hide();
                //actionBtns.show();
                updateIndexs();
            }
            // setting
            applyFormSettings(f);
            // ret
            return f;
        };

        // selection disabled
        var disableSelection = function (el) {
            el.disableSelection();
            el.bind('selectstart', function () { return false; });
        };
        disableSelection(designerMain);

        //// page before unload notice
        //$(window).bind('beforeunload', function (ev) {
        //    return 'Are you sure you want to leave page? All your changes might be lost.';
        //});

        // core functions
        return {

            initializeSidebar: function () {
                // create tab
                tabObject = new yardi.tabControl({
                    renderTo: designerBar,
                    items: tabItems
                });

                // init add field function
                var con = $('<div class="addcon"></div>');
                var createItem = function (text, cls, type) {
                    var btn = $('<div class="btnwrap"><div class="loc"><a href="javascript:;" class="locbtn">' + options.editFieldLabel + '</a>.</div><a href="javascript:;" class="addbtn ' + cls + '"><span>' + text + '</span></a></div>').appendTo(con);
                    $('a.addbtn', btn).click(function () {
                        var f = createField(type, null, true);
                        if (f) {
                            $('div.loc', con).hide('fast');
                            $(this).prev().show('fast');
                            $('a.locbtn', btn)[0]._field = f;
                        }
                        return false;
                    });
                    $('a.locbtn', btn).click(function () {
                        var f = this._field;
                        if (f && f.el) {
                            //var top = f.el.position().top;
                            //$(window).scrollTop(top - 20);
                            //window.setTimeout(function () {
                            f.fireEdit();
                            //}, 300);
                        } else {
                            $('div.loc', con).hide();
                        }
                        return false;
                    });
                };

                createItem(options.componentText, 'btnText', types.textBox);
                createItem(options.componentTextArea, 'btnTextarea', types.textArea);
                createItem(options.componentComboBox, 'btnCombobox', types.comboBox);
                createItem(options.componentRadioList, 'btnRadiolist', types.radioList);
                createItem(options.componentCheckList, 'btnChecklist', types.checkList);
                createItem(options.componentRateItemsScale, 'btnRatescale', types.rateItems);
                createItem(options.componentPageBreak, 'btnPagebreak', types.pageBreak);
                createItem(options.componentCopyright, 'btnCopyright', types.copyright);

                // append to dom
                disableSelection(con);
                tabItems[0].content.append(con);
            },

            defaultField: function () {
                createField(types.formInfo);
                createField(types.greeting);
                createField(types.thanks);
            },

            bindSortFields: function () {
                designerMain.sortable({
                    axis: 'y',
                    revert: true,
                    distance: 4,
                    //containment: designerMain,
                    forcePlaceholderSize: true,
                    placeholder: 's-field sortplaceholder',
                    start: function (event, ui) {
                        ui.helper.css('left', ui.originalPosition.left);
                        //if (!yardi.isWebKit || yardi.isChrome) {
                        //    ui.helper.css('left', ui.originalPosition.left);
                        //}
                    },
                    stop: function (event, ui) {
                        updateIndexs();
                    }
                });
            },

            bindResizer: function () {
                if (targetIframe) {
                    // this may be failure for the cross domain error.
                    resizer = new yardi.resizerClass({ target: targetIframe, showUI: false });
                    // if resizer instance create success, then set target overlow to hidden.
                    targetIframe.style.overflow = 'hidden';
                    // load the resizer.css to parent document.
                    if (resizer.doc != document) {
                        var shs = new yardi.sheetsHelper(resizer.doc);
                        shs.swapStyleSheet('css_resizer', yardi.rootPath + 'resizer/resizer.css');
                    }
                }
            },

            // public
            timeoutId: null,
            fireScroll: function () {
                if (!yardi.modeling && !yardi.dialoging) {
                    window.clearTimeout(builderObject.timeoutId);
                    builderObject.timeoutId = window.setTimeout(animateScrollTab, 200);
                }
            },

            // public
            getRedoundo: function () {
                return redoundo;
            },

            // public
            isChanged: function () {
                return true;
            },

            // public
            showLoading: function () {
                // set flag
                isloading = true;
                // field
                clearFields();
                // message
                messageObject.show('Loading......');
            },

            // public
            getFormTitle: function () {
                if (oFormField) {
                    return oFormField.getFormTitle();
                } else {
                    return '';
                }
            },

            // public
            setFormTitle: function (content) {
                if (oFormField) { oFormField.setFormTitle(content); }
            },

            // public
            focusFormTitle: function () {
                if (oFormField) { oFormField.fireEdit(); }
            },

            // public
            getHtml: function () {
                // enable inputs
                enableFields(true);

                // clone first
                var html = '', cache = $('<div style="display:none;"></div>').appendTo('body');
                var cloneHead = designerHead.clone().appendTo(cache);
                var cloneMain = designerMain.clone().appendTo(cache);
                var cloneFoot = designerFoot.clone().appendTo(cache);

                // remove useless node
                removeUselessNode([cloneHead, cloneMain, cloneFoot]);

                // get html
                html += cloneHead.html();
                html += cloneMain.html();
                html += cloneFoot.html();

                // ret temp node
                cloneHead.remove();
                cloneMain.remove();
                cloneFoot.remove();
                cache.remove();

                // remove attributes
                html = removeUselessAttr(html);

                // custom style text
                var cssText = oFormField.getCustomCssText();
                if (cssText)
                    html = cssText + html;

                // ret
                return html;
            },

            // public
            setHtml: function (html) {
                // set flag
                isloading = false;
                //
                if (!html) {
                    // default
                    this.defaultField();
                } else {
                    // clear
                    clearFields();
                    // analyser
                    var node = $('<div>' + html + '</div>');
                    $('style', node).each(function () {
                        $('head').append(this);
                    });
                    $('div[typeKey]', node).each(function () {
                        var key = $(this).attr('typeKey');
                        createField(types[key], { el: $(this) });
                    });
                    // remove
                    node.remove();
                }
                // message
                checkFieldEmptyMessage();
            }

        };
    };

    yardi.rootPath = _vpath + 'Scripts/survey/builder/';
    yardi.publiced = true;
    yardi.modeling = false;
    yardi.dialoging = false;

    var builderObject;
    var loadFormHtml = function (postData, callback) {
        $.ajax({
            url: _loadHtmlUrl,
            type: 'POST',
            data: postData,
            dataType: 'json',
            timeout: 30000,
            beforeSend: function (request) { },
            complete: function (request, state) { },
            error: function (response, state) { alert('error'); },
            success: function (data, state) { callback(data, state); }
        });
    };

    $(function () {

        // new object
        builderObject = yardi.builderClass();

        // init sidebar
        builderObject.initializeSidebar();

        if (yardi.publiced) {
            // bind resizer, this must catch some cross domain error.
            try { builderObject.bindResizer(); } catch (ex) { }
        }

        // show loading
        builderObject.showLoading();

        // bind sortable
        builderObject.bindSortFields();

        // onload
        var IsNew = $('input[name=IsNew]').val();
        var formId = $('input[name=formId]').val();
        if (formId) {
            var obj = { name: null, html: null, seted: false };
            var set = function (name, html) {
                builderObject.setHtml(decodeURIComponent(html));
                if (name) { builderObject.setFormTitle(decodeURIComponent(name)); }
                // report load event.
                window.parent && window.parent.iframeLoaded && window.parent.iframeLoaded(builderObject, window);
            };
            loadFormHtml({ id: formId, IsNew: IsNew }, function (data, state) {
                obj.name = data.name || '';
                obj.html = data.html || '';
                if (obj.seted) { set(obj.name, obj.html); }
            });
            setTimeout(function () {
                obj.seted = true;
                if (obj.name !== null && obj.html !== null) { set(obj.name, obj.html); }
            }, 800);
        }

        // report unload event.
        $(window).unload(function () {
            window.parent && window.parent.iframeUnload && window.parent.iframeUnload();
        });
    });

})(jQuery);
