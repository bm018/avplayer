/**
 * netTrek GmbH & Co. KG
 * (c) 2015
 * @plugin ATIPixelAddon
 **/

(function (ns, $, console) {
    "use strict";

    var AddonATIPixel = function () {
        this._lastTimeUpdate = -1;
        this._isPlaying = false;
        this._isBuffering = false;
        this._oldBufferingValue = false;
    };

    var p = AddonATIPixel.prototype = new ns.AbstractCorePlugin();

    /**************************************************************************
     * Plugin constants
     *************************************************************************/

    var DEBUG = false;

    var TRIGGER_PLAY = "play",
        TRIGGER_PLAY_BUF = "play&buf=1",
        TRIGGER_BUF_DONE_PLAY_CONTINUE = "info&buf=0",
        TRIGGER_PAUSE = "pause",
        TRIGGER_STOP = "stop",
        TRIGGER_FORWARD = "forward",
        TRIGGER_BACKWARD = "backward",
        TRIGGER_SEEK = "move";

    /**************************************************************************
     * Plugin construction area
     *************************************************************************/

    p.super_register = p.register;
    p.register = function (player) {
        this.super_register(player);

        this.register_event(ns.Player.EVENT_INIT, this.eventInitPlayer);
        this.register_event(ns.Player.EVENT_LOAD_STREAM, this.eventLoadStream);
        this.register_event(ns.Player.EVENT_PLAY_STREAM, this.eventPlayStream);
        this.register_event(ns.Player.EVENT_PAUSE_STREAM, this.eventPauseStream);
        this.register_event(ns.Player.EVENT_END_STREAM, this.eventEndStream);
        this.register_event(ns.Player.EVENT_UPDATE_STREAM_TIME, this.eventUpdateStreamTime);
        this.register_event(ns.Player.EVENT_BUFFERING, this.eventBuffering);
        this.register_event(ns.PlayerPixelController.SUPER_SCRUBBAR_CHANGE_POSITION_FORWARD, this.eventSeek);
        this.register_event(ns.PlayerPixelController.SUPER_SCRUBBAR_CHANGE_POSITION_REWIND, this.eventSeek);

        $(window).on("unload", this.onUnload.bind(this));

        this.log("Plugin registered: AddonATIPixel");
    };

    p.super_dispose = p.dispose;
    p.dispose = function () {
        this.super_dispose();

        $(window).off("unload", this.onUnload);
    };

    p.onUnload = function () {
        this.updatePlayStatePixel();
    };

    /**************************************************************************
     * Event related plugin functions
     *************************************************************************/

    /**
     * Event: Player.EVENT_INIT
     */
    p.eventInitPlayer = function (event) {
        this.log("eventInitPlayer");

        // PC not ready..
    };

    /**
     * Event: Player.EVENT_LOAD_STREAM
     */
    p.eventLoadStream = function (event) {
        this.log("eventLoadStream");
        this._isBuffering = false;

        this._clipTitle = this.getClipTitle();
    };

    /**
     * Event: PlayerPixelController.SUPER_SCRUBBAR_CHANGE_POSITION_FORWARD
     * Event: PlayerPixelController.SUPER_SCRUBBAR_CHANGE_POSITION_REWIND
     */
    p.eventSeek = function (event) {
        this.log("eventSeek");
        this._generateHIT(TRIGGER_SEEK);
    };

    /**
     * Event: Player.EVENT_UPDATE_STREAM_TIME
     */
    p.eventUpdateStreamTime = function (event) {
        var roundedTime = Math.round(event.currentTime);
        if (this._lastTimeUpdate == roundedTime)
            return;
        this._lastTimeUpdate = roundedTime;

        this.log("eventUpdateStreamTime: " + event.currentTime + " => " + this._lastTimeUpdate);

        this.updatePlayStatePixel();
    };

    /**
     * Event: Player.EVENT_PLAY_STREAM
     */
    p.eventPlayStream = function (event) {
        this.log("eventPlayStream");
        this._isPlaying = true;
    };

    /**
     * Event: Player.EVENT_BUFFERING
     */
    p.eventBuffering = function (event) {
        this.log("eventBuffering:" + event.isBuffering);
        this._isBuffering = event.isBuffering;
        this.updatePlayStatePixel();
    };

    p.updatePlayStatePixel = function () {
        if (this._isPlaying) {
            if (this._lastTimeUpdate > 0) {
                if (this._oldBufferingValue != this._isBuffering) {
                    this._oldBufferingValue = this._isBuffering;
                    this._generateHIT(this._isBuffering ? TRIGGER_PLAY_BUF : TRIGGER_BUF_DONE_PLAY_CONTINUE);
                } else
                    this._generateHIT(TRIGGER_PLAY);
            }
        } else
        {
            this._generateHIT(TRIGGER_PAUSE);
        }
    };

    /**
     * Event: Player.EVENT_PAUSE_STREAM
     */
    p.eventPauseStream = function (event) {
        this.log("eventPauseStream");
        this._isPlaying = false;
        this.updatePlayStatePixel();
    };

    /**
     * Event: Player.EVENT_END_STREAM
     */
    p.eventEndStream = function (event) {
        this.log("eventEndStream");
        this._isPlaying = false;
        this._generateHIT(TRIGGER_STOP);
    };

    /**************************************************************************
     * Logic related plugin functions
     *************************************************************************/
    p.getClipTitle = function () {
        var p = this._player,
            c = p.getCtrl(),
            m = c.model,
            mc = m.mediaCollection,
            pc = m.playerConfig;

        var pixelCfg = pc._pixelConfig || null;

        // override through mediacollection
        if ( !!mc._pixelConfig )
            pixelCfg = mc._pixelConfig;

        if ( !!pixelCfg && Object.prototype.toString.call( pixelCfg ) === "[object Array]" )
        {
            var tracker;
            for ( var i = 0; i < pixelCfg.length; i++)
            {
                tracker = pixelCfg[i];
                if ( tracker.tracker === "ATI" )
                {
                    return tracker.clipTitle;
                }
            }
        }

        return "";
    };

    p._generateHIT = function (trigger) {

        var p = this._player,
            pc = p.getCtrl(),
            m = p.model,
            mc = m.mediaCollection;

        var stream = "";
        var po = pc.getStreamByQualityIndex(p.viewCtrl.representationQuality);
        if (po._stream instanceof Array)
            stream = po._stream[0];
        else
            stream = po._stream;

        // video oder audio, + playerid bei multiinstanzen
        var A = mc._type;
        A += "&plyr=" + p.getId();

        // Level 2 Site
        var B = "";

        // Richname
        var C = "unknown",
            ct = this._clipTitle;
        if (ct)
            C = ct;
        else
            C = stream;

        // Aktion
        var D = trigger;

        // Refresh interval
        var F = 0;

        // Dauer des clips
        var G = "";
        if (!mc._isLive)
            G = Math.round(Math.min(m.getDuration(), 86400));

        // Position des Players
        var H = "rmp=" + Math.round(m.getTime());
        H += "&rmpf=0";
        H += "&rmbufp=0";

        // Kennung für Streaming-Datenrate.
        var J = "";

        // Ort der Bereitstellung („int“ oder „ext“).
        var K = "int";

        // Art der Wiedergabe („live“ oder „clip“)
        var L = "clip";
        if (mc._isLive)
            L = "live";

        // Größe des Inhalts (Gesamtgröße in KB; leer lassen, wenn L=„live“).
        var M = "";

        // Format des Inhalts
        var N = "";
        N = stream.toLowerCase().substr(stream.lastIndexOf(".") + 1);

        this.log("xt_rm(" + A + "," + B + "," + C + "," + D + ",," + F + "," + G + "," + H + ",," + J + "," + K + "," + L + "," + M + "," + N + ")");
        typeof xt_rm === "function" && xt_rm(A, B, C, D, "", F, G, H, "", J, K, L, M, N);
    };

    p.isBuffering = function () {
        var bufDom = this._player.viewCtrl.buffering;
        if (bufDom)
            return !bufDom.isHiddenByClass();
        return false;
    };

    p.log_super = p.log;
    p.log = function (message) {
        if (DEBUG && console && console.log) {
            console.log("[AddonATIPixel]:\t" + message);
        }
    };

    ns.AddonATIPixel = AddonATIPixel;

}(ardplayer, ardplayer.jq, ardplayer.console));