/*
*
* form info field
* author: ronglin
* create date: 2010.06.29
*
*/

(function ($) {

    // text resource
    var options = {
        fieldTitle: 'Untitled Form',
        fieldDescription: 'This is your form description. Click here to edit.',
        titleGroupName: 'Title',
        descriptionGroupName: 'Description',
        fontsAndColorsGroupName: 'Fonts & Colors',
        fieldSeparatorGropuName: 'Field Separator',
        resetTitle: 'Reset to default style',
        formBodyBackgroundColor: 'Form body background color',
        formTitleText: 'Form title text',
        formDescriptionText: 'Form description text',
        fieldTitleText: 'Field title text',
        inputOrOptionsText: 'Input or options text',
        numberingFields: 'Numbering Fields.',
        resetBtnTitle: 'reset style',
        resetConfirmMsg: 'Are you sure you want to reset the style!',
        separatorNormal: 'Normal',
        separatorThin: 'Thin',
        separatorNone: 'None',
        titleTipCaption: 'Title',
        titleTipContent: 'The name of your form.',
        descTipCaption: 'Description',
        descTipContent: 'Additional information about your form.',
        fieldSepTipCaption: 'Field Separator',
        fieldSepTipContent: 'Set how much each field is separated from the others',
        fontAndColorsTipCaption: 'Fonts & Colors',
        fontAndColorsTipContent: 'Customize your form',
        numberingTipCaption: 'Numbering',
        numberingTipContent: 'Chronologically number each field'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.formInfo_js); }

    /*
    * formInfo
    */
    var formInfo = function (config) {
        formInfo.superclass.constructor.call(this, config);
    };

    yardi.extend(formInfo, yardi.baseField, {

        numbering: true,

        separator: 0,

        serialize: function () {
            formInfo.superclass.serialize.call(this);
            this.el.attr('numbering', this.numbering);
            this.el.attr('separator', this.separator);
        },

        deserialize: function () {
            formInfo.superclass.deserialize.call(this);
            this.numbering = (this.el.attr('numbering') === 'true');
            this.separator = parseInt(this.el.attr('separator') || this.separator, 10);
        },

        disable: function (disabled) {
            formInfo.superclass.disable.call(this, disabled);
            this.el[disabled === true ? 'addClass' : 'removeClass']('s-field-nomove');
        },

        // public
        getFormTitle: function () {
            return $('h2', this.el).html();
        },

        // public
        setFormTitle: function (content) {
            $('h2', this.el).html(content);
            this.updatePropertyValue();
        },

        // public
        customSheet: null,
        customCssId: 'customcss',
        getCustomCssText: function () {
            var cssText = '<style type="text/css" id="' + this.customCssId + '">\n';
            cssText += this.customSheet.getRuleTextAll();
            return cssText + '</style>';
        },

        buildHtml: function () {
            var html = [];
            html.push('<div class="s-field s-forminfo">');
            html.push('<h2 #{sync}="formtitle" class="formtitle">' + options.fieldTitle + '</h2>');
            html.push('<p #{sync}="description" class="description">' + options.fieldDescription + '</p>');
            html.push('</div>');
            return html.join('');
        },

        buildProHtml: function () {
            var html = [];
            html.push('<div class="s-field-pro s-forminfo-pro">');
            html.push('<div class="baserow">');
            html.push('<label class="baselabel">' + options.titleGroupName + ' #{titleTip}</label>');
            html.push('<input #{sync}="formtitle" class="formtitle" type="text" maxlength="250" />');
            html.push('</div>');
            html.push('<div class="baserow">');
            html.push('<label class="baselabel">' + options.descriptionGroupName + ' #{descTip}</label>');
            html.push('<textarea #{sync}="description" class="description"></textarea>');
            html.push('</div>');
            html.push('<div class="baserow">');
            html.push('<fieldset class="fontandcolor">');
            html.push('<legend class="baselegend"><span groupfor="fontscolors">' + options.fontsAndColorsGroupName + '</span> #{fontAndColorsTip}</legend>');
            html.push('<table cellpadding="0" cellspacing="0" border="0" group="fontscolors">');
            html.push('<tr>');
            html.push('<td class="borderbottom" colspan="2">' + options.resetTitle + '</td>');
            html.push('<td class="borderbottom" _resetstyle="1"></td>');
            html.push('</tr><tr>');
            html.push('<td class="borderbottom" colspan="2">' + options.formBodyBackgroundColor + '</td>');
            html.push('<td class="borderbottom" _bgcolor="1"></td>');
            html.push('</tr><tr>');
            html.push('<td colspan="3">' + options.formTitleText + '</td>');
            html.push('</tr><tr>');
            html.push('<td class="borderbottom" _formtitlefamily="1"></td>');
            html.push('<td class="borderbottom" _formtitlefontsize="1"></td>');
            html.push('<td class="borderbottom" _formtitlefontcolor="1"></td>');
            html.push('</tr><tr>');
            html.push('<td colspan="3">' + options.formDescriptionText + '</td>');
            html.push('</tr><tr>');
            html.push('<td class="borderbottom" _formdescriptionfamily="1"></td>');
            html.push('<td class="borderbottom" _formdescriptionfontsize="1"></td>');
            html.push('<td class="borderbottom" _formdescriptionfontcolor="1"></td>');
            html.push('</tr><tr>');
            html.push('<td colspan="3">' + options.fieldTitleText + '</td>');
            html.push('</tr><tr>');
            html.push('<td class="borderbottom" _fieldtitlefamily="1"></td>');
            html.push('<td class="borderbottom" _fieldtitlefontsize="1"></td>');
            html.push('<td class="borderbottom" _fieldtitlefontcolor="1"></td>');
            html.push('</tr><tr>');
            html.push('<td colspan="3">' + options.inputOrOptionsText + '</td>');
            html.push('</tr><tr>');
            html.push('<td class="borderbottom" _inputtitlefamily="1"></td>');
            html.push('<td class="borderbottom" _inputtitlefontsize="1"></td>');
            html.push('<td class="borderbottom" _inputtitlefontcolor="1"></td>');
            html.push('</tr>');
            html.push('</table></fieldset>');
            html.push('</div>');
            html.push('<div class="baserow">');
            html.push('<fieldset class="fieldseparator">');
            html.push('<legend>' + options.fieldSeparatorGropuName + ' #{fieldSepTip}</legend>');
            html.push('<div class="separator-content">');
            html.push('<input #{sync}="separator" type="radio" name="separator" id="separator_normal" value="6" checked="checked" /><label for="separator_normal">' + options.separatorNormal + '</label>');
            html.push('<input #{sync}="separator" type="radio" name="separator" id="separator_thin" value="2" /><label for="separator_thin">' + options.separatorThin + '</label>');
            html.push('<input #{sync}="separator" type="radio" name="separator" id="separator_none" value="0" /><label for="separator_none">' + options.separatorNone + '</label>');
            html.push('</div>');
            html.push('</fieldset>');
            html.push('</div>');
            html.push('<div class="baserow">');
            html.push('<input #{sync}="numbering" id="#{uuid}_numbering" type="checkbox" class="basecheck" checked="checked" /><label for="#{uuid}_numbering" class="basechecklabel"> ' + options.numberingFields + '</label>#{numberingTip}');
            html.push('</div>');
            html.push('</div>');
            return html.join('');
        },

        initPro: function () {
            // call base
            formInfo.superclass.initPro.call(this);
            var self = this;

            // custom style
            var rulesMgr = new yardi.pageRulesManager(document);
            var sheetsMgr = new yardi.sheetsHelper(document, rulesMgr);
            this.customSheet = yardi.styleSheetClass.resolveNode(document.getElementById(this.customCssId) || sheetsMgr.createStyleSheet('', this.customCssId));
            var setCustomCss = function (selector, name, value) {
                if (self.customSheet.indexOf(selector) == -1) {
                    self.customSheet.addRule(selector, name + ':' + value + ';');
                } else {
                    self.customSheet.setRuleStyle(selector, name, value);
                }
            };
            var getCustomCss = function (selector, name) {
                var r = rulesMgr.getRule(selector);
                if (r) {
                    name = self.customSheet.cameName(name);
                    return r.style[name];
                }
            };

            // separator 
            this.pItems('separator').each(function () {
                $(this).attr('checked', ($(this).val() == self.separator));
            }).change(function () {
                self.separator = parseInt($(this).val(), 10);
                self.el.attr('separator', self.separator);
            });

            // numbering
            this.pItems('numbering').attr('checked', this.numbering).change(function () {
                self.numbering = $(this).attr('checked');
                self.el.attr('numbering', self.numbering);
            });

            // reset style
            var resetBtn = new yardi.imageButton({
                title: options.resetBtnTitle,
                renderTo: $('td[_resetstyle=1]', this.proEl),
                imageUrl: 'field/images/reset.jpg',
                onClick: function (ev) {
                    if (confirm(options.resetConfirmMsg)) {
                        self.customSheet.clearRules();
                        window.setTimeout(updateControls, 300);
                    }
                }
            });

            // body background
            var bgColorPicker = new yardi.colorPickerButton({
                renderTo: $('td[_bgcolor=1]', this.proEl),
                onSelect: function (value) {
                    setCustomCss('.cusbody', 'background-color', value);
                    //setCustomCss('.s-field', 'background-color', value);
                },
                syncValue: function () {
                    var bgcolor = getCustomCss('.cusbody', 'background-color');
                    if (!bgcolor) bgcolor = yardi.currentStyle(self.el.get(0), 'background-color');
                    this.setColor(bgcolor);
                }
            });

            // form title text
            var formTitleFamily = new yardi.fontFamilyCombo({
                width: 160,
                renderTo: $('td[_formtitlefamily=1]', this.proEl),
                onSelect: function (item) {
                    setCustomCss('.s-forminfo .formtitle', 'font-family', item.text);
                },
                syncValue: function () {
                    var family = getCustomCss('.s-forminfo .formtitle', 'font-family');
                    if (!family) family = yardi.currentStyle(self.el.children().get(0), 'font-family');
                    this.val(family);
                }
            });
            var formTitleFontSize = new yardi.fontSizeCombo({
                width: 46,
                renderTo: $('td[_formtitlefontsize=1]', this.proEl),
                onSelect: function (item) {
                    var parser = new yardi.sizeUnitParser(item.text);
                    setCustomCss('.s-forminfo .formtitle', 'font-size', parser.toPx());
                },
                syncValue: function () {
                    var size = getCustomCss('.s-forminfo .formtitle', 'font-size');
                    if (!size) size = yardi.currentStyle(self.el.children().get(0), 'font-size');
                    this.val(size);
                }
            });
            var formTitleColorPicker = new yardi.colorPickerButton({
                iconType: 'fontcolor',
                renderTo: $('td[_formtitlefontcolor=1]', this.proEl),
                onSelect: function (value) {
                    setCustomCss('.s-forminfo .formtitle', 'color', value);
                },
                syncValue: function () {
                    var color = getCustomCss('.s-forminfo .formtitle', 'color');
                    if (!color) color = yardi.currentStyle(self.el.children().get(0), 'color');
                    this.setColor(color);
                }
            });

            // form description text
            var formDescriptionFamily = new yardi.fontFamilyCombo({
                width: 160,
                renderTo: $('td[_formdescriptionfamily=1]', this.proEl),
                onSelect: function (item) {
                    setCustomCss('.s-forminfo .description', 'font-family', item.text);
                },
                syncValue: function () {
                    var family = getCustomCss('.s-forminfo .description', 'font-family');
                    if (!family) family = yardi.currentStyle(self.el.children().get(1), 'font-family');
                    this.val(family);
                }
            });
            var formDescriptionFontSize = new yardi.fontSizeCombo({
                width: 46,
                renderTo: $('td[_formdescriptionfontsize=1]', this.proEl),
                onSelect: function (item) {
                    var parser = new yardi.sizeUnitParser(item.text);
                    setCustomCss('.s-forminfo .description', 'font-size', parser.toPx());
                },
                syncValue: function () {
                    var size = getCustomCss('.s-forminfo .description', 'font-size');
                    if (!size) size = yardi.currentStyle(self.el.children().get(1), 'font-size');
                    this.val(size);
                }
            });
            var formDescriptionColorPicker = new yardi.colorPickerButton({
                iconType: 'fontcolor',
                renderTo: $('td[_formdescriptionfontcolor=1]', this.proEl),
                onSelect: function (value) {
                    setCustomCss('.s-forminfo .description', 'color', value);
                },
                syncValue: function () {
                    var color = getCustomCss('.s-forminfo .description', 'color');
                    if (!color) color = yardi.currentStyle(self.el.children().get(1), 'color');
                    this.setColor(color);
                }
            });

            // field title text
            var fieldTitleFamily = new yardi.fontFamilyCombo({
                width: 160,
                renderTo: $('td[_fieldtitlefamily=1]', this.proEl),
                onSelect: function (item) {
                    setCustomCss('.s-field .custitle', 'font-family', item.text);
                },
                syncValue: function () {
                    var family = getCustomCss('.s-field .custitle', 'font-family');
                    if (!family) family = getCustomCss('.s-field .fieldtitle', 'font-family');
                    this.val(family);
                }
            });
            var fieldTitleFontSize = new yardi.fontSizeCombo({
                width: 46,
                renderTo: $('td[_fieldtitlefontsize=1]', this.proEl),
                onSelect: function (item) {
                    var value = new yardi.sizeUnitParser(item.text).toPx();
                    setCustomCss('.s-field .custitle', 'font-size', value);
                },
                syncValue: function () {
                    var size = getCustomCss('.s-field .custitle', 'font-size');
                    if (!size) size = getCustomCss('.s-field .fieldtitle', 'font-size');
                    this.val(size);
                }
            });
            var fieldTitleColorPicker = new yardi.colorPickerButton({
                iconType: 'fontcolor',
                renderTo: $('td[_fieldtitlefontcolor=1]', this.proEl),
                onSelect: function (value) {
                    setCustomCss('.s-field .custitle', 'color', value);
                },
                syncValue: function () {
                    var color = getCustomCss('.s-field .custitle', 'color');
                    if (!color) color = getCustomCss('.s-field .fieldtitle', 'color');
                    this.setColor(color);
                }
            });

            // input or options text
            var inputTitleFamily = new yardi.fontFamilyCombo({
                width: 160,
                renderTo: $('td[_inputtitlefamily=1]', this.proEl),
                onSelect: function (item) {
                    setCustomCss('.s-field .custext', 'font-family', item.text);
                },
                syncValue: function () {
                    var family = getCustomCss('.s-field .custext', 'font-family');
                    if (!family) family = getCustomCss('.s-field', 'font-family');
                    this.val(family);
                }
            });
            var inputTitleFontSize = new yardi.fontSizeCombo({
                width: 46,
                renderTo: $('td[_inputtitlefontsize=1]', this.proEl),
                onSelect: function (item) {
                    var parser = new yardi.sizeUnitParser(item.text);
                    setCustomCss('.s-field .custext', 'font-size', parser.toPx());
                },
                syncValue: function () {
                    var size = getCustomCss('.s-field .custext', 'font-size');
                    if (!size) size = getCustomCss('.s-field', 'font-size');
                    this.val(size);
                }
            });
            var inputTitleColorPicker = new yardi.colorPickerButton({
                iconType: 'fontcolor',
                renderTo: $('td[_inputtitlefontcolor=1]', this.proEl),
                onSelect: function (value) {
                    setCustomCss('.s-field .custext', 'color', value);
                },
                syncValue: function () {
                    var color = getCustomCss('.s-field .custext', 'color');
                    if (!color) color = getCustomCss('.s-field', 'color');
                    this.setColor(color);
                }
            });

            var updateControls = function () {
                rulesMgr.refreshCache();
                $.each([bgColorPicker, formTitleFamily, formTitleFontSize, formTitleColorPicker,
                                       formDescriptionFamily, formDescriptionFontSize, formDescriptionColorPicker,
                                       fieldTitleFamily, fieldTitleFontSize, fieldTitleColorPicker,
                                       inputTitleFamily, inputTitleFontSize, inputTitleColorPicker],
                function (index, item) {
                    if (item.syncValue) item.syncValue.call(item);
                });
            };

            window.setTimeout(updateControls, 300);
        },

        getTips: function () {
            var tipsData = formInfo.superclass.getTips.call(this);
            return $.extend(tipsData, {
                titleTip: {
                    title: options.titleTipCaption,
                    message: options.titleTipContent
                },
                descTip: {
                    title: options.descTipCaption,
                    message: options.descTipContent
                },
                fieldSepTip: {
                    title: options.fieldSepTipCaption,
                    message: options.fieldSepTipContent
                },
                fontAndColorsTip: {
                    title: options.fontAndColorsTipCaption,
                    message: options.fontAndColorsTipContent
                },
                numberingTip: {
                    title: options.numberingTipCaption,
                    message: options.numberingTipContent
                }
            });
        }

    });

    // register
    yardi.baseField.register('formInfo', formInfo);

})(jQuery);
