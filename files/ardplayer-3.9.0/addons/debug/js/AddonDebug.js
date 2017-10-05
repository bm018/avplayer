/**
 * netTrek GmbH & Co. KG
 * (c) 2013
 * @plugin Untertitel
 **/

(function (ns, $, console) {
    "use strict";

    var AddonDebug = function () {
    };

    var p = AddonDebug.prototype = new ns.AbstractCorePlugin();

    /**************************************************************************
     * Plugin constants
     *************************************************************************/

    AddonDebug.CLASS_DEBUG = "class-debug";
    AddonDebug.CLASS_DEBUG_SELECTED = "class-debug-selected";

    /**************************************************************************
     * Plugin construction area
     *************************************************************************/

    p.super_register = p.register;
    p.register = function (player) {
        this.super_register(player);

        this.register_event(ns.Player.EVENT_INIT, this.eventInitPlayer);
        this.register_event(ns.Player.EVENT_KEYBOARD_RELEASE, this.eventKeyboardRelease);
        this.register_event(ns.Player.EVENT_LOAD_STREAM, this.eventLoadStream);
        this.register_event(ns.Player.EVENT_STOP_STREAM, this.eventStopStream);
        this.register_event(ns.Player.EVENT_END_STREAM, this.eventEndStream);
        this.register_event(ns.Player.EVENT_UPDATE_STREAM_TIME, this.eventUpdateStreamTime);
        this.register_event(ns.Player.VIEW_RESTORE_DEFAULTS, this.eventViewRestoreDefaults);
        this.register_event(ns.Player.SETUP_VIEW, this.eventSetupView);
        this.register_event(ns.Player.SETUP_VIEW_COMPLETE, this.eventViewSetupComplete);

        this.displayDebugger = true;
        this.log("Plugin registered: AddonDebug");
    };

    /**************************************************************************
     * Event related plugin functions
     *************************************************************************/

    /**
     * Event: Player.SETUP_VIEW
     */
    p.eventSetupView = function (event) {
        this.log("eventSetupView");

        this.setupView(event);
    };

    /**
     * Event: Player.EVENT_KEYBOARD_RELEASE
     */
    p.eventKeyboardRelease = function (event) {
        this.log("eventKeyboardRelease");
    };

    /**
     * Event: Player.SETUP_VIEW_COMPLETE
     */
    p.eventViewSetupComplete = function (event) {
        this.log("eventViewSetupComplete");
    };

    /**
     * Event: Player.VIEW_RESTORE_DEFAULTS (View Reset)
     */
    p.eventViewRestoreDefaults = function (event) {
        this.log("eventViewRestoreDefaults");
    };

    /**
     * Event: Player.EVENT_INIT
     */
    p.eventInitPlayer = function (event) {
        this.log("eventInitPlayer");
    };

    /**
     * Event: Player.EVENT_LOAD_STREAM
     */
    p.eventLoadStream = function (event) {
        this.log("eventLoadStream");
    };

    /**
     * Event: Player.EVENT_UPDATE_STREAM_TIME
     */
    p.eventUpdateStreamTime = function (event) {
        this.log("eventUpdateStreamTime: " + event.currentTime);
    };

    /**
     * Event: Player.EVENT_STOP_STREAM
     */
    p.eventStopStream = function (event) {
        this.log("eventStopStream");
    };

    /**
     * Event: Player.EVENT_END_STREAM
     */
    p.eventEndStream = function (event) {
        this.log("eventEndStream");
    };

    /**************************************************************************
     * View related plugin functions
     *************************************************************************/

    p.setupView = function (event) {
        // Event data:
        // {controller:vc, viewport:vc.viewport, container:this.functionBtnBox}

        var vc = event.controller;
        var btnContainer = event.container;

        var that = this;

	    this.buttonInstance = vc.generateButton(AddonDebug.CLASS_DEBUG, btnContainer, vc, null, null)
		    .attr( {
			    "title": "Debugger de-/aktivieren",
			    "role": "button",
			    "tabindex": "0",
			    "onClick": "this.blur(); return false;"
		    })
		    .addClass("ardplayer-button-border-width-0 ardplayer-tabindex-focus " + AddonDebug.CLASS_DEBUG_SELECTED)
            .text("D")
		    .off(vc.clickEventName)
		    .on(vc.clickEventName, function (event) {
			    that.toggleDebugger();
			    return false;
		    });
    };

    p.toggleDebugger = function () {
        this.displayDebugger = !this.displayDebugger;

        if (this.buttonInstance) {
            switch (this.displayDebugger) {
                case true:
                    this.buttonInstance
                        .addClass(AddonDebug.CLASS_DEBUG_SELECTED);
                    break;
                case false:
                    this.buttonInstance
                        .removeClass(AddonDebug.CLASS_DEBUG_SELECTED);
                    break;
            }
        }
    };

    /**************************************************************************
     * Logic related plugin functions
     *************************************************************************/

    p.log_super = p.log;
    p.log = function (message) {
        if (this.displayDebugger && console && console.log) {
            console.log("[AddonDebug]:\t" + message);
        }
    };

    ns.AddonDebug = AddonDebug;

}(ardplayer, ardplayer.jq, ardplayer.console));