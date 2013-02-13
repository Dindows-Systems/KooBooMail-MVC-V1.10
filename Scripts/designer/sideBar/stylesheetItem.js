/*
*
* stylesheet item
* author: ronglin
* create date: 2010.11.23
*
*/

/*
* config parameters:
* redoundo, stylesheet
*/

(function ($) {

    // text resource
    var options = {
        groupTitle: 'Fonts & Colors',
        fontFamilyTitle: 'font family',
        fontSizeTitle: 'font size',
        fontColorTitle: 'font color',
        backColorTitle: 'back color'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.stylesheetItem_js); }

    /*
    * stylesheet item
    */
    var nospace = function (text) {
        return text.replace(/\s/g, '').toLowerCase();
    };

    var dictionary = function () {
        this.items = {};
    };

    dictionary.prototype = {

        items: null,

        add: function (key, value) {
            this.items[nospace(key)] = value;
        },
        get: function (key) {
            return this.items[nospace(key)];
        },
        exist: function (key) {
            return (this.items[nospace(key)] !== undefined);
        },
        data: function () {
            return this.items;
        }
    };

    var stylesheetItem = function (config) {
        stylesheetItem.superclass.constructor.call(this, config);
    };

    yardi.extend(stylesheetItem, yardi.sideBar.baseItem, {

        redoundo: null,

        stylesheet: null,

        ruleEditors: null,

        groupTitle: options.groupTitle,

        initialize: function () {
            stylesheetItem.superclass.initialize.call(this);
            this.ruleEditors = new dictionary();
        },

        buildHtml: function () {
            var html = [];
            html.push('<div class="kb-stylesheet">');
            html.push('<span class="kb-groupbtn" groupfor="customcss" show="false">' + this.groupTitle + '</span>');
            html.push('<div class="kb-wrap" group="customcss"></div>');
            html.push('</div>');
            return html.join('');
        },

        getCssTextAll: function () {
            var csstext = [];
            $.each(this.ruleEditors.data(), function () {
                if (this.ruleWrapper) {
                    csstext.push(this.ruleWrapper.toString());
                } else {
                    csstext.push(this.toString());
                }
            });
            return csstext.join('\n');
        },

        //createRuleWrapper: function (cssRule) {
        //    //var cssText = cssRule.style.cssText; // this is different between browers
        //    var reg = new RegExp(cssRule.selectorText + '\\s*{([^\\}]|\\r|\\n)*\\}', 'igm');
        //    var matches = this.stylesheet.originalRuleText.match(reg);
        //    var cssText = matches[0].trim(); // match rule text block
        //    return new ruleWrapperClass(cssRule, cssText);
        //},

        matchCssRules: function () {
            var re = /([^{}]+?)\s*{([^}]*)}/ig;
            var all = this.stylesheet.originalRuleText;
            var rules = new dictionary(), match = re.exec(all);
            // gen cssText
            while (match) {
                rules.add(match[1], {
                    cssText: match[0].trim(),
                    selectorText: match[1].trim()
                });
                match = re.exec(all);
            }
            // gen cssRule
            $.each(this.stylesheet.rules, function () {
                var o = rules.get(this.selectorText);
                if (!o) {
                    // css selector like ".article.odd" that some browser recognize it as ".odd.article"
                    // so the rules dictionary can not get the item and cause some error.
                    // this fix the bug by a new query logic.
                    var selectorText = this.selectorText.toLowerCase();
                    $.each(rules.items, function (key) {
                        if (this.cssRule) { return; }
                        var selectorRe = /[a-z0-9-_]+/ig;
                        var found = false;
                        while (true) {
                            var m = selectorRe.exec(key);
                            if (!m) { break; }
                            found = (selectorText.indexOf(m[0]) !== -1);
                            if (!found) { break; }
                        }
                        if (found) {
                            o = this;
                            return false;
                        }
                    });
                }
                o.cssRule = this;
            });
            return rules;
        },

        createRuleEditor: function (ruleWrapper, to) {
            // rule editor
            var selector = ruleWrapper.selectorText;
            var editor = new ruleEditorClass({
                title: selector.toLowerCase(),
                redoundo: this.redoundo,
                ruleWrapper: ruleWrapper
            });
            this.ruleEditors.add(selector, editor);
            return editor.render(to);
        },

        render: function (to) {
            var container = $('*[group=customcss]', this.el), self = this;
            var allRules = this.matchCssRules();
            var delegate = function (re) { //ruleEditor
                return function () {
                    return re.childCon();
                };
            };
            $.each(allRules.data(), function () {
                var editors = self.ruleEditors;
                var selector = this.selectorText;
                if (editors.exist(selector)) { return; }

                var ruleWrapper = new ruleWrapperClass(this.cssRule, selector, this.cssText);
                if (!this.cssRule || !ruleWrapper.editable()) {
                    editors.add(selector, ruleWrapper);
                    return;
                }

                // in order to support css pseudo-classes, so replace(':', ' :')
                var parts = selector.trim().replace(':', ' :').split(' ');
                var getCon = function () { return container; };
                for (var i = 1; i <= parts.length; i++) {
                    var sel = parts.slice(0, i).join(' '), edr = editors.get(sel);
                    if (edr) {
                        (edr instanceof ruleEditorClass) && (getCon = delegate(edr));
                        continue;
                    }
                    if (allRules.exist(sel)) {
                        var comp = self.createRuleEditor(ruleWrapper, getCon());
                        (comp) && (getCon = delegate(comp));
                    }
                }
            });
            stylesheetItem.superclass.render.call(this, to);
            return this;
        }
    });


    // this wrapper ensure the same css behaves between browers.
    var ruleWrapperClass = function (cssRule, selectorText, cssText) {
        this.cssRule = cssRule;
        this.selectorText = selectorText;
        this.initialize(cssText);
    };

    ruleWrapperClass.prototype = {

        cssRule: null, selectorText: null,

        items: null, compress: false,

        initialize: function (cssText) {
            this.items = {};
            cssText = cssText.toLowerCase();
            var start = cssText.indexOf('{') + 1, end = cssText.indexOf('}');
            this.setCssText(cssText.substring(start, end).trim(), false);
        },

        cameName: function (name) {
            return name.replace(/(-[a-z])/gi, function (m, a) { return a.charAt(1).toUpperCase(); });
        },

        setStyle: function (name, value) {
            this.items[name] = value;
            this.cssRule.style[this.cameName(name)] = value;
        },

        getStyle: function (name) {
            return this.cssRule.style[this.cameName(name)];
        },

        setCssText: function (text, set) {
            this.items = {};
            var self = this;
            $.each(text.split(';'), function (i, str) {
                // it can not use string.split function to get the css pair
                // error example: background:url(http://localhost:19525/images/bg-bar.gif);
                //var pair = str.split(':');
                //(pair.length == 2) && (self.items[pair[0].trim()] = pair[1].trim());
                var colonIndex = str.indexOf(':');
                if (colonIndex !== -1) {
                    var part1 = (str.substr(0, colonIndex) || '').trim();
                    var part2 = (str.substr(colonIndex + 1) || '').trim();
                    if (part1 && part2) { self.items[part1] = part2; }
                }
            });
            (set !== false) && (this.cssRule.style.cssText = text);
        },

        getCssText: function () {
            var text = [];
            if (this.compress) {
                $.each(this.items, function (key, val) {
                    text.push(key + ':' + val + ';');
                });
                return text.join('');
            } else {
                $.each(this.items, function (key, val) {
                    text.push('    ' + key + ': ' + val + ';');
                });
                return text.join('\n');
            }
        },

        test: function (name) {
            if (this.items[name] !== undefined) { return true; }
            // the follow code used for test css like the format: "background: url(...) #ccc repeat"
            // it is not so exactitude. see to the css inherit and auto:
            // http://www.cnblogs.com/rubylouvre/archive/2009/09/04/1559557.html
            var s = this.cssRule.style[this.cameName(name)];
            if (s && s != 'initial' && s != 'inherit' && s != 'transparent') { return true; }
            return false;
        },

        editable: function () {
            if (this.test('background-color')) { return true; }
            if (this.test('font-family')) { return true; }
            if (this.test('font-size')) { return true; }
            if (this.test('color')) { return true; }
            return false;
        },

        toString: function () {
            if (this.compress) {
                return this.selectorText + '{' + this.getCssText() + '}';
            } else {
                return this.selectorText + '\n{\n' + this.getCssText() + '\n}\n';
            }
        }
    };


    var ruleEditorClass = function (config) {
        $.extend(this, config);
        this.initialize();
    };

    ruleEditorClass.prototype = {

        el: null, components: null,

        title: null, redoundo: null, ruleWrapper: null,

        initialize: function () {
            this.components = {};
            var self = this;
            this.redoundo.onUndo.add(function () { self.refreshBtnsValue(); });
            this.redoundo.onRedo.add(function () { self.refreshBtnsValue(); });
        },

        refreshBtnsValue: function () {
            $.each(this.components, function () {
                this.syncValue();
            });
        },

        buildHtml: function () {
            var html = [];
            html.push('<div class="kb-ruleeditor">');
            html.push('<span class="kb-title" title="' + this.title + '">' + this.title + '</span>');
            html.push('<div class="kb-items"></div>');
            html.push('</div>');
            return html.join('');
        },

        childCon: function () {
            //var con = $('.kb-childs', this.el); // this select more then one element when the depth more then one.
            var con = this.el.children('.kb-childs');
            if (con.length == 0) {
                con = $('<div class="kb-childs"></div>').appendTo(this.el);
                var groupName = Math.random().toString().substr(4);
                $('.kb-title', this.el).attr('groupfor', groupName).attr('show', 'false').attr('animate', 'true');
                con.attr('group', groupName);
            }
            return con;
        },

        renderControl: function (renderTo) {
            var self = this, sep = '&nbsp;', sep = '&nbsp;', holder = '<span class="kb-holder">&nbsp;</span>';

            // get set style
            var gets = function (name) { return self.ruleWrapper.getStyle(name); };
            var sets = function (name, value) { self.ruleWrapper.setStyle(name, value); };

            // render font-family
            if (this.ruleWrapper.test('font-family')) {
                self.components['btnFamily'] = new yardi.fontFamilyCombo({
                    width: 86,
                    title: options.fontFamilyTitle,
                    renderTo: renderTo,
                    onSelect: function (item) {
                        self._preHistory();
                        sets('font-family', item.text);
                        self._commitHistory(this.title);
                    },
                    syncValue: function () { this.val(gets('font-family')); }
                });
            } else {
                $(holder).width(87).addClass("kb-font-family").appendTo(renderTo);

            }
            renderTo.append(sep);

            // render font-size
            if (this.ruleWrapper.test('font-size')) {
                self.components['btnSize'] = new yardi.fontSizeCombo({
                    width: 38,
                    title: options.fontSizeTitle,
                    renderTo: renderTo,
                    onSelect: function (item) {
                        self._preHistory();
                        var parser = new yardi.sizeUnitParser(item.text);
                        sets('font-size', parser.toPx());
                        self._commitHistory(this.title);
                    },
                    syncValue: function () { this.val(gets('font-size')); }
                });
            } else {
                $(holder).width(39).addClass("kb-font-size").appendTo(renderTo);
            }
            renderTo.append(sep);

            // render color
            if (this.ruleWrapper.test('color')) {
                self.components['btnColor'] = new yardi.colorPickerButton({
                    title: options.fontColorTitle,
                    iconType: 'fontcolor',
                    renderTo: renderTo,
                    onPreview: function (value) { sets('color', value); },
                    onCancel: function (value) { sets('color', value); },
                    onPicker: function () { self._preHistory(); },
                    onSelect: function (value) {
                        sets('color', value);
                        self._commitHistory(this.title);
                    },
                    syncValue: function () { this.setColor(gets('color')); }
                });
            } else {
                $(holder).width(20).addClass("kb-font-color").appendTo(renderTo);
            }
            renderTo.append(sep);

            // render background-color
            if (this.ruleWrapper.test('background-color')) {
                self.components['btnBgColor'] = new yardi.colorPickerButton({
                    title: options.backColorTitle,
                    renderTo: renderTo,
                    onPreview: function (value) { sets('background-color', value); },
                    onCancel: function (value) { sets('background-color', value); },
                    onPicker: function () { self._preHistory(); },
                    onSelect: function (value) {
                        sets('background-color', value);
                        self._commitHistory(this.title);
                    },
                    syncValue: function () { this.setColor(gets('background-color')); }
                });
            } else {
                $(holder).width(20).addClass("kb-back-color").appendTo(renderTo);
            }

            // sync value
            this.refreshBtnsValue();

            // ret
            return true;
        },

        render: function (to) {
            var html = this.buildHtml();
            this.el = $(html).appendTo(to);
            this.renderControl($('.kb-items', this.el));
            return this;
        },

        _cachedHistory: null,

        _preHistory: function (val) {
            this._cachedHistory = (val || this.ruleWrapper.getCssText());
        },

        _commitHistory: function (name) {
            var newcss = this.ruleWrapper.getCssText();
            if (newcss != this._cachedHistory && this._cachedHistory && this.redoundo) {
                this.redoundo.commit({
                    name: name,
                    redo: function (self, val) {
                        return function (ev) { self.ruleWrapper.setCssText(val); ev.done(); };
                    } (this, newcss),
                    undo: function (self, val) {
                        return function (ev) { self.ruleWrapper.setCssText(val); ev.done(); };
                    } (this, this._cachedHistory)
                });
            }
        }
    };

    // register
    yardi.sideBar.stylesheetItem = stylesheetItem;

})(jQuery);
