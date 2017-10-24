/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Saban Uenlue
 * @module core
 **/
(function (ns, $, console) {
    "use strict";

    /**
     * Diese Klasse wird als Abstrakte-Klasse genutzt. Die jeweiligen Controll-Klassen für die diversen Player erben von dieser Klasse.
     * @class AbstractPlayerCtrl
     * @constructor
     * @public
     **/
    var AbstractPlayerCtrl = function (player, mediaCanvas) {
        this.pluginId = -1;
    };

    var p = AbstractPlayerCtrl.prototype;

    /**
     * Initialization method.
     * @method initialize
     * @protected
     * @param player Player Player-Instanz für den der kontroller erstellt wird
     * @mediCanvas jQuery Object | HTML-Element das den player repräsentiert.
     **/
    p.initialize = function (player, mediaCanvas) {
        if (mediaCanvas) {
            this.mediaCanvas = mediaCanvas;
        }

        if (player && player instanceof ns.Player) {

            /**
             * Diese Variable weiß, ob das Video Objekt schon über Sources verfügt und der InitalStream anliegt
             * @property startStreaminitialzed
             * @type boolean.
             */
            this.startStreaminitialzed = false;
            /**
             * Player der genutzt wird.
             * @property player
             * @type Player.
             */
            this.player = player;
            /**
             * PlayerModel für den zugewiesenen Player, der als Parameter übergeben wurde.
             * @property model
             * @type PlayerModel
             */
            this.model = this.player.model;
            /**
             * PlayerConfiguration für den zugewiesenen Player, der als Parameter übergeben wurde.
             * @property pc
             * @type PlayerConfiguration
             */
            this.pc = this.model.playerConfig;
            /**
             * MediaCollection für den zugewiesenen Player, der als Parameter übergeben wurde.
             * @property mc
             * @type MediaCollection
             */
            this.mc = this.model.mediaCollection;
            /**
             * ViewController für den zugewiesenen Players, der als Parameter übergeben wurde.
             * @property vc
             * @type ViewController
             */
            this.vc = this.player.viewCtrl;
            /**
             * GlobalModel für das gesamte Projekt
             * @property g
             * @type GlobalModel
             */
            this.g = ns.GlobalModel.getInstance();

            // Notify plugins
            this.player.dispatchCustomEvent(ns.Player.EVENT_INIT);

            // Defaults
            this._lastSubclipSeektrigger = 0;
            this._lastPlayheadUpdateTime = 0;

            this.addEventListeners();

            if (this.pc.getAutoPlayBoolean() === true) {

                if (!ns.GlobalModel.getInstance().browserIsFirefox)
                {
                    this.__initTimeout = setTimeout(function () {
                        this.handelAutoplay(true);
                    }.bind(this), 1);
                }
                else {
                    if (this instanceof ns.HtmlAudioCtrl || this instanceof ns.HtmlVideoCtrl) {
                        // Some Versions auf Firefox need some time for HTML rendering
                        this.__initTimeout = setTimeout(function () {
                            this.handelAutoplay(true);
                        }.bind(this), 1000);
                    }
                    else {
                        this.__initTimeout = setTimeout(function () {
                            this.handelAutoplay(true);
                        }.bind(this), 1);
                    }
                }
            } else {
                this.vc.bindPosterframe();
                this.vc.bindPosterControl();
            }
        }
        else {
            var errorCtrl = ns.ErrorController.getInstance();
            errorCtrl.throwError(ns.ErrorController.ILLEGAL_ARGUMENTS);
        }

        /*
         * aktueller volumeWert
         * @public
         * @property currentVolumeValue
         * @type Number
         * */
        this.currentVolumeValue = this.g.getVolume();

        /*
         * Startposition des Wiedergabevorgangs, zur Visualisierung im Slider
         * @public
         * @property playHeadStart
         * @type Number
         * */
        this._playHeadStart = 0;

        this._percentBuffered = 0;

        if (this.player.model.playerConfig.getOnStatusChangeFunction()) {
            this.player.model.playerConfig.getOnStatusChangeFunction()("init");
        }

        this.player.dispatchCustomEvent(
            ns.Player.EVENT_STATUS_CHANGE, {status:"init"} );
    };

    /**
     * Methode wird von den Klassen aufgerufen, die diese Klasse erben.
     * Definiert ein StandardVerhalten und so wird doppelter Code vermieden.
     * Das Buffering des Videos wird im späteren Verlauf hier verarbeitet.
     * @method bufferingEventHandler
     * @public
     * @param event. Event, das gebunden werden soll.
     * @param bufferingState - Gibt an, ob die Pufferung an ist.
     **/
    p.bufferingEventHandler = function (event, bufferingState) {

        if (bufferingState && !this.isAtEnd) {
            this.vc.showBufferingIndicator();
        } else {
            this.vc.hideBufferingIndicator();
        }

        // Notify plugins
        this.player.dispatchCustomEvent( ns.Player.EVENT_BUFFERING, {isBuffering:bufferingState} );
    };

    /**
     * Methode wird von den Klassen aufgerufen, die diese Klasse erben.
     * Definiert ein StandardVerhalten und so wird doppelter Code vermieden.
     * Die Methode wird aufgerufen, wenn man auf den Posterframe klickt.
     * @method posterframeClickHandler
     * @public
     */
    p.posterframeClickHandler = function () {

        // Falls das durch den Cookie gesetzte Plugin abweicht,
        // und die Konfiguration es zulässt, muss das aktive Plugin
        // gewechselt werden (#3050).
        var cookiePluginId = this.g.getPluginID(true);

        if (this.pluginId !== cookiePluginId &&
            this.mc.getSortierung().indexOf(cookiePluginId) >= 0)
        {
            if ( (cookiePluginId == ns.GlobalModel.FLASH && this.g.isFlashSupported) ||
                 (cookiePluginId == ns.GlobalModel.HTML5 && this.g.isHTML5Supported)
                )
            {
                if ( this.vc )
                {
                    this.vc.changePluginSelection(cookiePluginId);
                    this.pc.setAutoPlay(true);

                    switch (cookiePluginId)
                    {
                        case ns.GlobalModel.FLASH:
                            this.vc.activateFlash();
                            break;
                        case ns.GlobalModel.HTML5:
                            this.vc.activateHTML();
                            break;
                    }
                    return;
                }
            }
        }

        this.vc.hidePosterFrame();
        this.vc.hidePosterControl();

        this.vc.setCtrlBarFading(true);

        if (this.startStreaminitialzed) {

            // #10560
            if ( this.player.getDuration() - this.player.getCurrenttime() < 10 )
                this.player.seekTo(0);

            this.play();
        }
        else
            this.initStartAndPlayStream();
    };

    /**
     * Methode wird von den Klassen aufgerufen, die diese Klasse erben.
     * Definiert ein StandardVerhalten und so wird doppelter Code vermieden.
     * Die Methode wird aufgerufen, wenn man auf den auf den mute-Button klickt.
     * @method muteEventHandler
     * @public
     */
    p.muteEventHandler = function (event, muteState) {
        // #2686
        this.vc.hideAllDialogs();

        this.vc.showMutedState(muteState);
        ns.GlobalModel.getInstance().setMuted(muteState);
    };

    /**
     * Methode wird von den Klassen aufgerufen, die diese Klasse erben.
     * Definiert ein StandardVerhalten und so wird doppelter Code vermieden.
     * Diese Methode wird getriggerd, wenn ein progressEvent gefeuert wird.
     * Führt im Anschluss das Event und Verhalten aus, das hinzugefügt wurde.
     * @method progressEventHandler
     * @public
     * @param event. Event das getrigged werden soll.
     * @param percentLoaded. Number. Wert des aktuellen Fortschritts.
     *
     */
    p.progressEventHandler = function (event, percentLoaded) {
        var event = $.Event("activeprogress");
        event.percentLoaded = percentLoaded;
        $(this).trigger(event);

        this.vc.updateProgress(percentLoaded);
        this._percentBuffered = percentLoaded;
    };

    /**
     * Methode wird von den Klassen aufgerufen, die diese Klasse erben.
     * Definiert ein StandardVerhalten und so wird doppelter Code vermieden.
     * Diese Methode wird getriggerd, wenn ein der aktuelle Lautstärlewert geändert wurde.
     * @method volumeEventHandler
     * @public
     * @param event. Event.
     * @param volume. Aktueller Lautstärkewert.
     */
    p.volumeEventHandler = function (event, volume) {
        if (volume > 1)
            volume = volume / 100;

        this.player.model.playerConfig.setInitialVolume(volume);
        ns.GlobalModel.getInstance().setVolume(volume);
		this.vc.setVolumeSliderCssValue(volume);

		this.vc.showMutedState(volume < 0.05);
    };

    /**
     * Methode wird von den Klassen aufgerufen, die diese Klasse erben.
     * Definiert ein StandardVerhalten und so wird doppelter Code vermieden.
     * Diese Methode wird getriggerd, wenn etwas zurückgesetzt werden soll.
     * @method resetEventHandler
     * @public
     * @param event. Event.
     */
    p.resetEventHandler = function (event) {
        this.vc.updateProgress(0);
    };

    /**
     * Methode wird von den Klassen aufgerufen, die diese Klasse erben.
     * Definiert ein StandardVerhalten und so wird doppelter Code vermieden.
     * Diese Methode wird getriggerd, wenn ein Stream abgespielt werden soll
     * Führt im Anschluss das Event und Verhalten aus, das hinzugefügt wurde.
     * @method playEventHandler
     * @public
     * @param event. Event, das hinzugefügt wurde.
     */
    p.playEventHandler = function (event) {

	    var pl = this.vc.player,
            m = pl.model,
            pc = m.playerConfig,
            mc = m.mediaCollection;

        this.stopOtherPlayingPlayers();

        this.stopDVRTicker();

        // #3050

        //save into cookie
        this.g.setPluginID(this.pluginId, this.pc.getAutoSave());

        // #2686
        this.vc.hideAllDialogs();

        this.vc.fadeInCtrlBar();

        // 6899
        this.vc.fadeoutPrerollInfoBanner();

		var that = this;
		that.preventIdleEvent = false;

        this.vc.playerDiv
            .off('.useridle')
            .on('useractive.useridle', function () {
				if ( that.preventIdleEvent )
					return;

				if ( that.vc )
					that.vc.onUserActivity(true);
			})
            .on('userinactive.useridle', {idletime:2500, idle:false}, function () {
				that.preventIdleEvent = true;
				setTimeout(function () {
					that.preventIdleEvent = false;
				}, 500);

				if ( that.vc )
					that.vc.onUserActivity(false);
			});

        if (!ns.GlobalModel.getInstance().isMobileDevice) {
            this.vc.playerDiv
                .mouseover(ns.Delegate.create(this.vc, this.vc.fadeInCtrlBarByMouseover))
                .mousemove(ns.Delegate.create(this.vc, this.vc.fadeInCtrlBarByMouseover));
        }

        this.vc.showPlayPauseState("play");
        this.vc.hidePosterFrame();
        this.vc.hidePosterControl();
        this.vc.showAudioFrame();

        if (mc.getType() == "audio") {
            this.vc.showEqualizerPlaying();
        }

        this.vc.hidePlayAgain();

        this.vc.setForceCtrlBarVisible(false, true);
        this.vc.setCtrlBarFading(true);

        var event = $.Event("activeplay");
        event.vc = this.vc;

        event.player = pl;
        event.playerDiv = this.vc.playerDiv;
        event.model = m;
        event.playerConfig = pc;
        event.mediaCollection = mc;

        $("body").trigger(event);

        if (this.player.model.playerConfig.getOnStatusChangeFunction()) {
            this.player.model.playerConfig.getOnStatusChangeFunction()("play");
        }

        this.player.dispatchCustomEvent(
            ns.Player.EVENT_STATUS_CHANGE, {status:"play"} );

        this.isAtEnd = false;

        // Falls im Cookie keine Lautstärke definiert wurde, Wert aus der
        // Konfiguration übernehmen!
        var v = Number(ns.GlobalModel.getInstance().cookie.get(ns.Cookie.VOLUME_VALUE));
        if (isNaN(v) == true) {
            v = pc.getInitialVolume();
        }

        this.vc.showMutedState(ns.GlobalModel.getInstance().getMuted());
        this.vc.setVolumeSliderCssValue(v);
        //this.setVolume(v);

        // Notify plugins
        this.player.dispatchCustomEvent( ns.Player.EVENT_PLAY_STREAM );

        // Replay Event wird geworfen wenn ein Clip bis zum Ende geschaut wurde.
        if(this.player.pixelController._isReplay){
            this.player.pixelController.triggerCustomPixel (ns.PlayerPixelController.SUPER_REPLAY);
            this.player.pixelController._isReplay = false;
        }

		// Trigger Pixel
		this.player.pixelController.initialPlayTrigger();

        //console.log("current playstate is", m.playstate, "pluginChangeInProgress", m.pluginChangeInProgress)

        // Pauszustand beibehalten (#7549)
        if (m.playstate == ns.PlayerModel.PLAYSTATE_PAUSED && m.pluginChangeInProgress) {
            this.pause();
            // Abspielzustand hinterlegen
            m.playstate = ns.PlayerModel.PLAYSTATE_PAUSED;
        } else {
            // Abspielzustand hinterlegen
            m.playstate = ns.PlayerModel.PLAYSTATE_PLAYING;
        }

        // Wechselzustand hinterlegen
        m.pluginChangeInProgress = false;
    };

    /**
     * Abstrakte Methode, die das MouseOver-Event zusaetzlich von
     * Player-Plugins erfragt. Primaer ist diese fuer Flash relevant,
     * da diese Events nicht ueber JS zuverlaessig ankommen.
     * @method requestMouseOverEvent
     * @public
     */
    p.requestMouseOverEvent = function () {
        // abstract
    };

    /**
     * Methode wird von den Klassen aufgerufen, die diese Klasse erben.
     * Definiert ein StandardVerhalten und so wird doppelter Code vermieden.
     * Diese Methode wird getriggerd, wenn ein Stream pausiert werden soll
     * @method pauseEventHandler
     * @public
     * @param event. Event, das hinzugefügt wurde.
     */
    p.pauseEventHandler = function (event) {

        var pl = this.vc.player,
            m = pl.model,
            mc = m.mediaCollection;

        // #2686
        this.vc.hideAllDialogs();

        if (mc.getType() == "audio") {
            this.vc.showEqualizerStopping();
        }

        this.vc.playerDiv.off('.useridle');

        this.vc.showPlayPauseState("pause");

        this.vc.hideBufferingIndicator();

        if (this.player.model.playerConfig.getOnStatusChangeFunction()) {
            this.player.model.playerConfig.getOnStatusChangeFunction()("pause");
        }

        this.player.dispatchCustomEvent(
            ns.Player.EVENT_STATUS_CHANGE, {status:"pause"} );

        //new wegen Ticket #1492
        this.showPlayerBarAndHidePosterControl();

        // Notify plugins
        this.player.dispatchCustomEvent( ns.Player.EVENT_PAUSE_STREAM );

        // Abspielzustand hinterlegen
        m.playstate = ns.PlayerModel.PLAYSTATE_PAUSED;

        if (this._dvrEnabled)
            this.startDVRTicker();
    };

    /**
     * Methode wird von den Klassen aufgerufen, die diese Klasse erben.
     * Definiert ein StandardVerhalten und so wird doppelter Code vermieden.
     * Diese Methode wird getriggerd, wenn ein Stream gestoppt werden soll
     * @method pauseEventHandler
     * @public
     * @param event. Event, das hinzugefügt wurde.
     */
    p.stopEventHandler = function (event) {

		// #5229
		// Flash dispatched den Stop-Eventhandler nach dem endEventhandler.
		// Diese Abfrage korrigiert das Verhalten, dass Stop-Events nach dem
		// Streamenede berücksichtigt werden.
		if ( this.isAtEnd )
			return;

        var pl = this.vc.player,
            m = pl.model,
            mc = m.mediaCollection,
            pc = m.playerConfig,
            vc = this.vc;

        // #2686
        this.vc.hideAllDialogs();

        if (mc.getType() == "audio") {
            vc.showEqualizerStopping();
        }

        vc.showPlayPauseState("pause");

        if (pc.getOnStatusChangeFunction()) {
            pc.getOnStatusChangeFunction()("stop");
        }

        this.player.dispatchCustomEvent(
            ns.Player.EVENT_STATUS_CHANGE, {status:"stop"} );

        this.bufferingEventHandler(null, false);

        /*
         //eindokumentiert wegen Ticket #1492 Neues Vehalten des Players im Pause-, bzw. Stop-Modus: die Playerleiste bleibt stehen - es wird kein zusätzlicher Play-Button angezeigt
         this.vc.setCtrlBarFading(false);
         this.vc.fadeOutCtrlBar();
         */

        if (mc.getPreviewImage().length > 0 &&
            !(pc.getShowEqualizer() && mc.getType() == "audio") ) {
            vc.bindPosterframe();
            vc.bindPosterControl();
        }

        //new wegen Ticket #1492
        this.showPlayerBarAndHidePosterControl();

        // Notify plugins
        this.player.dispatchCustomEvent( ns.Player.EVENT_STOP_STREAM );

        // Abspielzustand hinterlegen
        m.playstate = ns.PlayerModel.PLAYSTATE_STOPPED;
    };


    p.showPlayerBarAndHidePosterControl = function () {
        //neuer code-teil, wegen Ticket #1492 Neues Vehalten des Players im Pause-, bzw. Stop-Modus: die Playerleiste bleibt stehen - es wird kein zusätzlicher Play-Button angezeigt
        //this.vc.fadeInCtrlBar();
        //this.vc.setCtrlBarFading(true);
        this.vc.setForceCtrlBarVisible(true);

        this.vc.hidePosterControl();
    };


    /**
     * Methode wird von den Klassen aufgerufen, die diese Klasse erben.
     * Definiert ein StandardVerhalten und so wird doppelter Code vermieden.
     * Diese Methode wird getriggerd, wenn das Playerconfiguration-objekt ein mediaFinished-event getriggerd wurde.
     * @method endEventHandler
     * @public
     * @param event. Event, das hinzugefügt wurde.
     */
    p.endEventHandler = function (event) {
	    this.player.pixelController.triggerCustomPixel (ns.PlayerPixelController.CLIP_ENDED);
        var pl = this.vc.player,
            m = pl.model,
            mc = m.mediaCollection;

        this.pauseEventHandler(event);

        // Ermöglicht die Einbindung eines externen Listeners
        // für den Zustand, dass der Stream beendet wurde.
        if (this.player.model.playerConfig.getOnMediaFinishedFunction()) {
            this.player.model.playerConfig.getOnMediaFinishedFunction()();
        }

        this.vc.hidePosterFrame();
        this.vc.hidePosterControl();

        // Bei VOD / AOD zeigen wir den erneut Abspielen Button
        if (!this.mc.getIsLive())
            this.vc.showPlayAgain();

        this.vc.hideBufferingIndicator();
		this.vc.exitFullscreen();

        //setzt das Flag _isReplay im pixelController auf true
        this.isAtEnd = this.player.pixelController._isReplay = true;

        this.showPlayerBarAndHidePosterControl();

        // Notify plugins
        this.player.dispatchCustomEvent( ns.Player.EVENT_END_STREAM );

        // Abspielzustand hinterlegen
        m.playstate = ns.PlayerModel.PLAYSTATE_STOPPED;
    };

    /**
     * Methode wird von den Klassen aufgerufen, die diese Klasse erben.
     * Definiert ein StandardVerhalten und so wird doppelter Code vermieden.
     * Diese Methode fügt weitere Metadaten in das PlayerModel hinzugefügt.
     * @method setMetaData
     * @public
     * @param event. Event, das hinzugefügt wurde.
     * @param metaData. object. Metadaten die hinzugefügt werden sollen.
     */
    p.setMetaData = function (event, metaData) {
        this.model.setMetaDaten(metaData);
    };

    /**
     * Methode wird von den Klassen aufgerufen, die diese Klasse erben.
     * Definiert ein StandardVerhalten und so wird doppelter Code vermieden.
     * Diese Methode gibt die Metadaten aus dem PlayerModel zurück.
     * @method getMetaData
     * @public
     * @return metaData. object. Metadaten die hinzugefügt worden sind.
     */
    p.getMetaData = function () {
        return this.model.getMetaDaten();
    };

    /**
     * Gibt die Laufzeit in Sekunden zurück, falls vom Controller unterstützt
     * @method getDuration
     * @public
     */
    p.getDuration = function () {
        return 0;
    };

    /**
     * Methode wird von den Klassen aufgerufen, die diese Klasse erben.
     * Definiert ein StandardVerhalten und so wird doppelter Code vermieden.
     * Diese Methode setzt die Aktuelle Laufzeit des Streams in das PlayerModel und in die Mehtode updateTotalTime des ViewControllers ein.
     * @method updateDuration
     * @public
     * @param seconds. Number. Aktuelle Laufzeit des Streams
     */
    p.updateDuration = function (seconds) {
        //log ( "AbstractPlayer.updateDuration duration: " + seconds );

        if (this.model.getDuration() !== seconds) {
            this.model.setDuration(seconds);
            this.vc.updateTotalTime(seconds);

            // Notify plugins
            this.player.dispatchCustomEvent(ns.Player.EVENT_UPDATE_STREAM_DURATION, {duration:seconds});
        }

    };
    /**
     * Das Medium wird von Beginn an wieder neu abgespielt
     * @method restartMedia
     * @public
     * @return void
     */
    p.restartMedia = function () {
		this.jumpToStart();
		this.play();
    };

    /**
     * Methode wird von den Klassen aufgerufen, die diese Klasse erben.
     * Definiert ein StandardVerhalten und so wird doppelter Code vermieden.
     * Diese Methode setzt die Aktuelle Laufzeit des Streams in das PlayerModel und in die Mehtode updateTotalTime des ViewControllers ein.
     * @method updateTime
     * @public
     * @param seconds. Number. Aktuelle Laufzeit des Streams
     */
    p.updateTime = function (seconds) {
        this.model.setTime(seconds);
        this.vc.updateTime(seconds);
        this.vc.updateTimeline(seconds, this.model.getDuration() || 0);

        if (this.model.playerConfig.getOnTimeUpdateFunction()) {
            this.model.playerConfig.getOnTimeUpdateFunction()(seconds);
        }

        var now = Date.now();
        if ( now >= this._lastPlayheadUpdateTime + 1000 )
        {
            this._lastPlayheadUpdateTime = now;

            // Calculate dvr timings
            var dvrRelativeTime = 0,
                duration = Math.round(this.vc._lastDuration),
                pixelSeconds = Math.round(seconds);

            if (this.vc._dvrEnabledAndRequested && !this.vc._dvrIsLive ) {
                dvrRelativeTime = Math.min(Math.round(this.vc._lastDuration - seconds), duration);
            }

            this.player.pixelController.triggerCustomPixel (ns.PlayerPixelController.SUPER_PLAYHEAD_POSITION, false, {currentTime:pixelSeconds, duration:duration, dvrRelativeTime:-dvrRelativeTime});
        }

        // Subclipping
        var startTime = this.model.playerConfig.getStartTime();
        var endTime = this.model.playerConfig.getEndTime();

        var mcStartTime = this.model.mediaCollection.getStartTime();
        var mcEndTime = this.model.mediaCollection.getEndTime();
        if (mcStartTime > 0)
            startTime = mcStartTime;
        if (mcEndTime > 0)
            endTime = mcEndTime;

        if (startTime > 0 && seconds < startTime) {
            // Vermeiden, dass unscharfe Suchen zu einem Loop führen
            var thisInterpolatedTrigger = Math.round(seconds);
            if (Math.abs(this._lastSubclipSeektrigger - thisInterpolatedTrigger) > 3) // unschärfe
            {
                this.player.seekTo(startTime);
                this._lastSubclipSeektrigger = thisInterpolatedTrigger;
            }

        } else {
            if (endTime > 0 && seconds > endTime) {
				this.player.seekTo(startTime);
				this.player.pause();
            }
        }

        // Notify plugins
        this.player.dispatchCustomEvent(ns.Player.EVENT_UPDATE_STREAM_TIME, {currentTime:seconds});
    };

    /**
     * Methode wird von den Klassen aufgerufen, die diese Klasse erben.
     * Definiert ein StandardVerhalten und so wird doppelter Code vermieden.
     * Diese Methode fügt die Methoden an die Elemente innerhalb des ViewControllers.
     * @method addEventListeners
     * @public
     */
    p.addEventListeners = function () {
        this.vc.bindPlayPause();
        this.vc.bindMute();

        if (this.player.model.playerConfig.getOnStatusChangeFunction()) {
            this.player.model.playerConfig.getOnStatusChangeFunction()("ready");
        }

        this.player.dispatchCustomEvent(
            ns.Player.EVENT_STATUS_CHANGE, {status:"ready"} );
    };

    /**
     * Diese Methode steuert, ob im Viewcontroller das Klick-Event auf dem
     * MediaCanvas registriert werden darf. Standardmäßig wird true zurückgegeben.
     * Durch die Auslagerung in den Controller kann das Verhalten bei Bedarf deaktiviert werden.
     * @public
     */
    p.useBindClickOnStage = function () {
        return true;
    };

    /**
     * Diese Methode entfernt die möglichen gebundenen Eventlistener
     * Diese Methode ist eine Template Methode und muss von den Klassen überschrieben werden, die von dieser Klasse erben.
     * @method removeEventListeners
     * @public
     */
    p.removeEventListeners = function () {
        //dies ist eine Template Methode und muss überschrieben werden
        this.player.errorCtrl.throwError(ns.ErrorController.OVERRIDING_TEMPLATE_METHOD, ns.ErrorController.IS_CRITICAL_YES, "removeEventListener");
    };

    /**
     * Entfernt diverse Elemente um sie für den garbage collector zum löschen freizugeben.
     * Explizit wird die removeEventListeners-Methode aufgerufen.
     * @method dispose
     * @public
     */
    p.dispose = function () {
        this.removeEventListeners();

        this.stopDVRTicker();

        clearTimeout(this.__initTimeout);

        this.player.dispatchCustomEvent( ns.Player.EVENT_STOP_STREAM );
        this.player = null;

        this.model = null;
        this.pc = null;
        this.mc = null;
        this.vc = null;
        this.g = null;
    };

    /**
     * Diese Methode handhabt die autoPlay-Funktionalität ab.
     * Wenn der autoplay-Parameter true ist, wird der Stream direkt abgespielt, ansonsten wird das posterfram angezeigt,
     * @method handelAutoplay
     * @public
     * @param autoplay. Boolean.
     */
    p.handelAutoplay = function (autoplay) {
        if (autoplay) {
            this.initStartAndPlayStream();

			if (!ns.GlobalModel.getInstance().isMobileDevice)
				ns.GlobalModel.getInstance().keyboardPlayerController.bindAutoplay();
        }
    };

    /**
     * Gibt die Streamqualität zurück, die für den übergebenen Parameterwert hinterlegt wurde.
     * Wenn für den übergebenen Parameter ein Qualitätswert vorhanden ist, wird dieser zurückgegeben.
     * Ansonsten ist das Ergebnis 'undefined'.
     * @method getStreamByQualityIndex
     * @param streamQualityIndex. Number. Wert der überprüft werden soll.
     * @return {*}. object.
     */
    p.getStreamByQualityIndex = function (streamQualityIndex) {
		var media = this.getMediaStreamArray();
		if ( !media )
		{
            this.player.errorCtrl.throwStreamError(ns.ErrorController.ERROR_PLAYBACK, true);
			return false;
		}

        var stream = media [ streamQualityIndex ];

		if ( streamQualityIndex == "auto")
		{
			stream = media [ "auto" ];
		}

        if (!stream) {
			var vc = this.player.viewCtrl;

			if (vc.representationQualityOrder.length > 0)
			{
				console.log("[ARD Player] stream miss: " + this.model.currentPluginID + ":" + vc.representationQuality);
				console.log("[ARD Player] => stream switch: " + this.model.currentPluginID + ":" + vc.representationQualityOrder[0])
				vc.representationQuality = vc.representationQualityOrder.shift();

                vc.updateOptionButtonVisibility();

				return this.getStreamByQualityIndex(checkDefaultQuality(vc.representationQuality));
			}
        	else {
				if ( vc.representationQualityOrderAutofix || vc.representationErrorTriggered )
				{
					this.player.errorCtrl.throwStreamError(ns.ErrorController.ERROR_PLAYBACK);
				} else
				{
					this.player.errorCtrl.throwStreamError(ns.ErrorController.MISCONF_MEDIA_COLL);
				}
				return false;
			}
		}

        return stream;
    };

    /**
     * Methode gibt das aktuelle, für das Plugin vorgesehene, MediaArray zurück
     * @method getMediaStreamArray
     * @public
     * @return Array\null
     */
    p.getMediaStreamArray = function () {
        var mc = this.player.model.mediaCollection;
        var ma = mc.getMediaArray();
        if ( ma )
        {
            var maHTML = ma[this.pluginId];
            if (maHTML)
                return maHTML.getMediaStreamArray();
        }

        return null;
    };

    /**
     * Ermittelt auf Basis des aktuellen Viewports, sowie des spielenden Controllers
     * den idealen Stream.
     */
    p.getPlayingStreamObject = function () {
        var normalizedQuality = checkDefaultQuality(this.vc.representationQuality);
        return this.getStreamByQualityIndex(normalizedQuality);
    };

    /**
     * Gibt die Standardqualität des übergebenen Mediacollection zurück
     * Wenn der übergebene Parameter gleich dem ist der eingestellt wird, wird der Parameter zurückgegeben, ansonsten der Wert 0.
     * @method checkDefaultQuality
     * @param quality. Number. WErt der überprüft werden soll.
     * @return {*}. Number.
     */
    function checkDefaultQuality(quality) {
        if (quality && (!isNaN(quality) || quality == "auto"))
            return quality;

        return 0;
    }

    /**
     * Diese Methode wird von der handelAutoplay() aufgerufen.
     * Sie setzt die passenden Flags und lädt den Stream.
     * Im Anschluss daran wird, wird dieser abgespielt.
     * @method initStartAndPlayStream
     * @public
     */
    p.initStartAndPlayStream = function () {
        if (this.startStreaminitialzed === false) {
            this.loadStream();
            this.startStreaminitialzed = true;
        }

        this.play();

		if ( this.model == null )
			return;

        var startTime = this.model.playerConfig.getStartTime();
        var mcStartTime = this.model.mediaCollection.getStartTime();
        if (mcStartTime > 0)
            startTime = mcStartTime;

		// Positionsuebernahme bei Qualitaetswechsel
		if ( this.pc.getRememberCurrentTime() && this.pc.getInitialPlayhead() > 0 )
			startTime = this.pc.getInitialPlayhead();

		if ( startTime > 0 )
        	this.player.seekTo(startTime);
    };

    p.stopOtherPlayingPlayers = function () {
        var otherPlayingPlayers = ns.PlayerModel.getPlayingPlayer(this.player);
        $.each(otherPlayingPlayers, function (key, value) {
            value.getCtrl().pause();
        });
    };

    /**
     * Diese Methode lädt den Stream der übergeben wurde.
     * Diese Methode ist eine Template Methode und muss von den Klassen überschrieben werden, die von dieser Klasse erben.
     * @method loadStream
     * @public
     */
    p.loadStream = function () {
        this.stopOtherPlayingPlayers();

        this.stopDVRTicker();

        this.loadStreamInitialized = true;

        // Notify plugins
        this.player.dispatchCustomEvent(ns.Player.EVENT_LOAD_STREAM);
    };

    /**
     * Diese Methode spielt den Stream der übergeben wurde ab.
     * Diese Methode ist eine Template Methode und muss von den Klassen überschrieben werden, die von dieser Klasse erben.
     * @method play
     * @public
     */
    p.play = function () {
        //dies ist eine Template Methode und muss überschrieben werden
        this.player.errorCtrl.throwError(ns.ErrorController.OVERRIDING_TEMPLATE_METHOD, ns.ErrorController.IS_CRITICAL_YES, "play");
    };

    /**
     * Diese Methode pausiert den Stream der übergeben wurde ab.
     * Diese Methode ist eine Template Methode und muss von den Klassen überschrieben werden, die von dieser Klasse erben.
     * @method pause
     * @public
     */
    p.pause = function () {
        //dies ist eine Template Methode und muss überschrieben werden
        this.player.errorCtrl.throwError(ns.ErrorController.OVERRIDING_TEMPLATE_METHOD, ns.ErrorController.IS_CRITICAL_YES, "pause");
    };

    /**
     * Diese Methode toggelt den Playstatus des übergeben Streams.
     * Diese Methode ist eine Template Methode und muss von den Klassen überschrieben werden, die von dieser Klasse erben.
     * @method togglePlay
     * @public
     */
    p.togglePlay = function () {
        //dies ist eine Template Methode und muss überschrieben werden
        this.player.errorCtrl.throwError(ns.ErrorController.OVERRIDING_TEMPLATE_METHOD, ns.ErrorController.IS_CRITICAL_YES, "togglePlay");
    };

    /**
     * Diese Methode setzt den isPlaying-status innerhalb des jeweiligen Controllers.
     * Diese Methode ist eine Template Methode und muss von den Klassen überschrieben werden, die von dieser Klasse erben.
     * @method isPlaying
     * @public
     */
    p.isPlaying = function () {
        //dies ist eine Template Methode und muss überschrieben werden
        this.player.errorCtrl.throwError(ns.ErrorController.OVERRIDING_TEMPLATE_METHOD, ns.ErrorController.IS_CRITICAL_YES, "isPlaying");
    };

    /**
     * Diese Methode setzt den Mute-status innerhalb des jeweiligen Controllers.
     * Diese Methode ist eine Template Methode und muss von den Klassen überschrieben werden, die von dieser Klasse erben.
     * @method setMuteState
     * @public
     * @param muteStatus Boolean.
     */
    p.setMuteState = function (muteState) {
        ns.GlobalModel.getInstance().setMuted(muteState);
    };

    /**
     * Diese Methode gibt den Mute-status zurück, der innerhalb des jeweiligen Controllers gesetzt wurde.
     * Diese Methode ist eine Template Methode und muss von den Klassen überschrieben werden, die von dieser Klasse erben.
     * @method setMuteState
     * @public
     */
    p.getMuteState = function () {
        return ns.GlobalModel.getInstance().getMuted();
    };

    /**
     * Diese Methode toggelt den Mutetatus des übergeben Streams.
     * Diese Methode ist eine Template Methode und muss von den Klassen überschrieben werden, die von dieser Klasse erben.
     * @method toggleMuteState
     * @public
     */
    p.toggleMuteState = function () {
        //dies ist eine Template Methode und muss überschrieben werden
        this.player.errorCtrl.throwError(ns.ErrorController.OVERRIDING_TEMPLATE_METHOD, ns.ErrorController.IS_CRITICAL_YES, "toggleMuteState");
    };

    /**
     * Diese Methode setzt den Volumewert innerhalb des jeweiligen Controllers.
     * Diese Methode ist eine Template Methode und muss von den Klassen überschrieben werden, die von dieser Klasse erben.
     * @method setVolume
     * @public
     * @param volume. Number.
     */
    p.setVolume = function (volume) //zwischen 0-1
    {
        this.currentVolumeValue = volume;
        ns.GlobalModel.getInstance().setVolume(volume);
    };

    /**
     * Diese Methode gibt den Volumewert zurück, innerhalb des jeweiligen Controllers.
     * Diese Methode ist eine Template Methode und muss von den Klassen überschrieben werden, die von dieser Klasse erben.
     * @method getVolume
     * @public
     * @return volume. Number.
     */
    p.getVolume = function () {
        return ns.GlobalModel.getInstance().getVolume();
    };

    /**
     * Diese Methode setzt die aktuelle Zeit innerhalb des jeweiligen Controllers.
     * Diese Methode ist eine Template Methode und muss von den Klassen überschrieben werden, die von dieser Klasse erben.
     * @method setCurrenttime
     * @public
     * @param seconds. Number
     * @param preventPlay Flag, ob der automatische Play-Befehl verhindert werden soll.
     * @param preventSeek Flag, ob ein automatisches Seeking verhindert werden soll.
     */
    p.setCurrenttime = function (seconds, preventPlay, preventSeek) {

        this._playHeadStart = seconds;
        this.model.setTime(seconds);

        // Viewcontroller aktualisieren
        this.vc.updateSliderBarsUI(seconds, seconds, this.getDuration(), this.getPercentBuffered());

		if ( this.isAtEnd && !preventPlay)
			this.play();
    };

    /**
     * Spult zum aktuellen Live-Zeitpunkt.
     * Dies ist eine Template-Methode. Die Implementierung erfolgt entsprechend im jeweiligen
     * Stream Controller, der über DVR Funktionen verfügt.
     */
    p.seekToLive = function () {
    };

    /**
     * Gibt an, ob der aktuelle Stream ein Seeking unterstützt.
     */
    p.canSeek = function() {
        if ( this.mc )
            return !this.mc.getIsLive();
        return false;
    };

    /**
     * Gibt die Zeit zurück, an der der aktuelle Abspielvorgang begonnen wurde
     * @method getPlayheadStart
     * @public
     */
    p.getPlayheadStart = function () {
        return this._playHeadStart;
    };

    /**
     * Gibt an, wieviel Prozent der Datei sich bereits im Zwischenspeicher befinden.
     * @method getPercentBuffered
     * @public
     */
    p.getPercentBuffered = function () {
        return this._percentBuffered;
    };

    /**
     * Diese Methode gibt die aktuelle Zeit zurück, innerhalb des jeweiligen Controllers.
     * Diese Methode ist eine Template Methode und muss von den Klassen überschrieben werden, die von dieser Klasse erben.
     * @method getCurrenttime
     * @public
     * @return seconds. Number
     */
    p.getCurrenttime = function () {
        //dies ist eine Template Methode und muss überschrieben werden
        this.player.errorCtrl.throwError(ns.ErrorController.OVERRIDING_TEMPLATE_METHOD, ns.ErrorController.IS_CRITICAL_YES, "getCurrenttime");
    };

    /**
     * Diese Methode setzt die aktuelle Zeit in Prozent innerhalb des jeweiligen Controllers.
     * Diese Methode ist eine Template Methode und muss von den Klassen überschrieben werden, die von dieser Klasse erben.
     * @method setTimeByPercent
     * @public
     * @param percent. Number
     */
    p.setTimeByPercent = function (percent) {
       this.vc.hideAllDialogs();
       this.stopDVRTicker();
    };

    /**
     * Diese Methode gibt die prozentuale Zeit zurück, innerhalb des jeweiligen Controllers.
     * Diese Methode ist eine Template Methode und muss von den Klassen überschrieben werden, die von dieser Klasse erben.
     * @method getTimeAsPercent
     * @public
     * @return percent. Number
     */
    p.getTimeAsPercent = function () {
        //dies ist eine Template Methode und muss überschrieben werden
        this.player.errorCtrl.throwError(ns.ErrorController.OVERRIDING_TEMPLATE_METHOD, ns.ErrorController.IS_CRITICAL_YES, "getTimeAsPercent");
    };

    /**
     * Diese Methode gibt die Dauer des Streams zurück, innerhalb des jeweiligen Controllers.
     * Diese Methode ist eine Template Methode und muss von den Klassen überschrieben werden, die von dieser Klasse erben.
     * @method getDuration
     * @public
     * @return duration. Number
     */
    p.getDuration = function () //seconds
    {
        //dies ist eine Template Methode und muss überschrieben werden
        this.player.errorCtrl.throwError(ns.ErrorController.OVERRIDING_TEMPLATE_METHOD, ns.ErrorController.IS_CRITICAL_YES, "getDuration");
    };

    /**
     * Diese Methode gibt die Breite und Höhe der Representation zurück.
     * Hiermit kann man gegebenfalls den Player neu initialisieren und mit den neuen Abmaßen auf die Bühne zeichnen.
     * Diese Methode ist eine Template Methode und muss von den Klassen überschrieben werden, die von dieser Klasse erben.
     * @method representationChanged
     * @public
     * @return void
     */
    p.representationChanged = function () {
        if (this.pc.getRememberCurrentTime())
            this.pc.setInitialPlayhead(this.getCurrenttime());

        this.startStreaminitialzed = false;

        // Im Falle eines initialen Repräsentationswechsels
        // darf das Autoplay nicht übergangen werden.
        if ( this.__inited )
        {
            this.initStartAndPlayStream();
        }
    };

    /**
     * Diese Methode spult den Stream vor.
     * Methode wird von den Klassen aufgerufen, die diese Klasse erben.
     * Definiert ein StandardVerhalten und so wird doppelter Code vermieden.
     * @method forward
     * @public
     */
    p.forward = function () {
        var c = this.getCurrenttime();
        var d = this.getDuration();
        var n = c + 10;
        if (n > d)
            n = d;
        this.setCurrenttime(n);
    };

    /**
     * Diese Methode spult den Stream zurück.
     * Methode wird von den Klassen aufgerufen, die diese Klasse erben.
     * Definiert ein StandardVerhalten und so wird doppelter Code vermieden.
     * @method rewind
     * @public
     */
    p.rewind = function () {
        var c = this.getCurrenttime();
        var n = c - 10/*5*/;
        if (n < 0)
            n = 0;
        this.setCurrenttime(n);
    };

    /**
     * Diese Methode stopt den Stream.
     * Methode wird von den Klassen aufgerufen, die diese Klasse erben.
     * Definiert ein StandardVerhalten und so wird doppelter Code vermieden.
     * @method stop
     * @public
     */
    p.stop = function (event) {
        this.pause();
        this.jumpToStart();
        this.stopEventHandler(event)
    };

    /**
     * Diese Methode springt zum Anfang des Stream zurück.
     * Methode wird von den Klassen aufgerufen, die diese Klasse erben.
     * Definiert ein StandardVerhalten und so wird doppelter Code vermieden.
     * @method jumpToStart
     * @public
     */
    p.jumpToStart = function () {
        this.setCurrenttime(0, true);
    };

    /**
     * Diese Methode wird aufgerufen, wenn sich DVR Modus oder DVR Fenster ändern
     * @method onDVRCallback
     * @public
     * @return void
     **/
    p.onDVRCallback = function ( dvrModeEnabled, dvrWindow, dvrIsLive ) {
        this._dvrEnabled = dvrModeEnabled;
        this._dvrWindow = dvrWindow;
        this._dvrIsLive = dvrIsLive;

        this.player.viewCtrl.onDVRCallback(this._dvrEnabled, this._dvrWindow, this._dvrIsLive);

        this.player.dispatchCustomEvent("AddonDVR.dvrChanged",
            {
                dvrEnabled: this._dvrEnabled,
                dvrIsLive: this._dvrIsLive,
                dvrWindow: this._dvrWindow
            }
        );
    };

    p.startDVRTicker = function () {
        clearInterval(this._dvrTicker);

        this._dvrTicker = setInterval(
            function () {

                var targetTime = this.getCurrenttime() -1;
                if ( targetTime < 0 )
                    this.stopDVRTicker();
                else
                    this.setCurrenttime(targetTime, true, true);

            }.bind(this),
            1000
        );
        this._dvrTickerRunning = true;
    };

    p.stopDVRTicker = function () {
        clearInterval(this._dvrTicker);
        this._dvrTickerRunning = false;
    };

	/**
	 * @Abstract
	 **/
	p.hideSubtitles = function () {
	};

	/**
	 * @Abstract
	 **/
	p.showSubtitles = function () {
	};

    ns.AbstractPlayerCtrl = AbstractPlayerCtrl;

})(ardplayer, ardplayer.jq, ardplayer.console);
