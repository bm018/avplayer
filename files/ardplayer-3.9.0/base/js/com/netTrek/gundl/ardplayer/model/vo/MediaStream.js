/**
 * Class MediaStream
 *
 * Repräsentiert ein MediaStream-Objekt.
 * Diese Klasse enthält Stream-Informationen!
 *
 * Der Unterstrich wird verwendet, um Klassen, Attribute und Methoden als privat durch Namenskonvention zu erklären.
 *
 * Created:        2009_09-25
 * Modified:    2010_09-29
 *
 * @version 0.2
 * @author Jan Voelker
 * @copyright ARD.de
 * @module vo
 */

(function (ns, $, console) {
    "use strict";
    /**
     * Diese Klasse enthält Stream-Informationen!
     * @class MediaStream
     * @public
     * @constructor
     * @param quality. Typ: int - Qualitäts-Index | 0 - s, 1 - m, 2 - l or 3 - xl
     * @param server Typ: string - host param für ein RTMP Streams
     * @param stream Typ: String. (Definition) für ein RTMP-Streams oder URLs zu einem HTML5 Clip
     * @param cdn Type String. Definiert den CDN Namen zurück. Standardwert ist default.
     * @param label {string} Kurzbeschreibung der Qualität, zB "hohe"
     * @param description {string} Langbeschreibung der Qualität, zB "Hohe Qualität"
     * @return void
     **/
    var MediaStream = function (quality, server, stream, cdn, label, description) {
        this.initialize(quality, server, stream, cdn, label, description);
    };

    var p = MediaStream.prototype;

	/**
     * Wird vom Konstruktor ausgelöst werden
     * @method initialize
     * @private
     * @param quality. Typ: int - Qualitäts-Index | 0 - s, 1 - m, 2 - l or 3 - xl
     * @param server Typ: string - host param für ein RTMP Streams
     * @param stream Typ: String. (Definition) für ein RTMP-Streams oder URLs zu einem HTML5 Clip
     * @param cdn Type String. Definiert den CDN Namen zurück. Standardwert ist default.
     * @return void
     */
    p.initialize = function (quality, server, stream, cdn, label, description) {
        /**
         * Qualitäts-Index - Qualitäts-Index | 0 - s, 1 - m, 2 - l or 3 - xl
         * @property _quality
         * @private
         * @type int
         **/
        this._quality = quality;

        /**
         * host von einem RTMP Stream
         * @property _server
         * @private
         * @type string
         **/
        this._server = server;

        /**
         * streamname. (Definition) für ein RTMP-Streams oder URLs zu einem HTML5 Clip
         * @property _server
         * @private
         * @type string
         **/
        this._stream = stream;

        /**
         * Kurzbezeichnung der Qualitätsstufe. Falls nicht definiert, wird auf ein Standardwert zurückgegriffen.
         * @type {string}
         * @private
         */
        this._label = label || "";

        /**
         * Beschreibung der Qualitätsstufe. Falls nicht definiert, wird auf ein Standardwert zurückgegriffen.
         * @type {string}
         * @private
         */
        this._description = description || "";


        //console.info ( cdn );
        this.setCDN(cdn);
    };

    /**
     * Gibt das Label dieser Qualität zurück. Falls nicht definiert, wird versucht auf einen Standardwert
     * zurückzufallen
     *
     * @returns {string}
     */
    p.getLabel = function () {
        if ($.isBlank(this._label)) {
            switch (this._quality) {
                case 4:
                case "4":
                    this._label = "Full HD";
                    break;
                case 3:
                case "3":
                    this._label = "sehr hohe";
                    break;
                case 2:
                case "2":
                    this._label = "hohe";
                    break;
                case 1:
                case "1":
                    this._label = "mittlere";
                    break;
                case 0:
                case "0":
                    this._label = "niedrige";
                    break;
                case "auto":
                    this._label = "automatische";
                    break;

                default:
                    this._label = "Unbekannt (" + this._quality + ")";
                    break;
            }
        }

        return this._label;
    };

    /**
     * Gibt das Ausfühliche Label dieser Qualität zurück. Falls nicht definiert, wird versucht auf einen Standardwert
     * zurückzufallen. Dieser Wert kommt u.a. bei Mouse-Over Texten zum Einsatz.
     *
     * @returns {string}
     */
    p.getDescription = function () {
        if ($.isBlank(this._description)) {
            switch (this._quality) {
                case 4:
                case "4":
                    this._description = "Full HD";
                    break;
                case 3:
                case "3":
                    this._description = "Sehr hohe Qualität";
                    break;
                case 2:
                case "2":
                    this._description = "Hohe Qualität";
                    break;
                case 1:
                case "1":
                    this._description = "Mittlere Qualität";
                    break;
                case 0:
                case "0":
                    this._description = "Niedrige Qualität";
                    break;
                case "auto":
                    this._description = "Automatische Qualität";
                    break;

                default:
                    this._description = "Unbekannt (" + this._quality + ")";
                    break;
            }
        }

        return this._description;
    };

    /**
     * Gibt den Type des verwendeten CDNs zurück
     * @public
     * @method getCDN
     * @return string
     */
    p.getCDN = function () {
        return $.isBlank(this._cdn) ? "default" : this._cdn;
    };

	/**
     * Gibt den Type des verwendeten CDNs zurück
     * @public
     * @method getCDN
     * @param cdn Type String. Definiert den CDN Namen zurück. Standardwert ist default.
     */
    p.setCDN = function (cdn) {
        if ($.isBlank(cdn))
            this._cdn = "default";
        else
            this._cdn = cdn;
    };

    /**
     * Getter für die MediaStream-Qualität
     * @method getQuality
     * @public
     * @return int - Qualitäts-Index | 0 - s, 1 - m, 2 - l or 3 - xl
     */
    p.getQuality = function () {
        return this._quality;
    };

    /**
     * Getter für ein mediaStream rtmp host
     * @method getServer
     * @public
     * @return string
     */
    p.getServer = function () {
            return this._server;
        };

	/**
     * Getter für ein streamname. (Definition) für ein RTMP-Streams oder URLs zu einem HTML5 Clip
     * @method getStream
     * @public
     * @return string
     */
    p.getStream = function () {
        return this._stream;
    };

    ns.MediaStream = MediaStream;
})(ardplayer, ardplayer.jq, ardplayer.console);
