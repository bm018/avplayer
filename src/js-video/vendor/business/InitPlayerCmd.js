/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Saban Uenlue
 * @module business
 **/

(function (ns, $, console) {
    "use strict";
    /**
     * Diese Klasse prüft welcher Player laufen müsste und startet diesesn
     * @class InitPlayerCmd
     * @param player Player
     * @constructor
     * @public
     **/
    var InitPlayerCmd = function (player, pForcedPluginId) {
        this.initialize(player, pForcedPluginId);
    };

    var p = InitPlayerCmd.prototype;

    //var callback, pl, pc , mc , q , g, vc;

    /**
     * Initialization method.
     * @method initialize
     * @param player
     * @private
     **/
    p.initialize = function (player, pForcedPluginId) {

        /**
         * PlayerConfiguration des zugewiesenen Models.
         * @property pc
         * @type PlayerConfiguration
         */
        this.pc = player.model.playerConfig;
        /**
         * MediaCollection des zugewiesenen Models des wiederrum zugewiesenen Players.
         * @property mc
         * @type MediaCollection
         */
        this.mc = player.model.mediaCollection;
        /**
         * GlobalModel für das gesamte Projekt
         * @property h
         * @type GlobalModel
         */
        this.g = ns.GlobalModel.getInstance();
        /**
         * @inheritDoc
         */
        this.q = this.g.startParams;
        /**
         * Player der als Parameter übergeben wurde
         * @property player
         * @type Player
         */
        this.pl = player;
        /**
         * ViewController des zugewiesenen Players.
         * @property mc
         * @type ViewController
         */
        this.vc = this.pl.viewCtrl;

        // Ggf. erzwungenes Plugin, das verwendet wird.
        this.forcedPluginId = pForcedPluginId;
    };


    /**
     * Methode eruiert die PlugIn ID die verwendet werden muss!
     * @methode detectPluginToUse
     * @public
     * @return id
     */
    p.detectPluginToUse = function () {
        // Falls ein Plugin erzwungen wird, dieses direkt zurückgeben.
        if (this.forcedPluginId >= 0)
            return this.forcedPluginId;

        // Gewünschte PlugInReihenfolge
        var requestedPlugInSort = this.mc.getSortierung();

        // welches PlugIn wurde das letzte mal benutzt
        var lastUsedPlugin = this.g.getPluginID(true);

        // das PlugIn mit dem die Initialisierung fortgesetzt werden soll!
        var usePlugIn = lastUsedPlugin;
        var that = this;
        var getBestPlugIn = function () {
            var best = -1;
            for (var i = 0; i < requestedPlugInSort.length; i++) {
                var curRequestedPlugin = requestedPlugInSort[i];
                if ($.inArray(curRequestedPlugin, that.g.supportedPlugIns) != -1) {
                    best = curRequestedPlugin;
                    break;
                }
            }

            return best;
        };

        // überprüfe ob das letzt verwende PlugIn auch in der gewünschten PLugIn Order drin ist!
        if ($.inArray(lastUsedPlugin, requestedPlugInSort) != -1) {
            // letzte verwendetets PlugIn gehört zu den geforderten
            // jetzt nur noch erneut prüfen, ob das PlugIn auf dem System noch zur Verfügung steht!
            if ($.inArray(lastUsedPlugin, this.g.supportedPlugIns) != -1) {

                usePlugIn = lastUsedPlugin;

                // Abfang von Fehlerhaften Konfigurationen
                // Ist das Sortierarray falsch gesetzt, kann es vorkommen,
                // das nicht das richtige Plugin ermittelt wurde.
                // #1959
                var canAccessLastPlugin = false;
                try {
                    if ( this.mc.getMediaArray()[usePlugIn] !== false )
                    {
                        canAccessLastPlugin = true;
                    }
                } catch ( Exception )
                {
                }

                if ( !canAccessLastPlugin )
                {
                    usePlugIn = getBestPlugIn();
                }

            }
            else
            // ansonsten schaue welches Plugin gehen könnte
            {
                usePlugIn = getBestPlugIn();
            }
        }
        else {
            // letzte verwendetets PlugIn gehört nicht zu den geforderten
            // schaue welches Plugin gehen könnte
            usePlugIn = getBestPlugIn();
        }

        return usePlugIn;
    };

    /**
     * Diese Methode löste das Command aus.
     * @methode execute
     * @public
     */
    p.execute = function () {
        var that = this;
        var usePlugIn = this.detectPluginToUse();


        $.each(arguments, function (key, value) {
            if (typeof value === "function") {
                that.callback = value;
            }
        });

        // Ohne Plugin können wir nicht arbeiten
        if (usePlugIn == -1) {
            if (that.callback && typeof that.callback == "function")
                that.callback(null, usePlugIn);
            return;
        }

        switch (usePlugIn) {

            case ns.GlobalModel.FLASH:
                var that = this;
                new ns.GenerateFlashPluginCmd().execute(this.pl, function (mediaCanvas) {
                    if (that.callback && typeof that.callback == "function")
                        that.callback(mediaCanvas, usePlugIn);
                });
                break;

            case ns.GlobalModel.HTML5:
                if (this.mc.getType() === ns.MediaCollection.TYPE_AUDIO) {
                    var that = this;
                    new ns.GeneratHTMLAudioCmd().execute(this.pl, function (mediaCanvas) {
                        //console.warn("mediaCanvas 4 audio Successfull generated");
                        if (that.callback && typeof that.callback == "function")
                            that.callback(mediaCanvas, usePlugIn);
                    });
                }
                else if (this.mc.getType() === ns.MediaCollection.TYPE_VIDEO) {
                    var that = this;
                    new ns.GeneratHTMLVideoCmd().execute(this.pl, function (mediaCanvas) {
                        if (that.callback && typeof that.callback == "function")
                            that.callback(mediaCanvas, usePlugIn);
                    });
                }
                else {
                    this.pl.errorCtrl.throwError(ns.ErrorController.UNKOWN_TYPE_FOR_HTML, ns.ErrorController.IS_CRITICAL_YES, this.mc.getType());
                }
                break;

            default:
                that.callback(null, usePlugIn);
                this.pl.errorCtrl.throwError(ns.ErrorController.NO_PLUGIN_SUPPORTED, ns.ErrorController.IS_CRITICAL_YES);
                break;

        }
    };

    ns.InitPlayerCmd = InitPlayerCmd;

})(ardplayer, ardplayer.jq, ardplayer.console);