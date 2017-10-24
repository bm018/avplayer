/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Florian Diesner
 * @module core
 **/

(function (ns, $, console) {
    "use strict";
    /**
     * Diese Klasse wird als Kontroll-Klasse für das Flash Player-Video genutzt.
     * @class FlashPluginCtrl
     * @constructor
     * @public
     * @extends AbstractPlayerCtrl
     **/
    var FlashPluginCtrl = function (player, mediaCanvas) {
        this.pluginId = ns.GlobalModel.FLASH;
        this.initialize(player, mediaCanvas);
    };

    var p = FlashPluginCtrl.prototype = new ns.AbstractPlayerCtrl();
    p.PlayerCtrl_Override_initialize = p.initialize;
    /**
     * @inheritDoc
     **/
    p.initialize = function (player, mediaCanvas) {

		player.model.currentPluginID = ns.GlobalModel.FLASH;

        // Workaround
        // mediaCanvas is GenerateFlashPluginCmd

        this.flashPlayerInstance = mediaCanvas.mediaCanvasObject;

        // Standardwerte
        this.__duration = 0;
        this.__currentTime = 0;
        this.__preloadingPercent = 0;
        this.__buffering = false;
        this.__seeking = false;
        this.__playing = false;
        this.__initedRecallAutoplay = false;
        this.__forceAutoplay = false;
        this.__inited = false;

        // DVR
        this._dvrEnabled = false;
        this._dvrWindow = -1;
        this._dvrIsLive = false;

        this.PlayerCtrl_Override_initialize(player, mediaCanvas);

        // Ggf liegt bei Autoplay bereits ein Buffering-Indikator auf der Bühne
        this.vc.hideBufferingIndicator();

        // Um schnelleres Laden zu ermöglichen, darf der Player nicht verdeckt sein.
        // Der abstrakte PlayEventHandler reaktiviert den Frame bei Bedarf
        //this.vc.hideAudioFrame();

        // Der Initialisierngsprozess von Flash ist noch nicht
        // fertig, daher müssen wir uns an dieser Stelle an das
        // entsprechende Event hängen
        if (!this.__inited) {
            var that = this;

		    ns.pluginAddListener(player.getId(), function () {
                that.flashReadyListener();
            });
        }
    };

    /**
     * Flash-Callback zur Uebergabe des Over-Zustands
     */
    p.onOverEventCallback = function (x,y) {
        this.vc.fadeInCtrlBarByMouseover();
    };

	/**
	 * Flash-Callback für Einzelklick
	 */
	p.onSingleClickEvenCallback = function () {
        if ( this.vc.optionsControlDiv )
            this.vc.hideAllDialogs();
        else
            this.togglePlay();
	};

	/**
	 * Flash-Callback für Doppelklick
	 */
	p.onDoubleClickEvenCallback = function () {
		if ( this.vc._fullscreenEnabled )
		{
			this.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_FULLSCREEN_DEACTIVATION_VIEWPORT);
		} else
		{
			this.player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_FULLSCREEN_ACTIVATION_VIEWPORT);
		}

		this.vc.toggleFullscreen();
	};

    /**
     * Flash-Callback für Tastatureingaben bei Focus auf dem FP
     * @param keyStr Tasten-ID als String
     */
    p.onKeyboardDownEventCallback = function (keyStr) {
        ns.KeyboardPlayerController.getInstance().handleKeyByString(keyStr);
    };

    /**
     * Flash-Callback zur Aktualisierung der Vorladeprozente bei VOD
     * @param percent Fortschritt in Prozent, 0-100
     */
    p.onPreloading = function (percent) {
        this.__preloadingPercent = percent;
        this.progressEventHandler(null, percent);
    };

    /**
     * Flash-Callback zur aktualisierung der Gesamtlaufzeit des Streams
     * @param time In Sekunden
     */
    p.onDuration = function (time) {
        this.__duration = time;
        this.updateDuration(time);
    };

    /**
     * Flash-Callback zur Aktualisierung der Abspielposition im Stream
     * @param time In Sekunden
     */
    p.onPosition = function (time) {
        this.__currentTime = time;
        this.updateTime(time);
    };

    /**
     * Flash-Callback bei Wechsel zum Zustand "Play"
     */
    p.onPlay = function () {
        this.__playing = true;
        this.playEventHandler();
    };

    /**
     * Flash-Callback bei Wechsel zum Zustand "Stop"
     */
    p.onStop = function () {
        if (this.__playing) {
            this.__playing = false;

            // Sonderfall #2143
            // Flash gibt für Audio-Livestreams ein Stop-Event, statt ein Pauseevent zurück
            try {

                var playingStreamObj = this.getPlayingStreamObject();
                if ( this.model.mediaCollection.getIsLive() &&
                    playingStreamObj.getCDN().toLowerCase() == "icecast" )
                {
                    // Ignore all handlers
                } else
                {
                    this.stopEventHandler();
                }

            } catch (exception)
            {
                this.stopEventHandler();
            }
        }
    };

    /**
     * Flash-Callback bei Wechsel zum Zustand "Pause"
     */
    p.onPause = function () {
        this.__playing = false;
        this.pauseEventHandler();
    };

    /**
     * Flash-Callback bei Wechsel zu Mute/Unmute
     */
    p.onMute = function (isMuted) {
        this.muteEventHandler(null, isMuted);
    };

    /**
     * Flash-Callback bei Wechsel zu Mute/Unmute
     */
    p.onVolume = function (volLevel) {
        this.volumeEventHandler(null, volLevel);
    };

    /**
     * Flash-Callback bei Aktivierung / Deaktivierung von Seek
     */
    p.onSeeking = function (isSeeking) {
        this.__seeking = isSeeking;
    };

    /**
     * Flash-Callback bei Aktivierung / Deaktivierung vom Buffering
     */
    p.onBuffering = function (isBuffering, bufferLength, bufferTime) {
        this.__buffering = isBuffering;
        this.bufferingEventHandler(null, isBuffering);

        if ( this._dvrEnabled )
        {
            var dvrIsLive = (this.__currentTime+bufferLength) >= (this.__duration - 20);
            if ( dvrIsLive != this._dvrIsLive )
            {
                this._dvrIsLive = dvrIsLive;
                this.player.dispatchCustomEvent("AddonDVR.dvrChanged",
                    {
                        dvrEnabled: this._dvrEnabled,
                        dvrIsLive: this._dvrIsLive,
                        dvrWindow: this._dvrWindow
                    }
                );
            }
        }
    };

    /**
     * Flash-Callback bei Zustand Complete
     */
    p.onComplete = function () {
        this.endEventHandler();
    };

    /**
     * Callback für Flash, wird über window dispatched.
     */
    p.flashReadyListener = function () {
        this.__inited = true;

        // Bisherigen Listener entfernen, und Initialisierung fortsetzen
	    ns.pluginRemoveListener(this.player.getId());

        // Initial- Setup erneut durchführen
        this.addEventListeners();
    };

    p._override_addEventListeners = p.addEventListeners;
    /**
     * @inheritDoc
     **/
    p.addEventListeners = function () {

        if (!this.__inited)
            return;

        this._override_addEventListeners();

        var windowRefId = 'eventCtrl' + this.getNormalizedPlayerID();
        ns[ windowRefId ] = this;

        this.flashPlayerInstance.setPreloadingCallback("window.ardplayer." + windowRefId + ".onPreloading");
        this.flashPlayerInstance.setDurationCallback("window.ardplayer." + windowRefId + ".onDuration");
        this.flashPlayerInstance.setPlayCallback("window.ardplayer." + windowRefId + ".onPlay");
        this.flashPlayerInstance.setPositionCallback("window.ardplayer." + windowRefId + ".onPosition");
        this.flashPlayerInstance.setBufferingCallback("window.ardplayer." + windowRefId + ".onBuffering");
        this.flashPlayerInstance.setCompleteCallback("window.ardplayer." + windowRefId + ".onComplete");
        this.flashPlayerInstance.setPauseCallback("window.ardplayer." + windowRefId + ".onPause");
        this.flashPlayerInstance.setStopCallback("window.ardplayer." + windowRefId + ".onStop");
        this.flashPlayerInstance.setSeekingCallback("window.ardplayer." + windowRefId + ".onSeeking");
        this.flashPlayerInstance.setVolumeCallback("window.ardplayer." + windowRefId + ".onVolume");
        this.flashPlayerInstance.setMutedCallback("window.ardplayer." + windowRefId + ".onMute");
        this.flashPlayerInstance.setErrorCallback("window.ardplayer." + windowRefId + ".onError");
        this.flashPlayerInstance.setOverEventCallback("window.ardplayer." + windowRefId + ".onOverEventCallback");
        this.flashPlayerInstance.setSingleClickEventCallback("window.ardplayer." + windowRefId + ".onSingleClickEvenCallback");
        this.flashPlayerInstance.setDoubleClickEventCallback("window.ardplayer." + windowRefId + ".onDoubleClickEvenCallback");
        this.flashPlayerInstance.setOnDVRCallback("window.ardplayer." + windowRefId + ".onDVRCallback");
        this.flashPlayerInstance.setOnPixelCallback("window.ardplayer." + windowRefId + ".onPixelCallback");
        this.flashPlayerInstance.setKeyboardEventCallback("window.ardplayer." + windowRefId + ".onKeyboardDownEventCallback");
        this.flashPlayerInstance.setDebugCallback("window.ardplayer." + windowRefId + ".onDebugCallback");

        // Defaults für Volume aus Cookie lesen, und der FP-Instanz setzen.
        this.setVolume(this.getVolume());
        this.setMuteState(this.getMuteState());

        if (this.__initedRecallAutoplay) {
            this.__initedRecallAutoplay = false;
            this.handelAutoplay(this.pc.getAutoPlayBoolean() === true || this.__forceAutoplay);
        }
    };

    p._super_requestMouseOverEvent = p.requestMouseOverEvent;
    p.requestMouseOverEvent = function () {
        this._super_requestMouseOverEvent();
        try {
            if ( this.flashPlayerInstance &&
                 this.flashPlayerInstance['requestMouseOverEvent'] instanceof Function )
            {
                this.flashPlayerInstance.requestMouseOverEvent();
            }
        } catch (e) {
        }
    };

	/**
	 * Setzt den Inaktivitätsstatus im Flashplugin
	 * @param value
	 */
	p.setUserIdle = function (value) {
        try {
            this.flashPlayerInstance.setUserIdle(value);
        } catch (e) {
        }
	};

    /**
     * Liefert die player id zurück.
     * Ein Minus wird zu einem unterstrich ersetzt
     * @method getNormalizedPlayerID
     * @public
     * @return pid, Typ: String.
     **/
    p.getNormalizedPlayerID = function () {
        var pid = this.player.getId();
        pid = pid.replace("-", "_");

        return pid;
    };

    /**
     * @inheritDoc
     **/
    p.removeEventListeners = function () {

        try {
            var windowRefId = 'eventCtrl' + this.getNormalizedPlayerID();
            ns[ windowRefId ] = undefined;
        } catch ( Exception ) {}

        try {
            ns.pluginRemoveListener(this.player.getId());
        } catch ( Exception ) {}

        this.__inited = false;
    };

    /**
     * @inheritDoc
     **/
    p._override_dispose = p.dispose;
    p.dispose = function () {

        this.removeEventListeners();

        try {

            if (this.flashPlayerInstance && this.flashPlayerInstance.dispose) {
                this.flashPlayerInstance.dispose();
            }

        } catch (e) {
        }

        // Memory leak in IE
        var playerID = this.player.getId();
        var flashContentID = "flashContent" + playerID;

        swfobject.removeSWF(flashContentID);
	    ns.purge(this.flashPlayerInstance);

        this.flashPlayerInstance = null;

        this._override_dispose.apply(this, arguments);
    };

    p._override_handelAutoplay = p.handelAutoplay;
    /**
     * @inheritDoc
     **/
    p.handelAutoplay = function (autoplay) {

        if (!this.__inited) {
            this.__initedRecallAutoplay = true;

            // // // // // // // // // // // // // // //// // // //
            // Embed Flash right now
            var generationCmd = this.mediaCanvas;
            generationCmd.actualEmbedd(this.vc, this);
            // // // // // // // // // // // // // // //// // // //
            return;
        }

        if (!autoplay)
            this.vc.hideBufferingIndicator();

        this._override_handelAutoplay.apply(this, arguments);
    };

    p._override_initStartAndPlayStream = p.initStartAndPlayStream;
    /**
     * @inheritDoc
     **/
    p.initStartAndPlayStream = function () {
        if (this.__forceAutoplay)
            this.startStreaminitialzed = false;

        this._override_initStartAndPlayStream();
    };

    p._override_loadStream = p.loadStream;

    /**
     * @inheritDoc
     **/
    p.loadStream = function () {
        this.__playing = false;

        this._override_loadStream();

        if (!this.__inited) {
            this.__initedRecallAutoplay = true;
            this.__forceAutoplay = true;

            // // // // // // // // // // // // // // //// // // //
            // Embed Flash right now
            var generationCmd = this.mediaCanvas;
            generationCmd.actualEmbedd(this.vc, this);
            generationCmd = null;
            // // // // // // // // // // // // // // //// // // //

        } else {
            var playingStreamObj = this.getPlayingStreamObject();

			if ( !playingStreamObj )
				return;

            var beginOffset = this.pc.getInitialPlayhead();
            if (beginOffset <= 0) {
                beginOffset = this.pc.getStartTime();

                if (beginOffset <= 0) {
                    beginOffset = this.mc.getStartTime();
                }
            }

            // #5597
            // Disable initial seek for all kind of live-streams.
            // Window depends on the stream, initial seek from live-streams (including DVR) cannot be used.
            if ( this.mc.getIsLive() )
                beginOffset = 0;

            if (this.pc.getQoSEnabled()) {
                var additionalMetaData = {};
                additionalMetaData.QOSURL = this.pc.getQoSEndpoint();
                additionalMetaData.QOSINTERVAL = this.pc.getQoSInterval();
                additionalMetaData.QOSMETHOD = this.pc.getQoSMethod();
                additionalMetaData.UUID = this.player.getUniquePlayerId();

                try {
                    this.flashPlayerInstance.loadStreamObject(playingStreamObj, this.mc.getIsLive(), this.mc.getDVREnabled(), beginOffset, additionalMetaData);
                } catch ( err )
                {
                    // Catch any flash interface exceptions
                    console.error(err);
                    this.onError();
                }
            } else {
                try {
                    this.flashPlayerInstance.loadStreamObject(playingStreamObj, this.mc.getIsLive(), this.mc.getDVREnabled(), beginOffset);
                } catch ( err )
                {
                    // Catch any flash interface exceptions
                    console.error(err);
                    this.onError();
                }
            }

	        this.player.pixelController.loadStream(playingStreamObj.getServer() + playingStreamObj.getStream());
        }
    };

    /**
     * @inheritDoc
     **/
    p.stop = function (event) {
        if (this.flashPlayerInstance && this.flashPlayerInstance.api_stop)
            this.flashPlayerInstance.api_stop();
    };

    /**
     * @inheritDoc
     **/
    p.play = function () {
        this.stopOtherPlayingPlayers();

        this.player.viewCtrl.setCtrlBarFading(true);

        if (this.flashPlayerInstance && this.flashPlayerInstance.api_play)
            this.flashPlayerInstance.api_play();
    };

    /**
     * @inheritDoc
     **/
    p.pause = function () {
        if (this.flashPlayerInstance && this.flashPlayerInstance.api_pause)
            this.flashPlayerInstance.api_pause();
    };

    /**
     * @inheritDoc
     **/
    p.togglePlay = function () {
        this.stopOtherPlayingPlayers();

        // #2142 - Chrome fix
        var that = this;
        setTimeout( function () {
            if (that.flashPlayerInstance && that.flashPlayerInstance.togglePlayPause)
                that.flashPlayerInstance.togglePlayPause();
        }, 100);
    };

    /**
     * @inheritDoc
     **/
    p.isPlaying = function () {
        return this.__playing;
    };

    /**
     * @inheritDoc
     **/
    p.setMuteState = function (muteState) {
        if (this.flashPlayerInstance && this.flashPlayerInstance.setMute)
            this.flashPlayerInstance.setMute(muteState);
    };

    /**
     * @inheritDoc
     **/
    p.getMuteState = function () {
        return ns.GlobalModel.getInstance().getMuted();
    };

    /**
     * @inheritDoc
     **/
    p.toggleMuteState = function () {
        this.setMuteState(!this.getMuteState());
    };

    p._override_setVolume = p.setVolume;
    /**
     * @inheritDoc
     **/
    p.setVolume = function (volume) {
        if (this.flashPlayerInstance && this.flashPlayerInstance.setVolume) {
            this._override_setVolume(volume);
            this.flashPlayerInstance.setVolume(volume);
        }
    };

    /**
     * @inheritDoc
     **/
    p._override_setCurrenttime = p.setCurrenttime;
    p.setCurrenttime = function (seconds, preventPlay, preventSeek) {

        if (!this.canSeek())
            return;

        if (!preventSeek && this.flashPlayerInstance && this.flashPlayerInstance.api_seek)
            this.flashPlayerInstance.api_seek(seconds);

        this._override_setCurrenttime(seconds);
    };

    /**
     * @inheritDoc
     **/
    p.seekToLive = function () {
        if (!this.canSeek())
            return;

        if (this.flashPlayerInstance && this.flashPlayerInstance.api_seekToLive)
            this.flashPlayerInstance.api_seekToLive();
    };

    /**
     * @inheritDoc
     **/
    p._override_canSeek = p.canSeek;
    p.canSeek = function() {
        return this._override_canSeek() || this._dvrEnabled;
    };

    /**
     * @inheritDoc
     **/
    p.getCurrenttime = function () {
        return this.__currentTime;
    };

    /**
     * @inheritDoc
     **/
	p._override_setTimeByPercent = p.setTimeByPercent;
    p.setTimeByPercent = function (percent) {
        var destinationTime = percent / 100 * this.__duration;

        // Sonderfall fuer Flash
        // Damit der endEventHandler aufgerufen wird, darf
        // niemals exakt das Ende der Datei angesprungen werden.
        // Daher wir der Wert hier korrigiert.
        if ( percent > 99 )
        {
            destinationTime = this.__duration - 0.5;
        }

        if ( destinationTime > this.__duration )
        {
            destinationTime = this.__duration;
        }

        this.setCurrenttime(destinationTime);

		this._override_setTimeByPercent(percent);

		return destinationTime;
    };

    /**
     * @inheritDoc
     **/
    p.getTimeAsPercent = function () {
        if (this.__duration > 1)
            return (this.__currentTime / this.__duration) * 100;
        return 0;
    };

    /**
     * @inheritDoc
     **/
    p.getDuration = function () {
        return this.__duration;
    };

    /**
     * @inheritDoc
     **/
    p.useBindClickOnStage = function () {
        return false;
    };

    /**
     * Diese Methode wird getriggerd, wenn der Flashfilm einen Fehler meldet.
     * @method onError
     * @public
     * @return void
     **/
    p.onError = function () {
        this.player.errorCtrl.throwStreamError(ns.ErrorController.ERROR_PLAYBACK);
    };

	/**
	 * Diese Methode wird seitens Flash aufgerufen, wenn eine verpixelte Aktion ausgelöst werden
	 * soll.
	 * @param pixelName
	 * @param pixelData
	 */
	p.onPixelCallback = function (pixelName, pixelRepeat, data) {
		this.player.pixelController.triggerCustomPixel(pixelName, pixelRepeat, data);
	};

    p.onDebugCallback = function (args) {
        console.log("Flash Debug: " + args);
    };

    ns.FlashPluginCtrl = FlashPluginCtrl;

})(ardplayer, ardplayer.jq, ardplayer.console);
