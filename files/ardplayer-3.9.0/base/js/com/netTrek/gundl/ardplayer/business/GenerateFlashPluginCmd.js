/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Florian Diesner
 * @module business
 **/

(function (ns, $, console) {
    "use strict";
    /**
     * Diese Klasse generiert das Flash-Video-Objekt und fügt es als Knoten in das Dokument hinzu.
     * @class GenerateFlashPluginCmd
     * @constructor
     * @public
     **/
    var GenerateFlashPluginCmd = function () {
        this.initialize();
    };

    var p = GenerateFlashPluginCmd.prototype;

    /**
     * Initialization method.
     * @method initialize
     * @protected
     **/
    p.initialize = function () {
    };

    /**
     * Diese Methode löste das Command aus.
     * @methode execute
     * @public
     * @param player. Player.
     * @param callback Typ: function. - Eventhandler dass im Anschluss aufgerufen werden soll
     */
    p.execute = function (player, callback) {
        if (player && player instanceof ns.Player) {
            var that = this;
            $.each(arguments, function (key, value) {
                if (typeof value == "function") {
                    that.__callback = value;
                }
            });

            this._addFlashObject(player.viewCtrl);
        }
    };

    /**
     * Hier wird der Objekt-knoten erstellt und auf die Bühne gelegt.
     * @methode _addFlashObject
     * @private
     * @param vc. ViewController. Instanz des für den Player erstellten ViewControllers
     */
    p._addFlashObject = function (vc) {

        if (vc.getMediaCanvas()) {
            try {
                vc.getMediaCanvas().remove();
            } catch ( Exception ) {
            }
        }

        // Flash-DIV erstellen
        var playerID = vc.player.getId();
        var flashContentID = "flashContent" + playerID;

        var mediaCanvas = $('<div id="' + flashContentID + '"></div>').appendTo(vc.viewport);
        this.mediaCanvasObject = mediaCanvas;

        var that = this;

        if (that.__callback && typeof that.__callback === "function")
            that.__callback(this);
    };

    p.actualEmbedd = function (vc, pc) {
        this._createSWFObject(vc, pc);
    };

    /**
     * Hier wird der Objekt-knoten erstellt und auf die Bühne gelegt.
     * @methode _addFlashObject
     * @private
     * @param vc. ViewController. Instanz des für den Player erstellten ViewControllers
     */
    p._createSWFObject = function (vc, playerCtrl) {

        var pc = vc.player.model.playerConfig;
        var mc = vc.player.model.mediaCollection;

        // Flash-DIV erstellen
        var playerID = vc.player.getId();
        var flashContentID = "flashContent" + playerID;

        var baseUrl = pc.getBaseUrl();
        var swfVersionStr = "10.2.0";
        var xiSwfUrlStr = baseUrl + "base/flash/playerProductInstall.swf";
        var mainPath = baseUrl + "base/flash/PluginFlash.swf";

        var maxEmbedRetries = 15, // 15x 200ms = 3s
            embedRetryTime = 200; // 200ms

        // Zeige Buffering während der Einbettung
        vc.showBufferingIndicator();

        function lookForFlashInterface(event) {
            if (event.ref && typeof event.ref['loadStreamObject'] != "function") {

                if (--maxEmbedRetries > 0) {
                    setTimeout(function () {
                        lookForFlashInterface(event);
                    }.bind(this), embedRetryTime);
                } else {

                    // Flash wird blockiert.
                    ns.GlobalModel.getInstance().isFlashSupported = false;

                    // Alle Qualitäten löschen, kein erneuter Versuch mit Flash.
                    vc.representationQualityOrder.splice(0, vc.representationQualityOrder.length);

                    var errorCtrl = ns.ErrorController.getInstance(vc.player);
                    errorCtrl.throwStreamError(ns.ErrorController.ERROR_PLAYBACK);
                }
            }
        }

        /**
         * Callback von SWFObject, dass die SWF erfolgreich initialisiert wurde.
         * @methode embedCallback
         * @private
         * @param event SWF-Object Embed Event
         */
        function embedCallback(event) {
            if (event && event.success) {

                playerCtrl.flashPlayerInstance = event.ref;
                vc.registerMediaCanvas($(event.ref));

                lookForFlashInterface(event);

            } else {
                var errorCtrl = ns.ErrorController.getInstance(vc.player);
                errorCtrl.throwError(ns.ErrorController.ERROR_DURING_EMBED_FLASH, ns.ErrorController.IS_CRITICAL_YES);
            }
        }


        swfobject.embedSWF(
            mainPath,
            flashContentID,
            1, //pc.getWidth(0),
            1, //pc.getHeight(0),
            swfVersionStr,
            xiSwfUrlStr,
            getFlashVars(
                playerID,
                mc.getType(),
                mc.getSubtitleUrl(),
                baseUrl,
                vc.player.getUniquePlayerId(),
                mc.getUsedCDNList(),
                vc.player.solaConfiguration
            ),
            getParams(),
            getAttributes(flashContentID),
            embedCallback
        );
    };


    function getFlashVars(objectId, mediaType, subtitleUrl, baseUrl, uniqueId, usedCDNPlugins, solaConfiguration) {
        var flashvars = {};
        flashvars.id = objectId;

        flashvars.baseUrl = baseUrl;

        // Pfad zur Flash-CDN Konfiguration
        flashvars.configPath = baseUrl + "base/flash/conf/config.xml";

        // Eindeutige PlayerId
        flashvars.uniqueId = uniqueId;

        // Player-Version
        flashvars.version = ns.GlobalModel.VERSION;

        // Verwendete CDN-Plugins
        flashvars.cdns = usedCDNPlugins;

        // SOLA Analytics
	    //todo remove escape this is deprecated
        flashvars.sola = escape(JSON.stringify(solaConfiguration));

        // Keine Hardwarebeschleunigung
        flashvars.useStageVideo = false;
        // Pfad zur Untertitel-Datei
        if (!$.isBlank(subtitleUrl)) {
            // #1447 - Audiodatei darf keine Untertitel haben, ansonsten gibt es ein Fehlverhalten
            // beim Unteritelplugin.
            if (mediaType != ns.MediaCollection.TYPE_AUDIO)
                flashvars.subtitlePath = subtitleUrl;
        }

        // Aktivierung der Flash-Plugin Cookie Speicherung, die
        // sich die zuletzt verwendete Bandbreite in kbps sichert.
        // Dieser wird bei Wiedereintritt - falls vorhanden - automatisch
        // als Startindex ermittelt.
        flashvars.useCookieMBRSwitching = false;

        // Debug Modus für den Flashfilm aktivieren
        flashvars.debug = false;
        return flashvars;
    }

    /**
     * Erstellt und gibt die Params fürdas Flash-Player-Objects zurück.
     * @method getParams
     * @private
     * @return {Object}
     */
    function getParams() {
        var params = {};
        params.quality = "high";
        params.bgcolor = "#000000";
        params.allowscriptaccess = "sameDomain";
        params.allowfullscreen = "false";
        params.wmode = "opaque";
        return params;
    };

    /**
     * Erstellt und gibt die Attribute zurück, mit Angabe des jeweiligen Flash-Player-Objekts
     * @method getAttributes
     * @private
     * @param objectId
     * @return {Object}
     */
    function getAttributes(objectId) {
        var attributes = {};
        attributes.name = attributes.id = objectId;
        attributes.align = "middle";
        return attributes;
    };

    ns.GenerateFlashPluginCmd = GenerateFlashPluginCmd;

})(ardplayer, ardplayer.jq, ardplayer.console);
