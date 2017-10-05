/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Saban Uenlue
 * @module utils
 **/
(function (ns, $, console) {
    "use strict";
    /**
     * * Diese Klasse wird als Cookie-Klasse für den Player genutzt.
     * Hier werden unterschiedliche Werte auf dem Rechner des Clients hinterlegt, wie z.B. das zuletzt genutzte Plugin.
     * @class Cookie
     * @constructor
     **/
    var Cookie = function (cookiename) {
        if (Cookie.__IDs__ == undefined)
            Cookie.__IDs__ = {};

        if (cookiename == undefined) {
            var errorCtrl = ns.ErrorController.getInstance();
            errorCtrl.throwError(ns.ErrorController.IDENTIFIER_IS_UNDEFINED, ns.ErrorController.IS_CRITICAL_YES);
        }

        if (Cookie.__IDs__ [cookiename]) {
            return Cookie.__IDs__ [cookiename];
        }

        Cookie.__IDs__ [cookiename] = this;

        /**
         * singleton identifier
         * @property identifier
         * @type String
         */
        this.identifier = cookiename;
        this.initialize();
    };

    Cookie.resetSingleton = function () {
        Cookie.__IDs__ = undefined;
    };

    /**
     * singleton factory for a playerinstance
     * @param identifier
     * @return Cookie
     */
    Cookie.getInstance = function (identifier) {
        return new Cookie(identifier);
    };

    var p = Cookie.prototype;

    /**
     * Initialization method.
     * @method initialize
     * @protected
     **/
    p.initialize = function () {
    };

    p.set = function (data) {
        try {
            var cookieData = $.extend({}, this.get(), data);
            $.cookie(this.identifier, JSON.stringify(cookieData), { path:'/', expires:30 });
        } catch (exception) {
            data = {};
        }
    };

    /**
     * Speichert ein key/value pair in das cookie
     * @method add
     * @public
     * @param  key. Typ: Object.
     * @param  value. Typ: Object.
     * @return void
     **/
    p.add = function (key, value) {
        var obj = {};
        obj[key] = value;
        this.set(obj);
    };

    /**
     * Gibt den value-Wert zurück, zu dem passenden key-Wert, der als Parameter übergeben wird.
     * @method get
     * @public
     * @param  key. Typ: Object. Key-Wert der gesucht wird.
     * @return  value. Typ: Object. Value-Wert des gesuchten key-wertes
     **/
    p.get = function (key) {

        var data;

        try {
            var cookieData = $.cookie(this.identifier);
            data = cookieData ? JSON.parse(cookieData) : {};
        } catch (exception) {
            data = {};
        }

        if (key) {
            return data[key];
        }

        return data;
    };

    /**
     * Löscht das key-value-Wert, zu dem passenden key-Wert, der als Parameter übergeben wird.
     * @method remove
     * @public
     * @param  key. Typ: Object. Key-Wert der gelöscht werden soll.
     * @return  void
     **/
    p.remove = function (key) {
        var data = {};
        if (key) {
            data = this.get();
            delete data[key];
        }

        try {
            $.cookie(this.identifier, JSON.stringify(data), { path:'/' });
        } catch (exception) {
        }

    };

    /**
     * Löscht jedes Element aus dem Cookie
     * @method removeAll
     * @public
     * @return void
     **/
    p.removeAll = function () {
        var that = this;
        var map = this.get();
        $.each(map, function (key, value) {
            that.remove(key);
        });
    };

    /**
     * Gibt jedes Element aus dem Cookie zurück
     * @method dataString
     * @public
     * @return output. Typ: String.
     **/
    p.dataString = function () {
        var output = "";
        var map = this.get();
        //log ( map );
        $.each(map, function (key, value) {
            output += " ::: " + key + " := " + value + "\n";
        });
        return output;
    };

    /**
     * Wann war der letzte Besuch des Users
     * @static
     * @public
     * @property LAST_VISIT
     * @constant
     */
    Cookie.LAST_VISIT = "lastvisitedDate";

	/**
     * aktulles Besuchsdatum
     * @static
     * @public
     * @property DATE
     * @constant
     */
    Cookie.DATE = "currentDate";

    /**
     * Plugin das zu letzt benutzt wurde
     * Umbenannt in "lastUsedPlug-in" wegen Umstellung auf HTML5 first #18898(Redmine ARD)
     * @static
     * @public
     * @property PLUGIN
     * @constant
     */
    Cookie.PLUGIN = "lastUsedPlug-in";

    /**
     * Volume-Wert der zur Laufzeit geändert wurde
     * @static
     * @public
     * @property VOLUME_VALUE
     * @constant
     */
    Cookie.VOLUME_VALUE = "changedVolumeValue";

    /**
     * Mute-Flag, das zur Laufzeit geändert wurde
     * @static
     * @public
     * @property VOLUME_MUTE
     * @constant
     */
    Cookie.VOLUME_MUTE = "changedMuteValue";

    /**
     * Subtitle-Flag, das zur Laufzeit geändert wurde
     * @static
     * @public
     * @property SUBTITLE_ENABLED
     * @constant
     */
    Cookie.SUBTITLE_ENABLED = "changeSubtitleValue";

    /**
     * Konstante für die zuletzt genutzte Qualität
     * @static
     * @public
     * @property QUALITY
     * @constant
     */
    Cookie.QUALITY = "lastUsedQuality";

    /**
     * Konstante für zuletzt verwendeten HLS.js Level Index
     * @static
     * @public
     * @property QUALITY
     * @constant
     */
    Cookie.HLS_LEVEL = "lastHlsLevel";

    /**
     * Flag das angibt, ob der ARD Player im Debug-Modus läuft.
     * @static
     * @public
     * @property DEBUG
     * @constant
     */
    Cookie.DEBUG = "debug";

    ns.Cookie = Cookie;

})(ardplayer, ardplayer.jq, ardplayer.console);
