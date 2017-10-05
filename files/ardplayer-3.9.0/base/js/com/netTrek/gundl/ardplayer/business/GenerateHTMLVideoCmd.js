/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Saban Uenlue
 * @module business
 **/

(function (ns, $, console) {
    "use strict";
    /**
     * Diese Klasse generiert das HTML-Video-Objekt und fügt es als Knoten in das Dokument hinzu.
     * @class GeneratHTMLVideoCmd
     * @constructor
     * @public
     **/
    var GeneratHTMLVideoCmd = function () {
        this.initialize();
    };

	GeneratHTMLVideoCmd.solaLibComplete = false;
	GeneratHTMLVideoCmd.solaLoadCallbacks = [];

    var p = GeneratHTMLVideoCmd.prototype;

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
    p.execute = function (player) {
		var that = this;

        if (player && player instanceof ns.Player) {
            $.each(arguments, function (key, value) {
                if (typeof value === "function") {
                    that.callback = value;
                }
            });

			this._player = player;


            var sola = player.solaConfiguration;
            if (sola != null && player.model.playerConfig.getSolaAnalyticsEnabled()) {

                if (sola.beacon) {
                    window.AKAMAI_MEDIA_ANALYTICS_CONFIG_FILE_PATH = sola.beacon;
                }

                if (sola.jslib && !GeneratHTMLVideoCmd.solaLibComplete ) {

					if ( GeneratHTMLVideoCmd.solaLoadCallbacks.length == 0 )
					{
						// Load sola
						$.getScript(sola.jslib)
							.done(ns.Delegate.create(that, that._getScriptSuccess))
							.fail(ns.Delegate.create(that, that._getScriptFail));
					}

					GeneratHTMLVideoCmd.solaLoadCallbacks.push(
						ns.Delegate.create(this, this._addHTML5Video)
					);

                } else {
					that._addHTML5Video()
                }

            } else {
				that._addHTML5Video()
            }
        }
    };

	p._getScriptSuccess = function (script, textStatus) {
		GeneratHTMLVideoCmd.solaLibComplete = true;

		var curCallback = null;
		while (GeneratHTMLVideoCmd.solaLoadCallbacks.length > 0) {
			curCallback = GeneratHTMLVideoCmd.solaLoadCallbacks.shift();
			if (curCallback) {
				curCallback();
			}
		}
	};

	p._getScriptFail = function (jqxhr, settings, exception) {
		var curCallback = null;
		while (GeneratHTMLVideoCmd.solaLoadCallbacks.length > 0) {
			curCallback = GeneratHTMLVideoCmd.solaLoadCallbacks.shift();
			if (curCallback) {
				curCallback();
			}
		}
	};

    /**
     * Hier wird der Objekt-knoten erstellt und auf die Bühne gelegt.
     * @methode _addHTML5Video
     * @private
     * @param vc. ViewController. Instanz des für den Player erstellten ViewControllers
     */
	p._addHTML5Video = function () {
		var vc = this._player.viewCtrl;
        if (vc.getMediaCanvas()) {
            try {
                vc.getMediaCanvas().remove();
            } catch (Exception) {
            }
        }

        var mediaCanvas = $(new ns.Html5MEFactory().createVideo(this._player));
        mediaCanvas.attr("preload", "auto")
            .attr("class", "mediaCanvas")
            .attr("autoplay", "autoplay")
            .appendTo(vc.viewport);
        mediaCanvas.nodeName = "video";

        if ( window.setAkamaiMediaAnalyticsData != undefined )
        {
            var sola = vc.player.solaConfiguration;

            if ( sola.metadata )
            {
                $.each(sola.metadata, function (name,value) {
                    window.setAkamaiMediaAnalyticsData(name, value, mediaCanvas[0]);
                });
            }
        }

		// Rechtsklick deaktivieren
		mediaCanvas.on('contextmenu', function(e){return false;});
		if ( mediaCanvas[0].oncontextmenu )
			mediaCanvas[0].oncontextmenu = function () {return false;};

		if (this.callback && typeof this.callback === "function")
            this.callback(mediaCanvas);
    };

    ns.GeneratHTMLVideoCmd = GeneratHTMLVideoCmd;

})(ardplayer, ardplayer.jq, ardplayer.console);