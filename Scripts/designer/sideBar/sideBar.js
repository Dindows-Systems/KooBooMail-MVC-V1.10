/*
*
* sideBar
* author: ronglin
* create date: 2010.07.29
*
*/

/*
* config parameters:
* redoundo, 
* templates, onAdd, 
* templateRoot, koobooCss
* renderTo, parentIframe
*/

(function ($) {

    var sideBar = function (config) {
        $.extend(this, config);
        this.initialize();
    };

    sideBar.prototype = {

        /*
        * render redo undo component
        */
        redoundo: null,
        renderRedoundo: function (to) {
            return new sideBar.reodundoItem({
                redoundo: this.redoundo
            }).render(to);
        },

        /*
        * render add blocks component
        */
        templates: null,
        onAdd: function (btn, id, title, target) { },
        renderAddBlocks: function (to) {
            return new sideBar.blocksItem({
                templates: this.templates,
                onAdd: this.onAdd
            }).render(to);
        },

        /*
        * render global colors component
        */
        templateRoot: null,
        //layoutSheet: null,
        renderGlobalColors: function (to) {
            //return new sideBar.colorsItem({
            //    redoundo: this.redoundo,
            //    layoutSheet: this.layoutSheet,
            //    templateRoot: this.templateRoot
            //}).render(to).syncValues();
            //return new sideBar.stylesheetItem({
            //    groupTitle: 'Global Style',
            //    redoundo: this.redoundo,
            //    stylesheet: this.layoutSheet
            //}).render(to);
        },

        /*
        * render stylesheet designer
        */
        koobooCss: null,
        renderStylesheetDesigner: function (to) {
            return new sideBar.stylesheetItem({
                redoundo: this.redoundo,
                stylesheet: this.koobooCss
            }).render(to);
        },

        // public setting
        renderTo: null,

        // public setting
        parentIframe: null,

        el: null,

        barComponents: null,

        monitor: null,

        initialize: function () {
            this.barComponents = {};
            this.el = $(this.buildHtml()).appendTo(this.renderTo);
            //this.el.append('<input type="button" value="Test" onclick="designer.test()" /><br/><br/>');
            this.barComponents.redoundo = this.renderRedoundo(this.el);
            //this.el.append('<br/>');
            this.barComponents.addBlocks = this.renderAddBlocks(this.el);
            //this.el.append('<br/>');
            this.barComponents.globalColors = this.renderGlobalColors(this.el);
            //this.el.append('<br/>');
            this.barComponents.stylesheetDesigner = this.renderStylesheetDesigner(this.el);
            // events
            this.bindEvents();
        },

        bindEvents: function () {
            // watch parent window scroll event
            var bounding, oldBounding = { top: 0 }, self = this, timeoutId, downwards = false;
            this.monitor = new yardi.Monitor({
                scope: this,
                interval: 50,
                tester: function () {
                    try {
                        bounding = this.parentIframe.getBoundingClientRect();
                        if (oldBounding.top != bounding.top) {
                            downwards = (oldBounding.top > bounding.top);
                            oldBounding.top = bounding.top;
                            return true;
                        }
                    } catch (ex) { }
                },
                handler: function () {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(function () {
                        self.scroll2View(bounding, downwards);
                    }, 100);
                }
            });
            this.monitor.start();
        },

        _slideLocked: false,

        _cachedScrollFunc: null,

        scroll2View: function (bounding, downwards) {
            // closure func
            var fn = function (s, b, d) {
                return function () {
                    var animate = 0;
                    var selfHeight = s.el.outerHeight();
                    var iframeTopCollapsed = Math.max(-b.top, 0);
                    var selfMarginTop = (parseInt(s.el.css('margin-top').replace('px', '')) || 0);
                    var viewport = yardi.getViewportSize(window.parent);
                    if (viewport.height < selfHeight) {
                        var selfTopCollapsed = iframeTopCollapsed - selfMarginTop;
                        var selfBtmCollapsed = selfHeight - selfTopCollapsed - viewport.height;
                        if (d) {
                            if (selfBtmCollapsed <= 0) {
                                animate = selfMarginTop + (-selfBtmCollapsed) - 40;
                            } else {
                                return;
                            }
                        } else {
                            if (selfTopCollapsed <= 0) {
                                animate = selfMarginTop - (-selfTopCollapsed);
                            } else {
                                return;
                            }
                        }
                    } else {
                        animate = iframeTopCollapsed;
                    }
                    var templateHeight = s.templateRoot.height();
                    var overflow = animate + selfHeight - templateHeight;
                    if (overflow > 0) { animate = animate - overflow; }
                    // scroll animate
                    s.el.animate({ 'margin-top': Math.max(animate, 0) }, 200);
                };
            } (this, bounding, downwards);
            // execute or cache it.
            if (this._slideLocked) {
                this._cachedScrollFunc = fn;
            } else {
                this._cachedScrollFunc = null;
                fn();
            }
        },

        buildHtml: function () {
            var html = [];
            html.push('<div class="kb-sidebar">');
            html.push('</div>');
            return html.join('');
        },

        // public
        lockSlide: function (lock) {
            this._slideLocked = (lock === true);
            if (!this._slideLocked) {
                this._cachedScrollFunc && this._cachedScrollFunc();
            }
        },

        // public
        remove: function () {
            $.each(this.barComponents, function (key, item) {
                item.remove();
            });
            this.el.remove();
        }
    };

    // register
    yardi.sideBar = sideBar;

})(jQuery);
