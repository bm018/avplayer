/**
 * PlaylistItem Value Object
 *
 * (c) 2015 - netTrek GmbH & Co. kG
 */
(function (ns, $, console) {
    "use strict";

    var PlaylistItem = function (pc, mc, isPreRoll) {
        this._pc = pc;
        this._mc = mc;
        this._preroll = isPreRoll;
    };

    ns.PlaylistItem = PlaylistItem;

})(ardplayer, ardplayer.jq, ardplayer.console);
