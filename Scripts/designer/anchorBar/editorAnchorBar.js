/*
*
* editor anchor bar
* author: ronglin
* create date: 2010.06.11
*
*/


/*
* config parameters:
* alignTo, renderTo, editor
*/

(function ($) {

    // text resource
    var options = {
        textStyle: 'TextStyle:',
        fontFamilyTitle: 'font family',
        fontSizeTitle: 'font size',
        fontColorTitle: 'font color',
        backColorTitle: 'back color',
        mergeFieldsTitle: 'merge fields',
        mergeFieldsDefaultValue: 'Merge fields'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.editorAnchorBar_js); }

    /*
    * editor anchor bar
    */
    var editorAnchorBar = function (config) {
        editorAnchorBar.superclass.constructor.call(this, config);
    };

    yardi.extend(editorAnchorBar, yardi.anchorBar, {

        editor: null,

        //components: {},
        components: null,

        buildHtml: function () {
            var html = [];
            html.push('<div class="kb-editoranchorbar">');
            html.push('<div class="kb-rowhr" tbs="0"></div>');
            html.push('<div class="kb-row" scl="1"><span style="display:inline-block;width:59px;">' + options.textStyle + '</span></div>');
            html.push('<div class="kb-rowhr" fmy="1"></div>');
            html.push('<div class="kb-row" tbs="1"></div>');
            html.push('<div class="kb-row" tbs="2"></div>');
            html.push('<div class="kb-row" tbs="3"></div>');
            html.push('</div>');
            return html.join('');
        },

        initialize: function () {
            editorAnchorBar.superclass.initialize.call(this);

            // create toolbar buttons
            var self = this;
            this.components = {};
            var btnFactory = function (tbs, renderTo, fixFn) {
                for (var i = 0; i < tbs.length; i++) {
                    this.components[tbs[i].key] = new tbs[i].type({
                        renderTo: renderTo,
                        editor: this.editor
                    });
                }
            };

            // tbs1
            var tbs0Class = [
            {
                key: 'btnUnformat',
                type: yardi.unformatButton
            }, {
                key: 'btnUndo',
                type: yardi.undoButton
            }, {
                key: 'btnRedo',
                type: yardi.redoButton
            }];
            btnFactory.call(this, tbs0Class, $('div[tbs=0]', this.el));
            this.components.btnUnformat.el.css({ verticalAlign: 'bottom', marginRight: '5px' });
            this.components.btnUndo.el.css({ verticalAlign: 'bottom', marginRight: '5px' });
            this.components.btnRedo.el.css('verticalAlign', 'bottom');

            // font family
            this.components.btnFontFamily = new yardi.fontFamilyCombo({
                width: 163,
                disabled: true,
                title: options.fontFamilyTitle,
                renderTo: $('div[fmy=1]', this.el),
                onSelect: function (item) { self.editor.fontName(item.text); }
            });

            // font size
            this.components.btnFontSize = new yardi.fontSizeCombo({
                width: 50,
                disabled: true,
                title: options.fontSizeTitle,
                renderTo: $('div[scl=1]', this.el),
                onSelect: function (item) { self.editor.fontSize(item.value); }
            });
            this.components.btnFontSize.el.css({ marginRight: '5px' });

            // font color
            //$('div[scl=1]', this.el).append('&nbsp;&nbsp;');
            this.components.btnFontColor = new yardi.colorPickerButton({
                disabled: true,
                title: options.fontColorTitle,
                iconType: 'fontcolor',
                renderTo: $('div[scl=1]', this.el),
                onPreview: function (value) { self.editor.foreColor(value, false); },
                onCancel: function (value) { self.editor.foreColor(value, false); },
                onSelect: function (value) { self.editor.foreColor(value); }
            });
            this.components.btnFontColor.el.css({ marginRight: '5px' });

            // back color
            //$('div[scl=1]', this.el).append('&nbsp;&nbsp;');
            this.components.btnBackColor = new yardi.colorPickerButton({
                disabled: true,
                title: options.backColorTitle,
                iconType: 'backcolor',
                renderTo: $('div[scl=1]', this.el),
                onPreview: function (value) { self.editor.backColor(value, false); },
                onCancel: function (value) { self.editor.backColor(value, false); },
                onSelect: function (value) { self.editor.backColor(value); }
            });

            // regisger updateToolbar method
            this.editor.updateToolbar.add(function (editor, hasSel) {
                // enable status
                var enable = editor.sourceView ? false : true;
                // fore color
                self.components.btnFontColor.isEnable(enable);
                var foreColor = editor.foreColor();
                if (foreColor) {
                    self.components.btnFontColor.setColor(foreColor);
                }
                // back color
                self.components.btnBackColor.isEnable(enable);
                var backColor = editor.backColor();
                if (backColor) {
                    self.components.btnBackColor.setColor(backColor);
                }
                // font size
                self.components.btnFontSize.isEnable(enable);
                var size = editor.fontSize();
                if (size) {
                    self.components.btnFontSize.val(size);
                }
                // font name
                self.components.btnFontFamily.isEnable(enable);
                var name = editor.fontName();
                if (name) {
                    name = name.replace(/(^\s*)|(\s*$)/g, '');
                    name = name.replace(/(^('|")*)|(('|")*$)/g, '');
                    self.components.btnFontFamily.val(name);
                }
                // merge field
                self.components.mergeFields.isEnable(enable);
            });

            // register editorevents
            this.editor.editorEvents.add(function () {
                if (yardi.pickerPanel.current) {
                    yardi.pickerPanel.current.hide();
                }
            });

            // tbs1
            var tbs1Class = [
            {
                key: 'btnBold',
                type: yardi.boldButton
            }, {
                key: 'btnItalicBold',
                type: yardi.italicButton
            }, {
                key: 'btnUnderline',
                type: yardi.underlineButton
            }, {
                key: 'btnAlignleft',
                type: yardi.alignleftButton
            }, {
                key: 'btnBold',
                type: yardi.aligncenterButton
            }, {
                key: 'btnAlignright',
                type: yardi.alignrightButton
            }, {
                key: 'btnAlignjustify',
                type: yardi.alignjustifyButton
            }];
            btnFactory.call(this, tbs1Class, $('div[tbs=1]', this.el));

            // tbs2
            var tbs2Class = [
            {
                key: 'btnNumberlist',
                type: yardi.numberlistButton
            }, {
                key: 'btnBulletlist',
                type: yardi.bulletlistButton
            }, {
                key: 'btnIndent',
                type: yardi.indentButton
            }, {
                key: 'btnOutdent',
                type: yardi.outdentButton
            }, {
                key: 'btnHorizontalRuler',
                type: yardi.horizontalRulerButton
            }, {
                key: 'btnInsertImage',
                type: yardi.insertimageButton
            }, {
                key: 'btnInsertlink',
                type: yardi.insertlinkButton
            }];
            //, {
            //    key: 'btnEditsource',
            //    type: yardi.editsourceButton
            //}];
            btnFactory.call(this, tbs2Class, $('div[tbs=2]', this.el));

            // tbs3
            this.components.mergeFields = new yardi.comboInput({
                renderTo: $('div[tbs=3]', this.el),
                title: options.mergeFieldsTitle,
                width: 163,
                disabled: true,
                onClick: function (el) {
                    var picker = self.components.mergeFieldsPicker;
                    if (!picker) {
                        self.components.mergeFieldsPicker = picker = new yardi.listPicker({
                            width: 200,
                            dataList: _mergeFields,
                            onSelect: function (item, ev) { self.editor.replaceSelect('mergefield', item.key); }
                        });
                    }
                    picker.show(el);
                }
            });
            this.components.mergeFields.val(options.mergeFieldsDefaultValue);
        },

        remove: function () {
            $.each(this.components, function (k, o) {
                o && o.remove();
            });
            editorAnchorBar.superclass.remove.call(this);
        },

        isEnable: function (enable) {
            for (var key in this.components) {
                this.components[key].isEnable(enable);
            }
        },

        lock: function (isLock) {
            this.fixed = (isLock === true);
        },

        getAlignCss: function (ev) {
            var pos = this.alignTo.offset();
            return {
                left: pos.left - this.el.outerWidth() - 1,
                top: pos.top - 22    // 22 is  the height of menuAnchorBar
            };
        }
    });

    // register
    yardi.editorAnchorBar = editorAnchorBar;

})(jQuery);
