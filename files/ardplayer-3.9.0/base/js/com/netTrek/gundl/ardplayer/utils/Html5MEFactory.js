/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Florian Diesner
 * @module business
 **/

(function (ns, $, console) {
    "use strict";

    /**
     * Html5MEFactory
     * Erzeugt Instanzen von HTML5 Media-Elementen.
     * @class Html5MEFactory
     * @constructor
     * @public
     **/
    var Html5MEFactory = function () {

        if (Html5MEFactory.prototype._singletonInstance) {
            return Html5MEFactory.prototype._singletonInstance;
        }

        Html5MEFactory.prototype._singletonInstance = this;

        // private
        var _htmlMECache = {};

        this.createVideo = function (player) {
            return this.createMediaElement("video", player);
        };

        this.createAudio = function (player) {
            return this.createMediaElement("audio", player);
        };

        this.disposePlayer = function (player) {
            delete _htmlMECache[player.getId() + "_video"];
            delete _htmlMECache[player.getId() + "_audio"];
        };

        this.createMediaElement = function (nodeName, player) {
            var cachedNode = _htmlMECache[player.getId() + "_" + nodeName];
            if (cachedNode)
                return cachedNode;

            var mediaElement = document.createElement(nodeName);
            mediaElement.setAttribute("data-uuid", $.randomUUID());
            _htmlMECache[player.getId() + "_" + nodeName] = mediaElement;

            return mediaElement;
        }

    };

    ns.Html5MEFactory = Html5MEFactory;

})(ardplayer, ardplayer.jq, ardplayer.console);