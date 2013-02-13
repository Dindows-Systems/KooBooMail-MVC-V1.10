/*
*
* menu anchor bar
* author: ronglin
* create date: 2010.06.11
*
*/


/*
* config parameters:
* nameTitle, alignTo, renderTo, onEdit, onCopy, onDelete, onSave, onCancel
*/

(function ($) {

    // text resource
    var options = {
        btnEditTitle: 'edit html',
        btnEditVarTitle: 'edit variable',
        btnCopyTitle: 'copy',
        btnDeleteTitle: 'delete',
        btnSaveTitle: 'save',
        btnSourceViewTitle: 'source view',
        btnCancelTitle: 'cancel'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.menuAnchorBar_js); }

    /*
    * menu anchor bar
    */
    var menuAnchorBar = function (config) {
        menuAnchorBar.superclass.constructor.call(this, config);
    };

    yardi.extend(menuAnchorBar, yardi.anchorBar, {

        isEditing: false,

        canDrag: true,

        dragging: false, // this value was setted in index.js when dragging.

        nameTitle: null,

        components: null,

        alignToBorderWidth: 1,

        buildHtml: function () {
            var html = [];
            html.push('<div class="kb-menuanchorbar" onselectstart="return false;">');
            html.push('<div class="kb-con"></div>');
            html.push('<span class="kb-name"></span>');
            html.push('</div>');
            return html.join('');
        },

        initialize: function () {
            menuAnchorBar.superclass.initialize.call(this);
            if (w = parseFloat(this.alignTo.css('border-width').replace('px', ''))) {
                this.alignToBorderWidth = w;
            }
            // btn events
            var self = this, split = '<div class="kb-sep">&nbsp;</div>';
            var handler = function (type, ev) {
                if (fn = self[type]) { return fn.call(self, ev); }
            };
            var btnCon = $('.kb-con', this.el);
            btnCon.append(split);
            this.components = {};
            // edit
            this.components.btnEdit = new yardi.imageButton({
                title: options.btnEditTitle,
                renderTo: btnCon,
                imageUrl: 'anchorBar/images/menu_edit.gif',
                onClick: function (ev) {
                    (handler.call(this, 'onEdit', ev) !== false) && self.edit(true);
                }
            });
            btnCon.append(split);
            // edit text
            this.components.btnEditText = new yardi.imageButton({
                title: options.btnEditVarTitle,
                renderTo: btnCon,
                imageUrl: 'anchorBar/images/menu_eidttext.gif',
                onClick: function (ev) {
                    (handler.call(this, 'onEditText', ev) !== false) && self.edit(true);
                }
            });
            btnCon.append(split);
            // edit css
            //this.components.btnEditCss = new yardi.imageButton({
            //    title: 'edit css',
            //    renderTo: btnCon,
            //    imageUrl: 'anchorBar/images/menu_editcss.gif',
            //    onClick: function (ev) {
            //        (handler.call(this, 'onEditCss', ev) !== false) && self.edit(true);
            //    }
            //});
            //btnCon.append(split);
            // copy
            this.components.btnCopy = new yardi.imageButton({
                title: options.btnCopyTitle,
                renderTo: btnCon,
                imageUrl: 'anchorBar/images/menu_copy.gif',
                onClick: function (ev) {
                    handler.call(this, 'onCopy', ev);
                }
            });
            btnCon.append(split);
            // delete
            this.components.btnDelete = new yardi.imageButton({
                title: options.btnDeleteTitle,
                renderTo: btnCon,
                imageUrl: 'anchorBar/images/menu_delete.gif',
                onClick: function (ev) {
                    handler.call(this, 'onDelete', ev);
                }
            });
            btnCon.append(split);
            // save
            this.components.btnSave = new yardi.imageButton({
                title: options.btnSaveTitle,
                renderTo: btnCon,
                imageUrl: 'anchorBar/images/menu_save.gif',
                onClick: function (ev) {
                    if (handler.call(this, 'onSave', ev) !== false) {
                        yardi.anchorBar.sleep(800);
                        self.fix(false);
                        self.hide();
                    }
                }
            });
            btnCon.append(split);
            // source
            this.components.btnViewSource = new yardi.imageButton({
                title: options.btnSourceViewTitle,
                renderTo: btnCon,
                imageUrl: 'anchorBar/images/menu_source.gif',
                onClick: function (ev) {
                    handler.call(this, 'onViewSource', ev);
                }
            });
            btnCon.append(split);
            // cancel
            this.components.btnCancel = new yardi.imageButton({
                title: options.btnCancelTitle,
                renderTo: btnCon,
                imageUrl: 'anchorBar/images/menu_cancel.gif',
                onClick: function (ev) {
                    if (handler.call(this, 'onCancel', ev) !== false) {
                        yardi.anchorBar.sleep(800);
                        self.fix(false);
                        self.hide();
                    }
                }
            });
            btnCon.append(split);
            // fix
            for (var key in this.components) {
                this.components[key].el.removeClass('kb-imagebutton').addClass('kb-btn');
                this.components[key].highlightCss = 'kb-hover';
            }
            // others
            this.edit(false);
            // set name
            var title = this.nameTitle || this.alignTo.attr('title') || this.alignTo.attr('id');
            $('.kb-name', this.el).html(title);
            this.el.attr('title', title);
            // can drag
            this.el.mousedown(function (ev) {
                self.canDrag = !yardi.isAncestor(btnCon[0], ev.target);
            });
        },

        disableBtns: function (disabled) {
            disabled = (disabled === true);
            for (var key in this.components) {
                this.components[key].isEnable(!disabled);
            }
        },

        edit: function (isEdit) {
            this.isEditing = isEdit;
            var g1 = [this.components.btnEdit, this.components.btnEditText, /* this.components.btnEditCss, */this.components.btnCopy, this.components.btnDelete];
            var g2 = [this.components.btnSave, this.components.btnViewSource, this.components.btnCancel];
            var fn = function (btns, key) {
                for (var i = 0; i < btns.length; i++) {
                    btns[i].el[key]();
                    btns[i].el.next()[key]();
                }
            };
            fn(isEdit == true ? g1 : g2, 'hide');
            fn(isEdit == true ? g2 : g1, 'show');
            this.el.css({
                cursor: (isEdit == true) ? 'default' : 'move'//,
                //border: (isEdit == true) ? '#4282c3 1px solid' : ''
            });
            // do fix
            this.fix(isEdit);
        },

        lock: function (isLock) {
            this.fixed = (isLock === true);
        },

        fix: function (fixed) {
            menuAnchorBar.superclass.fix.call(this, fixed);
            if (this.fixed) {
                var pos = this.alignTo.offset();
                this.el.animate({
                    top: pos.top - this.el.outerHeight(),
                    left: pos.left,
                    width: this.alignTo.outerWidth() - 2
                }, 100);
            }
        },

        loading: function (isLoading) {
            //TODO: show an loading icon to the right ride in el
        },

        getCheckElements: function () {
            return [this.alignTo];
        },

        correctPosition: function () {
            if (this.dragging == true) { return; }
            if (this.fixed) {
                this.fix(true);
            } else {
                this.el.css(this.getAlignCss());
            }
        },

        getAlignCss: function (ev) {
            var pos = this.alignTo.offset();
            var offset = this.alignToBorderWidth;
            return {
                left: pos.left + offset,
                top: pos.top + offset,
                width: this.alignTo.innerWidth() - 2
            };
        },

        onHided: function () {
            this.edit(false);
        },

        beforeShow: function () {
            this.alignTo.addClass('kb-anchorbar-highlight');
        },

        beforeHide: function () {
            this.alignTo.removeClass('kb-anchorbar-highlight');
        }
    });

    // register
    yardi.menuAnchorBar = menuAnchorBar;

})(jQuery);
