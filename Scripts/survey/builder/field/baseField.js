/*
*
* base field
* author: ronglin
* create date: 2010.06.29
*
*/


/*
* config parameters:
* proRenderTo, [renderTo || el], onClick, onUpdateValue
*/

(function ($) {

    var baseField = function (config) {
        $.extend(this, config);
        this.init();
    };

    baseField.componentTypes = {};

    baseField.register = function (key, type) {
        var ts = baseField.componentTypes;
        if (ts[key]) {
            alert('typeKey: ' + key + ' is existing, can not register it.');
        } else {
            ts[key] = type;
        }
    };

    baseField.prototype = {

        el: null, proEl: null, anchorBar: null, maskEl: null, parentIframe: null,

        renderTo: null, renderAfter: null,

        proRenderTo: null,

        inited: false,

        // serialize parameters
        uuid: null, typeKey: null, fieldName: '',

        // public config
        onClick: function (sender, isedit) { },
        onUpdateValue: function (sender, name) { },
        onCopy: function () { },
        onRemove: function () { },

        buildHtml: function () {
            alert('buildHtml must be overrided by sub class.');
        },

        buildProHtml: function () {
            alert('buildProHtml must be overrided by sub class.');
        },

        // protected
        serialize: function () {
            this.el.attr('uuid', this.uuid);
            this.el.attr('typeKey', this.typeKey);
            this.el.attr('fieldName', this.fieldName);
        },

        // protected
        deserialize: function () {
            this.uuid = this.el.attr('uuid');
            this.typeKey = this.el.attr('typeKey');
            this.fieldName = this.el.attr('fieldName');
        },

        newUUID: function () {
            return Math.random().toString().substr(3);
        },

        getTypeKey: function () {
            for (var key in baseField.componentTypes) {
                if (this instanceof baseField.componentTypes[key]) {
                    return key;
                }
            }
        },

        generateFieldName: function () {
            return this.generateKey(this.getTypeKey(), function (newKey) {
                return $('div[fieldName=' + newKey + ']');
            });
        },

        getAnchorBar: function () {
            if (!this.anchorBar) {
                var self = this, refElem;
                // get reference element
                var fieldTop = $('.fieldtop', this.el);
                if (fieldTop.length > 0) {
                    refElem = fieldTop.next();
                } else {
                    refElem = this.el.children().first();
                }
                // create toolbar
                this.anchorBar = new yardi.anchorToolbar({
                    isform: (this.typeKey == 'formInfo' || this.typeKey == 'thanks' || this.typeKey == 'greeting'),
                    renderBefore: refElem,
                    onCopy: function () {
                        self.onCopy(self);
                    },
                    onRemove: function () {
                        self.onRemove(self);
                    }
                });
            }
            return this.anchorBar;
        },

        isEditing: function () {
            return this.el.hasClass('s-field-editing');
        },

        fireEdit: function () {
            this.el.mousedown();
        },

        init: function () {
            // build filed
            if (!this.el) {
                this.uuid = this.newUUID();
                this.typeKey = this.getTypeKey();
                this.fieldName = this.generateFieldName();
                // compile data
                var data = {
                    uuid: this.uuid,
                    sync: this.fAttr(),
                    n: this.fieldName
                };
                // build html
                var html = this.buildHtml();
                html = new yardi.template(html).compile(data);
                this.el = $(html).addClass('s-field');
                //this.el = $('.s-field', $(html));
                // cache value for restore used
                this.serialize();
            } else {
                // restore
                this.deserialize();
            }

            // render element
            this.el.hide();
            if (this.renderAfter) {
                this.el.insertAfter(this.renderAfter);
            } else if (this.renderTo) {
                this.el.appendTo(this.renderTo);
            }
            this.el.slideDown('fast', function () {
                self.el.removeAttr('style');
                self.onInitialized();
            });

            // bind field events
            var self = this;
            this.el.hover(function () {
                var editing = self.isEditing();
                if (!editing) self.el.addClass('s-field-hover');
                self.getAnchorBar().action('over', editing);
            }, function () {
                var editing = self.isEditing();
                if (!editing) self.el.removeClass('s-field-hover');
                self.getAnchorBar().action('out', editing);
            }).mousedown(function (ev) {
                var editing = self.isEditing();
                self.onClick(self, editing);
                if (!editing) {
                    self.showProperty();
                    self.disable(true);
                }
                self.getAnchorBar().action('click', true);
                // set focus
                self.setPropertyFocus();
                // prevent
                ev.preventDefault();
            });

            // set element entrance
            //this.el.attr('instance', this);

            this.preventDefaults();

            // set flag
            this.inited = true;
        },

        preventDefaults: function () {
            // fix ff bug: the options show before the mousedown event.
            // so preventDefault in el's mousedown is not effect.
            if (yardi.isGecko) {
                var self = this;
                this.el.hover(function () {
                    $('select', this).attr('disabled', 'true');
                }, function () {
                    if (!self.isEditing()) { $('select', this).removeAttr('disabled'); }
                });
            }
            //$('input', this.el).click(function (ev) {
            //    ev.preventDefault();
            //});
            //this.fItems().click(function (ev) {
            //    ev.preventDefault();
            //});
        },

        disable: function (disabled) {
            disabled = (disabled === true);
            // css
            this.el.removeClass('s-field-hover');
            this.el[disabled ? 'addClass' : 'removeClass']('s-field-editing');
            // disabled
            $('input, select, textarea', this.el).each(function () {
                $(this).attr('disabled', disabled);
                if (disabled) {
                    $(this).attr('DISABLED', 'disabled');
                } else {
                    $(this).removeAttr('DISABLED');
                }
            });
            // ie hack
            // when element was disabled, the cursor style set to element is no effect
            // and it inhert the parent's cursor style, so wrap it and set the wrapper to the default cursor.
            if (yardi.isIE) {
                $('input[type=text], textarea, select', this.el).each(function () {
                    var wraped = $(this).parent().hasClass('s-disabled-wrap');
                    if (disabled && !wraped) { $(this).wrap('<span class="s-disabled-wrap"></span>'); }
                    if (!disabled && wraped) { $(this).unwrap(); }
                });
            }
        },

        fAttr: function () {
            return 'f_' + this.uuid;
        },

        pAttr: function () {
            return 'p_' + this.uuid;
        },

        fItems: function (name, context) {
            if (name) {
                return $('[' + this.fAttr() + '=' + name + ']', context || this.el);
            } else {
                return $('[' + this.fAttr() + ']', context || this.el);
            }
        },

        pItems: function (name, context) {
            if (name) {
                return $('[' + this.pAttr() + '=' + name + ']', context || this.proEl);
            } else {
                return $('[' + this.pAttr() + ']', context || this.proEl);
            }
        },

        valueable: function (elem) {
            //return /input|select|textarea|button/i.test(elem.attr('nodeName'));
            return /input|select|button/i.test(elem.attr('nodeName'));
        },

        updatePropertyValue: function () {
            var self = this;
            this.fItems().each(function () {
                var elem = $(this);
                var name = elem.attr(self.fAttr());
                if (name) {
                    var p = self.pItems(name);
                    if (p.length > 0) {
                        if (p.attr('type') == 'checkbox') {
                            if (name == 'comment') {
                                var checked = (elem.css('display') != 'none');
                                p.attr('checked', checked);
                            }
                            if (name == 'required') {
                                var checked = (elem.css('display') != 'none');
                                p.attr('checked', checked);
                            }
                        } else {
                            var useVal = self.valueable(elem);
                            var content = useVal ? elem.val() : function () {
                                var c = elem.html()
                                return (c == '&nbsp;') ? '' : c;
                            } ();
                            if (p.attr('type') == 'checkbox') {
                                p.attr('checked', p.val() == content);
                            } else {
                                p.val(content);
                            }
                        }
                    }
                }
            });
        },

        updateFieldValue: function (sender, name) {
            var self = this;
            this.fItems(name).each(function () {
                var elem = $(this);
                if (sender.attr('type') == 'checkbox') {
                    if (name == 'comment') {
                        sender.attr('checked') ? elem.show('fast') : elem.hide('fast');
                    }
                    if (name == 'required') {
                        sender.attr('checked') ? elem.show() : elem.hide();
                    }
                } else {
                    var v = sender.val();
                    if (self.valueable(elem)) {
                        elem.val(v);
                        // fix bug: set VALUE attribute to refresh dom tree.
                        elem.each(function () {
                            if (this.type == 'text') {
                                $(this).attr('VALUE', v);
                            }
                        });
                    } else {
                        // hack for layout
                        if (v == '' && elem.attr('empty') == 'false') { v = '&nbsp;'; }
                        elem.html(v);
                    }
                }
            });
        },

        tipsData: null,

        getTips: function () {
            if (!this.tipsData) { this.tipsData = {}; }
            return this.tipsData;
        },

        setTips: function (data) {
            if (!this.tipsData) { this.tipsData = {}; }
            $.extend(this.tipsData, data);
        },

        renderTip: function () {

            $('.tooltip-link', this.proEl).each(function () {
                var msg = decodeURI($(this).attr('title'));
                $(this).removeAttr('title');
                if (msg) {
                    $(this).yardiTip({
                        title: '',
                        content: msg,
                        width: 200,
                        resizeTimeout: true
                    });
                }
            });

            // Obsolete
            return;

            $('span[tiptitle]', this.proEl).each(function () {
                var p = $(this).parent();
                var msg = $(this).html();
                var title = $(this).attr('tiptitle');
                $(this).remove();
                var tip = new yardi.tipClass({
                    renderTo: p,
                    title: title,
                    message: msg
                });
            });
        },

        renderGrp: function () {
            var self = this;
            $('span[groupfor]', this.proEl).each(function () {
                var g = new yardi.groupClass({
                    target: $(this),
                    context: self.proEl
                });
            });
        },

        initPro: function () {
            var html = this.buildProHtml();
            // tip compile data
            var data = {};
            var tips = this.getTips();
            for (var key in tips)
                data[key] = '<a class="tooltip-link" title="' + encodeURI(tips[key].message) + '"></a>';
            //Obsolete
            //data[key] = '<span tiptitle="' + tips[key].title + '">' + tips[key].message + '</span>';

            // complie data
            data.uuid = this.uuid;
            data.sync = this.pAttr();
            data.img = (yardi.rootPath || '') + 'field/images';
            // do build
            html = new yardi.template(html).compile(data);
            this.proEl = $(html).addClass('s-field-pro').appendTo(this.proRenderTo);
            this.updatePropertyValue();
            this.renderTip();
            this.renderGrp();
            // bind events
            var self = this;
            var fireUpdate = function (ev) {
                var sender = $(ev.target);
                var name = sender.attr(self.pAttr());
                if (name) {
                    // trigger event
                    self.onUpdateValue(sender, name);
                    // update field value
                    self.updateFieldValue(sender, name);
                }
            };
            this.pItems().keyup(fireUpdate).blur(fireUpdate).change(fireUpdate);
        },

        showProperty: function () {
            if (this.proEl == null) { this.initPro(); }
            this.proRenderTo.children().hide();
            this.proEl.show();
        },

        setPropertyFocus: function () {
            var self = this;
            window.setTimeout(function () {
                var el = self.pItems().first();
                if (el.length > 0) {
                    //if (self.locateToVisual(el) !== false) {
                    el.focus();
                    //}
                }
            }, 50);
        },

        //locateToVisual: function (el) {
        //    if (el.length > 0 && el[0].getBoundingClientRect) {
        //        var container = el.parents('.s-field-pro');
        //        var bounding = el[0].getBoundingClientRect();
        //        var marginValue = parseFloat(container.css('margin-top').replace('px', ''));
        //        if (bounding.top < 0) {
        //            //marginValue += Math.abs(bounding.top);
        //            //container.css('margin-top', marginValue);
        //            //TODO:
        //            return false;
        //        }
        //    }
        //    return true;
        //},

        generateKey: function (oldKey, query) {
            var num = '', i = oldKey.length - 1;
            for (; i > -1; i--) {
                var charCode = oldKey.charCodeAt(i);
                if (charCode >= 48 && charCode <= 57) { // "0-9"
                    num = oldKey[i] + num;
                } else {
                    break;
                }
            }
            var prefix = oldKey.substring(0, i + 1);
            var subfix = (parseInt(num || '-1', 10) + 1).toString();
            var newKey = prefix + subfix;
            if (query(newKey).length > 0) {
                return this.generateKey(newKey, query);
            } else {
                return newKey;
            }
        },

        remove: function (callback) {
            var self = this;
            // remove el
            var removeEl = function () {
                if (self.anchorBar) {
                    self.anchorBar.remove();
                    self.anchorBar = null;
                }
                self.el.remove();
                self.el = null;
                if (callback) callback();
            };
            if (callback) {
                this.el.slideUp('fast', removeEl);
            } else {
                removeEl();
            }
            // remove pro el
            if (this.proEl) {
                var removeProEl = function () {
                    self.proEl.remove();
                    self.proEl = null;
                };
                if (callback) {
                    this.proEl.slideUp('fast', removeProEl);
                } else {
                    removeProEl();
                }
            }
        },

        mask: function (timeout) {
            this.unmask();
            var css = this.el.offset();
            this.maskEl = $('<div class="s-field-mask"></div>').appendTo('body');
            if (timeout) {
                var self = this;
                setTimeout(function () {
                    self.unmask();
                }, timeout);
            }
            return this.maskEl.css($.extend(css, { width: this.el.outerWidth(), height: this.el.outerHeight() }));
        },

        unmask: function () {
            if (this.maskEl) {
                this.maskEl.remove();
                this.maskEl = null;
            }
        },

        scrollToView: function (callback) {
            var elemBounding;
            if (this.el.css('display') == 'none') {
                var temp = $('<div style="width:1px; height:1px;"></div>').insertAfter(this.el);
                elemBounding = temp.get(0).getBoundingClientRect();
                temp.remove();
            } else {
                elemBounding = this.el.get(0).getBoundingClientRect();
            }
            var elemHeight = this.el.height();
            var windowHeight = $(window.parent).height();
            var iframeBouding = this.parentIframe.getBoundingClientRect();
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
            var self = this, cb = function (scrolled) { callback && callback.call(self, scrolled); };
            if (scrollOffset != 0) {
                var scrollEl = (yardi.isSafari || yardi.isChrome) ? window.parent.document.body : window.parent.document.documentElement;
                var scrollTop = $(scrollEl).attr('scrollTop') + scrollOffset;
                $(scrollEl).animate({ scrollTop: scrollTop }, 400, function () { cb(true); });
            } else {
                cb(false);
            }
        }

    };

    // register
    yardi.baseField = baseField;

})(jQuery);
