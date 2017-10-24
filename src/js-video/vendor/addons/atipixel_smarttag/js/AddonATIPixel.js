/**
 * netTrek GmbH & Co. KG
 * (c) 2017
 * @plugin ATIPixelAddon (SmartTag)
 * @version 1.0.3
 **/

(function (ns, $, console) {
    "use strict";

    var AddonATIPixel = function () {
        // default values
        this.__buffering = false;
        this.__tagQueue = [];
        this.__delayMap = {};

        /**
         * Not needed since player version 3.9.
         * @deprecated
         * */
        this.__hasDuration = false;
    };

    var p = AddonATIPixel.prototype = new ns.AbstractCorePlugin();

    /**************************************************************************
     * Plugin construction area
     *************************************************************************/

    p.super_register = p.register;
    p.register = function (player) {
        this.super_register(player);

        this.register_event(ns.Player.EVENT_PLAY_STREAM, this.eventPlayStream);
        this.register_event(ns.Player.EVENT_PAUSE_STREAM, this.eventPauseStream);
        this.register_event(ns.Player.EVENT_END_STREAM, this.eventEndStream);
        this.register_event(ns.Player.EVENT_UPDATE_STREAM_DURATION, this.eventUpdateStreamDuration);
        this.register_event(ns.Player.EVENT_BUFFERING, this.eventBuffering);
        this.register_event(ns.PlayerPixelController.SUPER_SCRUBBAR_CHANGE_POSITION_FORWARD, this.eventSeek);
        this.register_event(ns.PlayerPixelController.SUPER_SCRUBBAR_CHANGE_POSITION_REWIND, this.eventSeek);

        // register for auto disposement
        $(window).on("unload", this.onUnload.bind(this));

        // setup ati tag
        this.ati_tag = new ATInternet.Tracker.Tag(ati_options || {});

        this.log("Plugin registered: AddonATIPixel (SmartTag)");
    };

    p.super_dispose = p.dispose;
    p.dispose = function () {
        this.super_dispose();

        $(window).off("unload", this.onUnload);
    };

    p.onUnload = function () {
        if (this.ati_tag && this.ati_tag.richMedia)
            this.ati_tag.richMedia.removeAll();
    };

    /**************************************************************************
     * Event related plugin functions
     *************************************************************************/

    /**
     * Event: PlayerPixelController.SUPER_SCRUBBAR_CHANGE_POSITION_FORWARD
     * Event: PlayerPixelController.SUPER_SCRUBBAR_CHANGE_POSITION_REWIND
     */
    p.eventSeek = function (event) {
        this._send('move');
    };

    /**
     * Event: Player.EVENT_UPDATE_STREAM_DURATION
     */
    p.eventUpdateStreamDuration = function (event) {

        if (this.__hasDuration)
            return;
        this.__hasDuration = true;

        // as soon as the duration is available, we can safely process our
        // tag queue (as duration is mandatory for OD clips).
        while (this.__tagQueue.length > 0) {
            var curTag = this.__tagQueue.shift();
            this._send(curTag.action, curTag.params);
        }

    };

    /**
     * Event: Player.EVENT_PLAY_STREAM
     */
    p.eventPlayStream = function (event) {
        this._sendDelayed('pps', 'play');
    };

    /**
     * Event: Player.EVENT_BUFFERING
     */
    p.eventBuffering = function (event) {
        if (this.__buffering !== event.isBuffering) {
            this.__buffering = event.isBuffering;
            this._send('info', {isBuffering: event.isBuffering});
        }
    };

    /**
     * Event: Player.EVENT_PAUSE_STREAM
     */
    p.eventPauseStream = function (event) {
        this._sendDelayed('pps', 'pause');
    };

    /**
     * Event: Player.EVENT_END_STREAM
     */
    p.eventEndStream = function (event) {
        this._sendDelayed('pps', 'stop');
    };

    /**************************************************************************
     * Logic related plugin functions
     *************************************************************************/
    p.getPixelField = function (fieldname, expectedType) {
        var p = this._player,
            c = p.getCtrl(),
            m = c.model,
            mc = m.mediaCollection,
            pc = m.playerConfig;

        var pixelCfg = pc._pixelConfig || null;

        // override through mediacollection
        if (!!mc._pixelConfig)
            pixelCfg = mc._pixelConfig;

        if (!!pixelCfg && Object.prototype.toString.call(pixelCfg) === "[object Array]") {
            var tracker;
            for (var i = 0; i < pixelCfg.length; i++) {
                tracker = pixelCfg[i];
                if (tracker.tracker === "ATI") {
                    if (tracker.hasOwnProperty(fieldname)) {

                        var value = tracker[fieldname];

                        if (expectedType === 'boolean') {
                            return (value || '').toString().toLowerCase() === 'true';
                        } else if (expectedType === 'string') {
                            return (value || '').toString();
                        } else {
                            return tracker[fieldname];
                        }
                    } else {
                        return null;
                    }
                }
            }
        }

        return null;
    };

    p.addMetaFieldIfSet = function (toObject, fieldname, defaultValue, expectedType) {
        var field = this.getPixelField(fieldname, expectedType);
        if (!!field)
            toObject[fieldname] = field;
        else if (defaultValue !== undefined)
            toObject[fieldname] = defaultValue;
    };

    p._sendDelayed = function (delayId, action, params) {
        if (!!this.__delayMap[delayId])
            clearTimeout(this.__delayMap[delayId]);

        this.__delayMap[delayId] = setTimeout(
            function (_delayId, _action, _params) {
                delete this.__delayMap[_delayId];
                this._send(_action, _params);
            }.bind(this),
            1000,
            delayId, action, params
        );
    };
    
    p._send = function (action, params) {

        var p = this._player,
            c = p.getCtrl(),
            m = c.model,
            pc = m.playerConfig,
            mc = m.mediaCollection;

        var duration = 0;
        if (!mc._isLive)
            duration = Math.round(Math.min(m.__duration, 86400)) || 0;

        // duration is a required field, so check this first.
        if (duration === 0 && !mc._isLive) {
            this.log("Duration is mandatory for OD clips, caching tag.");
            this.__tagQueue.push({action: action, params: params});
            return;
        }

        this.log("_send called", action, params);

        // create initial tag
        if (!this._hasTag) {
            this._hasTag = true;

            var meta_c = {};

            this.addMetaFieldIfSet(meta_c, 'duration', (duration || '').toString(), 'string');
            this.addMetaFieldIfSet(meta_c, 'broadcastMode', mc._isLive ? 'live' : 'clip');
            this.addMetaFieldIfSet(meta_c, 'mediaType', mc._type || 'unknown');
            this.addMetaFieldIfSet(meta_c, 'playerId', p._id || '');
            this.addMetaFieldIfSet(meta_c, 'mediaLevel2');
            this.addMetaFieldIfSet(meta_c, 'mediaLabel', '');
            this.addMetaFieldIfSet(meta_c, 'mediaTheme1');
            this.addMetaFieldIfSet(meta_c, 'mediaTheme2');
            this.addMetaFieldIfSet(meta_c, 'mediaTheme3');
            this.addMetaFieldIfSet(meta_c, 'previousMedia');
            this.addMetaFieldIfSet(meta_c, 'refreshDuration', '5', 'string');
            this.addMetaFieldIfSet(meta_c, 'isEmbedded', false, 'boolean');
            this.addMetaFieldIfSet(meta_c, 'webdomain');


            if (this.ati_tag && this.ati_tag.richMedia)
            {
                this.log("this.ati_tag.richMedia.add", meta_c);
                this.ati_tag.richMedia.add(meta_c);
            }
        }

        var meta = {action: action};

        this.addMetaFieldIfSet(meta, 'playerId', p._id || '');
        this.addMetaFieldIfSet(meta, 'mediaLabel', '');
        this.addMetaFieldIfSet(meta, 'mediaTheme1');
        this.addMetaFieldIfSet(meta, 'mediaTheme2');
        this.addMetaFieldIfSet(meta, 'mediaTheme3');

        if (action === 'info' && !!params) {
            for (var attrname in params) {
                meta[attrname] = params[attrname];
            }
        }


        if (this.ati_tag && this.ati_tag.richMedia) {
            this.log("this.ati_tag.richMedia.send", meta);
            this.ati_tag.richMedia.send(meta);
        }
    };

    p.log_super = p.log;
    p.log = function () {
        console.log.apply(console.log, [].concat("[AddonATIPixel]\t",arguments));
    };

    ns.AddonATIPixel = AddonATIPixel;

}(ardplayer, ardplayer.jq, ardplayer.console));