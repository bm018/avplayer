/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Saban Uenlue
 * @module model
 **/

(function (ns, $, console) {
    "use strict";
    /**
     * Diese Klasse wird in dem Projekt als globales Model genutzt.
     * @class GlobalModel
     * @public
     * @constructor
     **/
    var GlobalModel = function () {
        if (GlobalModel.instance) {
            return   GlobalModel.instance;
        }
        GlobalModel.instance = this;

        this.initialize();
    };

    // Versionsnummer des Players
    GlobalModel.VERSION = "3.9.0";

    /**
     * Diese Methode erstellt das GlobalModel, oder gibt die schon erstellte Instanz zurück
     * @public
     * @static
     * @return: Rückgabe eines neuen PresentationModels oder dessen Singleton-Instanz
     */
    GlobalModel.getInstance = function () {
        return new GlobalModel();
    };

    /*
     * Löscht die Parameter die zum erstellen eines Singeltons genutzt werden
     * @method resetSingleton
     * @public
     * @param void
     * @return void
     * */
    GlobalModel.resetSingleton = function () {
        GlobalModel.instance = undefined;
    };

    var p = GlobalModel.prototype;

    /**
     * Initialization method.
     * @method initialize
     * @protected
     **/
    p.initialize = function () {

        // Model specific support object
        this.support = {};

		var audio = $("<audio/>")[0];
        this.support.audio = !!(audio.canPlayType);

		var testExtensions = ["mp3", "ogg", "mpeg", "wav", "m4a", "mp4"];
        this.support.audioExtensions = {};
		if (this.support.audio)
		{
			for ( var i = 0; i < testExtensions.length; i++ )
			{
				var ext = testExtensions[i];
				var playType = audio.canPlayType("audio/" + ext);
				if ( playType != "" && playType != "no" )
				{
                    this.support.audioExtensions[ext] = playType;
				}
			}

			var streamingSupport = audio.canPlayType("audio/x-mpegurl");
			if (  streamingSupport != "" && streamingSupport != "no" )
			{
                this.support.audioExtensions.m3u = streamingSupport;
                this.support.audioExtensions.m3u8 = streamingSupport;
			}

			var mpegSupport = audio.canPlayType("audio/mpeg");
			if (  mpegSupport != "" && mpegSupport != "no" )
			{
                this.support.audioExtensions.mp3 = mpegSupport;
			}
		}

        var video = $("<video/>")[0];
        this.support.video = !!(video.canPlayType);
        video = null;

        /**
         * true - wenn html5 video  unterstützt werden
         * @public
         * @property html5VideoSupported
         **/
        this.html5VideoSupported = this.support.video;

        /**
         * true - wenn html5 video mp4 mit h264
         * @public
         * @property html5mp4VideoSupported
         **/
        this.html5mp4VideoSupported = false;

        /**
         * Gibt an, ob html5 Video via hls unterstützt wird.
         * @type {boolean}
         */
        this.html5streamingVideoSupported = false;

        /**
         * true - wenn html5 video ogg mit theora  unterstützt
         * @public
         * @property html5oggVideoSupported
         **/
        this.html5oggVideoSupported = false;

        /**
         * true - wenn html5 video webm mit vp8 unterstützt
         * @public
         * @property html5webmVideoSupported
         **/
        this.html5webmVideoSupported = false;

        if (this.html5VideoSupported) {
            var vid;

            try {
                vid = $('<video />')[0];
            } catch (e) {
            }

            try {
                this.html5mp4VideoSupported = vid.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').match(/maybe|probably/i) != undefined;
            } catch (e) {
            }

            try {
                this.html5oggVideoSupported = vid.canPlayType('video/ogg; codecs="theora"').match(/maybe|probably/i) != undefined;
            } catch (e) {
            }

            try {
                this.html5webmVideoSupported = vid.canPlayType('video/webm; codecs="vp8, vorbis"').match(/maybe|probably/i) != undefined;
            } catch (e) {
            }

            try {
                this.html5streamingVideoSupported = vid.canPlayType('application/x-mpegURL').match(/maybe|probably/i) != undefined;
            } catch (e) {
            }

            try {
                this.html5VideoSupported = this.html5mp4VideoSupported || this.html5oggVideoSupported || this.html5webmVideoSupported;
            } catch (e) {
            }
        }

        /**
         * true - wenn html5 audio unterstützt werden
         * @property html5AudioSupported
         **/
        this.html5AudioSupported = this.support.audio;

        /**
         * true - wenn html5 audio mpeg mit mp3 unterstützt
         * @property html5mp3AudioSupported
         **/
        this.html5mp3AudioSupported = false;

        /**
         * true - wenn html5 audio ogg mit vorbis unterstützt
         * @property html5oggAudioSupported
         **/
        this.html5oggAudioSupported = false;

        /**
         * true - wenn html5 audio wav mit 1 unterstützt
         * @property html5wavAudioSupported
         **/
        this.html5wavAudioSupported = false;

        if (this.html5AudioSupported) {
            var aud;

            try {
                aud = $('<audio />')[0];
            } catch (e) {
            }

            try {
                this.html5mp3AudioSupported = aud.canPlayType('audio/mpeg; codecs="mp3"').match(/maybe|probably/i) != undefined;
            } catch (e) {
            }

            try {
                this.html5oggAudioSupported = aud.canPlayType('audio/ogg; codecs="vorbis"').match(/maybe|probably/i) != undefined;
            } catch (e) {
            }

            try {
                this.html5wavAudioSupported = aud.canPlayType('audio/wav; codecs="1"').match(/maybe|probably/i) != undefined;
            } catch (e) {
            }

            this.html5AudioSupported = this.html5mp3AudioSupported || this.html5oggAudioSupported || this.html5wavAudioSupported;
        }

        /**
         * gibt true zurück, wenn das Device ein iPhone ist
         * @property isIPhoneDevice
         **/
        this.isIPhoneDevice = navigator.userAgent.match(/iPhone/i) != undefined;

        /**
         * gibt true zurück, wenn das Device ein iPad ist
         * @property isIPadDevice
         **/
        this.isIPadDevice = navigator.userAgent.match(/iPad/i) != undefined;

        /**
         * gibt true zurück, wenn das Device ein iPod ist
         * @property isIPodDevice
         **/
        this.isIPodDevice = navigator.userAgent.match(/iPod/i) != undefined;
        if (this.isIPodDevice)
            this.isIPhoneDevice = false;

        /**
         * gibt true zurück, wenn das Device ein iOS Device ist
         * @property isIOSDevice
         **/
        this.isIOSDevice = navigator.userAgent.match(/iOS/i) != undefined ||
            this.isIPadDevice ||
            this.isIPhoneDevice ||
            this.isIPodDevice;

        /**
         * gibt true zurück, wenn das Device ein Android Device ist
         * @property isAndroidDevice
         **/
        this.isAndroidDevice = navigator.userAgent.match(/Android/i) != undefined;

        /**
         * gibt true zurück, wenn das Device ein HP Device ist
         * @property isHPDevice
         **/
        this.isHPDevice = navigator.userAgent.match(/webOS/i) != undefined;

        /**
         * gibt true zurück, wenn das Device ein Blackberry Playbook ist
         * @property isPlaybookDevice
         **/
        this.isPlaybookDevice = navigator.userAgent.match(/PlayBook/i) != undefined;

        /**
         * gibt true zurück, wenn das Device ein Blackberry Device ist
         * @property isBlackBerryDevice
         **/
        this.isBlackBerryDevice = navigator.userAgent.match(/BlackBerry/i) != undefined
            || this.isPlaybookDevice;

        /**
         * gibt true zurück, wenn das Device ein Windows Phone ist
         * @property isWindowsPhone
         **/
        this.isWindowsPhone = navigator.userAgent.match(/Windows Phone/i) != undefined;

	    /**
	     * gibt true zurück, wenn das Device ein Amazon Kindle ist
	     * Kindle Fire–KFOT
	     * Kindle Fire HD–KFTT
	     * Kindle Fire HD 8.9"–KFJWI
	     * Kindle Fire HD 8.9" 4G–KFJWA
	     * Kindle Fire HD 7" (3rd Generation)–KFSOWI
	     * Kindle Fire HDX 7" (3rd Generation)–KFTHWI
	     * Kindle Fire HDX 7" (3rd Generation) 4G–KFTHWA
	     * Kindle Fire HDX 8.9" (3rd Generation)–KFAPWI
	     * Kindle Fire HDX 8.9" (3rd Generation) 4G–KFAPWA
	     * @property isKindle
	     **/
        this.isKindle = (navigator.userAgent.match(/Kindle/i)
				        || navigator.userAgent.match(/Silk/i)
				        || navigator.userAgent.match(/KFOT/i)
				        || navigator.userAgent.match(/KFTT/i)
				        || navigator.userAgent.match(/KFJWI/i)
				        || navigator.userAgent.match(/KFJWA/i)
				        || navigator.userAgent.match(/KFSOWI/i)
				        || navigator.userAgent.match(/KFTHWI/i)
				        || navigator.userAgent.match(/KFTHWA/i)
				        || navigator.userAgent.match(/KFAPWI/i)
				        || navigator.userAgent.match(/KFAPWA/i)
				        ) != undefined ;

	    /**
         * gibt true zurück, wenn das device ein mobile client  ist
         * @property isMobileDevice
         **/
        this.isMobileDevice = this.isBlackBerryDevice || this.isHPDevice || this.isAndroidDevice || this.isIOSDevice || this.isWindowsPhone || this.isKindle;

        /**
         * gibt true zurück, wenn FlashPlayer 10.2 oder größer installiert ist
         * @property isFlashSupported
         **/
        this.isFlashSupported = swfobject.hasFlashPlayerVersion("10.2.0") === true;

        /**
         * Gibt an, ob der Browser ein IE11 ist.
         */
        this.browserIsIE11 = !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);

        /**
         * gibt true zurück, wenn der Browser des Clients ein opera ist
         * @property browserIsOpera
         **/
        this.browserIsOpera = navigator.userAgent.toLowerCase().match(/opera/i) != undefined ||
            navigator.userAgent.toLowerCase().match(/OPR\//i) != undefined;

        /**
         * gibt true zurück, wenn der Browser des Clients ein Firefox Browser ist
         * @property browserIsFirefox
         **/
        this.browserIsFirefox = navigator.userAgent.toLowerCase().match(/firefox/i) !=undefined;

        /**
         * gibt den unique identifier zurück
         * @property uid String
         * @type String
         * @static
         **/
        this.uid = ns.GUID.generateUID();

        /**
         * informationen über die Plattform des Clients
         * @property platform
         * @type String
         **/
        this.platform = navigator.platform;

        /**
         * Alle Parameter die über die Adressleiste definiert wurden
         * @property startParams
         */
        this.startParams = ns.QueryParser.getInstance().getQueryObject();

        /**
         * name des ARD Player Cookies
         * @privat
         * @static
         * @property COOKIE_NAME
         * @constant
         */
        var COOKIE_NAME = "ard_mediathek_player_settings";

        /**
         * Cookie Instanz des ARD Player
         * @public
         * @property cookie
         */
        this.cookie = ns.Cookie.getInstance(COOKIE_NAME);

        // Read console debug flag
        if (this.cookie.get(ns.Cookie.DEBUG) === 1)
            ns.debug(true);

        this._volume = null;
        this._muted = null;
        this._subtitleEnabled = null;

        /**
         * Liste der unterstützten PlugIn Namen
         * @property supportedPlugInNamess
         */
        this.supportedPlugInNamess = [];
        /**
         * Liste der unterstützten PlugIn  IDs
         * @property supportedPlugIns
         */
        this.supportedPlugIns = [];

        if (this.isFlashSupported) {
            this.supportedPlugIns.push(GlobalModel.FLASH);
            this.supportedPlugInNamess.push("flash");
        }

        /**
         * zu testzwecken kann der query parameter forceAllHTML5Codecs=1 verwendet werden
         * damit wird dann nicht mehr "nur" nach der MP3 und H.264 geschaut
         * @private html5Supported
         */
        this.isHTML5Supported = this.html5mp4VideoSupported || this.html5mp3AudioSupported;
        if (this.startParams && this.startParams.forceAllHTML5Codecs && this.startParams.forceAllHTML5Codecs === "1") {
            this.isHTML5Supported = this.isHTML5Supported || this.html5oggAudioSupported || this.html5oggVideoSupported ||
                this.html5wavAudioSupported || this.html5webVideoSupported;
        }

        if (this.isHTML5Supported) {
            this.supportedPlugIns.push(GlobalModel.HTML5);
            this.supportedPlugInNamess.push("html5(video&audio)");
        }

        // Standardplugin
        this._pluginId = GlobalModel.HTML5;

        this.keyboardPlayerController = ns.KeyboardPlayerController.getInstance();

        // #2064 Mute Reset
        if ( this.getMuted() )
        {
            this.setMuted(false);
            this.setVolume(1);
        } else
        {
            if ( this.getVolume() < 0.05 )
            {
                this.setVolume(0.5);
            }
        }
    };

	/**
	 * Liest die zuletzt abspielbare Qualität aus dem Cookie aus
	 * @returns {*}
	 */
	p.getLastQuality = function () {
		var q = this.cookie.get(ns.Cookie.QUALITY);

        if ( !isNaN(q) )
            q = Math.max(parseInt(q),0);
        else
		if ( q != "auto" )
			return false;

		return q;
	};

	/**
	 * Hinterlegt die zuletzt abspielbare Qualität im Cookie
	 * @param value Qualitätsindex
	 */
	p.setLastQuality = function (value) {
		this.cookie.add(ns.Cookie.QUALITY, value);
	};

	/**
	 * Gibt die den zuletzt verwendeten Hls.js Level-Index zurück
	 * @returns {int}
	 */
	p.getLastUsedHlsLevelIndex = function () {
		var q = this.cookie.get(ns.Cookie.HLS_LEVEL);

        if ( !isNaN(q) )
            return parseInt(q);

		return -1; // == automatisch
	};

	/**
	 * Setzt den zuletzt verwendeten Hls.js Level-Index
	 * @param value Index
	 */
	p.setLastUsedHlsLevelIndex = function (value) {
		this.cookie.add(ns.Cookie.HLS_LEVEL, value);
	};

    /**
     * gibt den PlugIn Index des zu letzt benutzeteen Plugins Zurück
     * @return plugIn int 0,1 für GlobalModel.FLASH, GlobalModel.HTML5
     * @default 1 | GlobalModel.HTML5;
     */
    p.getPluginID = function (fromCookie) {
        var q = this.startParams;
        if (q && q.forcePlugInID && !isNaN(Number(q.forcePlugInID))) {
            return Number(q.forcePlugInID);
        }

        var p = Number(this.cookie.get(ns.Cookie.PLUGIN));

        var returnVal;
        if (isNaN(p) || !fromCookie)
		{
			if ( fromCookie )
			{
				returnVal = -1;
			} else
			{
            	returnVal = this._pluginId;
			}
		}
        else
		{
			returnVal = p;
		}

        return returnVal;
    };

    /**
     * gibt den PlugIn Index des zu letzt benutzeteen Plugins Zurück
     * @methode setPluginID;
     * @param plugInID int 0,1 für GlobalModel.FLASH, GlobalModel.HTML5
     */
    p.setPluginID = function (plugInID, saveInCookie) {

        switch (plugInID) {
            case GlobalModel.FLASH:
            case GlobalModel.HTML5:

                if (saveInCookie)
                    this.cookie.add(ns.Cookie.PLUGIN, plugInID);
                this._pluginId = plugInID;

                break;
            default:
                var errorCtrl = ns.ErrorController.getInstance();
                errorCtrl.throwError(ns.ErrorController.PLUGIN_ID_UNKNOWN, ns.ErrorController.IS_CRITICAL_YES, plugInID);
                break;
        }
    };

    p.hasSubtitlePreference = function () {
        var m = this.cookie.get(ns.Cookie.SUBTITLE_ENABLED);
        return m != undefined;
    };

    p.getSubtitleEnabled = function () {
        var m = this.cookie.get(ns.Cookie.SUBTITLE_ENABLED);
        var returnVal;
        if (m == undefined) {
            if (this._subtitleEnabled == null) {
                returnVal = false;
            } else {
                returnVal = this._subtitleEnabled;
            }
        }
        else
            returnVal = m;

        return returnVal;
    };

    p.setSubtitleEnabled = function (flag) {
        this._subtitleEnabled = flag;
        this.cookie.add(ns.Cookie.SUBTITLE_ENABLED, flag);
    };

    p.getMuted = function () {
        var m = this.cookie.get(ns.Cookie.VOLUME_MUTE);
        var returnVal;
        if (m == undefined) {
            if (this._muted == null) {
                returnVal = false;
            } else {
                returnVal = this._muted;
            }
        }
        else
            returnVal = m;

        return returnVal;
    };

    p.setMuted = function (flag) {
        this._muted = flag;
        this.cookie.add(ns.Cookie.VOLUME_MUTE, flag);
    };

    p.getVolume = function () {

		// Softwareseitig liegt die Lautstärke immer bei 100%, und kann auf Mobilegeraeten nur
		// durch die Hardware-Schalter geaendert werden. #5380
		if ( this.isMobileDevice )
			return 1;

        var v = Number(this.cookie.get(ns.Cookie.VOLUME_VALUE));

        var returnVal;
        if (isNaN(v) == true) {
            if (this._volume == null) {
                returnVal = 1;
            } else {
                returnVal = this._volume;
            }
        }
        else
            returnVal = v;

        return returnVal;
    };

    p.setVolume = function (level) {
        this._volume = level;
        this.cookie.add(ns.Cookie.VOLUME_VALUE, level);
    };

    /**
     * Statischer Wert der für den Playertyp genutzt wird
     * @public
     * @static
     * @constant
     */
    GlobalModel.FLASH = 0;

    /**
     * Statischer Wert der für den Playertyp genutzt wird
     * @public
     * @static
     * @constant
     */
    GlobalModel.HTML5 = 1;

    ns.GlobalModel = GlobalModel;

})(ardplayer, ardplayer.jq, ardplayer.console);
