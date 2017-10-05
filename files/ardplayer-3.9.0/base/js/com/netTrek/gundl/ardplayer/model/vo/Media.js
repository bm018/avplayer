/**
 * Class Media
 *
 * Repräsentiert ein Media-Objekt mit mehreren mediaStream-Objekten.
 * Ein Media kann durch die PluginDetection-Klasse aktiviert werden.
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
     * Klassenkonstruktor
     * @public
     * @method
     * @param plugin string Plugin 0 - flash, 1 - html5, 2 - windows media
     * @return Media
     */
    var Media = function (plugin) {
        this.initialize(plugin);
    };

    var p = Media.prototype;

    /**
     * Initialisierungsmethode, wird vom Konstruktor aufgerufen.
     * @method initialize
     * @protected
     * @param plugin string Plugin 0 - flash, 1 - html5, 2 - windows media
     * @return void.
     */
    p.initialize = function (plugin) {
        this._plugin = plugin;
        // _mediaSteamArray holds the streams in different qualities
        this._mediaStreamArray = new Array(false, false, false, false);
    };

    /**
     * Fügt ein MediaStream-objekt zu dem Media-Objekt hinzu
     * @public
     * @method addMediaStream
     * @param mediaStream. Typ: MediaStream.
     * @return void
     */
    p.addMediaStream = function (mediaStream) {
        this._mediaStreamArray[mediaStream.getQuality()] = mediaStream;
    };

    /**
     * Getter für ein MediaStreamArray
     * @public
     * @method getMediaStreamArray
     * @return MediaStreamArray
     */
    p.getMediaStreamArray = function () {
        return this._mediaStreamArray;
    };

    ns.Media = Media;

})(ardplayer, ardplayer.jq, ardplayer.console);