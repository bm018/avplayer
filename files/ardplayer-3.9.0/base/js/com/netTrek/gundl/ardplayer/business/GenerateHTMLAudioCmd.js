/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Florian Diesner
 * @module business
 **/

(function (ns, $, console) {
    "use strict";
    /**
     * Diese Klasse generiert das HTML-Audio-Objekt und fügt es als Knoten in das Dokument hinzu.
     * @class GeneratHTMLAudioCmd
     * @constructor
     * @public
     **/
    var GeneratHTMLAudioCmd = function () {
        this.initialize();
    };

    var p = GeneratHTMLAudioCmd.prototype;

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

            this._addHTML5Audio(player.viewCtrl)
        }
    };

    /**
     * Hier wird der Objekt-knoten erstellt und auf die Bühne gelegt.
     * @methode _addHTML5Audio
     * @private
     * @param vc. ViewController. Instanz des für den Player erstellten ViewControllers
     */
	p._addHTML5Audio = function(vc) {
        if (vc.getMediaCanvas()) {
            try {
                vc.getMediaCanvas().remove();
            } catch ( Exception ) {
            }
        }

        var mediaCanvas = $('<audio preload="auto" class="mediaCanvas"></audio>')
            .appendTo(vc.viewport);
        mediaCanvas.nodeName = "audio";

		// Rechtsklick deaktivieren
		mediaCanvas.on('contextmenu', function(e){return false;});
		if ( mediaCanvas[0].oncontextmenu )
			mediaCanvas[0].oncontextmenu = function () {return false;};

        if (this.callback && typeof this.callback === "function")
			this.callback(mediaCanvas);
    };

    ns.GeneratHTMLAudioCmd = GeneratHTMLAudioCmd;

})(ardplayer, ardplayer.jq, ardplayer.console);
