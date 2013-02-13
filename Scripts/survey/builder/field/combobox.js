/*
*
* combobox field
* author: ronglin
* create date: 2010.08.27
*
*/

(function ($) {

    // text resource
    var options = {
        fieldTitle: 'ComboBox',
        choicesGroupName: 'Choices',
        emptyChoicesMsg: 'Can not delete all choices.',
        choicesTipCaption: 'Choices',
        choicesTipContent: 'Use the plus or minus icons to add or delete choices. Click on the star to make a choice the default selection.',
        optionText1: 'option1',
        optionText2: 'option2',
        optionText3: 'option3',
        btnAddTitle: 'Add',
        btnDeleteTitle: 'Delete',
        btnMakeDefaultTitle: 'Make Default',
        btnMoveTitle: 'Move'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.combobox_js); }

    /*
    * comboBox
    */
    var comboBox = function (config) {
        comboBox.superclass.constructor.call(this, config);
    };

    yardi.extend(comboBox, yardi.baseField, {

        indexKey: -1,

        getInputId: function () {
            return this.fieldName + '_' + this.indexKey;
        },

        serialize: function (base) {
            if (base != false) comboBox.superclass.serialize.call(this);
            this.el.attr('indexKey', this.indexKey);
        },

        deserialize: function () {
            comboBox.superclass.deserialize.call(this);
            this.indexKey = parseInt(this.el.attr('indexKey'), 10);
        },

        buildHtml: function () {
            var html = [];
            html.push('<div class="s-field s-combobox">');
            yardi.baseSnippets.fieldCommon(html, this, options.fieldTitle);
            html.push('<div class="wrap">');
            html.push('<select id="#{n}" name="#{n}">');
            this.indexKey++;
            html.push('<option id="' + this.getInputId() + '" #{sync}="' + this.indexKey + '">' + options.optionText1 + '</option>');
            this.indexKey++;
            html.push('<option id="' + this.getInputId() + '" #{sync}="' + this.indexKey + '">' + options.optionText2 + '</option>');
            this.indexKey++;
            html.push('<option id="' + this.getInputId() + '" #{sync}="' + this.indexKey + '">' + options.optionText3 + '</option>');
            html.push('</select>');
            html.push('</div>');
            yardi.baseSnippets.comment.f(html, this);
            html.push('</div>');
            return html.join('');
        },

        buildProHtml: function () {
            var html = [];
            html.push('<div class="s-field-pro s-combobox-pro">');
            yardi.baseSnippets.fieldtitle.p(html, this);
            html.push('<div class="baserow">');
            html.push('<fieldset class="choices">');
            html.push('<legend><span groupfor="items">' + options.choicesGroupName + '</span> #{choicesTip}</legend>');
            html.push('<ul group="items">');
            var self = this;
            $('option', this.el).each(function () {
                var name = $(this).attr(self.fAttr());
                var checkedImg = $(this).attr('selected') ? 'star.gif' : 'stardim.gif';
                html.push('<li>');
                html.push('<input #{sync}="' + name + '" type="text" maxlength="250" autocomplete="off" />');
                html.push('<img title="' + options.btnAddTitle + '" alt="Add" src="#{img}/add.gif" />');
                html.push('<img title="' + options.btnDeleteTitle + '" alt="Delete" src="#{img}/delete.gif" />');
                html.push('<img title="' + options.btnMakeDefaultTitle + '" alt="Make Default" src="#{img}/' + checkedImg + '" />');
                html.push('<img title="' + options.btnMoveTitle + '" style="cursor: move;" alt="Move" src="#{img}/move.gif" />');
                html.push('</li>');
            });
            html.push('</ul>');
            html.push('</fieldset>');
            html.push('</div>');
            yardi.baseSnippets.guideline.p(html, this);
            yardi.baseSnippets.comment.p(html, this);
            yardi.baseSnippets.required.p(html, this);
            html.push('</div>');
            return html.join('');
        },

        _copyItem: function (source) {
            this.indexKey++;
            this.serialize(false);
            // add property
            var propertyParent = source.parent();
            var propertyCloned = propertyParent.clone(false).empty().insertAfter(propertyParent)
            propertyParent.children().clone(true).appendTo(propertyCloned);
            propertyCloned.children('input').attr(this.pAttr(), this.indexKey).val('').focus();
            propertyCloned.children('img[alt=Make Default]').each(function () {
                $(this).attr('src', $(this).attr('src').replace('star.gif', 'stardim.gif'));
            });
            // add field
            var refName = source.siblings('input').attr(this.pAttr());
            var refField = this.fItems(refName);
            var fieldCloned = refField.clone(true).insertAfter(refField);
            fieldCloned.attr(this.fAttr(), this.indexKey).attr('selected', false).attr('id', this.getInputId());
        },

        _deleteItem: function (source) {
            if ($('img[alt=Delete]', this.proEl).length == 1) {
                alert(options.emptyChoicesMsg);
            } else {
                // remove field
                var refName = source.siblings('input').attr(this.pAttr());
                this.fItems(refName).remove();
                // remove property
                source.parent().remove();
            }
        },

        _selectItem: function (source) {
            // current src
            var oldsrc = source.attr('src');
            var checked = (oldsrc.indexOf('star.gif') > -1);
            // ...
            if (checked) { return; }
            // unselect all
            $('option', this.el).attr('selected', false).removeAttr('SELECTED');
            $('img[alt=Make Default]', this.proEl).attr('src', oldsrc.replace('star.gif', 'stardim.gif'));
            // set checked
            source.attr('src', oldsrc.replace('stardim.gif', 'star.gif'));
            var refName = source.siblings('input').attr(this.pAttr());
            this.fItems(refName).attr('selected', true).attr('SELECTED', 'selected');
        },

        initPro: function () {
            comboBox.superclass.initPro.call(this);
            var self = this, _dragging = false, _refName;
            // buttons
            $('img[alt=Add]', this.proEl).click(function () {
                if (!_dragging) { self._copyItem($(this)); }
            });
            $('img[alt=Delete]', this.proEl).click(function () {
                if (!_dragging) { self._deleteItem($(this)); }
            });
            $('img[alt=Make Default]', this.proEl).click(function () {
                if (!_dragging) { self._selectItem($(this)); }
            });
            // sortable
            $('ul', this.proEl).sortable({
                axis: 'y',
                revert: true,
                distance: 5,
                containment: this.proEl,
                forcePlaceholderSize: true,
                placeholder: 'holder',
                start: function (event, ui) {
                    _dragging = true;
                    _refName = ui.helper.children('input').attr(self.pAttr());
                    // fix revert position bug
                    ui.helper.css('left', ui.originalPosition.left);
                },
                stop: function (event, ui) {
                    var fTarget = self.fItems(_refName);
                    var pNext = ui.item.get(0).nextSibling;
                    if (pNext) {
                        var nextName = $(pNext).children('input').attr(self.pAttr());
                        var nextTarget = self.fItems(nextName);
                        fTarget.insertBefore(nextTarget);
                    } else {
                        fTarget.parent().append(fTarget);
                    }
                    _dragging = false;
                }
            });
        },

        getTips: function () {
            var tipsData = comboBox.superclass.getTips.call(this);
            return $.extend(tipsData, {
                choicesTip: {
                    title: options.choicesTipCaption,
                    message: options.choicesTipContent
                }
            });
        }

    });

    // register
    yardi.baseField.register('comboBox', comboBox);

})(jQuery);
