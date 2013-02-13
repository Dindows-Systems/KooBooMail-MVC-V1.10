
(function () {

    /*
    *
    * style sheet helper
    * author: ronglin
    * create date: 2010.05.28
    *
    */
    var sheetsHelper = function (doc, rulesMgr) {
        this._document = doc || document;
        this._rulesMgr = rulesMgr;
    };

    sheetsHelper.prototype = {

        _document: null,

        _rulesMgr: null,

        // creates a stylesheet from a text blob of rules.
        // these rules will be wrapped in a STYLE tag and appended to the HEAD of the document.
        createStyleSheet: function (cssText, id) {
            var doc = this._document;
            var head = doc.getElementsByTagName('head')[0];
            var node = doc.createElement('style');
            node.setAttribute('type', 'text/css');
            if (id) {
                node.setAttribute('id', id);
            }
            if (yardi.isIE) {
                head.appendChild(node);
                node.styleSheet.cssText = cssText;
            } else {
                try {
                    node.appendChild(doc.createTextNode(cssText));
                } catch (ex) {
                    node.cssText = cssText;
                }
                head.appendChild(node);
            }
            // cache new style sheet
            if (this._rulesMgr) {
                var ss = node.styleSheet ? node.styleSheet : (node.sheet || doc.styleSheets[doc.styleSheets.length - 1]);
                this._rulesMgr.cacheStyleSheet(ss);
            }
            // ret html node
            return node;
        },

        // removes a style or link tag by id.
        removeStyleSheet: function (id) {
            var existing = this._document.getElementById(id);
            if (existing) {
                existing.parentNode.removeChild(existing);
            }
            //// refresh rules cache
            //if (this._rulesMgr) {
            //    this._rulesMgr.refreshCache();
            //}
        },

        // dynamically swaps an existing stylesheet reference for a new one.
        swapStyleSheet: function (id, url) {
            this.removeStyleSheet(id);
            var doc = this._document;
            var ss = doc.createElement('link');
            ss.setAttribute('rel', 'stylesheet');
            ss.setAttribute('type', 'text/css');
            ss.setAttribute('id', id);
            ss.setAttribute('href', url);
            doc.getElementsByTagName('head')[0].appendChild(ss);
            // cache new style sheet
            if (this._rulesMgr) {
                var ss = doc.styleSheets[doc.styleSheets.length - 1];
                this._rulesMgr.cacheStyleSheet(ss);
            }
        }
    };

    // register
    yardi.sheetsHelper = sheetsHelper;


    /*
    *
    * page rules manager
    * author: ronglin
    * create date: 2010.08.25
    *
    */
    var pageRulesManager = function (doc) {
        this._document = doc || document;
    };

    pageRulesManager.prototype = {

        _document: null,

        _rules: null,

        // private
        cacheStyleSheet: function (ss) {
            if (!this._rules) {
                this._rules = {};
            }
            try {// try catch for cross domain access issue
                var ssRules = ss.cssRules || ss.rules;
                for (var j = ssRules.length - 1; j >= 0; --j) {
                    this._rules[ssRules[j].selectorText] = ssRules[j];
                }
            } catch (e) { }
        },

        // refresh all page rules
        refreshCache: function () {
            return this.getRules(true);
        },

        // gets all css rules for the document
        getRules: function (refreshCache) {
            if (this._rules === null || refreshCache) {
                this._rules = {};
                var ds = this._document.styleSheets;
                for (var i = 0, len = ds.length; i < len; i++) {
                    try {
                        this.cacheStyleSheet(ds[i]);
                    } catch (e) { }
                }
            }
            return this._rules;
        },

        // gets an an individual CSS rule by selector(s)
        getRule: function (selector, refreshCache) {
            var rs = this.getRules(refreshCache);
            if (!yardi.isArray(selector)) {
                return rs[selector];
            }
            for (var i = 0; i < selector.length; i++) {
                if (rs[selector[i]]) {
                    return rs[selector[i]];
                }
            }
            return null;
        },

        // updates a rule property
        updateRule: function (selector, property, value) {
            if (!yardi.isArray(selector)) {
                var rule = this.getRule(selector);
                if (rule) {
                    var camelRe = /(-[a-z])/gi;
                    var camelFn = function (m, a) { return a.charAt(1).toUpperCase(); };
                    rule.style[property.replace(camelRe, camelFn)] = value;
                    return true;
                }
            } else {
                for (var i = 0; i < selector.length; i++) {
                    if (this.updateRule(selector[i], property, value)) {
                        return true;
                    }
                }
            }
            return false;
        }
    };

    // register
    yardi.pageRulesManager = pageRulesManager;


    /*
    *
    * style sheet class
    * author: ronglin
    * create date: 2010.07.27
    *
    */
    var styleSheetClass = function (ss) {
        this.sheet = ss;
        this.rules = ss.cssRules || ss.rules;
        this.ownerNode = ss.ownerNode || ss.owningElement;
        this.originalRuleText = this.ownerNode.innerHTML.toLowerCase();
    };

    styleSheetClass.resolveNode = function (node) {
        var ss = node.styleSheet ? node.styleSheet : node.sheet;
        return new styleSheetClass(ss);
    };

    styleSheetClass.prototype = {

        sheet: null,

        rules: null,

        ownerNode: null,

        originalRuleText: null,

        formatRuleText: function (ruleText) {
            var cssText = [];
            var ruleItems = ruleText.split(';');
            for (var i = 0; i < ruleItems.length; i++) {
                var item = ruleItems[i].replace(/(^\s*)|(\s*$)/g, '');
                if (item)
                    cssText.push('    ' + item.toLowerCase() + ';\n');
            }
            return cssText.join('');
        },

        cameName: function (name) {
            var camelRe = /(-[a-z])/gi;
            var camelFn = function (m, a) { return a.charAt(1).toUpperCase(); };
            return name.replace(camelRe, camelFn)
        },

        remove: function () {
            var p = this.ownerNode.parentNode;
            p.removeChild(this.ownerNode);
        },

        clearRules: function () {
            for (var index = this.rules.length - 1; index > -1; index--) {
                this.removeRule(index);
            }
        },

        //TODO: has some bugs
        // 1. no support safari
        // 2. when after reset, we can't change the rules
        resetRules: function () {
            try {
                this.ownerNode.cssText = this.originalRuleText;
                this.ownerNode.innerHTML = this.originalRuleText;
            } catch (e) {
                this.sheet.cssText = this.originalRuleText;
            }
        },

        indexOf: function (selector) {
            for (var index = 0; index < this.rules.length; index++) {
                if (this.rules[index].selectorText.toLowerCase() == selector.toLowerCase()) {
                    return index;
                }
            }
            return -1;
        },

        removeRule: function (index) {
            if (typeof (index) == 'number') {
                if (index < this.rules.length) {
                    if (this.sheet.removeRule) {
                        this.sheet.removeRule(index);
                    } else {
                        this.sheet.deleteRule(index);
                    }
                    return true;
                }
            } else {
                index = this.indexOf(index);
                return this.removeRule(index);
            }
            return false;
        },

        getRule: function (selector) {
            var index = this.indexOf(selector);
            if (index > -1) {
                return this.rules[index];
            } else {
                return null;
            }
        },

        queryRules: function (partSelector) {
            partSelector = partSelector.toLowerCase().replace(/(^\s*)|(\s*$)/g, ''); // lower case and trim.
            var regexp = new RegExp(partSelector + '(>| |,|:)+'); // some css sub class selector.
            var rules = [];
            for (var index = 0; index < this.rules.length; index++) {
                var selector = this.rules[index].selectorText.toLowerCase();
                if (selector == partSelector || regexp.test(selector)) {
                    rules.push(this.rules[index]);
                }
            }
            return rules;
        },

        getRuleText: function (rule, newSelector) {
            if (typeof (rule) == 'string') {
                rule = this.getRule(rule);
            }
            if (rule) {
                var cssText = [];
                cssText.push(newSelector || rule.selectorText + '\n');
                cssText.push('{\n');
                cssText.push(this.formatRuleText(rule.style.cssText));
                cssText.push('}\n');
                return cssText.join('');
            } else {
                return null;
            }
        },

        getRuleTextAll: function () {
            var allText = [];
            for (var index = 0; index < this.rules.length; index++) {
                allText.push(this.getRuleText(this.rules[index]));
            }
            return allText.join('');
        },

        addRule: function (selector, styles, index) {
            if (!selector) {
                return;
            }
            if (!styles) {
                styles = ' ';
            }
            if (!index && index !== 0) {
                index = this.rules.length;
            }
            if (this.sheet.insertRule) {
                this.sheet.insertRule(selector + '{' + styles + '}', index);
            } else {
                this.sheet.addRule(selector, styles, index);
            }
        },

        setRuleStyle: function (selector, name, value) {
            name = this.cameName(name);
            var index = this.indexOf(selector);
            if (index != -1) {
                this.rules[index].style[name] = value;
            }
        },

        getRuleStyle: function (selector, name) {
            name = this.cameName(name);
            var index = this.indexOf(selector);
            if (index != -1) {
                return this.rules[index].style[name];
            } else {
                return null;
            }
        },

        updateRuleStyle: function (ruleText) {
            ruleText = (ruleText || '').replace(/(^\s*)|(\s*$)/g, ''); // trim.
            for (var index = 0; index < this.rules.length; index++) {
                var selector = this.rules[i].selectorText;
                var reg = new RegExp(selector + '\\s*{([^\\}]|\\r|\\n)*\\}', 'igm'); // match css block.
                var matches = ruleText.match(reg);
                if (matches && matches.length > 0) {
                    var innerRule = [];
                    for (var f = 0; f < matches.length; f++) {
                        var m = matches[f].replace(/(^\s*)|(\s*$)/g, ''); // trim.
                        if (m && m.length > 0) {
                            var start = m.indexOf('{') + 1, end = m.indexOf('}');
                            innerRule.push(m.substring(start, end).replace(/(^\s*)|(\s*$)/g, ''));
                        }
                    }
                    this.rules[i].style.cssText = innerRule.join('\n');
                }
            }
        }
    };

    // register
    yardi.styleSheetClass = styleSheetClass;

})();