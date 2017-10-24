(function (global) {
    'use strict';

    var _debug = false;
    var _localDev = false;

    global.ardplayer = {
        debug: function (flag) {
            console.log("[ARD Player] debug: " + (flag ? "enabled" : "disabled"));
            _debug = flag;

            // save debug flag to cookie
            this.GlobalModel.getInstance().cookie.add(this.Cookie.DEBUG, flag?1:0);
        }
    };

    if (!!!global.console) {
        var dummy = function () {
            return false
        };

        // Minimal mock
        var c = {},
            method, methods = ['info', 'profile', 'clear', 'dir', 'warn', 'error', 'log'];
        while (method = methods.pop()) {
            c[method] = dummy
        }

        global.console = c;
    }

    var filteredConsole = function () {

        return {
            info: function () {
                if (_debug)
                    global.console.info.apply(global.console, arguments);
            },

            log: function () {
                if (_debug)
                    global.console.log.apply(global.console, arguments);
            },

            warn: function () {
                if (_debug)
                    global.console.warn.apply(global.console, arguments);
            },

            error: function () {
                if (_debug)
                    global.console.error.apply(global.console, arguments);
            }

        };
    };

    // Populate ARD Player Namespace
    // global.ardplayer.jq = $.noConflict();
    global.ardplayer.jq = jQuery;
    global.ardplayer.console = _localDev ? global.console : filteredConsole();

})(typeof window === 'undefined' ? this : window);
