/**
 * Klasse PlayerConfiguration
 * 
 * Konfiguriert alle Einstellungen die den Player betreffen.
 * Setzt die Standardeinstellungen ein.
 * Getter und setters sind hier zu finden, die diese Werte einstellen bzw zu erhalten.
 * Hält die Repräsentationsgrößen-Objekte für jede Qualität
 * 
 * Der Unterstrich wird verwendet, um Klassen, Attribute und Methoden zu deklarieren
 * als private zu deklarieren, als Namenskonvention.
 * 
 * Created:		2010_09-28	
 * Modified:	2012_01-05 by Klaus Panster
 *
 * @version 0.1
 * @author Jan Voelker
 * @copyright ARD.de
 * @module vo
 *
 */

(function (ns, $, console) {
    "use strict";

    /**
     * Klassenkonstruktor
     * @class PlayerConfiguration
     * @public
     * @constructor
     */
    var PlayerConfiguration = function () {
        this.initialize();
    };

    var p = PlayerConfiguration.prototype;

    /**
     * Initialisierungsmethode, wird vom Konstruktor aufgerufen.
     * @method initialize
     * @protected
     */
    p.initialize = function () {
        this._representationArray = new Array();

        /**
         * Startzeit des Videos
         * @property  _startTime
         * @private
         * @type number.
         **/
        this._startTime = 0;

        /**
         * Endzeit des Videos
         * @property  _endTime
         * @private
         * @type number.
         **/
        this._endTime = 0;

        /**
         * Autoplay-Eigenschaft.
         * Wird aktiviert, wenn es sich nicht um ein MobileDevice handelt
         * @property  _autoplay
         * @private
         * @type string.
         **/
        this._autoplay = ns.GlobalModel.getInstance().isMobileDevice ? "NOTHING" : "AUTOPLAY"; // for no autoplay choose "NOTHING"

        /**
         * Erzwingende Autoplay-Eigenschaft.
         * @property  _autoplayForced
         * @private
         * @type bool.
         **/
        this._autoplayForced = false;

        /**
         * Autosave-Eigenschaft.
         * Autosave setzt oder aktualisert ein Cookie bei jedem Qualitäts- und Pluginwechsel
         * @property  _autosave
         * @private
         * @type boolean.
         **/
        this._autosave = true;

        /**
         * Hier wird die Eigenschaft gesetzt, ob der Layer mit den kompletten Optionen für den Player dargestellt werden, oder nicht.
         * @property  _showOptions
         * @private
         * @type boolean.
         **/
        this._showOptions = true;

		/**
		 * Standardwert für die Anzeige der Plugineinstellungen
		 * @type {boolean}
		 * @private
		 */
		this._showOptions_Plugins = true;

		/**
		 * Standardwert für die Anzeige der Qualitätseinstellungen
		 * @type {boolean}
		 * @private
		 */
		this._showOptions_Quality = true;

        /**
         * Hier wird die Eigenschaft gesetzt, ob die aktuelle Spielzeit bei einem Qualitätswechsel gespeichert werden soll, oder nicht.
         * @property  _rememberCurrentTime
         * @private
         * @type {boolean}
         **/
        this._rememberCurrentTime = true;

        /**
         * Hier wird die Eigenschaft gesetzt, ob der Untertitel automatisch angezeigt werden soll, oder nicht.
         * @property  _showSubtitelAtStart
         * @private
         * @type {boolean}
         **/
        this._showSubtitelAtStart = false;

        // QoS Initialisation
        this._qosEndpoint = '';
        this._qosInterval = 10;
        this._qosMethod = "post";
        this._qosEnabled = false;
        this._convivaEnabled = false;

        this._baseUrl = "";
        this._baseAssetUrl = "base/";
        this._errorMessagesConfig = "";

        this._forceControlBarVisible = false;

        this._initialPlayhead = 0;

        this._initialVolume = 1;

        this._showEqualizer = true;

        this._showColorSettings = true;

        this._addons = new Array();

        // Akamai Sola Analytics
        this._solaAnalyticsEnabled = false;
        this._solaAnalyticsConfig = "";

		// Pixel Controler
		this._pixelConfig = "";

	    //anzeigen der sprungmarken;
	    this._chaptersEnabled = true;
    };

    /**
     * Setzt den Pfad zur ErrorMessages-Konfigurationsdatei.
     * @param pathToConfig
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setErrorMessagesConfig = function (pathToConfig) {
        this._errorMessagesConfig = pathToConfig;
    };

    /**
     * Gibt den Pfad zur ErrorMessages-Konfigurationsdatei aus.
     * @returns {string}
     */
    p.getErrorMessagesConfig = function () {
        return this._errorMessagesConfig;
    };

    /**
     * Definiert, ob Sola Analytics aktiviert werden soll.
     * Kann nicht zur Laufzeit gewechselt werden.
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setSolaAnalyticsConfig = function (path) {
        this._solaAnalyticsConfig = path;
    };

    p.getSolaAnalyticsConfig = function () {
        return this._solaAnalyticsConfig;
    };

    /**
     * Definiert den Pfad zur Pixel-Konfiguration
     * @deprecated Wird ab Version 3.10 in MediaCollection verschoben und
     * durch JSON-Schnittstelle ersetzt.
	 */
    p.setPixelConfig = function (path) {
        this._pixelConfig = path;
    };

    p.getPixelConfig = function () {
        return this._pixelConfig;
    };

    /**
     * Definiert, ob Sola Analytics aktiviert werden soll.
     * Kann nicht zur Laufzeit gewechselt werden.
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setSolaAnalyticsEnabled = function (flag) {
        this._solaAnalyticsEnabled = flag;
    };

    p.getSolaAnalyticsEnabled = function () {

		// #5340
		if ( $.cookie("SOLA") == "false" )
			return false;

        return this._solaAnalyticsEnabled;
    };

    /**
     * Definiert die zu registrierenden Addons
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setAddons = function () {
        var that = this;
        $.each( arguments, function (key, value) {
            that._addons.push(value);
        });
    };

    p.getAddons = function () {
        return this._addons;
    };

    /**
     * Setzt den Pfad + Dateinamen der zu ladenden CSS für den Flashfilm.
     * @param url Pfad und Dateiname
	 * @deprecated entfällt in 3.10
     */
    p.setSkinPathAndFileName = function (url) {
        this._skinPathAndFileName = url;
    };

    p.getSkinPathAndFileName = function () {
        return this._skinPathAndFileName;
    };

    /**
     * Stellt die Darstellung auf ein Qualitätsniveau ein
     * @public
     * @method setRepresentation
     * @param quality. Typ: Number Qualität des Streams. 0 - s, 1 - m, 2 - l, 3 - xl
     * @param width 	@deprecated
     * @param height 	@deprecated
     * @param layer 	@deprecated
     * @param scale 	@deprecated
     * @param representationClass. Typ: String. Optionale Zusatzklasse für diese Repräsentationsgröße
     * @return void
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setRepresentation = function (quality, width, height, layer, scale, representationClass) {

		if (isNaN(quality))
		{
			this._representationArray[0] = (quality || "m").toLowerCase();
		} else
		{
        	this._representationArray[quality] = representationClass;
		}

    };

    p.getRepresentation = function (quality) {
        return this._representationArray[quality];
    };

    /**
     * Getter für die Repräsentations-Klasse
     * @public
     * @method getRepresentationClass
     * @return representationClass. Typ: String.
     */
    p.getRepresentationClass = function () {
        var returnVal = "m";
        try {
			if ( this._representationArray[0])
            	returnVal = this._representationArray[0];
        }
        catch (e) {
        }
        return returnVal;
    };

    /**
     * Setter um die Start- und Endzeit für die Wiedergabe
     * @public
     * @method setStartStopTime
     * @param start. Typ: number. Start nach n Sekunden (0 für einen normalen Start)
     * @param stop. Typ: number. Stopt Video nach n Sekunden (0 für ein normales Ende)
     * @return void
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setStartStopTime = function (start, stop) {
        this._startTime = start;
        this._endTime = stop;
    };

    /**
     * Getter die eingestellte Startzeit für die Wiedergabe zu erhalten
     * @public
     * @method getStartTime
     * @return _startTime. Typ: number.
     */
    p.getStartTime = function () {
        return this._startTime;
    };

    /**
     * Getter die eingestellte Endzeit für die Wiedergabe zu erhalten
     * @public
     * @method getEndTime
     * @return _endTime. Typ: number.
     */
    p.getEndTime = function () {
        return this._endTime;
    };

    /**
     * Setter/Getter für die playhead-position des Players
     * Getter.
     * @public
     * @method setInitialPlayhead
     * @return _initialPlayhead. Typ: number.
     */
    p.getInitialPlayhead = function () {
        return this._initialPlayhead;
    };

    /**
     * Setter/Getter für die playhead-position des Players
     * Setter.
     * @public
     * @method setInitialPlayhead
     * @param position. Typ: number.
     * @return void
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setInitialPlayhead = function (position) {
        this._initialPlayhead = position;
    };

    /**
     * Setter/Getter für den Volumewert des Players
     * Getter.
     * @public
     * @method getInitialVolume
     * @return _initialVolume. Typ: number.
     */
    p.getInitialVolume = function () {
        return this._initialVolume;
    };

    /**
     * Setter/Getter für den Volumewert des Players
     * Setter.
     * @public
     * @method setInitialVolume
     * @param value. Typ: Number.
     * @return void
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setInitialVolume = function (value) {
        if (value > 1)
            value = value / 100;
        this._initialVolume = value;
    };

    /**
     * Verhindert oder erlaubt die Darstellung des Layers mit den kompletten Optionen für den Player
     * Setter.
     * @public
     * @method setShowOptions
     * @param bool. Typ: Boolean.
     * @return void
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setShowOptions = function (bool) {
        this._showOptions = bool;
    };

    /**
     * Getter ob der Layer mit den kompletten Optionen für den Player dargestellt werden, oder nicht.
     * @public
     * @method getShowOptions
     * @return _showOptions. Typ: Boolean.
     */
    p.getShowOptions = function () {
        return this._showOptions;
    };

    /**
     * Verhindert oder erlaubt ob die aktuelle Spielzeit bei einem Qualitätswechsel gespeichert wird.
     * @public
     * @method setRememberCurrentTime
     * @param bool Typ: Boolean.
     * @return void
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setRememberCurrentTime = function (bool) {
        this._rememberCurrentTime = bool;
    };

    /**
     * Getter ob die aktuelle Spielzeit bei einem Qualitätswechsel gespeichert wird.
     * @public
     * @method getRememberCurrentTime
     * @return _rememberCurrentTime. Typ: Boolean.
     */
    p.getRememberCurrentTime = function () {
        return this._rememberCurrentTime;
    };

    /**
     * Verhindert oder erlaubt ob der Player beim Start der Applikation automatisch startet
     * Bei einem true wird die Variable _autoplay auf den Stringwert: "AUTOPLAY"
     * Bei einem false wird die Variable _autoplay auf den Stringwert: "NOTHING"
     * @public
     * @method setAutoPlay
     * @param param Typ: Boolean / String
     * @return void
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setAutoPlay = function (param) {
        if (param == "FORCE")
        {
            this._autoplayForced = true;
            param = true;
        }

        if (param === true) {
            this._autoplay = "AUTOPLAY";
        }
        else {
            this._autoplay = "NOTHING";
        }
    };

    /**
     * Getter ob der Player beim Start der Applikation automatisch startet.
     * Die richtigen Werte sind hier: "AUTOPLAY" und "NOTHING"
     * @public
     * @method getAutoPlay
     * @return _autoplay. Typ: String.
     * @deprecated entfällt in 3.10 - wird zu getAutoplay() umbenannt
     */
    p.getAutoPlay = function () {
        return this._autoplay;
    };

    /**
     * Getter Funktion, ob autoplay aktiviert ist.
     * @method getAutoPlayBoolean
     * @return bool. Typ: Boolean.
     * @deprecated entfällt in 3.10 - siehe getAutoplay()
     */
    p.getAutoPlayBoolean = function () {
        return this._autoplay == "AUTOPLAY" || this._autoplay == "FORCE" || this._autoplay === true;
    };

    /**
     * Getter Funktion, ob autoplay erzwungen wird.
     * @method getAutoPlayBoolean
     * @return bool. Typ: Boolean.
     * @deprecated entfällt in 3.10 - siehe getAutoplay()
     */
    p.getAutoPlayForcedBoolean = function () {
        return this._autoplay == "FORCE" || this._autoplayForced === true;
    };

    /**
     * Verhindert oder erlaubt ob ein autosave erlaubt ist.
     * Autosave setzt oder aktualisert ein Cookie bei jedem Qualitäts- und Pluginwechsel
     * @public
     * @method setAutoSave
     * @param bool Typ: Boolean.
     * @return void
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setAutoSave = function (bool) {
        this._autosave = bool;
    };

    /**
     * Getter ob die aktuelle Spielzeit bei einem Qualitätswechsel gespeichert wird.
     * @public
     * @method getRememberCurrentTime
     * @return _rememberCurrentTime. Typ: Boolean.
     */
    p.getAutoSave = function () {
        return this._autosave;
    };

    /**
     * Setter and getter für die Callback Funktion ob der Stream am Ende ist
     * @public
     * @method setOnMediaFinishedFunction
     * @method getOnMediaFinishedFunction
     * @param func
     * @return function
     * @deprecated Entfällt ab Version 3.10 - stattdessen Player-Event 'EVENT_END_STREAM' verwenden.
     */
    p.setOnMediaFinishedFunction = function (func) {
        this._onMediaFinishedFunction = func;
    };
    p.getOnMediaFinishedFunction = function () {
        return this._onMediaFinishedFunction;
    };

    /**
     * Setter and getter für die Callback Funktion der beim Zeitwechsel gefeuert wird
     * @public
     * @method setOnTimeUpdateFunction
     * @method getOnTimeUpdateFunction
     * @param func
     * @return function
     * @deprecated Entfällt ab Version 3.10 - stattdessen Player-Event 'EVENT_UPDATE_STREAM_TIME' verwenden.
     */
    p.setOnTimeUpdateFunction = function (func) {
        this._onTimeUpdateFunction = func;
    };
    p.getOnTimeUpdateFunction = function () {
        return this._onTimeUpdateFunction;
    };

    /**
     * Setter and getter für die Callback Funktion der beim Status Wechsel "play", "pause", "stop", "init" und "ready" gefeuert wird
     * @public
     * @method setOnStatusChangeFunction
     * @method getOnStatusChangeFunction
     * @param func
     * @return function
     * @deprecated Entfällt ab Version 3.10 - stattdessen Player-Event 'EVENT_STATUS_CHANGE' verwenden.
     */
    p.setOnStatusChangeFunction = function (func) {
        this._onStatusChangeFunction = func;
    };
    p.getOnStatusChangeFunction = function () {
        return this._onStatusChangeFunction;
    };

    /**
     * Setter and getter für die Callback Funktion der beim Qualitäts-Wechsel s,m.l.xl gefeuert wird
     * @public
     * @method  setOnQualityChangeFunction
     * @method getOnQualityChangeFunction
     * @param func
     * @return function
     * @deprecated Entfällt ab Version 3.10 - stattdessen Player-Event 'EVENT_QUALITY_CHANGE' verwenden.
     */
    p.setOnQualityChangeFunction = function (func) {
        this._onQualityChangeFunction = func;
    };
    p.getOnQualityChangeFunction = function () {
        return this._onQualityChangeFunction;
    };

    /**
     * Setter and getter für die Callback Funktion der beim PlugIn-Wechsel flash, html5, windowsmedia gefeuert wird
     * @public
     * @method setOnPluginChangeFunction
     * @method getOnPluginChangeFunction
     * @param func
     * @return function
     * @deprecated Entfällt ab Version 3.10 - stattdessen Player-Event 'EVENT_PLUGIN_CHANGE' verwenden.
     */
    p.setOnPluginChangeFunction = function (func) {
        this._onPluginChangeFunction = func;
    };
    p.getOnPluginChangeFunction = function () {
        return this._onPluginChangeFunction;
    };

    /**
     * Setter and getter für die Callback Funktion die bei Entstehung eines Fehlers aufgerufen wird.
     * @public
     * @method setOnErrorCallbackFunction
     * @method getOnErrorCallbackFunction
     * @param func
     * @return function
     * @deprecated Entfällt ab Version 3.10 - stattdessen Player-Event 'EVENT_ERROR' verwenden.
     */
    p.setOnErrorCallbackFunction = function (func) {
        this._onErrorCallbackFunction = func;
    };
    p.getOnErrorCallbackFunction = function () {
        return this._onErrorCallbackFunction;
    };

    /**
     * Untertitel bei Start des Clips nicht automatisch einblenden.
     * @public
     * @method setNoSubtitelAtStart
     * @deprecated Entfällt - siehe setShowSubtitelAtStart
     */
    p.setNoSubtitelAtStart = function () {
        this.setShowSubtitelAtStart(false);
    };

    /**
     * Gibt zurück ob Untertitel automatisch angezeigt werden.
     * @public
     * @method getShowSubtitelAtStart
     * @return boolean
     */
    p.getShowSubtitelAtStart = function () {
        return this._showSubtitelAtStart === true || !$.isBlank(this._showSubtitelAtStart);
    };

    /**
     * Gibt an, ob die Untertitel standardmäßig bei Start des Clips aktiviert werden sollen.
     * @param enabled
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setShowSubtitelAtStart = function(enabled) {
        this._showSubtitelAtStart = enabled === true; // cast non-boolean
    };

    /**
     * Setzt den Basispfad. Es werden alle relevanten Medien (primär von Flash)
     * relativ zu diesem geladen.
     * @public
     * @method setBaseUrl
     * @return void
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setBaseUrl = function (url) {
        this._baseUrl = url;
    };

    p.getBaseUrl = function () {
        return this._baseUrl;
    };

    /**
     * Setzt den Basispfad für Assets (JSON Konfigurationen, ggf. programmatische Bilder etc.).
     * @public
     * @method setBaseAssetUrl
     * @return void
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setBaseAssetUrl = function (url) {
        this._baseAssetUrl = url;
    };

    p.getBaseAssetUrl = function () {
        return this._baseAssetUrl;
    };

    /**
     * Setzt Endpunkt für das WDR QoS Plugin. Absolute URL-Angabe.
     * @public
     * @method setQoSEndpoint
     * @return void
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setQoSEndpoint = function (url) {
        this._qosEndpoint = url;
    };

    p.getQoSEndpoint = function () {
        return this._qosEndpoint;
    };

    /**
     * Setzt das Intervall, in dem QoS Informationen an den Endpunkt übergeben werden.
     * @public
     * @method setQoSInterval
     * @return void
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setQoSInterval = function (seconds) {
        this._qosInterval = seconds;
    };

    p.getQoSInterval = function () {
        return this._qosInterval;
    };

    /**
     * Setzt die Methode, mit der die QoS Daten übergeben werden. Mögliche Parameter
     * sind "POST" oder "GET".
     * @public
     * @method setQoSMethod
     * @return void
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setQoSMethod = function (method) {
        this._qosMethod = method;
    };

    p.getQoSMethod = function () {
        return this._qosMethod;
    };

    /**
     * Aktiviert oder deaktiviert die Verwendung des QoS WDR Plugins
     * @public
     * @method setQoSEnabled
     * @return void
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setQoSEnabled = function (isEnabled) {
        this._qosEnabled = isEnabled;
    };

    p.getQoSEnabled = function () {
        return this._qosEnabled;
    };

    /**
     * Aktiviert oder deaktiviert die Verwendung des Conviva QoS Plugins
     * @public
     * @method setConvivaEnabled
     * @return void
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setConvivaEnabled = function (isEnabled) {
        this._convivaEnabled = isEnabled;
    };

    p.getConvivaEnabled = function () {
        return this._convivaEnabled;
    };

    /**
     * Erzwingt im Abspielmodus die dauerhafte Anzeige der Steuerleiste
     * @public
     * @method setForceControlBarVisible
     * @return void
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setForceControlBarVisible = function (flag) {
        this._forceControlBarVisible = flag;
    };

    p.getForceControlBarVisible = function () {
        return this._forceControlBarVisible;
    };

    /**
     * Getter/Setter Steuert die Anzeige des Equalizer-Bildes
     * @public
     * @method setShowEqualizer
     * @return void
     * @see setShowEqualizer
     * @see getShowEqualizer
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setShowEqualizer = function (flag) {
        this._showEqualizer = flag;
    };

    p.getShowEqualizer = function () {
        return this._showEqualizer;
    };

    /**
     * Getter/Setter Steuert die Anzeige der Farbeinstellungen
     * @public
     * @method set
     * @return void
     * @see setShowColorSettings
     * @see getShowColorSettings
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
     */
    p.setShowColorSettings = function (flag) {
        this._showColorSettings = flag;
    };

    p.getShowColorSettings = function () {
        return this._showColorSettings;
    };


	/**
	 * Gibt an, ob die Pluginauswahl angezeigt werden soll.
	 * @param value
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
	 */
	p.setShowOptions_Plugins = function (value) {
		this._showOptions_Plugins = value;
	};

	p.getShowOptions_Plugins = function () {
		return this._showOptions_Plugins;
	};

	/**
	 * Gibt an, ob die Qualitätsauswahl angezeigt werden soll.
	 * @param value
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
	 */
	p.setShowOptions_Quality = function (value) {
		this._showOptions_Quality = value;
	};

	p.getShowOptions_Quality = function () {
		return this._showOptions_Quality;
	};


	/**
	 * Gibt an, ob die Sprungmarken angezeigt werden sollen.
	 * @param value
     * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
	 */
	p.setChaptersEnabled = function (value) {
		this._chaptersEnabled = value;
	};

	p.getChaptersEnabled = function () {
		return this._chaptersEnabled;
	};

    p.clone = function () {
        var clone = null;

        new ns.GetPlayerConfigByJsonCmd().execute(this, function (c) {
            if (c && c instanceof PlayerConfiguration)
                clone = c;
        });

        return clone;
    };

    /**
      * @deprecated Wird ab Version 3.10 durch JSON-Schnittstelle ersetzt.
      */
    ns.PlayerConfiguration = PlayerConfiguration;

})(ardplayer, ardplayer.jq, ardplayer.console);
