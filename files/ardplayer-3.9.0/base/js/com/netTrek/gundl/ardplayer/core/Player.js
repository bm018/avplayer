/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Saban Uenlue
 * @module core
 * @class Player
 **/

(function (ns, $, console) {
    "use strict";

    /**
     * Das ist die Hauptklasse die den Browser untersucht und dann den dafür vorgesehenen Player auf die Bühne legt. Die gültigen Player sind: Flash Player, Windows Media Player und der HTML5-Player.
     * @class Player
     * @constructor
     * @public
     */
    var Player = function (playerDivId, playerConfig, mediaCollection, playlistController, filter_pc, filter_mc) {

        this._filter_pc = filter_pc;
        this._filter_mc = filter_mc;

        // Neuen callstack oeffnen, um Eventbindungen zu erlauben.
        setTimeout(function () {
            this.construct(playerDivId, playerConfig, mediaCollection, playlistController);
        }.bind(this), 1);
    };

    var p = Player.prototype;

    // Statics
    // Plugin Detection Rules (JSON)
    Player.pluginDetectionRules = null;
    // Plugin Detection Rule Callbacks, zum Anhaengen an Ladevorgaenge
    Player.pluginDetectionCallbacks = new Array();

    p.construct = function (playerDivId, playerConfig, mediaCollection, playlistController) {

        /**
         *  @param playerDivId {string} Der ID-Tag für das passende Player-Objekt
         * @param playerConfig  {playerconfiguration} [optional] Die Playerkonfiguration, die man von aussen definieren kann (URL)
         * @param mediaCollection {mediaCollection} [optional] Die Playerkonfiguration, die man von aussen definieren kann (URL)
         * @event ready {boolean} - callback wird ausgelöst, sobald der Player fertig ist
         */

        if (!$("#" + playerDivId).exists()) {
            throw new Error("Target Div-ID does not exist: " + playerDivId);
        }

        var that = this;
        $.each(arguments, function (key, value) {
            if (typeof value === "function") {
                that.ready = value;
            }
        });

        this.setUniquePlayerId($.randomUUID());

		/**
		 * Div Element ID von dem Player ViewPort
		 * @property _id
		 * @private
		 * @type String
		 */
		this._id = playerDivId;

        // Optionaler Playlisten-Controller
        this._playlistController = playlistController;

		// SOLA Analytics Configuration File (JSON)
		this.solaConfiguration = null;

        //2224
        if (typeof playerConfig == "string" ||
            ( !(playerConfig instanceof ns.PlayerConfiguration) &&
                typeof playerConfig == "object") ) {
            var getPlayerConfigurationByJSON = new ns.GetPlayerConfigByJsonCmd(this);

            var that = this;
            getPlayerConfigurationByJSON.execute(playerConfig, function (loadedPC) {
                if ( typeof that._filter_pc == "function" )
                    loadedPC = that._filter_pc(loadedPC);

                that.construct(playerDivId, loadedPC, mediaCollection, playlistController);
            });

            return;
        }

        //2224
        if (typeof mediaCollection == "string" ||
            ( !(mediaCollection instanceof ns.MediaCollection) &&
                typeof mediaCollection == "object") ) {
            var getMediaCollectionByJSON = new ns.GetMediaCollectionByJsonCmd(this);

            var that = this;
            getMediaCollectionByJSON.execute(mediaCollection, function (loadedMC) {
                if ( typeof that._filter_mc == "function" )
                    loadedMC = that._filter_mc(loadedMC);

                that.construct(playerDivId, playerConfig, loadedMC, playlistController);
            });

            return;
        }


        this.initialize(playerDivId, playerConfig, mediaCollection);

		/**
		 * ErrorController
		 * @property errorCtrl
		 * @type ErrorController
		 * @public
		 */
		this.errorCtrl = ns.ErrorController.getInstance(this);
    };

    /**
     * Initialisierungsmethode, wird vom Konstruktor aufgerufen.
     * Hier werden die Parameter an die vorgesehenen Variablen zugewiesen.
     * @method initialize
     * @private
     * @param playerDivId Der ID-Tag für das passende Player-Objekt
     * @param playerConfig [optional] Die Playerkonfiguration, die man von aussen definieren kann (URL)
     * @param mediaCollection [optional] Die Playerkonfiguration, die man von aussen definieren kann (URL)
     */
    p.initialize = function (playerDivId, playerConfig, mediaCollection) {

        // Debugging
        console.log("[ARD Player] initialize", playerDivId, playerConfig, mediaCollection);

        /**
         * Model des Players
         * @property model
         * @type PlayerModel
         */
        this.model = ns.PlayerModel.getInstance(this);

		/**
		 * PlayerPixelController
		 * @type {PlayerPixelController}
		 * @protected
		 */
		this.pixelController = new ns.PlayerPixelController(this);

        this.setMediaCollection(mediaCollection);

        this.setPlayerConfig(playerConfig);

		// Auslagerung in separaten Stack, damit eine Bindung des Events ermoeglicht wird.
		var that = this;
		setTimeout( function () {
			if (that && that.pixelController)
				that.pixelController.triggerCustomPixel (ns.PlayerPixelController.PLAYER_LOADING);
		}, 1);

        // Standardmäßig wird kein Plugin erzwungen
        this._forcedPlugin = -1;
    };

    /**
     * Setter
     * Setzt eine eindeutige player id
     * @method setUniquePlayerId
     * @public
     * @param id. Typ: String.
     * @return void
     */
    p.setUniquePlayerId = function (id) {
        this._uniqueId = id;
    };

    /**
     * Getter
     * Gibt die eindeutige player id zurück.
     * @method getUniquePlayerId
     * @public
     * @return id. Typ: String.
     */
    p.getUniquePlayerId = function () {
        return this._uniqueId;
    };

    /**
     * Gibt an, ob dieser Player in einer Playlist läuft, und einen Preroll Clip wiedergibt.
     * @returns {boolean|*}
     */
    p.isPrerollPlayer = function () {
        return this._playlistController != null && this._playlistController.isPrerollPlayer(this);
    };

    /**
     * Überspringt den aktuellen "Preroll" einer Playliste.
     */
    p.skipPreroll = function () {
        if ( this.isPrerollPlayer(this) )
            this._playlistController.playNext();
    };

    /**
     * Gibt an, ob es sich beim aktuellen Player um einen "Preroll" handelt.
     * @returns {boolean}
     */
    p.isPlaylistPlayer = function () {
        return this._playlistController != null;
    };

    /**
     * Wiederholt, mit Ausnahme von Prerolls, die aktuelle Playliste (falls vorhanden).
     */
    p.replayPlaylist = function () {
        if ( this.isPlaylistPlayer() )
            this._playlistController.replayPlaylist();
    };

    /**
     * Hier wird der möglicherweise übergebene Parameter kontrolliert.
     * Falls einer übergeben wurde, wird davon ein MediaCollection-Objekt erstellt
     * Wenn kein MediaCollection-Objekt übergeben wird, wird kontrolliert, ob in der URL die MediaCollection als JSON-Datei übergeben wird,
     * oder als einzelne Query-Strings
     * Im Anschluss wird die Konfiguration überprüft.
     * @method setMediaCollection
     * @private
     * @param mediaCollection MediaCollections: [optional] Die Playerkonfiguration, die man von aussen definieren kann (URL)
     */
    p.setMediaCollection = function (mediaCollection) {
        if (mediaCollection && mediaCollection instanceof ns.MediaCollection) {
            this._onMCready(mediaCollection);
        }
        else {
            var query = ns.GlobalModel.getInstance().startParams;
            var cmd;
            if (query) {

                if (query [this._id + "mc"]) {
                    cmd = new ns.GetMediaCollectionByJsonCmd();
                    cmd.execute(query [this._id + "mc"], ns.Delegate.create(this, this._onMCready));
                }
                else {
                    cmd = new ns.GetMediaCollectionByQueryCmd();
                    cmd.execute(query, ns.Delegate.create(this, this._onMCready));
                }
            }
            else
                this._validateMC();
        }
    };


    /**
     * Hier wird der möglicherweise übergebene Parameter kontrolliert.
     * Falls einer übergeben wurde, wird davon ein PlayerCollection-Objekt erstellt
     * Wenn kein PlayerCollection-Objekt übergeben wird, wird kontrolliert, ob in der URL die MediaCollection als JSON-Datei übergeben wird,
     * oder als einzelne Query-Strings
     * Im Anschluss wird die Konfiguration überprüft.
     * @method setPlayerConfig
     * @private
     * @param playerConfig PlayerConfiguration: [optional] Die Playerkonfiguration, die man von aussen definieren kann (URL)
     */
    p.setPlayerConfig = function (playerConfig) {
        if (playerConfig && playerConfig instanceof ns.PlayerConfiguration) {
            this._onPCready(playerConfig);
        }
        else {
            var query = ns.GlobalModel.getInstance().startParams;
            var cmd;
            if (query) {

                if (query [this._id + "pc"]) {
                    cmd = new ns.GetPlayerConfigByJsonCmd();
                    cmd.execute(query [this._id + "pc"], ns.Delegate.create(this, this._onPCready));
                }
                else {
                    cmd = new ns.GetPlayerConfigByQueryCmd();
                    cmd.execute(query, ns.Delegate.create(this, this._onPCready));
                }
            }
            else
                this._validatePC();
        }
    };

    /**
     * Definiert ein Plugin, das bei einer Neuinitialisierung erzwungen wird.
     * @param pluginId Plugin Konstante aus dem GlobalModel
     */
    p.setForcedPlugin = function (pluginId) {
        switch (pluginId) {
            case ns.GlobalModel.FLASH:
            case ns.GlobalModel.HTML5:
                this._forcedPlugin = pluginId;
                break;

            default:
                break;
        }
    };

    /**
     * Entfernt diverse Elemente um sie für den garbage collector zum löschen freizugeben.
     * @method dispose
     * @public
     * @return void
     */
    p.dispose = function () {
		this.pixelController.triggerCustomPixel (ns.PlayerPixelController.PLAYER_UNLOAD);
		// Dispose any old plugins
		while ( this.plugins && this.plugins.length > 0 )
		{
			var disposePlugin = this.plugins.pop();
			disposePlugin.dispose(); // AbstractCorePlugin
		}

        if (this._ctrl) {
            this._ctrl.dispose();
            this._ctrl = null;
        }

        if (this.viewCtrl) {
            this.viewCtrl.dispose();
            this.viewCtrl = null;
        }

        if (this.errorCtrl) {
            this.errorCtrl.dispose();
            this.errorCtrl = null;
        }

        if (this.model) {
            this.model.dispose();
            this.model = null;
        }

		if ( this.pixelController )
		{
			this.pixelController.dispose();
			this.pixelController = null;
		}

    };

    /**
     * Eventhandler wird ausgelöst, nachdem der PlayerConfiguration erkannt und geparsed wurde.
     * @method _onPCready
     * @param pc PlayerConfiguration
     * @private
     */
    p._onPCready = function (pc) {
        if (pc && pc instanceof ns.PlayerConfiguration) {
            this.model.playerConfig = pc;

            if (this.model.playerConfig.getAutoPlayBoolean()) {
                if (ns.PlayerModel.autoPlayerAlreadyActive && !this.model.playerConfig.getAutoPlayForcedBoolean()) {
                    this.model.playerConfig.setAutoPlay(false);
                }
                else {
	                ns.PlayerModel.autoPlayerAlreadyActive = this.getId();
                }
            }

            /**
             * Eigenschaft ist true, wenn die PlayerConfig bereit ist zu arbeiten
             * @property _pcReady
             * @type Boolean
             * @private
             */
            this._pcReady = true;
        }

        this._validatePC();
    };

    // Static
    Player.loadPluginDetectionConfigSuccess = function (data) {
        Player.pluginDetectionRules = data;
        Player.triggerRegisteredCallbacks(); // (==_ready())
    };

    // Static
    Player.loadPluginDetectionConfigFault = function (info) {
        Player.pluginDetectionRules = new Array();
        Player.triggerRegisteredCallbacks(); // (==_ready())
    };

    // Static
    Player.triggerRegisteredCallbacks = function () {
        var curCallback = null;
        while (Player.pluginDetectionCallbacks.length > 0) {
            curCallback = Player.pluginDetectionCallbacks.shift();
            if (curCallback) {
                curCallback();
            }
        }
    };

    p.loadSolaDetectionConfigSuccess = function (data) {
        this.solaConfiguration = data;
        this._ready();
    };

    p.loadSolaDetectionConfigFault = function (info) {
        this.solaConfiguration = {};
        this._ready();
    };

    /**
     * Eventhandler  wird ausgelöst, nachdem die MediaCollection erkannt und geparsed wurde.
     * @method _onMCready
     * @param mc MediaCollection
     * @private
     */
    p._onMCready = function (mc) {
        if (mc && mc instanceof ns.MediaCollection) {
            this.model.mediaCollection = mc;
            /**
             * Property is true if MediaCollection is readyToWork
             * @property _mcReady
             * @type Boolean
             * @private
             */
            this._mcReady = true;
        }

        this._validateMC();

        if (this._pcReady === true && this._mcReady === true && Player.pluginDetectionRules !== null)
            this._ready();
    };

    /**
     * Setter.
     * Hier wird der erstellte Controller gespeichert.
     * Falls schon einer vorhanden ist, wird dieser disposed.
     * @method setCtrl
     * @public
     * @param playerControlerInstance AbstractPlayerCtrl
     */
    p.setCtrl = function (playerControlerInstance) {

        if (playerControlerInstance) {
            this._ctrl = playerControlerInstance;
            if (this.isFlashCtrl()) {
                this.viewCtrl.changePluginSelection(ns.GlobalModel.FLASH);
            }
            else if (this.isHtmlCtrl()) {
                this.viewCtrl.changePluginSelection(ns.GlobalModel.HTML5);
            }
            else {
                this.errorCtrl.throwError(ns.ErrorController.NO_CTRL_DEFINED, ns.ErrorController.IS_CRITICAL_YES);
            }
        }
    };

    /**
     * Getter.
     * Hier wird der erstellte Controller zurück gegeben.
     * @method getCtrl
     * @public
     * @return playerControlerInstance AbstractPlayerCtrl
     */
    p.getCtrl = function () {
        return this._ctrl;
    };

    /**
     * Getter.
     * Hier wird kontrolliert, ob der aktuelle controller die FlashPluginCtrl-Klasse ist.
     * @method isFlashCtrl
     * @public
     * @return Boolean.
     */
    p.isFlashCtrl = function () {
        return this._ctrl && this._ctrl instanceof ns.FlashPluginCtrl;
    };

    /**
     * Getter.
     * Hier wird kontrolliert, ob der aktuelle controller eines der beiden HTMLCtrl-Klasse ist..
     * @method isFlashCtrl
     * @public
     * @return Boolean.
     */
    p.isHtmlCtrl = function () {
        return this.isHtmlVideoCtrl() || this.isHtmlAudioCtrl();
    };

    /**
     * Getter.
     * Hier wird kontrolliert, ob der aktuelle controller die HtmlVideoCtrl-Klasse ist.
     * @method isHtmlVideoCtrl
     * @public
     * @return Boolean.
     */
    p.isHtmlVideoCtrl = function () {
        return this._ctrl && this._ctrl instanceof ns.HtmlVideoCtrl;
    };

    /**
     * Getter.
     * Hier wird kontrolliert, ob der aktuelle controller die HtmlAudioCtrl-Klasse ist.
     * @method isHtmlAudioCtrl
     * @public
     * @return Boolean.
     */
    p.isHtmlAudioCtrl = function () {
        return this._ctrl && this._ctrl instanceof ns.HtmlAudioCtrl;
    };

    /**
     * Kontrolle ob das node-objekt ein Flash-Objekt ist.
     * Dies wird durch die statische klassen-id erstellt.
     * @method nodeIsFlashActiveX
     * @private
     * @return bool.
     */
    function nodeIsFlashActiveX(node) {
        var targetClassId = $(node).attr("classid") || "";
        return targetClassId.toLocaleLowerCase() === Player.FLASH_CLASS_ID;
    };

    /**
     * Kontrolle ob das node-objekt ein Flash-Objekt ist.
     * Dies wird durch die Kontrolle des attribute "type" erstellt.
     * @method nodeIsFlashObject
     * @private
     * @return bool.
     */
    function nodeIsFlashObject(node) {
        return $(node).attr("type") === Player.FLASH_TYPE;
    };

    /**
     * Kontrolle ob das node-objekt ein Flash-Objekt ist.
     * Hier werden die privaten Funktion    nodeIsFlashObject und nodeIsFlashActiveX aufgerufen.
     * Wenn eines der Funktionen true zurück geben, gibt diese Funktion auch true zurück.
     * @method nodeIsFlash
     * @private
     * @return bool.
     */
    function nodeIsFlash(node) {
        return nodeIsFlashObject(node) || nodeIsFlashActiveX(node);
    };

    /**
     * Eventhandler wird ausgelöst, nachdem der PlayerConfiguration und der MediaCollection vollständig erkannt und geparsed wurde
     * @method _ready
     * @private
     */
    p._ready = function () {

        // PC und MC muessen vorliegen
        if ( !(this._pcReady === true && this._mcReady === true) )
        {
            return;
        }

        // Schritt 1 - Pruefung, ob Plugin Lademeldungen vorhanden sind
        if (Player.pluginDetectionRules === null) {

            // Falls es bereits einen Ladevorgang gibt, haengen wir uns an das Event
            if (Player.pluginDetectionCallbacks.length == 0) {
                // Plugin Konfigurationen laden (#2253)
                var path = this.model.playerConfig.getBaseUrl() + "base/conf/PluginDetections.json";
                var that = this;
                $.ajax({
                    type: "GET",
                    async: true,
                    url: path,
	                beforeSend: function (xhr) {
		                if (xhr.overrideMimeType) {
			                xhr.overrideMimeType("application/json");
		                }
	                },
                    dataType: "json",
                    encoding: "UTF-8",
                    success: ns.Delegate.create(that, Player.loadPluginDetectionConfigSuccess),
                    error: ns.Delegate.create(that, Player.loadPluginDetectionConfigFault)
                });
            }

            Player.pluginDetectionCallbacks.push(ns.Delegate.create(this, this._ready));
            return;
        }

        // Schritt 2 - Pruefung, ob Sola Analytics Konfiguration geladen ist / werden muss
        if (this.solaConfiguration === null && this.model.playerConfig.getSolaAnalyticsEnabled()) {

			// Plugin Konfigurationen laden (#2253)
			var solaPathOrObject = this.model.playerConfig.getSolaAnalyticsConfig();

			if ( typeof solaPathOrObject == "string" )
			{
				var that = this;
				$.ajax({
					type: "GET",
					async: true,
					url: solaPathOrObject,
					beforeSend: function (xhr) {
						if (xhr.overrideMimeType) {
							xhr.overrideMimeType("application/json");
						}
					},
					dataType: "json",
					encoding: "UTF-8",
					success: ns.Delegate.create(that, that.loadSolaDetectionConfigSuccess),
					error: ns.Delegate.create(that, that.loadSolaDetectionConfigFault)
				});

				// Weitere Ausfuehrungen abbrechen, der Ladevorgang muss zunaechst abgeschlossen
				// werden.
            	return;
			}
			else if ( typeof solaPathOrObject == "object" )
			{
				this.solaConfiguration = solaPathOrObject;
			}
        }

        var that = this;

        // Dispose any old plugins
        while ( this.plugins && this.plugins.length > 0 )
        {
            var disposePlugin = this.plugins.pop();
            disposePlugin.dispose(); // AbstractCorePlugin
        }

        // Setup plugins
        var plugins = new Array();

        $.each(this.model.playerConfig._addons, function (key, value) {
            var clazzName = value;

            var clazz = ns[clazzName];

            if (clazz) {
                var instance = new clazz();

                plugins.push(instance);
                instance.register(that);
            }
        });
        this.plugins = plugins;

        /**
         * ViewController
         * @property viewCtrl
         * @type ViewController
         * @public
         */
        this.viewCtrl = ns.ViewController.getInstance(this);

        /**
         * eventhandler that will be triggered after player pre_init ist completet
         * @event ready
         */

        var that = this;

        // Safely remove any existing controler
        if (this._ctrl) {
            this._ctrl.dispose();
            this._ctrl = null;
        }

        // Workaround- Mobile kann kein Autoplay
        if (this.model.playerConfig.getAutoPlayBoolean() && ns.GlobalModel.getInstance().isMobileDevice) {

            // Sofern es sich um einen Playlisten-Player handelt, muss das Autoplay beim ersten
            // Beitrag deaktiviert werden. Folgeclips kommen mit autoplay aufgrund der HTML5MEFactory
            // zurecht:
            var autoplayToggle = this._playlistController && this._playlistController.getCurrentPlaylistIndex() > 0;
            this.model.playerConfig.setAutoPlay(autoplayToggle);
        }

        this.viewCtrl.restoreDefaults();

		// Falls bis hier ein Fehler aufgetreten ist, soll der VP entfernt werden
		if (this.errorCtrl && this.errorCtrl._finalErrorState)
		{
			this.viewCtrl.destroy();
			return;
		}

        var initCmd = new ns.InitPlayerCmd(this, this._forcedPlugin);
        initCmd.execute(function (mediaCanvas, usedPlugin) {

            if (mediaCanvas) {
                var temp_ctrl;
                //
                if (mediaCanvas instanceof ns.GenerateFlashPluginCmd) {
                    temp_ctrl = new ns.FlashPluginCtrl(that, mediaCanvas);
                }
                else if (mediaCanvas.nodeName && mediaCanvas.nodeName.match(/^video$/i) != undefined) {
                    temp_ctrl = new ns.HtmlVideoCtrl(that, mediaCanvas);
                }
                else if (mediaCanvas.nodeName && mediaCanvas.nodeName.match(/^audio$/i) != undefined) {
                    temp_ctrl = new ns.HtmlAudioCtrl(that, mediaCanvas);
                }

                that.setCtrl(temp_ctrl);

                if (temp_ctrl instanceof ns.AbstractPlayerCtrl) {
                    var isFlash = that.isFlashCtrl();

					if (!isFlash) {
						that.viewCtrl.registerMediaCanvas(mediaCanvas);
					}

                    that.viewCtrl.playerDiv.showWithClass();

					that.dispatchCustomEvent(Player.EVENT_READY);

                    if (that.ready && typeof that.ready === "function") {
                        that.ready();
                    }
                }
                else {
                    that.errorCtrl.throwError(ns.ErrorController.PLAYER_CTRL_GENERATION_WAS_NOT_SUCCESSFUL, ns.ErrorController.IS_CRITICAL_YES);
                }
            }
            else {
                if (usedPlugin === -1) {
                    var errorShown = false;
                    var plugInsArr = that.model.mediaCollection.getSortierung();

                    // 0 : Flash
                    // 1 : HTML
                    plugInsArr = plugInsArr.sort(function (a, b) {
                        return a - b;
                    });

                    //console.log ( plugInsArr );
                    for (var i = 0; i < plugInsArr.length; i++) {
                        var pid = plugInsArr [i];
                        if (pid != undefined && !isNaN(pid)) {
                            //console.log ( pid );
                            switch (pid) {
                                case ns.GlobalModel.FLASH:
                                    that.viewCtrl.writeNotificationInstallFlash();
                                    errorShown = true;
                                    break;
                                case ns.GlobalModel.HTML5:
                                    that.viewCtrl.writeNotificationInstallHTML5();
                                    errorShown = true;
                                    break;
                                default:
                                    //that.viewCtrl.writeNotification ( {err:'Fehler', msg:'Nachricht'} );
                                    that.errorCtrl.throwError(ns.ErrorController.PLUGIN_ID_UNKNOWN, ns.ErrorController.IS_CRITICAL_YES);
                                    errorShown = true;
                                    break;
                            }
                        }

                        if (errorShown)
                            break;
                    }
                }
                else {
                    that.errorCtrl.throwError(ns.ErrorController.MEDIACANVAS_COULD_NOT_GENERATED, ns.ErrorController.IS_CRITICAL_YES, mediaCanvas || 'kein Canvas');
                }
            }
        });
    };

    /**
     * Prüfen ob die PlayerConfig gültig ist.
     * @method _validatePC
     * @private
     */
    p._validatePC = function () {
        if (this.model.playerConfig && this.model.playerConfig instanceof ns.PlayerConfiguration) {
            this._ready();
        }
        else {
            var errorCtrl = ns.ErrorController.getInstance();
            errorCtrl.throwError(ns.ErrorController.PC_UNKNOWN, ns.ErrorController.IS_CRITICAL_YES);
        }
    };

    /**
     * * Prüfen ob die MediaCollection gültig ist
     * @method _validateMC
     * @private
     */
    p._validateMC = function () {
		var mc = this.model.mediaCollection;
        if ( mc &&
			 mc instanceof ns.MediaCollection &&
             (   mc.getMediaArray()[0] != false ||
				mc.getMediaArray()[1] != false ||
				mc.getMediaArray()[2] != false ) &&
			    mc.getDefaultQuality() != undefined
			) {

            // Copy original media array for later easy access (i.e. showing a stream list)
            mc.createMediaArrayBackup();

            this._ready();
        }
        else {
            var errorCtrl = ns.ErrorController.getInstance(this);

			if ( mc && mc.getDefaultQuality() == undefined )
            	errorCtrl.throwError(ns.ErrorController.MC_NO_DEFAULT_QUALITY, ns.ErrorController.IS_CRITICAL_YES);
			else
            	errorCtrl.throwError(ns.ErrorController.MC_UNKNOWN, ns.ErrorController.IS_CRITICAL_YES);
        }
    };

    /**
     * Gibt die div id des übergebenen Players zurück
     * @public
     * @return String Id of the div
     */
    p.getId = function () {
        return this._id;
    };

    /**
     * Methode delegiert die Play Anweisung an den aktiven PlayerCtrl.
     * @public
     * @method play
     * @return PlayerCtrl AbstractPlayerCtrl, HtmlVideoCtrl, HtmlAudioCtrl, FlashPluginCtrl
     */
    p.play = function () {
        if (this._ctrl) {
            this._ctrl.play();
            return this._ctrl;
        }
        return null;
    };

    /**
     * Methode delegiert die Stop Anweisung an den aktiven PlayerCtrl.
     * @public
     * @method stop
     * @return PlayerCtrl AbstractPlayerCtrl, HtmlVideoCtrl, HtmlAudioCtrl, FlashPluginCtrl
     */
    p.stop = function () {
        if (this._ctrl) {
            this._ctrl.stop();
            return this._ctrl;
        }
        return null;
    };

    /**
     * Methode delegiert die Pause Anweisung an den aktiven PlayerCtrl.
     * @public
     * @method pause
     * @return PlayerCtrl AbstractPlayerCtrl, HtmlVideoCtrl, HtmlAudioCtrl, FlashPluginCtrl
     */
    p.pause = function () {
        if (this._ctrl) {
            this._ctrl.pause();
            return this._ctrl;
        }
        return null;
    };

    /**
     * Diese Methode gibt die aktuelle Zeit zurück, innerhalb des jeweiligen Controllers.
     * @method getCurrenttime
     * @public
     * @return seconds. Number
     */
    p.getCurrenttime = function () {
        if (this._ctrl) {
            return this._ctrl.getCurrenttime();
        }
        return 0;
    };

    /**
     * Diese Methode gibt die Länge des aktuellen Mediums zurück.
     * @method getDuration
     * @public
     * @return seconds. Number
     */
    p.getDuration = function () {
        if (this._ctrl) {
            return this._ctrl.getDuration();
        }
        return 0;
    };

    /**
     * Methode delegiert die toggelPause Anweisung an den aktiven PlayerCtrl.
     * @public
     * @method resume
     * @return PlayerCtrl AbstractPlayerCtrl, HtmlVideoCtrl, HtmlAudioCtrl, FlashPluginCtrl
     */
    p.resume = function () {
        if (this._ctrl) {
            this._ctrl.togglePlay();
            return this._ctrl;
        }
        return null;
    };

    /**
     * Methode delegiert die setCurrenttime Anweisung an den aktiven PlayerCtrl.
     * @public
     * @method seekTo
     * @return PlayerCtrl AbstractPlayerCtrl, HtmlVideoCtrl, HtmlAudioCtrl, FlashPluginCtrl,
     */
    p.seekTo = function (sec) {
        if (this._ctrl) {
            this._ctrl.setCurrenttime(sec);
            return this._ctrl;
        }
        return null;
    };

    /**
     * Spult zum aktuellen Live-Zeitpunkt des Clips. Nur für DVR-Clips verfügbar.
     * @returns {Player}
     */
    p.seekToLive = function () {
        if (this._ctrl) {
            this._ctrl.seekToLive();
        }

        return this;
    };

    /**
     * Methode delegiert die setCurrenttime, play Anweisung an den aktiven PlayerCtrl.
     * @public
     * @method seekToAndPlay
     * @return PlayerCtrl AbstractPlayerCtrl, HtmlVideoCtrl, HtmlAudioCtrl, FlashPluginCtrl
     */
    p.seekToAndPlay = function (sec) {
        if (this._ctrl) {
            this.seekTo(sec)
                .play();
            return this._ctrl;
        }
        return null;
    };

    p.dispatchCustomEvent = function (type, data) {
        var event = $.extend($.Event(type), data);
        $(this).trigger(event);
    };

    /**
     * Statischer Wert der für die Ermittlung dient ob das mediaCanvas ein FlashPlayer-Video ist.
     * @public
     * @static
     * @constant
     */
    Player.FLASH_CLASS_ID = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000";

    /**
     * Statischer Wert der für die Ermittlung dient ob das mediaCanvas vom Typ Flash ist.
     * @public
     * @static
     * @constant
     */
    Player.FLASH_TYPE = "application/x-shockwave-flash";

    Player.EVENT_INIT = "Player.EVENT_INIT";
    Player.EVENT_READY = "Player.EVENT_READY";
    Player.EVENT_PLUGIN_CHANGE = "Player.EVENT_PLUGIN_CHANGE";
    Player.EVENT_STATUS_CHANGE = "Player.EVENT_STATUS_CHANGE";
    Player.EVENT_QUALITY_CHANGE = "Player.EVENT_QUALITY_CHANGE";
    Player.EVENT_ERROR = "Player.EVENT_ERROR";
    Player.EVENT_LOAD_STREAM = "Player.EVENT_LOAD_STREAM";
    Player.EVENT_PLAY_STREAM = "Player.EVENT_PLAY_STREAM";
    Player.EVENT_END_STREAM = "Player.EVENT_END_STREAM";
    Player.EVENT_PAUSE_STREAM = "Player.EVENT_PAUSE_STREAM";
    Player.EVENT_STOP_STREAM = "Player.EVENT_STOP_STREAM";
    Player.EVENT_BUFFERING = "Player.EVENT_BUFFERING";
    Player.EVENT_UPDATE_STREAM_TIME = "Player.EVENT_UPDATE_STREAM_TIME";
    Player.EVENT_UPDATE_STREAM_DURATION = "Player.EVENT_UPDATE_STREAM_DURATION";
    Player.EVENT_KEYBOARD_RELEASE = "Player.EVENT_KEYBOARD_RELEASE";

    Player.EVENT_CTRLBAR_FADEOUT_START = "Player.EVENT_CTRLBAR_FADEOUT_START";
    Player.EVENT_CTRLBAR_FADEOUT_END = "Player.EVENT_CTRLBAR_FADEOUT_END";
    Player.EVENT_CTRLBAR_FADEIN_START = "Player.EVENT_CTRLBAR_FADEIN_START";
    Player.EVENT_CTRLBAR_FADEIN_END = "Player.EVENT_CTRLBAR_FADEIN_END";

    Player.VIEW_RESTORE_DEFAULTS = "Player.VIEW_RESTORE_DEFAULTS";

    Player.SETUP_VIEW = "Player.SETUP_VIEW";
    Player.SETUP_VIEW_COMPLETE = "Player.SETUP_VIEW_COMPLETE";

    Player.VIEW_CTRLBAR_MOVE = "Player.VIEW_CTRLBAR_MOVE";

	Player.TOGGLE_FULLSCREEN = "Player.TOGGLE_FULLSCREEN";

    ns.Player = Player;

})(ardplayer, ardplayer.jq, ardplayer.console);
