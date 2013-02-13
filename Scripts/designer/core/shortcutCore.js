/*
*
* shortcut core
* author: ronglin
* create date: 2010.11.02
*
*/

/*
* config parameters:
* target, trigger, eventScope, keySetting eg:{ 'ctrl+esc':funciton(){} }
*
* dispatch events:
* onFire
*/

(function ($) {

    var shortcutCore = function (config) {
        $.extend(this, config);
        this.initialize();
    };

    shortcutCore.prototype = {

        target: null,

        trigger: 'keydown',

        keySetting: null,

        eventScope: null,

        initialize: function () {
            // sitting
            if (!this.keySetting) {
                alert('please set the keySetting');
                return;
            } else {
                var sets = {};
                for (var key in this.keySetting) {
                    var newKey = (key || '').replace(/\s/g, '').toUpperCase();
                    yardi.isFunction(this.keySetting[key]) && (sets[newKey] = this.keySetting[key]);
                }
                this.keySetting = sets;
            }

            // support events
            var self = this;
            $.each(['onFire'], function (index, item) {
                self[item] = new yardi.dispatcher(self);
            });

            // scope
            if (!this.eventScope) { this.eventScope = window; }

            // bind dom event
            if (this.trigger) {// if trigger is empty or null, user must call 'fireEvent' to dispatch the setting functions.

                // target
                if (!this.target) { this.target = document; }

                // bind
                var self = this;
                $(this.target).bind(this.trigger, function (ev) {
                    self.fireEvent(ev);
                });
            }
        },

        genKeyName: function (ev) {
            // char code
            var keyCode = ev.keyCode;
            var charCode = String.fromCharCode(keyCode);
            if (keyCode > 111 && keyCode < 123) {
                charCode = 'F' + (keyCode - 111).toString();
            } else if (keyCode == 13) {
                charCode = 'ENTER';
            } else if (keyCode == 27) {
                charCode = 'ESC';
            } else if (keyCode == 29) {
                charCode = 'PAGEUP';
            } else if (keyCode == 30) {
                charCode = 'PAGEDOWN';
            } else if (keyCode == 46) {
                charCode = 'DELETE';
            }

            // function name
            var funcName = '';
            if (ev.shiftKey) { funcName += 'SHIFT+'; }
            if (ev.ctrlKey) { funcName += 'CTRL+'; }
            if (ev.altKey) { funcName += 'ALT+'; }

            // ret
            return funcName + charCode;
        },

        fireEvent: function (ev) {
            var key = this.genKeyName(ev);
            var fn = this.keySetting[key];
            if (fn) { fn.call(this.eventScope); }
            this.onFire.dispatch(this, ev, key);
        }
    };

    // register
    yardi.shortcutCore = shortcutCore;

})(jQuery);
