/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Kadir Uludag
 * @module controller
 **/

(function (ns, $, console) {
    "use strict";
    /**
     * Diese Klasse wird als zentrale Fehlerabhandlungsklasse genutzt. Hierzu wird eine singelton-Instanz der ErrorController-Klasse
     * erstellt und im Anschluss die throwError-Methode aufgerufen.
     * @class ErrorController
     * @constructor
     * @public
     * @param player. Player. Player-Objekt das den Fehler geworfen hat. Parameter ist optional, da ja Fehler auch entstehen können,
     * bevor ein Player definiert wurde.
     * @return void
     **/
    var ErrorController = function (player) {
        if (ErrorController.playerIDs == undefined)
            ErrorController.playerIDs = {};
        if (ErrorController.players == undefined)
            ErrorController.players = [];

        var playerID = undefined;
        if (player && player instanceof ns.Player) {
            playerID = player.getId();
        }

        if (playerID == undefined) {
            //alert("Fehler ist entstanden bevor der Player erstellt wurde");
            //alert("player is undefined");
            //throw new Error("player is undefined");
        }

        if (ErrorController.playerIDs [playerID]) {
            //log ( "return old ErrorController for " + playerID );
            return  ErrorController.playerIDs [playerID];
        }

        ErrorController.playerIDs [playerID] = this;

        ErrorController.players.push(player);

        /**
         * Div-id für diesen Player
         * @property playerID
         * @type String
         */
        this.playerID = playerID;

        /**
         * Playerinstanz von diesem Model
         * @property player
         * @type Player
         */
        if (player) {
            this.player = player;
        }

		this._finalErrorState = false;

        this.initialize();
    };

    /*
     * Löscht die Parameter die zum erstellen eines Singeltons genutzt werden
     * @method resetSingleton
     * @public
     * @param void
     * @return void
     * */
    ErrorController.resetSingleton = function () {
        ErrorController.playerIDs = undefined;
        ErrorController.players = undefined;
    };

    /**
     * Singletonfactory für eine Playerinstanz
     * @method getInstance
     * @public
     * @static
     * @param player
     * @return ErrorController
     */
    ErrorController.getInstance = function (player) {
        return new ErrorController(player);
    };

    /**
     * Gibt den ErrorController für eine playerid zurück
     * @method getInstanceByPlayerID
     * @public
     * @static
     * @param playerID
     * @return ErrorController
     */
    ErrorController.getInstanceByPlayerID = function (playerID) {
        return ErrorController.playerIDs [playerID];
    };

    /**
     * Die Methode entfernt den Player der als Parameter übergeben wird, aus der Playerliste.
     * @method forceRemovePlayer
     * @public
     * @param player
     * @return void
     **/
    ErrorController.forceRemovePlayer = function (player) {
        var removalIndex = -1;
        $.each(ErrorController.players, function (key, value) {
            if (value == player) {
                removalIndex = key;
            }
        });

        if (removalIndex >= 0) {
            ErrorController.players.splice(removalIndex, 1);
        }

        ErrorController.playerIDs[ player.getId() ] = null;
        ErrorController.playerIDs[ player.getId() ] = undefined;
        delete ErrorController.playerIDs[ player.getId() ];
    };

    var p = ErrorController.prototype;

    /**
     * Initialization method.
     * @method initialize
     * @protected
     **/
    p.initialize = function () {

        // Fehlermeldungen werden nur einmalig geladen
        if (ErrorController.loadedErrorMessages) {
            return;
        }

        var that = this;

        var path = "";
        if (this.player && this.player.model && this.player.model.playerConfig) {

            path = this.player.model.playerConfig.getErrorMessagesConfig();
            if ( path == "" )
            {
                path = this.player.model.playerConfig.getBaseUrl() + "base/conf/ErrorMessages.json";
            }

        } else
		{
			path = "base/conf/ErrorMessages.json";
		}

        $.ajax({
            type: "GET",
            async: false,
            url: path,
            dataType: "json",
	        beforeSend: function (xhr) {
		        if (xhr.overrideMimeType) {
			        xhr.overrideMimeType("application/json");
		        }
	        },
            encoding: "UTF-8",
            success: that.loadErrorMessagesSuccess
        });
    };

    /**
     * liest aus erfolgreich geladenem JSON alle Meldungen aus setzt sie in die Klasse/überschreibt sie ggf.
     * @method getInstanceByPlayerID
     * @public
     * @static
     * @param data
     */
    p.loadErrorMessagesSuccess = function (data) {

        for (var obj in data) {

            // Plugin-Fehler werden in der Form definiert:
            // "AddonName_Konstante" = "Fehlertext".
            //
            // Beispiel:
            // "AddonUntertitel_ERROR_LOADING_SUBTITLE_XML":"Ein Fehler beim Laden der Untertitel-XML ist aufgetreten.
            if (obj.toLowerCase().indexOf("addon") == 0) {
                var addonName = obj.substr(0, obj.indexOf("_"));
                var contantName = obj.substr(obj.indexOf("_") + 1);

                if (ns[addonName]) {
                    ns[addonName][contantName] = data[obj];
                }
            } else {
                ErrorController[obj] = data[obj];
            }
        }

        ErrorController.loadedErrorMessages = true;
        data = null;
    };

	p.throwStreamError = function (errorStr, nopixel) {

		var newErrorStr = "";
		$.each(arguments, function (index, value) {
			if (index >=2)
				newErrorStr += "\n" + value.toString() + "\n";
		});

        // Allow prevention of thepixel. This is used in case the error controller is only
        // triggered to perform stream switches (e.g. in case of alternative media arrays).
        nopixel = nopixel === true;

		if ( this.player )
		{

			var vc = this.player.viewCtrl;
			var m = this.player.model;
			var mc = m.mediaCollection;
			var gm = ns.GlobalModel.getInstance();

            if ( !nopixel )
            {
                try {
                    var maStream = mc.getMediaArray()[m.currentPluginID]._mediaStreamArray[vc.representationQuality];
                    this.player.pixelController.triggerCustomPixel (ns.PlayerPixelController.STREAM_ERROR, false,
                        {
                            message:newErrorStr,
                            stream: maStream._server + maStream._stream,
                            quality: vc.representationQuality,
                            plugin: m.currentPluginID
                        });
                } catch ( err )
                {
                    // Can be thrown on invalid access to the stream array (in case of switching from an alternating arr)
                    console.info(err);
                }
            }

			console.log("[ARD Player] stream error: " + m.currentPluginID + ":" + vc.representationQuality);

            // Fehlerhafte Qualität löschen
            mc.removeStreamQuality(m.currentPluginID, vc.representationQuality);

			if (vc.representationQualityOrder.length > 0)
			{
				vc.representationQuality = vc.representationQualityOrder.shift();
				vc.representationErrorTriggered = true;

				vc.updateOptionButtonVisibility();

				console.log("[ARD Player] => stream switch: " + m.currentPluginID + ":" + vc.representationQuality);
				//console.log("switch to... " + vc.representationQuality);

				var that = this;
				// new callstack
				setTimeout ( function () {
					if ( that.player && that.player.getCtrl() )
                    {
						that.player.getCtrl().loadStream();
						that.player.getCtrl().play();
                    }
				},1 );

			} else
			{
                
				// Im Fehlerfall - Pluginwechsel
				var ma = mc.getMediaArray();
				ma[ m.currentPluginID ] = false;
				vc.updateOptionButtonVisibility();

				if ( ma[ns.GlobalModel.FLASH] != false && gm.isFlashSupported && mc.getNumAvailableQualities(ns.GlobalModel.FLASH) > 0 )
				{
					console.log("[ARD Player] => plugin switch: " + ns.GlobalModel.FLASH);
					vc.activateFlash();
				} else
				{
					if ( ma[ns.GlobalModel.HTML5] != false && gm.isHTML5Supported && mc.getNumAvailableQualities(ns.GlobalModel.HTML5) > 0)
					{
						console.log("[ARD Player] => plugin switch: " + ns.GlobalModel.HTML5);
						vc.activateHTML();
					} else
					{
						//console.log(" Plugin Changed and nothing more left .. total fail");

                        this.player.pixelController.triggerCustomPixel (ns.PlayerPixelController.CLIP_ERROR, true,
                            {
                                message:newErrorStr
                            });

                        if ( mc._alternativeMediaArray != null )
                        {
                            console.log("[ARD PLAYER] => We are on an alternating media collection, switch to main.");
                            mc.setUseAlternativeMediaArrayType(false);

                            vc.restoreDefaults();
                            vc.updateOptionButtonVisibility();
                            //vc.representationChanged();

                            var that = this;
                            // new callstack
                            setTimeout ( function () {
                                if ( that.player && that.player.getCtrl() )
                                    that.player.getCtrl().representationChanged();
                            },1 );

                            return;
                        }

						console.log("[ARD Player] => exit");
						this.throwError(errorStr, true);
					}
				}

			}
		} else
		{
			this.throwError(errorStr, true);
		}

	};

    /**
     * Diese Funktion wird von außen angesprochen, um mögliche Fehlerquellen abzuhandeln.
     * Falls schon ein Player zugewiesen wurde, wird dieser mit ausgegeben.
     * @method throwError.
     * @public
     * @param errorStr. String. Statische Konstante die in dieser Klasse definiert worden sind. arguments. arguments. Weitere Argumente, z.b. Infos zu dem Error.
     */
    p.throwError = function (errorStr, isCritical) {
        var newErrorStr = "";

        $.each(arguments, function (key, value) {
            if (key != 1)
                newErrorStr += "\n" + value.toString() + "\n";
        });

        if ( this.player && this.player.model )
		{

			if ( this.player.model.playerConfig &&
                this.player.model.playerConfig.getOnErrorCallbackFunction() ) {
                this.player.model.playerConfig.getOnErrorCallbackFunction()(isCritical, newErrorStr);
        	}

            if (this.player.model.mediaCollection &&
                this.player.model.mediaCollection.getGeoBlocked() &&
                errorStr == ErrorController.ERROR_PLAYBACK )
            {
                newErrorStr = ErrorController.ERROR_PLAYBACK_GEOBLOCK;
            }
		}

        if (isCritical) {

			if ( this.player && this.player.viewCtrl )
				this.player.viewCtrl.destroy();

			if ( this._finalErrorState )
				return;

			this._finalErrorState = true;

            if (this.player) {

                if (!this.player.viewCtrl) {
                    // Fallback Darstellung
                    var t = $("<div></div>")
                        .appendTo($("#" + this.player._id))
                        .addClass(ns.ViewController.CLASS_ERR_MSG_VIEW);

                    $("<h2>")
                        .html(ns.ErrorController.ERROR_TITLE)
                        .appendTo(t);

                    var errImgPath = "base/img/error.png";
                    if ( this.player &&
                         this.player.model &&
                         this.player.model.playerConfig )
                    {
                        errImgPath = this.player.model.playerConfig.getBaseUrl() + "base/img/error.png";
                    }

                    $("<div>")
                        .addClass("error-img")
                        .append(
                            $("<img>")
                                .attr("src", errImgPath)
                                .attr("alt", "Streamfehler")
                        )
                        .appendTo(t);

                    $("<p>")
                        .html(newErrorStr)
                        .appendTo(t);

                    // Optionaler Zusatzlink im Footer
                    if (!$.isBlank(ErrorController.ERROR_FOOTER_LINK))
                    {
                        try {
                            $(ErrorController.ERROR_FOOTER_LINK)
                                .appendTo(t);
                        } catch ( ex ) {}
                    }

                } else {
                    this.player.viewCtrl.writeNotification(newErrorStr);
                }

            }
        }

        if ( this.player )
            this.player.dispatchCustomEvent(ns.Player.EVENT_ERROR, {isCritical:isCritical, message:newErrorStr});
    };

    /**
     * Funktion, die beim Disposement-Prozess des Players aufgerufen wird
     * @public
     * @static
     * @constant
     */
    p.dispose = function () {
		ErrorController.playerIDs [this.playerID] = undefined;
    };

    /**
     * Fehlertext, wenn kein Player definiert werden konnte.
     * @public
     * @static
     * @constant
     */
    ErrorController.NO_PLAYER_DEFINED = "Es wurde kein Player definiert.";


    /**
     * Fehlertext, wenn die mediaCollection-Json-Datei nicht gefunden wurde.
     * @public
     * @static
     * @constant
     */
    ErrorController.MC_JSON_FILE_NOT_FOUND = "Es wurde keine MediaCollection-Json-Datei gefunden.";

    /**
     * Fehlertext, wenn die mediaCollection-Json-URL falsch ist.
     * @public
     * @static
     * @constant
     */
    ErrorController.MC_JSON_FILE_WRONG_URI = "Die URI f&uuml;r die MediaCollection-Json-Datei ist falsch.";

    /**
     * Fehlertext, wenn Die MediaCollection unbekannt ist.
     * @public
     * @static
     * @constant
     */
    ErrorController.MC_UNKNOWN = "Dieser Clip kann auf Ihrem Betriebssystem nicht abgespielt werden.";

    /**
     * Fehlertext, wenn für die MediaCollection keine Standardqualität hinterlegt wurde.
     * @public
     * @static
     * @constant
     */
    ErrorController.MC_NO_DEFAULT_QUALITY = "Die MediaCollection ist fehlerhaft konfiguriert (Standard-Qualit&auml;t nicht hinterlegt).";

    /**
     * Fehlertext, wenn Die MediaCollection nicht registirert werden konnte.
     * @public
     * @static
     * @constant
     */
    ErrorController.MC_COULD_NOT_REGISTERED = "Die MediaCollection konnte nicht registriert werden, da sie unbekannt ist.";


    /**
     * Fehlertext, wenn die playerCollection-Json-Datei nicht gefunden wurde.
     * @public
     * @static
     * @constant
     */
    ErrorController.PC_JSON_FILE_NOT_FOUND = "Es wurde keine PlayerConfiguration-Json-Datei gefunden.";

    /**
     * Fehlertext, wenn die Playlist-Json-Datei nicht gefunden wurde.
     * @public
     * @static
     * @constant
     */
    ErrorController.PLAYLIST_JSON_FILE_NOT_FOUND = "Es wurde keine Playlist-Json-Datei gefunden.";

    /**
     * Fehlertext, wenn die playerCollection-Json-URL falsch ist.
     * @public
     * @static
     * @constant
     */
    ErrorController.PC_JSON_FILE_WRONG_URI = "Die URI f&uuml;r die PlayerConfiguration-Json-Datei ist falsch.";

    /**
     * Fehlertext, wenn Die PlayerCollection unbekannt ist.
     * @public
     * @static
     * @constant
     */
    ErrorController.PC_UNKNOWN = "Die PlayerConfiguration ist unbekannt.";

    /**
     * Fehlertext, wenn Die PlayerCollection nicht registirert werden konnte.
     * @public
     * @static
     * @constant
     */
    ErrorController.PC_COULD_NOT_REGISTERED = "Die PlayerConfiguration konnte nicht registriert werden, da sie unbekannt ist.";


    /**
     * Fehlertext, wenn das MediaCanvas-Objekt unbekannt ist, bei der Initialisierung des FlashPluginCtrl.
     * @public
     * @static
     * @constant
     */
    ErrorController.MEDIA_CANVAS_IS_UNKOWN = "Das MediaCanvas-Objekt ist unbekannt.";

    /**
     * Fehlertext, wenn die playerCollection-Json-URL falsch ist.
     * @public
     * @static
     * @constant
     */
    ErrorController.MEDIA_CANVAS_NOT_REGISTERED = "Das MediaCanvas-Objekt konnte nicht registriert werden, da es unbekannt ist.";

    /**
     * Fehlertext, beim Einbetten des Flashfilms.
     * @public
     * @static
     * @constant
     */
    ErrorController.ERROR_DURING_EMBED_FLASH = "Fehler beim Einbetten des Flashfilms.";

    /**
     * Fehlertext, beim Einbetten des Flashfilms.
     * @public
     * @static
     */
    ErrorController.ERROR_FLASH_RSL = "Fehler beim Laden des Players: Bitte leeren Sie Ihren Browsercache und laden Sie die Seite neu.";

    /**
     * Fehlertext, beim Laden von weiteren SWFS (Plugins)
     * @public
     * @static
     */
    ErrorController.ERROR_FLASH_PLUGINS = "Es konnten nicht alle Player-Komponenten geladen werden (32). Bitte leeren Sie den Browser-Cache und laden Sie die Seite neu. Weitere Informationen finden Sie in unserer Hilfe.";

    /**
     * Fehlertext,wenn keine Plugins unterstützt werden.
     * @public
     * @static
     * @constant
     */
    ErrorController.UNKOWN_TYPE_FOR_HTML = "Unbekannter Typ für die Generierung des HTML-Players.";

    /**
     * Fehlertext,wenn keine Plugins unterstützt werden.
     * @public
     * @static
     * @constant
     */
    ErrorController.NO_REQUIRED_PLUGINS_INSTALLED = "Ihr System verf&uuml;gt nicht über die ben&ouml;tigten Plug-ins";

    /**
     * Fehlertext, Player Control Generierung ist fehlgeschlagen.
     * @public
     * @static
     * @constant
     */
    ErrorController.PLAYER_CTRL_GENERATION_WAS_NOT_SUCCESSFUL = "Player Control Generierung ist fehlgeschlagen.";

    /**
     * Fehlertext,der MediaCanvas nicht generiert werden konnte.
     * @public
     * @static
     * @constant
     */
    ErrorController.MEDIACANVAS_COULD_NOT_GENERATED = "MediaCanvas konnte nicht generiert werden.";

    /**
     * Fehlertext,wenn keine Plugins unterstützt werden.
     * @public
     * @static
     * @constant
     */
    ErrorController.NO_PLUGIN_SUPPORTED = "Keine Plug-ins werden unterst&uuml;tzt.";


    /**
     * Fehlertext,die PluginID unbekannt ist.
     * @public
     * @static
     * @constant
     */
    ErrorController.PLUGIN_ID_UNKNOWN = "Unbekannte Plug-in-ID.";

    /**
     * Fehlertext, wenn die PluginID nicht unterstützt wird.
     * @public
     * @static
     * @constant
     */
    ErrorController.PLUGIN_ID_UNSUPPORTED = "Die Plug-in-ID wird nicht unterst&uuml;tzt.";

    /**
     * Fehlertext, wenn der Identifier undefined ist.
     * @public
     * @static
     * @constant
     */
    ErrorController.IDENTIFIER_IS_UNDEFINED = "Identifier ist undefined.";

    /**
     * Fehlertext, wenn die Arguemente fehlerhaft sind.
     * @public
     * @static
     * @constant
     */
    ErrorController.ILLEGAL_ARGUMENTS = "Eines der Argumente ist fehlerhaft.";


    /**
     * Fehlertext, wenn eine Template-Methode überschrieben wurde.
     * @public
     * @static
     * @constant
     */
    ErrorController.OVERRIDING_TEMPLATE_METHOD = "Dies ist eine Template Methode und muss &uuml;berschrieben werden.";

    ErrorController.IS_CRITICAL_NO = false;
    ErrorController.IS_CRITICAL_YES = true;
    ErrorController.REPRESENTATION_WIDTH_DETECTION_FAILED = "Ein Fehler bei der Ermittlung der Breite f&uuml;r die Repr&auml;sentation ist aufgetreten.";
    ErrorController.REPRESENTATION_HEIGHT_DETECTION_FAILED = "Ein Fehler bei der Ermittlung der H&ouml;he f&uuml;r die Repr&auml;sentation ist aufgetreten.";
    ErrorController.VIDEO_WIDTH_DETECTION_FAILED = "Ein Fehler bei der Ermittlung der Breite f&uuml;r das Video ist aufgetreten.";
    ErrorController.VIDEO_HEIGHT_DETECTION_FAILED = "Ein Fehler bei der Ermittlung der H&ouml;he f&uuml;r das Video ist aufgetreten.";
    ErrorController.MISCONF_MEDIA_COLL = "Das Audio/Video ist leider nicht abspielbar (mc).";

    ErrorController.NO_CTRL_DEFINED = "Es konnte kein Controller initialisiert werden.";
    ErrorController.IMG_SRC_IS_WRONG = "Bild kann nicht geladen werden.";

    ErrorController.ERROR_TITLE = "Da ging leider was schief ...";

    ErrorController.ERROR_PLAYBACK = "Bei der Wiedergabe ist ein Fehler aufgetreten. Alternativ können Sie einen externen Player nutzen.";
    ErrorController.ERROR_PLAYBACK_GEOBLOCK = "Bei der Wiedergabe ist ein Fehler aufgetreten. Alternativ können Sie einen externen Player nutzen. Wichtig: Inhalte mit Geoblocking können nur von Deutschland aus abgerufen werden.";

    ErrorController.ERROR_FOOTER_LINK = "";

    ns.ErrorController = ErrorController;

})(ardplayer, ardplayer.jq, ardplayer.console);


