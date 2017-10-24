/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Saban Uenlue
 * @module model
 **/

(function (ns, $, console) {
    "use strict";
    /**
     * This Class is
     * @class VideoSources
     * @constructor
     **/
    var VideoSources = function () {
        this.initialize();

        this.s = undefined;
        this.m = undefined;
        this.l = undefined;
        this.xl = undefined;

    };

    var p = VideoSources.prototype;

    /**
     * Initialization method.
     * @method initialize
     * @protected
     **/
    p.initialize = function () {
    };

    ns.VideoSources = VideoSources;

})(ardplayer, ardplayer.jq, ardplayer.console);
